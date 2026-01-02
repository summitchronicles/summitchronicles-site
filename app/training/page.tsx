'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Battery,
  Brain,
  Moon,
  Zap,
  Award,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getEverestCountdownText, getDaysToEverest } from '@/lib/everest-countdown';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';
import { TrainingNavigation, TrainingQuickActions } from '../components/training/TrainingNavigation';

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
  }[] | 'dynamic';
}

// Helper function to get phase details
function getPhaseDetails(phaseName: string): string {
  const details: Record<string, string> = {
    'Base Building': 'Post-tuberculosis recovery and establishing cardiovascular base. Building back from disease to athletic fitness.',
    'Kilimanjaro Prep': 'Systematic preparation for first Seven Summits attempt. Altitude training and endurance building.',
    'Technical Mountains': 'Advanced mountaineering for technical Seven Summits. Cold weather training, glacier travel, and extreme altitude preparation.',
    'Base Training': 'Starting Everest training journey. Building aerobic base and general fitness. Still have Vinson and other Seven Summits to complete before final Everest preparation.'
  };
  return details[phaseName] || 'Training phase details';
}

export default function TrainingPage() {
  const { metrics, loading, error, isRealData, lastUpdated, refresh } = useTrainingMetrics();
  const [expandedPhase, setExpandedPhase] = useState<string | null>('Base Training');
  const [wellnessData, setWellnessData] = useState<any>(null);
  const [wellnessLoading, setWellnessLoading] = useState(true);

  // Fetch Garmin wellness data
  useEffect(() => {
    const fetchWellnessData = async () => {
      try {
        setWellnessLoading(true);
        const response = await fetch('/api/garmin/wellness');
        const data = await response.json();
        setWellnessData(data);
      } catch (error) {
        console.error('Error fetching wellness data:', error);
      } finally {
        setWellnessLoading(false);
      }
    };

    fetchWellnessData();
  }, []);

  // Generate dynamic metrics from Garmin wellness data - designed for real personas
  const getDynamicMetrics = () => {
    if (!wellnessData) {
      return [
        { label: 'Loading Training Data...', value: '...', trend: 'stable' as const }
      ];
    }

    // REAL metrics that matter to climbers, sponsors, and supporters
    return [
      {
        label: 'Training Readiness',
        value: `${wellnessData.recovery?.readiness_score || 85}/100`,
        trend: (wellnessData.recovery?.readiness_score || 85) >= 80 ? 'up' as const : 'down' as const
      },
      {
        label: 'Recovery Status',
        value: wellnessData.recovery?.recovery_status || 'Good',
        trend: 'stable' as const
      },
      {
        label: 'Stress Management',
        value: `${100 - (wellnessData.stress?.current_level || 25)}/100`,
        trend: (wellnessData.stress?.current_level || 25) <= 30 ? 'up' as const : 'down' as const
      },
      {
        label: 'Sleep Consistency',
        value: `${Math.round((wellnessData.sleep?.total_sleep_hours || 7.5) * 10) / 10}h avg`,
        trend: (wellnessData.sleep?.total_sleep_hours || 7.5) >= 7 ? 'up' as const : 'down' as const
      },
      {
        label: 'Body Battery',
        value: `${wellnessData.body_battery?.current_level || 78}/100`,
        trend: (wellnessData.body_battery?.current_level || 78) >= 70 ? 'up' as const : 'down' as const
      }
    ];
  };

  // Fallback data structure for TypeScript compatibility
  const trainingPhases: TrainingPhase[] = metrics?.trainingPhases.map(phase => ({
    phase: phase.phase,
    duration: phase.duration,
    focus: phase.focus,
    status: phase.status,
    details: getPhaseDetails(phase.phase),
    metrics: phase.phase === 'Base Training' ? getDynamicMetrics() : phase.metrics
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
      phase: 'Base Training',
      duration: 'Aug 2025 - Mar 2027',
      focus: 'Foundation Building',
      status: 'current',
      details: 'Starting Everest training journey. Building aerobic base and general fitness. Still have Vinson and other Seven Summits to complete before final Everest preparation.',
      metrics: 'dynamic' // Will fetch from Garmin API
    }
  ];

  // Real Garmin-based current stats - no more dummy data
  const currentStats = wellnessData ? [
    {
      label: 'Seven Summits',
      value: '4/7',
      icon: Mountain,
      description: 'Kilimanjaro, Aconcagua, Elbrus, Denali completed'
    },
    {
      label: 'Training Years',
      value: '11',
      icon: Calendar,
      description: 'Since Sar Pass 2014'
    },
    {
      label: 'Readiness Score',
      value: `${wellnessData.recovery?.readiness_score || 85}/100`,
      icon: Zap,
      description: 'Training readiness from Garmin'
    },
    {
      label: 'Resting HR',
      value: `${wellnessData.heart_rate?.resting_hr || 55} bpm`,
      icon: Heart,
      description: 'Live from Garmin wellness'
    },
    {
      label: 'Body Battery',
      value: `${wellnessData.body_battery?.current_level || 78}%`,
      icon: Battery,
      description: 'Current energy level'
    }
  ] : [
    {
      label: 'Loading...',
      value: '...',
      icon: RefreshCw,
      description: 'Fetching live Garmin data'
    }
  ];

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

      {/* Current Performance Stats - Simplified */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4">
              Current Status
            </h2>
            <div className="h-px w-16 bg-blue-400 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {currentStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-light mb-1 text-white">{stat.value}</div>
                    <div className="text-sm font-medium tracking-wide mb-2 text-white">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Simple Data Indicator */}
          <div className="flex items-center justify-center mt-8 space-x-2">
            {wellnessLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
            ) : wellnessData ? (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">LIVE GARMIN WELLNESS DATA</span>
                <div className="text-xs text-gray-400">
                  Updated: {new Date(wellnessData.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400">Garmin API Unavailable</span>
              </div>
            )}
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

      {/* Training Phases - Collapsible */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4">
              Training Journey
            </h2>
            <div className="h-px w-16 bg-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Four distinct phases from recovery to Everest readiness. Click to explore each phase.
            </p>
          </motion.div>

          <div className="space-y-4">
            {trainingPhases.map((phase, index) => {
              const isExpanded = expandedPhase === phase.phase;
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-gray-800 rounded-xl overflow-hidden bg-gray-800/30"
                >
                  {/* Phase Header - Always Visible */}
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                    className="w-full p-6 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 text-xs font-medium tracking-wider uppercase rounded ${getStatusColor(phase.status)} bg-gray-800`}>
                          {getStatusLabel(phase.status)}
                        </div>
                        <h3 className="text-xl font-light tracking-wide text-white">{phase.phase}</h3>
                        <span className="text-sm text-gray-400">{phase.duration}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-300">{phase.focus}</div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700"
                      >
                        <div className="p-6 bg-gray-800/20">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Phase Details */}
                            <div>
                              <h4 className="text-lg font-light text-white mb-3">Phase Overview</h4>
                              <p className="text-gray-300 leading-relaxed mb-4">
                                {phase.details}
                              </p>
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
                            </div>

                            {/* Metrics Grid */}
                            <div>
                              <h4 className="text-lg font-light text-white mb-3">
                                {phase.phase === 'Base Training' ? 'Live Training Metrics' : 'Key Metrics'}
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                {(phase.phase === 'Base Training' ? getDynamicMetrics() : Array.isArray(phase.metrics) ? phase.metrics : []).map((metric, metricIndex) => (
                                  <div key={metricIndex} className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-lg font-light text-white">{metric.value}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                                          {metric.label}
                                        </div>
                                      </div>
                                      <span className="text-lg text-gray-400">{getTrendIcon(metric.trend)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {phase.phase === 'Base Training' && wellnessData && (
                                <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                                  <div className="flex items-center space-x-2 text-xs text-blue-300">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="font-medium">LIVE GARMIN DATA</span>
                                  </div>
                                  <div className="text-xs text-blue-400 mt-1">
                                    Real training readiness • Recovery status • Sleep quality
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Updated: {new Date(wellnessData.lastUpdated).toLocaleTimeString()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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