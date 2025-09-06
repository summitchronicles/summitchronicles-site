"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { clsx } from "clsx";
import {
  TrophyIcon,
  TagIcon as TargetIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  BoltIcon,
  MapIcon,
  ClockIcon,
  FireIcon,
  BeakerIcon as MountainIcon,
  FlagIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { GlassCard, StatusIndicator, ProgressBar, MountainButton } from "@/app/components/ui";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'expedition' | 'fitness' | 'technical' | 'endurance' | 'strength';
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  metrics: {
    target: number;
    current: number;
    unit: string;
    type: 'distance' | 'elevation' | 'time' | 'weight' | 'percentage';
  };
  subgoals: {
    id: string;
    title: string;
    completed: boolean;
    dueDate: string;
  }[];
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
}

interface SuccessPrediction {
  goalId: string;
  successProbability: number;
  confidence: number;
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: string[];
  timelineAdjustment?: {
    suggested: string;
    reasoning: string;
  };
  riskLevel: 'low' | 'medium' | 'high';
}

interface GoalSettingProps {
  userProfile?: any;
  trainingData?: any[];
  biometricData?: any[];
  className?: string;
  onGoalCreate?: (goal: Partial<Goal>) => void;
  onGoalUpdate?: (goalId: string, updates: Partial<Goal>) => void;
  onGoalDelete?: (goalId: string) => void;
}

const PRESET_GOALS = [
  {
    category: 'expedition',
    title: 'Summit Mount Rainier',
    description: 'Complete a successful summit attempt of Mount Rainier via Disappointment Cleaver route',
    metrics: { target: 1, current: 0, unit: 'summit', type: 'percentage' as const },
    subgoals: [
      'Complete glacier travel course',
      'Achieve 15-mile hiking endurance',
      'Practice technical skills on local peaks',
      'Complete gear shakedown'
    ]
  },
  {
    category: 'fitness',
    title: 'Peak Cardiovascular Fitness',
    description: 'Reach target VO2 max for high-altitude performance',
    metrics: { target: 55, current: 45, unit: 'ml/kg/min', type: 'percentage' as const },
    subgoals: [
      'Maintain 5x/week cardio schedule',
      'Complete monthly fitness assessment',
      'Achieve target heart rate zones',
      'Complete altitude simulation training'
    ]
  },
  {
    category: 'technical',
    title: 'Advanced Ice Climbing',
    description: 'Master advanced ice climbing techniques and lead WI4+ routes',
    metrics: { target: 4, current: 2, unit: 'WI grade', type: 'percentage' as const },
    subgoals: [
      'Complete ice climbing course',
      'Lead 10 WI3 routes',
      'Practice ice tool techniques',
      'Complete multi-pitch ice route'
    ]
  }
];

