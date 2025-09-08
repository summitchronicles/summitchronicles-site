"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, TrophyIcon } from "@heroicons/react/24/outline";

export default function MinimalHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&h=1500&fit=crop&crop=center&auto=format&q=80" 
          alt="Sunith Kumar mountaineering expedition"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
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
          <span className="text-summitGold font-bold text-lg">MULTI-DISCIPLINE ADVENTURER</span>
          <div className="w-px h-6 bg-summitGold/30" />
          <span className="text-glacierBlue font-medium">KOSCIUSZKO 2025</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
        >
          <span className="block">Sunith Kumar</span>
          <span className="block text-3xl md:text-4xl text-summitGold font-normal">
            Adventurer & Explorer
          </span>
        </motion.h1>

        {/* Credibility Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Mountains, ultra marathons, unexplored places.<br />
          <span className="text-summitGold">11 years of pushing boundaries.</span>
        </motion.p>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-12 text-white/70 mb-12"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-summitGold">4/7</div>
            <div className="text-sm">Summits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-summitGold">Ultra</div>
            <div className="text-sm">Marathons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-summitGold">4</div>
            <div className="text-sm">Continents</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/the-journey"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-summitGold text-black font-bold text-lg rounded-2xl hover:bg-yellow-400 transition-colors"
          >
            <span className="relative z-10 flex items-center gap-3">
              View Journey
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>

          <motion.a
            href="/sponsorship"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-colors"
          >
            Partnership Opportunities
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}