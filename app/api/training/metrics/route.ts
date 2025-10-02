import { NextRequest, NextResponse } from 'next/server';
import { fetchStravaActivities } from '@/lib/strava';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch recent activities from Strava
    const activities = await fetchStravaActivities(1, 100); // Get last 100 activities

    // Calculate real training metrics
    const metrics = calculateTrainingMetrics(activities);

    return NextResponse.json({
      success: true,
      metrics,
      lastUpdated: new Date().toISOString(),
      source: activities.length > 0 && activities[0].id > 10000000000 ? 'mock' : 'strava',
      totalActivities: activities.length,
      debug: {
        firstActivityId: activities.length > 0 ? activities[0].id : null,
        isRealStrava: activities.length > 0 && activities[0].id < 10000000000
      }
    });

  } catch (error) {
    console.error('Error calculating training metrics:', error);

    // Return fallback metrics if API fails
    return NextResponse.json({
      success: false,
      metrics: getFallbackMetrics(),
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Failed to fetch live metrics'
    });
  }
}

function calculateTrainingMetrics(activities: any[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Filter activities for current year and last year
  const thisYearActivities = activities.filter(activity => {
    const activityDate = new Date(activity.start_date);
    return activityDate.getFullYear() === currentYear;
  });

  const lastYearActivities = activities.filter(activity => {
    const activityDate = new Date(activity.start_date);
    return activityDate >= oneYearAgo;
  });

  // Calculate current stats
  const currentStats = {
    sevenSummitsCompleted: {
      value: '4/7',
      description: 'Kilimanjaro, Aconcagua, Elbrus, Denali completed',
      trend: 'up'
    },
    trainingYears: {
      value: '11',
      description: 'Since Sar Pass 2014',
      trend: 'up'
    },
    totalElevationThisYear: {
      value: formatElevation(thisYearActivities.reduce((total, activity) =>
        total + (activity.total_elevation_gain || 0), 0
      )),
      description: 'Total vertical gain this year',
      trend: 'up'
    },
    currentRestingHR: {
      value: calculateAverageRestingHR(activities),
      description: 'Average resting heart rate trend',
      trend: 'down' // Lower is better for resting HR
    }
  };

  // Calculate training phase metrics
  const trainingPhases = [
    {
      phase: 'Base Building',
      duration: 'Jan - Mar 2022',
      focus: 'Recovery Foundation',
      status: 'completed',
      metrics: calculatePhaseMetrics(activities, '2022-01-01', '2022-03-31')
    },
    {
      phase: 'Kilimanjaro Prep',
      duration: 'Apr - Oct 2022',
      focus: 'First Seven Summit',
      status: 'completed',
      metrics: calculatePhaseMetrics(activities, '2022-04-01', '2022-10-31')
    },
    {
      phase: 'Technical Mountains',
      duration: 'Nov 2022 - Jul 2024',
      focus: 'Aconcagua, Elbrus, Denali',
      status: 'completed',
      metrics: calculatePhaseMetrics(activities, '2022-11-01', '2024-07-31')
    },
    {
      phase: 'Everest Specific',
      duration: 'Aug 2024 - Mar 2027',
      focus: 'Death Zone Preparation',
      status: 'current',
      metrics: calculatePhaseMetrics(activities, '2024-08-01', '2027-03-31')
    }
  ];

  // Recent performance trends
  const recentTrends = calculateRecentTrends(activities);

  return {
    currentStats,
    trainingPhases,
    recentTrends,
    expeditionProgress: {
      completed: ['Kilimanjaro (2022)', 'Aconcagua (2023)', 'Elbrus (2023)', 'Denali (2024)'],
      upcoming: ['Everest (2027)', 'Vinson (TBD)', 'Carstensz Pyramid (TBD)'],
      progressPercentage: 57 // 4/7 = 57%
    }
  };
}

function calculatePhaseMetrics(activities: any[], startDate: string, endDate: string) {
  const phaseActivities = activities.filter(activity => {
    const activityDate = new Date(activity.start_date);
    return activityDate >= new Date(startDate) && activityDate <= new Date(endDate);
  });

  const totalDistance = phaseActivities.reduce((total, activity) =>
    total + (activity.distance || 0), 0
  );

  const totalElevation = phaseActivities.reduce((total, activity) =>
    total + (activity.total_elevation_gain || 0), 0
  );

  const totalTime = phaseActivities.reduce((total, activity) =>
    total + (activity.moving_time || 0), 0
  );

  const avgHeartRate = phaseActivities.length > 0
    ? Math.round(phaseActivities
        .filter(a => a.average_heartrate)
        .reduce((total, activity) => total + (activity.average_heartrate || 0), 0) /
        phaseActivities.filter(a => a.average_heartrate).length)
    : null;

  return [
    {
      label: 'Total Distance',
      value: `${(totalDistance / 1000).toFixed(0)} km`,
      trend: 'up'
    },
    {
      label: 'Elevation Gain',
      value: formatElevation(totalElevation),
      trend: 'up'
    },
    {
      label: 'Training Hours',
      value: `${Math.round(totalTime / 3600)} hrs`,
      trend: 'up'
    },
    {
      label: 'Avg Heart Rate',
      value: avgHeartRate ? `${avgHeartRate} bpm` : 'N/A',
      trend: 'stable'
    }
  ];
}

function calculateRecentTrends(activities: any[]) {
  const last30Days = activities.filter(activity => {
    const activityDate = new Date(activity.start_date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return activityDate >= thirtyDaysAgo;
  });

  const last7Days = activities.filter(activity => {
    const activityDate = new Date(activity.start_date);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return activityDate >= sevenDaysAgo;
  });

  return {
    weeklyVolume: {
      value: `${Math.round(last7Days.reduce((total, activity) =>
        total + (activity.moving_time || 0), 0) / 3600)} hrs`,
      description: 'Training hours last 7 days',
      trend: 'up'
    },
    monthlyActivities: {
      value: last30Days.length.toString(),
      description: 'Activities completed this month',
      trend: 'up'
    },
    elevationThisWeek: {
      value: formatElevation(last7Days.reduce((total, activity) =>
        total + (activity.total_elevation_gain || 0), 0)),
      description: 'Vertical gain this week',
      trend: 'up'
    },
    currentFitness: {
      value: calculateFitnessScore(activities),
      description: 'Estimated fitness level',
      trend: 'up'
    }
  };
}

function formatElevation(meters: number): string {
  if (meters > 1000) {
    return `${(meters / 1000).toFixed(1)}K m`;
  }
  return `${Math.round(meters)} m`;
}

function calculateAverageRestingHR(activities: any[]): string {
  // Simulate resting HR calculation (would need actual HR data)
  // In real implementation, this would use Garmin/Strava wellness data
  const recentActivities = activities.slice(0, 10);
  if (recentActivities.length === 0) return '42 bpm';

  // Rough estimation based on recent average HR
  const avgActiveHR = recentActivities
    .filter(a => a.average_heartrate)
    .reduce((total, activity) => total + (activity.average_heartrate || 0), 0) /
    recentActivities.filter(a => a.average_heartrate).length;

  // Estimate resting HR as ~30% lower than average active HR
  const estimatedRestingHR = avgActiveHR ? Math.round(avgActiveHR * 0.7) : 42;
  return `${estimatedRestingHR} bpm`;
}

function calculateFitnessScore(activities: any[]): string {
  // Simple fitness score based on recent training load
  const last30Days = activities.filter(activity => {
    const activityDate = new Date(activity.start_date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return activityDate >= thirtyDaysAgo;
  });

  const totalTime = last30Days.reduce((total, activity) =>
    total + (activity.moving_time || 0), 0
  );

  const totalElevation = last30Days.reduce((total, activity) =>
    total + (activity.total_elevation_gain || 0), 0
  );

  // Combine time and elevation for fitness score
  const fitnessScore = Math.min(100, Math.round((totalTime / 3600) + (totalElevation / 100)));
  return `${fitnessScore}/100`;
}

function getFallbackMetrics() {
  return {
    currentStats: {
      sevenSummitsCompleted: {
        value: '4/7',
        description: 'Kilimanjaro, Aconcagua, Elbrus, Denali completed',
        trend: 'up'
      },
      trainingYears: {
        value: '11',
        description: 'Since Sar Pass 2014',
        trend: 'up'
      },
      totalElevationThisYear: {
        value: '356K m',
        description: 'Estimated total vertical gain',
        trend: 'up'
      },
      currentRestingHR: {
        value: '42 bpm',
        description: 'Estimated resting heart rate',
        trend: 'down'
      }
    },
    trainingPhases: [
      {
        phase: 'Everest Specific',
        duration: 'Aug 2024 - Mar 2027',
        focus: 'Death Zone Preparation',
        status: 'current',
        metrics: [
          { label: 'Training Altitude', value: '18,000 ft', trend: 'up' },
          { label: 'VO2 Max', value: '62 ml/kg/min', trend: 'up' },
          { label: 'Hypoxic Training', value: '40 hrs/week', trend: 'up' }
        ]
      }
    ],
    recentTrends: {
      weeklyVolume: {
        value: '15 hrs',
        description: 'Estimated weekly training',
        trend: 'up'
      },
      monthlyActivities: {
        value: '12',
        description: 'Estimated monthly activities',
        trend: 'up'
      }
    },
    expeditionProgress: {
      completed: ['Kilimanjaro (2022)', 'Aconcagua (2023)', 'Elbrus (2023)', 'Denali (2024)'],
      upcoming: ['Everest (2027)', 'Vinson (TBD)', 'Carstensz Pyramid (TBD)'],
      progressPercentage: 57
    }
  };
}