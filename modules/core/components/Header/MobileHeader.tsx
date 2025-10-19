'use client'
import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/modules/core/components/ui/sheet'
import { Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGlobalStore } from '@/modules/football/presentation/core/store/globalStore'
import { useTheme } from 'next-themes'
import { useSearchStore } from '@/modules/football/presentation/core/store/useSearchStore'
import { ImageWithRetry } from '../Image/ImageWithRetry'
import { SidebarMobile } from '../Sidebar/SidebarMobile'

interface Props {
  title: string
}

export const MobileHeader = ({ title }: Props) => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { menu, setMenu } = useGlobalStore()
  const { theme } = useTheme()
  const [currentLogo, setCurrentLogo] = useState('/logo/90.svg')
  const { context, openSearch, closeSearch, query } = useSearchStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenu('closed')
  }, [pathname, setMenu])

  useEffect(() => {
    setCurrentLogo(theme === 'dark' ? '/logo/90.svg' : '/logo/90.svg')
  }, [theme])

  return (
    <header
      data-scrolled={scrolled}
      className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-3 bg-background/95 backdrop-blur border-b border-transparent data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/90">
      <Link onClick={closeSearch} href="/" className="flex items-center gap-2">
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
      <div className="flex items-center gap-2">
        {context && (
          <div className="relative">
            <button
              onClick={openSearch}
              aria-label="Abrir buscador"
              className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Search size={18} />
            </button>
            {query && (
              <div className="absolute top-1.5 right-2 bg-primary text-white rounded-full w-2 h-2 flex items-center justify-center" />
            )}
          </div>
        )}

        <Sheet
          open={menu === 'open'}
          onOpenChange={(v) => {
            setMenu(v ? 'open' : 'closed')
            closeSearch()
          }}>
          <SheetTrigger
            aria-label="Menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card hover:bg-card/80 transition">
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-none h-full flex flex-col bg-background md:max-w-sm">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú principal</SheetTitle>
            </SheetHeader>
            <SidebarMobile title={title} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
