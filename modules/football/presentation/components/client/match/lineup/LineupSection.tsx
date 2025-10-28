'use client'

import type { MatchLineup } from '@/modules/football/domain/entities/Match'
import { mapPlayersByHalfColumns, MappedPlayerHalf } from '../../utils/halfColumns'
import { TeamFormation } from './TeamFormation'
import { PitchSvg } from './Pitch'
import { MatchColors } from '@/modules/football/domain/entities/Colors'
import { HalfSide } from './HalfSide'
import SquadTabs from './SquadTabs'
import { SquadUI } from '../../utils/buildSquadUI'
import { abbreviateTeamName } from '@/shared/lib/utils'

interface Props {
  home: MatchLineup
  away: MatchLineup
  colors: MatchColors
  homeUI: SquadUI
  awayUI: SquadUI
}

export const LineupSection = ({ home, away, homeUI, awayUI }: Props) => {
  const homePlayers = mapPlayersByHalfColumns(home.startXI, home.formation, 'home')
  const awayPlayers = mapPlayersByHalfColumns(away.startXI, away.formation, 'away')

  const groupByCol = (arr: MappedPlayerHalf[]) =>
    arr.reduce<Record<number, MappedPlayerHalf[]>>((acc, p) => {
      ;(acc[p.colHalf] ||= []).push(p)
      return acc
    }, {})

  const homeCols = groupByCol(homePlayers)
  const awayCols = groupByCol(awayPlayers)

  return (
    <div className="w-full flex flex-col gap-y-4">
      <section className="w-full flex items-center justify-center flex-col gap-4 mt-4">
        <div className="bg-card rounded-xl shadow-lg w-full lg:w-[680px] h-max p-4 mx-auto">
          <div className="flex justify-between text-xs px-2 mb-4">
            <TeamFormation
              name={abbreviateTeamName(homeUI.team?.name ?? 'Local')}
              formation={home.formation ?? ''}
              flip={false}
            />
            <TeamFormation
              name={abbreviateTeamName(awayUI.team?.name ?? 'Visitante')}
              formation={away.formation ?? ''}
              flip={true}
            />
          </div>
          <div className="relative w-full mx-auto aspect-[2/1] rounded-xl overflow-hidden">
            <PitchSvg />

            <div className="absolute inset-0 z-30 grid grid-cols-2">
              <HalfSide side="h" cols={homeCols} squadUI={homeUI} />
              <HalfSide side="a" cols={awayCols} squadUI={awayUI} mirror />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full">
        <SquadTabs home={homeUI} away={awayUI} />
      </section>
    </div>
  )
}
