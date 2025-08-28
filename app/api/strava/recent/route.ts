// app/api/strava/recent/route.ts
import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

const STRAVA_BASE = "https://www.strava.com/api/v3";

async function fetchRecentActivities(token: string) {
  const r = await fetch(`${STRAVA_BASE}/athlete/activities?per_page=10`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Strava error ${r.status}: ${err}`);
  }
  return r.json();
}

export async function GET() {
  try {
    const token = await getStravaAccessToken();
    const activities = await fetchRecentActivities(token);

    return NextResponse.json({ ok: true, activities });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unexpected error" },
      { status: 500 }
    );
  }
}