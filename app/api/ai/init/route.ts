import { NextResponse } from 'next/server';
import {
  initializeKnowledgeBase,
  getKnowledgeBaseStats,
} from '@/lib/rag/training-knowledge-base';
import { testConnection } from '@/lib/integrations/cohere';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Test Cohere connection first
    const isAiAvailable = await testConnection();
    if (!isAiAvailable) {
      return NextResponse.json(
        { error: 'Cohere AI is not available. Please check API key.' },
        { status: 503 }
      );
    }

    // Initialize knowledge base
    await initializeKnowledgeBase();
    const stats = getKnowledgeBaseStats();

    return NextResponse.json({
      status: 'initialized',
      message: 'Knowledge base initialized successfully',
      stats,
      aiStatus: 'connected',
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize knowledge base' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = getKnowledgeBaseStats();
    const isAiAvailable = await testConnection();

    return NextResponse.json({
      status: stats.totalDocuments > 0 ? 'ready' : 'not_initialized',
      stats,
      aiStatus: isAiAvailable ? 'connected' : 'disconnected',
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check system status' },
      { status: 500 }
    );
  }
}
