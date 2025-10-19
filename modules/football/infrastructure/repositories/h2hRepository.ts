import { h2hMapper } from '@/modules/football/infrastructure/mappers/h2hMapper'
import { GoalServeH2HResponse } from '@/modules/football/domain/types/h2hResponse'
import { Head2Head } from '@/modules/football/domain/models/h2h'
import { fetchFromGoalServe, fetchLogos } from './baseRepository'

export const h2hRepository = {
  getBetweenTeams: async (team1Id: string, team2Id: string): Promise<Head2Head | null> => {
    const data = await fetchFromGoalServe<GoalServeH2HResponse>(`h2h/${team1Id}/${team2Id}`)
    let h2hData = h2hMapper.toDomain(data)

    if (h2hData) {
      const teamIds = [h2hData.team1.id, h2hData.team2.id]
      const teamLogos = await fetchLogos('teams', teamIds)
      h2hData.team1.logo = teamLogos.get(h2hData.team1.id)
      h2hData.team2.logo = teamLogos.get(h2hData.team2.id)
    }

    return h2hData
  },
}
