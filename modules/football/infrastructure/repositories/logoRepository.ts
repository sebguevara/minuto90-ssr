import { env } from '@/lib/env'
import { cacheRepository } from './cacheRepository'

const LOGO_BASE_URL = 'http://data2.goalserve.com:8084/api/v1/logotips'
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY

const CHUNK_SIZE = 250
const RATE_LIMIT_MS = 1000

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

  await rateLimiter.throttle()

  const url = `${LOGO_BASE_URL}/soccer/${entityType}?k=${API_KEY}&ids=${ids.join(',')}`
  console.log(`[Logo Fetch] 🚚 Solicitando logos para ${entityType}: ${url}`)

  try {
    const response = await fetch(url, { cache: 'no-store' })

    if (!response.ok) {
      console.error(
        `[API Fetch Error] La respuesta para '${entityType}' no fue OK: ${response.status} ${response.statusText} | URL: ${url}`
      )
      return logoMap
    }

    const logos: { id: string; base64: string }[] = await response.json()

    logos.forEach((logo) => {
      if (logo.id && logo.base64) {
        const base64Url = `data:image/png;base64,${logo.base64}`
        logoMap.set(logo.id, base64Url)
      }
    })
  } catch (error) {
    console.error(`[Logo Fetch Error] Falló la obtención de logos para ${entityType}:`, error)
  }

  return logoMap
}

async function fetchLogosInChunks(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const chunks = chunkArray(ids, CHUNK_SIZE)
  const allLogos = new Map<string, string>()

  for (const chunk of chunks) {
    const chunkLogos = await fetchLogoChunk(entityType, chunk)
    chunkLogos.forEach((logo, id) => allLogos.set(id, logo))
  }

  return allLogos
}

export const logoRepository = {
  async getTeamLogos(teamIds: string[]): Promise<Map<string, string>> {
    const logoMap = new Map<string, string>()
    const uniqueIds = [...new Set(teamIds.filter((id) => id))]
    if (uniqueIds.length === 0) return logoMap

    const cachedLogos = await Promise.all(
      uniqueIds.map(async (id) => ({
        id,
        logo: await cacheRepository.get<string>(`logo:team:${id}`),
      }))
    )

    const missingIds: string[] = []
    cachedLogos.forEach(({ id, logo }) => {
      if (logo) {
        logoMap.set(id, logo)
      } else {
        missingIds.push(id)
      }
    })

    if (missingIds.length > 0) {
      const fetchedLogos = await fetchLogosInChunks('teams', missingIds)
      const cachePromises = Array.from(fetchedLogos.entries()).map(
        ([id, logo]) => cacheRepository.set(`logo:team:${id}`, logo, { ttl: 604800 }) // 7 días de caché
      )
      await Promise.all(cachePromises)
      fetchedLogos.forEach((logo, id) => logoMap.set(id, logo))
    }

    return logoMap
  },

  async getLeagueLogos(leagueIds: string[]): Promise<Map<string, string>> {
    const logoMap = new Map<string, string>()
    const uniqueIds = [...new Set(leagueIds.filter((id) => id))]
    if (uniqueIds.length === 0) return logoMap

    const cachedLogos = await Promise.all(
      uniqueIds.map(async (id) => ({
        id,
        logo: await cacheRepository.get<string>(`logo:league:${id}`),
      }))
    )

    const missingIds: string[] = []
    cachedLogos.forEach(({ id, logo }) => {
      if (logo) {
        logoMap.set(id, logo)
      } else {
        missingIds.push(id)
      }
    })

    if (missingIds.length > 0) {
      const fetchedLogos = await fetchLogosInChunks('leagues', missingIds)
      const cachePromises = Array.from(fetchedLogos.entries()).map(
        ([id, logo]) => cacheRepository.set(`logo:league:${id}`, logo, { ttl: 604800 }) // 7 días
      )
      await Promise.all(cachePromises)
      fetchedLogos.forEach((logo, id) => logoMap.set(id, logo))
    }

    return logoMap
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
