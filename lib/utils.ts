import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ARGENTINA_TIMEZONE_MAP } from '@/lib/consts/timezones'
import { STATUS_CONFIG, type StatusConfig } from '@/lib/consts/football/match_status'
import { abbreviations } from '@/lib/consts/abbreviations'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBrowserTimezone(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
    return ARGENTINA_TIMEZONE_MAP[detected] || detected
  } catch (e) {
    console.error('No se pudo detectar la zona horaria del navegador, usando UTC como fallback.')
    return 'UTC'
  }
}

export function getStatusConfig(statusCode: string): StatusConfig {
  return (
    STATUS_CONFIG[statusCode] || {
      type: 'other',
      label: statusCode,
      className: 'text-muted-foreground',
    }
  )
}
export const getTodayDate = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const parts = new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())

  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value

  const today = `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`
  return today
}

export const parseToDate = (raw: string): Date => {
  const [y, m, d] = raw
    .replace(/[^\d]+/g, ' ')
    .trim()
    .split(/\s+/)
  return new Date(+y, +m - 1, +d)
}

export const formatTime24 = (d: string | Date) => {
  const dt = typeof d === 'string' ? new Date(d) : d
  const hh = dt.getHours().toString().padStart(2, '0')
  const mm = dt.getMinutes().toString().padStart(2, '0')
  return `${hh}:${mm}`
}

export const trimLabel = (s: string, max: number) => {
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}

export const abbreviateTeamName = (
  name: string,
  dict: Record<string, string> = abbreviations
): string => {
  const tokens = name.split(/([^\wÁÉÍÓÚÜÑáéíóúüñ]+)+/)

  return tokens
    .map((token) => {
      if (!token || /[^\wÁÉÍÓÚÜÑáéíóúüñ]/.test(token)) return token

      const norm = strip(token)
      const key = Object.keys(dict).find((k) => strip(k) === norm)
      if (!key) return token

      const abbr = dict[key]
      return applyCase(abbr, token)
    })
    .join('')
}

export const strip = (s: string): string => {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export const applyCase = (abbr: string, original: string): string => {
  if (original === original.toUpperCase()) {
    return toUpperAlpha(abbr)
  }
  if (isCapitalized(original)) {
    return capitalizeFirstAlpha(abbr)
  }
  return abbr.toLowerCase()
}

export const isCapitalized = (s: string): boolean => {
  const first = s.charAt(0)
  return first === first.toUpperCase() && s.slice(1) === s.slice(1).toLowerCase()
}

export const toUpperAlpha = (s: string): string => {
  return s.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, (c) => c.toUpperCase())
}

export const capitalizeFirstAlpha = (s: string): string => {
  let done = false
  return s.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/, (c) => {
    if (done) return c
    done = true
    return c.toUpperCase()
  })
}

export const mediaQuery = (query: string) => {
  return window.matchMedia(query).matches
}

/**
 * Genera un slug SEO-amigable a partir de una cadena de texto.
 * - Convierte a minúsculas.
 * - Elimina acentos y diacríticos.
 * - Reemplaza espacios y caracteres especiales por guiones.
 * - Elimina guiones consecutivos y guiones al inicio/final.
 * @param text La cadena de texto a convertir.
 * @returns El slug generado.
 */
export const generateSlug = (text: string): string => {
  if (!text) return ''

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Genera la URL SEO-friendly para la página de un partido.
 * Los IDs se integran en el path de forma coherente: ${leagueSlug}-${leagueId}/${teamsSlug}-${matchId}
 * 
 * @example
 * generateMatchUrl({
 *   homeTeam: 'Chelsea',
 *   awayTeam: 'Ajax',
 *   leagueName: 'Champions League',
 *   matchId: 3695638,
 *   leagueId: 1167
 * })
 * // Retorna: "/football/partido/champions-league-1167/chelsea-vs-ajax-3695638"
 */
export const generateMatchUrl = (params: {
  homeTeam: string
  awayTeam: string
  leagueName?: string
  matchId?: string | number
  leagueId?: string | number
}): string => {
  const { homeTeam, awayTeam, leagueName, matchId, leagueId } = params
  const homeSlug = generateSlug(homeTeam)
  const awaySlug = generateSlug(awayTeam)
  const teamsSlug = `${homeSlug}-vs-${awaySlug}`

  if (leagueName && leagueId && matchId) {
    const leagueSlug = generateSlug(leagueName)
    return `/football/partido/${leagueSlug}-${leagueId}/${teamsSlug}-${matchId}`
  }

  if (leagueName) {
    const leagueSlug = generateSlug(leagueName)
    const url = `/football/partido/${leagueSlug}`
    return matchId ? `${url}/${teamsSlug}-${matchId}` : `${url}/${teamsSlug}`
  }

  return matchId ? `/football/partido/${teamsSlug}-${matchId}` : `/football/partido/${teamsSlug}`
}

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  return ''
}

export function formatDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    // Formato YYYY-MM-DD
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).format(date)
}

export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    // Formato 24h
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(date)
}
