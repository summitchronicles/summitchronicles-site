import {
  calculatePerformanceMetrics,
  calculateTrends,
  generateLevelComparison,
  getSamplePerformanceMetrics,
  getSampleTrendData,
  type AnalyticsActivityInput,
  type AnalyticsTimeframe,
  type ComparisonData,
  type PerformanceMetrics,
  type TrendData,
} from '@/modules/analytics/domain/comprehensive-analytics';

interface ComprehensiveAnalyticsRequest {
  activities?: AnalyticsActivityInput[];
  timeframe?: AnalyticsTimeframe;
  includeComparison?: boolean;
  includeTrends?: boolean;
}

interface ComprehensiveAnalyticsOptions {
  now?: Date;
}

export interface ComprehensiveAnalyticsBody {
  success: boolean;
  metrics: PerformanceMetrics;
  trends: TrendData[];
  comparison: ComparisonData | null;
  meta: {
    timeframe?: AnalyticsTimeframe;
    activitiesAnalyzed?: number;
    generatedAt: string;
    isSampleData?: boolean;
  };
}

export function createComprehensiveAnalyticsResponse(
  request: ComprehensiveAnalyticsRequest,
  options: ComprehensiveAnalyticsOptions = {}
): {
  status: number;
  body: ComprehensiveAnalyticsBody;
} {
  const activities = Array.isArray(request.activities) ? request.activities : [];
  const timeframe = request.timeframe ?? 'month';
  const metrics = calculatePerformanceMetrics(activities);
  const trends = request.includeTrends ? calculateTrends(activities) : [];
  const comparison = request.includeComparison
    ? generateLevelComparison(metrics)
    : null;

  return {
    status: 200,
    body: {
      success: true,
      metrics,
      trends,
      comparison,
      meta: {
        timeframe,
        activitiesAnalyzed: activities.length,
        generatedAt: (options.now ?? new Date()).toISOString(),
      },
    },
  };
}

export function createComprehensiveAnalyticsSampleResponse(
  now: Date = new Date()
): {
  status: number;
  body: ComprehensiveAnalyticsBody;
} {
  const metrics = getSamplePerformanceMetrics();
  const trends = getSampleTrendData();

  return {
    status: 200,
    body: {
      success: true,
      metrics,
      trends,
      comparison: generateLevelComparison(metrics),
      meta: {
        generatedAt: now.toISOString(),
        isSampleData: true,
      },
    },
  };
}
