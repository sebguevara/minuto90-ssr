'use client'

import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { useFixtures } from '@/modules/football/presentation/hooks/use-fixtures'
import { ErrorMessage } from '@/modules/core/components/errors/ErrorMessage'
import { MatchListSkeleton } from '@/modules/core/components/loadings/MatchListSkeleton'
import { PreviewMatches } from '../components/client/fixtures/PreviewMatches'
import { Sidebar } from 'lucide-react'

interface FixturesViewProps {
  initialFixtures: LeagueFixtures[]
  dateParam: string
}

export function FixturesView({ initialFixtures, dateParam }: FixturesViewProps) {

  const { data: fixtures, isLoading, isError, refetch } = useFixtures({
    dateParam,
    initialData: initialFixtures,
  })
  
  if (isError) {
    return (
      <ErrorMessage
        title="Error al cargar partidos"
        message="No pudimos cargar los partidos. Por favor, intenta de nuevo."
        onRetry={() => refetch()}
      />
    )
  }

  if (isLoading) {
    return <MatchListSkeleton />
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <aside className="hidden lg:block w-max shrink-0 sticky top-[90px] self-start">
        {/* <Sidebar leaguesByCountry={leaguesByCountry} /> */}
      </aside>
    <div className="flex-1">
        <PreviewMatches initialFixtures={fixtures ?? []} />
    </div>
    </div>
  )
}