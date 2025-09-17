'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import {
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ClockIcon,
  HeartIcon,
  BoltIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { GlassCard, StatusIndicator, ProgressBar } from '@/app/components/ui';
import { TrainingInsight, AITrainingAnalyzer } from '@/lib/ai-training';

interface TrainingInsightsProps {
  activities: any[];
  biometrics?: any[];
  goals?: any[];
  className?: string;
}

const getInsightIcon = (type: TrainingInsight['type']) => {
  switch (type) {
    case 'recommendation':
      return LightBulbIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'achievement':
      return CheckCircleIcon;
    case 'pattern':
      return TrendingUpIcon;
    case 'prediction':
      return SparklesIcon;
    default:
      return BoltIcon;
  }
};

const getInsightColor = (
  type: TrainingInsight['type'],
  priority: TrainingInsight['priority']
) => {
  if (priority === 'critical')
    return 'text-dangerRed bg-dangerRed/10 border-dangerRed/20';

  switch (type) {
    case 'recommendation':
      return 'text-glacierBlue bg-glacierBlue/10 border-glacierBlue/20';
    case 'warning':
      return 'text-warningOrange bg-warningOrange/10 border-warningOrange/20';
    case 'achievement':
      return 'text-successGreen bg-successGreen/10 border-successGreen/20';
    case 'pattern':
      return 'text-summitGold bg-summitGold/10 border-summitGold/20';
    case 'prediction':
      return 'text-aurora-purple bg-purple-500/10 border-purple-500/20';
    default:
      return 'text-stoneGray bg-gray-500/10 border-gray-500/20';
  }
};

const getCategoryIcon = (category: TrainingInsight['category']) => {
  switch (category) {
    case 'fitness':
      return BoltIcon;
    case 'recovery':
      return HeartIcon;
    case 'nutrition':
      return SparklesIcon;
    case 'technique':
      return AcademicCapIcon;
    case 'planning':
      return CalendarDaysIcon;
    default:
      return ChartBarIcon;
  }
};

