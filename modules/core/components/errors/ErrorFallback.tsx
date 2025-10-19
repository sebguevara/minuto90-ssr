'use client'

import { Button } from '@/modules/core/components/ui/button'
import { useRouter } from 'next/navigation'

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
      <h2 className="text-xl font-bold text-destructive">Ha ocurrido un error</h2>
      <p className="mt-2 text-muted-foreground">
        No se pudo cargar la página solicitada. Inténtalo de nuevo o vuelve al inicio.
      </p>
      <pre className="mt-4 w-full max-w-lg overflow-x-auto rounded-md bg-muted p-2 text-left text-xs text-muted-foreground">
        {error.message}
      </pre>
      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={reset}>
          Volver a intentar
        </Button>
        <Button onClick={() => router.push('/')}>Volver al inicio</Button>
      </div>
    </div>
  )
}
