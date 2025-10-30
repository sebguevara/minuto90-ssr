'use client'

import React from 'react'
import { MatchDetails, MatchEvent, MatchTeam, TeamEvents } from '@/modules/football/domain/models/commentary'
import { EventsSection } from './EventsSection'
import { ShortSummary } from './ShortSummary'
import PredictionSection from './PredictionSection'
// import { Prediction } from '@/modules/football/domain/models/prediction'
import { Skeleton } from '@/modules/core/components/ui/skeleton'

type Props = {
  fixture: MatchDetails
}

export const SummarySection: React.FC<Props> = ({
  fixture,
}) => {

  return (
    <section className="flex flex-col">
      <header className="pt-4 mb-4">
        <h3 className="text-sm font-semibold">Resumen</h3>
      </header>
      {fixture.events.goals.length > 0 && (
        <>
          <ShortSummary
            key={fixture.match.localTeam.id + '-short'}
            events={fixture.events}
            homeTeamId={fixture.match.localTeam.id}
          />
          <EventsSection
            key={fixture.match.localTeam.id + '-events'}
            events={fixture.events}
            teams={[fixture.match.localTeam, fixture.match.visitorTeam]}
            status={fixture.match.status}
          />
        </>
      )}
      {/* {isLoading
        ? predictionSkeleton()
        : prediction &&
          prediction.fixtureId && (
            <PredictionSection
              key={prediction.fixtureId + '-prediction'}
              prediction={prediction}
              teams={teams}
              colors={colors}
            />
          )} */}
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
