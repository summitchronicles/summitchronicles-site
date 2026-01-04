'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import {
  Moon,
  Heart,
  Activity,
  Calendar,
  Mountain,
  TrendingUp,
} from 'lucide-react';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';
import { getDaysToEverest } from '@/lib/everest-countdown';

// New Components
import { TrainingHero } from '../components/training/TrainingHero';
import { BentoGrid, BentoItem } from '../components/training/BentoGrid';
import { MetricCard } from '../components/training/MetricCard';
import { RecoveryTimeline } from '../components/training/RecoveryTimeline';
import { SummitProgress } from '../components/training/SummitProgress';

export default function TrainingPage() {
  const { metrics, loading } = useTrainingMetrics();

  // Default values if loading or no data
  const readiness = parseInt(
    metrics?.currentStats?.currentFitness?.value || '85'
  );
  const daysToEverest = getDaysToEverest();

  const recoveryData = metrics?.recoveryPhase || {
    daysToMilestone: 5,
    nextMilestone: 'Walking',
    daysSinceSurgery: 55,
    metrics: { mobility: 10, painLevel: 0, ptSessions: 0 },
  };

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* 1. HERO SECTION WITH BACKGROUND */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-grit-training.png"
            alt="Training for Everest Expedition"
            fill
            className="object-cover object-top opacity-40 scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-obsidian"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-6">
          <TrainingHero readinessScore={readiness} />
        </div>
      </section>

      {/* 2. MISSION CONTROL (BENTO GRID) */}
      <section className="px-4 md:px-6 py-16 relative z-20 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            {/* A. RECOVERY TIMELINE (Wide) */}
            <BentoItem span="full" className="md:col-span-4">
              <MetricCard
                title="Current Protocol: Rehabilitation"
                value={`Day ${recoveryData.daysSinceSurgery || 55}`}
                subtitle={`Since Surgery (Nov 10, 2025) • Next: ${recoveryData.nextMilestone}`}
                variant="glass"
                className="h-full bg-black/60 backdrop-blur-xl border-summit-gold/20"
              >
                <RecoveryTimeline />
              </MetricCard>
            </BentoItem>

            {/* B. SUMMIT PROGRESS - Compact Single Column */}
            <BentoItem span="1">
              <MetricCard
                title="Project 7/7"
                value="4 Completed"
                subtitle="Next: Everest (2028)"
                variant="default"
                className=""
              >
                <div className="mt-4">
                  <SummitProgress />
                </div>
              </MetricCard>
            </BentoItem>

            {/* C. KEY RECOVERY METRICS */}
            <BentoItem span="1">
              <MetricCard
                title="Mobility Score"
                value={`${recoveryData.metrics.mobility}%`}
                subtitle="Ankle Range of Motion"
                icon={Activity}
                trend="up"
                trendValue="+5%"
                variant="default"
                className=""
              />
            </BentoItem>

            <BentoItem span="1">
              <MetricCard
                title="Days to Walking"
                value={recoveryData.daysToMilestone}
                subtitle="With Boot Support"
                icon={Calendar}
                variant="highlight"
                className=""
              />
            </BentoItem>

            {/* D. MISSION EVEREST - Compact & Visual */}
            <BentoItem span="1">
              <MetricCard
                title="Mission Everest"
                value={daysToEverest}
                subtitle="Days Remaining"
                className=" bg-gradient-to-br from-summit-gold-900/10 to-black border-summit-gold-500/20"
              >
                <div className="mt-4 space-y-3">
                  {/* Mountain Silhouette */}
                  <div className="relative h-16 flex items-end justify-center">
                    <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-summit-gold-500/20 to-transparent" />
                    <Mountain className="relative w-10 h-10 text-summit-gold-500/60" />
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-summit-gold-600 to-summit-gold-400 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((daysToEverest / 1000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                      <span>Start</span>
                      <span>2028</span>
                    </div>
                  </div>
                </div>
              </MetricCard>
            </BentoItem>

            {/* E. PHYSIOLOGY */}
            <BentoItem span="1">
              <MetricCard
                title="Sleep Quality"
                value="7h 45m"
                subtitle="Deep Sleep: 1h 20m"
                icon={Moon}
                trend="up"
                trendValue="Optimal"
                className=""
              />
            </BentoItem>

            <BentoItem span="1">
              <MetricCard
                title="Resting HR"
                value="54 BPM"
                subtitle="Recovery Indicator"
                icon={Heart}
                trend="up"
                trendValue="Improving"
                className=""
              />
            </BentoItem>

            {/* F. NEXT GOAL */}
            <BentoItem span="1">
              <MetricCard
                title="Next Milestone"
                value="Local Trails"
                subtitle="Target: July 2026"
                icon={TrendingUp}
                variant="default"
                className=""
              >
                <div className="mt-2 text-xs text-gray-400">
                  Focus: Low impact, ankle stability, controlled elevation gain.
                </div>
              </MetricCard>
            </BentoItem>
          </BentoGrid>
        </div>
      </section>

      {/* 3. PHILOSOPHY SECTION */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-summit-gold-400 font-mono text-xs tracking-widest uppercase mb-4 block">
                  The Algorithm
                </span>
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
                  From Broken to{' '}
                  <span className="text-summit-gold-500">Base Camp.</span>
                </h2>
              </div>

              <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                <p>
                  In 2013, tuberculosis took my breath away. In 2025, a broken
                  Talus took my footing. The mountain doesn't care about
                  setbacks. It only respects preparation.
                </p>
                <p>
                  Current Phase:{' '}
                  <strong className="text-white">
                    Radical Rehabilitation.
                  </strong>{' '}
                  Every PT session, every hour of sleep, every controlled
                  movement is a step towards the Khumbu Icefall.
                </p>
                <p className="text-summit-gold-400">
                  <strong>{daysToEverest} days to Everest.</strong>
                  <br />
                  The mountain doesn't care. Only the preparation matters.
                </p>
              </div>
            </motion.div>

            {/* Right: Training Image */}
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

      {/* 4. HIGHLIGHTED EVEREST COUNTDOWN */}
      <section className="py-24 bg-gradient-to-b from-black to-obsidian border-t border-summit-gold-500/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-summit-gold-500/10 border border-summit-gold-500/30 mb-4">
              <span className="text-xs font-mono text-summit-gold-400 uppercase tracking-widest">
                Mission Timeline
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl font-oswald font-bold text-white tracking-tight">
              {daysToEverest}
            </h2>

            <p className="text-2xl md:text-3xl font-light text-summit-gold-400 tracking-wide">
              Days to Everest
            </p>

            <div className="pt-6 border-t border-white/10 max-w-2xl mx-auto">
              <p className="text-gray-400 font-light leading-relaxed">
                From a broken Talus to the roof of the world. Every day of
                rehabilitation, every controlled movement, every hour of sleep
                brings us closer to standing at 29,032 feet.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
              <div className="text-center">
                <div className="text-2xl font-oswald text-white mb-1">
                  {recoveryData.daysSinceSurgery}
                </div>
                <div className="text-xs uppercase tracking-wider">
                  Days Since Surgery
                </div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-oswald text-white mb-1">4/7</div>
                <div className="text-xs uppercase tracking-wider">
                  Summits Completed
                </div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-oswald text-summit-gold-400 mb-1">
                  2028
                </div>
                <div className="text-xs uppercase tracking-wider">
                  Target Year
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
