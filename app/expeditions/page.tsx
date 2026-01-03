'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import {
  MapPin,
  Calendar,
  TrendingUp,
  Camera,
  CheckCircle,
  Target,
  Clock,
  Mountain,
  Thermometer,
  Timer,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Expedition {
  id: string;
  mountain: string;
  elevation: string;
  location: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  image: string;
  story: string;
  stats: {
    duration: string;
    difficulty: string;
    temperature: string;
  };
  year: string;
  isSevenSummit: boolean;
}

export default function ExpeditionsPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const expeditions: Expedition[] = [
    {
      id: 'everest',
      mountain: 'Mount Everest',
      elevation: '29,032 ft',
      location: 'Nepal/Tibet',
      date: 'March 2027',
      year: '2027',
      status: 'in-progress',
      image: '/images/sunith-everest-vision.png',
      story:
        'The ultimate challenge. Everything has led to this moment. Thirteen years of preparation, systematic training, and community support converge at the roof of the world.',
      stats: {
        duration: '60 days',
        difficulty: 'Extreme+',
        temperature: '-60°C death zone',
      },
      isSevenSummit: true,
    },
    {
      id: 'denali',
      mountain: 'Mount Denali',
      elevation: '20,310 ft',
      location: 'Alaska, USA',
      date: 'June 2025',
      year: '2025',
      status: 'completed',
      image: '/images/sunith-ascent-hero.png',
      story:
        'Latest Seven Summits achievement. Technical glacier travel and extreme conditions. Three weeks testing every skill learned so far.',
      stats: {
        duration: '21 days',
        difficulty: 'Extreme',
        temperature: '-40°C summit',
      },
      isSevenSummit: true,
    },
    {
      id: 'elbrus',
      mountain: 'Mount Elbrus',
      elevation: '18,510 ft',
      location: 'Russia, Europe',
      date: 'August 2024',
      year: '2024',
      status: 'completed',
      image: '/images/sunith-home-hero.jpg',
      story:
        'High altitude endurance test in the Andes. Battling 60mph winds and extreme dry cold to reach the roof of South America.',
      stats: {
        duration: '7 days',
        difficulty: 'Winter',
        temperature: '-25°C summit',
      },
      isSevenSummit: true,
    },
    {
      id: 'aconcagua',
      mountain: 'Mount Aconcagua',
      elevation: '22,837 ft',
      location: 'Argentina, South America',
      date: 'December 2024',
      year: '2024',
      status: 'completed',
      image: '/images/sunith-aconcagua.jpg',
      story:
        'Highest peak outside of Asia. Technical high-altitude climbing in extreme conditions. A major step toward the ultimate goal.',
      stats: {
        duration: '18 days',
        difficulty: 'High Altitude',
        temperature: '-30°C summit',
      },
      isSevenSummit: true,
    },
    {
      id: 'spangnak',
      mountain: 'Spangnak',
      elevation: '18,100 ft',
      location: 'Ladakh, India',
      date: 'September 2024',
      year: '2024',
      status: 'completed',
      image: '/images/Spangnak.jpg',
      story:
        'Remote peak in the Ladakh region. Building technical climbing skills and testing gear in harsh mountain conditions.',
      stats: {
        duration: '8 days',
        difficulty: 'Technical',
        temperature: '-20°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'mentok-kangri',
      mountain: 'Mentok Kangri I, II, III',
      elevation: '20,300 ft',
      location: 'Ladakh, India',
      date: 'August 2024',
      year: '2024',
      status: 'completed',
      image: '/images/Mentok.jpg',
      story:
        'Triple peak challenge in Ladakh. Technical climbing across three connected summits, testing endurance and multi-day high-altitude performance.',
      stats: {
        duration: '12 days',
        difficulty: 'Technical',
        temperature: '-25°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'kilimanjaro',
      mountain: 'Mount Kilimanjaro',
      elevation: '19,341 ft',
      location: 'Tanzania, Africa',
      date: 'February 2023',
      year: '2023',
      status: 'completed',
      image: '/stories/kilimanjaro.jpg',
      story:
        'First Seven Summits achievement. Years of preparation in the Himalayas led to this moment. Standing on the roof of Africa at sunrise, proof that systematic preparation works.',
      stats: {
        duration: '7 days',
        difficulty: 'Technical',
        temperature: '-15°C summit',
      },
      isSevenSummit: true,
    },
    {
      id: 'hampta-pass',
      mountain: 'Hampta Pass',
      elevation: '14,100 ft',
      location: 'Himachal Pradesh, India',
      date: 'September 2021',
      year: '2021',
      status: 'completed',
      image: '/images/Hampta.jpg',
      story:
        'A dramatic valley-to-valley crossing. This trek taught me about rapid elevation changes and diverse mountain ecosystems in a single journey.',
      stats: {
        duration: '5 days',
        difficulty: 'Intermediate',
        temperature: '0°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'sandakhphu',
      mountain: 'Sandakhphu',
      elevation: '11,930 ft',
      location: 'West Bengal, India',
      date: 'April 2021',
      year: '2021',
      status: 'completed',
      image: '/images/Sandakphu.jpg',
      story:
        'The highest peak in West Bengal, offering spectacular views of four 8000m peaks including Everest. A reminder of the ultimate goal on the horizon.',
      stats: {
        duration: '4 days',
        difficulty: 'Easy',
        temperature: '5°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'brahmatal',
      mountain: 'Brahmatal',
      elevation: '12,250 ft',
      location: 'Uttarakhand, India',
      date: 'January 2020',
      year: '2020',
      status: 'completed',
      image: '/images/Brahmatal.jpg',
      story:
        'Winter mountaineering experience. Learning to handle extreme cold and snow conditions - essential skills for the bigger mountains ahead.',
      stats: {
        duration: '6 days',
        difficulty: 'Winter',
        temperature: '-15°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'rupin-pass',
      mountain: 'Rupin Pass',
      elevation: '15,250 ft',
      location: 'Himachal Pradesh, India',
      date: 'May 2019',
      year: '2019',
      status: 'completed',
      image: '/images/Rupin.jpg',
      story:
        'One of the most beautiful and varied treks in the Himalayas. This journey took me through diverse landscapes and weather conditions, building versatility in mountain environments.',
      stats: {
        duration: '7 days',
        difficulty: 'Intermediate',
        temperature: '-5°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'stok-kangri',
      mountain: 'Stok Kangri',
      elevation: '20,187 ft',
      location: 'Ladakh, India',
      date: 'September 2018',
      year: '2018',
      status: 'completed',
      image: '/images/sunith-grit-training.png',
      story:
        'My first 6000m+ peak. Crossing the 20,000 ft threshold was a major milestone, proving I could handle serious altitude and technical climbing.',
      stats: {
        duration: '8 days',
        difficulty: 'High Altitude',
        temperature: '-20°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'everest-base-camp',
      mountain: 'Everest Base Camp',
      elevation: '17,598 ft',
      location: 'Nepal',
      date: 'October 2017',
      year: '2017',
      status: 'completed',
      image: '/images/EBC.jpg',
      story:
        "First encounter with the world's highest mountain. Standing at base camp, the dream of summiting Everest was born. This trek was a pilgrimage and a reconnaissance mission.",
      stats: {
        duration: '14 days',
        difficulty: 'Technical',
        temperature: '-15°C base camp',
      },
      isSevenSummit: false,
    },
    {
      id: 'goecha-la',
      mountain: 'Goecha La',
      elevation: '16,207 ft',
      location: 'Sikkim, India',
      date: 'May 2016',
      year: '2016',
      status: 'completed',
      image: '/images/GoeChela.JPG',
      story:
        'Close encounter with Kanchenjunga. This trek offered incredible views of the third highest peak in the world and deepened my connection with high-altitude environments.',
      stats: {
        duration: '8 days',
        difficulty: 'Intermediate',
        temperature: '-8°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'rookund',
      mountain: 'Rookund',
      elevation: '16,847 ft',
      location: 'Uttarakhand, India',
      date: 'October 2015',
      year: '2015',
      status: 'completed',
      image: '/images/Roopkund.jpg',
      story:
        'Building on the foundation from Sar Pass. Pushing higher into the Himalayas and testing my resilience at greater altitudes.',
      stats: {
        duration: '6 days',
        difficulty: 'Intermediate',
        temperature: '-10°C summit',
      },
      isSevenSummit: false,
    },
    {
      id: 'sar-pass',
      mountain: 'Sar Pass Trek',
      elevation: '13,845 ft',
      location: 'Himachal Pradesh, India',
      date: 'May 2014',
      year: '2014',
      status: 'completed',
      image: '/images/SarPass.jpg',
      story:
        'The spark that started everything. One year after being bedridden with tuberculosis, I stood on a Himalayan glacier. This moment changed my life forever.',
      stats: {
        duration: '5 days',
        difficulty: 'Beginner',
        temperature: '-5°C summit',
      },
      isSevenSummit: false,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Target;
      case 'planned':
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-summit-gold-900/10 text-summit-gold-400 border-summit-gold-500/20';
      case 'in-progress':
        return 'bg-white/10 text-white border-white/20';
      case 'planned':
        return 'bg-blue-900/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-summit-gold/30 hover:border-summit-gold/50';
      case 'in-progress':
        return 'border-white/30 hover:border-white/50 shadow-white/5';
      case 'planned':
        return 'border-blue-500/30 hover:border-blue-500/50';
      default:
        return 'border-gray-500/30';
    }
  };

  const getTimelineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-summit-gold-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
      case 'in-progress':
        return 'bg-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]';
      case 'planned':
        return 'bg-gray-700';
      default:
        return 'bg-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'SUMMIT ACHIEVED';
      case 'in-progress':
        return 'IN PREPARATION';
      case 'planned':
        return 'UPCOMING';
      default:
        return 'UNKNOWN';
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-summit-gold-900 selection:text-summit-gold-100">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stories/everest-prep.jpeg"
            alt="Seven Summits Expeditions"
            fill
            className="object-cover opacity-60 grayscale scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-obsidian"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-none">
              EXPEDITION
              <br />
              <span className="text-5xl md:text-7xl">ARCHIVE</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wider opacity-80 mb-12">
              From Recovery to Seven Summits
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm md:text-base font-mono uppercase tracking-widest text-gray-400">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-summit-gold-400" />
                <span>4/7 Complete</span>
              </div>
              <div className="w-px h-4 bg-gray-700"></div>
              <div className="flex items-center space-x-3">
                <Target className="w-4 h-4 text-white" />
                <span>3 Remaining</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/50">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase">
              Timeline
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 relative bg-obsidian">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
              THE JOURNEY
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto mb-6 opacity-60"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Each expedition represents a milestone in systematic preparation,
              personal growth, and the pursuit of seemingly impossible goals.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line - Premium Gold Gradient */}
            <div className="hidden md:block absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-summit-gold-500 via-white/20 to-blue-900/50 opacity-40"></div>

            <div className="space-y-12 md:space-y-24">
              {expeditions.map((expedition, index) => {
                const StatusIcon = getStatusIcon(expedition.status);
                const isExpanded = expandedCard === expedition.id;

                return (
                  <motion.div
                    key={expedition.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Timeline Node - Premium Design */}
                    <div
                      className={`hidden md:flex absolute left-[42px] top-8 w-3 h-3 rounded-full z-10 items-center justify-center`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${getTimelineColor(expedition.status)}`}
                      ></div>
                    </div>

                    {/* Year Label */}
                    <div className="mb-6 md:absolute md:left-24 md:-top-10 md:mb-0 z-30">
                      <div className="text-6xl md:text-8xl font-black text-white/5 md:text-right select-none pointer-events-none transition-colors duration-700 group-hover:text-white/10">
                        {expedition.year}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="md:ml-32">
                      <div
                        className={`group cursor-pointer border rounded-2xl overflow-hidden transition-all duration-500 ${getCardBorderColor(expedition.status)} ${
                          isExpanded
                            ? 'bg-glass-panel shadow-2xl scale-[1.01]'
                            : 'bg-white/5 hover:bg-glass-panel hover:scale-[1.005]'
                        }`}
                        onClick={() => toggleExpanded(expedition.id)}
                      >
                        {/* Main Card Content */}
                        <div className="flex flex-col md:grid md:grid-cols-5 gap-0 min-h-[400px] md:min-h-[450px]">
                          {/* Image Section */}
                          <div className="md:col-span-2 relative flex-1 md:h-auto overflow-hidden order-1 md:order-none">
                            <Image
                              src={expedition.image}
                              alt={`${expedition.mountain} expedition`}
                              fill
                              className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/40"></div>

                            {/* Status Badge */}
                            <div className="absolute top-6 left-6">
                              <div
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-widest uppercase ${getStatusColor(expedition.status)} backdrop-blur-md`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span>{getStatusLabel(expedition.status)}</span>
                              </div>
                            </div>

                            {/* Seven Summits Badge */}
                            {expedition.isSevenSummit && (
                              <div className="absolute top-16 left-6">
                                <div className="bg-summit-gold-500/90 text-black px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest shadow-lg shadow-summit-gold/20">
                                  SEVEN SUMMITS
                                </div>
                              </div>
                            )}

                            {/* Elevation */}
                            <div className="absolute bottom-6 left-6">
                              <div className="bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                                <div className="text-white text-xl font-light tracking-wide">
                                  {expedition.elevation}
                                </div>
                                <div className="text-gray-500 text-[10px] uppercase tracking-widest font-mono">
                                  Elevation
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between">
                            <div className="space-y-6 flex-1">
                              {/* Header */}
                              <div>
                                <h3 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-4">
                                  {expedition.mountain}
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 text-gray-400 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-summit-gold-500" />
                                    <span>{expedition.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-summit-gold-500" />
                                    <span>{expedition.date}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Story */}
                              <p className="text-gray-300 text-lg leading-relaxed font-light">
                                {expedition.story}
                              </p>

                              {/* Quick Stats */}
                              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                                    Duration
                                  </div>
                                  <div className="text-white font-light">
                                    {expedition.stats.duration}
                                  </div>
                                </div>
                                <div className="text-center border-l border-white/5">
                                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                                    Difficulty
                                  </div>
                                  <div className="text-white font-light">
                                    {expedition.stats.difficulty}
                                  </div>
                                </div>
                                <div className="text-center border-l border-white/5">
                                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                                    Temp
                                  </div>
                                  <div className="text-white font-light">
                                    {expedition.stats.temperature}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer / Expand */}
                            <div className="flex items-center justify-end pt-6 mt-4">
                              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-summit-gold-400 transition-colors">
                                <span>
                                  {isExpanded
                                    ? 'Close Details'
                                    : 'Mission Report'}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-white/5 bg-black/40 p-8 md:p-10"
                            >
                              <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
                                    <Award className="w-4 h-4 text-summit-gold-500" />
                                    <span>Key Achievements</span>
                                  </h4>
                                  <ul className="space-y-3 text-sm text-gray-300 font-light">
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        01
                                      </span>{' '}
                                      Successfully reached summit
                                    </li>
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        02
                                      </span>{' '}
                                      All safety protocols executed
                                    </li>
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        03
                                      </span>{' '}
                                      Weather window optimized
                                    </li>
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        04
                                      </span>{' '}
                                      Team coordination excellent
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-summit-gold-500" />
                                    <span>Lessons Learned</span>
                                  </h4>
                                  <ul className="space-y-3 text-sm text-gray-300 font-light">
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        01
                                      </span>{' '}
                                      High-altitude acclimatization
                                    </li>
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        02
                                      </span>{' '}
                                      Equipment performance testing
                                    </li>
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        03
                                      </span>{' '}
                                      Mental resilience building
                                    </li>
                                    <li className="flex items-start gap-3">
                                      <span className="text-summit-gold-500/50">
                                        04
                                      </span>{' '}
                                      Emergency protocol mastery
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            <div className="p-6">
              <div className="text-5xl font-light text-white mb-2">14</div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Expeditions
              </div>
            </div>
            <div className="p-6 border-l border-white/10">
              <div className="text-5xl font-light text-summit-gold-400 mb-2">
                4/7
              </div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Seven Summits
              </div>
            </div>
            <div className="p-6 border-l border-white/10">
              <div className="text-5xl font-light text-white mb-2">11</div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Years Journey
              </div>
            </div>
            <div className="p-6 border-l border-white/10">
              <div className="text-5xl font-light text-white mb-2">∞</div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Lessons
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
