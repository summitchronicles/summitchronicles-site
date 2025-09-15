'use client'

import { useState } from 'react'
import { TrendingUp, Calendar, Target, Activity, BarChart3, Heart, Mountain, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataPoint {
  date: string
  value: number
  label?: string
}

interface ChartProps {
  data: DataPoint[]
  title: string
  color: string
  unit: string
  height?: number
}

function LineChart({ data, title, color, unit, height = 200 }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((point.value - minValue) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const gradientId = `gradient-${title.replace(/\s/g, '-')}`
  
  const getChartIcon = (title: string) => {
    if (title.toLowerCase().includes('elevation')) return Mountain
    if (title.toLowerCase().includes('heart')) return Heart
    if (title.toLowerCase().includes('distance')) return Activity
    return BarChart3
  }
  
  const ChartIcon = getChartIcon(title)

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-alpine-blue/10 rounded-lg">
            <ChartIcon className="w-5 h-5 text-alpine-blue" />
          </div>
          <h3 className="text-lg font-medium text-spa-charcoal">{title}</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>+12%</span>
        </div>
      </div>
      
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgb(226 232 240)"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          
          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#${gradientId})`}
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((point.value - minValue) / range) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="hover:r-3 transition-all duration-200"
              />
            )
          })}
        </svg>
        
        {/* Value labels */}
        <div className="absolute inset-0 flex items-end justify-between text-xs text-spa-charcoal/60 pointer-events-none">
          <span>{minValue}{unit}</span>
          <span>{maxValue}{unit}</span>
        </div>
      </div>
      
      {/* Current value */}
      <div className="mt-6 p-4 bg-gradient-to-br from-spa-mist/20 to-spa-cloud/20 rounded-lg border border-spa-stone/10">
        <div className="text-center">
          <div className="text-2xl font-light text-spa-charcoal mb-1">
            {data[data.length - 1]?.value}{unit}
          </div>
          <div className="text-sm text-spa-charcoal/70">Current Value</div>
        </div>
      </div>
    </div>
  )
}

function ProgressRing({ 
  value, 
  max, 
  title, 
  color, 
  size = 120,
  icon
}: { 
  value: number
  max: number  
  title: string
  color: string
  size?: number
  icon?: React.ComponentType<{ className?: string }>
}) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const Icon = icon || Target

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="p-1.5 bg-alpine-blue/10 rounded-lg">
          <Icon className="w-4 h-4 text-alpine-blue" />
        </div>
        <h3 className="text-lg font-medium text-spa-charcoal">{title}</h3>
      </div>
      
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size/2}
            cy={size/2}
            r="45"
            fill="none"
            stroke="rgb(226 232 240)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx={size/2}
            cy={size/2}
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-light text-spa-charcoal">
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-spa-charcoal/70">
            {value}/{max}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TrainingAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  
  const elevationData = [
    { date: 'Mon', value: 1200 },
    { date: 'Tue', value: 800 },
    { date: 'Wed', value: 1800 },
    { date: 'Thu', value: 1400 },
    { date: 'Fri', value: 2200 },
    { date: 'Sat', value: 2800 },
    { date: 'Sun', value: 1600 },
  ]

  const heartRateData = [
    { date: 'Mon', value: 145 },
    { date: 'Tue', value: 138 },
    { date: 'Wed', value: 152 },
    { date: 'Thu', value: 148 },
    { date: 'Fri', value: 156 },
    { date: 'Sat', value: 162 },
    { date: 'Sun', value: 149 },
  ]

  const distanceData = [
    { date: 'Mon', value: 8.2 },
    { date: 'Tue', value: 5.4 },
    { date: 'Wed', value: 12.1 },
    { date: 'Thu', value: 9.8 },
    { date: 'Fri', value: 15.6 },
    { date: 'Sat', value: 18.9 },
    { date: 'Sun', value: 11.3 },
  ]

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-alpine-blue" />
          <h2 className="text-4xl font-light text-spa-charcoal">Training Analytics</h2>
        </div>
        <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
          Sophisticated visualization of training data that transforms raw metrics into 
          compelling insights for systematic mountaineering preparation.
        </p>
      </div>
      
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium text-spa-charcoal mb-1">Performance Overview</h3>
          <p className="text-spa-charcoal/70 text-sm">Data-driven insights from Strava integration</p>
        </div>
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-1 border border-spa-stone/20">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                selectedPeriod === period
                  ? 'bg-alpine-blue text-white shadow-sm'
                  : 'text-spa-charcoal/70 hover:text-spa-charcoal hover:bg-spa-mist/20'
              )}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressRing 
          value={67} 
          max={100} 
          title="Weekly Goal" 
          color="#3b82f6"
          icon={Target}
        />
        <ProgressRing 
          value={12} 
          max={16} 
          title="Training Days" 
          color="#10b981"
          icon={Calendar}
        />
        <ProgressRing 
          value={8400} 
          max={10000} 
          title="Elevation (m)" 
          color="#f59e0b"
          icon={Mountain}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={elevationData}
          title="Elevation Gain"
          color="#3b82f6"
          unit="m"
        />
        
        <LineChart
          data={heartRateData}
          title="Average Heart Rate"
          color="#ef4444"
          unit=" bpm"
        />
        
        <LineChart
          data={distanceData}
          title="Distance Covered"
          color="#10b981"
          unit="km"
        />
        
        {/* Weekly Summary Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-summit-gold/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-summit-gold" />
            </div>
            <h3 className="text-lg font-medium text-spa-charcoal">Weekly Summary</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-spa-mist/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-alpine-blue" />
                  <span className="text-spa-charcoal">Total Activities</span>
                </div>
                <span className="font-medium text-spa-charcoal">7</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-spa-mist/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span className="text-spa-charcoal">Goals Achieved</span>
                </div>
                <span className="font-medium text-spa-charcoal">5/6</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-spa-mist/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-summit-gold" />
                  <span className="text-spa-charcoal">Rest Days</span>
                </div>
                <span className="font-medium text-spa-charcoal">2</span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-alpine-blue/5 to-summit-gold/5 rounded-lg border border-spa-stone/10">
              <div className="text-sm text-spa-charcoal/70 mb-2">Peak Performance Day</div>
              <div className="text-lg font-medium text-spa-charcoal mb-1">Saturday</div>
              <div className="text-sm text-spa-charcoal/70">2,800m elevation • 18.9km distance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}