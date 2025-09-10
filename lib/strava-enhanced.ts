// Enhanced Strava Integration for Training System
import { createClient } from '@supabase/supabase-js';
import { getStravaAccessToken, rateLimitedFetch } from './strava';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STRAVA_BASE = "https://www.strava.com/api/v3";

// Activity category mappings for training system
export const ACTIVITY_CATEGORIES = {
  // Cardio Training
  'Run': 'cardio',
  'TrailRun': 'cardio',
  'Hike': 'hiking',
  'Walk': 'recovery',
  'VirtualRun': 'cardio',
  
  // Strength & Cross Training
  'WeightTraining': 'strength',
  'Workout': 'strength',
  'CrossFit': 'strength',
  'Crosstraining': 'strength',
  
  // Climbing & Mountaineering
  'RockClimbing': 'climbing',
  'AlpineSki': 'mountaineering',
  'BackcountrySki': 'mountaineering',
  'Snowshoe': 'mountaineering',
  
  // Cycling (separate category)
  'Ride': 'cycling',
  'MountainBikeRide': 'cycling',
  'VirtualRide': 'cycling',
  
  // Recovery
  'Yoga': 'recovery',
  'Stretching': 'recovery',
  'Meditation': 'recovery'
} as const;

export type ActivityCategory = typeof ACTIVITY_CATEGORIES[keyof typeof ACTIVITY_CATEGORIES];

interface StravaActivity {
  id: number;
  name: string;
  sport_type?: string;
  type?: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date: string;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  workout_type?: number;
  description?: string;
  gear_id?: string;
}

interface EnhancedStravaActivity {
  id: number;
  name: string;
  sport_type: string;
  category: ActivityCategory;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date: string;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  workout_type?: number;
  description?: string;
  gear_id?: string;
  training_intensity?: 'easy' | 'moderate' | 'hard' | 'recovery';
  estimated_rpe?: number;
}

export class EnhancedStravaIntegration {
  
