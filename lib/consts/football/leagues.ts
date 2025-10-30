// lib/consts/football/leagues.ts

export const RELEVANT_CUP = [
  {
    id: 1937,
    name: 'World Cup',
    logo: 'https://media.api-sports.io/football/leagues/1.png',
  },
  {
    id: 1005,
    name: 'Champions League',
    logo: 'https://media.api-sports.io/football/leagues/2.png',
  },
  {
    id: 1006,
    name: 'Europa League',
    logo: 'https://media.api-sports.io/football/leagues/3.png',
  },
  {
    id: 1046,
    name: 'Copa America',
    logo: 'https://media.api-sports.io/football/leagues/9.png',
  },
  {
    id: 1001,
    name: 'Eurocopa',
    logo: 'https://media.api-sports.io/football/leagues/4.png',
  },
  {
    id: 1056,
    name: 'Libertadores',
    logo: 'https://media.api-sports.io/football/leagues/13.png',
  },
  {
    id: 1058,
    name: 'Sudamericana',
    logo: 'https://media.api-sports.io/football/leagues/11.png',
  },
  {
    id: 1937,
    name: 'Mundial de Clubes',
    logo: 'https://media.api-sports.io/football/leagues/15.png',
  },
  {
    id: 4524,
    name: 'UEFA Conference League',
    logo: 'https://media.api-sports.io/football/leagues/848.png',
  },
]

export const RELEVANT_LEAGUES = [
  {
    id: 1399,
    name: 'La Liga',
    logo: 'https://media.api-sports.io/football/leagues/140.png',
  },
  {
    id: 1204,
    name: 'Premier League',
    logo: 'https://media.api-sports.io/football/leagues/39.png',
  },
  {
    id: 1221,
    name: 'Ligue 1',
    logo: 'https://media.api-sports.io/football/leagues/61.png',
  },
  {
    id: 1269,
    name: 'Serie A',
    logo: 'https://media.api-sports.io/football/leagues/135.png',
  },
  {
    id: 1229,
    name: 'Bundesliga',
    logo: 'https://media.api-sports.io/football/leagues/78.png',
  },
  {
    id: 1440,
    name: 'Major League Soccer',
    logo: 'https://media.api-sports.io/football/leagues/253.png',
  },
  {
    id: 1141,
    name: 'Serie A',
    logo: 'https://media.api-sports.io/football/leagues/71.png',
  },
  {
    id: 1308,
    name: 'Liga MX',
    logo: 'https://media.api-sports.io/football/leagues/262.png',
  },
  {
    id: 1167,
    name: 'Primera A',
    logo: 'https://media.api-sports.io/football/leagues/239.png',
  },
  {
    id: 1081,
    name: 'Liga Profesional Argentina',
    logo: 'https://media.api-sports.io/football/leagues/128.png',
  },
]

export const leaguePriority: Record<number, number> = {
  // 1. Ligas Top (aparecen primero)
  1005: 1, // Champions League
  1204: 2, // Premier League
  1399: 3, // La Liga

  // 2. Destacados (orden de importancia)
  1269: 4, // Serie A
  1229: 5, // Bundesliga
  1221: 6, // Ligue 1
  1006: 7, // Europa League
  1056: 8, // Libertadores
  1058: 9, // Sudamericana

  // 3. Competiciones Mundiales
  1937: 10, // World Cup & Club World Cup
  1046: 10, // Copa America
  1001: 10, // Eurocopa
  4524: 10, // UEFA Conference League

  // Ligas nacionales secundarias
  1167: 11, // Primera A Colombia
  1081: 12, // Liga Profesional Argentina
  1141: 13, // Brasileirão Série A
  1308: 14, // Liga MX
  1440: 15, // Major League Soccer
}

// Los IDs aquí deben ser strings para coincidir con el tipo de `value` en el componente Accordion.
export const PRESELECTED_LEAGUES = ['1005', '1204', '1399']
