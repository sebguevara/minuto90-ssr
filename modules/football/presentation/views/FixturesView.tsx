'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { useFixtures } from '@/modules/football/presentation/hooks/use-fixtures'
import { ErrorMessage } from '@/modules/core/components/errors/ErrorMessage'
import { MatchListSkeleton } from '@/modules/core/components/loadings/MatchListSkeleton'
import { PreviewMatches } from '../components/client/fixtures/PreviewMatches'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { useSearchStore } from '@/modules/core/store/useSearchStore'
import { strip, getBrowserTimezone, getTodayDate, formatDate, formatTime } from '@/lib/utils'
import { PRESELECTED_LEAGUES, leaguePriority } from '@/lib/consts/football/leagues'
import { Sidebar } from '../components/client/sidebar/Sidebar'
import { FixturesSkeleton } from '../components/skeletons/FixturesSkeleton'

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
  const [timezone] = useState(() => getBrowserTimezone())

  const { data: fixtures, isLoading, isError, isFetching, refetch } = useFixtures({
    dateParam: date,
    initialData: date === initialDateParam ? initialFixtures : undefined,
  })

  useEffect(() => {
    setContext('home')
    return () => setContext(null)
  }, [setContext])

  const processedFixtures = useMemo(() => {
    if (!fixtures) return []

    const today = getTodayDate()

    return fixtures.map((league) => ({
      ...league,
      matches: league.matches
        .map((match) => {
          if (!match.date || !match.time) return match

          try {
            const formattedDate = match.date.split('.').reverse().join('-')
            const utcDate = new Date(`${formattedDate}T${match.time}Z`)

            if (isNaN(utcDate.getTime())) {
              console.warn(
                `Fecha inválida detectada para el partido ID ${match.id}: ${match.date} ${match.time}`
              )
              return { ...match, time: '--:--' }
            }

            const localDate = formatDate(utcDate, timezone)
            const localTime = formatTime(utcDate, timezone)

            return {
              ...match,
              date: localDate,
              time: localTime,
            }
          } catch (e) {
            console.error(`Error al procesar la fecha para el partido ID ${match.id}:`, e)
            return { ...match, time: '--:--' }
          }
        })
        .filter((match) => {
          if (date === 'home') {
            return match.date === today
          }
          return true
        }),
    })).filter((league) => league.matches.length > 0)
  }, [fixtures, timezone, date])

  const filteredLeagues = useMemo(() => {
    if (!processedFixtures) return []
    let leagues = processedFixtures

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
          matches: league.matches.filter((m) => m.statusConfig?.type === 'live'),
        }))
        .filter((league) => league.matches.length > 0)
    } else if (scheduledOnly) {
      leagues = leagues
        .map((league) => ({ 
          ...league, 
          matches: league.matches.filter((m) => 
            m.statusConfig?.type === 'scheduled' || ['NS', 'TBD'].includes(m.status)
          ) 
        }))
        .filter((league) => league.matches.length > 0)
    } else if (finishedOnly) {
      leagues = leagues
        .map((league) => ({ 
          ...league, 
          matches: league.matches.filter((m) => 
            m.statusConfig?.type === 'finished' || ['FT', 'AET', 'PEN'].includes(m.status)
          ) 
        }))
        .filter((league) => league.matches.length > 0)
    }

    const strippedQuery = strip(query)
    if (strippedQuery) {
      leagues = leagues
        .map((league) => ({
          ...league,
          matches: league.matches.filter(
            (match) =>
              strip(league.name).includes(strippedQuery) ||
              strip(match.localTeam.name).includes(strippedQuery) ||
              strip(match.visitorTeam.name).includes(strippedQuery)
          ),
        }))
        .filter((league) => league.matches.length > 0)
    }

    leagues.sort((a, b) => {
      const leagueAId = Number(a.id);
      const leagueBId = Number(b.id);
      
      const priorityA = leaguePriority[leagueAId] ?? Infinity;
      const priorityB = leaguePriority[leagueBId] ?? Infinity;

      return priorityA - priorityB;
    });

    return leagues;
  }, [processedFixtures, liveOnly, scheduledOnly, finishedOnly, favoritesOnly, favoriteMatches, query])

  const renderContent = () => {
    const isLoadingNewData = date !== initialDateParam && isFetching
    const hasNoFixtures = !fixtures
    const isLoadingInitialData = isLoading && hasNoFixtures
    const showSkeleton = isLoadingInitialData || isLoadingNewData
    
    if (showSkeleton) {
      return <FixturesSkeleton />
    }

    return (
      <PreviewMatches
        filteredLeagues={filteredLeagues}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        title={favoritesOnly ? 'Tus Favoritos' : 'Resultados'}
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
        <Sidebar />
      </aside>
      <div className="flex-1">{renderContent()}</div>
    </div>
  )
}