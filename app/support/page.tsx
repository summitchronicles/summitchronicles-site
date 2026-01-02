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
  Activity,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { getDaysToEverest } from '@/lib/everest-countdown';

export default function SupportPage() {
  const expeditionMetrics = [
    {
      icon: Calendar,
      value: getDaysToEverest().toString(),
      label: 'Days Remaining',
      description: 'Until Everest departure',
      status: 'ACTIVE'
    },
    {
      icon: DollarSign,
      value: '$45K-$65K',
      label: 'Expedition Cost',
      description: 'Elite Expeditions package',
      status: 'RESEARCHED'
    },
    {
      icon: Shield,
      value: '$20K-$30K',
      label: 'Equipment Budget',
      description: 'Personal gear & oxygen',
      status: 'PLANNING'
    },
    {
      icon: Mountain,
      value: '55 Days',
      label: 'Expedition Length',
      description: 'Base camp to summit',
      status: 'CONFIRMED'
    }
  ];

  const fundingCategories = [
    {
      category: 'EXPEDITION PACKAGE',
      amount: '$45,000 - $65,000',
      description: 'Elite Expeditions (Nims Purja) full-service package',
      items: [
        'Base camp logistics & permits',
        'Sherpa guide services',
        'Route fixing & preparation',
        'Base camp meals & accommodation'
      ],
      priority: 'CORE',
      source: 'Elite Expeditions 2025 pricing'
    },
    {
      category: 'PERSONAL EQUIPMENT',
      amount: '$20,000 - $30,000',
      description: 'Essential high-altitude climbing gear',
      items: [
        'High-altitude boots ($1,200)',
        'Down suit system ($2,000+)',
        'Oxygen system ($3,650)',
        'Climbing hardware & clothing'
      ],
      priority: 'CRITICAL',
      source: 'Industry standard 2025 pricing'
    },
    {
      category: 'PREPARATION & TRAINING',
      amount: '$5,000 - $15,000',
      description: 'Training expeditions and skill development',
      items: [
        'High-altitude acclimatization',
        'Technical climbing certification',
        'Emergency rescue training',
        'Physical conditioning programs'
      ],
      priority: 'ESSENTIAL',
      source: 'Estimated based on preparation needs'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-blue-400';
      case 'RESEARCHED': return 'text-green-400';
      case 'PLANNING': return 'text-orange-400';
      case 'CONFIRMED': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CORE': return 'bg-blue-900/50 text-blue-400 border-blue-800';
      case 'CRITICAL': return 'bg-red-900/50 text-red-400 border-red-800';
      case 'ESSENTIAL': return 'bg-orange-900/50 text-orange-400 border-orange-800';
      default: return 'bg-gray-900/50 text-gray-400 border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/stories/everest-prep.jpeg"
            alt="Everest Expedition Planning"
            fill
            className="object-cover opacity-50"
            priority
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
              <Target className="w-8 h-8 text-blue-400" />
              <h1 className="text-5xl md:text-7xl font-light tracking-wide">
                EXPEDITION SUPPORT
              </h1>
            </div>
            <p className="text-xl font-light tracking-wider opacity-90">
              Elite Expeditions • {getDaysToEverest()} Days • $70K-$110K Total
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
              EXPEDITION PLANNING
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

      {/* Cost Breakdown */}
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
              COST RESEARCH & BREAKDOWN
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Researched pricing from Elite Expeditions (Nims Purja) and industry sources for 2025 expeditions.
              All costs are estimates based on current market rates.
            </p>
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
                <div className="grid md:grid-cols-4 gap-6 items-start">
                  <div>
                    <h3 className="text-lg font-light tracking-wide mb-2">{category.category}</h3>
                    <div className="text-2xl font-light text-white mb-2">{category.amount}</div>
                    <span className={`px-2 py-1 text-xs font-medium tracking-wider uppercase rounded border ${getPriorityColor(category.priority)}`}>
                      {category.priority}
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <p className="text-gray-300 text-sm">{category.description}</p>
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">DATA SOURCE</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{category.source}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Mission Support */}
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
              SUPPORT THE MISSION
            </h2>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              The journey from tuberculosis recovery to Everest represents more than just climbing -
              it's about systematic preparation, pushing boundaries, and proving what's possible through discipline and determination.
            </p>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span className="text-lg font-light tracking-wide">PREPARATION PHASE</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  <strong>Currently researching expedition logistics and finalizing equipment lists.</strong>
                  Total expedition cost estimated between $70,000-$110,000 based on Elite Expeditions pricing and equipment requirements.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Support at this stage helps with preparation costs, training expeditions, and building the foundation
                  for a safe and successful summit attempt. <strong>Every contribution accelerates the preparation timeline.</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center space-x-2 bg-blue-600 text-white px-12 py-4 text-lg font-medium tracking-wide hover:bg-blue-700 transition-colors rounded-lg shadow-lg">
                <DollarSign className="w-6 h-6" />
                <span>DONATE TO MISSION</span>
              </button>
              <a
                href="/newsletter"
                className="inline-flex items-center space-x-2 border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                <Activity className="w-5 h-5" />
                <span>Follow the Journey</span>
              </a>
              <a
                href="/about"
                className="inline-flex items-center space-x-2 border border-gray-600 text-gray-300 px-8 py-3 font-medium tracking-wide hover:bg-gray-600 hover:text-white transition-colors"
              >
                <Target className="w-5 h-5" />
                <span>Read the Story</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
