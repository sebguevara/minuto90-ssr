import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MatchPreview } from '@/modules/football/domain/entities/Match'
import { League } from '@/modules/football/domain/entities/League'
import { Team } from '@/modules/football/domain/entities/Team'

export type FavoriteTeam = Pick<Team, 'id' | 'name' | 'logo'> & {
  leagueId: number
  leagueName: string
}

interface FavoriteState {
  favoriteMatches: Record<number, MatchPreview>
  favoriteLeagues: Record<number, League>
  favoriteTeams: Record<number, FavoriteTeam>
  toggleFavoriteMatch: (match: MatchPreview) => void
  isMatchFavorite: (matchId: number) => boolean
  toggleFavoriteLeague: (league: League & { season: number }) => void
  isLeagueFavorite: (leagueId: number) => boolean
  toggleFavoriteTeam: (team: FavoriteTeam) => void
  isTeamFavorite: (teamId: number) => boolean
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteMatches: {},
      favoriteLeagues: {},
      favoriteTeams: {},

      toggleFavoriteMatch: (match) =>
        set((state) => {
          const isFavorite = !!state.favoriteMatches[match.id]
          const nextState = { ...state.favoriteMatches }
          if (isFavorite) {
            delete nextState[match.id]
          } else {
            nextState[match.id] = match
          }
          return { favoriteMatches: nextState }
        }),
      isMatchFavorite: (matchId) => !!get().favoriteMatches[matchId],
      toggleFavoriteLeague: (league) =>
        set((state) => {
          const isFavorite = !!state.favoriteLeagues[league.id]
          const nextState = { ...state.favoriteLeagues }
          if (isFavorite) {
            delete nextState[league.id]
          } else {
            nextState[league.id] = league
          }
          return { favoriteLeagues: nextState }
        }),
      isLeagueFavorite: (leagueId) => !!get().favoriteLeagues[leagueId],
      toggleFavoriteTeam: (team) =>
        set((state) => {
          const isFavorite = !!state.favoriteTeams[team.id]
          const nextState = { ...state.favoriteTeams }
          if (isFavorite) {
            delete nextState[team.id]
          } else {
            nextState[team.id] = team
          }
          return { favoriteTeams: nextState }
        }),
      isTeamFavorite: (teamId) => !!get().favoriteTeams[teamId],
    }),
    {
      name: 'favorite-storage',
    }
  )
)
