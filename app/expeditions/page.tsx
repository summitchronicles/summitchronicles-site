'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { MapPin, Calendar, TrendingUp, Camera } from 'lucide-react';

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
}

export default function ExpeditionsPage() {
  const expeditions: Expedition[] = [
    {
      id: 'kilimanjaro',
      mountain: 'Mount Kilimanjaro',
      elevation: '19,341 ft',
      location: 'Tanzania, Africa',
      date: 'June 2023',
      status: 'completed',
      image: '/stories/kilimanjaro.jpg',
      story: 'First summit. The moment everything changed. Standing on the roof of Africa at sunrise, I understood what systematic preparation could achieve.',
      stats: {
        duration: '7 days',
        difficulty: 'Technical',
        temperature: '-15°C summit'
      }
    },
    {
      id: 'whitney',
      mountain: 'Mount Whitney',
      elevation: '14,505 ft',
      location: 'California, USA',
      date: 'August 2024',
      status: 'completed',
      image: '/stories/data-training.jpg',
      story: 'Redemption climb. The mountain that broke me became the mountain that taught me resilience. Technical alpine preparation for the challenges ahead.',
      stats: {
        duration: '3 days',
        difficulty: 'Alpine',
        temperature: '-8°C summit'
      }
    },
    {
      id: 'washington',
      mountain: 'Mount Washington',
      elevation: '6,288 ft',
      location: 'New Hampshire, USA',
      date: 'December 2024',
      status: 'completed',
      image: '/stories/everest-prep.jpg',
      story: 'Winter conditions mastery. Learning to navigate extreme weather, white-out conditions, and sub-zero temperatures. Essential skills for Everest.',
      stats: {
        duration: '2 days',
        difficulty: 'Winter',
        temperature: '-25°C summit'
      }
    },
    {
      id: 'denali',
      mountain: 'Denali',
      elevation: '20,310 ft',
      location: 'Alaska, USA',
      date: 'June 2025',
      status: 'in-progress',
      image: '/stories/data-training.jpg',
      story: 'The major test before Everest. Three weeks on North America\'s highest peak. High-altitude acclimatization and expedition logistics.',
      stats: {
        duration: '21 days',
        difficulty: 'Extreme',
        temperature: '-40°C expected'
      }
    },
    {
      id: 'aconcagua',
      mountain: 'Aconcagua',
      elevation: '22,837 ft',
      location: 'Argentina',
      date: 'January 2026',
      status: 'planned',
      image: '/stories/kilimanjaro.jpg',
      story: 'South America\'s giant. Final altitude preparation before the ultimate challenge. Testing high-altitude performance without supplemental oxygen.',
      stats: {
        duration: '18 days',
        difficulty: 'High Altitude',
        temperature: '-30°C expected'
      }
    },
    {
      id: 'everest',
      mountain: 'Mount Everest',
      elevation: '29,032 ft',
      location: 'Nepal/Tibet',
      date: 'March 2027',
      status: 'planned',
      image: '/stories/everest-prep.jpg',
      story: 'The ultimate challenge. Everything has led to this moment. Seven years of preparation, systematic training, and community support converge at the roof of the world.',
      stats: {
        duration: '60 days',
        difficulty: 'Extreme+',
        temperature: '-60°C death zone'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-yellow-500';
      case 'planned': return 'text-blue-500';
      default: return 'text-gray-500';
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/stories/everest-prep.jpg"
            alt="Seven Summits Expeditions"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-4">
              EXPEDITIONS
            </h1>
            <p className="text-xl font-light tracking-wider opacity-90">
              Seven Summits • One Systematic Journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expeditions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-12">
            {expeditions.map((expedition, index) => (
              <motion.div
                key={expedition.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-96 overflow-hidden ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <img
                      src={expedition.image}
                      alt={`${expedition.mountain} expedition`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <div className={`px-3 py-1 text-xs font-medium tracking-wider uppercase ${getStatusColor(expedition.status)} bg-black/70 rounded`}>
                        {getStatusLabel(expedition.status)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`flex flex-col justify-center space-y-6 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-2">
                        {expedition.mountain}
                      </h2>
                      <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{expedition.elevation}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{expedition.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{expedition.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-300 leading-relaxed font-light">
                      {expedition.story}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                      <div>
                        <div className="text-2xl font-light text-white mb-1">
                          {expedition.stats.duration}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Duration</div>
                      </div>
                      <div>
                        <div className="text-2xl font-light text-white mb-1">
                          {expedition.stats.difficulty}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Difficulty</div>
                      </div>
                      <div>
                        <div className="text-2xl font-light text-white mb-1">
                          {expedition.stats.temperature}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Min Temp</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
              Support the Journey
            </h3>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Every expedition requires community support. Your contribution funds safety equipment, 
              training, and the preparation needed to come home safely.
            </p>
            <a
              href="/support"
              className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 font-medium tracking-wide hover:bg-gray-200 transition-colors"
            >
              <span>Support the Mission</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}