import { MatchInfo } from '@/modules/football/domain/models/commentary'
import { Match } from '@/modules/football/domain/models/fixture'
import { League } from '@/modules/football/domain/models/league'
import { TeamProfile } from '@/modules/football/domain/models/team'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FavoriteTeam = Pick<TeamProfile, 'id' | 'name' | 'logo'> & {
  leagueId: number
  leagueName: string
}

interface FavoriteState {
  favoriteMatches: Record<number, MatchInfo>
  favoriteLeagues: Record<number, League>
  favoriteTeams: Record<number, FavoriteTeam>
  toggleFavoriteMatch: (match: MatchInfo) => void
  isMatchFavorite: (matchId: number) => boolean
  toggleFavoriteLeague: (league: League) => void
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
          const isFavorite = !!state.favoriteMatches[Number(match.id)]
          const nextState = { ...state.favoriteMatches }
          if (isFavorite) {
            delete nextState[Number(match.id)]
          } else {
            nextState[Number(match.id)] = match
          }
          return { favoriteMatches: nextState }
        }),
      isMatchFavorite: (matchId) => !!get().favoriteMatches[matchId],
      toggleFavoriteLeague: (league) =>
        set((state) => {
          const isFavorite = !!state.favoriteLeagues[Number(league.id)]
          const nextState = { ...state.favoriteLeagues }
          if (isFavorite) {
            delete nextState[Number(league.id)]
          } else {
            nextState[Number(league.id)] = league
          }
          return { favoriteLeagues: nextState }
        }),
      isLeagueFavorite: (leagueId) => !!get().favoriteLeagues[leagueId],
      toggleFavoriteTeam: (team) =>
        set((state) => {
          const isFavorite = !!state.favoriteTeams[Number(team.id)]
          const nextState = { ...state.favoriteTeams }
          if (isFavorite) {
            delete nextState[Number(team.id)]
          } else {
            nextState[Number(team.id)] = team
          }
          return { favoriteTeams: nextState }
        }),
      isTeamFavorite: (teamId) => !!get().favoriteTeams[Number(teamId)],
    }),
    {
      name: 'favorite-storage',
    }
  )
)
