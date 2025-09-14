"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface TrainingInsights {
  stravaActivities: any[];
  manualActivities: any[];
  insights: {
    totalActivities: number;
    categoryBreakdown: Record<string, number>;
    avgIntensity: number;
    volumeComparison: {
      strava: number;
      manual: number;
      combined: number;
    };
  };
}

interface DuplicateData {
  potentialDuplicates: Array<{
    strava: any;
    manual: any;
    confidence: number;
  }>;
}

interface CombinedDataOverviewProps {
  timeRange: 'week' | 'month' | 'quarter';
}

export default function CombinedDataOverview({ timeRange }: CombinedDataOverviewProps) {
  const [insights, setInsights] = useState<TrainingInsights | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDuplicates, setShowDuplicates] = useState(false);

  useEffect(() => {
    fetchCombinedData();
    checkForDuplicates();
  }, [timeRange, selectedDate]);

  const fetchCombinedData = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = getStartDate(timeRange);
      
      const response = await fetch(`/api/training/strava-enhanced?action=insights&start=${startDate}&end=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error fetching combined data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForDuplicates = async () => {
    try {
      const response = await fetch(`/api/training/strava-enhanced?action=duplicates&date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setDuplicates(data);
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
    }
  };

  const syncStravaData = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/training/strava-enhanced?action=sync&limit=100');
      if (response.ok) {
        await fetchCombinedData();
      }
    } catch (error) {
      console.error('Error syncing Strava data:', error);
    } finally {
      setSyncing(false);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cardio': return '🏃‍♂️';
      case 'strength': return '💪';
      case 'hiking': return '🥾';
      case 'climbing': return '🧗';
      case 'cycling': return '🚴‍♂️';
      case 'recovery': return '🧘‍♂️';
      case 'mountaineering': return '⛰️';
      default: return '🏃‍♂️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cardio': return 'from-orange-500 to-red-500';
      case 'strength': return 'from-red-600 to-pink-600';
      case 'hiking': return 'from-green-500 to-emerald-600';
      case 'climbing': return 'from-purple-500 to-violet-600';
      case 'cycling': return 'from-blue-500 to-cyan-500';
      case 'recovery': return 'from-indigo-500 to-blue-600';
      case 'mountaineering': return 'from-gray-600 to-slate-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-summitGold border-r-transparent"></div>
          <span className="ml-3 text-white/60">Loading combined training data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sync Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Combined Training Analysis</h2>
              <p className="text-white/60 text-sm">
                Unified view of Strava + Manual training data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Duplicate Detection */}
            {duplicates && duplicates.potentialDuplicates.length > 0 && (
              <button
                onClick={() => setShowDuplicates(!showDuplicates)}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-colors text-sm"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                {duplicates.potentialDuplicates.length} Duplicates
              </button>
            )}

            {/* Sync Button */}
            <button
              onClick={syncStravaData}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-summitGold/20 border border-summitGold/30 text-summitGold rounded-xl hover:bg-summitGold/30 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Strava'}
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        {insights && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-summitGold">{insights.insights.totalActivities}</div>
              <div className="text-white/60 text-sm">Total Activities</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{insights.insights.volumeComparison.combined}min</div>
              <div className="text-white/60 text-sm">Combined Volume</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{insights.insights.avgIntensity}</div>
              <div className="text-white/60 text-sm">Avg Intensity</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((insights.insights.volumeComparison.strava / insights.insights.volumeComparison.combined) * 100)}%
              </div>
              <div className="text-white/60 text-sm">Strava Coverage</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Category Breakdown */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-summitGold" />
            Activity Categories
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(insights.insights.categoryBreakdown).map(([category, count]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
                <div className="text-xl font-bold text-white">{count}</div>
                <div className="text-white/60 text-sm capitalize">{category}</div>
                <div className={`w-full h-1 bg-gradient-to-r ${getCategoryColor(category)} rounded-full mt-2`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Data Source Breakdown */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-blue-400" />
            Data Sources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strava Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold text-white">Strava Activities</h4>
                <span className="text-white/60">({insights.stravaActivities.length})</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70 mb-2">Volume: {insights.insights.volumeComparison.strava} minutes</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(insights.insights.volumeComparison.strava / insights.insights.volumeComparison.combined) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Recent Strava Activities Preview */}
              <div className="space-y-2">
                {insights.stravaActivities.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                    <div className="text-lg">{getCategoryIcon(activity.category)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{activity.name}</div>
                      <div className="text-white/60 text-xs">
                        {new Date(activity.start_date).toLocaleDateString()} • 
                        {activity.estimated_rpe && ` RPE ${activity.estimated_rpe} • `}
                        {Math.round(activity.moving_time / 60)}min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-white">Manual Activities</h4>
                <span className="text-white/60">({insights.manualActivities.length})</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70 mb-2">Volume: {insights.insights.volumeComparison.manual} minutes</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(insights.insights.volumeComparison.manual / insights.insights.volumeComparison.combined) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Recent Manual Activities Preview */}
              <div className="space-y-2">
                {insights.manualActivities.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                    <div className="text-lg">{getCategoryIcon(activity.activity_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium capitalize">{activity.activity_type}</div>
                      <div className="text-white/60 text-xs">
                        {new Date(activity.date).toLocaleDateString()} • 
                        {activity.perceived_effort && ` RPE ${activity.perceived_effort} • `}
                        {activity.duration_minutes && `${activity.duration_minutes}min • `}
                        {activity.backpack_weight_kg && `${activity.backpack_weight_kg}kg pack`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Duplicate Detection */}
      <AnimatePresence>
        {showDuplicates && duplicates && duplicates.potentialDuplicates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Potential Duplicate Activities
              </h3>
              <button
                onClick={() => setShowDuplicates(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {duplicates.potentialDuplicates.map((duplicate, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-yellow-400 font-medium">
                      {Math.round(duplicate.confidence * 100)}% Match Confidence
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                        Keep Separate
                      </button>
                      <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                        Mark Duplicate
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-500/10 rounded-lg p-3">
                      <div className="text-orange-400 font-medium mb-2">Strava Activity</div>
                      <div className="text-white text-sm">{duplicate.strava.name}</div>
                      <div className="text-white/60 text-xs">
                        {Math.round(duplicate.strava.moving_time / 60)}min • 
                        {Math.round(duplicate.strava.distance / 1000 * 10) / 10}km • 
                        {duplicate.strava.total_elevation_gain}m
                      </div>
                    </div>
                    
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <div className="text-green-400 font-medium mb-2">Manual Activity</div>
                      <div className="text-white text-sm capitalize">{duplicate.manual.activity_type}</div>
                      <div className="text-white/60 text-xs">
                        {duplicate.manual.duration_minutes}min • 
                        {duplicate.manual.distance_km}km • 
                        {duplicate.manual.elevation_gain_m}m
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}