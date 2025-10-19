export interface GoalServeOddValue {
  '@value': string
  '@odd': string
}

export interface GoalServeMarket {
  '@id': string
  '@name': string
  choice: GoalServeOddValue[]
}

export interface GoalServeBookmaker {
  '@id': string
  '@name': string
  market: GoalServeMarket[]
}

export interface GoalServeOddsMatch {
  '@id': string
  bookmaker: GoalServeBookmaker[]
}

export interface GoalServeOddsResponse {
  oddsdata: {
    match: GoalServeOddsMatch[]
  }
}
