// app/api/strava/recent/route.ts
import { NextResponse } from "next/server";

const STRAVA_BASE = "https://www.strava.com/api/v3";
const OAUTH_TOKEN = "https://www.strava.com/oauth/token";

function env(name: string, hard = false) {
  const v = process.env[name];
  if (!v && hard) throw new Error(`Missing ${name} in env`);
  return v || "";
}

async function fetchActivities(accessToken: string) {
  const r = await fetch(`${STRAVA_BASE}/athlete/activities?per_page=10`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    // Strava can be slow sometimes; keep it reasonable
    cache: "no-store",
  });
  return r;
}

async function refreshAccessToken() {
  const client_id = env("STRAVA_CLIENT_ID", true);
  const client_secret = env("STRAVA_CLIENT_SECRET", true);
  const refresh_token = env("STRAVA_REFRESH_TOKEN", true);

  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: "refresh_token",
    refresh_token,
  });

  const r = await fetch(OAUTH_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Strava refresh failed: ${r.status} ${err}`);
  }
  const json = await r.json() as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
    token_type: string;
  };

  // Update process.env for this process (persists until dev server restarts)
  process.env.STRAVA_ACCESS_TOKEN = json.access_token;
  process.env.STRAVA_REFRESH_TOKEN = json.refresh_token;

  // Helpful log so you can paste into .env.local to persist
  console.log("🔁 Strava tokens refreshed:");
  console.log("STRAVA_ACCESS_TOKEN=", json.access_token);
  console.log("STRAVA_REFRESH_TOKEN=", json.refresh_token);

  return json.access_token;
}

export async function GET() {
  try {
    const token = env("STRAVA_ACCESS_TOKEN");
    if (!token) {
      return NextResponse.json(
        { error: "Missing STRAVA_ACCESS_TOKEN (or wire refresh flow)" },
        { status: 500 }
      );
    }

    // 1) try with current token
    let res = await fetchActivities(token);
    if (res.status === 401) {
      // 2) refresh and retry once
      const newToken = await refreshAccessToken();
      res = await fetchActivities(newToken);
    }

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Strava error ${res.status}`, detail: err }, { status: res.status });
    }

    const data = await res.json();
    // shape to the UI you want; here we return raw recent activities
    return NextResponse.json({ ok: true, activities: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}