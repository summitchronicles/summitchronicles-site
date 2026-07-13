import {
  buildProcessedMissionLogs,
  calculateTrainingWorkoutStats,
  findLatestTrainingInsight,
  type TrainingDashboardResponse,
} from '@/modules/training/domain/training-dashboard';
import type { NormalizedTrainingActivity } from '@/modules/training/domain/training-metrics';
import {
  whoopClient,
  type WhoopSnapshot,
  type WhoopWorkout,
} from '@/modules/training/infrastructure/whoop-client';
import { getServerEnv } from '@/shared/env/server';

export async function enrichTrainingDashboardWithWhoop(
  response: TrainingDashboardResponse,
  now: Date = new Date()
): Promise<TrainingDashboardResponse> {
  const env = getServerEnv();
  if (
    !env.WHOOP_CLIENT_ID ||
    !env.WHOOP_CLIENT_SECRET ||
    !env.WHOOP_REDIRECT_URI ||
    !env.WHOOP_TOKEN_ENCRYPTION_KEY ||
    !env.DATABASE_URL
  ) {
    return response;
  }

  let connected = false;
  try {
    connected = (await whoopClient.getStatus()).connected;
    if (!connected) return response;

    const snapshot = await whoopClient.getSnapshot();
    if (!snapshot) return response;

    const whoopActivities = snapshot.workouts.map(mapWhoopWorkout);
    const recentActivities = mergeActivities(
      response.summary.metrics.recentActivities,
      whoopActivities
    );
    const missionLogs = buildProcessedMissionLogs(
      recentActivities,
      snapshot.fetchedAt
    );
    const recovery = snapshot.recovery?.score;
    const restingHeartRate = observedNumber(recovery?.resting_heart_rate);
    const hrvMs = observedNumber(recovery?.hrv_rmssd_milli);

    return {
      ...response,
      summary: {
        ...response.summary,
        integrations: response.summary.integrations.map((integration) =>
          integration.id === 'whoop'
            ? { ...integration, state: 'connected' as const }
            : integration
        ),
        metrics: {
          ...response.summary.metrics,
          currentStats: {
            ...response.summary.metrics.currentStats,
            currentRestingHR: restingHeartRate
              ? {
                  value: `${Math.round(restingHeartRate)} bpm`,
                  description: 'Latest WHOOP recovery observation',
                  trend: 'stable',
                }
              : response.summary.metrics.currentStats.currentRestingHR,
          },
          hrvStatus: hrvMs ? `${Math.round(hrvMs)} ms` : 'N/A',
          recentActivities,
          whoopRecovery: buildRecoveryMetrics(snapshot),
        },
        latestMissionLog: findLatestTrainingInsight(missionLogs, now),
        missionLogs,
        workoutStats: calculateTrainingWorkoutStats(recentActivities),
      },
    };
  } catch (error) {
    console.error('WHOOP training enrichment failed:', error);
    return {
      ...response,
      summary: {
        ...response.summary,
        integrations: response.summary.integrations.map((integration) =>
          integration.id === 'whoop' && connected
            ? { ...integration, state: 'unavailable' as const }
            : integration
        ),
      },
    };
  }
}

function buildRecoveryMetrics(snapshot: WhoopSnapshot) {
  return {
    recoveryScore: observedNumber(snapshot.recovery?.score?.recovery_score),
    hrvMs: observedNumber(snapshot.recovery?.score?.hrv_rmssd_milli),
    restingHeartRate: observedNumber(
      snapshot.recovery?.score?.resting_heart_rate
    ),
    sleepPerformance: observedNumber(
      snapshot.sleep?.score?.sleep_performance_percentage
    ),
    dayStrain: observedNumber(snapshot.cycle?.score?.strain),
    observedAt:
      snapshot.recovery?.updated_at ??
      snapshot.sleep?.updated_at ??
      snapshot.fetchedAt,
  };
}

function mapWhoopWorkout(workout: WhoopWorkout): NormalizedTrainingActivity {
  const start = new Date(workout.start);
  const end = new Date(workout.end);
  const duration =
    !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
      ? Math.max(0, (end.getTime() - start.getTime()) / 1000)
      : 0;

  return {
    activityId: `whoop:${workout.id}`,
    activityName: formatSportName(workout.sport_name),
    startTimeLocal: workout.start,
    duration,
    distance: observedNumber(workout.score?.distance_meter) ?? undefined,
    elevationGain:
      observedNumber(workout.score?.altitude_gain_meter) ?? undefined,
    averageHR: observedNumber(workout.score?.average_heart_rate) ?? undefined,
    activityType: {
      typeKey: workout.sport_name?.toLowerCase() || 'whoop_workout',
    },
    description: '',
    source: 'whoop',
  };
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
    .sort((left, right) => {
      return (
        new Date(right.startTimeLocal ?? 0).getTime() -
        new Date(left.startTimeLocal ?? 0).getTime()
      );
    })
    .slice(0, 100);
}

function formatSportName(value?: string) {
  if (!value) return 'WHOOP Workout';
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function observedNumber(value?: number | null) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : null;
}
