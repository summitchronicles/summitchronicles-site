import axios from 'axios';

// Weather API configuration
export const weatherConfig = {
  apiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  oneCallUrl: 'https://api.openweathermap.org/data/3.0/onecall',
};

// Location coordinates for mountaineering destinations
export const mountainLocations = {
  everest: {
    name: 'Mount Everest Base Camp',
    lat: 28.0026,
    lon: 86.8528,
    elevation: 5364,
  },
  denali: {
    name: 'Denali Base Camp',
    lat: 63.0692,
    lon: -151.007,
    elevation: 2194,
  },
  kilimanjaro: {
    name: 'Mount Kilimanjaro',
    lat: -3.0674,
    lon: 37.3556,
    elevation: 5895,
  },
  rainier: {
    name: 'Mount Rainier',
    lat: 46.8523,
    lon: -121.7603,
    elevation: 4392,
  },
  whitney: {
    name: 'Mount Whitney',
    lat: 36.5786,
    lon: -118.2923,
    elevation: 4421,
  },
};

export interface WeatherData {
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  elevation: number;
  current: {
    datetime: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uv_index: number;
    wind_speed: number;
    wind_direction: number;
    wind_gust?: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    sunrise: string;
    sunset: string;
  };
  forecast: WeatherForecast[];
  alerts?: WeatherAlert[];
}

export interface WeatherForecast {
  datetime: string;
  temperature: {
    min: number;
    max: number;
    morning: number;
    day: number;
    evening: number;
    night: number;
  };
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  wind_gust?: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  precipitation: {
    probability: number;
    amount?: number;
    snow?: number;
  };
  uv_index: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: string;
  end: string;
  description: string;
  tags: string[];
}

// High-altitude weather conditions
export interface HighAltitudeConditions {
  windChill: number;
  oxygenLevel: number;
  avalancheRisk: 'low' | 'moderate' | 'considerable' | 'high' | 'extreme';
  icefallConditions: 'stable' | 'unstable' | 'dangerous';
  visibilityRating: 'excellent' | 'good' | 'poor' | 'zero';
  climbingWindow: {
    isOpen: boolean;
    duration: string;
    conditions: string;
  };
}

