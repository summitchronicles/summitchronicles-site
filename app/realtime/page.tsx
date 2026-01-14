'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/organisms/Header';
import { SyncManager } from '../components/realtime/SyncManager';
import { TrainingInsights } from '../components/ai/TrainingInsights';
import { motion } from 'framer-motion';
import {
  Mountain,
  Thermometer,
  Wind,
  Eye,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface WeatherData {
  weather: {
    location: string;
    coordinates: { lat: number; lon: number };
    elevation: number;
    current: any;
    forecast: any[];
    alerts?: any[];
  };
  conditions: {
    windChill: number;
    oxygenLevel: number;
    avalancheRisk: string;
    icefallConditions: string;
    visibilityRating: string;
    climbingWindow: {
      isOpen: boolean;
      duration: string;
      conditions: string;
    };
  };
  meta: {
    timestamp: string;
    usedMockData: boolean;
    location: string;
  };
}

export default function RealtimePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);

      // Fetch Weather data
      const weatherResponse = await fetch(
        '/api/weather?location=everest&mock=true'
      );
      const weatherResult = await weatherResponse.json();

      if (weatherResult.success) {
        setWeatherData(weatherResult.data);
      }

      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch real-time data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up automatic refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'considerable':
        return 'text-orange-600 bg-orange-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'extreme':
        return 'text-red-800 bg-red-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'stable':
        return 'text-green-600 bg-green-100';
      case 'unstable':
        return 'text-yellow-600 bg-yellow-100';
      case 'dangerous':
        return 'text-red-600 bg-red-100';
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'poor':
        return 'text-orange-600 bg-orange-100';
      case 'zero':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-spa-stone flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-spa-stone/20 rounded-xl"></div>
                <div className="h-96 bg-spa-stone/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-light text-spa-charcoal mb-4">
                Real-time Dashboard
              </h1>
              <p className="text-xl text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed mb-6">
                Real-time mountain conditions for expedition planning.
              </p>

              <div className="flex items-center justify-center gap-4">
                {lastUpdate && (
                  <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-alpine-blue" />
                    <span className="text-sm font-medium">
                      Updated {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                )}

                <button
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 bg-alpine-blue text-white px-4 py-2 rounded-lg hover:bg-alpine-blue/90 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Real-time Data Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 gap-8">
              {/* Weather Data Section */}
              <motion.div
                className="bg-white rounded-xl border border-spa-stone/10 shadow-sm overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mountain className="w-8 h-8" />
                      <h2 className="text-2xl font-light">
                        Mountain Conditions
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light">
                        {weatherData?.weather.current.temperature}°C
                      </div>
                      <div className="text-sm opacity-90">
                        {weatherData?.weather.location}
                      </div>
                    </div>
                  </div>
                </div>

                {weatherData && (
                  <div className="p-6 space-y-4">
                    {/* Current Conditions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-spa-cloud/10 rounded-lg">
                        <Wind className="w-6 h-6 mx-auto mb-2 text-alpine-blue" />
                        <div className="text-lg font-light text-spa-charcoal">
                          {weatherData.weather.current.wind_speed} m/s
                        </div>
                        <div className="text-xs text-spa-charcoal/60">
                          Wind Speed
                        </div>
                      </div>

                      <div className="text-center p-3 bg-spa-cloud/10 rounded-lg">
                        <Eye className="w-6 h-6 mx-auto mb-2 text-alpine-blue" />
                        <div className="text-lg font-light text-spa-charcoal">
                          {weatherData.weather.current.visibility}km
                        </div>
                        <div className="text-xs text-spa-charcoal/60">
                          Visibility
                        </div>
                      </div>
                    </div>

                    {/* Climbing Conditions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-spa-charcoal">
                          Climbing Window
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            weatherData.conditions.climbingWindow.isOpen
                              ? 'text-green-700 bg-green-100'
                              : 'text-red-700 bg-red-100'
                          }`}
                        >
                          {weatherData.conditions.climbingWindow.isOpen
                            ? 'Open'
                            : 'Closed'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-spa-charcoal">
                          Avalanche Risk
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(weatherData.conditions.avalancheRisk)}`}
                        >
                          {weatherData.conditions.avalancheRisk}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-spa-charcoal">
                          Icefall Conditions
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(weatherData.conditions.icefallConditions)}`}
                        >
                          {weatherData.conditions.icefallConditions}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-spa-charcoal">
                          Oxygen Level
                        </span>
                        <span className="text-sm font-medium text-spa-charcoal">
                          {weatherData.conditions.oxygenLevel}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Weather Alerts */}
            {weatherData?.weather.alerts &&
              weatherData.weather.alerts.length > 0 && (
                <motion.div
                  className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-medium text-red-900">
                      Weather Alerts
                    </h3>
                  </div>
                  {weatherData.weather.alerts.map(
                    (alert: any, index: number) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <h4 className="font-medium text-red-900 mb-1">
                          {alert.event}
                        </h4>
                        <p className="text-sm text-red-800 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    )
                  )}
                </motion.div>
              )}

            {/* Sync Manager */}
            <div className="mt-8">
              <SyncManager />
            </div>

            {/* AI Training Insights - Pass empty activities since Strava is gone */}
            <div className="mt-8">
              <TrainingInsights
                activities={[]}
                goals={[
                  'High-altitude expedition training',
                  'Build endurance for Everest',
                  'Improve technical climbing skills',
                ]}
              />
            </div>

            {/* Data Sources Info */}
            <motion.div
              className="mt-8 bg-spa-cloud/20 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-medium text-spa-charcoal mb-4">
                Real-time Data Sources
              </h3>
              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <h4 className="font-medium text-spa-charcoal mb-2 flex items-center gap-2">
                    <Mountain className="w-4 h-4" />
                    Mountain Conditions
                  </h4>
                  <p className="text-sm text-spa-charcoal/70 leading-relaxed">
                    Weather data from OpenWeather API with specialized
                    high-altitude analysis for climbing conditions, avalanche
                    risk, and safety assessments.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
