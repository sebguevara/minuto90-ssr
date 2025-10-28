import { Player } from '@/modules/football/domain/entities/Match'

export const HALF_COLS = 6
export const TOTAL_COLS = HALF_COLS * 2

export type MappedPlayerHalf = Player & { side: 'home' | 'away'; lane: number; colHalf: number }

const spread = (qty: number, min: number, max: number) =>
  Array.from(
    { length: qty },
    (_, i) => Math.round(((i + 1) * (max - min + 1)) / (qty + 1)) + min - 1
  )

const parseFormation = (formation?: string) => [
  1,
  ...(formation?.split('-').map(Number).filter(Boolean) ?? []),
]

export const mapPlayersByHalfColumns = (
  playersWithPlayer: { player: Player }[],
  formation: string | undefined,
  side: 'home' | 'away'
): MappedPlayerHalf[] => {
  const players = playersWithPlayer.map(({ player }) => player) as Player[]
  const ordered = [...players].sort((a, b) => (a.pos === 'G' ? -1 : b.pos === 'G' ? 1 : 0))
  const bands = parseFormation(formation)

  const laneCols = spread(bands.length, 1, HALF_COLS)

  let idx = 0
  const out: MappedPlayerHalf[] = []

  bands.forEach((qty, laneIdx) => {
    const colHalf = laneCols[laneIdx]
    for (let j = 0; j < qty; j++) {
      const p = ordered[idx++]
      if (!p) break
      out.push({ ...p, side, lane: laneIdx, colHalf })
    }
  })

  while (idx < ordered.length) {
    const p = ordered[idx++]
    out.push({ ...p, side, lane: bands.length, colHalf: Math.round(HALF_COLS / 2) })
  }

  return out
}
