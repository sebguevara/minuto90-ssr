// app/(sports)/football/partido/[...slug]/page.tsx

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { matchService } from '@/modules/football/application/services/matchService'
import { generateSlug } from '@/lib/utils'
import { MatchSkeleton } from '@/modules/football/presentation/components/skeletons/MatchSkeleton'
import MatchView from '@/modules/football/presentation/views/MatchView'

type Props = {
  params: Promise<{ slug: string[] }>
}

/**
 * Extrae el matchId y leagueId de los segmentos del slug.
 * Formato esperado: ["league-slug-${leagueId}", "home-vs-away-${matchId}"]
 * 
 * @example
 * - ["champions-league-1167", "chelsea-vs-ajax-3695638"] → matchId: "3695638", leagueId: "1167"
 * - ["premier-league-39", "arsenal-vs-chelsea-1234567"] → matchId: "1234567", leagueId: "39"
 */
function extractMatchData(slug: string[]): { matchId: string | null; leagueId: string | null } {
  if (!slug || slug.length < 2) {
    return { matchId: null, leagueId: null }
  }

  const leagueSegment = slug[0] // "champions-league-1167"
  const matchSegment = slug[1] // "chelsea-vs-ajax-3695638"

  const leagueParts = leagueSegment.split('-')
  const leagueId = leagueParts[leagueParts.length - 1]
  const isValidLeagueId = /^\d+$/.test(leagueId)

  const matchParts = matchSegment.split('-')
  const matchId = matchParts[matchParts.length - 1]
  const isValidMatchId = /^\d+$/.test(matchId)

  return {
    matchId: isValidMatchId ? matchId : null,
    leagueId: isValidLeagueId ? leagueId : null,
  }
}

/**
 * Genera metadatos dinámicos para SEO en el servidor.
 * Utiliza los datos del partido para crear un título y descripción optimizados.
 */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  if (!Array.isArray(slug) || slug.length < 2) {
    return { title: 'Partido no encontrado | Minuto90' }
  }

  // Extraer slugs sin IDs para el título
  const leagueSegment = slug[0] // "champions-league-1167"
  const matchSegment = slug[1] // "chelsea-vs-ajax-3695638"

  // Remover el último segmento (el ID) de cada parte
  const leagueSlug = leagueSegment.replace(/-\d+$/, '')
  const matchSlug = matchSegment.replace(/-\d+$/, '')

  const titlePath = `football/partido/${leagueSlug}/${matchSlug}`

  return { title: titlePath }
}

export default async function MatchPage({ params }: Props) {
  const { slug } = await params

  if (!Array.isArray(slug) || slug.length < 2) {
    notFound()
  }

  const { leagueId, matchId } = extractMatchData(slug)

  if (!matchId || !leagueId) {
    notFound()
  }

  const initialMatchData = await matchService.getMatchDetails(matchId, leagueId)
  if (!initialMatchData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<MatchSkeleton />}>
        <MatchView id={matchId} leagueId={leagueId} fixture={initialMatchData} />
      </Suspense>
    </div>
  )
}