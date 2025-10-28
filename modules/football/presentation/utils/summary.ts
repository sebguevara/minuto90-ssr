import { MatchEvent } from '@football/domain/entities/Match'

type T = { elapsed: number; extra?: number | null }

export const formatMinute = (time: T) => {
  if (time.extra && time.extra > 0) return `${time.elapsed}+${time.extra}'`
  return `${time.elapsed}'`
}

export const groupByPeriod = (events: MatchEvent[]) => {
  const buckets: Record<string, MatchEvent[]> = {}

  for (const e of events) {
    const p = periodLabel(e.time)
    if (!buckets[p]) buckets[p] = []
    buckets[p].push(e)
  }

  Object.values(buckets).forEach((arr) => arr.sort((a, b) => a.time.elapsed - b.time.elapsed))

  const order = ['1º TIEMPO', '2º TIEMPO', 'ET / Penales']
  return Object.entries(buckets)
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([label, events]) => ({ label, events }))
}

const periodLabel = (time: T) => {
  const m = time.elapsed
  if (m <= 45) return '1º TIEMPO'
  if (m <= 90) return '2º TIEMPO'
  return 'ET / Penales'
}
