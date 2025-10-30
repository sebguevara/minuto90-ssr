'use client'

import React from 'react'
import { MatchEvent } from '@/modules/football/domain/models/commentary'
import { Square } from 'lucide-react'
import { TeamEvents } from '@/modules/football/domain/models/commentary'
import { formatMinute } from '@/modules/football/presentation/utils/summary'

type Props = {
  events: TeamEvents
  homeTeamId: string
}

export const ShortSummary: React.FC<Props> = ({ events, homeTeamId }) => {
  const isGoal = (e: MatchEvent) => e.comment === 'Goal'
  const isRed = (e: MatchEvent) => e.comment === 'Red Card'

  const split = (pred: (e: MatchEvent) => boolean) => {
    const sort = (a: MatchEvent, b: MatchEvent) =>
      Number(a.minute) - Number(b.minute) || (Number(a.extra_min ?? 0) - Number(b.extra_min ?? 0))

    const home = events.goals.filter((e) => e.teamId === homeTeamId && pred(e)).sort(sort)
    const away = events.goals.filter((e) => e.teamId !== homeTeamId && pred(e)).sort(sort)

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

const isPenalty = (e: MatchEvent) => (e.comment || '').toLowerCase().includes('pen')

function groupGoalsByPlayer(goals: MatchEvent[]): string[] {
  const map = new Map<string, MatchEvent[]>()
  const filteredGoals = goals.filter((g) => Number(g.minute) < 120)

  for (const g of filteredGoals) {
    const key = String(g.name ?? Math.random())
    const arr = map.get(key)
    if (arr) arr.push(g)
    else map.set(key, [g])
  }

  const lines: string[] = []

  for (const [, arr] of map) {
    arr.sort((a, b) => Number(a.minute) - Number(b.minute) || (Number(a.extra_min ?? 0) - Number(b.extra_min ?? 0)))

    const name = arr[0].name ?? ''
    let firstPenaltyUsed = false

    const minutes = arr.map((e) => {
      const m = formatMinute({ elapsed: Number(e.minute), extra: Number(e.extra_min ?? 0) })
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

const fmtRed = (e: MatchEvent) => `${e.name ?? '—'} ${formatMinute({ elapsed: Number(e.minute), extra: Number(e.extra_min ?? 0) })}`.trim()
