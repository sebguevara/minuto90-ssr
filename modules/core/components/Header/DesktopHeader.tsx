'use client'

import { CalendarFold, Users, Heart, Dock, ChevronDown } from 'lucide-react'
import { ModeToggle } from '../Toggle/ModeToggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/utils'
import { SearchInput } from './SearchInput'
import { useSearchStore } from '@/modules/football/presentation/core/store/useSearchStore'
import { ImageWithRetry } from '../Image/ImageWithRetry'
import { InstallPWAButton } from '@/modules/core/components/PWA/InstallPWAButton'
import { bettingProviders } from '@/shared/consts/bettingProviders'
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/core/components/ui/dropdown-menu'
import { Button } from '../ui/button'

interface Props {
  title: string
}

export const DesktopHeader = ({ title }: Props) => {
  const [scrolled, setScrolled] = useState(false)
  const [currentLogo] = useState<string>('/logo/90.svg')
  const { context } = useSearchStore()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-scrolled={scrolled}
      className="hidden lg:flex sticky top-4 z-40 items-center justify-between
      rounded-xl px-2 py-2 shadow-lg bg-foreground dark:bg-secondary text-white
      transition data-[scrolled=true]:opacity-90 mb-6">
      <Link href="/" className="flex items-center">
        <div className="relative w-18 h-8">
          <ImageWithRetry
            src={currentLogo}
            alt={title}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
      </Link>

      <nav className="flex items-center gap-4">
        {context && (
          <div className="flex items-center gap-4">
            <SearchInput
              isHeader
              className="h-9 bg-foreground dark:bg-card border border-card focus:border-none placeholder:text-card/60"
            />
          </div>
        )}
        <Link
          href="/"
          className={cn(
            'hover:text-primary flex items-center gap-1.5 text-sm transition-colors',
            pathname === '/' ? 'text-primary' : 'text-white'
          )}>
          <CalendarFold size={18} />
          <span>Resultados</span>
        </Link>
        <Link
          href="/football/favoritos"
          className={cn(
            'hover:text-primary flex items-center gap-1.5 text-sm transition-colors',
            pathname === '/football/favoritos' ? 'text-primary' : 'text-white'
          )}>
          <Heart size={18} />
          <span>Favoritos</span>
        </Link>
        <Link
          href="https://t.me/+oPoqpWhIfzgwYjk5"
          target="_blank"
          className={cn('hover:text-primary flex items-center gap-1.5 text-sm transition-colors')}>
          <Users size={18} />
          <span>Comunidad</span>
        </Link>
        <Link
          href="https://w.app/fullrecarga"
          target="_blank"
          className={cn('hover:text-primary flex items-center gap-1.5 text-sm transition-colors')}>
          <Dock size={18} />
          <span>Recargas</span>
        </Link>
        <div className="flex items-center gap-1">
          <InstallPWAButton />

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 text-sm text-white hover:bg-transparent hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0">
                Sponsors
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {bettingProviders.map((provider) => (
                <DropdownMenuItem key={provider.name} asChild>
                  <Link
                    href={provider.href}
                    target="_blank"
                    className="cursor-pointer flex justify-center py-2">
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
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}
