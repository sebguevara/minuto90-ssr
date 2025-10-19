import { TeamInfo } from './common'

export interface PlayerStats {
  team: TeamInfo
  league: { id: string; name: string; country: string }
  season: string
  games: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface PlayerProfile {
  id: string
  name: string
  image: string
  age: number
  nationality: string
  height: string
  weight: string
  position: string
  team: TeamInfo
  stats: PlayerStats[]
}
