import { TeamProfile } from '@/modules/football/domain/models/team'
import { GoalServeTeamResponse } from '@/modules/football/domain/types/teamResponse'

export const teamMapper = {
  toDomain: (response: GoalServeTeamResponse): TeamProfile | null => {
    const team = response.team
    if (!team) return null

    return {
      id: team['@id'],
      name: team['@name'],
      country: team['@country'],
      founded: parseInt(team['@founded'], 10),
      logo: team['@logo'],
      venue: {
        id: team.venue['@id'],
        name: team.venue['@name'],
        city: team.venue['@city'],
        capacity: parseInt(team.venue['@capacity'], 10),
        image: team.venue['@image'],
      },
      squad: team.squad.player.map((p) => ({
        id: p['@id'],
        name: p['@name'],
        number: parseInt(p['@number'] || '0', 10),
      })),
    }
  },
}
