import { PlayerInfo } from './common'

export interface Venue {
  id: string
  name: string
  city: string
  capacity: number
  image: string
}

export interface TeamProfile {
  id: string
  name: string
  country: string
  founded: number
  logo: string
  venue: Venue
  squad: PlayerInfo[]
}
