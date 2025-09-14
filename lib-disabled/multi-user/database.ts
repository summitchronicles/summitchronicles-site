// Multi-User Training System Database Layer
import { createClient } from '@supabase/supabase-js';
import {
  UserProfile,
  TrainerClientRelationship,
  TrainingProgram,
  ClientProgramAssignment,
  PerformanceBenchmark,
  PeriodizationPlan,
  TrainerClientMessage,
  TrainerDashboardStats,
  ClientProgressSummary,
  ProgramAnalytics,
  SummitReadinessAssessment
} from './types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class MultiUserDatabase {
  
  // User Profile Management
  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getUserProfileByAuthId(authUserId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Trainer-Client Relationship Management
  static async createTrainerClientRelationship(
    relationship: Omit<TrainerClientRelationship, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TrainerClientRelationship> {
    const { data, error } = await supabase
      .from('trainer_client_relationships')
      .insert(relationship)
      .select(`
        *,
        trainer_profile:trainer_id(id, full_name, email, role),
        client_profile:client_id(id, full_name, email, target_summit, experience_level)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTrainerClients(trainerId: string): Promise<TrainerClientRelationship[]> {
    const { data, error } = await supabase
      .from('trainer_client_relationships')
      .select(`
        *,
        client_profile:client_id(
          id, full_name, email, target_summit, experience_level,
          summits_completed, primary_goals, target_date
        )
      `)
      .eq('trainer_id', trainerId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getClientTrainers(clientId: string): Promise<TrainerClientRelationship[]> {
    const { data, error } = await supabase
      .from('trainer_client_relationships')
      .select(`
        *,
        trainer_profile:trainer_id(id, full_name, email, role)
      `)
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async updateRelationshipStatus(
    relationshipId: string, 
    status: TrainerClientRelationship['status'],
    updates?: Partial<TrainerClientRelationship>
  ): Promise<TrainerClientRelationship> {
    const { data, error } = await supabase
      .from('trainer_client_relationships')
      .update({ status, ...updates })
      .eq('id', relationshipId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Training Program Management
  static async createTrainingProgram(program: Omit<TrainingProgram, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingProgram> {
    const { data, error } = await supabase
      .from('training_programs')
      .insert({
        ...program,
        phases: JSON.stringify(program.phases),
        weekly_structure: JSON.stringify(program.weekly_structure)
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      phases: data.phases,
      weekly_structure: data.weekly_structure
    };
  }

  static async getTrainingPrograms(
    filters?: {
      created_by?: string;
      program_type?: string;
      is_public?: boolean;
      target_summit?: string;
    }
  ): Promise<TrainingProgram[]> {
    let query = supabase
      .from('training_programs')
      .select(`
        *,
        creator_profile:created_by(id, full_name, role)
      `);

    if (filters?.created_by) query = query.eq('created_by', filters.created_by);
    if (filters?.program_type) query = query.eq('program_type', filters.program_type);
    if (filters?.is_public !== undefined) query = query.eq('is_public', filters.is_public);
    if (filters?.target_summit) query = query.eq('target_summit', filters.target_summit);

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(program => ({
      ...program,
      phases: program.phases,
      weekly_structure: program.weekly_structure
    }));
  }

  static async assignProgramToClient(
    assignment: Omit<ClientProgramAssignment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ClientProgramAssignment> {
    const { data, error } = await supabase
      .from('client_program_assignments')
      .insert({
        ...assignment,
        custom_modifications: assignment.custom_modifications ? 
          JSON.stringify(assignment.custom_modifications) : null
      })
      .select(`
        *,
        client_profile:client_id(id, full_name, email),
        program:program_id(id, name, duration_weeks, target_summit),
        assigner_profile:assigned_by(id, full_name, role)
      `)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      custom_modifications: data.custom_modifications
    };
  }

  static async getClientAssignments(clientId: string): Promise<ClientProgramAssignment[]> {
    const { data, error } = await supabase
      .from('client_program_assignments')
      .select(`
        *,
        program:program_id(id, name, description, duration_weeks, target_summit, focus_areas),
        assigner_profile:assigned_by(id, full_name, role)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(assignment => ({
      ...assignment,
      custom_modifications: assignment.custom_modifications
    }));
  }

  // Performance Benchmarks
  static async addPerformanceBenchmark(
    benchmark: Omit<PerformanceBenchmark, 'id' | 'created_at'>
  ): Promise<PerformanceBenchmark> {
    const { data, error } = await supabase
      .from('performance_benchmarks')
      .insert({
        ...benchmark,
        conditions: benchmark.conditions ? JSON.stringify(benchmark.conditions) : null,
        predicted_performance: benchmark.predicted_performance ? 
          JSON.stringify(benchmark.predicted_performance) : null
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      conditions: data.conditions,
      predicted_performance: data.predicted_performance
    };
  }

  static async getUserBenchmarks(
    userId: string, 
    filters?: { benchmark_type?: string; limit?: number }
  ): Promise<PerformanceBenchmark[]> {
    let query = supabase
      .from('performance_benchmarks')
      .select('*')
      .eq('user_id', userId);
    
    if (filters?.benchmark_type) {
      query = query.eq('benchmark_type', filters.benchmark_type);
    }
    
    query = query.order('test_date', { ascending: false });
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return (data || []).map(benchmark => ({
      ...benchmark,
      conditions: benchmark.conditions,
      predicted_performance: benchmark.predicted_performance
    }));
  }

  // Trainer Dashboard Analytics
  static async getTrainerDashboardStats(trainerId: string): Promise<TrainerDashboardStats> {
    // Get client counts
    const { data: relationships } = await supabase
      .from('trainer_client_relationships')
      .select('status')
      .eq('trainer_id', trainerId);

    // Get program counts
    const { data: programs } = await supabase
      .from('training_programs')
      .select('id')
      .eq('created_by', trainerId);

    // Get active program assignments
    const { data: activeAssignments } = await supabase
      .from('client_program_assignments')
      .select('status, adherence_score')
      .eq('assigned_by', trainerId)
      .eq('status', 'active');

    // Get unread messages
    const { data: unreadMessages } = await supabase
      .from('trainer_client_messages')
      .select('id')
      .eq('is_read', false)
      .neq('sender_id', trainerId);

    const clientCounts = relationships?.reduce((acc, rel) => {
      acc[rel.status] = (acc[rel.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const avgAdherence = activeAssignments?.length > 0 ?
      activeAssignments.reduce((sum, a) => sum + (a.adherence_score || 0), 0) / activeAssignments.length :
      0;

    return {
      total_clients: relationships?.length || 0,
      active_clients: clientCounts['active'] || 0,
      pending_clients: clientCounts['pending'] || 0,
      total_programs: programs?.length || 0,
      active_programs: activeAssignments?.length || 0,
      monthly_revenue: 0, // Would require billing integration
      client_adherence_avg: Math.round(avgAdherence * 10) / 10,
      unread_messages: unreadMessages?.length || 0
    };
  }

  static async getClientProgressSummaries(trainerId: string): Promise<ClientProgressSummary[]> {
    const { data: relationships, error } = await supabase
      .from('trainer_client_relationships')
      .select(`
        client_id,
        client_profile:client_id(id, full_name)
      `)
      .eq('trainer_id', trainerId)
      .eq('status', 'active');

    if (error) throw error;

    const summaries: ClientProgressSummary[] = [];

    for (const rel of relationships || []) {
      // Get current program assignment
      const { data: assignment } = await supabase
        .from('client_program_assignments')
        .select(`
          current_week,
          adherence_score,
          program:program_id(name)
        `)
        .eq('client_id', rel.client_id)
        .eq('status', 'active')
        .single();

      // Get recent benchmarks
      const { data: benchmarks } = await supabase
        .from('performance_benchmarks')
        .select('*')
        .eq('user_id', rel.client_id)
        .order('test_date', { ascending: false })
        .limit(3);

      summaries.push({
        client_id: rel.client_id,
        client_name: rel.client_profile?.full_name || 'Unknown',
        current_program: assignment?.program?.name,
        adherence_score: assignment?.adherence_score || 0,
        weeks_completed: assignment?.current_week || 0,
        recent_benchmarks: benchmarks || [],
        upcoming_milestones: [], // Would be calculated based on program
        risk_factors: [] // Would be calculated based on adherence and progress
      });
    }

    return summaries;
  }

  // Seven Summits Readiness Assessment
  static async calculateSummitReadiness(
    userId: string, 
    targetSummit: string
  ): Promise<SummitReadinessAssessment> {
    // Get user benchmarks
    const benchmarks = await this.getUserBenchmarks(userId);
    
    // Get training history from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const { data: trainingData } = await supabase
      .from('manual_training_data')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sixMonthsAgo.toISOString().split('T')[0]);

    // Calculate readiness scores (simplified algorithm)
    const physicalReadiness = this.calculatePhysicalReadiness(benchmarks, trainingData || []);
    const technicalReadiness = this.calculateTechnicalReadiness(benchmarks, targetSummit);
    const mentalReadiness = this.calculateMentalReadiness(trainingData || []);
    const equipmentReadiness = this.calculateEquipmentReadiness(userId);

    const overallReadiness = (
      physicalReadiness.overall_score + 
      technicalReadiness.overall_score + 
      mentalReadiness.overall_score + 
      equipmentReadiness.overall_score
    ) / 4;

    return {
      user_id: userId,
      target_summit: targetSummit,
      assessment_date: new Date().toISOString().split('T')[0],
      physical_readiness: physicalReadiness,
      technical_readiness: technicalReadiness,
      mental_readiness: mentalReadiness,
      equipment_readiness: equipmentReadiness,
      recommendations: this.generateReadinessRecommendations(
        physicalReadiness, technicalReadiness, mentalReadiness, equipmentReadiness, targetSummit
      ),
      estimated_success_probability: Math.min(100, overallReadiness),
      suggested_timeline: this.calculateSuggestedTimeline(overallReadiness, targetSummit)
    };
  }

  // Helper methods for readiness calculation
  private static calculatePhysicalReadiness(benchmarks: PerformanceBenchmark[], trainingData: any[]) {
    // Simplified calculation - would be more sophisticated in production
    const cardioScore = benchmarks.find(b => b.benchmark_type === 'vo2_max')?.primary_value || 35;
    const strengthScore = benchmarks.find(b => b.benchmark_type === 'max_squat')?.primary_value || 100;
    const enduranceActivities = trainingData.filter(d => d.activity_type === 'hiking').length;
    
    return {
      cardiovascular_score: Math.min(100, (cardioScore / 60) * 100),
      strength_score: Math.min(100, (strengthScore / 200) * 100),
      endurance_score: Math.min(100, (enduranceActivities / 20) * 100),
      overall_score: Math.min(100, ((cardioScore / 60) + (strengthScore / 200) + (enduranceActivities / 20)) * 33.33)
    };
  }

  private static calculateTechnicalReadiness(benchmarks: PerformanceBenchmark[], targetSummit: string) {
    // Summit-specific technical requirements
    const summitRequirements = {
      'everest': { climbing: 90, altitude: 95, cold: 90 },
      'denali': { climbing: 80, altitude: 85, cold: 95 },
      'aconcagua': { climbing: 60, altitude: 80, cold: 70 },
      'default': { climbing: 50, altitude: 50, cold: 50 }
    };
    
    const requirements = summitRequirements[targetSummit as keyof typeof summitRequirements] || summitRequirements.default;
    
    return {
      climbing_experience: requirements.climbing,
      altitude_experience: requirements.altitude,
      cold_weather_training: requirements.cold,
      overall_score: (requirements.climbing + requirements.altitude + requirements.cold) / 3
    };
  }

  private static calculateMentalReadiness(trainingData: any[]) {
    // Based on training consistency and goal commitment
    const consistency = Math.min(100, (trainingData.length / 50) * 100);
    
    return {
      stress_management: 70, // Would require specialized assessments
      goal_commitment: consistency,
      risk_awareness: 60, // Would require questionnaire
      overall_score: (70 + consistency + 60) / 3
    };
  }

  private static calculateEquipmentReadiness(userId: string) {
    // Would integrate with gear tracking system
    return {
      gear_familiarity: 70,
      gear_quality: 80,
      gear_completeness: 60,
      overall_score: 70
    };
  }

  private static generateReadinessRecommendations(
    physical: any, technical: any, mental: any, equipment: any, summit: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (physical.overall_score < 70) {
      recommendations.push('Focus on building cardiovascular base with 4-5 cardio sessions per week');
      recommendations.push('Increase strength training emphasis on functional movements');
    }
    
    if (technical.overall_score < 70) {
      recommendations.push(`Gain more ${summit}-specific technical experience`);
      recommendations.push('Consider hiring a mountain guide for technical skill development');
    }
    
    if (mental.overall_score < 70) {
      recommendations.push('Develop mental resilience through longer training sessions');
      recommendations.push('Practice stress management techniques');
    }
    
    if (equipment.overall_score < 70) {
      recommendations.push('Invest in high-quality mountaineering equipment');
      recommendations.push('Test all gear extensively before expedition');
    }
    
    return recommendations;
  }

  private static calculateSuggestedTimeline(readiness: number, summit: string): string {
    const baseTimelines = {
      'everest': 24, // months
      'denali': 18,
      'aconcagua': 12,
      'default': 12
    };
    
    const baseTime = baseTimelines[summit as keyof typeof baseTimelines] || baseTimelines.default;
    const adjustedTime = Math.max(6, baseTime * (100 - readiness) / 100 + baseTime * 0.5);
    
    return `${Math.round(adjustedTime)} months of focused preparation recommended`;
  }
}