import { NextRequest, NextResponse } from 'next/server'
import { matchService } from '@/modules/football/application/services/matchService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get('leagueId')

    if (!id || !leagueId) {
      return NextResponse.json({ error: 'Missing match ID or league ID' }, { status: 400 })
    }

    const details = await matchService.getMatchDetails(id, leagueId)
    if (!details) {
      return NextResponse.json({ error: 'Match details not found' }, { status: 404 })
    }

    return NextResponse.json(details, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error fetching match details:', error)
    return NextResponse.json({ error: 'Failed to fetch match details' }, { status: 500 })
  }
}


