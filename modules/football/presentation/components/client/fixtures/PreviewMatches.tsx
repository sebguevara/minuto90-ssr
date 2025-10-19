'use client'

import { useState, useEffect, useMemo, MouseEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { LeagueFixtures, Match } from '@/modules/football/domain/models/fixture'
import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/modules/core/components/ui/accordion'
import { PreviewHeader } from './PreviewHeader'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { Heart } from 'lucide-react'
import { Button } from '@/modules/core/components/ui/button'
import Link from 'next/link'
import { useSearchStore } from '@/modules/core/store/useSearchStore'
import { PRESELECTED_LEAGUES } from '@/lib/consts/football/leagues'
import { generateSlug, getTodayDate, strip } from '@/lib/utils'
import Image from 'next/image'
import { CardMatch } from './CardMatch'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'

const LEAGUE_LIMIT = 30;

const parseQueryParam = (param: string | null) => param === '1' || param === 'true';

export const PreviewMatches = ({ initialFixtures }: { initialFixtures: LeagueFixtures[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { query, setContext } = useSearchStore();
  const { favoriteMatches, isLeagueFavorite, toggleFavoriteLeague } = useFavoriteStore();

  const [date, setDate] = useState(() => searchParams.get('date') || getTodayDate());
  const [liveOnly, setLiveOnly] = useState(() => parseQueryParam(searchParams.get('live')));
  const [scheduledOnly, setScheduledOnly] = useState(() => parseQueryParam(searchParams.get('scheduled')));
  const [finishedOnly, setFinishedOnly] = useState(() => parseQueryParam(searchParams.get('finished')));
  const [favoritesOnly, setFavoritesOnly] = useState(() => parseQueryParam(searchParams.get('favorites')));
  const [showOdds, setShowOdds] = useState(() => parseQueryParam(searchParams.get('odds')));
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>(PRESELECTED_LEAGUES);

  useEffect(() => {
    setContext('home');
    return () => setContext(null);
  }, [setContext]);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (date !== getTodayDate()) params.set('date', date);
    if (liveOnly) params.set('live', '1');
    if (scheduledOnly) params.set('scheduled', '1');
    if (finishedOnly) params.set('finished', '1');
    if (favoritesOnly) params.set('favorites', '1');
    if (showOdds) params.set('odds', '1');
    router.push(`?${params.toString()}`);
  }, [date, liveOnly, scheduledOnly, finishedOnly, favoritesOnly, showOdds, router]);

  const filteredLeagues = useMemo(() => {
    let leagues = initialFixtures;

    if (favoritesOnly) {
      const favoriteMatchIds = new Set(Object.keys(favoriteMatches).map(Number));
      leagues = leagues
        .map(league => ({
          ...league,
          matches: league.matches.filter(match => favoriteMatchIds.has(parseInt(match.id, 10))),
        }))
        .filter(league => league.matches.length > 0);
    } else if (liveOnly) {
      leagues = leagues
        .map(league => ({
          ...league,
          matches: league.matches.filter(m => !['FT', 'NS', 'PST', 'CANC'].includes(m.status)),
        }))
        .filter(league => league.matches.length > 0);
    } else if (scheduledOnly) {
        leagues = leagues
        .map(league => ({
          ...league,
          matches: league.matches.filter(m => m.status === 'NS'),
        }))
        .filter(league => league.matches.length > 0);
    } else if (finishedOnly) {
        leagues = leagues
        .map(league => ({
          ...league,
          matches: league.matches.filter(m => m.status === 'FT'),
        }))
        .filter(league => league.matches.length > 0);
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

    return leagues;
  }, [initialFixtures, liveOnly, scheduledOnly, finishedOnly, favoritesOnly, favoriteMatches, query]);

  const displayedLeagues = isExpanded ? filteredLeagues : filteredLeagues.slice(0, LEAGUE_LIMIT);
  const needsPagination = filteredLeagues.length > displayedLeagues.length;
  
  return (
    <div className="flex flex-col gap-3 px-1 rounded-lg mt-14 lg:mt-0">
      <PreviewHeader
        title={favoritesOnly ? 'Tus Favoritos' : `Partidos`}
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
        setExpanded={setIsExpanded}
      />
      {displayedLeagues.length === 0 && (
        <div className="flex flex-col gap-2 w-full items-center py-4">
          <p className="text-sm lg:text-base text-muted-foreground">
            {query ? `No se encontraron resultados para "${query}"` : favoritesOnly ? 'Aún no tienes favoritos.' : 'No hay partidos disponibles para los filtros seleccionados'}
          </p>
        </div>
      )}
      <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="w-full space-y-2">
        {displayedLeagues.map((league) => (
          <AccordionItem
            key={`${league.id}_${league.name ?? "default"}`}
            value={`${league.id}_${league.name ?? "default"}`}
            className="border-b-0"
          >
            <AccordionTrigger className="flex gap-2 text-base lg:text-lg font-semibold items-center px-2 py-2 rounded-md hover:no-underline bg-card">
                <div className="flex items-center justify-between flex-grow">
                  <Link
                    href={`/football/liga/${generateSlug(league.name)}/${league.id}`}
                    className="flex items-center gap-2">
                    <span className="relative w-5 h-5 lg:w-7 lg:h-7">
                      <ImageWithRetry
                        src={
                          league.country?.name === 'World'
                            ? league.logo ?? '/globe.svg'
                            : league.country?.flag
                                ? league.country.flag
                                : '/globe.svg'
                        }
                        alt={league.country?.name ?? 'World'}
                        fill
                        className="object-contain"
                        sizes="64px"
                        priority
                      />
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs lg:text-base font-medium">{league.name}</span>
                      <span className="text-[8px] lg:text-[11px] text-muted-foreground font-light mt-[-1px] lg:mt-[-5px]">
                        {league.country?.name ?? 'World'}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-normal text-muted-foreground">
                      ({league.matches.length})
                    </span>
                    <div
                      role="button"
                      aria-label="Toggle Favorite"
                      className="flex items-center justify-center h-7 w-7 rounded-full focus:bg-accent/50"
                      onClick={() => toggleFavoriteLeague(league)}>
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isLeagueFavorite(parseInt(league.id, 10)) ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pt-2">
              {league.matches.map((match) => (
                <CardMatch key={`${league.id}_${match.id}`} match={match} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {needsPagination && (
        <div className="pt-2">
          <Button variant="outline" className="w-full" onClick={() => setIsExpanded(true)}>
            Ver más ligas
          </Button>
        </div>
      )}
    </div>
  )
}