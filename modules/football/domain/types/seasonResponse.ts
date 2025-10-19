export interface GoalServeSeason {
  '@name': string
}

export interface GoalServeSeasonCategory {
  season: GoalServeSeason[]
}

export interface GoalServeLeagueSeason {
  '@id': string
  '@country': string
  '@name': string
  '@iscup': string
  results: GoalServeSeasonCategory
  standings: GoalServeSeasonCategory
}

export interface GoalServeSeasonsResponse {
  seasons: {
    '@sport': string
    league: GoalServeLeagueSeason[]
  }
}
