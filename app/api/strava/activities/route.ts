import { NextRequest, NextResponse } from 'next/server';
import { fetchStravaActivities } from '@/lib/strava';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const per_page = parseInt(searchParams.get('per_page') || '30');

  try {
    const activities = await fetchStravaActivities(page, per_page);

    return NextResponse.json({
      activities,
      page,
      per_page,
      total: activities.length,
      source:
        activities.length > 0 && activities[0].id > 10000000000
          ? 'mock'
          : 'strava',
    });
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}


