"use client";

import { motion } from "framer-motion";
import { TrophyIcon, MicrophoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function SpeakingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-glacierBlue/10 backdrop-blur-sm border border-glacierBlue/30 rounded-2xl px-6 py-4 mb-8"
        >
          <MicrophoneIcon className="w-5 h-5 text-glacierBlue" />
          <span className="text-glacierBlue font-bold text-lg">KEYNOTE SPEAKER</span>
          <div className="w-px h-6 bg-glacierBlue/30" />
          <span className="text-summitGold font-medium">AVAILABLE</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
        >
          <span className="block">From Hospital Bed</span>
          <span className="block bg-gradient-to-r from-glacierBlue to-blue-400 bg-clip-text text-transparent">
            to Adventure Beyond Limits
          </span>
        </motion.h1>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Mountains, ultra marathons, exploration. Lessons in resilience and pushing boundaries 
            that transform how teams approach impossible challenges.
          </p>
        </motion.div>

        {/* Key Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Corporate Teams</h3>
            <p className="text-white/70 text-sm">
              Resilience & overcoming adversity through mountaineering lessons
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Leadership Events</h3>
            <p className="text-white/70 text-sm">
              Goal-setting strategies and risk management from 20,000 feet
            </p>
          </div>
        </motion.div>

        {/* Speaking Formats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-12 text-white/60 mb-12"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-glacierBlue">Keynotes</div>
            <div className="text-sm">30-60 mins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-glacierBlue">Workshops</div>
            <div className="text-sm">2-4 hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-glacierBlue">Virtual</div>
            <div className="text-sm">Global reach</div>
          </div>
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="mailto:hello@summitchronicles.com?subject=Speaking Engagement Inquiry"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-glacierBlue text-white font-bold text-xl px-12 py-6 rounded-2xl hover:bg-blue-600 transition-colors"
          >
            <EnvelopeIcon className="w-6 h-6" />
            Book Speaking Engagement
          </motion.a>
          
          <p className="text-white/50 text-sm mt-6">
            Available for corporate events, conferences, and workshops worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
}