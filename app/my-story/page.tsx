"use client";

import { motion } from "framer-motion";
import {
  MapPinIcon,
  TrophyIcon,
  CalendarIcon,
  HeartIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

export default function MyStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-8"
          >
            <HeartIcon className="w-4 h-4 text-summitGold" />
            The Person Behind the Peaks
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Sunith Kumar
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12">
            From software engineer to mountaineer, pursuing the Seven Summits 
            and sharing every step of the journey with authentic insights, 
            real training data, and lessons learned at altitude.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: TrophyIcon, label: "Peaks Climbed", value: "3/7 Summits", color: "text-summitGold" },
              { icon: CalendarIcon, label: "Years Climbing", value: "5+ Active", color: "text-successGreen" },
              { icon: MapPinIcon, label: "Next Target", value: "Denali 2025", color: "text-alpineBlue" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Story Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-16">
            {/* The Beginning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <LightBulbIcon className="w-8 h-8 text-summitGold" />
                How It All Started
              </h2>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  I never planned to become a mountaineer. Like many people, I was caught up in the 
                  daily grind of software development, spending long hours in front of screens, 
                  slowly losing touch with the natural world. But everything changed during a casual 
                  hiking trip in the Himalayas in 2019.
                </p>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Standing at 14,000 feet for the first time, watching the sunrise paint the peaks 
                  in gold, I felt something I had never experienced before. It wasn't just the beauty—it 
                  was the raw challenge, the way the mountain demanded everything from you: physical 
                  strength, mental resilience, and complete presence in the moment.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  That day, I made a decision that would change my life: I would learn to climb mountains. 
                  Not for social media or bragging rights, but to discover what I was truly capable of.
                </p>
              </div>
            </motion.div>

            {/* The Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-summitGold" />
                The Seven Summits Goal
              </h2>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  After my first successful summit of Mount Elbrus in 2022, I knew I had found my calling. 
                  The Seven Summits challenge—climbing the highest peak on each continent—became my North Star. 
                  It wasn't just about the climbs themselves, but about the person I would become along the way.
                </p>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Each mountain has taught me something different. Kilimanjaro showed me the importance of 
                  pacing and patience. Aconcagua tested my limits at high altitude and taught me respect for 
                  the mountains' power. Every expedition has been a masterclass in preparation, perseverance, 
                  and humility.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  With Everest as my ultimate goal in 2027, I'm not just training my body—I'm preparing 
                  mentally, studying weather patterns, testing gear, and building the expedition team that 
                  will help make this dream a reality.
                </p>
              </div>
            </motion.div>

            {/* Why I Share */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <HeartIcon className="w-8 h-8 text-summitGold" />
                Why I Share This Journey
              </h2>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Summit Chronicles isn't just a blog—it's my commitment to authentic storytelling in 
                  the mountaineering world. Too many climbing stories focus only on the victories, 
                  skipping over the failures, the fear, the mundane training days, and the real cost 
                  of pursuing these dreams.
                </p>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  I share everything: my training data from Strava, the gear that actually works 
                  (and the expensive mistakes), the mental struggles at altitude, and the unglamorous 
                  reality of expedition preparation. If my experiences can help one person make better 
                  decisions on their own climbing journey, then every word is worth it.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  This journey is about more than reaching summits. It's about pushing personal limits, 
                  building resilience, and proving that with enough dedication and smart preparation, 
                  extraordinary goals are achievable by ordinary people.
                </p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Follow the Journey
                </h3>
                <p className="text-lg text-white/70 mb-8">
                  Want to see what goes into preparing for Everest? Follow along as I train, 
                  test gear, and work toward the ultimate mountaineering challenge.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                  >
                    View Training Data
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Read Latest Updates
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}