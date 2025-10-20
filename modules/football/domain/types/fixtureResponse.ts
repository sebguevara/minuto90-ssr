import { StatusConfig } from '@/lib/consts/football/match_status'
import { GoalServeTeam } from './common'

export interface GoalServeMatch {
  '@status': string
  statusConfig?: StatusConfig
  '@timer': string
  '@date': string
  '@formatted_date': string
  '@time': string
  '@commentary_available': string
  '@venue': string
  '@coveredLive': string
  '@static_id': string
  '@fix_id': string
  '@id': string
  localteam: GoalServeTeam
  visitorteam: GoalServeTeam
  ht?: { '@score': string }
  ft?: { '@score': string }
  et?: { '@score': string }
  pen?: { '@score': string }
  events?: {
    event: GoalServeEvent | GoalServeEvent[]
  }
}

export interface GoalServeEvent {
  '@type': string
  '@minute': string
  '@team': string
  '@player': string
  '@playerId': string
  '@assist': string
  '@assistid': string
  '@result': string
}

export interface GoalServeCategory {
  '@name': string
  '@id': string
  '@iscup': string
  '@file_group': string
  matches: {
    '@date': string
    '@formatted_date': string
    match: GoalServeMatch | GoalServeMatch[]
  }
}

export interface GoalServeFixturesResponse {
  scores: {
    '@sport': string
    '@updated': string
    category: GoalServeCategory[]
  }
}
