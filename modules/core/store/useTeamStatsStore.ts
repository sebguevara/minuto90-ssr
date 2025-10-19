import { create } from 'zustand'
import { TeamStats } from '@football/domain/entities/TeamStats'

interface TeamStatsState {
  stats: Record<string, TeamStats>
  getTeamStats: (teamId: number, leagueId: number) => TeamStats | undefined
  setTeamStats: (teamId: number, leagueId: number, data: TeamStats) => void
}

export const useTeamStatsStore = create<TeamStatsState>((set, get) => ({
  stats: {},
  getTeamStats: (teamId, leagueId) => {
    const key = `${teamId}-${leagueId}`
    return get().stats[key]
  },
  setTeamStats: (teamId, leagueId, data) => {
    const key = `${teamId}-${leagueId}`
    set((state) => ({
      stats: {
        ...state.stats,
        [key]: data,
      },
    }))
  },
}))
