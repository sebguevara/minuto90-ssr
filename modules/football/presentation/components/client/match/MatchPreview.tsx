'use client'

import { MatchHeaderScore } from './MatchHeaderScore'
import { useEffect, useState, unstable_ViewTransition as ViewTransition } from 'react'
import { MatchPreview } from '@football/domain/entities/Match'
import { TagTime } from '../../fixtures/components/TagTime'
import { generateSlug, getStatusConfig } from '@/shared/lib/utils'
import { Badge } from '@/modules/core/components/ui/badge'
import { STATUS_TYPES } from '@/shared/consts'
import Image from 'next/image'
import { MatchColors } from '@/modules/football/domain/entities/Colors'
import { abbreviateTeamName } from '@/shared/lib/utils'
import Link from 'next/link'
import { Button } from '@/modules/core/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavoriteStore } from '../../core/store/useFavoriteStore'

interface Props {
  fixture: MatchPreview
  colors: MatchColors
}

const getDate = (fixture: MatchPreview) => {
  return new Date(
    typeof fixture.date === 'number'
      ? String(fixture.date).length === 10
        ? fixture.date * 1000
        : fixture.date
      : fixture.date
  )
}

const getFormattedDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export const MatchPreviewSection = ({ fixture, colors }: Props) => {
  const [date, setDate] = useState<string | null>(null)
  const statusCfg = getStatusConfig(fixture.status.short)

  const { isMatchFavorite, toggleFavoriteMatch } = useFavoriteStore()
  const isFavorite = isMatchFavorite(fixture.id)

  useEffect(() => {
    setDate(getFormattedDate(getDate(fixture)))
  }, [fixture, fixture.date])

  return (
    <section className="overflow-hidden mt-20 lg:mt-8 h-max flex items-center justify-center w-full relative p-12 rounded-lg shadow-lg bg-card backdrop-blur-sm lg:min-h-52">
      <div
        className="pointer-events-none absolute left-[-90px] top-1/2 -translate-y-1/2 w-68 lg:w-140 h-60 lg:h-100 rounded-full blur-[40px] lg:blur-[140px] opacity-40"
        style={{ backgroundColor: colors.home }}
      />

      <div
        className="pointer-events-none absolute right-[-90px] top-1/2 -translate-y-1/2 w-68 lg:w-140 h-60 lg:h-100 rounded-full blur-[40px] lg:blur-[140px] opacity-40"
        style={{ backgroundColor: colors.away }}
      />

      <Link
        href={`/football/liga/${generateSlug(fixture.league.name)}/${fixture.league.id}`}
        className="w-max h-max absolute top-2 left-2 lg:top-2 lg:left-3 flex items-center gap-1">
        <div className="relative w-5 h-5 lg:w-8 lg:h-8">
          <Image
            src={fixture.league.logo}
            alt={fixture.league.name}
            fill
            sizes="128px"
            priority
            className="object-contain rounded-full"
          />
        </div>
        <h1 className="text-[9px] lg:text-sm text-muted-foreground">{`${fixture.league.name} - ${fixture.league.round}`}</h1>
      </Link>
      <div className="absolute top-3 right-2 lg:top-4 lg:right-4 flex items-center">
        <h1 suppressHydrationWarning className="text-[9px] lg:text-sm text-muted-foreground">
          {date}
        </h1>
      </div>
      <div className="absolute m-auto left-0 right-0 bottom-2 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-[9px] lg:text-sm text-muted-foreground">{fixture.venue?.name}</h1>
          <h1 className="text-[9px] lg:text-sm text-muted-foreground">{fixture.venue?.city}</h1>
        </div>
      </div>
      <div className="flex items-center justify-between w-max lg:w-full">
        <Link
          href={`/football/liga/${generateSlug(fixture.league.name)}/${fixture.league.id}/equipo/${generateSlug(fixture.teams.home.name)}/${fixture.teams.home.id}`}
          className="flex flex-col items-center gap-y-2 min-w-[120px] flex-1">
          <ViewTransition name={`logo-${fixture.id}-home`}>
            <div className="relative w-10 h-10 lg:w-14 lg:h-14">
              <Image
                src={fixture.teams.home.logo}
                alt={fixture.teams.home.name}
                fill
                sizes="128px"
                priority
                className="object-contain"
              />
            </div>
          </ViewTransition>
          <ViewTransition name={`name-${fixture.id}-home`}>
            <h1 className="text-xs lg:text-base text-black dark:text-white text-center">
              {abbreviateTeamName(fixture.teams.home.name)}
            </h1>
          </ViewTransition>
        </Link>

        <div className="flex flex-col items-center gap-1">
          <MatchHeaderScore
            homeTeamScore={fixture.score.fullTime.home}
            awayTeamScore={fixture.score.fullTime.away}
            homeTeamPenalty={fixture.score.penalty.home}
            awayTeamPenalty={fixture.score.penalty.away}
          />
          {statusCfg.type === STATUS_TYPES.live ? (
            <TagTime status={fixture.status} statusConfig={statusCfg} kickoff={fixture.date} />
          ) : (
            <Badge
              variant="outline"
              className={`px-1 lg:px-2 py-1 mt-2 lg:mt-3 h-5 lg:h-6 text-[9px] lg:text-xs font-semibold tracking-wide ${statusCfg.className}`}>
              <span className="inline md:hidden">{fixture.status.short}</span>
              <span className="hidden md:inline">{statusCfg.label}</span>
            </Badge>
          )}
        </div>
        <Link
          href={`/football/liga/${generateSlug(fixture.league.name)}/${fixture.league.id}/equipo/${generateSlug(fixture.teams.away.name)}/${fixture.teams.away.id}`}
          className="flex flex-col items-center gap-y-2 min-w-[120px] flex-1">
          <ViewTransition name={`logo-${fixture.id}-away`}>
            <div className="relative w-10 h-10 lg:w-14 lg:h-14">
              <Image
                src={fixture.teams.away.logo}
                alt={fixture.teams.away.name}
                fill
                sizes="128px"
                priority
                className="object-contain"
              />
            </div>
          </ViewTransition>
          <ViewTransition name={`name-${fixture.id}-away`}>
            <h1 className="text-xs lg:text-base text-black dark:text-white text-center">
              {abbreviateTeamName(fixture.teams.away.name)}
            </h1>
          </ViewTransition>
        </Link>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 rounded-full"
        onClick={() => toggleFavoriteMatch(fixture)}>
        <Heart
          className={`h-5 w-5 ${
            isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
          }`}
        />
      </Button>
    </section>
  )
}
