'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Heart, MapPin, Zap } from 'lucide-react';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';

export const DailyProtocolLog = () => {
  const { metrics, loading } = useTrainingMetrics();

  // Use real data if available, otherwise fallback/loading state
  const activities = metrics?.recentActivities || [];

  if (loading) {
    return (
      <div className="text-gray-500 font-mono text-sm animate-pulse">
        SYNCING MISSION LOG...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="border border-white/10 p-8 rounded-lg text-center bg-black/50">
        <div className="text-gray-500 font-mono mb-2">
          NO RECENT TRANSMISSIONS
        </div>
        <div className="text-xs text-gray-700">
          Protocol logs are empty or syncing from Garmin.
        </div>
      </div>
    );
  }

  // Helper to format duration (seconds -> HH:MM:SS)
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-4">
      {activities.slice(0, 5).map((activity, index) => (
        <motion.div
          key={activity.activityId || index}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/40 border border-white/10 p-5 hover:bg-white/5 transition-all group relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            {/* Left Col: Date & Type */}
            <div className="md:w-1/4 flex-shrink-0">
              <div className="text-[10px] font-mono text-summit-gold mb-1">
                {formatDate(activity.startTimeLocal)}
              </div>
              <div className="text-sm font-oswald text-white uppercase tracking-wide group-hover:text-summit-gold transition-colors">
                {activity.activityName}
              </div>
              <div className="text-[10px] text-gray-500 font-mono uppercase mt-1">
                TYPE:{' '}
                {activity.activityType?.typeKey?.replace('_', ' ') ||
                  'TRAINING'}
              </div>
            </div>

            {/* Middle Col: Telemetry (Compact) */}
            <div className="md:w-1/4 flex flex-wrap gap-4 md:border-l md:border-white/10 md:pl-4">
              <div>
                <div className="text-[10px] text-gray-500 font-mono uppercase">
                  Time
                </div>
                <div className="text-sm font-oswald text-white">
                  {formatDuration(activity.duration)}
                </div>
              </div>
              {activity.averageHR && (
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase">
                    Avg HR
                  </div>
                  <div className="text-sm font-oswald text-white">
                    {Math.round(activity.averageHR)}{' '}
                    <span className="text-[10px] text-gray-600">bpm</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Captain's Note (Description) */}
            <div className="md:w-1/2 md:border-l md:border-white/10 md:pl-4">
              <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">
                PROTOCOL NOTES
              </div>
              {activity.description ? (
                <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                  "{activity.description}"
                </p>
              ) : (
                <p className="text-[10px] text-gray-700 font-mono uppercase">
                  [NO FIELD NOTES LOGGED]
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
