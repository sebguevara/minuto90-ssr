'use client'

import { MatchPreview } from '@/modules/football/domain/entities/Match'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
import { generateMatchUrl } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  fixture: MatchPreview
  teamId: number
}

const getResultBadge = (fixture: MatchPreview, teamId: number) => {
  if (fixture.status.short === 'NS' || fixture.status.short === 'TBD') {
    return { label: 'P', className: 'bg-gray-400 dark:bg-gray-600', title: 'Pendiente' }
  }

  const isHome = fixture.teams.home.id === teamId
  const { winner: homeWin } = fixture.teams.home
  const { winner: awayWin } = fixture.teams.away

  if (homeWin !== null && awayWin !== null) {
    if ((isHome && homeWin) || (!isHome && awayWin)) {
      return { label: 'V', className: 'bg-green-500', title: 'Victoria' }
    }
    if ((isHome && awayWin) || (!isHome && homeWin)) {
      return { label: 'D', className: 'bg-red-500', title: 'Derrota' }
    }
    return { label: 'E', className: 'bg-yellow-500', title: 'Empate' }
  }

  // Fallback a los goles
  if (fixture.score.fullTime.home === fixture.score.fullTime.away) {
    return { label: 'E', className: 'bg-yellow-500', title: 'Empate' }
  }
  if (
    (isHome &&
      fixture.score.fullTime.home &&
      fixture.score.fullTime.away &&
      fixture.score.fullTime.home > fixture.score.fullTime.away) ||
    (!isHome &&
      fixture.score.fullTime.away &&
      fixture.score.fullTime.home &&
      fixture.score.fullTime.away > fixture.score.fullTime.home)
  ) {
    return { label: 'V', className: 'bg-green-500', title: 'Victoria' }
  }
  return { label: 'D', className: 'bg-red-500', title: 'Derrota' }
}

export const SimpleMatchCard = ({ fixture, teamId }: Props) => {
  const { label, className, title } = getResultBadge(fixture, teamId)
  const isHome = fixture.teams.home.id === teamId
  const opponent = isHome ? fixture.teams.away : fixture.teams.home

  // Genera la URL SEO-friendly con el ID incluido en el slug
  const linkHref = generateMatchUrl({
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    leagueName: fixture.league.name,
    matchId: (fixture as any).staticId || fixture.id,
    leagueId: fixture.league.id
  })

  return (
    <Link href={linkHref} className="block">
      <div className="relative flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 ${className}`}
            title={title}>
            {label}
          </div>

          <span className="text-xs text-muted-foreground">{'vs'}</span>
          <div className="relative w-5 h-5 flex-shrink-0">
            <ImageWithRetry
              src={opponent.logo}
              alt={opponent.name}
              fill
              className="object-contain"
              sizes="20px"
            />
          </div>
          <span className="text-xs truncate" title={opponent.name}>
            {opponent.name}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-semibold w-10 text-center">
            {fixture.score.fullTime.home ?? '-'} - {fixture.score.fullTime.away ?? '-'}
          </span>
          <span className="text-[10px] text-muted-foreground w-14 text-right mr-12">
            {new Date(fixture.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })}
          </span>
          <span
            className={`flex pt-1 items-center justify-center text-[8px] font-semibold px-1.5 py-0.5 rounded-md absolute right-2 ${
              isHome
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
            title={isHome ? 'Local' : 'Visitante'}>
            {isHome ? 'Local' : 'Visitante'}
          </span>
        </div>
      </div>
    </Link>
  )
}
