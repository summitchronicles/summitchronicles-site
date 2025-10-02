import { TrainingActivity } from '../app/api/training/upload/route';

export interface ComplianceMetrics {
  durationMatch: number;
  intensityMatch: number;
  distanceMatch: number;
  overallScore: number;
  completed: boolean;
  notes: string[];
}

export interface PerformanceAnalytics {
  weeklyCompliance: number;
  monthlyCompliance: number;
  totalWorkouts: number;
  completedWorkouts: number;
  skippedWorkouts: number;
  averageDuration: number;
  averageIntensity: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
  riskFactors: string[];
  recommendations: string[];
}

export interface TrendAnalysis {
  complianceHistory: Array<{
    date: string;
    score: number;
    workoutsCompleted: number;
    workoutsPlanned: number;
  }>;
  performancePatterns: {
    bestDays: string[];
    worstDays: string[];
    optimalDuration: number;
    preferredIntensity: string;
  };
  goals: {
    current: GoalMetrics;
    projections: GoalProjection[];
  };
}

export interface GoalMetrics {
  weeklyTarget: number;
  monthlyTarget: number;
  currentWeekProgress: number;
  currentMonthProgress: number;
  streakDays: number;
  longestStreak: number;
}

export interface GoalProjection {
  timeframe: 'week' | 'month' | 'quarter';
  target: number;
  projected: number;
  confidence: number;
  requiredWeeklyRate: number;
}

export interface ComplianceAlert {
  type: 'missed_workout' | 'declining_performance' | 'goal_at_risk' | 'improvement_opportunity';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  actionItems: string[];
  dueDate?: string;
}

export class ComplianceEngine {
  private static readonly COMPLIANCE_WEIGHTS = {
    duration: 0.4,
    intensity: 0.3,
    completion: 0.3
  };

  // Advanced scoring thresholds for performance categorization
  private static readonly PERFORMANCE_THRESHOLDS = {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 40
  };

  // Risk assessment factors and weights
  private static readonly RISK_FACTORS = {
    consistencyWeight: 0.3,
    intensityVariabilityWeight: 0.25,
    recoveryWeight: 0.25,
    progressWeight: 0.2
  };

  private static readonly INTENSITY_HEART_RATE_ZONES = {
    low: { min: 60, max: 130 },
    medium: { min: 130, max: 160 },
    high: { min: 160, max: 200 }
  };

