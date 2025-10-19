import { MatchDetails, MatchStats, Lineup } from '@/modules/football/domain/models/commentary'
import { MatchEvent } from '@/modules/football/domain/models/common'
import {
  GoalServeCommentaryResponse,
  GoalServeStats,
  GoalServeTeamLineup,
  GoalServeGoal,
  GoalServeSubstitution,
  GoalServeCard,
  GoalServeCommentaryPlayer,
} from '@/modules/football/domain/types/commentaryResponse'

const toStats = (stats: GoalServeStats | undefined): MatchStats => {
  if (!stats) {
    return {
      shots_total: 0,
      shots_on_goal: 0,
      possession: 0,
      corners: 0,
      offsides: 0,
      fouls: 0,
      saves: 0,
    }
  }
  return {
    shots_total: parseInt(stats.shots_total?.['@total'] || '0', 10),
    shots_on_goal: parseInt(stats.shots_on_goal?.['@total'] || '0', 10),
    possession: parseInt(stats.possessiontime?.['@total'] || '0', 10),
    corners: parseInt(stats.corners?.['@total'] || '0', 10),
    offsides: parseInt(stats.offsides?.['@total'] || '0', 10),
    fouls: parseInt(stats.fouls?.['@total'] || '0', 10),
    saves: parseInt(stats.saves?.['@total'] || '0', 10),
  }
}

const toLineup = (lineup: GoalServeTeamLineup | undefined): Lineup | undefined => {
  if (!lineup) return undefined

  const mapPlayer = (p: GoalServeCommentaryPlayer) => ({
    id: p['@id'],
    name: p['@name'],
    number: parseInt(p['@number'] || '0', 10),
    position: p['@pos'] || '',
  })

  return {
    starting: lineup.player.map(mapPlayer),
    substitutes: lineup.substitutes.player.map(mapPlayer),
    coach: { id: lineup.coach['@id'], name: lineup.coach['@name'] },
    formation: lineup.formation?.['@value'],
  }
}

export const commentaryMapper = {
  toDomain: (response: GoalServeCommentaryResponse): MatchDetails | null => {
    const matchData = response.commentaries?.match
    if (!matchData) return null

    const goalEvents: MatchEvent[] = (
      matchData.goals?.goal
        ? Array.isArray(matchData.goals.goal)
          ? matchData.goals.goal
          : [matchData.goals.goal]
        : []
    ).map(
      (g: GoalServeGoal): MatchEvent => ({
        type: 'goal',
        minute: parseInt(g['@minute'], 10),
        team: g['@team'] as 'localteam' | 'visitorteam',
        player: { id: g['@playerid'], name: g['@player'] },
        assist: { id: g['@assistid'] || '', name: g['@assist'] || '' },
        result: g['@score'],
      })
    )

    const cardEvents: MatchEvent[] = (
      matchData.cards?.card
        ? Array.isArray(matchData.cards.card)
          ? matchData.cards.card
          : [matchData.cards.card]
        : []
    ).map(
      (c: GoalServeCard): MatchEvent => ({
        type: c['@type'] as 'yellowcard' | 'redcard',
        minute: parseInt(c['@minute'], 10),
        team: c['@team'] as 'localteam' | 'visitorteam',
        player: { id: c['@playerid'], name: c['@player'] },
      })
    )

    const localSubs = (
      matchData.substitutions?.localteam?.substitution
        ? Array.isArray(matchData.substitutions.localteam.substitution)
          ? matchData.substitutions.localteam.substitution
          : [matchData.substitutions.localteam.substitution]
        : []
    ).map(
      (s: GoalServeSubstitution): MatchEvent => ({
        type: 'substitution',
        minute: parseInt(s['@minute'], 10),
        team: 'localteam',
        playerIn: { id: s['@player_in_id'], name: s['@player_in_name'] },
        playerOut: { id: s['@player_out_id'], name: s['@player_out_name'] },
      })
    )

    const visitorSubs = (
      matchData.substitutions?.visitorteam?.substitution
        ? Array.isArray(matchData.substitutions.visitorteam.substitution)
          ? matchData.substitutions.visitorteam.substitution
          : [matchData.substitutions.visitorteam.substitution]
        : []
    ).map(
      (s: GoalServeSubstitution): MatchEvent => ({
        type: 'substitution',
        minute: parseInt(s['@minute'], 10),
        team: 'visitorteam',
        playerIn: { id: s['@player_in_id'], name: s['@player_in_name'] },
        playerOut: { id: s['@player_out_id'], name: s['@player_out_name'] },
      })
    )

    const allEvents = [...goalEvents, ...cardEvents, ...localSubs, ...visitorSubs].sort(
      (a, b) => a.minute - b.minute
    )

    return {
      id: matchData['@id'],
      localTeam: { id: matchData['@localteam_id'], name: matchData['@localteam'] },
      visitorTeam: { id: matchData['@visitorteam_id'], name: matchData['@visitorteam'] },
      stats: {
        localTeam: toStats(matchData.stats?.localteam),
        visitorTeam: toStats(matchData.stats?.visitorteam),
      },
      lineups: {
        localTeam: toLineup(matchData.lineups?.localteam) || {
          starting: [],
          substitutes: [],
          coach: { id: '', name: '' },
          formation: '',
        },
        visitorTeam: toLineup(matchData.lineups?.visitorteam) || {
          starting: [],
          substitutes: [],
          coach: { id: '', name: '' },
          formation: '',
        },
      },
      events: allEvents,
    }
  },
}
