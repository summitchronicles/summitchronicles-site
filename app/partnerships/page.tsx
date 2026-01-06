'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import {
  Users,
  TrendingUp,
  Target,
  Mic,
  Globe,
  Camera,
  ArrowRight,
  Mountain,
  Activity,
} from 'lucide-react';

const stats = [
  { label: 'Summit Target', value: '2028', icon: Target },
  { label: 'Training Hours', value: '450+', icon: Activity },
  { label: 'Vertical Gain', value: '45km', icon: Mountain },
];

const speakingTopics = [
  {
    title: 'Resilience by Design',
    description:
      'Applying mountaineering risk management and endurance strategies to business leadership.',
    icon: Target,
  },
  {
    title: 'The Data of Endurance',
    description:
      'How quantified self-metrics and systematic training build extraordinary outcomes.',
    icon: TrendingUp,
  },
  {
    title: 'Scaling the Invisible',
    description:
      'Overcoming hidden obstacles (like illness or market shifts) with a summit mindset.',
    icon: Globe,
  },
];

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-summit-hero.png"
            alt="Speaking at Summit"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
              CLIMB <span className="text-summit-gold">HIGHER</span> TOGETHER
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed mb-12">
              Partner with a data-driven expedition to the roof of the world.
              Authentic storytelling, resilience leadership, and global reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="summit"
                className="bg-summit-gold-600 text-black border-none hover:bg-summit-gold-500"
              >
                Inquire for Sponsorship
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              >
                Book for Speaking
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-obsidian border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-summit-gold/30 transition-colors"
              >
                <stat.icon className="w-10 h-10 text-summit-gold mx-auto mb-6 opacity-80" />
                <div className="text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-widest text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Section */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-mono text-summit-gold tracking-widest uppercase mb-4">
              Speaking & Workshops
            </h2>
            <h3 className="text-4xl md:text-5xl text-white font-light mb-8">
              LEADERSHIP AT <br />
              <span className="text-gray-500">ALTITUDE</span>
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-12">
              The principles required to survive and thrive in the death zone
              directly translate to business leadership. Sunith delivers
              high-impact keynotes on resilience, risk management, and the
              pursuit of impossible goals.
            </p>

            <div className="space-y-8">
              {speakingTopics.map((topic) => (
                <div key={topic.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-summit-gold/10 flex items-center justify-center flex-shrink-0">
                    <topic.icon className="w-5 h-5 text-summit-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl text-white mb-2">{topic.title}</h4>
                    <p className="text-gray-500 font-light">
                      {topic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[600px] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <Image
              src="/images/sunith-grit-training.png"
              alt="Mountaineering Expedition"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-white text-lg font-medium">
                Available for Global Keynotes
              </div>
              <div className="text-summit-gold">
                Remote & In-Person • 2025/26 Season
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-32 bg-summit-gold-900/10 border-t border-summit-gold/10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl text-white font-light mb-8">
            READY TO PARTNER?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Whether for brand sponsorship, speaking engagements, or media
            inquiries, let's create something extraordinary.
          </p>
          <a
            href="mailto:contact@summitchronicles.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold tracking-widest hover:bg-gray-200 transition-colors rounded-full"
          >
            CONTACT FOR RATES <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
