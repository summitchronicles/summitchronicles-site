import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

const STRAVA_BASE = "https://www.strava.com/api/v3";

async function fetchActivities(accessToken: string) {
  const res = await fetch(`${STRAVA_BASE}/athlete/activities?per_page=10`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return res;
}

export async function GET() {
  try {
    // Always get a valid token (refresh handled in lib/strava.ts)
    const token = await getStravaAccessToken();

    const res = await fetchActivities(token);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Strava recent error ${res.status}: ${err}`);
    }

    const data = await res.json();

    // Return JSON response
    return NextResponse.json({ ok: true, activities: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unexpected error" },
      { status: 500 }
    );
  }
}