import { fixtureMapper } from '@/modules/football/infrastructure/mappers/fixtureMapper'
import { GoalServeFixturesResponse } from '@/modules/football/domain/types/fixtureResponse'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { fetchFromGoalServe } from './baseRepository'
import { logoRepository } from './logoRepository'

interface FixtureFilters {
  cat?: string
  gid?: string
}

async function hydrateFixturesWithLogos(
  leagueFixtures: LeagueFixtures[]
): Promise<LeagueFixtures[]> {
  if (!leagueFixtures || leagueFixtures.length === 0) {
    return []
  }

  const teamIds = leagueFixtures.flatMap((league) =>
    league.matches.flatMap((match) => [match.localTeam.id, match.visitorTeam.id])
  )
  const leagueIds = leagueFixtures.map((league) => league.id)

  const { teams: teamLogos, leagues: leagueLogos } = await logoRepository.getLogos(
    teamIds,
    leagueIds
  )

  return leagueFixtures.map((league) => ({
    ...league,
    logo: leagueLogos.get(league.id),
    matches: league.matches.map((match) => ({
      ...match,
      localTeam: {
        ...match.localTeam,
        logo: teamLogos.get(match.localTeam.id),
      },
      visitorTeam: {
        ...match.visitorTeam,
        logo: teamLogos.get(match.visitorTeam.id),
      },
    })),
  }))
}

export const fixtureRepository = {
  async getFixturesByDate(
    dateParam: string,
    filters: FixtureFilters = {}
  ): Promise<LeagueFixtures[]> {
    let path = `soccernew/${dateParam}`
    const queryParams = new URLSearchParams()
    if (filters.cat) {
      queryParams.append('cat', filters.cat)
    }
    if (filters.gid) {
      queryParams.append('gid', filters.gid)
    }

    const queryString = queryParams.toString()
    if (queryString) {
      path += `?${queryString}`
    }

    const data = await fetchFromGoalServe<GoalServeFixturesResponse>(path)
    return fixtureMapper.toDomain(data)
  },

  async getAndHydrateFixturesByDate(
    dateParam: string,
    filters: FixtureFilters = {}
  ): Promise<LeagueFixtures[]> {
    const leagueFixtures = await this.getFixturesByDate(dateParam, filters)
    return hydrateFixturesWithLogos(leagueFixtures)
  },

  async getFixtureById(leagueId: string, id: string): Promise<LeagueFixtures | null> {
    const data = await fetchFromGoalServe<GoalServeFixturesResponse>(
      `soccerfixtures/${leagueId}/${id}`
    )
    let leagueFixtures = fixtureMapper.toDomain(data)

    if (leagueFixtures.length === 0) return null

    const hydratedFixtures = await hydrateFixturesWithLogos(leagueFixtures)
    return hydratedFixtures[0] ?? null
  },
}
