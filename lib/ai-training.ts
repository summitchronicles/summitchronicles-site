/**
 * AI Training Analysis System - Phase 2
 * 
 * This module provides intelligent analysis of training data using machine learning
 * patterns to generate insights, predictions, and recommendations for mountaineering training.
 */

export interface StravaActivity {
  id: string;
  name: string;
  type: string;
  distance: number; // meters
  moving_time: number; // seconds
  total_elevation_gain: number; // meters
  start_date: string;
  average_speed?: number; // m/s
  max_speed?: number; // m/s
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  calories?: number;
}

export interface BiometricData {
  heartRateVariability: number; // ms
  restingHeartRate: number; // bpm
  sleepQuality: number; // 1-10 scale
  perceivedExertion: number; // 1-10 RPE scale
  recoveryScore: number; // 1-100
  stressLevel: number; // 1-10 scale
  hydrationLevel: number; // 1-10 scale
  date: Date;
}

export interface TrainingInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'achievement' | 'pattern' | 'prediction';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
  confidence: number; // 0-1
  reasoning: string[];
  data: {
    current: any;
    target?: any;
    trend?: 'improving' | 'declining' | 'stable';
  };
  validUntil: Date;
  category: 'fitness' | 'recovery' | 'nutrition' | 'technique' | 'planning';
}

export interface ExpeditionGoal {
  id: string;
  name: string;
  type: 'peak' | 'route' | 'skill' | 'fitness';
  difficulty: number; // 1-10 scale
  targetDate: Date;
  estimatedDuration: number; // days
  requiredFitnessLevel: number; // 1-10
  altitudeGain: number; // meters
  technicalGrade: string; // e.g., "5.7", "WI4"
  conditions: {
    season: string;
    weather: string;
    temperature: { min: number; max: number };
  };
}

export interface TrainingPattern {
  periodType: 'base' | 'build' | 'peak' | 'recovery';
  startDate: Date;
  endDate: Date;
  weeklyVolume: number; // hours
  intensityDistribution: {
    easy: number; // percentage
    moderate: number;
    hard: number;
  };
  focusAreas: string[];
  effectiveness: number; // 0-1 based on fitness gains
}

export class AITrainingAnalyzer {
  
  /**
   * Analyze training patterns from Strava activities
   */
  static analyzeTrainingPatterns(activities: StravaActivity[]): TrainingPattern[] {
    if (activities.length === 0) return [];

    // Sort activities by date
    const sortedActivities = activities.sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    // Group activities into weekly blocks
    const weeklyBlocks = this.groupActivitiesByWeek(sortedActivities);
    const patterns: TrainingPattern[] = [];

    // Analyze each 4-week block to identify patterns
    for (let i = 0; i < weeklyBlocks.length - 3; i += 4) {
      const block = weeklyBlocks.slice(i, i + 4);
      const pattern = this.identifyTrainingPeriod(block);
      if (pattern) patterns.push(pattern);
    }

    return patterns;
  }

