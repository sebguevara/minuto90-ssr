import { Filters } from './Filters'
interface Props {
  title: string
  date: string
  setDate: (date: string) => void
  liveOnly: boolean
  setLiveOnly: (liveOnly: boolean) => void
  showOdds: boolean
  setShowOdds: (showOdds: boolean) => void
  setExpanded: (expanded: boolean) => void
  scheduledOnly: boolean
  setScheduledOnly: (scheduledOnly: boolean) => void
  favoritesOnly: boolean
  setFavoritesOnly: (favoritesOnly: boolean) => void
  finishedOnly: boolean
  setFinishedOnly: (finishedOnly: boolean) => void
}
export const PreviewHeader = ({
  title,
  date,
  setDate,
  liveOnly,
  setLiveOnly,
  showOdds,
  setShowOdds,
  setExpanded,
  scheduledOnly,
  setScheduledOnly,
  favoritesOnly,
  setFavoritesOnly,
  finishedOnly,
  setFinishedOnly,
}: Props) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-2">
      <h1 className="text-sm lg:text-base font-semibold w-full lg:w-max text-center bg-card lg:bg-transparent py-2 rounded-lg">
        {title}
      </h1>
      <Filters
        {...{
          date,
          setDate,
          liveOnly,
          setLiveOnly,
          showOdds,
          setShowOdds,
          setExpanded,
          scheduledOnly,
          setScheduledOnly,
          favoritesOnly,
          setFavoritesOnly,
          finishedOnly,
          setFinishedOnly,
        }}
      />
    </div>
  )
}
