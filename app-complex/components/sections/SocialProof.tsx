"use client";

import { motion } from "framer-motion";
import { 
  UsersIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  CheckBadgeIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function SocialProof() {
  const stats = [
    {
      icon: CheckBadgeIcon,
      value: "11+",
      label: "Years Experience",
      description: "From TB recovery to Seven Summits",
      color: "text-summitGold"
    },
    {
      icon: UsersIcon,
      value: "1,000+",
      label: "Followers",
      description: "Adventure seekers worldwide",
      color: "text-glacierBlue"
    },
    {
      icon: EnvelopeIcon,
      value: "200+",
      label: "Newsletter Readers", 
      description: "Weekly expedition updates",
      color: "text-successGreen"
    },
    {
      icon: GlobeAltIcon,
      value: "15+",
      label: "Countries Reached",
      description: "Global audience engagement",
      color: "text-alpineBlue"
    },
    {
      icon: HeartIcon,
      value: "4/7",
      label: "Summits Completed",
      description: "Proven track record",
      color: "text-summitGold"
    },
    {
      icon: CalendarDaysIcon,
      value: "365+",
      label: "Training Days",
      description: "Annual commitment",
      color: "text-glacierBlue"
    }
  ];

  const trustIndicators = [
    "✓ Safety-First Approach",
    "✓ Professional Partnerships Ready", 
    "✓ Authentic Content Creation",
    "✓ 11-Year Progression Timeline"
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-summitGold/5 via-transparent to-glacierBlue/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Trusted by the 
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              {" "}Adventure Community
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Building a global community of mountaineers, adventure seekers, and brands who value authentic expedition content.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                
                {/* Stats */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className={`font-semibold mb-2 ${stat.color}`}>
                    {stat.label}
                  </div>
                  <div className="text-sm text-white/60">
                    {stat.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Why Brands & Adventurers Choose Summit Chronicles
            </h3>
            <p className="text-white/70">
              Professional approach meets authentic adventure storytelling
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 text-white/90"
              >
                <div className="w-2 h-2 bg-summitGold rounded-full flex-shrink-0" />
                <span className="text-sm font-medium">{indicator}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-summitGold/20 to-yellow-400/20 backdrop-blur-sm border border-summitGold/30 rounded-3xl p-8 max-w-2xl mx-auto">
            <EnvelopeIcon className="w-12 h-12 text-summitGold mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              📧 Join 200+ Future Mountaineers
            </h3>
            <p className="text-white/80 mb-6">
              Get weekly training tips, gear reviews, and expedition updates straight from base camp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-summitGold text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                Start My Journey
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}