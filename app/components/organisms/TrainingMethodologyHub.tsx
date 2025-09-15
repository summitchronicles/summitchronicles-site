'use client'

import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Clock, TrendingUp, User, Calendar, Download, Heart, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkoutPlan {
  id: string
  title: string
  category: 'endurance' | 'strength' | 'technical' | 'recovery'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite'
  duration: number // minutes
  intensity: 'low' | 'moderate' | 'high' | 'extreme'
  phase: 'base-building' | 'strength' | 'peak' | 'expedition-prep'
  description: string
  exercises: Exercise[]
  progression: ProgressionNote[]
  equipment: string[]
  recovery: string
  tips: string[]
}

interface Exercise {
  name: string
  sets?: number
  reps?: string
  duration?: string
  rest?: string
  notes?: string
}

interface ProgressionNote {
  week: number
  focus: string
  modifications: string[]
}

interface TrainingMethodologyHubProps {
  className?: string
}

const SAMPLE_WORKOUTS: WorkoutPlan[] = [
  {
    id: '1',
    title: 'Alpine Endurance Foundation',
    category: 'endurance',
    difficulty: 'intermediate',
    duration: 90,
    intensity: 'moderate',
    phase: 'base-building',
    description: 'Build aerobic capacity and muscular endurance essential for high-altitude climbing. This foundational workout prepares your cardiovascular system for extended periods of exertion at elevation.',
    exercises: [
      { name: 'Dynamic Warm-up', duration: '10 minutes', notes: 'Focus on hip mobility and ankle preparation' },
      { name: 'Zone 2 Incline Walking', duration: '45 minutes', notes: '15-20% grade, maintain conversational pace' },
      { name: 'Step-ups with Pack', sets: 3, reps: '20 each leg', notes: 'Use 20-30lb pack, focus on control' },
      { name: 'Breathing Ladder', sets: 4, reps: '10-20-30-20-10', rest: '90 seconds', notes: 'Simulate altitude stress' },
      { name: 'Cool-down Stretch', duration: '15 minutes', notes: 'Focus on calves, hips, and shoulders' }
    ],
    progression: [
      { week: 1, focus: 'Adaptation', modifications: ['Start with 15lb pack', 'Reduce grade to 12%'] },
      { week: 2, focus: 'Building', modifications: ['Increase to 20lb pack', 'Full 15% grade'] },
      { week: 4, focus: 'Peak', modifications: ['30lb pack', '20% grade', 'Add 15 minutes duration'] }
    ],
    equipment: ['Treadmill or steep trail', 'Weighted pack', 'Step platform', 'Heart rate monitor'],
    recovery: '24-48 hours active recovery. Light walking or yoga recommended.',
    tips: [
      'Monitor heart rate zones carefully - stay in Zone 2',
      'Practice breathing techniques throughout workout',
      'Gradually increase pack weight over weeks',
      'Focus on efficiency of movement over speed'
    ]
  },
  {
    id: '2', 
    title: 'Functional Strength Circuit',
    category: 'strength',
    difficulty: 'advanced',
    duration: 75,
    intensity: 'high',
    phase: 'strength',
    description: 'Develop climbing-specific strength through compound movements that mirror mountaineering demands. Emphasizes core stability, unilateral strength, and power endurance.',
    exercises: [
      { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '3 minutes', notes: 'Focus on control, full ROM' },
      { name: 'Single-leg Squats', sets: 3, reps: '8 each leg', rest: '90 seconds', notes: 'Use assistance as needed' },
      { name: 'Farmer Carries', sets: 3, duration: '40 seconds', rest: '2 minutes', notes: 'Heavy weight, perfect posture' },
      { name: 'Turkish Get-ups', sets: 3, reps: '5 each side', rest: '2 minutes', notes: 'Focus on stability and control' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '90 seconds', notes: 'Control the negative' }
    ],
    progression: [
      { week: 1, focus: 'Form mastery', modifications: ['Bodyweight movements', 'Longer rest periods'] },
      { week: 3, focus: 'Load increase', modifications: ['Add weight', 'Reduce rest by 15 seconds'] },
      { week: 6, focus: 'Peak strength', modifications: ['Maximum weight', 'Add complexity variations'] }
    ],
    equipment: ['Pull-up bar', 'Kettlebells', 'Dumbbells', 'TRX or suspension trainer'],
    recovery: '48-72 hours. Focus on mobility and soft tissue work.',
    tips: [
      'Quality over quantity - perfect form is essential',
      'Scale exercises to maintain proper technique',
      'Progressive overload is key for strength gains',
      'Pay attention to unilateral imbalances'
    ]
  },
  {
    id: '3',
    title: 'Technical Skills Practice',
    category: 'technical',
    difficulty: 'intermediate',
    duration: 120,
    intensity: 'moderate',
    phase: 'expedition-prep',
    description: 'Practice essential mountaineering techniques in controlled environment. Focus on rope work, anchor building, and emergency procedures.',
    exercises: [
      { name: 'Knot Practice Session', duration: '20 minutes', notes: 'Figure-8, clove hitch, prusik, munter' },
      { name: 'Anchor Building', duration: '30 minutes', notes: 'Practice SERENE principles' },
      { name: 'Crevasse Rescue Setup', duration: '40 minutes', notes: 'Full system practice with pack' },
      { name: 'Crampon Technique', duration: '20 minutes', notes: 'French, German, American techniques' },
      { name: 'Emergency Scenarios', duration: '10 minutes', notes: 'Random scenario response drills' }
    ],
    progression: [
      { week: 1, focus: 'Basic skills', modifications: ['Individual techniques', 'No time pressure'] },
      { week: 2, focus: 'Integration', modifications: ['Combine skills', 'Light time pressure'] },
      { week: 4, focus: 'Mastery', modifications: ['Full scenarios', 'Cold/wind simulation'] }
    ],
    equipment: ['Rope', 'Harness', 'Helmet', 'Crampons', 'Ice axe', 'Various protection'],
    recovery: 'Light physical recovery needed. Focus on knowledge retention.',
    tips: [
      'Practice until movements become automatic',
      'Simulate challenging conditions when possible',
      'Regular review prevents skill degradation',
      'Partner practice builds team dynamics'
    ]
  }
]

