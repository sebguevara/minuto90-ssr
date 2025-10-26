import { NextResponse } from 'next/server'
import { fixtureService } from '@/modules/football/application/services/fixtureService'

export async function GET() {
  try {
    console.log('[API] GET /api/football/live (Hydrated)')

    const liveFixtures = await fixtureService.getLiveFixtures()

    return NextResponse.json(liveFixtures, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'CDN-Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[API] Error fetching live fixtures:', error)
    return NextResponse.json({ error: 'Error al obtener partidos en vivo' }, { status: 500 })
  }
}
