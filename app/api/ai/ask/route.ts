import { NextRequest, NextResponse } from 'next/server'
import { generateRAGResponse } from '@/lib/rag/training-knowledge-base'
import { askTrainingQuestion } from '@/lib/integrations/ollama'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { question, useRAG = true, context } = await request.json()

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question parameter is required and must be a string' },
        { status: 400 }
      )
    }

    let response

    if (useRAG) {
      // Use RAG system for knowledge-based responses
      response = await generateRAGResponse(question)
      
      return NextResponse.json({
        question,
        answer: response.answer,
        sources: response.sources.map(source => ({
          title: source.document.title,
          category: source.document.category,
          similarity: source.similarity,
          relevanceScore: source.relevanceScore
        })),
        contextUsed: response.context_used,
        confidence: response.confidence,
        method: 'RAG'
      })
    } else {
      // Use direct AI assistant for general questions
      const answer = await askTrainingQuestion(question, context)
      
      return NextResponse.json({
        question,
        answer,
        sources: [],
        contextUsed: context ? [context] : [],
        confidence: 0.8,
        method: 'Direct AI'
      })
    }
  } catch (error) {
    console.error('Ask AI API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const question = searchParams.get('q')
    const useRAG = searchParams.get('rag') !== 'false'
    const context = searchParams.get('context')

    if (!question) {
      return NextResponse.json(
        { error: 'Question parameter "q" is required' },
        { status: 400 }
      )
    }

    let response

    if (useRAG) {
      response = await generateRAGResponse(question)
      
      return NextResponse.json({
        question,
        answer: response.answer,
        sources: response.sources.map(source => ({
          title: source.document.title,
          category: source.document.category,
          similarity: source.similarity,
          relevanceScore: source.relevanceScore
        })),
        contextUsed: response.context_used,
        confidence: response.confidence,
        method: 'RAG'
      })
    } else {
      const answer = await askTrainingQuestion(question, context || undefined)
      
      return NextResponse.json({
        question,
        answer,
        sources: [],
        contextUsed: context ? [context] : [],
        confidence: 0.8,
        method: 'Direct AI'
      })
    }
  } catch (error) {
    console.error('Ask AI API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}