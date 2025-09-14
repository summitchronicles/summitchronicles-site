// Strava API integration for personal account data

export interface StravaActivity {
  id: number
  name: string
  type: string
  start_date: string
  distance: number
  moving_time: number
  total_elevation_gain: number
  average_heartrate?: number
  max_heartrate?: number
  location_city?: string
  location_state?: string
  map?: {
    summary_polyline?: string
  }
  kudos_count?: number
  photo_count?: number
}

export interface StravaAthlete {
  id: number
  firstname: string
  lastname: string
  city: string
  state: string
  country: string
  profile: string
  profile_medium: string
  follower_count: number
  friend_count: number
}

export interface StravaTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: StravaAthlete
}

// In a production app, these would be stored in a secure database
// For now, we'll simulate with environment variables or temporary storage
let cachedTokens: StravaTokens | null = null

export async function getStravaAccessToken(): Promise<string | null> {
  // In development, return null to use mock data
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  // Check if we have cached valid tokens
  if (cachedTokens && cachedTokens.expires_at > Date.now() / 1000) {
    return cachedTokens.access_token
  }

  // If we have a refresh token, try to refresh
  if (cachedTokens?.refresh_token) {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: cachedTokens.refresh_token,
        }),
      })

      if (response.ok) {
        const newTokens = await response.json()
        cachedTokens = newTokens
        return newTokens.access_token
      }
    } catch (error) {
      console.error('Error refreshing Strava token:', error)
    }
  }

  return null
}

export async function fetchStravaActivities(page = 1, perPage = 30): Promise<StravaActivity[]> {
  const accessToken = await getStravaAccessToken()
  
  if (!accessToken) {
    // Return mock data for development or when not authenticated
    return getMockActivities()
  }

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Strava activities:', error)
    return getMockActivities() // Fallback to mock data
  }
}

export async function fetchStravaAthlete(): Promise<StravaAthlete | null> {
  const accessToken = await getStravaAccessToken()
  
  if (!accessToken) {
    return null
  }

  try {
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Strava athlete:', error)
    return null
  }
}

function getMockActivities(): StravaActivity[] {
  return [
    {
      id: 10234567890,
      name: 'Morning Alpine Training - Mt. Elbert',
      type: 'Hike',
      start_date: '2024-09-12T06:30:00Z',
      distance: 12500,
      moving_time: 14400,
      total_elevation_gain: 1250,
      average_heartrate: 142,
      max_heartrate: 168,
      location_city: 'Twin Lakes',
      location_state: 'Colorado',
      kudos_count: 23,
      photo_count: 8,
      map: {
        summary_polyline: 'mock_polyline_data'
      }
    },
    {
      id: 10234567891,
      name: 'High Altitude Endurance Run',
      type: 'Run',
      start_date: '2024-09-09T07:00:00Z',
      distance: 8200,
      moving_time: 3600,
      total_elevation_gain: 450,
      average_heartrate: 156,
      max_heartrate: 175,
      location_city: 'Boulder',
      location_state: 'Colorado',
      kudos_count: 15,
      photo_count: 2,
      map: {
        summary_polyline: 'mock_polyline_data'
      }
    },
    {
      id: 10234567892,
      name: 'Technical Ice Climbing - Ouray',
      type: 'IceClimb',
      start_date: '2024-09-05T09:00:00Z',
      distance: 2100,
      moving_time: 7200,
      total_elevation_gain: 800,
      location_city: 'Ouray',
      location_state: 'Colorado',
      kudos_count: 34,
      photo_count: 12,
      map: {
        summary_polyline: 'mock_polyline_data'
      }
    },
    {
      id: 10234567893,
      name: 'Weighted Pack Training - Bear Peak',
      type: 'Hike',
      start_date: '2024-09-02T05:45:00Z',
      distance: 9800,
      moving_time: 10800,
      total_elevation_gain: 980,
      average_heartrate: 148,
      max_heartrate: 162,
      location_city: 'Boulder',
      location_state: 'Colorado',
      kudos_count: 18,
      photo_count: 5,
      map: {
        summary_polyline: 'mock_polyline_data'
      }
    },
    {
      id: 10234567894,
      name: 'Interval Training - Flagstaff',
      type: 'Run',
      start_date: '2024-08-30T06:15:00Z',
      distance: 6500,
      moving_time: 2700,
      total_elevation_gain: 320,
      average_heartrate: 168,
      max_heartrate: 182,
      location_city: 'Boulder',
      location_state: 'Colorado',
      kudos_count: 12,
      photo_count: 1,
      map: {
        summary_polyline: 'mock_polyline_data'
      }
    },
    {
      id: 10234567895,
      name: 'Recovery Hike - Chautauqua Park',
      type: 'Hike',
      start_date: '2024-08-28T08:00:00Z',
      distance: 5200,
      moving_time: 4500,
      total_elevation_gain: 280,
      average_heartrate: 125,
      max_heartrate: 138,
      location_city: 'Boulder',
      location_state: 'Colorado',
      kudos_count: 8,
      photo_count: 3,
      map: {
        summary_polyline: 'mock_polyline_data'
      }
    }
  ]
}

export function storeStravaTokens(tokens: StravaTokens) {
  cachedTokens = tokens
  // In production, store these securely in a database
  console.log('Strava tokens stored for athlete:', tokens.athlete.id)
}