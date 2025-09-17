'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  MapPinIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowRightIcon,
  PlayIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const expeditions = [
  {
    id: 'kilimanjaro-2023',
    name: 'Kilimanjaro',
    subtitle: 'First of the Seven Summits',
    elevation: '5,895m',
    location: 'Tanzania, Africa',
    date: 'March 2023',
    status: 'completed',
    difficulty: 'Moderate',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description:
      'My first step into the Seven Summits journey. A test of endurance, willpower, and the beginning of something extraordinary.',
    duration: '7 days',
    highlights: [
      'Machame Route',
      'Stella Point',
      'Uhuru Peak',
      'Barranco Wall',
    ],
    story:
      "Standing at Uhuru Peak at sunrise, watching the African plains stretch endlessly below, I knew this was just the beginning of an incredible journey through the world's highest mountains.",
    stats: {
      ascent: '4,900m',
      descent: '4,900m',
      distance: '62km',
      success: true,
    },
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'aconcagua-2024',
    name: 'Aconcagua',
    subtitle: 'Stone Sentinel of the Andes',
    elevation: '6,961m',
    location: 'Argentina, South America',
    date: 'January 2024',
    status: 'completed',
    difficulty: 'Challenging',
    image:
      'https://images.unsplash.com/photo-1464822759844-d150ad6d1a32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description:
      'The highest peak in South America taught me about patience, altitude, and the raw power of the Andes.',
    duration: '14 days',
    highlights: ['Base Camp', 'High Winds', 'Summit Day', 'Polish Glacier'],
    story:
      "At 22,837 feet, Aconcagua tested every skill I'd developed. The altitude, the weather, the sheer scale of the mountain - it was a masterclass in high-altitude mountaineering.",
    stats: {
      ascent: '3,400m',
      descent: '3,400m',
      distance: '45km',
      success: true,
    },
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'denali-2025',
    name: 'Denali',
    subtitle: 'The High One Awaits',
    elevation: '6,190m',
    location: 'Alaska, North America',
    date: 'June 2025',
    status: 'planned',
    difficulty: 'Extreme',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description:
      "Alaska's crown jewel and North America's highest peak. Technical climbing meets extreme weather in one of the world's most challenging ascents.",
    duration: '21 days',
    highlights: [
      'West Buttress',
      'Denali Pass',
      'Arctic Conditions',
      'Fixed Ropes',
    ],
    story:
      "The ultimate test of cold-weather mountaineering skills. Denali's technical challenges and brutal weather will push every limit.",
    stats: {
      ascent: '4,000m',
      descent: '4,000m',
      distance: '55km',
      success: null,
    },
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'everest-2026',
    name: 'Mount Everest',
    subtitle: 'The Ultimate Summit',
    elevation: '8,849m',
    location: 'Nepal/Tibet',
    date: 'Spring 2026',
    status: 'dreaming',
    difficulty: 'Legendary',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description:
      "The world's highest mountain. The pinnacle of mountaineering achievement and the ultimate goal of the Seven Summits quest.",
    duration: '60 days',
    highlights: [
      'Khumbu Icefall',
      'Death Zone',
      'Hillary Step',
      'Summit Ridge',
    ],
    story:
      'Every step of this journey has led to this moment. Everest represents not just a mountain, but the culmination of years of preparation, learning, and growth.',
    stats: {
      ascent: '3,500m',
      descent: '3,500m',
      distance: '40km',
      success: null,
    },
    color: 'from-yellow-400 to-orange-500',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-successGreen bg-successGreen/20';
    case 'planned':
      return 'text-alpineBlue bg-alpineBlue/20';
    case 'dreaming':
      return 'text-summitGold bg-summitGold/20';
    default:
      return 'text-white/60 bg-white/10';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Summited';
    case 'planned':
      return 'Planned';
    case 'dreaming':
      return 'Future Goal';
    default:
      return status;
  }
};

export default function ExpeditionsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedExpedition, setSelectedExpedition] = useState<string | null>(
    null
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  return (
    <main
      ref={ref}
      className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-summitGold/10 border border-summitGold/20 rounded-full px-4 py-2 text-sm text-summitGold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <TrophyIcon className="w-4 h-4" />
              Seven Summits Journey
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Epic <span className="text-summitGold">Expeditions</span>
            </h1>

            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              From first steps on Kilimanjaro to dreams of Everest&rsquo;s
              summit. Follow the complete Seven Summits journey through detailed
              expedition chronicles.
            </p>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              {
                icon: CheckIcon,
                label: 'Summits Completed',
                value: '2 of 7',
                color: 'text-successGreen',
              },
              {
                icon: ArrowTrendingUpIcon,
                label: 'Total Elevation',
                value: '12,856m',
                color: 'text-alpineBlue',
              },
              {
                icon: CalendarIcon,
                label: 'Years Active',
                value: '2023-2026',
                color: 'text-summitGold',
              },
              {
                icon: ClockIcon,
                label: 'Days on Mountain',
                value: '84 planned',
                color: 'text-purple-400',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center group"
              >
                <div
                  className={`inline-flex p-3 rounded-2xl bg-white/10 mb-4 ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expeditions Grid */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {expeditions.map((expedition, index) => (
              <motion.div
                key={expedition.id}
                variants={item}
                whileHover={{ scale: 1.02, y: -10 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedExpedition(expedition.id)}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                  {/* Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={expedition.image}
                      alt={expedition.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Status Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expedition.status)}`}
                    >
                      {getStatusText(expedition.status)}
                    </motion.div>

                    {/* Mountain Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {expedition.name}
                      </h3>
                      <p className="text-summitGold text-sm font-medium mb-2">
                        {expedition.subtitle}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/80">
                        <span className="flex items-center gap-1">
                          <ArrowTrendingUpIcon className="w-3 h-3" />
                          {expedition.elevation}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" />
                          {expedition.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {expedition.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-white/70 leading-relaxed mb-6">
                      {expedition.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {expedition.highlights
                        .slice(0, 3)
                        .map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                          >
                            {highlight}
                          </span>
                        ))}
                    </div>

                    {/* Stats */}
                    {expedition.status === 'completed' && (
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-2xl">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {expedition.stats.distance}
                          </div>
                          <div className="text-xs text-white/60">
                            Total Distance
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {expedition.duration}
                          </div>
                          <div className="text-xs text-white/60">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-successGreen">
                            ✓
                          </div>
                          <div className="text-xs text-white/60">Success</div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white/80 hover:text-summitGold transition-colors duration-300 group/button"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Read Full Story
                        </span>
                        <motion.div className="group-hover/button:translate-x-1 transition-transform duration-300">
                          <ArrowRightIcon className="w-4 h-4" />
                        </motion.div>
                      </motion.button>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                        >
                          <HeartIcon className="w-4 h-4 text-white/60 hover:text-red-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                        >
                          <ShareIcon className="w-4 h-4 text-white/60 hover:text-alpineBlue" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${expedition.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                    />
                  </div>
                </div>

                {/* External Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${expedition.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white text-black font-semibold rounded-2xl overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                <PlayIcon className="w-5 h-5" />
                Watch Expedition Documentary
                <motion.div className="group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.div>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-summitGold to-yellow-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
