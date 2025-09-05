import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get stored Strava tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('strava_tokens')
      .select('access_token, expires_at')
      .eq('id', 1)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ 
        error: 'No Strava tokens found. Please connect your Strava account first.',
        redirect: '/admin/strava'
      }, { status: 401 });
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (tokenData.expires_at < now) {
      return NextResponse.json({ 
        error: 'Strava token expired. Please reconnect your account.',
        redirect: '/admin/strava'
      }, { status: 401 });
    }

    // Fetch recent activities from Strava API
    const stravaResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=20', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!stravaResponse.ok) {
      const errorText = await stravaResponse.text();
      return NextResponse.json({ 
        error: 'Failed to fetch Strava activities',
        details: errorText,
        status: stravaResponse.status
      }, { status: 500 });
    }

    const activities = await stravaResponse.json();

    // Transform activities for our application
    const transformedActivities = activities.map((activity: any) => ({
      id: activity.id,
      name: activity.name,
      type: activity.sport_type || activity.type,
      date: activity.start_date,
      distance: activity.distance ? (activity.distance / 1000).toFixed(2) : null, // Convert to km
      duration: activity.moving_time,
      elevation_gain: activity.total_elevation_gain,
      average_speed: activity.average_speed ? (activity.average_speed * 3.6).toFixed(2) : null, // Convert to km/h
      max_speed: activity.max_speed ? (activity.max_speed * 3.6).toFixed(2) : null,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      calories: activity.calories,
      location: {
        city: activity.location_city,
        state: activity.location_state,
        country: activity.location_country
      },
      kudos_count: activity.kudos_count,
      comment_count: activity.comment_count
    }));

    return NextResponse.json({ 
      success: true,
      activities: transformedActivities,
      athlete_name: 'Sunith Kumar', // We know this from the token exchange
      total_activities: activities.length
    });

  } catch (error: any) {
    console.error('Strava activities error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}