import { env } from '@/lib/env'
import { cacheRepository } from './cacheRepository'

const LOGO_BASE_URL = env.NEXT_PUBLIC_LOGO_BASE_URL
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY

const CHUNK_SIZE = 500
const RATE_LIMIT_MS = 1100

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

/**
 * Dividir array en chunks
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Fetch logos de un chunk específico
 */
async function fetchLogoChunk(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const logoMap = new Map<string, string>()

  if (ids.length === 0) return logoMap

  // Rate limiting
  await rateLimiter.throttle()

  const url = `${LOGO_BASE_URL}/soccer/${entityType}?k=${API_KEY}&ids=${ids.join(',')}`

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return logoMap
    }

    const logos: { id: string; base64: string }[] = await response.json()

    logos.forEach((logo) => {
      const base64Url = `data:image/png;base64,${logo.base64}`
      logoMap.set(logo.id, base64Url)
    })
  } catch (error) {}

  return logoMap
}

/**
 * Fetch logos de múltiples chunks
 */
async function fetchLogosInChunks(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const chunks = chunkArray(ids, CHUNK_SIZE)
  const allLogos = new Map<string, string>()

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const chunkLogos = await fetchLogoChunk(entityType, chunk)

    // Merge results
    chunkLogos.forEach((logo, id) => allLogos.set(id, logo))
  }

  return allLogos
}

export const logoRepository = {
  /**
   * Obtener logos de equipos con caché
   */
  async getTeamLogos(teamIds: string[]): Promise<Map<string, string>> {
    const logoMap = new Map<string, string>()
    const uniqueIds = [...new Set(teamIds.filter((id) => id))]

    if (uniqueIds.length === 0) return logoMap

    // 1. Verificar caché para cada ID
    const cachedLogos = await Promise.all(
      uniqueIds.map(async (id) => {
        const cached = await cacheRepository.get<string>(`logo:team:${id}`)
        return { id, logo: cached }
      })
    )

    const missingIds: string[] = []
    cachedLogos.forEach(({ id, logo }) => {
      if (logo) {
        logoMap.set(id, logo)
      } else {
        missingIds.push(id)
      }
    })

    // 2. Fetch logos faltantes en chunks
    if (missingIds.length > 0) {
      const fetchedLogos = await fetchLogosInChunks('teams', missingIds)

      // 3. Guardar cada logo en caché (TTL: 7 días)
      const cachePromises = Array.from(fetchedLogos.entries()).map(([id, logo]) =>
        cacheRepository.set(`logo:team:${id}`, logo, { ttl: 604800 })
      )
      await Promise.all(cachePromises)

      // 4. Merge con logoMap
      fetchedLogos.forEach((logo, id) => logoMap.set(id, logo))
    }

    return logoMap
  },

  /**
   * Obtener logos de ligas con caché
   */
  async getLeagueLogos(leagueIds: string[]): Promise<Map<string, string>> {
    const logoMap = new Map<string, string>()
    const uniqueIds = [...new Set(leagueIds.filter((id) => id))]

    if (uniqueIds.length === 0) return logoMap

    // 1. Verificar caché
    const cachedLogos = await Promise.all(
      uniqueIds.map(async (id) => {
        const cached = await cacheRepository.get<string>(`logo:league:${id}`)
        return { id, logo: cached }
      })
    )

    const missingIds: string[] = []
    cachedLogos.forEach(({ id, logo }) => {
      if (logo) {
        logoMap.set(id, logo)
      } else {
        missingIds.push(id)
      }
    })

    // 2. Fetch logos faltantes en chunks
    if (missingIds.length > 0) {
      const fetchedLogos = await fetchLogosInChunks('leagues', missingIds)

      // 3. Guardar en caché (TTL: 7 días)
      const cachePromises = Array.from(fetchedLogos.entries()).map(([id, logo]) =>
        cacheRepository.set(`logo:league:${id}`, logo, { ttl: 604800 })
      )
      await Promise.all(cachePromises)

      // 4. Merge con logoMap
      fetchedLogos.forEach((logo, id) => logoMap.set(id, logo))
    }

    return logoMap
  },

  /**
   * Obtener logos de equipos Y ligas (secuencial por rate limiting)
   */
  async getLogos(
    teamIds: string[],
    leagueIds: string[]
  ): Promise<{ teams: Map<string, string>; leagues: Map<string, string> }> {
    const startTime = Date.now()

    // Primero ligas (menos IDs, más rápido)
    const leagues = await this.getLeagueLogos(leagueIds)

    // Luego equipos (puede tomar más tiempo)
    const teams = await this.getTeamLogos(teamIds)

    const elapsedTime = Date.now() - startTime

    return { teams, leagues }
  },

  /**
   * Limpiar caché de logos (útil para mantenimiento)
   */
  async clearCache(entityType?: 'teams' | 'leagues'): Promise<void> {},
}
