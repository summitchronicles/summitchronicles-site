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
    activityType:
      activity.activityType ?? { typeKey: (activity.type || 'unknown').toLowerCase() },
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
    stressScore: latestWellness.restingHR ? 100 - latestWellness.restingHR : 50,
    vo2Max: latestWellness.vo2max || manualVo2Max,
    hrvStatus: latestWellness.hrv ? `${Math.round(latestWellness.hrv)} ms` : 'N/A',
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
        value: wellness.restingHR ? `${wellness.restingHR} bpm` : '55 bpm',
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
        value: '356K m',
        description: 'Estimated total vertical gain',
        trend: 'up',
      },
      currentRestingHR: {
        value: '42 bpm',
        description: 'Estimated resting heart rate',
        trend: 'down',
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
        value: '15 hrs',
        description: 'Estimated weekly training',
        trend: 'up',
      },
      monthlyActivities: {
        value: '12',
        description: 'Estimated monthly activities',
        trend: 'up',
      },
      elevationThisWeek: {
        value: '0 m',
        description: 'Vertical gain this week',
        trend: 'up',
      },
      currentFitness: {
        value: '0/100',
        description: 'Estimated fitness level',
        trend: 'up',
      },
    },
    expeditionProgress: DEFAULT_EXPEDITION_PROGRESS,
    advancedPerformance: {
      vo2Max: { value: 58.2, change: 2.1, unit: 'ml/kg/min', trend: 'up' },
      powerOutput: { value: 285, change: 12, unit: 'watts', trend: 'up' },
      lactateThreshold: { value: 168, change: -3, unit: 'bpm', trend: 'down' },
      recoveryRate: { value: 92, change: 0, unit: '%', trend: 'stable' },
    },
    predictions: [
      {
        metric: 'Everest Readiness Score',
        current: 72,
        predicted: 87,
        confidence: 0.85,
        timeframe: '6 months',
      },
      {
        metric: 'Max Altitude Capability',
        current: 5500,
        predicted: 6800,
        confidence: 0.78,
        timeframe: '4 months',
      },
      {
        metric: 'Endurance Index',
        current: 8.2,
        predicted: 9.1,
        confidence: 0.92,
        timeframe: '3 months',
      },
    ],
    bodyBattery: 0,
    bodyBatteryTimeline: [],
    stressScore: 50,
    hrvStatus: 'N/A',
    vo2Max: 45,
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

  const currentVo2 = wellness.vo2Max || getAverage(recentActivities, 'vo2MaxValue') || 45;
  const previousVo2 = getAverage(previousActivities, 'vo2MaxValue') || 56.1;

  const currentPower =
    getAverage(recentActivities, 'averagePower') ||
    getAverage(recentActivities, 'averageRunningPower') ||
    285;
  const previousPower =
    getAverage(previousActivities, 'averagePower') ||
    getAverage(previousActivities, 'averageRunningPower') ||
    273;

  const currentHeartRate = getAverage(recentActivities, 'averageHR');
  const previousHeartRate = getAverage(previousActivities, 'averageHR');

  const currentLactate = currentHeartRate ? currentHeartRate * 0.9 : 168;
  const previousLactate = previousHeartRate ? previousHeartRate * 0.9 : 171;
  const currentRecovery = 100 - currentHeartRate / 2;
  const previousRecovery = 100 - previousHeartRate / 2;

  return {
    vo2Max: {
      value: Number(currentVo2.toFixed(1)),
      change: Number((currentVo2 - previousVo2).toFixed(1)),
      unit: 'ml/kg/min',
      trend: currentVo2 >= previousVo2 ? 'up' : 'down',
    },
    powerOutput: {
      value: Math.round(currentPower),
      change: Math.round(currentPower - previousPower),
      unit: 'watts',
      trend: currentPower >= previousPower ? 'up' : 'down',
    },
    lactateThreshold: {
      value: Math.round(currentLactate),
      change: Math.round(currentLactate - previousLactate),
      unit: 'bpm',
      trend: currentLactate >= previousLactate ? 'up' : 'down',
    },
    recoveryRate: {
      value: Math.round(currentRecovery),
      change: Math.round(currentRecovery - previousRecovery),
      unit: '%',
      trend: currentRecovery >= previousRecovery ? 'stable' : 'down',
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

function calculatePredictions(activities: NormalizedTrainingActivity[]): PredictionMetric[] {
  const sortedActivities = [...activities].sort((a, b) => {
    const left = safeDate(a.startTimeLocal)?.getTime() ?? 0;
    const right = safeDate(b.startTimeLocal)?.getTime() ?? 0;
    return right - left;
  });

  const last30Days = sortedActivities.slice(0, 30);
  const volume = last30Days.reduce((sum, activity) => sum + (activity.distance || 0), 0);
  const elevation = last30Days.reduce(
    (sum, activity) => sum + (activity.elevationGain || 0),
    0
  );

  const elevationScore = Math.min(100, (elevation / 8000) * 100);
  const readiness = Math.round(elevationScore * 0.7 + 30);
  const maxAltitude = 5000 + elevationScore * 20;

  return [
    {
      metric: 'Everest Readiness Score',
      current: readiness,
      predicted: Math.min(100, readiness + 15),
      confidence: 0.85,
      timeframe: '6 months',
    },
    {
      metric: 'Max Altitude Capability',
      current: Math.round(maxAltitude),
      predicted: Math.round(maxAltitude + 1300),
      confidence: 0.78,
      timeframe: '4 months',
    },
    {
      metric: 'Endurance Index',
      current: Number((volume / 100000).toFixed(1)),
      predicted: Number(((volume / 100000) * 1.2).toFixed(1)),
      confidence: 0.92,
      timeframe: '3 months',
    },
  ];
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
        last7Days.reduce((sum, activity) => sum + (activity.duration || 0), 0) / 3600
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
        last7Days.reduce((sum, activity) => sum + (activity.elevationGain || 0), 0)
      ),
      description: 'Vertical gain this week',
      trend: 'up',
    },
    currentFitness: {
      value: calculateFitnessScore(activities, now),
      description: 'Estimated fitness level',
      trend: 'up',
    },
  };
}

function calculateFitnessScore(
  activities: NormalizedTrainingActivity[],
  now: Date
): string {
  const last30Days = activities.filter((activity) => {
    const activityDate = safeDate(activity.startTimeLocal);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return activityDate !== null && activityDate >= thirtyDaysAgo;
  });

  const totalTime = last30Days.reduce(
    (sum, activity) => sum + (activity.duration || 0),
    0
  );
  const totalElevation = last30Days.reduce(
    (sum, activity) => sum + (activity.elevationGain || 0),
    0
  );

  const fitnessScore = Math.min(
    100,
    Math.round(totalTime / 3600 + totalElevation / 100)
  );

  return `${fitnessScore}/100`;
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
