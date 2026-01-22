/**
 * Unified Workouts - Sourced from Intervals.icu (Serverless)
 * Replaces legacy Supabase/Python backend.
 */

import { IntervalsService } from '../services/intervals';
import { IntervalsActivity } from '@/types/intervals';

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

/**
 * Get all workouts from Intervals.icu, unified format
 */
export async function getUnifiedWorkouts(
  options: {
    limit?: number;
    startDate?: string;
    endDate?: string;
    exerciseType?: string;
  } = {}
): Promise<UnifiedWorkout[]> {
  const { limit = 50, startDate, endDate, exerciseType } = options;

  // Fetch from Intervals Service
  // We ask for a broad rang initially (IntervalsService default is 6 months)
  // If we need more, we might need to extend IntervalsService.
  const activities = await IntervalsService.getActivities(200); // Fetch up to 200 recent

  // Normalize
  let unified = activities.map(normalizeIntervalsActivity);

  // Filter
  if (startDate) {
    unified = unified.filter((w) => w.date >= startDate);
  }
  if (endDate) {
    unified = unified.filter((w) => w.date <= endDate);
  }
  if (exerciseType) {
    const typeLower = exerciseType.toLowerCase();
    unified = unified.filter((w) =>
      w.exercise_type.toLowerCase().includes(typeLower)
    );
  }

  // Sort Descending
  unified.sort((a, b) => b.date.localeCompare(a.date));

  return unified.slice(0, limit);
}

/**
 * Normalize Intervals activity to unified format
 */
function normalizeIntervalsActivity(
  activity: IntervalsActivity
): UnifiedWorkout {
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
    heart_rate_max: null, // Intervals API often has it, but type def needs update if we want it
    intensity: activity.icu_intensity || null, // ~1-100 scale? Or 0-1? usage varies
    calories: null, // Need to add to type if needed
    notes: activity.name, // Use name as notes/title
    source: 'intervals',
    original_id: activity.id,
  };
}

/**
 * Get workout statistics from unified data
 * (Calculated client-side from the fetched batch)
 */
export async function getWorkoutStats(
  options: {
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<{
  total_workouts: number;
  total_duration_hours: number;
  total_distance_km: number;
  total_elevation_m: number;
  avg_heart_rate: number;
  avg_intensity: number;
  by_type: Record<string, number>;
  by_source: { historical: number; garmin: number; intervals: number };
}> {
  // Fetch a larger set for stats
  const workouts = await getUnifiedWorkouts({
    limit: 1000,
    startDate: options.startDate,
    endDate: options.endDate,
  });

  const stats = {
    total_workouts: workouts.length,
    total_duration_hours: 0,
    total_distance_km: 0,
    total_elevation_m: 0,
    avg_heart_rate: 0,
    avg_intensity: 0,
    by_type: {} as Record<string, number>,
    by_source: { historical: 0, garmin: 0, intervals: 0 },
  };

  let hrCount = 0;
  let intensityCount = 0;

  workouts.forEach((w) => {
    if (w.duration_minutes)
      stats.total_duration_hours += w.duration_minutes / 60;
    if (w.distance_km) stats.total_distance_km += w.distance_km;
    if (w.elevation_gain_m) stats.total_elevation_m += w.elevation_gain_m;

    if (w.heart_rate_avg) {
      stats.avg_heart_rate += w.heart_rate_avg;
      hrCount++;
    }

    if (w.intensity) {
      stats.avg_intensity += w.intensity;
      intensityCount++;
    }

    stats.by_type[w.exercise_type] = (stats.by_type[w.exercise_type] || 0) + 1;
    // @ts-ignore
    if (stats.by_source[w.source] !== undefined) stats.by_source[w.source]++;
  });

  if (hrCount > 0)
    stats.avg_heart_rate = Math.round(stats.avg_heart_rate / hrCount);
  if (intensityCount > 0)
    stats.avg_intensity =
      Math.round((stats.avg_intensity / intensityCount) * 10) / 10;

  return stats;
}

/**
 * Get recent workouts for AI context
 */
export async function getRecentWorkoutsForAI(limit = 20): Promise<string> {
  const workouts = await getUnifiedWorkouts({ limit });

  if (workouts.length === 0) {
    return 'No recent workout data available.';
  }

  const summary = workouts
    .map((w) => {
      const parts = [
        `${w.date}:`,
        w.exercise_type,
        w.duration_minutes ? `${w.duration_minutes}min` : '',
        w.distance_km ? `${w.distance_km.toFixed(1)}km` : '',
        w.intensity ? `Intens=${w.intensity}` : '',
        w.heart_rate_avg ? `HR ${w.heart_rate_avg}` : '',
        `[${w.source}]`,
      ];
      return parts.filter(Boolean).join(' ');
    })
    .join('\n');

  return `Recent ${workouts.length} workouts:\n${summary}`;
}
