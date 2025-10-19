import { GoalServeMatch } from './fixtureResponse'

export interface GoalServeH2HStats {
  '@matches': string
  '@team1_wins': string
  '@team2_wins': string
  '@draws': string
}

export interface GoalServeH2HResponse {
  h2h: {
    team1: { '@id': string; '@name': string }
    team2: { '@id': string; '@name': string }
    overall: GoalServeH2HStats
    matches: {
      match: GoalServeMatch[]
    }
  }
}
