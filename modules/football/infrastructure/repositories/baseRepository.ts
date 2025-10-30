import { env } from '@/lib/env'

const BASE_URL = env.PRIVATE_GOALSERVE_BASE_URL
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY

export async function fetchFromGoalServe<T>(path: string): Promise<T> {
  const jsonParam = path.includes('?') ? '&json=1' : '?json=1'
  const url = `${BASE_URL}/${API_KEY}/${path}${jsonParam}`
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
