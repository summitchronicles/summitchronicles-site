import { NextRequest, NextResponse } from 'next/server';
import { IntervalsService } from '@/lib/services/intervals';
import { spawn } from 'child_process';
import path from 'path';
import { config } from '@/lib/config';
import {
  checkRateLimit,
  getClientIp,
  createRateLimitResponse,
} from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const clientIp = getClientIp(request);
  const isAllowed = await checkRateLimit(clientIp);

  if (!isAllowed) {
    return createRateLimitResponse();
  }

  try {
    // --- HYBRID IMPLEMENTATION ---
    // 1. Fetch fast activities from Intervals.icu
    const activitiesPromise = IntervalsService.getActivities(30);

    // 2. Fetch specific health metrics (Body Battery) from Garmin via Python
    const bodyBatteryPromise = fetchBodyBatteryFromPython();

    const [activitiesData, garminHealth] = await Promise.all([
      activitiesPromise,
      bodyBatteryPromise,
    ]);

    // 3. Use Raw VO2 Max from Garmin (fallback to manual if missing)
    const rawVo2 = garminHealth.vo2Max;
    const manualVo2 = process.env.VO2_MAX_MANUAL
      ? parseFloat(process.env.VO2_MAX_MANUAL)
      : 45.0;

    const garminMetrics = {
      bodyBattery: garminHealth.bodyBattery ?? 0,
      bodyBatteryTimeline: garminHealth.bodyBatteryTimeline || [],
      stressScore: garminHealth.stressScore ?? 0,
      vo2Max: rawVo2 || manualVo2,
      hrvStatus: garminHealth.hrvStatus ?? 'N/A',
    };

    // Calculate metrics
    const metrics = calculateTrainingMetrics(
      activitiesData.map((a) => ({
        activityId: a.id,
        activityName: a.name,
        startTimeLocal: a.start_date_local,
        distance: a.distance,
        duration: a.moving_time,
        elevationGain: a.total_elevation_gain,
        averageHR: a.average_heartrate,
        activityType: { typeKey: a.type.toLowerCase() },
      })),
      garminMetrics
    );

    return NextResponse.json({
      success: true,
      metrics,
      lastUpdated: new Date().toISOString(),
      source: 'intervals.icu',
    });
  } catch (error) {
    console.error('Error fetching Intervals metrics:', error);

    return NextResponse.json({
      success: false,
      metrics: getEnhancedFallbackMetrics(),
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Data Provider Unavailable',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
// fetchGarminDataDirectly removed

function calculateTrainingMetrics(activities: any[], garminMetrics: any) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Filter activities for current year
  const thisYearActivities = activities.filter((activity: any) => {
    const activityDate = new Date(activity.startTimeLocal);
    return activityDate.getFullYear() === currentYear;
  });

  // Calculate stats
  const currentStats = {
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
          (total: number, activity: any) =>
            total + (activity.elevationGain || 0),
          0
        )
      ),
      description: 'Total vertical gain this year',
      trend: 'up',
    },
    currentRestingHR: {
      value: garminMetrics.restingHR
        ? `${garminMetrics.restingHR} bpm`
        : '55 bpm',
      description: 'Current resting heart rate',
      trend: 'down',
    },
  };

  // ... (Keep existing phases and trends logic, adapted to new data shape if needed)
  // Integrating the Advanced Performance calculation here

  return {
    currentStats,
    trainingPhases: getTrainingPhases(activities), // Refactored out for brevity
    recentTrends: calculateRecentTrends(activities),
    expeditionProgress: {
      completed: [
        'Kilimanjaro (2022)',
        'Aconcagua (2023)',
        'Elbrus (2023)',
        'Denali (2024)',
      ],
      upcoming: ['Everest (2027)', 'Vinson (TBD)', 'Carstensz Pyramid (TBD)'],
      progressPercentage: 57,
    },
    advancedPerformance: calculateAdvancedPerformance(
      activities,
      garminMetrics
    ),
    predictions: calculatePredictions(activities),
    // Pass through wellness metrics from Garmin
    bodyBattery: garminMetrics.bodyBattery,
    bodyBatteryTimeline: garminMetrics.bodyBatteryTimeline,
    stressScore: garminMetrics.stressScore,
    hrvStatus: garminMetrics.hrvStatus,
    vo2Max: garminMetrics.vo2Max, // Raw VO2 Max from Garmin (or manual fallback)
    // Add Recent Activities (Top 5 sorted by date)
    recentActivities: [...activities]
      .sort(
        (a, b) =>
          new Date(b.startTimeLocal || b.start_date).getTime() -
          new Date(a.startTimeLocal || a.start_date).getTime()
      )
      .slice(0, 5),
  };
}

