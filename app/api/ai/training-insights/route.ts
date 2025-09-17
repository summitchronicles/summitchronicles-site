import { NextRequest, NextResponse } from 'next/server'
import { generateTrainingInsights } from '../../../../lib/integrations/ollama'

export const dynamic = 'force-dynamic'

interface TrainingActivity {
  name: string
  type: string
  distance: number
  moving_time: number
  total_elevation_gain: number
  start_date: string
  average_heartrate?: number
  max_heartrate?: number
  calories?: number
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { activities, goals, timeframe = '2weeks' } = body

    if (!activities || !Array.isArray(activities)) {
      return NextResponse.json(
        { success: false, error: 'Activities array is required' },
        { status: 400 }
      )
    }

    // Generate AI insights using Ollama
    const rawInsights = await generateTrainingInsights(activities, goals || [])
    
    // Parse the AI response into structured insights
    const insights = parseTrainingInsights(rawInsights, activities.length)

    return NextResponse.json({
      success: true,
      insights: insights,
      meta: {
        activitiesAnalyzed: activities.length,
        timeframe: timeframe,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Training insights error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate training insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function parseTrainingInsights(aiResponse: string, activityCount: number): TrainingInsights {
  // Parse AI response into structured format
  // This is a simplified parser - in production you'd want more robust parsing
  
  const lines = aiResponse.split('\n').filter(line => line.trim())
  
  let summary = ''
  let progressAssessment = ''
  const areasForImprovement: string[] = []
  const specificRecommendations: string[] = []
  const riskFactors: string[] = []
  let nextWeekPlan = ''
  
  let currentSection = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Detect sections
    if (trimmed.toLowerCase().includes('progress assessment') || trimmed.startsWith('1.')) {
      currentSection = 'progress'
      continue
    } else if (trimmed.toLowerCase().includes('areas for improvement') || trimmed.startsWith('2.')) {
      currentSection = 'improvement'
      continue
    } else if (trimmed.toLowerCase().includes('specific recommendations') || trimmed.startsWith('3.')) {
      currentSection = 'recommendations'
      continue
    } else if (trimmed.toLowerCase().includes('risk factors') || trimmed.startsWith('4.')) {
      currentSection = 'risks'
      continue
    } else if (trimmed.toLowerCase().includes('next training cycle') || trimmed.toLowerCase().includes('next week')) {
      currentSection = 'nextweek'
      continue
    }
    
    // Skip empty lines and section headers
    if (!trimmed || trimmed.endsWith(':')) continue
    
    // Parse content based on current section
    switch (currentSection) {
      case 'progress':
        if (!progressAssessment) {
          progressAssessment = trimmed
        } else {
          progressAssessment += ' ' + trimmed
        }
        break
        
      case 'improvement':
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
          areasForImprovement.push(trimmed.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''))
        } else if (areasForImprovement.length > 0) {
          areasForImprovement[areasForImprovement.length - 1] += ' ' + trimmed
        }
        break
        
      case 'recommendations':
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
          specificRecommendations.push(trimmed.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''))
        } else if (specificRecommendations.length > 0) {
          specificRecommendations[specificRecommendations.length - 1] += ' ' + trimmed
        }
        break
        
      case 'risks':
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
          riskFactors.push(trimmed.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''))
        } else if (riskFactors.length > 0) {
          riskFactors[riskFactors.length - 1] += ' ' + trimmed
        }
        break
        
      case 'nextweek':
        if (!nextWeekPlan) {
          nextWeekPlan = trimmed
        } else {
          nextWeekPlan += ' ' + trimmed
        }
        break
        
      default:
        // If no section detected yet, add to summary
        if (!summary) {
          summary = trimmed
        } else if (!progressAssessment) {
          summary += ' ' + trimmed
        }
        break
    }
  }
  
  // Fallback values if parsing didn't capture everything
  if (!summary) {
    summary = aiResponse.split('\n')[0] || 'Analysis of your recent training activities shows consistent effort toward your mountaineering goals.'
  }
  
  if (!progressAssessment) {
    progressAssessment = 'Your training shows good consistency with room for targeted improvements in specific areas.'
  }
  
  if (areasForImprovement.length === 0) {
    areasForImprovement.push('Increase training volume gradually', 'Focus on sport-specific endurance', 'Incorporate more elevation gain')
  }
  
  if (specificRecommendations.length === 0) {
    specificRecommendations.push('Plan 1-2 longer endurance sessions per week', 'Add weighted pack training', 'Include technical skill practice')
  }
  
  if (riskFactors.length === 0) {
    riskFactors.push('Monitor for overtraining symptoms', 'Ensure adequate recovery between sessions', 'Pay attention to injury prevention')
  }
  
  if (!nextWeekPlan) {
    nextWeekPlan = 'Focus on building your aerobic base with longer, moderate-intensity sessions while maintaining technical skill practice.'
  }
  
  // Calculate confidence based on activity count and data quality
  let confidence = 0.6 // Base confidence
  if (activityCount >= 5) confidence += 0.1
  if (activityCount >= 10) confidence += 0.1
  if (activityCount >= 15) confidence += 0.1
  
  // Cap confidence at 0.9
  confidence = Math.min(confidence, 0.9)
  
  return {
    summary: summary.slice(0, 500), // Limit length
    progressAssessment: progressAssessment.slice(0, 300),
    areasForImprovement: areasForImprovement.slice(0, 5),
    specificRecommendations: specificRecommendations.slice(0, 6),
    riskFactors: riskFactors.slice(0, 4),
    nextWeekPlan: nextWeekPlan.slice(0, 400),
    confidence: confidence,
    analysisDate: new Date().toISOString()
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return sample insights for testing
    const sampleInsights: TrainingInsights = {
      summary: "Your recent training shows excellent consistency with a good mix of endurance and technical activities. You're building a solid aerobic base while maintaining skill development.",
      progressAssessment: "Strong upward trend in training volume and intensity. Your endurance activities show steady improvement, and you're maintaining good consistency in technical training.",
      areasForImprovement: [
        "Increase weekly elevation gain to better prepare for high-altitude objectives",
        "Add more weighted pack training to simulate expedition conditions",
        "Include longer duration activities (4+ hours) to build expedition endurance"
      ],
      specificRecommendations: [
        "Plan one long endurance session (6-8 hours) per week with gradual elevation gain",
        "Incorporate weighted pack training starting at 15% body weight",
        "Add high-intensity interval training once per week for VO2 max development",
        "Practice technical skills in varied conditions to build adaptability",
        "Include recovery and mobility work to prevent overuse injuries"
      ],
      riskFactors: [
        "Monitor for signs of overtraining with current volume increases",
        "Ensure adequate nutrition and hydration during longer training sessions",
        "Watch for repetitive stress injuries from consistent training patterns"
      ],
      nextWeekPlan: "Focus on one long endurance session with significant elevation gain, maintain 2-3 moderate cardio sessions, add one weighted pack training session, and include technical skill practice. Ensure proper recovery between high-intensity sessions.",
      confidence: 0.82,
      analysisDate: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      insights: sampleInsights,
      meta: {
        isSampleData: true,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Sample insights error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate sample insights' },
      { status: 500 }
    )
  }
}