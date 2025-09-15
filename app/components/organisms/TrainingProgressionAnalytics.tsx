'use client'

import React, { useState } from 'react'
import { TrendingUp, Calendar, Target, Activity, BarChart3, Heart, Mountain, Clock, Zap, Award, BookOpen, Users, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressionDataPoint {
  date: string
  value: number
  label?: string
  phase?: string
}

interface TrainingPhase {
  id: string
  name: string
  startDate: string
  endDate: string
  focus: string
  color: string
  achievements: string[]
  metrics: {
    avgElevation: number
    avgDuration: number
    totalActivities: number
    improvement: number
  }
}

interface TrainingProgressionAnalyticsProps {
  className?: string
}

const TRAINING_PHASES: TrainingPhase[] = [
  {
    id: 'base',
    name: 'Base Building',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    focus: 'Aerobic capacity and endurance foundation',
    color: 'from-blue-500 to-blue-600',
    achievements: [
      'Established consistent training routine',
      'Built aerobic base fitness',
      'Developed movement efficiency'
    ],
    metrics: {
      avgElevation: 850,
      avgDuration: 75,
      totalActivities: 32,
      improvement: 15
    }
  },
  {
    id: 'strength',
    name: 'Strength Development',
    startDate: '2024-03-16',
    endDate: '2024-05-15',
    focus: 'Functional strength and power development',
    color: 'from-emerald-500 to-emerald-600',
    achievements: [
      'Increased load-carrying capacity',
      'Improved muscular endurance',
      'Enhanced core stability'
    ],
    metrics: {
      avgElevation: 1200,
      avgDuration: 90,
      totalActivities: 28,
      improvement: 22
    }
  },
  {
    id: 'peak',
    name: 'Peak Training',
    startDate: '2024-05-16',
    endDate: '2024-07-15',
    focus: 'High-intensity preparation and altitude adaptation',
    color: 'from-orange-500 to-orange-600',
    achievements: [
      'Completed high-altitude training camps',
      'Achieved peak cardiovascular fitness',
      'Mastered technical skills'
    ],
    metrics: {
      avgElevation: 1850,
      avgDuration: 120,
      totalActivities: 24,
      improvement: 35
    }
  },
  {
    id: 'expedition',
    name: 'Expedition Prep',
    startDate: '2024-07-16',
    endDate: '2024-09-15',
    focus: 'Final preparation and taper for Mount Everest',
    color: 'from-red-500 to-red-600',
    achievements: [
      'Equipment systems optimized',
      'Mental preparation completed',
      'Team coordination finalized'
    ],
    metrics: {
      avgElevation: 1650,
      avgDuration: 105,
      totalActivities: 20,
      improvement: 18
    }
  }
]

const PROGRESSION_DATA = {
  elevation: [
    { date: 'Jan', value: 650, phase: 'base' },
    { date: 'Feb', value: 820, phase: 'base' },
    { date: 'Mar', value: 980, phase: 'base' },
    { date: 'Apr', value: 1200, phase: 'strength' },
    { date: 'May', value: 1450, phase: 'strength' },
    { date: 'Jun', value: 1680, phase: 'peak' },
    { date: 'Jul', value: 1950, phase: 'peak' },
    { date: 'Aug', value: 1800, phase: 'expedition' },
    { date: 'Sep', value: 1650, phase: 'expedition' }
  ],
  heartRate: [
    { date: 'Jan', value: 155, phase: 'base' },
    { date: 'Feb', value: 148, phase: 'base' },
    { date: 'Mar', value: 145, phase: 'base' },
    { date: 'Apr', value: 152, phase: 'strength' },
    { date: 'May', value: 149, phase: 'strength' },
    { date: 'Jun', value: 158, phase: 'peak' },
    { date: 'Jul', value: 162, phase: 'peak' },
    { date: 'Aug', value: 150, phase: 'expedition' },
    { date: 'Sep', value: 147, phase: 'expedition' }
  ],
  duration: [
    { date: 'Jan', value: 60, phase: 'base' },
    { date: 'Feb', value: 75, phase: 'base' },
    { date: 'Mar', value: 85, phase: 'base' },
    { date: 'Apr', value: 95, phase: 'strength' },
    { date: 'May', value: 105, phase: 'strength' },
    { date: 'Jun', value: 125, phase: 'peak' },
    { date: 'Jul', value: 140, phase: 'peak' },
    { date: 'Aug', value: 110, phase: 'expedition' },
    { date: 'Sep', value: 95, phase: 'expedition' }
  ]
}

const TRAINING_INSIGHTS = [
  {
    id: '1',
    title: 'Progressive Overload Success',
    description: 'Elevation gain has increased systematically by 23% per month during strength phase, demonstrating effective progressive overload principles.',
    type: 'success',
    icon: TrendingUp,
    metric: '+23%',
    period: 'Monthly progression'
  },
  {
    id: '2',
    title: 'Heart Rate Efficiency',
    description: 'Resting heart rate decreased by 8 bpm while maintaining higher training intensities, indicating improved cardiovascular adaptation.',
    type: 'improvement',
    icon: Heart,
    metric: '-8 bpm',
    period: 'Over 6 months'
  },
  {
    id: '3',
    title: 'Recovery Optimization',
    description: 'Training stress balance shows excellent recovery patterns with optimal adaptation windows between high-intensity sessions.',
    type: 'optimal',
    icon: Clock,
    metric: '94%',
    period: 'Recovery score'
  },
  {
    id: '4',
    title: 'Equipment Familiarization',
    description: 'Completed 15+ training sessions with full expedition gear, ensuring comfort and efficiency with all equipment systems.',
    type: 'milestone',
    icon: Award,
    metric: '15+',
    period: 'Gear sessions'
  }
]

export const TrainingProgressionAnalytics: React.FC<TrainingProgressionAnalyticsProps> = ({ className }) => {
  const [selectedMetric, setSelectedMetric] = useState<'elevation' | 'heartRate' | 'duration'>('elevation')
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const currentData = PROGRESSION_DATA[selectedMetric]
  
  const getMetricInfo = (metric: string) => {
    switch (metric) {
      case 'elevation':
        return { icon: Mountain, label: 'Elevation Gain', unit: 'm', color: 'text-emerald-600' }
      case 'heartRate':
        return { icon: Heart, label: 'Avg Heart Rate', unit: ' bpm', color: 'text-red-600' }
      case 'duration':
        return { icon: Clock, label: 'Training Duration', unit: ' min', color: 'text-alpine-blue' }
      default:
        return { icon: Activity, label: 'Metric', unit: '', color: 'text-spa-charcoal' }
    }
  }

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'improvement': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'optimal': return 'bg-summit-gold/20 text-summit-gold border-summit-gold/30'
      case 'milestone': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-spa-mist/20 text-spa-charcoal border-spa-stone/20'
    }
  }

  const getTrendIndicator = (data: ProgressionDataPoint[]) => {
    if (data.length < 2) return { icon: Minus, color: 'text-spa-charcoal/50', label: 'No trend' }
    
    const firstValue = data[0].value
    const lastValue = data[data.length - 1].value
    const change = ((lastValue - firstValue) / firstValue) * 100
    
    if (change > 5) return { icon: ArrowUp, color: 'text-emerald-600', label: `+${change.toFixed(1)}%` }
    if (change < -5) return { icon: ArrowDown, color: 'text-red-600', label: `${change.toFixed(1)}%` }
    return { icon: Minus, color: 'text-spa-charcoal/50', label: 'Stable' }
  }

  const metricInfo = getMetricInfo(selectedMetric)
  const trendInfo = getTrendIndicator(currentData)
  const TrendIcon = trendInfo.icon

  return (
    <section className={cn(
      'py-16 bg-gradient-to-br from-white via-spa-mist/10 to-spa-cloud/20',
      className
    )}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-alpine-blue" />
            <h2 className="text-4xl font-light text-spa-charcoal">Training Progression Analytics</h2>
          </div>
          <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
            Advanced analysis of systematic training progression, periodization approach, 
            and performance optimization for Mount Everest preparation.
          </p>
        </div>

        {/* Metric Selection */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(['elevation', 'heartRate', 'duration'] as const).map((metric) => {
            const info = getMetricInfo(metric)
            const Icon = info.icon
            
            return (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg border transition-all',
                  selectedMetric === metric
                    ? 'bg-alpine-blue text-white border-alpine-blue shadow-md'
                    : 'bg-white/90 text-spa-charcoal border-spa-stone/20 hover:bg-spa-mist/10'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{info.label}</span>
              </button>
            )
          })}
        </div>

        {/* Progression Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-alpine-blue/10 rounded-lg">
                <metricInfo.icon className={cn('w-6 h-6', metricInfo.color)} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-spa-charcoal">{metricInfo.label} Progression</h3>
                <p className="text-spa-charcoal/70 text-sm">9-month systematic training development</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-spa-mist/20 rounded-full">
              <TrendIcon className={cn('w-4 h-4', trendInfo.color)} />
              <span className={cn('text-sm font-medium', trendInfo.color)}>{trendInfo.label}</span>
            </div>
          </div>

          {/* Simple Chart Visualization */}
          <div className="relative h-64 mb-6">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {/* Grid lines */}
              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="rgb(226 232 240)"
                  strokeWidth="0.5"
                />
              ))}
              
              {/* Data line */}
              <polyline
                points={currentData.map((point, index) => {
                  const x = (index / (currentData.length - 1)) * 800
                  const maxValue = Math.max(...currentData.map(d => d.value))
                  const minValue = Math.min(...currentData.map(d => d.value))
                  const range = maxValue - minValue || 1
                  const y = 200 - ((point.value - minValue) / range) * 160
                  return `${x},${y}`
                }).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {currentData.map((point, index) => {
                const x = (index / (currentData.length - 1)) * 800
                const maxValue = Math.max(...currentData.map(d => d.value))
                const minValue = Math.min(...currentData.map(d => d.value))
                const range = maxValue - minValue || 1
                const y = 200 - ((point.value - minValue) / range) * 160
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#3b82f6"
                    className="hover:r-8 transition-all duration-200 cursor-pointer"
                  />
                )
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-spa-charcoal/60">
              {currentData.map((point, index) => (
                <span key={index}>{point.date}</span>
              ))}
            </div>
          </div>

          {/* Current Value */}
          <div className="text-center p-4 bg-gradient-to-br from-alpine-blue/5 to-summit-gold/5 rounded-lg border border-spa-stone/10">
            <div className="text-3xl font-light text-spa-charcoal mb-1">
              {currentData[currentData.length - 1]?.value}{metricInfo.unit}
            </div>
            <div className="text-sm text-spa-charcoal/70">Current {metricInfo.label}</div>
          </div>
        </div>

        {/* Training Phases */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {TRAINING_PHASES.map((phase) => (
            <div 
              key={phase.id}
              className={cn(
                'bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm cursor-pointer transition-all',
                selectedPhase === phase.id && 'ring-2 ring-alpine-blue shadow-md'
              )}
              onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
            >
              <div className={cn(
                'w-full h-2 rounded-full mb-4 bg-gradient-to-r',
                phase.color
              )} />
              
              <h3 className="text-lg font-medium text-spa-charcoal mb-2">{phase.name}</h3>
              <p className="text-sm text-spa-charcoal/70 mb-4">{phase.focus}</p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-spa-mist/10 rounded">
                  <div className="font-medium text-spa-charcoal">{phase.metrics.avgElevation}m</div>
                  <div className="text-spa-charcoal/60">Avg Elevation</div>
                </div>
                <div className="text-center p-2 bg-spa-mist/10 rounded">
                  <div className="font-medium text-spa-charcoal">+{phase.metrics.improvement}%</div>
                  <div className="text-spa-charcoal/60">Improvement</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Training Insights */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-summit-gold/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-summit-gold" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-spa-charcoal">Expert Training Insights</h3>
              <p className="text-spa-charcoal/70 text-sm">AI-powered analysis of training progression and methodology</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {TRAINING_INSIGHTS.map((insight) => {
              const Icon = insight.icon
              
              return (
                <div key={insight.id} className="p-6 bg-gradient-to-br from-spa-mist/20 to-spa-cloud/20 rounded-xl border border-spa-stone/10">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'p-2 rounded-lg border',
                      getInsightTypeColor(insight.type)
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-spa-charcoal">{insight.title}</h4>
                        <div className="text-right">
                          <div className="text-lg font-light text-spa-charcoal">{insight.metric}</div>
                          <div className="text-xs text-spa-charcoal/60">{insight.period}</div>
                        </div>
                      </div>
                      <p className="text-sm text-spa-charcoal/80 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Methodology Summary */}
        <div className="mt-8 p-6 bg-gradient-to-br from-alpine-blue/5 to-summit-gold/5 rounded-xl border border-spa-stone/10">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-alpine-blue/10 rounded-lg">
              <Users className="w-6 h-6 text-alpine-blue" />
            </div>
            <div>
              <h4 className="font-medium text-spa-charcoal mb-2">Systematic Training Methodology</h4>
              <p className="text-sm text-spa-charcoal/80 leading-relaxed">
                This progression analysis demonstrates the effectiveness of periodized training for mountaineering preparation. 
                The systematic approach includes base building, strength development, peak training, and expedition-specific preparation, 
                each phase optimized for specific adaptations required for Mount Everest success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}