// ... Helper functions need to be adapted to matching Activity shape (camelCase from Python) ...
// Assuming the Python script returns activities keys as per Garmin API (camelCase usually)

function calculateAdvancedPerformance(activities: any[], garminMetrics: any) {
  // Sort activities by date desc
  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(b.startTimeLocal).getTime() -
      new Date(a.startTimeLocal).getTime()
  );

  const recentActivities = sortedActivities.slice(0, 30);
  const previousActivities = sortedActivities.slice(30, 60);

  // Helper to get average of a field (handling both valid values and potential key variations if needed)
  const getAvg = (acts: any[], field: string) => {
    const valid = acts.filter(
      (a) => a[field] !== undefined && a[field] !== null
    );
    if (valid.length === 0) return 0;
    return valid.reduce((sum, a) => sum + a[field], 0) / valid.length;
  };

  // VO2 Max: Use explicit metric from User Summary if available, otherwise fallback to activity average
  // key: 'vo2MaxValue' is standard in Garmin activity JSON
  const currentVo2 =
    garminMetrics.vo2Max || getAvg(recentActivities, 'vo2MaxValue') || 58.2;
  const prevVo2 = getAvg(previousActivities, 'vo2MaxValue') || 56.1;

  // Power (watts)
  // key: 'averagePower' or 'averageRunningPower'
  const currentPower =
    getAvg(recentActivities, 'averagePower') ||
    getAvg(recentActivities, 'averageRunningPower') ||
    285;
  const prevPower =
    getAvg(previousActivities, 'averagePower') ||
    getAvg(previousActivities, 'averageRunningPower') ||
    273;

  // Lactate Threshold (estimated)
  // key: 'averageHR'
  const currentHR = getAvg(recentActivities, 'averageHR');
  const prevHR = getAvg(previousActivities, 'averageHR');

  const currentLactate = currentHR ? currentHR * 0.9 : 168;
  const prevLactate = prevHR ? prevHR * 0.9 : 171;

  // Recovery Rate (based on resting HR trend or inverse of active HR as proxy)
  // Lower HR is better, so we mock a "Recovery Score" where lower HR -> Higher Score
  const score = 100 - currentHR / 2;
  const prevScore = 100 - prevHR / 2;

  return {
    vo2Max: {
      value: Number(currentVo2?.toFixed(1)),
      change: Number((currentVo2 - prevVo2).toFixed(1)),
      unit: 'ml/kg/min',
      trend: currentVo2 >= prevVo2 ? 'up' : 'down',
    },
    powerOutput: {
      value: Math.round(currentPower),
      change: Math.round(currentPower - prevPower),
      unit: 'watts',
      trend: currentPower >= prevPower ? 'up' : 'down',
    },
    lactateThreshold: {
      value: Math.round(currentLactate),
      change: Math.round(currentLactate - prevLactate),
      unit: 'bpm',
      trend: currentLactate >= prevLactate ? 'up' : 'down',
    },
    recoveryRate: {
      value: Math.round(score),
      change: Math.round(score - prevScore),
      unit: '%',
      trend: score >= prevScore ? 'stable' : 'down',
    },
  };
}

function getTrainingPhases(activities: any[]) {
  // Keep static for now or calculate based on date ranges
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

function calculatePredictions(activities: any[]) {
  // Simple predictive logic based on recent volume
  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  const last30Days = sortedActivities.slice(0, 30);

  const volume = last30Days.reduce((sum, a) => sum + (a.distance || 0), 0);
  const elevation = last30Days.reduce(
    (sum, a) => sum + (a.total_elevation_gain || 0),
    0
  );

  // Everest Readiness (0-100)
  // Target: 100k m elevation/year ~ 8k/month
  const elevationScore = Math.min(100, (elevation / 8000) * 100);
  const readiness = Math.round(elevationScore * 0.7 + 30); // Baseline 30

  // Max Altitude (mock prediction based on training)
  // Base 5000m + training effect
  const maxAlt = 5000 + elevationScore * 20;

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
      current: Math.round(maxAlt),
      predicted: Math.round(maxAlt + 1300),
      confidence: 0.78,
      timeframe: '4 months',
    },
    {
      metric: 'Endurance Index',
      current: Number((volume / 100000).toFixed(1)), // Mock index
      predicted: Number(((volume / 100000) * 1.2).toFixed(1)),
      confidence: 0.92,
      timeframe: '3 months',
    },
  ];
}

