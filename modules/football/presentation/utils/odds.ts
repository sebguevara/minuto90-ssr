import { MARKETS, PERIODS } from '../const/odds'

export type BetValue = { value: string; odd: string }
export type BetAll = { id: number; name: string; values: BetValue[] }

const norm = (s: string) => s.toLowerCase()
const includesAny = (s: string, needles: string[]) => {
  const n = norm(s)
  return needles.some((k) => n.includes(k))
}

export const pickBetFor = (
  bets: BetAll[],
  market: (typeof MARKETS)[number],
  period: (typeof PERIODS)[number]
) => {
  const m = bets.filter((b) => includesAny(b.name, [...market.names]))
  if (!m.length) return undefined
  const byPeriod = m.find((b) => includesAny(b.name, [...period.match])) ?? m[0]
  return byPeriod
}

export const headerES = (
  marketKey: (typeof MARKETS)[number]['key'],
  outcome: string,
  line: string | null
) => {
  if (marketKey === '1x2')
    return outcome === '1' ? 'Local' : outcome === '2' ? 'Visitante' : 'Empate'
  if (marketKey === 'double') return outcome
  if (marketKey === 'btts') return outcome === 'Yes' ? 'Sí' : 'No'
  if (marketKey === 'ou')
    return line ? (outcome === 'Over' ? `Más ${line}` : `Menos ${line}`) : outcome
  if (marketKey === 'ah')
    return line ? (outcome === 'Home' ? `Local ${line}` : `Visitante ${line}`) : outcome
  if (marketKey === 'oe') return outcome === 'Odd' ? 'Impar' : 'Par'
  if (marketKey === 'corners1x2')
    return outcome === '1' ? 'Local' : outcome === '2' ? 'Visitante' : 'Empate'
  if (marketKey === 'cards_ou' || marketKey === 'yellows_ou')
    return line ? (outcome === 'Over' ? `Más ${line}` : `Menos ${line}`) : outcome
  return outcome
}

export const pickOdd = (
  bet: BetAll,
  marketKey: string,
  outcome: string,
  line: string | null
): string | null => {
  let hit: BetValue | undefined
  const val = (s: string) => s.toLowerCase()

  if (marketKey === '1x2' || marketKey === 'corners1x2') {
    hit = bet.values.find((v) => sameOutcome1x2(v.value, outcome))
  } else if (marketKey === 'double') {
    hit = bet.values.find((v) => sameOutcomeDouble(v.value, outcome))
  } else if (marketKey === 'btts') {
    hit = bet.values.find((v) => sameOutcomeYesNo(v.value, outcome))
  } else if (marketKey === 'oe') {
    hit = bet.values.find((v) =>
      outcome === 'Odd' ? val(v.value).includes('odd') : val(v.value).includes('even')
    )
  } else if (marketKey === 'ou' || marketKey === 'cards_ou' || marketKey === 'yellows_ou') {
    hit = bet.values.find(
      (v) => val(v.value).startsWith(val(outcome)) && (line ? v.value.includes(line) : true)
    )
  } else if (marketKey === 'ah') {
    hit = bet.values.find(
      (v) => val(v.value).startsWith(val(outcome)) && (line ? v.value.includes(line) : true)
    )
  }
  return hit?.odd ?? null
}

export const extractLines = (bet: BetAll, marketKey: string): string[] => {
  const set = new Set<string>()
  const v = (s: string) => s.toLowerCase()
  for (const it of bet.values) {
    const s = v(it.value)
    if (marketKey === 'ou' || marketKey === 'cards_ou' || marketKey === 'yellows_ou') {
      const m = s.match(/(?:over|under)\\s*([0-9]+(?:\\.[0-9]+)?)/)
      if (m) set.add(m[1])
    } else if (marketKey === 'ah') {
      const m = s.match(/(?:home|away)\\s*([+-]?[0-9]+(?:\\.[0-9]+)?)/)
      if (m) set.add(m[1])
    }
  }
  return Array.from(set).sort((a, b) => parseFloat(a) - parseFloat(b))
}

export const sameOutcome1x2 = (v: string, o: string) => {
  const x = v.toLowerCase()
  if (o === '1') return x === '1' || x.startsWith('home') || x.includes('local')
  if (o === '2') return x === '2' || x.startsWith('away') || x.includes('visit')
  return x === 'x' || x.startsWith('draw') || x.includes('empate')
}
export const sameOutcomeDouble = (v: string, o: string) => {
  const x = v.toUpperCase().replaceAll(' ', '')
  return x === o
}
export const sameOutcomeYesNo = (v: string, o: string) => {
  const x = v.toLowerCase()
  return (o === 'Yes' && (x === 'yes' || x === 'si' || x === 'sí')) || (o === 'No' && x === 'no')
}
