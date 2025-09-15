'use client'

import { Mountain, TrendingUp, Heart, Calendar, Target, Award, Users, MessageCircle } from 'lucide-react'
import { Badge } from '../atoms/Badge'
import { Button } from '../atoms/Button'
import { cn } from '@/lib/utils'

interface TrainingMetric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<{ className?: string }>
}

interface CommunityHighlight {
  name: string
  achievement: string
  location?: string
  quote?: string
}

interface WeeklyUpdateData {
  weekNumber: number
  dateRange: string
  title: string
  personalReflection: {
    challenge: string
    victory: string
    learning: string
  }
  trainingMetrics: TrainingMetric[]
  methodologyInsight: {
    title: string
    description: string
    application: string
  }
  communitySpotlight: CommunityHighlight[]
  upcomingMilestone: {
    title: string
    date: string
    description: string
    participationOpportunity?: string
  }
  callToAction?: {
    title: string
    description: string
    link: string
  }
}

interface WeeklyJourneyUpdateProps {
  data: WeeklyUpdateData
  emailFormat?: boolean
  className?: string
}

export function WeeklyJourneyUpdate({ 
  data, 
  emailFormat = false, 
  className 
}: WeeklyJourneyUpdateProps) {
  const {
    weekNumber,
    dateRange,
    title,
    personalReflection,
    trainingMetrics,
    methodologyInsight,
    communitySpotlight,
    upcomingMilestone,
    callToAction
  } = data

  const containerClass = emailFormat 
    ? 'max-w-2xl mx-auto bg-white font-sans' 
    : 'max-w-4xl mx-auto'

  return (
    <div className={cn(containerClass, className)}>
      {/* Header */}
      <header className={cn(
        'text-center mb-8',
        emailFormat ? 'p-8 bg-gradient-to-br from-blue-50 to-white' : 'py-8'
      )}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mountain className="w-8 h-8 text-blue-600" />
          <h1 className={cn(
            'font-light text-gray-800',
            emailFormat ? 'text-2xl' : 'text-3xl'
          )}>
            Summit Chronicles
          </h1>
        </div>
        
        <div className="space-y-2">
          <Badge variant="secondary" className="mb-2">
            Week {weekNumber} • {dateRange}
          </Badge>
          <h2 className={cn(
            'font-medium text-gray-900',
            emailFormat ? 'text-xl' : 'text-2xl'
          )}>
            {title}
          </h2>
        </div>
      </header>

      {/* Personal Reflection Section */}
      <section className={cn(
        'mb-8 p-6 rounded-xl border',
        emailFormat 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-gradient-to-br from-spa-mist/20 to-white border-spa-stone/10'
      )}>
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className={cn(
            'font-medium text-gray-900',
            emailFormat ? 'text-lg' : 'text-xl'
          )}>
            Personal Reflection
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Challenge
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {personalReflection.challenge}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Victory
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {personalReflection.victory}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Learning
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {personalReflection.learning}
            </p>
          </div>
        </div>
      </section>

      {/* Training Metrics */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className={cn(
            'font-medium text-gray-900',
            emailFormat ? 'text-lg' : 'text-xl'
          )}>
            Training Highlights
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trainingMetrics.map(({ label, value, change, trend, icon: Icon }) => (
            <div
              key={label}
              className={cn(
                'p-4 rounded-lg border text-center',
                emailFormat 
                  ? 'bg-white border-gray-200' 
                  : 'bg-white/90 backdrop-blur-sm border-spa-stone/10'
              )}
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              
              <div className="text-lg font-medium text-gray-900 mb-1">{value}</div>
              <div className="text-xs text-gray-600 mb-2">{label}</div>
              
              <div className={cn(
                'text-xs px-2 py-1 rounded-full',
                trend === 'up' && 'bg-green-100 text-green-700',
                trend === 'down' && 'bg-red-100 text-red-700',
                trend === 'stable' && 'bg-gray-100 text-gray-600'
              )}>
                {change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Training Methodology Insight */}
      <section className={cn(
        'mb-8 p-6 rounded-xl border',
        emailFormat 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-gradient-to-br from-alpine-blue/10 to-white border-spa-stone/10'
      )}>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className={cn(
            'font-medium text-gray-900',
            emailFormat ? 'text-lg' : 'text-xl'
          )}>
            Training Methodology Insight
          </h3>
        </div>

        <h4 className="font-medium text-gray-900 mb-3">{methodologyInsight.title}</h4>
        <p className="text-gray-700 mb-4 leading-relaxed">{methodologyInsight.description}</p>
        
        <div className="bg-white/50 rounded-lg p-4 border border-blue-200">
          <h5 className="font-medium text-gray-800 mb-2">This Week's Application:</h5>
          <p className="text-gray-600 text-sm leading-relaxed">{methodologyInsight.application}</p>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-purple-600" />
          <h3 className={cn(
            'font-medium text-gray-900',
            emailFormat ? 'text-lg' : 'text-xl'
          )}>
            Community Spotlight
          </h3>
        </div>

        <div className="space-y-4">
          {communitySpotlight.map((highlight, index) => (
            <div
              key={index}
              className={cn(
                'p-4 rounded-lg border',
                emailFormat 
                  ? 'bg-purple-50 border-purple-200' 
                  : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{highlight.name}</span>
                    {highlight.location && (
                      <span className="text-xs text-gray-500">• {highlight.location}</span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{highlight.achievement}</p>
                  {highlight.quote && (
                    <blockquote className="text-gray-600 text-sm italic border-l-2 border-purple-300 pl-3">
                      "{highlight.quote}"
                    </blockquote>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Milestone */}
      <section className={cn(
        'mb-8 p-6 rounded-xl border',
        emailFormat 
          ? 'bg-amber-50 border-amber-200' 
          : 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
      )}>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-amber-600" />
          <h3 className={cn(
            'font-medium text-gray-900',
            emailFormat ? 'text-lg' : 'text-xl'
          )}>
            Upcoming Milestone
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900">{upcomingMilestone.title}</h4>
            <p className="text-amber-700 text-sm font-medium">{upcomingMilestone.date}</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed">{upcomingMilestone.description}</p>
          
          {upcomingMilestone.participationOpportunity && (
            <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
              <h5 className="font-medium text-gray-800 mb-1">Join the Celebration:</h5>
              <p className="text-gray-600 text-sm">{upcomingMilestone.participationOpportunity}</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {callToAction && (
        <section className={cn(
          'text-center p-6 rounded-xl border',
          emailFormat 
            ? 'bg-gray-900 text-white border-gray-700' 
            : 'bg-gradient-to-br from-spa-charcoal to-alpine-blue text-white border-gray-700'
        )}>
          <h3 className="font-medium mb-3">{callToAction.title}</h3>
          <p className="text-gray-300 mb-4 leading-relaxed">{callToAction.description}</p>
          
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-gray-900 hover:bg-gray-100"
            asChild
          >
            <a href={callToAction.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </Button>
        </section>
      )}

      {/* Footer */}
      {emailFormat && (
        <footer className="mt-8 p-6 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Thank you for being part of the Summit Chronicles journey!
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700">Reply to this email</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Share with friends</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">Unsubscribe</a>
          </div>
        </footer>
      )}
    </div>
  )
}

// Sample data for demonstration
export const sampleWeeklyData: WeeklyUpdateData = {
  weekNumber: 5,
  dateRange: 'February 5-11, 2024',
  title: 'Strength Phase Launch & Mental Resilience Building',
  personalReflection: {
    challenge: 'Transitioning from base building to strength phase required careful attention to recovery. The increased training load tested my systematic approach.',
    victory: 'Successfully completed first week of strength phase with all metrics on target. The methodical progression is paying off.',
    learning: 'Recovery is as important as training intensity. Listening to my body while maintaining discipline creates sustainable progress.'
  },
  trainingMetrics: [
    {
      label: 'Training Hours',
      value: '14.5h',
      change: '+2.5h',
      trend: 'up',
      icon: TrendingUp
    },
    {
      label: 'Vertical Gain',
      value: '3,240m',
      change: '+400m',
      trend: 'up',
      icon: Mountain
    },
    {
      label: 'Strength Sessions',
      value: '4',
      change: '+2',
      trend: 'up',
      icon: Target
    },
    {
      label: 'Recovery Score',
      value: '8.2/10',
      change: '+0.3',
      trend: 'up',
      icon: Heart
    }
  ],
  methodologyInsight: {
    title: 'Progressive Overload in Mountaineering Training',
    description: 'This week we explore how progressive overload applies beyond just lifting weights. In mountaineering preparation, we systematically increase training stress through duration, intensity, and technical complexity.',
    application: 'Added 2 strength sessions while maintaining cardio base. Increased hiking pack weight by 5lbs and introduced technical movement patterns. Each increase is measurable and planned.'
  },
  communitySpotlight: [
    {
      name: 'Maria Rodriguez',
      achievement: 'Completed her first 14er with a 40lb pack, inspired by systematic training approach',
      location: 'Colorado',
      quote: 'The methodical preparation gave me confidence to tackle bigger goals!'
    },
    {
      name: 'David Chen',
      achievement: 'Started his own Everest preparation journey using similar training principles',
      location: 'Vancouver',
      quote: 'Seeing the systematic approach in action motivated me to start my own expedition planning.'
    }
  ],
  upcomingMilestone: {
    title: 'First High-Altitude Training Simulation',
    date: 'February 18-19, 2024',
    description: 'Testing elevation mask protocols and high-intensity intervals to simulate altitude challenges. This milestone marks transition from base fitness to expedition-specific preparation.',
    participationOpportunity: 'Share your own altitude training experiences or ask questions about high-altitude preparation techniques.'
  },
  callToAction: {
    title: 'Join the Training Community',
    description: 'Connect with other adventurers following systematic training approaches. Share your progress, ask questions, and celebrate achievements together.',
    link: '/community'
  }
}