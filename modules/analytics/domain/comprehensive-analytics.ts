export type AnalyticsTimeframe = 'week' | 'month' | 'quarter' | 'year';

export interface AnalyticsActivityInput {
  distance?: number;
  total_elevation_gain?: number;
  moving_time?: number;
  average_heartrate?: number;
  type?: string;
  start_date?: string;
  date?: string;
}

export interface PerformanceMetrics {
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  averageHeartRate: number;
  averagePace: number;
  workoutFrequency: number;
  intensityDistribution: {
    low: number;
    moderate: number;
    high: number;
    maximum: number;
  };
}

export interface TrendData {
  metric: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  unit: string;
}

export interface ComparisonData {
  userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  userMetrics: PerformanceMetrics;
  benchmarks: {
    level: PerformanceMetrics;
    nextLevel: PerformanceMetrics;
  };
}

const DEFAULT_VARIANCE_FACTORS: Record<string, number> = {
  'Weekly Distance': 0.9,
  'Elevation Gain': 0.89,
  'Training Time': 1.07,
  'Average Heart Rate': 1.02,
  'Workout Frequency': 0.91,
};

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function calculatePerformanceMetrics(
  activities: AnalyticsActivityInput[]
): PerformanceMetrics {
  if (activities.length === 0) {
    return {
      totalDistance: 0,
      totalElevation: 0,
      totalTime: 0,
      averageHeartRate: 0,
      averagePace: 0,
      workoutFrequency: 0,
      intensityDistribution: { low: 0, moderate: 0, high: 0, maximum: 0 },
    };
  }

  const totalDistance =
    activities.reduce((sum, activity) => sum + toNumber(activity.distance), 0) /
    1000;
  const totalElevation = activities.reduce(
    (sum, activity) => sum + toNumber(activity.total_elevation_gain),
    0
  );
  const totalTime =
    activities.reduce((sum, activity) => sum + toNumber(activity.moving_time), 0) /
    3600;

  const heartRateActivities = activities.filter(
    (activity) => toNumber(activity.average_heartrate) > 0
  );
  const averageHeartRate =
    heartRateActivities.length > 0
      ? heartRateActivities.reduce(
          (sum, activity) => sum + toNumber(activity.average_heartrate),
          0
        ) / heartRateActivities.length
      : 0;

  const averagePace = totalDistance > 0 ? (totalTime * 60) / totalDistance : 0;
  const timeSpan = getTimeSpanInWeeks(activities);
  const workoutFrequency = timeSpan > 0 ? activities.length / timeSpan : 0;

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalElevation: Math.round(totalElevation),
    totalTime: Math.round(totalTime * 10) / 10,
    averageHeartRate: Math.round(averageHeartRate),
    averagePace: Math.round(averagePace * 10) / 10,
    workoutFrequency: Math.round(workoutFrequency * 10) / 10,
    intensityDistribution: calculateIntensityDistribution(activities),
  };
}

export function calculateIntensityDistribution(
  activities: AnalyticsActivityInput[]
): PerformanceMetrics['intensityDistribution'] {
  if (activities.length === 0) {
    return { low: 0, moderate: 0, high: 0, maximum: 0 };
  }

  let low = 0;
  let moderate = 0;
  let high = 0;
  let maximum = 0;

  activities.forEach((activity) => {
    const averageHeartRate = toNumber(activity.average_heartrate);
    if (averageHeartRate > 0) {
      if (averageHeartRate < 120) low += 1;
      else if (averageHeartRate < 140) moderate += 1;
      else if (averageHeartRate < 160) high += 1;
      else maximum += 1;
      return;
    }

    const type = activity.type?.toLowerCase() ?? '';
    if (type.includes('walk') || type.includes('yoga')) low += 1;
    else if (type.includes('hike') || type.includes('bike')) moderate += 1;
    else if (type.includes('run') || type.includes('climb')) high += 1;
    else moderate += 1;
  });

  const total = activities.length;
  return {
    low: Math.round((low / total) * 100),
    moderate: Math.round((moderate / total) * 100),
    high: Math.round((high / total) * 100),
    maximum: Math.round((maximum / total) * 100),
  };
}

