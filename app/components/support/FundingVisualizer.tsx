'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Lock, Globe, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const EXCHANGE_RATE = 84;
const TARGET_USD = 65000;
const TARGET_INR = TARGET_USD * EXCHANGE_RATE; // ~54.6 Lakhs

interface FundingConfig {
  initial: number; // ₹30,000
  monthlySIP: number; // ₹10,000
  lumpSum: number; // ₹5,00,000
  rate: number; // 7%
  months: number; // ~27
}

export function FundingVisualizer() {
  // Logic Reuse
  const projection = useMemo(() => {
    let balance = 30000;
    const monthlyRate = 0.07 / 12;
    let totalInvested = 30000;

    // Iterate 27 months (Jan '26 to Apr '28)
    for (let i = 0; i < 27; i++) {
      balance = balance * (1 + monthlyRate) + 10000;
      totalInvested += 10000;

      // Dec 2027 is approx month 23
      if (i === 23) {
        balance += 500000;
        totalInvested += 500000;
      }
    }

    const totalINR = Math.round(balance);
    const totalUSD = Math.round(totalINR / EXCHANGE_RATE);
    const percent = Math.min((totalUSD / TARGET_USD) * 100, 100);

    return { totalINR, totalUSD, percent };
  }, []);

  const gapUSD = TARGET_USD - projection.totalUSD;
  const gapPercent = 100 - projection.percent;

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* 1. Header: The Equation */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-summit-gold/10 border border-summit-gold/20 text-summit-gold text-xs font-mono tracking-widest mb-4">
              <Globe className="w-3 h-3" />
              EXPEDITION FUNDING STATUS
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
              THE SUMMIT <span className="text-gray-500">EQUATION</span>
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 font-mono mb-1">
              TOTAL REQUIREMENT
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white">
              $65,000 USD
            </div>
          </div>
        </div>

        {/* 2. The Visual Altimeter (Progress Bar) */}
        <div className="relative mb-16">
          {/* Bar Background (The Gap) */}
          <div className="w-full h-16 md:h-20 bg-rose-900/10 border border-rose-500/20 rounded-full relative overflow-hidden backdrop-blur-sm">
            {/* Gap Pattern (Diagonal Stripes for "Under Construction") */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, #f43f5e 10px, #f43f5e 11px)',
              }}
            />

            {/* Personal Commitment Filling (Green) */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${projection.percent}%` }}
              transition={{ duration: 1.5, ease: 'circOut' }}
              className="h-full bg-emerald-500 relative shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              {/* Inner Shine */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20" />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </motion.div>

            {/* Markers / Ticks */}
            <div className="absolute inset-x-0 top-0 bottom-0 flex justify-between px-8 z-10 pointer-events-none">
              {[0, 25, 50, 75, 100].map((tick) => (
                <div
                  key={tick}
                  className="h-full w-px bg-white/5 flex flex-col justify-end pb-2"
                >
                  <span className="text-[10px] font-mono text-gray-500 -ml-2">
                    {tick}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Labels */}
          <div className="flex justify-between mt-4 text-xs font-mono tracking-wider">
            <div className="text-emerald-400 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              SECURED: ${projection.totalUSD.toLocaleString()}
            </div>
            <div className="text-rose-400 flex items-center gap-2">
              <Target className="w-3 h-3" />
              NEEDED: ${gapUSD.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 3. Detailed Breakdown Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card A: Personal Skin in the Game */}
          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 left-0 p-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <h4 className="text-white text-xl font-light mb-1">
                  Skin in the Game
                </h4>
                <p className="text-sm text-gray-500">
                  My personal capital commitment.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <MetricRow label="Initial Savings" value="₹30,000" />
              <MetricRow label="Monthly SIP (27mo)" value="₹10,000/mo" />
              <MetricRow
                label="2027 Injection"
                value="+₹5,00,000"
                highlightColor="text-emerald-400"
              />
              <div className="pt-4 border-t border-white/5 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400">Projected Total</span>
                  <span className="text-2xl text-white font-bold">
                    ₹{projection.totalINR.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Community Gap */}
          <div className="p-8 rounded-2xl bg-rose-950/10 border border-rose-500/20 hover:border-rose-500/40 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <h4 className="text-white text-xl font-light mb-1">
                  Critical Funding Gap
                </h4>
                <p className="text-sm text-rose-300/70">
                  Partnership required to launch.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <p className="text-gray-400 leading-relaxed text-sm">
                While I am funding 100% of the training and preparation costs,{' '}
                <span className="text-rose-200">
                  the expedition logicsts cannot happen without sponsors.
                </span>
                This gap represents the difference between a dream and a summit.
              </p>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-rose-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[85%] animate-pulse" />
                </div>
                <span className="text-rose-400 font-mono text-lg">
                  ${gapUSD.toLocaleString()}
                </span>
              </div>

              <button className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20">
                Become a Partner <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricRow({
  label,
  value,
  highlightColor,
}: {
  label: string;
  value: string;
  highlightColor?: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={cn('font-mono', highlightColor || 'text-gray-300')}>
        {value}
      </span>
    </div>
  );
}
