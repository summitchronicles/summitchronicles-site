// Multi-User Training System Types
// Phase 4: Advanced trainer-client management

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'trainer' | 'athlete' | 'enthusiast';
  
  // Profile information
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  weight_kg?: number;
  height_cm?: number;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Seven Summits specific
  summits_completed: number;
  primary_goals: string[];
  target_summit?: string;
  target_date?: string;
  
  // Contact and preferences
  phone?: string;
  timezone: string;
  units_preference: 'metric' | 'imperial';
  
  // Subscription
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  subscription_expires_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface TrainerClientRelationship {
  id: string;
  trainer_id: string;
  client_id: string;
  
  status: 'pending' | 'active' | 'paused' | 'terminated';
  start_date: string;
  end_date?: string;
  
  access_level: 'view' | 'edit' | 'full';
  can_create_plans: boolean;
  can_modify_plans: boolean;
  can_view_progress: boolean;
  can_send_messages: boolean;
  
  monthly_fee?: number;
  currency: string;
  billing_status: 'active' | 'overdue' | 'cancelled';
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  trainer_profile?: UserProfile;
  client_profile?: UserProfile;
}

export interface TrainingProgram {
  id: string;
  created_by: string;
  
  name: string;
  description?: string;
  program_type: 'template' | 'personalized' | 'group';
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  target_summit?: string;
  duration_weeks: number;
  focus_areas: string[];
  
  phases: ProgramPhase[];
  weekly_structure: WeeklyStructure;
  
  is_public: boolean;
  is_template: boolean;
  price?: number;
  currency: string;
  
  tags: string[];
  estimated_hours_per_week?: number;
  equipment_required: string[];
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  creator_profile?: UserProfile;
  active_assignments?: ClientProgramAssignment[];
}

export interface ProgramPhase {
  phase_name: string;
  phase_number: number;
  duration_weeks: number;
  focus: string;
  description: string;
  intensity_range: [number, number]; // RPE range
  volume_multiplier: number; // Relative to base volume
  key_adaptations: string[];
}

export interface WeeklyStructure {
  strength_sessions_per_week: number;
  cardio_sessions_per_week: number;
  recovery_days_per_week: number;
  preferred_schedule: {
    [key: string]: string[]; // day: ['strength', 'cardio', 'recovery']
  };
  session_duration_minutes: {
    strength: number;
    cardio: number;
    recovery: number;
  };
}

export interface ClientProgramAssignment {
  id: string;
  client_id: string;
  program_id: string;
  assigned_by: string;
  
  status: 'assigned' | 'active' | 'completed' | 'paused' | 'cancelled';
  start_date: string;
  target_end_date: string;
  actual_end_date?: string;
  current_week: number;
  current_phase?: string;
  
  custom_modifications?: any;
  client_notes?: string;
  trainer_notes?: string;
  
  completion_percentage: number;
  adherence_score?: number;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  client_profile?: UserProfile;
  program?: TrainingProgram;
  assigner_profile?: UserProfile;
}

export interface PerformanceBenchmark {
  id: string;
  user_id: string;
  
  benchmark_type: string;
  test_name: string;
  test_date: string;
  
  primary_value: number;
  secondary_value?: number;
  units: string;
  
  conditions?: any;
  notes?: string;
  
  summit_relevance: string[];
  predicted_performance?: any;
  
  created_at: string;
  
  // Joined data
  user_profile?: UserProfile;
}

export interface PeriodizationPlan {
  id: string;
  user_id: string;
  created_by?: string;
  
  plan_name: string;
  target_summit?: string;
  target_date: string;
  total_duration_weeks: number;
  
  base_phase_weeks: number;
  build_phase_weeks: number;
  peak_phase_weeks: number;
  taper_phase_weeks: number;
  recovery_phase_weeks: number;
  
  phases: PeriodizationPhase[];
  
  base_volume_hours: number;
  peak_volume_hours: number;
  load_progression_model: 'linear' | 'undulating' | 'block' | 'conjugate';
  
  ai_optimized: boolean;
  optimization_algorithm?: string;
  predicted_performance?: any;
  
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  user_profile?: UserProfile;
  creator_profile?: UserProfile;
}

export interface PeriodizationPhase {
  name: string;
  week_start: number;
  week_end: number;
  primary_focus: string;
  volume_percentage: number; // Percentage of peak volume
  intensity_focus: string;
  key_workouts: string[];
  adaptations_targeted: string[];
}

export interface TrainerClientMessage {
  id: string;
  relationship_id: string;
  sender_id: string;
  
  message_type: 'text' | 'voice' | 'video' | 'file' | 'workout_feedback';
  subject?: string;
  content: string;
  
  attachments?: any;
  
  is_read: boolean;
  read_at?: string;
  is_urgent: boolean;
  
  related_workout_id?: string;
  related_program_id?: string;
  
  created_at: string;
  
  // Joined data
  sender_profile?: UserProfile;
  relationship?: TrainerClientRelationship;
}

// Analytics and Dashboard Types
export interface TrainerDashboardStats {
  total_clients: number;
  active_clients: number;
  pending_clients: number;
  total_programs: number;
  active_programs: number;
  monthly_revenue: number;
  client_adherence_avg: number;
  unread_messages: number;
}

export interface ClientProgressSummary {
  client_id: string;
  client_name: string;
  current_program?: string;
  adherence_score: number;
  weeks_completed: number;
  recent_benchmarks: PerformanceBenchmark[];
  upcoming_milestones: string[];
  risk_factors: string[];
}

export interface ProgramAnalytics {
  program_id: string;
  program_name: string;
  total_assignments: number;
  completion_rate: number;
  average_adherence: number;
  average_duration_weeks: number;
  client_feedback_score?: number;
  improvement_areas: string[];
}

// Seven Summits Specific Types
export interface SummitReadinessAssessment {
  user_id: string;
  target_summit: string;
  assessment_date: string;
  
  physical_readiness: {
    cardiovascular_score: number;
    strength_score: number;
    endurance_score: number;
    overall_score: number;
  };
  
  technical_readiness: {
    climbing_experience: number;
    altitude_experience: number;
    cold_weather_training: number;
    overall_score: number;
  };
  
  mental_readiness: {
    stress_management: number;
    goal_commitment: number;
    risk_awareness: number;
    overall_score: number;
  };
  
  equipment_readiness: {
    gear_familiarity: number;
    gear_quality: number;
    gear_completeness: number;
    overall_score: number;
  };
  
  recommendations: string[];
  estimated_success_probability: number;
  suggested_timeline: string;
}