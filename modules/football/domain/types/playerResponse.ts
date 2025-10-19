export interface GoalServePlayerStats {
  team: { '@id': string; '@name': string }
  league: { '@id': string; '@name': string; '@country': string }
  '@season': string
  games: { '@played': string }
  goals: { '@total': string }
  assists?: { '@total': string }
  cards: { '@yellow': string; '@red': string }
}

export interface GoalServePlayerProfile {
  '@id': string
  '@name': string
  '@image': string
  '@age': string
  '@nationality': string
  '@height': string
  '@weight': string
  '@position': string
  team: { '@id': string; '@name': string; '@logo': string }
  stats: {
    season: GoalServePlayerStats[]
  }
}

export interface GoalServePlayerResponse {
  player: GoalServePlayerProfile
}
