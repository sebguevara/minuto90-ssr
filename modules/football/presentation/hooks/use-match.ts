'use client'

import { useQuery } from '@tanstack/react-query'
import { Match } from '@/modules/football/domain/models/fixture'

interface MatchResponse {
  match: Match
  league: {
    id: string
    name: string
    logo?: string
    country?: {
      name: string
      nameCode: string
      code: string | null
      flag: string | null
    }
  }
}

async function fetchMatch(matchId: string, leagueId: string): Promise<MatchResponse> {
  const res = await fetch(`/api/football/match/${matchId}?leagueId=${leagueId}`)
  
  if (!res.ok) {
    throw new Error('Failed to fetch match data')
  }
  
  return res.json()
}

export function useMatch(matchId: string, leagueId: string) {
  return useQuery({
    queryKey: ['match', matchId, leagueId],
    queryFn: () => fetchMatch(matchId, leagueId),
    enabled: !!matchId && !!leagueId,
    staleTime: 30000, // 30 segundos
    refetchInterval: (query) => {
      const match = query.state.data?.match
      // Refrescar cada 30 segundos si el partido está en vivo
      if (match?.statusConfig?.type === 'live') {
        return 30000
      }
      return false
    },
  })
}

