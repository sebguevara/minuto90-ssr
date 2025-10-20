import { env } from '@/lib/env'
import { cacheRepository } from './cacheRepository'

const LOGO_BASE_URL = env.NEXT_PUBLIC_LOGO_BASE_URL
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY
const CHUNK_SIZE = 850
const RATE_LIMIT_MS = 1100

const rateLimiter = new (class RateLimiter {
  private lastCall = 0
  private readonly minInterval: number = RATE_LIMIT_MS

  async throttle(): Promise<void> {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCall
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
    this.lastCall = Date.now()
  }
})()

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

const fetchLogosFromApi = async (
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> => {
  const logoMap = new Map<string, string>()
  if (ids.length === 0) return logoMap

  const chunks = chunkArray(ids, CHUNK_SIZE)

  for (const chunk of chunks) {
    await rateLimiter.throttle()
    const url = `${LOGO_BASE_URL}/soccer/${entityType}?k=${API_KEY}&ids=${chunk.join(',')}`
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) {
        console.error(
          `[API Fetch Error] La respuesta para '${entityType}' no fue OK: ${response.status} ${response.statusText} | URL: ${url}`
        )
        continue
      }
      const logos: { id: string; base64: string }[] = await response.json()
      logos.forEach((logo) => {
        logoMap.set(logo.id, `data:image/png;base64,${logo.base64}`)
      })
    } catch (error) {
      console.error(`[API Fetch Error] Falló el fetch para '${entityType}'`, error)
    }
  }
  return logoMap
}

const getLogosWithCache = async (
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> => {
  const uniqueIds = [...new Set(ids.filter((id) => id))]
  if (uniqueIds.length === 0) return new Map()

  const logoMap = new Map<string, string>()
  const cacheKeys = uniqueIds.map((id) => `logo:${entityType}:${id}`)

  const cachedResults = await cacheRepository.getMany<string>(cacheKeys)

  const missingIds: string[] = []
  cachedResults.forEach((result, index) => {
    if (result) {
      logoMap.set(uniqueIds[index], result)
    } else {
      missingIds.push(uniqueIds[index])
    }
  })

  if (missingIds.length > 0) {
    const fetchedLogos = await fetchLogosFromApi(entityType, missingIds)
    if (fetchedLogos.size > 0) {
      const cachePayload: Record<string, string> = {}
      fetchedLogos.forEach((logo, id) => {
        logoMap.set(id, logo)
        cachePayload[`logo:${entityType}:${id}`] = logo
      })
      await cacheRepository.setMany(cachePayload, 604800)
    }
  }

  return logoMap
}

export const logoRepository = {
  async getLogos(
    teamIds: string[],
    leagueIds: string[]
  ): Promise<{ teams: Map<string, string>; leagues: Map<string, string> }> {
    const [teams, leagues] = await Promise.all([
      getLogosWithCache('teams', teamIds),
      getLogosWithCache('leagues', leagueIds),
    ])
    return { teams, leagues }
  },
}
