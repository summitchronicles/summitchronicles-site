'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  Mountain,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Target,
} from 'lucide-react';
import { getDaysToEverest } from '@/lib/everest-countdown';

const STATS_DATA: StatItem[] = [
  {
    icon: Mountain,
    label: 'Seven Summits Progress',
    value: 4,
    suffix: '/7',
    description: "World's highest peaks conquered",
    color: 'text-summit-gold',
  },
  {
    icon: Calendar,
    label: 'Days to Everest',
    value: getDaysToEverest(),
    description: 'Spring 2028 expedition countdown',
    color: 'text-blue-400',
  },
  {
    icon: MapPin,
    label: 'Countries Explored',
    value: 12,
    description: 'Through mountaineering expeditions',
    color: 'text-green-400',
  },
  {
    icon: Trophy,
    label: 'Completion Rate',
    value: 57,
    suffix: '%',
    description: 'Seven Summits progress',
    color: 'text-summit-gold',
  },
  {
    icon: Clock,
    label: 'Years Climbing',
    value: 8,
    description: 'From first summit to present',
    color: 'text-purple-400',
  },
  {
    icon: Target,
    label: 'Next Summit',
    value: 'Everest',
    description: 'The ultimate challenge ahead',
    color: 'text-red-400',
  },
];

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  suffix?: string;
  description: string;
  color: string;
}

interface InteractiveStatsGridProps {
  className?: string;
}

export function InteractiveStatsGrid({
  className = '',
}: InteractiveStatsGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (isInView) {
      const animateValue = (
        start: number,
        end: number,
        duration: number,
        key: string
      ) => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(start + (end - start) * easeOut);

          setAnimatedValues((prev) => ({ ...prev, [key]: currentValue }));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      };

      STATS_DATA.forEach((stat, index) => {
        if (typeof stat.value === 'number') {
          setTimeout(() => {
            animateValue(0, Number(stat.value), 2000, `stat-${index}`);
          }, index * 200);
        }
      });
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      className={`py-20 bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Journey in Numbers
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Every summit tells a story. Every challenge shapes character. Here's
            the quantified journey of pursuing the Seven Summits.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {STATS_DATA.map((stat, index) => {
            const IconComponent = stat.icon;
            const isNumeric = typeof stat.value === 'number';
            const displayValue = isNumeric
              ? animatedValues[`stat-${index}`] || 0
              : stat.value;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mb-6 bg-slate-900 rounded-2xl group-hover:bg-slate-800 transition-colors duration-300">
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>

                  {/* Value */}
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-slate-900 flex items-baseline">
                      <span className={stat.color}>{displayValue}</span>
                      {stat.suffix && (
                        <span className="text-2xl text-slate-600 ml-1">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mt-2">
                      {stat.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Hover Accent */}
                  <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-summit-gold to-summit-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-slate-600 mb-8">
            Each number represents countless hours of training, preparation, and
            determination
          </p>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <div className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-colors cursor-pointer">
              Explore the Full Journey →
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
