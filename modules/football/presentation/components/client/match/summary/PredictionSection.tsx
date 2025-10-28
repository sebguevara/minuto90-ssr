import React from 'react'
import type { Prediction } from '@/modules/football/domain/entities/Predictions'
import type { Team } from '@football/domain/entities/Team'
import { abbreviateTeamName } from '@/shared/lib/utils'
import { normalizePercents, safePercents, toPct } from '../../utils/predictions'

type Props = {
  prediction: Prediction
  teams: { home: Team; away: Team }
  className?: string
  barHeight?: number
  colors: { home: string; away: string }
}

export default function PredictionsSectionV2({
  prediction,
  teams,
  className,
  barHeight = 16,
  colors,
}: Props) {
  const raw = safePercents(prediction.percent)
  const perc = normalizePercents(raw)

  return (
    <section className={`rounded-md border border-border bg-card ${className ?? ''}`}>
      <header className="p-4">
        <h3 className="text-sm font-semibold">Pronósticos previo al partido</h3>
        <p className="text-xs opacity-70 mt-1">¿Quién va a ganar?</p>
      </header>

      <div className="px-4 pb-4">
        <div
          className="relative w-full rounded-full bg-muted overflow-hidden"
          style={{ height: barHeight }}>
          <SegmentFlex width={perc.home} color={colors.home} label={`${toPct(perc.home)}`} />
          <SegmentFlex
            width={perc.draw}
            className="bg-foreground/15"
            label={`${toPct(perc.draw)}`}
          />
          <SegmentFlex width={perc.away} color={colors.away} label={`${toPct(perc.away)}`} />
        </div>

        <div className="mt-2 grid grid-cols-3 text-xs font-medium">
          <span className="justify-self-start truncate">{abbreviateTeamName(teams.home.name)}</span>
          <span className="justify-self-center opacity-80">Empate</span>
          <span className="justify-self-end truncate">{abbreviateTeamName(teams.away.name)}</span>
        </div>
      </div>
    </section>
  )
}

type SegmentProps = {
  width: number
  className?: string
  label?: string
  color?: string
}

function SegmentFlex({ width, className, label, color }: SegmentProps) {
  const w = Math.max(0, Math.min(100, width))
  return (
    <div
      className={`h-full relative inline-block align-top ${className ?? ''}`}
      style={{ width: `${w}%`, backgroundColor: color }}>
      {w >= 10 && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
          {label}
        </span>
      )}
    </div>
  )
}
