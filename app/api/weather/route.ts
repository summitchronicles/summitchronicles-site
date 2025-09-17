import { NextRequest, NextResponse } from 'next/server'
import { getWeatherData, calculateHighAltitudeConditions, getMockWeatherData, mountainLocations } from '../../../lib/integrations/weather'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') as keyof typeof mountainLocations || 'everest'
    const useMockData = searchParams.get('mock') === 'true'

    let weatherData

    if (useMockData || !process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      // Use mock data for development
      weatherData = getMockWeatherData()
    } else {
      // Fetch real weather data
      try {
        weatherData = await getWeatherData(location)
        if (!weatherData) {
          throw new Error('Failed to fetch weather data')
        }
      } catch (error) {
        console.error('Weather API error, falling back to mock data:', error)
        weatherData = getMockWeatherData()
      }
    }

    // Calculate high-altitude conditions
    const altitudeConditions = calculateHighAltitudeConditions(weatherData)

    return NextResponse.json({
      success: true,
      data: {
        weather: weatherData,
        conditions: altitudeConditions,
        meta: {
          timestamp: new Date().toISOString(),
          usedMockData: useMockData || !process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          location: location
        }
      }
    })

  } catch (error) {
    console.error('Weather data error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locations } = body

    if (!locations || !Array.isArray(locations)) {
      return NextResponse.json(
        { success: false, error: 'Invalid locations array' },
        { status: 400 }
      )
    }

    // Fetch weather for multiple locations
    const weatherPromises = locations.map(async (location: string) => {
      try {
        const weatherData = await getWeatherData(location as keyof typeof mountainLocations)
        if (weatherData) {
          const conditions = calculateHighAltitudeConditions(weatherData)
          return {
            location,
            weather: weatherData,
            conditions,
            success: true
          }
        }
        return {
          location,
          success: false,
          error: 'Failed to fetch data'
        }
      } catch (error) {
        return {
          location,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    const results = await Promise.all(weatherPromises)

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        timestamp: new Date().toISOString(),
        count: results.length
      }
    })

  } catch (error) {
    console.error('Bulk weather data error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bulk weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}