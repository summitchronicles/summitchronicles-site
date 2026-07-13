'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PublicLayout } from '../components/layout/PublicLayout';
import { FundingVisualizer } from '../components/support/FundingVisualizer';
import {
  Shield,
  DollarSign,
  Calendar,
  Zap,
  Mountain,
  CheckCircle,
  Target,
  Activity,
  ExternalLink,
  Heart,
} from 'lucide-react';
import Image from 'next/image';

export default function SupportPage() {
  const expeditionMetrics = [
    {
      icon: Calendar,
      value: '2028',
      label: 'Everest Objective',
      description: 'Target year; schedule not fixed',
      status: 'PLANNING',
    },
    {
      icon: Mountain,
      value: '4/7',
      label: 'Summits Complete',
      description: 'Seven Summits journey',
      status: 'OBSERVED',
    },
    {
      icon: Activity,
      value: 'ACTIVE',
      label: 'Recovery Block',
      description: 'Gait, mobility, and strength',
      status: 'ACTIVE',
    },
    {
      icon: DollarSign,
      value: 'QUOTE',
      label: 'Budget Status',
      description: 'Current operator quotes required',
      status: 'PLANNING',
    },
  ];

  const fundingCategories = [
    {
      category: 'EXPEDITION PACKAGE',
      amount: 'Historical range: $45,000 - $65,000',
      description: 'Elite Expeditions (Nims Purja) full-service package',
      items: [
        'Base camp logistics & permits',
        'Sherpa guide services',
        'Route fixing & preparation',
        'Base camp meals & accommodation',
      ],
      priority: 'CORE',
      source: 'Historical planning estimate; current operator quote required',
    },
    {
      category: 'PERSONAL EQUIPMENT',
      amount: 'Historical range: $20,000 - $30,000',
      description: 'Essential high-altitude climbing gear',
      items: [
        'High-altitude boots',
        'Down suit system',
        'Supplemental oxygen system',
        'Climbing hardware & clothing',
      ],
      priority: 'CRITICAL',
      source: 'Historical planning estimate; current supplier quotes required',
    },
    {
      category: 'PREPARATION & TRAINING',
      amount: 'Historical range: $5,000 - $15,000',
      description: 'Training expeditions and skill development',
      items: [
        'High-altitude acclimatization',
        'Technical climbing certification',
        'Emergency rescue training',
        'Physical conditioning programs',
      ],
      priority: 'ESSENTIAL',
      source: 'Historical planning estimate; scope and quotes not finalized',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-blue-400';
      case 'RESEARCHED':
        return 'text-green-400';
      case 'PLANNING':
        return 'text-orange-400';
      case 'CONFIRMED':
        return 'text-purple-400';
      case 'OBSERVED':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CORE':
        return 'bg-blue-900/50 text-blue-400 border-blue-800';
      case 'CRITICAL':
        return 'bg-red-900/50 text-red-400 border-red-800';
      case 'ESSENTIAL':
        return 'bg-orange-900/50 text-orange-400 border-orange-800';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-800';
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
        {/* 1. HERO - FUEL THE ASCENT */}
        <section className="relative flex min-h-[82svh] items-end overflow-hidden px-4 pb-10 pt-28 sm:min-h-[84svh] sm:px-6 md:pb-14 md:pt-40">
          {/* Background Hero Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/sunith-support-hero-landscape.png"
              alt="Summit Vision"
              fill
              className="object-cover opacity-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/72 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/28 to-black/45"></div>
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:items-end">
            {/* Left: Context */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-5 text-xs font-mono uppercase text-summit-gold">
                COMMUNITY POWERED
              </div>
              <h1 className="font-oswald text-[64px] font-bold uppercase leading-[0.9] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] sm:text-8xl md:text-9xl">
                FUEL THE <span className="text-summit-gold">ASCENT</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 md:text-xl">
                Big mountains are climbed by small steps. You don't need to fund
                the entire expedition to make a difference. A coffee, a protein
                shake, or a gear contribution keeps the daily training momentum
                alive.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://ko-fi.com/summitchronicles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-summit-gold px-5 py-3 text-sm font-oswald font-bold uppercase text-black transition-colors hover:bg-summit-gold-300 focus:outline-none focus:ring-2 focus:ring-summit-gold focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  <Heart className="h-4 w-4 fill-black" />
                  Buy Me a Coffee
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="#transparency"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/25 bg-black/25 px-5 py-3 text-sm font-oswald font-bold uppercase text-white backdrop-blur-sm transition-colors hover:border-summit-gold hover:text-summit-gold focus:outline-none focus:ring-2 focus:ring-summit-gold focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  View Expedition Budget
                  <Target className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            {/* Right: Impact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden overflow-hidden rounded-md border border-white/10 bg-black/45 p-8 backdrop-blur-md lg:block"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Mountain className="w-32 h-32" />
              </div>

              <h3 className="text-2xl text-white mb-6">Where it goes</h3>
              <ul className="space-y-4">
                {[
                  { label: 'Training Nutrition & Supplements', icon: Zap },
                  { label: 'PT & Recovery Sessions', icon: Activity },
                  { label: 'Essential Gear Upgrades', icon: Shield },
                  { label: 'Expedition Logistics Fund', icon: Target },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-summit-gold/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-summit-gold" />
                    </div>
                    {item.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <FundingVisualizer />

        {/* 2. TRANSPARENCY - THE BUDGET */}
        <section
          id="transparency"
          className="py-24 bg-obsidian border-t border-white/5"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-4">
                RADICAL TRANSPARENCY
              </h2>
              <h3 className="text-3xl md:text-4xl text-white font-light">
                EXPEDITION <span className="text-gray-500">ECONOMICS</span>
              </h3>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-light">
                Historical planning ranges only. Final costs depend on current
                operator, supplier, insurance, travel, and permit quotes.
              </p>
            </div>

            <div className="space-y-6">
              {fundingCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 border border-white/5 rounded-xl p-8 hover:border-white/20 transition-colors"
                >
                  <div className="grid md:grid-cols-4 gap-8 items-start">
                    <div>
                      <h3 className="text-sm font-mono tracking-widest text-summit-gold-400 mb-2 uppercase">
                        {category.category}
                      </h3>
                      <div className="text-2xl font-light text-white mb-4">
                        {category.amount}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded border ${getPriorityColor(category.priority)}`}
                      >
                        {category.priority}
                      </span>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <p className="text-gray-300 font-light">
                        {category.description}
                      </p>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-400">
                        {category.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-summit-gold-600" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
