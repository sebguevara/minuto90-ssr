import { leagueMapper } from '@/modules/football/infrastructure/mappers/leagueMapper'
import { GoalServeLeaguesResponse } from '@/modules/football/domain/types/leagueResponse'
import { fetchFromGoalServe } from './baseRepository'

export const leagueRepository = {
  getAll: async () => {
    const data = await fetchFromGoalServe<GoalServeLeaguesResponse>('soccerfixtures/data/mapping')
    return leagueMapper.toDomain(data)
  },
}
