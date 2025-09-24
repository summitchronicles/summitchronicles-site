'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  Activity,
  TrendingUp,
  Mountain,
  Timer,
  Heart,
  MapPin,
  Calendar,
  Target,
  Zap,
  Trophy,
} from 'lucide-react';
import {
  StravaActivity,
  StravaStats,
  AthleteProfile,
  getMockStravaData,
  formatDistance,
  formatDuration,
  formatElevation,
  formatActivityDate,
  getActivityIcon,
  getActivityColor,
} from '@/lib/integrations/strava';

interface TrainingDashboardProps {
  showMockData?: boolean;
}

// SWR fetcher function
const fetcher = (url: string) => 
  fetch(url).then((res) => res.json()).then((data) => {
    // Handle /api/strava/activities response structure
    if (url.includes('/api/strava/activities') && data.activities) {
      return data.activities;
    }
    return data;
  });

export function TrainingDashboard({
  showMockData = false,
}: TrainingDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'recent' | 'ytd' | 'all'
  >('recent');

  // Fetch real Strava data using SWR for automatic caching and revalidation
  // Reduced intervals to respect Strava rate limits
  const { data: activities, error: activitiesError } = useSWR<StravaActivity[]>(
    showMockData ? null : '/api/strava/activities',
    fetcher,
    {
      refreshInterval: 4 * 60 * 60 * 1000, // Refresh every 4 hours
      dedupingInterval: 4 * 60 * 60 * 1000, // Cache for 4 hours
      fallbackData: [],
      revalidateOnFocus: false, // Don't revalidate on window focus
      revalidateOnReconnect: false, // Don't revalidate on network reconnect
    }
  );

  const { data: stats, error: statsError } = useSWR<StravaStats>(
    showMockData ? null : '/api/strava/stats',
    fetcher,
    {
      refreshInterval: 4 * 60 * 60 * 1000, // Refresh every 4 hours
      dedupingInterval: 4 * 60 * 60 * 1000, // Cache for 4 hours
      fallbackData: undefined,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: profile } = useSWR<AthleteProfile>(
    showMockData ? null : '/api/strava/profile',
    fetcher,
    {
      refreshInterval: 24 * 60 * 60 * 1000, // Refresh every 24 hours (profile changes rarely)
      dedupingInterval: 24 * 60 * 60 * 1000, // Cache for 24 hours
      fallbackData: undefined,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Use mock data if specified or if API fails
  const mockData = getMockStravaData();
  const displayActivities =
    showMockData || activitiesError ? mockData.activities : activities || [];
  const displayStats = showMockData || statsError ? mockData.stats : stats;
  const displayProfile = showMockData ? mockData.profile : profile;

  const getCurrentStats = () => {
    if (!displayStats) return null;

    switch (selectedTimeframe) {
      case 'recent':
        return {
          runs: displayStats.recent_run_totals,
          rides: displayStats.recent_ride_totals,
        };
      case 'ytd':
        return {
          runs: displayStats.ytd_run_totals,
          rides: displayStats.ytd_ride_totals,
        };
      case 'all':
        return {
          runs: displayStats.all_run_totals,
          rides: displayStats.all_ride_totals,
        };
      default:
        return {
          runs: displayStats.recent_run_totals,
          rides: displayStats.recent_ride_totals,
        };
    }
  };

  const currentStats = getCurrentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-white mb-2">
            Live Training Data
          </h2>
          <p className="text-gray-400">
            Real-time Strava integration showing training progress and metrics
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-gray-700 rounded-lg p-1">
          {[
            { key: 'recent', label: 'Recent' },
            { key: 'ytd', label: 'This Year' },
            { key: 'all', label: 'All Time' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedTimeframe(key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedTimeframe === key
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      {currentStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-light text-white">
                  {currentStats.runs.count}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Runs</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {formatDistance(currentStats.runs.distance)}
            </div>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-light text-white">
                  {currentStats.rides.count}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Rides</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {formatDistance(currentStats.rides.distance)}
            </div>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-light text-white">
                  {formatElevation(
                    currentStats.runs.elevation_gain +
                      currentStats.rides.elevation_gain
                  )}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Elevation</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">Total gained</div>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-light text-white">
                  {formatDuration(
                    currentStats.runs.moving_time +
                      currentStats.rides.moving_time
                  )}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Moving Time</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">Total active</div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-white" />
          <h3 className="text-xl font-light tracking-wide text-white">
            Recent Activities
          </h3>
        </div>

        <div className="space-y-4">
          {displayActivities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div>
                  <div className="font-medium text-white mb-1">
                    {activity.name}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {formatDistance(activity.distance)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {formatDuration(activity.moving_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mountain className="w-3 h-3" />
                      {formatElevation(activity.total_elevation_gain)}
                    </span>
                    {activity.average_heartrate && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {Math.round(activity.average_heartrate)} bpm
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">
                  {formatActivityDate(activity.start_date)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-3 h-3 text-summit-gold" />
                  <span>{activity.kudos_count} kudos</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayActivities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activities found</p>
            <p className="text-sm">
              Connect your Strava account to see training data
            </p>
          </div>
        )}
      </div>

      {/* Training Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-white" />
            <h3 className="text-xl font-light tracking-wide text-white">
              Training Focus
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Endurance Training</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-white">75%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Strength Training</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-green-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-white">50%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Technical Skills</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-white">35%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-white" />
            <h3 className="text-xl font-light tracking-wide text-white">
              Performance Trends
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-900/30 border border-green-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-medium text-green-300">Improving</span>
              </div>
              <div className="text-sm text-green-400">
                Average pace has improved by 12% this month
              </div>
            </div>

            <div className="p-4 bg-blue-900/30 border border-blue-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-300">
                  Elevation Goal
                </span>
              </div>
              <div className="text-sm text-blue-400">
                85% complete for monthly elevation target
              </div>
            </div>

            <div className="p-4 bg-orange-900/30 border border-orange-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-orange-300">Recovery</span>
              </div>
              <div className="text-sm text-orange-400">
                Consider adding more rest days this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMockData && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-300 font-medium">
            📊 Demo Mode: Showing mock Strava data for demonstration
          </p>
        </div>
      )}
    </div>
  );
}
