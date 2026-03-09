export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rpe: string;
  weight?: number;
  restTime?: number;
}

export interface TrainingActivity {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'expedition';
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  exercises?: Exercise[];
  location?: string;
  notes?: string;
  completed: boolean;
  date: string;
  actual?: {
    duration?: number;
    heartRate?: { avg: number; max: number };
    calories?: number;
    completedAt?: string;
    garminActivityId?: string;
  };
  garminWorkoutId?: string;
  status: 'planned' | 'synced' | 'completed' | 'skipped';
  compliance?: {
    durationMatch: number;
    intensityMatch: number;
    distanceMatch: number;
    overallScore: number;
    completed: boolean;
    notes: string[];
  };
}

export interface WeeklyPlan {
  weekStartDate: string;
  weekNumber: number;
  phase: string;
  goals: string[];
  activities: TrainingActivity[];
}
