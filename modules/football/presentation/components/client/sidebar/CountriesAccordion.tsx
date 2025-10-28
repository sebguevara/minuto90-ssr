'use client'
import { useState, useCallback, useMemo } from 'react'
import { COUNTRIES } from '@/lib/consts/football/countries'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/modules/core/components/ui/accordion'
import { ScrollArea } from '@/modules/core/components/ui/scroll-area'
import { useLeaguesByCountry } from '@/modules/football/application/hooks/useLeaguesByCountry'
import { usePrefetchLeagues } from '@/modules/football/presentation/hooks/usePrefetchLeagues'
import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { generateSlug, trimLabel } from '@/lib/utils'
import { useGlobalStore } from '@/modules/core/store/globalStore'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'

const COUNTRY_MAX = 18
const LEAGUE_MAX = 28

const CountryLeagues = ({ country }: { country: string }) => {
  const { data, isLoading, error } = useLeaguesByCountry(country, true)
  const { setMenu } = useGlobalStore()
  if (isLoading)
    return (
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-5 w-full px-2 rounded" />
          </li>
        ))}
      </ul>
    )
  if (error) return <div className="text-xs text-red-400">Error</div>
  if (!data?.length) return <div className="text-xs text-neutral-500">Sin ligas</div>
  const top = data.slice(0, 6)

  const handleClick = () => {
    setMenu('closed')
  }

  return (
    <ul className="flex flex-col gap-1">
      {top.map((l) => (
        <Link
          onClick={handleClick}
          href={`/football/liga/${generateSlug(l.name)}/${l.id}`}
          key={l.id}
          className="flex items-center mb-2 p-1 gap-2 bg-card rounded-md cursor-pointer hover:scale-[1.02] transition-all duration-200">
          {l.logo && (
            <span className="relative w-4 h-4">
              <ImageWithRetry
                src={l.logo}
                alt={l.name}
                fill
                sizes="16px"
                className="object-contain"
              />
            </span>
          )}
          <span title={l.name} className="text-xs">
            {trimLabel(l.name, LEAGUE_MAX)}
          </span>
        </Link>
      ))}
      {data.length > 6 && (
        <li>
          <Link
            href={`/football/pais/${generateSlug(country)}`}
            className="text-[11px] text-primary underline">
            Ver todas ({data.length})
          </Link>
        </li>
      )}
    </ul>
  )
}

export const CountriesAccordion = () => {
  const [open, setOpen] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const prefetch = usePrefetchLeagues()

  const handleChange = (values: string[] | string) => {
    const arr = Array.isArray(values) ? values : [values]
    setOpen(arr)
  }

  const handlePointer = useCallback(
    (name: string) => {
      prefetch(name)
    },
    [prefetch]
  )

  const countries = useMemo(() => COUNTRIES, [])
  const displayedCountries = isExpanded ? countries : countries.slice(0, 6)

  return (
    <article className="bg-card flex flex-col rounded-lg p-3 shadow-sm hover:shadow-lg transition-all duration-200">
      <h2 className="text-primary text-base font-semibold px-1 mb-3 select-none">Países</h2>
      <ScrollArea className="pl-1.5">
        <Accordion
          type="multiple"
          className="flex flex-col gap-2"
          value={open}
          onValueChange={handleChange}>
          {displayedCountries.map((c) => {
            const isOpen = open.includes(c.name)
            return (
              <AccordionItem key={c.code || c.name} value={c.name} className="border-none">
                <AccordionTrigger
                  onPointerEnter={() => handlePointer(c.name)}
                  className="flex items-center gap-2 rounded px-2 py-2 hover:bg-white/5 text-sm">
                  <Link
                    href={`/football/pais/${generateSlug(c.name)}`}
                    className="flex gap-2 items-center">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                      {c.flag && (
                        <ImageWithRetry
                          src={c.flag}
                          alt={c.name}
                          fill
                          sizes="20px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span title={c.name} className="flex-1 text-sm text-left">
                      {trimLabel(c.name, COUNTRY_MAX)}
                    </span>
                  </Link>
                </AccordionTrigger>
                <AccordionContent className="px-2 py-2">
                  {isOpen && <CountryLeagues country={c.name} />}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
        {!isExpanded && countries.length > 6 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center cursor-pointer gap-2 w-full mt-2 py-2 text-xs font-semibold text-primary hover:bg-white/5 rounded-md transition-colors">
            Ver más
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {isExpanded && countries.length > 6 && (
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center justify-center cursor-pointer gap-2 w-full mt-2 py-2 text-xs font-semibold text-primary hover:bg-white/5 rounded-md transition-colors">
            Ver menos
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </ScrollArea>
    </article>
  )
}
