'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import {
  Calendar,
  MapPin,
  Mountain,
  CheckCircle,
  Clock,
  Camera,
  Users,
  Thermometer,
  Wind,
  ArrowRight,
  ChevronDown,
  Share,
  Heart,
  Target,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  phase: 'preparation' | 'travel' | 'climb' | 'summit' | 'return';
  location?: string;
  elevation?: string;
  temperature?: string;
  weather?: string;
  images?: TimelineImage[];
  achievements?: string[];
  supporters?: number;
  details?: string;
  metrics?: {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

interface TimelineImage {
  url: string;
  caption: string;
  photographer?: string;
}

interface ExpeditionTimelineProps {
  className?: string;
}

const TIMELINE_DATA: TimelineMilestone[] = [
  {
    id: '1',
    title: 'Seven Summits Training Foundation',
    description:
      'Established comprehensive training methodology specifically designed for the Seven Summits challenge - the highest peaks on each continent.',
    date: '2023-01-15',
    status: 'completed',
    phase: 'preparation',
    location: 'Seattle, WA',
    images: [
      {
        url: '/images/placeholder-7summits-training.jpg',
        caption: 'NEEDED: Seven Summits training methodology documentation',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-altitude-training.jpg',
        caption: 'NEEDED: High-altitude preparation and conditioning sessions',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-technical-training.jpg',
        caption: 'NEEDED: Technical mountaineering skills development',
        photographer: 'TBD',
      },
    ],
    achievements: [
      'Established Seven Summits training methodology',
      'Created continent-specific preparation protocols',
      'Implemented systematic progression tracking',
    ],
    supporters: 25,
    details:
      'The foundation phase focused on creating a systematic approach to tackle the Seven Summits challenge. Each summit requires different skills, from technical ice climbing to extreme altitude endurance.',
    metrics: [
      { label: 'Training Hours', value: '320+', icon: Clock },
      { label: 'Skill Areas', value: '7', icon: CheckCircle },
      { label: 'Progression', value: '100%', icon: Mountain },
    ],
  },
  {
    id: '2',
    title: 'Mount Kilimanjaro - Africa',
    description:
      'Successfully summited Kilimanjaro (5,895m), the highest peak in Africa and first summit in the Seven Summits challenge.',
    date: '2023-06-12',
    status: 'completed',
    phase: 'summit',
    location: 'Mount Kilimanjaro, Tanzania',
    elevation: '5,895m (19,341 ft)',
    temperature: '-15°C (5°F)',
    weather: 'Clear summit day after challenging approach',
    images: [
      {
        url: '/images/placeholder-kilimanjaro-summit.jpg',
        caption:
          'CRITICAL: Kilimanjaro summit photo at Uhuru Peak - you with summit sign',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-kilimanjaro-uhuru.jpg',
        caption:
          'CRITICAL: Uhuru Peak celebration - highest point in Africa achieved',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-kilimanjaro-ascent.jpg',
        caption:
          'NEEDED: Night summit push showing determination and preparation',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-kilimanjaro-crater.jpg',
        caption: 'NEEDED: Crater rim approach and glacier views',
        photographer: 'TBD',
      },
    ],
    achievements: [
      'Successfully summited Mount Kilimanjaro (5,895m)',
      'Completed Seven Summits #1 - Africa conquered',
      'Demonstrated high-altitude endurance capability',
      'Validated systematic preparation for extreme altitude',
    ],
    supporters: 89,
    details:
      'Kilimanjaro success marked the beginning of the Seven Summits journey. The non-technical but high-altitude challenge validated training methodology and provided crucial experience for higher peaks.',
    metrics: [
      { label: 'Summit Elevation', value: '5,895m', icon: Mountain },
      { label: 'Summit Success', value: '1/7', icon: CheckCircle },
      { label: 'Ascent Time', value: '6 days', icon: Clock },
    ],
  },
  {
    id: '3',
    title: 'Mount Elbrus - Europe',
    description:
      'Conquered Mount Elbrus (5,642m), the highest peak in Europe and second summit in the Seven Summits challenge.',
    date: '2023-09-18',
    status: 'completed',
    phase: 'summit',
    location: 'Mount Elbrus, Russia',
    elevation: '5,642m (18,510 ft)',
    temperature: '-25°C (-13°F)',
    weather: 'Challenging weather with strong winds',
    images: [
      {
        url: '/images/placeholder-elbrus-summit.jpg',
        caption: 'CRITICAL: Elbrus summit photo at highest point in Europe',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-elbrus-conditions.jpg',
        caption:
          'CRITICAL: Extreme cold weather conditions and wind documentation',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-elbrus-technical.jpg',
        caption:
          'NEEDED: Technical aspects of Elbrus climb including rope work',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-elbrus-team.jpg',
        caption: 'NEEDED: Team coordination and safety protocols in action',
        photographer: 'TBD',
      },
    ],
    achievements: [
      'Successfully summited Mount Elbrus (5,642m)',
      'Completed Seven Summits #2 - Europe conquered',
      'Overcame extreme cold and technical challenges',
      'Demonstrated systematic risk management',
    ],
    supporters: 134,
    details:
      'Elbrus presented significant technical challenges with extreme cold and weather conditions. Success demonstrated progression in mountaineering skills and cold-weather capability.',
    metrics: [
      { label: 'Summit Elevation', value: '5,642m', icon: Mountain },
      { label: 'Summit Success', value: '2/7', icon: CheckCircle },
      { label: 'Temperature', value: '-25°C', icon: Thermometer },
    ],
  },
  {
    id: '4',
    title: 'Aconcagua - South America',
    description:
      'Successfully summited Aconcagua (6,961m), the highest peak in South America and third summit in the Seven Summits challenge.',
    date: '2024-01-22',
    status: 'completed',
    phase: 'summit',
    location: 'Aconcagua, Argentina',
    elevation: '6,961m (22,837 ft)',
    temperature: '-30°C (-22°F)',
    weather: 'High altitude, extreme conditions',
    images: [
      {
        url: '/images/placeholder-aconcagua-summit.jpg',
        caption:
          'CRITICAL: Aconcagua summit photo - highest peak in Americas outside Alaska',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-aconcagua-altitude.jpg',
        caption:
          'CRITICAL: High altitude challenges at nearly 7,000m elevation',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-aconcagua-approach.jpg',
        caption: 'NEEDED: Multi-day approach and acclimatization process',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-aconcagua-gear.jpg',
        caption: 'NEEDED: High-altitude gear testing and validation',
        photographer: 'TBD',
      },
    ],
    achievements: [
      'Successfully summited Aconcagua (6,961m)',
      'Completed Seven Summits #3 - South America conquered',
      'Achieved highest non-technical summit worldwide',
      'Demonstrated extreme altitude capability',
    ],
    supporters: 187,
    details:
      'Aconcagua represented a major milestone as the highest non-technical summit in the world. Success at nearly 7,000m elevation demonstrated serious high-altitude mountaineering capability.',
    metrics: [
      { label: 'Summit Elevation', value: '6,961m', icon: Mountain },
      { label: 'Summit Success', value: '3/7', icon: CheckCircle },
      { label: 'Expedition Days', value: '18 days', icon: Calendar },
    ],
  },
  {
    id: '5',
    title: 'Denali Preparation & Training',
    description:
      'Intensive technical mountaineering preparation for Denali (6,190m), focusing on cold weather survival and technical glacier travel.',
    date: '2024-04-15',
    status: 'completed',
    phase: 'preparation',
    location: 'Alaska Training & Seattle',
    images: [
      {
        url: '/images/placeholder-denali-prep.jpg',
        caption:
          'NEEDED: Denali-specific training including sled pulling and cold weather',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-glacier-training.jpg',
        caption: 'NEEDED: Glacier travel and crevasse rescue training',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-cold-weather-gear.jpg',
        caption:
          'NEEDED: Extreme cold weather gear testing for Alaska conditions',
        photographer: 'TBD',
      },
    ],
    achievements: [
      'Completed Denali-specific technical training',
      'Mastered glacier travel and crevasse rescue',
      'Validated extreme cold weather systems',
      "Prepared for North America's highest peak",
    ],
    supporters: 203,
    details:
      'Denali preparation required specialized skills including glacier travel, extreme cold survival, and technical mountaineering. This phase elevated capabilities for the most challenging summits ahead.',
    metrics: [
      { label: 'Training Days', value: '45', icon: Calendar },
      { label: 'Technical Skills', value: '12 new', icon: CheckCircle },
      { label: 'Cold Rating', value: '-40°C', icon: Thermometer },
    ],
  },
  {
    id: '6',
    title: 'Denali Summit - North America',
    description:
      'Summit attempt on Denali (6,190m), the highest peak in North America and most technical summit in Seven Summits challenge.',
    date: '2024-06-10',
    status: 'in-progress',
    phase: 'summit',
    location: 'Denali, Alaska',
    elevation: '6,190m (20,310 ft)',
    temperature: '-35°C (-31°F)',
    weather: 'Variable conditions, weather-dependent',
    images: [
      {
        url: '/images/placeholder-denali-expedition.jpg',
        caption:
          'CRITICAL: Denali expedition in progress - highest peak in North America',
        photographer: 'TBD',
      },
      {
        url: '/images/placeholder-denali-technical.jpg',
        caption: 'NEEDED: Technical climbing sections and glacier navigation',
        photographer: 'TBD',
      },
    ],
    achievements: [
      'Launched Denali expedition - most technical Seven Summit',
      'Implementing systematic approach to extreme conditions',
      'Targeting Seven Summits #4 - North America',
    ],
    supporters: 245,
    details:
      'Denali represents the most technically challenging summit in the Seven Summits. Success here will demonstrate world-class mountaineering capability and preparation for Everest.',
    metrics: [
      { label: 'Target Elevation', value: '6,190m', icon: Mountain },
      { label: 'Expedition Days', value: '21', icon: Calendar },
      { label: 'Technical Grade', value: 'Advanced', icon: Target },
    ],
  },
  {
    id: '7',
    title: 'Mount Everest - Asia',
    description:
      'The ultimate goal: Mount Everest (8,849m), the highest peak on Earth and crown jewel of the Seven Summits challenge.',
    date: '2025-05-15',
    status: 'upcoming',
    phase: 'summit',
    location: 'Mount Everest, Nepal/Tibet',
    elevation: '8,849m (29,032 ft)',
    temperature: '-40°C (-40°F)',
    weather: 'Extreme altitude, jet stream winds',
    details:
      'Mount Everest represents the culmination of the Seven Summits challenge. All previous summits and systematic training lead to this ultimate test of mountaineering skill and preparation.',
    metrics: [
      { label: 'Summit Elevation', value: '8,849m', icon: Mountain },
      { label: 'Target Success', value: '5/7', icon: CheckCircle },
      { label: 'Death Zone', value: '8,000m+', icon: Target },
    ],
  },
  {
    id: '8',
    title: 'Vinson Massif - Antarctica',
    description:
      'Mount Vinson (4,892m), the highest peak in Antarctica and one of the most remote summits in the Seven Summits challenge.',
    date: '2025-12-01',
    status: 'upcoming',
    phase: 'summit',
    location: 'Vinson Massif, Antarctica',
    elevation: '4,892m (16,050 ft)',
    temperature: '-40°C (-40°F)',
    weather: 'Extreme cold, 24-hour daylight',
    details:
      "Vinson Massif in Antarctica presents unique challenges including extreme cold, remoteness, and complex logistics. Success demonstrates capability in the world's most challenging environments.",
    metrics: [
      { label: 'Summit Elevation', value: '4,892m', icon: Mountain },
      { label: 'Target Success', value: '6/7', icon: CheckCircle },
      { label: 'Remoteness', value: 'Extreme', icon: MapPin },
    ],
  },
  {
    id: '9',
    title: 'Kosciuszko - Australia/Oceania',
    description:
      'Mount Kosciuszko (2,228m), the highest peak in Australia and final summit to complete the Seven Summits challenge.',
    date: '2026-03-01',
    status: 'upcoming',
    phase: 'summit',
    location: 'Mount Kosciuszko, Australia',
    elevation: '2,228m (7,310 ft)',
    temperature: '10°C (50°F)',
    weather: 'Moderate conditions',
    details:
      'Mount Kosciuszko completes the Seven Summits challenge. Though the least technical, it represents the achievement of standing on the highest point of every continent.',
    metrics: [
      { label: 'Summit Elevation', value: '2,228m', icon: Mountain },
      { label: 'Seven Summits', value: '7/7', icon: CheckCircle },
      { label: 'Challenge Complete', value: '100%', icon: Award },
    ],
  },
];

const PHASE_CONFIG = {
  preparation: {
    label: 'Preparation',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: Mountain,
  },
  travel: {
    label: 'Travel',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    icon: MapPin,
  },
  climb: {
    label: 'Climb',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    icon: Mountain,
  },
  summit: {
    label: 'Summit',
    color: 'bg-red-500',
    lightColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: Mountain,
  },
  return: {
    label: 'Return',
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: CheckCircle,
  },
};

export const ExpeditionTimeline: React.FC<ExpeditionTimelineProps> = ({
  className,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    null
  );
  const [filterPhase, setFilterPhase] = useState<string>('all');

  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, {
    once: true,
    margin: '-100px',
  });
  const isProgressInView = useInView(progressRef, {
    once: true,
    margin: '-50px',
  });

  const timelineControls = useAnimation();
  const progressControls = useAnimation();

  useEffect(() => {
    if (isTimelineInView) {
      timelineControls.start('visible');
    }
  }, [timelineControls, isTimelineInView]);

  useEffect(() => {
    if (isProgressInView) {
      progressControls.start('visible');
    }
  }, [progressControls, isProgressInView]);

  const filteredMilestones =
    filterPhase === 'all'
      ? TIMELINE_DATA
      : TIMELINE_DATA.filter((milestone) => milestone.phase === filterPhase);

  const completedMilestones = TIMELINE_DATA.filter(
    (m) => m.status === 'completed'
  ).length;
  const totalMilestones = TIMELINE_DATA.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  const getStatusIcon = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-alpine-blue animate-pulse" />;
      case 'upcoming':
        return (
          <div className="w-5 h-5 rounded-full border-2 border-spa-stone/30" />
        );
    }
  };

  const getStatusColor = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-50';
      case 'in-progress':
        return 'border-alpine-blue bg-alpine-blue/5';
      case 'upcoming':
        return 'border-spa-stone/30 bg-white';
    }
  };

  return (
    <section
      className={cn(
        'py-16 bg-gradient-to-br from-spa-cloud/20 via-white to-spa-mist/30',
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="w-8 h-8 text-alpine-blue" />
            <h2 className="text-4xl font-light text-spa-charcoal">
              Expedition Timeline
            </h2>
          </div>
          <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
            Documented achievement progression showcasing systematic training
            methodology and proven summit success. Each milestone demonstrates
            measurable progress, risk management, and the data-driven approach
            that delivers results.
          </p>
        </div>

        {/* Progress Overview */}
        <motion.div
          ref={progressRef}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-spa-stone/10 shadow-sm"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={progressControls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="text-4xl font-light text-spa-charcoal mb-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {completedMilestones} of {totalMilestones} Milestones Completed
            </motion.div>
            <motion.div
              className="text-spa-charcoal/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {progressPercentage.toFixed(0)}% of expedition journey complete
            </motion.div>
          </motion.div>

          <div className="relative">
            <div className="w-full h-4 bg-spa-stone/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-alpine-blue rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercentage}%` }}
              />
            </div>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-alpine-blue rounded-full shadow-lg"
              initial={{ left: '0%', scale: 0 }}
              animate={{
                left: `calc(${progressPercentage}% - 12px)`,
                scale: 1,
              }}
              transition={{
                delay: 1.2,
                duration: 1.2,
                scale: { type: 'spring', stiffness: 500, damping: 30 },
              }}
              whileHover={{ scale: 1.2 }}
            />
          </div>
        </motion.div>

        {/* Phase Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <motion.button
            onClick={() => setFilterPhase('all')}
            className={cn(
              'px-6 py-3 rounded-full text-sm font-medium transition-all relative overflow-hidden',
              filterPhase === 'all'
                ? 'bg-alpine-blue text-white shadow-lg'
                : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
            )}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            {filterPhase === 'all' && (
              <motion.div
                className="absolute inset-0 bg-alpine-blue rounded-full"
                layoutId="activeFilter"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">All Phases</span>
          </motion.button>
          {Object.entries(PHASE_CONFIG).map(([phase, config], index) => (
            <motion.button
              key={phase}
              onClick={() => setFilterPhase(phase)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all relative overflow-hidden',
                filterPhase === phase
                  ? 'bg-alpine-blue text-white shadow-lg'
                  : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
              )}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              layout
            >
              {filterPhase === phase && (
                <motion.div
                  className="absolute inset-0 bg-alpine-blue rounded-full"
                  layoutId="activeFilter"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div className="relative z-10 flex items-center gap-2">
                <config.icon className="w-4 h-4" />
                {config.label}
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          ref={timelineRef}
          className="relative"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.8,
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate={timelineControls}
        >
          {/* Timeline line */}
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-alpine-blue to-spa-stone/30"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
          />

          {/* Milestones */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {filteredMilestones.map((milestone, index) => {
                const phaseConfig = PHASE_CONFIG[milestone.phase];
                const isExpanded = selectedMilestone === milestone.id;

                return (
                  <motion.div
                    key={milestone.id}
                    className="relative"
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: -50,
                        scale: 0.9,
                      },
                      visible: {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: {
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      },
                    }}
                    layout
                  >
                    {/* Timeline dot */}
                    <motion.div
                      className={cn(
                        'absolute left-6 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10',
                        phaseConfig.color
                      )}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                        ...(milestone.status === 'in-progress' && {
                          scale: [1, 1.1],
                          boxShadow: [
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                          ],
                        }),
                      }}
                      transition={{
                        delay: 0.8 + index * 0.1,
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                        ...(milestone.status === 'in-progress' && {
                          repeat: Infinity,
                          duration: 2,
                          type: 'tween',
                        }),
                      }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    />

                    {/* Milestone card */}
                    <div className="ml-16">
                      <motion.div
                        className={cn(
                          'bg-white/90 backdrop-blur-sm rounded-xl border-l-4 border shadow-sm overflow-hidden cursor-pointer',
                          getStatusColor(milestone.status)
                        )}
                        whileHover={{
                          scale: 1.01,
                          y: -2,
                          boxShadow:
                            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        }}
                        animate={{
                          boxShadow: isExpanded
                            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        {/* Card header */}
                        <motion.div
                          className="p-6"
                          onClick={() =>
                            setSelectedMilestone(
                              isExpanded ? null : milestone.id
                            )
                          }
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(milestone.status)}
                                <div
                                  className={cn(
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    phaseConfig.lightColor,
                                    phaseConfig.textColor
                                  )}
                                >
                                  {phaseConfig.label}
                                </div>
                                <div className="text-sm text-spa-charcoal/60">
                                  {new Date(milestone.date).toLocaleDateString(
                                    'en-US',
                                    {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    }
                                  )}
                                </div>
                              </div>

                              <h3 className="text-xl font-medium text-spa-charcoal mb-2">
                                {milestone.title}
                              </h3>

                              <p className="text-spa-charcoal/70 leading-relaxed">
                                {milestone.description}
                              </p>

                              {milestone.location && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-spa-charcoal/60">
                                  <MapPin className="w-4 h-4" />
                                  {milestone.location}
                                  {milestone.elevation && (
                                    <span className="ml-2 px-2 py-1 bg-spa-mist/20 rounded text-xs">
                                      {milestone.elevation}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              {milestone.supporters && (
                                <div className="flex items-center gap-1 text-sm text-spa-charcoal/60">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  {milestone.supporters}
                                </div>
                              )}
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                              >
                                <ChevronDown className="w-5 h-5 text-spa-charcoal/60" />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              className="border-t border-spa-stone/10 p-6 space-y-6"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{
                                opacity: 1,
                                height: 'auto',
                                transition: {
                                  duration: 0.4,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                  staggerChildren: 0.1,
                                  delayChildren: 0.1,
                                },
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                                transition: {
                                  duration: 0.3,
                                },
                              }}
                            >
                              {milestone.details && (
                                <motion.p
                                  className="text-spa-charcoal/70 leading-relaxed"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  {milestone.details}
                                </motion.p>
                              )}

                              {milestone.metrics && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                  <h4 className="font-medium text-spa-charcoal mb-4">
                                    Key Metrics
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {milestone.metrics.map((metric, idx) => (
                                      <motion.div
                                        key={idx}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: 0.2 + idx * 0.05,
                                          type: 'spring',
                                          stiffness: 400,
                                          damping: 30,
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        <motion.div
                                          className="p-2 bg-alpine-blue/10 rounded-lg"
                                          whileHover={{ rotate: 5, scale: 1.1 }}
                                        >
                                          <metric.icon className="w-4 h-4 text-alpine-blue" />
                                        </motion.div>
                                        <div>
                                          <div className="font-medium text-spa-charcoal">
                                            {metric.value}
                                          </div>
                                          <div className="text-sm text-spa-charcoal/60">
                                            {metric.label}
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              {milestone.achievements && (
                                <div>
                                  <h4 className="font-medium text-spa-charcoal mb-4">
                                    Achievements
                                  </h4>
                                  <ul className="space-y-2">
                                    {milestone.achievements.map(
                                      (achievement, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start gap-2"
                                        >
                                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-spa-charcoal/70 text-sm">
                                            {achievement}
                                          </span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              {milestone.weather && (
                                <div className="flex items-center gap-4 text-sm text-spa-charcoal/60">
                                  <div className="flex items-center gap-2">
                                    <Wind className="w-4 h-4" />
                                    {milestone.weather}
                                  </div>
                                  {milestone.temperature && (
                                    <div className="flex items-center gap-2">
                                      <Thermometer className="w-4 h-4" />
                                      {milestone.temperature}
                                    </div>
                                  )}
                                </div>
                              )}

                              <motion.div
                                className="flex items-center gap-4 pt-4 border-t border-spa-stone/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                              >
                                <motion.button
                                  className="flex items-center gap-2 px-4 py-2 bg-alpine-blue text-white rounded-lg font-medium"
                                  whileHover={{
                                    scale: 1.02,
                                    backgroundColor: 'rgba(59, 130, 246, 0.9)',
                                    boxShadow:
                                      '0 4px 12px rgba(59, 130, 246, 0.3)',
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Share className="w-4 h-4" />
                                  Share Milestone
                                </motion.button>
                                {milestone.images && (
                                  <motion.button
                                    className="flex items-center gap-2 px-4 py-2 border border-spa-stone/20 text-spa-charcoal rounded-lg"
                                    whileHover={{
                                      scale: 1.02,
                                      backgroundColor:
                                        'rgba(241, 245, 249, 0.1)',
                                      borderColor: 'rgba(100, 116, 139, 0.3)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Camera className="w-4 h-4" />
                                    View Photos ({milestone.images.length})
                                  </motion.button>
                                )}
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-gradient-to-br from-alpine-blue/10 to-summit-gold/10 rounded-2xl p-8 border border-spa-stone/10 backdrop-blur-sm"
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3
              className="text-3xl font-light text-spa-charcoal mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Partnership Opportunities
            </motion.h3>
            <motion.p
              className="text-spa-charcoal/70 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Partner with a proven adventure athlete who delivers measurable
              results through systematic preparation. See how data-driven
              methodology creates compelling brand partnership opportunities.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                className="px-8 py-4 bg-alpine-blue text-white rounded-lg font-medium group relative overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-alpine-blue to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Partnership Inquiry</span>
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-spa-stone/20 text-spa-charcoal rounded-lg font-medium hover:border-alpine-blue/30 group"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: 'rgba(241, 245, 249, 0.1)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="group-hover:text-alpine-blue transition-colors">
                  Download Media Kit
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
