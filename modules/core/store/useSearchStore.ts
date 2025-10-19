import { create } from 'zustand'

type SearchContext = 'home' | 'country-view' | 'league-view' | null

interface SearchState {
  query: string
  context: SearchContext
  isOpen: boolean
  setQuery: (query: string) => void
  setContext: (context: SearchContext) => void
  openSearch: () => void
  closeSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  context: null,
  isOpen: false,
  setQuery: (query) => set({ query }),
  setContext: (context) => set({ context, query: '' }),
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false }),
}))
