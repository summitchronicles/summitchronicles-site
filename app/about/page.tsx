'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { AltimeterTimeline } from '../components/about/AltimeterTimeline';
import {
  Target,
  Camera,
  Compass,
  ArrowRight,
  Mountain,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { getDaysToEverest } from '@/lib/everest-countdown';

export default function AboutPage() {
  const daysToEverest = getDaysToEverest();

  // Surgery date: November 10, 2025
  const surgeryDate = new Date('2025-11-10T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSurgery = Math.floor(
    (today.getTime() - surgeryDate.getTime()) / msPerDay
  );

  return (
    <div className="min-h-screen bg-obsidian text-white overflow-x-hidden selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* 1. HERO: YOUR MISSION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sunith-summit-hero.png"
            alt="Sunith Kumar on a Himalayan Summit"
            fill
            className="object-cover opacity-60 grayscale scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-transparent to-obsidian" />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-display md:text-display-lg font-light tracking-tight text-white mb-6">
              FROM BROKEN TO BASE CAMP
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed mb-8">
              A journey from tuberculosis to the Seven Summits.
              <span className="text-summit-gold-400">
                {' '}
                {daysToEverest} days to Everest.
              </span>
            </p>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-sm tracking-[0.3em] text-gray-400 uppercase">
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 bg-summit-gold-500 rounded-full" />{' '}
                Mountaineer
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 bg-summit-gold-500 rounded-full" />{' '}
                Photographer
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 bg-summit-gold-500 rounded-full" />{' '}
                Storyteller
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-32 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
        >
          <span className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">
            Scroll to Begin
          </span>
          <div className="w-px h-12 md:h-16 bg-gradient-to-b from-summit-gold-500 to-transparent opacity-50"></div>
        </motion.div>
      </section>

      {/* 2. STORY: THE JOURNEY */}
      <section className="relative py-32 bg-obsidian">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-mono text-summit-gold-400 tracking-[0.3em] uppercase mb-4">
              The Story
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-white tracking-wide">
              THE ALGORITHM OF{' '}
              <span className="text-summit-gold-400">RESILIENCE</span>
            </h3>
          </motion.div>

          {/* Timeline: TB → Mountaineering → Broken Talus → Comeback */}
          <div className="space-y-24">
            {/* 2013: Tuberculosis */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-oswald text-summit-gold-400">
                    2013
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-summit-gold-500 to-transparent"></div>
                </div>
                <h4 className="text-3xl font-light text-white">
                  The Breaking Point
                </h4>
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  Bedridden with tuberculosis. The doctors said walking would be
                  a challenge. My lungs were compromised, my body weak. But in
                  that hospital bed, I made a decision:
                  <span className="text-white">
                    {' '}
                    I would not just walk—I would climb.
                  </span>
                </p>
              </div>
              <div className="relative">
                <div className="relative p-8 bg-glass-panel border border-red-500/20 rounded-2xl shadow-lg shadow-red-500/10">
                  <Heart className="w-16 h-16 text-red-400 mb-4" />
                  <div className="text-4xl font-oswald text-white mb-2">
                    Day Zero
                  </div>
                  <div className="text-gray-400">
                    From illness to inspiration
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2014-2025: Mountaineering Journey */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="relative order-2 md:order-1">
                <Image
                  src="/stories/kilimanjaro.jpg"
                  alt="Kilimanjaro Summit"
                  width={600}
                  height={800}
                  className="w-full h-auto relative z-0 rounded-2xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="space-y-6 order-1 md:order-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-oswald text-summit-gold-400">
                    2014-2025
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-summit-gold-500 to-transparent"></div>
                </div>
                <h4 className="text-3xl font-light text-white">
                  The Ascent Begins
                </h4>
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  One year after TB, I stood on a Himalayan glacier. That
                  delta—between "impossible" and "done"—became my home.
                  Kilimanjaro. Elbrus. Aconcagua. Denali.{' '}
                  <span className="text-summit-gold-400">
                    Four of the Seven Summits conquered.
                  </span>
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <Mountain className="w-5 h-5" />
                  <span>4/7 Seven Summits Completed</span>
                </div>
              </div>
            </motion.div>

            {/* November 2025: Broken Talus */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-oswald text-summit-gold-400">
                    Nov 2025
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-summit-gold-500 to-transparent"></div>
                </div>
                <h4 className="text-3xl font-light text-white">The Setback</h4>
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  Broken Talus. Surgery. The mountain doesn't care about your
                  plans. But setbacks are just data points.{' '}
                  <span className="text-white">
                    Every injury is a lesson. Every recovery is training.
                  </span>
                </p>
              </div>
              <div className="relative">
                <div className="relative p-8 bg-glass-panel border border-orange-500/20 rounded-2xl shadow-lg shadow-orange-500/10">
                  <TrendingUp className="w-16 h-16 text-orange-400 mb-4" />
                  <div className="text-4xl font-oswald text-white mb-2">
                    Day {daysSinceSurgery}
                  </div>
                  <div className="text-gray-400">Recovery in progress</div>
                </div>
              </div>
            </motion.div>

            {/* 2026-2028: The Comeback */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-12 bg-gradient-to-br from-summit-gold-900/20 to-black border border-summit-gold-500/30 rounded-2xl"
            >
              <div className="text-6xl font-oswald text-summit-gold-400 mb-6">
                2026-2028
              </div>
              <h4 className="text-4xl font-light text-white mb-6">
                The Comeback
              </h4>
              <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                From broken Talus to the roof of the world.{' '}
                <span className="text-summit-gold-400">
                  {daysToEverest} days
                </span>{' '}
                of rehabilitation, training, and preparation. The algorithm is
                simple:
                <span className="text-white">
                  {' '}
                  measure everything, optimize relentlessly, never quit.
                </span>
              </p>
              <div className="mt-8 text-sm text-gray-500 uppercase tracking-widest">
                Target: Everest Base Camp → Summit → 2028
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. EXPEDITIONS: 7 SUMMITS TIMELINE */}
      <section className="py-20 bg-charcoal-mist border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center mb-20">
          <h2 className="text-sm font-mono text-summit-gold-400 tracking-[0.3em] uppercase mb-4">
            Expedition Log
          </h2>
          <h3 className="text-4xl md:text-5xl font-light text-white tracking-wide">
            THE VERTICAL JOURNEY
          </h3>
        </div>

        <div className="max-w-6xl mx-auto">
          <AltimeterTimeline />
        </div>
      </section>

      {/* 4. PHILOSOPHY: DATA-DRIVEN APPROACH */}
      <section className="py-32 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-summit-gold-400 tracking-[0.3em] uppercase mb-4">
              The Code
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-white tracking-wide">
              HOW WE <span className="text-summit-gold-400">CLIMB</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'PRECISION',
                text: 'Success at altitude is a math problem. Weight, calories, watts, oxygen. We solve for X.',
              },
              {
                icon: Camera,
                title: 'WITNESS',
                text: 'Capturing the raw, unfiltered reality of the death zone to inspire the next generation.',
              },
              {
                icon: Compass,
                title: 'COMMUNITY',
                text: "It takes a village to reach a summit. We climb together, or we don't climb at all.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-glass-panel border border-white/5 hover:border-summit-gold/30 rounded-2xl transition-all duration-500 hover:bg-white/5"
              >
                <item.icon className="w-12 h-12 text-gray-500 group-hover:text-summit-gold-400 mb-8 transition-colors duration-500" />
                <h3 className="text-2xl font-light text-white mb-4 tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA: LINKS TO TRAINING/STORIES/NEWSLETTER */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stories/denali.jpg')] bg-cover bg-center opacity-20 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tighter">
            JOIN THE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-summit-gold-300 to-summit-gold-600">
              MISSION
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
            The countdown to Everest is running. Follow the journey from
            recovery to the roof of the world.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 w-full max-w-4xl mx-auto">
            <a
              href="/training"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-summit-gold-500 text-black font-medium tracking-widest hover:bg-summit-gold-400 transition-colors text-center"
            >
              VIEW TRAINING DATA{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/stories"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium tracking-widest hover:border-summit-gold hover:text-summit-gold transition-colors text-center"
            >
              READ EXPEDITION STORIES
            </a>
            <a
              href="/newsletter"
              className="flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium tracking-widest hover:border-summit-gold hover:text-summit-gold transition-colors text-center"
            >
              SUBSCRIBE TO UPDATES
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
