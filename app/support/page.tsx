'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import {
  Shield,
  DollarSign,
  Calendar,
  Users,
  Zap,
  Mountain,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity
} from 'lucide-react';
import { getDaysToEverest } from '@/lib/everest-countdown';

export default function SupportPage() {
  const expeditionMetrics = [
    {
      icon: Calendar,
      value: getDaysToEverest().toString(),
      label: 'Days Remaining',
      description: 'Until Everest departure',
      status: 'CRITICAL'
    },
    {
      icon: DollarSign,
      value: '₹8.5L',
      label: 'Funding Required',
      description: 'Essential equipment only',
      status: 'URGENT'
    },
    {
      icon: Shield,
      value: '72%',
      label: 'Safety Protocols',
      description: 'Funded and verified',
      status: 'OPERATIONAL'
    },
    {
      icon: Users,
      value: '147',
      label: 'Mission Support',
      description: 'Community backing',
      status: 'ACTIVE'
    }
  ];

  const fundingCategories = [
    {
      category: 'CRITICAL SAFETY SYSTEMS',
      amount: '₹4.2L',
      items: ['Oxygen delivery system', 'Emergency shelter', 'Communication beacon', 'Medical supplies'],
      priority: 'IMMEDIATE',
      status: 65
    },
    {
      category: 'TECHNICAL EQUIPMENT',
      amount: '₹2.8L',
      items: ['High-altitude boots', 'Insulation system', 'Climbing hardware', 'Navigation equipment'],
      priority: 'HIGH',
      status: 45
    },
    {
      category: 'EXPEDITION LOGISTICS',
      amount: '₹1.5L',
      items: ['Base camp fees', 'Guide services', 'Transport logistics', 'Permit processing'],
      priority: 'STANDARD',
      status: 80
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'text-red-400';
      case 'URGENT': return 'text-orange-400';
      case 'OPERATIONAL': return 'text-green-400';
      case 'ACTIVE': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'IMMEDIATE': return 'bg-red-900/50 text-red-400 border-red-800';
      case 'HIGH': return 'bg-orange-900/50 text-orange-400 border-orange-800';
      case 'STANDARD': return 'bg-green-900/50 text-green-400 border-green-800';
      default: return 'bg-gray-900/50 text-gray-400 border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/stories/everest-prep.jpg"
            alt="Expedition Support Mission"
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
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h1 className="text-5xl md:text-7xl font-light tracking-wide">
                MISSION FUNDING
              </h1>
            </div>
            <p className="text-xl font-light tracking-wider opacity-90">
              Critical Equipment • {getDaysToEverest()} Days • ₹8.5L Required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Status */}
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
              EXPEDITION STATUS
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {expeditionMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.label}
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
                    <div className="text-3xl font-light mb-1">{metric.value}</div>
                    <div className="text-sm font-medium tracking-wide mb-2">{metric.label}</div>
                    <div className="text-xs text-gray-400 mb-2">{metric.description}</div>
                    <div className={`text-xs font-medium tracking-wider uppercase ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Funding Breakdown */}
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
              RESOURCE ALLOCATION
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="space-y-8">
            {fundingCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-800 rounded-lg p-6"
              >
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="text-lg font-light tracking-wide mb-2">{category.category}</h3>
                    <div className="text-2xl font-light text-white mb-1">{category.amount}</div>
                    <span className={`px-2 py-1 text-xs font-medium tracking-wider uppercase rounded border ${getPriorityColor(category.priority)}`}>
                      {category.priority}
                    </span>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">FUNDED</div>
                    <div className="text-2xl font-light">{category.status}%</div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.status}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Protocol */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
              SUPPORT PROTOCOLS
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-light tracking-wide mb-3">MISSION SUPPORT</h3>
              <div className="text-2xl font-light mb-4">₹2,500</div>
              <p className="text-gray-300 text-sm mb-6">
                Core expedition funding. Direct impact on safety equipment and preparation protocols.
              </p>
              <button className="w-full bg-white text-black py-2 px-4 font-medium tracking-wide hover:bg-gray-200 transition-colors">
                CONTRIBUTE
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-light tracking-wide mb-3">SAFETY SPONSOR</h3>
              <div className="text-2xl font-light mb-4">₹10,000</div>
              <p className="text-gray-300 text-sm mb-6">
                Critical safety systems funding. Emergency equipment and medical supplies sponsorship.
              </p>
              <button className="w-full bg-white text-black py-2 px-4 font-medium tracking-wide hover:bg-gray-200 transition-colors">
                SPONSOR
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-light tracking-wide mb-3">EXPEDITION PARTNER</h3>
              <div className="text-2xl font-light mb-4">₹25,000</div>
              <p className="text-gray-300 text-sm mb-6">
                Full expedition partnership. Complete equipment package and recognition as mission partner.
              </p>
              <button className="w-full bg-white text-black py-2 px-4 font-medium tracking-wide hover:bg-gray-200 transition-colors">
                PARTNER
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Impact */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide">
              MISSION IMPACT
            </h2>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              <strong>Every contribution directly funds critical safety equipment.</strong> No money goes to luxury items or comfort gear. 
              This is survival equipment for the death zone at 29,032 feet.
            </p>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-lg font-light tracking-wide">CRITICAL DEADLINE</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  <strong>Equipment orders must be placed within 180 days</strong> to ensure delivery and testing before departure. 
                  Delays at this stage could compromise the entire expedition timeline.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Your support today ensures proper testing time for life-critical systems. 
                  <strong>At 29,032 feet, equipment failure means mission failure.</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 font-medium tracking-wide hover:bg-gray-200 transition-colors">
                <Shield className="w-5 h-5" />
                <span>SUPPORT MISSION SAFETY</span>
              </button>
              <a
                href="/newsletter"
                className="inline-flex items-center space-x-2 border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                <Activity className="w-5 h-5" />
                <span>Track Expedition Progress</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
