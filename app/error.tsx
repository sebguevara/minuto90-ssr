'use client'

import { useEffect } from 'react'
import { Button } from '@/modules/core/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
        </motion.div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          ¡Ups! Algo salió mal
        </h1>
        
        <p className="mb-6 text-muted-foreground">
          Ocurrió un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 rounded-lg bg-muted p-4 text-left">
            <summary className="cursor-pointer font-medium text-sm">
              Detalles técnicos
            </summary>
            <pre className="mt-2 overflow-auto text-xs">
              {error.message}
              {error.digest && `\nError ID: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </Button>
          
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Si el problema persiste, contáctanos en soporte@minuto90.co
        </p>
      </motion.div>
    </div>
  )
}