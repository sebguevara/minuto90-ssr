import { MappedPlayerHalf } from '../../utils/halfColumns'
import { PlayerUI } from '../../utils/buildSquadUI'
import { Shirt, Square } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
import { generateSlug } from '@/shared/lib/utils'

interface Props {
  p: MappedPlayerHalf & Partial<PlayerUI>
  color: string
  neutral?: string
}

export const PlayerDot = ({ p, color, neutral }: Props) => {
  const bg = p.pos === 'G' && neutral ? neutral : color

  const eventIcons: React.ReactNode[] = []

  if (p.goals && p.goals > 0) {
    for (let i = 0; i < p.goals; i++) {
      eventIcons.push(
        <span
          key={`goal-${i}`}
          className="text-[9px] md:text-[16px] leading-none"
          aria-label={`${p.goals} Goles`}>
          ⚽
        </span>
      )
    }
  }

  if (p.cards && p.cards.length > 0) {
    p.cards.forEach((card, i) => {
      eventIcons.push(
        <Square
          key={`card-${i}`}
          className="w-2 h-3 lg:w-4 lg:h-4"
          fill={card.type === 'yellow' ? '#fdd835' : '#e53935'}
          color="transparent"
          aria-label={`Tarjeta ${card.type === 'yellow' ? 'Amarilla' : 'Roja'}`}
        />
      )
    })
  }

  return (
    <Link
      href={`/football/jugador/${generateSlug(p.name ?? '')}/${p.id}`}
      className="group relative flex flex-col items-center justify-center">
      <div className="relative w-7 h-7 lg:w-12 lg:h-12 flex items-center justify-center">
        {p.photo ? (
          <ImageWithRetry
            src={p.photo}
            alt={p.name ?? 'player'}
            fill
            sizes="48px"
            className="rounded-full object-cover"
          />
        ) : (
          <>
            <Shirt fill={bg} color="transparent" className="w-full h-full" />
            <span className="absolute text-white text-[9px] lg:text-sm font-bold">{p.number}</span>
          </>
        )}

        {eventIcons.length > 0 && (
          <div className="absolute -bottom-1 -right-1 flex items-center gap-px rounded-full px-1 py-px">
            {eventIcons}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute z-[9992] left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <span className="cursor-default px-2 py-1 bg-background text-[10px] lg:text-xs rounded shadow whitespace-nowrap">
          {p.name}
        </span>
      </div>
    </Link>
  )
}
