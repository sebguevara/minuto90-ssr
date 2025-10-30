// modules/football/infrastructure/repositories/matchRepository.ts

import { fetchFromGoalServe } from './baseRepository'
import { logoRepository } from './logoRepository'
import { CommentaryResponse } from '@/modules/football/domain/types/commentaryResponse'
import { MatchDetails } from '@/modules/football/domain/models/commentary'

export const matchRepository = {
  /**
   * Obtiene los datos crudos del endpoint 'commentaries' sin procesarlos.
   */
  async getRawCommentaryById(
    matchStaticId: string,
    leagueId: string
  ): Promise<CommentaryResponse | null> {
    const path = `commentaries/match?id=${matchStaticId}&league=${leagueId}`
    return fetchFromGoalServe<CommentaryResponse>(path)
  },

  /**
   * Enriquece un objeto de dominio `DetailedMatch` con los logos correspondientes.
   */
  async hydrateWithLogos(matchDetails: MatchDetails): Promise<MatchDetails> {
    const teamIds = [matchDetails.match.localTeam.id, matchDetails.match.visitorTeam.id]
    const leagueIds = [matchDetails.tournament.id]

    const { teams: teamLogos, leagues: leagueLogos } = await logoRepository.getLogos(
      teamIds,
      leagueIds
    )

    return {
      ...matchDetails,
      tournament: {
        ...matchDetails.tournament,
        logo: leagueLogos.get(matchDetails.tournament.id) || null,
      },
      match: {
        ...matchDetails.match,
        localTeam: {
          ...matchDetails.match.localTeam,
          logo: teamLogos.get(matchDetails.match.localTeam.id),
        },
        visitorTeam: {
          ...matchDetails.match.visitorTeam,
          logo: teamLogos.get(matchDetails.match.visitorTeam.id),
        },
      },
    }
  },
}
