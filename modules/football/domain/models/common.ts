export type EventType = 'goal' | 'yellowcard' | 'redcard' | 'substitution' | 'pen_miss'

export interface BaseEvent {
  type: EventType
  minute: number
  team: 'localteam' | 'visitorteam'
  player?: { id: string; name: string }
  assist?: { id: string; name: string }
}

export interface GoalEvent extends BaseEvent {
  type: 'goal'
  result: string
}

export interface CardEvent extends BaseEvent {
  type: 'yellowcard' | 'redcard'
}

export interface SubstitutionEvent extends BaseEvent {
  type: 'substitution'
  playerIn: { id: string; name: string }
  playerOut: { id: string; name: string }
}

export interface MissedPenaltyEvent extends BaseEvent {
  type: 'pen_miss'
}

export type MatchEvent = GoalEvent | CardEvent | SubstitutionEvent | MissedPenaltyEvent

export interface TeamInfo {
  id: string
  name: string
  logo?: string
}

export interface PlayerInfo {
  id: string
  name: string
  number?: number
}
