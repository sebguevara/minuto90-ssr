export interface GoalServeTeam {
  '@name': string
  '@id': string
  '@goals'?: string
  '@score'?: string
}

export interface GoalServePlayer {
  '@name': string
  '@id': string
  '@number'?: string
  '@booking'?: string
}

export interface GoalServeCoach {
  '@name': string
  '@id': string
}
