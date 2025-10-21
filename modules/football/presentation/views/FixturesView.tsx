'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { useFixtures } from '@/modules/football/presentation/hooks/use-fixtures'
import { ErrorMessage } from '@/modules/core/components/errors/ErrorMessage'
import { MatchListSkeleton } from '@/modules/core/components/loadings/MatchListSkeleton'
import { PreviewMatches } from '../components/client/fixtures/PreviewMatches'
import { Sidebar } from 'lucide-react'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { useSearchStore } from '@/modules/core/store/useSearchStore'
import { strip } from '@/lib/utils'
import { PRESELECTED_LEAGUES } from '@/lib/consts/football/leagues'

interface FixturesViewProps {
  initialFixtures: LeagueFixtures[]
  dateParam: string
}

const parseQueryParam = (param: string | null) => param === '1' || param === 'true'

export function FixturesView({ initialFixtures, dateParam: initialDateParam }: FixturesViewProps) {
  const searchParams = useSearchParams()
  const { query, setContext } = useSearchStore()
  const { favoriteMatches } = useFavoriteStore()

  const [date, setDate] = useState(initialDateParam)
  const [liveOnly, setLiveOnly] = useState(() => parseQueryParam(searchParams.get('live')))
  const [scheduledOnly, setScheduledOnly] = useState(() =>
    parseQueryParam(searchParams.get('scheduled'))
  )
  const [finishedOnly, setFinishedOnly] = useState(() =>
    parseQueryParam(searchParams.get('finished'))
  )
  const [favoritesOnly, setFavoritesOnly] = useState(() =>
    parseQueryParam(searchParams.get('favorites'))
  )
  const [showOdds, setShowOdds] = useState(() => parseQueryParam(searchParams.get('odds')))
  const [isExpanded, setIsExpanded] = useState(false)

  const { data: fixtures, isLoading, isError, refetch } = useFixtures({
    dateParam: date,
    initialData: date === initialDateParam ? initialFixtures : undefined,
  })

  useEffect(() => {
    setContext('home')
    return () => setContext(null)
  }, [setContext])

  const filteredLeagues = useMemo(() => {
    if (!fixtures) return []
    let leagues = fixtures
    
    if (favoritesOnly) {
      const favoriteMatchIds = new Set(Object.keys(favoriteMatches).map(Number))
      leagues = leagues
        .map((league) => ({
          ...league,
          matches: league.matches.filter((match) =>
            favoriteMatchIds.has(parseInt(match.id, 10))
          ),
        }))
        .filter((league) => league.matches.length > 0)
    } else if (liveOnly) {
      leagues = leagues
        .map((league) => ({
          ...league,
          matches: league.matches.filter((m) => !['FT', 'NS', 'PST', 'CANC'].includes(m.status)),
        }))
        .filter((league) => league.matches.length > 0)
    } else if (scheduledOnly) {
      leagues = leagues
        .map((league) => ({ ...league, matches: league.matches.filter((m) => m.status === 'NS') }))
        .filter((league) => league.matches.length > 0)
    } else if (finishedOnly) {
      leagues = leagues
        .map((league) => ({ ...league, matches: league.matches.filter((m) => m.status === 'FT') }))
        .filter((league) => league.matches.length > 0)
    }
    
    const strippedQuery = strip(query);
    if (strippedQuery) {
        leagues = leagues.map(league => ({
            ...league,
            matches: league.matches.filter(match => 
                strip(league.name).includes(strippedQuery) ||
                strip(match.localTeam.name).includes(strippedQuery) ||
                strip(match.visitorTeam.name).includes(strippedQuery)
            )
        })).filter(league => league.matches.length > 0);
    }

    leagues.sort((a, b) => {
        const aIsPreselected = PRESELECTED_LEAGUES.includes(a.id);
        const bIsPreselected = PRESELECTED_LEAGUES.includes(b.id);
        if (aIsPreselected && !bIsPreselected) return -1;
        if (!aIsPreselected && bIsPreselected) return 1;
        return (a.country?.name || 'zzz').localeCompare(b.country?.name || 'zzz');
    });
    
    return leagues
  }, [fixtures, liveOnly, scheduledOnly, finishedOnly, favoritesOnly, favoriteMatches, query])

  const renderContent = () => {
    if (isLoading) {
      return <MatchListSkeleton />
    }

    if (filteredLeagues.length === 0) {
      return (
        <div className="flex flex-col gap-2 w-full items-center py-4 mt-14 lg:mt-0">
          <p className="text-sm lg:text-base text-muted-foreground">
            No hay partidos disponibles para los filtros seleccionados
          </p>
        </div>
      )
    }

    // **Prioridad 3: Mostrar los partidos.**
    return (
      <PreviewMatches
        filteredLeagues={filteredLeagues}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        title={favoritesOnly ? 'Tus Favoritos' : 'Partidos'}
        date={date}
        setDate={setDate}
        liveOnly={liveOnly}
        setLiveOnly={setLiveOnly}
        scheduledOnly={scheduledOnly}
        setScheduledOnly={setScheduledOnly}
        finishedOnly={finishedOnly}
        setFinishedOnly={setFinishedOnly}
        favoritesOnly={favoritesOnly}
        setFavoritesOnly={setFavoritesOnly}
        showOdds={showOdds}
        setShowOdds={setShowOdds}
      />
    )
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Error al cargar partidos"
        message="No pudimos cargar los partidos. Por favor, intenta de nuevo."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <aside className="hidden lg:block w-max shrink-0 sticky top-[90px] self-start">
        {/* <Sidebar leaguesByCountry={leaguesByCountry} /> */}
      </aside>
      <div className="flex-1">{renderContent()}</div>
    </div>
  )
}