import { NextRequest, NextResponse } from 'next/server';
import {
  getKnowledgeBaseStats,
  initializeKnowledgeBase,
} from '@/lib/rag/training-knowledge-base';
import {
  testOllamaConnection,
  getAvailableModels,
} from '@/lib/integrations/ollama';

export const dynamic = 'force-dynamic';

// Cache for 30 seconds to improve performance
let statusCache: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    // Return cached result if still valid
    if (statusCache && now - lastCacheTime < CACHE_DURATION) {
      return NextResponse.json(statusCache);
    }

    // Test Ollama connection
    const ollamaConnected = await testOllamaConnection();

    // Get available models if connected
    let availableModels: string[] = [];
    if (ollamaConnected) {
      availableModels = await getAvailableModels();
    }

    // Get knowledge base statistics
    const kbStats = getKnowledgeBaseStats();

    const result = {
      status: 'operational',
      ollama: {
        connected: ollamaConnected,
        availableModels,
      },
      knowledgeBase: kbStats,
      capabilities: {
        semanticSearch: ollamaConnected,
        ragResponses: ollamaConnected && kbStats.totalDocuments > 0,
        directAI: ollamaConnected,
      },
      timestamp: new Date().toISOString(),
    };

    // Cache the result
    statusCache = result;
    lastCacheTime = now;

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Status API error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to check AI system status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'initialize') {
      // Initialize the knowledge base
      await initializeKnowledgeBase();

      const kbStats = getKnowledgeBaseStats();

      return NextResponse.json({
        message: 'Knowledge base initialized successfully',
        stats: kbStats,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Supported actions: initialize' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('AI Status API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform requested action' },
      { status: 500 }
    );
  }
}
