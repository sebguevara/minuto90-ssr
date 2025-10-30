import { MatchStats } from '@/modules/football/domain/models/commentary'
import { MatchLineups } from '@/modules/football/domain/models/commentary'

export const hasSomeStat = (statistics: MatchStats | null) =>
  Array.isArray(statistics) &&
  statistics.some(
    (t) =>
      t?.localteam?.some((s) => s?.total !== null) || t?.visitorteam?.some((s) => s?.total !== null)
  )

export const hasSomeXI = (lineup: MatchLineups | null) => {
  return !!lineup?.localTeam?.formation?.length || !!lineup?.visitorTeam?.formation?.length
}
