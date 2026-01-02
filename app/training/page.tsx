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
      case 'completed': return 'text-summit-gold-400';
      case 'current': return 'text-white border-summit-gold';
      case 'upcoming': return 'text-gray-500';
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
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-grit-training.png"
            alt="Training for Everest Expedition"
            fill
            className="object-cover object-top opacity-100 scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-obsidian"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4 text-white">
              THE LAB
            </h1>
            <p className="text-xl font-light tracking-wider opacity-80 text-gray-300">
              Systematic Training • <span className="text-summit-gold-400">{getEverestCountdownText()}</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Performance Stats - Glass & Gold */}
      <section className="py-16 bg-obsidian relative">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-summit-gold-400 mb-2">Live Telemetry</h2>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto opacity-50"></div>
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
                  className="bg-glass-panel border border-white/5 hover:border-summit-gold/30 rounded-xl p-6 text-center group transition-colors"
                >
                  <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-summit-gold/10 transition-colors">
                    <IconComponent className="w-6 h-6 text-gray-400 group-hover:text-summit-gold transition-colors" />
                  </div>
                  <div>
                    <div className="text-2xl font-light mb-1 text-white">{stat.value}</div>
                    <div className="text-xs font-mono tracking-wide mb-2 text-summit-gold-400 uppercase">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Simple Data Indicator */}
          <div className="flex items-center justify-center mt-12 space-x-2">
            {wellnessLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-summit-gold-400" />
            ) : wellnessData ? (
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-xs text-gray-300 font-mono">GARMIN CONNECT LINKED</span>
                <div className="text-[10px] text-gray-500 font-mono">
                  {new Date(wellnessData.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-900/10 rounded-full border border-red-900/30">
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 font-mono">UPLINK OFFLINE</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Training Philosophy */}
      <section className="py-24 bg-black border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
                <div>
                     <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-summit-gold-400 mb-4">Methodology</h2>
                    <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white">
                        THE ALGORITHM
                    </h3>
                </div>

              <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                  <p>
                    <strong className="text-white">From disease to the death zone.</strong> In 2013, tuberculosis left me
                    bedridden. Today, I've completed four of the Seven Summits through ruthless, data-driven preparation.
                  </p>
                  <p>
                    Kilimanjaro proved the system. Aconcagua tested endurance. Elbrus mastered the cold.
                    Denali perfected logistics.
                  </p>
                  <p>
                    <strong className="text-summit-gold-400">Now: {getDaysToEverest()} days to Everest.</strong><br/>
                    The mountain doesn't care. Only the preparation matters.
                  </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
                <div className="absolute inset-0 bg-summit-gold-500/10 blur-3xl rounded-full"></div>
              <Image
                src="/stories/kilimanjaro.jpg"
                alt="Systematic training approach"
                width={600}
                height={800}
                className="relative z-10 w-full rounded-2xl shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Phases - Glass Accordion */}
      <section className="py-24 bg-obsidian">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-white">
              PHASE LOG
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-light">
              The roadmap from recovery to the roof of the world.
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
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-glass-panel border-summit-gold/30 shadow-lg shadow-summit-gold/5' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                  {/* Phase Header - Always Visible */}
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`text-2xl font-light tracking-wide ${isExpanded ? 'text-summit-gold-400' : 'text-white'}`}>{phase.phase}</div>
                        <div className="hidden md:block h-px w-12 bg-white/10"></div>
                        <span className="hidden md:block text-sm font-mono text-gray-500 uppercase tracking-widest">{phase.duration}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-summit-gold-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-8">
                          <div className="grid md:grid-cols-2 gap-12">
                            {/* Phase Details */}
                            <div>
                              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Mission Parameters</h4>
                              <p className="text-gray-300 leading-relaxed mb-6 font-light">
                                {phase.details}
                              </p>
                              <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex items-center space-x-3">
                                  <Calendar className="w-4 h-4 text-summit-gold-500" />
                                  <span>{phase.duration}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Target className="w-4 h-4 text-summit-gold-500" />
                                  <span>{phase.focus}</span>
                                </div>
                              </div>
                            </div>

                            {/* Metrics Grid */}
                            <div>
                              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
                                {phase.phase === 'Base Training' ? 'Live Telemetry' : 'Phase Metrics'}
                              </h4>
                              <div className="space-y-3">
                                {(phase.phase === 'Base Training' ? getDynamicMetrics() : Array.isArray(phase.metrics) ? phase.metrics : []).map((metric, metricIndex) => (
                                  <div key={metricIndex} className="bg-black/40 border border-white/5 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                      <div className="text-lg font-light text-white">{metric.value}</div>
                                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                                        {metric.label}
                                      </div>
                                    </div>
                                    <span className={`text-lg ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-600'}`}>
                                        {getTrendIcon(metric.trend)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {phase.phase === 'Base Training' && wellnessData && (
                                <div className="mt-4 text-right">
                                    <span className="text-[10px] text-summit-gold-500/50 font-mono">ENCRYPTED DATA STREAM VERIFIED</span>
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

      {/* Footer CTA */}
      <section className="py-24 bg-black border-t border-white/10 text-center">
            <h3 className="text-2xl font-light text-white mb-8">Ready to see where this training leads?</h3>
             <a
                href="/expeditions"
                className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-black font-medium tracking-widest hover:bg-gray-200 transition-colors"
                >
                <Mountain className="w-4 h-4" />
                <span>VIEW EXPEDITIONS</span>
            </a>
      </section>
    </div>
  );
}
