import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { fixtureRepository } from '@/modules/football/infrastructure/repositories/fixtureRepository'
import { cacheRepository } from '@/modules/football/infrastructure/repositories/cacheRepository'
interface FixtureFilters {
  leagueId?: string
  stageId?: string
}

function getTTL(dateParam: string): number {
  if (dateParam === 'live') return 10
  if (dateParam === 'home') return 60
  if (dateParam.startsWith('d-')) return 2 * 3600
  return 1800
}

export const fixtureService = {
  async getFixturesByDate(
    dateParam: string,
    filters: FixtureFilters = {}
  ): Promise<LeagueFixtures[]> {
    const cacheKey = `fixtures:${dateParam}:${filters.leagueId || ''}:${filters.stageId || ''}`
    const ttl = getTTL(dateParam)

    const cached = await cacheRepository.get<LeagueFixtures[]>(cacheKey)
    if (cached) {
      return cached
    }

    console.log(`[Service] Fetching fixtures from GoalServe: ${dateParam}`, filters)
    const fixtures = await fixtureRepository.getFixturesByDate(dateParam, {
      cat: filters.leagueId,
      gid: filters.stageId,
    })

    if (!filters.leagueId && !filters.stageId) {
      await cacheRepository.set(cacheKey, fixtures, { ttl })
    }

    return fixtures
  },

  async getLiveFixtures(filters: FixtureFilters = {}): Promise<LeagueFixtures[]> {
    return this.getFixturesByDate('live', filters)
  },

  async getFixtureById(id: string): Promise<LeagueFixtures | null> {
    const cacheKey = `fixture:${id}`
    const cached = await cacheRepository.get<LeagueFixtures>(cacheKey)
    if (cached) {
      return cached
    }

    console.log(`[Service] Fetching fixture from GoalServe: ${id}`)
    const fixture = await fixtureRepository.getFixtureById(id)

    if (fixture) {
      await cacheRepository.set(cacheKey, fixture, { ttl: 60 })
    }

    return fixture
  },
}
