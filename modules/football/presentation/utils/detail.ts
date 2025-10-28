import { Prediction } from '@/modules/football/domain/entities/Predictions'
import { StandingRow, StandingsLeague } from '@/modules/football/domain/entities/Standing'

export const MINUTE_KEYS = [
  '0-15',
  '16-30',
  '31-45',
  '46-60',
  '61-75',
  '76-90',
  '91-105',
  '106-120',
] as const

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')
export const n = (v: unknown) =>
  typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : 0

export const pluckMinuteArray = (
  team: Prediction['teams']['home'] | undefined,
  kind: 'for' | 'against'
): number[] => {
  const minute = team?.league?.goals?.[kind]?.minute ?? {}
  return MINUTE_KEYS.map((k) => {
    const entry = (minute as Record<string, { total: number | null }>)[k]
    return n(entry?.total ?? 0)
  })
}

export const totalGoals = (
  team: Prediction['teams']['home'] | undefined,
  kind: 'for' | 'against',
  scope: 'total' | 'home' | 'away'
) => {
  const totals = team?.league?.goals?.[kind]?.total ?? {}
  return n((totals as Record<'total' | 'home' | 'away', number | undefined>)[scope])
}

export const findStanding = (
  standings: StandingsLeague[] | undefined,
  teamId: number
): StandingRow | null => {
  if (!Array.isArray(standings)) return null
  for (const lg of standings) {
    const groups = lg.standings ?? []
    for (const group of groups) {
      const hit = group.find((row) => row.team?.id === teamId)
      if (hit) return hit
    }
  }
  return null
}

export const summarizeH2H = (pred: Prediction, leftId: number) => {
  const list = pred.h2h
  let L = 0,
    R = 0,
    D = 0
  const slicedList = list.length > 10 ? list.slice(0, 10) : list
  for (const m of slicedList) {
    const leftIsHome = m.teams.home.id === leftId
    const leftGoals = leftIsHome ? m.goals.home : m.goals.away
    const rightGoals = leftIsHome ? m.goals.away : m.goals.home
    if (leftGoals > rightGoals) L++
    else if (rightGoals > leftGoals) R++
    else D++
  }
  return { L, R, D }
}

export const last5ToArr = (form: string): Array<'W' | 'D' | 'L'> => {
  const clean = (form || '').toUpperCase().replace(/[^WDL]/g, '')
  return clean
    .slice(-5)
    .split('')
    .map((c) => (c === 'W' || c === 'D' || c === 'L' ? c : 'D')) as Array<'W' | 'D' | 'L'>
}

export const formatMinuteKey = (k: (typeof MINUTE_KEYS)[number]) => {
  if (k === '0-15') return '00’'
  if (k === '16-30') return '15’'
  if (k === '31-45') return '30’'
  if (k === '46-60') return '45’'
  if (k === '61-75') return '60’'
  if (k === '76-90') return '75’'
  if (k === '91-105') return '90’+'
  return '90’+'
}

export const scaleArrayToSum = (arr: number[], target: number) => {
  const base = arr.map((v) => Math.max(0, Number(v) || 0))
  const sum = base.reduce((a, b) => a + b, 0)
  if (sum <= 0 || target <= 0) return Array(arr.length).fill(0)
  const scaled = base.map((v) => (v / sum) * target)
  const floors = scaled.map((v) => Math.floor(v))
  let diff = Math.round(target - floors.reduce((a, b) => a + b, 0))
  const idx = scaled
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
    .map((x) => x.i)
  for (let k = 0; k < idx.length && diff > 0; k++) {
    floors[idx[k]] += 1
    diff--
  }
  return floors
}

export const minuteArraysForScope = (
  team: Prediction['teams']['home'] | undefined,
  scope: 'total' | 'home' | 'away'
) => {
  const forAll = pluckMinuteArray(team, 'for')
  const agaAll = pluckMinuteArray(team, 'against')

  if (scope === 'total') return { forArr: forAll, agaArr: agaAll }

  const forTarget = totalGoals(team, 'for', scope)
  const agaTarget = totalGoals(team, 'against', scope)

  return {
    forArr: scaleArrayToSum(forAll, forTarget),
    agaArr: scaleArrayToSum(agaAll, agaTarget),
  }
}
