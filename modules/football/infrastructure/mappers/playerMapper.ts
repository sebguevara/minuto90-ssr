import { PlayerProfile } from '@/modules/football/domain/models/player'
import { GoalServePlayerResponse } from '@/modules/football/domain/types/playerResponse'

export const playerMapper = {
  toDomain: (response: GoalServePlayerResponse): PlayerProfile | null => {
    const player = response.player
    if (!player) return null

    return {
      id: player['@id'],
      name: player['@name'],
      image: player['@image'],
      age: parseInt(player['@age'], 10),
      nationality: player['@nationality'],
      height: player['@height'],
      weight: player['@weight'],
      position: player['@position'],
      team: {
        id: player.team['@id'],
        name: player.team['@name'],
        logo: player.team['@logo'],
      },
      stats: player.stats.season.map((stat) => ({
        team: { id: stat.team['@id'], name: stat.team['@name'] },
        league: {
          id: stat.league['@id'],
          name: stat.league['@name'],
          country: stat.league['@country'],
        },
        season: stat['@season'],
        games: parseInt(stat.games['@played'], 10),
        goals: parseInt(stat.goals['@total'], 10),
        assists: parseInt(stat.assists?.['@total'] || '0', 10),
        yellowCards: parseInt(stat.cards['@yellow'], 10),
        redCards: parseInt(stat.cards['@red'], 10),
      })),
    }
  },
}
