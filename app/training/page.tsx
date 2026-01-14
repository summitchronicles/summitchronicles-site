'use client';

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next'; // Added this import
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { Activity, Footprints, Gauge } from 'lucide-react';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';
import { JoinTheMission } from '../components/training/JoinTheMission';
import { TrainingRoadmap } from '../components/training/TrainingRoadmap';
import { AscentVisualization } from '../components/training/AscentVisualization';
import { MissionLog } from '../components/training/MissionLog';

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

        {/* Hero Content - Status HUD Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center px-6 pt-24 md:pt-0"
        >
          {/* Top Label - Mono */}
          <span className="text-gray-400 text-xs font-mono tracking-[0.3em] uppercase mb-4">
            GARMIN CONNECT™ LIVE FEED
          </span>

          {/* Main Status Display - Massive Oswald with Ghost Effect */}
          <motion.h1
            className="flex flex-col items-center group cursor-default"
            initial="initial"
            whileHover="hover"
          >
            <span className="text-xl md:text-3xl font-oswald text-white/50 tracking-widest mb-2">
              CURRENT STATUS
            </span>
            <motion.span
              className="text-[8.5vw] md:text-[9rem] font-oswald font-bold tracking-tighter leading-none text-white/20 hover:text-summit-gold transition-colors duration-500"
              style={
                {
                  // Maintained responsive consistency with Home page (uses vw units)
                }
              }
              whileHover={{
                color: '#C5A059',
                scale: 1.02,
              }}
              transition={{ duration: 0.4 }}
            >
              {/* Force 'REHAB' if injury is active (daysSinceSurgery < 180?), else use Garmin status */}
              {/* User explicitly requested 'REHAB' override for now */}
              REHABILITATION
            </motion.span>
          </motion.h1>

          {/* Live Data Row - Minimalist */}
          <div className="mt-8 flex items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-oswald text-summit-gold">
                {(metrics as any)?.bodyBattery || 53}
              </div>
              <div className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-wider mt-1">
                Body Battery
              </div>
            </div>

            <div className="w-px h-12 bg-white/10"></div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-oswald text-white">
                {(metrics as any)?.stressScore || 16}
              </div>
              <div className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-wider mt-1">
                Stress Load
              </div>
            </div>
          </div>
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
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: ACT 2 - THE ASCENT (Transformation)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a] scroll-mt-24">
        <div className="max-w-6xl mx-auto pt-16 md:pt-0">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-4xl font-oswald font-bold text-white mb-2">
              THE ASCENT
            </h2>
            <div className="text-xs font-mono text-summit-gold tracking-widest mb-8">
              PHYSIOLOGICAL CAPACITY TIMELINE
            </div>
            {/* The Visualization */}
            <AscentVisualization vo2Max={metrics?.vo2Max} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: ACT 3 - THE WORK (Mission Log)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Log (Daily Protocol) */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-oswald font-bold text-white mb-2">
                  MISSION LOG
                </h2>
                <div className="text-xs font-mono text-gray-500 tracking-widest mb-8">
                  DAILY PROTOCOL FEED
                </div>
              </div>
              <MissionLog />
            </div>

            {/* Training Roadmap */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-oswald font-bold text-white mb-2">
                  THE ROADMAP
                </h2>
                <div className="text-xs font-mono text-gray-500 tracking-widest mb-8">
                  EXPEDITION COUNTDOWN
                </div>
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
