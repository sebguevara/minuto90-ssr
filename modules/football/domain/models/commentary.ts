import { PlayerInfo, TeamInfo, MatchEvent } from './common'

export interface LineupPlayer extends PlayerInfo {
  position: string
}

export interface Lineup {
  starting: LineupPlayer[]
  substitutes: LineupPlayer[]
  coach: PlayerInfo
  formation?: string
}

export interface MatchStats {
  shots_total: number
  shots_on_goal: number
  possession: number
  corners: number
  offsides: number
  fouls: number
  saves: number
}

export interface MatchDetails {
  id: string
  localTeam: TeamInfo
  visitorTeam: TeamInfo
  stats?: {
    localTeam: MatchStats
    visitorTeam: MatchStats
  }
  lineups?: {
    localTeam: Lineup
    visitorTeam: Lineup
  }
  events: MatchEvent[]
}
