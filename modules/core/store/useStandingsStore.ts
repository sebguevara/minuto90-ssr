import { create } from 'zustand'
import { StandingsLeague } from '@football/domain/entities/Standing'

interface StandingsState {
  standings: Record<string, StandingsLeague[]>
  getStandings: (leagueId: number, season: number) => StandingsLeague[] | undefined
  setStandings: (leagueId: number, season: number, data: StandingsLeague[]) => void
}

export const useStandingsStore = create<StandingsState>((set, get) => ({
  standings: {},
  getStandings: (leagueId, season) => {
    const key = `${leagueId}-${season}`
    return get().standings[key]
  },
  setStandings: (leagueId, season, data) => {
    const key = `${leagueId}-${season}`
    set((state) => ({
      standings: {
        ...state.standings,
        [key]: data,
      },
    }))
  },
}))
