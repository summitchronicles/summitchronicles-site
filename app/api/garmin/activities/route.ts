import { NextRequest, NextResponse } from 'next/server';
import GarminAPIClient, { GarminActivity } from '../../../../lib/garmin-api';
import { getGarminTokensFromRequest } from '../../../../lib/garmin-tokens';

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
    const limit = parseInt(searchParams.get('limit') || '50');
    const start = parseInt(searchParams.get('start') || '0');
    const activityId = searchParams.get('activityId');

    const garminClient = new GarminAPIClient();
    garminClient.setTokens(tokens);

    try {
      if (activityId) {
        // Get single activity with details
        const activity = await garminClient.getActivity(parseInt(activityId));
        const details = await garminClient.getActivityDetails(parseInt(activityId));

        return NextResponse.json({
          success: true,
          activity: {
            ...activity,
            details
          },
          message: 'Activity retrieved successfully'
        });
      } else {
        // Get list of activities
        const activities = await garminClient.getActivities(limit, start);

        // Process activities to calculate compliance with planned workouts
        const processedActivities = activities.map(activity => ({
          ...activity,
          processedAt: new Date().toISOString(),
          // Add fields for planned vs actual comparison
          planned: null, // Will be populated when matching with training plan
          compliance: null, // Will be calculated when matching
        }));

        return NextResponse.json({
          success: true,
          activities: processedActivities,
          count: activities.length,
          pagination: {
            limit,
            start,
            hasMore: activities.length === limit
          },
          message: `Retrieved ${activities.length} activities from Garmin Connect`
        });
      }

    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch activities from Garmin Connect',
          code: 'FETCH_FAILED',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Garmin activities API error:', error);
    return NextResponse.json(
      {
        error: 'Activity service error',
        code: 'SERVICE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

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
    const { action, activities, plannedWorkouts } = body;

    const garminClient = new GarminAPIClient();
    garminClient.setTokens(tokens);

    switch (action) {
      case 'sync':
        try {
          // Fetch recent activities from Garmin
          const garminActivities = await garminClient.getActivities(100, 0);

          // Match activities with planned workouts and calculate compliance
          const matchedActivities = await matchActivitiesWithPlanned(
            garminActivities,
            plannedWorkouts || []
          );

          return NextResponse.json({
            success: true,
            syncedActivities: matchedActivities,
            totalSynced: matchedActivities.length,
            message: `Synced ${matchedActivities.length} activities with planned workouts`
          });

        } catch (error) {
          console.error('Failed to sync activities:', error);
          return NextResponse.json(
            {
              error: 'Failed to sync activities',
              code: 'SYNC_FAILED',
              details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
          );
        }

      case 'match':
        if (!activities || !plannedWorkouts) {
          return NextResponse.json(
            {
              error: 'Missing activities or plannedWorkouts data',
              code: 'MISSING_DATA',
              help: 'Provide both activities and plannedWorkouts arrays'
            },
            { status: 400 }
          );
        }

        try {
          const matchedActivities = await matchActivitiesWithPlanned(
            activities,
            plannedWorkouts
          );

          return NextResponse.json({
            success: true,
            matchedActivities,
            totalMatched: matchedActivities.length,
            message: 'Successfully matched activities with planned workouts'
          });

        } catch (error) {
          console.error('Failed to match activities:', error);
          return NextResponse.json(
            {
              error: 'Failed to match activities with planned workouts',
              code: 'MATCH_FAILED',
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
            validActions: ['sync', 'match']
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Garmin activities POST error:', error);
    return NextResponse.json(
      {
        error: 'Activity processing service error',
        code: 'SERVICE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to match Garmin activities with planned workouts
async function matchActivitiesWithPlanned(
  garminActivities: GarminActivity[],
  plannedWorkouts: any[]
): Promise<any[]> {
  const matchedActivities = [];

  for (const activity of garminActivities) {
    const activityDate = new Date(activity.startTimeGMT).toISOString().split('T')[0];

    // Find matching planned workout(s) for the same date
    const matchingPlanned = plannedWorkouts.filter(planned =>
      planned.date === activityDate
    );

    if (matchingPlanned.length > 0) {
      // Calculate compliance for each matching planned workout
      const bestMatch = findBestMatch(activity, matchingPlanned);

      if (bestMatch) {
        const compliance = calculateCompliance(activity, bestMatch);

        matchedActivities.push({
          garminActivity: activity,
          plannedWorkout: bestMatch,
          compliance,
          matchConfidence: calculateMatchConfidence(activity, bestMatch),
          syncedAt: new Date().toISOString()
        });
      }
    } else {
      // Activity without planned workout (unplanned training)
      matchedActivities.push({
        garminActivity: activity,
        plannedWorkout: null,
        compliance: null,
        matchConfidence: 0,
        syncedAt: new Date().toISOString(),
        isUnplanned: true
      });
    }
  }

  return matchedActivities;
}

// Helper function to find the best matching planned workout
function findBestMatch(activity: GarminActivity, plannedWorkouts: any[]): any | null {
  if (plannedWorkouts.length === 1) {
    return plannedWorkouts[0];
  }

  // Score each planned workout based on similarity to the actual activity
  let bestMatch = null;
  let bestScore = 0;

  for (const planned of plannedWorkouts) {
    let score = 0;

    // Type matching
    if (matchActivityType(activity.activityType.typeKey, planned.type)) {
      score += 40;
    }

    // Duration matching (within 30% tolerance)
    if (planned.duration && activity.duration) {
      const durationDiff = Math.abs(activity.duration - planned.duration * 60) / (planned.duration * 60);
      if (durationDiff <= 0.3) {
        score += 30 * (1 - durationDiff);
      }
    }

    // Distance matching (if available)
    if (planned.distance && activity.distance) {
      const distanceDiff = Math.abs(activity.distance - planned.distance) / planned.distance;
      if (distanceDiff <= 0.3) {
        score += 20 * (1 - distanceDiff);
      }
    }

    // Title/name similarity
    if (planned.title && activity.activityName) {
      const titleSimilarity = calculateStringSimilarity(
        planned.title.toLowerCase(),
        activity.activityName.toLowerCase()
      );
      score += 10 * titleSimilarity;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = planned;
    }
  }

  return bestScore > 20 ? bestMatch : null; // Minimum threshold for matching
}

// Helper function to calculate compliance between actual and planned workout
function calculateCompliance(activity: GarminActivity, planned: any): any {
  const compliance: any = {
    completed: true,
    durationMatch: 100,
    intensityMatch: 100,
    distanceMatch: 100,
    overallScore: 100,
    notes: []
  };

  // Duration compliance
  if (planned.duration && activity.duration) {
    const plannedDurationSecs = planned.duration * 60;
    const actualDurationSecs = activity.duration;
    compliance.durationMatch = Math.round(
      Math.max(0, 100 - (Math.abs(actualDurationSecs - plannedDurationSecs) / plannedDurationSecs) * 100)
    );

    if (compliance.durationMatch < 80) {
      compliance.notes.push(`Duration variance: planned ${planned.duration}min, actual ${Math.round(actualDurationSecs / 60)}min`);
    }
  }

  // Intensity compliance (based on heart rate if available)
  if (planned.intensity && activity.averageHR) {
    const intensityMap = { low: 130, medium: 150, high: 170 };
    const targetHR = intensityMap[planned.intensity as keyof typeof intensityMap];

    if (targetHR) {
      const hrDiff = Math.abs(activity.averageHR - targetHR) / targetHR;
      compliance.intensityMatch = Math.round(Math.max(0, 100 - hrDiff * 100));

      if (compliance.intensityMatch < 80) {
        compliance.notes.push(`Intensity variance: target ${planned.intensity}, avg HR ${activity.averageHR}bpm`);
      }
    }
  }

  // Distance compliance
  if (planned.distance && activity.distance) {
    const distanceDiff = Math.abs(activity.distance - planned.distance) / planned.distance;
    compliance.distanceMatch = Math.round(Math.max(0, 100 - distanceDiff * 100));

    if (compliance.distanceMatch < 80) {
      compliance.notes.push(`Distance variance: planned ${planned.distance}m, actual ${activity.distance}m`);
    }
  }

  // Calculate overall score
  const scores = [compliance.durationMatch, compliance.intensityMatch, compliance.distanceMatch];
  const validScores = scores.filter(score => score !== 100 || planned.duration || planned.intensity || planned.distance);
  compliance.overallScore = validScores.length > 0
    ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
    : 100;

  return compliance;
}

// Helper function to calculate match confidence
function calculateMatchConfidence(activity: GarminActivity, planned: any): number {
  let confidence = 0;

  // Type match
  if (matchActivityType(activity.activityType.typeKey, planned.type)) {
    confidence += 40;
  }

  // Time proximity (same date)
  confidence += 30;

  // Duration similarity
  if (planned.duration && activity.duration) {
    const durationDiff = Math.abs(activity.duration - planned.duration * 60) / (planned.duration * 60);
    confidence += 20 * Math.max(0, 1 - durationDiff);
  }

  // Title similarity
  if (planned.title && activity.activityName) {
    const titleSimilarity = calculateStringSimilarity(
      planned.title.toLowerCase(),
      activity.activityName.toLowerCase()
    );
    confidence += 10 * titleSimilarity;
  }

  return Math.round(Math.min(100, confidence));
}

// Helper function to match activity types
function matchActivityType(garminType: string, plannedType: string): boolean {
  const typeMapping: Record<string, string[]> = {
    'cardio': ['running', 'cycling', 'walking', 'hiking'],
    'strength': ['strength_training', 'fitness_equipment'],
    'technical': ['rock_climbing', 'mountaineering'],
    'expedition': ['mountaineering', 'hiking', 'backcountry_skiing']
  };

  const mappedTypes = typeMapping[plannedType] || [plannedType];
  return mappedTypes.includes(garminType);
}

// Helper function to calculate string similarity
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Helper function to calculate Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}