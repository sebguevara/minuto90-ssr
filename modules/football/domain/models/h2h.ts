import { TeamInfo } from './common'
import { Match } from './fixture'

export interface H2HStats {
  totalMatches: number
  team1Wins: number
  team2Wins: number
  draws: number
}

export interface Head2Head {
  team1: TeamInfo
  team2: TeamInfo
  overallStats: H2HStats
  lastMatches: Match[]
}
