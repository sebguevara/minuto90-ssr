import { Match, LeagueFixtures } from '@/modules/football/domain/models/fixture'
import { MatchEvent, EventType } from '@/modules/football/domain/models/common'
import {
  GoalServeFixturesResponse,
  GoalServeCategory,
  GoalServeMatch,
  GoalServeEvent,
} from '@/modules/football/domain/types/fixtureResponse'
import { ALL_COUNTRIES } from '@/lib/consts'

const toEvent = (event: GoalServeEvent): MatchEvent => {
  const typeMap: { [key: string]: EventType } = {
    goal: 'goal',
    yellowcard: 'yellowcard',
    redcard: 'redcard',
    subst: 'substitution',
    'pen miss': 'pen_miss',
  }

  const baseEvent = {
    type: typeMap[event['@type']] || event['@type'],
    minute: parseInt(event['@minute'], 10) || 0,
    team: event['@team'] as 'localteam' | 'visitorteam',
    player: { id: event['@playerId'], name: event['@player'] },
  }

  if (baseEvent.type === 'substitution') {
    return {
      ...baseEvent,
      playerIn: { id: event['@assistid'], name: event['@assist'] },
      playerOut: { id: event['@playerId'], name: event['@player'] },
    } as MatchEvent
  }

  return {
    ...baseEvent,
    assist: { id: event['@assistid'], name: event['@assist'] },
    result: event['@result'],
  } as MatchEvent
}

const toMatch = (match: GoalServeMatch): Match => ({
  id: match['@id'],
  staticId: match['@static_id'],
  status: match['@status'],
  date: match['@formatted_date'],
  time: match['@time'],
  timer: match['@timer'],
  venue: match['@venue'],
  commentaryAvailable: match['@commentary_available'] !== '',
  localTeam: {
    id: match.localteam['@id'],
    name: match.localteam['@name'],
    goals: match.localteam['@goals'] ?? '?',
  },
  visitorTeam: {
    id: match.visitorteam['@id'],
    name: match.visitorteam['@name'],
    goals: match.visitorteam['@goals'] ?? '?',
  },
  htScore: match.ht?.['@score'],
  ftScore: match.ft?.['@score'],
  events: match.events?.event
    ? Array.isArray(match.events.event)
      ? match.events.event.map(toEvent)
      : [toEvent(match.events.event)]
    : [],
})

export const fixtureMapper = {
  toDomain: (response: GoalServeFixturesResponse): LeagueFixtures[] => {
    if (!response.scores || !response.scores.category) return []

    return response.scores.category.map((category: GoalServeCategory) => {
      console.log(category['@file_group'])
      return {
        id: category['@id'],
        name: category['@name'],
        isCup: category['@iscup'] === 'True',
        country: ALL_COUNTRIES.find((country) => country.nameCode === category['@file_group']),
        matches: category.matches.match
          ? Array.isArray(category.matches.match)
            ? category.matches.match.map(toMatch)
            : [toMatch(category.matches.match)]
          : [],
      }
    })
  },
}
