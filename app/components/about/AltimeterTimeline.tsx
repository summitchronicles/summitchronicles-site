'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { CheckCircle2, Circle, Mountain } from 'lucide-react';

interface Expedition {
  year: string;
  mountain: string;
  elevation: string;
  location: string;
  status: 'completed' | 'upcoming';
  description: string;
}

const expeditions: Expedition[] = [
  {
    year: '2023',
    mountain: 'KILIMANJARO',
    elevation: '19,341 ft',
    location: 'Africa',
    status: 'completed',
    description:
      'The first step. High altitude acclimation and team dynamics test.',
  },
  {
    year: '2024',
    mountain: 'ELBRUS',
    elevation: '18,510 ft',
    location: 'Europe',
    status: 'completed',
    description: 'Technical snow climbing and weather endurance in Russia.',
  },
  {
    year: '2024',
    mountain: 'ACONCAGUA',
    elevation: '22,837 ft',
    location: 'South America',
    status: 'completed',
    description: 'The highest peak outside Asia. Pure physical endurance.',
  },
  {
    year: '2025',
    mountain: 'DENALI',
    elevation: '20,310 ft',
    location: 'North America',
    status: 'completed',
    description: 'Unforgiving arctic conditions. Technical glacier travel.',
  },
  {
    year: '2028',
    mountain: 'EVEREST',
    elevation: '29,032 ft',
    location: 'Asia',
    status: 'upcoming',
    description: 'The ultimate ceiling. The culmination of the journey.',
  },
  {
    year: '2029',
    mountain: 'VINSON MASSIF',
    elevation: '16,050 ft',
    location: 'Antarctica',
    status: 'upcoming',
    description: 'The bottom of the world. Extreme cold logistics.',
  },
  {
    year: '2030',
    mountain: 'KOSCIUSZKO',
    elevation: '7,310 ft',
    location: 'ANZ',
    status: 'upcoming',
    description: 'Snow down under',
  },
];

export const AltimeterTimeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative py-20 px-4 md:px-0">
      {/* Central Line */}
      <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gray-800 transform md:-translate-x-1/2"></div>

      {/* Animated Progress Line */}
      <motion.div
        style={{ height: lineHeight }}
        className="absolute left-[20px] md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-summit-gold-600 to-summit-gold-300 transform md:-translate-x-1/2 origin-top"
      />

      <div className="space-y-24">
        {expeditions.map((exp, index) => {
          const isLeft = index % 2 === 0;
          const isDone = exp.status === 'completed';

          // Create a ref for this specific item
          const ItemContent = () => {
            const itemRef = useRef(null);
            const isInView = useInView(itemRef, {
              once: false,
              margin: '-20%',
            });

            return (
              <motion.div
                ref={itemRef}
                key={exp.mountain}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-start md:items-center w-full relative ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12 text-left md:text-right">
                  <div className={`md:${isLeft ? 'text-right' : 'text-left'}`}>
                    <div className="inline-block px-3 py-1 mb-2 text-xs font-mono text-summit-gold-400 border border-summit-gold-900/50 rounded-full bg-summit-gold-900/10">
                      {exp.elevation}
                    </div>
                    <h3
                      className={`text-2xl font-oswald tracking-wider font-light mb-1 transition-colors duration-500 ${
                        isInView ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {exp.mountain}
                    </h3>
                    <div
                      className={`text-sm tracking-widest uppercase mb-4 transition-colors duration-500 ${
                        isInView ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {exp.location} • {exp.year}
                    </div>
                    <p className="text-gray-400 font-light text-sm max-w-sm ml-0 md:ml-auto">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-[11px] md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 z-10 transition-all duration-500 ${
                      isInView
                        ? 'bg-black border-summit-gold-500'
                        : isDone
                          ? 'bg-black border-summit-gold-500/50'
                          : 'bg-black border-gray-700'
                    }`}
                  >
                    {isDone && isInView && (
                      <div className="w-full h-full bg-summit-gold-500 rounded-full animate-pulse opacity-50"></div>
                    )}
                  </div>
                </div>

                {/* Empty space for balance */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          };

          return <ItemContent key={exp.mountain} />;
        })}
      </div>
    </div>
  );
};
