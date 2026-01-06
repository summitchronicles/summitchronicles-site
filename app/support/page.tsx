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
  ExternalLink,
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
      status: 'ACTIVE',
    },
    {
      icon: DollarSign,
      value: '$45K-$65K',
      label: 'Expedition Cost',
      description: 'Elite Expeditions package',
      status: 'RESEARCHED',
    },
    {
      icon: Shield,
      value: '$20K-$30K',
      label: 'Equipment Budget',
      description: 'Personal gear & oxygen',
      status: 'PLANNING',
    },
    {
      icon: Mountain,
      value: '55 Days',
      label: 'Expedition Length',
      description: 'Base camp to summit',
      status: 'CONFIRMED',
    },
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
        'Base camp meals & accommodation',
      ],
      priority: 'CORE',
      source: 'Elite Expeditions 2025 pricing',
    },
    {
      category: 'PERSONAL EQUIPMENT',
      amount: '$20,000 - $30,000',
      description: 'Essential high-altitude climbing gear',
      items: [
        'High-altitude boots ($1,200)',
        'Down suit system ($2,000+)',
        'Oxygen system ($3,650)',
        'Climbing hardware & clothing',
      ],
      priority: 'CRITICAL',
      source: 'Industry standard 2025 pricing',
    },
    {
      category: 'PREPARATION & TRAINING',
      amount: '$5,000 - $15,000',
      description: 'Training expeditions and skill development',
      items: [
        'High-altitude acclimatization',
        'Technical climbing certification',
        'Emergency rescue training',
        'Physical conditioning programs',
      ],
      priority: 'ESSENTIAL',
      source: 'Estimated based on preparation needs',
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
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* 1. HERO - FUEL THE ASCENT */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sunith-support-hero.png"
            alt="Summit Vision"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/60"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left: Context */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-sm font-mono text-summit-gold tracking-widest uppercase mb-6">
              COMMUNITY POWERED
            </h1>
            <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight mb-8">
              FUEL THE <span className="text-summit-gold">ASCENT</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Big mountains are climbed by small steps. You don't need to fund
              the entire expedition to make a difference. A coffee, a protein
              shake, or a gear contribution keeps the daily training momentum
              alive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://ko-fi.com/summitchronicles"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-summit-gold-600 text-black font-bold tracking-widest hover:bg-summit-gold-500 transition-colors rounded-sm"
              >
                <div className="flex items-center gap-2">
                  {/* Using Lucide Heart icon directly or via Icon component if standard */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 fill-black"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  BUY ME A COFFEE
                </div>
              </a>
              <a
                href="#transparency"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-medium tracking-widest hover:border-white/50 transition-colors rounded-sm"
              >
                VIEW EXPEDITION BUDGET
              </a>
            </div>
          </motion.div>

          {/* Right: Impact Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
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
              Researched pricing from Elite Expeditions (Nims Purja) and
              industry sources for 2025.
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
  );
}
