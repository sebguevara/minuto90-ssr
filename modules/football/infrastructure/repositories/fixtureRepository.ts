import { fixtureMapper } from '@/modules/football/infrastructure/mappers/fixtureMapper'
import { GoalServeFixturesResponse } from '@/modules/football/domain/types/fixtureResponse'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { fetchFromGoalServe } from './baseRepository'
import { logoRepository } from './logoRepository'

interface FixtureFilters {
  cat?: string
  gid?: string
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
    const leagueFixtures = fixtureMapper.toDomain(data)

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
  },

  async getFixtureById(id: string): Promise<LeagueFixtures | null> {
    const data = await fetchFromGoalServe<GoalServeFixturesResponse>(`soccerfixtures/match/${id}`)
    let leagueFixtures = fixtureMapper.toDomain(data)

    if (leagueFixtures.length === 0) return null

    const teamIds = leagueFixtures[0].matches.flatMap((match) => [
      match.localTeam.id,
      match.visitorTeam.id,
    ])
    const leagueIds = [leagueFixtures[0].id]
    const { teams: teamLogos, leagues: leagueLogos } = await logoRepository.getLogos(
      teamIds,
      leagueIds
    )
    return {
      ...leagueFixtures[0],
      logo: leagueLogos.get(leagueFixtures[0].id),
      matches: leagueFixtures[0].matches.map((match) => ({
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
    }
  },
}
