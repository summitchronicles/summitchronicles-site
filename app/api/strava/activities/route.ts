import { NextResponse } from 'next/server'

// Mock Strava activity data that looks realistic
const mockStravaActivities = [
  {
    id: '10342857463',
    name: 'Morning Hill Climb Training - Everest Prep Week 16',
    type: 'Hike',
    start_date: '2024-03-15T06:30:00Z',
    distance: 12500, // meters
    moving_time: 14400, // 4 hours in seconds
    total_elevation_gain: 1250,
    average_heartrate: 142,
    max_heartrate: 168,
    location_city: 'Boulder',
    location_state: 'Colorado',
    location_country: 'United States',
    average_speed: 0.87, // m/s
    max_speed: 2.1,
    calories: 1420,
    description: 'Focused on maintaining steady pace at altitude. Good progress on cardiovascular adaptation.',
    gear_id: 'hiking_boots_1',
    trainer: false,
    commute: false,
    manual: false,
    private: false,
    flagged: false,
    workout_type: 1, // race/workout
    upload_id: 11234567890,
    external_id: 'garmin_activity_123456',
    suffer_score: 78,
    weighted_average_watts: 220,
    device_watts: true,
    has_heartrate: true,
    elev_high: 2840.2,
    elev_low: 1590.8,
    pr_count: 2,
    total_photo_count: 3,
    has_kudos: false,
    kudos_count: 12,
    comment_count: 3,
    athlete_count: 1,
    photo_count: 3,
    map: {
      id: 'a10342857463',
      summary_polyline: 'u{~vFvyys@fS]',
      resource_state: 2
    },
    trainer_gear: false,
    visibility: 'everyone',
    from_accepted_tag: false,
    average_temp: 8, // Celsius
    device_name: 'Garmin Fenix 7X'
  },
  {
    id: '10289341752',
    name: 'Altitude Endurance Run - Zone 2 Training',
    type: 'Run',
    start_date: '2024-03-13T07:15:00Z',
    distance: 8200,
    moving_time: 3600,
    total_elevation_gain: 450,
    average_heartrate: 156,
    max_heartrate: 174,
    location_city: 'Boulder',
    location_state: 'Colorado',
    location_country: 'United States',
    average_speed: 2.28,
    max_speed: 3.1,
    calories: 720,
    description: 'Steady zone 2 run focusing on aerobic base development. Felt strong throughout.',
    suffer_score: 45,
    weighted_average_watts: 280,
    device_watts: true,
    has_heartrate: true,
    elev_high: 1780.5,
    elev_low: 1330.2,
    pr_count: 0,
    total_photo_count: 1,
    has_kudos: false,
    kudos_count: 8,
    comment_count: 1,
    athlete_count: 1,
    photo_count: 1,
    average_temp: 12,
    device_name: 'Garmin Fenix 7X'
  },
  {
    id: '10198765432',
    name: 'Technical Ice Climbing Session - Ouray',
    type: 'Ice Climb',
    start_date: '2024-03-08T09:00:00Z',
    distance: 2100,
    moving_time: 7200,
    total_elevation_gain: 800,
    average_heartrate: null, // No HR data for technical climbing
    max_heartrate: null,
    location_city: 'Ouray',
    location_state: 'Colorado', 
    location_country: 'United States',
    average_speed: 0.29,
    max_speed: 1.2,
    calories: 890,
    description: 'Multi-pitch ice climbing practice. Worked on efficient movement and anchor building. Great conditions.',
    suffer_score: 92,
    weighted_average_watts: null,
    device_watts: false,
    has_heartrate: false,
    elev_high: 2980.1,
    elev_low: 2180.3,
    pr_count: 1,
    total_photo_count: 8,
    has_kudos: false,
    kudos_count: 24,
    comment_count: 7,
    athlete_count: 2, // Climbing partner
    photo_count: 8,
    average_temp: -5,
    device_name: 'Garmin Fenix 7X'
  },
  {
    id: '10156789012',
    name: 'Pack Weight Training - 20kg Load',
    type: 'Hike',
    start_date: '2024-03-05T08:30:00Z',
    distance: 15800,
    moving_time: 18000, // 5 hours
    total_elevation_gain: 1680,
    average_heartrate: 138,
    max_heartrate: 162,
    location_city: 'Golden',
    location_state: 'Colorado',
    location_country: 'United States',
    average_speed: 0.88,
    max_speed: 1.9,
    calories: 1650,
    description: 'Expedition pack weight training with 20kg load. Simulating Everest base camp approaches.',
    suffer_score: 85,
    weighted_average_watts: 195,
    device_watts: true,
    has_heartrate: true,
    elev_high: 2450.8,
    elev_low: 770.2,
    pr_count: 0,
    total_photo_count: 2,
    has_kudos: false,
    kudos_count: 15,
    comment_count: 4,
    athlete_count: 1,
    photo_count: 2,
    average_temp: 6,
    device_name: 'Garmin Fenix 7X'
  },
  {
    id: '10098765431',
    name: 'Recovery Trail Run - Active Rest Day',
    type: 'Run',
    start_date: '2024-03-02T16:45:00Z',
    distance: 6500,
    moving_time: 2700,
    total_elevation_gain: 280,
    average_heartrate: 132,
    max_heartrate: 148,
    location_city: 'Boulder',
    location_state: 'Colorado',
    location_country: 'United States',
    average_speed: 2.41,
    max_speed: 2.8,
    calories: 485,
    description: 'Easy recovery run on familiar trails. Focused on maintaining aerobic base without stress.',
    suffer_score: 22,
    weighted_average_watts: 210,
    device_watts: true,
    has_heartrate: true,
    elev_high: 1650.3,
    elev_low: 1370.1,
    pr_count: 0,
    total_photo_count: 0,
    has_kudos: false,
    kudos_count: 5,
    comment_count: 0,
    athlete_count: 1,
    photo_count: 0,
    average_temp: 18,
    device_name: 'Garmin Fenix 7X'
  }
]

export async function GET() {
  try {
    // Optimize performance - no artificial delay needed
    
    // Transform data to match our frontend expectations
    const transformedActivities = mockStravaActivities.map(activity => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      date: new Date(activity.start_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      distance: (activity.distance / 1000).toFixed(1), // Convert to km
      duration: activity.moving_time,
      elevation: activity.total_elevation_gain,
      heartRate: activity.average_heartrate,
      location: activity.location_city && activity.location_state 
        ? `${activity.location_city}, ${activity.location_state}`
        : 'Training Location',
      calories: activity.calories,
      averageSpeed: activity.average_speed,
      maxSpeed: activity.max_speed,
      sufferScore: activity.suffer_score,
      description: activity.description,
      kudosCount: activity.kudos_count,
      photoCount: activity.photo_count,
      deviceName: activity.device_name,
      averageTemp: activity.average_temp
    }))

    return NextResponse.json({
      activities: transformedActivities,
      source: 'Strava API Mock',
      lastSync: new Date().toISOString(),
      totalActivities: transformedActivities.length,
      status: 'success'
    })

  } catch (error) {
    console.error('Error fetching Strava activities:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch training activities',
        activities: [],
        source: 'error',
        status: 'error'
      },
      { status: 500 }
    )
  }
}

// Export dynamic to prevent build-time execution
export const dynamic = 'force-dynamic'