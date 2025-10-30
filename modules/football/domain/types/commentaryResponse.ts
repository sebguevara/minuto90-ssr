type GoalServeObjectOrArray<T> = T | T[]
export interface TournamentAttr {
  '@name': string
  '@id': string
}
export interface MatchAttr {
  '@status': string
  '@timer': string
  '@date': string
  '@formatted_date': string
  '@time': string
  '@static_id': string
  '@id': string
}
export interface TeamAttr {
  '@name': string
  '@goals': string
  '@id': string
  '@ht_score'?: string
  '@ft_score'?: string
  '@et_score'?: string
  '@pen_score'?: string
}
export interface MatchInfoAttr {
  '@name': string
  '@addedTime_period1'?: string
  '@addedTime_period2'?: string
}
export interface PlayerEventAttr {
  '@name': string
  '@minute': string
  '@id': string
  '@owngoal'?: string
  '@penalty'?: string
  '@assist_name'?: string
  '@assist_id'?: string
  '@comment'?: string
  '@extra_min'?: string
  '@var_cancelled'?: string
  '@penalty_missed'?: string
}
export interface TeamFormationAttr {
  '@formation': string
}
export interface PlayerLineupAttr {
  '@number': string
  '@name': string
  '@pos': string
  '@formation_pos': string
  '@id': string
}
export interface SubstitutionAttr {
  '@off': string
  '@on': string
  '@minute': string
  '@on_id': string
  '@off_id': string
  '@injury': string
}
export interface StatsAttr {
  '@total': string
  '@ongoal'?: string
  '@offgoal'?: string
  '@blocked'?: string
  '@insidebox'?: string
  '@outsidebox'?: string
  '@accurate'?: string
  '@pct'?: string
  '@total_h1'?: string
  '@ongoal_h1'?: string
  '@total_h2'?: string
  '@ongoal_h2'?: string
}
export interface PlayerStatsAttr {
  '@id': string
  '@num': string
  '@name': string
  '@pos': string
  '@isCaptain'?: string
  '@isSubst': string
  '@shots_total'?: string
  '@shots_on_goal'?: string
  '@goals'?: string
  '@goals_conceded'?: string
  '@assists'?: string
  '@offsides'?: string
  '@fouls_drawn'?: string
  '@fouls_commited'?: string
  '@tackles'?: string
  '@blocks'?: string
  '@total_crosses'?: string
  '@acc_crosses'?: string
  '@interceptions'?: string
  '@clearances'?: string
  '@dispossesed'?: string
  '@saves'?: string
  '@savesInsideBox'?: string
  '@duelsTotal'?: string
  '@duelsWon'?: string
  '@dribbleAttempts'?: string
  '@dribbleSucc'?: string
  '@dribbledPast'?: string
  '@yellowcards'?: string
  '@redcards'?: string
  '@pen_score'?: string
  '@pen_miss'?: string
  '@pen_save'?: string
  '@pen_committed'?: string
  '@pen_won'?: string
  '@hit_woodwork'?: string
  '@passes'?: string
  '@passes_acc'?: string
  '@keyPasses'?: string
  '@minutes_played'?: string
  '@rating'?: string
}
export interface ColorAttr {
  '@color': string
}

export interface CommentaryResponse {
  commentaries: {
    '@sport': 'soccer'
    tournament: TournamentAttr & {
      match: MatchAttr & {
        localteam: TeamAttr
        visitorteam: TeamAttr
        matchinfo?: {
          stadium?: MatchInfoAttr
          attendance?: MatchInfoAttr
          referee?: MatchInfoAttr
          time?: MatchInfoAttr
        }
        summary?: {
          localteam: {
            goals?: null | { player: GoalServeObjectOrArray<PlayerEventAttr> }
            yellowcards?: null | { player: GoalServeObjectOrArray<PlayerEventAttr> }
            redcards?: null | { player: GoalServeObjectOrArray<PlayerEventAttr> }
            var?: any
          }
          visitorteam: {
            goals?: null | { player: GoalServeObjectOrArray<PlayerEventAttr> }
            yellowcards?: null | { player: GoalServeObjectOrArray<PlayerEventAttr> }
            redcards?: null | { player: GoalServeObjectOrArray<PlayerEventAttr> }
            var?: any
          }
        }
        stats?: { localteam: Record<string, StatsAttr>; visitorteam: Record<string, StatsAttr> }
        teams?: {
          localteam: TeamFormationAttr & { player: GoalServeObjectOrArray<PlayerLineupAttr> }
          visitorteam: TeamFormationAttr & { player: GoalServeObjectOrArray<PlayerLineupAttr> }
        }
        substitutes?: {
          localteam: { player: GoalServeObjectOrArray<PlayerLineupAttr> }
          visitorteam: { player: GoalServeObjectOrArray<PlayerLineupAttr> }
        }
        substitutions?: {
          localteam: { substitution: GoalServeObjectOrArray<SubstitutionAttr> }
          visitorteam: { substitution: GoalServeObjectOrArray<SubstitutionAttr> }
        }
        player_stats?: {
          localteam: { player: GoalServeObjectOrArray<PlayerStatsAttr> }
          visitorteam: { player: GoalServeObjectOrArray<PlayerStatsAttr> }
        }
        team_colors?: {
          localteam: { player: Record<string, ColorAttr>; goalkeeper: Record<string, ColorAttr> }
          visitorteam: { player: Record<string, ColorAttr>; goalkeeper: Record<string, ColorAttr> }
        }
        coaches?: any | null
      }
    }
  }
}
