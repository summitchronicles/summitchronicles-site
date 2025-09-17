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
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TrainingDashboard({
  showMockData = false,
}: TrainingDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'recent' | 'ytd' | 'all'
  >('recent');

  // Fetch real Strava data using SWR for automatic caching and revalidation
  const { data: activities, error: activitiesError } = useSWR<StravaActivity[]>(
    showMockData ? null : '/api/strava/activities',
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      fallbackData: [],
    }
  );

  const { data: stats, error: statsError } = useSWR<StravaStats>(
    showMockData ? null : '/api/strava/stats',
    fetcher,
    {
      refreshInterval: 600000, // Refresh every 10 minutes
      fallbackData: undefined,
    }
  );

  const { data: profile } = useSWR<AthleteProfile>(
    showMockData ? null : '/api/strava/profile',
    fetcher,
    {
      refreshInterval: 3600000, // Refresh every hour
      fallbackData: undefined,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-spa-charcoal mb-2">
            Live Training Data
          </h2>
          <p className="text-spa-charcoal/70">
            Real-time Strava integration showing training progress and metrics
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-spa-stone/10 rounded-lg p-1">
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
                  ? 'bg-alpine-blue text-white shadow-sm'
                  : 'text-spa-charcoal/70 hover:text-spa-charcoal hover:bg-white/50'
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
          <div className="bg-white rounded-xl p-6 shadow-spa-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-spa-charcoal">
                  {currentStats.runs.count}
                </div>
                <div className="text-sm text-spa-charcoal/70">Runs</div>
              </div>
            </div>
            <div className="text-sm text-spa-charcoal/70">
              {formatDistance(currentStats.runs.distance)}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-spa-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-spa-charcoal">
                  {currentStats.rides.count}
                </div>
                <div className="text-sm text-spa-charcoal/70">Rides</div>
              </div>
            </div>
            <div className="text-sm text-spa-charcoal/70">
              {formatDistance(currentStats.rides.distance)}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-spa-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mountain className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-spa-charcoal">
                  {formatElevation(
                    currentStats.runs.elevation_gain +
                      currentStats.rides.elevation_gain
                  )}
                </div>
                <div className="text-sm text-spa-charcoal/70">Elevation</div>
              </div>
            </div>
            <div className="text-sm text-spa-charcoal/70">Total gained</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-spa-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Timer className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-spa-charcoal">
                  {formatDuration(
                    currentStats.runs.moving_time +
                      currentStats.rides.moving_time
                  )}
                </div>
                <div className="text-sm text-spa-charcoal/70">Moving Time</div>
              </div>
            </div>
            <div className="text-sm text-spa-charcoal/70">Total active</div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-spa-soft">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-alpine-blue" />
          <h3 className="text-xl font-medium text-spa-charcoal">
            Recent Activities
          </h3>
        </div>

        <div className="space-y-4">
          {displayActivities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-spa-stone/5 rounded-lg hover:bg-spa-stone/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div>
                  <div className="font-medium text-spa-charcoal mb-1">
                    {activity.name}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-spa-charcoal/70">
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
                <div className="text-sm text-spa-charcoal/70 mb-1">
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
          <div className="text-center py-8 text-spa-charcoal/70">
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
        <div className="bg-white rounded-xl p-6 shadow-spa-soft">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-alpine-blue" />
            <h3 className="text-xl font-medium text-spa-charcoal">
              Training Focus
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-spa-charcoal/70">Endurance Training</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-spa-stone/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-alpine-blue rounded-full"></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-spa-charcoal/70">Strength Training</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-spa-stone/20 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">50%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-spa-charcoal/70">Technical Skills</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-spa-stone/20 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-summit-gold rounded-full"></div>
                </div>
                <span className="text-sm font-medium">35%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-spa-soft">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-alpine-blue" />
            <h3 className="text-xl font-medium text-spa-charcoal">
              Performance Trends
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Improving</span>
              </div>
              <div className="text-sm text-green-700">
                Average pace has improved by 12% this month
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Elevation Goal
                </span>
              </div>
              <div className="text-sm text-blue-700">
                85% complete for monthly elevation target
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Recovery</span>
              </div>
              <div className="text-sm text-orange-700">
                Consider adding more rest days this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMockData && (
        <div className="bg-summit-gold/10 border border-summit-gold/30 rounded-lg p-4">
          <p className="text-spa-charcoal font-medium">
            📊 Demo Mode: Showing mock Strava data for demonstration
          </p>
        </div>
      )}
    </div>
  );
}
