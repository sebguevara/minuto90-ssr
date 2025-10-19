import { NextRequest, NextResponse } from 'next/server'
import { fixtureService } from '@/modules/football/application/services/fixtureService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || 'home'

    console.log(`[API] GET /api/football/fixtures?date=${date}`)

    const fixtures = await fixtureService.getFixturesByDate(date)

    return NextResponse.json(fixtures, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'CDN-Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[API] Error fetching fixtures:', error)
    return NextResponse.json({ error: 'Error al obtener fixtures' }, { status: 500 })
  }
}
