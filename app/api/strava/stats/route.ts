import { NextResponse } from "next/server";
import { getStravaAccessToken } from "@/lib/strava";

const STRAVA_API = "https://www.strava.com/api/v3";
const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12h cache in memory

let cached: any = null;
let cachedAt = 0;

async function getJson(url: string, token: string) {
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Strava error ${r.status} for ${url}`);
  return r.json();
}

export async function GET() {
  try {
    // Serve from memory cache
    if (cached && Date.now() - cachedAt < MAX_AGE_MS) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400" },
      });
    }

    // Get valid token
    const access_token = await getStravaAccessToken();

    let page = 1;
    const perPage = 200;
    const runs = { count: 0, distance_m: 0, moving_s: 0, elev_m: 0 };
    const hikes = { count: 0, distance_m: 0, moving_s: 0, elev_m: 0 };
    const rides = { count: 0, distance_m: 0, moving_s: 0, elev_m: 0 };
    let overallElevation_m = 0;

    // Paginate through activity history
    for (; page <= 10; page++) {
      const acts = await getJson(
        `${STRAVA_API}/athlete/activities?per_page=${perPage}&page=${page}`,
        access_token
      );
      if (!Array.isArray(acts) || acts.length === 0) break;

      for (const a of acts) {
        const type = a.sport_type || a.type;
        const dist = a.distance || 0;
        const move = a.moving_time || 0;
        const elev = a.total_elevation_gain || 0;
        overallElevation_m += elev;

        if (type === "Run") {
          runs.count++;
          runs.distance_m += dist;
          runs.moving_s += move;
          runs.elev_m += elev;
        } else if (type === "Hike") {
          hikes.count++;
          hikes.distance_m += dist;
          hikes.moving_s += move;
          hikes.elev_m += elev;
        } else if (
          type === "Ride" ||
          type === "VirtualRide" ||
          type === "GravelRide" ||
          type === "MountainBikeRide"
        ) {
          rides.count++;
          rides.distance_m += dist;
          rides.moving_s += move;
          rides.elev_m += elev;
        }
      }
    }

    const data = {
      runs: {
        count: runs.count,
        distance_km: Math.round((runs.distance_m / 1000) * 10) / 10,
        moving_sec: runs.moving_s,
      },
      hikes: {
        count: hikes.count,
        distance_km: Math.round((hikes.distance_m / 1000) * 10) / 10,
        elevation_m: Math.round(hikes.elev_m),
        moving_sec: hikes.moving_s,
      },
      rides: {
        count: rides.count,
        distance_km: Math.round((rides.distance_m / 1000) * 10) / 10,
        moving_sec: rides.moving_s,
      },
      overall: { elevation_m: Math.round(overallElevation_m) },
    };

    cached = data;
    cachedAt = Date.now();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}