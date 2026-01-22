'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  format,
  parseISO,
  eachWeekOfInterval,
  subWeeks,
  endOfWeek,
  isSameWeek,
} from 'date-fns';

interface CinematicRecoveryProps {
  activities?: any[];
}

export const CinematicRecovery = ({
  activities = [],
}: CinematicRecoveryProps) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  // --- Data Processing for the "Path" ---
  // We need to map 12 weeks of volume to visual nodes along the path
  const today = new Date();
  const weeks = eachWeekOfInterval(
    {
      start: subWeeks(today, 11),
      end: today,
    },
    { weekStartsOn: 1 }
  );

  const timelineData = weeks
    .map((weekStart, i) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weeklyDuration =
        activities
          .filter((a) => {
            const d = parseISO(a.startTimeLocal);
            return d >= weekStart && d <= weekEnd;
          })
          .reduce((sum, a) => sum + (a.duration || 0), 0) / 3600;

      let type = 'training';
      const injuryDate = new Date('2025-11-10');
      if (isSameWeek(weekStart, injuryDate)) type = 'crash';
      if (isSameWeek(weekStart, today)) type = 'return';

      return { date: weekStart, volume: weeklyDuration, type };
    })
    .reverse(); // Newest at bottom for scrolling? Actually scrolling usually goes Top (Old) -> Bottom (New)
  // Let's do Top = Now, Scroll down to see history?
  // OR Top = Crash, Scroll down to see progress? "The Journey" usually starts at the beginning.
  // Pivot: Top = Past (Crash), Bottom = Present (Return).

  const sortedData = [...timelineData].reverse(); // Oldest first

  return (
    <div
      ref={containerRef}
      className="relative bg-[#050505] min-h-[400vh] text-white selection:bg-summit-gold/30"
    >
      {/* Fixed Background - Atmospheric */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black opacity-80" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("/images/noise.png")',
            backgroundRepeat: 'repeat',
          }}
        ></div>
      </div>

      {/* The Thread - Fixed SVG Path that fills as you scroll */}
      <div className="fixed left-8 md:left-1/2 top-0 bottom-0 w-1 z-10 hidden md:block">
        <svg
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background Line */}
          <path
            d="M0,0 L0,5000"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
          {/* Active Line */}
          <motion.path
            d="M0,0 L0,5000"
            stroke="#C5A059"
            strokeWidth="3"
            fill="none"
            style={{ pathLength }}
          />
        </svg>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-6 py-24">
        {/* Header - The Setup */}
        <section className="h-screen flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-serif tracking-tight mb-6"
          >
            The Reconstruction
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-zinc-400 font-light max-w-xl leading-relaxed"
          >
            A chronicle of breaking apart and piece-by-piece assembly.
            <br />
            <span className="text-sm font-mono mt-4 block text-zinc-600">
              SCROLL TO BEGIN
            </span>
          </motion.p>
        </section>

        {/* The Timeline Chapters */}
        <div className="space-y-[40vh]">
          {' '}
          {/* Huge spacing for scrollfeel */}
          {sortedData.map((week, i) => (
            <Chapter key={i} data={week} index={i} total={sortedData.length} />
          ))}
        </div>

        {/* Footer - The CTA */}
        <section className="h-[50vh] flex items-center justify-center mt-[20vh]">
          <div className="text-center">
            <h3 className="text-3xl font-serif mb-4">The Work Continues</h3>
            <button className="px-8 py-3 bg-white text-black font-mono text-sm uppercase hover:bg-zinc-200 transition-colors">
              Join the Mission
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Sub-components ---

const Chapter = ({
  data,
  index,
  total,
}: {
  data: any;
  index: number;
  total: number;
}) => {
  const isCrash = data.type === 'crash';
  const isReturn = data.type === 'return';

  // Formatting volume visually
  // Low volume = minimal dot. High volume = large glowing orb.
  const size = Math.max(12, Math.min(60, data.volume * 8));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ margin: '-20%' }}
      transition={{ duration: 0.8 }}
      className={`flex items-center gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* The Metric Visual (Center Anchored) */}
      <div className="w-24 flex-shrink-0 flex justify-center hidden md:flex">
        <div
          className={`rounded-full flex items-center justify-center border transition-all duration-500
                    ${
                      isCrash
                        ? 'border-red-500 bg-red-900/20 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                        : isReturn
                          ? 'border-summit-gold bg-summit-gold/20 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                          : 'border-zinc-700 bg-zinc-900/50'
                    }`}
          style={{ width: size, height: size }}
        >
          <span className="text-[10px] font-mono text-white/50">
            {data.volume > 0 ? data.volume.toFixed(1) : ''}
          </span>
        </div>
      </div>

      {/* The Narrative Content */}
      <div className={`flex-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
        <span className="font-mono text-xs text-zinc-500 block mb-2">
          {format(data.date, 'MMMM d, yyyy')} /// {data.type.toUpperCase()}
        </span>

        {isCrash ? (
          <div className="max-w-md">
            <h2 className="text-4xl text-red-500 font-serif mb-4">
              Critical Failure
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              The moment of impact. Structural integrity compromised. Systems
              offline. The beginning of the descent.
            </p>
          </div>
        ) : isReturn ? (
          <div className="max-w-md ml-auto">
            <h2 className="text-4xl text-summit-gold font-serif mb-4">
              System Online
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Current operational status. Capacity restored to functional
              baselines. The ascent begins here.
            </p>
          </div>
        ) : (
          <div className="max-w-sm">
            {data.volume > 5 ? (
              <h3 className="text-2xl text-white font-serif mb-2">
                Building Load
              </h3>
            ) : (
              <h3 className="text-2xl text-zinc-600 font-serif mb-2">
                Recovery Protocol
              </h3>
            )}
            <p className="text-zinc-500 text-sm leading-relaxed">
              Weekly accumulate: {data.volume.toFixed(1)} hours.
              {data.volume > 5
                ? ' Increasing aerobic stress to stimulate adaptation.'
                : ' Focusing on stabilization and cellular repair.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
