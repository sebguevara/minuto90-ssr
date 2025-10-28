type Trio = { home: number; draw: number; away: number }

export const safePercents = (p: { home: string; draw: string; away: string }): Trio => {
  return {
    home: parsePercent(p.home),
    draw: parsePercent(p.draw),
    away: parsePercent(p.away),
  }
}

const parsePercent = (v: string | number | undefined | null): number => {
  if (v == null) return 0
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace('%', ''))
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0
}

export const normalizePercents = ({ home, draw, away }: Trio): Trio => {
  const sum = home + draw + away
  if (sum <= 0) return { home: 0, draw: 0, away: 0 }
  const f = 100 / sum
  const h = round2(home * f)
  const d = round2(draw * f)
  let a = round2(100 - h - d)
  if (a < 0) a = Math.max(0, a)
  return { home: h, draw: d, away: a }
}

const round2 = (n: number) => {
  return Math.round(n * 100) / 100
}

export const toPct = (n: number) => {
  return `${Math.round(n)}%`
}
