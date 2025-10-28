#!/usr/bin/env tsx
/**
 * Script para pre-cargar logos de equipos y ligas en Redis
 *
 * Este script obtiene todos los fixtures de 7 días atrás hasta 7 días adelante,
 * extrae los IDs de equipos y ligas, y pre-carga sus logos en Redis con un TTL de 6 meses.
 *
 * Uso: pnpm prefetch:logos
 */

import { env } from '../lib/env'
import { getRedisClient, closeRedis } from '../lib/redis'

const LOGO_BASE_URL = 'http://data2.goalserve.com:8084/api/v1/logotips'
const API_KEY = env.PRIVATE_GOAL_SERVE_API_KEY
const GOAL_SERVE_BASE_URL = env.PRIVATE_GOALSERVE_BASE_URL

const CHUNK_SIZE = 30 // Tamaño de chunks para peticiones
const MAX_RETRIES = 2 // Reintentos por chunk
const RETRY_DELAY = 1500 // Delay entre reintentos (ms)
const SIX_MONTHS_IN_SECONDS = 15552000 // 6 meses = 180 días

// Utilidades
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Generar parámetros de fecha para GoalServe (home, d1, d2, d-1, d-2, etc.)
function getDateParams(daysBack: number, daysForward: number): string[] {
  const params: string[] = []

  // Días pasados: d-7, d-6, ..., d-1
  for (let i = daysBack; i >= 1; i--) {
    params.push(`d-${i}`)
  }

  // Hoy
  params.push('home')

  // Días futuros: d1, d2, ..., d7
  for (let i = 1; i <= daysForward; i++) {
    params.push(`d${i}`)
  }

  return params
}

// Fetch logos con retry
async function fetchLogoChunkWithRetry(
  entityType: 'leagues' | 'teams',
  ids: string[],
  retryCount = 0
): Promise<Map<string, string>> {
  const logoMap = new Map<string, string>()
  if (ids.length === 0) return logoMap

  const url = `${LOGO_BASE_URL}/soccer/${entityType}?k=${API_KEY}&ids=${ids.join(',')}`
  console.log(`     🔗 Logo URL: ${url}`)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.status === 404 || response.status === 429) {
      console.log(`⚠️  Status ${response.status} para ${entityType} chunk [${ids.join(', ')}]`)
      return logoMap
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const logos: { id: string; base64: string }[] = await response.json()

    if (!Array.isArray(logos) || logos.length === 0) {
      return logoMap
    }

    logos.forEach((logo) => {
      if (logo.id && logo.base64) {
        const base64Url = `data:image/png;base64,${logo.base64}`
        logoMap.set(logo.id, base64Url)
      }
    })

    return logoMap
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(
      `❌ Error fetching ${entityType} logos (intento ${retryCount + 1}/${MAX_RETRIES + 1}):`,
      errorMsg
    )

    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * (retryCount + 1))
      return fetchLogoChunkWithRetry(entityType, ids, retryCount + 1)
    }
    return logoMap
  }
}

// Fetch fixtures para un parámetro de fecha (home, d1, d-1, etc.)
async function fetchFixturesForDate(
  dateParam: string
): Promise<{ teamIds: string[]; leagueIds: string[] }> {
  const url = `${GOAL_SERVE_BASE_URL}/${API_KEY}/soccernew/${dateParam}?json=1`
  console.log(`   🔗 URL: ${url}`)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`   ❌ Error HTTP ${response.status} para ${dateParam}`)
      console.error(`   ❌ URL completa: ${url}`)
      return { teamIds: [], leagueIds: [] }
    }

    console.log(`   ✅ Respuesta OK (${response.status})`)

    const data = await response.json()
    console.log(`   📦 Datos recibidos:`, data ? 'Sí' : 'No')

    const teamIds: string[] = []
    const leagueIds: string[] = []

    // Extraer IDs del JSON de GoalServe (estructura es scores.category, no data.category)
    if (data && data.scores && data.scores.category) {
      console.log(`   📋 Estructura de datos válida encontrada`)
      const categories = Array.isArray(data.scores.category)
        ? data.scores.category
        : [data.scores.category]

      console.log(`   🔍 Número de categorías: ${categories.length}`)

      for (const category of categories) {
        // ID de la liga/categoría
        if (category['@id']) {
          leagueIds.push(String(category['@id']))
        }

        if (!category.matches || !category.matches.match) {
          continue
        }

        const matches = Array.isArray(category.matches.match)
          ? category.matches.match
          : [category.matches.match]

        for (const match of matches) {
          // IDs de equipos
          if (match.localteam && match.localteam['@id']) {
            teamIds.push(String(match.localteam['@id']))
          }
          if (match.visitorteam && match.visitorteam['@id']) {
            teamIds.push(String(match.visitorteam['@id']))
          }
        }
      }
    }

    console.log(`   ✅ Extraídos: ${teamIds.length} equipos, ${leagueIds.length} ligas`)
    return { teamIds, leagueIds }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`   ❌ Error al procesar fixtures para ${dateParam}:`, errorMsg)
    console.error(`   ❌ URL intentada: ${url}`)
    return { teamIds: [], leagueIds: [] }
  }
}

