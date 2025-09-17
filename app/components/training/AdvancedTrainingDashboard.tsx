'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Calendar,
  Mountain,
  Activity,
  Heart,
  Zap,
  Award,
  Timer,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Plus,
  Check,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoalTracker } from './GoalTracker';
import { PerformanceAnalytics } from './PerformanceAnalytics';

interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  deadline: string;
  category: 'endurance' | 'strength' | 'technical' | 'recovery' | 'nutrition';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused' | 'overdue';
  milestones?: { value: number; date: string; achieved: boolean }[];
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  icon: any;
}

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
}

export function AdvancedTrainingDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Sample goals data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Weekly Vertical Gain',
      target: 3000,
      current: 2840,
      unit: 'm',
      startDate: '2024-01-01',
      deadline: '2024-12-31',
      category: 'endurance',
      priority: 'high',
      status: 'active',
    },
    {
      id: '2',
      title: 'Training Hours/Week',
      target: 15,
      current: 12.5,
      unit: 'hrs',
      startDate: '2024-01-01',
      deadline: '2024-12-31',
      category: 'endurance',
      priority: 'high',
      status: 'active',
    },
    {
      id: '3',
      title: 'Altitude Simulation Sessions',
      target: 8,
      current: 5,
      unit: 'sessions',
      startDate: '2024-01-01',
      deadline: '2024-12-31',
      category: 'technical',
      priority: 'medium',
      status: 'active',
    },
    {
      id: '4',
      title: 'Recovery Heart Rate',
      target: 55,
      current: 58,
      unit: 'bpm',
      startDate: '2024-01-01',
      deadline: '2024-12-31',
      category: 'recovery',
      priority: 'medium',
      status: 'overdue',
    },
  ]);

  // Goal management functions
  const handleAddGoal = (
    newGoalData: Omit<Goal, 'id' | 'status' | 'current'>
  ) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: Date.now().toString(),
      current: 0,
      status: 'active',
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: '1',
      name: 'VO2 Max',
      value: 58.2,
      change: 2.1,
      unit: 'ml/kg/min',
      trend: 'up',
      category: 'Cardiovascular',
      icon: Heart,
    },
    {
      id: '2',
      name: 'Power Output',
      value: 285,
      change: 12,
      unit: 'watts',
      trend: 'up',
      category: 'Strength',
      icon: Zap,
    },
    {
      id: '3',
      name: 'Lactate Threshold',
      value: 168,
      change: -3,
      unit: 'bpm',
      trend: 'down',
      category: 'Endurance',
      icon: Activity,
    },
    {
      id: '4',
      name: 'Recovery Rate',
      value: 92,
      change: 0,
      unit: '%',
      trend: 'stable',
      category: 'Recovery',
      icon: Timer,
    },
  ];

  const predictions: PredictionData[] = [
    {
      metric: 'Everest Readiness Score',
      current: 72,
      predicted: 87,
      confidence: 0.85,
      timeframe: '6 months',
    },
    {
      metric: 'Max Altitude Capability',
      current: 5500,
      predicted: 6800,
      confidence: 0.78,
      timeframe: '4 months',
    },
    {
      metric: 'Endurance Index',
      current: 8.2,
      predicted: 9.1,
      confidence: 0.92,
      timeframe: '3 months',
    },
  ];

  const getGoalStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGoalStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return Check;
      case 'active':
        return Target;
      case 'paused':
        return Timer;
      case 'overdue':
        return AlertCircle;
      default:
        return Minus;
    }
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'endurance':
        return Activity;
      case 'strength':
        return Zap;
      case 'technical':
        return Mountain;
      case 'recovery':
        return Heart;
      default:
        return Target;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return ArrowUp;
      case 'down':
        return ArrowDown;
      default:
        return Minus;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Advanced Training Analytics
          </h1>
          <p className="text-gray-600">
            AI-powered insights and predictive analytics for Everest 2027
            preparation
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Timeframe Selector */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  selectedTimeframe === period
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600'
                )}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </button>
        </div>
      </motion.div>

      {/* Performance Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {performanceMetrics.map((metric) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);

          return (
            <motion.div
              key={metric.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              variants={cardVariants}
              whileHover={{
                y: -2,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'p-3 rounded-xl',
                    metric.trend === 'up' && 'bg-green-100',
                    metric.trend === 'down' && 'bg-red-100',
                    metric.trend === 'stable' && 'bg-blue-100'
                  )}
                >
                  <IconComponent
                    className={cn(
                      'w-6 h-6',
                      metric.trend === 'up' && 'text-green-600',
                      metric.trend === 'down' && 'text-red-600',
                      metric.trend === 'stable' && 'text-blue-600'
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                    metric.trend === 'up' && 'bg-green-100 text-green-700',
                    metric.trend === 'down' && 'bg-red-100 text-red-700',
                    metric.trend === 'stable' && 'bg-gray-100 text-gray-700'
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}
                </div>
              </div>

              <div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">
                  {metric.value}{' '}
                  <span className="text-lg font-normal text-gray-500">
                    {metric.unit}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {metric.name}
                </div>
                <div className="text-xs text-gray-500">{metric.category}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Goals and Predictions Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Goals Section */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Training Goals
            </h3>
            <Target className="w-5 h-5 text-red-600" />
          </div>

          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const StatusIcon = getGoalStatusIcon(goal.status);
              const CategoryIcon = getCategoryIcon(goal.category);

              return (
                <motion.div
                  key={goal.id}
                  className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <CategoryIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {goal.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
                        getGoalStatusColor(goal.status)
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {goal.status.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        goal.status === 'completed' && 'bg-emerald-500',
                        goal.status === 'active' && 'bg-blue-500',
                        goal.status === 'paused' && 'bg-orange-500',
                        goal.status === 'overdue' && 'bg-red-500'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Predictions Section */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              AI Performance Predictions
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live AI Model</span>
            </div>
          </div>

          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.metric}
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    {prediction.metric}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {(prediction.confidence * 100).toFixed(0)}% confidence
                    </span>
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        prediction.confidence > 0.8
                          ? 'bg-green-500'
                          : prediction.confidence > 0.6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      )}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        Current: {prediction.current}
                      </span>
                      <span className="text-gray-900 font-medium">
                        Predicted: {prediction.predicted} in{' '}
                        {prediction.timeframe}
                      </span>
                    </div>

                    <div className="relative w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(prediction.current / prediction.predicted) * 100}%`,
                        }}
                        transition={{ duration: 1.5, delay: index * 0.3 }}
                      />
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-green-500/30 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: index * 0.3 + 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      +
                      {(
                        ((prediction.predicted - prediction.current) /
                          prediction.current) *
                        100
                      ).toFixed(0)}
                      %
                    </div>
                    <div className="text-xs text-gray-500">improvement</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Goal Tracker Section */}
      <GoalTracker
        goals={goals}
        onAddGoal={handleAddGoal}
        onUpdateGoal={handleUpdateGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      {/* Performance Analytics Section */}
      <PerformanceAnalytics />
    </div>
  );
}
