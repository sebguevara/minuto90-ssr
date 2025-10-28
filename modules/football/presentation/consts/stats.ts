import type { StatEntry } from '@/modules/football/domain/entities/stats'

export const LABELS: Record<StatEntry['type'], string> = {
  'Total Shots': 'Tiros Totales',
  'Shots on Goal': 'Tiros a Puerta',
  'Shots off Goal': 'Tiros Fuera',
  'Blocked Shots': 'Tiros Bloqueados',
  'Shots insidebox': 'Tiros dentro del área',
  'Shots outsidebox': 'Tiros fuera del área',
  Fouls: 'Faltas',
  'Corner Kicks': 'Saques de Esquina',
  Offsides: 'Fueras de Juego',
  'Ball Possession': 'Posesión',
  'Yellow Cards': 'Tarjetas Amarillas',
  'Red Cards': 'Tarjetas Rojas',
  'Goalkeeper Saves': 'Atajadas',
  'Total passes': 'Pases Totales',
  'Passes accurate': 'Pases Precisos',
  'Passes %': 'Pases %',
  expected_goals: 'xG',
  goals_prevented: 'Goles evitados',
}

// 'expected_goals'
export const GROUPS: Array<{ title: string; keys: StatEntry['type'][] }> = [
  {
    title: 'Top Stats',
    keys: ['expected_goals', 'Ball Possession', 'Shots on Goal', 'Total Shots', 'Corner Kicks'],
  },
  {
    title: 'Remates',
    keys: [
      'Shots on Goal',
      'Shots off Goal',
      'Blocked Shots',
      'Shots insidebox',
      'Shots outsidebox',
    ],
  },
  {
    title: 'Pases',
    keys: ['Total passes', 'Passes accurate', 'Passes %'],
  },
  {
    title: 'Disciplinarias',
    keys: ['Yellow Cards', 'Red Cards', 'Fouls', 'Offsides'],
  },
  {
    title: 'Portería',
    keys: ['Goalkeeper Saves', 'goals_prevented'],
  },
]

export const NEGATIVE_STATS = new Set<StatEntry['type']>([
  'Fouls',
  'Offsides',
  'Yellow Cards',
  'Red Cards',
])
