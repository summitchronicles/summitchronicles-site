// lib/strava.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STRAVA_TOKEN_TABLE = "strava_tokens";

interface StravaTokenRow {
  id: number;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

/**
 * Get a valid Strava access token.
 * Priority:
 *  1. Supabase stored token
 *  2. If missing → fallback to .env.local values
 * If expired, refresh and persist new tokens in Supabase.
 */
export async function getStravaAccessToken(): Promise<string> {
  // 1. Try load token row from Supabase
  const { data, error } = await supabase
    .from<StravaTokenRow>(STRAVA_TOKEN_TABLE)
    .select("*")
    .single();

  let access_token: string | null = null;
  let refresh_token: string | null = null;
  let expires_at: number | null = null;

  if (!error && data) {
    access_token = data.access_token;
    refresh_token = data.refresh_token;
    expires_at = data.expires_at;
  } else {
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
  const res = await fetch("https://www.strava.com/oauth/token", {
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

  // 4. Save new tokens in Supabase
  const { error: upsertError } = await supabase.from(STRAVA_TOKEN_TABLE).upsert({
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

  return json.access_token;
}