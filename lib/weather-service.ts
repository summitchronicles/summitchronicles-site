import { GPSPoint, WeatherData, WeatherForecast } from './expedition-tracker';

export interface WeatherPrediction {
  timestamp: number;
  confidence: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  conditions: {
    temperature: number;
    windSpeed: number;
    precipitation: number;
    visibility: number;
    cloudCover: number;
  };
  warnings: string[];
  recommendations: string[];
}

export interface ClimbingConditions {
  overallRisk: 'low' | 'moderate' | 'high' | 'extreme';
  windowScore: number; // 0-100 climbing window score
  optimalWindow?: {
    start: number;
    end: number;
    conditions: string;
  };
  hazards: {
    type: 'weather' | 'avalanche' | 'visibility' | 'temperature' | 'wind';
    severity: number; // 1-5
    description: string;
  }[];
}

export class WeatherService {
  private static instance: WeatherService;
  private weatherCache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private predictionCache: Map<string, { predictions: WeatherPrediction[]; timestamp: number }> = new Map();

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  // Get current weather conditions
  async getCurrentWeather(position: GPSPoint): Promise<WeatherData> {
    const cacheKey = `${position.lat.toFixed(2)},${position.lng.toFixed(2)}`;
    const cached = this.weatherCache.get(cacheKey);
    
    // Return cached data if less than 10 minutes old
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      return cached.data;
    }

