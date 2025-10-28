'use client'
import { MatchPreview } from '@/modules/football/domain/entities/Match'

export const getResultBadge = (fixture: MatchPreview, teamId: number) => {
  if (fixture.status.short === 'NS') {
    return { label: 'P', className: 'bg-gray-400 dark:bg-gray-600' } // Pendiente
  }

  const isHome = fixture.teams.home.id === teamId
  const { winner: homeWin } = fixture.teams.home
  const { winner: awayWin } = fixture.teams.away

  if (homeWin === null || awayWin === null) {
    if (fixture.score.fullTime.home === fixture.score.fullTime.away) {
      return { label: 'E', className: 'bg-yellow-500' }
    }
    if (
      (isHome && (fixture.score.fullTime.home ?? 0) > (fixture.score.fullTime.away ?? 0)) ||
      (!isHome && (fixture.score.fullTime.away ?? 0) > (fixture.score.fullTime.home ?? 0))
    ) {
      return { label: 'V', className: 'bg-green-500' }
    }
    return { label: 'D', className: 'bg-red-500' }
  }

  if ((isHome && homeWin) || (!isHome && awayWin)) {
    return { label: 'V', className: 'bg-green-500' } // Victoria
  }
  if ((isHome && awayWin) || (!isHome && homeWin)) {
    return { label: 'D', className: 'bg-red-500' } // Derrota
  }
  return { label: 'E', className: 'bg-yellow-500' } // Empate
}
