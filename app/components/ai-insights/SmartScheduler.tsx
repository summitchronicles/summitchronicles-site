"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { clsx } from "clsx";
import {
  CalendarDaysIcon,
  CloudIcon,
  BoltIcon,
  SunIcon,
  CloudIcon as CloudRainIcon,
  BeakerIcon as SnowflakeIcon,
  EyeIcon as WindIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { GlassCard, StatusIndicator, MountainButton, ProgressBar } from "@/app/components/ui";

interface WeatherCondition {
  date: Date;
  temperature: { min: number; max: number };
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm';
  visibility: number;
  uvIndex: number;
}

interface TrainingSession {
  id: string;
  name: string;
  type: 'endurance' | 'strength' | 'technical' | 'recovery' | 'cross-training';
  duration: number; // minutes
  intensity: 'easy' | 'moderate' | 'hard' | 'max';
  location: 'indoor' | 'outdoor' | 'flexible';
  weatherSensitive: boolean;
  equipment: string[];
  description: string;
  adaptations?: string[];
}

interface ScheduleRecommendation {
  date: Date;
  session: TrainingSession;
  weather: WeatherCondition;
  confidence: number;
  reasoning: string[];
  adaptations: string[];
  alternatives?: TrainingSession[];
}

interface SmartSchedulerProps {
  activities: any[];
  preferences?: {
    preferredTimes: number[];
    preferredDays: number[];
    maxWeeklyHours: number;
    avoidBadWeather: boolean;
  };
  className?: string;
}

// Mock weather data for the next 7 days
const generateMockWeather = (): WeatherCondition[] => {
  const conditions = ['sunny', 'cloudy', 'rain', 'snow', 'storm'] as const;
  const weather: WeatherCondition[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    weather.push({
      date,
      temperature: { 
        min: Math.round(Math.random() * 20 - 5), 
        max: Math.round(Math.random() * 25 + 5) 
      },
      humidity: Math.round(Math.random() * 40 + 30),
      windSpeed: Math.round(Math.random() * 25 + 5),
      precipitation: Math.round(Math.random() * 80),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      visibility: Math.round(Math.random() * 5 + 5),
      uvIndex: Math.round(Math.random() * 10 + 1)
    });
  }
  
  return weather;
};

// Training session templates
const trainingSessionTemplates: TrainingSession[] = [
  {
    id: 'long-hike',
    name: 'Long Endurance Hike',
    type: 'endurance',
    duration: 240,
    intensity: 'moderate',
    location: 'outdoor',
    weatherSensitive: true,
    equipment: ['hiking boots', 'backpack', 'layers'],
    description: 'Extended hike focusing on aerobic endurance and leg strength',
    adaptations: ['Indoor if severe weather', 'Treadmill with incline alternative']
  },
  {
    id: 'hill-repeats',
    name: 'Hill Interval Training',
    type: 'strength',
    duration: 90,
    intensity: 'hard',
    location: 'outdoor',
    weatherSensitive: false,
    equipment: ['running shoes', 'layers'],
    description: 'High-intensity hill repeats for power and lactate threshold',
    adaptations: ['Stadium stairs alternative', 'Treadmill intervals']
  },
  {
    id: 'recovery-walk',
    name: 'Active Recovery Walk',
    type: 'recovery',
    duration: 60,
    intensity: 'easy',
    location: 'flexible',
    weatherSensitive: false,
    equipment: ['comfortable shoes'],
    description: 'Easy pace walk for active recovery and movement quality',
    adaptations: ['Indoor walking if preferred', 'Stretching alternative']
  },
  {
    id: 'strength-training',
    name: 'Functional Strength',
    type: 'strength',
    duration: 75,
    intensity: 'moderate',
    location: 'indoor',
    weatherSensitive: false,
    equipment: ['gym access', 'weights'],
    description: 'Compound movements focusing on hiking-specific strength',
    adaptations: ['Bodyweight version available', 'Resistance band alternative']
  },
  {
    id: 'technical-scramble',
    name: 'Technical Rock Practice',
    type: 'technical',
    duration: 120,
    intensity: 'moderate',
    location: 'outdoor',
    weatherSensitive: true,
    equipment: ['climbing shoes', 'helmet', 'harness'],
    description: 'Rock scrambling practice for technical mountain skills',
    adaptations: ['Climbing gym alternative', 'Balance training indoors']
  },
  {
    id: 'bike-cross-train',
    name: 'Cycling Cross-Training',
    type: 'cross-training',
    duration: 90,
    intensity: 'moderate',
    location: 'flexible',
    weatherSensitive: true,
    equipment: ['bicycle', 'helmet'],
    description: 'Low-impact cardio for active recovery and leg turnover',
    adaptations: ['Indoor trainer alternative', 'Stationary bike option']
  }
];

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny': return SunIcon;
    case 'cloudy': return CloudIcon;
    case 'rain': return CloudRainIcon;
    case 'snow': return SnowflakeIcon;
    case 'storm': return WindIcon;
    default: return CloudIcon;
  }
};

