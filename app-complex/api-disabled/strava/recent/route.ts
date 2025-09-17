// app/api/strava/recent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
import { getStravaAccessToken, rateLimitedFetch } from '@/lib/strava';
import { generateMockStravaActivities } from '@/lib/mock-strava-data';
import { withErrorMonitoring, logInfo, logError } from '@/lib/error-monitor';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';

const STRAVA_BASE = 'https://www.strava.com/api/v3';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchRecentActivities(token: string, after?: number) {
  const url = new URL(`${STRAVA_BASE}/athlete/activities`);
  url.searchParams.set('per_page', '100');
  if (after) url.searchParams.set('after', String(after));

  const res = await rateLimitedFetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const text = await res.text();
  console.log('DEBUG: Raw Strava response:', text.slice(0, 500));

  if (!res.ok) throw new Error(`Strava error ${res.status}`);
  return JSON.parse(text) as any[];
}

const getRecentActivitiesHandler = async () => {
  console.log('🏃‍♂️ Fetching recent Strava activities...');
  const token = await getStravaAccessToken();
  console.log('✅ Got Strava access token successfully');

  // last synced activity
  const { data: lastRow } = await supabase
    .from('strava_activities')
    .select('start_date')
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  let after: number | undefined;
  if (lastRow?.start_date) {
    after = Math.floor(new Date(lastRow.start_date).getTime() / 1000);
  }

  // new Strava activities
  const newActs = await fetchRecentActivities(token, after);

  if (newActs.length > 0) {
    const rows = newActs.map((a) => ({
      id: Number(a.id), // bigint
      name: String(a.name ?? ''),
      type: String(a.sport_type ?? a.type ?? ''),
      distance: a.distance ? Number(a.distance) : 0, // double precision
      moving_time: a.moving_time ? Math.floor(Number(a.moving_time)) : 0, // int
      total_elevation_gain: a.total_elevation_gain
        ? Math.floor(Number(a.total_elevation_gain))
        : 0, // int
      start_date: a.start_date ? new Date(a.start_date).toISOString() : null, // timestamptz
      average_speed: a.average_speed ? Number(a.average_speed) : null, // double precision
    }));

    const { error: upsertErr } = await supabase
      .from('strava_activities')
      .upsert(rows, { onConflict: 'id' });

    if (upsertErr) {
      console.error('Supabase upsert error:', upsertErr);
    }
  }

  // Get recent activities - expand to show more than just last 7 days
  // Changed to get last 20 activities to show more data on training page
  const { data: activities, error: fetchErr } = await supabase
    .from('strava_activities')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(20);

  if (fetchErr) console.error('Supabase fetch error:', fetchErr);

  await logInfo('Strava activities fetched successfully', {
    count: activities?.length || 0,
  });
  return NextResponse.json({ ok: true, activities: activities ?? [] });
};

export const GET = protectionPresets.apiEndpoint(
  async (request: ProtectedRequest) => {
    try {
      return await getRecentActivitiesHandler();
    } catch (e: any) {
      return await fallbackHandler(e);
    }
  }
);

async function fallbackHandler(e: any) {
  console.error('❌ Error in /api/strava/recent:', e);

  // Log the error to our monitoring system
  await logError(e, {
    endpoint: '/api/strava/recent',
    action: 'fetch_recent_activities',
  });

  // Try to get activities from database first (cached data)
  const { data: cachedActivities } = await supabase
    .from('strava_activities')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(20);

  if (cachedActivities && cachedActivities.length > 0) {
    console.log('📦 Using cached Strava activities from database');
    return NextResponse.json({
      ok: true,
      activities: cachedActivities,
      source: 'cached',
      message: 'Using cached data due to API error. Tokens may need refresh.',
    });
  }

  // Only fall back to mock if no cached data exists
  console.log(
    '🏃‍♂️ No cached data available, using mock activities for demonstration'
  );
  const mockActivities = generateMockStravaActivities(20);

  return NextResponse.json({
    ok: true,
    activities: mockActivities,
    source: 'mock',
    error: e.message,
    message: 'API temporarily unavailable. Please check Strava authentication.',
  });
}
