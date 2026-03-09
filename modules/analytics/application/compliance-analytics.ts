import {
  ComplianceEngine,
  type ComplianceAlert,
  type PerformanceAnalytics,
  type TrendAnalysis,
} from '@/modules/analytics/domain/compliance-engine';
import type { TrainingActivity } from '@/modules/training/domain/training-plan';

type ComplianceTimeframe = 'week' | 'month' | 'quarter' | 'year';
type ComplianceAction =
  | 'calculate_compliance'
  | 'analyze_performance'
  | 'analyze_trends'
  | 'full_analysis';

interface ComplianceGetOptions {
  timeframe?: string | null;
  includeAlerts?: boolean;
  includeTrends?: boolean;
  now?: Date;
}

interface CompliancePostRequest {
  activities?: TrainingActivity[];
  action?: string;
}

function shiftDate(now: Date, days: number): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
}

export function createMockComplianceActivities(
  now: Date = new Date()
): TrainingActivity[] {
  return [
    {
      id: '1',
      title: 'Morning Strength Training',
      type: 'strength',
      duration: 60,
      intensity: 'medium',
      exercises: [
        { name: 'Squats', sets: 3, reps: 12, rpe: '7', restTime: 90 },
        { name: 'Deadlifts', sets: 3, reps: 8, rpe: '8', restTime: 120 },
      ],
      completed: true,
      date: shiftDate(now, 2),
      status: 'completed',
      actual: {
        duration: 58,
        heartRate: { avg: 145, max: 165 },
        calories: 420,
        completedAt: `${shiftDate(now, 2)}T07:30:00Z`,
      },
      compliance: {
        durationMatch: 97,
        intensityMatch: 95,
        distanceMatch: 100,
        overallScore: 97,
        completed: true,
        notes: ['Excellent workout completion'],
      },
    },
    {
      id: '2',
      title: 'Cardio Run',
      type: 'cardio',
      duration: 45,
      intensity: 'high',
      completed: true,
      date: shiftDate(now, 5),
      status: 'completed',
      actual: {
        duration: 42,
        heartRate: { avg: 175, max: 190 },
        calories: 380,
        completedAt: `${shiftDate(now, 5)}T06:15:00Z`,
      },
      compliance: {
        durationMatch: 93,
        intensityMatch: 100,
        distanceMatch: 100,
        overallScore: 97,
        completed: true,
        notes: ['High intensity maintained well'],
      },
    },
    {
      id: '3',
      title: 'Technical Climbing',
      type: 'technical',
      duration: 90,
      intensity: 'medium',
      completed: false,
      date: shiftDate(now, 8),
      status: 'skipped',
    },
    {
      id: '4',
      title: 'Recovery Walk',
      type: 'cardio',
      duration: 30,
      intensity: 'low',
      completed: true,
      date: shiftDate(now, 12),
      status: 'completed',
      actual: {
        duration: 35,
        heartRate: { avg: 110, max: 125 },
        calories: 150,
        completedAt: `${shiftDate(now, 12)}T08:00:00Z`,
      },
      compliance: {
        durationMatch: 83,
        intensityMatch: 100,
        distanceMatch: 100,
        overallScore: 94,
        completed: true,
        notes: ['Slightly longer than planned, good recovery'],
      },
    },
  ];
}

function normalizeTimeframe(value: string | null | undefined): ComplianceTimeframe {
  switch (value) {
    case 'week':
    case 'quarter':
    case 'year':
      return value;
    case 'month':
    default:
      return 'month';
  }
}

function filterActivitiesByTimeframe(
  activities: TrainingActivity[],
  timeframe: ComplianceTimeframe,
  now: Date
): TrainingActivity[] {
  const days =
    timeframe === 'week'
      ? 7
      : timeframe === 'month'
        ? 30
        : timeframe === 'quarter'
          ? 90
          : 365;
  const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return activities.filter((activity) => new Date(activity.date) >= threshold);
}

export function createComplianceAnalyticsGetResponse(
  options: ComplianceGetOptions = {}
): {
  status: number;
  body: {
    success: boolean;
    timeframe: ComplianceTimeframe;
    dataPoints: number;
    analytics: PerformanceAnalytics;
    summary: ReturnType<typeof ComplianceEngine.analyzeCompliance>['summary'];
    trends?: TrendAnalysis;
    alerts?: ComplianceAlert[];
  };
} {
  const timeframe = normalizeTimeframe(options.timeframe);
  const activities = filterActivitiesByTimeframe(
    createMockComplianceActivities(options.now ?? new Date()),
    timeframe,
    options.now ?? new Date()
  );
  const analysis = ComplianceEngine.analyzeCompliance(activities);

  return {
    status: 200,
    body: {
      success: true,
      timeframe,
      dataPoints: activities.length,
      analytics: analysis.analytics,
      summary: analysis.summary,
      ...(options.includeTrends ? { trends: analysis.trends } : {}),
      ...(options.includeAlerts ? { alerts: analysis.alerts } : {}),
    },
  };
}

export function createComplianceAnalyticsPostResponse(
  request: CompliancePostRequest
): {
  status: number;
  body: Record<string, unknown>;
} {
  const activities = request.activities;
  const action = request.action as ComplianceAction | undefined;

  if (!activities || !Array.isArray(activities)) {
    return {
      status: 400,
      body: {
        error: 'Invalid activities data',
        code: 'INVALID_DATA',
        help: 'Provide an array of training activities',
      },
    };
  }

  switch (action) {
    case 'calculate_compliance': {
      const complianceResults = activities.map((activity) => ({
        ...activity,
        compliance: ComplianceEngine.calculateCompliance(activity, activity),
      }));

      return {
        status: 200,
        body: {
          success: true,
          action,
          activities: complianceResults,
          message: `Calculated compliance for ${complianceResults.length} activities`,
        },
      };
    }

    case 'analyze_performance':
      return {
        status: 200,
        body: {
          success: true,
          action,
          analytics: ComplianceEngine.calculatePerformanceAnalytics(activities),
          message: 'Performance analysis completed',
        },
      };

    case 'analyze_trends':
      return {
        status: 200,
        body: {
          success: true,
          action,
          trends: ComplianceEngine.analyzeTrends(activities),
          message: 'Trend analysis completed',
        },
      };

    case 'full_analysis':
      return {
        status: 200,
        body: {
          success: true,
          action,
          ...ComplianceEngine.analyzeCompliance(activities),
          message: 'Full compliance analysis completed',
        },
      };

    default:
      return {
        status: 400,
        body: {
          error: 'Invalid action parameter',
          code: 'INVALID_ACTION',
          validActions: [
            'calculate_compliance',
            'analyze_performance',
            'analyze_trends',
            'full_analysis',
          ],
        },
      };
  }
}
