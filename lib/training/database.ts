import { createClient } from '@supabase/supabase-js';
import { ParsedTrainingPlan, ParsedStrengthDay, ParsedCardioDay, ParsedGuideline } from './excel-parser';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface TrainingPlan {
  id: string;
  title: string;
  week_number?: number;
  start_date?: string;
  end_date?: string;
  file_name?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface StrengthDay {
  id: string;
  plan_id: string;
  date: string;
  day_name: string;
  session_type: string;
  created_at: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  strength_day_id: string;
  sequence: number;
  name: string;
  planned_sets?: number;
  planned_reps: string;
  planned_rpe?: number;
  remarks?: string;
  completed: boolean;
  notes?: string;
  created_at: string;
  actual_sets?: ActualSet[];
}

export interface ActualSet {
  id: string;
  exercise_id: string;
  set_number: number;
  reps_completed?: number;
  weight_used?: number;
  actual_rpe?: number;
  notes?: string;
  logged_at: string;
}

export interface ManualTrainingData {
  id: string;
  date: string;
  activity_type: string;
  backpack_weight_kg?: number;
  total_volume_kg?: number;
  session_duration_minutes?: number;
  notes?: string;
  logged_at: string;
  strength_day_id?: string;
}

export class TrainingDatabase {
  
  // Save parsed Excel data to database
  static async saveTrainingPlan(
    parsedPlan: ParsedTrainingPlan, 
    fileName: string, 
    startDate?: string
  ): Promise<string> {
    try {
      // 1. Insert the training plan
      const { data: planData, error: planError } = await supabase
        .from('training_plans')
        .insert({
          title: parsedPlan.title,
          week_number: parsedPlan.weekNumber,
          start_date: startDate,
          end_date: startDate ? this.addDays(startDate, 6) : null,
          file_name: fileName
        })
        .select()
        .single();

      if (planError) throw planError;
      const planId = planData.id;

      // 2. Insert strength days and exercises
      for (const strengthDay of parsedPlan.strengthDays) {
        await this.saveStrengthDay(planId, strengthDay);
      }

      // 3. Insert cardio days
      for (const cardioDay of parsedPlan.cardioDays) {
        await this.saveCardioDay(planId, cardioDay);
      }

      // 4. Insert guidelines
      for (const guideline of parsedPlan.guidelines) {
        await this.saveGuideline(planId, guideline);
      }

      return planId;
    } catch (error) {
      console.error('Error saving training plan:', error);
      throw error;
    }
  }

  private static async saveStrengthDay(planId: string, strengthDay: ParsedStrengthDay) {
    const { data: dayData, error: dayError } = await supabase
      .from('strength_days')
      .insert({
        plan_id: planId,
        date: strengthDay.date,
        day_name: strengthDay.dayName,
        session_type: strengthDay.sessionType
      })
      .select()
      .single();

    if (dayError) throw dayError;

    // Insert exercises for this day
    for (const exercise of strengthDay.exercises) {
      await supabase
        .from('exercises')
        .insert({
          strength_day_id: dayData.id,
          sequence: exercise.sequence,
          name: exercise.name,
          planned_sets: exercise.plannedSets,
          planned_reps: exercise.plannedReps,
          planned_rpe: exercise.plannedRpe,
          remarks: exercise.remarks
        });
    }
  }

  private static async saveCardioDay(planId: string, cardioDay: ParsedCardioDay) {
    const { error } = await supabase
      .from('cardio_days')
      .insert({
        plan_id: planId,
        day_name: cardioDay.dayName,
        session_type: cardioDay.sessionType,
        planned_duration: cardioDay.plannedDuration,
        planned_distance: cardioDay.plannedDistance,
        pace_target: cardioDay.paceTarget,
        hr_target: cardioDay.hrTarget,
        cadence_cue: cardioDay.cadenceCue,
        warmup: cardioDay.warmup,
        main_set: cardioDay.mainSet,
        cooldown: cardioDay.cooldown,
        notes: cardioDay.notes
      });

    if (error) throw error;
  }

  private static async saveGuideline(planId: string, guideline: ParsedGuideline) {
    const { error } = await supabase
      .from('training_guidelines')
      .insert({
        plan_id: planId,
        topic: guideline.topic,
        guideline: guideline.guideline
      });

    if (error) throw error;
  }

  // Get all training plans
  static async getTrainingPlans(): Promise<TrainingPlan[]> {
    const { data, error } = await supabase
      .from('training_plans')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get training plan with all related data
  static async getTrainingPlanDetails(planId: string) {
    const [planResult, strengthResult, cardioResult, guidelinesResult] = await Promise.all([
      supabase.from('training_plans').select('*').eq('id', planId).single(),
      supabase.from('strength_days').select(`
        *,
        exercises (*)
      `).eq('plan_id', planId).order('date', { ascending: true }),
      supabase.from('cardio_days').select('*').eq('plan_id', planId),
      supabase.from('training_guidelines').select('*').eq('plan_id', planId)
    ]);

    if (planResult.error) throw planResult.error;
    if (strengthResult.error) throw strengthResult.error;
    if (cardioResult.error) throw cardioResult.error;
    if (guidelinesResult.error) throw guidelinesResult.error;

    return {
      plan: planResult.data,
      strengthDays: strengthResult.data,
      cardioDays: cardioResult.data,
      guidelines: guidelinesResult.data
    };
  }

  // Get today's workout
  static async getTodaysWorkout(date: string): Promise<StrengthDay | null> {
    const { data, error } = await supabase
      .from('strength_days')
      .select(`
        *,
        exercises (
          *,
          actual_sets (*)
        )
      `)
      .eq('date', date)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  }

  // Log actual set data during workout
  static async logActualSet(exerciseId: string, setData: Omit<ActualSet, 'id' | 'exercise_id' | 'logged_at'>) {
    const { data, error } = await supabase
      .from('actual_sets')
      .insert({
        exercise_id: exerciseId,
        set_number: setData.set_number,
        reps_completed: setData.reps_completed,
        weight_used: setData.weight_used,
        actual_rpe: setData.actual_rpe,
        notes: setData.notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update actual set
  static async updateActualSet(setId: string, setData: Partial<ActualSet>) {
    const { data, error } = await supabase
      .from('actual_sets')
      .update(setData)
      .eq('id', setId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mark exercise as completed
  static async markExerciseCompleted(exerciseId: string, notes?: string) {
    const { data, error } = await supabase
      .from('exercises')
      .update({ 
        completed: true,
        notes: notes 
      })
      .eq('id', exerciseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Save manual training data (hiking, climbing, etc.)
  static async saveManualTrainingData(data: {
    date: string;
    activity_type: string;
    duration_minutes?: number;
    distance_km?: number;
    elevation_gain_m?: number;
    backpack_weight_kg?: number;
    perceived_effort?: number;
    notes?: string | null;
    location?: string | null;
  }) {
    const { data: result, error } = await supabase
      .from('manual_training_data')
      .insert({
        date: data.date,
        activity_type: data.activity_type,
        duration_minutes: data.duration_minutes,
        distance_km: data.distance_km,
        elevation_gain_m: data.elevation_gain_m,
        backpack_weight_kg: data.backpack_weight_kg,
        perceived_effort: data.perceived_effort,
        notes: data.notes,
        location: data.location
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Get manual training data for a specific date
  static async getManualTrainingData(date: string) {
    const { data, error } = await supabase
      .from('manual_training_data')
      .select('*')
      .eq('date', date)
      .order('logged_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get training progress data for charts
  static async getTrainingProgress(startDate: string, endDate: string) {
    const [strengthProgress, manualData] = await Promise.all([
      // Strength training progress
      supabase
        .from('actual_sets')
        .select(`
          *,
          exercises!inner (
            name,
            strength_days!inner (
              date,
              day_name
            )
          )
        `)
        .gte('exercises.strength_days.date', startDate)
        .lte('exercises.strength_days.date', endDate)
        .order('exercises.strength_days.date', { ascending: true }),
      
      // Manual training data
      supabase
        .from('manual_training_data')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
    ]);

    if (strengthProgress.error) throw strengthProgress.error;
    if (manualData.error) throw manualData.error;

    return {
      strengthProgress: strengthProgress.data,
      manualData: manualData.data
    };
  }

  private static addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}

export default TrainingDatabase;