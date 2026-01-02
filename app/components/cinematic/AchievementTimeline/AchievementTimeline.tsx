'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Mountain,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';
import { getDaysToEverest } from '@/lib/everest-countdown';

interface Summit {
  id: string;
  name: string;
  elevation: string;
  location: string;
  continent: string;
  status: 'completed' | 'current' | 'planned';
  date?: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lessons?: string;
  image?: string;
}

interface AchievementTimelineProps {
  className?: string;
}

export function AchievementTimeline({
  className = '',
}: AchievementTimelineProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedSummit, setSelectedSummit] = useState<string | null>(null);

  const summits: Summit[] = [
    {
      id: 'sar-pass',
      name: 'Sar Pass Trek',
      elevation: '4,220m',
      location: 'Himachal Pradesh, India',
      continent: 'Asia',
      status: 'completed',
      date: 'May 2014',
      description: 'First Himalayan trek - the spark that started everything',
      difficulty: 2,
      lessons: 'Recovery from tuberculosis, discovering the power of mountains',
    },
    {
      id: 'kilimanjaro',
      name: 'Mount Kilimanjaro',
      elevation: '5,895m',
      location: 'Tanzania',
      continent: 'Africa',
      status: 'completed',
      date: 'February 2023',
      description: 'First Seven Summits achievement',
      difficulty: 3,
      lessons: 'Systematic preparation pays off - proof of concept for bigger goals',
    },
    {
      id: 'aconcagua',
      name: 'Mount Aconcagua',
      elevation: '6,961m',
      location: 'Argentina',
      continent: 'South America',
      status: 'completed',
      date: 'December 2024',
      description: 'Highest peak outside of Asia',
      difficulty: 4,
      lessons: 'Technical high-altitude climbing and extreme weather endurance',
    },
    {
      id: 'elbrus',
      name: 'Mount Elbrus',
      elevation: '5,642m',
      location: 'Russia',
      continent: 'Europe',
      status: 'completed',
      date: 'August 2024',
      description: 'European summit in extreme cold conditions',
      difficulty: 3,
      lessons: 'Cold weather mountaineering and mental resilience',
    },
    {
      id: 'denali',
      name: 'Denali',
      elevation: '6,194m',
      location: 'Alaska, USA',
      continent: 'North America',
      status: 'completed',
      date: 'June 2025',
      description: 'Most recent Seven Summits achievement',
      difficulty: 4,
      lessons: 'Technical glacier travel and extreme conditions mastery',
    },
    {
      id: 'everest',
      name: 'Mount Everest',
      elevation: '8,849m',
      location: 'Nepal/Tibet',
      continent: 'Asia',
      status: 'current',
      date: 'Spring 2028',
      description: 'The ultimate mountaineering challenge',
      difficulty: 5,
      lessons: 'Recovery and training phase for 2028',
    },
    {
      id: 'vinson',
      name: 'Mount Vinson',
      elevation: '4,892m',
      location: 'Antarctica',
      continent: 'Antarctica',
      status: 'planned',
      description: 'Most remote and challenging logistics',
      difficulty: 4,
    },
    {
      id: 'carstensz',
      name: 'Carstensz Pyramid',
      elevation: '4,884m',
      location: 'Indonesia',
      continent: 'Oceania',
      status: 'planned',
      description: 'Technical rock climbing at altitude',
      difficulty: 5,
    },
  ];

  const getStatusIcon = (status: Summit['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'current':
        return Target;
      case 'planned':
        return Clock;
    }
  };

  const getStatusColor = (status: Summit['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-summit-gold bg-summit-gold/10';
      case 'planned':
        return 'text-slate-400 bg-slate-100';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Mountain
        key={i}
        className={`w-4 h-4 ${i < difficulty ? 'text-summit-gold fill-summit-gold' : 'text-slate-300'}`}
      />
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
  };

  return (
    <section
      className={`py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Seven Summits Journey
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From recovery after tuberculosis to the Seven Summits. Now facing a new challenge:
            recovering from a broken Talus. The timeline has shifted, but the goal remains unchanged:
            Everest in 2028.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">Seven Summits Completed: 4</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-summit-gold" />
              <span className="text-slate-300">In Progress: 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300">Planned: 2</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-16 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-400 via-summit-gold to-slate-400" />

          <div className="space-y-12">
            {summits.map((summit, index) => {
              const StatusIcon = getStatusIcon(summit.status);
              const isSelected = selectedSummit === summit.id;

              return (
                <motion.div
                  key={summit.id}
                  variants={itemVariants}
                  className={`relative flex items-start space-x-6 md:space-x-12 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() =>
                    setSelectedSummit(isSelected ? null : summit.id)
                  }
                >
                  {/* Timeline Node */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-slate-800 ${getStatusColor(summit.status)} transition-all duration-300`}
                  >
                    <StatusIcon className="w-8 h-8" />
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 ${
                      isSelected
                        ? 'border-summit-gold shadow-lg shadow-summit-gold/10'
                        : ''
                    }`}
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Main Info */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {summit.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                              <div className="flex items-center space-x-1">
                                <Mountain className="w-4 h-4" />
                                <span>{summit.elevation}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{summit.location}</span>
                              </div>
                              {summit.date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{summit.date}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Difficulty Rating */}
                          <div className="text-right">
                            <div className="text-xs text-slate-400 mb-1">
                              Difficulty
                            </div>
                            <div className="flex space-x-1">
                              {getDifficultyStars(summit.difficulty)}
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-lg">
                          {summit.description}
                        </p>

                        {summit.lessons && (
                          <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-summit-gold">
                            <div className="text-xs text-summit-gold font-medium mb-1">
                              KEY LEARNING
                            </div>
                            <p className="text-slate-300 text-sm">
                              {summit.lessons}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status & Progress */}
                      <div className="space-y-4">
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(summit.status)}`}
                        >
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {summit.status.charAt(0).toUpperCase() +
                            summit.status.slice(1)}
                        </div>

                        <div className="text-sm text-slate-400">
                          <div className="font-medium text-slate-300 mb-1">
                            {summit.continent}
                          </div>
                          <div>Peak #{index + 1} of Seven Summits</div>
                        </div>

                        {summit.status === 'current' && (
                          <div className="bg-summit-gold/10 rounded-lg p-3 border border-summit-gold/20">
                            <div className="text-xs text-summit-gold font-medium mb-1">
                              CURRENT FOCUS
                            </div>
                            <div className="text-sm text-slate-300">
                              {getDaysToEverest()} days until expedition
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-slate-700"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">
                              Preparation Details
                            </h4>
                            <ul className="text-sm text-slate-300 space-y-2">
                              <li className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span>Technical Skills: Advanced</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-blue-400" />
                                <span>Certification: Required</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <Mountain className="w-4 h-4 text-summit-gold" />
                                <span>Equipment: Specialized</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">
                              Training Focus
                            </h4>
                            <div className="text-sm text-slate-300 space-y-1">
                              <div>• High-altitude acclimatization</div>
                              <div>• Technical climbing skills</div>
                              <div>• Extreme weather preparation</div>
                              <div>• Emergency rescue protocols</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-green-400 mb-2">4</div>
            <div className="text-slate-300 text-sm">Seven Summits Completed</div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-summit-gold mb-2">1</div>
            <div className="text-slate-300 text-sm">In Active Training</div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">{getDaysToEverest()}</div>
            <div className="text-slate-300 text-sm">Days to Everest</div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">57%</div>
            <div className="text-slate-300 text-sm">Seven Summits Complete</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
