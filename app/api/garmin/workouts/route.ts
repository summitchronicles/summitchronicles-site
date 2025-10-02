import { NextRequest, NextResponse } from 'next/server';
import GarminAPIClient, { GarminWorkout } from '../../../../lib/garmin-api';
import { getGarminTokensFromRequest } from '../../../../lib/garmin-tokens';

export async function POST(request: NextRequest) {
  try {
    const tokens = getGarminTokensFromRequest(request);
    if (!tokens) {
      return NextResponse.json(
        {
          error: 'Not authenticated with Garmin Connect',
          code: 'NOT_AUTHENTICATED',
          help: 'Please authenticate with Garmin Connect first'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, workouts, workoutId, scheduledDate } = body;

    const garminClient = new GarminAPIClient();
    garminClient.setTokens(tokens);

    switch (action) {
      case 'create':
        if (!workouts || !Array.isArray(workouts)) {
          return NextResponse.json(
            {
              error: 'Invalid workouts data',
              code: 'INVALID_WORKOUTS',
              help: 'Provide an array of workout objects'
            },
            { status: 400 }
          );
        }

        const createdWorkouts = [];
        const errors = [];

        for (const workout of workouts) {
          try {
            const garminWorkout = GarminAPIClient.convertToGarminWorkout(workout);
            const result = await garminClient.createWorkout(garminWorkout);
            createdWorkouts.push({
              originalId: workout.id,
              garminWorkoutId: result.workoutId,
              title: workout.title,
              status: 'created'
            });
          } catch (error) {
            console.error(`Failed to create workout ${workout.title}:`, error);
            errors.push({
              originalId: workout.id,
              title: workout.title,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        return NextResponse.json({
          success: true,
          message: `Created ${createdWorkouts.length} workouts, ${errors.length} failures`,
          createdWorkouts,
          errors: errors.length > 0 ? errors : undefined
        });

      case 'schedule':
        if (!workoutId || !scheduledDate) {
          return NextResponse.json(
            {
              error: 'Missing required parameters',
              code: 'MISSING_PARAMS',
              help: 'Provide workoutId and scheduledDate'
            },
            { status: 400 }
          );
        }

        try {
          await garminClient.scheduleWorkout(workoutId, scheduledDate);
          return NextResponse.json({
            success: true,
            message: 'Workout scheduled successfully',
            workoutId,
            scheduledDate
          });
        } catch (error) {
          console.error('Failed to schedule workout:', error);
          return NextResponse.json(
            {
              error: 'Failed to schedule workout',
              code: 'SCHEDULE_FAILED',
              details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
          );
        }

      case 'unschedule':
        if (!workoutId || !scheduledDate) {
          return NextResponse.json(
            {
              error: 'Missing required parameters',
              code: 'MISSING_PARAMS',
              help: 'Provide workoutId and scheduledDate'
            },
            { status: 400 }
          );
        }

        try {
          await garminClient.unscheduleWorkout(workoutId, scheduledDate);
          return NextResponse.json({
            success: true,
            message: 'Workout unscheduled successfully',
            workoutId,
            scheduledDate
          });
        } catch (error) {
          console.error('Failed to unschedule workout:', error);
          return NextResponse.json(
            {
              error: 'Failed to unschedule workout',
              code: 'UNSCHEDULE_FAILED',
              details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          {
            error: 'Invalid action parameter',
            code: 'INVALID_ACTION',
            validActions: ['create', 'schedule', 'unschedule']
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Garmin workouts API error:', error);
    return NextResponse.json(
      {
        error: 'Workout management service error',
        code: 'SERVICE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const tokens = getGarminTokensFromRequest(request);
    if (!tokens) {
      return NextResponse.json(
        {
          error: 'Not authenticated with Garmin Connect',
          code: 'NOT_AUTHENTICATED',
          help: 'Please authenticate with Garmin Connect first'
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const garminClient = new GarminAPIClient();
    garminClient.setTokens(tokens);

    try {
      const workouts = await garminClient.getWorkouts(limit);

      return NextResponse.json({
        success: true,
        workouts,
        count: workouts.length,
        message: `Retrieved ${workouts.length} workouts from Garmin Connect`
      });

    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch workouts from Garmin Connect',
          code: 'FETCH_FAILED',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Garmin workouts GET error:', error);
    return NextResponse.json(
      {
        error: 'Workout service error',
        code: 'SERVICE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tokens = getGarminTokensFromRequest(request);
    if (!tokens) {
      return NextResponse.json(
        {
          error: 'Not authenticated with Garmin Connect',
          code: 'NOT_AUTHENTICATED',
          help: 'Please authenticate with Garmin Connect first'
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get('workoutId');

    if (!workoutId) {
      return NextResponse.json(
        {
          error: 'Missing workoutId parameter',
          code: 'MISSING_WORKOUT_ID',
          help: 'Provide workoutId in query parameters'
        },
        { status: 400 }
      );
    }

    const garminClient = new GarminAPIClient();
    garminClient.setTokens(tokens);

    try {
      await garminClient.deleteWorkout(parseInt(workoutId));

      return NextResponse.json({
        success: true,
        message: 'Workout deleted successfully',
        workoutId: parseInt(workoutId)
      });

    } catch (error) {
      console.error('Failed to delete workout:', error);
      return NextResponse.json(
        {
          error: 'Failed to delete workout from Garmin Connect',
          code: 'DELETE_FAILED',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Garmin workouts DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Workout deletion service error',
        code: 'SERVICE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}