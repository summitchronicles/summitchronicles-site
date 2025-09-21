// lib/strava.ts
import { createClient } from "@supabase/supabase-js";

// Create Supabase client only if environment variables are available
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

const STRAVA_TOKEN_TABLE = "strava_tokens";

interface StravaTokenRow {
  id: number;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Rate limiting helper
let lastApiCall = 0;
const API_CALL_DELAY = 1000; // 1 second between calls

export async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < API_CALL_DELAY) {
    await new Promise(resolve => setTimeout(resolve, API_CALL_DELAY - timeSinceLastCall));
  }
  
  lastApiCall = Date.now();
  return fetch(url, options);
}

/**
 * Get a valid Strava access token.
 * Priority:
 *  1. Supabase stored token
 *  2. If missing → fallback to .env.local values
 * If expired, refresh and persist new tokens in Supabase.
 */
export async function getStravaAccessToken(): Promise<string> {
  let access_token: string | null = null;
  let refresh_token: string | null = null;
  let expires_at: number | null = null;

  // 1. Try load token row from Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(STRAVA_TOKEN_TABLE)
        .select("*")
        .single<StravaTokenRow>();

      if (!error && data) {
        access_token = data.access_token;
        refresh_token = data.refresh_token;
        expires_at = data.expires_at;
      }
    } catch (error) {
      console.warn("⚠️ Supabase query failed, falling back to env vars");
    }
  }

  // 2. Fall back to environment variables if Supabase unavailable or no data
  if (!access_token) {
    console.warn("⚠️ No tokens in Supabase, falling back to env vars");
    access_token = process.env.STRAVA_ACCESS_TOKEN || null;
    refresh_token = process.env.STRAVA_REFRESH_TOKEN || null;
    expires_at = Math.floor(Date.now() / 1000) + 3600; // assume 1h validity
  }

  if (!refresh_token) {
    throw new Error("No Strava refresh token available (Supabase + env both empty)");
  }

  const now = Math.floor(Date.now() / 1000);

  // 2. If still valid, return
  if (access_token && expires_at && expires_at > now + 60) {
    return access_token;
  }

  // 3. Refresh if expired
  const res = await rateLimitedFetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to refresh Strava token: ${res.status} - ${errText}`);
  }

  const json = await res.json();

  // 4. Save new tokens in Supabase (if available)
  if (supabase) {
    const { error: upsertError } = await supabase
      .from(STRAVA_TOKEN_TABLE)
      .upsert({
        id: 1,
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        expires_at: json.expires_at,
      });

    if (upsertError) {
      console.error("⚠️ Failed to persist refreshed token in Supabase:", upsertError.message);
    } else {
      console.log("✅ Refreshed Strava token persisted in Supabase");
    }
  } else {
    console.warn("⚠️ Supabase unavailable, cannot persist refreshed token");
  }

  return json.access_token;
}

/**
 * Fetch recent activities from Strava
 */
export async function fetchStravaActivities(page = 1, perPage = 30) {
  try {
    const token = await getStravaAccessToken();
    
    const url = new URL("https://www.strava.com/api/v3/athlete/activities");
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(perPage));
    
    const response = await rateLimitedFetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    const activities = await response.json();
    console.log(`✅ Fetched ${activities.length} activities from Strava API`);
    
    return activities;
  } catch (error) {
    console.error('❌ Error fetching Strava activities:', error);
    // Return mock data as fallback
    return getMockActivities();
  }
}

/**
 * Store Strava tokens (used by OAuth callback)
 */
export async function storeStravaTokens(tokens: any) {
  if (!supabase) {
    console.warn('⚠️ Supabase unavailable, cannot store tokens');
    return;
  }

  const { error } = await supabase
    .from(STRAVA_TOKEN_TABLE)
    .upsert({
      id: 1,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
    });

  if (error) {
    console.error('❌ Failed to store tokens:', error);
    throw error;
  }

  console.log('✅ Strava tokens stored successfully');
}

/**
 * Mock activities for fallback
 */
function getMockActivities() {
  return [
    {
      id: 10234567890,
      name: 'Morning Alpine Training - Mt. Elbert',
      type: 'Hike',
      start_date: '2024-09-12T06:30:00Z',
      distance: 12500,
      moving_time: 14400,
      total_elevation_gain: 1250,
      average_heartrate: 142,
      max_heartrate: 168,
      location_city: 'Twin Lakes',
      location_state: 'Colorado',
      kudos_count: 23,
      photo_count: 8,
    },
    {
      id: 10234567891,
      name: 'High Altitude Endurance Run',
      type: 'Run',
      start_date: '2024-09-09T07:00:00Z',
      distance: 8200,
      moving_time: 3600,
      total_elevation_gain: 450,
      average_heartrate: 156,
      max_heartrate: 175,
      location_city: 'Boulder',
      location_state: 'Colorado',
      kudos_count: 15,
      photo_count: 2,
    }
  ];
}