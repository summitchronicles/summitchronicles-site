'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import {
  SparklesIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  GlassCard,
  ProgressBar,
  StatusIndicator,
  MountainButton,
} from '@/app/components/ui';
import { ExpeditionGoal, AITrainingAnalyzer } from '@/lib/ai-training';

interface PredictiveAnalysisProps {
  activities: any[];
  goals?: ExpeditionGoal[];
  className?: string;
}

interface ExpeditionPrediction {
  goal: ExpeditionGoal;
  successProbability: number;
  fitnessReadiness: number;
  recommendations: string[];
  risks: string[];
  timeRemaining: number;
  improvementNeeded: number;
}

const mockGoals: ExpeditionGoal[] = [
  {
    id: '1',
    name: 'Mount Rainier',
    type: 'peak',
    difficulty: 6,
    targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months from now
    estimatedDuration: 3,
    requiredFitnessLevel: 7,
    altitudeGain: 3000,
    technicalGrade: 'Alpine Grade II',
    conditions: {
      season: 'Summer',
      weather: 'Variable',
      temperature: { min: -10, max: 15 },
    },
  },
  {
    id: '2',
    name: 'Mont Blanc',
    type: 'peak',
    difficulty: 7,
    targetDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000), // 6.5 months from now
    estimatedDuration: 2,
    requiredFitnessLevel: 8,
    altitudeGain: 3500,
    technicalGrade: 'PD+',
    conditions: {
      season: 'Summer',
      weather: 'Alpine',
      temperature: { min: -15, max: 10 },
    },
  },
  {
    id: '3',
    name: 'Everest Base Camp Trek',
    type: 'route',
    difficulty: 5,
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
    estimatedDuration: 14,
    requiredFitnessLevel: 6,
    altitudeGain: 2500,
    technicalGrade: 'Trekking',
    conditions: {
      season: 'Pre-monsoon',
      weather: 'Clear',
      temperature: { min: -10, max: 20 },
    },
  },
];