const CATEGORIES = [
  { id: 'all', label: 'All Training', icon: Target },
  { id: 'endurance', label: 'Endurance', icon: Heart },
  { id: 'strength', label: 'Strength', icon: Zap },
  { id: 'technical', label: 'Technical', icon: User },
  { id: 'recovery', label: 'Recovery', icon: Clock }
]

const DIFFICULTIES = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'elite', label: 'Elite' }
]

export const TrainingMethodologyHub: React.FC<TrainingMethodologyHubProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)

  const filteredWorkouts = SAMPLE_WORKOUTS.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getCategoryColor = (category: WorkoutPlan['category']) => {
    switch (category) {
      case 'endurance': return 'bg-red-100 text-red-700 border-red-200'
      case 'strength': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'technical': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'recovery': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getDifficultyColor = (difficulty: WorkoutPlan['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-orange-100 text-orange-700'
      case 'elite': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getIntensityColor = (intensity: WorkoutPlan['intensity']) => {
    switch (intensity) {
      case 'low': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'extreme': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  return (
    <section className={cn(
      'py-16 bg-gradient-to-br from-white via-spa-mist/20 to-spa-cloud/30',
      className
    )}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-spa-charcoal mb-4">
            Training Methodology
          </h2>
          <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
            Systematic training approaches developed through years of mountaineering preparation. 
            Each methodology includes detailed progression, equipment requirements, and recovery protocols.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-spa-charcoal/40" />
            <input
              type="text"
              placeholder="Search training methodologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-spa-stone/20 rounded-lg 
                       bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 
                       focus:ring-alpine-blue/20 focus:border-alpine-blue/40 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                    selectedCategory === id
                      ? 'bg-alpine-blue text-white shadow-md'
                      : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-white/80 border border-spa-stone/20 rounded-lg 
                       text-spa-charcoal focus:outline-none focus:ring-2 focus:ring-alpine-blue/20"
            >
              {DIFFICULTIES.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Training Methodologies */}
        <div className="space-y-6">
          {filteredWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-spa-stone/10 overflow-hidden shadow-sm">
              {/* Workout Header */}
              <div className="p-6 border-b border-spa-stone/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-spa-charcoal mb-2">
                      {workout.title}
                    </h3>
                    <p className="text-spa-charcoal/70 leading-relaxed">
                      {workout.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setExpandedWorkout(
                      expandedWorkout === workout.id ? null : workout.id
                    )}
                    className="ml-4 p-2 rounded-lg hover:bg-spa-mist/20 transition-colors"
                  >
                    <ChevronDown className={cn(
                      'w-5 h-5 text-spa-charcoal/60 transition-transform',
                      expandedWorkout === workout.id && 'rotate-180'
                    )} />
                  </button>
                </div>

                {/* Workout Meta */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className={cn(
                    'px-3 py-1 rounded-full border text-sm font-medium',
                    getCategoryColor(workout.category)
                  )}>
                    {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                  </div>
                  
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getDifficultyColor(workout.difficulty)
                  )}>
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </div>

                  <div className="flex items-center gap-1 text-spa-charcoal/60">
                    <Clock className="w-4 h-4" />
                    {workout.duration} minutes
                  </div>

                  <div className="flex items-center gap-1">
                    <TrendingUp className={cn('w-4 h-4', getIntensityColor(workout.intensity))} />
                    <span className={getIntensityColor(workout.intensity)}>
                      {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)} intensity
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedWorkout === workout.id && (
                <div className="p-6 space-y-8">
                  {/* Exercises */}
                  <div>
                    <h4 className="text-lg font-medium text-spa-charcoal mb-4">Workout Structure</h4>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-spa-mist/10 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-alpine-blue/10 rounded-full text-alpine-blue font-medium text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-spa-charcoal mb-1">{exercise.name}</div>
                            <div className="text-sm text-spa-charcoal/70 space-y-1">
                              {exercise.sets && <div>Sets: {exercise.sets}</div>}
                              {exercise.reps && <div>Reps: {exercise.reps}</div>}
                              {exercise.duration && <div>Duration: {exercise.duration}</div>}
                              {exercise.rest && <div>Rest: {exercise.rest}</div>}
                              {exercise.notes && <div className="italic">Notes: {exercise.notes}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progression & Tips */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Progression */}
                    <div>
                      <h4 className="text-lg font-medium text-spa-charcoal mb-4">Progression Plan</h4>
                      <div className="space-y-3">
                        {workout.progression.map((prog, index) => (
                          <div key={index} className="p-4 bg-spa-cloud/20 rounded-lg">
                            <div className="font-medium text-spa-charcoal mb-2">Week {prog.week}: {prog.focus}</div>
                            <ul className="text-sm text-spa-charcoal/70 space-y-1">
                              {prog.modifications.map((mod, i) => (
                                <li key={i}>• {mod}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips & Recovery */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-spa-charcoal mb-4">Training Tips</h4>
                        <ul className="text-sm text-spa-charcoal/70 space-y-2">
                          {workout.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-alpine-blue rounded-full mt-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-spa-charcoal mb-2">Recovery</h4>
                        <p className="text-sm text-spa-charcoal/70">{workout.recovery}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-spa-charcoal mb-2">Equipment</h4>
                        <div className="flex flex-wrap gap-2">
                          {workout.equipment.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-spa-stone/20 text-spa-charcoal/70 rounded text-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 pt-4 border-t border-spa-stone/10">
                    <button className="flex items-center gap-2 px-4 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors">
                      <Download className="w-4 h-4" />
                      Download Plan
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-spa-stone/20 text-spa-charcoal rounded-lg hover:bg-spa-mist/10 transition-colors">
                      <Calendar className="w-4 h-4" />
                      Add to Calendar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-spa-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-spa-charcoal/40" />
            </div>
            <h3 className="text-lg font-medium text-spa-charcoal mb-2">No training methodologies found</h3>
            <p className="text-spa-charcoal/60">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  )
}