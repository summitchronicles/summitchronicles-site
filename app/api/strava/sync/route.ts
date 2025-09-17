import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentActivities,
  getAthleteStats,
  getAthleteProfile,
  getMockStravaData,
} from '../../../../lib/integrations/strava';
import { sanityWriteClient } from '../../../../lib/sanity/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const useMockData = searchParams.get('mock') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    let activities, stats, profile;

    if (useMockData || !process.env.STRAVA_ACCESS_TOKEN) {
      // Use mock data for development
      const mockData = getMockStravaData();
      activities = mockData.activities;
      stats = mockData.stats;
      profile = mockData.profile;
    } else {
      // Fetch real data from Strava
      try {
        const [activitiesData, profileData] = await Promise.all([
          getRecentActivities(limit),
          getAthleteProfile(),
        ]);

        activities = activitiesData;
        profile = profileData;

        if (profile) {
          stats = await getAthleteStats(profile.id);
        }
      } catch (error) {
        console.error('Strava API error, falling back to mock data:', error);
        const mockData = getMockStravaData();
        activities = mockData.activities;
        stats = mockData.stats;
        profile = mockData.profile;
      }
    }

    // Sync activities to Sanity (optional)
    if (activities && activities.length > 0) {
      try {
        // Transform Strava activities to Sanity training entries
        const trainingEntries = activities.slice(0, 5).map((activity) => ({
          _type: 'trainingEntry',
          title: activity.name,
          date: activity.start_date_local.split('T')[0],
          type: mapStravaTypeToTrainingType(activity.type),
          duration: Math.round(activity.moving_time / 60), // Convert to minutes
          intensity: calculateIntensity(activity),
          description:
            activity.description || `${activity.type} activity from Strava`,
          metrics: {
            distance: activity.distance
              ? Math.round(activity.distance * 0.000621371 * 10) / 10
              : undefined, // meters to miles
            elevationGain: activity.total_elevation_gain
              ? Math.round(activity.total_elevation_gain * 3.28084)
              : undefined, // meters to feet
            heartRateAvg: activity.average_heartrate,
            heartRateMax: activity.max_heartrate,
            calories: activity.calories,
          },
          location: {
            name: `${activity.type} Location`,
            weather: 'Unknown',
          },
          stravaId: activity.id.toString(),
          isPublic: !activity.private,
          tags: ['strava', 'auto-sync', activity.type.toLowerCase()],
        }));

        // Note: In production, you'd want to check for duplicates before creating
        // await sanityWriteClient.createOrReplace(trainingEntries)
      } catch (syncError) {
        console.error('Error syncing to Sanity:', syncError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        activities: activities?.slice(0, limit) || [],
        stats: stats || null,
        profile: profile || null,
        meta: {
          timestamp: new Date().toISOString(),
          usedMockData: useMockData || !process.env.STRAVA_ACCESS_TOKEN,
          count: activities?.length || 0,
        },
      },
    });
  } catch (error) {
    console.error('Strava sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync Strava data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function mapStravaTypeToTrainingType(stravaType: string): string {
  const typeMap: { [key: string]: string } = {
    Ride: 'cardio',
    Run: 'cardio',
    TrailRun: 'hiking',
    Hike: 'hiking',
    Walk: 'cardio',
    Swim: 'cardio',
    WeightTraining: 'strength',
    Workout: 'strength',
    Crossfit: 'strength',
    Yoga: 'recovery',
    RockClimbing: 'climbing',
    IceClimbing: 'climbing',
    Mountaineering: 'climbing',
    AlpineSki: 'technical',
    BackcountrySki: 'technical',
    Snowboard: 'technical',
  };

  return typeMap[stravaType] || 'cardio';
}

function calculateIntensity(activity: any): string {
  // Simple intensity calculation based on heart rate and effort
  if (activity.average_heartrate) {
    if (activity.average_heartrate > 160) return 'maximum';
    if (activity.average_heartrate > 140) return 'high';
    if (activity.average_heartrate > 120) return 'moderate';
    return 'low';
  }

  // Fallback based on activity type and duration
  const duration = activity.moving_time / 3600; // hours
  if (activity.type === 'WeightTraining' || activity.type === 'Crossfit')
    return 'high';
  if (activity.type === 'Yoga' || activity.type === 'Walk') return 'low';
  if (duration > 3) return 'moderate';
  if (duration > 1) return 'moderate';
  return 'low';
}