export default function TrainingInsights({
  activities,
  biometrics = [],
  goals = [],
  className = '',
}: TrainingInsightsProps) {
  const [insights, setInsights] = useState<TrainingInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Generate insights when data changes
  const generatedInsights = useMemo(() => {
    if (activities.length === 0) return [];

    // Convert activities to the expected format
    const formattedActivities = activities.map((activity) => ({
      id: activity.id?.toString() || Math.random().toString(),
      name: activity.name || activity.title || 'Untitled Activity',
      type: activity.type || 'Run',
      distance: activity.distance || 0,
      moving_time: activity.moving_time || activity.duration || 3600,
      total_elevation_gain:
        activity.total_elevation_gain || activity.elevation_gain || 0,
      start_date:
        activity.start_date || activity.date || new Date().toISOString(),
      average_speed: activity.average_speed,
      max_speed: activity.max_speed,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      suffer_score: activity.suffer_score,
      calories: activity.calories,
    }));

    // Analyze training patterns
    const patterns =
      AITrainingAnalyzer.analyzeTrainingPatterns(formattedActivities);

    // Generate insights
    return AITrainingAnalyzer.generateTrainingInsights(
      formattedActivities,
      biometrics,
      goals,
      patterns
    );
  }, [activities, biometrics, goals]);

  useEffect(() => {
    setIsAnalyzing(true);

    // Simulate analysis time for better UX
    const timer = setTimeout(() => {
      setInsights(generatedInsights);
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [generatedInsights]);

  // Filter insights based on selections
  const filteredInsights = insights.filter((insight) => {
    if (selectedCategory !== 'all' && insight.category !== selectedCategory)
      return false;
    if (selectedPriority !== 'all' && insight.priority !== selectedPriority)
      return false;
    return true;
  });

  const categories = [
    'all',
    'fitness',
    'recovery',
    'nutrition',
    'technique',
    'planning',
  ];
  const priorities = ['all', 'critical', 'high', 'medium', 'low'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  if (activities.length === 0) {
    return (
      <GlassCard className={clsx('p-8 text-center', className)}>
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          AI Training Analysis
        </h3>
        <p className="text-gray-400">
          Upload some training activities to get personalized AI insights and
          recommendations.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-aurora-blue to-aurora-purple rounded-xl">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Training Insights
            </h2>
            <p className="text-gray-400">
              Personalized recommendations powered by machine learning
            </p>
          </div>
        </div>

        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-aurora-blue">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <SparklesIcon className="w-5 h-5" />
            </motion.div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">Category:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const CategoryIcon =
                  category !== 'all'
                    ? getCategoryIcon(category as any)
                    : ChartBarIcon;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={clsx(
                      'flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                      selectedCategory === category
                        ? 'bg-alpineBlue text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <CategoryIcon className="w-3 h-3" />
                    <span>
                      {category === 'all'
                        ? 'All'
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">Priority:</span>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                    selectedPriority === priority
                      ? 'bg-summitGold text-charcoal'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {priority === 'all'
                    ? 'All'
                    : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(selectedCategory !== 'all' || selectedPriority !== 'all') && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <span className="text-sm text-gray-400">
              Showing {filteredInsights.length} of {insights.length} insights
            </span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPriority('all');
              }}
              className="text-xs text-summitGold hover:text-yellow-400 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </GlassCard>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-700 rounded" />
                      <div className="h-2 bg-gray-700 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Insights Grid */}
      {!isAnalyzing && (
        <AnimatePresence mode="wait">
          {filteredInsights.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {filteredInsights.map((insight) => {
                const IconComponent = getInsightIcon(insight.type);
                const CategoryIcon = getCategoryIcon(insight.category);
                const colorClasses = getInsightColor(
                  insight.type,
                  insight.priority
                );

                return (
                  <motion.div key={insight.id} variants={item}>
                    <GlassCard className="p-6 hover:bg-white/5 transition-colors duration-300">
                      <div className="flex items-start space-x-4">
                        {/* Insight Icon */}
                        <div
                          className={clsx(
                            'p-3 rounded-xl border flex-shrink-0',
                            colorClasses
                          )}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {insight.title}
                              </h3>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {insight.description}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <StatusIndicator
                                status={
                                  insight.priority === 'critical'
                                    ? 'danger'
                                    : insight.priority === 'high'
                                      ? 'warning'
                                      : insight.priority === 'medium'
                                        ? 'info'
                                        : 'success'
                                }
                                text={insight.priority}
                                size="sm"
                              />
                            </div>
                          </div>

                          {/* Action */}
                          <div className="mb-4 p-3 bg-white/5 rounded-lg border-l-4 border-summitGold">
                            <div className="flex items-start space-x-2">
                              <LightBulbIcon className="w-4 h-4 text-summitGold flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-white mb-1">
                                  Recommended Action:
                                </div>
                                <div className="text-sm text-gray-300">
                                  {insight.action}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Confidence & Reasoning */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <CategoryIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {insight.category.charAt(0).toUpperCase() +
                                    insight.category.slice(1)}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">
                                  Confidence:
                                </span>
                                <ProgressBar
                                  value={insight.confidence * 100}
                                  variant="gradient"
                                  size="sm"
                                  animated={false}
                                  showValue={false}
                                  className="w-16"
                                />
                                <span className="text-xs font-medium text-white">
                                  {Math.round(insight.confidence * 100)}%
                                </span>
                              </div>
                            </div>

                            {/* Reasoning Details */}
                            {insight.reasoning.length > 0 && (
                              <details className="group">
                                <summary className="cursor-pointer text-xs text-summitGold hover:text-yellow-400 transition-colors">
                                  View Analysis Details
                                </summary>
                                <div className="mt-2 space-y-1">
                                  {insight.reasoning.map((reason, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-2 text-xs text-gray-400"
                                    >
                                      <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-2" />
                                      <span>{reason}</span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}

                            {/* Trend Indicator */}
                            {insight.data.trend && (
                              <div className="flex items-center space-x-2">
                                <TrendingUpIcon
                                  className={clsx(
                                    'w-4 h-4',
                                    insight.data.trend === 'improving'
                                      ? 'text-successGreen'
                                      : insight.data.trend === 'declining'
                                        ? 'text-dangerRed'
                                        : 'text-gray-400'
                                  )}
                                />
                                <span className="text-xs text-gray-400">
                                  Trend: {insight.data.trend}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="p-8 text-center">
                <ShieldCheckIcon className="w-12 h-12 text-successGreen mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  All Good!
                </h3>
                <p className="text-gray-400">
                  No critical insights or recommendations at this time. Keep up
                  the great training!
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
