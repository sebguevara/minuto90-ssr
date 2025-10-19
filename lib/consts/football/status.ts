export const STATUS_TYPES = {
  live: 'live',
  finished: 'finished',
  postponed: 'postponed',
  canceled: 'canceled',
}

export const EVENT_TYPES = {
  Goal: ['Normal Goal', 'Penalty', 'Own Goal', 'Missed Penalty', 'Penalty Shootout'],
  Card: ['Yellow Card', 'Red Card'],
  subst: ['Substitution 1', 'Substitution 2', 'Substitution 3', 'Substitution 4', 'Substitution 5'],
  Var: ['Goal cancelled', 'Penalty cancelled', 'Gol confirmed', 'Card upgraded', 'Card downgraded'],
} as const
