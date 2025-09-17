'use client';

import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface Summit {
  name: string;
  elevation: string;
  continent: string;
  status: 'completed' | 'in_progress' | 'planned';
  completedDate?: string;
  targetDate?: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  flag: string;
}

const sevenSummits: Summit[] = [
  {
    name: 'Mount Elbrus',
    elevation: '5,642m',
    continent: 'Europe',
    status: 'completed',
    completedDate: 'July 2022',
    description:
      'The highest peak in Europe, conquered during summer climbing season.',
    difficulty: 3,
    flag: '🇷🇺',
  },
  {
    name: 'Mount Kilimanjaro',
    elevation: '5,895m',
    continent: 'Africa',
    status: 'completed',
    completedDate: 'March 2023',
    description:
      "Africa's rooftop. An incredible journey through five climate zones.",
    difficulty: 2,
    flag: '🇹🇿',
  },
  {
    name: 'Aconcagua',
    elevation: '6,961m',
    continent: 'South America',
    status: 'completed',
    completedDate: 'December 2023',
    description: 'The Stone Sentinel. My first real test at high altitude.',
    difficulty: 4,
    flag: '🇦🇷',
  },
  {
    name: 'Mount McKinley',
    elevation: '6,190m',
    continent: 'North America',
    status: 'planned',
    targetDate: 'June 2025',
    description: 'Denali - the ultimate cold weather and technical challenge.',
    difficulty: 5,
    flag: '🇺🇸',
  },
  {
    name: 'Carstensz Pyramid',
    elevation: '4,884m',
    continent: 'Oceania',
    status: 'planned',
    targetDate: 'September 2026',
    description: 'The technical climb. More rock climbing than mountaineering.',
    difficulty: 5,
    flag: '🇮🇩',
  },
  {
    name: 'Mount Vinson',
    elevation: '4,892m',
    continent: 'Antarctica',
    status: 'planned',
    targetDate: 'December 2026',
    description:
      'The bottom of the world. Logistics and isolation are the main challenges.',
    difficulty: 4,
    flag: '🇦🇶',
  },
  {
    name: 'Mount Everest',
    elevation: '8,849m',
    continent: 'Asia',
    status: 'in_progress',
    targetDate: 'May 2027',
    description: 'The ultimate goal. Everything leads to this moment.',
    difficulty: 5,
    flag: '🇳🇵',
  },
];

const statusColors = {
  completed: 'text-successGreen',
  in_progress: 'text-summitGold',
  planned: 'text-white/60',
};

const statusBackgrounds = {
  completed: 'bg-successGreen/20 border-successGreen/30',
  in_progress: 'bg-summitGold/20 border-summitGold/30',
  planned: 'bg-white/5 border-white/10',
};

export default function SevenSummitsTracker() {
  const completedCount = sevenSummits.filter(
    (s) => s.status === 'completed'
  ).length;
  const progressPercentage = (completedCount / 7) * 100;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-6"
          >
            <TrophyIcon className="w-4 h-4 text-summitGold" />
            Seven Summits Progress
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My Journey to the{' '}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Top of Each Continent
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            The Seven Summits represent the highest peaks on each continent.
            Follow my progress as I work toward completing this legendary
            mountaineering challenge.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress</span>
              <span>{completedCount} of 7 summits</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-summitGold to-yellow-400 rounded-full"
              />
            </div>
            <div className="text-center mt-2 text-2xl font-bold text-summitGold">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </motion.div>

        {/* Summits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sevenSummits.map((summit, index) => (
            <motion.div
              key={summit.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${statusBackgrounds[summit.status]}`}
            >
              {/* Status Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {summit.status === 'completed' && (
                    <CheckCircleIcon className="w-5 h-5 text-successGreen" />
                  )}
                  {summit.status === 'in_progress' && (
                    <ClockIcon className="w-5 h-5 text-summitGold" />
                  )}
                  {summit.status === 'planned' && (
                    <CalendarIcon className="w-5 h-5 text-white/60" />
                  )}
                  <span
                    className={`text-xs font-medium uppercase tracking-wide ${statusColors[summit.status]}`}
                  >
                    {summit.status === 'in_progress' ? 'Active' : summit.status}
                  </span>
                </div>
                <span className="text-2xl">{summit.flag}</span>
              </div>

              {/* Summit Info */}
              <h3 className="text-xl font-bold text-white mb-2">
                {summit.name}
              </h3>
              <p className="text-white/60 text-sm mb-3">{summit.continent}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-white/80">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {summit.elevation}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < summit.difficulty ? 'bg-red-500' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                {summit.description}
              </p>

              {/* Date */}
              <div className="text-sm">
                {summit.completedDate && (
                  <span className="text-successGreen font-medium">
                    ✓ Completed {summit.completedDate}
                  </span>
                )}
                {summit.targetDate && summit.status !== 'completed' && (
                  <span
                    className={`font-medium ${statusColors[summit.status]}`}
                  >
                    Target: {summit.targetDate}
                  </span>
                )}
              </div>

              {/* Hover Glow Effect */}
              {summit.status === 'completed' && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-successGreen/10 to-summitGold/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
              )}
              {summit.status === 'in_progress' && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-summitGold/10 to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Follow the Journey
            </h3>
            <p className="text-white/70 mb-6">
              Get exclusive insights from my expeditions, training updates, and
              gear recommendations as I work toward completing the Seven
              Summits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Subscribe to Updates
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
              >
                View Training Data
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
