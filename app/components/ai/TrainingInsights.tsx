'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Activity,
  BarChart3,
  Lightbulb,
  Mountain
} from 'lucide-react'

interface TrainingActivity {
  name: string
  type: string
  distance: number
  moving_time: number
  total_elevation_gain: number
  start_date: string
  average_heartrate?: number
}

interface TrainingInsights {
  summary: string
  progressAssessment: string
  areasForImprovement: string[]
  specificRecommendations: string[]
  riskFactors: string[]
  nextWeekPlan: string
  confidence: number
  analysisDate: string
}

interface TrainingInsightsProps {
  activities?: TrainingActivity[]
  goals?: string[]
  className?: string
}

export function TrainingInsights({ 
  activities = [], 
  goals = ['Build endurance for high-altitude climbing', 'Improve technical skills', 'Increase carrying capacity'],
  className = ""
}: TrainingInsightsProps) {
  const [insights, setInsights] = useState<TrainingInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null)

  // Auto-generate insights when activities change
  useEffect(() => {
    if (activities.length > 0 && !lastAnalysis) {
      generateInsights()
    }
  }, [activities])

  const generateInsights = async () => {
    setLoading(true)
    setError(null)

    try {
      // If no activities provided, fetch from Strava sync
      let trainingData = activities
      if (trainingData.length === 0) {
        const response = await fetch('/api/strava/sync?limit=10')
        const data = await response.json()
        if (data.success && data.data.activities) {
          trainingData = data.data.activities
        }
      }

      // Generate AI insights
      const response = await fetch('/api/ai/training-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: trainingData,
          goals: goals,
          timeframe: '2weeks'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate training insights')
      }

      const result = await response.json()
      setInsights(result.insights)
      setLastAnalysis(new Date())

    } catch (error) {
      console.error('Error generating insights:', error)
      setError('Failed to generate training insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getProgressIcon = (assessment: string) => {
    if (assessment.toLowerCase().includes('excellent') || assessment.toLowerCase().includes('strong')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    if (assessment.toLowerCase().includes('good') || assessment.toLowerCase().includes('steady')) {
      return <TrendingUp className="w-5 h-5 text-blue-600" />
    }
    if (assessment.toLowerCase().includes('concern') || assessment.toLowerCase().includes('risk')) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    }
    return <BarChart3 className="w-5 h-5 text-alpine-blue" />
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-spa-stone/10 shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center space-y-4 flex-col">
          <Loader2 className="w-8 h-8 animate-spin text-alpine-blue" />
          <p className="text-spa-charcoal/60">Analyzing your training data...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`bg-white rounded-xl border border-spa-stone/10 shadow-sm overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <h2 className="text-2xl font-light">AI Training Insights</h2>
          </div>
          <div className="flex items-center gap-4">
            {insights && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(insights.confidence)}`}>
                {Math.round(insights.confidence * 100)}% Confidence
              </div>
            )}
            <button
              onClick={generateInsights}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Refresh Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={generateInsights}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : insights ? (
          <div className="space-y-6">
            {/* Overview Summary */}
            <div className="bg-spa-cloud/10 rounded-lg p-4">
              <h3 className="font-medium text-spa-charcoal mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Training Overview
              </h3>
              <p className="text-spa-charcoal/80 leading-relaxed">{insights.summary}</p>
            </div>

            {/* Progress Assessment */}
            <div className="bg-spa-cloud/10 rounded-lg p-4">
              <h3 className="font-medium text-spa-charcoal mb-2 flex items-center gap-2">
                {getProgressIcon(insights.progressAssessment)}
                Progress Assessment
              </h3>
              <p className="text-spa-charcoal/80 leading-relaxed">{insights.progressAssessment}</p>
            </div>

            {/* Grid Layout for Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Areas for Improvement */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {insights.areasForImprovement.map((area, index) => (
                    <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Factors to Monitor
                </h3>
                <ul className="space-y-2">
                  {insights.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specific Recommendations */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Specific Recommendations
              </h3>
              <ul className="space-y-2">
                {insights.specificRecommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Week Plan */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                Next Week Training Plan
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">{insights.nextWeekPlan}</p>
            </div>

            {/* Analysis Metadata */}
            <div className="text-xs text-spa-charcoal/50 text-center">
              Analysis generated on {new Date(insights.analysisDate).toLocaleDateString()} • 
              Based on {activities.length} recent activities
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-spa-charcoal/60 mb-4">Generate AI-powered training insights based on your activity data</p>
            <button
              onClick={generateInsights}
              className="bg-alpine-blue text-white px-6 py-2 rounded-lg hover:bg-alpine-blue/90 transition-colors"
            >
              Generate Insights
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}