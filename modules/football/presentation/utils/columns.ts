import { Player } from '@/modules/football/domain/entities/Match'

export const COLS = 12

export type MappedPlayerCol = Player & { col: number }

const MID_L = Math.floor(COLS / 2)
const MID_R = MID_L + 1

const spread = (qty: number, min: number, max: number) =>
  Array.from(
    { length: qty },
    (_, i) => Math.round(((i + 1) * (max - min + 1)) / (qty + 1)) + min - 1
  )

type Band = { qty: number; col: number }

const buildBands = (formation: string | undefined, side: 'home' | 'away'): Band[] => {
  const nums = formation?.split('-').map(Number).filter(Boolean) ?? []
  const withGK = [1, ...nums]
  const colsRaw =
    side === 'home' ? spread(withGK.length, 1, MID_L) : spread(withGK.length, MID_R, COLS)
  return withGK.map((qty, i) => ({ qty, col: colsRaw[i] }))
}

export const mapPlayersByColumns = (
  players: Player[],
  formation: string | undefined,
  side: 'home' | 'away'
): MappedPlayerCol[] => {
  const ordered = [...players].sort((a, b) => (a.pos === 'G' ? -1 : b.pos === 'G' ? 1 : 0))
  const bands = buildBands(formation, side)

  let idx = 0
  const out: MappedPlayerCol[] = []

  bands.forEach(({ qty, col }) => {
    for (let j = 0; j < qty; j++) {
      const p = ordered[idx++]
      if (!p) break

      let finalCol = col
      if (p.grid) {
        const [gc] = p.grid.split(':').map(Number)
        if (!Number.isNaN(gc)) {
          finalCol = side === 'home' ? gc : COLS + 1 - gc
          finalCol = side === 'home' ? Math.min(finalCol, MID_L) : Math.max(finalCol, MID_R)
        }
      }

      out.push({ ...p, col: finalCol })
    }
  })

  while (idx < ordered.length) {
    const p = ordered[idx++]
    out.push({ ...p, col: side === 'home' ? MID_L : MID_R })
  }

  return out
}
