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
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stories/everest-prep.jpeg"
            alt="Everest Expedition Planning"
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
              Logistics & Resources
            </div>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Target className="w-8 h-8 text-summit-gold-400" />
              <h1 className="text-5xl md:text-8xl font-light tracking-tight">
                MISSION SUPPORT
              </h1>
            </div>
            <p className="text-xl font-mono tracking-wider text-gray-400 max-w-2xl mx-auto">
              ELITE EXPEDITIONS • T-MINUS {getDaysToEverest()} DAYS
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Status */}
      <section className="py-24 bg-obsidian relative">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-8">
              EXPEDITION PLANNING
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto"></div>
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
                  className="group"
                >
                  <div className="bg-glass-panel border border-white/5 p-8 rounded-2xl text-center group-hover:border-summit-gold/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
                        <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-summit-gold transition-colors" />
                    </div>

                    <div className="text-3xl md:text-4xl font-light text-white mb-2">{metric.value}</div>
                    <div className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-2">{metric.label}</div>
                    <div className={`inline-block px-2 py-1 text-[10px] font-mono font-bold tracking-widest uppercase rounded border ${
                        metric.status === 'ACTIVE' ? 'border-blue-900 text-blue-400 bg-blue-900/10' :
                        metric.status === 'RESEARCHED' ? 'border-green-900 text-green-400 bg-green-900/10' :
                        metric.status === 'PLANNING' ? 'border-orange-900 text-orange-400 bg-orange-900/10' :
                        'border-purple-900 text-purple-400 bg-purple-900/10'
                    }`}>
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
              RESOURCE ALLOCATION
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto mb-8"></div>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Researched pricing from Elite Expeditions (Nims Purja) and industry sources for 2025.
              <span className="block mt-2 text-sm font-mono text-gray-500">Estimates based on current market rates.</span>
            </p>
          </motion.div>

          <div className="space-y-6">
            {fundingCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-obsidian border border-white/5 rounded-xl p-8 hover:border-white/20 transition-colors"
              >
                <div className="grid md:grid-cols-4 gap-8 items-start">
                  <div>
                    <h3 className="text-sm font-mono tracking-widest text-summit-gold-400 mb-2 uppercase">{category.category}</h3>
                    <div className="text-2xl font-light text-white mb-4">{category.amount}</div>
                    <span className={`inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded border ${getPriorityColor(category.priority)}`}>
                      {category.priority}
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <p className="text-gray-300 font-light">{category.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-summit-gold-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right border-l border-white/5 pl-8 hidden md:block">
                    <div className="text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">DATA SOURCE</div>
                    <div className="text-xs text-gray-400 leading-relaxed max-w-[150px] ml-auto">{category.source}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Mission Support */}
      <section className="py-24 bg-obsidian relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white">
              SUPPORT THE MISSION
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              The journey from tuberculosis recovery to Everest represents more than just climbing—it's about
              systematic preparation, pushing boundaries, and proving what's possible through discipline.
            </p>

            <div className="bg-glass-panel border border-summit-gold/20 rounded-2xl p-10 text-left backdrop-blur-md relative">
              <div className="absolute top-0 right-0 p-4">
                  <AlertTriangle className="w-6 h-6 text-summit-gold-400 animate-pulse" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-summit-gold-400 animate-ping"></div>
                  <span className="text-sm font-mono tracking-widest text-summit-gold-400 uppercase">Current Phase: Preparation</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  <strong className="text-white font-medium">Currently researching expedition logistics and finalizing equipment lists.</strong>
                  Total expedition cost estimated between $70,000-$110,000 based on Elite Expeditions pricing.
                </p>
                <div className="bg-summit-gold-900/20 border border-summit-gold-900/50 p-4 rounded text-sm text-gray-300">
                   Support at this stage accelerates preparation timelines and secures critical training slots.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="inline-flex items-center space-x-3 bg-summit-gold-600 text-black px-12 py-5 text-lg font-bold tracking-widest hover:bg-summit-gold-500 transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] uppercase">
                <DollarSign className="w-5 h-5" />
                <span>Initiate Support</span>
              </button>
              <a
                href="/newsletter"
                className="inline-flex items-center space-x-2 border border-white/20 text-white px-8 py-4 font-mono text-sm tracking-widest hover:bg-white hover:text-black transition-colors uppercase"
              >
                <Activity className="w-4 h-4" />
                <span>Follow Journey</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
