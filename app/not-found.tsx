'use client'

import { Button } from '@/modules/core/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1>404 - Página no encontrada</h1>
      <Button onClick={() => router.push('/')}>Volver al inicio</Button>
    </div>
  )
}