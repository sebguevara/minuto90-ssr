'use client'

import React from 'react'
import { MatchEvent, MatchPreviewStatus } from '@football/domain/entities/Match'
import { EventsSection } from './EventsSection'
import { ShortSummary } from './ShortSummary'
import PredictionSection from './PredictionSection'
import { Prediction } from '@/modules/football/domain/entities/Predictions'
import { Team } from '@football/domain/entities/Team'
import { Skeleton } from '@/modules/core/components/ui/skeleton'

type Props = {
  events: MatchEvent[]
  prediction: Prediction
  teams: { home: Team; away: Team }
  colors: { home: string; away: string }
  homeTeamId: number
  isLoading: boolean
  status: MatchPreviewStatus
}

export const SummarySection: React.FC<Props> = ({
  events,
  prediction,
  teams,
  homeTeamId,
  colors,
  isLoading,
  status,
}) => {
  const filteredEvents = events.filter((event) => event.player.name !== null)

  return (
    <section className="flex flex-col">
      <header className="pt-4 mb-4">
        <h3 className="text-sm font-semibold">Resumen</h3>
      </header>
      {filteredEvents.length > 0 && (
        <>
          <ShortSummary
            key={homeTeamId + '-short'}
            events={filteredEvents}
            homeTeamId={homeTeamId}
          />
          <EventsSection
            key={homeTeamId + '-events'}
            events={filteredEvents}
            homeTeamId={homeTeamId}
            status={status}
          />
        </>
      )}
      {isLoading
        ? predictionSkeleton()
        : prediction &&
          prediction.fixtureId && (
            <PredictionSection
              key={prediction.fixtureId + '-prediction'}
              prediction={prediction}
              teams={teams}
              colors={colors}
            />
          )}
    </section>
  )
}

const predictionSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2 pt-4">
      <Skeleton className="w-full h-40" />
    </div>
  )
}
