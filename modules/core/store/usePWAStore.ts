import { create } from 'zustand'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  installPrompt: BeforeInstallPromptEvent | null
  isInstalled: boolean
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void
  setIsInstalled: (installed: boolean) => void
}

export const usePWAStore = create<PWAState>((set) => ({
  installPrompt: null,
  isInstalled: false,
  setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
  setIsInstalled: (installed) => set({ isInstalled: installed }),
}))
