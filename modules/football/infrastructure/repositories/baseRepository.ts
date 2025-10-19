import { env } from '@/lib/env'

const BASE_URL = env.PRIVATE_GOALSERVE_BASE_URL
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY
const LOGO_BASE_URL = env.NEXT_PUBLIC_LOGO_BASE_URL

export async function fetchFromGoalServe<T>(path: string): Promise<T> {
  const url = `${BASE_URL}/${API_KEY}/${path}?json=1`
  console.log('url', url)

  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Error en la petición a GoalServe: ${response.status} para la URL: ${url}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`No se pudo obtener la ruta: ${path}`, error)
    throw new Error(`Fallo al obtener datos de GoalServe para la ruta: ${path}`)
  }
}

export async function fetchLogos(
  entityType: 'leagues' | 'teams',
  ids: string[]
): Promise<Map<string, string>> {
  const logoMap = new Map<string, string>()
  const uniqueIds = [...new Set(ids.filter((id) => id))]
  if (uniqueIds.length === 0) return logoMap

  const url = `${LOGO_BASE_URL}/soccer/${entityType}?k=${API_KEY}&ids=${uniqueIds.join(',')}`

  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (response.ok) {
      const logos: { id: string; base64: string }[] = await response.json()
      logos.forEach((logo) => logoMap.set(logo.id, `data:image/png;base64,${logo.base64}`))
    }
  } catch (error) {
    console.error(`Falló la obtención de logos para ${entityType}:`, error)
  }

  return logoMap
}
