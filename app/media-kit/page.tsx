"use client";

import { motion } from "framer-motion";
import { TrophyIcon, ArrowDownTrayIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-summitGold/10 backdrop-blur-sm border border-summitGold/30 rounded-2xl px-6 py-4 mb-8"
        >
          <TrophyIcon className="w-5 h-5 text-summitGold" />
          <span className="text-summitGold font-bold text-lg">4/7 SUMMITS</span>
          <div className="w-px h-6 bg-summitGold/30" />
          <span className="text-glacierBlue font-medium">EVEREST 2027</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
        >
          <span className="block">Media Kit</span>
          <span className="block text-3xl md:text-4xl text-summitGold font-normal">
            Sunith Kumar • Summit Chronicles
          </span>
        </motion.h1>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-summitGold">11+</div>
            <div className="text-white/60 text-sm">Years Journey</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-summitGold">1K+</div>
            <div className="text-white/60 text-sm">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-summitGold">15+</div>
            <div className="text-white/60 text-sm">Countries</div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <p className="text-xl text-white/80 leading-relaxed">
            <span className="text-summitGold font-semibold">From Recovery to Summit:</span> Sunith's journey began in 2013 
            during recovery from tuberculosis, transforming from a 40kg patient to a Seven Summits mountaineer.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-summitGold text-black font-bold text-lg px-10 py-5 rounded-2xl hover:bg-yellow-400 transition-colors"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
            Download Media Kit
          </motion.button>
          
          <motion.a
            href="mailto:hello@summitchronicles.com?subject=Media Kit Request"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-white/10 text-white font-bold text-lg px-10 py-5 rounded-2xl hover:bg-white/20 transition-colors"
          >
            <EnvelopeIcon className="w-6 h-6" />
            Contact for Media
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-white/50 text-sm mt-6"
        >
          Professional photos, bio, and partnership information
        </motion.p>
      </div>
    </div>
  );
}