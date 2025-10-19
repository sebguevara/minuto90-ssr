import { Standing } from '@/modules/football/domain/models/standing'
import { GoalServeStandingsResponse } from '@/modules/football/domain/types/standingResponse'

export const standingMapper = {
  toDomain: (response: GoalServeStandingsResponse): Standing | null => {
    const tournament = response.standings?.tournament
    if (!tournament) return null

    return {
      leagueId: tournament['@id'],
      leagueName: tournament['@name'],
      season: tournament['@season'],
      teams: tournament.table.total.team.map((team) => ({
        id: team['@id'],
        name: team['@name'],
        position: parseInt(team['@position'], 10),
        played: parseInt(team['@played'], 10),
        wins: parseInt(team['@wins'], 10),
        draws: parseInt(team['@draws'], 10),
        losses: parseInt(team['@losses'], 10),
        goalsFor: parseInt(team['@for'], 10),
        goalsAgainst: parseInt(team['@against'], 10),
        goalDifference: parseInt(team['@gd'], 10),
        points: parseInt(team['@points'], 10),
        description: team['@description'],
      })),
    }
  },
}
