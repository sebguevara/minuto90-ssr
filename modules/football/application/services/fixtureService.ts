import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { fixtureRepository } from '@/modules/football/infrastructure/repositories/fixtureRepository'
import { cacheRepository } from '@/modules/football/infrastructure/repositories/cacheRepository'

function getTTL(dateParam: string): number {
  if (dateParam === 'live') return 10
  if (dateParam === 'home') return 60
  if (dateParam.startsWith('d-') || dateParam.startsWith('d')) return 3600
  return 1800
}

function mergeFixtures(fixtureArrays: LeagueFixtures[][]): LeagueFixtures[] {
  const leagueMap = new Map<string, LeagueFixtures>()

  for (const fixtureArray of fixtureArrays) {
    for (const league of fixtureArray) {
      if (!leagueMap.has(league.id)) {
        leagueMap.set(league.id, { ...league, matches: [...league.matches] })
      } else {
        const existingLeague = leagueMap.get(league.id)!
        const existingMatchIds = new Set(existingLeague.matches.map((m) => m.id))

        for (const match of league.matches) {
          if (!existingMatchIds.has(match.id)) {
            existingLeague.matches.push(match)
          }
        }
      }
    }
  }
  return Array.from(leagueMap.values())
}

export const fixtureService = {
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

  async getAndMergeFixtures(dateParams: string[]): Promise<LeagueFixtures[]> {
    const fixturePromises = dateParams.map((param) => this.getFixturesByDate(param))
    const fixtureArrays = await Promise.all(fixturePromises)
    return mergeFixtures(fixtureArrays)
  },

  async getLiveFixtures(): Promise<LeagueFixtures[]> {
    return this.getFixturesByDate('live')
  },

  async getFixtureById(leagueId: string, id: string): Promise<LeagueFixtures | null> {
    const cacheKey = `fixture:${id}`
    const cached = await cacheRepository.get<LeagueFixtures>(cacheKey)
    if (cached) {
      return cached
    }

    console.log(`[Service] Fetching fixture from GoalServe: ${id}`)
    const fixture = await fixtureRepository.getFixtureById(leagueId, id)

    if (fixture) {
      await cacheRepository.set(cacheKey, fixture, { ttl: 60 })
    }

    return fixture
  },

  async invalidateCache(dateParam?: string): Promise<void> {
    if (dateParam) {
      await cacheRepository.delete(`fixtures:${dateParam}`)
    } else {
      const keysToDelete = ['fixtures:home', 'fixtures:live', 'fixtures:d1', 'fixtures:d-1']
      await Promise.all(keysToDelete.map((key) => cacheRepository.delete(key)))
    }
  },
}
