import { NextRequest, NextResponse } from 'next/server';
import { fetchGarminActivities, transformGarminActivity } from '@/lib/integrations/garmin-api';
import { isGarminConnected } from '@/lib/integrations/garmin-oauth-1.0a';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';


interface SyncResponse {
  success: boolean;
  synced: number;
  skipped: number;
  errors: number;
  message: string;
  activities?: any[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SyncResponse>> {
  const userId = 'sunith'; // For now, single user

  try {
    // Check if Garmin is connected
    const isConnected = await isGarminConnected(userId);

    if (!isConnected) {
      return NextResponse.json({
        success: false,
        synced: 0,
        skipped: 0,
        errors: 0,
        message: 'Garmin account not connected',
        error: 'Please connect your Garmin account first'
      }, { status: 401 });
    }

    // Get sync parameters
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 100;
    const daysBack = body.days_back || 30;

    console.log(`Starting Garmin sync: last ${daysBack} days, max ${limit} activities`);

    // Fetch activities from Garmin
    const { activities } = await fetchGarminActivities(userId, {
      limit,
      start: 0
    });

    console.log(`Fetched ${activities.length} activities from Garmin`);

    let synced = 0;
    let skipped = 0;
    let errors = 0;
    const syncedActivities = [];

    for (const activity of activities) {
      try {
        // Transform to our schema
        const workoutData = transformGarminActivity(activity);

        // Check if already exists
        const { data: existing } = await getSupabaseClient()
          .from('garmin_workouts')
          .select('id')
          .eq('garmin_activity_id', workoutData.garmin_activity_id)
          .single();

        if (existing) {
          skipped++;
          continue;
        }

        // Insert into database
        const { error } = await getSupabaseClient()
          .from('garmin_workouts')
          .insert(workoutData);

        if (error) {
          console.error(`Error inserting activity ${workoutData.garmin_activity_id}:`, error);
          errors++;
        } else {
          synced++;
          syncedActivities.push({
            id: workoutData.garmin_activity_id,
            name: workoutData.activity_name,
            date: workoutData.date,
            type: workoutData.activity_type
          });
        }
      } catch (error) {
        console.error('Error processing activity:', error);
        errors++;
      }
    }

    console.log(`Sync complete: ${synced} synced, ${skipped} skipped, ${errors} errors`);

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      errors,
      message: `Successfully synced ${synced} activities`,
      activities: syncedActivities.slice(0, 10) // Return first 10
    });

  } catch (error) {
    console.error('Garmin sync error:', error);
    return NextResponse.json({
      success: false,
      synced: 0,
      skipped: 0,
      errors: 1,
      message: 'Sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userId = 'sunith';

  try {
    // Get sync status
    const { count: totalActivities } = await getSupabaseClient()
      .from('garmin_workouts')
      .select('*', { count: 'exact', head: true });

    const { data: latestActivity } = await getSupabaseClient()
      .from('garmin_workouts')
      .select('date, activity_name, created_at')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    const isConnected = await isGarminConnected(userId);

    return NextResponse.json({
      connected: isConnected,
      total_activities: totalActivities || 0,
      latest_activity: latestActivity,
      last_sync: latestActivity?.created_at || null
    });

  } catch (error) {
    return NextResponse.json({
      connected: false,
      total_activities: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
