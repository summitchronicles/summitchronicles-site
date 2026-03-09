import { IntervalsService } from '@/lib/services/intervals';
import { IntervalsActivity } from '@/types/intervals';
import type { TrainingWorkoutStats } from '@/modules/training/domain/training-dashboard';

export interface UnifiedWorkout {
  id: string;
  date: string;
  exercise_type: string;
  duration_minutes: number | null;
  distance_km: number | null;
  elevation_gain_m: number | null;
  heart_rate_avg: number | null;
  heart_rate_max: number | null;
  intensity: number | null;
  calories: number | null;
  notes: string | null;
  source: 'intervals' | 'historical';
  original_id: string;
}

export async function getUnifiedWorkouts(
  options: {
    limit?: number;
    startDate?: string;
    endDate?: string;
    exerciseType?: string;
  } = {}
): Promise<UnifiedWorkout[]> {
  const { limit = 50, startDate, endDate, exerciseType } = options;
  const activities = await IntervalsService.getActivities(200);

  let unified = activities.map(normalizeIntervalsActivity);

  if (startDate) {
    unified = unified.filter((workout) => workout.date >= startDate);
  }

  if (endDate) {
    unified = unified.filter((workout) => workout.date <= endDate);
  }

  if (exerciseType) {
    const exerciseTypeLower = exerciseType.toLowerCase();
    unified = unified.filter((workout) =>
      workout.exercise_type.toLowerCase().includes(exerciseTypeLower)
    );
  }

  unified.sort((left, right) => right.date.localeCompare(left.date));
  return unified.slice(0, limit);
}

export async function getWorkoutStats(
  options: {
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<TrainingWorkoutStats> {
  const workouts = await getUnifiedWorkouts({
    limit: 1000,
    startDate: options.startDate,
    endDate: options.endDate,
  });

  const stats: TrainingWorkoutStats = {
    total_workouts: workouts.length,
    total_duration_hours: 0,
    total_distance_km: 0,
    total_elevation_m: 0,
    avg_heart_rate: 0,
    avg_intensity: 0,
    by_type: {},
    by_source: { historical: 0, garmin: 0, intervals: 0 },
  };

  let heartRateCount = 0;
  let intensityCount = 0;

  workouts.forEach((workout) => {
    if (workout.duration_minutes) {
      stats.total_duration_hours += workout.duration_minutes / 60;
    }
    if (workout.distance_km) {
      stats.total_distance_km += workout.distance_km;
    }
    if (workout.elevation_gain_m) {
      stats.total_elevation_m += workout.elevation_gain_m;
    }
    if (workout.heart_rate_avg) {
      stats.avg_heart_rate += workout.heart_rate_avg;
      heartRateCount += 1;
    }
    if (workout.intensity) {
      stats.avg_intensity += workout.intensity;
      intensityCount += 1;
    }

    stats.by_type[workout.exercise_type] =
      (stats.by_type[workout.exercise_type] || 0) + 1;
    stats.by_source[workout.source === 'historical' ? 'historical' : 'intervals'] += 1;
  });

  if (heartRateCount > 0) {
    stats.avg_heart_rate = Math.round(stats.avg_heart_rate / heartRateCount);
  }
  if (intensityCount > 0) {
    stats.avg_intensity =
      Math.round((stats.avg_intensity / intensityCount) * 10) / 10;
  }

  return stats;
}

export async function getRecentWorkoutsForAI(limit = 20): Promise<string> {
  const workouts = await getUnifiedWorkouts({ limit });

  if (workouts.length === 0) {
    return 'No recent workout data available.';
  }

  const summary = workouts
    .map((workout) => {
      const parts = [
        `${workout.date}:`,
        workout.exercise_type,
        workout.duration_minutes ? `${workout.duration_minutes}min` : '',
        workout.distance_km ? `${workout.distance_km.toFixed(1)}km` : '',
        workout.intensity ? `Intens=${workout.intensity}` : '',
        workout.heart_rate_avg ? `HR ${workout.heart_rate_avg}` : '',
        `[${workout.source}]`,
      ];

      return parts.filter(Boolean).join(' ');
    })
    .join('\n');

  return `Recent ${workouts.length} workouts:\n${summary}`;
}

function normalizeIntervalsActivity(activity: IntervalsActivity): UnifiedWorkout {
  return {
    id: `icu-${activity.id}`,
    date: activity.start_date_local
      ? activity.start_date_local.split('T')[0]
      : '',
    exercise_type: activity.type || 'Activity',
    duration_minutes: activity.moving_time
      ? Math.round(activity.moving_time / 60)
      : 0,
    distance_km: activity.distance ? activity.distance / 1000 : 0,
    elevation_gain_m: activity.total_elevation_gain || 0,
    heart_rate_avg: activity.average_heartrate || null,
    heart_rate_max: null,
    intensity: activity.icu_intensity || null,
    calories: null,
    notes: activity.name,
    source: 'intervals',
    original_id: activity.id,
  };
}

