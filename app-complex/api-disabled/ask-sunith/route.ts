import { NextRequest, NextResponse } from 'next/server'
import { searchSimilarContent } from '@/lib/supabase'
import { generateEmbedding, ollama } from '@/lib/ollama'
import { logError, logInfo, logPerformance } from '@/lib/error-monitor'
import { protectionPresets, ProtectedRequest, InputValidator } from '@/lib/api-protection'

export const POST = protectionPresets.aiEndpoint(async (request: ProtectedRequest) => {
  const startTime = Date.now();
  
  try {
    const { question } = await request.json()
    
    // Validate input using security validator
    const validationResult = InputValidator.validateQuestionInput(question)
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      )
    }

    // Sanitize the question
    const sanitizedQuestion = InputValidator.sanitizeString(question, 500)
    
    // Log the incoming question
    await logInfo('Ask Sunith request received', { 
      questionLength: sanitizedQuestion.length,
      rateLimitRemaining: request.rateLimit?.remaining || 0
    })

    // Generate embedding for the sanitized question
    const questionEmbedding = await generateEmbedding(sanitizedQuestion)

    // Search for similar content in knowledge base
    const similarContent = await searchSimilarContent(
      questionEmbedding,
      0.6, // Lower threshold for more results
      5    // Top 5 matches
    )

    // Prepare context from similar content
    const context = similarContent.map(item => 
      `[${item.category.toUpperCase()}] ${item.content} (Source: ${item.source})`
    )

    // Check if we have any relevant context
    if (context.length === 0) {
      // Fallback to rule-based responses if no vector matches
      const fallbackResponse = getFallbackResponse(sanitizedQuestion)
      return NextResponse.json({ 
        response: fallbackResponse,
        source: 'fallback',
        confidence: 'low'
      })
    }

    // Generate response using Ollama with context
    const systemPrompt = `You are Sunith Kumar, a mountaineer who has completed 4 out of 7 summits and recovered from tuberculosis to become a multi-discipline adventurer. You run ultra marathons and explore places across 4 continents.

Answer the question based on the provided context from your actual experiences. Be personal, specific, and helpful. If the context doesn't fully answer the question, say so and provide what information you can.

Keep responses conversational but informative, around 2-3 sentences. Always speak in first person as Sunith.`

    const prompt = `${systemPrompt}\n\nContext from my experiences:\n${context.join('\n\n')}\n\nQuestion: ${sanitizedQuestion}\n\nMy answer:`

    let response: string

    // Try Ollama first, fallback to simple context if unavailable
    if (await ollama.isRunning()) {
      response = await ollama.generateResponse(sanitizedQuestion, context)
      
      // Clean up the response
      response = response
        .replace(/^(Answer|My answer|Response):\s*/i, '')
        .replace(/^As Sunith Kumar,?\s*/i, '')
        .trim()
    } else {
      // Simple context-based response if Ollama unavailable
      response = generateContextResponse(sanitizedQuestion, context)
    }

    // Log successful completion with performance metrics
    const duration = Date.now() - startTime;
    await logPerformance('/api/ask-sunith', duration, true);
    await logInfo('Ask Sunith response generated successfully', { 
      source: 'rag', 
      confidence: similarContent.length > 2 ? 'high' : 'medium',
      matchCount: similarContent.length,
      duration 
    });

    return NextResponse.json({ 
      response,
      source: 'rag',
      confidence: similarContent.length > 2 ? 'high' : 'medium',
      matchCount: similarContent.length
    })

  } catch (error) {
    console.error('Error in ask-sunith API:', error)
    
    // Log error with performance data
    const duration = Date.now() - startTime;
    await logError(error instanceof Error ? error : String(error), { 
      endpoint: '/api/ask-sunith',
      duration,
      action: 'generate_response'
    }, request);
    await logPerformance('/api/ask-sunith', duration, false);
    
    // Return fallback response on error
    const fallbackResponse = getFallbackResponse('')
    
    return NextResponse.json({ 
      response: fallbackResponse,
      source: 'error_fallback',
      confidence: 'low'
    })
  }
});

// Fallback responses for when RAG system is unavailable
function getFallbackResponse(question: string): string {
  const q = question.toLowerCase()
  
  if (q.includes('altitude') || q.includes('acclimat')) {
    return "From my Seven Summits experience: Start training at altitude early if possible. I spend weeks acclimatizing - key is gradual ascent. Sleep low, climb high during the day. Watch for headaches, nausea, fatigue. Diamox helps but isn't magic. Listen to your body - summit attempts can wait, but brain swelling can't."
  }
  
  if (q.includes('gear') || q.includes('equipment')) {
    return "Essential gear I've learned through 4 summits: Quality boots (broken in!), layering system, reliable headlamp + backup, emergency shelter. Don't go cheap on life-critical items. Test everything multiple times before expeditions. My Elbrus summit taught me redundancy saves lives."
  }
  
  if (q.includes('fear') || q.includes('mental') || q.includes('scared')) {
    return "Fear kept me alive on Kilimanjaro and Aconcagua. It's data, not weakness. I use 3 techniques: 1) Visualize success AND failure scenarios, 2) Focus on next immediate step, not summit, 3) Remember my 40kg hospital bed start - every step up is victory. Fear means you're pushing limits."
  }
  
  if (q.includes('training') || q.includes('workout') || q.includes('fitness')) {
    return "My training evolved from TB recovery to Seven Summits ready: 6 days/week minimum. Mix cardio endurance, strength (legs + core), loaded carries. Train tired - mountains don't care if you slept badly. I run ultras to build mental toughness, not just cardio. Consistency beats intensity."
  }
  
  // Default response
  return `Great question! Based on my 11-year journey from TB recovery to 4/7 summits: Every mountain teaches something new. My experience on ${['Elbrus', 'Kilimanjaro', 'Aconcagua', 'McKinley'][Math.floor(Math.random() * 4)]} showed me that preparation and mindset matter more than raw strength. What specific aspect would you like me to dive deeper into?`
}

// Simple context-based response when Ollama unavailable
function generateContextResponse(question: string, context: string[]): string {
  if (context.length === 0) {
    return getFallbackResponse(question)
  }
  
  // Extract the most relevant piece of context
  const relevantContext = context[0].replace(/^\[.*?\]\s*/, '').replace(/\s*\(Source:.*?\)$/, '')
  
  return `Based on my experience: ${relevantContext}`
}