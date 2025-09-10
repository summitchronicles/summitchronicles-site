// Training RAG Integration
// Integrates training data with knowledge base for AI learning

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

interface TrainingDataPoint {
  date: string;
  type: 'strength' | 'cardio' | 'manual';
  activity: string;
  metrics: {
    duration?: number;
    volume?: number; // kg for strength, km for cardio
    intensity?: number; // RPE 1-10
    elevation?: number;
    backpackWeight?: number;
  };
  context: {
    weekInPlan?: number;
    phase?: 'base' | 'build' | 'peak' | 'recovery';
    weather?: string;
    location?: string;
    notes?: string;
  };
}

interface TrainingInsight {
  type: 'pattern' | 'recommendation' | 'warning' | 'achievement';
  confidence: number;
  title: string;
  description: string;
  data: any[];
  actionItems?: string[];
}

export class TrainingRAG {
  
  /**
   * Extract structured training data for RAG processing
   */
  static async extractTrainingData(startDate: string, endDate: string): Promise<TrainingDataPoint[]> {
    const [strengthData, stravaData, manualData] = await Promise.all([
      // Strength training data
      supabase
        .from('actual_sets')
        .select(`
          *,
          exercises!inner (
            name,
            strength_days!inner (
              date,
              day_name,
              session_type
            )
          )
        `)
        .gte('exercises.strength_days.date', startDate)
        .lte('exercises.strength_days.date', endDate),
      
      // Enhanced Strava data
      supabase
        .from('strava_activities_enhanced')
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate),
      
      // Manual training data
      supabase
        .from('manual_training_data')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
    ]);

    const trainingData: TrainingDataPoint[] = [];

    // Process strength data
    if (strengthData.data) {
      const strengthByDay = new Map();
      
      strengthData.data.forEach((set: any) => {
        const date = set.exercises.strength_days.date;
        if (!strengthByDay.has(date)) {
          strengthByDay.set(date, {
            exercises: [],
            totalVolume: 0,
            avgRPE: [],
            sessionType: set.exercises.strength_days.session_type
          });
        }
        
        const dayData = strengthByDay.get(date);
        dayData.exercises.push({
          name: set.exercises.name,
          weight: set.weight_used,
          reps: set.reps_completed,
          rpe: set.actual_rpe
        });
        
        if (set.weight_used && set.reps_completed) {
          dayData.totalVolume += set.weight_used * set.reps_completed;
        }
        
        if (set.actual_rpe) {
          dayData.avgRPE.push(set.actual_rpe);
        }
      });

      // Convert to training data points
      strengthByDay.forEach((data, date) => {
        trainingData.push({
          date,
          type: 'strength',
          activity: data.sessionType,
          metrics: {
            volume: data.totalVolume,
            intensity: data.avgRPE.length > 0 ? 
              data.avgRPE.reduce((a: number, b: number) => a + b) / data.avgRPE.length : undefined
          },
          context: {
            notes: `${data.exercises.length} exercises completed`
          }
        });
      });
    }

    // Process Strava data
    if (stravaData.data) {
      stravaData.data.forEach((activity: any) => {
        trainingData.push({
          date: activity.start_date.split('T')[0],
          type: 'cardio',
          activity: activity.name,
          metrics: {
            duration: Math.round(activity.moving_time / 60), // minutes
            volume: Math.round(activity.distance / 1000 * 10) / 10, // km
            intensity: activity.estimated_rpe,
            elevation: activity.total_elevation_gain
          },
          context: {
            phase: activity.training_intensity,
            location: activity.sport_type
          }
        });
      });
    }

    // Process manual data
    if (manualData.data) {
      manualData.data.forEach((activity: any) => {
        trainingData.push({
          date: activity.date,
          type: 'manual',
          activity: activity.activity_type,
          metrics: {
            duration: activity.duration_minutes,
            volume: activity.distance_km,
            intensity: activity.perceived_effort,
            elevation: activity.elevation_gain_m,
            backpackWeight: activity.backpack_weight_kg
          },
          context: {
            location: activity.location,
            notes: activity.notes
          }
        });
      });
    }

