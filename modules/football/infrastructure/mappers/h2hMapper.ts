import { Head2Head } from '@/modules/football/domain/models/h2h'
import { Match } from '@/modules/football/domain/models/fixture'
import { GoalServeH2HResponse } from '@/modules/football/domain/types/h2hResponse'
import { GoalServeMatch } from '@/modules/football/domain/types/fixtureResponse'

const toMatch = (match: GoalServeMatch): Match => ({
  id: match['@id'],
  staticId: match['@static_id'],
  status: match['@status'],
  date: match['@formatted_date'],
  time: match['@time'],
  localTeam: {
    id: match.localteam['@id'],
    name: match.localteam['@name'],
    goals: match.localteam['@goals'] ?? '?',
  },
  visitorTeam: {
    id: match.visitorteam['@id'],
    name: match.visitorteam['@name'],
    goals: match.visitorteam['@goals'] ?? '?',
  },
  htScore: match.ht?.['@score'],
  ftScore: match.ft?.['@score'],
  commentaryAvailable: false,
  events: [],
})

export const h2hMapper = {
  toDomain: (response: GoalServeH2HResponse): Head2Head | null => {
    const h2h = response.h2h
    if (!h2h) return null

    return {
      team1: { id: h2h.team1['@id'], name: h2h.team1['@name'] },
      team2: { id: h2h.team2['@id'], name: h2h.team2['@name'] },
      overallStats: {
        totalMatches: parseInt(h2h.overall['@matches'], 10),
        team1Wins: parseInt(h2h.overall['@team1_wins'], 10),
        team2Wins: parseInt(h2h.overall['@team2_wins'], 10),
        draws: parseInt(h2h.overall['@draws'], 10),
      },
      lastMatches: h2h.matches.match.map(toMatch),
    }
  },
}
