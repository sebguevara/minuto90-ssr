// sebguevara/minuto90-ssr/minuto90-ssr-ae3f061568e172e16c8c3f11c52c20f7774632d1/modules/football/presentation/components/client/fixtures/CardMatch.tsx
import { abbreviateTeamName, getStatusConfig, cn, generateSlug } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { TagTime } from './TagTime'
import { MatchScore } from './MatchScore'
import { Badge } from '@/modules/core/components/ui/badge'
import { MatchOdds } from './MatchOdds'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { Button } from '@/modules/core/components/ui/button'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
import { Match } from '@/modules/football/domain/models/fixture'
import Link from 'next/link'  
import { ViewTransition } from 'react'
interface Props {
  fixture: Match
  showOdds?: boolean
  oddsLoading?: boolean
  fromQS?: string
  showDate?: boolean
  shortBadge?: boolean
}

export const CardMatch = ({
  fixture,
  showOdds,
  oddsLoading,
  fromQS,
  showDate,
  shortBadge,
}: Props) => {
  const from = fromQS || (typeof window !== 'undefined' ? window.location.search.slice(1) : '')
  const href = `/football/partido/${generateSlug(fixture.localTeam.name)}/${generateSlug(
    fixture.visitorTeam.name
  )}-vs-${generateSlug(fixture.visitorTeam.name)}/${fixture.id}${from ? `?from=${from}` : ''} `

  const { isMatchFavorite, toggleFavoriteMatch } = useFavoriteStore()
  const isFavorite = isMatchFavorite(Number(fixture.id))

  const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavoriteMatch(fixture)
  }
  console.log('fixture', fixture);

  console.log('fixture.statusConfig', fixture.statusConfig);
  
  
  const isFinished = fixture.statusConfig?.type === 'finished'

  return (
    <div
      className={cn(
        'flex flex-col bg-card rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200',
        isFavorite && 'favorite-border-bottom'
      )}>
      <Link href={href} prefetch={false} className="block relative">
        <div className="flex items-center justify-center gap-x-2 lg:gap-x-4 h-[36px] relative">
          <div className="relative flex flex-1 items-center justify-center h-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
              {showDate && isFinished ? (
                <div className="w-max  text-center">
                  <h1 className="text-[10px] lg:text-xs font-semibold text-muted-foreground">
                    {new Date(fixture.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </h1>
                </div>
              ) : (
                <TagTime match={fixture} />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                className="h-6 w-6">
                <Heart
                  size={16}
                  className={`transition-colors ${
                    isFavorite
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                />
              </Button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 max-w-[160px] md:max-w-[200px]">
              <ViewTransition name={`name-${fixture.id}-home`}>
                <h1
                  className="text-[10px] lg:text-sm font-medium truncate leading-tight"
                  title={fixture.localTeam.name}>
                  {abbreviateTeamName(fixture.localTeam.name).length > 13
                    ? abbreviateTeamName(fixture.localTeam.name).slice(0, 11) + '...'
                    : abbreviateTeamName(fixture.localTeam.name)}
                </h1>
              </ViewTransition>
              <div className="relative w-5 h-5 lg:w-8 lg:h-8 shrink-0">
                <ViewTransition name={`logo-${fixture.id}-home`}>
                  <ImageWithRetry
                    key={fixture.localTeam.logo ?? `default-home-${fixture.id}`}
                    src={fixture.localTeam.logo ?? ''}
                    alt={fixture.localTeam.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </ViewTransition>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <MatchScore match={fixture} />
          </div>

          <div className="relative flex flex-1 items-center justify-center h-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 max-w-[160px] md:max-w-[200px]">
              <div className="relative w-5 h-5 lg:w-8 lg:h-8 shrink-0">
                <ViewTransition name={`logo-${fixture.id}-away`}>
                  <ImageWithRetry
                    key={fixture.visitorTeam.logo ?? `default-away-${fixture.id}`}
                    src={fixture.visitorTeam.logo ?? ''}
                    alt={fixture.visitorTeam.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </ViewTransition>
              </div>
              <ViewTransition name={`name-${fixture.id}-away`}>
                <h1
                  className="text-[10px] lg:text-sm font-medium truncate leading-tight text-right"
                  title={fixture.visitorTeam.name}>
                  {abbreviateTeamName(fixture.visitorTeam.name).length > 16
                    ? abbreviateTeamName(fixture.visitorTeam.name).slice(0, 16) + '...'
                    : abbreviateTeamName(fixture.visitorTeam.name)}
                </h1>
              </ViewTransition>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-20">
              <Badge
                variant="outline"
                className={`px-1 lg:px-2 py-1 h-5 lg:h-6 text-[9px] lg:text-xs font-semibold tracking-wide ${fixture.statusConfig?.className}`}>
                <span className={`inline ${shortBadge ? 'md:inline' : 'md:hidden'}`}>
                  {fixture.status}
                </span>
                <span className={`hidden ${shortBadge ? 'md:hidden' : 'md:inline'}`}>
                  {fixture.statusConfig?.label}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}