  // Core compliance calculation
  static calculateCompliance(
    planned: TrainingActivity,
    actual?: Partial<TrainingActivity>
  ): ComplianceMetrics {
    if (!actual || !actual.completed) {
      return {
        durationMatch: 0,
        intensityMatch: 0,
        distanceMatch: 0,
        overallScore: 0,
        completed: false,
        notes: ['Workout not completed']
      };
    }

    const metrics: ComplianceMetrics = {
      durationMatch: 100,
      intensityMatch: 100,
      distanceMatch: 100,
      overallScore: 100,
      completed: true,
      notes: []
    };

    // Duration compliance
    if (planned.duration && actual.actual?.duration) {
      const plannedMinutes = planned.duration;
      const actualMinutes = actual.actual.duration;
      const variance = Math.abs(actualMinutes - plannedMinutes) / plannedMinutes;

      metrics.durationMatch = Math.round(Math.max(0, 100 - (variance * 100)));

      if (variance > 0.2) {
        const diff = actualMinutes - plannedMinutes;
        metrics.notes.push(
          `Duration ${diff > 0 ? 'exceeded' : 'under'} target by ${Math.abs(diff)} minutes`
        );
      }
    }

    // Intensity compliance (based on heart rate if available)
    if (planned.intensity && actual.actual?.heartRate?.avg) {
      const targetZone = this.INTENSITY_HEART_RATE_ZONES[planned.intensity as keyof typeof this.INTENSITY_HEART_RATE_ZONES];
      const avgHR = actual.actual.heartRate.avg;

      if (avgHR >= targetZone.min && avgHR <= targetZone.max) {
        metrics.intensityMatch = 100;
      } else {
        const distanceFromZone = avgHR < targetZone.min
          ? (targetZone.min - avgHR) / targetZone.min
          : (avgHR - targetZone.max) / targetZone.max;

        metrics.intensityMatch = Math.round(Math.max(0, 100 - (distanceFromZone * 100)));

        const intensity = avgHR < targetZone.min ? 'lower' : 'higher';
        metrics.notes.push(`Heart rate ${intensity} than target ${planned.intensity} zone`);
      }
    }

    // Distance compliance (if applicable)
    if (planned.exercises && actual.exercises) {
      // For strength workouts, compare completed exercises
      const plannedExercises = planned.exercises.length;
      const completedExercises = actual.exercises.length;
      metrics.distanceMatch = Math.round((completedExercises / plannedExercises) * 100);

      if (completedExercises < plannedExercises) {
        metrics.notes.push(`Completed ${completedExercises}/${plannedExercises} exercises`);
      }
    }

    // Calculate weighted overall score
    const validScores = [];
    if (planned.duration) validScores.push({ score: metrics.durationMatch, weight: this.COMPLIANCE_WEIGHTS.duration });
    if (planned.intensity) validScores.push({ score: metrics.intensityMatch, weight: this.COMPLIANCE_WEIGHTS.intensity });
    validScores.push({ score: metrics.distanceMatch, weight: this.COMPLIANCE_WEIGHTS.completion });

    const totalWeight = validScores.reduce((sum, item) => sum + item.weight, 0);
    const weightedScore = validScores.reduce((sum, item) => sum + (item.score * item.weight), 0);

    metrics.overallScore = Math.round(weightedScore / totalWeight);

    return metrics;
  }

  // Performance analytics calculation
  static calculatePerformanceAnalytics(activities: TrainingActivity[]): PerformanceAnalytics {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyActivities = activities.filter(a => new Date(a.date) >= oneWeekAgo);
    const monthlyActivities = activities.filter(a => new Date(a.date) >= oneMonthAgo);

    const completedActivities = activities.filter(a => a.completed);
    const skippedActivities = activities.filter(a => a.status === 'skipped');

    // Calculate compliance scores
    const weeklyScores = weeklyActivities
      .filter(a => a.compliance)
      .map(a => a.compliance!.overallScore);

    const monthlyScores = monthlyActivities
      .filter(a => a.compliance)
      .map(a => a.compliance!.overallScore);

    const weeklyCompliance = weeklyScores.length > 0
      ? Math.round(weeklyScores.reduce((sum, score) => sum + score, 0) / weeklyScores.length)
      : 0;

    const monthlyCompliance = monthlyScores.length > 0
      ? Math.round(monthlyScores.reduce((sum, score) => sum + score, 0) / monthlyScores.length)
      : 0;

    // Calculate averages
    const averageDuration = completedActivities.length > 0
      ? Math.round(completedActivities.reduce((sum, a) => sum + (a.actual?.duration || a.duration), 0) / completedActivities.length)
      : 0;

    const intensityMap = { low: 1, medium: 2, high: 3 };
    const averageIntensity = completedActivities.length > 0
      ? completedActivities.reduce((sum, a) => sum + intensityMap[a.intensity as keyof typeof intensityMap], 0) / completedActivities.length
      : 0;

    // Determine improvement trend
    const recentScores = monthlyScores.slice(-14); // Last 2 weeks
    const earlierScores = monthlyScores.slice(0, -14); // Earlier data

    let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentScores.length > 0 && earlierScores.length > 0) {
      const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
      const earlierAvg = earlierScores.reduce((sum, score) => sum + score, 0) / earlierScores.length;
      const improvement = ((recentAvg - earlierAvg) / earlierAvg) * 100;

      if (improvement > 5) improvementTrend = 'improving';
      else if (improvement < -5) improvementTrend = 'declining';
    }

