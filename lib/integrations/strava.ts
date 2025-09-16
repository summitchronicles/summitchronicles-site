import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'

// Strava API configuration
export const stravaConfig = {
  clientId: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '',
  clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
  refreshToken: process.env.STRAVA_REFRESH_TOKEN || '',
  accessToken: process.env.STRAVA_ACCESS_TOKEN || '',
  apiUrl: 'https://www.strava.com/api/v3',
  authUrl: 'https://www.strava.com/oauth/token'
}

// Strava activity types
export interface StravaActivity {
  id: number
  name: string
  type: string
  sport_type: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  start_date: string
  start_date_local: string
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: {
    id: string
    summary_polyline: string
    resource_state: number
  }
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id?: string
  from_accepted_tag: boolean
  upload_id: number
  external_id: string
  average_speed: number
  max_speed: number
  average_cadence?: number
  average_watts?: number
  weighted_average_watts?: number
  kilojoules?: number
  device_watts?: boolean
  has_heartrate: boolean
  average_heartrate?: number
  max_heartrate?: number
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high?: number
  elev_low?: number
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
  workout_type?: number
  suffer_score?: number
  description?: string
  calories?: number
}

export interface StravaStats {
  biggest_ride_distance: number
  biggest_climb_elevation_gain: number
  recent_ride_totals: {
    count: number
    distance: number
    moving_time: number
    elapsed_time: number
    elevation_gain: number
    achievement_count: number
  }
  recent_run_totals: {
    count: number
    distance: number
    moving_time: number
    elapsed_time: number
    elevation_gain: number
    achievement_count: number
  }
  ytd_ride_totals: {
    count: number
    distance: number
    moving_time: number
    elapsed_time: number
    elevation_gain: number
  }
  ytd_run_totals: {
    count: number
    distance: number
    moving_time: number
    elapsed_time: number
    elevation_gain: number
  }
  all_ride_totals: {
    count: number
    distance: number
    moving_time: number
    elapsed_time: number
    elevation_gain: number
  }
  all_run_totals: {
    count: number
    distance: number
    moving_time: number
    elapsed_time: number
    elevation_gain: number
  }
}

export interface AthleteProfile {
  id: number
  username: string
  resource_state: number
  firstname: string
  lastname: string
  bio: string
  city: string
  state: string
  country: string
  sex: string
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
  badge_type_id: number
  weight: number
  profile_medium: string
  profile: string
  friend?: string
  follower?: string
}

// Token refresh function
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(stravaConfig.authUrl, {
      client_id: stravaConfig.clientId,
      client_secret: stravaConfig.clientSecret,
      refresh_token: stravaConfig.refreshToken,
      grant_type: 'refresh_token'
    })

    const { access_token } = response.data
    
    // In a real app, you'd save this token securely
    // For now, we'll just return it
    return access_token
  } catch (error) {
    console.error('Error refreshing Strava token:', error)
    return null
  }
}

