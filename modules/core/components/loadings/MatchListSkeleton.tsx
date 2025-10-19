// modules/core/components/loading/MatchListSkeleton.tsx
import { Card, CardContent, CardHeader } from '@/modules/core/components/ui/card'
import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { MatchCardSkeleton } from './MatchCardSkeleton'

interface MatchListSkeletonProps {
  leagueCount?: number
  matchesPerLeague?: number
}

export function MatchListSkeleton({
  leagueCount = 3,
  matchesPerLeague = 3,
}: MatchListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: leagueCount }).map((_, leagueIndex) => (
        <Card key={leagueIndex}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {Array.from({ length: matchesPerLeague }).map((_, matchIndex) => (
              <MatchCardSkeleton key={matchIndex} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}