'use client'

import { MatchHeaderScore } from './MatchHeaderScore'
import { useEffect, useState, ViewTransition } from 'react'
import { Badge } from '@/modules/core/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/modules/core/components/ui/button'
import { Heart } from 'lucide-react'
import { MatchDetails } from '@/modules/football/domain/models/commentary'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { abbreviateTeamName, generateSlug, getStatusConfig } from '@/lib/utils'
import { STATUS_TYPES } from '@/lib/consts'
import { TagTime } from '../fixtures/TagTime'

interface Props {
  fixture: MatchDetails
}

const getDate = (date: string) => {
  return new Date(
    typeof date === 'number'
      ? String(date).length === 10
        ? date * 1000
        : date
      : date
  )
}

const getFormattedDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export const MatchPreviewSection = ({ fixture }: Props) => {
  const [date, setDate] = useState<string | null>(null)
  const statusCfg = getStatusConfig(fixture.match.status)

  const { isMatchFavorite, toggleFavoriteMatch } = useFavoriteStore()
  const isFavorite = isMatchFavorite(Number(fixture.match.id))

  // useEffect(() => {
  //   setDate(getFormattedDate(new Date(fixture.match.date)))
  // }, [fixture, fixture.match.date])

  return (
    <section className="overflow-hidden mt-20 lg:mt-8 h-max flex items-center justify-center w-full relative p-12 rounded-lg shadow-lg bg-card backdrop-blur-sm lg:min-h-52">
      <div
        className="pointer-events-none absolute left-[-90px] top-1/2 -translate-y-1/2 w-68 lg:w-140 h-60 lg:h-100 rounded-full blur-[40px] lg:blur-[140px] opacity-40"
        style={{ backgroundColor: fixture.teamColors?.visitorteam?.player[fixture.match.visitorTeam.id] }}
      />

      <div
        className="pointer-events-none absolute right-[-90px] top-1/2 -translate-y-1/2 w-68 lg:w-140 h-60 lg:h-100 rounded-full blur-[40px] lg:blur-[140px] opacity-40"
        style={{ backgroundColor: fixture.teamColors?.localteam?.player[fixture.match.localTeam.id] }}
      />

      <Link
        href={`/football/liga/${generateSlug(fixture.tournament.name)}/${fixture.tournament.id}`}
        className="w-max h-max absolute top-2 left-2 lg:top-2 lg:left-3 flex items-center gap-1">
        <div className="relative w-5 h-5 lg:w-8 lg:h-8">
          <Image
            src={fixture.tournament.logo ?? ''}
            alt={fixture.tournament.name}
            fill
            sizes="128px"
            priority
            className="object-contain rounded-full"
          />
        </div>
        <h1 className="text-[9px] lg:text-sm text-muted-foreground">{`${fixture.tournament.name}`}</h1>
      </Link>
      <div className="absolute top-3 right-2 lg:top-4 lg:right-4 flex items-center">
        <h1 suppressHydrationWarning className="text-[9px] lg:text-sm text-muted-foreground">
          {date}
        </h1>
      </div>
      <div className="absolute m-auto left-0 right-0 bottom-2 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-[9px] lg:text-sm text-muted-foreground">{fixture.match.venue}</h1>
        </div>
      </div>
      <div className="flex items-center justify-between w-max lg:w-full">
        <Link
          href={`/football/liga/${generateSlug(fixture.match.localTeam.name)}/${fixture.match.localTeam.id}/equipo/${generateSlug(fixture.match.localTeam.name)}/${fixture.match.localTeam.id}`}
          className="flex flex-col items-center gap-y-2 min-w-[120px] flex-1">
          <ViewTransition name={`logo-${fixture.match.localTeam.id}-home`}>
            <div className="relative w-10 h-10 lg:w-14 lg:h-14">
              <Image
                src={fixture.match.localTeam.logo ?? ''}
                alt={fixture.match.localTeam.name}
                fill
                sizes="128px"
                priority
                className="object-contain"
              />
            </div>
          </ViewTransition>
          <ViewTransition name={`name-${fixture.match.localTeam.id}-home`}>
            <h1 className="text-xs lg:text-base text-black dark:text-white text-center">
              {abbreviateTeamName(fixture.match.localTeam.name)}
            </h1>
          </ViewTransition>
        </Link>

        <div className="flex flex-col items-center gap-1">
          <MatchHeaderScore
            homeTeamScore={fixture.match.localTeam.goals}
            awayTeamScore={fixture.match.visitorTeam.goals}
            penalties={fixture.events.goals.filter((e) => e.comment === 'Penalty').length}
          />
          {statusCfg.type === STATUS_TYPES.live ? (
            <TagTime match={fixture.match} />
          ) : (
            <Badge
              variant="outline"
              className={`px-1 lg:px-2 py-1 mt-2 lg:mt-3 h-5 lg:h-6 text-[9px] lg:text-xs font-semibold tracking-wide ${statusCfg.className}`}>
              <span className="inline md:hidden">{fixture.match.status}</span>
              <span className="hidden md:inline">{statusCfg.label}</span>
            </Badge>
          )}
        </div>
        <Link
          href={`/football/liga/${generateSlug(fixture.match.visitorTeam.name)}/${fixture.match.visitorTeam.id}/equipo/${generateSlug(fixture.match.visitorTeam.name)}/${fixture.match.visitorTeam.id}`}
          className="flex flex-col items-center gap-y-2 min-w-[120px] flex-1">
          <ViewTransition name={`logo-${fixture.match.visitorTeam.id}-away`}>
            <div className="relative w-10 h-10 lg:w-14 lg:h-14">
              <Image
                src={fixture.match.visitorTeam.logo ?? ''}
                alt={fixture.match.visitorTeam.name}
                fill
                sizes="128px"
                priority
                className="object-contain"
              />
            </div>
          </ViewTransition>
          <ViewTransition name={`name-${fixture.match.visitorTeam.id}-away`}>
            <h1 className="text-xs lg:text-base text-black dark:text-white text-center">
              {abbreviateTeamName(fixture.match.visitorTeam.name)}
            </h1>
          </ViewTransition>
        </Link>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 rounded-full"
        onClick={() => toggleFavoriteMatch(fixture.match)}>
        <Heart
          className={`h-5 w-5 ${
            isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
          }`}
        />
      </Button>
    </section>
  )
}
