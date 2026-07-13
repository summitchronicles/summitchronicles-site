export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrainingMetricCard {
  value: string;
  description: string;
  trend: TrendDirection;
}

export interface TrainingActivityMetric {
  label: string;
  value: string;
  trend: TrendDirection;
}

export interface TrainingPhase {
  phase: string;
  duration: string;
  focus: string;
  status: 'completed' | 'current';
  metrics: TrainingActivityMetric[];
}

export interface AdvancedPerformanceMetric {
  value: number;
  change: number;
  unit: string;
  trend: TrendDirection;
}

export interface PredictionMetric {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
}

export interface ExpeditionProgress {
  completed: string[];
  upcoming: string[];
  progressPercentage: number;
}

export interface RecentTrends {
  weeklyVolume: TrainingMetricCard;
  monthlyActivities: TrainingMetricCard;
  elevationThisWeek: TrainingMetricCard;
  currentFitness: TrainingMetricCard;
}

export interface NormalizedTrainingActivity {
  activityId?: string;
  activityName?: string;
  startTimeLocal?: string;
  distance?: number;
  duration?: number;
  elevationGain?: number;
  averageHR?: number;
  averagePower?: number;
  averageRunningPower?: number;
  vo2MaxValue?: number;
  activityType?: {
    typeKey?: string;
  };
  description?: string;
}

export interface DerivedTrainingWellness {
  bodyBattery: number;
  bodyBatteryTimeline: unknown[];
  stressScore: number;
  vo2Max: number;
  hrvStatus: string;
  restingHR?: number;
}

export interface TrainingMetricsPayload {
  currentStats: {
    sevenSummitsCompleted: TrainingMetricCard;
    trainingYears: TrainingMetricCard;
    totalElevationThisYear: TrainingMetricCard;
    currentRestingHR: TrainingMetricCard;
  };
  trainingPhases: TrainingPhase[];
  recentTrends: RecentTrends;
  expeditionProgress: ExpeditionProgress;
  advancedPerformance: {
    vo2Max: AdvancedPerformanceMetric;
    powerOutput: AdvancedPerformanceMetric;
    lactateThreshold: AdvancedPerformanceMetric;
    recoveryRate: AdvancedPerformanceMetric;
  };
  predictions: PredictionMetric[];
  bodyBattery: number;
  bodyBatteryTimeline: unknown[];
  stressScore: number;
  hrvStatus: string;
  vo2Max: number;
  recentActivities: NormalizedTrainingActivity[];
}

interface CalculationOptions {
  now?: Date;
}

const DEFAULT_EXPEDITION_PROGRESS: ExpeditionProgress = {
  completed: [
    'Kilimanjaro (2022)',
    'Aconcagua (2023)',
    'Elbrus (2023)',
    'Denali (2024)',
  ],
  upcoming: ['Everest (2027)', 'Vinson (TBD)', 'Carstensz Pyramid (TBD)'],
  progressPercentage: 57,
};

export function normalizeTrainingActivities(
  activitiesRaw: any[]
): NormalizedTrainingActivity[] {
  return activitiesRaw.map((activity) => ({
    activityId: activity.id ?? activity.activityId,
    activityName: activity.name ?? activity.activityName,
    startTimeLocal: activity.start_date_local ?? activity.startTimeLocal,
    distance: activity.distance,
    duration: activity.moving_time ?? activity.duration,
    elevationGain: activity.total_elevation_gain ?? activity.elevationGain,
    averageHR: activity.average_heartrate ?? activity.averageHR,
    averagePower: activity.averagePower,
    averageRunningPower: activity.averageRunningPower,
    vo2MaxValue: activity.vo2MaxValue,
    activityType: activity.activityType ?? {
      typeKey: (activity.type || 'unknown').toLowerCase(),
    },
    description: activity.description || '',
  }));
}

export function createDerivedTrainingWellness(
  latestWellness: Record<string, any>,
  manualVo2Max: number
): DerivedTrainingWellness {
  return {
    bodyBattery: 0,
    bodyBatteryTimeline: [],
    stressScore:
      typeof latestWellness.stressScore === 'number'
        ? latestWellness.stressScore
        : typeof latestWellness.stress === 'number'
          ? latestWellness.stress
          : 0,
    vo2Max: latestWellness.vo2max || manualVo2Max,
    hrvStatus: latestWellness.hrv
      ? `${Math.round(latestWellness.hrv)} ms`
      : 'N/A',
    restingHR: latestWellness.restingHR,
  };
}

