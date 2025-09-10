"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  TrendingUpIcon,
  ClockIcon,
  RefreshIcon,
  ChartBarIcon,
  FireIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface TrainingInsight {
  type: 'pattern' | 'recommendation' | 'warning' | 'achievement';
  confidence: number;
  title: string;
  description: string;
  data: any[];
  actionItems?: string[];
}

interface AITrainingInsightsProps {
  timeRange: 'week' | 'month' | 'quarter';
}

export default function AITrainingInsights({ timeRange }: AITrainingInsightsProps) {
  const [insights, setInsights] = useState<TrainingInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<TrainingInsight | null>(null);
  const [dataPoints, setDataPoints] = useState(0);

  useEffect(() => {
    fetchInsights();
  }, [timeRange]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = getStartDate(timeRange);
      
      const response = await fetch(`/api/training/insights?action=insights&start=${startDate}&end=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
        setDataPoints(data.dataPoints || 0);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/training/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_knowledge_base',
          dateRange: timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90
        })
      });
      
      if (response.ok) {
        await fetchInsights(); // Refresh insights after updating knowledge base
      }
    } catch (error) {
      console.error('Error updating knowledge base:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getStartDate = (range: string): string => {
    const date = new Date();
    switch (range) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return TrophyIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'recommendation': return LightBulbIcon;
      case 'pattern': return TrendingUpIcon;
      default: return SparklesIcon;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'from-yellow-500 to-orange-500';
      case 'warning': return 'from-red-500 to-pink-500';
      case 'recommendation': return 'from-blue-500 to-cyan-500';
      case 'pattern': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'border-yellow-500/30';
      case 'warning': return 'border-red-500/30';
      case 'recommendation': return 'border-blue-500/30';
      case 'pattern': return 'border-purple-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-400';
      case 'warning': return 'text-red-400';
      case 'recommendation': return 'text-blue-400';
      case 'pattern': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <span className="ml-3 text-white/60">Analyzing training patterns...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Training Insights</h2>
              <p className="text-white/60 text-sm">
                Personalized analysis based on {dataPoints} training sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-sm text-white/60">
              <div>Seven Summits</div>
              <div>Optimized Analysis</div>
            </div>
            <button
              onClick={updateKnowledgeBase}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshIcon className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Learning...' : 'Update AI'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-purple-400">{insights.length}</div>
            <div className="text-white/60 text-xs">Insights Found</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {insights.filter(i => i.type === 'achievement').length}
            </div>
            <div className="text-white/60 text-xs">Achievements</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-blue-400">
              {insights.filter(i => i.type === 'recommendation').length}
            </div>
            <div className="text-white/60 text-xs">Recommendations</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-red-400">
              {insights.filter(i => i.type === 'warning').length}
            </div>
            <div className="text-white/60 text-xs">Warnings</div>
          </div>
        </div>
      </motion.div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 backdrop-blur-sm border rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer ${getBorderColor(insight.type)}`}
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{insight.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <FireIcon className="w-3 h-3" />
                      {Math.round(insight.confidence * 100)}% confidence
                    </div>
                  </div>
                  
                  <p className="text-white/70 leading-relaxed mb-4">{insight.description}</p>
                  
                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <div className="space-y-2">
                      <div className={`text-sm font-medium ${getTextColor(insight.type)}`}>
                        Action Items:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {insight.actionItems.slice(0, 4).map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start gap-2 text-sm text-white/60">
                            <div className={`w-1 h-1 rounded-full ${getInsightColor(insight.type)} bg-gradient-to-r mt-2 flex-shrink-0`}></div>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-white/40">
                  <EyeIcon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No insights message */}
      {insights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
            <ChartBarIcon className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Building Your Training Profile</h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Keep logging your workouts and activities. The AI needs more data to generate personalized insights 
            for your Seven Summits preparation.
          </p>
          <div className="text-sm text-purple-400">
            💡 Log at least 10 training sessions to unlock AI insights
          </div>
        </motion.div>
      )}

      {/* Detailed Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getInsightIcon(selectedInsight.type);
                    return (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getInsightColor(selectedInsight.type)}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedInsight.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <FireIcon className="w-4 h-4" />
                      {Math.round(selectedInsight.confidence * 100)}% AI Confidence
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Analysis</h3>
                  <p className="text-white/70 leading-relaxed">{selectedInsight.description}</p>
                </div>

                {selectedInsight.actionItems && selectedInsight.actionItems.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recommended Actions</h3>
                    <div className="space-y-3">
                      {selectedInsight.actionItems.map((action, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-summitGold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircleIcon className="w-4 h-4 text-summitGold" />
                          </div>
                          <span className="text-white/80">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedInsight.data && selectedInsight.data.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Supporting Data</h3>
                    <div className="bg-white/5 rounded-xl p-4">
                      <pre className="text-white/60 text-sm overflow-x-auto">
                        {JSON.stringify(selectedInsight.data.slice(0, 5), null, 2)}
                      </pre>
                      {selectedInsight.data.length > 5 && (
                        <div className="text-white/40 text-xs mt-2">
                          ... and {selectedInsight.data.length - 5} more data points
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}