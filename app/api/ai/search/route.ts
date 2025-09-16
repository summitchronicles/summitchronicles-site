import { NextRequest, NextResponse } from 'next/server'
import { searchKnowledgeBase, generateRAGResponse } from '@/lib/rag/training-knowledge-base'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5, threshold = 0.7 } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      )
    }

    const results = await searchKnowledgeBase(query, limit, threshold)

    return NextResponse.json({
      query,
      results: results.map(result => ({
        document: {
          id: result.document.id,
          title: result.document.title,
          content: result.document.content.substring(0, 500) + '...', // Truncate for API response
          category: result.document.category,
          source: result.document.source,
          metadata: result.document.metadata
        },
        similarity: result.similarity,
        relevanceScore: result.relevanceScore
      })),
      totalResults: results.length
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '5')
    const threshold = parseFloat(searchParams.get('threshold') || '0.7')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const results = await searchKnowledgeBase(query, limit, threshold)

    return NextResponse.json({
      query,
      results: results.map(result => ({
        document: {
          id: result.document.id,
          title: result.document.title,
          content: result.document.content.substring(0, 500) + '...', // Truncate for API response
          category: result.document.category,
          source: result.document.source,
          metadata: result.document.metadata
        },
        similarity: result.similarity,
        relevanceScore: result.relevanceScore
      })),
      totalResults: results.length
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}