function calculatePhaseMetrics(
  activities: any[],
  startDate: string,
  endDate: string
) {
  const phaseActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.start_date);
    return (
      activityDate >= new Date(startDate) && activityDate <= new Date(endDate)
    );
  });

  const totalDistance = phaseActivities.reduce(
    (total, activity) => total + (activity.distance || 0),
    0
  );

  const totalElevation = phaseActivities.reduce(
    (total, activity) => total + (activity.total_elevation_gain || 0),
    0
  );

  const totalTime = phaseActivities.reduce(
    (total, activity) => total + (activity.moving_time || 0),
    0
  );

  const avgHeartRate =
    phaseActivities.length > 0
      ? Math.round(
          phaseActivities
            .filter((a) => a.average_heartrate)
            .reduce(
              (total, activity) => total + (activity.average_heartrate || 0),
              0
            ) / phaseActivities.filter((a) => a.average_heartrate).length
        )
      : null;

  return [
    {
      label: 'Total Distance',
      value: `${(totalDistance / 1000).toFixed(0)} km`,
      trend: 'up',
    },
    {
      label: 'Elevation Gain',
      value: formatElevation(totalElevation),
      trend: 'up',
    },
    {
      label: 'Training Hours',
      value: `${Math.round(totalTime / 3600)} hrs`,
      trend: 'up',
    },
    {
      label: 'Avg Heart Rate',
      value: avgHeartRate ? `${avgHeartRate} bpm` : 'N/A',
      trend: 'stable',
    },
  ];
}

