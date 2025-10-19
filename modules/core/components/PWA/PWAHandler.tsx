'use client'

import { useEffect } from 'react'
import { usePWAStore } from '@/modules/core/store/usePWAStore'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const PWAHandler = () => {
  const { setInstallPrompt, setIsInstalled, isInstalled } = usePWAStore()

  useEffect(() => {
    const handleInstallState = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setInstallPrompt(null)
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      if (isInstalled) return
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    handleInstallState()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [setIsInstalled, setInstallPrompt, isInstalled])

  return null
}
