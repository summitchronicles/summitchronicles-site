'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { RecoveryHUD } from '../components/about/RecoveryHUD';
import { AltimeterTimeline } from '../components/about/AltimeterTimeline';
import { Target, Camera, Compass, Mountain, ArrowRight } from 'lucide-react';
import { getDaysToEverest } from '@/lib/everest-countdown';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-obsidian text-white overflow-x-hidden selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* 1. CINEMATIC HERO: "THE ASCENT" */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image
                src="/images/sunith-summit-hero.png"
                alt="Sunith Kumar on a Himalayan Summit"
                fill
                className="object-cover opacity-60 grayscale scale-110"
                priority
            />
            {/* Dark Gradient Overlay for text readability */}
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
                    THE ASCENT
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed">
                    From the depths of illness to the roof of the world.
                    <span className="text-summit-gold-400"> Seven Summits. One Soul.</span>
                </p>
                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-sm tracking-[0.3em] text-gray-400 uppercase">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-summit-gold-500 rounded-full"/> Mountaineer</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-summit-gold-500 rounded-full"/> Photographer</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-summit-gold-500 rounded-full"/> Storyteller</span>
                </div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
            <span className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">Initiate Climb</span>
            <div className="w-px h-16 bg-gradient-to-b from-summit-gold-500 to-transparent opacity-50"></div>
        </motion.div>
      </section>

      {/* 2. RECOVERY HUD: "SYSTEM STATUS" */}
      <section className="relative py-32 bg-obsidian">
          <div className="max-w-6xl mx-auto px-6">
             <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
             >
                 <RecoveryHUD />
             </motion.div>

             <div className="mt-24 grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                     <h2 className="text-4xl font-light text-white tracking-wide">
                        THE ALGORITHM OF <span className="text-summit-gold-400">RESILIENCE</span>
                     </h2>
                     <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
                        <p>
                            In 2013, I was bedridden with tuberculosis. The doctors said walking would be a challenge.
                            In 2014, I stood on a Himalayan glacier. That delta—between "impossible" and "done"—is where I now live.
                        </p>
                        <p>
                            We don't conquer mountains; we conquer ourselves. Through data-driven training,
                            relentless preparation, and an unwavering commitment to the sufferfest, we ascend.
                        </p>
                     </div>
                 </div>
                 <div className="relative">
                    <div className="absolute inset-0 bg-summit-gold-500/10 blur-3xl rounded-full"></div>
                    <Image
                        src="/stories/everest-prep.jpeg"
                        alt="Training in the Pain Cave"
                        width={600}
                        height={800}
                        className="relative rounded-2xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                    />
                 </div>
             </div>
          </div>
      </section>

      {/* 3. ALTIMETER TIMELINE: "THE CLIMB" */}
      <section className="py-20 bg-charcoal-mist border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center mb-20">
            <h2 className="text-sm font-mono text-summit-gold-400 tracking-[0.3em] uppercase mb-4">Expedition Log</h2>
            <h3 className="text-4xl md:text-5xl font-light text-white tracking-wide">THE VERTICAL JOURNEY</h3>
        </div>

        <div className="max-w-6xl mx-auto">
            <AltimeterTimeline />
        </div>
      </section>

      {/* 4. PHILOSOPHY: "THE CODE" (Interactive Cards) */}
      <section className="py-32 bg-obsidian">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-6">
                  {[
                      {
                          icon: Target,
                          title: "PRECISION",
                          text: "Success at altitude is a math problem. Weight, calories, watts, oxygen. We solve for X."
                      },
                      {
                          icon: Camera,
                          title: "WITNESS",
                          text: "Capturing the raw, unfiltered reality of the death zone to inspire the next generation."
                      },
                      {
                          icon: Compass,
                          title: "COMMUNITY",
                          text: "It takes a village to reach a summit. We climb together, or we don't climb at all."
                      }
                  ].map((item, i) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-10 bg-glass-panel border border-white/5 hover:border-summit-gold/30 rounded-2xl transition-all duration-500 hover:bg-white/5"
                      >
                          <item.icon className="w-12 h-12 text-gray-500 group-hover:text-summit-gold-400 mb-8 transition-colors duration-500" />
                          <h3 className="text-2xl font-light text-white mb-4 tracking-wider group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                          <p className="text-gray-400 leading-relaxed font-light">
                              {item.text}
                          </p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/stories/denali.jpg')] bg-cover bg-center opacity-20 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tighter">
                  JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-summit-gold-300 to-summit-gold-600">MISSION</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
                  The countdown to Everest is running. Be part of the team that puts the flag on the summit.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a href="/expeditions" className="group flex items-center gap-2 px-8 py-4 bg-white text-black font-medium tracking-widest hover:bg-gray-200 transition-colors">
                      VIEW EXPEDITIONS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/support" className="px-8 py-4 border border-white/20 text-white font-medium tracking-widest hover:border-summit-gold hover:text-summit-gold transition-colors">
                      SUPPORT THE CLIMB
                  </a>
              </div>
          </div>
      </section>
    </div>
  );
}
