'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Activity,
  Mountain,
  TrendingUp,
  Target,
  Clock,
  Heart,
  Brain,
  Moon,
  Zap,
  Gauge,
  Calendar,
  Award
} from 'lucide-react';
import { InteractiveMetricCard } from './InteractiveMetricCard';

interface TrainingMetrics {
  totalActivities: number;
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  weeklyProgress: number;
  monthlyGoal: number;
  lastActivity?: {
    name: string;
    date: string;
    distance: number;
    elevation: number;
    type: string;
  };
}

interface WellnessMetrics {
  resting_hr: number;
  stress_level: number;
  sleep_hours: number;
  recovery_status: string;
  readiness_score: number;
}

interface EnhancedTrainingDashboardProps {
  metrics?: TrainingMetrics;
  wellnessMetrics?: WellnessMetrics;
  loading?: boolean;
  error?: string | null;
}

export function EnhancedTrainingDashboard({
  metrics,
  wellnessMetrics,
  loading = false,
  error = null
}: EnhancedTrainingDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState(new Set<string>(['dashboard']));

  // Intersection observer for progressive loading
  const { ref: intersectionRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      setVisibleSections(prev => new Set([...prev, 'dashboard']));
    }
  }, [inView]);

  // Generate sample historical data for demo
  const generateHistoricalData = (baseValue: number, days: number = 30) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.max(0, baseValue + (Math.random() - 0.5) * baseValue * 0.3)
    }));
  };

  // Create enhanced metric data with trends and insights
  const enhancedMetrics = useMemo(() => {
    // Use actual metrics if available, otherwise provide demo data for testing
    const effectiveMetrics = metrics && metrics.totalActivities > 0 ? metrics : {
      totalActivities: 42,
      totalDistance: 1247800, // 1247.8 km in meters
      totalElevation: 230200, // 230.2K m in meters
      totalTime: 187.5 * 3600, // 187.5 hours in seconds
      weeklyProgress: 85,
      monthlyGoal: 100
    };

    return [
      {
        id: 'total-activities',
        label: 'Total Activities',
        value: effectiveMetrics.totalActivities,
        suffix: '',
        icon: Activity,
        description: 'Training sessions completed this year',
        color: 'blue',
        trendData: {
          value: effectiveMetrics.totalActivities,
          direction: 'up' as const,
          percentage: 12.5,
          period: 'vs last month'
        },
        detailData: {
          history: generateHistoricalData(effectiveMetrics.totalActivities / 30),
          insights: [
            'Consistent training frequency shows 12% improvement',
            'Average 4.2 sessions per week exceeds recommended baseline',
            'No training gaps longer than 3 days in past month'
          ],
          recommendations: [
            'Consider adding one recovery session per week',
            'Vary training intensity to prevent plateau',
            'Track RPE scores for better load management'
          ],
          comparison: {
            label: 'vs Elite Athletes',
            value: 85,
            benchmark: 'on-target' as const
          }
        }
      },
      {
        id: 'total-elevation',
        label: 'Elevation Gain',
        value: `${(effectiveMetrics.totalElevation / 1000).toFixed(0)}K`,
        suffix: 'm',
        icon: Mountain,
        description: 'Cumulative vertical gain this year',
        color: 'green',
        trendData: {
          value: effectiveMetrics.totalElevation,
          direction: 'up' as const,
          percentage: 18.3,
          period: 'vs last month'
        },
        detailData: {
          history: generateHistoricalData(effectiveMetrics.totalElevation / 30),
          insights: [
            'Elevation gain trending 18% above target',
            'Vertical training load optimal for Everest prep',
            'Progressive overload pattern maintained'
          ],
          recommendations: [
            'Increase altitude simulation training',
            'Add weighted carries on elevation days',
            'Monitor for overuse injuries in lower legs'
          ],
          comparison: {
            label: 'Everest Base Camp Equivalent',
            value: Math.round((effectiveMetrics.totalElevation / 5364) * 100),
            benchmark: 'above' as const
          }
        }
      },
      {
        id: 'weekly-progress',
        label: 'Weekly Goal',
        value: `${effectiveMetrics.weeklyProgress}%`,
        suffix: '',
        icon: TrendingUp,
        description: 'Progress toward weekly training targets',
        color: 'yellow',
        trendData: {
          value: effectiveMetrics.weeklyProgress,
          direction: (effectiveMetrics.weeklyProgress >= 85 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
          percentage: 5.2,
          period: 'vs last week'
        },
        detailData: {
          history: generateHistoricalData(effectiveMetrics.weeklyProgress, 12),
          insights: [
            'Consistently meeting 85%+ of weekly goals',
            'Training adherence improved over last 4 weeks',
            'Best performance on weekend sessions'
          ],
          recommendations: [
            'Maintain current training schedule',
            'Consider increasing weekly volume by 5%',
            'Add flexibility work on rest days'
          ],
          comparison: {
            label: 'Target Adherence',
            value: effectiveMetrics.weeklyProgress,
            benchmark: effectiveMetrics.weeklyProgress >= 80 ? 'above' : 'below'
          }
        }
      },
      {
        id: 'everest-countdown',
        label: 'Everest 2027',
        value: '834',
        suffix: 'days',
        icon: Target,
        description: 'Days remaining until summit attempt',
        color: 'red',
        trendData: {
          value: 834,
          direction: 'down' as const,
          percentage: -1.2,
          period: 'countdown active'
        },
        detailData: {
          history: generateHistoricalData(850, 30),
          insights: [
            'Training timeline on track for 2027 attempt',
            'Current fitness trajectory supports goal',
            'Seasonal training periodization aligned'
          ],
          recommendations: [
            'Begin altitude acclimatization protocols',
            'Schedule technical skills assessments',
            'Plan expedition logistics timeline'
          ],
          comparison: {
            label: 'Preparation Timeline',
            value: 78,
            benchmark: 'on-target' as const
          }
        }
      }
    ];
  }, [metrics]);

  const wellnessMetricsData = useMemo(() => {
    if (!wellnessMetrics) return [];

    return [
      {
        id: 'resting-hr',
        label: 'Resting HR',
        value: wellnessMetrics.resting_hr,
        suffix: 'bpm',
        icon: Heart,
        description: 'Average resting heart rate',
        color: 'red',
        trendData: {
          value: wellnessMetrics.resting_hr,
          direction: 'down' as const,
          percentage: -2.1,
          period: '7-day average'
        },
        detailData: {
          history: generateHistoricalData(wellnessMetrics.resting_hr, 14),
          insights: [
            'RHR trending downward indicates improving fitness',
            'Cardiovascular adaptation progressing well',
            'Recovery between sessions optimal'
          ],
          recommendations: [
            'Continue current training intensity',
            'Monitor for signs of overtraining',
            'Maintain consistent sleep schedule'
          ],
          comparison: {
            label: 'Elite Endurance Range',
            value: wellnessMetrics.resting_hr <= 55 ? 95 : 75,
            benchmark: wellnessMetrics.resting_hr <= 55 ? 'above' : 'on-target'
          }
        }
      },
      {
        id: 'stress-level',
        label: 'Stress Level',
        value: wellnessMetrics.stress_level,
        suffix: '/100',
        icon: Brain,
        description: 'Physiological stress indicator',
        color: 'orange',
        trendData: {
          value: wellnessMetrics.stress_level,
          direction: 'stable' as const,
          percentage: 0.8,
          period: 'daily average'
        },
        detailData: {
          history: generateHistoricalData(wellnessMetrics.stress_level, 14),
          insights: [
            'Stress levels within optimal training range',
            'Good balance between training and recovery',
            'No concerning stress spikes detected'
          ],
          recommendations: [
            'Continue meditation practice',
            'Ensure adequate sleep duration',
            'Consider stress management techniques'
          ]
        }
      },
      {
        id: 'sleep-hours',
        label: 'Sleep',
        value: wellnessMetrics.sleep_hours,
        suffix: 'hrs',
        icon: Moon,
        description: 'Average nightly sleep duration',
        color: 'purple',
        trendData: {
          value: wellnessMetrics.sleep_hours,
          direction: 'up' as const,
          percentage: 3.4,
          period: 'weekly average'
        },
        detailData: {
          history: generateHistoricalData(wellnessMetrics.sleep_hours, 14),
          insights: [
            'Sleep duration above recommended 7+ hours',
            'Sleep quality supporting training adaptation',
            'Consistent bedtime routine maintained'
          ],
          recommendations: [
            'Maintain current sleep schedule',
            'Optimize sleep environment for recovery',
            'Track sleep quality metrics'
          ]
        }
      },
      {
        id: 'readiness-score',
        label: 'Readiness',
        value: wellnessMetrics.readiness_score,
        suffix: '/100',
        icon: Zap,
        description: 'Overall training readiness score',
        color: 'green',
        trendData: {
          value: wellnessMetrics.readiness_score,
          direction: 'up' as const,
          percentage: 4.7,
          period: 'trending upward'
        },
        detailData: {
          history: generateHistoricalData(wellnessMetrics.readiness_score, 14),
          insights: [
            'High readiness score indicates optimal training state',
            'Recovery protocols working effectively',
            'Body adapting well to training load'
          ],
          recommendations: [
            'Capitalize on high readiness with quality sessions',
            'Maintain current recovery strategies',
            'Monitor for any declining trends'
          ]
        }
      }
    ];
  }, [wellnessMetrics]);

  const handleMetricExplore = (metricId: string) => {
    setSelectedMetric(metricId);
    // Could trigger analytics tracking or additional data loading
    console.log(`Exploring metric: ${metricId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Gauge className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading training insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 mb-2">Unable to load training data</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={intersectionRef} className="space-y-8" data-testid="enhanced-dashboard">
      <AnimatePresence>
        {visibleSections.has('dashboard') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Training Metrics Section */}
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-light text-white mb-2 flex items-center">
                  <Mountain className="w-8 h-8 text-blue-400 mr-3" />
                  Training Performance
                </h2>
                <p className="text-gray-400">
                  Interactive metrics showing your progress toward Everest 2027
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {enhancedMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InteractiveMetricCard
                      metric={metric}
                      onExplore={handleMetricExplore}
                      size="medium"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Wellness Metrics Section */}
            {wellnessMetrics && (
              <section>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-light text-white mb-2 flex items-center">
                    <Heart className="w-8 h-8 text-red-400 mr-3" />
                    Wellness & Recovery
                  </h2>
                  <p className="text-gray-400">
                    Real-time health metrics from Garmin integration
                  </p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.3
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {wellnessMetricsData.map((metric, index) => (
                    <motion.div
                      key={metric.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      transition={{ delay: (index + 4) * 0.1 }}
                    >
                      <InteractiveMetricCard
                        metric={metric}
                        onExplore={handleMetricExplore}
                        size="medium"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Quick Actions Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-6 bg-gray-800/50 border border-gray-700 rounded-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Quick Actions</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    Log Training
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                    View Calendar
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                    Sync Devices
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}