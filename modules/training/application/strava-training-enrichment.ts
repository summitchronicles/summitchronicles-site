import {
  buildProcessedMissionLogs,
  calculateTrainingWorkoutStats,
  findLatestTrainingInsight,
  type TrainingDashboardResponse,
} from '@/modules/training/domain/training-dashboard';
import type { NormalizedTrainingActivity } from '@/modules/training/domain/training-metrics';
import {
  stravaClient,
  type StravaActivity,
} from '@/modules/training/infrastructure/strava-client';
import { getServerEnv } from '@/shared/env/server';

export async function enrichTrainingDashboardWithStrava(
  response: TrainingDashboardResponse,
  now: Date = new Date()
): Promise<TrainingDashboardResponse> {
  const env = getServerEnv();
  if (
    !env.STRAVA_CLIENT_ID ||
    !env.STRAVA_CLIENT_SECRET ||
    !env.WHOOP_TOKEN_ENCRYPTION_KEY ||
    !env.DATABASE_URL
  ) {
    return response;
  }

  let connected = false;
  try {
    connected = (await stravaClient.getStatus()).connected;
    if (!connected) return response;

    const activities = await stravaClient.getActivities();
    if (!activities) return response;

    const recentActivities = mergeActivities(
      response.summary.metrics.recentActivities,
      activities.map(mapStravaActivity)
    );
    const observedAt = new Date().toISOString();
    const missionLogs = buildProcessedMissionLogs(recentActivities, observedAt);

    return {
      ...response,
      summary: {
        ...response.summary,
        integrations: response.summary.integrations.map((integration) =>
          integration.id === 'strava'
            ? { ...integration, state: 'connected' as const }
            : integration
        ),
        metrics: {
          ...response.summary.metrics,
          recentActivities,
        },
        latestMissionLog: findLatestTrainingInsight(missionLogs, now),
        missionLogs,
        workoutStats: calculateTrainingWorkoutStats(recentActivities),
      },
    };
  } catch (error) {
    console.error('Strava training enrichment failed:', error);
    return {
      ...response,
      summary: {
        ...response.summary,
        integrations: response.summary.integrations.map((integration) =>
          integration.id === 'strava' && connected
            ? { ...integration, state: 'unavailable' as const }
            : integration
        ),
      },
    };
  }
}

export function mapStravaActivity(
  activity: StravaActivity
): NormalizedTrainingActivity {
  return {
    activityId: `strava:${activity.id}`,
    activityName: activity.name,
    startTimeLocal: activity.start_date_local,
    duration: activity.moving_time || activity.elapsed_time,
    distance: activity.distance,
    elevationGain: activity.total_elevation_gain,
    averageHR: activity.average_heartrate,
    activityType: {
      typeKey: (
        activity.sport_type ||
        activity.type ||
        'strava_activity'
      ).toLowerCase(),
    },
    description: activity.description || '',
    source: 'strava',
  };
}

export function mergeStravaActivities(
  existing: NormalizedTrainingActivity[],
  incoming: NormalizedTrainingActivity[]
) {
  return mergeActivities(existing, incoming);
}

function mergeActivities(
  existing: NormalizedTrainingActivity[],
  incoming: NormalizedTrainingActivity[]
) {
  const merged = [...existing];

  incoming.forEach((activity) => {
    const activityTime = new Date(activity.startTimeLocal ?? '').getTime();
    const duplicate = merged.some((candidate) => {
      const candidateTime = new Date(candidate.startTimeLocal ?? '').getTime();
      return (
        Number.isFinite(activityTime) &&
        Number.isFinite(candidateTime) &&
        Math.abs(activityTime - candidateTime) <= 10 * 60 * 1000
      );
    });

    if (!duplicate) merged.push(activity);
  });

  return merged
    .sort(
      (left, right) =>
        new Date(right.startTimeLocal ?? 0).getTime() -
        new Date(left.startTimeLocal ?? 0).getTime()
    )
    .slice(0, 100);
}
