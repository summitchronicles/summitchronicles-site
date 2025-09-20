'use client';

import React from 'react';
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
  Award
} from 'lucide-react';

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

export default function TrainingPage() {
  const trainingPhases: TrainingPhase[] = [
    {
      phase: 'Base Building',
      duration: 'Jan - Mar 2024',
      focus: 'Aerobic Foundation',
      status: 'completed',
      details: 'Establishing cardiovascular base and building consistent training habits. Focus on volume over intensity.',
      metrics: [
        { label: 'Weekly Volume', value: '12 hrs', trend: 'up' },
        { label: 'Avg Heart Rate', value: '135 bpm', trend: 'stable' },
        { label: 'Weight', value: '165 lbs', trend: 'down' }
      ]
    },
    {
      phase: 'Strength & Power',
      duration: 'Apr - Jun 2024',
      focus: 'Functional Strength',
      status: 'completed',
      details: 'Building climbing-specific strength and power. Heavy pack training and technical skill development.',
      metrics: [
        { label: 'Pack Weight', value: '65 lbs', trend: 'up' },
        { label: 'Pull-ups', value: '25 reps', trend: 'up' },
        { label: 'Squat 1RM', value: '225 lbs', trend: 'up' }
      ]
    },
    {
      phase: 'Altitude Prep',
      duration: 'Jul - Sep 2024',
      focus: 'High Altitude Training',
      status: 'current',
      details: 'Hypoxic training and altitude simulation. Testing gear and nutrition strategies at elevation.',
      metrics: [
        { label: 'Training Altitude', value: '8,000 ft', trend: 'up' },
        { label: 'VO2 Max', value: '58 ml/kg/min', trend: 'up' },
        { label: 'Recovery HR', value: '45 bpm', trend: 'down' }
      ]
    },
    {
      phase: 'Everest Specific',
      duration: 'Oct 2024 - Mar 2027',
      focus: 'Expedition Preparation',
      status: 'upcoming',
      details: 'Final preparation phase with Denali and Aconcagua expeditions. Cold weather training and technical skills.',
      metrics: [
        { label: 'Expedition Days', value: '90+ days', trend: 'up' },
        { label: 'Cold Exposure', value: '-40°F', trend: 'down' },
        { label: 'Load Carrying', value: '80 lbs', trend: 'up' }
      ]
    }
  ];

  const currentStats = [
    {
      label: 'Days Training',
      value: '487',
      icon: Calendar,
      description: 'Consecutive training days'
    },
    {
      label: 'Elevation Gain',
      value: '247K ft',
      icon: TrendingUp,
      description: 'Total vertical this year'
    },
    {
      label: 'Training Hours',
      value: '1,247',
      icon: Clock,
      description: 'Total preparation time'
    },
    {
      label: 'Resting HR',
      value: '42 bpm',
      icon: Heart,
      description: 'Current fitness level'
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
          <img
            src="/stories/data-training.jpg"
            alt="Training for Everest Expedition"
            className="w-full h-full object-cover opacity-50"
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
              Systematic Training • 541 Days to Everest
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
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              CURRENT PERFORMANCE
            </h2>
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
              <h3 className="text-2xl font-light tracking-wide">From 40kg to Everest Ready</h3>
              <p className="text-gray-300 leading-relaxed">
                <strong>Every workout is data.</strong> Heart rate zones, power output, 
                recovery metrics, and performance trends guide every training decision. 
                No guesswork, no motivational speeches—just systematic progression toward 
                a single goal.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The mountain doesn't care about your feelings. It cares about your preparation. 
                <strong>541 days of systematic training</strong> will determine whether I come 
                home safely from 29,032 feet.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Training phases are calculated backward from March 15, 2027.</strong> 
                Every week builds specific adaptations needed for survival in the death zone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="/stories/kilimanjaro.jpg"
                alt="Systematic training approach"
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