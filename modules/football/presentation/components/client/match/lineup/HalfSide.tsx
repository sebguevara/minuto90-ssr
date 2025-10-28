import { PlayerDot } from './PlayerDot'
import { HALF_COLS, MappedPlayerHalf } from '../../utils/halfColumns'
import { SquadUI } from '../../utils/buildSquadUI'
import { useMemo } from 'react'

export const HalfSide = ({
  side,
  cols,
  squadUI,
  mirror = false,
}: {
  side: 'h' | 'a'
  cols: Record<number, MappedPlayerHalf[]>
  squadUI: SquadUI
  mirror?: boolean
}) => {
  const order = mirror
    ? Array.from({ length: HALF_COLS }, (_, i) => HALF_COLS - i)
    : Array.from({ length: HALF_COLS }, (_, i) => i + 1)

  const allPlayers = useMemo(() => {
    return [...squadUI.starters, ...squadUI.bench]
  }, [squadUI])

  return (
    <div
      className="relative h-full grid gap-x-1 lg:gap-x-4"
      style={{ gridTemplateColumns: `repeat(${HALF_COLS}, 1fr)` }}>
      {order.map((colHalf) => {
        const playersHere = cols[colHalf] ?? []
        if (!playersHere.length) return <div key={colHalf} />

        return (
          <div key={colHalf} className="relative h-full flex flex-col items-center justify-evenly">
            {playersHere.map((p, idx) => {
              const playerWithEvents = allPlayers.find((sp) => sp.id === p.id)
              return (
                <PlayerDot
                  key={`${side}-${p.id}-${colHalf}-${idx}`}
                  p={{ ...p, ...playerWithEvents }}
                  color={mirror ? '#ff8b93' : '#00b2ff'}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
