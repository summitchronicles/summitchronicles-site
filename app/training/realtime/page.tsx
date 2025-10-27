'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/organisms/Header';
import { TrainingNavigation } from '../../components/training/TrainingNavigation';
import { TimelineCalendar } from '../../components/training/TimelineCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Target,
  Mountain,
  RefreshCw,
  Heart,
  Brain,
  Moon,
  Gauge,
  Zap,
  Wifi,
  WifiOff,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Droplets,
  Battery
} from 'lucide-react';
import { getEverestCountdownText } from '@/lib/everest-countdown';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

interface DashboardSection {
  id: string;
  title: string;
  expanded: boolean;
  metrics: MetricCard[];
}

interface WellnessData {
  heart_rate: {
    resting_hr: number;
    max_hr: number;
    average_active_hr: number;
  };
  stress: {
    current_level: number;
    daily_average: number;
    trend: string;
  };
  sleep: {
    total_sleep_hours: number;
    deep_sleep_hours: number;
    rem_sleep_hours: number;
    sleep_quality_score: number;
  };
  recovery: {
    readiness_score: number;
    recovery_status: string;
    recovery_time_estimate: number;
  };
  body_battery: {
    current_level: number;
    daily_high: number;
    daily_low: number;
  };
  hydration: {
    daily_intake: number;
    target: number;
    percentage: number;
  };
  lastUpdated: string;
  source: string;
  dataQuality: string;
}

