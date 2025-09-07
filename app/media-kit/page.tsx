"use client";

import { motion } from "framer-motion";
import { 
  ArrowDownTrayIcon,
  TrophyIcon,
  CalendarIcon,
  GlobeAltIcon,
  UserIcon,
  EnvelopeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function MediaKitPage() {
  const stats = [
    { label: "Summits Conquered", value: "4/7", icon: TrophyIcon },
    { label: "Years Experience", value: "11+", icon: CalendarIcon },
    { label: "Countries Reached", value: "15+", icon: GlobeAltIcon },
    { label: "Followers", value: "1,000+", icon: UserIcon },
    { label: "Newsletter Readers", value: "200+", icon: EnvelopeIcon },
    { label: "Training Days/Year", value: "365+", icon: ChartBarIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Media Kit
              <span className="block text-2xl md:text-3xl text-summitGold font-normal mt-2">
                Sunith Kumar • Summit Chronicles
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Professional assets, statistics, and partnership information for media and sponsor use.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-summitGold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download Complete Media Kit
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Key Statistics
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-summitGold/20 rounded-2xl mb-4">
                  <stat.icon className="w-6 h-6 text-summitGold" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">About Sunith Kumar</h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  <strong className="text-summitGold">From Recovery to Summit:</strong> Sunith&apos;s mountaineering journey began in 2013 
                  during recovery from tuberculosis, transforming from a 40kg patient to a Seven Summits mountaineer.
                </p>
                <p>
                  <strong className="text-summitGold">Proven Track Record:</strong> 4 out of 7 continental summits completed 
                  with meticulous preparation, safety-first approach, and authentic documentation of each expedition.
                </p>
                <p>
                  <strong className="text-summitGold">Content Creator:</strong> Produces high-quality expedition content including 
                  photography, video, blog posts, and social media that resonates with adventure audiences worldwide.
                </p>
                <p>
                  <strong className="text-summitGold">Community Builder:</strong> Growing engaged audience of aspiring mountaineers, 
                  adventure travelers, and outdoor enthusiasts who trust gear recommendations and expedition insights.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-summitGold/20 to-yellow-400/20 rounded-3xl p-12 text-center"
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-white mb-4">Professional Photos Available</h3>
              <p className="text-white/70">High-resolution expedition photos, headshots, and branded materials ready for media use.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to Partner?
            </h2>
            
            <div className="bg-gradient-to-r from-summitGold/20 to-yellow-400/20 backdrop-blur-sm border border-summitGold/30 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Contact for Partnerships</h3>
              <p className="text-white/80 mb-6">
                Ready to discuss how your brand can be part of the Seven Summits journey?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@summitchronicles.com"
                  className="bg-summitGold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-yellow-400 transition-colors"
                >
                  📧 hello@summitchronicles.com
                </a>
                
                <a
                  href="/sponsorship"
                  className="bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors"
                >
                  View Sponsorship Packages
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}