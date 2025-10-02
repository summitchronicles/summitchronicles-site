import { TrainingActivity } from '../app/api/training/upload/route';

export interface TrainingGoal {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'strength' | 'endurance' | 'weight' | 'skill';
  type: 'numeric' | 'duration' | 'frequency' | 'milestone';
  target: {
    value: number;
    unit: string;
    timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  current: {
    value: number;
    lastUpdated: string;
  };
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  tags: string[];
}

export interface GoalProgress {
  goalId: string;
  progress: number; // percentage 0-100
  trend: 'ahead' | 'on_track' | 'behind' | 'at_risk';
  projection: {
    estimatedCompletion: string;
    confidence: number;
    requiredDailyRate: number;
  };
  milestones: {
    date: string;
    value: number;
    notes?: string;
  }[];
}

export interface PerformancePrediction {
  metric: string;
  currentValue: number;
  predictions: {
    timeframe: '1_week' | '1_month' | '3_months';
    predictedValue: number;
    confidence: number;
    factors: string[];
  }[];
  recommendations: {
    action: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
  }[];
}

export interface GoalInsights {
  achievabilityScore: number;
  timeToCompletion: number; // days
  riskFactors: string[];
  accelerators: string[];
  similarGoalsCompletion: number; // percentage of similar goals completed
}

export class GoalTracker {
  private static readonly GOAL_CATEGORIES = {
    fitness: {
      metrics: ['compliance_rate', 'workout_frequency', 'total_duration'],
      weights: { consistency: 0.4, intensity: 0.3, volume: 0.3 }
    },
    strength: {
      metrics: ['weight_progression', 'volume_progression', 'strength_endurance'],
      weights: { progression: 0.5, volume: 0.3, endurance: 0.2 }
    },
    endurance: {
      metrics: ['distance', 'duration', 'heart_rate_zones', 'recovery_rate'],
      weights: { distance: 0.3, duration: 0.3, efficiency: 0.4 }
    },
    weight: {
      metrics: ['body_weight', 'body_composition', 'measurement_tracking'],
      weights: { weight: 0.6, composition: 0.4 }
    },
    skill: {
      metrics: ['technique_scores', 'complexity_progression', 'success_rate'],
      weights: { technique: 0.4, progression: 0.4, consistency: 0.2 }
    }
  };

  // Calculate goal progress based on activities
  static calculateGoalProgress(goal: TrainingGoal, activities: TrainingActivity[]): GoalProgress {
    const now = new Date();
    const goalStart = new Date(goal.createdAt);
    const goalEnd = goal.deadline ? new Date(goal.deadline) : new Date(goalStart.getTime() + 365 * 24 * 60 * 60 * 1000);

    // Filter activities relevant to this goal
    const relevantActivities = this.filterActivitiesForGoal(goal, activities);

    // Calculate current progress
    const currentValue = this.calculateCurrentValue(goal, relevantActivities);
    const progress = Math.min(100, (currentValue / goal.target.value) * 100);

    // Determine trend
    const trend = this.calculateTrend(goal, relevantActivities, progress);

    // Generate projection
    const projection = this.generateProjection(goal, relevantActivities, currentValue, goalEnd);

    // Track milestones
    const milestones = this.generateMilestones(goal, relevantActivities);

    return {
      goalId: goal.id,
      progress,
      trend,
      projection,
      milestones
    };
  }


  // Generate goal insights and recommendations
  static generateGoalInsights(goal: TrainingGoal, activities: TrainingActivity[]): GoalInsights {
    const relevantActivities = this.filterActivitiesForGoal(goal, activities);
    const currentProgress = this.calculateGoalProgress(goal, activities);

    // Calculate achievability score based on current trajectory
    const achievabilityScore = this.calculateAchievabilityScore(goal, currentProgress, relevantActivities);

    // Estimate time to completion
    const timeToCompletion = this.estimateTimeToCompletion(goal, currentProgress);

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(goal, currentProgress, relevantActivities);

    // Identify accelerators
    const accelerators = this.identifyAccelerators(goal, currentProgress, relevantActivities);

    // Calculate similar goals completion rate (simulated)
    const similarGoalsCompletion = this.getSimilarGoalsCompletionRate(goal);

    return {
      achievabilityScore,
      timeToCompletion,
      riskFactors,
      accelerators,
      similarGoalsCompletion
    };
  }

