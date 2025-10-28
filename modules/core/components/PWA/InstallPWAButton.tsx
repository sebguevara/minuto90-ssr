'use client'

import { Button } from '@/modules/core/components/ui/button'
import { usePWAStore } from '@/modules/core/store/usePWAStore'
import { Download, CheckCircle } from 'lucide-react'

export const InstallPWAButton = () => {
  const { installPrompt, isInstalled, setInstallPrompt, setIsInstalled } = usePWAStore()

  const handleInstallClick = async () => {
    if (!installPrompt) return

    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setInstallPrompt(null)
  }

  const isInstallable = !!installPrompt && !isInstalled
  const buttonText = isInstalled
    ? 'App Instalada'
    : isInstallable
    ? 'Instalar App'
    : 'Instalación no disponible'
  const buttonIcon = isInstalled ? <CheckCircle size={18} /> : <Download size={18} />
  const buttonTitle = isInstalled
    ? 'La aplicación ya está instalada'
    : isInstallable
    ? 'Instalar la aplicación en tu dispositivo'
    : 'La instalación no está disponible en este momento'

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleInstallClick}
        disabled={!isInstallable}
        title={buttonTitle}
        className="hidden lg:flex items-center gap-1.5 text-sm text-white hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
        {buttonIcon}
        <span>{buttonText}</span>
      </Button>

      <button
        onClick={handleInstallClick}
        disabled={!isInstallable}
        title={buttonTitle}
        className="lg:hidden flex w-full items-center gap-2 rounded-md bg-card px-3 py-2.5 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed">
        <Download size={16} />
        <span>{buttonText}</span>
      </button>
    </>
  )
}
