import {
  getAiKnowledgeBaseStats,
  ingestAiKnowledgeBaseContent,
  initializeAiKnowledgeBase,
  testAiConnection,
} from '@/modules/ai/infrastructure/knowledge-base-runtime';

interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

let statusCache: Record<string, unknown> | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30000;

function response(status: number, body: Record<string, unknown>): ApiResponse {
  return { status, body };
}

export async function getAiSystemStatusResponse(): Promise<ApiResponse> {
  const now = Date.now();

  if (statusCache && now - lastCacheTime < CACHE_DURATION) {
    return response(200, statusCache);
  }

  const aiConnected = await testAiConnection();
  const knowledgeBase = getAiKnowledgeBaseStats();

  const result = {
    status: 'operational',
    provider: 'replicate',
    ai: {
      connected: aiConnected,
      model: 'command-r',
    },
    knowledgeBase,
    capabilities: {
      semanticSearch: aiConnected,
      ragResponses: aiConnected && Number(knowledgeBase.totalDocuments || 0) > 0,
      directAI: aiConnected,
    },
    timestamp: new Date().toISOString(),
  };

  statusCache = result;
  lastCacheTime = now;

  return response(200, result);
}

export async function handleAiStatusActionResponse(payload: unknown): Promise<ApiResponse> {
  const action =
    typeof payload === 'object' && payload !== null && 'action' in payload
      ? String(payload.action)
      : '';

  if (action !== 'initialize') {
    return response(400, {
      error: 'Invalid action. Supported actions: initialize',
    });
  }

  const stats = await initializeAiKnowledgeBase();

  return response(200, {
    message: 'Knowledge base initialized successfully',
    stats,
    timestamp: new Date().toISOString(),
  });
}

export async function initializeAiSystemResponse(): Promise<ApiResponse> {
  const isAiAvailable = await testAiConnection();

  if (!isAiAvailable) {
    return response(503, {
      error: 'Replicate AI is not available. Please check API key.',
    });
  }

  const stats = await initializeAiKnowledgeBase();

  return response(200, {
    status: 'initialized',
    message: 'Knowledge base initialized successfully',
    stats,
    aiStatus: 'connected',
  });
}

export async function getAiInitializationStatusResponse(): Promise<ApiResponse> {
  const stats = getAiKnowledgeBaseStats();
  const isAiAvailable = await testAiConnection();

  return response(200, {
    status: Number(stats.totalDocuments || 0) > 0 ? 'ready' : 'not_initialized',
    stats,
    aiStatus: isAiAvailable ? 'connected' : 'disconnected',
  });
}

export async function handleAiIngestResponse(action: string | null | undefined): Promise<ApiResponse> {
  switch (action ?? 'ingest') {
    case 'ingest': {
      const result = await ingestAiKnowledgeBaseContent();
      return response(200, {
        success: result.success,
        data: {
          documentsProcessed: result.documentsProcessed,
          documentsAdded: result.documentsAdded,
          categories: result.categories,
          errors: result.errors,
        },
        message: result.success
          ? `Successfully ingested ${result.documentsAdded} documents`
          : `Ingestion completed with ${result.errors.length} errors`,
      });
    }

    case 'stats': {
      return response(200, {
        success: true,
        data: getAiKnowledgeBaseStats(),
        message: 'Knowledge base statistics retrieved',
      });
    }

    default:
      return response(400, {
        success: false,
        error: 'Invalid action specified',
      });
  }
}

export function getAiIngestOverviewResponse(): ApiResponse {
  const stats = getAiKnowledgeBaseStats();

  return response(200, {
    success: true,
    data: {
      knowledgeBase: stats,
      capabilities: {
        contentIngestion: true,
        semanticSearch: true,
        ragResponses: true,
        trainingInsights: true,
      },
      status: 'ready',
    },
    message: 'AI system status and knowledge base stats',
  });
}
