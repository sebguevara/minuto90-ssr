'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeSwitch() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-16 h-8 rounded-full bg-muted border border-border" />
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div
      onClick={toggleTheme}
      className={cn(
        'flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-300',
        'border border-border',
        isDark ? 'justify-end bg-secondary' : 'justify-start bg-muted'
      )}
      aria-label="Toggle theme">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm">
        {isDark ? (
          <Sun className="h-3 w-3 text-foreground" />
        ) : (
          <Moon className="h-3 w-3 text-foreground" />
        )}
      </motion.div>
    </div>
  )
}
