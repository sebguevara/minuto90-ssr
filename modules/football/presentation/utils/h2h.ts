import { MatchHistory } from '@/modules/football/domain/entities/Predictions'

export const formatDate = (iso: string) => {
  const d = new Date(iso)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = d.getUTCFullYear()
  return `${dd}/${mm}/${yyyy}`
}
export const safeNum = (n: number | null) => {
  return typeof n === 'number' ? n : 0
}

export const inferTeams = (h2h: MatchHistory[]) => {
  const map = new Map<number, { id: number; name: string; logo: string }>()
  for (const m of h2h) {
    map.set(m.teams.home.id, m.teams.home)
    map.set(m.teams.away.id, m.teams.away)
  }
  const arr = Array.from(map.values())
  return arr.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 2)
}

export const findName = (h2h: MatchHistory[], id?: number) => {
  const hit = h2h.find((m) => m.teams.home.id === id || m.teams.away.id === id)
  return hit?.teams.home.id === id ? hit?.teams.home.name : hit?.teams.away.name
}
export const findLogo = (h2h: MatchHistory[], id?: number) => {
  const hit = h2h.find((m) => m.teams.home.id === id || m.teams.away.id === id)
  return hit?.teams.home.id === id ? hit?.teams.home.logo : hit?.teams.away.logo
}

export const summarize = (list: MatchHistory[], leftId?: number, rightId?: number) => {
  let leftWins = 0
  let rightWins = 0
  let draws = 0
  for (const m of list) {
    const home = m.goals.home ?? 0
    const away = m.goals.away ?? 0
    if (home === away) {
      draws++
      continue
    }
    const winnerIsHome = home > away
    const winnerId = winnerIsHome ? m.teams.home.id : m.teams.away.id
    if (winnerId === leftId) leftWins++
    else if (winnerId === rightId) rightWins++
  }
  return { leftWins, rightWins, draws }
}

export const teamNameById = (m: MatchHistory, teamId?: number) => {
  if (!teamId) return ''
  return m.teams.home.id === teamId ? m.teams.home.name : m.teams.away.name
}

export const teamGoalsById = (m: MatchHistory, teamId?: number) => {
  if (!teamId) return 0
  return m.teams.home.id === teamId ? m.goals.home : m.goals.away
}
