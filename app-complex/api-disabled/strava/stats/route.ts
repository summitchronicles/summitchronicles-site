// app/api/strava/stats/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getStravaAccessToken, rateLimitedFetch } from '@/lib/strava';
import {
  generateMockStravaActivities,
  generateMockStravaStats,
} from '@/lib/mock-strava-data';

const STRAVA_BASE = 'https://www.strava.com/api/v3';

async function fetchAllActivities(token: string) {
  let page = 1;
  const perPage = 200;
  const runs = { count: 0, distance_m: 0, moving_s: 0, elev_m: 0 };
  const hikes = { count: 0, distance_m: 0, moving_s: 0, elev_m: 0 };
  const rides = { count: 0, distance_m: 0, moving_s: 0, elev_m: 0 };
  let overallElevation_m = 0;

  for (; page <= 10; page++) {
    const r = await rateLimitedFetch(
      `${STRAVA_BASE}/athlete/activities?per_page=${perPage}&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    );

    if (!r.ok) break;

    const acts = await r.json();
    if (!Array.isArray(acts) || acts.length === 0) break;

    for (const a of acts) {
      const type = a.sport_type || a.type;
      const dist = a.distance || 0;
      const move = a.moving_time || 0;
      const elev = a.total_elevation_gain || 0;
      overallElevation_m += elev;

      if (type === 'Run') {
        runs.count++;
        runs.distance_m += dist;
        runs.moving_s += move;
        runs.elev_m += elev;
      } else if (type === 'Hike') {
        hikes.count++;
        hikes.distance_m += dist;
        hikes.moving_s += move;
        hikes.elev_m += elev;
      } else if (
        ['Ride', 'VirtualRide', 'GravelRide', 'MountainBikeRide'].includes(type)
      ) {
        rides.count++;
        rides.distance_m += dist;
        rides.moving_s += move;
        rides.elev_m += elev;
      }
    }
  }

  return {
    runs: {
      count: runs.count,
      distance_km: Math.round((runs.distance_m / 1000) * 10) / 10,
      moving_sec: runs.moving_s,
    },
    hikes: {
      count: hikes.count,
      distance_km: Math.round((hikes.distance_m / 1000) * 10) / 10,
      elevation_m: Math.round(hikes.elev_m),
      moving_sec: hikes.moving_s,
    },
    rides: {
      count: rides.count,
      distance_km: Math.round((rides.distance_m / 1000) * 10) / 10,
      moving_sec: rides.moving_s,
    },
    overall: { elevation_m: Math.round(overallElevation_m) },
  };
}

export async function GET() {
  try {
    const token = await getStravaAccessToken();
    const data = await fetchAllActivities(token);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400',
      },
    });
  } catch (e: any) {
    console.error('Error in /api/strava/stats:', e);
    console.log('🏃‍♂️ Using mock Strava data for demonstration');

    // Generate realistic mock data for demonstration
    const mockActivities = generateMockStravaActivities(100);
    const mockStats = generateMockStravaStats(mockActivities);

    return NextResponse.json(mockStats, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
        'X-Data-Source': 'mock',
      },
    });
  }
}