export default function GoalSetting({
  userProfile,
  trainingData = [],
  biometricData = [],
  className = "",
  onGoalCreate,
  onGoalUpdate,
  onGoalDelete
}: GoalSettingProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [predictions, setPredictions] = useState<SuccessPrediction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize with sample goals for demo
  useEffect(() => {
    if (goals.length === 0) {
      const sampleGoals: Goal[] = PRESET_GOALS.map((preset, index) => ({
        id: `goal-${index}`,
        title: preset.title,
        description: preset.description,
        category: preset.category as any,
        priority: 'high',
        targetDate: new Date(Date.now() + (90 + index * 30) * 24 * 60 * 60 * 1000).toISOString(),
        metrics: preset.metrics,
        subgoals: preset.subgoals.map((title, subIndex) => ({
          id: `subgoal-${index}-${subIndex}`,
          title,
          completed: Math.random() > 0.6,
          dueDate: new Date(Date.now() + (30 + subIndex * 15) * 24 * 60 * 60 * 1000).toISOString()
        })),
        status: index === 0 ? 'in_progress' : 'not_started'
      }));
      
      setGoals(sampleGoals);
    }
  }, [goals.length]);

  // Generate success predictions when goals change
  const successPredictions = useMemo(() => {
    if (goals.length === 0) return [];
    
    return goals.map(goal => generateSuccessPrediction(goal, trainingData, biometricData));
  }, [goals, trainingData, biometricData]);

  useEffect(() => {
    setIsAnalyzing(true);
    
    const timer = setTimeout(() => {
      setPredictions(successPredictions);
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [successPredictions]);

  const generateSuccessPrediction = (
    goal: Goal, 
    trainingData: any[], 
    biometricData: any[]
  ): SuccessPrediction => {
    // Simulate AI prediction analysis
    const daysTilTarget = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const completedSubgoals = goal.subgoals.filter(sg => sg.completed).length;
    const totalSubgoals = goal.subgoals.length;
    const progressRate = totalSubgoals > 0 ? completedSubgoals / totalSubgoals : 0;
    
    // Calculate base probability
    let baseProbability = 0.5;
    
    // Adjust for progress rate
    baseProbability += progressRate * 0.3;
    
    // Adjust for timeline
    if (daysTilTarget > 120) baseProbability += 0.15;
    else if (daysTilTarget < 30) baseProbability -= 0.2;
    
    // Adjust for training consistency (mock analysis)
    const hasConsistentTraining = trainingData.length > 10;
    if (hasConsistentTraining) baseProbability += 0.1;
    
    // Adjust for category difficulty
    const categoryDifficulty = {
      'expedition': -0.1,
      'technical': -0.05,
      'fitness': 0.05,
      'endurance': 0.02,
      'strength': 0.03
    };
    baseProbability += categoryDifficulty[goal.category] || 0;
    
    // Clamp between 0.1 and 0.95
    const successProbability = Math.max(0.1, Math.min(0.95, baseProbability));
    
    // Generate factors
    const positiveFactors = [];
    const negativeFactors = [];
    const neutralFactors = [];
    
    if (progressRate > 0.5) positiveFactors.push(`Strong progress: ${Math.round(progressRate * 100)}% of subgoals completed`);
    if (hasConsistentTraining) positiveFactors.push('Consistent training pattern detected');
    if (daysTilTarget > 90) positiveFactors.push('Adequate timeline for preparation');
    
    if (progressRate < 0.3) negativeFactors.push('Limited progress on subgoals');
    if (daysTilTarget < 30) negativeFactors.push('Aggressive timeline may increase risk');
    if (!hasConsistentTraining) negativeFactors.push('Training consistency needs improvement');
    
    neutralFactors.push(`${daysTilTarget} days remaining until target date`);
    neutralFactors.push(`Goal category: ${goal.category}`);
    
    // Generate recommendations
    const recommendations = [];
    if (progressRate < 0.5) recommendations.push('Focus on completing remaining subgoals to stay on track');
    if (daysTilTarget < 60 && progressRate < 0.7) recommendations.push('Consider adjusting timeline or reducing scope');
    if (goal.category === 'expedition') recommendations.push('Ensure all safety and technical training is prioritized');
    recommendations.push('Regular progress reviews and plan adjustments are recommended');
    
    const riskLevel = successProbability > 0.7 ? 'low' : successProbability > 0.4 ? 'medium' : 'high';
    
    return {
      goalId: goal.id,
      successProbability,
      confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
      factors: {
        positive: positiveFactors,
        negative: negativeFactors,
        neutral: neutralFactors
      },
      recommendations,
      timelineAdjustment: daysTilTarget < 30 && progressRate < 0.7 ? {
        suggested: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        reasoning: 'Current progress rate suggests additional time needed for safe completion'
      } : undefined,
      riskLevel
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'expedition': return MountainIcon;
      case 'fitness': return BoltIcon;
      case 'technical': return TargetIcon;
      case 'endurance': return ClockIcon;
      case 'strength': return FireIcon;
      default: return TrophyIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-successGreen bg-successGreen/10 border-successGreen/20';
      case 'in_progress': return 'text-glacierBlue bg-glacierBlue/10 border-glacierBlue/20';
      case 'overdue': return 'text-dangerRed bg-dangerRed/10 border-dangerRed/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-successGreen';
      case 'medium': return 'text-warningOrange';
      case 'high': return 'text-dangerRed';
      default: return 'text-gray-400';
    }
  };

  const handleCreateGoal = () => {
    setShowCreateModal(true);
  };

  const filteredGoals = goals.filter(goal => 
    selectedCategory === 'all' || goal.category === selectedCategory
  );

  const categories = ['all', 'expedition', 'fitness', 'technical', 'endurance', 'strength'];

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-summitGold to-warningOrange rounded-xl">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Smart Goal Setting</h2>
            <p className="text-gray-400">AI-powered goal tracking with success predictions</p>
          </div>
        </div>
        
        <MountainButton
          variant="primary"
          onClick={handleCreateGoal}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Goal</span>
        </MountainButton>
      </div>

      {/* Category Filter */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const CategoryIcon = category !== 'all' ? getCategoryIcon(category) : ChartBarIcon;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={clsx(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  selectedCategory === category
                    ? "bg-alpineBlue text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category === 'all' ? 'All Goals' : category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredGoals.map((goal, index) => {
            const prediction = predictions.find(p => p.goalId === goal.id);
            const CategoryIcon = getCategoryIcon(goal.category);
            const statusColor = getStatusColor(goal.status);
            const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:bg-white/5 transition-colors duration-300">
                  <div className="space-y-6">
                    {/* Goal Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={clsx(
                          "p-3 rounded-xl border flex-shrink-0",
                          statusColor
                        )}>
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">
                              {goal.title}
                            </h3>
                            <StatusIndicator
                              status={goal.status === 'completed' ? 'success' :
                                     goal.status === 'in_progress' ? 'info' :
                                     goal.status === 'overdue' ? 'danger' : 'warning'}
                              text={goal.status.replace('_', ' ')}
                              size="sm"
                            />
                          </div>
                          <p className="text-gray-300 text-sm mb-4">
                            {goal.description}
                          </p>
                          
                          {/* Goal Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white">
                                {goal.metrics.current} / {goal.metrics.target} {goal.metrics.unit}
                              </span>
                            </div>
                            <ProgressBar
                              value={(goal.metrics.current / goal.metrics.target) * 100}
                              variant="gradient"
                              showValue={false}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="text-right text-sm">
                          <div className="text-white font-medium">
                            {daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}
                          </div>
                          <div className="text-gray-400">
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingGoal(goal)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Success Prediction */}
                    {prediction && !isAnalyzing && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <SparklesIcon className="w-5 h-5 text-aurora-purple" />
                            <span className="font-medium text-white">AI Success Prediction</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={clsx("text-lg font-bold", getRiskColor(prediction.riskLevel))}>
                                {Math.round(prediction.successProbability * 100)}%
                              </div>
                              <div className="text-xs text-gray-400">Success Rate</div>
                            </div>
                            <StatusIndicator
                              status={prediction.riskLevel === 'low' ? 'success' :
                                     prediction.riskLevel === 'medium' ? 'warning' : 'danger'}
                              text={`${prediction.riskLevel} risk`}
                              size="sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Positive Factors */}
                          {prediction.factors.positive.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-successGreen mb-2 flex items-center space-x-1">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>Strengths</span>
                              </h5>
                              <ul className="space-y-1">
                                {prediction.factors.positive.map((factor, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start space-x-1">
                                    <div className="w-1 h-1 bg-successGreen rounded-full flex-shrink-0 mt-1.5" />
                                    <span>{factor}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Negative Factors */}
                          {prediction.factors.negative.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-dangerRed mb-2 flex items-center space-x-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                <span>Challenges</span>
                              </h5>
                              <ul className="space-y-1">
                                {prediction.factors.negative.map((factor, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start space-x-1">
                                    <div className="w-1 h-1 bg-dangerRed rounded-full flex-shrink-0 mt-1.5" />
                                    <span>{factor}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-summitGold/10 rounded-lg p-3 border-l-4 border-summitGold">
                          <h5 className="text-sm font-medium text-summitGold mb-2">
                            AI Recommendations:
                          </h5>
                          <ul className="space-y-1">
                            {prediction.recommendations.map((rec, i) => (
                              <li key={i} className="text-xs text-gray-300 flex items-start space-x-2">
                                <ArrowRightIcon className="w-3 h-3 text-summitGold flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Timeline Adjustment */}
                        {prediction.timelineAdjustment && (
                          <div className="mt-3 p-3 bg-warningOrange/10 rounded-lg border-l-4 border-warningOrange">
                            <h5 className="text-sm font-medium text-warningOrange mb-1">
                              Timeline Adjustment Suggested:
                            </h5>
                            <p className="text-xs text-gray-300 mb-2">
                              {prediction.timelineAdjustment.reasoning}
                            </p>
                            <p className="text-xs text-white">
                              Suggested date: {new Date(prediction.timelineAdjustment.suggested).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                          <span className="text-xs text-gray-400">
                            Confidence: {Math.round(prediction.confidence * 100)}%
                          </span>
                          <ProgressBar
                            value={prediction.confidence * 100}
                            variant="gradient"
                            size="sm"
                            animated={false}
                            showValue={false}
                            className="w-20"
                          />
                        </div>
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="animate-pulse space-y-3">
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <SparklesIcon className="w-5 h-5 text-aurora-purple" />
                            </motion.div>
                            <span className="font-medium text-white">Analyzing success probability...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-700 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subgoals */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Milestones</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {goal.subgoals.map((subgoal) => (
                          <div
                            key={subgoal.id}
                            className={clsx(
                              "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                              subgoal.completed
                                ? "bg-successGreen/10 border-successGreen/20"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                          >
                            <div className={clsx(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              subgoal.completed
                                ? "bg-successGreen border-successGreen"
                                : "border-gray-400"
                            )}>
                              {subgoal.completed && (
                                <CheckCircleIcon className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={clsx(
                                "text-sm font-medium",
                                subgoal.completed ? "text-white line-through" : "text-gray-300"
                              )}>
                                {subgoal.title}
                              </div>
                              <div className="text-xs text-gray-400">
                                Due: {new Date(subgoal.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredGoals.length === 0 && (
        <GlassCard className="p-8 text-center">
          <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Goals Found
          </h3>
          <p className="text-gray-400 mb-4">
            {selectedCategory === 'all' 
              ? "Create your first goal to start tracking your mountaineering progress."
              : `No goals in the ${selectedCategory} category.`
            }
          </p>
          <MountainButton variant="primary" onClick={handleCreateGoal}>
            Create Your First Goal
          </MountainButton>
        </GlassCard>
      )}
    </div>
  );
}