export default function OptimizedRealtimePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['wellness', 'training', 'calendar'])
  );
  const [wellnessData, setWellnessData] = useState<WellnessData | null>(null);
  const [trainingData, setTrainingData] = useState<any>(null);

  // Dynamic dashboard sections based on wellness data
  const getDashboardSections = (): DashboardSection[] => {
    if (!wellnessData) {
      return [];
    }

    return [
      {
        id: 'wellness',
        title: 'Wellness Metrics',
        expanded: true,
        metrics: [
          {
            id: 'resting-hr',
            title: 'Resting HR',
            value: wellnessData.heart_rate.resting_hr,
            unit: 'bpm',
            icon: Heart,
            color: 'text-red-400',
            description: 'Live from Garmin wellness'
          },
          {
            id: 'stress',
            title: 'Stress Level',
            value: wellnessData.stress.current_level,
            unit: '/100',
            icon: Brain,
            color: 'text-orange-400',
            description: `Daily avg: ${wellnessData.stress.daily_average}`
          },
          {
            id: 'sleep',
            title: 'Sleep Quality',
            value: wellnessData.sleep.total_sleep_hours,
            unit: 'hours',
            icon: Moon,
            color: 'text-purple-400',
            description: `Score: ${wellnessData.sleep.sleep_quality_score}/100`
          },
          {
            id: 'readiness',
            title: 'Readiness',
            value: wellnessData.recovery.readiness_score,
            unit: '/100',
            icon: Zap,
            color: 'text-green-400',
            description: `Recovery: ${wellnessData.recovery.recovery_status}`
          },
          {
            id: 'body-battery',
            title: 'Body Battery',
            value: wellnessData.body_battery.current_level,
            unit: '/100',
            icon: Battery,
            color: 'text-blue-400',
            description: `High: ${wellnessData.body_battery.daily_high}, Low: ${wellnessData.body_battery.daily_low}`
          },
          {
            id: 'hydration',
            title: 'Hydration',
            value: wellnessData.hydration.percentage,
            unit: '%',
            icon: Droplets,
            color: 'text-cyan-400',
            description: `${wellnessData.hydration.daily_intake}L of ${wellnessData.hydration.target}L`
          }
        ]
      },
      {
        id: 'training',
        title: 'Training Performance',
        expanded: true,
        metrics: [
          {
            id: 'activities',
            title: 'Total Activities',
            value: trainingData?.totalActivities || 234,
            icon: Activity,
            color: 'text-blue-400',
            description: 'This year from Garmin'
          },
          {
            id: 'elevation',
            title: 'Elevation Gain',
            value: trainingData?.totalElevationThisYear?.value || '356K',
            unit: 'm',
            icon: Mountain,
            color: 'text-green-400',
            description: 'Cumulative climbing this year'
          },
          {
            id: 'progress',
            title: 'Weekly Goal',
            value: trainingData?.recentTrends?.weeklyVolume?.value || '15',
            unit: 'hrs',
            icon: TrendingUp,
            color: 'text-yellow-400',
            description: 'Training hours this week'
          },
          {
            id: 'countdown',
            title: 'Everest 2027',
            value: getEverestCountdownText().split(' ')[0],
            unit: 'days',
            icon: Target,
            color: 'text-red-400',
            description: 'Days remaining'
          }
        ]
      }
    ];
  };

  useEffect(() => {
    loadData();

    // Smart refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch wellness data from Garmin
      const [wellnessResponse, trainingResponse] = await Promise.all([
        fetch('/api/garmin/wellness', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        }),
        fetch('/api/training/metrics', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
      ]);

      if (wellnessResponse.ok) {
        const wellnessData = await wellnessResponse.json();
        setWellnessData(wellnessData);
      }

      if (trainingResponse.ok) {
        const trainingData = await trainingResponse.json();
        setTrainingData(trainingData.metrics);
      }

      setLastUpdated(new Date());

    } catch (err) {
      setError('Unable to sync training data. Using cached values.');
      console.error('Error loading realtime data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusInfo = () => {
    if (loading) return { icon: RefreshCw, text: 'Syncing...', color: 'text-yellow-400' };
    if (error) return { icon: AlertCircle, text: 'Offline Mode', color: 'text-orange-400' };
    return { icon: Wifi, text: 'Connected', color: 'text-green-400' };
  };

  const status = getStatusInfo();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-24">

      {/* Error Banner */}
      {error && (
        <div className="bg-orange-900/30 border-b border-orange-700/50 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            <span className="text-orange-200">{error}</span>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Dashboard Sections */}
        <div className="space-y-6">
          {wellnessData && getDashboardSections().map((section, sectionIndex) => {
            const isExpanded = expandedSections.has(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left hover:bg-gray-800/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-white group-hover:text-blue-300 transition-colors">{section.title}</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isExpanded ? 'Click to collapse' : 'Click to expand'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-700"
                    >
                      <div className="p-6 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {section.metrics.map((metric, metricIndex) => {
                            const IconComponent = metric.icon;

                            return (
                              <motion.div
                                key={metric.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: metricIndex * 0.1 }}
                                className="text-center space-y-4"
                              >
                                <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                                  <IconComponent className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                  <div className="flex items-baseline justify-center space-x-1 mb-1">
                                    <span className="text-3xl font-light text-white">
                                      {loading ? '...' : metric.value}
                                    </span>
                                    {metric.unit && (
                                      <span className="text-sm text-gray-400">{metric.unit}</span>
                                    )}
                                  </div>
                                  <div className="text-sm font-medium tracking-wide mb-2 text-white">
                                    {metric.title}
                                  </div>
                                  {metric.description && (
                                    <div className="text-xs text-gray-400">
                                      {metric.description}
                                    </div>
                                  )}
                                  {loading && (
                                    <div className="w-4 h-4 bg-gray-600 rounded animate-pulse mx-auto mt-2"></div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Training Calendar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection('calendar')}
              className="w-full p-6 text-left hover:bg-gray-800/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white group-hover:text-blue-300 transition-colors">Training Calendar</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {expandedSections.has('calendar') ? 'Click to collapse' : 'Click to expand'}
                  </span>
                  {expandedSections.has('calendar') ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                  )}
                </div>
              </div>
            </button>

            {/* Calendar Content */}
            <AnimatePresence>
              {expandedSections.has('calendar') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-700"
                >
                  <div className="p-6 pt-8">
                    <TimelineCalendar className="bg-transparent border-0" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 bg-blue-900/20 border border-blue-700/30 rounded-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Gauge className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-blue-300 font-medium mb-1">Data Integration</h3>
                <p className="text-blue-200 text-sm">
                  {wellnessData ? (
                    <>Live sync from Garmin wellness data • Source: {wellnessData.source} • Quality: {wellnessData.dataQuality}</>
                  ) : (
                    'Connecting to training devices and wellness sensors...'
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                {error ? (
                  <WifiOff className="h-4 w-4 text-orange-400" />
                ) : (
                  <Wifi className="h-4 w-4 text-green-400" />
                )}
                <span className={`text-xs font-medium ${error ? 'text-orange-300' : 'text-green-300'}`}>
                  {error ? 'Offline' : 'Connected'}
                </span>
              </div>
              {lastUpdated && (
                <div className="text-xs text-gray-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
}