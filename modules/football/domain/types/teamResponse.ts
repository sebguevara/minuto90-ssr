import { GoalServePlayer } from './common'

export interface GoalServeVenue {
  '@id': string
  '@name': string
  '@city': string
  '@capacity': string
  '@image': string
}

export interface GoalServeTeamProfile {
  '@id': string
  '@name': string
  '@country': string
  '@founded': string
  '@logo': string
  venue: GoalServeVenue
  squad: {
    player: GoalServePlayer[]
  }
}

export interface GoalServeTeamResponse {
  team: GoalServeTeamProfile
}
