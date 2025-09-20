'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import {
  Radio,
  MapPin,
  Clock,
  Calendar,
  Mountain,
  Signal,
  Zap,
  Mail,
  Users,
  Compass,
  Activity
} from 'lucide-react';


export default function NewsletterPage() {
  const expeditionUpdates = [
    {
      title: 'FIELD REPORT #47',
      date: 'March 15, 2024',
      location: 'Base Camp Training, Colorado',
      summary: 'High-altitude simulation protocols. VO2 max improvements tracking above baseline targets.',
      status: 'ACTIVE'
    },
    {
      title: 'EQUIPMENT UPDATE #12',
      date: 'March 10, 2024',
      location: 'Gear Testing Facility',
      summary: 'Oxygen system validation complete. Backup regulator performance verified at -40°C.',
      status: 'VERIFIED'
    },
    {
      title: 'TRAINING LOG #156',
      date: 'March 5, 2024',
      location: 'Mount Rainier, Washington',
      summary: 'Cold weather endurance test. 14-hour exposure, pack weight 75lbs. Mental resilience protocols operational.',
      status: 'COMPLETE'
    }
  ];

  const transmissionTypes = [
    {
      icon: Radio,
      type: 'FIELD REPORTS',
      frequency: 'Every 3 Days',
      description: 'Direct transmissions from training locations. Raw data, performance metrics, environmental conditions.',
      coverage: 'Technical Analysis'
    },
    {
      icon: Signal,
      type: 'EXPEDITION UPDATES',
      frequency: 'Weekly',
      description: 'Systematic preparation progress. Equipment testing results. Route planning modifications.',
      coverage: 'Strategic Planning'
    },
    {
      icon: Zap,
      type: 'CRITICAL ALERTS',
      frequency: 'As Required',
      description: 'Weather window notifications. Equipment failures. Timeline modifications. Safety protocols.',
      coverage: 'Emergency Communications'
    }
  ];

  const currentStats = [
    { label: 'Active Subscribers', value: '2,847', icon: Users, description: 'Following expedition' },
    { label: 'Days to Everest', value: '541', icon: Calendar, description: 'Countdown active' },
    { label: 'Field Reports Sent', value: '89', icon: Radio, description: 'From preparation zones' },
    { label: 'Training Hours', value: '1,247', icon: Activity, description: 'Systematic preparation' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/stories/data-training.jpg"
            alt="Expedition Communication Hub"
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
              <Radio className="w-8 h-8" />
              <h1 className="text-5xl md:text-7xl font-light tracking-wide">
                EXPEDITION DISPATCH
              </h1>
            </div>
            <p className="text-xl font-light tracking-wider opacity-90">
              Field Updates • 541 Days to Everest
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Stats */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              COMMUNICATION STATUS
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {currentStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-light mb-1">{stat.value}</div>
                    <div className="text-sm font-medium tracking-wide mb-2">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transmission Types */}
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
              TRANSMISSION TYPES
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="space-y-12">
            {transmissionTypes.map((transmission, index) => {
              const IconComponent = transmission.icon;
              return (
                <motion.div
                  key={transmission.type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-gray-800 rounded-lg p-8"
                >
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light tracking-wide">{transmission.type}</h3>
                        <div className="text-sm text-gray-400">{transmission.frequency}</div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-300 leading-relaxed">
                        {transmission.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 uppercase tracking-wide">
                        {transmission.coverage}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Transmissions */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              RECENT TRANSMISSIONS
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="space-y-8">
            {expeditionUpdates.map((update, index) => (
              <motion.div
                key={update.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-700 rounded-lg p-6 bg-gray-800/50"
              >
                <div className="grid md:grid-cols-4 gap-4 items-start">
                  <div>
                    <h3 className="text-lg font-light tracking-wide text-white mb-1">
                      {update.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{update.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{update.location}</span>
                  </div>
                  
                  <div className="md:col-span-1">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {update.summary}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium tracking-wider uppercase rounded ${
                      update.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400' :
                      update.status === 'VERIFIED' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-gray-700/50 text-gray-300'
                    }`}>
                      {update.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Protocol */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              ESTABLISH COMMUNICATION LINK
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-8"
          >
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Signal className="w-6 h-6" />
                <span className="text-lg font-light tracking-wide">EXPEDITION FREQUENCY: 541 DAYS</span>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8">
                Receive systematic preparation updates, training data, and field reports from the Everest expedition timeline. 
                All transmissions authenticated and verified from preparation zones.
              </p>
              
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter communication coordinates (email)"
                  className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <button className="w-full bg-white text-black py-3 font-medium tracking-wide hover:bg-gray-200 transition-colors">
                  ESTABLISH LINK
                </button>
              </div>
              
              <div className="text-sm text-gray-400 pt-4">
                <p>Secure transmission • 2,847 active subscribers • Terminate link anytime</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
