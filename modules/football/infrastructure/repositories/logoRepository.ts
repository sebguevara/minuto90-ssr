import { getRedisClient } from '@/lib/redis'

async function getLogosForEntityType(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const logoMap = new Map<string, string>()
  const uniqueIds = [...new Set(ids.filter((id) => id))]
  if (uniqueIds.length === 0) return logoMap

  try {
    const redis = getRedisClient()
    const cacheKeys = uniqueIds.map((id) => `logo:${entityType}:${id}`)

    const cachedLogos = await redis.mget(...cacheKeys)
    cachedLogos.forEach((logo, index) => {
      const id = uniqueIds[index]
      if (logo) {
        logoMap.set(id, logo)
      }
    })
  } catch (error) {
    console.error(`[Logo Error] Error getting ${entityType} logos:`, error)
  }
  return logoMap
}

export const logoRepository = {
  async getTeamLogos(teamIds: string[]): Promise<Map<string, string>> {
    return getLogosForEntityType('teams', teamIds)
  },

  async getLeagueLogos(leagueIds: string[]): Promise<Map<string, string>> {
    return getLogosForEntityType('leagues', leagueIds)
  },

  async getLogos(
    teamIds: string[],
    leagueIds: string[]
  ): Promise<{ teams: Map<string, string>; leagues: Map<string, string> }> {
    const [teams, leagues] = await Promise.all([
      this.getTeamLogos(teamIds),
      this.getLeagueLogos(leagueIds),
    ])
    return { teams, leagues }
  },
}
