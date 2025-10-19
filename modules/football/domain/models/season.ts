export interface SeasonInfo {
  name: string
}

export interface LeagueSeason {
  id: string
  name: string
  country: string
  isCup: boolean
  resultsSeasons: SeasonInfo[]
  standingsSeasons: SeasonInfo[]
}