export default function PredictiveAnalysis({
  activities,
  goals = mockGoals,
  className = '',
}: PredictiveAnalysisProps) {
  const [predictions, setPredictions] = useState<ExpeditionPrediction[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFitness, setCurrentFitness] = useState(0);

  // Calculate current fitness level from activities
  const calculatedFitness = useMemo(() => {
    if (activities.length === 0) return 5; // Default fitness level

    const recentActivities = activities.slice(0, 20);
    const totalHours = recentActivities.reduce(
      (sum, a) => sum + (a.moving_time || a.duration || 3600) / 3600,
      0
    );
    const avgElevation =
      recentActivities.reduce(
        (sum, a) => sum + (a.total_elevation_gain || a.elevation_gain || 0),
        0
      ) / recentActivities.length;

    // Simple fitness scoring (1-10 scale)
    const volumeScore = Math.min(10, totalHours / 10); // 100 hours = max score
    const elevationScore = Math.min(10, avgElevation / 100); // 1000m avg = max score
    const consistencyScore = Math.min(10, recentActivities.length / 2); // 20 activities = max score

    return Math.round((volumeScore + elevationScore + consistencyScore) / 3);
  }, [activities]);

  useEffect(() => {
    setCurrentFitness(calculatedFitness);
  }, [calculatedFitness]);

  // Generate predictions when data changes
  useEffect(() => {
    if (goals.length === 0) return;

    setIsAnalyzing(true);

    const timer = setTimeout(() => {
      const newPredictions = goals.map((goal) => {
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

        const patterns =
          AITrainingAnalyzer.analyzeTrainingPatterns(formattedActivities);
        const prediction = AITrainingAnalyzer.predictExpeditionSuccess(
          goal,
          { overall: currentFitness / 10 }, // Convert to 0-1 scale
          formattedActivities,
          patterns
        );

        const timeRemaining =
          (goal.targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
        const improvementNeeded = Math.max(
          0,
          goal.requiredFitnessLevel - currentFitness
        );

        return {
          goal,
          ...prediction,
          timeRemaining,
          improvementNeeded,
        };
      });

      setPredictions(newPredictions);
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [goals, activities, currentFitness]);

  const getSuccessProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-successGreen';
    if (probability >= 0.6) return 'text-summitGold';
    if (probability >= 0.4) return 'text-warningOrange';
    return 'text-dangerRed';
  };

  const getReadinessStatus = (readiness: number) => {
    if (readiness >= 0.9) return { status: 'success', text: 'Excellent' };
    if (readiness >= 0.7) return { status: 'info', text: 'Good' };
    if (readiness >= 0.5) return { status: 'warning', text: 'Fair' };
    return { status: 'danger', text: 'Poor' };
  };

  if (activities.length === 0) {
    return (
      <GlassCard className={clsx('p-8 text-center', className)}>
        <div className="text-6xl mb-4">🔮</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Expedition Success Prediction
        </h3>
        <p className="text-gray-400">
          Upload training data to get AI-powered success predictions for your
          expeditions.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-aurora-purple to-aurora-blue rounded-xl">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Expedition Success Prediction
            </h2>
            <p className="text-gray-400">
              AI-powered analysis of your expedition readiness
            </p>
          </div>
        </div>

        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-aurora-purple">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </motion.div>
            <span className="text-sm">Calculating predictions...</span>
          </div>
        )}
      </div>

      {/* Current Fitness Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Current Fitness Assessment
          </h3>
          <div className="flex items-center space-x-2">
            <FireIcon className="w-5 h-5 text-summitGold" />
            <span className="text-2xl font-bold text-white">
              {currentFitness}/10
            </span>
          </div>
        </div>

        <ProgressBar
          value={currentFitness * 10}
          variant="altitude"
          size="lg"
          animated
          showValue={false}
          className="mb-3"
        />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-glacierBlue">
              {activities.length}
            </div>
            <div className="text-xs text-gray-400">Activities Logged</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-summitGold">
              {Math.round(
                activities.reduce(
                  (sum, a) => sum + (a.moving_time || 3600) / 3600,
                  0
                )
              )}
              h
            </div>
            <div className="text-xs text-gray-400">Total Training</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-successGreen">
              {Math.round(
                activities.reduce(
                  (sum, a) => sum + (a.total_elevation_gain || 0),
                  0
                ) / 1000
              )}
              km
            </div>
            <div className="text-xs text-gray-400">Elevation Gained</div>
          </div>
        </div>
      </GlassCard>

      {/* Predictions Grid */}
      {isAnalyzing ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <GlassCard key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-700 rounded w-2/3" />
                  <div className="w-8 h-8 bg-gray-700 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
                <div className="h-2 bg-gray-700 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-8 bg-gray-700 rounded" />
                  <div className="h-8 bg-gray-700 rounded" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {predictions.map((prediction) => (
            <motion.div
              key={prediction.goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-6 hover:bg-white/5 transition-colors duration-300 relative overflow-hidden">
                {/* Background gradient based on success probability */}
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    background:
                      prediction.successProbability >= 0.7
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : prediction.successProbability >= 0.5
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  }}
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {prediction.goal.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{prediction.goal.technicalGrade}</span>
                      <span>•</span>
                      <span>{Math.round(prediction.timeRemaining)} days</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={clsx(
                        'text-2xl font-bold',
                        getSuccessProbabilityColor(
                          prediction.successProbability
                        )
                      )}
                    >
                      {Math.round(prediction.successProbability * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                </div>

                {/* Success Probability Bar */}
                <div className="mb-4">
                  <ProgressBar
                    value={prediction.successProbability * 100}
                    variant={
                      prediction.successProbability >= 0.7
                        ? 'success'
                        : prediction.successProbability >= 0.5
                          ? 'warning'
                          : 'danger'
                    }
                    size="md"
                    animated
                    showValue={false}
                    glow
                  />
                </div>

                {/* Readiness Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Fitness Readiness
                    </span>
                    <StatusIndicator
                      status={
                        getReadinessStatus(prediction.fitnessReadiness)
                          .status as any
                      }
                      text={
                        getReadinessStatus(prediction.fitnessReadiness).text
                      }
                      size="sm"
                    />
                  </div>

                  {prediction.improvementNeeded > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Improvement Needed
                      </span>
                      <span className="text-sm font-medium text-warningOrange">
                        +{prediction.improvementNeeded} levels
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Target Date</span>
                    <span className="text-sm text-white">
                      {prediction.goal.targetDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Recommendations */}
                {prediction.recommendations.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium text-white flex items-center space-x-1">
                      <CheckCircleIcon className="w-4 h-4 text-successGreen" />
                      <span>Recommendations</span>
                    </div>
                    <div className="space-y-1">
                      {prediction.recommendations
                        .slice(0, 2)
                        .map((rec, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-400 pl-5"
                          >
                            • {rec}
                          </div>
                        ))}
                      {prediction.recommendations.length > 2 && (
                        <button
                          onClick={() =>
                            setSelectedGoal(
                              selectedGoal === prediction.goal.id
                                ? null
                                : prediction.goal.id
                            )
                          }
                          className="text-xs text-summitGold hover:text-yellow-400 transition-colors pl-5"
                        >
                          {selectedGoal === prediction.goal.id
                            ? 'Show less'
                            : `+${prediction.recommendations.length - 2} more`}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Risks */}
                {prediction.risks.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium text-white flex items-center space-x-1">
                      <ShieldExclamationIcon className="w-4 h-4 text-warningOrange" />
                      <span>Risk Factors</span>
                    </div>
                    <div className="space-y-1">
                      {prediction.risks.slice(0, 1).map((risk, index) => (
                        <div key={index} className="text-xs text-gray-400 pl-5">
                          ⚠️ {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedGoal === prediction.goal.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 pt-4 space-y-3"
                    >
                      {prediction.recommendations.slice(2).map((rec, index) => (
                        <div key={index} className="text-xs text-gray-400">
                          • {rec}
                        </div>
                      ))}

                      {prediction.risks.slice(1).map((risk, index) => (
                        <div key={index} className="text-xs text-gray-400">
                          ⚠️ {risk}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <div className="mt-4">
                  <MountainButton
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="text-summitGold border-summitGold/30 hover:bg-summitGold hover:text-charcoal"
                  >
                    View Training Plan
                  </MountainButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Goals State */}
      {predictions.length === 0 && !isAnalyzing && (
        <GlassCard className="p-8 text-center">
          <TrophyIcon className="w-12 h-12 text-summitGold mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Set Your Expedition Goals
          </h3>
          <p className="text-gray-400 mb-4">
            Add expedition goals to get personalized success predictions and
            training recommendations.
          </p>
          <MountainButton variant="gradient" size="lg" className="mx-auto">
            Add Expedition Goal
          </MountainButton>
        </GlassCard>
      )}
    </div>
  );
}