export function calculateTrainingMetrics(
  activities: NormalizedTrainingActivity[],
  wellness: DerivedTrainingWellness,
  options: CalculationOptions = {}
): TrainingMetricsPayload {
  const now = options.now ?? new Date();
  const currentYear = now.getFullYear();
  const thisYearActivities = activities.filter((activity) => {
    const activityDate = safeDate(activity.startTimeLocal);
    return activityDate !== null && activityDate.getFullYear() === currentYear;
  });

  return {
    currentStats: {
      sevenSummitsCompleted: {
        value: '4/7',
        description: 'Kilimanjaro, Aconcagua, Elbrus, Denali completed',
        trend: 'up',
      },
      trainingYears: {
        value: '11',
        description: 'Since Sar Pass 2014',
        trend: 'up',
      },
      totalElevationThisYear: {
        value: formatElevation(
          thisYearActivities.reduce(
            (total, activity) => total + (activity.elevationGain || 0),
            0
          )
        ),
        description: 'Total vertical gain this year',
        trend: 'up',
      },
      currentRestingHR: {
        value: wellness.restingHR ? `${wellness.restingHR} bpm` : '--',
        description: 'Current resting heart rate',
        trend: 'down',
      },
    },
    trainingPhases: getTrainingPhases(),
    recentTrends: calculateRecentTrends(activities, now),
    expeditionProgress: DEFAULT_EXPEDITION_PROGRESS,
    advancedPerformance: calculateAdvancedPerformance(activities, wellness),
    predictions: calculatePredictions(activities),
    bodyBattery: wellness.bodyBattery,
    bodyBatteryTimeline: wellness.bodyBatteryTimeline,
    stressScore: wellness.stressScore,
    hrvStatus: wellness.hrvStatus,
    vo2Max: wellness.vo2Max,
    recentActivities: [...activities]
      .sort((a, b) => {
        const left = safeDate(a.startTimeLocal)?.getTime() ?? 0;
        const right = safeDate(b.startTimeLocal)?.getTime() ?? 0;
        return right - left;
      })
      .slice(0, 100),
  };
}

export function getFallbackTrainingMetrics(): TrainingMetricsPayload {
  return {
    currentStats: {
      sevenSummitsCompleted: {
        value: '4/7',
        description: 'Kilimanjaro, Aconcagua, Elbrus, Denali completed',
        trend: 'up',
      },
      trainingYears: {
        value: '11',
        description: 'Since Sar Pass 2014',
        trend: 'up',
      },
      totalElevationThisYear: {
        value: '--',
        description: 'No observed elevation data',
        trend: 'stable',
      },
      currentRestingHR: {
        value: '--',
        description: 'No observed recovery data',
        trend: 'stable',
      },
    },
    trainingPhases: [
      {
        phase: 'Base Training',
        duration: 'Aug 2025 - Mar 2027',
        focus: 'Foundation Building',
        status: 'current',
        metrics: [
          {
            label: 'Training Load',
            value: 'Dynamic',
            trend: 'stable',
          },
        ],
      },
    ],
    recentTrends: {
      weeklyVolume: {
        value: '--',
        description: 'No observed weekly training',
        trend: 'stable',
      },
      monthlyActivities: {
        value: '--',
        description: 'No observed monthly activities',
        trend: 'stable',
      },
      elevationThisWeek: {
        value: '0 m',
        description: 'Vertical gain this week',
        trend: 'up',
      },
      currentFitness: {
        value: '--',
        description: 'Fitness model unavailable',
        trend: 'stable',
      },
    },
    expeditionProgress: DEFAULT_EXPEDITION_PROGRESS,
    advancedPerformance: {
      vo2Max: { value: 0, change: 0, unit: 'ml/kg/min', trend: 'stable' },
      powerOutput: { value: 0, change: 0, unit: 'watts', trend: 'stable' },
      lactateThreshold: { value: 0, change: 0, unit: 'bpm', trend: 'stable' },
      recoveryRate: { value: 0, change: 0, unit: '%', trend: 'stable' },
    },
    predictions: [],
    bodyBattery: 0,
    bodyBatteryTimeline: [],
    stressScore: 0,
    hrvStatus: 'N/A',
    vo2Max: 0,
    recentActivities: [],
  };
}

function calculateAdvancedPerformance(
  activities: NormalizedTrainingActivity[],
  wellness: DerivedTrainingWellness
): TrainingMetricsPayload['advancedPerformance'] {
  const sortedActivities = [...activities].sort((a, b) => {
    const left = safeDate(a.startTimeLocal)?.getTime() ?? 0;
    const right = safeDate(b.startTimeLocal)?.getTime() ?? 0;
    return right - left;
  });

  const recentActivities = sortedActivities.slice(0, 30);
  const previousActivities = sortedActivities.slice(30, 60);

  const getAverage = (
    items: NormalizedTrainingActivity[],
    field: keyof NormalizedTrainingActivity
  ) => {
    const validItems = items.filter((item) => {
      const value = item[field];
      return typeof value === 'number';
    });

    if (validItems.length === 0) {
      return 0;
    }

    return (
      validItems.reduce((sum, item) => sum + (item[field] as number), 0) /
      validItems.length
    );
  };

  const currentVo2 =
    wellness.vo2Max || getAverage(recentActivities, 'vo2MaxValue');
  const previousVo2 = getAverage(previousActivities, 'vo2MaxValue');

  const currentPower =
    getAverage(recentActivities, 'averagePower') ||
    getAverage(recentActivities, 'averageRunningPower');
  const previousPower =
    getAverage(previousActivities, 'averagePower') ||
    getAverage(previousActivities, 'averageRunningPower');

  return {
    vo2Max: {
      value: Number(currentVo2.toFixed(1)),
      change: previousVo2 ? Number((currentVo2 - previousVo2).toFixed(1)) : 0,
      unit: 'ml/kg/min',
      trend: getObservedTrend(currentVo2, previousVo2),
    },
    powerOutput: {
      value: Math.round(currentPower),
      change: previousPower ? Math.round(currentPower - previousPower) : 0,
      unit: 'watts',
      trend: getObservedTrend(currentPower, previousPower),
    },
    lactateThreshold: {
      value: 0,
      change: 0,
      unit: 'bpm',
      trend: 'stable',
    },
    recoveryRate: {
      value: 0,
      change: 0,
      unit: '%',
      trend: 'stable',
    },
  };
}

