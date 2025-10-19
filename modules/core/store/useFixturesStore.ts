import { create } from 'zustand'
import type { MatchPreview } from '@football/domain/entities/Match'
import { Prediction } from '@/modules/football/domain/entities/Predictions'
import { Squad } from '@/modules/football/domain/entities/Squad'

export interface StoredFixtures {
  date: string
  data: MatchPreview[]
  updatedAt: number
  live: boolean
}

interface FixturesState {
  fixtures: Record<string, StoredFixtures>
  teamFixtures: Record<string, MatchPreview[]>
  predictions: Record<number, Prediction>
  squads: Record<number, Squad>
  teamColors: Record<number, string>
  getTeamColor: (teamId: number) => string | undefined
  setTeamColor: (teamId: number, color: string) => void
  setTeamColors: (batch: Record<number, string>) => void
  setFixtures: (
    date: string,
    dataOrFn: MatchPreview[] | ((prevData: MatchPreview[]) => MatchPreview[]),
    opts?: { live?: boolean; touch?: boolean }
  ) => void
  getFixtures: (date: string) => StoredFixtures | undefined
  findFixture: (id: number) => MatchPreview | undefined
  hasFixtures: (date: string) => boolean
  shouldRefetch: (date: string, isToday: boolean, ttl?: number) => boolean
  clearFixtures: () => void
  purgeOlderThan: (days: number) => void
  setPredictions: (fixtureId: number, predictions: Prediction) => void
  getPredictions: (fixtureId: number) => Prediction | undefined
  setSquad: (teamId: number, squad: Squad) => void
  getSquad: (teamId: number) => Squad | undefined
  setFixturesByTeam: (teamId: number, fixtures: MatchPreview[], leagueId?: number) => void
  getFixturesByTeam: (teamId: number, leagueId?: number) => MatchPreview[] | undefined
}

export const useFixturesStore = create<FixturesState>((set, get) => ({
  fixtures: {},
  teamFixtures: {},
  predictions: {},
  squads: {},
  teamColors: {},
  getTeamColor: (id) => get().teamColors[id],
  setTeamColor: (id, color) => set((s) => ({ teamColors: { ...s.teamColors, [id]: color } })),
  setTeamColors: (batch) => set((s) => ({ teamColors: { ...s.teamColors, ...batch } })),

  setFixtures: (date, dataOrFn, opts = {}) =>
    set((state) => {
      const prevEntry = state.fixtures[date]
      const prevData = prevEntry?.data ?? []
      const newData = typeof dataOrFn === 'function' ? dataOrFn(prevData) : dataOrFn

      return {
        fixtures: {
          ...state.fixtures,
          [date]: {
            date,
            data: newData,
            updatedAt: opts.touch === false ? prevEntry?.updatedAt ?? Date.now() : Date.now(),
            live: opts.live ?? prevEntry?.live ?? false,
          },
        },
      }
    }),

  findFixture: (id) => {
    const { fixtures } = get()
    for (const stored of Object.values(fixtures)) {
      const hit = stored?.data?.find((f) => f.id === id)
      if (hit) return hit
    }
    return undefined
  },

  getFixtures: (date) => get().fixtures[date],
  hasFixtures: (date) => !!get().fixtures[date]?.data.length,

  shouldRefetch: (date, isToday, ttl = 1000 * 60 * 5) => {
    const entry = get().fixtures[date]
    if (!entry) return true
    if (isToday) return true
    return Date.now() - entry.updatedAt > ttl
  },

  clearFixtures: () => set({ fixtures: {}, predictions: {} }),

  purgeOlderThan: (days) =>
    set((state) => {
      const cutoff = Date.now() - days * 86400000
      const next: Record<string, StoredFixtures> = {}
      for (const [k, v] of Object.entries(state.fixtures)) {
        if (v.updatedAt >= cutoff) next[k] = v
      }
      return { fixtures: next }
    }),

  setPredictions: (fixtureId, predictions) =>
    set((state) => ({
      predictions: { ...state.predictions, [fixtureId]: predictions },
    })),

  getPredictions: (fixtureId) => get().predictions[fixtureId],

  setSquad: (teamId, squad) =>
    set((state) => ({
      squads: { ...state.squads, [teamId]: squad },
    })),

  getSquad: (teamId) => get().squads[teamId],

  setFixturesByTeam: (teamId, fixtures, leagueId) => {
    const key = leagueId ? `${teamId}-${leagueId}` : `${teamId}-general`
    set((state) => ({
      teamFixtures: { ...state.teamFixtures, [key]: fixtures },
    }))
  },

  getFixturesByTeam: (teamId, leagueId) => {
    const key = leagueId ? `${teamId}-${leagueId}` : `${teamId}-general`
    return get().teamFixtures[key]
  },
}))
