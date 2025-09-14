"use client";

import { motion } from "framer-motion";
import { RocketLaunchIcon, EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function StartYourJourneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-successGreen/10 backdrop-blur-sm border border-successGreen/30 rounded-2xl px-6 py-4 mb-8"
        >
          <RocketLaunchIcon className="w-5 h-5 text-successGreen" />
          <span className="text-successGreen font-bold text-lg">YOUR ADVENTURE STARTS HERE</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
        >
          <span className="block">From 40kg Patient</span>
          <span className="block bg-gradient-to-r from-successGreen to-green-400 bg-clip-text text-transparent">
            to Global Adventurer
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
            My 2013 recovery led to mountains, marathons, and exploration.<br />
            <span className="text-successGreen font-semibold">If I can do it, so can you.</span>
          </p>
        </motion.div>

        {/* Simple Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-successGreen mb-3">Start Local</h3>
            <p className="text-white/70 text-sm mb-4">
              Daily walks, basic fitness, join hiking groups
            </p>
            <div className="text-successGreen font-bold">₹5K - ₹10K</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-successGreen mb-3">Build Skills</h3>
            <p className="text-white/70 text-sm mb-4">
              Weekend treks, climbing courses, gear investment
            </p>
            <div className="text-successGreen font-bold">₹50K - ₹1L</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-successGreen mb-3">Go High</h3>
            <p className="text-white/70 text-sm mb-4">
              6000m+ peaks, international expeditions
            </p>
            <div className="text-successGreen font-bold">₹3L+ per climb</div>
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-successGreen/20 to-green-400/20 backdrop-blur-sm border border-successGreen/30 rounded-3xl p-8 mb-8"
        >
          <EnvelopeIcon className="w-12 h-12 text-successGreen mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Join 200+ Future Mountaineers
          </h3>
          <p className="text-white/80 mb-6">
            Get weekly training tips, gear reviews, and motivation straight from base camp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-successGreen"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-successGreen text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              Start My Journey
            </motion.button>
          </div>
        </motion.div>

        {/* Secondary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/training"
            className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
          >
            See My Training
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
          >
            Read My Stories
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}