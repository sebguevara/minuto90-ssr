import { MatchLineup } from '@/modules/football/domain/entities/Match'
import { MatchStatistics } from '@/modules/football/domain/entities/stats'

export const hasSomeStat = (statistics?: MatchStatistics[]) =>
  Array.isArray(statistics) && statistics.some((t) => t?.statistics?.some((s) => s?.value !== null))

export const hasSomeXI = (lineup?: { home: MatchLineup; away: MatchLineup }) => {
  return !!lineup?.home?.startXI.length || !!lineup?.away?.startXI.length
}
