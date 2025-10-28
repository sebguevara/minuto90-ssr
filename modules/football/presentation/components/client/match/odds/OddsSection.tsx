'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { useOddsByMatch } from '../../hooks/useOddsByMatch'
import { ScrollArea, ScrollBar } from '@/modules/core/components/ui/scroll-area'
import { pickBetFor, pickOdd, extractLines, headerES } from '../../utils/odds'
import { Bookmaker } from '@/modules/football/domain/entities/Bet'
import { MARKETS, PERIODS } from '../../const/odds'
import { Skeleton } from '@/modules/core/components/ui/skeleton'

type Props = { fixture: number }

export const OddsSection = ({ fixture }: Props) => {
  const { data: books, isLoading } = useOddsByMatch(fixture, true)

  const [marketKey, setMarketKey] = useState<(typeof MARKETS)[number]['key']>('1x2')
  const [periodKey, setPeriodKey] = useState<(typeof PERIODS)[number]['key']>('ft')
  const [line, setLine] = useState<string | null>(null)

  const market = MARKETS.find((m) => m.key === marketKey)!
  const period = PERIODS.find((p) => p.key === periodKey)!

  useEffect(() => {
    setLine(null)
    if (books?.length && 'needsLine' in market && market.needsLine) {
      for (const bk of books) {
        const bet = pickBetFor(bk.bets, market, period)
        if (bet) {
          const allLines = extractLines(bet, market.key)
          if (allLines.length > 0) {
            setLine(allLines[0])
            break
          }
        }
      }
    }
  }, [books, market, period, marketKey, periodKey])

  const rows = useMemo(() => {
    if (!books?.length) return []
    const out: Array<{ bookmaker: Bookmaker; values: Record<string, string | null> }> = []

    for (const bk of books as Bookmaker[]) {
      const bet = pickBetFor(bk.bets, market, period)
      if (!bet) continue

      const vmap: Record<string, string | null> = {}
      for (const o of market.outcomes) {
        vmap[o] = pickOdd(bet, market.key, o, line)
      }
      out.push({ bookmaker: bk, values: vmap })
    }
    return out
  }, [books, market, period, line])

  const linesForSelect = useMemo(() => {
    if (!books || !('needsLine' in market) || !market.needsLine) return []
    for (const bk of books as Bookmaker[]) {
      const bet = pickBetFor(bk.bets, market, period)
      if (bet) {
        const ls = extractLines(bet, market.key)
        if (ls.length) return ls
      }
    }
    return []
  }, [books, market, period])

  if (isLoading) return oddsSkeleton()

  return (
    <div className="mt-4 flex flex-col gap-2">
      <header className="pb-2">
        <h3 className="text-sm font-semibold">Cuotas</h3>
      </header>
      <section className="rounded-md border border-border bg-card py-2">
        <div className="flex flex-col px-2">
          <ScrollArea className="w-full py-1 whitespace-nowrap">
            <div className="flex gap-2 lg:gap-3 px-1 pb-2">
              {MARKETS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMarketKey(m.key)}
                  className={`text-xs px-2 py-1 rounded-full border cursor-pointer ${
                    marketKey === m.key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted border-border'
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>

          <ScrollArea className="w-full whitespace-nowrap pt-1">
            <div className="flex gap-1 px-1 pb-2">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriodKey(p.key)}
                  className={`text-xs px-2 py-1 rounded-md cursor-pointer ${
                    periodKey === p.key ? 'bg-muted font-semibold' : 'bg-transparent'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>

          {linesForSelect.length > 0 && (
            <div className="px-2 pb-3">
              <label className="text-xs opacity-70 mr-2">Línea:</label>
              <select
                className="text-sm rounded-md border bg-background px-2 py-1"
                value={line ?? ''}
                onChange={(e) => setLine(e.target.value)}>
                {linesForSelect.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="px-2 pb-3">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-3 py-2">Casa</th>
                  {market.outcomes.map((o) => (
                    <th key={o} className="px-2 py-2 text-center font-semibold">
                      {headerES(market.key as '1x2' | 'double' | 'btts' | 'ou' | 'ah', o, line)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(({ bookmaker, values }) => (
                  <tr key={bookmaker.id}>
                    <td className="px-3 py-2">
                      <BookLogo name={bookmaker.name} />
                    </td>
                    {market.outcomes.map((o) => (
                      <td key={o} className="px-2 py-2 text-center">
                        {values[o] ? (
                          <span className="inline-flex min-w-12 justify-center rounded-md bg-primary/10 px-2 py-1 font-medium">
                            {values[o]}
                          </span>
                        ) : (
                          <span className="opacity-50">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td
                      colSpan={1 + market.outcomes.length}
                      className="px-3 py-6 text-center opacity-70">
                      No hay cuotas para este mercado/período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

const BookLogo = ({ name }: { name: string }) => {
  const is1x = name.toLowerCase().includes('1xbet')
  if (is1x) {
    return (
      <div className="relative w-10 h-8">
        <Image
          src="/icons/1xbet.svg"
          alt={name}
          fill
          sizes="20px"
          className="object-contain rounded-sm"
        />
      </div>
    )
  }
  const initials = name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 3)
  return (
    <div className="w-5 h-5 rounded-sm bg-muted flex items-center justify-center text-[10px] font-bold">
      {initials}
    </div>
  )
}

const oddsSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2 pt-4">
      <Skeleton className="w-full h-60" />
    </div>
  )
}
