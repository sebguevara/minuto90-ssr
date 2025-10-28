import { Skeleton } from '@/modules/core/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/modules/core/components/ui/card'

export function MatchSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Botón volver */}
      <Skeleton className="h-9 w-24" />

      {/* Información de la liga */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Card principal del partido */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Marcador */}
          <div className="flex items-center justify-between gap-4">
            {/* Equipo Local */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Marcador */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16" />
                <Skeleton className="h-8 w-4" />
                <Skeleton className="h-16 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Equipo Visitante */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Información adicional */}
          <div className="border-t pt-4 space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Eventos skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-5" />
                <Skeleton className="flex-1 h-12" />
                <Skeleton className="w-16 h-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