  // Helper methods
  private static filterActivitiesForGoal(goal: TrainingGoal, activities: TrainingActivity[]): TrainingActivity[] {
    // Filter activities based on goal category and tags
    return activities.filter(activity => {
      if (goal.tags.includes('all')) return true;

      if (goal.category === 'fitness') {
        return activity.completed;
      } else if (goal.category === 'strength') {
        return activity.type === 'strength' && activity.completed;
      } else if (goal.category === 'endurance') {
        return (activity.type === 'cardio' || activity.type === 'expedition') && activity.completed;
      }

      return goal.tags.some(tag =>
        activity.type.includes(tag) ||
        activity.title.toLowerCase().includes(tag.toLowerCase())
      );
    });
  }

  private static calculateCurrentValue(goal: TrainingGoal, activities: TrainingActivity[]): number {
    switch (goal.type) {
      case 'frequency':
        return this.calculateFrequency(goal, activities);
      case 'duration':
        return this.calculateTotalDuration(activities);
      case 'numeric':
        return this.calculateNumericValue(goal, activities);
      default:
        return activities.filter(a => a.completed).length;
    }
  }

  private static calculateFrequency(goal: TrainingGoal, activities: TrainingActivity[]): number {
    const timeframeMs = this.getTimeframeMs(goal.target.timeframe);
    const now = new Date();
    const startDate = new Date(now.getTime() - timeframeMs);

    return activities.filter(a =>
      a.completed && new Date(a.date) >= startDate
    ).length;
  }

  private static calculateTotalDuration(activities: TrainingActivity[]): number {
    return activities.reduce((total, activity) => {
      if (activity.completed && activity.actual?.duration) {
        return total + activity.actual.duration;
      }
      return total + (activity.completed ? activity.duration : 0);
    }, 0);
  }

  private static calculateNumericValue(goal: TrainingGoal, activities: TrainingActivity[]): number {
    // This would be specific to the goal type - weight lifted, distance covered, etc.
    // For now, return a calculated value based on activity metrics
    if (goal.target.unit === 'compliance_rate') {
      const completed = activities.filter(a => a.completed).length;
      return activities.length > 0 ? (completed / activities.length) * 100 : 0;
    }

    return activities.filter(a => a.completed).length;
  }

  private static calculateTrend(goal: TrainingGoal, activities: TrainingActivity[], progress: number): 'ahead' | 'on_track' | 'behind' | 'at_risk' {
    const deadline = goal.deadline ? new Date(goal.deadline) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const timeRemaining = deadline.getTime() - Date.now();
    const totalTime = deadline.getTime() - new Date(goal.createdAt).getTime();
    const expectedProgress = ((totalTime - timeRemaining) / totalTime) * 100;

    const progressDifference = progress - expectedProgress;

    if (progressDifference > 20) return 'ahead';
    if (progressDifference > -10) return 'on_track';
    if (progressDifference > -30) return 'behind';
    return 'at_risk';
  }

