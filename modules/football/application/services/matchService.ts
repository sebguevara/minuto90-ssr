// modules/football/application/services/matchService.ts

import { redis } from '@/lib/redis'
import { matchRepository } from '@/modules/football/infrastructure/repositories/matchRepository'
import { MatchDetails } from '@/modules/football/domain/models/commentary'
import { commentaryMapper } from '@/modules/football/infrastructure/mappers/commentaryMapper'

const getCacheKey = (matchId: string) => `match:details:${matchId}`

/**
 * Define el tiempo de expiración del caché en segundos basado en el estado del partido.
 * @param status - El estado del partido (ej. 'Full-time', '15', 'HT').
 * @returns El tiempo de expiración en segundos.
 */
function getCacheTTL(status: string): number {
  const finishedStatus = ['Full-time', 'FT', 'AET', 'PEN']
  const liveStatus = !isNaN(parseInt(status, 10)) || ['HT', 'LIVE'].includes(status.toUpperCase())

  if (finishedStatus.includes(status)) {
    return 60 * 60 * 24 // 24 horas para partidos finalizados
  }
  if (liveStatus) {
    return 15 // 15 segundos para partidos en vivo
  }
  return 60 * 60 * 8 // 8 horas para partidos no comenzados
}

export const matchService = {
  /**
   * Obtiene los detalles de un partido, utilizando una estrategia de caché.
   * Primero intenta obtener los datos de Redis. Si no los encuentra, los busca
   * desde la API a través del repositorio, los mapea y los guarda en caché.
   * @param matchId - El ID del partido.
   * @returns Un objeto `DetailedMatch` o `null` si no se encuentra.
   */
  async getMatchDetails(matchId: string, leagueId: string): Promise<MatchDetails | null> {
    const cacheKey = getCacheKey(matchId)

    try {
      const cachedData = (await redis?.get(cacheKey)) as MatchDetails | null
      if (cachedData) {
        return cachedData
      }
    } catch (error) {
      console.error('Error al leer desde Redis:', error)
    }

    const rawData = await matchRepository.getRawCommentaryById(matchId, leagueId)
    if (!rawData) {
      return null
    }

    // 3. Mapear los datos al dominio
    const detailedMatch = commentaryMapper.toDomain(rawData)
    if (!detailedMatch) {
      return null
    }

    // 4. Hidratar con logos
    const hydratedMatch = await matchRepository.hydrateWithLogos(detailedMatch)

    // 5. Guardar en caché con el TTL adecuado
    if (hydratedMatch) {
      try {
        const ttl = getCacheTTL(hydratedMatch.match.status)
        await redis?.set(cacheKey, JSON.stringify(hydratedMatch), 'EX', ttl)
      } catch (error) {
        console.error('Error al escribir en Redis:', error)
      }
    }

    return hydratedMatch
  },
}
