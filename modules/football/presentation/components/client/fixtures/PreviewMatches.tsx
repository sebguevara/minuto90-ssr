'use client'

import { useState } from 'react'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/modules/core/components/ui/accordion'
import { PreviewHeader } from './PreviewHeader'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { Heart } from 'lucide-react'
import { Button } from '@/modules/core/components/ui/button'
import Link from 'next/link'
import { PRESELECTED_LEAGUES } from '@/lib/consts/football/leagues'
import { generateSlug } from '@/lib/utils'
import { CardMatch } from './CardMatch'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'

const LEAGUE_LIMIT = 30

interface PreviewMatchesProps {
  filteredLeagues: LeagueFixtures[]
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  title: string
  date: string
  setDate: (date: string) => void
  liveOnly: boolean
  setLiveOnly: (liveOnly: boolean) => void
  scheduledOnly: boolean
  setScheduledOnly: (scheduledOnly: boolean) => void
  finishedOnly: boolean
  setFinishedOnly: (finishedOnly: boolean) => void
  favoritesOnly: boolean
  setFavoritesOnly: (favoritesOnly: boolean) => void
  showOdds: boolean
  setShowOdds: (showOdds: boolean) => void
}

export const PreviewMatches = ({
  filteredLeagues,
  isExpanded,
  setIsExpanded,
  title,
  ...filterProps
}: PreviewMatchesProps) => {
  const { isLeagueFavorite, toggleFavoriteLeague } = useFavoriteStore()
  const [openAccordions, setOpenAccordions] = useState<string[]>(PRESELECTED_LEAGUES)

  const displayedLeagues = isExpanded ? filteredLeagues : filteredLeagues.slice(0, LEAGUE_LIMIT)
  const needsPagination = filteredLeagues.length > displayedLeagues.length

  return (
    <div className="flex flex-col gap-3 px-1 rounded-lg mt-14 lg:mt-0">
      <PreviewHeader title={title} setExpanded={setIsExpanded} {...filterProps} />
      {displayedLeagues.length === 0 && (
        <div className="flex flex-col gap-2 w-full items-center py-4">
          <p className="text-sm lg:text-base text-muted-foreground">
            {filterProps.favoritesOnly
              ? 'Aún no tienes favoritos.'
              : 'No hay partidos disponibles para los filtros seleccionados'}
          </p>
        </div>
      )}
      <Accordion
        type="multiple"
        value={openAccordions}
        onValueChange={setOpenAccordions}
        className="w-full space-y-2">
        {displayedLeagues.map((league) => (
          <AccordionItem
            key={`${league.id}_${league.name ?? 'default'}`}
            value={`${league.id}_${league.name ?? 'default'}`}
            className="border-b-0">
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
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavoriteLeague(league)
                    }}>
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isLeagueFavorite(parseInt(league.id, 10))
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 pt-2">
              {league.matches.map((match) => (
                <CardMatch key={`${league.id}_${match.id}`} fixture={match} leagueId={league.id} />
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