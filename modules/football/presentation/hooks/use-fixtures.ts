import { useQuery } from '@tanstack/react-query'
import { LeagueFixtures } from '@/modules/football/domain/models/fixture'

interface UseFixturesOptions {
  dateParam: string
  initialData?: LeagueFixtures[]
}

async function fetchFixtures(dateParam: string): Promise<LeagueFixtures[]> {
  const response = await fetch(`/api/football/fixtures?date=${dateParam}`)

  if (!response.ok) {
    throw new Error('Error al obtener fixtures')
  }

  return response.json()
}

export function useFixtures({ dateParam, initialData }: UseFixturesOptions) {
  return useQuery({
    queryKey: ['fixtures', dateParam],
    queryFn: () => fetchFixtures(dateParam),
    initialData,
    staleTime: 10000,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    enabled: dateParam === 'live' || dateParam === 'home',
  })
}
