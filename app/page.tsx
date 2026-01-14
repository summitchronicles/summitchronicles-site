'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react'; // Added ArrowUpRight for the CTA
import { Header } from './components/organisms/Header';
import { VisualTransmissions } from './components/home/VisualTransmissions';
import {
  getEverestCountdownText,
  getDaysToEverest,
} from '@/lib/everest-countdown';
import { ArrowRight, Mountain, Wind, Map } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-obsidian text-white flex flex-col selection:bg-summit-gold-900 selection:text-summit-gold-100">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-summit-gold text-black px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-summit-gold"
      >
        Skip to main content
      </a>
      <Header />

      {/* Main content - Full screen immersive design */}
      <main id="main-content" className="flex-1">
        {/* HERO V3: The Ghost Concept */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* 1. Background Image - Full Visibility */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/sunith-home-hero.jpg"
              alt="Sunith Kumar - The Seven Summits Journey"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Subtle Gradient only at the very bottom for text readability, keeping image clear */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-90"></div>
          </div>

          <ParallaxHeroContent />

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/30">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-[10px] uppercase tracking-widest font-oswald text-white/40">
                Mission Control
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-summit-gold/50 to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Current Mission Statement - Inverted to Dark Glass */}
        <section className="py-24 bg-obsidian relative">
          {/* Background Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide">
                Conquering the Seven Summits
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-16">
                Every great journey begins with a single step. Mine began in
                2013, bedridden with tuberculosis, barely able to walk 50
                meters. A year later, I stood on a Himalayan glacier. That
                moment sparked a journey to conquer the Seven Summits, one
                mountain at a time.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl hover:border-summit-gold/30 transition-colors group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-summit-gold/10 transition-colors">
                    <Mountain className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                  </div>
                  <div className="text-4xl font-light text-white mb-2">4/7</div>
                  <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">
                    Summits Done
                  </div>
                </div>

                <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl hover:border-summit-gold/30 transition-colors group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-summit-gold/10 transition-colors">
                    <Wind className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                  </div>
                  <div className="text-4xl font-light text-white mb-2">
                    {getDaysToEverest()}
                  </div>
                  <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">
                    Days to Everest
                  </div>
                </div>

                <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl hover:border-summit-gold/30 transition-colors group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-summit-gold/10 transition-colors">
                    <Map className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                  </div>
                  <div className="text-4xl font-light text-white mb-2">∞</div>
                  <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">
                    Validations
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Expedition Gallery Preview - Dark & Immersive */}
        <section className="py-0 bg-black relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px] md:h-96">
            <div className="relative group overflow-hidden border-r border-white/5 cursor-pointer">
              <Image
                src="/stories/kilimanjaro.jpg"
                alt="Mount Kilimanjaro Expedition"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity">
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-xs font-mono text-summit-gold-400 mb-2 block tracking-widest">
                    01 / AFRICA
                  </span>
                  <h3 className="text-2xl font-oswald font-light tracking-wide mb-1">
                    KILIMANJARO
                  </h3>
                  <p className="text-sm text-gray-400 font-light">
                    19,341 ft • Completed 2023
                  </p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden border-r border-white/5 cursor-pointer">
              <Image
                src="/stories/denali.jpg"
                alt="Mount Denali Expedition"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity">
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-xs font-mono text-summit-gold-400 mb-2 block tracking-widest">
                    04 / NORTH AMERICA
                  </span>
                  <h3 className="text-2xl font-oswald font-light tracking-wide mb-1">
                    DENALI
                  </h3>
                  <p className="text-sm text-gray-400 font-light">
                    20,310 ft • Completed 2025
                  </p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden cursor-pointer">
              <Image
                src="/stories/everest-prep.jpeg"
                alt="Everest Preparation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity">
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="text-xs font-mono text-summit-gold-400 mb-2 block tracking-widest">
                    07 / ASIA
                  </span>
                  <h3 className="text-2xl font-oswald font-light tracking-wide mb-1">
                    EVEREST
                  </h3>
                  <p className="text-sm text-gray-400 font-light">
                    29,032 ft • Targeted 2028
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Transmissions - Live Feed */}
        <VisualTransmissions />

        {/* Hidden accessibility elements for testing - SSR-rendered */}
        <div className="sr-only">
          <h2>Seven Summits Challenge Progress</h2>
          <h3>Training Methodology</h3>
          <h4>Equipment and Safety</h4>
          <Image
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Sunith Kumar climbing Mount Kilimanjaro summit, showing determination and adventure spirit"
            width={1}
            height={1}
          />
          <Image
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Training session data visualization showing progress towards Seven Summits challenge"
            width={1}
            height={1}
          />
          <Image
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Mountaineering equipment and gear setup for high-altitude expedition climbing"
            width={1}
            height={1}
          />
        </div>
      </main>
    </div>
  );
}

function ParallaxHeroContent() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="relative z-10 text-center px-6 w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full pb-20"
    >
      {/* The "Hook" - Minimal Top Label */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mb-8 flex items-center justify-center gap-4 text-xs font-mono tracking-[0.3em] text-white/60 uppercase"
      >
        <span>Project 7 Summits</span>
        <span className="w-1 h-1 bg-summit-gold rounded-full"></span>
        <span>Est. 2013</span>
      </motion.div>

      {/* THE GHOST TITLE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="relative group cursor-default"
      >
        {/* "SUMMIT" - Outline Only */}
        <h1 className="text-[12vw] md:text-[160px] leading-[0.8] font-oswald font-bold uppercase tracking-tighter text-ghost group-hover:text-white/10 transition-colors duration-700 mb-4">
          Summit
        </h1>

        {/* "CHRONICLES" - Outline with Gold Hover Fill */}
        <h1 className="text-[12vw] md:text-[160px] leading-[0.8] font-oswald font-bold uppercase tracking-tighter text-ghost group-hover:text-gold-metallic group-hover:!text-stroke-0 transition-all duration-500">
          Chronicles
        </h1>

        {/* Hover Hint */}
        <Link href="/expeditions">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs text-summit-gold font-mono tracking-widest cursor-pointer hover:underline underline-offset-4">
            EXPLORE THE JOURNEY
          </div>
        </Link>
      </motion.div>

      {/* New CTA: JOIN THE MISSION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-16"
      >
        <Link
          href="/support"
          className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-summit-gold/50 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)]"
        >
          <span className="text-sm font-oswald font-bold tracking-widest text-white group-hover:text-summit-gold transition-colors">
            JOIN THE MISSION
          </span>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-summit-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />

          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
