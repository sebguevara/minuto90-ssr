import { League } from '@/modules/football/domain/models/league'
import { GoalServeLeaguesResponse, GoalServeLeague } from '@/modules/football/domain/types/leagueResponse'

export const leagueMapper = {
  toDomain: (response: GoalServeLeaguesResponse): League[] => {
    if (!response.leagues || !response.leagues.league) return []

    return response.leagues.league.map((league: GoalServeLeague) => ({
      id: league['@id'],
      name: league['@name'],
      country: league['@country'],
      isCup: league['@is_cup'] === 'True',
    }))
  },
}
