export interface GoalServeStandingTeam {
  '@position': string
  '@name': string
  '@id': string
  '@played': string
  '@wins': string
  '@draws': string
  '@losses': string
  '@for': string
  '@against': string
  '@gd': string
  '@points': string
  '@description'?: string
}

export interface GoalServeTotalStandings {
  team: GoalServeStandingTeam[]
}

export interface GoalServeTournament {
  '@season': string
  '@name': string
  '@id': string
  table: {
    total: GoalServeTotalStandings
    home: GoalServeTotalStandings
    away: GoalServeTotalStandings
  }
}

export interface GoalServeStandingsResponse {
  standings: {
    tournament: GoalServeTournament
  }
}
