import { MatchOdds, Bookmaker, Market, OddValue } from '@/modules/football/domain/models/odds'
import {
  GoalServeOddsResponse,
  GoalServeOddsMatch,
  GoalServeBookmaker,
  GoalServeMarket,
  GoalServeOddValue,
} from '@/modules/football/domain/types/oddsResponse'

const toOddValue = (value: GoalServeOddValue): OddValue => ({
  value: value['@value'],
  odd: value['@odd'],
})

const toMarket = (market: GoalServeMarket): Market => ({
  id: market['@id'],
  name: market['@name'],
  values: market.choice
    ? Array.isArray(market.choice)
      ? market.choice.map(toOddValue)
      : [toOddValue(market.choice)]
    : [],
})

const toBookmaker = (bookmaker: GoalServeBookmaker): Bookmaker => ({
  id: bookmaker['@id'],
  name: bookmaker['@name'],
  markets: bookmaker.market
    ? Array.isArray(bookmaker.market)
      ? bookmaker.market.map(toMarket)
      : [toMarket(bookmaker.market)]
    : [],
})

export const oddsMapper = {
  toDomain: (response: GoalServeOddsResponse): MatchOdds[] => {
    if (!response.oddsdata || !response.oddsdata.match) return []

    const matches = Array.isArray(response.oddsdata.match)
      ? response.oddsdata.match
      : [response.oddsdata.match]

    return matches.map((match: GoalServeOddsMatch) => ({
      fixtureId: match['@id'],
      bookmakers: match.bookmaker
        ? Array.isArray(match.bookmaker)
          ? match.bookmaker.map(toBookmaker)
          : [toBookmaker(match.bookmaker)]
        : [],
    }))
  },
}
