import { standingMapper } from '@/modules/football/infrastructure/mappers/standingMapper'
import { GoalServeStandingsResponse } from '@/modules/football/domain/types/standingResponse'
import { Standing } from '@/modules/football/domain/models/standing'
import { fetchFromGoalServe } from './baseRepository'
import { logoRepository } from './logoRepository'
export const standingRepository = {
  getByLeagueId: async (leagueId: string): Promise<Standing | null> => {
    const data = await fetchFromGoalServe<GoalServeStandingsResponse>(`standings/${leagueId}.xml`)
    let standing = standingMapper.toDomain(data)

    if (standing) {
      const teamIds = standing.teams.map((t) => t.id)
      const teamLogos = await logoRepository.getTeamLogos(teamIds)
      standing.teams = standing.teams.map((team) => ({
        ...team,
        logo: teamLogos.get(team.id),
      }))
    }

    return standing
  },
}
