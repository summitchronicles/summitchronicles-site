'use client';

import React from 'react';
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
    metrics: { mobility: 0, painLevel: 0, ptSessions: 0 },
  };

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* 1. HERO DASHBOARD */}
      <TrainingHero readinessScore={readiness} />

      {/* 2. MISSION CONTROL (BENTO GRID) */}
      <section className="px-4md:px-6 -mt-20 relative z-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <BentoGrid>
            {/* A. RECOVERY TIMELINE (Wide) */}
            <BentoItem span="full" className="md:col-span-4">
              <MetricCard
                title="Current Protocol: Rehabilitation"
                value="Active"
                subtitle={`Surgery +8 Weeks • Target: ${recoveryData.nextMilestone}`}
                variant="glass"
                className="h-full bg-black/60 backdrop-blur-xl border-summit-gold/20"
              >
                <RecoveryTimeline />
              </MetricCard>
            </BentoItem>

            {/* B. SUMMIT PROGRESS */}
            <BentoItem span="2">
              <MetricCard
                title="Project 7/7"
                value="4 Completed"
                subtitle="Next: Vinson Massif"
                variant="default"
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
              />
            </BentoItem>

            <BentoItem span="1">
              <MetricCard
                title="Days to Walking"
                value={recoveryData.daysToMilestone}
                subtitle="Boot-free Target"
                icon={Calendar}
                variant="highlight"
              />
            </BentoItem>

            {/* D. COUNTDOWN TILE */}
            <BentoItem span="1" rowSpan="2">
              <MetricCard
                title="Mission Everest"
                value={daysToEverest}
                subtitle="Days Remaining"
                className="h-full flex flex-col justify-between bg-gradient-to-b from-gray-900 to-black border-gray-800"
              >
                <Mountain className="w-full h-32 text-gray-800 mt-4 opacity-50" />
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
              />
            </BentoItem>

            <BentoItem span="1">
              <MetricCard
                title="Resting HR"
                value="54 BPM"
                subtitle="Recovery Indicator"
                icon={Heart}
                trend="down"
                trendValue="Improving"
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
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
                Talus took my footing. The mountain doesn't care about setbacks.
                It only respects preparation.
              </p>
              <p>
                Current Phase:{' '}
                <strong className="text-white">Radical Rehabilitation.</strong>
                Every PT session, every hour of sleep, every controlled movement
                is a step towards the Khumbu Icefall.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
