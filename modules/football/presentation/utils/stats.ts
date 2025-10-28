import type { StatEntry } from '@/modules/football/domain/entities/stats'

export const toMap = (arr: StatEntry[]) => {
  const m = {} as Record<StatEntry['type'], StatEntry>
  for (const s of arr ?? []) m[s.type] = s
  return m
}

export const parseVal = (v: StatEntry['value']): number | null => {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return v
  // strings tipo "60%" o "483"
  const n = parseFloat(String(v).replace('%', '').trim())
  return Number.isFinite(n) ? n : null
}

export const decideHighlight = (
  left: number | null,
  right: number | null,
  lowerIsBetter: boolean
): { leftWin: boolean; rightWin: boolean } => {
  if (left === null && right !== null) return { leftWin: false, rightWin: true }
  if (right === null && left !== null) return { leftWin: true, rightWin: false }
  if (left === null && right === null) return { leftWin: false, rightWin: false }

  if (left === right) return { leftWin: false, rightWin: false }

  const cmp = lowerIsBetter ? (a: number, b: number) => a < b : (a: number, b: number) => a > b
  const leftWin = cmp(left as number, right as number)
  const rightWin = cmp(right as number, left as number)
  return { leftWin, rightWin }
}
