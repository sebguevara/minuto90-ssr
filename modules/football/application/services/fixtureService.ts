import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { fixtureRepository } from '@/modules/football/infrastructure/repositories/fixtureRepository'
import { cacheRepository } from '@/modules/football/infrastructure/repositories/cacheRepository'

/**
 * Determinar TTL según tipo de datos
 */
function getTTL(dateParam: string): number {
  if (dateParam === 'live') return 10
  if (dateParam === 'home') return 60 // 1 minuto para hoy
  if (dateParam.startsWith('d-')) return 2 * 3600 // 2 horas para días pasados
  return 1800 // 30 minutos para otros casos
}

export const fixtureService = {
  /**
   * Obtener fixtures por fecha con caché
   */
  async getFixturesByDate(dateParam: string): Promise<LeagueFixtures[]> {
    const cacheKey = `fixtures:${dateParam}`
    const ttl = getTTL(dateParam)

    const cached = await cacheRepository.get<LeagueFixtures[]>(cacheKey)
    if (cached) {
      return cached
    }

    console.log(`[Service] Fetching fixtures from GoalServe: ${dateParam}`)
    const fixtures = await fixtureRepository.getFixturesByDate(dateParam)

    await cacheRepository.set(cacheKey, fixtures, { ttl })

    return fixtures
  },

  /**
   * Obtener solo partidos en vivo
   */
  async getLiveFixtures(): Promise<LeagueFixtures[]> {
    return this.getFixturesByDate('live')
  },

  /**
   * Obtener fixture por ID con caché
   */
  async getFixtureById(id: string): Promise<LeagueFixtures | null> {
    const cacheKey = `fixture:${id}`

    // 1. Intentar obtener de caché
    const cached = await cacheRepository.get<LeagueFixtures>(cacheKey)
    if (cached) {
      return cached
    }

    // 2. Si no hay caché, obtener de GoalServe
    console.log(`[Service] Fetching fixture from GoalServe: ${id}`)
    const fixture = await fixtureRepository.getFixtureById(id)

    if (fixture) {
      // 3. Guardar en caché (TTL corto para partidos individuales)
      await cacheRepository.set(cacheKey, fixture, { ttl: 60 })
    }

    return fixture
  },

  /**
   * Invalidar caché de fixtures
   */
  async invalidateCache(dateParam?: string): Promise<void> {
    if (dateParam) {
      await cacheRepository.delete(`fixtures:${dateParam}`)
    } else {
      await Promise.all([
        cacheRepository.delete('fixtures:home'),
        cacheRepository.delete('fixtures:live'),
      ])
    }
  },
}
