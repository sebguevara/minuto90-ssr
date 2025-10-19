const playoffMap: Record<string, string> = {
  final: 'Final',
  'semi-finals': 'Semifinales',
  'quarter-finals': 'Cuartos de Final',
  '8th finals': 'Octavos de Final',
  '16th finals': '16vos de Final',
}

export const formatRoundName = (round: string): string => {
  const lowerCaseRound = round.toLowerCase()

  for (const key in playoffMap) {
    if (lowerCaseRound.includes(key)) {
      const phaseMatch = lowerCaseRound.match(/(\d+)(st|nd|rd|th) phase/)
      const phaseText = phaseMatch ? `Fase ${phaseMatch[1]} - ` : ''
      return `${phaseText}${playoffMap[key]}`
    }
  }

  const regularMatch = lowerCaseRound.match(/(\d+)(st|nd|rd|th) phase - (\d+)/)
  if (regularMatch) {
    const phaseNumber = regularMatch[1]
    const roundNumber = regularMatch[3]
    return `Fase ${phaseNumber} - Jornada ${roundNumber}`
  }

  return round
}
