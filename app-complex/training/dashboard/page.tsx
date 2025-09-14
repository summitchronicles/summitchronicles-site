"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  FireIcon,
  TrophyIcon,
  DocumentArrowUpIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import TrainingProgress from '@/components/training/TrainingProgressSimple';
import CombinedDataOverview from '@/components/training/CombinedDataOverview';
import AITrainingInsights from '@/components/training/AITrainingInsights';

export default function TrainingDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Navigation */}
        <Link 
          href="/training" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-summitGold transition-colors duration-300 mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Training
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Training Dashboard
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Track your strength progression, monitor training volume, and analyze performance data
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link
            href="/training/workout"
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-summitGold/30 hover:bg-summitGold/5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-summitGold/20 rounded-full flex items-center justify-center group-hover:bg-summitGold/30 transition-colors">
                <PlayIcon className="w-6 h-6 text-summitGold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Today's Workout</h3>
                <p className="text-white/60 text-sm">Start your strength session</p>
              </div>
            </div>
          </Link>

          <Link
            href="/training/upload"
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <DocumentArrowUpIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Upload Plan</h3>
                <p className="text-white/60 text-sm">Import weekly Excel file</p>
              </div>
            </div>
          </Link>

          <Link
            href="/training/plans"
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <CalendarDaysIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Training Plans</h3>
                <p className="text-white/60 text-sm">View all uploaded plans</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
            {[
              { key: 'week', label: '7 Days' },
              { key: 'month', label: '30 Days' },
              { key: 'quarter', label: '90 Days' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setTimeRange(option.key as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  timeRange === option.key
                    ? 'bg-summitGold text-black shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Combined Data Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CombinedDataOverview timeRange={timeRange} />
        </motion.div>

        {/* Progress Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <TrainingProgress timeRange={timeRange} />
        </motion.div>

        {/* AI Training Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <AITrainingInsights timeRange={timeRange} />
        </motion.div>
      </div>
    </div>
  );
}