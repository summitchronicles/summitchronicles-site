import { NextRequest, NextResponse } from 'next/server'
import { generateChatCompletion } from '../../../../lib/integrations/ollama'

export const dynamic = 'force-dynamic'

interface UserProfile {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  primaryGoals: string[]
  preferredActivities: string[]
  currentPhase: 'base-building' | 'strength' | 'peak' | 'recovery'
  nextExpedition?: {
    name: string
    date: string
    difficulty: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile, activities = [], timeframe = 'current' } = body

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'User profile is required' },
        { status: 400 }
      )
    }

    // Generate personalized content based on profile and activities
    const personalizedContent = await generatePersonalizedDashboard(profile, activities, timeframe)

    return NextResponse.json({
      success: true,
      content: personalizedContent,
      meta: {
        generatedAt: new Date().toISOString(),
        profileLevel: profile.level,
        activitiesAnalyzed: activities.length
      }
    })

  } catch (error) {
    console.error('Personalization dashboard error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate personalized dashboard',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function generatePersonalizedDashboard(profile: UserProfile, activities: any[], timeframe: string) {
  // Calculate days until expedition
  const daysToExpedition = profile.nextExpedition 
    ? Math.ceil((new Date(profile.nextExpedition.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  // Analyze recent activities
  const totalHours = activities.reduce((sum, act) => sum + (act.moving_time || 0), 0) / 3600
  const totalElevation = activities.reduce((sum, act) => sum + (act.total_elevation_gain || 0), 0)
  const avgDuration = activities.length > 0 ? totalHours / activities.length : 0

  // Generate AI-powered welcome message
  const welcomePrompt = `Generate a personalized welcome message for ${profile.name}, a ${profile.level} mountaineer in the ${profile.currentPhase.replace('-', ' ')} phase. ${daysToExpedition ? `They have ${daysToExpedition} days until ${profile.nextExpedition?.name}.` : ''} Keep it motivating and specific to their level and phase.`
  
  const welcomeMessage = await generateChatCompletion([
    { role: 'system', content: 'You are a motivational mountaineering coach. Generate encouraging, specific welcome messages in 1-2 sentences.' },
    { role: 'user', content: welcomePrompt }
  ])

  // Generate priority actions based on profile and current phase
  const priorityActions = generatePriorityActions(profile, activities, daysToExpedition)

  // Generate recommended content based on user interests and level
  const recommendedContent = generateRecommendedContent(profile)

  // Generate weekly focus based on current phase
  const weeklyFocus = generateWeeklyFocus(profile, daysToExpedition)

  // Analyze progress metrics
  const progressMetrics = analyzeProgressMetrics(activities, profile)

  return {
    welcomeMessage: welcomeMessage.slice(0, 200), // Limit length
    priorityActions,
    recommendedContent,
    weeklyFocus,
    progressMetrics
  }
}

function generatePriorityActions(profile: UserProfile, activities: any[], daysToExpedition: number | null) {
  const actions = []

  // Expedition-specific actions
  if (daysToExpedition && daysToExpedition <= 90) {
    if (daysToExpedition <= 30) {
      actions.push({
        type: 'planning',
        title: 'Finalize Expedition Gear and Logistics',
        description: 'Complete gear check, confirm permits, and review emergency procedures',
        urgency: 'high'
      })
    } else if (daysToExpedition <= 60) {
      actions.push({
        type: 'training',
        title: 'Peak Training Phase - Sport-Specific Sessions',
        description: 'Focus on expedition-specific training with loaded carries and technical skills',
        urgency: 'high'
      })
    }
  }

  // Training phase-specific actions
  switch (profile.currentPhase) {
    case 'base-building':
      actions.push({
        type: 'training',
        title: 'Complete Weekly Long Endurance Session',
        description: 'Aim for 6-8 hours with significant elevation gain to build aerobic base',
        urgency: 'high'
      })
      break
    case 'strength':
      actions.push({
        type: 'training',
        title: 'Progressive Weighted Carry Training',
        description: 'Increase pack weight systematically, focus on leg strength and stability',
        urgency: 'high'
      })
      break
    case 'peak':
      actions.push({
        type: 'training',
        title: 'High-Intensity Specific Training',
        description: 'Sport-specific sessions at target intensity with technical skill integration',
        urgency: 'high'
      })
      break
    case 'recovery':
      actions.push({
        type: 'training',
        title: 'Active Recovery and Mobility',
        description: 'Focus on easy movement, stretching, and mental preparation',
        urgency: 'medium'
      })
      break
  }

  // Level-specific actions
  if (profile.level === 'beginner' || profile.level === 'intermediate') {
    actions.push({
      type: 'safety',
      title: 'Practice Essential Safety Skills',
      description: 'Review self-arrest, navigation, and emergency procedures regularly',
      urgency: 'medium'
    })
  }

  if (profile.level === 'advanced' || profile.level === 'expert') {
    actions.push({
      type: 'planning',
      title: 'Route Planning and Risk Assessment',
      description: 'Analyze conditions, create contingency plans, and review decision-making frameworks',
      urgency: 'medium'
    })
  }

  // Activity-based recommendations
  const recentActivityCount = activities.filter(act => 
    new Date(act.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  if (recentActivityCount < 3) {
    actions.push({
      type: 'training',
      title: 'Increase Training Frequency',
      description: 'Aim for 4-5 training sessions per week to maintain fitness progression',
      urgency: 'medium'
    })
  }

  return actions.slice(0, 4) // Limit to 4 priority actions
}

function generateRecommendedContent(profile: UserProfile) {
  const content = []

  // Level-appropriate content
  const levelContent = {
    beginner: [
      { type: 'article', title: 'Mountaineering Fundamentals', category: 'Basics', difficulty: 'Beginner', estimatedTime: '10 min', relevanceScore: 0.95 },
      { type: 'training', title: 'Building Your Aerobic Base', category: 'Training', difficulty: 'Beginner', estimatedTime: '15 min', relevanceScore: 0.90 }
    ],
    intermediate: [
      { type: 'training', title: 'High-Altitude Acclimatization Protocol', category: 'Training', difficulty: 'Intermediate', estimatedTime: '15 min', relevanceScore: 0.95 },
      { type: 'article', title: 'Technical Climbing Progression', category: 'Skills', difficulty: 'Intermediate', estimatedTime: '20 min', relevanceScore: 0.88 }
    ],
    advanced: [
      { type: 'training', title: 'Advanced Route Planning', category: 'Planning', difficulty: 'Advanced', estimatedTime: '25 min', relevanceScore: 0.92 },
      { type: 'article', title: 'Expedition Leadership', category: 'Leadership', difficulty: 'Advanced', estimatedTime: '20 min', relevanceScore: 0.85 }
    ],
    expert: [
      { type: 'article', title: 'Extreme Weather Strategies', category: 'Advanced', difficulty: 'Expert', estimatedTime: '30 min', relevanceScore: 0.90 },
      { type: 'training', title: 'High-Risk Decision Making', category: 'Psychology', difficulty: 'Expert', estimatedTime: '25 min', relevanceScore: 0.88 }
    ]
  }

  content.push(...levelContent[profile.level])

  // Goal-specific content
  if (profile.primaryGoals.some(goal => goal.toLowerCase().includes('everest'))) {
    content.push({
      type: 'training', title: 'Everest Training Protocols', category: 'Expedition', difficulty: profile.level, estimatedTime: '30 min', relevanceScore: 0.98
    })
  }

  if (profile.primaryGoals.some(goal => goal.toLowerCase().includes('technical'))) {
    content.push({
      type: 'training', title: 'Technical Climbing Systems', category: 'Technical', difficulty: profile.level, estimatedTime: '25 min', relevanceScore: 0.92
    })
  }

  return content.slice(0, 5)
}

function generateWeeklyFocus(profile: UserProfile, daysToExpedition: number | null) {
  const phaseContent = {
    'base-building': {
      title: 'Aerobic Base Development',
      description: 'Focus on building cardiovascular foundation with longer, moderate-intensity sessions',
      goals: [
        'Complete 2-3 zone 2 endurance sessions',
        'One long session (6+ hours) with elevation',
        'Maintain technical skill practice',
        'Include recovery and mobility work'
      ]
    },
    'strength': {
      title: 'Functional Strength Building',
      description: 'Develop expedition-specific strength with progressive loading and functional movements',
      goals: [
        'Progressive weighted pack training',
        '2-3 strength sessions focusing on legs/core',
        'Hiking with increasing loads',
        'Technical skill maintenance'
      ]
    },
    'peak': {
      title: 'Sport-Specific Peak Training',
      description: 'High-intensity training mimicking expedition demands with full kit',
      goals: [
        'Expedition simulation sessions',
        'High-intensity interval training',
        'Technical skills under fatigue',
        'Mental preparation and visualization'
      ]
    },
    'recovery': {
      title: 'Active Recovery and Regeneration',
      description: 'Focus on recovery while maintaining fitness base and preparing for next cycle',
      goals: [
        'Easy-paced movement sessions',
        'Flexibility and mobility work',
        'Equipment maintenance and planning',
        'Mental rest and reflection'
      ]
    }
  }

  let focus = phaseContent[profile.currentPhase]

  // Modify based on expedition proximity
  if (daysToExpedition && daysToExpedition <= 21) {
    focus = {
      title: 'Final Expedition Preparation',
      description: 'Taper training volume while maintaining sharpness and finalizing logistics',
      goals: [
        'Reduced volume, maintain intensity',
        'Final gear testing and packing',
        'Mental preparation and visualization',
        'Rest and arrive fresh'
      ]
    }
  }

  return focus
}

function analyzeProgressMetrics(activities: any[], profile: UserProfile) {
  const currentWeek = {
    activitiesCompleted: activities.length,
    totalHours: activities.reduce((sum, act) => sum + (act.moving_time || 0), 0) / 3600,
    elevationGained: activities.reduce((sum, act) => sum + (act.total_elevation_gain || 0), 0)
  }

  // Simple trend analysis (in real app, you'd compare with historical data)
  const trends = {
    endurance: activities.length >= 4 ? 'improving' : activities.length >= 2 ? 'stable' : 'declining',
    strength: currentWeek.elevationGained > 1000 ? 'improving' : currentWeek.elevationGained > 500 ? 'stable' : 'declining',
    consistency: activities.length >= 5 ? 'improving' : activities.length >= 3 ? 'stable' : 'declining'
  }

  return {
    currentWeek,
    trends
  }
}

export async function GET(request: NextRequest) {
  // Return sample personalized content for testing
  return NextResponse.json({
    success: true,
    content: {
      welcomeMessage: "Welcome back! You're making excellent progress in your base building phase.",
      priorityActions: [
        {
          type: 'training',
          title: 'Complete Weekly Long Endurance Session',
          description: 'Aim for 6-8 hours with significant elevation gain',
          urgency: 'high'
        }
      ],
      recommendedContent: [
        {
          type: 'training',
          title: 'High-Altitude Training Protocol',
          category: 'Training',
          difficulty: 'Intermediate',
          estimatedTime: '15 min',
          relevanceScore: 0.95
        }
      ],
      weeklyFocus: {
        title: 'Aerobic Base Building',
        description: 'Focus on cardiovascular foundation development',
        goals: ['Complete endurance sessions', 'Maintain consistency']
      },
      progressMetrics: {
        currentWeek: { activitiesCompleted: 4, totalHours: 12, elevationGained: 1500 },
        trends: { endurance: 'improving', strength: 'stable', consistency: 'improving' }
      }
    },
    meta: {
      isSampleData: true,
      generatedAt: new Date().toISOString()
    }
  })
}