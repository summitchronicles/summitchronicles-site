'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/organisms/Header';
import { Footer } from '../../components/organisms/Footer';
import { TrainingDashboard } from '../../components/realtime/TrainingDashboard';
import {
  Activity,
  TrendingUp,
  Target,
  Clock,
  Mountain,
  Zap,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface TrainingMetrics {
  totalActivities: number;
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  weeklyProgress: number;
  monthlyGoal: number;
  lastActivity?: {
    name: string;
    date: string;
    distance: number;
    elevation: number;
    type: string;
  };
}

export default function RealtimeTrainingPage() {
  const [metrics, setMetrics] = useState<TrainingMetrics>({
    totalActivities: 0,
    totalDistance: 0,
    totalElevation: 0,
    totalTime: 0,
    weeklyProgress: 0,
    monthlyGoal: 100,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadTrainingData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadTrainingData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Strava API
      const response = await fetch('/api/strava/activities');

      if (response.ok) {
        const activities = await response.json();
        setIsConnected(true);

        // Process activities into metrics
        const processedMetrics = processActivities(activities);
        setMetrics(processedMetrics);
      } else {
        // Fallback to mock data
        setIsConnected(false);
        setMetrics(getMockTrainingData());
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading training data:', err);
      setError('Failed to load training data');
      setIsConnected(false);
      // Use mock data as fallback
      setMetrics(getMockTrainingData());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const processActivities = (activities: any[]): TrainingMetrics => {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );

    let totalDistance = 0;
    let totalElevation = 0;
    let totalTime = 0;
    let weeklyDistance = 0;
    let lastActivity: any = null;

    activities.forEach((activity) => {
      const activityDate = new Date(activity.date || activity.start_date);
      const distance = parseFloat(activity.distance) || 0; // API returns km as string
      const elevation = parseInt(activity.elevation || activity.total_elevation_gain) || 0;
      const duration = parseInt(activity.duration || activity.moving_time) || 0;
      
      totalDistance += distance;
      totalElevation += elevation;
      totalTime += duration;

      if (activityDate >= weekStart) {
        weeklyDistance += distance;
      }

      if (!lastActivity || activityDate > new Date(lastActivity.date)) {
        lastActivity = {
          name: activity.name,
          date: activity.date || activity.start_date,
          distance: distance,
          elevation: elevation,
          type: activity.type || 'Unknown',
        };
      }
    });

    return {
      totalActivities: activities.length,
      totalDistance: Math.round(totalDistance), // Already in km from API
      totalElevation: Math.round(totalElevation),
      totalTime: Math.round(totalTime / 3600), // Convert seconds to hours
      weeklyProgress: Math.round((weeklyDistance / 50) * 100), // Assume 50km weekly goal
      monthlyGoal: 200, // 200km monthly goal
      lastActivity,
    };
  };

  const getMockTrainingData = (): TrainingMetrics => ({
    totalActivities: 42,
    totalDistance: 156,
    totalElevation: 12400,
    totalTime: 98,
    weeklyProgress: 68,
    monthlyGoal: 200,
    lastActivity: {
      name: 'Mount Rainier Training Hike',
      date: new Date().toISOString(),
      distance: 12.5,
      elevation: 1200,
      type: 'Hike',
    },
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-spa-charcoal mb-2">
                  Real-time Training Dashboard
                </h1>
                <p className="text-spa-charcoal/70">
                  Live tracking of your mountaineering preparation progress
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  {isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">
                        Connected to Strava
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-600">Using demo data</span>
                    </>
                  )}
                </div>

                <button
                  onClick={loadTrainingData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    {metrics.totalActivities}
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">
                  Total Activities
                </h3>
                <p className="text-sm text-spa-charcoal/60">
                  This training cycle
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    {metrics.totalDistance}km
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">
                  Distance Covered
                </h3>
                <p className="text-sm text-spa-charcoal/60">Total kilometers</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mountain className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    {metrics.totalElevation.toLocaleString()}m
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">
                  Elevation Gain
                </h3>
                <p className="text-sm text-spa-charcoal/60">Total ascent</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-spa-charcoal">
                    {metrics.totalTime}h
                  </span>
                </div>
                <h3 className="font-medium text-spa-charcoal">Training Time</h3>
                <p className="text-sm text-spa-charcoal/60">Total hours</p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                <h3 className="text-lg font-medium text-spa-charcoal mb-4">
                  Weekly Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-spa-charcoal/70">
                        Distance Goal
                      </span>
                      <span className="text-sm font-medium text-spa-charcoal">
                        {metrics.weeklyProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-alpine-blue h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(metrics.weeklyProgress, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-spa-charcoal/70">
                      <Target className="w-4 h-4" />
                      <span>Monthly goal: {metrics.monthlyGoal}km</span>
                    </div>
                  </div>
                </div>
              </div>

              {metrics.lastActivity && (
                <div className="bg-white rounded-xl p-6 shadow-spa-soft">
                  <h3 className="text-lg font-medium text-spa-charcoal mb-4">
                    Latest Activity
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-spa-charcoal">
                        {metrics.lastActivity.name}
                      </h4>
                      <p className="text-sm text-spa-charcoal/60">
                        {new Date(
                          metrics.lastActivity.date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-spa-charcoal">
                          {(metrics.lastActivity.distance / 1000).toFixed(1)}km
                        </p>
                        <p className="text-xs text-spa-charcoal/60">Distance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-spa-charcoal">
                          {metrics.lastActivity.elevation}m
                        </p>
                        <p className="text-xs text-spa-charcoal/60">
                          Elevation
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-spa-charcoal">
                          {metrics.lastActivity.type}
                        </p>
                        <p className="text-xs text-spa-charcoal/60">Type</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Real-time Dashboard Component */}
            <div className="bg-white rounded-xl shadow-spa-soft overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-spa-charcoal">
                    Advanced Analytics
                  </h2>
                  {lastUpdated && (
                    <p className="text-sm text-spa-charcoal/60">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <TrainingDashboard />
            </div>

            {/* Real-time Features */}
            <div className="mt-8 bg-gradient-to-r from-alpine-blue/5 to-summit-gold/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-alpine-blue" />
                <h3 className="text-lg font-medium text-spa-charcoal">
                  Phase 3 Real-time Features
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-spa-charcoal/70">
                    Live Strava integration
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-spa-charcoal/70">
                    Auto-refreshing metrics
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-spa-charcoal/70">
                    Training insights AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
