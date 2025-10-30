'use client'

import { useEffect, useMemo, useState } from 'react'
import { MatchPreviewSection } from '@/modules/football/presentation/components/client/match/MatchPreview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/core/components/ui/tabs'
import { LineupSection } from '@/modules/football/presentation/components/client/match/lineup/LineupSection'
import { OddsSection } from '@/modules/football/presentation/components/client/match/odds/OddsSection'
import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { buildSquadUI } from '@/modules/football/presentation/utils/buildSquadUI'
import { SummarySection } from '@/modules/football/presentation/components/client/match/summary/SumarySection'
import { StatsSection } from '@/modules/football/presentation/components/client/match/stats/statsSection'
import { hasSomeStat, hasSomeXI } from '@/modules/football/presentation/utils/main'
import { GoBack } from '@/modules/football/presentation/components/client/match/GoBack'
import { DetailsSection } from '@/modules/football/presentation/components/client/match/details/DetailSection'
import { ScrollArea, ScrollBar } from '@/modules/core/components/ui/scroll-area'
import { StandingPreviewSection } from '@/modules/football/presentation/components/client/match/standing/StandingPreviewSection'
import { Match } from '@/modules/football/domain/models/fixture'
import { MatchDetails } from '../../domain/models/commentary'
import { getStatusConfig } from '@/lib/utils'

interface Props {
  id: string
  leagueId: string
  fixture: MatchDetails
  // predictions: Prediction
  // standings: StandingsLeague[]
  // homeSquad: Player[]
  // awaySquad: Player[]
  // isLoading: boolean
  // isPredictionsLoading: boolean
}

export default function MatchView({ id, leagueId, fixture }: Props) {
  const [data, setData] = useState<MatchDetails | null>(fixture ?? null)

  useEffect(() => {
    setData(fixture ?? null)
  }, [id, leagueId])

  console.log(data)

  const isReady = !!data

  const hasStats = useMemo(() => (data ? hasSomeStat(data.stats) : false), [data])
  const hasLineup = useMemo(() => (data ? hasSomeXI(data.lineups) : false), [data])
  // const hasStandings = useMemo(
  //   () => fixture?.tournament.id,
  //   [fixture?.tournament.id]
  // )

  const dynamicTabs = useMemo(
    () =>
      [
        { id: '1', label: 'Resumen', value: 'summary' },
        { id: 'x', label: 'Detalles', value: 'details' },
        ...(hasStats ? [{ id: '2', label: 'Estadísticas', value: 'statistics' }] : []),
        ...(hasLineup ? [{ id: '3', label: 'Alineaciones', value: 'lineup' }] : []),
        // ...(hasStandings ? [{ id: '5', label: 'Posiciones', value: 'standing' }] : []),
        { id: '4', label: 'Cuotas', value: 'odds' },
      ] as const,
    [hasStats, hasLineup]
  )

  const tabValues = useMemo(() => dynamicTabs.map((t) => t.value), [dynamicTabs])
  const dynamicTabsKey = useMemo(() => tabValues.join('|'), [tabValues])
  const [tab, setTab] = useState<string>(dynamicTabs[0]?.value ?? 'summary')

  useEffect(() => {
    const first = dynamicTabs[0]?.value ?? 'summary'
    let urlTab: string | null = null
    if (typeof window !== 'undefined') {
      urlTab = new URLSearchParams(window.location.search).get('tab')
    }
    setTab(urlTab && tabValues.includes(urlTab) ? urlTab : first)
  }, [dynamicTabsKey])

  const onTabChange = (next: string) => {
    const applyChange = () => {
      setTab(next)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const first = dynamicTabs[0]?.value ?? 'summary'
        if (next === first) url.searchParams.delete('tab')
        else url.searchParams.set('tab', next)
        history.replaceState(null, '', url.toString())
      }
    }

    // Usar View Transitions API para animar el cambio de pestaña si está disponible
    // @ts-ignore - startViewTransition aún no está en los tipos estándar
    if (typeof document !== 'undefined' && document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(applyChange)
    } else {
      applyChange()
    }
  }

  useEffect(() => {
    if (!data) return
    const status = getStatusConfig(data.match.status)
    const isLive = status.type === 'live'
    if (!isLive) return

    let cancelled = false
    const fetchUpdate = async () => {
      try {
        const res = await fetch(`/api/football/commentary/${id}?leagueId=${leagueId}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const next: MatchDetails = await res.json()
        if (!cancelled) setData(next)
      } catch (_) {
      }
    }

    fetchUpdate()
    const intervalId = setInterval(fetchUpdate, 15000)
    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [data?.match.status, id, leagueId])

  if (!isReady) {
    return (
      <div
        key={id}
        className="relative container mx-auto min-h-screen w-full flex flex-col p-2 md:px-0">
        <GoBack className="top-[46px] left-2" />
        <div className="flex flex-col gap-4 mt-20 md:mt-8">
          <Skeleton className="w-full h-44 md:h-50" />
        </div>
        <div className="flex gap-4 mt-6">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <Skeleton className="w-24 h-6 md:w-32 md:h-8" />
          <Skeleton className="w-full h-44 md:h-50" />
        </div>
      </div>
    )
  }

  // const homeUI = buildSquadUI(fixture.lineup.home, fixture.teams.home, fixture.events, homeSquad)
  // const awayUI = buildSquadUI(fixture.lineup.away, fixture.teams.away, fixture.events, awaySquad)

  return (
    <div
      className="relative container mx-auto w-full flex flex-col p-2 md:p-0"
      suppressHydrationWarning>
      <GoBack className="top-[46px] left-2" />
      {data && <MatchPreviewSection fixture={data} />}

      <div className="w-full flex items-center mt-4">
        <Tabs value={tab} onValueChange={onTabChange} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="w-full min-w-max p-0 justify-start border-b rounded-none bg-background">
              {dynamicTabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.value}
                  className="rounded-none h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary">
                  <span className="text-[13px]">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-0.5" />
          </ScrollArea>

          {dynamicTabs.map((t) => (
            <TabsContent key={t.id} value={t.value}>
              {t.value === 'summary' && data && (
                <SummarySection fixture={data} />
              )}

              {/* {t.value === 'details' && (
                <DetailsSection
                  prediction={predictions || ({} as Prediction)}
                  standings={standings}
                  homeId={fixture.teams.home.id}
                  awayId={fixture.teams.away.id}
                  leagueId={fixture.league.id}
                  leagueName={fixture.league.name}
                />
              )}

              {t.value === 'statistics' && (
                <StatsSection key={id} statistics={fixture.statistics} />
              )}

              {t.value === 'lineup' && (
                <LineupSection
                  key={id}
                  home={fixture.lineup.home}
                  away={fixture.lineup.away}
                  colors={colors}
                  homeUI={homeUI}
                  awayUI={awayUI}
                />
              )}

              {t.value === 'standing' && (
                <StandingPreviewSection
                  standings={standings}
                  homeId={fixture.teams.home.id}
                  awayId={fixture.teams.away.id}
                  leagueId={fixture.league.id}
                  leagueName={fixture.league.name}
                />
              )}
              {t.value === 'odds' && data && <OddsSection key={id} fixture={data.id} />} */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