    return trainingData.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Generate embeddings for training data
   */
  static async generateTrainingEmbeddings(data: TrainingDataPoint[]): Promise<void> {
    const chunks = [];
    
    // Create contextual chunks from training data
    for (const point of data) {
      const chunk = this.createTrainingChunk(point);
      chunks.push(chunk);
    }

    // Generate embeddings in batches
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      await this.processBatch(batch);
    }
  }

  /**
   * Create a contextual chunk from training data
   */
  private static createTrainingChunk(point: TrainingDataPoint): {
    content: string;
    metadata: any;
  } {
    let content = `Training Session: ${point.activity} on ${point.date}\n`;
    content += `Type: ${point.type}\n`;
    
    if (point.metrics.duration) {
      content += `Duration: ${point.metrics.duration} minutes\n`;
    }
    
    if (point.metrics.volume) {
      const unit = point.type === 'strength' ? 'kg total volume' : 'km distance';
      content += `Volume: ${point.metrics.volume} ${unit}\n`;
    }
    
    if (point.metrics.intensity) {
      content += `Intensity: ${point.metrics.intensity}/10 RPE\n`;
    }
    
    if (point.metrics.elevation) {
      content += `Elevation gain: ${point.metrics.elevation}m\n`;
    }
    
    if (point.metrics.backpackWeight) {
      content += `Backpack weight: ${point.metrics.backpackWeight}kg\n`;
    }
    
    if (point.context.phase) {
      content += `Training phase: ${point.context.phase}\n`;
    }
    
    if (point.context.location) {
      content += `Location/Type: ${point.context.location}\n`;
    }
    
    if (point.context.notes) {
      content += `Notes: ${point.context.notes}\n`;
    }

    return {
      content,
      metadata: {
        date: point.date,
        type: point.type,
        activity: point.activity,
        metrics: point.metrics,
        context: point.context
      }
    };
  }

  /**
   * Process a batch of chunks for embedding storage
   */
  private static async processBatch(chunks: Array<{content: string; metadata: any}>): Promise<void> {
    try {
      // Generate embeddings
      const embeddings = await Promise.all(
        chunks.map(async (chunk) => {
          const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk.content
          });
          return response.data[0].embedding;
        })
      );

      // Store in knowledge base
      const documents = chunks.map((chunk, index) => ({
        content: chunk.content,
        embedding: embeddings[index],
        metadata: {
          ...chunk.metadata,
          source: 'training_data',
          type: 'training_session'
        }
      }));

      const { error } = await supabase
        .from('knowledge_base')
        .insert(documents);

      if (error) {
        console.error('Error storing training embeddings:', error);
      }
    } catch (error) {
      console.error('Error processing embedding batch:', error);
    }
  }

  /**
   * Analyze training patterns and generate insights
   */
  static async generateTrainingInsights(data: TrainingDataPoint[]): Promise<TrainingInsight[]> {
    const insights: TrainingInsight[] = [];

    // Pattern 1: Training consistency
    insights.push(...await this.analyzeConsistency(data));
    
    // Pattern 2: Volume progression
    insights.push(...await this.analyzeVolumeProgression(data));
    
    // Pattern 3: Intensity distribution
    insights.push(...await this.analyzeIntensityDistribution(data));
    
    // Pattern 4: Recovery patterns
    insights.push(...await this.analyzeRecoveryPatterns(data));
    
    // Pattern 5: Seven Summits readiness
    insights.push(...await this.analyzeSevenSummitsReadiness(data));

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze training consistency patterns
   */
  private static async analyzeConsistency(data: TrainingDataPoint[]): Promise<TrainingInsight[]> {
    const insights: TrainingInsight[] = [];
    
    // Group by week
    const weeklyData = new Map();
    data.forEach(point => {
      const week = this.getWeekKey(point.date);
      if (!weeklyData.has(week)) {
        weeklyData.set(week, []);
      }
      weeklyData.get(week).push(point);
    });

    const weeksWithData = Array.from(weeklyData.values());
    const avgActivitiesPerWeek = weeksWithData.reduce((sum, week) => sum + week.length, 0) / weeksWithData.length;
    
    if (avgActivitiesPerWeek >= 5) {
      insights.push({
        type: 'achievement',
        confidence: 0.9,
        title: 'Excellent Training Consistency',
        description: `Maintaining ${avgActivitiesPerWeek.toFixed(1)} activities per week shows exceptional commitment to Seven Summits preparation.`,
        data: weeksWithData.map(week => ({ week: week[0].date, activities: week.length })),
        actionItems: ['Continue current consistency', 'Consider adding one recovery session per week']
      });
    } else if (avgActivitiesPerWeek < 3) {
      insights.push({
        type: 'warning',
        confidence: 0.8,
        title: 'Consistency Opportunity',
        description: `Average ${avgActivitiesPerWeek.toFixed(1)} activities per week may limit Seven Summits preparation progress.`,
        data: weeksWithData.map(week => ({ week: week[0].date, activities: week.length })),
        actionItems: ['Aim for 4-5 activities per week', 'Schedule training sessions in advance', 'Include shorter sessions on busy days']
      });
    }

    return insights;
  }

  /**
   * Analyze volume progression patterns
   */
  private static async analyzeVolumeProgression(data: TrainingDataPoint[]): Promise<TrainingInsight[]> {
    const insights: TrainingInsight[] = [];
    
    // Get weekly volume data
    const weeklyVolume = new Map();
    data.forEach(point => {
      const week = this.getWeekKey(point.date);
      if (!weeklyVolume.has(week)) {
        weeklyVolume.set(week, { strength: 0, cardio: 0, total: 0 });
      }
      
      const volume = weeklyVolume.get(week);
      if (point.type === 'strength' && point.metrics.volume) {
        volume.strength += point.metrics.volume;
      } else if ((point.type === 'cardio' || point.type === 'manual') && point.metrics.duration) {
        volume.cardio += point.metrics.duration;
      }
      volume.total = volume.strength + volume.cardio;
    });

    const volumes = Array.from(weeklyVolume.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    if (volumes.length >= 3) {
      const trend = this.calculateTrend(volumes.map(([_, v]) => v.total));
      
      if (trend > 0.1) {
        insights.push({
          type: 'pattern',
          confidence: 0.85,
          title: 'Positive Volume Progression',
          description: `Training volume is increasing consistently, indicating good periodization for Seven Summits preparation.`,
          data: volumes.map(([week, vol]) => ({ week, ...vol })),
          actionItems: ['Monitor for overreaching symptoms', 'Plan deload weeks every 3-4 weeks']
        });
      } else if (trend < -0.1) {
        insights.push({
          type: 'warning',
          confidence: 0.75,
          title: 'Declining Training Volume',
          description: `Training volume has been decreasing, which may impact Seven Summits preparation progress.`,
          data: volumes.map(([week, vol]) => ({ week, ...vol })),
          actionItems: ['Identify barriers to training', 'Gradually increase weekly volume', 'Focus on consistency before intensity']
        });
      }
    }

    return insights;
  }

  /**
   * Analyze intensity distribution
   */
  private static async analyzeIntensityDistribution(data: TrainingDataPoint[]): Promise<TrainingInsight[]> {
    const insights: TrainingInsight[] = [];
    
    const intensityData = data
      .filter(point => point.metrics.intensity)
      .map(point => ({ date: point.date, rpe: point.metrics.intensity!, type: point.type }));

    if (intensityData.length < 5) return insights;

    const distribution = {
      easy: intensityData.filter(d => d.rpe <= 4).length,
      moderate: intensityData.filter(d => d.rpe >= 5 && d.rpe <= 7).length,
      hard: intensityData.filter(d => d.rpe >= 8).length
    };

    const total = intensityData.length;
    const easyPercentage = (distribution.easy / total) * 100;
    const hardPercentage = (distribution.hard / total) * 100;

    // 80/20 rule: 80% easy-moderate, 20% hard
    if (hardPercentage > 30) {
      insights.push({
        type: 'warning',
        confidence: 0.8,
        title: 'High Intensity Warning',
        description: `${hardPercentage.toFixed(0)}% of sessions are high intensity (RPE 8+). This may lead to overtraining.`,
        data: [distribution],
        actionItems: ['Reduce high-intensity sessions to 20% of total', 'Add more recovery and base-building sessions', 'Focus on aerobic capacity building']
      });
    } else if (easyPercentage < 50) {
      insights.push({
        type: 'recommendation',
        confidence: 0.75,
        title: 'Add More Base Training',
        description: `Only ${easyPercentage.toFixed(0)}% of sessions are easy pace. Seven Summits requires strong aerobic base.`,
        data: [distribution],
        actionItems: ['Increase easy-pace sessions to 60-70% of total', 'Focus on building aerobic capacity', 'Practice hiking with pack at conversational pace']
      });
    }

    return insights;
  }

  /**
   * Analyze recovery patterns
   */
  private static async analyzeRecoveryPatterns(data: TrainingDataPoint[]): Promise<TrainingInsight[]> {
    const insights: TrainingInsight[] = [];
    
    // Look for back-to-back high intensity days
    const sortedData = data.sort((a, b) => a.date.localeCompare(b.date));
    const highIntensityDays = [];
    
    for (let i = 0; i < sortedData.length - 1; i++) {
      const current = sortedData[i];
      const next = sortedData[i + 1];
      
      if (current.metrics.intensity && next.metrics.intensity &&
          current.metrics.intensity >= 8 && next.metrics.intensity >= 8) {
        const dayDiff = this.daysBetween(current.date, next.date);
        if (dayDiff === 1) {
          highIntensityDays.push({ date1: current.date, date2: next.date });
        }
      }
    }

    if (highIntensityDays.length > 2) {
      insights.push({
        type: 'warning',
        confidence: 0.9,
        title: 'Insufficient Recovery Time',
        description: `Found ${highIntensityDays.length} instances of back-to-back high-intensity sessions without adequate recovery.`,
        data: highIntensityDays,
        actionItems: ['Schedule rest or easy days after high-intensity sessions', 'Monitor sleep and HRV if available', 'Consider active recovery sessions']
      });
    }

    return insights;
  }

  /**
   * Analyze Seven Summits specific readiness
   */
  private static async analyzeSevenSummitsReadiness(data: TrainingDataPoint[]): Promise<TrainingInsight[]> {
    const insights: TrainingInsight[] = [];
    
    // Look for hiking with pack weight progression
    const packWeightData = data
      .filter(point => point.metrics.backpackWeight)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (packWeightData.length >= 5) {
      const weights = packWeightData.map(d => d.metrics.backpackWeight!);
      const maxWeight = Math.max(...weights);
      const avgWeight = weights.reduce((a, b) => a + b) / weights.length;
      
      if (maxWeight >= 20) {
        insights.push({
          type: 'achievement',
          confidence: 0.85,
          title: 'Strong Pack Weight Progression',
          description: `Maximum pack weight of ${maxWeight}kg shows good preparation for Seven Summits load carrying demands.`,
          data: packWeightData.map(d => ({ date: d.date, weight: d.metrics.backpackWeight })),
          actionItems: ['Continue building to 25-30kg for Everest simulation', 'Focus on time under load', 'Practice technical terrain with pack']
        });
      } else if (maxWeight < 15) {
        insights.push({
          type: 'recommendation',
          confidence: 0.8,
          title: 'Increase Pack Weight Training',
          description: `Maximum pack weight of ${maxWeight}kg needs progression for Seven Summits preparation.`,
          data: packWeightData.map(d => ({ date: d.date, weight: d.metrics.backpackWeight })),
          actionItems: ['Gradually increase to 20-25kg', 'Start with shorter distances', 'Build up duration before increasing weight']
        });
      }
    } else {
      insights.push({
        type: 'recommendation',
        confidence: 0.9,
        title: 'Add Pack Weight Training',
        description: 'Seven Summits requires significant load carrying capacity. Start incorporating weighted hiking into your routine.',
        data: [],
        actionItems: ['Start with 10-15kg pack weight', 'Begin with familiar hiking routes', 'Focus on maintaining good posture under load']
      });
    }

    return insights;
  }

  // Helper methods
  private static getWeekKey(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const week = this.getWeekNumber(d);
    return `${year}-W${week}`;
  }

  private static getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  private static daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + (i + 1) * y, 0);
    const sumXX = (n * (n + 1) * (2 * n + 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope / (sumY / n); // Normalized slope
  }
}