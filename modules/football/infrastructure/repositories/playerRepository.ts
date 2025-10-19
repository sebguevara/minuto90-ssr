import { playerMapper } from '@/modules/football/infrastructure/mappers/playerMapper'
import { GoalServePlayerResponse } from '@/modules/football/domain/types/playerResponse'
import { PlayerProfile } from '@/modules/football/domain/models/player'
import { fetchFromGoalServe } from './baseRepository'

export const playerRepository = {
  getById: async (playerId: string): Promise<PlayerProfile | null> => {
    const data = await fetchFromGoalServe<GoalServePlayerResponse>(`soccerstats/player/${playerId}`)
    return playerMapper.toDomain(data)
  },
}
