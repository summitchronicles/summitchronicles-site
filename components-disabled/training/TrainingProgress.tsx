"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ScaleIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ProgressData {
  strengthProgress: Array<{
    id: string;
    set_number: number;
    reps_completed: number;
    weight_used: number;
    actual_rpe: number;
    logged_at: string;
    exercises: {
      name: string;
      strength_days: {
        date: string;
        day_name: string;
      };
    };
  }>;
  manualData: Array<{
    id: string;
    date: string;
    activity_type: string;
    duration_minutes?: number;
    distance_km?: number;
    elevation_gain_m?: number;
    backpack_weight_kg?: number;
    perceived_effort?: number;
    location?: string;
  }>;
}

interface TrainingProgressProps {
  timeRange: 'week' | 'month' | 'quarter';
}

export default function TrainingProgress({ timeRange = 'month' }: TrainingProgressProps) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'rpe' | 'frequency'>('volume');

  useEffect(() => {
    fetchProgressData();
  }, [timeRange]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = getStartDate(timeRange);
      
      const response = await fetch(`/api/training/progress?start=${startDate}&end=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range: string): string => {
    const date = new Date();
    switch (range) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const calculateWeeklyVolume = () => {
    if (!progressData?.strengthProgress) return [];

    const weeklyData = new Map();
    
    progressData.strengthProgress.forEach(set => {
      const weekStart = getWeekStart(set.exercises.strength_days.date);
      const volume = (set.weight_used || 0) * (set.reps_completed || 0);
      
      if (weeklyData.has(weekStart)) {
        weeklyData.set(weekStart, weeklyData.get(weekStart) + volume);
      } else {
        weeklyData.set(weekStart, volume);
      }
    });

    return Array.from(weeklyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, volume]) => ({ date, volume }));
  };

  const calculateWeeklyRPE = () => {
    if (!progressData?.strengthProgress) return [];

    const weeklyData = new Map();
    const weeklyCount = new Map();
    
    progressData.strengthProgress.forEach(set => {
      if (set.actual_rpe) {
        const weekStart = getWeekStart(set.exercises.strength_days.date);
        
        if (weeklyData.has(weekStart)) {
          weeklyData.set(weekStart, weeklyData.get(weekStart) + set.actual_rpe);
          weeklyCount.set(weekStart, weeklyCount.get(weekStart) + 1);
        } else {
          weeklyData.set(weekStart, set.actual_rpe);
          weeklyCount.set(weekStart, 1);
        }
      }
    });

    return Array.from(weeklyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ 
        date, 
        averageRpe: total / weeklyCount.get(date) 
      }));
  };

  const getWeekStart = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    date.setDate(diff);
    return date.toISOString().split('T')[0];
  };

  const getActivityStats = () => {
    if (!progressData?.manualData) return null;

    const totalActivities = progressData.manualData.length;
    const totalDistance = progressData.manualData.reduce((sum, activity) => 
      sum + (activity.distance_km || 0), 0);
    const totalElevation = progressData.manualData.reduce((sum, activity) => 
      sum + (activity.elevation_gain_m || 0), 0);
    const averageBackpackWeight = progressData.manualData
      .filter(activity => activity.backpack_weight_kg)
      .reduce((sum, activity, _, arr) => 
        sum + (activity.backpack_weight_kg || 0) / arr.length, 0);

    return {
      totalActivities,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalElevation,
      averageBackpackWeight: Math.round(averageBackpackWeight * 10) / 10
    };
  };

  const weeklyVolume = calculateWeeklyVolume();
  const weeklyRPE = calculateWeeklyRPE();
  const activityStats = getActivityStats();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-summitGold border-r-transparent"></div>
          <span className="ml-3 text-white/60">Loading progress data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-summitGold/20 rounded-full flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-summitGold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Training Progress</h2>
              <p className="text-white/60 text-sm">
                {timeRange === 'week' ? 'Past 7 days' : 
                 timeRange === 'month' ? 'Past 30 days' : 'Past 90 days'}
              </p>
            </div>
          </div>

          {/* Metric Selector */}
          <div className="flex gap-2">
            {[
              { key: 'volume', label: 'Volume', icon: ScaleIcon },
              { key: 'rpe', label: 'RPE', icon: ArrowTrendingUpIcon },
              { key: 'frequency', label: 'Sessions', icon: CalendarDaysIcon }
            ].map(metric => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-summitGold text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                <metric.icon className="w-4 h-4 inline mr-1" />
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white/5 rounded-xl p-4">
          {selectedMetric === 'volume' && weeklyVolume.length > 0 ? (
            <VolumeChart data={weeklyVolume} />
          ) : selectedMetric === 'rpe' && weeklyRPE.length > 0 ? (
            <RPEChart data={weeklyRPE} />
          ) : (
            <div className="text-center py-12 text-white/50">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No data available for selected metric</p>
              <p className="text-sm mt-1">Complete more workouts to see progress</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Activity Stats */}
      {activityStats && activityStats.totalActivities > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-orange-400" />
            Activity Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-summitGold">{activityStats.totalActivities}</div>
              <div className="text-white/60 text-sm">Activities</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{activityStats.totalDistance}km</div>
              <div className="text-white/60 text-sm">Distance</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{activityStats.totalElevation}m</div>
              <div className="text-white/60 text-sm">Elevation</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{activityStats.averageBackpackWeight}kg</div>
              <div className="text-white/60 text-sm">Avg Pack Weight</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Simple Volume Chart Component
function VolumeChart({ data }: { data: Array<{ date: string; volume: number }> }) {
  const maxVolume = Math.max(...data.map(d => d.volume));
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold">Weekly Training Volume</h4>
        <span className="text-summitGold text-sm">Total kg lifted</span>
      </div>
      
      <div className="space-y-3">
        {data.map((week, index) => (
          <div key={week.date} className="flex items-center gap-4">
            <div className="w-16 text-white/60 text-xs">
              {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(week.volume / maxVolume) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gradient-to-r from-summitGold to-yellow-400 h-full rounded-full flex items-center justify-end pr-2"
              >
                <span className="text-black text-xs font-medium">{Math.round(week.volume)}kg</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple RPE Chart Component  
function RPEChart({ data }: { data: Array<{ date: string; averageRpe: number }> }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold">Weekly Average RPE</h4>
        <span className="text-summitGold text-sm">Perceived effort (1-10)</span>
      </div>
      
      <div className="space-y-3">
        {data.map((week, index) => (
          <div key={week.date} className="flex items-center gap-4">
            <div className="w-16 text-white/60 text-xs">
              {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(week.averageRpe / 10) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gradient-to-r from-red-500 to-orange-400 h-full rounded-full flex items-center justify-end pr-2"
              >
                <span className="text-white text-xs font-medium">{week.averageRpe.toFixed(1)}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}