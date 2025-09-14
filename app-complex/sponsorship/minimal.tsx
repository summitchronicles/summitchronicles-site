"use client";

import { motion } from "framer-motion";
import { TrophyIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function MinimalSponsorshipPage() {
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
          <span className="block">Partner with </span>
          <span className="block bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
            Everest 2027
          </span>
        </motion.h1>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl text-white/80 mb-6">
            From hospital bed to world's highest peak.<br />
            <span className="text-summitGold font-semibold">Your brand on the journey to Everest.</span>
          </p>
          
          <div className="flex justify-center gap-12 text-white/60">
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">1M+</div>
              <div className="text-sm">Global Reach</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">11</div>
              <div className="text-sm">Years Journey</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">$50K</div>
              <div className="text-sm">Expedition Cost</div>
            </div>
          </div>
        </motion.div>

        {/* Simple Partnership Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Title Sponsor</h3>
            <div className="text-4xl font-bold text-summitGold mb-4">$25K</div>
            <ul className="text-white/80 text-left space-y-2">
              <li>• Logo on all expedition content</li>
              <li>• Live updates from base camp</li>
              <li>• Documentary film feature</li>
            </ul>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Gear Partner</h3>
            <div className="text-4xl font-bold text-glacierBlue mb-4">$10K</div>
            <ul className="text-white/80 text-left space-y-2">
              <li>• Product placement content</li>
              <li>• Gear reviews & testimonials</li>
              <li>• Social media features</li>
            </ul>
          </div>
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="mailto:hello@summitchronicles.com?subject=Everest 2027 Partnership Inquiry"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-summitGold text-black font-bold text-xl px-12 py-6 rounded-2xl hover:bg-yellow-400 transition-colors"
          >
            Partner With Me
            <ArrowRightIcon className="w-6 h-6" />
          </motion.a>
          
          <p className="text-white/50 text-sm mt-6">
            Response within 24 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
}