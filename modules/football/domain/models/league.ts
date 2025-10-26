import { Country } from './fixture'

export interface League {
  id: string
  name: string
  isCup: boolean
  country?: Country
  logo?: string
}
