'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import {
  TrendingUp,
  Wallet,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

const EXCHANGE_RATE = 84;
const TARGET_USD = 65000;
const TARGET_INR = TARGET_USD * EXCHANGE_RATE; // ~54.6 Lakhs

interface SIPConfig {
  initialAmount: number;
  monthlyContribution: number;
  lumpSumAmount: number;
  lumpSumDate: Date;
  annualInterestRate: number;
  startDate: Date;
  targetDate: Date;
}

export function FinancialTracker() {
  const config: SIPConfig = useMemo(
    () => ({
      initialAmount: 30000,
      monthlyContribution: 10000,
      lumpSumAmount: 500000, // 5 Lakhs
      lumpSumDate: new Date('2027-12-01'),
      annualInterestRate: 7,
      startDate: new Date('2026-01-01'),
      targetDate: new Date('2028-04-01'),
    }),
    []
  );

  // --- 1. PROJECTION LOGIC ---
  const dataPoints = useMemo(() => {
    const points: {
      monthLabel: string;
      amount: number;
      isLumpSum?: boolean;
    }[] = [];
    let balance = config.initialAmount;
    const monthlyRate = config.annualInterestRate / 100 / 12;

    const currentDate = new Date(config.startDate);

    // Add initial point
    points.push({ monthLabel: 'Start', amount: balance });

    while (currentDate <= config.targetDate) {
      // Apply Interest first
      balance = balance * (1 + monthlyRate);

      // Apply Monthly SIP
      balance += config.monthlyContribution;

      // Check for Lump Sum
      const isLumpSumMonth =
        currentDate.getMonth() === config.lumpSumDate.getMonth() &&
        currentDate.getFullYear() === config.lumpSumDate.getFullYear();

      if (isLumpSumMonth) {
        balance += config.lumpSumAmount;
      }

      points.push({
        monthLabel: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        amount: Math.round(balance),
        isLumpSum: isLumpSumMonth,
      });

      // Increment Month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return points;
  }, [config]);

  const finalAmountINR = dataPoints[dataPoints.length - 1].amount;
  const finalAmountUSD = Math.round(finalAmountINR / EXCHANGE_RATE);
  const percentage = Math.min((finalAmountINR / TARGET_INR) * 100, 100);

  // --- 2. CHART SCALING ---
  // Create SVG Path Data
  // X-axis: 0 to 100 (percentage of time)
  // Y-axis: 0 to 100 (percentage of max value usually, but let's scale to Target for visual gap)
  const maxVal = TARGET_INR;
  const width = 100;
  const height = 60; // Aspect ratio unit

  const pathD = useMemo(() => {
    if (dataPoints.length === 0) return '';

    const xStep = width / (dataPoints.length - 1);

    let d = `M 0 ${height}`; // Start at bottom-left

    // Line to first point
    const firstY = height - (dataPoints[0].amount / maxVal) * height;
    d += ` L 0 ${firstY}`;

    dataPoints.forEach((pt, i) => {
      const x = i * xStep;
      const y = height - (pt.amount / maxVal) * height;
      d += ` L ${x} ${y}`;
    });

    // Close the loop for area fill
    d += ` L ${width} ${height} Z`;

    return d;
  }, [dataPoints, maxVal]);

  const linePathD = useMemo(() => {
    // Just the top line stroke
    if (dataPoints.length === 0) return '';
    const xStep = width / (dataPoints.length - 1);

    const firstY = height - (dataPoints[0].amount / maxVal) * height;
    let d = `M 0 ${firstY}`;

    dataPoints.forEach((pt, i) => {
      const x = i * xStep;
      const y = height - (pt.amount / maxVal) * height;
      d += ` L ${x} ${y}`;
    });
    return d;
  }, [dataPoints, maxVal]);

  // --- 3. ANIMATED COUNTER ---
  const countDisplay = useCounter(finalAmountINR);

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-black border-y border-white/5 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-summit-gold-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                LIVE TRACKER
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-light text-white mb-2">
              Skin in the{' '}
              <span className="text-summit-gold font-normal">Game</span>
              <span className="text-gray-500 text-lg md:text-xl font-light ml-3">
                / Personal Commitment
              </span>
            </h3>
            <p className="text-gray-400 max-w-xl leading-relaxed">
              Expeditions run on trust. I am maximizing my personal savings (SIP
              + Lump Sums) to fund the core logistics, proving my commitment
              before asking for yours.
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">
              Projected contribution (2028)
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight flex items-baseline justify-end gap-1">
              <span className="text-2xl text-gray-500 font-light">₹</span>
              {countDisplay.toLocaleString()}
            </div>
            <div className="text-emerald-400 font-mono text-sm mt-1 flex items-center justify-end gap-1">
              ≈ ${finalAmountUSD.toLocaleString()} USD
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* --- MAIN CHART CARD --- */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-1 md:p-2 backdrop-blur-sm relative group hover:border-summit-gold/30 transition-colors duration-500">
          <div className="relative h-[300px] w-full bg-black/40 rounded-xl overflow-hidden">
            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-0 opacity-20 pointer-events-none">
              <div className="border-t border-white/50 w-full" />
              <div className="border-t border-white/30 w-full" />
              <div className="border-t border-white/30 w-full" />
              <div className="border-t border-white/30 w-full" />
            </div>

            {/* CHART SVG */}
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full preserve-3d"
            >
              {/* Definitions for Gradients */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="90%" stopColor="#D4AF37" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FCD34D" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <motion.path
                d={pathD}
                fill="url(#chartGradient)"
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ transformOrigin: 'bottom' }}
              />

              {/* Stroke Line */}
              <motion.path
                d={linePathD}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </svg>

            {/* LUMPSUM MARKER OVERLAY */}
            {/* Finding the index of lump sum to position marker roughly */}
            {/* This is a bit of a hack for strict visual placement in SVG coords but works for 'fancy' feel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute top-[35%] left-[70%] transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center">
                <div className="bg-summit-gold text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-2">
                  +₹5L INJECTION
                </div>
                <div className="w-0.5 h-12 bg-gradient-to-b from-summit-gold to-transparent" />
              </div>
            </motion.div>

            {/* PROJECTED RESULT MARKER */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="absolute top-[15%] right-4 text-right"
            >
              <div className="text-white text-xs font-bold">
                DEC 2027 TARGET
              </div>
              <div className="text-summit-gold text-lg font-mono">
                ₹{config.lumpSumAmount.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* INFO FOOTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-white/5 mt-2">
            <MetricItem
              icon={Wallet}
              label="Starting Corpus"
              value={`₹${config.initialAmount.toLocaleString()}`}
            />
            <MetricItem
              icon={TrendingUp}
              label="Monthly SIP"
              value={`₹${config.monthlyContribution.toLocaleString()}`}
              sub="(@ 7% CAGR)"
            />
            <MetricItem
              icon={ArrowUpRight}
              label="Strategic Injection"
              value={`₹${config.lumpSumAmount.toLocaleString()}`}
              sub="(Dec 2027)"
              highlight
            />
            <MetricItem
              icon={Calendar}
              label="Total Duration"
              value={`${dataPoints.length} Months`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricItem({ icon: Icon, label, value, sub, highlight }: any) {
  return (
    <div className="flex gap-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-summit-gold/20 text-summit-gold' : 'bg-white/5 text-gray-400'}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </div>
        <div
          className={`font-medium ${highlight ? 'text-summit-gold' : 'text-white'}`}
        >
          {value}
        </div>
        {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
      </div>
    </div>
  );
}

// Hook for number animation
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = target;
    if (start === end) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(start + (end - start) * ease));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}
