'use client'

import { useState } from 'react'
import { User, Mail, Calendar, Heart, Award, TrendingUp, Settings, Bell, Gift } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { cn } from '@/lib/utils'

interface SupporterProfile {
  id: string
  name: string
  email: string
  joinedDate: string
  engagementScore: number
  level: 'supporter' | 'champion' | 'ambassador' | 'legend'
  preferences: {
    emailFrequency: 'weekly' | 'biweekly' | 'monthly'
    contentInterests: string[]
    notifications: {
      newsletters: boolean
      communityUpdates: boolean
      milestones: boolean
      challenges: boolean
    }
  }
  activity: {
    newslettersOpened: number
    communityPosts: number
    challengesCompleted: number
    questionsAsked: number
  }
  milestones: Array<{
    id: string
    title: string
    date: string
    description: string
  }>
  personalizedContent: Array<{
    id: string
    title: string
    type: 'recommendation' | 'exclusive' | 'milestone'
    date: string
  }>
}

interface SupporterDashboardProps {
  profile: SupporterProfile
}

export function SupporterDashboard({ profile }: SupporterDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'preferences' | 'content'>('overview')
  const [notifications, setNotifications] = useState(profile.preferences.notifications)

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const engagementLevel = profile.engagementScore >= 80 ? 'high' : 
                         profile.engagementScore >= 50 ? 'medium' : 'low'

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-amber-600 bg-amber-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'supporter': return 'bg-blue-100 text-blue-700'
      case 'champion': return 'bg-purple-100 text-purple-700'
      case 'ambassador': return 'bg-amber-100 text-amber-700'
      case 'legend': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'content', label: 'Your Content', icon: Gift }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-spa-mist/20 to-white rounded-xl p-6 border border-spa-stone/10 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-alpine-blue/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-alpine-blue" />
            </div>
            
            <div>
              <h1 className="text-2xl font-light text-spa-charcoal mb-1">
                Welcome back, {profile.name}!
              </h1>
              <div className="flex items-center gap-3">
                <Badge className={getLevelBadgeColor(profile.level)}>
                  {profile.level}
                </Badge>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getEngagementColor(engagementLevel)
                )}>
                  {profile.engagementScore}% engagement
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-sm text-spa-charcoal/60">
            <div>Member since</div>
            <div className="font-medium text-spa-charcoal">
              {formatDate(profile.joinedDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-spa-stone/20 mb-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors',
              activeTab === id
                ? 'border-alpine-blue text-alpine-blue'
                : 'border-transparent text-spa-charcoal/60 hover:text-spa-charcoal'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-spa-charcoal mb-4">Overview Dashboard</h3>
          <p className="text-spa-charcoal/70">Supporter overview and activity tracking coming soon!</p>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-spa-charcoal mb-4">Preference Settings</h3>
          <p className="text-spa-charcoal/70">Personalized preferences and notification settings coming soon!</p>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-spa-charcoal mb-4">Your Content</h3>
          <p className="text-spa-charcoal/70">Personalized content and recommendations coming soon!</p>
        </div>
      )}
    </div>
  )
}

// Sample supporter profile data
export const sampleSupporterProfile: SupporterProfile = {
  id: '1',
  name: 'Sarah Martinez',
  email: 'sarah.m@email.com',
  joinedDate: '2023-06-15',
  engagementScore: 85,
  level: 'champion',
  preferences: {
    emailFrequency: 'weekly',
    contentInterests: ['Training Tips', 'Gear Reviews', 'Community Stories'],
    notifications: {
      newsletters: true,
      communityUpdates: true,
      milestones: true,
      challenges: false
    }
  },
  activity: {
    newslettersOpened: 24,
    communityPosts: 15,
    challengesCompleted: 3,
    questionsAsked: 7
  },
  milestones: [
    {
      id: '1',
      title: 'Community Champion',
      date: '2024-02-01',
      description: 'Achieved champion status through consistent community engagement and support'
    }
  ],
  personalizedContent: [
    {
      id: '1',
      title: 'Advanced Training Guide for Champions',
      type: 'exclusive',
      date: '2024-02-10'
    }
  ]
}