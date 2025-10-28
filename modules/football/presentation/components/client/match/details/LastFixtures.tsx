'use client'

import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { SimpleMatchCard } from './SimpleMatchCard'
import { useGetTeamFixtures } from '../../../team/hooks/useGetTeamFixtures'
import { MatchPreview } from '@/modules/football/domain/entities/Match'

interface Props {
  teamId: number
  leagueId?: number
  title: string
  fixtureSet: 'lastFixtures' | 'nextFixtures'
}

export const LastFixtures = ({ teamId, leagueId, title, fixtureSet }: Props) => {
  const { data, isLoading } = useGetTeamFixtures(teamId, leagueId)

  const fixtures = data?.[fixtureSet]

  if (isLoading) {
    return (
      <div>
        <h4 className="text-sm font-semibold mb-2">{title}</h4>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {fixtures && fixtures.length > 0 ? (
          fixtures.map((fixture: MatchPreview) => (
            <SimpleMatchCard key={fixture.id} fixture={fixture} teamId={teamId} />
          ))
        ) : (
          <div className="p-4 text-center text-sm bg-card rounded-lg border">
            <p className="text-muted-foreground">No hay partidos para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
