'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/organisms/Header';
import { TrainingDashboard } from '../../components/realtime/TrainingDashboard';
import { ComplianceDashboard } from '../../components/analytics/ComplianceDashboard';
import { TrainingCalendar } from '../../components/training/TrainingCalendar';
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
    // Set up updates every 4 hours to respect Strava rate limits
    const interval = setInterval(loadTrainingData, 4 * 60 * 60 * 1000); // 4 hours

    // Smart loading: Only load when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if last update was more than 1 hour ago
        if (!lastUpdated || (Date.now() - lastUpdated.getTime()) > 60 * 60 * 1000) {
          loadTrainingData();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastUpdated]);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first (valid for 4 hours)
      const cacheKey = 'strava_activities_cache';
      const cacheTimeKey = 'strava_activities_cache_time';
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);

      const fourHours = 4 * 60 * 60 * 1000;
      const isCacheValid = cached && cacheTime &&
        (Date.now() - parseInt(cacheTime)) < fourHours;

      if (isCacheValid) {
        console.log('Using cached Strava data');
        const cachedData = JSON.parse(cached);
        const processedMetrics = processActivities(cachedData.activities || []);
        setMetrics(processedMetrics);
        setIsConnected(cachedData.connected);
        setLastUpdated(new Date(parseInt(cacheTime)));
        setLoading(false);
        return;
      }

      // Try to fetch from Strava API
      const response = await fetch('/api/strava/activities');

      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);

        // Cache successful response
        localStorage.setItem(cacheKey, JSON.stringify({
          activities: data.activities || [],
          connected: true
        }));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        // Process activities into metrics
        const processedMetrics = processActivities(data.activities || []);
        setMetrics(processedMetrics);
      } else {
        // Try to use stale cache if available
        if (cached) {
          console.log('API failed, using stale cache');
          const cachedData = JSON.parse(cached);
          const processedMetrics = processActivities(cachedData.activities || []);
          setMetrics(processedMetrics);
          setIsConnected(false);
        } else {
          // Fallback to mock data
          setIsConnected(false);
          setMetrics(getMockTrainingData());
        }
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading training data:', err);
      setError('Failed to load training data');

      // Try to use cached data even on error
      const cached = localStorage.getItem('strava_activities_cache');
      if (cached) {
        console.log('Error occurred, using cached data');
        const cachedData = JSON.parse(cached);
        const processedMetrics = processActivities(cachedData.activities || []);
        setMetrics(processedMetrics);
      } else {
        // Use mock data as final fallback
        setMetrics(getMockTrainingData());
      }

      setIsConnected(false);
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
      const distance = (parseFloat(activity.distance) || 0) / 1000; // API returns meters, convert to km
      const elevation =
        parseInt(activity.elevation || activity.total_elevation_gain) || 0;
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
          distance: distance * 1000, // Convert back to meters for display
          elevation: elevation,
          type: activity.type || 'Unknown',
        };
      }
    });

    return {
      totalActivities: activities.length,
      totalDistance: Math.round(totalDistance), // Converted from meters to km
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
    <div className="bg-black text-white">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-gray-900/80"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-4">
            LIVE TRAINING DATA
          </h1>
          <p className="text-xl font-light tracking-wider opacity-90">
            Real-time Metrics • Systematic Progress • 541 Days to Everest
          </p>
        </div>
      </section>

      {/* Main content */}
      <main id="main-content">
        <div className="bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-6">
            {/* Status Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="h-px w-24 bg-white/30 mb-6"></div>
                <h2 className="text-3xl font-light tracking-wide text-white mb-2">
                  PERFORMANCE DASHBOARD
                </h2>
                <p className="text-gray-400">
                  Live tracking of mountaineering preparation progress
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  {isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        Connected to Strava
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">Using demo data</span>
                    </>
                  )}
                </div>

                <button
                  onClick={loadTrainingData}
                  disabled={loading}
                  className="flex items-center space-x-2 border border-white text-white px-4 py-2 font-medium tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-8">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-light text-white">
                    {metrics.totalActivities}
                  </span>
                </div>
                <h3 className="font-medium text-white tracking-wide mb-1">
                  TOTAL ACTIVITIES
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  This training cycle
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-light text-white">
                    {metrics.totalDistance}km
                  </span>
                </div>
                <h3 className="font-medium text-white tracking-wide mb-1">
                  DISTANCE COVERED
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total kilometers</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-light text-white">
                    {metrics.totalElevation.toLocaleString()}m
                  </span>
                </div>
                <h3 className="font-medium text-white tracking-wide mb-1">
                  ELEVATION GAIN
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total ascent</p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-light text-white">
                    {metrics.totalTime}h
                  </span>
                </div>
                <h3 className="font-medium text-white tracking-wide mb-1">TRAINING TIME</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total hours</p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-light tracking-wide text-white mb-6">
                  WEEKLY PROGRESS
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400 tracking-wide uppercase">
                        Distance Goal
                      </span>
                      <span className="text-lg font-light text-white">
                        {metrics.weeklyProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(metrics.weeklyProgress, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>Monthly goal: {metrics.monthlyGoal}km</span>
                    </div>
                  </div>
                </div>
              </div>

              {metrics.lastActivity && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-light tracking-wide text-white mb-6">
                    LATEST ACTIVITY
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white">
                        {metrics.lastActivity.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {new Date(
                          metrics.lastActivity.date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <p className="text-2xl font-light text-white mb-1">
                          {(metrics.lastActivity.distance / 1000).toFixed(1)}km
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Distance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-light text-white mb-1">
                          {metrics.lastActivity.elevation}m
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Elevation
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-light text-white mb-1">
                          {metrics.lastActivity.type}
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Type</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            </div>
        </div>

        {/* Training Calendar Section */}
        <div className="bg-black py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <div className="h-px w-24 bg-white/30 mb-6"></div>
              <h2 className="text-3xl font-light tracking-wide text-white mb-4">
                TRAINING CALENDAR
              </h2>
            </div>
            <TrainingCalendar
              onActivityComplete={(activityId) => {
                console.log('Activity completed:', activityId);
                // Could trigger analytics or RAG updates here
              }}
              onPlanUpload={(planData) => {
                console.log('New training plan uploaded:', planData);
                // Could feed into RAG system here
              }}
            />
          </div>
        </div>

        {/* Compliance Analytics Dashboard */}
        <div className="bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <div className="h-px w-24 bg-white/30 mb-6"></div>
              <h2 className="text-3xl font-light tracking-wide text-white mb-4">
                COMPLIANCE ANALYTICS
              </h2>
            </div>
            <ComplianceDashboard />
          </div>
        </div>

        {/* Real-time Dashboard Component */}
        <div className="bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-light tracking-wide text-white">
                    ADVANCED ANALYTICS
                  </h2>
                  {lastUpdated && (
                    <p className="text-sm text-gray-400">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <TrainingDashboard />
            </div>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="bg-black py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-700 rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-6 h-6 text-white" />
                <h3 className="text-lg font-light tracking-wide text-white">
                  PHASE 3 REAL-TIME FEATURES
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">
                    Live Strava integration
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">
                    Auto-refreshing metrics
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">
                    Training insights AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
