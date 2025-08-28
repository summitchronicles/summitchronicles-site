// app/api/strava/recent/route.ts
import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

const STRAVA_BASE = "https://www.strava.com/api/v3";

export async function GET() {
  try {
    // Get valid access token (refresh if expired)
    const token = await getStravaAccessToken();

    // Fetch recent activities
    const res = await fetch(`${STRAVA_BASE}/athlete/activities?per_page=5`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Strava error ${res.status}: ${err}`);
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=1200" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unexpected error" },
      { status: 500 }
    );
  }
}