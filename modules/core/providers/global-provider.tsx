'use client'
import { ThemeProvider } from './theme-provider'
import { useEffect } from 'react'
import { QueryClientProvider } from './queryclient'

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0'

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion')
    if (storedVersion !== APP_VERSION) {
      const favoriteStorage = localStorage.getItem('favorite-storage')
      localStorage.clear()
      if (favoriteStorage) {
        localStorage.setItem('favorite-storage', favoriteStorage)
      }
      localStorage.setItem('appVersion', APP_VERSION)
      window.location.reload()
    }
  }, [])

  return (
    <QueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
