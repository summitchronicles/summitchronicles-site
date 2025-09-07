"use client";

import { motion } from "framer-motion";
import { 
  RocketLaunchIcon,
  MapIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  HeartIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function StartYourJourneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-successGreen/20 backdrop-blur-sm border border-successGreen/30 rounded-full px-4 py-2 mb-6"
          >
            <RocketLaunchIcon className="w-5 h-5 text-successGreen" />
            <span className="text-successGreen font-semibold">YOUR ADVENTURE STARTS HERE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Start Your 
            <span className="block bg-gradient-to-r from-successGreen to-green-400 bg-clip-text text-transparent">
              Mountain Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            From recovering TB patient to Seven Summits mountaineer. If I can do it, so can you. 
            Here&apos;s everything I wish I knew when I started in 2013.
          </motion.p>
        </div>
      </section>

      {/* My First Climb Story */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              My First Climb in 2013
            </h2>
            <p className="text-xl text-white/70">
              How a hospital bed led to Himalayan dreams
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-white/80 leading-relaxed mb-6">
                <strong className="text-summitGold">The call that changed everything:</strong> It was 2013, I was 40kg, 
                barely able to walk across a room after tuberculosis treatment. My friend Saketh called asking for 
                ₹4,000 to book a Sar Pass trek through YHAI.
              </p>
              
              <p className="text-white/80 leading-relaxed mb-6">
                Instead of just giving him my card details, I said: <em>&quot;F**k you. Even I want to join you.&quot;</em>
              </p>

              <p className="text-white/80 leading-relaxed mb-6">
                <strong className="text-successGreen">Three months of preparation:</strong> From hospital bed to hiking boots. 
                I had to rebuild my body from scratch - 40kg to 65kg, zero endurance to 5km walks.
              </p>

              <p className="text-white/80 leading-relaxed">
                <strong className="text-glacierBlue">The revelation:</strong> Standing at 13,800 feet on Sar Pass, 
                I realized the mountains weren&apos;t just healing my body - they were saving my life. That moment 
                planted the seed for what would become the Seven Summits journey.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Guide */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Your Progression Timeline
            </h2>
            <p className="text-xl text-white/70">
              You don&apos;t need to be Superman - you just need to start
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                phase: "Months 1-3",
                title: "Build Your Base",
                icon: HeartIcon,
                activities: ["Daily 30-minute walks", "Basic strength training", "Local hiking trails", "Join mountaineering groups"],
                cost: "₹5,000 - ₹10,000"
              },
              {
                phase: "Months 4-12", 
                title: "First Adventures",
                icon: MapIcon,
                activities: ["Weekend treks", "Basic climbing course", "Camping experience", "Gear investment"],
                cost: "₹25,000 - ₹50,000"
              },
              {
                phase: "Year 2-3",
                title: "Skill Development", 
                icon: AcademicCapIcon,
                activities: ["Technical climbing", "High altitude training", "Multi-day expeditions", "Safety courses"],
                cost: "₹1,00,000 - ₹2,00,000"
              },
              {
                phase: "Year 4+",
                title: "Big Mountains",
                icon: RocketLaunchIcon, 
                activities: ["6000m+ peaks", "International expeditions", "Advanced techniques", "Seven Summits prep"],
                cost: "₹3,00,000+ per expedition"
              }
            ].map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-successGreen/20 rounded-2xl mb-4">
                    <phase.icon className="w-8 h-8 text-successGreen" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
                  <p className="text-successGreen font-semibold text-sm">{phase.phase}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {phase.activities.map((activity, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-successGreen rounded-full flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-semibold">
                    {phase.cost}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Free Resources to Get Started
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Beginner Training Plan",
                description: "12-week progression from couch to first trek",
                download: "training-plan.pdf",
                icon: "📋"
              },
              {
                title: "Essential Gear Checklist", 
                description: "Start with these 10 items under ₹25,000",
                download: "gear-checklist.pdf", 
                icon: "🎒"
              },
              {
                title: "Safety Guidelines",
                description: "Risk management for beginner mountaineers",
                download: "safety-guide.pdf",
                icon: "🛡️"
              }
            ].map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{resource.title}</h3>
                <p className="text-white/70 mb-6">{resource.description}</p>
                <button className="w-full bg-successGreen text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  Download Free
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-successGreen/20 to-green-400/20 backdrop-blur-sm border border-successGreen/30 rounded-3xl p-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              🚀 Join 200+ Future Mountaineers
            </h3>
            <p className="text-white/80 mb-8 text-lg">
              Get weekly training tips, gear reviews, beginner guides, and motivation straight from base camp.
              No spam, just authentic mountaineering content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}