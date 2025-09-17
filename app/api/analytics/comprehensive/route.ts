import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface PerformanceMetrics {
  totalDistance: number
  totalElevation: number
  totalTime: number
  averageHeartRate: number
  averagePace: number
  workoutFrequency: number
  intensityDistribution: {
    low: number
    moderate: number
    high: number
    maximum: number
  }
}

interface TrendData {
  metric: string
  current: number
  previous: number
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  unit: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { activities = [], timeframe = 'month', includeComparison = false, includeTrends = false } = body

    // Calculate comprehensive analytics from activities
    const metrics = calculatePerformanceMetrics(activities)
    const trends = includeTrends ? calculateTrends(activities, timeframe) : []
    const comparison = includeComparison ? generateLevelComparison(metrics) : null

    return NextResponse.json({
      success: true,
      metrics: metrics,
      trends: trends,
      comparison: comparison,
      meta: {
        timeframe: timeframe,
        activitiesAnalyzed: activities.length,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Comprehensive analytics error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate comprehensive analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function calculatePerformanceMetrics(activities: any[]): PerformanceMetrics {
  if (activities.length === 0) {
    return {
      totalDistance: 0,
      totalElevation: 0,
      totalTime: 0,
      averageHeartRate: 0,
      averagePace: 0,
      workoutFrequency: 0,
      intensityDistribution: { low: 0, moderate: 0, high: 0, maximum: 0 }
    }
  }

  const totalDistance = activities.reduce((sum, act) => sum + (act.distance || 0), 0) / 1000 // Convert to km
  const totalElevation = activities.reduce((sum, act) => sum + (act.total_elevation_gain || 0), 0)
  const totalTime = activities.reduce((sum, act) => sum + (act.moving_time || 0), 0) / 3600 // Convert to hours
  
  const heartRateActivities = activities.filter(act => act.average_heartrate)
  const averageHeartRate = heartRateActivities.length > 0 
    ? heartRateActivities.reduce((sum, act) => sum + act.average_heartrate, 0) / heartRateActivities.length 
    : 0

  const averagePace = totalDistance > 0 ? (totalTime * 60) / totalDistance : 0 // min/km
  
  // Calculate workout frequency (activities per week)
  const timeSpan = getTimeSpanInWeeks(activities)
  const workoutFrequency = timeSpan > 0 ? activities.length / timeSpan : 0

  // Calculate intensity distribution based on heart rate zones
  const intensityDistribution = calculateIntensityDistribution(activities)

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalElevation: Math.round(totalElevation),
    totalTime: Math.round(totalTime * 10) / 10,
    averageHeartRate: Math.round(averageHeartRate),
    averagePace: Math.round(averagePace * 10) / 10,
    workoutFrequency: Math.round(workoutFrequency * 10) / 10,
    intensityDistribution
  }
}

function calculateIntensityDistribution(activities: any[]) {
  if (activities.length === 0) {
    return { low: 0, moderate: 0, high: 0, maximum: 0 }
  }

  let low = 0, moderate = 0, high = 0, maximum = 0

  activities.forEach(activity => {
    if (activity.average_heartrate) {
      const hr = activity.average_heartrate
      if (hr < 120) low++
      else if (hr < 140) moderate++
      else if (hr < 160) high++
      else maximum++
    } else {
      // Fallback to activity type if no heart rate
      const type = activity.type?.toLowerCase() || ''
      if (type.includes('walk') || type.includes('yoga')) low++
      else if (type.includes('hike') || type.includes('bike')) moderate++
      else if (type.includes('run') || type.includes('climb')) high++
      else moderate++
    }
  })

  const total = activities.length
  return {
    low: Math.round((low / total) * 100),
    moderate: Math.round((moderate / total) * 100),
    high: Math.round((high / total) * 100),
    maximum: Math.round((maximum / total) * 100)
  }
}

function calculateTrends(activities: any[], timeframe: string): TrendData[] {
  // For demo purposes, generate realistic trends
  // In production, you'd compare with historical data
  
  const currentMetrics = calculatePerformanceMetrics(activities)
  
  // Simulate previous period data with some variation
  const generatePreviousValue = (current: number, variance: number = 0.1) => {
    const change = (Math.random() - 0.5) * 2 * variance
    return current * (1 - change)
  }

  const trends: TrendData[] = [
    {
      metric: 'Weekly Distance',
      current: currentMetrics.totalDistance * currentMetrics.workoutFrequency / 4, // Approximate weekly
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'km'
    },
    {
      metric: 'Elevation Gain',
      current: currentMetrics.totalElevation,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'm'
    },
    {
      metric: 'Training Time',
      current: currentMetrics.totalTime,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'hrs'
    },
    {
      metric: 'Average Heart Rate',
      current: currentMetrics.averageHeartRate,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: 'bpm'
    },
    {
      metric: 'Workout Frequency',
      current: currentMetrics.workoutFrequency,
      previous: 0,
      trend: 'stable',
      changePercent: 0,
      unit: '/week'
    }
  ]

  // Calculate trends and previous values
  trends.forEach(trend => {
    trend.previous = Math.round(generatePreviousValue(trend.current, 0.15) * 10) / 10
    const change = trend.current - trend.previous
    trend.changePercent = trend.previous > 0 ? Math.round((change / trend.previous) * 1000) / 10 : 0
    
    if (Math.abs(trend.changePercent) < 2) {
      trend.trend = 'stable'
    } else if (trend.changePercent > 0) {
      trend.trend = 'up'
    } else {
      trend.trend = 'down'
    }
  })

  return trends
}

function generateLevelComparison(userMetrics: PerformanceMetrics) {
  // Define benchmarks for different levels
  const levelBenchmarks = {
    beginner: {
      totalDistance: 50,
      totalElevation: 3000,
      totalTime: 20,
      averageHeartRate: 150,
      averagePace: 8.0,
      workoutFrequency: 3.0,
      intensityDistribution: { low: 60, moderate: 25, high: 10, maximum: 5 }
    },
    intermediate: {
      totalDistance: 120,
      totalElevation: 8000,
      totalTime: 40,
      averageHeartRate: 145,
      averagePace: 7.0,
      workoutFrequency: 4.0,
      intensityDistribution: { low: 50, moderate: 30, high: 15, maximum: 5 }
    },
    advanced: {
      totalDistance: 200,
      totalElevation: 15000,
      totalTime: 70,
      averageHeartRate: 140,
      averagePace: 6.0,
      workoutFrequency: 5.0,
      intensityDistribution: { low: 40, moderate: 35, high: 20, maximum: 5 }
    },
    expert: {
      totalDistance: 300,
      totalElevation: 25000,
      totalTime: 100,
      averageHeartRate: 135,
      averagePace: 5.5,
      workoutFrequency: 6.0,
      intensityDistribution: { low: 30, moderate: 40, high: 25, maximum: 5 }
    }
  }

  // Determine user level based on metrics
  let userLevel: keyof typeof levelBenchmarks = 'beginner'
  
  if (userMetrics.totalDistance >= levelBenchmarks.expert.totalDistance * 0.8) {
    userLevel = 'expert'
  } else if (userMetrics.totalDistance >= levelBenchmarks.advanced.totalDistance * 0.8) {
    userLevel = 'advanced'
  } else if (userMetrics.totalDistance >= levelBenchmarks.intermediate.totalDistance * 0.8) {
    userLevel = 'intermediate'
  }

  // Get next level
  const levelOrder: (keyof typeof levelBenchmarks)[] = ['beginner', 'intermediate', 'advanced', 'expert']
  const currentIndex = levelOrder.indexOf(userLevel)
  const nextLevel = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : userLevel

  return {
    userLevel,
    userMetrics,
    benchmarks: {
      level: levelBenchmarks[userLevel],
      nextLevel: levelBenchmarks[nextLevel]
    }
  }
}

function getTimeSpanInWeeks(activities: any[]): number {
  if (activities.length === 0) return 0

  const dates = activities.map(act => new Date(act.start_date || act.date)).sort()
  const earliest = dates[0]
  const latest = dates[dates.length - 1]
  
  const diffTime = latest.getTime() - earliest.getTime()
  const diffWeeks = diffTime / (1000 * 60 * 60 * 24 * 7)
  
  return Math.max(diffWeeks, 1) // At least 1 week
}

export async function GET(request: NextRequest) {
  // Return sample analytics for testing
  const sampleMetrics: PerformanceMetrics = {
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
      maximum: 5
    }
  }

  const sampleTrends: TrendData[] = [
    { metric: 'Weekly Distance', current: 31.4, previous: 28.2, trend: 'up', changePercent: 11.3, unit: 'km' },
    { metric: 'Elevation Gain', current: 2115, previous: 1890, trend: 'up', changePercent: 11.9, unit: 'm' },
    { metric: 'Training Time', current: 11.3, previous: 12.1, trend: 'down', changePercent: -6.6, unit: 'hrs' }
  ]

  return NextResponse.json({
    success: true,
    metrics: sampleMetrics,
    trends: sampleTrends,
    comparison: generateLevelComparison(sampleMetrics),
    meta: {
      isSampleData: true,
      generatedAt: new Date().toISOString()
    }
  })
}