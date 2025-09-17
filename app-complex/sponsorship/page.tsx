'use client';

import { motion } from 'framer-motion';
import { TrophyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function SponsorshipPage() {
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
          <span className="text-summitGold font-bold text-lg">
            🎯 OPEN FOR 2025 SPONSORSHIPS
          </span>
          <div className="w-px h-6 bg-summitGold/30" />
          <span className="text-glacierBlue font-medium">
            KOSCIUSZKO → EVEREST
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
        >
          <span className="block">Partner with a</span>
          <span className="block bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
            Proven Adventurer
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
            From TB recovery to 4 continental summits.
            <br />
            <span className="text-summitGold font-semibold">
              Authentic adventure marketing with real impact.
            </span>
          </p>

          <div className="flex justify-center gap-8 md:gap-12 text-white/60">
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">4/7</div>
              <div className="text-sm">Summits Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">11</div>
              <div className="text-sm">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">4</div>
              <div className="text-sm">Continents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">Ultra</div>
              <div className="text-sm">Marathons</div>
            </div>
          </div>
        </motion.div>

        {/* Partnership Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-glacierBlue mb-3">
              Bronze Partnership
            </h3>
            <div className="text-lg text-white/80 mb-4">Expedition Support</div>
            <ul className="text-white/70 text-left space-y-2 text-sm">
              <li>• Logo on expedition gear</li>
              <li>• Social media mentions</li>
              <li>• Trip documentation</li>
              <li>• Thank you posts</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border-2 border-summitGold/50 rounded-3xl p-6 scale-105">
            <h3 className="text-xl font-bold text-summitGold mb-3">
              Gold Partnership
            </h3>
            <div className="text-lg text-white/80 mb-4">Brand Integration</div>
            <ul className="text-white/70 text-left space-y-2 text-sm">
              <li>• Co-branded content series</li>
              <li>• Product placement & testing</li>
              <li>• Speaking engagements</li>
              <li>• Custom campaign development</li>
              <li>• Media kit & press coverage</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">
              Custom Projects
            </h3>
            <div className="text-lg text-white/80 mb-4">Tailored Solutions</div>
            <ul className="text-white/70 text-left space-y-2 text-sm">
              <li>• Corporate team building</li>
              <li>• Event partnerships</li>
              <li>• Workshop facilitation</li>
              <li>• Long-term ambassadorships</li>
            </ul>
          </div>
        </motion.div>

        {/* Media Kit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-summitGold/10 to-yellow-400/10 backdrop-blur-sm border border-summitGold/30 rounded-3xl p-8 mb-12 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            📄 Media Kit Available
          </h3>
          <p className="text-white/80 mb-6">
            Professional press kit with high-resolution photos, expedition
            stats, audience demographics, and partnership case studies.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-summitGold">4</div>
              <div className="text-sm text-white/70">Summits</div>
            </div>
            <div>
              <div className="text-lg font-bold text-summitGold">11</div>
              <div className="text-sm text-white/70">Years</div>
            </div>
            <div>
              <div className="text-lg font-bold text-summitGold">
                TB→Everest
              </div>
              <div className="text-sm text-white/70">Story</div>
            </div>
            <div>
              <div className="text-lg font-bold text-summitGold">Global</div>
              <div className="text-sm text-white/70">Reach</div>
            </div>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="mailto:hello@summitchronicles.com?subject=Partnership Discussion - Media Kit Request"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-summitGold text-black font-bold text-lg px-10 py-4 rounded-2xl hover:bg-yellow-400 transition-colors"
          >
            Request Media Kit
            <ArrowRightIcon className="w-5 h-5" />
          </motion.a>

          <motion.a
            href="mailto:hello@summitchronicles.com?subject=Let's Collaborate - Partnership Discussion"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-colors"
          >
            Discuss Partnership
            <ArrowRightIcon className="w-5 h-5" />
          </motion.a>
        </motion.div>

        <p className="text-white/50 text-sm mt-8 max-w-2xl mx-auto">
          Every partnership is unique. Whether you're interested in expedition
          sponsorship, content collaboration, or speaking engagements, let's
          discuss what works for your brand.
        </p>
      </div>
    </div>
  );
}
