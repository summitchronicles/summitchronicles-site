'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';
import { JoinTheMission } from '../components/training/JoinTheMission';

// Components (Restored)
import { AscentVisualization } from '../components/training/AscentVisualization';
import { WeeklyProtocolLog } from '../components/training/WeeklyProtocolLog';
import { TrainingRoadmap } from '../components/training/TrainingRoadmap';

export default function TrainingPage() {
  const { metrics } = useTrainingMetrics();
  const [insight, setInsight] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchInsight() {
      try {
        const res = await fetch('/api/insights');
        const data = await res.json();
        if (data.success) {
          setInsight(data.insights);
        }
      } catch (e) {
        console.error('Failed to fetch training insight');
      }
    }
    fetchInsight();
  }, []);

  // Surgery date: November 10, 2025
  const surgeryDate = new Date('2025-11-10T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSurgery = Math.floor(
    (today.getTime() - surgeryDate.getTime()) / msPerDay
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      {/* Hero Section - Narrative Style */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-grit-training.png"
            alt="Training"
            fill
            className="object-cover object-top opacity-30"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center w-full max-w-5xl mx-auto px-6"
        >
          <span className="text-summit-gold text-xs font-mono tracking-[0.4em] uppercase mb-4 block opacity-80">
            INTERVALS.ICU™ LIVE TELEMETRY
          </span>

          <div className="relative">
            {/* The "Ghost" Text - Outline Only */}
            <h1 className="text-[10vw] md:text-[130px] leading-[0.8] font-oswald font-bold uppercase tracking-tighter text-ghost select-none">
              REHABILITATION
            </h1>

            {/* Overlay Text for Depth (Optional, or just keep the ghost) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="text-2xl md:text-3xl font-oswald text-white font-light tracking-[0.5em] uppercase opacity-0">
                CURRENT STATUS
              </h2>
            </div>
          </div>

          {/* Narrative Status Row */}
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 mt-16">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-oswald text-white font-bold group-hover:text-summit-gold transition-colors">
                {metrics?.vo2Max ? Math.round(metrics.vo2Max) : '--'}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
                VO2 MAX
              </div>
            </div>

            <div className="w-px h-12 bg-white/10 hidden md:block"></div>

            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-oswald text-summit-gold font-bold">
                {daysSinceSurgery}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
                DAYS RECOVERY
              </div>
            </div>

            <div className="w-px h-12 bg-white/10 hidden md:block"></div>

            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-oswald text-emerald-500 font-bold">
                98%
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
                PROTOCOL ADHERENCE
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 1. Ascent Timeline (Tweak 2: With Stick Figure) */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="text-3xl font-oswald font-bold uppercase">
              Ascent Profile
            </h2>
            <p className="text-zinc-500 text-sm font-mono mt-2">
              Historic Trajectory & Recovery Path
            </p>
          </div>
          {/* Passing activity data to help calculate timeline if needed, though strictly Ascent uses Date logic */}
          <AscentVisualization vo2Max={metrics?.vo2Max} />
        </div>
      </section>

      {/* 2. Mission Log (Tweak 3: Bundled Weekly) */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-b border-white/10 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-oswald font-bold uppercase">
                Mission Log
              </h2>
              <p className="text-zinc-500 text-sm font-mono mt-2">
                Weekly Operational Summaries
              </p>
            </div>
          </div>
          <WeeklyProtocolLog
            activities={metrics?.recentActivities || []}
            latestInsight={insight}
          />
        </div>
      </section>

      {/* 3. Roadmap (Tweak 4: Retained) */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-b border-white/10 pb-4">
            <h2 className="text-3xl font-oswald font-bold uppercase">
              Training Roadmap
            </h2>
          </div>
          <TrainingRoadmap />
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <JoinTheMission />
        </div>
      </section>
    </div>
  );
}
