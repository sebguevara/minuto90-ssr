'use client'

import { Match } from '@/modules/football/domain/models/fixture'
import { generateSlug, cn } from '@/lib/utils'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { Button } from '@/modules/core/components/ui/button'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'

interface Props {
  match: Match
}

export const CardMatch = ({ match }: Props) => {
  const { isMatchFavorite, toggleFavoriteMatch } = useFavoriteStore()
  const isFavorite = isMatchFavorite(parseInt(match.id, 10))

  const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const favoritePayload = {
        id: parseInt(match.id, 10),
        teams: { home: { id: parseInt(match.localTeam.id, 10), name: match.localTeam.name, logo: match.localTeam.logo }, away: { id: parseInt(match.visitorTeam.id, 10), name: match.visitorTeam.name, logo: match.visitorTeam.logo } },
        league: { id: 0, name: '' },
        date: match.date,
        status: { short: match.status, long: '' },
        score: { fullTime: { home: match.localTeam.goals, away: match.visitorTeam.goals } },
        events: [],
    };
    toggleFavoriteMatch(favoritePayload as any)
  }

  const href = `/football/partido/liga/${generateSlug(match.localTeam.name)}-vs-${generateSlug(match.visitorTeam.name)}/${match.id}`;

  return (
    <div className={cn('flex flex-col bg-card rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200', isFavorite && 'favorite-border-bottom')}>
        <Link href={href} prefetch={false} className="block relative">
            <div className="flex items-center justify-center gap-x-2 lg:gap-x-4 h-[36px] relative">
                <div className="relative flex flex-1 items-center justify-end h-full">
                     <Button variant="ghost" size="icon" onClick={handleFavoriteToggle} className="h-6 w-6 absolute left-0">
                        <Heart size={16} className={`transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'}`} />
                    </Button>
                    <h1 className="text-[10px] lg:text-sm font-medium truncate leading-tight" title={match.localTeam.name}>
                        {match.localTeam.name}
                    </h1>
                    <div className="relative w-5 h-5 lg:w-8 lg:h-8 shrink-0 ml-2">
                        {match.localTeam.logo && <ImageWithRetry src={match.localTeam.logo} alt={match.localTeam.name} fill sizes="48px" className="object-contain" />}
                    </div>
                </div>
                <div className="flex items-center justify-center min-w-[50px] bg-primary/10 rounded-md px-2">
                    <span className="text-sm font-bold">{match.localTeam.goals} - {match.visitorTeam.goals}</span>
                </div>
                <div className="relative flex flex-1 items-center justify-start h-full">
                    <div className="relative w-5 h-5 lg:w-8 lg:h-8 shrink-0 mr-2">
                        {match.visitorTeam.logo && <ImageWithRetry src={match.visitorTeam.logo} alt={match.visitorTeam.name} fill sizes="48px" className="object-contain" />}
                    </div>
                    <h1 className="text-[10px] lg:text-sm font-medium truncate leading-tight text-left" title={match.visitorTeam.name}>
                        {match.visitorTeam.name}
                    </h1>
                </div>
            </div>
        </Link>
    </div>
  )
}