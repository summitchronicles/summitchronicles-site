import { NextRequest, NextResponse } from 'next/server';
import { fetchGarminActivities } from '@/lib/integrations/garmin-api';
import { isGarminConnected } from '@/lib/integrations/garmin-oauth-1.0a';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const daysBack = parseInt(searchParams.get('days_back') || '30');
  const limit = parseInt(searchParams.get('limit') || '200');
  const userId = 'sunith'; // For now, single user

  try {
    // Check if Garmin is connected
    const isConnected = await isGarminConnected(userId);

    if (!isConnected) {
      console.log('Garmin not connected, returning fallback data');
      return NextResponse.json({
        activities: generateFallbackActivities(Math.min(limit, 50)),
        total_activities: Math.min(limit, 50),
        summary: {
          total_distance_km: 850.5,
          total_time_hours: 125.3,
          total_elevation_m: 42500,
          avg_activities_per_week: 4.2
        },
        source: 'fallback',
        data_quality: 'estimated',
        last_updated: new Date().toISOString(),
        message: 'Garmin not connected. Connect your account to see real data.',
        query_params: {
          days_back: daysBack,
          limit: limit
        }
      }, {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
        }
      });
    }

    // Fetch real activities from Garmin
    console.log('Fetching real Garmin activities...');
    const { activities, total } = await fetchGarminActivities(userId, {
      limit,
      start: 0
    });

    // Transform to consistent format
    const transformedActivities = activities.map(activity => ({
      id: activity.activityId,
      name: activity.activityName,
      distance: activity.distance,
      moving_time: activity.duration,
      elapsed_time: activity.duration,
      total_elevation_gain: activity.elevationGain || 0,
      type: activity.activityType?.typeKey || 'unknown',
      start_date: activity.startTimeGMT,
      start_date_local: activity.startTimeLocal,
      average_speed: activity.avgSpeed || 0,
      max_speed: activity.maxSpeed || 0,
      average_heartrate: activity.avgHR || null,
      max_heartrate: activity.maxHR || null,
      calories: activity.calories || 0,
      device_name: activity.deviceName || 'Garmin Device',
      external_id: `garmin-${activity.activityId}`,
      has_heartrate: !!activity.avgHR,
      private: false,
      average_power: activity.averagePower || null,
      training_stress_score: activity.trainingStressScore || null
    }));

    // Calculate summary
    const summary = {
      total_distance_km: transformedActivities.reduce((sum, a) => sum + (a.distance || 0), 0) / 1000,
      total_time_hours: transformedActivities.reduce((sum, a) => sum + (a.moving_time || 0), 0) / 3600,
      total_elevation_m: transformedActivities.reduce((sum, a) => sum + (a.total_elevation_gain || 0), 0),
      avg_activities_per_week: (total / (daysBack / 7)) || 0
    };

    const responseData = {
      activities: transformedActivities,
      total_activities: total,
      summary,
      source: 'garmin',
      data_quality: 'high',
      last_updated: new Date().toISOString(),
      query_params: {
        days_back: daysBack,
        limit: limit
      },
      fetch_time_ms: Date.now() - startTime
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('Error fetching Garmin activities:', error);

    // Return fallback data on error
    const fallbackData = {
      activities: generateFallbackActivities(Math.min(limit, 50)),
      total_activities: Math.min(limit, 50),
      summary: {
        total_distance_km: 850.5,
        total_time_hours: 125.3,
        total_elevation_m: 42500,
        avg_activities_per_week: 4.2
      },
      source: 'fallback',
      data_quality: 'estimated',
      last_updated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Garmin API temporarily unavailable',
      query_params: {
        days_back: daysBack,
        limit: limit
      }
    };

    return NextResponse.json(fallbackData, {
      status: 200, // Return 200 with fallback data
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
      }
    });
  }
}

function generateEnhancedGarminActivities(limit: number) {
  const activities = [];
  const activityTypes = ['run', 'hike', 'cycling', 'mountaineering', 'trail_run', 'alpine_skiing', 'rock_climbing'];
  const names = [
    'Everest Base Training',
    'High Altitude Simulation',
    'Technical Mountain Skills',
    'Endurance Base Building',
    'Recovery Active Rest',
    'Altitude Acclimatization',
    'Strength & Power Session',
    'Mental Preparation Hike',
    'Equipment Testing Run',
    'Navigation Training',
    'Cold Weather Adaptation',
    'Hypoxic Training Session'
  ];

  for (let i = 0; i < Math.min(limit, 200); i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 2)); // More realistic frequency

    activities.push({
      id: 9000000000 + i, // Garmin-style high IDs
      name: names[i % names.length],
      distance: Math.random() * 25000 + 8000, // 8-33km realistic range
      moving_time: Math.random() * 10800 + 3600, // 1-4 hours
      elapsed_time: Math.random() * 12600 + 3600,
      total_elevation_gain: Math.random() * 1500 + 400, // 400-1900m realistic
      type: activityTypes[i % activityTypes.length],
      start_date: date.toISOString(),
      start_date_local: date.toISOString(),
      average_speed: Math.random() * 4 + 2.5, // 2.5-6.5 m/s realistic
      max_speed: Math.random() * 6 + 7, // 7-13 m/s
      average_heartrate: Math.random() * 30 + 145, // 145-175 bpm training zones
      max_heartrate: Math.random() * 25 + 175, // 175-200 bpm
      calories: Math.random() * 800 + 400, // 400-1200 calories
      device_name: 'Garmin Fenix 7X Solar',
      external_id: `garmin-${9000000000 + i}`,
      has_heartrate: true,
      private: false,
      // Enhanced Garmin-specific data
      average_power: i % 3 === 0 ? Math.random() * 100 + 150 : null,
      training_stress_score: Math.random() * 50 + 25,
      vo2_max_detected: i % 5 === 0 ? Math.random() * 10 + 55 : null
    });
  }

  return activities;
}

function generateFallbackActivities(limit: number) {
  const activities = [];
  const activityTypes = ['run', 'hike', 'cycling', 'mountaineering', 'trail_run'];
  const names = [
    'Morning Training Run',
    'Hill Repeat Session',
    'Long Base Building Run',
    'Technical Mountain Training',
    'Recovery Jog',
    'Altitude Training Hike',
    'Speed Work Session',
    'Endurance Base Building'
  ];

  for (let i = 0; i < Math.min(limit, 50); i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    activities.push({
      id: 1000000000 + i,
      name: names[i % names.length],
      distance: Math.random() * 20000 + 5000, // 5-25km
      moving_time: Math.random() * 7200 + 1800, // 30min - 2hr
      elapsed_time: Math.random() * 7200 + 1800,
      total_elevation_gain: Math.random() * 1000 + 200, // 200-1200m
      type: activityTypes[i % activityTypes.length],
      start_date: date.toISOString(),
      start_date_local: date.toISOString(),
      average_speed: Math.random() * 5 + 2, // 2-7 m/s
      max_speed: Math.random() * 8 + 5, // 5-13 m/s
      average_heartrate: Math.random() * 40 + 140, // 140-180 bpm
      max_heartrate: Math.random() * 30 + 170, // 170-200 bpm
      calories: Math.random() * 1000 + 300,
      device_name: 'Garmin Device',
      external_id: `garmin-fallback-${1000000000 + i}`,
      has_heartrate: true,
      private: false
    });
  }

  return activities;
}