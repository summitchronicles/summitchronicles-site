'use client'

import { Trophy, Users, Calendar, Target, CheckCircle, Mountain } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { cn } from '@/lib/utils'

interface Challenge {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  participants: number
  maxParticipants?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'training' | 'mindset' | 'community'
  prize?: string
  isActive: boolean
  progress?: number
}

export function CommunityChallenge() {
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'February Training Consistency Challenge',
      description: 'Complete at least 20 training sessions this month following systematic progression principles.',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      participants: 156,
      maxParticipants: 200,
      difficulty: 'intermediate',
      category: 'training',
      prize: 'Featured in newsletter + training guide',
      isActive: true,
      progress: 65
    },
    {
      id: '2',
      title: 'Mindset Monday Reflections',
      description: 'Share weekly reflections on training challenges and victories in the community.',
      startDate: '2024-02-05',
      endDate: '2024-02-26',
      participants: 89,
      difficulty: 'beginner',
      category: 'mindset',
      isActive: true,
      progress: 45
    },
    {
      id: '3',
      title: 'March Base Building Bootcamp',
      description: 'Join the systematic base building phase with structured workouts and community support.',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      participants: 0,
      maxParticipants: 150,
      difficulty: 'beginner',
      category: 'training',
      prize: 'Exclusive training methodology guide',
      isActive: false
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-amber-100 text-amber-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'training': return Target
      case 'mindset': return Mountain
      case 'community': return Users
      default: return Target
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <section className="py-16 bg-gradient-to-br from-spa-mist/20 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-light text-spa-charcoal">Community Challenges</h2>
          </div>
          <p className="text-spa-charcoal/70 max-w-2xl mx-auto">
            Join fellow adventurers in structured challenges that build consistency, 
            community connection, and systematic progress toward expedition goals.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {challenges.map((challenge) => {
            const CategoryIcon = getCategoryIcon(challenge.category)
            
            return (
              <div
                key={challenge.id}
                className={cn(
                  'bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm transition-all',
                  challenge.isActive ? 'hover:shadow-md' : 'opacity-75'
                )}
              >
                {/* Challenge Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  {challenge.isActive && (
                    <Badge variant="summit" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Challenge Content */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-spa-charcoal mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed mb-4">
                    {challenge.description}
                  </p>
                  
                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm text-spa-charcoal/60 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-2 text-sm text-spa-charcoal/60 mb-4">
                    <Users className="w-4 h-4" />
                    <span>
                      {challenge.participants} participants
                      {challenge.maxParticipants && ` / ${challenge.maxParticipants} max`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {challenge.isActive && challenge.progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-spa-charcoal/70">Progress</span>
                        <span className="font-medium text-spa-charcoal">{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-spa-stone/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-alpine-blue to-alpine-blue/80 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Prize */}
                  {challenge.prize && (
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-3 border border-amber-200 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Prize</span>
                      </div>
                      <p className="text-amber-700 text-xs">{challenge.prize}</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant={challenge.isActive ? 'summit' : 'secondary'}
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!challenge.isActive}
                >
                  {challenge.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Join Challenge
                    </>
                  ) : (
                    'Coming Soon'
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Challenge Benefits */}
        <div className="mt-16 bg-white/50 rounded-2xl p-8 border border-spa-stone/10">
          <h3 className="text-xl font-medium text-spa-charcoal text-center mb-8">
            Why Join Community Challenges?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-spa-charcoal mb-2">Structured Progress</h4>
              <p className="text-spa-charcoal/70 text-sm">Follow systematic approaches with clear goals and milestones</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-spa-charcoal mb-2">Community Support</h4>
              <p className="text-spa-charcoal/70 text-sm">Connect with like-minded adventurers and share the journey</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-medium text-spa-charcoal mb-2">Recognition</h4>
              <p className="text-spa-charcoal/70 text-sm">Get featured in newsletters and receive exclusive content</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}