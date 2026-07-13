'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Mountain, Wind, Map } from 'lucide-react';
import { PublicLayout } from './components/layout/PublicLayout';
import { VisualTransmissions } from './components/home/VisualTransmissions';
import { LatestChronicles } from './components/home/LatestChronicles';
import { getDaysToEverest } from '@/lib/everest-countdown';

export default function Home() {
  return (
    <PublicLayout>
      <div className="min-h-screen overflow-x-hidden bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
        {/* Hero: visible brand promise over the expedition image */}
        <section className="relative flex min-h-[82svh] items-end overflow-hidden sm:min-h-[84svh]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/30 to-transparent"></div>
          </div>

          <ParallaxHeroContent />

          {/* Scroll Indicator */}
          <div className="absolute bottom-5 right-6 hidden text-white/30 md:block">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-[10px] uppercase font-oswald text-white/40">
                Scroll
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-summit-gold/50 to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Current chapter */}
        <section className="relative bg-obsidian pt-14 pb-24 sm:pt-16">
          {/* Background Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-xs font-mono uppercase text-summit-gold">
                Current chapter
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-8">
                Recovery, rebuilding, and the road to Everest
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-16">
                The objective remains unchanged. The work now is quieter:
                physiotherapy, gait rebuild, strength, and a deliberate return
                to mountain training before the next expedition chapter.
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
                  <div className="text-4xl font-light text-white mb-2">
                    2028
                  </div>
                  <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">
                    Everest Target
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <LatestChronicles />

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
      </div>
    </PublicLayout>
  );
}

function ParallaxHeroContent() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12"
    >
      <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-mono text-white/80 uppercase">
        <span>Project 7 Summits</span>
        <span className="w-1 h-1 bg-summit-gold rounded-full"></span>
        <span>Est. 2013</span>
      </div>

      <div className="w-full max-w-4xl">
        <h1 className="font-oswald text-[72px] font-bold uppercase leading-[0.86] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="block">Summit</span>
          <span className="block">Chronicles</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-white/86 drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)] sm:text-lg md:max-w-2xl md:text-xl">
          Follow Sunith Kumar&apos;s Seven Summits journey from recovery to
          high-altitude expedition, with Everest as the next defining climb.
        </p>

        <div className="mt-6 grid w-full max-w-xl grid-cols-3 gap-4 text-white sm:gap-6">
          <div>
            <div className="text-2xl font-oswald font-bold sm:text-3xl">
              4/7
            </div>
            <div className="text-xs uppercase text-white/65">Summits done</div>
          </div>
          <div>
            <div className="text-2xl font-oswald font-bold sm:text-3xl">
              {getDaysToEverest()}
            </div>
            <div className="text-xs uppercase text-white/65">
              Days to Everest
            </div>
          </div>
          <div>
            <div className="text-2xl font-oswald font-bold sm:text-3xl">
              2013
            </div>
            <div className="text-xs uppercase text-white/65">
              Journey started
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/expeditions"
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-summit-gold px-5 py-3 text-sm font-oswald font-bold uppercase text-obsidian shadow-[0_18px_45px_-22px_rgba(212,175,55,0.8)] transition-colors hover:bg-summit-gold-300 focus:outline-none focus:ring-2 focus:ring-summit-gold focus:ring-offset-2 focus:ring-offset-obsidian sm:w-auto"
        >
          Explore the Journey
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/blog"
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-white/25 bg-black/20 px-5 py-3 text-sm font-oswald font-bold uppercase text-white backdrop-blur-sm transition-colors hover:border-summit-gold hover:text-summit-gold focus:outline-none focus:ring-2 focus:ring-summit-gold focus:ring-offset-2 focus:ring-offset-obsidian sm:w-auto"
        >
          Read the Latest
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
