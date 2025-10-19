import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ARGENTINA_TIMEZONE_MAP } from '@/lib/consts/timezones'
import {
  getStatusConfig as getStatusConfigFn,
  type StatusConfig,
} from '@/lib/consts/football/match_status'
import { abbreviations } from '@/lib/consts/abbreviations'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBrowserTimezone(): string {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone

  return ARGENTINA_TIMEZONE_MAP[detected] || detected
}

export function getStatusConfig(statusCode: string): StatusConfig {
  return (
    getStatusConfigFn(statusCode) || {
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

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  return ''
}
