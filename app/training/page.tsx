'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { Activity, Footprints, Gauge } from 'lucide-react';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';
import { RecoveryTimeline } from '../components/training/RecoveryTimeline';
import { MissionLog } from '../components/training/MissionLog';
import { TrainingRoadmap } from '../components/training/TrainingRoadmap';
import { JoinTheMission } from '../components/training/JoinTheMission';

export default function TrainingPage() {
  const { metrics } = useTrainingMetrics();

  // Surgery date: November 10, 2025
  const surgeryDate = new Date('2025-11-10T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSurgery = Math.floor(
    (today.getTime() - surgeryDate.getTime()) / msPerDay
  );

  // Walking milestone: January 9, 2026
  const walkingDate = new Date('2026-01-09T00:00:00');
  const daysToWalking = Math.max(
    0,
    Math.ceil((walkingDate.getTime() - today.getTime()) / msPerDay)
  );

  const recoveryData = metrics?.recoveryPhase || {
    nextMilestone: 'Walking',
    metrics: { mobility: 10 },
  };

  const readiness = parseInt(
    metrics?.currentStats?.currentFitness?.value || '30'
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO - Typography Only, Full Viewport
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Background - Very subtle, 10% opacity */}
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-grit-training.png"
            alt="Training"
            fill
            className="object-cover object-top opacity-40"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
        </div>

        {/* Hero Content - Pure Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center px-6"
        >
          {/* Label */}
          <span className="text-summit-gold-500 text-xs font-medium tracking-[0.3em] uppercase mb-6">
            Rehabilitation Protocol
          </span>

          {/* Main Title - Thin, Massive */}
          <h1 className="text-[clamp(4rem,15vw,12rem)] font-thin tracking-tight text-white leading-none mb-4">
            THE LAB
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-500 text-sm md:text-base tracking-widest uppercase">
            Day {daysSinceSurgery} of Recovery
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1 h-1.5 bg-summit-gold-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: RECOVERY METRICS - 3-Column Grid
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-xl font-medium text-white mb-2">
              Recovery Metrics
            </h2>
            <div className="h-px bg-zinc-800 w-full" />
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Mobility */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center">
              <Activity className="w-6 h-6 text-zinc-500 mb-4" />
              <span className="text-4xl font-bold text-white mb-1">
                {recoveryData.metrics.mobility}%
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Mobility
              </span>
            </div>

            {/* Card 2: Days to Walking */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center">
              <Footprints className="w-6 h-6 text-zinc-500 mb-4" />
              <span className="text-4xl font-bold text-white mb-1">
                {daysToWalking}
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Days to Walking
              </span>
            </div>

            {/* Card 3: Readiness */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center">
              <Gauge className="w-6 h-6 text-zinc-500 mb-4" />
              <span className="text-4xl font-bold text-white mb-1">
                {readiness}%
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Readiness
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: RECOVERY TIMELINE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-xl font-medium text-white mb-2">
              Recovery Timeline
            </h2>
            <div className="h-px bg-zinc-800 w-full" />
          </div>

          {/* Timeline Component */}
          <RecoveryTimeline />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: ACTIVITY FEED - Two Column Layout
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Log */}
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-medium text-white mb-2">
                  Mission Log
                </h2>
                <div className="h-px bg-zinc-800 w-full" />
              </div>
              <MissionLog />
            </div>

            {/* Training Roadmap */}
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-medium text-white mb-2">
                  Training Roadmap
                </h2>
                <div className="h-px bg-zinc-800 w-full" />
              </div>
              <TrainingRoadmap />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <JoinTheMission />
        </div>
      </section>
    </div>
  );
}
