import { LeagueSeason } from '@/modules/football/domain/models/season'
import { GoalServeSeasonsResponse } from '@/modules/football/domain/types/seasonResponse'

export const seasonMapper = {
  toDomain: (response: GoalServeSeasonsResponse): LeagueSeason[] => {
    if (!response.seasons || !response.seasons.league) return []

    return response.seasons.league.map((league) => ({
      id: league['@id'],
      name: league['@name'],
      country: league['@country'],
      isCup: league['@iscup'] === 'True',
      resultsSeasons: league.results.season.map((s) => ({ name: s['@name'] })),
      standingsSeasons: league.standings.season.map((s) => ({ name: s['@name'] })),
    }))
  },
}
