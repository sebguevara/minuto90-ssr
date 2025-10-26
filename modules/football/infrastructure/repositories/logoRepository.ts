import { env } from '@/lib/env'
import { cacheRepository } from './cacheRepository'

const LOGO_BASE_URL = 'http://data2.goalserve.com:8084/api/v1/logotips'
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY

const CHUNK_SIZE = 450
const RATE_LIMIT_MS = 1000
const MAX_RETRIES = 5
const RETRY_DELAY_MS = 3500

class RateLimiter {
  private lastCall = 0
  private readonly minInterval: number

  constructor(intervalMs: number) {
    this.minInterval = intervalMs
  }

  async throttle(): Promise<void> {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCall

    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall
      console.log(`[Rate Limiter] ⏳ Esperando ${waitTime}ms...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    this.lastCall = Date.now()
  }
}

const rateLimiter = new RateLimiter(RATE_LIMIT_MS)

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

async function fetchLogoChunk(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const logoMap = new Map<string, string>()
  if (ids.length === 0) return logoMap

  const url = `${LOGO_BASE_URL}/soccer/${entityType}?k=${API_KEY}&ids=${ids.join(',')}`
  console.log(`[Logo Fetch] 🚚 Solicitando logos para ${entityType}: ${ids.join(',')}`)

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await rateLimiter.throttle()
    try {
      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) {
        console.log('response', response)

        throw new Error(
          `La respuesta para '${entityType}' no fue OK: ${response.status} ${response.statusText}`
        )
      }

      const logos: { id: string; base64: string }[] = await response.json()

      if (!Array.isArray(logos) || logos.length === 0) {
        throw new Error(`No se recibieron logos para ${entityType} con IDs: ${ids.join(',')}`)
      }

      logos.forEach((logo) => {
        if (logo.id && logo.base64) {
          const base64Url = `data:image/png;base64,${logo.base64}`
          logoMap.set(logo.id, base64Url)
        }
      })

      console.log(`[Logo Fetch] ✅ Éxito en intento ${attempt} para ${entityType}`)
      return logoMap
    } catch (error) {
      console.error(`[Logo Fetch Error] Intento ${attempt} falló para ${entityType}:`, error)
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      }
    }
  }

  console.error(
    `[Logo Fetch Error] Fallaron todos los ${MAX_RETRIES} intentos para ${entityType} con IDs: ${ids.join(
      ','
    )}`
  )
  return logoMap
}

async function fetchAndCacheLogosInBackground(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<void> {
  if (ids.length === 0) return

  try {
    const chunks = chunkArray(ids, CHUNK_SIZE)
    for (const chunk of chunks) {
      const fetchedLogos = await fetchLogoChunk(entityType, chunk)
      const cachePromises = Array.from(fetchedLogos.entries()).map(([id, logo]) =>
        cacheRepository.set(`logo:${entityType}:${id}`, logo, { ttl: 604800 })
      )
      await Promise.all(cachePromises)
    }
  } catch (error) {
    console.error(
      `[Background Fetch Error] Falló la obtención y caché de logos para ${entityType}:`,
      error
    )
  }
}

async function getLogosForEntityType(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const logoMap = new Map<string, string>()
  const uniqueIds = [...new Set(ids.filter((id) => id))]
  if (uniqueIds.length === 0) return logoMap

  const cacheKeys = uniqueIds.map((id) => `logo:${entityType}:${id}`)
  const cachedLogos = await cacheRepository.getMany<string>(cacheKeys)

  const missingIds: string[] = []
  cachedLogos.forEach((logo, index) => {
    const id = uniqueIds[index]
    if (logo) {
      logoMap.set(id, logo)
    } else {
      missingIds.push(id)
    }
  })

  if (missingIds.length > 0) {
    fetchAndCacheLogosInBackground(entityType, missingIds)
  }

  return logoMap
}

export const logoRepository = {
  async getTeamLogos(teamIds: string[]): Promise<Map<string, string>> {
    return getLogosForEntityType('teams', teamIds)
  },

  async getLeagueLogos(leagueIds: string[]): Promise<Map<string, string>> {
    return getLogosForEntityType('leagues', leagueIds)
  },

  async getLogos(
    teamIds: string[],
    leagueIds: string[]
  ): Promise<{ teams: Map<string, string>; leagues: Map<string, string> }> {
    const [teams, leagues] = await Promise.all([
      this.getTeamLogos(teamIds),
      this.getLeagueLogos(leagueIds),
    ])
    return { teams, leagues }
  },
}
