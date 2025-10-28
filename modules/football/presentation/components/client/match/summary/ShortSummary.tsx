'use client'

import React from 'react'
import { MatchEvent } from '@football/domain/entities/Match'
import { formatMinute } from '../../utils/summary'
import { Square } from 'lucide-react'

type Props = {
  events: MatchEvent[]
  homeTeamId: number
}

export const ShortSummary: React.FC<Props> = ({ events, homeTeamId }) => {
  const isGoal = (e: MatchEvent) => e.type === 'Goal' && e.detail !== 'Missed Penalty'
  const isRed = (e: MatchEvent) =>
    e.type === 'Card' && (e.detail || '').toLowerCase().includes('red')

  const split = (pred: (e: MatchEvent) => boolean) => {
    const sort = (a: MatchEvent, b: MatchEvent) =>
      a.time.elapsed - b.time.elapsed || (a.time.extra ?? 0) - (b.time.extra ?? 0)

    const home = events.filter((e) => e.team.id === homeTeamId && pred(e)).sort(sort)
    const away = events.filter((e) => e.team.id !== homeTeamId && pred(e)).sort(sort)

    return { home, away }
  }

  const goals = split(isGoal)
  const reds = split(isRed)

  const hasAnything = goals.home.length || goals.away.length || reds.home.length || reds.away.length

  if (!hasAnything) return null

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-border bg-card p-1 space-y-3 shadow-lg">
        {(goals.home.length > 0 || goals.away.length > 0) && (
          <CenterIconRow
            icon={<span>⚽</span>}
            left={groupGoalsByPlayer(goals.home)}
            right={groupGoalsByPlayer(goals.away)}
          />
        )}

        {(reds.home.length > 0 || reds.away.length > 0) && (
          <CenterIconRow
            icon={<RedCard />}
            left={reds.home.map(fmtRed)}
            right={reds.away.map(fmtRed)}
          />
        )}
      </div>
    </div>
  )
}

const CenterIconRow = ({
  icon,
  left,
  right,
}: {
  icon: React.ReactNode
  left: string[]
  right: string[]
}) => (
  <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
    <ul className="text-right space-y-0.5">
      {left.map((t, i) => (
        <li key={`l-${i}`} className="text-xs">
          {t}
        </li>
      ))}
    </ul>

    <div className="flex items-center justify-center px-2">{icon}</div>

    <ul className="text-left space-y-0.5">
      {right.map((t, i) => (
        <li key={`r-${i}`} className="text-xs">
          {t}
        </li>
      ))}
    </ul>
  </div>
)

const RedCard = () => (
  <Square width={14} height={14} style={{ fill: '#e53935', color: 'transparent' }} />
)

const isPenalty = (e: MatchEvent) => (e.detail || '').toLowerCase().includes('pen')

function groupGoalsByPlayer(goals: MatchEvent[]): string[] {
  const map = new Map<string, MatchEvent[]>()
  const filteredGoals = goals.filter((g) => g.time.elapsed < 120)

  for (const g of filteredGoals) {
    const key = String(g.player?.id ?? g.player?.name ?? Math.random())
    const arr = map.get(key)
    if (arr) arr.push(g)
    else map.set(key, [g])
  }

  const lines: string[] = []

  for (const [, arr] of map) {
    arr.sort((a, b) => a.time.elapsed - b.time.elapsed || (a.time.extra ?? 0) - (b.time.extra ?? 0))

    const name = arr[0].player?.name ?? ''
    let firstPenaltyUsed = false

    const minutes = arr.map((e) => {
      const m = formatMinute(e.time)
      if (isPenalty(e) && !firstPenaltyUsed) {
        firstPenaltyUsed = true
        return `${m} (P)`
      }
      return m
    })

    lines.push(`${name} ${minutes.join(', ')}`.trim())
  }

  return lines
}

const fmtRed = (e: MatchEvent) => `${e.player?.name ?? '—'} ${formatMinute(e.time)}`.trim()
