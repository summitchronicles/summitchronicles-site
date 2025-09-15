'use client'

import React, { useState } from 'react'
import { Calendar, MapPin, Mountain, CheckCircle, Clock, Camera, Users, Thermometer, Wind, ArrowRight, ChevronDown, Share, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineMilestone {
  id: string
  title: string
  description: string
  date: string
  status: 'completed' | 'in-progress' | 'upcoming'
  phase: 'preparation' | 'travel' | 'climb' | 'summit' | 'return'
  location?: string
  elevation?: string
  temperature?: string
  weather?: string
  images?: TimelineImage[]
  achievements?: string[]
  supporters?: number
  details?: string
  metrics?: {
    label: string
    value: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

interface TimelineImage {
  url: string
  caption: string
  photographer?: string
}

interface ExpeditionTimelineProps {
  className?: string
}

const TIMELINE_DATA: TimelineMilestone[] = [
  {
    id: '1',
    title: 'Training Phase Begins',
    description: 'Commenced comprehensive 12-month training program focusing on cardiovascular endurance, strength building, and technical skill development.',
    date: '2024-01-15',
    status: 'completed',
    phase: 'preparation',
    location: 'Seattle, WA',
    achievements: [
      'Established baseline fitness metrics',
      'Created personalized training plan',
      'Assembled training equipment'
    ],
    supporters: 45,
    details: 'The training phase marks the beginning of systematic preparation for Mount Everest. This involves building a strong aerobic base, developing functional strength, and practicing technical mountaineering skills.',
    metrics: [
      { label: 'Training Hours', value: '180+', icon: Clock },
      { label: 'Elevation Gain', value: '12,400m', icon: Mountain },
      { label: 'Workouts', value: '48', icon: CheckCircle }
    ]
  },
  {
    id: '2',
    title: 'First Altitude Training',
    description: 'Completed Mount Rainier ascent to test high-altitude performance and equipment systems under real expedition conditions.',
    date: '2024-03-22',
    status: 'completed',
    phase: 'preparation',
    location: 'Mount Rainier, WA',
    elevation: '4,392m',
    temperature: '-18°C',
    weather: 'Clear skies, moderate winds',
    achievements: [
      'Successfully summited Mount Rainier',
      'Tested all technical equipment',
      'Experienced altitude effects firsthand'
    ],
    supporters: 78,
    details: 'Mount Rainier provided the perfect testing ground for equipment, techniques, and physical conditioning. The ascent validated training progress and identified areas for improvement.',
    metrics: [
      { label: 'Ascent Time', value: '12 hours', icon: Clock },
      { label: 'Max Elevation', value: '4,392m', icon: Mountain },
      { label: 'Team Size', value: '4 climbers', icon: Users }
    ]
  },
  {
    id: '3',
    title: 'International Training Expedition',
    description: 'Three-week expedition to the Himalayas for high-altitude acclimatization and technical skill refinement on peaks above 6,000m.',
    date: '2024-06-10',
    status: 'completed',
    phase: 'preparation',
    location: 'Everest Region, Nepal',
    elevation: '6,189m',
    temperature: '-25°C',
    weather: 'Variable conditions with strong winds',
    achievements: [
      'Summited Island Peak (6,189m)',
      'Completed acclimatization rotations',
      'Practiced crevasse rescue techniques'
    ],
    supporters: 156,
    details: 'This expedition provided crucial experience in the Everest region, allowing for proper acclimatization and familiarity with the unique challenges of Himalayan climbing.',
    metrics: [
      { label: 'Duration', value: '21 days', icon: Calendar },
      { label: 'Peak Elevation', value: '6,189m', icon: Mountain },
      { label: 'Distance Trekked', value: '120 km', icon: MapPin }
    ]
  },
  {
    id: '4',
    title: 'Final Preparation & Departure',
    description: 'Last-minute gear checks, final medical examinations, and departure for Nepal. All systems validated and team ready for the expedition.',
    date: '2024-09-05',
    status: 'in-progress',
    phase: 'travel',
    location: 'Kathmandu, Nepal',
    achievements: [
      'Completed final medical checkups',
      'Gear and equipment verified',
      'Team briefing completed'
    ],
    supporters: 234,
    details: 'The culmination of months of preparation. Final checks ensure all equipment, documentation, and team coordination is optimized for the expedition.',
    metrics: [
      { label: 'Gear Weight', value: '65 kg', icon: Mountain },
      { label: 'Team Members', value: '6', icon: Users },
      { label: 'Support Days', value: '60', icon: Calendar }
    ]
  },
  {
    id: '5',
    title: 'Base Camp Establishment',
    description: 'Arrival at Everest Base Camp and establishment of expedition headquarters. Begin acclimatization rotations and route preparation.',
    date: '2024-09-20',
    status: 'upcoming',
    phase: 'climb',
    location: 'Everest Base Camp',
    elevation: '5,364m',
    temperature: '-15°C',
    details: 'Base Camp serves as the expedition nerve center. Here we establish our home for two months while preparing for summit attempts through careful acclimatization.',
    metrics: [
      { label: 'Base Camp Alt', value: '5,364m', icon: Mountain },
      { label: 'Expected Stay', value: '45 days', icon: Calendar },
      { label: 'Weather Window', value: 'May 2025', icon: Wind }
    ]
  },
  {
    id: '6',
    title: 'Acclimatization Rotations',
    description: 'Progressive altitude exposure through camps 1, 2, and 3. Building physiological adaptation for summit attempt.',
    date: '2024-10-15',
    status: 'upcoming',
    phase: 'climb',
    location: 'Everest Camps 1-3',
    elevation: '7,200m',
    details: 'Critical phase where we gradually expose our bodies to extreme altitude, allowing physiological adaptations necessary for summit success.',
    metrics: [
      { label: 'Max Altitude', value: '7,200m', icon: Mountain },
      { label: 'Rotations', value: '3 cycles', icon: ArrowRight },
      { label: 'Duration', value: '4 weeks', icon: Calendar }
    ]
  },
  {
    id: '7',
    title: 'Summit Push',
    description: 'Final ascent to the summit of Mount Everest. The culmination of years of preparation and months of expedition effort.',
    date: '2024-11-12',
    status: 'upcoming',
    phase: 'summit',
    location: 'Mount Everest Summit',
    elevation: '8,849m',
    temperature: '-40°C',
    weather: 'Clear summit weather window',
    details: 'The ultimate goal - standing on the highest point on Earth. Years of preparation converge into this single, defining moment.',
    metrics: [
      { label: 'Summit Elevation', value: '8,849m', icon: Mountain },
      { label: 'Summit Time', value: '6 hours', icon: Clock },
      { label: 'Temperature', value: '-40°C', icon: Thermometer }
    ]
  },
  {
    id: '8',
    title: 'Safe Return & Celebration',
    description: 'Successful descent and return to Base Camp. Celebration with team and preparation for journey home.',
    date: '2024-11-20',
    status: 'upcoming',
    phase: 'return',
    location: 'Everest Base Camp',
    elevation: '5,364m',
    details: 'Mission accomplished. Safe return to Base Camp marks the successful completion of the expedition and beginning of the journey home.',
    metrics: [
      { label: 'Descent Time', value: '8 hours', icon: Clock },
      { label: 'Total Duration', value: '75 days', icon: Calendar },
      { label: 'Team Success', value: '100%', icon: CheckCircle }
    ]
  }
]

const PHASE_CONFIG = {
  preparation: { 
    label: 'Preparation', 
    color: 'bg-blue-500', 
    lightColor: 'bg-blue-100', 
    textColor: 'text-blue-700',
    icon: Mountain
  },
  travel: { 
    label: 'Travel', 
    color: 'bg-purple-500', 
    lightColor: 'bg-purple-100', 
    textColor: 'text-purple-700',
    icon: MapPin
  },
  climb: { 
    label: 'Climb', 
    color: 'bg-orange-500', 
    lightColor: 'bg-orange-100', 
    textColor: 'text-orange-700',
    icon: Mountain
  },
  summit: { 
    label: 'Summit', 
    color: 'bg-red-500', 
    lightColor: 'bg-red-100', 
    textColor: 'text-red-700',
    icon: Mountain
  },
  return: { 
    label: 'Return', 
    color: 'bg-green-500', 
    lightColor: 'bg-green-100', 
    textColor: 'text-green-700',
    icon: CheckCircle
  }
}

export const ExpeditionTimeline: React.FC<ExpeditionTimelineProps> = ({ className }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [filterPhase, setFilterPhase] = useState<string>('all')

  const filteredMilestones = filterPhase === 'all' 
    ? TIMELINE_DATA 
    : TIMELINE_DATA.filter(milestone => milestone.phase === filterPhase)

  const completedMilestones = TIMELINE_DATA.filter(m => m.status === 'completed').length
  const totalMilestones = TIMELINE_DATA.length
  const progressPercentage = (completedMilestones / totalMilestones) * 100

  const getStatusIcon = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-alpine-blue animate-pulse" />
      case 'upcoming':
        return <div className="w-5 h-5 rounded-full border-2 border-spa-stone/30" />
    }
  }

  const getStatusColor = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-50'
      case 'in-progress':
        return 'border-alpine-blue bg-alpine-blue/5'
      case 'upcoming':
        return 'border-spa-stone/30 bg-white'
    }
  }

  return (
    <section className={cn(
      'py-16 bg-gradient-to-br from-spa-cloud/20 via-white to-spa-mist/30',
      className
    )}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="w-8 h-8 text-alpine-blue" />
            <h2 className="text-4xl font-light text-spa-charcoal">Expedition Timeline</h2>
          </div>
          <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
            Follow the systematic journey from initial training through summit success. 
            Each milestone represents months of preparation and incremental progress toward the ultimate goal.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-spa-stone/10 shadow-sm">
          <div className="text-center mb-8">
            <div className="text-3xl font-light text-spa-charcoal mb-2">
              {completedMilestones} of {totalMilestones} Milestones Completed
            </div>
            <div className="text-spa-charcoal/70">
              {progressPercentage.toFixed(0)}% of expedition journey complete
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-4 bg-spa-stone/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-alpine-blue rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-alpine-blue rounded-full shadow-lg transition-all duration-1000 ease-out"
              style={{ left: `calc(${progressPercentage}% - 12px)` }}
            />
          </div>
        </div>

        {/* Phase Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setFilterPhase('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              filterPhase === 'all'
                ? 'bg-alpine-blue text-white shadow-md'
                : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
            )}
          >
            All Phases
          </button>
          {Object.entries(PHASE_CONFIG).map(([phase, config]) => (
            <button
              key={phase}
              onClick={() => setFilterPhase(phase)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                filterPhase === phase
                  ? 'bg-alpine-blue text-white shadow-md'
                  : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
              )}
            >
              <config.icon className="w-4 h-4" />
              {config.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-alpine-blue to-spa-stone/30" />
          
          {/* Milestones */}
          <div className="space-y-8">
            {filteredMilestones.map((milestone, index) => {
              const phaseConfig = PHASE_CONFIG[milestone.phase]
              const isExpanded = selectedMilestone === milestone.id
              
              return (
                <div key={milestone.id} className="relative">
                  {/* Timeline dot */}
                  <div className={cn(
                    'absolute left-6 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10',
                    phaseConfig.color
                  )} />
                  
                  {/* Milestone card */}
                  <div className="ml-16">
                    <div className={cn(
                      'bg-white/90 backdrop-blur-sm rounded-xl border-l-4 border shadow-sm transition-all duration-300 overflow-hidden',
                      getStatusColor(milestone.status),
                      isExpanded && 'shadow-lg'
                    )}>
                      {/* Card header */}
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => setSelectedMilestone(isExpanded ? null : milestone.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(milestone.status)}
                              <div className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                phaseConfig.lightColor,
                                phaseConfig.textColor
                              )}>
                                {phaseConfig.label}
                              </div>
                              <div className="text-sm text-spa-charcoal/60">
                                {new Date(milestone.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-medium text-spa-charcoal mb-2">
                              {milestone.title}
                            </h3>
                            
                            <p className="text-spa-charcoal/70 leading-relaxed">
                              {milestone.description}
                            </p>
                            
                            {milestone.location && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-spa-charcoal/60">
                                <MapPin className="w-4 h-4" />
                                {milestone.location}
                                {milestone.elevation && (
                                  <span className="ml-2 px-2 py-1 bg-spa-mist/20 rounded text-xs">
                                    {milestone.elevation}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {milestone.supporters && (
                              <div className="flex items-center gap-1 text-sm text-spa-charcoal/60">
                                <Heart className="w-4 h-4 text-red-500" />
                                {milestone.supporters}
                              </div>
                            )}
                            <ChevronDown className={cn(
                              'w-5 h-5 text-spa-charcoal/60 transition-transform',
                              isExpanded && 'rotate-180'
                            )} />
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="border-t border-spa-stone/10 p-6 space-y-6">
                          {milestone.details && (
                            <p className="text-spa-charcoal/70 leading-relaxed">
                              {milestone.details}
                            </p>
                          )}

                          {milestone.metrics && (
                            <div>
                              <h4 className="font-medium text-spa-charcoal mb-4">Key Metrics</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {milestone.metrics.map((metric, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <div className="p-2 bg-alpine-blue/10 rounded-lg">
                                      <metric.icon className="w-4 h-4 text-alpine-blue" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-spa-charcoal">{metric.value}</div>
                                      <div className="text-sm text-spa-charcoal/60">{metric.label}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {milestone.achievements && (
                            <div>
                              <h4 className="font-medium text-spa-charcoal mb-4">Achievements</h4>
                              <ul className="space-y-2">
                                {milestone.achievements.map((achievement, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-spa-charcoal/70 text-sm">{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {milestone.weather && (
                            <div className="flex items-center gap-4 text-sm text-spa-charcoal/60">
                              <div className="flex items-center gap-2">
                                <Wind className="w-4 h-4" />
                                {milestone.weather}
                              </div>
                              {milestone.temperature && (
                                <div className="flex items-center gap-2">
                                  <Thermometer className="w-4 h-4" />
                                  {milestone.temperature}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-4 border-t border-spa-stone/10">
                            <button className="flex items-center gap-2 px-4 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors">
                              <Share className="w-4 h-4" />
                              Share Milestone
                            </button>
                            {milestone.images && (
                              <button className="flex items-center gap-2 px-4 py-2 border border-spa-stone/20 text-spa-charcoal rounded-lg hover:bg-spa-mist/10 transition-colors">
                                <Camera className="w-4 h-4" />
                                View Photos ({milestone.images.length})
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-alpine-blue/10 to-summit-gold/10 rounded-2xl p-8 border border-spa-stone/10">
            <h3 className="text-2xl font-light text-spa-charcoal mb-4">
              Follow the Journey
            </h3>
            <p className="text-spa-charcoal/70 mb-6 max-w-2xl mx-auto">
              Stay updated with real-time progress, behind-the-scenes insights, and exclusive content 
              from each phase of the expedition.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-3 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors">
                Subscribe for Updates
              </button>
              <button className="px-6 py-3 border border-spa-stone/20 text-spa-charcoal rounded-lg hover:bg-spa-mist/10 transition-colors">
                Support the Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}