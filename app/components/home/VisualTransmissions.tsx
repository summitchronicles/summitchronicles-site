'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Activity,
  Heart,
  Zap,
  Play,
  ArrowUpRight,
  Instagram,
} from 'lucide-react';
import { useTrainingMetrics } from '@/lib/hooks/useTrainingMetrics';
import { useInstagramFeed } from '@/lib/hooks/useInstagramFeed';
import { cn } from '@/lib/utils';
import { Button } from '../atoms/Button';

export const VisualTransmissions = () => {
  const { posts, loading: instaLoading } = useInstagramFeed();
  const { metrics, loading: metricsLoading } = useTrainingMetrics();

  // Parse Garmin Data (or fallback)
  // Note: metrics comes from useTrainingMetrics. Since we just added bodyBattery to the API
  // but maybe not the TS interface yet, we cast to any or check safely.
  const apiMetrics = metrics as any;

  // DEBUG: Log what we're receiving
  console.log('VisualTransmissions - apiMetrics:', apiMetrics);
  console.log(
    'VisualTransmissions - bodyBattery value:',
    apiMetrics?.bodyBattery
  );

  const displayData = {
    // The API now returns bodyBattery and stressScore at the root level of metrics
    bodyBattery: apiMetrics?.bodyBattery || 53, // Handle 0/null/undefined
    stressScore: apiMetrics?.stressScore || 24, // Handle 0/null/undefined
    trainingStatus:
      metrics?.trainingPhases?.find((p) => p.status === 'current')?.focus ||
      'Recovery',
    hrvStatus: apiMetrics?.hrvStatus || 'Balanced', // Default/Fallback
  };

  // DEBUG: Log final display values
  console.log('VisualTransmissions - displayData:', displayData);
  // For 'trainingStatus', we already tried to grab the focus.

  // Real Injury Logic (From Training Page)
  // Surgery date: November 10, 2025
  const surgeryDate = new Date('2025-11-10T00:00:00');
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSurgery = Math.floor(
    (today.getTime() - surgeryDate.getTime()) / msPerDay
  );

  if (instaLoading) return null;

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div>
            <span className="block text-gold-metallic text-xs tracking-[0.3em] font-mono mb-2">
              LIVE TELEMETRY ///
            </span>
            <h2 className="text-4xl md:text-6xl font-oswald font-bold text-white uppercase tracking-tight leading-none">
              Mission <span className="text-outline-2">Control</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-summit-gold rounded-full animate-pulse"></div>
              <span>GARMIN: CONNECTED</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Activity className="w-3 h-3" />
              <span>HRV: {displayData.hrvStatus}</span>
            </div>
          </div>
        </div>

        {/* BENTO GRID (CSS Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)] group/grid">
          {/* 1. THE MANIFESTO (2x2) - Narrative Hook */}
          <Link
            href="/about"
            className="md:col-span-2 md:row-span-2 group relative group-hover/grid:opacity-50 hover:!opacity-100 transition-opacity duration-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-full bg-premium-glass p-8 md:p-12 rounded-sm border-t border-white/10 relative overflow-hidden flex flex-col justify-between transition-colors hover:bg-white/5"
            >
              {/* Background Texture */}
              <div className="absolute inset-0 opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[100px] leading-none font-oswald font-bold text-white/5">
                  07
                </span>
              </div>

              <div>
                <span className="text-summit-gold text-xs font-mono tracking-widest uppercase mb-4 block">
                  The Origin
                </span>
                <h3 className="text-4xl md:text-6xl font-oswald text-white mb-6 leading-[0.9]">
                  FROM{' '}
                  <span className="text-gray-600 line-through decoration-red-500 decoration-2">
                    BEDRIDDEN
                  </span>
                  <br />
                  TO THE <span className="text-white">DEATH ZONE</span>.
                </h3>
              </div>

              <div className="space-y-6 max-w-lg relative z-10">
                <p className="text-lg text-gray-300 font-light leading-relaxed">
                  In 2013, I was fighting tuberculosis, struggling to walk 50
                  meters. By 2028, I will stand on top of the world. This isn't
                  just a climb; it's a testament to human resilience.
                </p>
                <div className="text-xs tracking-widest uppercase text-summit-gold group-hover:underline decoration-summit-gold underline-offset-4">
                  Read The Full Manifesto
                </div>
              </div>
            </motion.div>
          </Link>

          {/* 2. BODY BATTERY (Garmin) */}
          <Link
            href="/training"
            className="group relative group-hover/grid:opacity-50 hover:!opacity-100 transition-opacity duration-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="h-full bg-black border border-white/10 p-8 rounded-sm relative flex flex-col items-center justify-center group-hover:border-blue-500/50 transition-colors"
            >
              <div className="absolute top-4 left-4 text-xs font-mono text-gray-500">
                BODY BATTERY
              </div>
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Circular Chart Placeholder */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#1f2937"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="377"
                    strokeDashoffset={
                      377 - (377 * displayData.bodyBattery) / 100
                    }
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-500 mb-1" />
                  <span className="text-3xl font-oswald text-white">
                    {displayData.bodyBattery}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-blue-400 font-mono text-center">
                {displayData.bodyBattery > 80
                  ? 'HIGH ENERGY / READY'
                  : 'RECOVERY REQUIRED'}
              </p>
            </motion.div>
          </Link>

          {/* 3. PHYSICAL STATUS (Injury) */}
          <Link
            href="/training"
            className="group relative group-hover/grid:opacity-50 hover:!opacity-100 transition-opacity duration-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="h-full bg-zinc-900/50 border border-white/10 p-8 rounded-sm relative group-hover:border-red-500/50 transition-colors"
            >
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-red-500 tracking-wider">
                  INJURY REPORT
                </span>
              </div>

              <div className="mt-8">
                <h4 className="text-4xl font-oswald text-white mb-1">
                  Day {daysSinceSurgery}
                </h4>
                <p className="text-sm text-gray-400 font-mono mb-6">
                  Of Recovery Protocol
                </p>

                <div className="w-full bg-gray-800 h-10 rounded-sm relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">
                    REHAB IN PROGRESS
                  </div>
                  <div className="h-full bg-red-900/50 w-[65%] border-r border-red-500"></div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* 4. TRAINING STATUS */}
          <Link
            href="/training"
            className="group relative group-hover/grid:opacity-50 hover:!opacity-100 transition-opacity duration-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-full bg-gradient-to-br from-green-900/20 to-black border border-white/10 p-8 rounded-sm relative group-hover:border-green-500/50 transition-colors"
            >
              <div className="absolute top-4 right-4">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-xs font-mono text-gray-500 mb-8">
                TRAINING LOAD
              </div>
              <h4 className="text-4xl font-oswald text-white mb-2">
                REHABILITATION
              </h4>
              <p className="text-xs text-green-400 font-mono uppercase tracking-widest">
                VO2 Max:{' '}
                <span className="text-white">
                  {apiMetrics?.advancedPerformance?.vo2Max?.value || 'N/A'}
                </span>
              </p>
            </motion.div>
          </Link>

          {/* 5. LATEST VISUAL (Instagram) - Large */}
          {posts[0] && (
            <Link
              href={posts[0].permalink}
              target="_blank"
              className="md:col-span-1 lg:col-span-1 min-h-[300px] relative group overflow-hidden rounded-sm border border-white/10 group-hover/grid:opacity-50 hover:!opacity-100 transition-opacity duration-500"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="h-full relative"
              >
                {posts[0].media_type === 'VIDEO' ||
                posts[0].media_type === 'REEL' ? (
                  <video
                    src={posts[0].media_url}
                    poster={posts[0].thumbnail_url || posts[0].media_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <Image
                    src={posts[0].media_url}
                    alt={posts[0].caption || 'Training Visual'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 group-hover:via-transparent transition-all duration-500"></div>

                {/* Top Label & Icon */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-summit-gold rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-white/80 uppercase backdrop-blur-md bg-black/30 px-2 py-1 rounded">
                      Visual Log
                    </span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-md group-hover:bg-[#E1306C] transition-colors duration-300">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Bottom Content & CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {/* Caption */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-300 line-clamp-2 font-mono leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {posts[0].caption}
                    </p>
                  </div>

                  {/* CTA Button (Appears on Hover) */}
                  <div className="flex items-center gap-2 text-[#E1306C] font-oswald text-sm uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span>View on Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* 6. EXPEDITION LINK */}
          <Link
            href="/expeditions"
            className="group relative group-hover/grid:opacity-50 hover:!opacity-100 transition-opacity duration-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="h-full bg-summit-gold text-black p-8 rounded-sm flex flex-col justify-between hover:bg-white transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold font-mono text-xs tracking-widest">
                  CHAPTERS
                </span>
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <h3 className="text-3xl font-oswald font-bold leading-tight">
                THE JOURNEY
                <br />
                SO FAR
              </h3>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};
