'use client'

import type { MatchStatistics, StatEntry } from '@/modules/football/domain/entities/stats'
import { GROUPS, LABELS, NEGATIVE_STATS } from '../../const/stats'
import { parseVal, toMap } from '../../utils/stats'

type Props = {
  statistics: MatchStatistics[]
}

const IS_PERCENT = new Set<StatEntry['type']>(['Ball Possession', 'Passes %'])

export const StatsSection = ({ statistics }: Props) => {
  const home = statistics?.[0]?.statistics ?? []
  const away = statistics?.[1]?.statistics ?? []

  const mapHome = toMap(home)
  const mapAway = toMap(away)

  const rows: Row[] = []
  const allTypes = new Set<StatEntry['type']>([
    ...Object.keys(mapHome),
    ...Object.keys(mapAway),
  ] as StatEntry['type'][])

  allTypes.forEach((t) => {
    const lh = mapHome[t]
    const rh = mapAway[t]
    const left = parseVal(lh?.value)
    const right = parseVal(rh?.value)
    if (left === null && right === null) return

    rows.push({
      type: t,
      label: LABELS[t] ?? t,
      left,
      right,
      isPercent: IS_PERCENT.has(t),
      lowerIsBetter: NEGATIVE_STATS.has(t),
    })
  })

  if (!rows.length) {
    return (
      <section className="rounded-md border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2">Estadísticas del Partido</h3>
        <p className="text-sm opacity-70">No hay estadísticas disponibles.</p>
      </section>
    )
  }

  return (
    <div className="mt-4">
      <header className="pb-2">
        <h3 className="text-sm font-semibold">Estadísticas del Partido</h3>
      </header>
      <section className="rounded-md">
        <div className="pb-4 space-y-4">
          {GROUPS.map((g) => {
            const groupRows = g.keys
              .map((k) => rows.find((r) => r.type === k))
              .filter(Boolean) as Row[]
            if (!groupRows.length) return null

            return (
              <div
                key={g.title}
                className="overflow-hidden rounded-lg divide-y divide-muted shadow-sm">
                <div className="px-3 py-2 text-xs font-semibold tracking-wide bg-muted/60">
                  {g.title}
                </div>

                <ul className="divide-y divide-muted">
                  {groupRows.map((r) => (
                    <li
                      key={r.type}
                      className="flex flex-col gap-2 px-3 py-2 border-b border-gray-300 dark:border-gray-700">
                      <CellBar
                        left={r.left}
                        right={r.right}
                        isPercent={r.isPercent}
                        label={r.label}
                        lowerIsBetter={r.lowerIsBetter}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

type Row = {
  type: StatEntry['type']
  label: string
  left: number | null
  right: number | null
  isPercent: boolean
  lowerIsBetter: boolean
}

const CellBar = ({
  left,
  right,
  isPercent,
  label,
}: {
  left: number | null
  right: number | null
  isPercent: boolean
  label: string
  lowerIsBetter: boolean
}) => {
  if (left === null && right === null) {
    return <div className="flex justify-between text-xs opacity-70">—</div>
  }

  const total = (left ?? 0) + (right ?? 0)
  const leftPct = total > 0 ? ((left ?? 0) / total) * 100 : 50
  const rightPct = total > 0 ? ((right ?? 0) / total) * 100 : 50

  const formatVal = (v: number | null) => (v === null ? '—' : isPercent ? `${v}%` : `${v}`)

  return (
    <div className="flex flex-col w-full gap-y-2 py-1">
      <div className="flex justify-between text-xs font-medium">
        <span>{formatVal(left)}</span>
        <span>{label}</span>
        <span>{formatVal(right)}</span>
      </div>

      <div className="flex w-full h-2 md:h-3 rounded overflow-hidden bg-muted">
        <div className="bg-primary/80 transition-all" style={{ width: `${leftPct}%` }} />
        <div
          className="bg-gray-400 dark:bg-gray-600 transition-all"
          style={{ width: `${rightPct}%` }}
        />
      </div>
    </div>
  )
}
