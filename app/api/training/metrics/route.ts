import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch activities from Garmin proxy endpoint
    const garminResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/garmin-proxy/activities?days_back=365&limit=200`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!garminResponse.ok) {
      throw new Error(`Garmin API error: ${garminResponse.status}`);
    }

    const garminData = await garminResponse.json();

    // Calculate training metrics from Garmin activities
    const metrics = calculateTrainingMetrics(garminData.activities || []);

    // Return the enhanced metrics
    return NextResponse.json({
      success: true,
      metrics: metrics,
      lastUpdated: garminData.last_updated || new Date().toISOString(),
      source: garminData.source,
      totalActivities: garminData.total_activities,
      dataQuality: garminData.data_quality,
      migrationStatus: 'garmin_active',
      summary: garminData.summary,
      debug: {
        garmin_integration: true,
        strava_replaced: true,
        activity_count: garminData.total_activities,
        data_source: garminData.source
      }
    });

  } catch (error) {
    console.error('Error fetching Garmin training metrics:', error);

    // Return enhanced fallback metrics if Garmin API fails
    return NextResponse.json({
      success: false,
      metrics: getEnhancedFallbackMetrics(),
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Garmin API temporarily unavailable',
      migrationStatus: 'fallback_mode'
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
      phase: 'Base Training',
      duration: 'Aug 2025 - Mar 2027',
      focus: 'Foundation Building',
      status: 'current',
      metrics: calculatePhaseMetrics(activities, '2025-08-01', '2027-03-31')
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
  // Use known resting HR value for accuracy
  // TODO: In future, could integrate with Garmin/Strava wellness data for automatic updates
  const knownRestingHR = 55; // User's actual resting HR

  // Optional: Could analyze recent trends for validation
  const recentActivities = activities.slice(0, 10);
  if (recentActivities.length > 0) {
    const avgActiveHR = recentActivities
      .filter(a => a.average_heartrate)
      .reduce((total, activity) => total + (activity.average_heartrate || 0), 0) /
      recentActivities.filter(a => a.average_heartrate).length;

    // Log for debugging/validation (actual RHR should be much lower than active HR)
    console.log(`Average active HR: ${Math.round(avgActiveHR)}, Known resting HR: ${knownRestingHR}`);
  }

  return `${knownRestingHR} bpm`;
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

function getEnhancedFallbackMetrics() {
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
        phase: 'Base Training',
        duration: 'Aug 2025 - Mar 2027',
        focus: 'Foundation Building',
        status: 'current',
        metrics: 'dynamic' // Will be replaced with real Garmin wellness data
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