'use client'

import * as React from 'react'
import { useSearchStore } from '@/modules/football/presentation/core/store/useSearchStore'
import { Search, X } from 'lucide-react'
import { Input } from '../ui/input'
import { cn } from '@/shared/lib/utils'

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>

type CustomSearchInputProps = SearchInputProps & { isHeader?: boolean }

export const SearchInput = React.forwardRef<HTMLInputElement, CustomSearchInputProps>(
  ({ isHeader = false, className, ...props }, ref) => {
    const { query, setQuery, context } = useSearchStore()

    const placeholders: Record<string, string> = {
      home: 'Buscar por liga o equipo',
      'country-view': 'Buscar por liga',
      'league-view': 'Buscar por equipo o enfrentamiento',
    }

    return (
      <div className="relative w-full">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4',
            isHeader ? 'text-card/80 dark:text-muted-foreground' : 'text-muted-foreground'
          )}
        />
        <Input
          ref={ref}
          type="text"
          autoFocus
          placeholder={placeholders[context!] || 'Buscar...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn('pl-10 pr-10 dark:placeholder:text-muted-foreground', className)}
          {...props}
        />
        <button
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/20 cursor-pointer">
          <X
            className={cn(
              'h-4 w-4',
              isHeader ? 'text-card/80 dark:text-muted-foreground' : 'text-muted-foreground'
            )}
          />
        </button>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
