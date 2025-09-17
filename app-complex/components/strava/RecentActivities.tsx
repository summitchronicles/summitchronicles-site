'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date: string;
  average_speed: number;
}

interface RecentActivitiesProps {
  title?: string;
  daysToShow?: number;
  showHeader?: boolean;
  className?: string;
}

export default function RecentActivities({
  title = 'Recent Activities (Last 7 Days)',
  daysToShow = 7,
  showHeader = true,
  className = '',
}: RecentActivitiesProps) {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/strava/recent', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error || 'Unknown API error');
      }

      // Filter activities from the last X days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToShow);

      const recentActivities = (data.activities || []).filter(
        (activity: StravaActivity) => {
          const activityDate = new Date(activity.start_date);
          return activityDate >= cutoffDate;
        }
      );

      setActivities(recentActivities);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to fetch Strava activities:', err);
      setError(err.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [daysToShow]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const totalDistance = activities.reduce((sum, act) => sum + act.distance, 0);
  const totalTime = activities.reduce((sum, act) => sum + act.moving_time, 0);
  const totalElevation = activities.reduce(
    (sum, act) => sum + act.total_elevation_gain,
    0
  );

  if (loading) {
    return (
      <div className={clsx('space-y-6', className)}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
            <ArrowPathIcon className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="text-center space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx('space-y-6', className)}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
            <button
              onClick={fetchActivities}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-alpineBlue transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">
                Failed to load activities
              </h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={fetchActivities}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-6', className)}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-charcoal flex items-center space-x-2">
              <CalendarIcon className="w-6 h-6 text-alpineBlue" />
              <span>{title}</span>
            </h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last synced {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchActivities}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-alpineBlue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon
              className={clsx('w-4 h-4', loading && 'animate-spin')}
            />
            <span>Sync</span>
          </button>
        </div>
      )}

      {/* Summary Stats */}
      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-alpineBlue to-blue-600 rounded-xl p-6 text-white"
        >
          <h3 className="font-semibold mb-4">
            {daysToShow}-Day Training Summary ({activities.length} activities)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(totalDistance / 1000).toFixed(1)} km
              </div>
              <div className="text-blue-100 text-sm">Total Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.floor(totalTime / 3600)}h{' '}
                {Math.floor((totalTime % 3600) / 60)}m
              </div>
              <div className="text-blue-100 text-sm">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {totalElevation.toLocaleString()}m
              </div>
              <div className="text-blue-100 text-sm">Total Elevation</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No activities in the last {daysToShow} days
            </h3>
            <p className="text-gray-500 mb-4">
              Activities will appear here once you sync with Strava
            </p>
            <button
              onClick={fetchActivities}
              className="px-4 py-2 bg-alpineBlue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sync Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
