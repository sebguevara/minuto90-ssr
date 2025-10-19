import { GoalServeCoach } from './common'

export interface GoalServeCommentaryPlayer {
  '@name': string
  '@id': string
  '@number'?: string
  '@pos'?: string
}

export interface GoalServeGoal {
  '@team': string
  '@minute': string
  '@player': string
  '@score': string
  '@playerid': string
  '@assist'?: string
  '@assistid'?: string
}

export interface GoalServeCard {
  '@type': string
  '@minute': string
  '@team': string
  '@player': string
  '@playerid': string
}

export interface GoalServeSubstitution {
  '@minute': string
  '@player_in_name': string
  '@player_in_id': string
  '@player_out_name': string
  '@player_out_id': string
}

export interface GoalServeLineup {
  player: GoalServeCommentaryPlayer[]
}

export interface GoalServeTeamLineup {
  player: GoalServeCommentaryPlayer[]
  substitutes: {
    player: GoalServeCommentaryPlayer[]
  }
  coach: GoalServeCoach
  formation: { '@value': string }
}

export interface GoalServeStats {
  shots_total?: { '@total': string }
  shots_on_goal?: { '@total': string }
  possessiontime?: { '@total': string }
  corners?: { '@total': string }
  offsides?: { '@total': string }
  fouls?: { '@total': string }
  saves?: { '@total': string }
}

export interface GoalServeCommentaryMatch {
  '@status': string
  '@minute': string
  '@id': string
  '@localteam': string
  '@localteam_id': string
  '@visitorteam': string
  '@visitorteam_id': string
  stats?: {
    localteam: GoalServeStats
    visitorteam: GoalServeStats
  }
  lineups?: {
    localteam: GoalServeTeamLineup
    visitorteam: GoalServeTeamLineup
  }
  goals?: {
    goal: GoalServeGoal | GoalServeGoal[]
  }
  cards?: {
    card: GoalServeCard | GoalServeCard[]
  }
  substitutions?: {
    localteam: { substitution: GoalServeSubstitution | GoalServeSubstitution[] }
    visitorteam: { substitution: GoalServeSubstitution | GoalServeSubstitution[] }
  }
}

export interface GoalServeCommentaryResponse {
  commentaries: {
    match: GoalServeCommentaryMatch
  }
}
