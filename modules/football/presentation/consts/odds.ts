export const PERIODS = [
  { key: 'ft', label: 'Partido', match: ['match', 'full', 'ft'] },
  { key: '1h', label: '1º tiempo', match: ['first', '1st', '1h'] },
  { key: '2h', label: '2º tiempo', match: ['second', '2nd', '2h'] },
] as const

export const MARKETS = [
  {
    key: '1x2',
    label: '1X2',
    names: ['match winner', '1x2', 'fulltime result', 'result'],
    outcomes: ['1', 'X', '2'],
  },
  {
    key: 'double',
    label: 'Doble oportunidad',
    names: ['double chance'],
    outcomes: ['1X', '12', 'X2'],
  },
  {
    key: 'btts',
    label: 'Ambos marcan',
    names: ['both teams score', 'both teams to score'],
    outcomes: ['Yes', 'No'],
  },
  {
    key: 'ou',
    label: 'Más/Menos (goles)',
    names: ['goals over/under', 'over/under'],
    outcomes: ['Over', 'Under'],
    needsLine: true,
  },
  {
    key: 'ah',
    label: 'Hándicap asiático',
    names: ['asian handicap'],
    outcomes: ['Home', 'Away'],
    needsLine: true,
  },
  // extras 🔽
  { key: 'oe', label: 'Par/Impar', names: ['odd/even'], outcomes: ['Odd', 'Even'] },
  {
    key: 'corners1x2',
    label: 'Córners 1X2',
    names: ['corners 1x2', 'corners result'],
    outcomes: ['1', 'X', '2'],
  },
  {
    key: 'cards_ou',
    label: 'Tarjetas ±',
    names: ['cards over/under', 'total cards over/under'],
    outcomes: ['Over', 'Under'],
    needsLine: true,
  },
  {
    key: 'yellows_ou',
    label: 'Amarillas ±',
    names: ['yellow over/under', 'yellow cards over/under'],
    outcomes: ['Over', 'Under'],
    needsLine: true,
  },
] as const
