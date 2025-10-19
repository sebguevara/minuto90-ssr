import { TeamInfo } from './common'

export interface StandingTeam extends TeamInfo {
  position: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  description?: string
}

export interface Standing {
  leagueId: string
  leagueName: string
  season: string
  teams: StandingTeam[]
}
