import { teamMapper } from '@/modules/football/infrastructure/mappers/teamMapper'
import { GoalServeTeamResponse } from '@/modules/football/domain/types/teamResponse'
import { TeamProfile } from '@/modules/football/domain/models/team'
import { fetchFromGoalServe } from './baseRepository'

export const teamRepository = {
  getById: async (teamId: string): Promise<TeamProfile | null> => {
    const data = await fetchFromGoalServe<GoalServeTeamResponse>(`soccerstats/team/${teamId}`)
    return teamMapper.toDomain(data)
  },
}
