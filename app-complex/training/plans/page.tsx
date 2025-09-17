'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { trackTrainingPageView } from '../../components/GoogleAnalytics';
import DownloadableResources from '../../components/training/DownloadableResources';
import {
  CalendarDaysIcon,
  ClockIcon,
  TrophyIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  target: string;
  weeklyHours: string;
  features: string[];
  downloadUrl?: string;
}

interface WeeklySchedule {
  day: string;
  activity: string;
  duration: string;
  intensity: 'low' | 'moderate' | 'high';
  description: string;
  equipment?: string[];
}

export default function TrainingPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    trackTrainingPageView('training_plans');
  }, []);

  const trainingPlans: TrainingPlan[] = [
    {
      id: 'seven-summits-foundation',
      title: 'Seven Summits Foundation',
      description:
        'My complete 12-week base building program used to prepare for major expeditions',
      duration: '12 weeks',
      level: 'intermediate',
      target: 'Major peak preparation',
      weeklyHours: '8-12 hours',
      features: [
        'Progressive altitude simulation',
        'Loaded backpack training',
        'Mental resilience protocols',
        'Altitude acclimatization schedule',
        'Real expedition scenarios',
      ],
      downloadUrl: '/downloads/seven-summits-foundation.pdf',
    },
    {
      id: 'beginner-mountaineering',
      title: 'Mountaineering Basics',
      description:
        'Start from zero fitness to your first technical climb - my proven progression',
      duration: '16 weeks',
      level: 'beginner',
      target: 'First technical peak',
      weeklyHours: '6-8 hours',
      features: [
        'No equipment required start',
        'Gradual difficulty progression',
        'Safety mindset development',
        'Basic technical skills',
        'Confidence building approach',
      ],
      downloadUrl: '/downloads/beginner-mountaineering.pdf',
    },
    {
      id: 'tb-recovery-adaptation',
      title: 'Recovery to Resilience',
      description:
        'How I rebuilt from 40kg hospital weight to summit-ready - adapted for your situation',
      duration: '24 weeks',
      level: 'beginner',
      target: 'Health recovery + fitness',
      weeklyHours: '4-6 hours',
      features: [
        'Medical clearance protocols',
        'Gentle progressive loading',
        'Mental health integration',
        'Milestone celebration system',
        'Setback management strategies',
      ],
      downloadUrl: '/downloads/recovery-resilience.pdf',
    },
    {
      id: 'everest-specific',
      title: 'Everest 2027 Protocol',
      description:
        "The exact training plan I'm using to prepare for Everest - my most advanced program",
      duration: '18 months',
      level: 'advanced',
      target: 'Everest summit attempt',
      weeklyHours: '12-20 hours',
      features: [
        'Hypoxic training protocols',
        'Extreme weather preparation',
        'Technical skill mastery',
        'Expedition logistics training',
        'Peak performance timing',
      ],
      downloadUrl: '/downloads/everest-2027-protocol.pdf',
    },
  ];

  const sampleWeek: WeeklySchedule[] = [
    {
      day: 'Monday',
      activity: 'Loaded Cardio + Core',
      duration: '90 minutes',
      intensity: 'moderate',
      description:
        'Hiking with 15kg pack, followed by altitude-specific core work',
      equipment: ['Weighted backpack', 'Hiking boots', 'Exercise mat'],
    },
    {
      day: 'Tuesday',
      activity: 'Strength Training',
      duration: '75 minutes',
      intensity: 'high',
      description: 'Legs/back focus with climbing-specific movements',
      equipment: ['Gym access or resistance bands', 'Pull-up bar'],
    },
    {
      day: 'Wednesday',
      activity: 'Active Recovery',
      duration: '45 minutes',
      intensity: 'low',
      description: 'Light walk or yoga, mobility work',
      equipment: ['None required'],
    },
    {
      day: 'Thursday',
      activity: 'Altitude Simulation',
      duration: '60 minutes',
      intensity: 'high',
      description: 'Stair climbing with breath control exercises',
      equipment: ['Stairs or step platform', 'Heart rate monitor'],
    },
    {
      day: 'Friday',
      activity: 'Technical Skills',
      duration: '120 minutes',
      intensity: 'moderate',
      description: 'Rope work, knots, rescue scenarios',
      equipment: ['Climbing rope', 'Harness', 'Carabiners'],
    },
    {
      day: 'Saturday',
      activity: 'Long Endurance',
      duration: '3-5 hours',
      intensity: 'moderate',
      description: 'Extended hike or climb, building mental toughness',
      equipment: ['Full hiking gear', 'Navigation tools'],
    },
    {
      day: 'Sunday',
      activity: 'Complete Rest',
      duration: '0 minutes',
      intensity: 'low',
      description: 'Recovery day - sleep and nutrition focus',
      equipment: ['None'],
    },
  ];

  const getLevelColor = (level: TrainingPlan['level']) => {
    switch (level) {
      case 'beginner':
        return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'intermediate':
        return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'advanced':
        return 'text-red-400 border-red-400/20 bg-red-400/10';
    }
  };

  const getIntensityColor = (intensity: WeeklySchedule['intensity']) => {
    switch (intensity) {
      case 'low':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Back Navigation */}
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-white/70 hover:text-summitGold transition-colors duration-300 mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Training Data
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-summitGold/10 border border-summitGold/20 rounded-full px-4 py-2 text-sm text-summitGold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <TrophyIcon className="w-4 h-4" />
              Proven Training Systems
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Training <span className="text-summitGold">Plans</span>
            </h1>

            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-8">
              The exact training systems I've developed and tested on 4 major
              summits. From TB recovery to Everest preparation - choose your
              path.
            </p>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    Real Experience, Not Theory
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    These aren't generic fitness programs. Every plan here has
                    been tested in actual expeditions, refined through real
                    challenges, and proven on actual summits.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Training Plans Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {trainingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(plan.level)} mb-3`}
                    >
                      {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDaysIcon className="w-4 h-4 text-summitGold" />
                      <span className="text-sm text-white/60">Duration</span>
                    </div>
                    <div className="text-white font-semibold">
                      {plan.duration}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-summitGold" />
                      <span className="text-sm text-white/60">Weekly</span>
                    </div>
                    <div className="text-white font-semibold">
                      {plan.weeklyHours}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-white/80"
                      >
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setSelectedPlan(selectedPlan === plan.id ? null : plan.id)
                    }
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                  >
                    {selectedPlan === plan.id ? 'Hide Preview' : 'Preview Plan'}
                  </button>
                  <button className="px-6 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                {/* Plan Preview */}
                {selectedPlan === plan.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Sample Week Overview
                    </h4>
                    <div className="space-y-3">
                      {sampleWeek.slice(0, 4).map((day, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${getIntensityColor(day.intensity)}`}
                            ></div>
                            <div>
                              <span className="text-white font-medium">
                                {day.day}
                              </span>
                              <span className="text-white/60 text-sm ml-2">
                                - {day.activity}
                              </span>
                            </div>
                          </div>
                          <span className="text-white/60 text-sm">
                            {day.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/60 text-sm mt-3">
                      * Full detailed schedule in downloadable PDF
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Week Details */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Sample Training Week
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Here's what a typical week looks like in my Seven Summits
              Foundation program. Every session is purposeful and builds toward
              summit readiness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {sampleWeek.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center mb-3">
                  <h3 className="text-white font-semibold mb-1">{day.day}</h3>
                  <div
                    className={`w-3 h-3 rounded-full ${getIntensityColor(day.intensity)} mx-auto mb-2`}
                  ></div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-summitGold font-medium text-sm">
                    {day.activity}
                  </h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {day.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <ClockIcon className="w-3 h-3" />
                    {day.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-white/60">Low Intensity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-white/60">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-white/60">High Intensity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-lg text-white/70 mb-8">
                Every summit starts with the first training session. These plans
                have taken me from TB recovery to 4 major peaks. Your journey
                begins now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2 justify-center"
                >
                  <PlayIcon className="w-5 h-5" />
                  Start Free Trial
                </motion.button>
                <Link
                  href="/ask-sunith"
                  className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2 justify-center"
                >
                  Ask About Training
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Downloadable Resources Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Training <span className="text-summitGold">Resources</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Comprehensive guides, checklists, and workbooks to support your
              training journey. All based on real expedition experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <DownloadableResources />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