    try {
      // In a real implementation, this would call a weather API like OpenWeatherMap
      // For now, we'll generate realistic mountain weather data
      const weather = this.generateMountainWeather(position);
      
      this.weatherCache.set(cacheKey, {
        data: weather,
        timestamp: Date.now()
      });
      
      return weather;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Return fallback data
      return this.generateMountainWeather(position);
    }
  }

  // Generate predictive weather modeling
  async getWeatherPredictions(position: GPSPoint, hours: number = 48): Promise<WeatherPrediction[]> {
    const cacheKey = `${position.lat.toFixed(2)},${position.lng.toFixed(2)}-${hours}h`;
    const cached = this.predictionCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
      return cached.predictions;
    }

    const predictions: WeatherPrediction[] = [];
    const baseTime = Date.now();
    
    for (let i = 0; i < hours; i++) {
      const timestamp = baseTime + i * 60 * 60 * 1000;
      const prediction = this.generateWeatherPrediction(position, timestamp, i);
      predictions.push(prediction);
    }
    
    this.predictionCache.set(cacheKey, {
      predictions,
      timestamp: Date.now()
    });
    
    return predictions;
  }

  // Analyze climbing conditions
  async analyzeClimbingConditions(
    position: GPSPoint,
    route: GPSPoint[],
    timeWindow: number = 48
  ): Promise<ClimbingConditions> {
    const predictions = await this.getWeatherPredictions(position, timeWindow);
    const currentWeather = await this.getCurrentWeather(position);
    
    // Calculate overall risk based on weather factors
    let riskScore = 0;
    const hazards: ClimbingConditions['hazards'] = [];
    
    // Analyze current conditions
    if (currentWeather.windSpeed > 60) {
      riskScore += 30;
      hazards.push({
        type: 'wind',
        severity: Math.min(5, Math.floor(currentWeather.windSpeed / 20)),
        description: `Dangerous winds: ${currentWeather.windSpeed} km/h`
      });
    }
    
    if (currentWeather.temperature < -20) {
      riskScore += 25;
      hazards.push({
        type: 'temperature',
        severity: Math.min(5, Math.abs(currentWeather.temperature + 20) / 10),
        description: `Extreme cold: ${currentWeather.temperature}°C`
      });
    }
    
    if (currentWeather.visibility < 100) {
      riskScore += 20;
      hazards.push({
        type: 'visibility',
        severity: 5 - Math.floor(currentWeather.visibility / 500),
        description: `Poor visibility: ${currentWeather.visibility}m`
      });
    }
    
    // Analyze predictions for optimal climbing window
    let bestWindow: ClimbingConditions['optimalWindow'];
    let bestWindowScore = 0;
    
    for (let i = 0; i < predictions.length - 6; i++) {
      const windowPredictions = predictions.slice(i, i + 6); // 6-hour window
      const windowScore = this.calculateWindowScore(windowPredictions);
      
      if (windowScore > bestWindowScore) {
        bestWindowScore = windowScore;
        bestWindow = {
          start: windowPredictions[0].timestamp,
          end: windowPredictions[windowPredictions.length - 1].timestamp,
          conditions: this.summarizeWindowConditions(windowPredictions)
        };
      }
    }
    
    // Determine overall risk level
    const overallRisk = riskScore > 70 ? 'extreme' :
                       riskScore > 50 ? 'high' :
                       riskScore > 25 ? 'moderate' : 'low';
    
    return {
      overallRisk,
      windowScore: bestWindowScore,
      optimalWindow: bestWindow,
      hazards
    };
  }

  // Generate realistic mountain weather data
  private generateMountainWeather(position: GPSPoint): WeatherData {
    // Base temperature decreases with altitude (lapse rate ~6.5°C per 1000m)
    const baseTemp = 15 - (position.altitude * 6.5 / 1000);
    const tempVariation = (Math.random() - 0.5) * 10;
    const temperature = baseTemp + tempVariation;
    
    // Wind increases with altitude and varies by time
    const baseWindSpeed = Math.min(80, 10 + position.altitude * 0.02);
    const windVariation = Math.random() * 20;
    const windSpeed = Math.max(0, baseWindSpeed + windVariation - 10);
    
    // Higher altitude = lower pressure
    const pressure = 1013 * Math.pow(1 - (0.0065 * position.altitude / 288.15), 5.255);
    
    // Humidity varies with weather patterns
    const humidity = 40 + Math.random() * 40;
    
    // Visibility affected by weather conditions
    const visibility = Math.max(100, 10000 - Math.random() * 8000);
    
    // Simple weather condition logic
    const tempConditions = temperature < -10 ? ['snow', 'ice'] :
                          temperature < 5 ? ['snow', 'cloudy', 'clear'] :
                          ['clear', 'cloudy', 'rain'];
    const windConditions = windSpeed > 40 ? ['windy'] : [];
    const allConditions = [...tempConditions, ...windConditions];
    const conditions = allConditions[Math.floor(Math.random() * allConditions.length)];
    
    // Generate forecast for next 24 hours
    const forecast: WeatherForecast[] = [];
    for (let i = 1; i <= 24; i += 3) {
      forecast.push({
        time: Date.now() + i * 60 * 60 * 1000,
        temperature: temperature + (Math.random() - 0.5) * 5,
        conditions: allConditions[Math.floor(Math.random() * allConditions.length)],
        windSpeed: Math.max(0, windSpeed + (Math.random() - 0.5) * 15),
        precipitation: Math.random() < 0.3 ? Math.random() * 5 : 0
      });
    }
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed),
      windDirection: Math.round(Math.random() * 360),
      pressure: Math.round(pressure),
      visibility: Math.round(visibility),
      conditions,
      forecast
    };
  }

  // Generate weather prediction with risk analysis
  private generateWeatherPrediction(
    position: GPSPoint,
    timestamp: number,
    hoursFromNow: number
  ): WeatherPrediction {
    // Confidence decreases over time
    const confidence = Math.max(0.3, 0.95 - (hoursFromNow * 0.02));
    
    // Generate weather conditions similar to current but with variation
    const baseWeather = this.generateMountainWeather(position);
    
    // Add time-based variations and trends
    const hourOfDay = new Date(timestamp).getHours();
    const tempAdjustment = hourOfDay < 6 || hourOfDay > 18 ? -5 : 0; // Colder at night
    
    const conditions = {
      temperature: baseWeather.temperature + tempAdjustment + (Math.random() - 0.5) * 3,
      windSpeed: Math.max(0, baseWeather.windSpeed + (Math.random() - 0.5) * 10),
      precipitation: Math.random() < 0.2 ? Math.random() * 3 : 0,
      visibility: Math.max(50, baseWeather.visibility + (Math.random() - 0.5) * 2000),
      cloudCover: Math.random() * 100
    };
    
    // Assess risk level
    let riskScore = 0;
    if (conditions.windSpeed > 50) riskScore += 25;
    if (conditions.temperature < -15) riskScore += 25;
    if (conditions.visibility < 200) riskScore += 25;
    if (conditions.precipitation > 1) riskScore += 15;
    if (conditions.cloudCover > 80) riskScore += 10;
    
    const riskLevel = riskScore > 70 ? 'extreme' :
                     riskScore > 50 ? 'high' :
                     riskScore > 25 ? 'moderate' : 'low';
    
    // Generate warnings and recommendations
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    if (conditions.windSpeed > 40) {
      warnings.push(`Strong winds expected: ${Math.round(conditions.windSpeed)} km/h`);
      recommendations.push('Consider delayed start or route modification');
    }
    
    if (conditions.temperature < -10) {
      warnings.push(`Extreme cold conditions: ${Math.round(conditions.temperature)}°C`);
      recommendations.push('Ensure proper cold weather gear and nutrition');
    }
    
    if (conditions.visibility < 500) {
      warnings.push('Poor visibility conditions expected');
      recommendations.push('GPS navigation and emergency signaling devices essential');
    }
    
    if (conditions.precipitation > 0.5) {
      warnings.push(`Precipitation expected: ${Math.round(conditions.precipitation * 10) / 10}mm/h`);
      recommendations.push('Waterproof gear and slip-resistant equipment recommended');
    }
    
    return {
      timestamp,
      confidence: Math.round(confidence * 100) / 100,
      riskLevel,
      conditions: {
        temperature: Math.round(conditions.temperature * 10) / 10,
        windSpeed: Math.round(conditions.windSpeed),
        precipitation: Math.round(conditions.precipitation * 10) / 10,
        visibility: Math.round(conditions.visibility),
        cloudCover: Math.round(conditions.cloudCover)
      },
      warnings,
      recommendations
    };
  }

  // Calculate climbing window score (0-100)
  private calculateWindowScore(predictions: WeatherPrediction[]): number {
    let score = 100;
    
    predictions.forEach(prediction => {
      // Deduct points for poor conditions
      if (prediction.conditions.windSpeed > 30) score -= (prediction.conditions.windSpeed - 30);
      if (prediction.conditions.temperature < -10) score -= Math.abs(prediction.conditions.temperature + 10) * 2;
      if (prediction.conditions.visibility < 1000) score -= (1000 - prediction.conditions.visibility) / 10;
      if (prediction.conditions.precipitation > 0) score -= prediction.conditions.precipitation * 10;
      if (prediction.riskLevel === 'high') score -= 20;
      if (prediction.riskLevel === 'extreme') score -= 40;
    });
    
    return Math.max(0, Math.min(100, score));
  }

  // Summarize conditions for an optimal window
  private summarizeWindowConditions(predictions: WeatherPrediction[]): string {
    const avgTemp = predictions.reduce((sum, p) => sum + p.conditions.temperature, 0) / predictions.length;
    const avgWind = predictions.reduce((sum, p) => sum + p.conditions.windSpeed, 0) / predictions.length;
    const hasPrec = predictions.some(p => p.conditions.precipitation > 0.1);
    
    let summary = `${Math.round(avgTemp)}°C, winds ${Math.round(avgWind)} km/h`;
    if (hasPrec) summary += ', precipitation possible';
    if (predictions.every(p => p.riskLevel === 'low')) summary += ' - excellent conditions';
    
    return summary;
  }
}

// Export singleton instance
export const weatherService = WeatherService.getInstance();