import type {
  NormalizedTrainingActivity,
  TrainingMetricsPayload,
} from '@/modules/training/domain/training-metrics';

export interface TrainingInsight {
  weekStart: string;
  weekSummary: string;
  focus: string;
  tip?: string;
  updatedAt: string;
  activityCount: number;
  totalDurationSeconds: number;
  totalDistanceKm: number;
  totalElevationGain: number;
  dominantActivityType: string;
  source: 'intervals.icu';
}

export interface TrainingWorkoutStats {
  total_workouts: number;
  total_duration_hours: number;
  total_distance_km: number;
  total_elevation_m: number;
  avg_heart_rate: number;
  avg_intensity: number;
  by_type: Record<string, number>;
  by_source: { historical: number; garmin: number; intervals: number };
}

export interface TrainingDashboardSummary {
  telemetry: {
    isLive: boolean;
    state: 'live' | 'cached' | 'degraded';
    source: 'intervals.icu' | 'fallback';
    lastUpdated: string;
    errors: string[];
  };
  metrics: TrainingMetricsPayload;
  latestMissionLog: TrainingInsight | null;
  missionLogs: TrainingInsight[];
  workoutStats: TrainingWorkoutStats | null;
}

export interface TrainingDashboardResponse {
  success: boolean;
  degraded: boolean;
  errors: string[];
  lastUpdated: string;
  summary: TrainingDashboardSummary;
}

const DEFAULT_MISSION_LOG_TIP =
  'Protect recovery between quality sessions and let the weekly load accumulate deliberately.';

function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getMondayWeekStart(date: Date): string {
  const copy = new Date(date);
  const day = copy.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + offset);
  return toIsoDate(copy);
}

export function getObservedTrainingWeekKeys(
  recentActivities: TrainingMetricsPayload['recentActivities']
): string[] {
  const weekKeys = new Set<string>();

  recentActivities.forEach((activity) => {
    if (!activity.startTimeLocal) {
      return;
    }

    const parsedDate = new Date(activity.startTimeLocal);
    if (Number.isNaN(parsedDate.getTime())) {
      return;
    }

    weekKeys.add(getMondayWeekStart(parsedDate));
  });

  return [...weekKeys].sort((left, right) => right.localeCompare(left));
}

export function filterInsightsToObservedWeeks(
  insights: TrainingInsight[],
  recentActivities: TrainingMetricsPayload['recentActivities']
): TrainingInsight[] {
  const observedWeekKeys = new Set(getObservedTrainingWeekKeys(recentActivities));

  if (observedWeekKeys.size === 0) {
    return [];
  }

  return insights.filter((insight) => observedWeekKeys.has(insight.weekStart));
}

export function findLatestTrainingInsight(
  insights: TrainingInsight[],
  now: Date = new Date()
): TrainingInsight | null {
  if (insights.length === 0) {
    return null;
  }

  const targetWeekStart = getMondayWeekStart(now);
  const exactMatch = insights.find((insight) => insight.weekStart === targetWeekStart);

  if (exactMatch) {
    return exactMatch;
  }

  return [...insights].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt)
  )[0];
}

export function buildProcessedMissionLogs(
  activities: NormalizedTrainingActivity[],
  updatedAt: string
): TrainingInsight[] {
  const grouped = activities.reduce(
    (acc, activity) => {
      if (!activity.startTimeLocal) {
        return acc;
      }

      const parsedDate = new Date(activity.startTimeLocal);
      if (Number.isNaN(parsedDate.getTime())) {
        return acc;
      }

      const weekStart = getMondayWeekStart(parsedDate);
      if (!acc[weekStart]) {
        acc[weekStart] = [];
      }

      acc[weekStart].push(activity);
      return acc;
    },
    {} as Record<string, NormalizedTrainingActivity[]>
  );

  return Object.entries(grouped)
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([weekStart, weekActivities]) => {
      const activityCount = weekActivities.length;
      const totalDurationSeconds = sumBy(weekActivities, 'duration');
      const totalDistanceKm = sumBy(weekActivities, 'distance') / 1000;
      const totalElevationGain = sumBy(weekActivities, 'elevationGain');
      const dominantActivityType = getDominantActivityType(weekActivities);
      const distinctActivityTypes = getDistinctActivityTypeCount(weekActivities);
      const durationHours = totalDurationSeconds / 3600;

      const summarySegments = [
        `${activityCount} session${activityCount === 1 ? '' : 's'} logged`,
        `${durationHours.toFixed(1)} hrs total`,
      ];

      if (totalDistanceKm > 0.1) {
        summarySegments.push(`${totalDistanceKm.toFixed(1)} km covered`);
      }

      if (totalElevationGain > 0) {
        summarySegments.push(`${Math.round(totalElevationGain)} m gain`);
      }

      const focus = buildMissionLogFocus(dominantActivityType, activityCount);
      const weekSummary = `${summarySegments.join(' • ')}. Primary load came from ${dominantActivityType.toLowerCase()} work across ${distinctActivityTypes} training ${distinctActivityTypes === 1 ? 'mode' : 'modes'}.`;

      return {
        weekStart,
        weekSummary,
        focus,
        tip: buildMissionLogTip(dominantActivityType),
        updatedAt,
        activityCount,
        totalDurationSeconds,
        totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
        totalElevationGain: Math.round(totalElevationGain),
        dominantActivityType,
        source: 'intervals.icu',
      };
    });
}