// Fetch current weather and forecast
export async function getWeatherData(
  location: keyof typeof mountainLocations
): Promise<WeatherData | null> {
  try {
    const { lat, lon, name, elevation } = mountainLocations[location];

    const response = await axios.get(`${weatherConfig.oneCallUrl}`, {
      params: {
        lat,
        lon,
        appid: weatherConfig.apiKey,
        units: 'metric',
        exclude: 'minutely,hourly',
      },
    });

    const data = response.data;

    return {
      location: name,
      coordinates: { lat, lon },
      elevation,
      current: {
        datetime: new Date(data.current.dt * 1000).toISOString(),
        temperature: data.current.temp,
        feels_like: data.current.feels_like,
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        visibility: data.current.visibility / 1000, // Convert to km
        uv_index: data.current.uvi,
        wind_speed: data.current.wind_speed,
        wind_direction: data.current.wind_deg,
        wind_gust: data.current.wind_gust,
        weather: {
          main: data.current.weather[0].main,
          description: data.current.weather[0].description,
          icon: data.current.weather[0].icon,
        },
        sunrise: new Date(data.current.sunrise * 1000).toISOString(),
        sunset: new Date(data.current.sunset * 1000).toISOString(),
      },
      forecast: data.daily.slice(0, 7).map(
        (day: any): WeatherForecast => ({
          datetime: new Date(day.dt * 1000).toISOString(),
          temperature: {
            min: day.temp.min,
            max: day.temp.max,
            morning: day.temp.morn,
            day: day.temp.day,
            evening: day.temp.eve,
            night: day.temp.night,
          },
          humidity: day.humidity,
          pressure: day.pressure,
          wind_speed: day.wind_speed,
          wind_direction: day.wind_deg,
          wind_gust: day.wind_gust,
          weather: {
            main: day.weather[0].main,
            description: day.weather[0].description,
            icon: day.weather[0].icon,
          },
          precipitation: {
            probability: day.pop * 100,
            amount: day.rain?.['1h'],
            snow: day.snow?.['1h'],
          },
          uv_index: day.uvi,
        })
      ),
      alerts: data.alerts?.map(
        (alert: any): WeatherAlert => ({
          sender_name: alert.sender_name,
          event: alert.event,
          start: new Date(alert.start * 1000).toISOString(),
          end: new Date(alert.end * 1000).toISOString(),
          description: alert.description,
          tags: alert.tags,
        })
      ),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Calculate high-altitude specific conditions
export function calculateHighAltitudeConditions(
  weather: WeatherData
): HighAltitudeConditions {
  const { current, elevation } = weather;

  // Calculate wind chill
  const windChill = calculateWindChill(current.temperature, current.wind_speed);

  // Estimate oxygen level based on elevation
  const oxygenLevel = calculateOxygenLevel(elevation);

  // Assess avalanche risk based on weather conditions
  const avalancheRisk = assessAvalancheRisk(weather);

  // Assess icefall conditions
  const icefallConditions = assessIcefallConditions(weather);

  // Assess visibility
  const visibilityRating = assessVisibility(
    current.visibility,
    current.weather.main
  );

  // Determine climbing window
  const climbingWindow = assessClimbingWindow(weather);

  return {
    windChill,
    oxygenLevel,
    avalancheRisk,
    icefallConditions,
    visibilityRating,
    climbingWindow,
  };
}

function calculateWindChill(temperature: number, windSpeed: number): number {
  // Wind chill formula for metric units
  if (temperature <= 10 && windSpeed >= 4.8) {
    return (
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * temperature * Math.pow(windSpeed, 0.16)
    );
  }
  return temperature;
}

function calculateOxygenLevel(elevation: number): number {
  // Oxygen level decreases with altitude
  // At sea level: 100%, at 5500m (Everest base camp): ~50%
  const seaLevelPressure = 101325; // Pa
  const pressureAtAltitude =
    seaLevelPressure * Math.pow(1 - (0.0065 * elevation) / 288.15, 5.255);
  return Math.round((pressureAtAltitude / seaLevelPressure) * 100);
}

function assessAvalancheRisk(
  weather: WeatherData
): HighAltitudeConditions['avalancheRisk'] {
  const { current, forecast } = weather;
  let riskScore = 0;

  // Temperature factors
  if (current.temperature > -5 && current.temperature < 2) riskScore += 2; // Warming conditions
  if (forecast.some((day) => day.temperature.max - day.temperature.min > 10))
    riskScore += 1; // Large temp swings

  // Wind factors
  if (current.wind_speed > 15) riskScore += 2; // High winds
  if (current.wind_speed > 25) riskScore += 1; // Very high winds

  // Precipitation factors
  if (forecast.some((day) => day.precipitation.probability > 50))
    riskScore += 1;
  if (
    forecast.some(
      (day) => day.precipitation.snow && day.precipitation.snow > 10
    )
  )
    riskScore += 2;

  if (riskScore >= 5) return 'extreme';
  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'considerable';
  if (riskScore >= 1) return 'moderate';
  return 'low';
}

function assessIcefallConditions(
  weather: WeatherData
): HighAltitudeConditions['icefallConditions'] {
  const { current } = weather;

  // Icefall stability depends on temperature and movement
  if (current.temperature > 0) return 'dangerous'; // Melting conditions
  if (current.temperature > -10 && current.wind_speed > 20) return 'unstable';
  if (current.temperature < -15 && current.wind_speed < 10) return 'stable';

  return 'unstable';
}

function assessVisibility(
  visibility: number,
  weatherMain: string
): HighAltitudeConditions['visibilityRating'] {
  if (weatherMain.includes('fog') || weatherMain.includes('mist'))
    return 'poor';
  if (visibility > 10) return 'excellent';
  if (visibility > 5) return 'good';
  if (visibility > 1) return 'poor';
  return 'zero';
}

function assessClimbingWindow(
  weather: WeatherData
): HighAltitudeConditions['climbingWindow'] {
  const { current, forecast } = weather;

  // Check for good climbing conditions in next few days
  const goodDays = forecast.filter(
    (day) =>
      day.wind_speed < 15 &&
      day.precipitation.probability < 30 &&
      day.weather.main !== 'Thunderstorm'
  );

  const isCurrentlyGood =
    current.wind_speed < 15 && !current.weather.main.includes('Thunderstorm');

  if (goodDays.length >= 2 && isCurrentlyGood) {
    return {
      isOpen: true,
      duration: `${goodDays.length} days`,
      conditions: 'Excellent climbing conditions with stable weather',
    };
  } else if (goodDays.length >= 1) {
    return {
      isOpen: true,
      duration: `${goodDays.length} day`,
      conditions: 'Limited climbing window - monitor conditions closely',
    };
  } else {
    return {
      isOpen: false,
      duration: '0 days',
      conditions: 'Poor climbing conditions - wait for weather improvement',
    };
  }
}

// Weather utility functions
export function getWeatherIcon(iconCode: string): string {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '🌨️',
    '13n': '🌨️',
    '50d': '🌫️',
    '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌤️';
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} m/s`;
}

export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`;
}

export function getWindDirection(degrees: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Mock weather data for development
export function getMockWeatherData(): WeatherData {
  return {
    location: 'Mount Everest Base Camp',
    coordinates: { lat: 28.0026, lon: 86.8528 },
    elevation: 5364,
    current: {
      datetime: new Date().toISOString(),
      temperature: -15,
      feels_like: -22,
      humidity: 65,
      pressure: 1013,
      visibility: 8.5,
      uv_index: 2,
      wind_speed: 12,
      wind_direction: 270,
      wind_gust: 18,
      weather: {
        main: 'Snow',
        description: 'light snow',
        icon: '13d',
      },
      sunrise: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      sunset: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      datetime: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      temperature: {
        min: -18 - i,
        max: -8 - i,
        morning: -15 - i,
        day: -10 - i,
        evening: -12 - i,
        night: -16 - i,
      },
      humidity: 60 + i * 2,
      pressure: 1013 - i,
      wind_speed: 10 + i * 2,
      wind_direction: 270,
      weather: {
        main: i % 2 === 0 ? 'Snow' : 'Clear',
        description: i % 2 === 0 ? 'light snow' : 'clear sky',
        icon: i % 2 === 0 ? '13d' : '01d',
      },
      precipitation: {
        probability: i % 2 === 0 ? 70 : 10,
        snow: i % 2 === 0 ? 5 : undefined,
      },
      uv_index: 2,
    })),
    alerts: [],
  };
}