  private static generateProjection(goal: TrainingGoal, activities: TrainingActivity[], currentValue: number, goalEnd: Date): GoalProgress['projection'] {
    // Simple linear projection based on recent activity
    const recentActivities = activities.filter(a => {
      const activityDate = new Date(a.date);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return activityDate >= twoWeeksAgo && a.completed;
    });

    const recentRate = recentActivities.length / 14; // activities per day
    const remainingValue = goal.target.value - currentValue;
    const daysToGoal = remainingValue / Math.max(recentRate, 0.1);

    const estimatedCompletion = new Date(Date.now() + daysToGoal * 24 * 60 * 60 * 1000);
    const confidence = Math.min(95, Math.max(10, recentActivities.length * 10));

    return {
      estimatedCompletion: estimatedCompletion.toISOString(),
      confidence,
      requiredDailyRate: remainingValue / Math.max(1, (goalEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    };
  }

  private static generateMilestones(goal: TrainingGoal, activities: TrainingActivity[]): GoalProgress['milestones'] {
    // Generate milestones at 25%, 50%, 75%, 90% completion points
    const milestonePercentages = [25, 50, 75, 90];
    const milestones: GoalProgress['milestones'] = [];

    milestonePercentages.forEach(percentage => {
      const targetValue = (goal.target.value * percentage) / 100;
      const currentValue = this.calculateCurrentValue(goal, activities);

      if (currentValue >= targetValue) {
        // Milestone achieved - find approximate date
        const achievementDate = this.findMilestoneDate(activities, targetValue, goal);
        milestones.push({
          date: achievementDate,
          value: targetValue,
          notes: `${percentage}% milestone achieved`
        });
      }
    });

    return milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private static findMilestoneDate(activities: TrainingActivity[], targetValue: number, goal: TrainingGoal): string {
    // Find the approximate date when this milestone was achieved
    const sortedActivities = activities
      .filter(a => a.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningTotal = 0;
    for (const activity of sortedActivities) {
      runningTotal += 1; // Simplified - would be more sophisticated based on goal type
      if (runningTotal >= targetValue) {
        return activity.date;
      }
    }

    return new Date().toISOString();
  }

  private static predictComplianceRate(activities: TrainingActivity[]): PerformancePrediction {
    const recentCompliance = this.calculateRecentCompliance(activities);
    const trend = this.calculateComplianceTrend(activities);

    return {
      metric: 'compliance_rate',
      currentValue: recentCompliance,
      predictions: [
        {
          timeframe: '1_week',
          predictedValue: Math.max(0, Math.min(100, recentCompliance + trend * 7)),
          confidence: 85,
          factors: ['Recent performance', 'Consistency trend', 'Seasonal patterns']
        },
        {
          timeframe: '1_month',
          predictedValue: Math.max(0, Math.min(100, recentCompliance + trend * 30)),
          confidence: 70,
          factors: ['Long-term trend', 'Goal trajectory', 'Historical patterns']
        },
        {
          timeframe: '3_months',
          predictedValue: Math.max(0, Math.min(100, recentCompliance + trend * 90)),
          confidence: 55,
          factors: ['Training adaptation', 'Motivation cycles', 'External factors']
        }
      ],
      recommendations: [
        {
          action: 'Maintain current consistency if compliance > 80%',
          impact: 'medium',
          effort: 'low'
        },
        {
          action: 'Focus on shorter, more frequent sessions if compliance < 60%',
          impact: 'high',
          effort: 'medium'
        }
      ]
    };
  }

  private static predictWorkoutDuration(activities: TrainingActivity[]): PerformancePrediction {
    const completedActivities = activities.filter(a => a.completed);
    const avgDuration = completedActivities.reduce((sum, a) => sum + (a.actual?.duration || a.duration), 0) / completedActivities.length;

    return {
      metric: 'workout_duration',
      currentValue: avgDuration,
      predictions: [
        {
          timeframe: '1_week',
          predictedValue: avgDuration * 1.02, // Slight improvement expected
          confidence: 80,
          factors: ['Fitness adaptation', 'Routine establishment']
        },
        {
          timeframe: '1_month',
          predictedValue: avgDuration * 1.08,
          confidence: 65,
          factors: ['Progressive overload', 'Endurance improvement']
        },
        {
          timeframe: '3_months',
          predictedValue: avgDuration * 1.15,
          confidence: 50,
          factors: ['Training progression', 'Goal advancement']
        }
      ],
      recommendations: [
        {
          action: 'Gradually increase workout duration by 5-10% weekly',
          impact: 'medium',
          effort: 'low'
        }
      ]
    };
  }

  private static predictWorkoutFrequency(activities: TrainingActivity[]): PerformancePrediction {
    const weeklyFrequency = this.calculateWeeklyFrequency(activities);

    return {
      metric: 'workout_frequency',
      currentValue: weeklyFrequency,
      predictions: [
        {
          timeframe: '1_week',
          predictedValue: weeklyFrequency,
          confidence: 90,
          factors: ['Established routine', 'Current capacity']
        },
        {
          timeframe: '1_month',
          predictedValue: Math.min(7, weeklyFrequency * 1.1),
          confidence: 75,
          factors: ['Habit formation', 'Schedule optimization']
        },
        {
          timeframe: '3_months',
          predictedValue: Math.min(7, weeklyFrequency * 1.2),
          confidence: 60,
          factors: ['Long-term commitment', 'Lifestyle integration']
        }
      ],
      recommendations: [
        {
          action: 'Add one additional workout per week if currently < 4',
          impact: 'high',
          effort: 'medium'
        }
      ]
    };
  }

  // Additional helper methods
  private static calculateRecentCompliance(activities: TrainingActivity[]): number {
    const recentActivities = activities.filter(a => {
      const activityDate = new Date(a.date);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return activityDate >= twoWeeksAgo;
    });

    const completed = recentActivities.filter(a => a.completed).length;
    return recentActivities.length > 0 ? (completed / recentActivities.length) * 100 : 0;
  }

  private static calculateComplianceTrend(activities: TrainingActivity[]): number {
    // Calculate daily compliance change (simplified)
    const recentCompliance = this.calculateRecentCompliance(activities);
    const olderCompliance = this.calculateComplianceForPeriod(activities, 28, 14); // 2-4 weeks ago

    return (recentCompliance - olderCompliance) / 14; // Change per day
  }

  private static calculateComplianceForPeriod(activities: TrainingActivity[], daysAgo: number, periodLength: number): number {
    const endDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const startDate = new Date(endDate.getTime() - periodLength * 24 * 60 * 60 * 1000);

    const periodActivities = activities.filter(a => {
      const activityDate = new Date(a.date);
      return activityDate >= startDate && activityDate <= endDate;
    });

    const completed = periodActivities.filter(a => a.completed).length;
    return periodActivities.length > 0 ? (completed / periodActivities.length) * 100 : 0;
  }

  private static calculateWeeklyFrequency(activities: TrainingActivity[]): number {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return activities.filter(a => new Date(a.date) >= oneWeekAgo && a.completed).length;
  }

  private static calculateAchievabilityScore(goal: TrainingGoal, progress: GoalProgress, activities: TrainingActivity[]): number {
    // Base score on current progress and trajectory
    let score = 50; // Base score

    // Adjust based on current progress
    if (progress.progress > 75) score += 30;
    else if (progress.progress > 50) score += 20;
    else if (progress.progress > 25) score += 10;

    // Adjust based on trend
    switch (progress.trend) {
      case 'ahead': score += 25; break;
      case 'on_track': score += 15; break;
      case 'behind': score -= 10; break;
      case 'at_risk': score -= 25; break;
    }

    // Adjust based on consistency
    const consistencyScore = this.calculateRecentCompliance(activities);
    score += (consistencyScore - 50) * 0.4;

    return Math.max(0, Math.min(100, score));
  }

  private static estimateTimeToCompletion(goal: TrainingGoal, progress: GoalProgress): number {
    if (progress.projection.requiredDailyRate === 0) return 0;

    const remainingValue = goal.target.value * (1 - progress.progress / 100);
    return Math.ceil(remainingValue / progress.projection.requiredDailyRate);
  }

  private static identifyRiskFactors(goal: TrainingGoal, progress: GoalProgress, activities: TrainingActivity[]): string[] {
    const riskFactors: string[] = [];

    if (progress.trend === 'behind' || progress.trend === 'at_risk') {
      riskFactors.push('Behind target timeline');
    }

    if (progress.projection.confidence < 60) {
      riskFactors.push('Low projection confidence');
    }

    const recentCompliance = this.calculateRecentCompliance(activities);
    if (recentCompliance < 60) {
      riskFactors.push('Low recent compliance rate');
    }

    const consistency = this.calculateConsistency(activities);
    if (consistency < 0.7) {
      riskFactors.push('Inconsistent workout schedule');
    }

    return riskFactors;
  }

  private static identifyAccelerators(goal: TrainingGoal, progress: GoalProgress, activities: TrainingActivity[]): string[] {
    const accelerators: string[] = [];

    if (progress.trend === 'ahead') {
      accelerators.push('Ahead of schedule - maintain momentum');
    }

    const recentCompliance = this.calculateRecentCompliance(activities);
    if (recentCompliance > 80) {
      accelerators.push('High compliance rate - consider increasing intensity');
    }

    const avgDuration = this.calculateTotalDuration(activities) / activities.filter(a => a.completed).length;
    if (avgDuration < 45) {
      accelerators.push('Room to increase workout duration');
    }

    return accelerators;
  }

  private static calculateConsistency(activities: TrainingActivity[]): number {
    // Calculate workout consistency over past month
    const daysWithWorkouts = new Set(
      activities
        .filter(a => a.completed && new Date(a.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .map(a => a.date)
    ).size;

    return daysWithWorkouts / 30;
  }

  private static getSimilarGoalsCompletionRate(goal: TrainingGoal): number {
    // Simulated completion rate based on goal category
    const completionRates = {
      fitness: 72,
      strength: 68,
      endurance: 75,
      weight: 65,
      skill: 58
    };

    return completionRates[goal.category] || 70;
  }

  private static getTimeframeMs(timeframe: string): number {
    const timeframes = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      quarterly: 90 * 24 * 60 * 60 * 1000,
      yearly: 365 * 24 * 60 * 60 * 1000
    };

    return timeframes[timeframe as keyof typeof timeframes] || timeframes.weekly;
  }

  // Advanced Performance Prediction Models
  static generatePerformancePredictions(activities: TrainingActivity[]): PerformancePrediction[] {
    const predictions: PerformancePrediction[] = [];

    // Workout Frequency Prediction
    const frequencyPrediction = this.predictWorkoutFrequency(activities);
    predictions.push(frequencyPrediction);

    // Compliance Rate Prediction
    const compliancePrediction = this.predictComplianceRate(activities);
    predictions.push(compliancePrediction);

    // Performance Score Prediction
    const performancePrediction = this.predictOverallPerformance(activities);
    predictions.push(performancePrediction);

    return predictions;
  }

  // Overall Performance Score Prediction using Weighted Factors
  private static predictOverallPerformance(activities: TrainingActivity[]): PerformancePrediction {
    if (activities.length < 5) {
      return this.createDefaultPrediction('overall_performance', 70);
    }

    const recentActivities = activities.slice(-14);
    const completionRate = recentActivities.filter(a => a.completed).length / recentActivities.length;
    const averageCompliance = recentActivities
      .filter(a => a.compliance)
      .reduce((sum, a) => sum + (a.compliance!.overallScore || 0), 0) / Math.max(1, recentActivities.filter(a => a.compliance).length);

    // Weighted performance score
    const currentPerformance = Math.round((completionRate * 40) + (averageCompliance * 0.6));

    // Trend analysis for prediction
    const oldActivities = activities.slice(-28, -14);
    const oldCompletionRate = oldActivities.filter(a => a.completed).length / Math.max(1, oldActivities.length);
    const oldCompliance = oldActivities
      .filter(a => a.compliance)
      .reduce((sum, a) => sum + (a.compliance!.overallScore || 0), 0) / Math.max(1, oldActivities.filter(a => a.compliance).length);

    const oldPerformance = (oldCompletionRate * 40) + (oldCompliance * 0.6);
    const performanceTrend = (currentPerformance - oldPerformance) / Math.max(1, oldPerformance);

    const predictions = [
      {
        timeframe: '1_week' as const,
        predictedValue: Math.max(0, Math.min(100, currentPerformance * (1 + performanceTrend * 0.5))),
        confidence: Math.min(88, 50 + (recentActivities.length * 3)),
        factors: this.getPerformanceFactors(activities)
      },
      {
        timeframe: '1_month' as const,
        predictedValue: Math.max(0, Math.min(100, currentPerformance * (1 + performanceTrend * 1.5))),
        confidence: Math.min(82, 45 + (recentActivities.length * 2.5)),
        factors: this.getPerformanceFactors(activities)
      },
      {
        timeframe: '3_months' as const,
        predictedValue: Math.max(0, Math.min(100, currentPerformance * (1 + performanceTrend * 3))),
        confidence: Math.min(75, 40 + (recentActivities.length * 2)),
        factors: this.getPerformanceFactors(activities)
      }
    ];

    return {
      metric: 'overall_performance',
      currentValue: currentPerformance,
      predictions,
      recommendations: this.generatePerformanceRecommendations(currentPerformance, performanceTrend)
    };
  }

  // Helper methods for factors and recommendations
  private static getFrequencyFactors(activities: TrainingActivity[]): string[] {
    const factors = ['Historical workout patterns', 'Seasonal trends'];
    const recentSkipped = activities.slice(-7).filter(a => !a.completed).length;
    if (recentSkipped > 2) factors.push('Recent missed sessions');
    return factors;
  }

  private static getComplianceFactors(activities: TrainingActivity[]): string[] {
    return ['Workout consistency', 'Duration accuracy', 'Intensity matching', 'Exercise completion'];
  }

  private static getPerformanceFactors(activities: TrainingActivity[]): string[] {
    return ['Overall compliance trends', 'Workout completion rates', 'Training consistency', 'Goal achievement pace'];
  }

  private static generateFrequencyRecommendations(frequency: number, trend: number): Array<{ action: string; impact: 'low' | 'medium' | 'high'; effort: 'low' | 'medium' | 'high' }> {
    const recommendations = [];

    if (frequency < 3) {
      recommendations.push({
        action: 'Increase workout frequency to at least 3 times per week',
        impact: 'high' as const,
        effort: 'medium' as const
      });
    }

    if (trend < -0.2) {
      recommendations.push({
        action: 'Address recent decline in workout frequency',
        impact: 'high' as const,
        effort: 'high' as const
      });
    } else if (trend > 0.2) {
      recommendations.push({
        action: 'Maintain current positive momentum',
        impact: 'medium' as const,
        effort: 'low' as const
      });
    }

    return recommendations;
  }

  private static generateComplianceRecommendations(compliance: number, slope: number): Array<{ action: string; impact: 'low' | 'medium' | 'high'; effort: 'low' | 'medium' | 'high' }> {
    const recommendations = [];

    if (compliance < 60) {
      recommendations.push({
        action: 'Focus on completing planned workout durations',
        impact: 'high' as const,
        effort: 'medium' as const
      });
    }

    if (slope < -0.5) {
      recommendations.push({
        action: 'Review and adjust workout intensity levels',
        impact: 'medium' as const,
        effort: 'low' as const
      });
    }

    return recommendations;
  }

  private static generatePerformanceRecommendations(performance: number, trend: number): Array<{ action: string; impact: 'low' | 'medium' | 'high'; effort: 'low' | 'medium' | 'high' }> {
    const recommendations = [];

    if (performance < 70) {
      recommendations.push({
        action: 'Implement structured workout plan',
        impact: 'high' as const,
        effort: 'high' as const
      });
    }

    if (trend < -0.1) {
      recommendations.push({
        action: 'Add recovery periods to prevent burnout',
        impact: 'medium' as const,
        effort: 'low' as const
      });
    }

    return recommendations;
  }

  private static createDefaultPrediction(metric: string, currentValue: number): PerformancePrediction {
    return {
      metric,
      currentValue,
      predictions: [
        {
          timeframe: '1_week' as const,
          predictedValue: currentValue,
          confidence: 30,
          factors: ['Insufficient historical data']
        },
        {
          timeframe: '1_month' as const,
          predictedValue: currentValue,
          confidence: 25,
          factors: ['Insufficient historical data']
        },
        {
          timeframe: '3_months' as const,
          predictedValue: currentValue,
          confidence: 20,
          factors: ['Insufficient historical data']
        }
      ],
      recommendations: [{
        action: 'Continue tracking workouts for better predictions',
        impact: 'medium' as const,
        effort: 'low' as const
      }]
    };
  }
}