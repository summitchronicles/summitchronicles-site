'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import {
  Mountain,
  Mail,
  Calendar,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { getDaysToEverest, getEverestCountdownText } from '@/lib/everest-countdown';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would integrate with your newsletter service
      setIsSubmitted(true);
    }
  };

  const benefits = [
    {
      icon: Mountain,
      title: 'Expedition Updates',
      description: 'Real training progress, preparation milestones, and expedition planning insights.'
    },
    {
      icon: Target,
      title: 'Training Insights',
      description: 'Behind-the-scenes look at systematic preparation for the world\'s highest peak.'
    },
    {
      icon: Calendar,
      title: 'Timeline Updates',
      description: 'Stay informed about key dates, training phases, and expedition timeline.'
    }
  ];

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stories/data-training.jpg"
            alt="Summit Chronicles Newsletter"
            fill
            className="object-cover opacity-50 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-obsidian"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-block px-3 py-1 mb-6 text-xs font-mono text-summit-gold-400 border border-summit-gold-900/50 rounded-full bg-summit-gold-900/10 backdrop-blur-md uppercase tracking-widest">
              Secure Communications
            </div>
            <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-8">
              SUMMIT UPLINK
            </h1>
            <p className="text-xl font-mono tracking-wider text-gray-400">
              MISSION STATUS • {getEverestCountdownText()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-obsidian relative">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white">
              THE JOURNEY TO EVEREST
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto"></div>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              From bedridden with tuberculosis in 2013 to preparing for Everest in 2027.
              This is the story of systematic preparation, failure, learning, and the pursuit
              of something bigger than ourselves.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
                <div className="text-5xl font-light text-white mb-2">4/7</div>
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500">Summits Secured</div>
              </div>
              <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
                <div className="text-5xl font-light text-summit-gold-400 mb-2">{getDaysToEverest()}</div>
                <div className="text-xs font-mono uppercase tracking-widest text-summit-gold-900/80">Mission Countdown</div>
              </div>
              <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
                <div className="text-5xl font-light text-white mb-2">11</div>
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500">Years Active</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-24 bg-black border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              INTELLIGENCE BRIEFING
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-obsidian border border-white/5 p-8 group hover:border-summit-gold/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-summit-gold/10 transition-colors">
                    <IconComponent className="w-6 h-6 text-gray-400 group-hover:text-summit-gold transition-colors" />
                  </div>
                  <h3 className="text-xl font-light tracking-wide text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-obsidian relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">
              JOIN THE EXPEDITION
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto opacity-50"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-glass-panel border border-white/10 p-10 backdrop-blur-xl relative"
          >
             {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-summit-gold/50"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-summit-gold/50"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-summit-gold/50"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-summit-gold/50"></div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center space-y-4">
                  <p className="text-gray-300 leading-relaxed font-light">
                    Get updates on the preparation for Everest 2027. Real training data,
                    honest reflections on the highs and lows, and insights from the journey
                    to the world's highest peak.
                  </p>

                  <div className="flex items-center justify-center space-x-3 py-4">
                    <Target className="w-5 h-5 text-summit-gold-400" />
                    <span className="text-sm font-mono tracking-widest uppercase text-summit-gold-400">
                      T-Minus {getDaysToEverest()} Days
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="ENTER EMAIL COORDINATES"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-summit-gold/50 font-mono text-sm tracking-wider transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-4 font-bold tracking-widest hover:bg-summit-gold hover:text-black transition-all duration-300 flex items-center justify-center space-x-3 uppercase text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Initialize Subscription</span>
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center font-mono tracking-wider uppercase">
                  <p>Secure Transmission. Encrypted.</p>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-green-900/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-3xl font-light text-white">Uplink Established</h3>
                <p className="text-gray-400 font-light">
                  You are now connected to the expedition stream. Stand by for updates.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white">
              TRACK THE FULL MISSION
            </h3>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
              Explore the full journey from tuberculosis recovery to Seven Summits preparation,
              documented with honesty and systematic detail.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <a
                href="/expeditions"
                className="inline-flex items-center space-x-2 border border-white/20 text-white px-8 py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-black transition-colors uppercase"
              >
                <Mountain className="w-4 h-4" />
                <span>Mission Archives</span>
              </a>
              <a
                href="/about"
                className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 font-mono text-sm tracking-widest hover:bg-gray-200 transition-colors uppercase"
              >
                <span>Read Briefing</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
