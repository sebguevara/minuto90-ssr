'use client'

import { cn } from '@/lib/utils'
interface Props {
  homeTeamScore?: number
  awayTeamScore?: number
  penalties?: number
}

export const MatchHeaderScore = ({
  homeTeamScore,
  awayTeamScore,
  penalties,
}: Props) => {
  return (
    <div
      className={cn(
        'min-w-8 lg:min-w-12 score relative flex items-center justify-center gap-0 lg:gap-2'
      )}>
      <div className="flex space-x-2">
        <div className="relative flex items-center gap-2">
          <p className="text-3xl font-semibold">{homeTeamScore ?? 0}</p>
          {penalties && penalties > 0 && (
            <div className="absolute w-1.5 h-2.5 rounded-xs top-0 left-[-10px]" style={{ backgroundColor: 'red' }} />
          )}
        </div>
        <p className="text-3xl font-semibold">:</p>
        <div className="relative">
          <p className="text-3xl font-semibold">{awayTeamScore ?? 0}</p>
          {penalties && penalties > 0 && (
            <div className="absolute w-1.5 h-2.5 rounded-xs top-0 right-[-10px]" style={{ backgroundColor: 'red' }} />
          )}
        </div>
      </div>

      {penalties && penalties > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] lg:bottom-[-8px] inline-flex items-center text-[9px] lg:text-xs font-semibold whitespace-nowrap">
          ({penalties} - {penalties})
        </div>
      )}
    </div>
  )
}