function calculateRecentTrends(activities: any[]) {
  const last30Days = activities.filter((activity) => {
    const activityDate = new Date(activity.start_date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return activityDate >= thirtyDaysAgo;
  });

  const last7Days = activities.filter((activity) => {
    const activityDate = new Date(activity.start_date);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return activityDate >= sevenDaysAgo;
  });

  return {
    weeklyVolume: {
      value: `${Math.round(
        last7Days.reduce(
          (total, activity) => total + (activity.moving_time || 0),
          0
        ) / 3600
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
          (total, activity) => total + (activity.total_elevation_gain || 0),
          0
        )
      ),
      description: 'Vertical gain this week',
      trend: 'up',
    },
    currentFitness: {
      value: calculateFitnessScore(activities),
      description: 'Estimated fitness level',
      trend: 'up',
    },
  };
}

function formatElevation(meters: number): string {
  if (meters > 1000) {
    return `${(meters / 1000).toFixed(1)}K m`;
  }
  return `${Math.round(meters)} m`;
}

function calculateAverageRestingHR(activities: any[]): string {
  // Use known resting HR value for accuracy
  // TODO: In future, could integrate with Garmin/Strava wellness data for automatic updates
  const knownRestingHR = 55; // User's actual resting HR

  // Optional: Could analyze recent trends for validation
  const recentActivities = activities.slice(0, 10);
  if (recentActivities.length > 0) {
    const avgActiveHR =
      recentActivities
        .filter((a) => a.average_heartrate)
        .reduce(
          (total, activity) => total + (activity.average_heartrate || 0),
          0
        ) / recentActivities.filter((a) => a.average_heartrate).length;

    // Log for debugging/validation (actual RHR should be much lower than active HR)
    console.log(
      `Average active HR: ${Math.round(avgActiveHR)}, Known resting HR: ${knownRestingHR}`
    );
  }

  return `${knownRestingHR} bpm`;
}

function calculateFitnessScore(activities: any[]): string {
  // Simple fitness score based on recent training load
  const last30Days = activities.filter((activity) => {
    const activityDate = new Date(activity.start_date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return activityDate >= thirtyDaysAgo;
  });

  const totalTime = last30Days.reduce(
    (total, activity) => total + (activity.moving_time || 0),
    0
  );

  const totalElevation = last30Days.reduce(
    (total, activity) => total + (activity.total_elevation_gain || 0),
    0
  );

  // Combine time and elevation for fitness score
  const fitnessScore = Math.min(
    100,
    Math.round(totalTime / 3600 + totalElevation / 100)
  );
  return `${fitnessScore}/100`;
}

function getEnhancedFallbackMetrics() {
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
            trend: 'stable' as const,
          },
        ], // Will be replaced with real Garmin wellness data
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
    },
    expeditionProgress: {
      completed: [
        'Kilimanjaro (2022)',
        'Aconcagua (2023)',
        'Elbrus (2023)',
        'Denali (2024)',
      ],
      upcoming: ['Everest (2027)', 'Vinson (TBD)', 'Carstensz Pyramid (TBD)'],
      progressPercentage: 57,
    },
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
    recentActivities: [
      {
        activityId: 101,
        activityName: 'Base Training Run',
        startTimeLocal: new Date().toISOString(),
        distance: 5000,
        duration: 1800,
        elevationGain: 150,
        averageHR: 145,
        activityType: { typeKey: 'running' },
        description: 'Fallback: Simulating steady state cardio.',
      },
      {
        activityId: 102,
        activityName: 'Strength & Conditioning',
        startTimeLocal: new Date(Date.now() - 86400000).toISOString(),
        distance: 0,
        duration: 2700,
        elevationGain: 0,
        averageHR: 120,
        activityType: { typeKey: 'fitness_equipment' },
        description: 'Fallback: Upper body focus.',
      },
    ],
  };
}

async function fetchBodyBatteryFromPython(): Promise<any> {
  // 1. Check if running on Vercel (Production/Preview)
  if (process.env.VERCEL) {
    console.log(
      'Running on Vercel, skipping Python script (unavailable runtime).'
    );
    return {};
  }

  const pythonScriptPath = path.join(
    process.cwd(),
    'garmin-workouts/garminworkouts/scripts/fetch_training_data.py'
  );

  // Use validated credentials from centralized config (or skip if missing)
  let username, password;
  try {
    username = config.GARMIN_USERNAME;
    password = config.GARMIN_PASSWORD;
  } catch (e) {
    console.warn(
      'Garmin credentials missing or invalid, skipping Python script.'
    );
    return {};
  }

  // Use the venv python where garminconnect is installed
  const venvPython = path.join(
    process.cwd(),
    'garmin-workouts',
    'venv',
    'bin',
    'python'
  );

  return new Promise((resolve) => {
    // If credentials missing, return empty fallback immediately
    if (!username || !password) {
      console.warn('Garmin credentials missing, skipping Python script.');
      resolve({});
      return;
    }

    const python = spawn(
      venvPython,
      [pythonScriptPath, '--username', username, '--password', password],
      {
        cwd: path.join(process.cwd(), 'garmin-workouts'),
        env: {
          ...process.env,
          PYTHONPATH: path.join(process.cwd(), 'garmin-workouts'),
        },
      }
    );

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    // CRITICAL: Handle spawn errors (e.g., python not found)
    python.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      resolve({});
    });

    python.on('close', (code) => {
      if (code === 0) {
        try {
          const json = JSON.parse(output);
          // Parse the specific fields we need
          const { user_summary, stress_data, hrv_data, body_battery } = json;

          let bodyBatteryValue =
            user_summary?.bodyBatteryMostRecentValue ||
            user_summary?.bodyBattery;

          // Fallback to array last value
          if (
            !bodyBatteryValue &&
            Array.isArray(body_battery) &&
            body_battery.length > 0
          ) {
            bodyBatteryValue =
              body_battery[body_battery.length - 1]?.bodyBatteryLevel;
          }

          let stressValue = null;
          if (stress_data) {
            stressValue =
              stress_data.overallStressLevel || stress_data.avgStressLevel;
          }
          if (stressValue === null) {
            stressValue = user_summary?.averageStressLevel;
          }

          const hrvStatus = hrv_data?.hrvSummary?.status || 'Balanced';

          // Extract VO2 Max from user_summary or stats
          const vo2MaxValue =
            user_summary?.vo2MaxValue || user_summary?.vo2Max || null;

          resolve({
            bodyBattery: bodyBatteryValue,
            bodyBatteryTimeline: body_battery || [],
            stressScore: stressValue,
            hrvStatus: hrvStatus,
            vo2Max: vo2MaxValue,
          });
        } catch (e) {
          console.error(`Failed to parse Python output: ${e}`);
          resolve({});
        }
      } else {
        console.error(`Python script failed (code ${code}): ${error}`);
        resolve({});
      }
    });
  });
}
