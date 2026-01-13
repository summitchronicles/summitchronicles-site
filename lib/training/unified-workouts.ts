/**
 * Unified Workouts - Combines Historical Excel + Garmin data
 * Provides a single interface for AI and dashboard to access all training data
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

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
  source: 'historical' | 'garmin';
  original_id: number;
}

/**
 * Get all workouts from both sources, unified format
 */
export async function getUnifiedWorkouts(options: {
  limit?: number;
  startDate?: string;
  endDate?: string;
  exerciseType?: string;
} = {}): Promise<UnifiedWorkout[]> {
  const { limit = 50, startDate, endDate, exerciseType } = options;

  // Fetch historical workouts
  let historicalQuery = getSupabase()
    .from('historical_workouts')
    .select('*')
    .order('date', { ascending: false });

  if (startDate) historicalQuery = historicalQuery.gte('date', startDate);
  if (endDate) historicalQuery = historicalQuery.lte('date', endDate);
  if (exerciseType) historicalQuery = historicalQuery.ilike('exercise_type', `%${exerciseType}%`);

  const { data: historical, error: histError } = await historicalQuery.limit(limit);

  if (histError) {
    console.error('Error fetching historical workouts:', histError);
  }

  // Fetch Garmin workouts
  let garminQuery = getSupabase()
    .from('garmin_workouts')
    .select('*')
    .order('date', { ascending: false });

  if (startDate) garminQuery = garminQuery.gte('date', startDate);
  if (endDate) garminQuery = garminQuery.lte('date', endDate);
  if (exerciseType) garminQuery = garminQuery.ilike('activity_type', `%${exerciseType}%`);

  const { data: garmin, error: garminError } = await garminQuery.limit(limit);

  if (garminError) {
    console.error('Error fetching Garmin workouts:', garminError);
  }

  // Normalize and combine
  const normalizedHistorical = (historical || []).map(normalizeHistorical);
  const normalizedGarmin = (garmin || []).map(normalizeGarmin);

  const combined = [...normalizedHistorical, ...normalizedGarmin];

  // Sort by date descending and limit
  combined.sort((a, b) => b.date.localeCompare(a.date));

  return combined.slice(0, limit);
}

/**
 * Normalize historical workout to unified format
 */
function normalizeHistorical(workout: any): UnifiedWorkout {
  return {
    id: `hist-${workout.id}`,
    date: workout.date,
    exercise_type: workout.exercise_type,
    duration_minutes: workout.actual_duration || workout.planned_duration || null,
    distance_km: workout.distance || null,
    elevation_gain_m: workout.elevation_gain || null,
    heart_rate_avg: workout.heart_rate_avg || null,
    heart_rate_max: null, // Not tracked in historical
    intensity: workout.intensity || null,
    calories: workout.calories_burned || null,
    notes: workout.notes || null,
    source: 'historical',
    original_id: workout.id
  };
}

/**
 * Normalize Garmin workout to unified format
 */
function normalizeGarmin(workout: any): UnifiedWorkout {
  // Convert Garmin duration from seconds to minutes
  const durationMinutes = workout.duration ? Math.round(workout.duration / 60) : null;

  // Convert distance from meters to km
  const distanceKm = workout.distance ? workout.distance / 1000 : null;

  // Estimate intensity from Training Stress Score (TSS)
  // TSS: 0-50 = easy (1-3), 50-100 = moderate (4-6), 100-150 = hard (7-8), 150+ = very hard (9-10)
  let estimatedIntensity = null;
  if (workout.training_stress_score) {
    const tss = workout.training_stress_score;
    if (tss < 50) estimatedIntensity = Math.ceil(tss / 17);
    else if (tss < 100) estimatedIntensity = 3 + Math.ceil((tss - 50) / 17);
    else if (tss < 150) estimatedIntensity = 6 + Math.ceil((tss - 100) / 25);
    else estimatedIntensity = Math.min(10, 8 + Math.ceil((tss - 150) / 50));
  }

  return {
    id: `garmin-${workout.id}`,
    date: workout.date,
    exercise_type: workout.activity_type,
    duration_minutes: durationMinutes,
    distance_km: distanceKm,
    elevation_gain_m: workout.elevation_gain || null,
    heart_rate_avg: workout.avg_heart_rate || null,
    heart_rate_max: workout.max_heart_rate || null,
    intensity: estimatedIntensity,
    calories: workout.calories || null,
    notes: workout.activity_name || null,
    source: 'garmin',
    original_id: workout.id
  };
}

/**
 * Get workout statistics from unified data
 */
export async function getWorkoutStats(options: {
  startDate?: string;
  endDate?: string;
} = {}): Promise<{
  total_workouts: number;
  total_duration_hours: number;
  total_distance_km: number;
  total_elevation_m: number;
  avg_heart_rate: number;
  avg_intensity: number;
  by_type: Record<string, number>;
  by_source: { historical: number; garmin: number };
}> {
  const workouts = await getUnifiedWorkouts({
    limit: 1000,
    startDate: options.startDate,
    endDate: options.endDate
  });

  const stats = {
    total_workouts: workouts.length,
    total_duration_hours: 0,
    total_distance_km: 0,
    total_elevation_m: 0,
    avg_heart_rate: 0,
    avg_intensity: 0,
    by_type: {} as Record<string, number>,
    by_source: { historical: 0, garmin: 0 }
  };

  let hrCount = 0;
  let intensityCount = 0;

  workouts.forEach(w => {
    if (w.duration_minutes) stats.total_duration_hours += w.duration_minutes / 60;
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
    stats.by_source[w.source]++;
  });

  if (hrCount > 0) stats.avg_heart_rate = Math.round(stats.avg_heart_rate / hrCount);
  if (intensityCount > 0) stats.avg_intensity = Math.round((stats.avg_intensity / intensityCount) * 10) / 10;

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
    .map(w => {
      const parts = [
        `${w.date}:`,
        w.exercise_type,
        w.duration_minutes ? `${w.duration_minutes}min` : '',
        w.distance_km ? `${w.distance_km.toFixed(1)}km` : '',
        w.intensity ? `RPE ${w.intensity}` : '',
        w.heart_rate_avg ? `HR ${w.heart_rate_avg}` : '',
        `[${w.source}]`
      ];
      return parts.filter(Boolean).join(' ');
    })
    .join('\n');

  return `Recent ${workouts.length} workouts:\n${summary}`;
}
