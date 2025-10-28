'use client'

import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/core/components/ui/tabs'
import type { Prediction } from '@/modules/football/domain/entities/Predictions'
import type { StandingsLeague } from '@/modules/football/domain/entities/Standing'
import { findStanding } from '../../utils/detail'
import { H2HSection } from './h2hSection'
import { TeamDetailsTabContent } from './TeamDetailsTabContent'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'

type Props = {
  prediction: Prediction
  standings?: StandingsLeague[]
  homeId: number
  awayId: number
  leagueId: number
  leagueName: string
}

export const DetailsSection = ({
  prediction,
  standings,
  homeId,
  awayId,
  leagueId,
  leagueName,
}: Props) => {
  const left = prediction?.teams?.home
  const right = prediction?.teams?.away

  const leftStand = useMemo(() => findStanding(standings, homeId), [standings, homeId])
  const rightStand = useMemo(() => findStanding(standings, awayId), [standings, awayId])

  return (
    <section className="rounded-md">
      <header className="pt-4 pb-2">
        <h3 className="text-sm font-semibold">Detalles</h3>
      </header>

      <Tabs defaultValue="home" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home">
            <div className="relative w-5 h-5 rounded-sm">
              <ImageWithRetry
                src={left?.logo}
                alt={left?.name}
                fill
                sizes="100px"
                priority
                className="object-contain"
              />
            </div>
            {left?.name ?? 'Local'}
          </TabsTrigger>
          <TabsTrigger value="away">
            <div className="relative w-5 h-5 rounded-sm">
              <ImageWithRetry
                src={right?.logo}
                alt={right?.name}
                fill
                sizes="100px"
                priority
                className="object-contain"
              />
            </div>
            {right?.name ?? 'Visitante'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <TeamDetailsTabContent
            teamData={left}
            teamStanding={leftStand}
            teamId={homeId}
            leagueId={leagueId}
            leagueName={leagueName}
          />
        </TabsContent>
        <TabsContent value="away">
          <TeamDetailsTabContent
            teamData={right}
            teamStanding={rightStand}
            teamId={awayId}
            leagueId={leagueId}
            leagueName={leagueName}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <H2HSection h2h={prediction?.h2h} homeId={homeId} awayId={awayId} />
      </div>
    </section>
  )
}
