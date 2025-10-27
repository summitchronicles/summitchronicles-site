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
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [allWeeksData, setAllWeeksData] = useState<WeeklySchedule[]>([]);

  // Compliance data - will be populated from Garmin Connect in future
  const [complianceData, setComplianceData] = useState<ComplianceData>({});

  // Initialize with API's current week on first load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load workout data when week changes
  useEffect(() => {
    if (currentWeek !== null) {
      loadWorkoutData(currentWeek);
    }
  }, [currentWeek]);

  const loadInitialData = async () => {
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
      setAllWeeksData(data.allWeeks || [data.currentWeek]);
      setCurrentWeek(data.currentWeek.week);

    } catch (err) {
      console.error('Error loading workout data:', err);
      setError('Failed to load workout schedule');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkoutData = async (week: number) => {
    try {
      setError(null);

      const response = await fetch(`/api/training/workouts?week=${week}`, {
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
    }
  };

  const goToPreviousWeek = () => {
    if (currentWeek && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeek) {
      setCurrentWeek(currentWeek + 1);
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
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-white" />
            <h2 className="text-xl font-light tracking-wide text-white">
              WEEK {weeklyData.week} TRAINING SCHEDULE
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousWeek}
              disabled={currentWeek === 1}
              className="flex items-center justify-center p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNextWeek}
              className="flex items-center justify-center p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              title="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={loadInitialData}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Week Date Range */}
        <div className="text-sm text-gray-400">
          {new Date(weeklyData.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(new Date(weeklyData.startDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {days.map((day, index) => {
            const workouts = weeklyData.workouts[day] || [];
            const today = new Date();
            const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
            const isToday = day === todayDayName;
            const hasWorkouts = workouts.length > 0;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-lg border-2 overflow-hidden transition-all ${
                  isToday
                    ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-400 ring-opacity-50'
                    : hasWorkouts
                    ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    : 'border-gray-700/50 bg-gray-900/30'
                }`}
              >
                {/* Day Header */}
                <div className={`px-4 py-3 border-b border-gray-700 ${isToday ? 'bg-blue-600/30' : 'bg-gray-800/30'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-sm">{day}</h3>
                    {isToday && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Today</span>}
                  </div>
                </div>

                {/* Workouts */}
                <div className="p-3 space-y-2 min-h-[300px]">
                  {hasWorkouts ? (
                    workouts.map((workout) => {
                      const colors = getWorkoutTypeColor(workout.type);
                      return (
                        <div key={workout.id} className={`p-3 rounded text-xs ${colors.bg} border ${colors.border}`}>
                          <div className={`font-semibold ${colors.text} mb-1 line-clamp-2`}>
                            {workout.title}
                          </div>
                          <div className="text-gray-300 space-y-1 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{workout.duration} min</span>
                            </div>
                            <div className="flex items-center space-x-1 capitalize">
                              {getIntensityIcon(workout.intensity)}
                              <span>{workout.intensity}</span>
                            </div>
                            {workout.zones && workout.zones.length > 0 && (
                              <div className="text-gray-400">
                                {workout.zones.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                      Rest Day
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Activity className="w-4 h-4 text-green-400" />
            <span>{Object.values(weeklyData.workouts).flat().length} workouts planned • Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}