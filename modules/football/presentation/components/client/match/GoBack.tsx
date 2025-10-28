'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/lib/utils'

interface Props {
  className?: string
}

export const GoBack = ({ className }: Props) => {
  const router = useRouter()  
  const handleClick = () => router.back()

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={cn("absolute z-10 text-sm top-13 lg:top-[-10px] left-4 lg:left-2 flex items-center gap-2 hover:text-primary transition-colors text-black dark:text-white dark:hover:text-primary", className)}
      >
      <ArrowLeft className="h-4 w-4" />
      <span>Volver</span>
    </Link>
  )
}