function getTrainingPhases(): TrainingPhase[] {
  return [
    {
      phase: 'Base Building',
      duration: 'Jan - Mar 2022',
      focus: 'Recovery Foundation',
      status: 'completed',
      metrics: [
        { label: 'Total Distance', value: '1250 km', trend: 'up' },
        { label: 'Elevation Gain', value: '15K m', trend: 'up' },
        { label: 'Training Hours', value: '120 hrs', trend: 'up' },
        { label: 'Avg Heart Rate', value: '145 bpm', trend: 'stable' },
      ],
    },
    {
      phase: 'Kilimanjaro Prep',
      duration: 'Apr - Oct 2022',
      focus: 'First Seven Summit',
      status: 'completed',
      metrics: [
        { label: 'Total Distance', value: '850 km', trend: 'up' },
        { label: 'Elevation Gain', value: '45K m', trend: 'up' },
        { label: 'Training Hours', value: '180 hrs', trend: 'up' },
        { label: 'Avg Heart Rate', value: '155 bpm', trend: 'up' },
      ],
    },
    {
      phase: 'Technical Mountains',
      duration: 'Nov 2022 - Jul 2024',
      focus: 'Aconcagua, Elbrus, Denali',
      status: 'completed',
      metrics: [
        { label: 'Total Distance', value: '2100 km', trend: 'up' },
        { label: 'Elevation Gain', value: '180K m', trend: 'up' },
        { label: 'Training Hours', value: '450 hrs', trend: 'up' },
        { label: 'Avg Heart Rate', value: '148 bpm', trend: 'stable' },
      ],
    },
    {
      phase: 'Base Training',
      duration: 'Aug 2025 - Mar 2027',
      focus: 'Foundation Building',
      status: 'current',
      metrics: [
        { label: 'Total Distance', value: '150 km', trend: 'up' },
        { label: 'Elevation Gain', value: '5K m', trend: 'up' },
        { label: 'Training Hours', value: '40 hrs', trend: 'up' },
        { label: 'Avg Heart Rate', value: '142 bpm', trend: 'down' },
      ],
    },
  ];
}

function calculatePredictions(
  _activities: NormalizedTrainingActivity[]
): PredictionMetric[] {
  return [];
}

function calculateRecentTrends(
  activities: NormalizedTrainingActivity[],
  now: Date
): RecentTrends {
  const last30Days = activities.filter((activity) => {
    const activityDate = safeDate(activity.startTimeLocal);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return activityDate !== null && activityDate >= thirtyDaysAgo;
  });

  const last7Days = activities.filter((activity) => {
    const activityDate = safeDate(activity.startTimeLocal);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return activityDate !== null && activityDate >= sevenDaysAgo;
  });

  return {
    weeklyVolume: {
      value: `${Math.round(
        last7Days.reduce((sum, activity) => sum + (activity.duration || 0), 0) /
          3600
      )} hrs`,
      description: 'Training hours last 7 days',
      trend: 'up',
    },
    monthlyActivities: {
      value: last30Days.length.toString(),
      description: 'Activities completed this month',
      trend: 'up',
    },
    elevationThisWeek: {
      value: formatElevation(
        last7Days.reduce(
          (sum, activity) => sum + (activity.elevationGain || 0),
          0
        )
      ),
      description: 'Vertical gain this week',
      trend: 'up',
    },
    currentFitness: {
      value: '--',
      description: 'Fitness model unavailable',
      trend: 'stable',
    },
  };
}

function getObservedTrend(current: number, previous: number): TrendDirection {
  if (!current || !previous || current === previous) {
    return 'stable';
  }

  return current > previous ? 'up' : 'down';
}

function formatElevation(meters: number): string {
  if (meters > 1000) {
    return `${(meters / 1000).toFixed(1)}K m`;
  }

  return `${Math.round(meters)} m`;
}

function safeDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
