'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface TrainingProgressProps {
  timeRange?: string;
}

export default function TrainingProgress({ timeRange = 'month' }: TrainingProgressProps) {
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
              <p className="text-white/60 text-sm">Last {timeRange}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-summitGold" />
              <span className="text-white/60 text-sm">Activities</span>
            </div>
            <div className="text-2xl font-bold text-white">24</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-summitGold" />
              <span className="text-white/60 text-sm">Distance</span>
            </div>
            <div className="text-2xl font-bold text-white">156km</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-summitGold" />
              <span className="text-white/60 text-sm">Elevation</span>
            </div>
            <div className="text-2xl font-bold text-white">8,420m</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-summitGold" />
              <span className="text-white/60 text-sm">Avg RPE</span>
            </div>
            <div className="text-2xl font-bold text-white">6.8</div>
          </div>
        </div>
      </motion.div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Training Volume</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl">
          <p className="text-white/60">Training charts will be displayed here</p>
        </div>
      </motion.div>
    </div>
  );
}