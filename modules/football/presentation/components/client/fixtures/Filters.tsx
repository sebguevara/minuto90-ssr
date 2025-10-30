'use client'

import { Toggle } from '@/modules/core/components/ui/toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/core/components/ui/select'
import { CalendarIcon } from 'lucide-react'
import { format, subDays, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

// Función para generar las opciones de fecha para el Select
const generateDateOptions = () => {
  const options = []
  const today = new Date()
  // Rango extendido a 7 días antes y 7 días después
  for (let i = -7; i <= 7; i++) {
    const date = addDays(today, i)
    const value = i === 0 ? 'home' : i > 0 ? `d${i}` : `d-${Math.abs(i)}`
    let label = format(date, 'E dd MMM', { locale: es })
    if (i === 0) label = 'Hoy'
    else if (i === -1) label = 'Ayer'
    else if (i === 1) label = 'Mañana'
    else {
      label = label.charAt(0).toUpperCase() + label.slice(1)
    }
    options.push({ value, label })
  }
  return options
}

interface FiltersProps {
  liveOnly: boolean
  setLiveOnly: (liveOnly: boolean) => void
  scheduledOnly: boolean
  setScheduledOnly: (scheduledOnly: boolean) => void
  finishedOnly: boolean
  setFinishedOnly: (finishedOnly: boolean) => void
  favoritesOnly: boolean
  setFavoritesOnly: (favoritesOnly: boolean) => void
  showOdds: boolean
  setShowOdds: (showOdds: boolean) => void
  date: string
  setDate: (date: string) => void
}

export const Filters = ({
  liveOnly,
  setLiveOnly,
  scheduledOnly,
  setScheduledOnly,
  finishedOnly,
  setFinishedOnly,
  favoritesOnly,
  setFavoritesOnly,
  showOdds,
  setShowOdds,
  date,
  setDate,
}: FiltersProps) => {
  const dateOptions = generateDateOptions()

  const handleToggle = (
    type: 'live' | 'scheduled' | 'finished' | 'favorites',
    pressed: boolean
  ) => {
    setLiveOnly(type === 'live' ? pressed : false)
    setScheduledOnly(type === 'scheduled' ? pressed : false)
    setFinishedOnly(type === 'finished' ? pressed : false)

    if (type === 'favorites') {
      setFavoritesOnly(pressed)
    } else if (pressed) {
      setFavoritesOnly(false)
    }
  }

  const handleDateChange = (newDateValue: string) => {
    setLiveOnly(false)
    setScheduledOnly(false)
    setFinishedOnly(false)
    setDate(newDateValue)
  }

  const isToday = date === 'home'

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full lg:w-max justify-between">
      <div className="flex items-center justify-between gap-2 order-1 md:order-2 bg-card">
        <Select value={date} onValueChange={handleDateChange} disabled={favoritesOnly}>
          <SelectTrigger className="w-full md:w-[170px]">
            <CalendarIcon size={14} />
            <SelectValue placeholder="Selecciona una fecha" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-2 lg:gap-2 mt-1 md:mt-0 order-2 md:order-1">
        <div className="flex items-center gap-2">
          <Toggle
            aria-label="Favoritos"
            pressed={favoritesOnly}
            onPressedChange={(p) => handleToggle('favorites', p)}>
            <span className="text-xs lg:text-sm">Favoritos</span>
          </Toggle>
          <Toggle aria-label="Cuotas" pressed={showOdds} onPressedChange={setShowOdds}>
            <span className="text-xs lg:text-sm">Cuotas</span>
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          {isToday && (
            <>
              <Toggle
                disabled={favoritesOnly}
                aria-label="En vivo"
                className="data-[state=on]:bg-destructive dark:text-white"
                pressed={liveOnly}
                onPressedChange={(p) => handleToggle('live', p)}>
                <span className="text-xs lg:text-sm">En vivo</span>
              </Toggle>
              <Toggle
                disabled={favoritesOnly}
                aria-label="Finalizados"
                pressed={finishedOnly}
                onPressedChange={(p) => handleToggle('finished', p)}>
                <span className="text-xs lg:text-sm">Finalizados</span>
              </Toggle>
              <Toggle
                disabled={favoritesOnly}
                aria-label="Próximos"
                pressed={scheduledOnly}
                onPressedChange={(p) => handleToggle('scheduled', p)}>
                <span className="text-xs lg:text-sm">Próximos</span>
              </Toggle>
            </>
          )}
        </div>
      </div>
    </div>
  )
}