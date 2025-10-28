import { Player } from '@/modules/football/domain/entities/Match'

export const COLS = 12
export const ROWS = 8

export type MappedPlayer = Player & { col: number; row: number }

/* ---- helpers % (centro de la celda) ---- */
export const xPct = (col: number) => ((col - 0.5) / COLS) * 100
export const yPct = (row: number) => ((row - 0.5) / ROWS) * 100

/* ---- si querés seguir usando formación ---- */
const MID_L = Math.floor(COLS / 2)
const MID_R = MID_L + 1
const MID_ROW = Math.round(ROWS / 2)

const spread = (qty: number, min: number, max: number) =>
  Array.from(
    { length: qty },
    (_, i) => Math.round(((i + 1) * (max - min + 1)) / (qty + 1)) + min - 1
  )

const centerRows = (rows: number[]) => {
  if (rows.length === 1) return [MID_ROW]
  const avg = rows.reduce((a, b) => a + b, 0) / rows.length
  const shift = MID_ROW - Math.round(avg)
  return rows.map((r) => Math.min(Math.max(r + shift, 1), ROWS)).sort((a, b) => a - b)
}

type Band = { qty: number; col: number }
const buildBands = (formation: string | undefined, side: 'home' | 'away'): Band[] => {
  const nums = formation?.split('-').map(Number).filter(Boolean) ?? []
  const withGK = [1, ...nums]
  const cols =
    side === 'home' ? spread(withGK.length, 1, MID_L) : spread(withGK.length, MID_R, COLS)
  return withGK.map((qty, i) => ({ qty, col: cols[i] }))
}

export const mapPlayersByFormation = (
  players: Player[],
  formation: string | undefined,
  side: 'home' | 'away'
): MappedPlayer[] => {
  const ordered = [...players].sort((a, b) => (a.pos === 'G' ? -1 : b.pos === 'G' ? 1 : 0))
  const bands = buildBands(formation, side)
  let idx = 0
  const out: MappedPlayer[] = []

  bands.forEach(({ qty, col }, bi) => {
    let rows = spread(qty, 1, ROWS)
    rows = bi === 0 && qty === 1 ? [MID_ROW] : centerRows(rows)

    rows.forEach((row) => {
      const p = ordered[idx++]
      if (!p) return
      let c = col,
        r = row
      if (p.grid) {
        const [gc, gr] = p.grid.split(':').map(Number)
        if (!Number.isNaN(gc) && !Number.isNaN(gr)) {
          c = side === 'home' ? gc : COLS + 1 - gc
          c = side === 'home' ? Math.min(c, MID_L) : Math.max(c, MID_R)
          r = Math.min(Math.max(gr, 1), ROWS)
        }
      }
      out.push({ ...p, col: c, row: r })
    })
  })

  while (idx < ordered.length) {
    const p = ordered[idx++]
    out.push({ ...p, col: side === 'home' ? MID_L : MID_R, row: MID_ROW })
  }
  return out
}
