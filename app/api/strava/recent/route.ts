// app/api/strava/recent/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStravaAccessToken, rateLimitedFetch } from "@/lib/strava";
import { generateMockStravaActivities } from "@/lib/mock-strava-data";

const STRAVA_BASE = "https://www.strava.com/api/v3";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchRecentActivities(token: string, after?: number) {
  const url = new URL(`${STRAVA_BASE}/athlete/activities`);
  url.searchParams.set("per_page", "100");
  if (after) url.searchParams.set("after", String(after));

  const res = await rateLimitedFetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  console.log("DEBUG: Raw Strava response:", text.slice(0, 500));

  if (!res.ok) throw new Error(`Strava error ${res.status}`);
  return JSON.parse(text) as any[];
}

export async function GET() {
  try {
    const token = await getStravaAccessToken();

    // last synced activity
    const { data: lastRow } = await supabase
      .from("strava_activities")
      .select("start_date")
      .order("start_date", { ascending: false })
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
        name: String(a.name ?? ""),
        type: String(a.sport_type ?? a.type ?? ""),
        distance: a.distance ? Number(a.distance) : 0, // double precision
        moving_time: a.moving_time ? Math.floor(Number(a.moving_time)) : 0, // int
        total_elevation_gain: a.total_elevation_gain
          ? Math.floor(Number(a.total_elevation_gain))
          : 0, // int
        start_date: a.start_date
          ? new Date(a.start_date).toISOString()
          : null, // timestamptz
        average_speed: a.average_speed
          ? Number(a.average_speed)
          : null, // double precision
      }));

      const { error: upsertErr } = await supabase
        .from("strava_activities")
        .upsert(rows, { onConflict: "id" });

      if (upsertErr) {
        console.error("Supabase upsert error:", upsertErr);
      }
    }

    // Get recent activities - expand to show more than just last 7 days
    // Changed to get last 20 activities to show more data on training page
    const { data: activities, error: fetchErr } = await supabase
      .from("strava_activities")
      .select("*")
      .order("start_date", { ascending: false })
      .limit(20);

    if (fetchErr) console.error("Supabase fetch error:", fetchErr);

    return NextResponse.json({ ok: true, activities: activities ?? [] });
  } catch (e: any) {
    console.error("Error in /api/strava/recent:", e);
    console.log("🏃‍♂️ Using mock recent activities for demonstration");
    
    // Generate recent mock activities for demonstration
    const mockActivities = generateMockStravaActivities(20);
    
    return NextResponse.json({ 
      ok: true, 
      activities: mockActivities,
      source: "mock"
    });
  }
}