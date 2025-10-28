'use client'

import { useMemo, useState } from 'react'
import type { MatchHistory } from '@/modules/football/domain/entities/Predictions'
import {
  formatDate,
  findLogo,
  findName,
  inferTeams,
  safeNum,
  summarize,
  teamGoalsById,
  teamNameById,
} from '../../utils/h2h'
import { abbreviateTeamName } from '@/shared/lib/utils'
import Image from 'next/image'

type Props = {
  h2h: MatchHistory[]
  homeId: number
  awayId: number
  initialCount?: number
}

export const H2HSection = ({ h2h, homeId, awayId, initialCount = 5 }: Props) => {
  const cleaned = useMemo(() => (h2h ?? []).filter(Boolean), [h2h])
  const sorted = useMemo(
    () => [...cleaned].sort((a, b) => b.fixture.timestamp - a.fixture.timestamp),
    [cleaned]
  )

  const [leftId, rightId] = useMemo(() => {
    if (homeId && awayId) return [homeId, awayId]
    const [a, b] = inferTeams(sorted)
    return [a?.id, b?.id]
  }, [homeId, awayId, sorted])

  const leftTeam = useMemo(
    () =>
      leftId
        ? { id: leftId, name: findName(sorted, leftId), logo: findLogo(sorted, leftId) }
        : undefined,
    [sorted, leftId]
  )
  const rightTeam = useMemo(
    () =>
      rightId
        ? { id: rightId, name: findName(sorted, rightId), logo: findLogo(sorted, rightId) }
        : undefined,
    [sorted, rightId]
  )

  const { leftWins, rightWins, draws } = useMemo(
    () => summarize(sorted, leftId, rightId),
    [sorted, leftId, rightId]
  )

  const [expanded, setExpanded] = useState(false)
  const list = expanded ? sorted : sorted.slice(0, initialCount)

  return (
    <div className="mt-4">
      <section className="rounded-md shadow-sm">
        <div className="px-2 bg-muted/40 rounded-t-md">
          <div className="flex justify-between items-center gap-2 py-3">
            <div className="flex items-center gap-2">
              <TeamLogo name={leftTeam?.name} logo={leftTeam?.logo} />
              <div className="text-xs font-semibold">{leftWins} Triunfos</div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-amber-500 text-white">E</Badge>
              <div className="text-xs font-semibold">{draws} Empates</div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <div className="text-xs font-semibold">{rightWins} Triunfos</div>
              <TeamLogo name={rightTeam?.name} logo={rightTeam?.logo} />
            </div>
          </div>
        </div>

        <div className="px-2 pb-2">
          <ul className="divide-y divide-muted ">
            {list.map((m) => {
              const leftName = teamNameById(m, leftId)
              const rightName = teamNameById(m, rightId)
              const leftGoals = teamGoalsById(m, leftId)
              const rightGoals = teamGoalsById(m, rightId)

              const leftBold = (leftGoals ?? 0) > (rightGoals ?? 0)
              const rightBold = (rightGoals ?? 0) > (leftGoals ?? 0)

              return (
                <li
                  key={m.fixture.id}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3">
                  <div className="text-xs font-medium">{abbreviateTeamName(leftName)}</div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[11px] opacity-80 text-center">
                      {m.league.name} · {formatDate(m.fixture.date)}
                    </div>
                    <div className="text-base font-bold">
                      <span className={leftBold ? 'font-extrabold' : 'opacity-80'}>
                        {safeNum(leftGoals)}
                      </span>{' '}
                      <span className="opacity-60">—</span>{' '}
                      <span className={rightBold ? 'font-extrabold' : 'opacity-80'}>
                        {safeNum(rightGoals)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-medium text-right">
                    {abbreviateTeamName(rightName)}
                  </div>
                </li>
              )
            })}
          </ul>

          {sorted.length > initialCount && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="w-full text-center py-2 text-xs font-semibold hover:text-primary cursor-pointer">
              {expanded ? 'VER MENOS ▲' : 'VER MÁS ▼'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

const TeamLogo = ({ name, logo }: { name?: string; logo?: string }) =>
  logo ? (
    <span className="inline-flex items-center gap-2">
      <div className="relative w-5 h-5">
        <Image src={logo} alt={name ?? ''} fill className="object-contain" sizes="20px" />
      </div>
    </span>
  ) : null

const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${className}`}>
    {children}
  </span>
)
