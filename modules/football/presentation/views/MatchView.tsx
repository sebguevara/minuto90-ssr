'use client'

import { useMatch } from '../hooks/use-match'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
import { Badge } from '@/modules/core/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/core/components/ui/card'
import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/modules/core/components/ui/button'
import { useRouter } from 'next/navigation'
import { abbreviateTeamName } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface MatchViewProps {
  matchId: string
  leagueId?: string
}

export function MatchView({ matchId, leagueId }: MatchViewProps) {
  const router = useRouter()
  const { data, isLoading, error } = useMatch(matchId, leagueId || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">No se pudo cargar la información del partido</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    )
  }

  const { match, league } = data
  const isLive = match.statusConfig?.type === 'live'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Botón volver */}
      <Button onClick={() => router.back()} variant="ghost" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      {/* Información de la liga */}
      <div className="flex items-center gap-3">
        {league.logo && (
          <div className="relative w-8 h-8">
            <ImageWithRetry
              src={league.logo}
              alt={league.name}
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold">{league.name}</h2>
          {league.country && (
            <p className="text-xs text-muted-foreground">{league.country.name}</p>
          )}
        </div>
      </div>

      {/* Card principal del partido */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Detalles del Partido</CardTitle>
            <Badge
              variant="outline"
              className={`${match.statusConfig?.className} font-semibold`}>
              {match.statusConfig?.label || match.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Marcador */}
          <div className="flex items-center justify-between gap-4">
            {/* Equipo Local */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-20 h-20">
                <ImageWithRetry
                  src={match.localTeam.logo || ''}
                  alt={match.localTeam.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <h3 className="text-center font-semibold text-sm md:text-base">
                {abbreviateTeamName(match.localTeam.name)}
              </h3>
            </div>

            {/* Marcador */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <div className="text-4xl md:text-5xl font-bold">
                  {match.localTeam.goals}
                </div>
                <div className="text-2xl text-muted-foreground">-</div>
                <div className="text-4xl md:text-5xl font-bold">
                  {match.visitorTeam.goals}
                </div>
              </div>
              {match.timer && isLive && (
                <div className="text-sm font-medium text-destructive animate-pulse">
                  {match.timer}'
                </div>
              )}
              {match.htScore && (
                <div className="text-xs text-muted-foreground">
                  HT: {match.htScore}
                </div>
              )}
              {match.ftScore && (
                <div className="text-xs text-muted-foreground">
                  FT: {match.ftScore}
                </div>
              )}
            </div>

            {/* Equipo Visitante */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-20 h-20">
                <ImageWithRetry
                  src={match.visitorTeam.logo || ''}
                  alt={match.visitorTeam.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <h3 className="text-center font-semibold text-sm md:text-base">
                {abbreviateTeamName(match.visitorTeam.name)}
              </h3>
            </div>
          </div>

          {/* Información adicional */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(match.date), "EEEE, d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </span>
              <span className="ml-2">{match.time}</span>
            </div>
            {match.venue && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{match.venue}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Eventos del partido */}
      {match.events && match.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eventos del Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {match.events.map((event, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-12 text-center font-semibold text-muted-foreground">
                    {event.minute}'
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.player?.name}</div>
                    {event.assist && (
                      <div className="text-xs text-muted-foreground">
                        Asistencia: {event.assist?.name || ''}
                      </div>
                    )}
                  </div>
                  <div className="text-xs px-2 py-1 bg-muted rounded">
                    {event.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje de comentarios disponibles */}
      {match.commentaryAvailable && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              💬 Comentarios disponibles para este partido
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
