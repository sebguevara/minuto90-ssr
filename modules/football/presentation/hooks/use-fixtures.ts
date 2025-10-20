import { useQuery } from '@tanstack/react-query'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'

interface UseFixturesOptions {
  dateParam: string
  initialData: LeagueFixtures[]
}

async function fetchFixtures(dateParam: string): Promise<LeagueFixtures[]> {
  const endpoint =
    dateParam === 'live' ? '/api/football/live' : `/api/football/fixtures?date=${dateParam}`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error('Error al obtener fixtures')
  }
  return response.json()
}

export function useFixtures({ dateParam, initialData }: UseFixturesOptions) {
  return useQuery({
    queryKey: ['fixtures', dateParam],
    queryFn: () => fetchFixtures(dateParam),
    initialData: initialData,
    refetchInterval: dateParam === 'live' || dateParam === 'home' ? 15000 : false,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  })
}
