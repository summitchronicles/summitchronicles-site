'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  Circle,
  Target,
  Activity,
  Zap,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParsedWorkout {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'custom';
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  description: string;
  exercises?: string[];
  zones?: string[];
  warmup?: number;
  cooldown?: number;
  mainWork?: number;
}

interface WeeklySchedule {
  week: number;
  startDate: string;
  workouts: {
    [key: string]: ParsedWorkout[];
  };
}

interface TimelineCalendarProps {
  className?: string;
}

interface WorkoutCompliance {
  completed: boolean;
  durationMatch: number;
  intensityMatch: number;
  actualDuration?: number;
  actualIntensity?: string;
  notes?: string;
}

interface ComplianceData {
  [key: string]: WorkoutCompliance[]; // Array to match multiple workouts
}

export function TimelineCalendar({ className = '' }: TimelineCalendarProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Compliance data - will be populated from Garmin Connect in future
  const [complianceData, setComplianceData] = useState<ComplianceData>({});

  useEffect(() => {
    loadWorkoutData();
  }, [currentWeek]);

  const loadWorkoutData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/training/workouts', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workout data');
      }

      const data = await response.json();
      setWeeklyData(data.currentWeek);

    } catch (err) {
      console.error('Error loading workout data:', err);
      setError('Failed to load workout schedule');
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'cardio':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          accent: 'bg-blue-500'
        };
      case 'strength':
        return {
          bg: 'bg-purple-500/20',
          border: 'border-purple-500/40',
          text: 'text-purple-400',
          accent: 'bg-purple-500'
        };
      case 'custom':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/40',
          text: 'text-green-400',
          accent: 'bg-green-500'
        };
      case 'rest':
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/40',
          text: 'text-gray-400',
          accent: 'bg-gray-500'
        };
      default:
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          accent: 'bg-blue-500'
        };
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    if (score >= 80) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    if (score >= 70) return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    return 'text-red-400 bg-red-500/20 border-red-500/40';
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'low':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  const calculateWeeklyCompliance = () => {
    const days = Object.keys(complianceData);
    const allWorkouts = days.flatMap(day => complianceData[day]);
    const completedWorkouts = allWorkouts.filter(w => w.completed);

    if (completedWorkouts.length === 0) return 0;

    const avgCompliance = completedWorkouts.reduce((sum, workout) =>
      sum + workout.durationMatch, 0) / completedWorkouts.length;

    return Math.round(avgCompliance);
  };

  const weeklyCompliance = calculateWeeklyCompliance();
  const completedCount = Object.values(complianceData).flatMap(workouts => workouts).filter(w => w.completed).length;
  const totalCount = Object.values(complianceData).flatMap(workouts => workouts).length;

  if (loading) {
    return (
      <div className={`${className} p-8`}>
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-gray-300">Loading workout schedule...</span>
        </div>
      </div>
    );
  }

  if (error || !weeklyData) {
    return (
      <div className={`${className} p-8`}>
        <div className="flex items-center justify-center space-x-3 text-red-400">
          <AlertTriangle className="w-6 h-6" />
          <span>{error || 'Failed to load workout data'}</span>
        </div>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className={`${className} bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden`}>
      {/* Header with Compliance Dashboard */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-white" />
            <h2 className="text-xl font-light tracking-wide text-white">
              WEEKLY TRAINING TIMELINE
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadWorkoutData}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Week Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Training Phase</div>
            <div className="text-white font-medium">Base Training</div>
            <div className="text-sm text-gray-400">Foundation Building</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Current Week</div>
            <div className="text-white font-medium">Week {weeklyData.week}</div>
            <div className="text-sm text-gray-400">
              {new Date(weeklyData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
              {' '}{new Date(new Date(weeklyData.startDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="space-y-4">
          {days.map((day, index) => {
            const workouts = weeklyData.workouts[day] || [];
            const compliance = complianceData[day] || [];

            // Determine if this is today
            const today = new Date();
            const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
            const isToday = day === todayDayName;

            if (!workouts || workouts.length === 0) return null;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                {/* Day Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{day}</h3>
                  {isToday && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Today</span>
                  )}
                </div>

                {/* Multiple Workouts */}
                <div className="space-y-3 ml-4">
                  {workouts.map((workout, workoutIndex) => {
                    const workoutCompliance = compliance[workoutIndex] || { completed: false, durationMatch: 0, intensityMatch: 0 };
                    const colors = getWorkoutTypeColor(workout.type);

                    return (
                      <div
                        key={workout.id}
                        className={`relative flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                          ${colors.bg} ${colors.border} ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                      >
                        {/* Timeline marker */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${colors.border} ${colors.bg}`}>
                            <Circle className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        {/* Workout content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-lg font-medium mb-2 ${colors.text}`}>
                                {workout.title}
                              </h4>

                              {/* Workout details */}
                              <div className="flex items-center space-x-4 mb-3 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-white">{workout.duration} min</span>
                                </div>

                                <div className="flex items-center space-x-1">
                                  {getIntensityIcon(workout.intensity)}
                                  <span className="text-white capitalize">{workout.intensity}</span>
                                </div>

                                {workout.zones && workout.zones.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-white">{workout.zones.join(', ')}</span>
                                  </div>
                                )}
                              </div>

                              {/* Exercises */}
                              {workout.exercises && workout.exercises.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs text-gray-400 mb-1">Exercises:</div>
                                  <div className="space-y-1">
                                    {workout.exercises.slice(0, 2).map((exercise, idx) => (
                                      <div key={idx} className="text-sm text-gray-300 pl-2 border-l-2 border-gray-600">
                                        {exercise}
                                      </div>
                                    ))}
                                    {workout.exercises.length > 2 && (
                                      <div className="text-sm text-gray-400 pl-2">
                                        +{workout.exercises.length - 2} more exercises
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                            </div>

                            {/* Status indicator */}
                            <div className={`w-3 h-3 rounded-full ${colors.accent} flex-shrink-0 mt-1`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connecting line to next day */}
                {index < days.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-600" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Data source */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-gray-400">
              Training schedule from Everest Base Schedule •
              Compliance data from Garmin Connect •
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}