export function calculateTrainingWorkoutStats(
  activities: NormalizedTrainingActivity[]
): TrainingWorkoutStats {
  const stats: TrainingWorkoutStats = {
    total_workouts: activities.length,
    total_duration_hours: 0,
    total_distance_km: 0,
    total_elevation_m: 0,
    avg_heart_rate: 0,
    avg_intensity: 0,
    by_type: {},
    by_source: { historical: 0, garmin: 0, intervals: activities.length },
  };

  let heartRateCount = 0;

  activities.forEach((activity) => {
    const typeKey = activity.activityType?.typeKey || 'unknown';

    stats.total_duration_hours += (activity.duration || 0) / 3600;
    stats.total_distance_km += (activity.distance || 0) / 1000;
    stats.total_elevation_m += activity.elevationGain || 0;
    stats.by_type[typeKey] = (stats.by_type[typeKey] || 0) + 1;

    if (typeof activity.averageHR === 'number' && activity.averageHR > 0) {
      stats.avg_heart_rate += activity.averageHR;
      heartRateCount += 1;
    }
  });

  stats.total_duration_hours =
    Math.round(stats.total_duration_hours * 10) / 10;
  stats.total_distance_km = Math.round(stats.total_distance_km * 10) / 10;
  stats.total_elevation_m = Math.round(stats.total_elevation_m);

  if (heartRateCount > 0) {
    stats.avg_heart_rate = Math.round(stats.avg_heart_rate / heartRateCount);
  }

  return stats;
}

function sumBy(
  activities: NormalizedTrainingActivity[],
  key: 'duration' | 'distance' | 'elevationGain'
): number {
  return activities.reduce((total, activity) => total + (activity[key] || 0), 0);
}

function getDistinctActivityTypeCount(
  activities: NormalizedTrainingActivity[]
): number {
  return new Set(
    activities.map((activity) => getActivityTypeLabel(activity.activityType?.typeKey))
  ).size;
}

function getDominantActivityType(
  activities: NormalizedTrainingActivity[]
): string {
  const counts = activities.reduce(
    (acc, activity) => {
      const label = getActivityTypeLabel(activity.activityType?.typeKey);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const dominantEntry =
    Object.entries(counts).sort((left, right) => right[1] - left[1])[0] ??
    ['Training', 0];

  return dominantEntry[0];
}

function getActivityTypeLabel(typeKey?: string): string {
  if (!typeKey) {
    return 'Training';
  }

  return typeKey
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildMissionLogFocus(
  dominantActivityType: string,
  activityCount: number
): string {
  if (activityCount <= 1) {
    return `${dominantActivityType} session`;
  }

  return `${dominantActivityType} emphasis`;
}

function buildMissionLogTip(dominantActivityType: string): string {
  const normalizedType = dominantActivityType.toLowerCase();

  if (
    normalizedType.includes('run') ||
    normalizedType.includes('trail') ||
    normalizedType.includes('stairs') ||
    normalizedType.includes('hike')
  ) {
    return 'Keep aerobic work controlled and watch lower-body fatigue before adding more climbing load.';
  }

  if (
    normalizedType.includes('ride') ||
    normalizedType.includes('cycle') ||
    normalizedType.includes('bike')
  ) {
    return 'Let cadence and breathing drive the work instead of forcing intensity too early in the week.';
  }

  if (normalizedType.includes('strength')) {
    return 'Hold technique quality first and let soreness settle before stacking another heavy strength day.';
  }

  return DEFAULT_MISSION_LOG_TIP;
}
