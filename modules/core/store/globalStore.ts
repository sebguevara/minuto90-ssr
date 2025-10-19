import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type MenuState = 'closed' | 'open'

interface GlobalStore {
  menu: MenuState
  setMenu: (menu: MenuState) => void
  toggleMenu: () => void
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      menu: 'closed',
      setMenu: (menu) => set({ menu }),
      toggleMenu: () => set({ menu: get().menu === 'open' ? 'closed' : 'open' }),
    }),
    { name: 'global-store' }
  )
)
