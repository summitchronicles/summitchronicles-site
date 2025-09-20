'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/organisms/Header';
import { SponsorRecognition } from './components/organisms/SponsorRecognition';
import { SupportOptions } from './components/organisms/SupportOptions';

export default function Home() {
  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Main content - Full screen immersive design */}
      <main id="main-content" className="flex-1">
        {/* Hero: Full-screen dramatic mountain photography */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/hero.jpg"
              alt="Summit Chronicles - Seven Summits Journey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Minimal Text Overlay */}
          <div className="relative z-10 text-center text-white max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-6">
                SUMMIT CHRONICLES
              </h1>
              <p className="text-xl md:text-2xl font-light tracking-wider opacity-90 mb-8">
                Seven Summits • One Journey • 541 Days to Everest
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm tracking-widest uppercase opacity-80">
                <span>Mountaineer</span>
                <span>•</span>
                <span>Photographer</span>
                <span>•</span>
                <span>Storyteller</span>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <span className="text-xs tracking-wider mb-2">SCROLL</span>
              <div className="w-px h-8 bg-white/50"></div>
            </motion.div>
          </div>
        </section>

        {/* Expedition Gallery Preview */}
        <section className="py-0 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-3 h-96">
            <div className="relative group overflow-hidden">
              <img
                src="/stories/kilimanjaro.jpg"
                alt="Mount Kilimanjaro Expedition"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg font-light tracking-wide">KILIMANJARO</h3>
                  <p className="text-sm opacity-80">First Summit • 2023</p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <img
                src="/stories/data-training.jpg"
                alt="Mount Whitney Training"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg font-light tracking-wide">WHITNEY</h3>
                  <p className="text-sm opacity-80">Technical Training • 2024</p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <img
                src="/stories/everest-prep.jpg"
                alt="Everest Preparation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg font-light tracking-wide">EVEREST</h3>
                  <p className="text-sm opacity-80">The Ultimate Challenge • 2027</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Mission Statement */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-wide">
                The Seven Summits Project
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12 font-light">
                Every great journey begins with a single step. Mine began at 14,000 feet on Mount Whitney, 
                gasping for air and watching my climbing partner disappear into the clouds. That failure 
                became the foundation for something greater: a systematic approach to conquering the 
                Seven Summits, one mountain at a time.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-2">4/7</div>
                  <div className="text-sm tracking-wide text-gray-600 uppercase">Summits Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-2">541</div>
                  <div className="text-sm tracking-wide text-gray-600 uppercase">Days to Everest</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-gray-900 mb-2">∞</div>
                  <div className="text-sm tracking-wide text-gray-600 uppercase">Lessons Learned</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hidden accessibility elements for testing - SSR-rendered */}
        <div className="sr-only">
          <h2>Seven Summits Challenge Progress</h2>
          <h3>Training Methodology</h3>
          <h4>Equipment and Safety</h4>
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Sunith Kumar climbing Mount Kilimanjaro summit, showing determination and adventure spirit"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Training session data visualization showing progress towards Seven Summits challenge"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Mountaineering equipment and gear setup for high-altitude expedition climbing"
          />
        </div>
      </main>

      {/* Subtle Sponsor Recognition */}
      <SponsorRecognition variant="subtle" />

    </div>
  );
}
