import { NextRequest, NextResponse } from 'next/server';
import { ingestContentToKnowledgeBase } from '../../../../lib/rag/content-ingestion';
import { getKnowledgeBaseStats } from '../../../../lib/rag/training-knowledge-base';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'ingest';

    switch (action) {
      case 'ingest':
        console.log('Starting content ingestion to knowledge base...');
        const result = await ingestContentToKnowledgeBase();

        return NextResponse.json({
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

      case 'stats':
        const stats = getKnowledgeBaseStats();
        return NextResponse.json({
          success: true,
          data: stats,
          message: 'Knowledge base statistics retrieved',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Content ingestion API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform content ingestion',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = getKnowledgeBaseStats();

    return NextResponse.json({
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
  } catch (error) {
    console.error('AI system status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get AI system status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
