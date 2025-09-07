"use client";

import { motion } from "framer-motion";
import { 
  TrophyIcon, 
  ChartBarIcon, 
  CameraIcon, 
  UsersIcon,
  CheckIcon,
  ArrowDownIcon,
  SparklesIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-summitGold/20 backdrop-blur-sm border border-summitGold/30 rounded-full px-4 py-2 mb-6"
          >
            <TrophyIcon className="w-5 h-5 text-summitGold" />
            <span className="text-summitGold font-semibold">OPEN FOR 2025 SPONSORSHIPS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Partner With a 
            <span className="block bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Seven Summits Mountaineer
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            Join me on the journey to conquer the world&apos;s highest peaks. 4 down, 3 to go. 
            Your brand will reach adventure-seekers worldwide through authentic expedition content.
          </motion.p>

          <motion.a
            href="#packages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 bg-summitGold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            View Partnership Packages
            <ArrowDownIcon className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "4/7", label: "Summits Conquered", icon: TrophyIcon },
              { number: "11+", label: "Years Experience", icon: ChartBarIcon },
              { number: "1000+", label: "Followers Reached", icon: UsersIcon },
              { number: "3", label: "Expeditions Planned", icon: MapPinIcon }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-summitGold/20 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-summitGold" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Partner With Me */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Why Partner With Me?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Authentic expedition content, professional delivery, and a proven track record of completing what I start.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CameraIcon,
                title: "Professional Content",
                description: "High-quality photos, videos, and stories from actual expeditions. Real content that resonates with adventure audiences."
              },
              {
                icon: TrophyIcon,
                title: "Proven Track Record", 
                description: "4 out of 7 summits completed since 2013. I finish what I start and deliver on commitments."
              },
              {
                icon: UsersIcon,
                title: "Engaged Audience",
                description: "Growing community of adventure-seekers, aspiring mountaineers, and outdoor enthusiasts who trust my recommendations."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-summitGold/20 rounded-2xl mb-6">
                  <feature.icon className="w-8 h-8 text-summitGold" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Packages */}
      <section id="packages" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Partnership Packages
            </h2>
            <p className="text-xl text-white/70">
              Choose the level that fits your brand&apos;s goals and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Summit Partner",
                price: "Contact for Pricing",
                features: [
                  "Logo on expedition gear",
                  "Social media mentions",
                  "Blog post features",
                  "Photo usage rights",
                  "Monthly progress reports"
                ],
                highlighted: false
              },
              {
                name: "Expedition Partner", 
                price: "Contact for Pricing",
                features: [
                  "Everything in Summit Partner",
                  "Video testimonials",
                  "Website banner placement",
                  "Speaking opportunities",
                  "Custom content creation",
                  "Media kit inclusion"
                ],
                highlighted: true
              },
              {
                name: "Seven Summits Partner",
                price: "Contact for Pricing", 
                features: [
                  "Everything in Expedition Partner",
                  "Naming rights consideration",
                  "Documentary participation",
                  "Book acknowledgment",
                  "Long-term ambassador program",
                  "Exclusive content access"
                ],
                highlighted: false
              }
            ].map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-3xl p-8 ${
                  pkg.highlighted 
                    ? 'border-summitGold bg-summitGold/5' 
                    : 'border-white/10'
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-summitGold text-black px-4 py-2 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-summitGold">{pkg.price}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-summitGold flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block text-center px-8 py-4 rounded-2xl font-semibold transition-colors ${
                    pkg.highlighted
                      ? 'bg-summitGold text-black hover:bg-yellow-400'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Get Started
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SparklesIcon className="w-16 h-16 text-summitGold mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Climb Together?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how your brand can be part of this incredible journey to the world&apos;s highest peaks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:hello@summitchronicles.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-summitGold text-black px-8 py-4 rounded-2xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                📧 hello@summitchronicles.com
              </motion.a>
              
              <motion.a
                href="/connect"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors"
              >
                All Contact Options
              </motion.a>
            </div>

            <div className="mt-12 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-4">Download Media Kit</h3>
              <p className="text-white/70 mb-6">
                Get professional photos, statistics, and partnership details in one convenient package.
              </p>
              <motion.a
                href="/media-kit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-glacierBlue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                📎 Download Media Kit
                <ArrowDownIcon className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}