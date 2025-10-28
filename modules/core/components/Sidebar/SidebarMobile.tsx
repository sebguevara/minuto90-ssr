import { Dock, Heart, Users } from 'lucide-react'
import Link from 'next/link'
import { SidebarContent } from '@/modules/football/presentation/components/client/sidebar/SidebarContent'
import { useGlobalStore } from '@/modules/core/store/globalStore'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitch } from '../Toggle/ThemeSwitch'
import { InstallPWAButton } from '@/modules/core/components/PWA/InstallPWAButton'
import { ImageWithRetry } from '../Image/ImageWithRetry'
import { bettingProviders } from '@/lib/consts/bettingProviders'

interface Props {
  title: string
}

export const SidebarMobile = ({ title }: Props) => {
  const { menu } = useGlobalStore()
  const isOpen = menu === 'open'
  const { theme } = useTheme()
  const [currentLogo, setCurrentLogo] = useState('/logo/90.svg')

  useEffect(() => {
    setCurrentLogo(theme === 'dark' ? '/logo/90.svg' : '/logo/90.svg')
  }, [theme])

  return (
    <div
      className={`flex flex-col justify-center pt-1 overflow-scroll ${
        isOpen ? 'animate-in' : 'animate-out'
      }`}>
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="relative flex">
            <div className="relative w-14 h-8">
              <ImageWithRetry
                src={currentLogo}
                alt={title}
                fill
                sizes="128px"
                className="object-contain"
              />
            </div>
          </Link>
        </div>
        <div className="mr-6">
          <ThemeSwitch />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 overflow-y-auto">
        <nav className="flex flex-col gap-2">
          <Link
            href="/football/favoritos"
            className="flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm hover:bg-card/70">
            <Heart size={16} />
            <span>Favoritos</span>
          </Link>
          <Link
            href="https://t.me/+oPoqpWhIfzgwYjk5"
            target="_blank"
            className="flex items-center gap-2 rounded-md bg-card px-3 py-2.5 text-sm hover:bg-card/70">
            <Users size={16} />
            <span>Comunidad</span>
          </Link>
          <Link
            href="https://w.app/fullrecarga"
            target="_blank"
            className="flex items-center gap-2 rounded-md bg-card px-3 py-2.5 text-sm hover:bg-card/70">
            <Dock size={16} />
            <span>Recargas</span>
          </Link>
          <InstallPWAButton />

          <div className="mt-4">
            <h3 className="py-2 text-sm font-semibold text-primary">Sponsors</h3>
            <div className="flex gap-2 justify-start">
              {bettingProviders.map((provider) => (
                <Link
                  key={provider.name}
                  href={provider.href}
                  target="_blank"
                  className="flex items-center gap-2 rounded-md bg-gray-300 dark:bg-card px-3 py-2.5 text-sm hover:bg-card/70">
                  <div
                    className={`relative ${provider.dimensions.width} ${provider.dimensions.height}`}>
                    <ImageWithRetry
                      src={provider.logoSrc}
                      alt={provider.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full h-0.5 bg-card mt-4" />
        </nav>
        <SidebarContent />
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  )
}
