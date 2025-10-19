export interface OddValue {
  value: string
  odd: string
}

export interface Market {
  id: string
  name: string
  values: OddValue[]
}

export interface Bookmaker {
  id: string
  name: string
  markets: Market[]
}

export interface MatchOdds {
  fixtureId: string
  bookmakers: Bookmaker[]
}