// Get athlete profile
export async function getAthleteProfile(): Promise<AthleteProfile | null> {
  try {
    let accessToken = stravaConfig.accessToken
    
    if (!accessToken) {
      accessToken = await refreshAccessToken()
      if (!accessToken) {
        throw new Error('Failed to get access token')
      }
    }

    const response = await axios.get(`${stravaConfig.apiUrl}/athlete`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching athlete profile:', error)
    return null
  }
}

// Get recent activities
export async function getRecentActivities(limit: number = 30): Promise<StravaActivity[]> {
  try {
    let accessToken = stravaConfig.accessToken
    
    if (!accessToken) {
      accessToken = await refreshAccessToken()
      if (!accessToken) {
        throw new Error('Failed to get access token')
      }
    }

    const response = await axios.get(`${stravaConfig.apiUrl}/athlete/activities`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        per_page: limit,
        page: 1
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

// Get athlete statistics
export async function getAthleteStats(athleteId: number): Promise<StravaStats | null> {
  try {
    let accessToken = stravaConfig.accessToken
    
    if (!accessToken) {
      accessToken = await refreshAccessToken()
      if (!accessToken) {
        throw new Error('Failed to get access token')
      }
    }

    const response = await axios.get(`${stravaConfig.apiUrl}/athletes/${athleteId}/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching athlete stats:', error)
    return null
  }
}

// Utility functions
export function formatDistance(meters: number): string {
  const km = meters / 1000
  return `${km.toFixed(1)} km`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters).toLocaleString()} m`
}

export function formatSpeed(metersPerSecond: number): string {
  const kmh = metersPerSecond * 3.6
  return `${kmh.toFixed(1)} km/h`
}

export function formatActivityDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export function getActivityIcon(activityType: string): string {
  const iconMap: { [key: string]: string } = {
    'Ride': '🚴',
    'Run': '🏃',
    'Hike': '🥾',
    'Walk': '🚶',
    'Swim': '🏊',
    'AlpineSki': '⛷️',
    'BackcountrySki': '🎿',
    'NordicSki': '⛷️',
    'Snowboard': '🏂',
    'Snowshoe': '🥾',
    'RockClimbing': '🧗',
    'IceClimbing': '🧊',
    'Mountaineering': '⛰️',
    'TrailRun': '🏃‍♂️',
    'Workout': '💪',
    'WeightTraining': '🏋️',
    'Crossfit': '🤸',
    'Yoga': '🧘',
    'VirtualRide': '🚴‍♂️',
    'VirtualRun': '🏃‍♂️'
  }
  
  return iconMap[activityType] || '🏃'
}

export function getActivityColor(activityType: string): string {
  const colorMap: { [key: string]: string } = {
    'Ride': 'text-blue-600',
    'Run': 'text-red-600',
    'Hike': 'text-green-600',
    'Walk': 'text-gray-600',
    'Swim': 'text-cyan-600',
    'AlpineSki': 'text-purple-600',
    'BackcountrySki': 'text-purple-600',
    'NordicSki': 'text-purple-600',
    'Snowboard': 'text-indigo-600',
    'Snowshoe': 'text-brown-600',
    'RockClimbing': 'text-orange-600',
    'IceClimbing': 'text-blue-300',
    'Mountaineering': 'text-gray-800',
    'TrailRun': 'text-green-700',
    'Workout': 'text-yellow-600',
    'WeightTraining': 'text-red-700',
    'Crossfit': 'text-pink-600',
    'Yoga': 'text-purple-500',
    'VirtualRide': 'text-blue-400',
    'VirtualRun': 'text-red-400'
  }
  
  return colorMap[activityType] || 'text-gray-600'
}

// Mock data for development/fallback
export function getMockStravaData(): {
  activities: StravaActivity[]
  stats: StravaStats
  profile: AthleteProfile
} {
  return {
    activities: [
      {
        id: 1,
        name: "High Altitude Training - 4200m",
        type: "Hike",
        sport_type: "Hike",
        distance: 12000,
        moving_time: 14400,
        elapsed_time: 16200,
        total_elevation_gain: 1200,
        start_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        start_date_local: new Date(Date.now() - 86400000 * 2).toISOString(),
        achievement_count: 2,
        kudos_count: 15,
        comment_count: 3,
        athlete_count: 1,
        photo_count: 5,
        map: {
          id: "map1",
          summary_polyline: "",
          resource_state: 2
        },
        trainer: false,
        commute: false,
        manual: false,
        private: false,
        visibility: "everyone",
        flagged: false,
        from_accepted_tag: false,
        upload_id: 1001,
        external_id: "ext1",
        average_speed: 0.83,
        max_speed: 2.1,
        has_heartrate: true,
        average_heartrate: 145,
        max_heartrate: 168,
        heartrate_opt_out: false,
        display_hide_heartrate_option: false,
        elev_high: 4200,
        elev_low: 3000,
        pr_count: 1,
        total_photo_count: 5,
        has_kudoed: false,
        calories: 1890
      }
    ],
    stats: {
      biggest_ride_distance: 85000,
      biggest_climb_elevation_gain: 2100,
      recent_ride_totals: {
        count: 12,
        distance: 456000,
        moving_time: 87600,
        elapsed_time: 104400,
        elevation_gain: 8900,
        achievement_count: 5
      },
      recent_run_totals: {
        count: 18,
        distance: 234000,
        moving_time: 76800,
        elapsed_time: 82800,
        elevation_gain: 4500,
        achievement_count: 8
      },
      ytd_ride_totals: {
        count: 89,
        distance: 3456000,
        moving_time: 567000,
        elapsed_time: 645000,
        elevation_gain: 67800
      },
      ytd_run_totals: {
        count: 156,
        distance: 1890000,
        moving_time: 456000,
        elapsed_time: 487000,
        elevation_gain: 34500
      },
      all_ride_totals: {
        count: 234,
        distance: 8900000,
        moving_time: 1234000,
        elapsed_time: 1456000,
        elevation_gain: 156000
      },
      all_run_totals: {
        count: 456,
        distance: 4567000,
        moving_time: 987000,
        elapsed_time: 1098000,
        elevation_gain: 89000
      }
    },
    profile: {
      id: 12345,
      username: "sunithkumar",
      resource_state: 3,
      firstname: "Sunith",
      lastname: "Kumar",
      bio: "Aspiring Mount Everest climber documenting the journey",
      city: "Mountain View",
      state: "California",
      country: "United States",
      sex: "M",
      premium: true,
      summit: true,
      created_at: "2020-01-01T00:00:00Z",
      updated_at: new Date().toISOString(),
      badge_type_id: 1,
      weight: 75,
      profile_medium: "",
      profile: ""
    }
  }
}