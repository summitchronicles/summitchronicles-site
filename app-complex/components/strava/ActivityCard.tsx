'use client';

import { motion } from 'framer-motion';
import {
  ClockIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number; // meters
  moving_time: number; // seconds
  total_elevation_gain: number; // meters
  start_date: string;
  average_speed: number; // m/s
}

interface ActivityCardProps {
  activity: StravaActivity;
  index?: number;
}

const ACTIVITY_ICONS: Record<string, string> = {
  Run: '🏃‍♂️',
  Ride: '🚴‍♂️',
  Hike: '🥾',
  Walk: '🚶‍♂️',
  AlpineSki: '⛷️',
  BackcountrySki: '🎿',
  Climb: '🧗‍♂️',
  RockClimbing: '🧗‍♂️',
  MountainBikeRide: '🚵‍♂️',
  TrailRun: '🏃‍♂️',
  Workout: '💪',
  WeightTraining: '🏋️‍♂️',
  Yoga: '🧘‍♂️',
};

const ACTIVITY_COLORS: Record<string, string> = {
  Run: 'bg-orange-500',
  Ride: 'bg-blue-500',
  Hike: 'bg-green-600',
  Walk: 'bg-green-400',
  AlpineSki: 'bg-cyan-500',
  BackcountrySki: 'bg-cyan-600',
  Climb: 'bg-purple-600',
  RockClimbing: 'bg-purple-600',
  MountainBikeRide: 'bg-amber-600',
  TrailRun: 'bg-orange-600',
  Workout: 'bg-red-500',
  WeightTraining: 'bg-red-600',
  Yoga: 'bg-pink-500',
};

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  if (km >= 1) {
    return `${km.toFixed(1)} km`;
  }
  return `${meters.toFixed(0)} m`;
}

function formatSpeed(mps: number): string {
  const kmh = mps * 3.6;
  return `${kmh.toFixed(1)} km/h`;
}

export default function ActivityCard({
  activity,
  index = 0,
}: ActivityCardProps) {
  const activityIcon = ACTIVITY_ICONS[activity.type] || '🏃‍♂️';
  const activityColor = ACTIVITY_COLORS[activity.type] || 'bg-gray-500';

  const startDate = new Date(activity.start_date);
  const timeAgo = formatDistanceToNow(startDate, { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -2,
        boxShadow:
          '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      {/* Header with activity type and date */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg',
                activityColor
              )}
            >
              {activityIcon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-alpineBlue transition-colors">
                {activity.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{timeAgo}</span>
                <span>•</span>
                <span className="capitalize">{activity.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Distance */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapIcon className="w-5 h-5 text-gray-400 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatDistance(activity.distance)}
            </div>
            <div className="text-sm text-gray-500">Distance</div>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ClockIcon className="w-5 h-5 text-gray-400 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(activity.moving_time)}
            </div>
            <div className="text-sm text-gray-500">Time</div>
          </div>

          {/* Elevation */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {activity.total_elevation_gain}m
            </div>
            <div className="text-sm text-gray-500">Elevation</div>
          </div>

          {/* Average Speed */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BoltIcon className="w-5 h-5 text-gray-400 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {activity.average_speed
                ? formatSpeed(activity.average_speed)
                : '—'}
            </div>
            <div className="text-sm text-gray-500">Avg Speed</div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                🔥 {Math.round((activity.distance / 1000) * 50)} kcal
              </span>
              <span className="text-gray-600">
                💪{' '}
                {activity.type === 'Hike' || activity.type === 'Climb'
                  ? 'High'
                  : 'Medium'}{' '}
                intensity
              </span>
            </div>
            <div className="text-gray-400">
              #{activity.id.toString().slice(-4)}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-alpineBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