// Pre-cargar logos descargándolos y guardándolos en Redis
async function prefetchLogos(
  entityType: 'leagues' | 'teams',
  ids: string[],
  redis: ReturnType<typeof getRedisClient>
): Promise<number> {
  console.log(`\n📦 Procesando ${ids.length} ${entityType}...`)

  // Si no hay IDs, retornar inmediatamente
  if (ids.length === 0) {
    console.log(`✅ No hay ${entityType} para procesar`)
    return 0
  }

  // Dividir en chunks
  // Primero verificar qué logos ya existen en Redis
  console.log(`🔍 Verificando logos existentes en Redis...`)
  const cacheKeys = ids.map((id) => `logo:${entityType}:${id}`)
  const existingLogos = await redis.mget(...cacheKeys)

  const missingIds: string[] = []
  let alreadyCached = 0

  existingLogos.forEach((logo, index) => {
    if (logo) {
      alreadyCached++
    } else {
      missingIds.push(ids[index])
    }
  })

  console.log(
    `✅ ${alreadyCached} ${entityType} ya en caché (${((alreadyCached / ids.length) * 100).toFixed(
      1
    )}%)`
  )
  console.log(
    `❌ ${missingIds.length} ${entityType} por descargar (${(
      (missingIds.length / ids.length) *
      100
    ).toFixed(1)}%)`
  )

  // Si no hay logos faltantes, retornar
  if (missingIds.length === 0) {
    console.log(`✨ Todos los ${entityType} ya están en caché`)
    return 0
  }

  // Dividir solo los IDs faltantes en chunks
  const chunks = chunkArray(missingIds, CHUNK_SIZE)
  console.log(`📋 Descargando en ${chunks.length} chunks...`)

  let totalFetched = 0

  // Procesar chunks con delay
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    console.log(`  🔄 Chunk ${i + 1}/${chunks.length} (${chunk.length} IDs)...`)

    const logoMap = await fetchLogoChunkWithRetry(entityType, chunk)

    if (logoMap.size > 0) {
      // Guardar en Redis con TTL de 6 meses
      const pipeline = redis.pipeline()

      logoMap.forEach((base64Url, id) => {
        const key = `logo:${entityType}:${id}`
        pipeline.setex(key, SIX_MONTHS_IN_SECONDS, base64Url)
      })

      await pipeline.exec()

      totalFetched += logoMap.size
      console.log(`  ✅ Guardados ${logoMap.size} logos en Redis`)
    } else {
      console.log(`  ⚠️  No se obtuvieron logos en este chunk`)
    }

    // Delay entre chunks para no saturar el servidor
    if (i < chunks.length - 1) {
      await sleep(500)
    }
  }

  console.log(`✨ Total ${entityType} guardados: ${totalFetched}`)
  return totalFetched
}

// Main
async function main() {
  console.log('🚀 Iniciando pre-carga de logos...\n')
  console.log('⏱️  TTL configurado: 6 meses (15,552,000 segundos)\n')

  const redis = getRedisClient()

  try {
    console.log(`🔧 Variables de entorno:`)
    console.log(`   GOAL_SERVE_BASE_URL: ${GOAL_SERVE_BASE_URL}`)
    console.log(`   API_KEY: ${API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NO DEFINIDO'}`)
    console.log(`   LOGO_BASE_URL: ${LOGO_BASE_URL}\n`)

    // Generar parámetros de fecha (home, d1, d2, d-1, d-2, etc.)
    const dateParams = getDateParams(7, 7) // 7 días atrás, 7 días adelante
    console.log(
      `📅 Obteniendo fixtures de ${dateParams.length} períodos (${dateParams[0]} a ${
        dateParams[dateParams.length - 1]
      })...\n`
    )

    // Obtener todos los IDs de fixtures
    const allTeamIds: Set<string> = new Set()
    const allLeagueIds: Set<string> = new Set()

    for (const dateParam of dateParams) {
      console.log(`📅 Procesando ${dateParam}...`)
      const { teamIds, leagueIds } = await fetchFixturesForDate(dateParam)

      teamIds.forEach((id) => allTeamIds.add(id))
      leagueIds.forEach((id) => allLeagueIds.add(id))

      console.log(`  → ${teamIds.length} equipos, ${leagueIds.length} ligas`)

      // Delay entre fechas
      await sleep(300)
    }

    const uniqueTeamIds = Array.from(allTeamIds).filter((id) => id)
    const uniqueLeagueIds = Array.from(allLeagueIds).filter((id) => id)

    console.log('\n' + '='.repeat(60))
    console.log(`📊 RESUMEN DE IDs ENCONTRADOS EN FIXTURES`)
    console.log('='.repeat(60))
    console.log(`Equipos únicos: ${uniqueTeamIds.length}`)
    console.log(`Ligas únicas: ${uniqueLeagueIds.length}`)
    console.log('='.repeat(60))

    // Descargar y guardar logos de equipos
    const teamsFetched = await prefetchLogos('teams', uniqueTeamIds, redis)

    // Delay entre equipos y ligas
    await sleep(1000)

    // Descargar y guardar logos de ligas
    const leaguesFetched = await prefetchLogos('leagues', uniqueLeagueIds, redis)

    console.log('\n' + '='.repeat(60))
    console.log('✅ PROCESO COMPLETADO')
    console.log('='.repeat(60))
    console.log(`Logos de equipos guardados: ${teamsFetched}`)
    console.log(`Logos de ligas guardados: ${leaguesFetched}`)
    console.log(`Total logos guardados: ${teamsFetched + leaguesFetched}`)
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('\n❌ Error en el proceso:', error)
    process.exit(1)
  } finally {
    await closeRedis()
    console.log('👋 Conexión Redis cerrada')
  }
}

// Ejecutar
main()
