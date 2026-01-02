'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  ChevronUp
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
      image: '/stories/everest-prep.jpeg',
      story: 'The ultimate challenge. Everything has led to this moment. Thirteen years of preparation, systematic training, and community support converge at the roof of the world.',
      stats: {
        duration: '60 days',
        difficulty: 'Extreme+',
        temperature: '-60°C death zone'
      },
      isSevenSummit: true
    },
    {
      id: 'denali',
      mountain: 'Mount Denali',
      elevation: '20,310 ft',
      location: 'Alaska, USA',
      date: 'June 2025',
      year: '2025',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Latest Seven Summits achievement. Technical glacier travel and extreme conditions. Three weeks testing every skill learned so far.',
      stats: {
        duration: '21 days',
        difficulty: 'Extreme',
        temperature: '-40°C summit'
      },
      isSevenSummit: true
    },
    {
      id: 'elbrus',
      mountain: 'Mount Elbrus',
      elevation: '18,510 ft',
      location: 'Russia, Europe',
      date: 'August 2024',
      year: '2024',
      status: 'completed',
      image: '/stories/everest-prep.jpeg',
      story: 'European summit in extreme cold conditions. Mastering cold weather mountaineering and building mental resilience for the Seven Summits challenge.',
      stats: {
        duration: '7 days',
        difficulty: 'Winter',
        temperature: '-25°C summit'
      },
      isSevenSummit: true
    },
    {
      id: 'aconcagua',
      mountain: 'Mount Aconcagua',
      elevation: '22,837 ft',
      location: 'Argentina, South America',
      date: 'December 2024',
      year: '2024',
      status: 'completed',
      image: '/stories/kilimanjaro.jpg',
      story: 'Highest peak outside of Asia. Technical high-altitude climbing in extreme conditions. A major step toward the ultimate goal.',
      stats: {
        duration: '18 days',
        difficulty: 'High Altitude',
        temperature: '-30°C summit'
      },
      isSevenSummit: true
    },
    {
      id: 'spangnak',
      mountain: 'Spangnak',
      elevation: '18,100 ft',
      location: 'Ladakh, India',
      date: 'September 2024',
      year: '2024',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Remote peak in the Ladakh region. Building technical climbing skills and testing gear in harsh mountain conditions.',
      stats: {
        duration: '8 days',
        difficulty: 'Technical',
        temperature: '-20°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'mentok-kangri',
      mountain: 'Mentok Kangri I, II, III',
      elevation: '20,300 ft',
      location: 'Ladakh, India',
      date: 'August 2024',
      year: '2024',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Triple peak challenge in Ladakh. Technical climbing across three connected summits, testing endurance and multi-day high-altitude performance.',
      stats: {
        duration: '12 days',
        difficulty: 'Technical',
        temperature: '-25°C summit'
      },
      isSevenSummit: false
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
      story: 'First Seven Summits achievement. Years of preparation in the Himalayas led to this moment. Standing on the roof of Africa at sunrise, proof that systematic preparation works.',
      stats: {
        duration: '7 days',
        difficulty: 'Technical',
        temperature: '-15°C summit'
      },
      isSevenSummit: true
    },
    {
      id: 'hampta-pass',
      mountain: 'Hampta Pass',
      elevation: '14,100 ft',
      location: 'Himachal Pradesh, India',
      date: 'September 2021',
      year: '2021',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'A dramatic valley-to-valley crossing. This trek taught me about rapid elevation changes and diverse mountain ecosystems in a single journey.',
      stats: {
        duration: '5 days',
        difficulty: 'Intermediate',
        temperature: '0°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'sandakhphu',
      mountain: 'Sandakhphu',
      elevation: '11,930 ft',
      location: 'West Bengal, India',
      date: 'April 2021',
      year: '2021',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'The highest peak in West Bengal, offering spectacular views of four 8000m peaks including Everest. A reminder of the ultimate goal on the horizon.',
      stats: {
        duration: '4 days',
        difficulty: 'Easy',
        temperature: '5°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'brahmatal',
      mountain: 'Brahmatal',
      elevation: '12,250 ft',
      location: 'Uttarakhand, India',
      date: 'January 2020',
      year: '2020',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Winter mountaineering experience. Learning to handle extreme cold and snow conditions - essential skills for the bigger mountains ahead.',
      stats: {
        duration: '6 days',
        difficulty: 'Winter',
        temperature: '-15°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'rupin-pass',
      mountain: 'Rupin Pass',
      elevation: '15,250 ft',
      location: 'Himachal Pradesh, India',
      date: 'May 2019',
      year: '2019',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'One of the most beautiful and varied treks in the Himalayas. This journey took me through diverse landscapes and weather conditions, building versatility in mountain environments.',
      stats: {
        duration: '7 days',
        difficulty: 'Intermediate',
        temperature: '-5°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'stok-kangri',
      mountain: 'Stok Kangri',
      elevation: '20,187 ft',
      location: 'Ladakh, India',
      date: 'September 2018',
      year: '2018',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'My first 6000m+ peak. Crossing the 20,000 ft threshold was a major milestone, proving I could handle serious altitude and technical climbing.',
      stats: {
        duration: '8 days',
        difficulty: 'High Altitude',
        temperature: '-20°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'everest-base-camp',
      mountain: 'Everest Base Camp',
      elevation: '17,598 ft',
      location: 'Nepal',
      date: 'October 2017',
      year: '2017',
      status: 'completed',
      image: '/stories/everest-prep.jpeg',
      story: 'First encounter with the world\'s highest mountain. Standing at base camp, the dream of summiting Everest was born. This trek was a pilgrimage and a reconnaissance mission.',
      stats: {
        duration: '14 days',
        difficulty: 'Technical',
        temperature: '-15°C base camp'
      },
      isSevenSummit: false
    },
    {
      id: 'goecha-la',
      mountain: 'Goecha La',
      elevation: '16,207 ft',
      location: 'Sikkim, India',
      date: 'May 2016',
      year: '2016',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Close encounter with Kanchenjunga. This trek offered incredible views of the third highest peak in the world and deepened my connection with high-altitude environments.',
      stats: {
        duration: '8 days',
        difficulty: 'Intermediate',
        temperature: '-8°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'rookund',
      mountain: 'Rookund',
      elevation: '16,847 ft',
      location: 'Uttarakhand, India',
      date: 'October 2015',
      year: '2015',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Building on the foundation from Sar Pass. Pushing higher into the Himalayas and testing my resilience at greater altitudes.',
      stats: {
        duration: '6 days',
        difficulty: 'Intermediate',
        temperature: '-10°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'sar-pass',
      mountain: 'Sar Pass Trek',
      elevation: '13,845 ft',
      location: 'Himachal Pradesh, India',
      date: 'May 2014',
      year: '2014',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'The spark that started everything. One year after being bedridden with tuberculosis, I stood on a Himalayan glacier. This moment changed my life forever.',
      stats: {
        duration: '5 days',
        difficulty: 'Beginner',
        temperature: '-5°C summit'
      },
      isSevenSummit: false
    },
    {
      id: 'vinson',
      mountain: 'Mount Vinson',
      elevation: '16,050 ft',
      location: 'Antarctica',
      date: 'December 2027',
      year: '2027',
      status: 'planned',
      image: '/stories/everest-prep.jpeg',
      story: 'The most remote and logistically challenging summit. Continuing the Seven Summits challenge in the most isolated continent.',
      stats: {
        duration: '14 days',
        difficulty: 'Extreme',
        temperature: '-50°C summit'
      },
      isSevenSummit: true
    },
    {
      id: 'carstensz',
      mountain: 'Carstensz Pyramid',
      elevation: '16,024 ft',
      location: 'Indonesia, Oceania',
      date: 'June 2028',
      year: '2028',
      status: 'planned',
      image: '/stories/data-training.jpg',
      story: 'The technical rock climbing challenge at altitude. Completing the Seven Summits with the most technically demanding peak.',
      stats: {
        duration: '10 days',
        difficulty: 'Technical Rock',
        temperature: '+5°C summit'
      },
      isSevenSummit: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Target;
      case 'planned': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/30 hover:border-green-500/50';
      case 'in-progress': return 'border-yellow-500/50 hover:border-yellow-500/70 shadow-yellow-500/20';
      case 'planned': return 'border-blue-500/30 hover:border-blue-500/50';
      default: return 'border-gray-500/30';
    }
  };

  const getTimelineColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500 animate-pulse';
      case 'planned': return 'bg-blue-500/50';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'SUMMIT ACHIEVED';
      case 'in-progress': return 'IN PREPARATION';
      case 'planned': return 'UPCOMING';
      default: return 'UNKNOWN';
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-spa-stone text-spa-charcoal">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/stories/everest-prep.jpeg"
            alt="Seven Summits Expeditions"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-8 leading-tight">
              EXPEDITION
              <br />
              <span className="text-5xl md:text-7xl">TIMELINE</span>
            </h1>
            <p className="text-2xl md:text-3xl font-light tracking-wider opacity-90 mb-8">
              From Recovery to Seven Summits
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>4 Seven Summits Complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-yellow-400" />
                <span>3 More to Go</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="text-sm tracking-wider mb-3">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative bg-spa-stone">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-spa-charcoal">
              THE JOURNEY
            </h2>
            <div className="h-px w-32 bg-spa-charcoal/20 mx-auto mb-6"></div>
            <p className="text-xl text-spa-slate max-w-3xl mx-auto">
              Each expedition represents a milestone in systematic preparation,
              personal growth, and the pursuit of seemingly impossible goals.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-summit-gold-500 to-alpine-blue-500/50"></div>

            <div className="space-y-8 md:space-y-16">
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
                    {/* Timeline Node - Hidden on mobile */}
                    <div className={`hidden md:block absolute left-10 top-8 w-4 h-4 rounded-full border-4 border-white shadow-sm ${getTimelineColor(expedition.status)} z-10`}>
                    </div>

                    {/* Year Label - Better positioning to avoid conflicts */}
                    <div className="mb-6 md:absolute md:left-20 md:-top-8 md:mb-0 z-30">
                      <div className="bg-gradient-to-r from-summit-gold-400 to-orange-400 text-white text-3xl md:text-4xl font-black px-4 py-2 rounded-lg shadow-lg border-2 border-white text-center md:text-left inline-block">
                        {expedition.year}
                      </div>
                    </div>

                    {/* Card - Full width on mobile, offset on desktop */}
                    <div className="md:ml-32">
                      <div
                        className={`group cursor-pointer border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-spa-elevated ${getCardBorderColor(expedition.status).replace('border-gray-500/30', 'border-gray-100')} ${
                          isExpanded ? 'shadow-spa-elevated scale-[1.02]' : 'shadow-spa-soft hover:scale-[1.01]'
                        } bg-white`}
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
                              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                            {/* Status Badge - Better positioning */}
                            <div className="absolute top-4 left-4">
                              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md text-xs font-medium shadow-sm ${getStatusColor(expedition.status).replace('bg-', 'bg-black/40 text-white ')}`}>
                                <StatusIcon className="w-3 h-3 text-white" />
                                <span className="text-white drop-shadow-md">{getStatusLabel(expedition.status)}</span>
                              </div>
                            </div>

                            {/* Seven Summits Badge - Repositioned */}
                            {expedition.isSevenSummit && (
                              <div className="absolute top-16 left-4">
                                <div className="bg-gradient-to-r from-summit-gold-500/90 to-orange-500/90 border border-summit-gold-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                  SEVEN SUMMITS
                                </div>
                              </div>
                            )}

                            {/* Elevation - Better spacing and positioning */}
                            <div className="absolute bottom-4 left-4">
                              <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 shadow-lg">
                                <div className="text-white text-lg font-bold">
                                  {expedition.elevation}
                                </div>
                                <div className="text-white/90 text-xs uppercase tracking-wide">
                                  Elevation
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="md:col-span-3 p-6 md:p-8 bg-white order-2 md:order-none flex flex-col justify-between">
                            <div className="space-y-4 md:space-y-6 flex-1">
                              {/* Header */}
                              <div>
                                <h3 className="text-2xl md:text-4xl font-light tracking-wide text-spa-charcoal mb-3">
                                  {expedition.mountain}
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-spa-slate">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-alpine-blue-500" />
                                    <span className="text-base md:text-lg">{expedition.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-summit-gold-500" />
                                    <span className="text-base md:text-lg">{expedition.date}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Story */}
                              <p className="text-spa-slate text-base md:text-lg leading-relaxed">
                                {expedition.story}
                              </p>

                              {/* Quick Stats */}
                              <div className="grid grid-cols-3 gap-2 md:gap-4">
                                <div className="text-center p-2 md:p-3 bg-alpine-blue-50 rounded-lg border border-alpine-blue-100">
                                  <Timer className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2 text-alpine-blue-500" />
                                  <div className="text-xs md:text-sm text-spa-slate">Duration</div>
                                  <div className="text-sm md:text-base text-spa-charcoal font-medium">{expedition.stats.duration}</div>
                                </div>
                                <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg border border-green-100">
                                  <Mountain className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2 text-green-500" />
                                  <div className="text-xs md:text-sm text-spa-slate">Difficulty</div>
                                  <div className="text-sm md:text-base text-spa-charcoal font-medium">{expedition.stats.difficulty}</div>
                                </div>
                                <div className="text-center p-2 md:p-3 bg-red-50 rounded-lg border border-red-100">
                                  <Thermometer className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2 text-red-500" />
                                  <div className="text-xs md:text-sm text-spa-slate">Temperature</div>
                                  <div className="text-sm md:text-base text-spa-charcoal font-medium">{expedition.stats.temperature}</div>
                                </div>
                              </div>

                              {/* Expand Button */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-xs md:text-sm text-spa-slate">
                                  Click to {isExpanded ? 'collapse' : 'expand'} details
                                </div>
                                <div className="flex items-center space-x-2 text-spa-slate">
                                  {isExpanded ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-100 bg-spa-stone/30 p-4 md:p-8"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                              <div>
                                <h4 className="text-lg md:text-xl font-light text-spa-charcoal mb-3 md:mb-4 flex items-center space-x-2">
                                  <Award className="w-4 h-4 md:w-5 md:h-5 text-summit-gold-500" />
                                  <span>Key Achievements</span>
                                </h4>
                                <ul className="space-y-1 md:space-y-2 text-sm md:text-base text-spa-slate">
                                  <li>• Successfully reached summit</li>
                                  <li>• All safety protocols executed</li>
                                  <li>• Weather window optimized</li>
                                  <li>• Team coordination excellent</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-lg md:text-xl font-light text-spa-charcoal mb-3 md:mb-4 flex items-center space-x-2">
                                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                  <span>Lessons Learned</span>
                                </h4>
                                <ul className="space-y-1 md:space-y-2 text-sm md:text-base text-spa-slate">
                                  <li>• High-altitude acclimatization</li>
                                  <li>• Equipment performance testing</li>
                                  <li>• Mental resilience building</li>
                                  <li>• Emergency protocol mastery</li>
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
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
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            <div className="bg-white rounded-2xl p-8 border border-green-200 shadow-spa-soft">
              <div className="text-4xl font-light text-green-600 mb-2">14</div>
              <div className="text-spa-slate">Expeditions Complete</div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-summit-gold-200 shadow-spa-soft">
              <div className="text-4xl font-light text-summit-gold-500 mb-2">4/7</div>
              <div className="text-spa-slate">Seven Summits</div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-alpine-blue-200 shadow-spa-soft">
              <div className="text-4xl font-light text-alpine-blue-500 mb-2">11</div>
              <div className="text-spa-slate">Years Journey</div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-purple-200 shadow-spa-soft">
              <div className="text-4xl font-light text-purple-600 mb-2">∞</div>
              <div className="text-spa-slate">Lessons Learned</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