    // Identify risk factors
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    if (weeklyCompliance < 70) {
      riskFactors.push('Low weekly compliance');
      recommendations.push('Focus on consistency rather than intensity');
    }

    if (skippedActivities.length > completedActivities.length * 0.2) {
      riskFactors.push('High skip rate');
      recommendations.push('Review workout difficulty and scheduling');
    }

    if (improvementTrend === 'declining') {
      riskFactors.push('Declining performance trend');
      recommendations.push('Consider rest days or reduce training intensity');
    }

    if (averageDuration < 30) {
      recommendations.push('Consider increasing workout duration for better results');
    }

    return {
      weeklyCompliance,
      monthlyCompliance,
      totalWorkouts: activities.length,
      completedWorkouts: completedActivities.length,
      skippedWorkouts: skippedActivities.length,
      averageDuration,
      averageIntensity,
      improvementTrend,
      riskFactors,
      recommendations
    };
  }

  // Trend analysis
  static analyzeTrends(activities: TrainingActivity[]): TrendAnalysis {
    // Group activities by date for compliance history
    const activityGroups = activities.reduce((groups, activity) => {
      const date = activity.date;
      if (!groups[date]) {
        groups[date] = { planned: [], completed: [] };
      }
      groups[date].planned.push(activity);
      if (activity.completed) {
        groups[date].completed.push(activity);
      }
      return groups;
    }, {} as Record<string, { planned: TrainingActivity[], completed: TrainingActivity[] }>);

    const complianceHistory = Object.entries(activityGroups)
      .map(([date, data]) => {
        const scores = data.completed
          .filter(a => a.compliance)
          .map(a => a.compliance!.overallScore);

        const avgScore = scores.length > 0
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : 0;

        return {
          date,
          score: avgScore,
          workoutsCompleted: data.completed.length,
          workoutsPlanned: data.planned.length
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Analyze performance patterns
    const dayOfWeekPerformance = activities.reduce((patterns, activity) => {
      const dayOfWeek = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (!patterns[dayOfWeek]) {
        patterns[dayOfWeek] = { total: 0, completed: 0, avgScore: 0 };
      }
      patterns[dayOfWeek].total++;
      if (activity.completed) {
        patterns[dayOfWeek].completed++;
        if (activity.compliance) {
          patterns[dayOfWeek].avgScore += activity.compliance.overallScore;
        }
      }
      return patterns;
    }, {} as Record<string, { total: number, completed: number, avgScore: number }>);

    // Calculate average scores for each day
    Object.keys(dayOfWeekPerformance).forEach(day => {
      const data = dayOfWeekPerformance[day];
      data.avgScore = data.completed > 0 ? data.avgScore / data.completed : 0;
    });

    const sortedDays = Object.entries(dayOfWeekPerformance)
      .sort((a, b) => b[1].avgScore - a[1].avgScore);

    const bestDays = sortedDays.slice(0, 3).map(([day]) => day);
    const worstDays = sortedDays.slice(-2).map(([day]) => day);

    // Calculate optimal duration and preferred intensity
    const completedActivities = activities.filter(a => a.completed && a.compliance);
    const optimalDuration = completedActivities.length > 0
      ? Math.round(completedActivities
          .filter(a => a.compliance!.overallScore >= 80)
          .reduce((sum, a) => sum + (a.actual?.duration || a.duration), 0)
          / completedActivities.filter(a => a.compliance!.overallScore >= 80).length || 1)
      : 60;

    const intensityPerformance = completedActivities.reduce((perf, activity) => {
      if (!perf[activity.intensity]) {
        perf[activity.intensity] = { count: 0, totalScore: 0 };
      }
      perf[activity.intensity].count++;
      perf[activity.intensity].totalScore += activity.compliance!.overallScore;
      return perf;
    }, {} as Record<string, { count: number, totalScore: number }>);

    const preferredIntensity = Object.entries(intensityPerformance)
      .map(([intensity, data]) => ({
        intensity,
        avgScore: data.totalScore / data.count
      }))
      .sort((a, b) => b.avgScore - a.avgScore)[0]?.intensity || 'medium';

    // Goal calculations
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisWeekActivities = activities.filter(a => new Date(a.date) >= currentWeekStart);
    const thisMonthActivities = activities.filter(a => new Date(a.date) >= currentMonthStart);

    const weeklyTarget = 5; // Default target
    const monthlyTarget = 20; // Default target

    const currentWeekProgress = thisWeekActivities.filter(a => a.completed).length;
    const currentMonthProgress = thisMonthActivities.filter(a => a.completed).length;

    // Calculate streak
    const sortedActivities = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streakDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;

    for (const activity of sortedActivities) {
      if (activity.completed) {
        currentStreak++;
        if (streakDays === 0) streakDays = currentStreak;
      } else {
        if (currentStreak > longestStreak) longestStreak = currentStreak;
        currentStreak = 0;
      }
    }

    if (currentStreak > longestStreak) longestStreak = currentStreak;

    // Generate projections
    const weeklyCompletionRate = currentWeekProgress / Math.max(thisWeekActivities.length, 1);
    const monthlyCompletionRate = currentMonthProgress / Math.max(thisMonthActivities.length, 1);

    const projections: GoalProjection[] = [
      {
        timeframe: 'week',
        target: weeklyTarget,
        projected: Math.round(weeklyCompletionRate * weeklyTarget),
        confidence: Math.min(95, weeklyCompletionRate * 100),
        requiredWeeklyRate: weeklyTarget
      },
      {
        timeframe: 'month',
        target: monthlyTarget,
        projected: Math.round(monthlyCompletionRate * monthlyTarget),
        confidence: Math.min(95, monthlyCompletionRate * 100),
        requiredWeeklyRate: Math.ceil(monthlyTarget / 4)
      }
    ];

    return {
      complianceHistory,
      performancePatterns: {
        bestDays,
        worstDays,
        optimalDuration,
        preferredIntensity
      },
      goals: {
        current: {
          weeklyTarget,
          monthlyTarget,
          currentWeekProgress,
          currentMonthProgress,
          streakDays,
          longestStreak
        },
        projections
      }
    };
  }

  // Generate compliance alerts
  static generateAlerts(
    analytics: PerformanceAnalytics,
    trends: TrendAnalysis
  ): ComplianceAlert[] {
    const alerts: ComplianceAlert[] = [];

    // Check for missed workouts
    if (analytics.weeklyCompliance < 60) {
      alerts.push({
        type: 'missed_workout',
        severity: 'high',
        title: 'Low Weekly Compliance',
        message: `Your weekly compliance is ${analytics.weeklyCompliance}%, significantly below target.`,
        actionItems: [
          'Review your weekly schedule for better workout timing',
          'Consider shorter but more frequent sessions',
          'Identify and remove scheduling conflicts'
        ]
      });
    }

    // Check for declining performance
    if (analytics.improvementTrend === 'declining') {
      alerts.push({
        type: 'declining_performance',
        severity: 'medium',
        title: 'Performance Decline Detected',
        message: 'Your performance metrics show a declining trend over the past two weeks.',
        actionItems: [
          'Consider adding more rest days',
          'Review workout intensity levels',
          'Ensure adequate nutrition and sleep'
        ]
      });
    }

    // Check if goals are at risk
    const weeklyProjection = trends.goals.projections.find(p => p.timeframe === 'week');
    if (weeklyProjection && weeklyProjection.confidence < 70) {
      alerts.push({
        type: 'goal_at_risk',
        severity: 'medium',
        title: 'Weekly Goal at Risk',
        message: `Only ${weeklyProjection.confidence}% confidence in meeting weekly goal.`,
        actionItems: [
          `Complete ${weeklyProjection.target - trends.goals.current.currentWeekProgress} more workouts this week`,
          'Focus on high-impact, shorter sessions',
          'Prioritize remaining planned workouts'
        ]
      });
    }

    // Suggest improvements
    if (analytics.weeklyCompliance > 80 && analytics.averageDuration < 45) {
      alerts.push({
        type: 'improvement_opportunity',
        severity: 'low',
        title: 'Opportunity to Increase Duration',
        message: 'You\'re consistently completing workouts. Consider increasing duration for better results.',
        actionItems: [
          'Gradually increase workout duration by 5-10 minutes',
          'Add warm-up and cool-down periods',
          'Include additional exercises in strength sessions'
        ]
      });
    }

    return alerts;
  }

  // Comprehensive analysis
  static analyzeCompliance(activities: TrainingActivity[]) {
    const analytics = this.calculatePerformanceAnalytics(activities);
    const trends = this.analyzeTrends(activities);
    const alerts = this.generateAlerts(analytics, trends);

    return {
      analytics,
      trends,
      alerts,
      summary: {
        overallHealth: analytics.monthlyCompliance >= 80 ? 'excellent' :
                       analytics.monthlyCompliance >= 60 ? 'good' : 'needs_improvement',
        keyInsights: [
          `${analytics.weeklyCompliance}% weekly compliance`,
          `${analytics.improvementTrend} performance trend`,
          `${trends.goals.current.streakDays} day current streak`
        ],
        nextActions: alerts.slice(0, 3).map(alert => alert.actionItems[0])
      }
    };
  }

  // Advanced Performance Categorization
  static categorizePerformance(score: number): string {
    if (score >= this.PERFORMANCE_THRESHOLDS.excellent) return 'excellent';
    if (score >= this.PERFORMANCE_THRESHOLDS.good) return 'good';
    if (score >= this.PERFORMANCE_THRESHOLDS.average) return 'average';
    if (score >= this.PERFORMANCE_THRESHOLDS.poor) return 'poor';
    return 'critical';
  }

  // Calculate Consistency Score (measures workout regularity)
  static calculateConsistencyScore(activities: TrainingActivity[]): number {
    if (activities.length < 7) return 0;

    // Sort activities by date
    const sortedActivities = activities
      .filter(a => a.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sortedActivities.length < 2) return 0;

    // Calculate gaps between workouts
    const gaps = [];
    for (let i = 1; i < sortedActivities.length; i++) {
      const daysDiff = Math.abs(
        (new Date(sortedActivities[i].date).getTime() -
         new Date(sortedActivities[i-1].date).getTime()) / (1000 * 60 * 60 * 24)
      );
      gaps.push(daysDiff);
    }

    // Calculate consistency score based on gap variability
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation = higher consistency
    const consistencyScore = Math.max(0, 100 - (standardDeviation * 10));
    return Math.round(consistencyScore);
  }

  // Calculate Intensity Variability Score (measures training load distribution)
  static calculateIntensityVariabilityScore(activities: TrainingActivity[]): number {
    const completedActivities = activities.filter(a => a.completed);
    if (completedActivities.length < 3) return 50; // Neutral score for insufficient data

    const intensityMap = { low: 1, medium: 2, high: 3 };
    const intensityScores = completedActivities.map(a => intensityMap[a.intensity]);

    const avgIntensity = intensityScores.reduce((sum, score) => sum + score, 0) / intensityScores.length;
    const variance = intensityScores.reduce((sum, score) => sum + Math.pow(score - avgIntensity, 2), 0) / intensityScores.length;

    // Optimal variance is around 0.5-1.0 (good mix of intensities)
    const optimalVariance = 0.75;
    const varianceDiff = Math.abs(variance - optimalVariance);

    // Convert to score where 0 variance diff = 100 points
    const score = Math.max(0, 100 - (varianceDiff * 80));
    return Math.round(score);
  }

  // Calculate Recovery Balance Score (measures rest day distribution)
  static calculateRecoveryScore(activities: TrainingActivity[]): number {
    if (activities.length < 7) return 50; // Neutral score for insufficient data

    // Sort activities by date
    const sortedActivities = activities
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let recoveryScore = 0;
    let consecutiveWorkoutDays = 0;
    let recoveryViolations = 0;

    for (const activity of sortedActivities) {
      if (activity.completed && activity.intensity === 'high') {
        consecutiveWorkoutDays++;
        if (consecutiveWorkoutDays > 3) {
          recoveryViolations++;
        }
      } else if (activity.type === 'rest' || !activity.completed) {
        consecutiveWorkoutDays = 0;
      }
    }

    // Score based on recovery violations
    recoveryScore = Math.max(0, 100 - (recoveryViolations * 20));
    return Math.round(recoveryScore);
  }

  // Generate Comprehensive Risk Assessment
  static assessRisk(activities: TrainingActivity[]): {
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskScore: number;
    factors: Array<{ factor: string; impact: number; description: string }>;
  } {
    const consistencyScore = this.calculateConsistencyScore(activities);
    const intensityScore = this.calculateIntensityVariabilityScore(activities);
    const recoveryScore = this.calculateRecoveryScore(activities);

    // Calculate weighted risk score
    const riskScore = Math.round(
      (consistencyScore * this.RISK_FACTORS.consistencyWeight) +
      (intensityScore * this.RISK_FACTORS.intensityVariabilityWeight) +
      (recoveryScore * this.RISK_FACTORS.recoveryWeight) +
      (75 * this.RISK_FACTORS.progressWeight) // Default progress score
    );

    const factors = [
      {
        factor: 'Consistency',
        impact: consistencyScore,
        description: consistencyScore < 60 ? 'Irregular workout pattern detected' : 'Good workout consistency'
      },
      {
        factor: 'Intensity Balance',
        impact: intensityScore,
        description: intensityScore < 60 ? 'Poor intensity distribution' : 'Well-balanced training intensity'
      },
      {
        factor: 'Recovery Balance',
        impact: recoveryScore,
        description: recoveryScore < 70 ? 'Insufficient recovery periods' : 'Adequate recovery management'
      }
    ];

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    if (riskScore >= 80) riskLevel = 'low';
    else if (riskScore >= 65) riskLevel = 'moderate';
    else if (riskScore >= 50) riskLevel = 'high';
    else riskLevel = 'critical';

    return { riskLevel, riskScore, factors };
  }

  // Generate Personalized Insights
  static generatePersonalizedInsights(activities: TrainingActivity[]): string[] {
    const insights: string[] = [];

    const consistencyScore = this.calculateConsistencyScore(activities);
    const intensityScore = this.calculateIntensityVariabilityScore(activities);
    const recoveryScore = this.calculateRecoveryScore(activities);

    const completedActivities = activities.filter(a => a.completed);
    const avgDuration = completedActivities.length > 0
      ? completedActivities.reduce((sum, a) => sum + a.duration, 0) / completedActivities.length
      : 0;

    // Consistency insights
    if (consistencyScore < 50) {
      insights.push("Your workout schedule is irregular. Try to establish a consistent routine for better results.");
    } else if (consistencyScore > 85) {
      insights.push("Excellent workout consistency! You're building strong training habits.");
    }

    // Intensity insights
    if (intensityScore < 50) {
      insights.push("Consider varying your workout intensities more for balanced training adaptation.");
    } else if (intensityScore > 80) {
      insights.push("Great intensity balance! You're effectively mixing high and low intensity sessions.");
    }

    // Recovery insights
    if (recoveryScore < 60) {
      insights.push("You may be overtraining. Consider adding more rest days for better recovery.");
    }

    // Duration insights
    if (avgDuration > 90) {
      insights.push("Your workouts are quite long. Consider shorter, more focused sessions for consistency.");
    } else if (avgDuration < 30) {
      insights.push("Your average workout duration is short. Consider extending sessions for greater training effect.");
    }

    return insights.slice(0, 3); // Return top 3 insights
  }
}