  /**
   * Generate personalized training insights
   */
  static generateTrainingInsights(
    activities: StravaActivity[],
    biometrics: BiometricData[],
    goals: ExpeditionGoal[],
    patterns: TrainingPattern[]
  ): TrainingInsight[] {
    const insights: TrainingInsight[] = [];
    const now = new Date();

    // Recent activity analysis
    const recentActivities = activities.filter(a => 
      (now.getTime() - new Date(a.start_date).getTime()) < 14 * 24 * 60 * 60 * 1000
    );

    // Recovery insights
    insights.push(...this.analyzeRecoveryPatterns(recentActivities, biometrics));

    // Training load insights
    insights.push(...this.analyzeTrainingLoad(recentActivities, patterns));

    // Goal progression insights
    insights.push(...this.analyzeGoalProgression(activities, goals));

    // Seasonal and weather insights
    insights.push(...this.analyzeSeasonalPatterns(activities));

    // Risk assessment insights
    insights.push(...this.assessTrainingRisks(recentActivities, biometrics));

    // Sort by priority and confidence
    return insights
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return priorityDiff !== 0 ? priorityDiff : b.confidence - a.confidence;
      })
      .slice(0, 12); // Return top 12 insights
  }

  /**
   * Predict expedition success probability
   */
  static predictExpeditionSuccess(
    goal: ExpeditionGoal,
    currentFitness: any,
    activities: StravaActivity[],
    patterns: TrainingPattern[]
  ): {
    successProbability: number;
    fitnessReadiness: number;
    recommendations: string[];
    risks: string[];
  } {
    // Calculate current fitness metrics
    const recentVolume = this.calculateRecentVolume(activities, 30);
    const elevationFitness = this.calculateElevationFitness(activities);
    const enduranceFitness = this.calculateEnduranceFitness(activities);
    
    // Time until expedition
    const timeToGoal = (goal.targetDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000);
    
    // Base success factors
    let successScore = 0.5; // baseline 50%
    
    // Fitness readiness factors
    const fitnessGap = goal.requiredFitnessLevel - currentFitness.overall;
    if (fitnessGap <= 0) successScore += 0.25;
    else if (timeToGoal > fitnessGap * 30) successScore += 0.15; // enough time to improve
    else successScore -= 0.15; // insufficient time
    
    // Training consistency
    const consistencyScore = this.calculateConsistency(activities);
    successScore += consistencyScore * 0.2;
    
    // Altitude-specific preparation
    if (goal.altitudeGain > 3000) { // High altitude expedition
      const altitudeTraining = this.calculateAltitudePreparation(activities, patterns);
      successScore += altitudeTraining * 0.2;
    }
    
    // Experience factor
    const experienceScore = this.calculateExperienceLevel(activities, goal);
    successScore += experienceScore * 0.15;
    
    // Clamp between 0 and 1
    successScore = Math.max(0, Math.min(1, successScore));
    
    const recommendations: string[] = [];
    const risks: string[] = [];
    
    // Generate specific recommendations
    if (fitnessGap > 0) {
      recommendations.push(`Increase training volume by ${Math.round(fitnessGap * 20)}% over the next ${Math.round(timeToGoal / 7)} weeks`);
    }
    
    if (elevationFitness < 0.7) {
      recommendations.push('Focus on hill training and stair climbing to build elevation fitness');
    }
    
    if (enduranceFitness < 0.6) {
      recommendations.push('Increase long, steady-state cardio sessions for better endurance base');
    }
    
    // Identify risks
    if (timeToGoal < 90) {
      risks.push('Limited preparation time remaining');
    }
    
    if (consistencyScore < 0.6) {
      risks.push('Inconsistent training pattern may impact readiness');
    }
    
    return {
      successProbability: successScore,
      fitnessReadiness: Math.max(0, Math.min(1, 1 - fitnessGap / goal.requiredFitnessLevel)),
      recommendations,
      risks
    };
  }

  /**
   * Generate weather-optimized training schedule
   */
  static generateOptimalTrainingSchedule(
    activities: StravaActivity[],
    goals: ExpeditionGoal[],
    weatherData: any
  ): {
    weeklyPlan: any[];
    adaptations: string[];
  } {
    const weeklyPlan = [];
    const adaptations: string[] = [];
    
    // Analyze current training patterns
    const currentVolume = this.calculateRecentVolume(activities, 7);
    const preferredTimes = this.analyzePreferredTrainingTimes(activities);
    
    // Generate 4-week schedule
    for (let week = 0; week < 4; week++) {
      const weekPlan = this.generateWeeklyPlan(
        currentVolume * (1 + week * 0.05), // Progressive overload
        goals[0], // Primary goal
        weatherData
      );
      weeklyPlan.push(weekPlan);
    }
    
    return { weeklyPlan, adaptations };
  }

  // Private helper methods
  
  private static groupActivitiesByWeek(activities: StravaActivity[]) {
    const weeks: StravaActivity[][] = [];
    let currentWeek: StravaActivity[] = [];
    let weekStart: Date | null = null;

    for (const activity of activities) {
      const activityDate = new Date(activity.start_date);
      
      if (!weekStart) {
        weekStart = new Date(activityDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      }
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      if (activityDate >= weekStart && activityDate < weekEnd) {
        currentWeek.push(activity);
      } else {
        if (currentWeek.length > 0) weeks.push([...currentWeek]);
        currentWeek = [activity];
        weekStart = new Date(activityDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      }
    }
    
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }

  private static identifyTrainingPeriod(weeklyBlocks: StravaActivity[][]): TrainingPattern | null {
    if (weeklyBlocks.length < 4) return null;

    const totalVolume = weeklyBlocks.reduce((sum, week) => 
      sum + week.reduce((weekSum, activity) => weekSum + (activity.moving_time / 3600), 0), 0
    );

    const avgWeeklyVolume = totalVolume / weeklyBlocks.length;
    const intensityPattern = this.calculateIntensityDistribution(weeklyBlocks);
    
    // Determine period type based on volume and intensity patterns
    let periodType: TrainingPattern['periodType'] = 'base';
    if (avgWeeklyVolume > 12 && intensityPattern.hard > 0.25) periodType = 'build';
    else if (avgWeeklyVolume > 15) periodType = 'peak';
    else if (avgWeeklyVolume < 5) periodType = 'recovery';

    return {
      periodType,
      startDate: new Date(weeklyBlocks[0][0]?.start_date || ''),
      endDate: new Date(weeklyBlocks[weeklyBlocks.length - 1][weeklyBlocks[weeklyBlocks.length - 1].length - 1]?.start_date || ''),
      weeklyVolume: avgWeeklyVolume,
      intensityDistribution: intensityPattern,
      focusAreas: this.identifyFocusAreas(weeklyBlocks),
      effectiveness: this.calculateEffectiveness(weeklyBlocks)
    };
  }

  private static calculateIntensityDistribution(weeklyBlocks: StravaActivity[][]): {
    easy: number;
    moderate: number;
    hard: number;
  } {
    // Simplified intensity analysis based on activity types and durations
    let easy = 0, moderate = 0, hard = 0;
    let total = 0;

    weeklyBlocks.forEach(week => {
      week.forEach(activity => {
        const duration = activity.moving_time / 3600; // hours
        total += duration;

        // Simple heuristic based on activity type
        if (activity.type === 'Run' && duration > 1.5) easy += duration;
        else if (activity.type === 'Hike' && duration > 2) easy += duration;
        else if (activity.type === 'Ride' && duration > 2) moderate += duration;
        else hard += duration;
      });
    });

    return total > 0 ? {
      easy: easy / total,
      moderate: moderate / total,
      hard: hard / total
    } : { easy: 0, moderate: 0, hard: 0 };
  }

  private static identifyFocusAreas(weeklyBlocks: StravaActivity[][]): string[] {
    const activityTypes: { [key: string]: number } = {};
    
    weeklyBlocks.forEach(week => {
      week.forEach(activity => {
        activityTypes[activity.type] = (activityTypes[activity.type] || 0) + 1;
      });
    });

    const focusAreas = [];
    if (activityTypes['Run'] > 5) focusAreas.push('Running Endurance');
    if (activityTypes['Hike'] > 3) focusAreas.push('Hiking Fitness');
    if (activityTypes['Ride'] > 3) focusAreas.push('Cycling Fitness');
    
    return focusAreas;
  }

  private static calculateEffectiveness(weeklyBlocks: StravaActivity[][]): number {
    // Simplified effectiveness metric based on progression
    const volumes = weeklyBlocks.map(week => 
      week.reduce((sum, activity) => sum + activity.moving_time, 0)
    );
    
    let progression = 0;
    for (let i = 1; i < volumes.length; i++) {
      if (volumes[i] > volumes[i - 1]) progression++;
    }
    
    return volumes.length > 1 ? progression / (volumes.length - 1) : 0.5;
  }

  private static analyzeRecoveryPatterns(
    activities: StravaActivity[],
    biometrics: BiometricData[]
  ): TrainingInsight[] {
    const insights: TrainingInsight[] = [];
    
    // Analyze recent training load
    const recentLoad = activities.reduce((sum, activity) => {
      const daysSince = (Date.now() - new Date(activity.start_date).getTime()) / (24 * 60 * 60 * 1000);
      const weight = Math.max(0, 1 - daysSince / 14); // Decay over 14 days
      return sum + (activity.moving_time / 3600) * weight;
    }, 0);

    // Check for overtraining signs
    if (recentLoad > 15) { // High weekly volume
      insights.push({
        id: 'recovery-warning',
        type: 'warning',
        priority: 'high',
        title: 'High Training Load Detected',
        description: 'Your recent training volume is significantly above normal levels.',
        action: 'Consider scheduling a recovery day in the next 2-3 days',
        confidence: 0.85,
        reasoning: [
          `Recent 14-day training load: ${recentLoad.toFixed(1)} hours`,
          'High training loads without adequate recovery can lead to overtraining',
          'Recovery is essential for adaptation and injury prevention'
        ],
        data: {
          current: { load: recentLoad, threshold: 12 },
          trend: recentLoad > 12 ? 'declining' : 'stable'
        },
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: 'recovery'
      });
    }

    return insights;
  }

  private static analyzeTrainingLoad(
    activities: StravaActivity[],
    patterns: TrainingPattern[]
  ): TrainingInsight[] {
    const insights: TrainingInsight[] = [];
    
    const currentWeekVolume = activities
      .filter(a => (Date.now() - new Date(a.start_date).getTime()) < 7 * 24 * 60 * 60 * 1000)
      .reduce((sum, activity) => sum + activity.moving_time / 3600, 0);

    const previousWeekVolume = activities
      .filter(a => {
        const daysSince = (Date.now() - new Date(a.start_date).getTime()) / (24 * 60 * 60 * 1000);
        return daysSince >= 7 && daysSince < 14;
      })
      .reduce((sum, activity) => sum + activity.moving_time / 3600, 0);

    if (currentWeekVolume > previousWeekVolume * 1.3) {
      insights.push({
        id: 'volume-increase',
        type: 'warning',
        priority: 'medium',
        title: 'Rapid Training Volume Increase',
        description: 'You\'ve increased your training volume by more than 30% this week.',
        action: 'Monitor your body for signs of fatigue and consider reducing intensity',
        confidence: 0.75,
        reasoning: [
          `Current week: ${currentWeekVolume.toFixed(1)} hours`,
          `Previous week: ${previousWeekVolume.toFixed(1)} hours`,
          'The 10% rule suggests gradual increases to prevent injury'
        ],
        data: {
          current: { volume: currentWeekVolume },
          target: { volume: previousWeekVolume * 1.1 },
          trend: 'improving'
        },
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        category: 'fitness'
      });
    }

    return insights;
  }

  private static analyzeGoalProgression(
    activities: StravaActivity[],
    goals: ExpeditionGoal[]
  ): TrainingInsight[] {
    const insights: TrainingInsight[] = [];
    
    for (const goal of goals) {
      const daysToGoal = (goal.targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
      
      if (daysToGoal > 0 && daysToGoal < 180) { // Within 6 months
        const currentFitness = this.calculateCurrentFitness(activities);
        const requiredFitness = goal.requiredFitnessLevel;
        
        if (currentFitness < requiredFitness * 0.8) {
          insights.push({
            id: `goal-progress-${goal.id}`,
            type: 'recommendation',
            priority: daysToGoal < 60 ? 'high' : 'medium',
            title: `${goal.name} Fitness Progress`,
            description: `You need to increase training intensity to reach your fitness goal for ${goal.name}.`,
            action: `Increase training volume by ${Math.round((requiredFitness - currentFitness) * 10)}% over the next ${Math.round(daysToGoal / 7)} weeks`,
            confidence: 0.8,
            reasoning: [
              `Current fitness level: ${Math.round(currentFitness * 10)}/10`,
              `Required fitness level: ${Math.round(requiredFitness * 10)}/10`,
              `Time remaining: ${Math.round(daysToGoal)} days`
            ],
            data: {
              current: { fitness: currentFitness },
              target: { fitness: requiredFitness },
              trend: 'improving'
            },
            validUntil: goal.targetDate,
            category: 'planning'
          });
        }
      }
    }

    return insights;
  }

  private static analyzeSeasonalPatterns(activities: StravaActivity[]): TrainingInsight[] {
    const insights: TrainingInsight[] = [];
    const now = new Date();
    const month = now.getMonth();
    
    // Winter training insights
    if (month >= 11 || month <= 1) { // Nov, Dec, Jan
      const indoorActivities = activities.filter(a => 
        a.type === 'VirtualRide' || a.name.toLowerCase().includes('indoor')
      ).length;
      
      const totalActivities = activities.length;
      
      if (indoorActivities / totalActivities < 0.3 && totalActivities > 10) {
        insights.push({
          id: 'winter-training',
          type: 'recommendation',
          priority: 'low',
          title: 'Winter Training Optimization',
          description: 'Consider adding more indoor training sessions during winter months.',
          action: 'Balance outdoor activities with indoor alternatives when weather is poor',
          confidence: 0.6,
          reasoning: [
            'Winter weather can limit outdoor training opportunities',
            'Indoor training provides consistent conditions for base building',
            'Maintaining training consistency is crucial for mountain preparation'
          ],
          data: {
            current: { indoorPercentage: indoorActivities / totalActivities },
            target: { indoorPercentage: 0.3 },
            trend: 'stable'
          },
          validUntil: new Date(now.getFullYear(), 2, 1), // Until March
          category: 'planning'
        });
      }
    }

    return insights;
  }

  private static assessTrainingRisks(
    activities: StravaActivity[],
    biometrics: BiometricData[]
  ): TrainingInsight[] {
    const insights: TrainingInsight[] = [];
    
    // Check for monotonous training
    const activityTypes = new Set(activities.slice(0, 10).map(a => a.type));
    
    if (activityTypes.size < 2) {
      insights.push({
        id: 'training-variety',
        type: 'recommendation',
        priority: 'medium',
        title: 'Limited Training Variety',
        description: 'Your recent training has focused on only one type of activity.',
        action: 'Add cross-training activities to improve overall fitness and reduce injury risk',
        confidence: 0.7,
        reasoning: [
          `Recent activities: ${Array.from(activityTypes).join(', ')}`,
          'Varied training develops different energy systems',
          'Cross-training reduces overuse injury risk'
        ],
        data: {
          current: { variety: activityTypes.size },
          target: { variety: 3 },
          trend: 'stable'
        },
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        category: 'technique'
      });
    }

    return insights;
  }

  private static calculateRecentVolume(activities: StravaActivity[], days: number): number {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return activities
      .filter(a => new Date(a.start_date).getTime() >= cutoff)
      .reduce((sum, activity) => sum + activity.moving_time / 3600, 0);
  }

  private static calculateElevationFitness(activities: StravaActivity[]): number {
    const recentActivities = activities.slice(0, 20);
    const avgElevation = recentActivities.reduce((sum, a) => 
      sum + (a.total_elevation_gain || 0), 0
    ) / recentActivities.length;
    
    // Normalize elevation fitness (500m = 0.5, 1000m = 1.0)
    return Math.min(1, avgElevation / 1000);
  }

  private static calculateEnduranceFitness(activities: StravaActivity[]): number {
    const recentActivities = activities.slice(0, 20);
    const avgDuration = recentActivities.reduce((sum, a) => 
      sum + (a.moving_time / 3600), 0
    ) / recentActivities.length;
    
    // Normalize endurance fitness (2 hours = 1.0)
    return Math.min(1, avgDuration / 2);
  }

  private static calculateConsistency(activities: StravaActivity[]): number {
    if (activities.length < 7) return 0;
    
    // Calculate weekly consistency over last 8 weeks
    const weeks = 8;
    let consistentWeeks = 0;
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = Date.now() - ((i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = Date.now() - (i * 7 * 24 * 60 * 60 * 1000);
      
      const weekActivities = activities.filter(a => {
        const date = new Date(a.start_date).getTime();
        return date >= weekStart && date < weekEnd;
      });
      
      if (weekActivities.length >= 3) consistentWeeks++;
    }
    
    return consistentWeeks / weeks;
  }

  private static calculateAltitudePreparation(
    activities: StravaActivity[],
    patterns: TrainingPattern[]
  ): number {
    // Look for high-elevation activities and specific altitude training
    const elevationScore = this.calculateElevationFitness(activities);
    const hikePercentage = activities.filter(a => a.type === 'Hike').length / activities.length;
    
    return Math.min(1, elevationScore + hikePercentage);
  }

  private static calculateExperienceLevel(activities: StravaActivity[], goal: ExpeditionGoal): number {
    // Simple heuristic based on activity variety and volume
    const totalHours = activities.reduce((sum, a) => sum + a.moving_time / 3600, 0);
    const activityTypes = new Set(activities.map(a => a.type)).size;
    
    const volumeScore = Math.min(1, totalHours / 500); // 500 hours = experienced
    const varietyScore = Math.min(1, activityTypes / 5); // 5+ activity types = well-rounded
    
    return (volumeScore + varietyScore) / 2;
  }

  private static calculateCurrentFitness(activities: StravaActivity[]): number {
    const endurance = this.calculateEnduranceFitness(activities);
    const elevation = this.calculateElevationFitness(activities);
    const consistency = this.calculateConsistency(activities);
    
    return (endurance + elevation + consistency) / 3;
  }

  private static analyzePreferredTrainingTimes(activities: StravaActivity[]): {
    preferredHour: number;
    preferredDays: number[];
  } {
    const hours: { [key: number]: number } = {};
    const days: { [key: number]: number } = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.start_date);
      const hour = date.getHours();
      const day = date.getDay(); // 0 = Sunday
      
      hours[hour] = (hours[hour] || 0) + 1;
      days[day] = (days[day] || 0) + 1;
    });
    
    const preferredHour = Object.keys(hours).reduce((a, b) => 
      hours[+a] > hours[+b] ? a : b, '6'
    );
    
    const preferredDays = Object.keys(days)
      .sort((a, b) => days[+b] - days[+a])
      .slice(0, 3)
      .map(d => +d);
    
    return {
      preferredHour: +preferredHour,
      preferredDays
    };
  }

  private static generateWeeklyPlan(
    targetVolume: number,
    goal: ExpeditionGoal,
    weatherData: any
  ): any {
    // Simplified weekly plan generation
    return {
      totalVolume: targetVolume,
      sessions: [
        { type: 'Long Endurance', duration: targetVolume * 0.4, day: 'Sunday' },
        { type: 'Hill Training', duration: targetVolume * 0.25, day: 'Wednesday' },
        { type: 'Recovery Run', duration: targetVolume * 0.2, day: 'Friday' },
        { type: 'Cross Training', duration: targetVolume * 0.15, day: 'Tuesday' }
      ],
      adaptations: []
    };
  }
}