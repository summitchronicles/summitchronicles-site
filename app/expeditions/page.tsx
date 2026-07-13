'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicLayout } from '../components/layout/PublicLayout';
import {
  ArrowRight,
  MapPin,
  Calendar,
  TrendingUp,
  Camera,
  CheckCircle,
  Target,
  Clock,
  Mountain,
  Thermometer,
  Timer,
  Award,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
} from 'lucide-react';
import {
  FALLBACK_EXPEDITIONS,
  type ExpeditionRecord,
} from '@/lib/expeditions/catalog';

export default function ExpeditionsPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expeditions, setExpeditions] =
    useState<ExpeditionRecord[]>(FALLBACK_EXPEDITIONS);

  useEffect(() => {
    const loadExpeditions = async () => {
      try {
        const response = await fetch('/api/expeditions');
        if (!response.ok) return;
        const data = (await response.json()) as {
          expeditions?: ExpeditionRecord[];
        };
        if (data.expeditions?.length) setExpeditions(data.expeditions);
      } catch (error) {
        console.error('Unable to refresh expedition records:', error);
      }
    };

    void loadExpeditions();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Target;
      case 'planned':
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-summit-gold-900/10 text-summit-gold-400 border-summit-gold-500/20';
      case 'in-progress':
        return 'bg-white/10 text-white border-white/20';
      case 'planned':
        return 'bg-blue-900/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-summit-gold/30 hover:border-summit-gold/50';
      case 'in-progress':
        return 'border-white/30 hover:border-white/50 shadow-white/5';
      case 'planned':
        return 'border-blue-500/30 hover:border-blue-500/50';
      default:
        return 'border-gray-500/30';
    }
  };

  const getTimelineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-summit-gold-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
      case 'in-progress':
        return 'bg-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]';
      case 'planned':
        return 'bg-gray-700';
      default:
        return 'bg-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'SUMMIT ACHIEVED';
      case 'in-progress':
        return 'IN PREPARATION';
      case 'planned':
        return 'UPCOMING';
      default:
        return 'UNKNOWN';
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
        {/* Hero Section */}
        <section className="relative flex min-h-[82svh] items-end overflow-hidden sm:min-h-[84svh]">
          <div className="absolute inset-0">
            <Image
              src="/stories/everest-prep.jpeg"
              alt="Seven Summits Expeditions"
              fill
              className="object-cover opacity-80 scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/62 to-black/25"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/88 via-obsidian/42 to-transparent"></div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pb-12 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="max-w-4xl"
            >
              <div className="text-xs font-mono uppercase text-summit-gold">
                Seven Summits Record
              </div>
              <h1 className="mt-5 font-oswald text-[64px] font-bold uppercase leading-[0.9] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] sm:text-8xl md:text-9xl">
                <span className="block">Expedition</span>
                <span className="block">Archive</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 md:text-xl">
                Follow the climbs already completed, the lessons carried
                forward, and the Everest objective still being prepared.
              </p>

              <div className="mt-7 grid max-w-xl grid-cols-2 gap-4 text-white sm:grid-cols-3">
                <div>
                  <div className="font-oswald text-3xl font-bold">4/7</div>
                  <div className="text-xs uppercase text-white/60">
                    Complete
                  </div>
                </div>
                <div>
                  <div className="font-oswald text-3xl font-bold">3</div>
                  <div className="text-xs uppercase text-white/60">
                    Remaining
                  </div>
                </div>
                <div>
                  <div className="font-oswald text-3xl font-bold">2028</div>
                  <div className="text-xs uppercase text-white/60">
                    Everest target
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#timeline"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-summit-gold px-5 py-3 text-sm font-oswald font-bold uppercase text-obsidian transition-colors hover:bg-summit-gold-300 focus:outline-none focus:ring-2 focus:ring-summit-gold focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  Explore Timeline
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/support"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/25 bg-black/25 px-5 py-3 text-sm font-oswald font-bold uppercase text-white backdrop-blur-sm transition-colors hover:border-summit-gold hover:text-summit-gold focus:outline-none focus:ring-2 focus:ring-summit-gold focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  Support Everest
                  <HeartHandshake className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-24 relative bg-obsidian">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
                THE JOURNEY
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto mb-6 opacity-60"></div>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Each expedition represents a milestone in systematic
                preparation, personal growth, and the pursuit of seemingly
                impossible goals.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line - Premium Gold Gradient */}
              <div className="hidden md:block absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-summit-gold-500 via-white/20 to-blue-900/50 opacity-40"></div>

              <div className="space-y-12 md:space-y-24">
                {expeditions.map((expedition, index) => {
                  const StatusIcon = getStatusIcon(expedition.status);
                  const isExpanded = expandedCard === expedition.id;

                  return (
                    <motion.div
                      key={expedition.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      {/* Timeline Node - Premium Design */}
                      <div
                        className={`hidden md:flex absolute left-[42px] top-8 w-3 h-3 rounded-full z-10 items-center justify-center`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${getTimelineColor(expedition.status)}`}
                        ></div>
                      </div>

                      {/* Year Label */}
                      <div className="mb-6 md:absolute md:left-24 md:-top-10 md:mb-0 z-30">
                        <div className="text-6xl md:text-8xl font-black text-white/5 md:text-right select-none pointer-events-none transition-colors duration-700 group-hover:text-white/10">
                          {expedition.year}
                        </div>
                      </div>

                      {/* Card */}
                      <div className="md:ml-32">
                        <div
                          className={`group cursor-pointer border rounded-2xl overflow-hidden transition-all duration-500 ${getCardBorderColor(expedition.status)} ${
                            isExpanded
                              ? 'bg-glass-panel shadow-2xl scale-[1.01]'
                              : 'bg-white/5 hover:bg-glass-panel hover:scale-[1.005]'
                          }`}
                          onClick={() => toggleExpanded(expedition.id)}
                        >
                          {/* Main Card Content */}
                          <div className="flex flex-col md:grid md:grid-cols-5 gap-0 min-h-[400px] md:min-h-[450px]">
                            {/* Image Section */}
                            <div className="md:col-span-2 relative flex-1 md:h-auto overflow-hidden order-1 md:order-none">
                              <Image
                                src={expedition.image}
                                alt={`${expedition.mountain} expedition`}
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                sizes="(max-width: 768px) 100vw, 40vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/40"></div>

                              {/* Status Badge */}
                              <div className="absolute top-6 left-6">
                                <div
                                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-widest uppercase ${getStatusColor(expedition.status)} backdrop-blur-md`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  <span>
                                    {getStatusLabel(expedition.status)}
                                  </span>
                                </div>
                              </div>

                              {/* Seven Summits Badge */}
                              {expedition.isSevenSummit && (
                                <div className="absolute top-16 left-6">
                                  <div className="bg-summit-gold-500/90 text-black px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest shadow-lg shadow-summit-gold/20">
                                    SEVEN SUMMITS
                                  </div>
                                </div>
                              )}

                              {/* Elevation */}
                              <div className="absolute bottom-6 left-6">
                                <div className="bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                                  <div className="text-white text-xl font-light tracking-wide">
                                    {expedition.elevation}
                                  </div>
                                  <div className="text-gray-500 text-[10px] uppercase tracking-widest font-mono">
                                    Elevation
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between">
                              <div className="space-y-6 flex-1">
                                {/* Header */}
                                <div>
                                  <h3 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-4">
                                    {expedition.mountain}
                                  </h3>
                                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 text-gray-400 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="w-4 h-4 text-summit-gold-500" />
                                      <span>{expedition.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4 text-summit-gold-500" />
                                      <span>{expedition.date}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Story */}
                                <p className="text-gray-300 text-lg leading-relaxed font-light">
                                  {expedition.story}
                                </p>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                                      Duration
                                    </div>
                                    <div className="text-white font-light">
                                      {expedition.stats.duration}
                                    </div>
                                  </div>
                                  <div className="text-center border-l border-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                                      Difficulty
                                    </div>
                                    <div className="text-white font-light">
                                      {expedition.stats.difficulty}
                                    </div>
                                  </div>
                                  <div className="text-center border-l border-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                                      Temp
                                    </div>
                                    <div className="text-white font-light">
                                      {expedition.stats.temperature}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Footer / Expand */}
                              <div className="flex items-center justify-end pt-6 mt-4">
                                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-summit-gold-400 transition-colors">
                                  <span>
                                    {isExpanded
                                      ? 'Close Details'
                                      : 'Mission Report'}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-white/5 bg-black/40 p-8 md:p-10"
                              >
                                <div className="grid md:grid-cols-2 gap-12">
                                  <div>
                                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
                                      <Award className="w-4 h-4 text-summit-gold-500" />
                                      <span>Key Achievements</span>
                                    </h4>
                                    <ul className="space-y-3 text-sm text-gray-300 font-light">
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          01
                                        </span>{' '}
                                        Successfully reached summit
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          02
                                        </span>{' '}
                                        All safety protocols executed
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          03
                                        </span>{' '}
                                        Weather window optimized
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          04
                                        </span>{' '}
                                        Team coordination excellent
                                      </li>
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
                                      <TrendingUp className="w-4 h-4 text-summit-gold-500" />
                                      <span>Lessons Learned</span>
                                    </h4>
                                    <ul className="space-y-3 text-sm text-gray-300 font-light">
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          01
                                        </span>{' '}
                                        High-altitude acclimatization
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          02
                                        </span>{' '}
                                        Equipment performance testing
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          03
                                        </span>{' '}
                                        Mental resilience building
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <span className="text-summit-gold-500/50">
                                          04
                                        </span>{' '}
                                        Emergency protocol mastery
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="py-24 bg-black border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-4 gap-8 text-center"
            >
              <div className="p-6">
                <div className="text-5xl font-light text-white mb-2">14</div>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Expeditions
                </div>
              </div>
              <div className="p-6 border-l border-white/10">
                <div className="text-5xl font-light text-summit-gold-400 mb-2">
                  4/7
                </div>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Seven Summits
                </div>
              </div>
              <div className="p-6 border-l border-white/10">
                <div className="text-5xl font-light text-white mb-2">11</div>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Years Journey
                </div>
              </div>
              <div className="p-6 border-l border-white/10">
                <div className="text-5xl font-light text-white mb-2">∞</div>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Lessons
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
