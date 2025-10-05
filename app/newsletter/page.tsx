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
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/stories/data-training.jpg"
            alt="Summit Chronicles Newsletter"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Mail className="w-8 h-8" />
              <h1 className="text-5xl md:text-7xl font-light tracking-wide">
                SUMMIT CHRONICLES
              </h1>
            </div>
            <p className="text-xl font-light tracking-wider opacity-90">
              Newsletter • {getEverestCountdownText()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              THE JOURNEY TO EVEREST
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto mb-8"></div>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              From bedridden with tuberculosis in 2013 to preparing for Everest in 2027.
              This is the story of systematic preparation, failure, learning, and the pursuit
              of something bigger than ourselves.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-light mb-2">4/7</div>
                <div className="text-sm uppercase tracking-wide text-gray-400">Seven Summits Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light mb-2">{getDaysToEverest()}</div>
                <div className="text-sm uppercase tracking-wide text-gray-400">Days to Everest</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light mb-2">11</div>
                <div className="text-sm uppercase tracking-wide text-gray-400">Years of Climbing</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              WHAT YOU'LL RECEIVE
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
                  className="text-center space-y-4 border border-gray-800 rounded-lg p-8"
                >
                  <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-light tracking-wide">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              JOIN THE JOURNEY
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-black border border-gray-700 rounded-lg p-8"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    Get updates on the preparation for Everest 2027. Real training data,
                    honest reflections on the highs and lows, and insights from the journey
                    to the world's highest peak.
                  </p>

                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <Target className="w-6 h-6" />
                    <span className="text-lg font-light tracking-wide">
                      {getDaysToEverest()} days until expedition
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-3 font-medium tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Subscribe to Updates</span>
                  </button>
                </div>

                <div className="text-sm text-gray-400 text-center pt-4">
                  <p>No spam. Unsubscribe at any time. Your email stays private.</p>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                <h3 className="text-2xl font-light">Thank You!</h3>
                <p className="text-gray-300">
                  You'll receive updates on the journey to Everest. The adventure continues.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl md:text-4xl font-light tracking-wide">
              Follow the Complete Story
            </h3>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              Explore the full journey from tuberculosis recovery to Seven Summits preparation,
              documented with honesty and systematic detail.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/expeditions"
                className="inline-flex items-center space-x-2 border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                <Mountain className="w-5 h-5" />
                <span>View All Expeditions</span>
              </a>
              <a
                href="/about"
                className="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 font-medium tracking-wide hover:bg-gray-200 transition-colors"
              >
                <span>Read My Story</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}