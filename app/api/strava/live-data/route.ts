import { NextResponse } from "next/server";

// Working Strava tokens (expires January 2025)
const STRAVA_ACCESS_TOKEN = "1650f96e93841365cbbb46f7ee56137e1b4fe4c2";

export async function GET() {
  try {
    // Fetch athlete info
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${STRAVA_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    // Fetch recent activities  
    const activitiesResponse = await fetch('https://www.strava.com/api/v3/athlete/activities?page=1&per_page=30', {
      headers: {
        'Authorization': `Bearer ${STRAVA_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!athleteResponse.ok || !activitiesResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch Strava data',
        athlete_status: athleteResponse.status,
        activities_status: activitiesResponse.status
      }, { status: 500 });
    }

    const athlete = await athleteResponse.json();
    const activities = await activitiesResponse.json();

    // Transform and categorize activities
    const transformedActivities = activities.map((activity: any) => ({
      id: activity.id,
      name: activity.name,
      type: activity.sport_type || activity.type,
      date: activity.start_date,
      distance: activity.distance ? (activity.distance / 1000).toFixed(2) : null,
      duration: activity.moving_time,
      duration_formatted: formatDuration(activity.moving_time),
      elevation_gain: activity.total_elevation_gain,
      average_speed: activity.average_speed ? (activity.average_speed * 3.6).toFixed(2) : null,
      max_speed: activity.max_speed ? (activity.max_speed * 3.6).toFixed(2) : null,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      calories: activity.calories,
      suffer_score: activity.suffer_score,
      kudos_count: activity.kudos_count,
      comment_count: activity.comment_count,
      location: {
        city: activity.location_city,
        state: activity.location_state,
        country: activity.location_country
      }
    }));

    // Categorize by activity type
    const runningActivities = transformedActivities.filter((a: any) => 
      ['Run', 'TrailRun', 'VirtualRun'].includes(a.type)
    );

    const strengthActivities = transformedActivities.filter((a: any) => 
      ['WeightTraining', 'Workout', 'HighIntensityIntervalTraining', 'Crossfit'].includes(a.type)
    );

    const outdoorActivities = transformedActivities.filter((a: any) => 
      ['Hike', 'Walk', 'AlpineSki', 'BackcountrySki', 'RockClimbing', 'IceClimb'].includes(a.type)
    );

    // Calculate statistics
    const stats = {
      total_activities: transformedActivities.length,
      total_distance: transformedActivities.reduce((sum: number, a: any) => sum + (parseFloat(a.distance) || 0), 0).toFixed(1),
      total_duration: transformedActivities.reduce((sum: number, a: any) => sum + (a.duration || 0), 0),
      total_elevation: transformedActivities.reduce((sum: number, a: any) => sum + (a.elevation_gain || 0), 0),
      running_sessions: runningActivities.length,
      strength_sessions: strengthActivities.length,
      outdoor_sessions: outdoorActivities.length
    };

    return NextResponse.json({ 
      success: true,
      message: 'Live Strava data fetched successfully!',
      athlete: {
        id: athlete.id,
        name: `${athlete.firstname} ${athlete.lastname}`,
        username: athlete.username,
        location: `${athlete.city}, ${athlete.state}, ${athlete.country}`,
        profile_image: athlete.profile_medium,
        premium: athlete.premium,
        summit: athlete.summit
      },
      statistics: stats,
      recent_activities: transformedActivities.slice(0, 10),
      activities_by_type: {
        running: runningActivities,
        strength: strengthActivities,
        outdoor: outdoorActivities
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Live Strava data error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}