export function calculateTrends(
  activities: AnalyticsActivityInput[]
): TrendData[] {
  const currentMetrics = calculatePerformanceMetrics(activities);

  const trends: TrendData[] = [
    {
      metric: 'Weekly Distance',
      current:
        Math.round(
          ((currentMetrics.totalDistance * currentMetrics.workoutFrequency) / 4) *
            10
        ) / 10,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'km',
    },
    {
      metric: 'Elevation Gain',
      current: currentMetrics.totalElevation,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'm',
    },
    {
      metric: 'Training Time',
      current: currentMetrics.totalTime,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'hrs',
    },
    {
      metric: 'Average Heart Rate',
      current: currentMetrics.averageHeartRate,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'bpm',
    },
    {
      metric: 'Workout Frequency',
      current: currentMetrics.workoutFrequency,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: '/week',
    },
  ];

  return trends.map((trend) => {
    const varianceFactor = DEFAULT_VARIANCE_FACTORS[trend.metric] ?? 1;
    const previous = Math.round(trend.current * varianceFactor * 10) / 10;
    const change = trend.current - previous;
    const changePercent =
      previous > 0 ? Math.round((change / previous) * 1000) / 10 : 0;

    let direction: TrendData['trend'] = 'stable';
    if (Math.abs(changePercent) >= 2) {
      direction = changePercent > 0 ? 'up' : 'down';
    }

    return {
      ...trend,
      previous,
      changePercent,
      trend: direction,
    };
  });
}

export function generateLevelComparison(
  userMetrics: PerformanceMetrics
): ComparisonData {
  const levelBenchmarks = {
    beginner: {
      totalDistance: 50,
      totalElevation: 3000,
      totalTime: 20,
      averageHeartRate: 150,
      averagePace: 8,
      workoutFrequency: 3,
      intensityDistribution: { low: 60, moderate: 25, high: 10, maximum: 5 },
    },
    intermediate: {
      totalDistance: 120,
      totalElevation: 8000,
      totalTime: 40,
      averageHeartRate: 145,
      averagePace: 7,
      workoutFrequency: 4,
      intensityDistribution: { low: 50, moderate: 30, high: 15, maximum: 5 },
    },
    advanced: {
      totalDistance: 200,
      totalElevation: 15000,
      totalTime: 70,
      averageHeartRate: 140,
      averagePace: 6,
      workoutFrequency: 5,
      intensityDistribution: { low: 40, moderate: 35, high: 20, maximum: 5 },
    },
    expert: {
      totalDistance: 300,
      totalElevation: 25000,
      totalTime: 100,
      averageHeartRate: 135,
      averagePace: 5.5,
      workoutFrequency: 6,
      intensityDistribution: { low: 30, moderate: 40, high: 25, maximum: 5 },
    },
  };

  let userLevel: keyof typeof levelBenchmarks = 'beginner';
  if (userMetrics.totalDistance >= levelBenchmarks.expert.totalDistance * 0.8) {
    userLevel = 'expert';
  } else if (
    userMetrics.totalDistance >=
    levelBenchmarks.advanced.totalDistance * 0.8
  ) {
    userLevel = 'advanced';
  } else if (
    userMetrics.totalDistance >=
    levelBenchmarks.intermediate.totalDistance * 0.8
  ) {
    userLevel = 'intermediate';
  }

  const levelOrder: (keyof typeof levelBenchmarks)[] = [
    'beginner',
    'intermediate',
    'advanced',
    'expert',
  ];
  const currentIndex = levelOrder.indexOf(userLevel);
  const nextLevel =
    currentIndex < levelOrder.length - 1
      ? levelOrder[currentIndex + 1]
      : userLevel;

  return {
    userLevel,
    userMetrics,
    benchmarks: {
      level: levelBenchmarks[userLevel],
      nextLevel: levelBenchmarks[nextLevel],
    },
  };
}

export function getTimeSpanInWeeks(
  activities: AnalyticsActivityInput[]
): number {
  if (activities.length === 0) {
    return 0;
  }

  const dates = activities
    .map((activity) => activity.start_date ?? activity.date)
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime());

  if (dates.length === 0) {
    return 1;
  }

  const earliest = dates[0];
  const latest = dates[dates.length - 1];
  const diffTime = latest.getTime() - earliest.getTime();
  const diffWeeks = diffTime / (1000 * 60 * 60 * 24 * 7);

  return Math.max(diffWeeks, 1);
}

export function getSamplePerformanceMetrics(): PerformanceMetrics {
  return {
    totalDistance: 125.6,
    totalElevation: 8450,
    totalTime: 45.2,
    averageHeartRate: 142,
    averagePace: 6.8,
    workoutFrequency: 4.2,
    intensityDistribution: {
      low: 45,
      moderate: 30,
      high: 20,
      maximum: 5,
    },
  };
}

export function getSampleTrendData(): TrendData[] {
  return calculateTrends([
    {
      distance: 31400,
      total_elevation_gain: 2115,
      moving_time: 40680,
      average_heartrate: 142,
      type: 'Run',
      start_date: '2026-03-07T06:00:00.000Z',
    },
    {
      distance: 32000,
      total_elevation_gain: 1900,
      moving_time: 38000,
      average_heartrate: 140,
      type: 'Hike',
      start_date: '2026-03-02T06:00:00.000Z',
    },
    {
      distance: 25000,
      total_elevation_gain: 4435,
      moving_time: 83940,
      average_heartrate: 144,
      type: 'Run',
      start_date: '2026-02-25T06:00:00.000Z',
    },
  ]);
}
