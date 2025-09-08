"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, TrophyIcon } from "@heroicons/react/24/outline";

export default function MinimalHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Subtle Mountain Backdrop */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-gray-800 to-transparent" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 bg-summitGold/10 backdrop-blur-sm border border-summitGold/30 rounded-2xl px-6 py-4 mb-8"
        >
          <TrophyIcon className="w-5 h-5 text-summitGold" />
          <span className="text-summitGold font-bold text-lg">4/7 SUMMITS</span>
          <div className="w-px h-6 bg-summitGold/30" />
          <span className="text-glacierBlue font-medium">NEXT: EVEREST 2027</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
        >
          <span className="block">Partner with</span>
          <span className="block bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
            Summit Chronicles
          </span>
        </motion.h1>

        {/* Simple Value Prop */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          From hospital bed to world's highest peaks.<br />
          <span className="text-summitGold font-semibold">Join the journey to Everest.</span>
        </motion.p>

        {/* Single Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <motion.a
            href="/sponsorship"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-summitGold text-black font-bold text-lg rounded-2xl overflow-hidden shadow-xl hover:bg-yellow-400 transition-colors"
          >
            <span className="relative z-10 flex items-center gap-3">
              Partner With Me
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        </motion.div>

        {/* Subtle Secondary Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-8"
        >
          <a
            href="/the-journey"
            className="text-white/60 hover:text-white/80 text-sm font-medium transition-colors underline underline-offset-4"
          >
            Read My Story
          </a>
        </motion.div>
      </div>
    </section>
  );
}