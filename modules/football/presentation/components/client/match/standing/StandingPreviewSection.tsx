'use client'

import type { StandingsLeague } from '@football/domain/entities/Standing'
import { StandingsTable } from '../../../standings/components/standingsTable'
import { useMemo } from 'react'

interface Props {
  standings?: StandingsLeague[]
  homeId: number
  awayId: number
  leagueId: number
  leagueName: string
}

export const StandingPreviewSection = ({
  standings,
  homeId,
  awayId,
  leagueId,
  leagueName,
}: Props) => {
  const relevantStandings = useMemo(() => {
    if (!standings || standings.length === 0) return null

    for (const league of standings) {
      for (const group of league.standings) {
        const hasTeam = group.some((row) => row.team.id === homeId || row.team.id === awayId)
        if (hasTeam) {
          return group
        }
      }
    }
    return null
  }, [standings, homeId, awayId])

  if (!relevantStandings) {
    return (
      <div className="mt-4 p-4 text-center text-muted-foreground bg-card rounded-md">
        No hay información de la tabla de posiciones disponible para esta competición.
      </div>
    )
  }

  return (
    <div className="mt-4">
      <StandingsTable
        standings={relevantStandings}
        leagueId={leagueId}
        leagueName={leagueName}
        highlightTeams={[homeId, awayId]}
      />
    </div>
  )
}
