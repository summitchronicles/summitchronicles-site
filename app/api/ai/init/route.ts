import { NextResponse } from 'next/server';
import {
  initializeKnowledgeBase,
  getKnowledgeBaseStats,
} from '@/lib/rag/training-knowledge-base';
import { testOllamaConnection } from '@/lib/integrations/ollama';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Test Ollama connection first
    const isOllamaAvailable = await testOllamaConnection();
    if (!isOllamaAvailable) {
      return NextResponse.json(
        { error: 'Ollama is not available. Please ensure Ollama is running.' },
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
      ollamaStatus: 'connected',
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
    const isOllamaAvailable = await testOllamaConnection();

    return NextResponse.json({
      status: stats.totalDocuments > 0 ? 'ready' : 'not_initialized',
      stats,
      ollamaStatus: isOllamaAvailable ? 'connected' : 'disconnected',
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check system status' },
      { status: 500 }
    );
  }
}
