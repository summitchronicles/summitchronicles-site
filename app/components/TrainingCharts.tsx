'use client'

import { useState } from 'react'
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react'

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

  return (
    <div className="mountain-card p-6 elevation-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="flex items-center space-x-1 text-sm text-slate-600">
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
              strokeWidth="0.5"
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
        <div className="absolute inset-0 flex items-end justify-between text-xs text-slate-500 pointer-events-none">
          <span>{minValue}{unit}</span>
          <span>{maxValue}{unit}</span>
        </div>
      </div>
      
      {/* Current value */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-slate-900">
          {data[data.length - 1]?.value}{unit}
        </div>
        <div className="text-sm text-slate-600">Current</div>
      </div>
    </div>
  )
}

function ProgressRing({ 
  value, 
  max, 
  title, 
  color, 
  size = 120 
}: { 
  value: number
  max: number  
  title: string
  color: string
  size?: number
}) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="mountain-card p-6 elevation-shadow text-center">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size/2}
            cy={size/2}
            r="45"
            fill="none"
            stroke="rgb(226 232 240)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx={size/2}
            cy={size/2}
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-slate-600">
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
    <div className="space-y-8">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Training Analytics</h2>
        <div className="flex items-center space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
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
        />
        <ProgressRing 
          value={12} 
          max={16} 
          title="Training Days" 
          color="#10b981"
        />
        <ProgressRing 
          value={8400} 
          max={10000} 
          title="Elevation (m)" 
          color="#f59e0b"
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
        <div className="mountain-card p-6 elevation-shadow">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">Total Activities</span>
              </div>
              <span className="font-semibold text-slate-900">7</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Goals Achieved</span>
              </div>
              <span className="font-semibold text-slate-900">5/6</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-slate-700">Rest Days</span>
              </div>
              <span className="font-semibold text-slate-900">2</span>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Peak Performance</div>
              <div className="text-lg font-bold text-slate-900">Saturday</div>
              <div className="text-sm text-slate-600">2,800m elevation • 18.9km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}