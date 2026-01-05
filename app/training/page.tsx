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
import { MissionLog } from '../components/training/MissionLog';
import { TrainingRoadmap } from '../components/training/TrainingRoadmap';
import { JoinTheMission } from '../components/training/JoinTheMission';

export default function TrainingPage() {
  const { metrics, loading } = useTrainingMetrics();

  // Default values if loading or no data
  const readiness = parseInt(
    metrics?.currentStats?.currentFitness?.value || '30'
  );
  const daysToEverest = getDaysToEverest();

  // Surgery date: November 10, 2025
  const surgeryDate = new Date('2025-11-10T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSurgery = Math.floor(
    (today.getTime() - surgeryDate.getTime()) / msPerDay
  );

  const recoveryData = metrics?.recoveryPhase || {
    daysToMilestone: 5,
    nextMilestone: 'Walking',
    daysSinceSurgery: daysSinceSurgery,
    metrics: { mobility: 10, painLevel: 0, ptSessions: 0 },
  };

  // Walking milestone date: January 9, 2026
  const walkingStartDate = new Date('2026-01-09T00:00:00');

  const isWalkingStarted = today >= walkingStartDate;

  // Calculate days: countdown before, count up after
  const walkingDays = isWalkingStarted
    ? Math.floor((today.getTime() - walkingStartDate.getTime()) / msPerDay)
    : Math.ceil((walkingStartDate.getTime() - today.getTime()) / msPerDay);

  const walkingCardTitle = isWalkingStarted
    ? 'Days with Protective Boot'
    : 'Days to Walking';
  const walkingCardSubtitle = isWalkingStarted
    ? 'Since Walking Start'
    : 'With Boot Support';

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
                value={`Day ${daysSinceSurgery}`}
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
                title={walkingCardTitle}
                value={walkingDays}
                subtitle={walkingCardSubtitle}
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

      {/* 3. MISSION CONTROL BOTTOM */}
      <section className="pb-24 pt-0 bg-obsidian px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Log - Left Column */}
            <div
              className="min-h-[500px] lg:min-h-[600px]"
              data-testid="mission-log-container"
            >
              <MissionLog />
            </div>

            {/* Roadmap - Right Column */}
            <div
              className="min-h-[500px] lg:min-h-[600px]"
              data-testid="roadmap-container"
            >
              <TrainingRoadmap />
            </div>
          </div>

          {/* CTA Section - Full Width */}
          <div data-testid="join-mission-container">
            <JoinTheMission />
          </div>
        </div>
      </section>
    </div>
  );
}
