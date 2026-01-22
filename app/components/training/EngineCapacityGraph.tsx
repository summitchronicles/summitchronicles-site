'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  format,
  endOfWeek,
  eachWeekOfInterval,
  subWeeks,
  isSameWeek,
  parseISO,
} from 'date-fns';

interface EngineCapacityGraphProps {
  vo2Max?: number | string;
  activities?: any[];
}

export const EngineCapacityGraph = ({
  vo2Max,
  activities = [],
}: EngineCapacityGraphProps) => {
  // 1. Generate 12-week Timeline
  const today = new Date();
  const weeks = eachWeekOfInterval(
    {
      start: subWeeks(today, 11),
      end: today,
    },
    { weekStartsOn: 1 }
  );

  // 2. Calculate Volume per Week
  const dataPoints = weeks.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weeklyDurationSeconds = activities
      .filter((a) => {
        const d = parseISO(a.startTimeLocal);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    const hours = Number((weeklyDurationSeconds / 3600).toFixed(1));
    return { date: weekStart, val: hours };
  });

  // 3. Generate SVG Path
  // X range: 0 to 1000
  // Y range: 400 (bottom) to 0 (top)
  const width = 1000;
  const height = 400;

  // Scale Y: Max volume = 20% of height (to allow for spikes)?
  // No, let's adapt. Max volume = 100px from top (300 height used).
  const maxVolume = Math.max(1, ...dataPoints.map((d) => d.val));
  const paddingBottom = 50;
  const graphHeight = 300;

  const getX = (i: number) => (i / (dataPoints.length - 1)) * width;
  const getY = (val: number) =>
    height - paddingBottom - (val / maxVolume) * graphHeight;

  // Smooth Curve (Catmull-Rom or similar, or just L for jagged mountain look)
  // The sketch shows jagged peaks. Let's use simple LineTo (L) for that mountain feel.
  const pathData = dataPoints
    .map((d, i) => {
      const x = getX(i);
      const y = getY(d.val);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Current Point (The stick figure position)
  const lastIndex = dataPoints.length - 1;
  const climberX = getX(lastIndex);
  const climberY = getY(dataPoints[lastIndex].val);

  return (
    <div className="w-full relative py-12 border-l border-b border-white/10 bg-[#0a0a0a] overflow-hidden">
      {/* 1. Axis Lines (Neon Style) */}
      <div className="absolute left-6 top-6 bottom-16 w-px bg-white/20 rounded shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
      <div className="absolute left-6 right-6 bottom-16 h-px bg-white/20 rounded shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>

      <div className="relative w-full aspect-[2/1] md:aspect-[3/1] pl-8 pr-6 pb-20">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* 2. The Mountain Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            filter="url(#neon-glow)"
          />

          {/* 3. The Climber (Stick Figure) */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1, x: climberX, y: climberY }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            {/* Head */}
            <circle
              cx="0"
              cy="-35"
              r="8"
              fill="none"
              stroke="white"
              strokeWidth="3"
              filter="url(#neon-glow)"
            />
            {/* User uploaded sketch sticks figure body */}
            <path
              d="M0,-27 L0,0 M-10,-15 L10,-15 M0,0 L-10,25 M0,0 L10,25"
              stroke="white"
              strokeWidth="3"
              fill="none"
              filter="url(#neon-glow)"
            />
          </motion.g>

          {/* 4. "You Are Here" Arrow & Text */}
          <motion.g
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            transform={`translate(${climberX}, ${climberY - 80})`}
          >
            {/* Arrow */}
            <path
              d="M0,40 L0,10 M-5,15 L0,10 L5,15"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="animate-bounce"
            />

            {/* Handwriting Text */}
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fill="white"
              fontFamily="'Caveat', 'Indie Flower', cursive"
              fontSize="32"
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
            >
              You are here
            </text>
          </motion.g>

          {/* X-Axis Labels */}
          {dataPoints.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={height - 20}
              textAnchor="middle"
              fill="#666"
              fontSize="12"
              fontFamily="monospace"
            >
              {format(d.date, 'MMM d')}
            </text>
          ))}
        </svg>
      </div>

      {/* Google Font for "You Are Here" style */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
      `}</style>
    </div>
  );
};
