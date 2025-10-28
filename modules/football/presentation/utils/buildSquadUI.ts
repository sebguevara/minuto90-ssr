'use client'
import { MatchLineup, MatchEvent, Player } from '@/modules/football/domain/entities/Match'
import { Squad } from '@/modules/football/domain/entities/Squad'
import { Team } from '@/modules/football/domain/entities/Team'

export type CardType = 'yellow' | 'red' | 'second-yellow'
export type SubType = 'in' | 'out'

export interface PlayerUI extends Player {
  age?: number
  height?: number
  photo?: string
  cards: { type: CardType; minute: number }[]
  subs: { type: SubType; minute: number }[]
  goals: number
}

export interface SquadUI {
  team: Team
  coach?: { id: number; name: string }
  starters: PlayerUI[]
  bench: PlayerUI[]
}

export const buildSquadUI = (
  lineup: MatchLineup,
  team: Team,
  events: MatchEvent[],
  squad?: Squad | null
): SquadUI => {
  const squadPlayersById = new Map(squad?.players.map((p) => [p.id, p]))

  const mapPlayer = ({ player }: { player: Player }): PlayerUI => {
    const evs = events.filter((e) => e.player?.id === player.id)
    const squadPlayer = player.id ? squadPlayersById.get(player.id) : undefined

    return {
      ...player,
      photo: squadPlayer?.photo,
      age: squadPlayer?.age,
      cards: evs
        .filter((e) => e.type === 'Card')
        .map((e) => ({
          type:
            e.detail === 'Yellow Card'
              ? 'yellow'
              : e.detail === 'Second Yellow card'
              ? 'second-yellow'
              : 'red',
          minute: e.time.elapsed,
        })),
      subs: evs
        .filter((e) => e.type === 'subst')
        .map((e) => ({
          type: e.detail === 'Substitution In' ? 'in' : 'out',
          minute: e.time.elapsed,
        })),
      goals: evs.filter((e) => e.type === 'Goal' && e.detail !== 'Missed Penalty').length,
    }
  }

  const starters = lineup.startXI.map(mapPlayer)
  const bench = (lineup.substitutes ?? []).map(mapPlayer)

  return {
    team,
    coach: lineup.coach,
    starters,
    bench,
  }
}
