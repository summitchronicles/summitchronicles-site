'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import {
  HeartIcon,
  BoltIcon,
  MoonIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ScaleIcon,
  BeakerIcon,
  ChartBarIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import {
  GlassCard,
  StatusIndicator,
  ProgressBar,
  MountainButton,
} from '@/app/components/ui';

interface BiometricData {
  timestamp: string;
  heartRate?: {
    resting: number;
    max: number;
    variability: number;
  };
  sleep?: {
    duration: number;
    quality: number;
    deepSleep: number;
    remSleep: number;
  };
  stress?: {
    level: number;
    recovery: number;
  };
  bodyComposition?: {
    weight: number;
    bodyFat: number;
    muscleMass: number;
    hydration: number;
  };
  recovery?: {
    score: number;
    readiness: number;
    recommendation: string;
  };
}

interface RecoveryInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  message: string;
  recommendation: string;
  confidence: number;
  trend?: 'improving' | 'declining' | 'stable';
  category: 'sleep' | 'stress' | 'heart' | 'recovery' | 'nutrition';
}

interface BiometricTrackerProps {
  data?: BiometricData[];
  className?: string;
  onDeviceConnect?: (deviceType: string) => void;
}

export default function BiometricTracker({
  data = [],
  className = '',
  onDeviceConnect,
}: BiometricTrackerProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('recovery');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [insights, setInsights] = useState<RecoveryInsight[]>([]);

  // Generate recovery insights from biometric data
  const recoveryAnalysis = useMemo(() => {
    if (data.length === 0) return null;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const weekData = data.slice(-7);

    // Calculate trends
    const hrTrend =
      previous && latest.heartRate && previous.heartRate
        ? latest.heartRate.resting - previous.heartRate.resting
        : 0;

    const sleepTrend =
      previous && latest.sleep && previous.sleep
        ? latest.sleep.quality - previous.sleep.quality
        : 0;

    const avgRecovery =
      weekData
        .filter((d) => d.recovery?.score)
        .reduce((sum, d) => sum + d.recovery!.score, 0) /
      Math.max(weekData.length, 1);

    return {
      current: latest,
      trends: {
        heartRate:
          hrTrend > 5 ? 'declining' : hrTrend < -5 ? 'improving' : 'stable',
        sleep:
          sleepTrend > 0.1
            ? 'improving'
            : sleepTrend < -0.1
              ? 'declining'
              : 'stable',
        weeklyRecovery: avgRecovery,
      },
      recommendations: generateRecoveryRecommendations(latest, weekData),
    };
  }, [data]);

  const generateRecoveryRecommendations = (
    latest: BiometricData,
    weekData: BiometricData[]
  ): RecoveryInsight[] => {
    const recommendations: RecoveryInsight[] = [];

    // Sleep analysis
    if (latest.sleep) {
      if (latest.sleep.duration < 7) {
        recommendations.push({
          id: 'sleep-duration',
          type: 'warning',
          title: 'Insufficient Sleep Duration',
          message: `You got ${latest.sleep.duration.toFixed(1)} hours of sleep. Aim for 7-9 hours for optimal recovery.`,
          recommendation:
            'Consider adjusting your bedtime routine and limiting screen time before bed.',
          confidence: 0.9,
          trend: 'declining',
          category: 'sleep',
        });
      }

      if (latest.sleep.quality < 0.6) {
        recommendations.push({
          id: 'sleep-quality',
          type: 'critical',
          title: 'Poor Sleep Quality',
          message:
            'Your sleep quality score is below optimal levels for athletic recovery.',
          recommendation:
            'Focus on sleep hygiene: cool, dark room, consistent schedule, and relaxation techniques.',
          confidence: 0.85,
          category: 'sleep',
        });
      }
    }

    // Heart rate variability
    if (latest.heartRate && latest.heartRate.variability < 30) {
      recommendations.push({
        id: 'hrv-low',
        type: 'warning',
        title: 'Low Heart Rate Variability',
        message: 'Your HRV suggests your nervous system may be under stress.',
        recommendation:
          'Consider easier training, meditation, or breathing exercises to improve recovery.',
        confidence: 0.8,
        category: 'heart',
      });
    }

    // Recovery score
    if (latest.recovery && latest.recovery.score < 60) {
      recommendations.push({
        id: 'recovery-low',
        type: 'critical',
        title: 'Low Recovery Score',
        message: `Recovery score of ${latest.recovery.score}% indicates you need more rest.`,
        recommendation:
          latest.recovery.recommendation ||
          'Take an easy day or complete rest to allow your body to recover.',
        confidence: 0.95,
        category: 'recovery',
      });
    }

    // Positive feedback for good metrics
    if (latest.recovery && latest.recovery.score > 85) {
      recommendations.push({
        id: 'recovery-excellent',
        type: 'success',
        title: 'Excellent Recovery',
        message: `Outstanding recovery score of ${latest.recovery.score}%! Your body is well-adapted to training.`,
        recommendation:
          'You&apos;re ready for high-intensity training or a challenging workout.',
        confidence: 0.9,
        trend: 'improving',
        category: 'recovery',
      });
    }

    return recommendations;
  };

  useEffect(() => {
    if (recoveryAnalysis) {
      setInsights(recoveryAnalysis.recommendations);
    }
  }, [recoveryAnalysis]);

  const handleDeviceConnect = async (deviceType: string) => {
    setIsConnecting(true);

    // Simulate device connection
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setConnectedDevices((prev) => [...prev, deviceType]);
      onDeviceConnect?.(deviceType);
    } catch (error) {
      console.error('Device connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'recovery':
        return BoltIcon;
      case 'heart':
        return HeartIcon;
      case 'sleep':
        return MoonIcon;
      case 'stress':
        return ExclamationTriangleIcon;
      case 'body':
        return ScaleIcon;
      default:
        return ChartBarIcon;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return ExclamationTriangleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'success':
        return CheckCircleIcon;
      default:
        return BeakerIcon;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-dangerRed bg-dangerRed/10 border-dangerRed/20';
      case 'warning':
        return 'text-warningOrange bg-warningOrange/10 border-warningOrange/20';
      case 'success':
        return 'text-successGreen bg-successGreen/10 border-successGreen/20';
      default:
        return 'text-glacierBlue bg-glacierBlue/10 border-glacierBlue/20';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving':
        return ArrowTrendingUpIcon;
      case 'declining':
        return ArrowTrendingDownIcon;
      default:
        return null;
    }
  };

  if (data.length === 0) {
    return (
      <div className={clsx('space-y-6', className)}>
        <GlassCard className="p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Connect Your Health Devices
          </h3>
          <p className="text-gray-400 mb-6">
            Sync biometric data from your wearables to get personalized recovery
            insights and training recommendations.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[
              { name: 'Heart Rate Monitor', type: 'hrm', icon: HeartIcon },
              { name: 'Sleep Tracker', type: 'sleep', icon: MoonIcon },
              {
                name: 'Fitness Watch',
                type: 'watch',
                icon: DevicePhoneMobileIcon,
              },
              { name: 'Smart Scale', type: 'scale', icon: ScaleIcon },
            ].map((device) => {
              const IconComponent = device.icon;
              const isConnected = connectedDevices.includes(device.type);

              return (
                <MountainButton
                  key={device.type}
                  variant={isConnected ? 'accent' : 'secondary'}
                  size="sm"
                  disabled={isConnecting}
                  loading={isConnecting}
                  onClick={() => handleDeviceConnect(device.type)}
                  className="flex flex-col items-center space-y-2 p-4 h-auto"
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-xs text-center">{device.name}</span>
                  {isConnected && (
                    <div className="flex items-center space-x-1">
                      <WifiIcon className="w-3 h-3 text-successGreen" />
                      <span className="text-xs text-successGreen">
                        Connected
                      </span>
                    </div>
                  )}
                </MountainButton>
              );
            })}
          </div>
        </GlassCard>
      </div>
    );
  }

  const latest = recoveryAnalysis?.current;

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-successGreen to-glacierBlue rounded-xl">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recovery Tracking</h2>
            <p className="text-gray-400">
              AI-powered biometric analysis for optimal training
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusIndicator
            status={
              latest?.recovery?.score
                ? latest.recovery.score > 80
                  ? 'success'
                  : latest.recovery.score > 60
                    ? 'warning'
                    : 'danger'
                : 'info'
            }
            text={
              latest?.recovery?.score
                ? `${latest.recovery.score}% Ready`
                : 'No Data'
            }
            pulse={Boolean(
              latest?.recovery?.score && latest.recovery.score < 60
            )}
          />
        </div>
      </div>

      {/* Metric Selector */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'recovery', label: 'Recovery', icon: BoltIcon },
            { key: 'heart', label: 'Heart Rate', icon: HeartIcon },
            { key: 'sleep', label: 'Sleep', icon: MoonIcon },
            { key: 'stress', label: 'Stress', icon: ExclamationTriangleIcon },
            { key: 'body', label: 'Body Comp', icon: ScaleIcon },
          ].map(({ key, label, icon: IconComponent }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={clsx(
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                selectedMetric === key
                  ? 'bg-alpineBlue text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <IconComponent className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Current Metrics Display */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recovery Score */}
          {latest.recovery && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BoltIcon className="w-8 h-8 text-summitGold" />
                <span className="text-2xl font-bold text-white">
                  {latest.recovery.score}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Recovery Score
              </h3>
              <ProgressBar
                value={latest.recovery.score}
                variant="gradient"
                showValue={false}
                className="mb-2"
              />
              <p className="text-xs text-gray-300">
                Readiness: {latest.recovery.readiness}%
              </p>
            </GlassCard>
          )}

          {/* Heart Rate */}
          {latest.heartRate && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HeartIcon className="w-8 h-8 text-dangerRed" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {latest.heartRate.resting}
                  </div>
                  <div className="text-xs text-gray-400">bpm</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Resting HR
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">HRV:</span>
                  <span className="text-white">
                    {latest.heartRate.variability}ms
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Max:</span>
                  <span className="text-white">{latest.heartRate.max} bpm</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Sleep */}
          {latest.sleep && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <MoonIcon className="w-8 h-8 text-glacierBlue" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {latest.sleep.duration.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-400">sleep</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Sleep Quality
              </h3>
              <ProgressBar
                value={latest.sleep.quality * 100}
                variant="gradient"
                showValue={false}
                className="mb-2"
              />
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Deep:</span>
                  <span className="text-white">
                    {(latest.sleep.deepSleep * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">REM:</span>
                  <span className="text-white">
                    {(latest.sleep.remSleep * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Stress */}
          {latest.stress && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-warningOrange" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {latest.stress.level}
                  </div>
                  <div className="text-xs text-gray-400">stress</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Stress Level
              </h3>
              <ProgressBar
                value={latest.stress.level}
                variant={
                  latest.stress.level > 70
                    ? 'danger'
                    : latest.stress.level > 40
                      ? 'warning'
                      : 'success'
                }
                showValue={false}
                className="mb-2"
              />
              <p className="text-xs text-gray-300">
                Recovery: {latest.stress.recovery}%
              </p>
            </GlassCard>
          )}
        </div>
      )}

      {/* AI Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <BeakerIcon className="w-5 h-5 text-aurora-purple" />
          <span>Recovery Insights</span>
        </h3>

        <AnimatePresence>
          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            const colorClasses = getInsightColor(insight.type);
            const TrendIcon = getTrendIcon(insight.trend);

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:bg-white/5 transition-colors duration-300">
                  <div className="flex items-start space-x-4">
                    <div
                      className={clsx(
                        'p-3 rounded-xl border flex-shrink-0',
                        colorClasses
                      )}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          {insight.title}
                        </h4>
                        <div className="flex items-center space-x-2 ml-4">
                          {TrendIcon && (
                            <TrendIcon
                              className={clsx(
                                'w-4 h-4',
                                insight.trend === 'improving'
                                  ? 'text-successGreen'
                                  : 'text-dangerRed'
                              )}
                            />
                          )}
                          <StatusIndicator
                            status={
                              insight.type === 'critical'
                                ? 'danger'
                                : insight.type === 'warning'
                                  ? 'warning'
                                  : insight.type === 'success'
                                    ? 'success'
                                    : 'info'
                            }
                            text={insight.category}
                            size="sm"
                          />
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">
                        {insight.message}
                      </p>

                      <div className="p-3 bg-white/5 rounded-lg border-l-4 border-summitGold">
                        <div className="flex items-start space-x-2">
                          <BoltIcon className="w-4 h-4 text-summitGold flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-white mb-1">
                              Recommendation:
                            </div>
                            <div className="text-sm text-gray-300">
                              {insight.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {insight.category.charAt(0).toUpperCase() +
                              insight.category.slice(1)}{' '}
                            Analysis
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
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {insights.length === 0 && (
          <GlassCard className="p-8 text-center">
            <CheckCircleIcon className="w-12 h-12 text-successGreen mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Everything Looks Great!
            </h3>
            <p className="text-gray-400">
              Your biometric data shows good recovery patterns. Keep up the
              excellent work!
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
