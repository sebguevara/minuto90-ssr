'use client'

import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '@/modules/core/components/ui/scroll-area'
import type { StandingRow } from '@/modules/football/domain/entities/Standing'
import {
  cx,
  formatMinuteKey,
  minuteArraysForScope,
  totalGoals,
  MINUTE_KEYS,
} from '../../utils/detail'
import { LastFixtures } from './LastFixtures'
import { CompactStrip } from './CompactStrip'
import { StandingRowCard } from './StandingRowCard'
import { TeamDetails } from '@/modules/football/domain/entities/Predictions'

type Props = {
  teamData: TeamDetails | undefined
  teamStanding: StandingRow | null | undefined
  teamId: number
  leagueId: number
  leagueName: string
}

export const TeamDetailsTabContent = ({
  teamData,
  teamStanding,
  teamId,
  leagueId,
  leagueName,
}: Props) => {
  const [scope, setScope] = useState<'total' | 'home' | 'away'>('total')

  const { forArr, agaArr } = useMemo(() => minuteArraysForScope(teamData, scope), [teamData, scope])
  const maxFor = useMemo(() => Math.max(...forArr, 1), [forArr])
  const maxAga = useMemo(() => Math.max(...agaArr, 1), [agaArr])

  const forTotal = totalGoals(teamData, 'for', scope)
  const agaTotal = totalGoals(teamData, 'against', scope)

  return (
    <div className="space-y-5 mt-4">
      <div className="flex gap-x-4 flex-col md:flex-row md:h-[240px]">
        {/* Goal Distribution */}
        <div className="flex-1 rounded-lg border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/40">
            <div className="text-sm font-semibold">Distribución de goles</div>
            <div className="flex items-center gap-1">
              {(['total', 'home', 'away'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setScope(k)}
                  className={cx(
                    'text-[10px] px-2 py-[6px] rounded-full border',
                    scope === k
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted border-border'
                  )}>
                  {k === 'total' ? 'Todos' : k === 'home' ? 'Local' : 'Visitante'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 h-full">
            <div className="flex flex-row justify-center gap-x-8 lg:px-4 lg:w-full lg:items-center">
              <CompactStrip
                forTotal={forTotal}
                agaTotal={agaTotal}
                forArr={forArr}
                agaArr={agaArr}
                maxFor={maxFor}
                maxAga={maxAga}
                totalsSide="left"
              />
            </div>
            <ScrollArea className="w-full flex items-center justify-center mt-auto">
              <div className="flex justify-center lg:justify-end lg:pl-0 lg:pr-4 pl-6 gap-x-[3px] lg:gap-x-[3.5px]">
                {MINUTE_KEYS.map((k) => (
                  <span key={k} className="text-[10px] opacity-70 w-6 text-center">
                    {formatMinuteKey(k)}
                  </span>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-lg border border-border/60 mt-5 md:mt-0 overflow-hidden">
          <div className="px-3 py-3 w-full bg-muted/40 text-sm font-semibold flex-shrink-0">
            Clasificación pre-partido
          </div>
          <div className="flex-grow flex items-center justify-center">
            <StandingRowCard
              team={{
                name: teamData?.name ?? '',
                logo: teamData?.logo ?? '',
                form: teamData?.league?.form,
              }}
              standing={teamStanding ?? undefined}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LastFixtures
          teamId={teamId}
          leagueId={leagueId}
          title={`Últimos partidos en ${leagueName}`}
          fixtureSet="lastFixtures"
        />
        <LastFixtures teamId={teamId} title={`Últimos partidos`} fixtureSet="lastFixtures" />
      </div>
    </div>
  )
}
