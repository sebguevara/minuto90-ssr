export interface GoalServeLeague {
  '@id': string
  '@name': string
  '@country': string
  '@is_cup': string
}

export interface GoalServeLeaguesResponse {
  leagues: {
    league: GoalServeLeague[]
  }
}
