import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

const STRAVA_BASE = "https://www.strava.com/api/v3";

async function fetchActivities(accessToken: string) {
  const r = await fetch(`${STRAVA_BASE}/athlete/activities?per_page=10`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return r;
}

export async function GET() {
  try {
    // Get a valid token (refresh handled automatically)
    const token = await getStravaAccessToken();

    let res = await fetchActivities(token);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Strava recent error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, activities: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}