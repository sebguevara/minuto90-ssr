import { TeamInfo, MatchEvent } from './common'

export interface Country {
  name: string
  nameCode: string
  code: string | null
  flag: string | null
}

export interface MatchTeam extends TeamInfo {
  goals: string | number
}

export interface Match {
  id: string
  staticId: string
  status: string
  date: string
  time: string
  timer?: string
  venue?: string
  commentaryAvailable: boolean
  localTeam: MatchTeam
  visitorTeam: MatchTeam
  htScore?: string
  ftScore?: string
  events: MatchEvent[]
}

export interface LeagueFixtures {
  id: string
  name: string
  isCup: boolean
  logo?: string
  country?: Country
  matches: Match[]
}
