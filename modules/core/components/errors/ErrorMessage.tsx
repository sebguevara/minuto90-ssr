'use client'

import { Button } from '@/modules/core/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/modules/core/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
  className?: string
}

export function ErrorMessage({
  title = 'Error',
  message = 'Ocurrió un error al cargar los datos',
  onRetry,
  showRetry = true,
  className = '',
}: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground">{message}</p>
        </CardContent>

        {showRetry && onRetry && (
          <CardFooter>
            <Button onClick={onRetry} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}