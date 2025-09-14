'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Target,
  AlertTriangle,
  Activity,
  Mountain,
  Clock,
  Zap,
  Heart,
  Brain,
  BarChart3,
  LineChart,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { PeriodizationPlan, PerformanceBenchmark } from '@/lib/multi-user/types';

interface PeriodizationDashboardProps {
  userId: string;
  onCreatePlan?: () => void;
}

interface LoadMetrics {
  currentLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
  injuryRisk: 'low' | 'moderate' | 'high';
  fatigue: number;
  fitness: number;
  form: number;
  rampRate: number;
}

interface PeakPrediction {
  targetDate: string;
  peakPerformanceScore: number;
  confidence: number;
  keyMetrics: {
    cardiovascular: number;
    strength: number;
    endurance: number;
    technical: number;
  };
  recommendations: string[];
}

interface TrainingRecommendation {
  type: 'load_increase' | 'recovery' | 'intensity_focus' | 'volume_focus' | 'deload';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
}

export default function PeriodizationDashboard({
  userId,
  onCreatePlan
}: PeriodizationDashboardProps) {
  const [currentPlan, setCurrentPlan] = useState<PeriodizationPlan | null>(null);
  const [loadMetrics, setLoadMetrics] = useState<LoadMetrics | null>(null);
  const [peakPrediction, setPeakPrediction] = useState<PeakPrediction | null>(null);
  const [recommendations, setRecommendations] = useState<TrainingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load current plan and metrics
      const currentResponse = await fetch('/api/training/periodization?action=current');
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        setCurrentPlan(currentData.plan);
        setLoadMetrics(currentData.loadMetrics);
      }

      // Load analytics if there's an active plan
      if (currentPlan?.id) {
        const analyticsResponse = await fetch(`/api/training/periodization?action=analytics&planId=${currentPlan.id}`);
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setPeakPrediction(analyticsData.peakPrediction);
        }
      }

      // Load recommendations
      const recResponse = await fetch('/api/training/periodization?action=recommendations');
      if (recResponse.ok) {
        const recData = await recResponse.json();
        setRecommendations(recData.recommendations || []);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizePlan = async () => {
    if (!currentPlan) return;
    
    setOptimizing(true);
    try {
      const response = await fetch('/api/training/periodization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize_current'
        })
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Failed to optimize plan:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const adjustLoad = async (adjustmentType: string, value: number, reason: string) => {
    try {
      const response = await fetch('/api/training/periodization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'adjust_load',
          adjustment_type: adjustmentType,
          adjustment_value: value,
          reason
        })
      });

      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Failed to adjust load:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFormStatus = (form: number) => {
    if (form >= 80) return { status: 'excellent', color: 'text-green-600', icon: ArrowUp };
    if (form >= 60) return { status: 'good', color: 'text-blue-600', icon: ArrowUp };
    if (form >= 40) return { status: 'moderate', color: 'text-yellow-600', icon: Minus };
    return { status: 'needs attention', color: 'text-red-600', icon: ArrowDown };
  };

  const getCurrentPhase = () => {
    if (!currentPlan) return null;
    
    const today = new Date();
    const startDate = new Date(currentPlan.created_at);
    const weeksElapsed = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    let cumulativeWeeks = 0;
    for (const phase of currentPlan.phases) {
      if (weeksElapsed >= cumulativeWeeks && weeksElapsed < cumulativeWeeks + (phase.week_end - phase.week_start + 1)) {
        return {
          ...phase,
          weekInPhase: weeksElapsed - cumulativeWeeks + 1,
          totalWeeks: phase.week_end - phase.week_start + 1
        };
      }
      cumulativeWeeks += phase.week_end - phase.week_start + 1;
    }
    
    return null;
  };

  const currentPhase = getCurrentPhase();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Periodization Plan</h3>
        <p className="text-gray-600 mb-6">
          Create a periodization plan to optimize your training for peak performance on your target summit.
        </p>
        <button
          onClick={onCreatePlan}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <Target className="w-5 h-5 mr-2" />
          Create Periodization Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Periodization Dashboard</h2>
          <p className="text-gray-600">AI-optimized training plan for {currentPlan.target_summit || 'your summit goal'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={optimizePlan}
            disabled={optimizing}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${optimizing ? 'animate-spin' : ''}`} />
            Re-optimize Plan
          </button>
          <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Current Phase */}
      {currentPhase && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Current Phase: {currentPhase.name}</h3>
              <p className="text-blue-100">{currentPhase.primary_focus}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">Week {currentPhase.weekInPhase}</div>
              <div className="text-blue-100">of {currentPhase.totalWeeks}</div>
            </div>
          </div>
          <div className="w-full bg-blue-500 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentPhase.weekInPhase / currentPhase.totalWeeks) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {currentPhase.key_workouts?.map((workout, index) => (
              <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                {workout}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Load Management Metrics */}
      {loadMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Training Load</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(loadMetrics.injuryRisk)}`}>
                {loadMetrics.injuryRisk} risk
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {Math.round(loadMetrics.currentLoad)}
            </div>
            <div className="text-sm text-gray-600">
              A:C Ratio: {loadMetrics.acuteChronicRatio.toFixed(2)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <Heart className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium text-gray-900">Fitness</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {Math.round(loadMetrics.fitness)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${loadMetrics.fitness}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-medium text-gray-900">Fatigue</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {Math.round(loadMetrics.fatigue)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${loadMetrics.fatigue}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <Brain className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-gray-900">Form</span>
              {(() => {
                const formStatus = getFormStatus(loadMetrics.form);
                const IconComponent = formStatus.icon;
                return <IconComponent className={`w-4 h-4 ml-2 ${formStatus.color}`} />;
              })()}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {Math.round(loadMetrics.form)}%
            </div>
            <div className="text-sm text-gray-600">
              {getFormStatus(loadMetrics.form).status}
            </div>
          </motion.div>
        </div>
      )}

      {/* Peak Performance Prediction */}
      {peakPrediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Peak Performance Prediction</h3>
                <p className="text-gray-600">
                  Target: {new Date(peakPrediction.targetDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(peakPrediction.peakPerformanceScore)}%
              </div>
              <div className="text-sm text-gray-600">
                {Math.round(peakPrediction.confidence)}% confidence
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {Math.round(peakPrediction.keyMetrics.cardiovascular)}%
              </div>
              <div className="text-sm text-gray-600">Cardiovascular</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {Math.round(peakPrediction.keyMetrics.strength)}%
              </div>
              <div className="text-sm text-gray-600">Strength</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {Math.round(peakPrediction.keyMetrics.endurance)}%
              </div>
              <div className="text-sm text-gray-600">Endurance</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {Math.round(peakPrediction.keyMetrics.technical)}%
              </div>
              <div className="text-sm text-gray-600">Technical</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Key Recommendations:</h4>
            {peakPrediction.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                {rec}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Training Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">AI Training Recommendations</h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : rec.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {rec.priority === 'high' && <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />}
                      {rec.priority === 'medium' && <Clock className="w-4 h-4 text-yellow-600 mr-2" />}
                      {rec.priority === 'low' && <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />}
                      <span className="font-medium text-gray-900">{rec.title}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                    <p className="text-xs text-gray-600">{rec.action}</p>
                  </div>
                  {rec.type === 'load_increase' && (
                    <button
                      onClick={() => adjustLoad('increase', 10, rec.title)}
                      className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Apply +10%
                    </button>
                  )}
                  {rec.type === 'recovery' && (
                    <button
                      onClick={() => adjustLoad('decrease', 20, rec.title)}
                      className="ml-4 px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                    >
                      Reduce Load
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => adjustLoad('deload', 30, 'Manual deload week')}
            className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowDown className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Deload Week</div>
            <div className="text-xs text-gray-600">Reduce load by 30%</div>
          </button>
          
          <button className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">View Analytics</div>
            <div className="text-xs text-gray-600">Detailed performance</div>
          </button>
          
          <button className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Plan Calendar</div>
            <div className="text-xs text-gray-600">View full timeline</div>
          </button>
          
          <button className="p-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <LineChart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Export Data</div>
            <div className="text-xs text-gray-600">Download reports</div>
          </button>
        </div>
      </div>
    </div>
  );
}