// modules/football/infrastructure/mappers/commentaryMapper.ts

import {
  CommentaryResponse,
  PlayerEventAttr,
  PlayerStatsAttr,
  StatsAttr,
  SubstitutionAttr,
} from '@/modules/football/domain/types/commentaryResponse'
import { MatchDetails, MatchEvent } from '@/modules/football/domain/models/commentary'

const ensureArray = <T>(item: T | T[] | undefined): T[] => {
  if (item === undefined) return []
  return Array.isArray(item) ? item : [item]
}

const parsePlayerEvents = (
  players: ReturnType<typeof ensureArray<PlayerEventAttr>>,
  teamId: string
): MatchEvent[] =>
  players.map((p) => ({
    teamId,
    id: p['@id'],
    name: p['@name'],
    minute: p['@minute'],
    extra_min: p['@extra_min'] || null,
    owngoal: p['@owngoal'] === 'True',
    penalty: p['@penalty'] === 'True',
    assist_name: p['@assist_name'] || null,
    assist_id: p['@assist_id'] || null,
    comment: p['@comment'] || null,
  }))

export const commentaryMapper = {
  toDomain(response: CommentaryResponse): MatchDetails | null {
    try {
      const tournament = response.commentaries.tournament
      const matchData = tournament.match
      if (!matchData) return null

      console.log(matchData)

      const { localteam, visitorteam, summary, teams, player_stats, team_colors } = matchData
      const localId = localteam['@id']
      const visitorId = visitorteam['@id']

      return {
        tournament: { id: tournament['@id'], name: tournament['@name'] },
        match: {
          id: matchData['@id'],
          status: matchData['@status'],
          date: matchData['@date'],
          time: matchData['@time'],
          timer: matchData['@timer'] || null,
          venue: matchData.matchinfo?.stadium?.['@name'] || null,
          referee: matchData.matchinfo?.referee?.['@name'] || null,
          addedTimeP1: matchData.matchinfo?.time?.['@addedTime_period1'] || null,
          addedTimeP2: matchData.matchinfo?.time?.['@addedTime_period2'] || null,
          localTeam: {
            id: localId,
            name: localteam['@name'],
            goals: parseInt(localteam['@goals'], 10),
            ht_score: localteam['@ht_score'] || null,
            ft_score: localteam['@ft_score'] || null,
            logo: '',
          },
          visitorTeam: {
            id: visitorId,
            name: visitorteam['@name'],
            goals: parseInt(visitorteam['@goals'], 10),
            ht_score: visitorteam['@ht_score'] || null,
            ft_score: visitorteam['@ft_score'] || null,
            logo: '',
          },
        },
        events: {
          goals: [
            ...parsePlayerEvents(ensureArray(summary?.localteam.goals?.player), localId),
            ...parsePlayerEvents(ensureArray(summary?.visitorteam.goals?.player), visitorId),
          ],
          yellowCards: [
            ...parsePlayerEvents(ensureArray(summary?.localteam.yellowcards?.player), localId),
            ...parsePlayerEvents(ensureArray(summary?.visitorteam.yellowcards?.player), visitorId),
          ],
          redCards: [
            ...parsePlayerEvents(ensureArray(summary?.localteam.redcards?.player), localId),
            ...parsePlayerEvents(ensureArray(summary?.visitorteam.redcards?.player), visitorId),
          ],
        },
        substitutions: {
          localteam: ensureArray(matchData.substitutions?.localteam.substitution).map(
            (s: SubstitutionAttr) => ({
              off: s['@off'],
              on: s['@on'],
              minute: s['@minute'],
              on_id: s['@on_id'],
              off_id: s['@off_id'],
              injury: s['@injury'] === 'True',
            })
          ),
          visitorteam: ensureArray(matchData.substitutions?.visitorteam.substitution).map(
            (s: SubstitutionAttr) => ({
              off: s['@off'],
              on: s['@on'],
              minute: s['@minute'],
              on_id: s['@on_id'],
              off_id: s['@off_id'],
              injury: s['@injury'] === 'True',
            })
          ),
        },
        stats: matchData.stats
          ? {
              localteam: Object.entries(matchData.stats.localteam).map(
                ([key, value]: [string, StatsAttr]) => ({
                  name: key,
                  total: value['@total'],
                  ongoal: value['@ongoal'],
                  offgoal: value['@offgoal'],
                  blocked: value['@blocked'],
                  insidebox: value['@insidebox'],
                  outsidebox: value['@outsidebox'],
                  accurate: value['@accurate'],
                  pct: value['@pct'],
                  total_h1: value['@total_h1'],
                  ongoal_h1: value['@ongoal_h1'],
                  total_h2: value['@total_h2'],
                  ongoal_h2: value['@ongoal_h2'],
                })
              ),
              visitorteam: Object.entries(matchData.stats.visitorteam).map(
                ([key, value]: [string, StatsAttr]) => ({
                  name: key,
                  total: value['@total'],
                  ongoal: value['@ongoal'],
                  offgoal: value['@offgoal'],
                  blocked: value['@blocked'],
                  insidebox: value['@insidebox'],
                  outsidebox: value['@outsidebox'],
                  accurate: value['@accurate'],
                  pct: value['@pct'],
                  total_h1: value['@total_h1'],
                  ongoal_h1: value['@ongoal_h1'],
                  total_h2: value['@total_h2'],
                  ongoal_h2: value['@ongoal_h2'],
                })
              ),
            }
          : null,
        lineups: teams
          ? {
              localTeam: {
                formation: teams.localteam['@formation'],
                starting: ensureArray(teams.localteam.player).map((p) => ({
                  id: p['@id'],
                  name: p['@name'],
                  number: p['@number'],
                  pos: p['@pos'],
                  formation_pos: p['@formation_pos'],
                })),
                substitutes: ensureArray(matchData.substitutes?.localteam.player).map((p) => ({
                  id: p['@id'],
                  name: p['@name'],
                  number: p['@number'],
                  pos: p['@pos'],
                })),
              },
              visitorTeam: {
                formation: teams.visitorteam['@formation'],
                starting: ensureArray(teams.visitorteam.player).map((p) => ({
                  id: p['@id'],
                  name: p['@name'],
                  number: p['@number'],
                  pos: p['@pos'],
                  formation_pos: p['@formation_pos'],
                })),
                substitutes: ensureArray(matchData.substitutes?.visitorteam.player).map((p) => ({
                  id: p['@id'],
                  name: p['@name'],
                  number: p['@number'],
                  pos: p['@pos'],
                })),
              },
            }
          : null,
        playerStats: player_stats
          ? {
              localteam: ensureArray(player_stats.localteam.player).map((p: PlayerStatsAttr) => ({
                ...p,
                isCaptain: p['@isCaptain'] === 'True',
                isSubst: p['@isSubst'] === 'True',
              })),
              visitorteam: ensureArray(player_stats.visitorteam.player).map(
                (p: PlayerStatsAttr) => ({
                  ...p,
                  isCaptain: p['@isCaptain'] === 'True',
                  isSubst: p['@isSubst'] === 'True',
                })
              ),
            }
          : null,
        teamColors: team_colors
          ? {
              localteam: {
                player: Object.fromEntries(
                  Object.entries(team_colors.localteam.player).map(([k, v]) => [k, v['@color']])
                ),
                goalkeeper: Object.fromEntries(
                  Object.entries(team_colors.localteam.goalkeeper).map(([k, v]) => [k, v['@color']])
                ),
              },
              visitorteam: {
                player: Object.fromEntries(
                  Object.entries(team_colors.visitorteam.player).map(([k, v]) => [k, v['@color']])
                ),
                goalkeeper: Object.fromEntries(
                  Object.entries(team_colors.visitorteam.goalkeeper).map(([k, v]) => [
                    k,
                    v['@color'],
                  ])
                ),
              },
            }
          : null,
        coaches: matchData.coaches || null,
      }
    } catch (error) {
      console.error('Error fatal en commentaryMapper:', error)
      return null
    }
  },
}
