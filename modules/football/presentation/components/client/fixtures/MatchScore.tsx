import { Match } from '@/modules/football/domain/models/fixture'
import { cn } from '@/lib/utils'

interface Props {
  match: Match
  className?: string
}

export const MatchScore = ({ match, className }: Props) => {
  const homeRedCards = match.events.filter((e) => e.type === 'redcard' && e.team === 'localteam').length
  const awayRedCards = match.events.filter((e) => e.type === 'redcard' && e.team === 'visitorteam').length

  return (
    <div className={cn('min-w-4 lg:min-w-12 score relative flex flex-col items-center justify-center gap-0', className)}>
      <div className="flex space-x-1 lg:space-x-2">
        <div className="relative flex items-center gap-2">
          <p className="text-base lg:text-xl font-semibold">{match.localTeam.goals && match.localTeam.goals !== '?' ? match.localTeam.goals : ''}</p>
          {homeRedCards > 0 && (
            <div className="absolute bg-red-500 w-1.5 h-2.5 rounded-xs top-0 left-[-7px] lg:left-[-10px]" />
          )}
        </div>
        <p className="text-base lg:text-xl font-semibold">-</p>
        <div className="relative">
          <p className="text-base lg:text-xl font-semibold">{match.visitorTeam.goals && match.visitorTeam.goals !== '?' ? match.visitorTeam.goals : ''}</p>
          {awayRedCards > 0 && (
            <div className="absolute bg-red-500 w-1.5 h-2.5 rounded-xs top-0 right-[-7px] lg:right-[-10px]" />
          )}
        </div>
      </div>
    </div>
  )
}