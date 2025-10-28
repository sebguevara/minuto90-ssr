import { NextRequest, NextResponse } from 'next/server'
import { fixtureRepository } from '@/modules/football/infrastructure/repositories/fixtureRepository'

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

    const leagueFixtures = await fixtureRepository.getFixtureById(leagueId, id)

    if (!leagueFixtures || leagueFixtures.matches.length === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const match = leagueFixtures.matches[0]

    return NextResponse.json(
      {
        match,
        league: {
          id: leagueFixtures.id,
          name: leagueFixtures.name,
          logo: leagueFixtures.logo,
          country: leagueFixtures.country,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json({ error: 'Failed to fetch match data' }, { status: 500 })
  }
}