  /**
   * Fetch detailed activity information including streams for better analysis
   */
  static async fetchActivityDetails(activityId: number): Promise<any> {
    const token = await getStravaAccessToken();
    
    const [activity, streams] = await Promise.all([
      // Get activity details
      rateLimitedFetch(`${STRAVA_BASE}/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      
      // Get activity streams (heart rate, power, pace, etc.)
      rateLimitedFetch(`${STRAVA_BASE}/activities/${activityId}/streams?keys=heartrate,cadence,watts,grade_smooth&key_by_type=true`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : null)
    ]);

    return { activity, streams };
  }

  /**
   * Categorize activities and estimate training intensity
   */
  static categorizeActivity(activity: StravaActivity): EnhancedStravaActivity {
    const sportType = activity.sport_type || activity.type || 'Unknown';
    const category = ACTIVITY_CATEGORIES[sportType as keyof typeof ACTIVITY_CATEGORIES] || 'other';
    
    // Estimate training intensity based on various factors
    const intensity = this.estimateIntensity(activity);
    const estimatedRpe = this.estimateRPE(activity, intensity);

    return {
      id: activity.id,
      name: activity.name,
      sport_type: sportType,
      category,
      distance: activity.distance,
      moving_time: activity.moving_time,
      total_elevation_gain: activity.total_elevation_gain,
      start_date: activity.start_date,
      average_speed: activity.average_speed,
      max_speed: activity.max_speed,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      suffer_score: activity.suffer_score,
      workout_type: activity.workout_type,
      description: activity.description,
      gear_id: activity.gear_id,
      training_intensity: intensity,
      estimated_rpe: estimatedRpe
    };
  }

  /**
   * Estimate training intensity based on available metrics
   */
  private static estimateIntensity(activity: StravaActivity): 'easy' | 'moderate' | 'hard' | 'recovery' {
    // Use suffer score if available (Strava's own intensity metric)
    if (activity.suffer_score !== undefined) {
      if (activity.suffer_score < 30) return 'easy';
      if (activity.suffer_score < 60) return 'moderate';
      if (activity.suffer_score < 100) return 'hard';
      return 'hard';
    }

    // Use workout type for structured workouts
    if (activity.workout_type !== undefined) {
      // Strava workout types: 10 = default, 11 = race, 12 = long run, etc.
      if (activity.workout_type === 11) return 'hard'; // Race
      if (activity.workout_type === 12) return 'moderate'; // Long run
    }

    // Fallback to activity name analysis
    const name = activity.name.toLowerCase();
    if (name.includes('recovery') || name.includes('easy') || name.includes('walk')) {
      return 'recovery';
    }
    if (name.includes('tempo') || name.includes('threshold') || name.includes('race')) {
      return 'hard';
    }
    if (name.includes('long') || name.includes('endurance')) {
      return 'moderate';
    }

    return 'moderate'; // Default
  }

  /**
   * Estimate RPE based on intensity and activity type
   */
  private static estimateRPE(activity: StravaActivity, intensity: string): number {
    const baseRPE = {
      'recovery': 3,
      'easy': 5,
      'moderate': 7,
      'hard': 9
    }[intensity] || 6;

    // Adjust based on activity type
    const sportType = activity.sport_type || activity.type || '';
    let adjustment = 0;

    if (sportType.includes('Climb') || sportType === 'Hike') {
      adjustment += 1; // Climbing/hiking tends to feel harder
    }
    if (activity.total_elevation_gain > 500) {
      adjustment += 0.5; // Significant elevation gain
    }
    if (activity.moving_time > 7200) { // > 2 hours
      adjustment += 0.5; // Long duration
    }

    return Math.min(10, Math.max(1, Math.round(baseRPE + adjustment)));
  }

  /**
   * Sync Strava activities with enhanced categorization
   */
  static async syncEnhancedActivities(limit = 50): Promise<EnhancedStravaActivity[]> {
    const token = await getStravaAccessToken();
    
    // Get recent activities
    const url = new URL(`${STRAVA_BASE}/athlete/activities`);
    url.searchParams.set("per_page", String(limit));
    
    const response = await rateLimitedFetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    const activities: StravaActivity[] = await response.json();
    
    // Enhance each activity
    const enhancedActivities = activities.map(activity => 
      this.categorizeActivity(activity)
    );

    // Store enhanced activities in database
    await this.storeEnhancedActivities(enhancedActivities);

    return enhancedActivities;
  }

  /**
   * Store enhanced activities with categorization
   */
  private static async storeEnhancedActivities(activities: EnhancedStravaActivity[]): Promise<void> {
    if (activities.length === 0) return;

    // Upsert to enhanced activities table
    const { error } = await supabase
      .from('strava_activities_enhanced')
      .upsert(activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        sport_type: activity.sport_type,
        category: activity.category,
        distance: activity.distance,
        moving_time: activity.moving_time,
        total_elevation_gain: activity.total_elevation_gain,
        start_date: activity.start_date,
        average_speed: activity.average_speed,
        max_speed: activity.max_speed,
        average_heartrate: activity.average_heartrate,
        max_heartrate: activity.max_heartrate,
        suffer_score: activity.suffer_score,
        workout_type: activity.workout_type,
        description: activity.description,
        gear_id: activity.gear_id,
        training_intensity: activity.training_intensity,
        estimated_rpe: activity.estimated_rpe,
        synced_at: new Date().toISOString()
      })), { onConflict: 'id' });

    if (error) {
      console.error('Error storing enhanced activities:', error);
      throw error;
    }
  }

  /**
   * Get training insights by comparing Strava and manual data
   */
  static async getTrainingInsights(startDate: string, endDate: string): Promise<{
    stravaActivities: EnhancedStravaActivity[];
    manualActivities: any[];
    insights: {
      totalActivities: number;
      categoryBreakdown: Record<string, number>;
      avgIntensity: number;
      volumeComparison: {
        strava: number;
        manual: number;
        combined: number;
      };
    };
  }> {
    // Get enhanced Strava activities
    const { data: stravaData, error: stravaError } = await supabase
      .from('strava_activities_enhanced')
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate)
      .order('start_date', { ascending: false });

    if (stravaError) throw stravaError;

    // Get manual activities
    const { data: manualData, error: manualError } = await supabase
      .from('manual_training_data')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (manualError) throw manualError;

    const stravaActivities = stravaData || [];
    const manualActivities = manualData || [];

    // Calculate insights
    const categoryBreakdown: Record<string, number> = {};
    let totalRPE = 0;
    let rpeCount = 0;

    // Process Strava activities
    stravaActivities.forEach(activity => {
      categoryBreakdown[activity.category] = (categoryBreakdown[activity.category] || 0) + 1;
      if (activity.estimated_rpe) {
        totalRPE += activity.estimated_rpe;
        rpeCount++;
      }
    });

    // Process manual activities
    manualActivities.forEach(activity => {
      categoryBreakdown[activity.activity_type] = (categoryBreakdown[activity.activity_type] || 0) + 1;
      if (activity.perceived_effort) {
        totalRPE += activity.perceived_effort;
        rpeCount++;
      }
    });

    const avgIntensity = rpeCount > 0 ? totalRPE / rpeCount : 0;

    // Volume comparison (total time in minutes)
    const stravaVolume = stravaActivities.reduce((sum, act) => sum + (act.moving_time / 60), 0);
    const manualVolume = manualActivities.reduce((sum, act) => sum + (act.duration_minutes || 0), 0);

    return {
      stravaActivities,
      manualActivities,
      insights: {
        totalActivities: stravaActivities.length + manualActivities.length,
        categoryBreakdown,
        avgIntensity: Math.round(avgIntensity * 10) / 10,
        volumeComparison: {
          strava: Math.round(stravaVolume),
          manual: Math.round(manualVolume),
          combined: Math.round(stravaVolume + manualVolume)
        }
      }
    };
  }

  /**
   * Detect potential duplicate activities between Strava and manual entries
   */
  static async detectDuplicateActivities(date: string): Promise<{
    potentialDuplicates: Array<{
      strava: EnhancedStravaActivity;
      manual: any;
      confidence: number;
    }>;
  }> {
    const startOfDay = new Date(date).toISOString().split('T')[0] + 'T00:00:00Z';
    const endOfDay = new Date(date).toISOString().split('T')[0] + 'T23:59:59Z';

    const [stravaData, manualData] = await Promise.all([
      supabase
        .from('strava_activities_enhanced')
        .select('*')
        .gte('start_date', startOfDay)
        .lte('start_date', endOfDay),
      supabase
        .from('manual_training_data')
        .select('*')
        .eq('date', date)
    ]);

    const stravaActivities = stravaData.data || [];
    const manualActivities = manualData.data || [];

    const potentialDuplicates = [];

    for (const strava of stravaActivities) {
      for (const manual of manualActivities) {
        const confidence = this.calculateDuplicateConfidence(strava, manual);
        if (confidence > 0.7) { // 70% confidence threshold
          potentialDuplicates.push({
            strava,
            manual,
            confidence: Math.round(confidence * 100) / 100
          });
        }
      }
    }

    return { potentialDuplicates };
  }

  /**
   * Calculate confidence that two activities are duplicates
   */
  private static calculateDuplicateConfidence(strava: EnhancedStravaActivity, manual: any): number {
    let confidence = 0;
    let factors = 0;

    // Activity type matching
    if (strava.category === manual.activity_type) {
      confidence += 0.3;
    }
    factors++;

    // Duration matching (within 10% difference)
    if (manual.duration_minutes) {
      const stravaMinutes = strava.moving_time / 60;
      const difference = Math.abs(stravaMinutes - manual.duration_minutes);
      const relativeDiff = difference / Math.max(stravaMinutes, manual.duration_minutes);
      if (relativeDiff < 0.1) {
        confidence += 0.3;
      }
    }
    factors++;

    // Distance matching (if both have distance)
    if (strava.distance > 0 && manual.distance_km) {
      const stravaKm = strava.distance / 1000;
      const difference = Math.abs(stravaKm - manual.distance_km);
      const relativeDiff = difference / Math.max(stravaKm, manual.distance_km);
      if (relativeDiff < 0.1) {
        confidence += 0.2;
      }
    }
    factors++;

    // Elevation matching
    if (strava.total_elevation_gain > 0 && manual.elevation_gain_m) {
      const difference = Math.abs(strava.total_elevation_gain - manual.elevation_gain_m);
      const relativeDiff = difference / Math.max(strava.total_elevation_gain, manual.elevation_gain_m);
      if (relativeDiff < 0.2) {
        confidence += 0.2;
      }
    }
    factors++;

    return confidence;
  }
}