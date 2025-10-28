import { MatchView } from '@/modules/football/presentation/views/MatchView'
import { Suspense } from 'react'
import { MatchSkeleton } from '@/modules/football/presentation/components/skeletons/MatchSkeleton'

interface MatchPageProps {
  params: Promise<{
    slug: string[]
  }>
  searchParams: Promise<{
    leagueId?: string
  }>
}

export default async function MatchPage({ params, searchParams }: MatchPageProps) {
  const { slug } = await params
  const { leagueId } = await searchParams
  
  // El último elemento del slug es el ID del partido
  const matchId = slug[slug.length - 1]

  if (!matchId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Partido no encontrado</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<MatchSkeleton />}>
        <MatchView matchId={matchId} leagueId={leagueId} />
      </Suspense>
    </div>
  )
}

