'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import {
  TrendingUp,
  Target,
  Clock,
  Thermometer,
  Heart,
  Mountain,
  Calendar,
  Activity,
  Zap,
  Award,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { getEverestCountdownText, getDaysToEverest } from '@/lib/everest-countdown';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';

interface TrainingPhase {
  phase: string;
  duration: string;
  focus: string;
  status: 'completed' | 'current' | 'upcoming';
  details: string;
  metrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

// Helper function to get phase details
function getPhaseDetails(phaseName: string): string {
  const details: Record<string, string> = {
    'Base Building': 'Post-tuberculosis recovery and establishing cardiovascular base. Building back from disease to athletic fitness.',
    'Kilimanjaro Prep': 'Systematic preparation for first Seven Summits attempt. Altitude training and endurance building.',
    'Technical Mountains': 'Advanced mountaineering for technical Seven Summits. Cold weather training, glacier travel, and extreme altitude preparation.',
    'Everest Specific': 'Final preparation phase after completing four Seven Summits. Extreme altitude training, supplemental oxygen practice, and death zone simulation.'
  };
  return details[phaseName] || 'Training phase details';
}

export default function TrainingPage() {
  const { metrics, loading, error, isRealData, lastUpdated, refresh } = useTrainingMetrics();

  // Fallback data structure for TypeScript compatibility
  const trainingPhases: TrainingPhase[] = metrics?.trainingPhases.map(phase => ({
    phase: phase.phase,
    duration: phase.duration,
    focus: phase.focus,
    status: phase.status,
    details: getPhaseDetails(phase.phase),
    metrics: phase.metrics
  })) || [
    {
      phase: 'Base Building',
      duration: 'Jan - Mar 2022',
      focus: 'Recovery Foundation',
      status: 'completed',
      details: 'Post-tuberculosis recovery and establishing cardiovascular base. Building back from disease to athletic fitness.',
      metrics: [
        { label: 'Weekly Volume', value: '8 hrs', trend: 'up' },
        { label: 'Walking Distance', value: '5 km', trend: 'up' },
        { label: 'Recovery Rate', value: '90%', trend: 'up' }
      ]
    },
    {
      phase: 'Kilimanjaro Prep',
      duration: 'Apr - Oct 2022',
      focus: 'First Seven Summit',
      status: 'completed',
      details: 'Systematic preparation for first Seven Summits attempt. Altitude training and endurance building.',
      metrics: [
        { label: 'Weekly Volume', value: '15 hrs', trend: 'up' },
        { label: 'Max Altitude', value: '19,341 ft', trend: 'up' },
        { label: 'Pack Weight', value: '45 lbs', trend: 'up' }
      ]
    },
    {
      phase: 'Technical Mountains',
      duration: 'Nov 2022 - Jul 2024',
      focus: 'Aconcagua, Elbrus, Denali',
      status: 'completed',
      details: 'Advanced mountaineering for technical Seven Summits. Cold weather training, glacier travel, and extreme altitude preparation.',
      metrics: [
        { label: 'Summit Success', value: '3/3', trend: 'up' },
        { label: 'Max Altitude', value: '22,837 ft', trend: 'up' },
        { label: 'Cold Exposure', value: '-40°C', trend: 'down' }
      ]
    },
    {
      phase: 'Everest Specific',
      duration: 'Aug 2024 - Mar 2027',
      focus: 'Death Zone Preparation',
      status: 'current',
      details: 'Final preparation phase after completing four Seven Summits. Extreme altitude training, supplemental oxygen practice, and death zone simulation.',
      metrics: [
        { label: 'Training Altitude', value: '18,000 ft', trend: 'up' },
        { label: 'VO2 Max', value: '62 ml/kg/min', trend: 'up' },
        { label: 'Hypoxic Training', value: '40 hrs/week', trend: 'up' }
      ]
    }
  ];

  // Dynamic current stats based on real data
  const currentStats = metrics ? [
    {
      label: 'Seven Summits',
      value: metrics.currentStats.sevenSummitsCompleted?.value || '4/7',
      icon: Mountain,
      description: metrics.currentStats.sevenSummitsCompleted?.description || 'Completed expeditions'
    },
    {
      label: 'Training Years',
      value: metrics.currentStats.trainingYears?.value || '11',
      icon: Calendar,
      description: metrics.currentStats.trainingYears?.description || 'Since Sar Pass 2014'
    },
    {
      label: 'Total Elevation',
      value: metrics.currentStats.totalElevationThisYear?.value || '356K m',
      icon: TrendingUp,
      description: metrics.currentStats.totalElevationThisYear?.description || 'Cumulative vertical gain'
    },
    {
      label: 'Resting HR',
      value: metrics.currentStats.currentRestingHR?.value || '42 bpm',
      icon: Heart,
      description: metrics.currentStats.currentRestingHR?.description || 'Current fitness level'
    }
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'current': return 'text-yellow-400';
      case 'upcoming': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'COMPLETED';
      case 'current': return 'IN PROGRESS';
      case 'upcoming': return 'UPCOMING';
      default: return 'UNKNOWN';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/stories/data-training.jpg"
            alt="Training for Everest Expedition"
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-4">
              EXPEDITION PREPARATION
            </h1>
            <p className="text-xl font-light tracking-wider opacity-90">
              Systematic Training • {getEverestCountdownText()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Performance Stats */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">
                CURRENT PERFORMANCE
              </h2>

              {/* Data Source Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
                ) : isRealData ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-xs ${isRealData ? 'text-green-400' : 'text-gray-400'}`}>
                  {loading ? 'Loading...' : isRealData ? 'Live Data' : 'Demo Data'}
                </span>
                {!loading && (
                  <button
                    onClick={refresh}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-900/20"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {currentStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-light mb-1">{stat.value}</div>
                    <div className="text-sm font-medium tracking-wide mb-2">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Philosophy */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              THE SYSTEMATIC APPROACH
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-light tracking-wide">From Tuberculosis to Everest Ready</h3>
              <p className="text-gray-300 leading-relaxed">
                <strong>From disease to the death zone.</strong> In 2013, tuberculosis left me
                bedridden and barely able to walk 50 meters. Today, I've completed four of the
                Seven Summits through systematic preparation and data-driven training.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Every expedition teaches the next.</strong> Kilimanjaro (2022) proved
                systematic preparation works. Aconcagua (2023) taught extreme altitude endurance.
                Elbrus (2023) mastered cold weather climbing. Denali (2024) perfected technical
                glacier travel and expedition logistics.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Now: {getDaysToEverest()} days to Everest.</strong>
                Every training session builds specific adaptations needed for survival at 29,032 feet.
                The mountain doesn't care about your feelings—it cares about your preparation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image
                src="/stories/kilimanjaro.jpg"
                alt="Systematic training approach"
                width={600}
                height={400}
                className="w-full rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Phases */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              PREPARATION PHASES
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="space-y-12">
            {trainingPhases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-800 rounded-lg p-8"
              >
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Phase Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 text-xs font-medium tracking-wider uppercase ${getStatusColor(phase.status)} bg-gray-800 rounded`}>
                        {getStatusLabel(phase.status)}
                      </div>
                    </div>
                    <h3 className="text-2xl font-light tracking-wide">{phase.phase}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{phase.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>{phase.focus}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {phase.details}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-light tracking-wide mb-4">Key Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {phase.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-light">{metric.value}</span>
                            <span className="text-lg text-gray-400">{getTrendIcon(metric.trend)}</span>
                          </div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Data Preview */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl md:text-4xl font-light tracking-wide">
              LIVE TRAINING DATA
            </h3>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              Real-time metrics from every training session. Heart rate, power output, 
              elevation gain, and recovery data analyzed daily to optimize Everest preparation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/training/realtime"
                className="inline-flex items-center space-x-2 border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                <Activity className="w-5 h-5" />
                <span>View Live Data</span>
              </a>
              <a
                href="/expeditions"
                className="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 font-medium tracking-wide hover:bg-gray-200 transition-colors"
              >
                <Mountain className="w-5 h-5" />
                <span>Expedition Timeline</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}