const getWeatherColor = (condition: string) => {
  switch (condition) {
    case 'sunny': return 'text-yellow-400';
    case 'cloudy': return 'text-gray-400';
    case 'rain': return 'text-blue-400';
    case 'snow': return 'text-blue-200';
    case 'storm': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'easy': return 'text-successGreen';
    case 'moderate': return 'text-summitGold';
    case 'hard': return 'text-warningOrange';
    case 'max': return 'text-dangerRed';
    default: return 'text-gray-400';
  }
};

export default function SmartScheduler({ 
  activities, 
  preferences = {
    preferredTimes: [6, 17], // 6 AM and 5 PM
    preferredDays: [0, 2, 4, 6], // Sun, Tue, Thu, Sat
    maxWeeklyHours: 10,
    avoidBadWeather: true
  },
  className = "" 
}: SmartSchedulerProps) {
  const [weatherForecast, setWeatherForecast] = useState<WeatherCondition[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Generate weather forecast
  useEffect(() => {
    setWeatherForecast(generateMockWeather());
  }, []);

  // Generate intelligent schedule based on weather and preferences
  const generateOptimizedSchedule = useMemo(() => {
    if (weatherForecast.length === 0) return [];

    const recommendations: ScheduleRecommendation[] = [];
    let weeklyHours = 0;
    
    // Calculate current training load
    const recentVolume = activities.slice(0, 7).reduce((sum, activity) => 
      sum + ((activity.moving_time || activity.duration || 3600) / 3600), 0
    );
    
    weatherForecast.forEach((weather, index) => {
      const dayOfWeek = weather.date.getDay();
      
      // Check if it's a preferred training day
      if (!preferences.preferredDays.includes(dayOfWeek)) return;
      
      // Find suitable session based on weather and current load
      let session = selectOptimalSession(weather, recentVolume, weeklyHours);
      
      if (session && weeklyHours + (session.duration / 60) <= preferences.maxWeeklyHours) {
        const adaptations = generateAdaptations(session, weather);
        const confidence = calculateConfidence(session, weather, preferences);
        const reasoning = generateReasoning(session, weather, preferences);
        
        recommendations.push({
          date: weather.date,
          session,
          weather,
          confidence,
          reasoning,
          adaptations,
          alternatives: getAlternativeSessions(session, weather)
        });
        
        weeklyHours += session.duration / 60;
      }
    });
    
    return recommendations;
  }, [weatherForecast, activities, preferences]);

  useEffect(() => {
    if (generateOptimizedSchedule.length > 0) {
      setIsGenerating(true);
      
      const timer = setTimeout(() => {
        setSchedule(generateOptimizedSchedule);
        setIsGenerating(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [generateOptimizedSchedule]);

  function selectOptimalSession(
    weather: WeatherCondition, 
    recentVolume: number, 
    currentWeeklyHours: number
  ): TrainingSession | null {
    // Recovery day if high recent volume
    if (recentVolume > 8) {
      return trainingSessionTemplates.find(s => s.type === 'recovery') || null;
    }
    
    // Weather-based selection
    if (weather.condition === 'sunny' && weather.temperature.max > 10) {
      // Good weather - outdoor activities
      const outdoorSessions = trainingSessionTemplates.filter(s => 
        s.location === 'outdoor' || s.location === 'flexible'
      );
      return outdoorSessions[Math.floor(Math.random() * outdoorSessions.length)];
    }
    
    if (weather.condition === 'rain' || weather.condition === 'storm') {
      // Bad weather - indoor activities
      const indoorSessions = trainingSessionTemplates.filter(s => 
        s.location === 'indoor' || !s.weatherSensitive
      );
      return indoorSessions[Math.floor(Math.random() * indoorSessions.length)];
    }
    
    // Default selection based on weekly balance
    const sessionTypes = ['endurance', 'strength', 'technical', 'cross-training'];
    const randomType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
    return trainingSessionTemplates.find(s => s.type === randomType) || null;
  }

  function generateAdaptations(session: TrainingSession, weather: WeatherCondition): string[] {
    const adaptations: string[] = [];
    
    if (weather.condition === 'rain' && session.location === 'outdoor') {
      adaptations.push('Move indoors or use covered area');
    }
    
    if (weather.temperature.min < 0 && session.location === 'outdoor') {
      adaptations.push('Add extra layers and warm-up time');
    }
    
    if (weather.windSpeed > 20 && session.weatherSensitive) {
      adaptations.push('Consider sheltered location or indoor alternative');
    }
    
    if (weather.uvIndex > 7 && session.location === 'outdoor') {
      adaptations.push('Use sunscreen and consider early morning timing');
    }
    
    return adaptations;
  }

  function calculateConfidence(
    session: TrainingSession, 
    weather: WeatherCondition, 
    prefs: typeof preferences
  ): number {
    let confidence = 0.7; // Base confidence
    
    // Weather suitability
    if (session.location === 'indoor' || !session.weatherSensitive) {
      confidence += 0.2;
    } else if (weather.condition === 'sunny') {
      confidence += 0.15;
    } else if (weather.condition === 'rain' || weather.condition === 'storm') {
      confidence -= 0.3;
    }
    
    // Temperature considerations
    if (weather.temperature.max > 5 && weather.temperature.max < 25) {
      confidence += 0.1;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  function generateReasoning(
    session: TrainingSession, 
    weather: WeatherCondition, 
    prefs: typeof preferences
  ): string[] {
    const reasons: string[] = [];
    
    reasons.push(`${session.type.charAt(0).toUpperCase() + session.type.slice(1)} training scheduled for optimal progression`);
    
    if (weather.condition === 'sunny') {
      reasons.push('Clear weather conditions ideal for outdoor training');
    }
    
    if (session.location === 'indoor') {
      reasons.push('Indoor session ensures consistent training regardless of weather');
    }
    
    if (session.intensity === 'easy') {
      reasons.push('Easy intensity supports recovery and aerobic base building');
    }
    
    return reasons;
  }

  function getAlternativeSessions(
    primarySession: TrainingSession, 
    weather: WeatherCondition
  ): TrainingSession[] {
    return trainingSessionTemplates
      .filter(s => s.id !== primarySession.id)
      .filter(s => !s.weatherSensitive || weather.condition !== 'storm')
      .slice(0, 2);
  }

  const totalWeeklyHours = schedule.reduce((sum, rec) => sum + (rec.session.duration / 60), 0);

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-glacierBlue to-summitGold rounded-xl">
            <CalendarDaysIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Smart Training Scheduler</h2>
            <p className="text-gray-400">AI-optimized training schedule based on weather and your patterns</p>
          </div>
        </div>
        
        {isGenerating && (
          <div className="flex items-center space-x-2 text-glacierBlue">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </motion.div>
            <span className="text-sm">Optimizing schedule...</span>
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Weekly Training Overview</h3>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-summitGold">{schedule.length}</div>
              <div className="text-xs text-gray-400">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-glacierBlue">{Math.round(totalWeeklyHours)}h</div>
              <div className="text-xs text-gray-400">Total Time</div>
            </div>
          </div>
        </div>
        
        <ProgressBar
          value={(totalWeeklyHours / preferences.maxWeeklyHours) * 100}
          variant="gradient"
          size="md"
          label="Weekly Volume"
          showValue
          animated
        />
      </GlassCard>

      {/* Schedule Grid */}
      {isGenerating ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-700 rounded w-1/3" />
                      <div className="h-4 bg-gray-700 rounded w-16" />
                    </div>
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-700 rounded w-20" />
                      <div className="h-6 bg-gray-700 rounded w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {schedule.map((recommendation, index) => {
            const WeatherIcon = getWeatherIcon(recommendation.weather.condition);
            const isExpanded = selectedDay === index;
            
            return (
              <motion.div
                key={recommendation.session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:bg-white/5 transition-colors duration-300">
                  <div className="flex items-start space-x-4">
                    {/* Date & Weather */}
                    <div className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mb-2">
                        <WeatherIcon className={clsx("w-8 h-8", getWeatherColor(recommendation.weather.condition))} />
                      </div>
                      <div className="text-sm font-medium text-white">
                        {recommendation.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {recommendation.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {recommendation.weather.temperature.max}°/{recommendation.weather.temperature.min}°
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {recommendation.session.name}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {recommendation.session.description}
                          </p>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-white">
                              {Math.round(recommendation.session.duration / 60)}h {recommendation.session.duration % 60}min
                            </span>
                          </div>
                          <StatusIndicator
                            status={recommendation.confidence >= 0.8 ? 'success' : 
                                   recommendation.confidence >= 0.6 ? 'info' : 'warning'}
                            text={`${Math.round(recommendation.confidence * 100)}% match`}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Session Metadata */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <BoltIcon className={clsx("w-4 h-4", getIntensityColor(recommendation.session.intensity))} />
                          <span className="text-sm text-gray-400">
                            {recommendation.session.intensity.charAt(0).toUpperCase() + recommendation.session.intensity.slice(1)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          {recommendation.session.location.charAt(0).toUpperCase() + recommendation.session.location.slice(1)}
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          {recommendation.session.type.charAt(0).toUpperCase() + recommendation.session.type.slice(1)}
                        </div>
                      </div>

                      {/* Adaptations */}
                      {recommendation.adaptations.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center space-x-1 mb-1">
                            <InformationCircleIcon className="w-4 h-4 text-glacierBlue" />
                            <span className="text-sm font-medium text-white">Weather Adaptations</span>
                          </div>
                          <div className="space-y-1">
                            {recommendation.adaptations.map((adaptation, i) => (
                              <div key={i} className="text-xs text-gray-400 pl-5">
                                • {adaptation}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedDay(isExpanded ? null : index)}
                          className="text-sm text-summitGold hover:text-yellow-400 transition-colors"
                        >
                          {isExpanded ? 'Show less' : 'View details & alternatives'}
                        </button>
                        
                        <div className="flex space-x-2">
                          <MountainButton
                            variant="ghost"
                            size="sm"
                            className="text-successGreen border-successGreen/30"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Accept
                          </MountainButton>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/10 pt-4 mt-4 space-y-4"
                          >
                            {/* Reasoning */}
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">AI Reasoning</h4>
                              <div className="space-y-1">
                                {recommendation.reasoning.map((reason, i) => (
                                  <div key={i} className="text-xs text-gray-400">
                                    • {reason}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Equipment */}
                            <div>
                              <h4 className="text-sm font-medium text-white mb-2">Required Equipment</h4>
                              <div className="flex flex-wrap gap-2">
                                {recommendation.session.equipment.map((item, i) => (
                                  <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Alternative Sessions */}
                            {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">Alternative Sessions</h4>
                                <div className="space-y-2">
                                  {recommendation.alternatives.map((alt, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                      <div>
                                        <div className="text-sm font-medium text-white">{alt.name}</div>
                                        <div className="text-xs text-gray-400">
                                          {Math.round(alt.duration / 60)}h {alt.duration % 60}min • {alt.intensity} • {alt.location}
                                        </div>
                                      </div>
                                      <MountainButton variant="ghost" size="sm">
                                        Switch
                                      </MountainButton>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* No Schedule State */}
      {schedule.length === 0 && !isGenerating && (
        <GlassCard className="p-8 text-center">
          <CalendarDaysIcon className="w-12 h-12 text-glacierBlue mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Training Scheduled
          </h3>
          <p className="text-gray-400 mb-4">
            Add some training preferences or activities to generate an optimized schedule.
          </p>
          <MountainButton variant="gradient" size="lg">
            Set Training Preferences
          </MountainButton>
        </GlassCard>
      )}
    </div>
  );
}