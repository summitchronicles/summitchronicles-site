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
 * If expired, refresh and persist new tokens in Supabase.
 */
export async function getStravaAccessToken(): Promise<string> {
  // 1. Load token row
  const { data, error } = await supabase
    .from<StravaTokenRow>(STRAVA_TOKEN_TABLE)
    .select("*")
    .single();

  if (error) throw new Error("Failed to fetch Strava tokens: " + error.message);
  if (!data) throw new Error("No tokens found in Supabase — seed strava_tokens table first");

  let { access_token, refresh_token, expires_at } = data;
  const now = Math.floor(Date.now() / 1000);

  // 2. If still valid, return
  if (expires_at && expires_at > now + 60) {
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

  // 4. Save new tokens
  await supabase.from(STRAVA_TOKEN_TABLE).upsert({
    id: 1,
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: json.expires_at,
  });

  return json.access_token;
}