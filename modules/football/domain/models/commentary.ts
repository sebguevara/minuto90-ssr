import { StatusConfig } from '@/lib/consts'
import { TeamInfo, PlayerInfo } from './common'

export interface MatchTournament {
  id: string
  name: string
  logo?: string
}
export interface MatchTeam extends TeamInfo {
  goals: number
  ht_score: string | null
  ft_score: string | null
}
export interface MatchInfo {
  id: string
  status: string
  date: string
  time: string
  timer: string | null
  venue: string | null
  referee: string | null
  addedTimeP1: string | null
  addedTimeP2: string | null
  localTeam: MatchTeam
  visitorTeam: MatchTeam
  statusConfig?: StatusConfig
}
export interface MatchEvent {
  teamId: string
  id: string
  name: string
  minute: string
  extra_min: string | null
  owngoal: boolean
  penalty: boolean
  assist_name: string | null
  assist_id: string | null
  comment: string | null
}
export interface SubstitutionEvent {
  off: string
  on: string
  minute: string
  on_id: string
  off_id: string
  injury: boolean
}
export interface TeamEvents {
  goals: MatchEvent[]
  yellowCards: MatchEvent[]
  redCards: MatchEvent[]
}
export interface TeamSubstitutions {
  localteam: SubstitutionEvent[]
  visitorteam: SubstitutionEvent[]
}
export interface StatItem {
  name: string
  total: string
  ongoal?: string
  offgoal?: string
  blocked?: string
  insidebox?: string
  outsidebox?: string
  accurate?: string
  pct?: string
  total_h1?: string
  ongoal_h1?: string
  total_h2?: string
  ongoal_h2?: string
}
export interface MatchStats {
  localteam: StatItem[]
  visitorteam: StatItem[]
}
export interface LineupPlayer extends PlayerInfo {
  number: string
  pos: string
  formation_pos: string
}
export interface TeamLineup {
  formation: string
  starting: LineupPlayer[]
  substitutes: PlayerInfo[]
}
export interface MatchLineups {
  localTeam: TeamLineup
  visitorTeam: TeamLineup
}
export interface PlayerStat {
  [key: string]: string | boolean
  isCaptain: boolean
  isSubst: boolean
}
export interface MatchPlayerStats {
  localteam: PlayerStat[]
  visitorteam: PlayerStat[]
}
export interface TeamColors {
  player: Record<string, string>
  goalkeeper: Record<string, string>
}

export interface MatchDetails {
  tournament: MatchTournament
  match: MatchInfo
  events: TeamEvents
  substitutions: TeamSubstitutions
  stats: MatchStats | null
  lineups: MatchLineups | null
  playerStats: MatchPlayerStats | null
  teamColors: { localteam: TeamColors; visitorteam: TeamColors } | null
  coaches: any | null
}
