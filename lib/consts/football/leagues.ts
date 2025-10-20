export const RELEVANT_CUP = [
  {
    id: 1,
    name: 'World Cup',
    logo: 'https://media.api-sports.io/football/leagues/1.png',
  },
  {
    id: 2,
    name: 'Champions League',
    logo: 'https://media.api-sports.io/football/leagues/2.png',
  },
  {
    id: 3,
    name: 'Europa League',
    logo: 'https://media.api-sports.io/football/leagues/3.png',
  },
  {
    id: 9,
    name: 'Copa America',
    logo: 'https://media.api-sports.io/football/leagues/9.png',
  },
  {
    id: 4,
    name: 'Eurocopa',
    logo: 'https://media.api-sports.io/football/leagues/4.png',
  },
  {
    id: 13,
    name: 'Libertadores',
    logo: 'https://media.api-sports.io/football/leagues/13.png',
  },
  {
    id: 11,
    name: 'Sudamericana',
    logo: 'https://media.api-sports.io/football/leagues/11.png',
  },
  {
    id: 15,
    name: 'Mundial de Clubes',
    logo: 'https://media.api-sports.io/football/leagues/15.png',
  },
  {
    id: 848,
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
    id: 2471,
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
    id: 239,
    name: 'Primera A',
    logo: 'https://media.api-sports.io/football/leagues/239.png',
  },
  {
    id: 128,
    name: 'Liga Profesional Argentina',
    logo: 'https://media.api-sports.io/football/leagues/128.png',
  },
]

export const RANKED_COMPETITIONS = [
  // === COMPETICIONES INTERNACIONALES ===
  { id: 1, name: 'World Cup', type: 'Cup' },
  { id: 2, name: 'Champions League', type: 'Cup' },
  { id: 3, name: 'Europa League', type: 'Cup' },
  { id: 848, name: 'UEFA Conference League', type: 'Cup' },
  { id: 13, name: 'Copa Libertadores', type: 'Cup' },
  { id: 11, name: 'Copa Sudamericana', type: 'Cup' },
  { id: 4, name: 'Eurocopa', type: 'Cup' },
  { id: 9, name: 'Copa America', type: 'Cup' },
  { id: 15, name: 'FIFA Club World Cup', type: 'Cup' },
  { id: 32, name: 'World Cup - Qualification Europe', type: 'League' },
  { id: 34, name: 'World Cup - Qualification South America', type: 'League' },

  // === EUROPA (Top 5 Ligas + Copas) ===
  // --- Inglaterra ---
  { id: 39, name: 'Premier League', type: 'League' },
  { id: 40, name: 'Championship', type: 'League' },
  { id: 45, name: 'FA Cup', type: 'Cup' },
  // --- España ---
  { id: 140, name: 'La Liga', type: 'League' },
  { id: 141, name: 'Segunda División', type: 'League' },
  { id: 143, name: 'Copa del Rey', type: 'Cup' },
  // --- Alemania ---
  { id: 78, name: 'Bundesliga', type: 'League' },
  { id: 79, name: '2. Bundesliga', type: 'League' },
  { id: 81, name: 'DFB Pokal', type: 'Cup' },
  // --- Italia ---
  { id: 135, name: 'Serie A', type: 'League' },
  { id: 136, name: 'Serie B', type: 'League' },
  { id: 137, name: 'Coppa Italia', type: 'Cup' },
  // --- Francia ---
  { id: 61, name: 'Ligue 1', type: 'League' },
  { id: 62, name: 'Ligue 2', type: 'League' },
  { id: 65, name: 'Coupe de France', type: 'Cup' },

  // === OTRAS LIGAS EUROPEAS RELEVANTES ===
  { id: 94, name: 'Primeira Liga', type: 'League' }, // Portugal
  { id: 88, name: 'Eredivisie', type: 'League' }, // Países Bajos
  { id: 144, name: 'Jupiler Pro League', type: 'League' }, // Bélgica
  { id: 203, name: 'Süper Lig', type: 'League' }, // Turquía
  { id: 197, name: 'Super League 1', type: 'League' }, // Grecia

  // === AMÉRICA (Ligas + Copas) ===
  // --- Argentina ---
  { id: 128, name: 'Liga Profesional Argentina', type: 'League' },
  { id: 129, name: 'Primera Nacional', type: 'League' },
  { id: 130, name: 'Copa Argentina', type: 'Cup' },
  // --- Brasil ---
  { id: 71, name: 'Brasileirão Série A', type: 'League' },
  { id: 72, name: 'Brasileirão Série B', type: 'League' },
  { id: 75, name: 'Copa do Brasil', type: 'Cup' },
  // --- México ---
  { id: 262, name: 'Liga MX', type: 'League' },
  { id: 263, name: 'Liga de Expansión MX', type: 'League' },
  // --- USA ---
  { id: 253, name: 'Major League Soccer', type: 'League' },
  { id: 255, name: 'US Open Cup', type: 'Cup' },
  // --- Colombia ---
  { id: 239, name: 'Primera A', type: 'League' },
  { id: 240, name: 'Primera B', type: 'League' },
  { id: 241, name: 'Copa Colombia', type: 'Cup' },
  // --- Chile ---
  { id: 265, name: 'Primera División', type: 'League' },
  { id: 266, name: 'Primera B', type: 'League' },
  { id: 267, name: 'Copa Chile', type: 'Cup' },
  // --- Uruguay ---
  { id: 270, name: 'Primera División', type: 'League' },
  { id: 271, name: 'Segunda División', type: 'League' },
  // --- Paraguay ---
  { id: 250, name: 'División Profesional', type: 'League' },
  { id: 252, name: 'Copa Paraguay', type: 'Cup' },
  // --- Ecuador ---
  { id: 242, name: 'Liga Pro', type: 'League' },
  { id: 243, name: 'Copa Ecuador', type: 'Cup' },
  // --- Perú ---
  { id: 281, name: 'Liga 1', type: 'League' },
  // --- Bolivia ---
  { id: 244, name: 'División Profesional', type: 'League' },
]

export const leaguePriority: Record<number, number> = {
  // 1. Ligas Top (aparecen primero)
  2: 1, // Champions League
  39: 2, // Premier League
  140: 3, // La Liga

  // 2. Destacados (orden de importancia)
  135: 4, // Serie A
  78: 5, // Bundesliga
  61: 6, // Ligue 1
  3: 7, // Europa League
  13: 8, // Libertadores
  11: 9, // Sudamericana

  // 3. Competiciones Mundiales (agrupadas después de destacados)
  1: 10, // World Cup
  9: 10, // Copa America
  4: 10, // Eurocopa
  15: 10, // Mundial de Clubes
  848: 10, // UEFA Conference League
  32: 10, // World Cup - Qualification Europe
  34: 10, // World Cup - Qualification South America

  // Ligas nacionales secundarias (pueden tener menor prioridad o dejarse sin ella para el orden alfabético)
  128: 11, // Liga Profesional Argentina
  71: 12, // Brasileirão Série A
  262: 13, // Liga MX
  253: 14, // Major League Soccer
  239: 15, // Primera A Colombia
}

export const PRESELECTED_LEAGUES = ['2', '39', '140']
