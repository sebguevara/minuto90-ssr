import { Toggle } from '@/modules/core/components/ui/toggle'
import { Button } from '@/modules/core/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/core/components/ui/popover'
import { Calendar } from '@/modules/core/components/ui/calendar'
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react'
import { format, subDays, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { getTodayDate, parseToDate } from '@/lib/utils'

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
  setExpanded: (expanded: boolean) => void
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
  setExpanded,
}: FiltersProps) => {
  const dateFormatted = parseToDate(date)
  const isTodayDate = date === getTodayDate()

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

  const changeDate = (newDate: Date) => {
    setLiveOnly(false)
    setScheduledOnly(false)
    setFinishedOnly(false)
    setDate(format(newDate, 'yyyy-MM-dd'))
    setExpanded(false)
  }

  const prevDay = subDays(dateFormatted, 1)
  const nextDay = addDays(dateFormatted, 1)
  const prevDayLabel = format(prevDay, 'dd MMM', { locale: es })
  const nextDayLabel = format(nextDay, 'dd MMM', { locale: es })

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full lg:w-max justify-between">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={favoritesOnly}
          className="cursor-pointer dark:hover:text-primary dark:hover:bg-transparent"
          onClick={() => changeDate(prevDay)}>
          <ChevronLeft size={14} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={favoritesOnly}
          className="cursor-pointer dark:hover:text-primary dark:hover:bg-transparent md:hidden min-w-14 px-2 h-9"
          onClick={() => changeDate(prevDay)}>
          <span className="text-xs capitalize">{prevDayLabel}</span>
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={favoritesOnly}
              className="cursor-pointer dark:hover:text-primary flex-1 md:flex-none"
              variant="outline">
              <CalendarIcon size={14} />{' '}
              <span className="text-xs lg:text-sm capitalize">
                {format(dateFormatted, 'dd MMM yyyy', { locale: es })}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFormatted}
              onSelect={(d) => d && changeDate(d)}
              locale={es}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          disabled={favoritesOnly}
          className="cursor-pointer dark:hover:text-primary dark:hover:bg-transparent md:hidden min-w-14 px-2 h-9"
          onClick={() => changeDate(nextDay)}>
          <span className="text-xs capitalize">{nextDayLabel}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={favoritesOnly}
          className="cursor-pointer dark:hover:text-primary dark:hover:bg-transparent"
          onClick={() => changeDate(nextDay)}>
          <ChevronRight size={14} />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2 lg:gap-2 mt-1 md:mt-0">
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
          {!isTodayDate && (
            <Toggle aria-label="Hoy" onPressedChange={() => changeDate(new Date())}>
              <span className="text-xs lg:text-sm">Hoy</span>
            </Toggle>
          )}

          {isTodayDate && (
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
