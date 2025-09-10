import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import { TrainingRAG } from '@/lib/training-rag';

export const GET = protectionPresets.adminEndpoint(async (request: ProtectedRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const action = searchParams.get('action') || 'insights';

    if (!startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Start and end dates are required' 
      }, { status: 400 });
    }

    switch (action) {
      case 'insights':
        // Generate training insights
        const trainingData = await TrainingRAG.extractTrainingData(startDate, endDate);
        const insights = await TrainingRAG.generateTrainingInsights(trainingData);
        
        return NextResponse.json({ 
          success: true,
          insights,
          dataPoints: trainingData.length,
          period: { startDate, endDate }
        });

      case 'embeddings':
        // Generate and store embeddings for training data
        const data = await TrainingRAG.extractTrainingData(startDate, endDate);
        await TrainingRAG.generateTrainingEmbeddings(data);
        
        return NextResponse.json({ 
          success: true,
          message: `Generated embeddings for ${data.length} training sessions`,
          dataPoints: data.length
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: insights or embeddings' 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Training insights error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate training insights' 
    }, { status: 500 });
  }
});

export const POST = protectionPresets.adminEndpoint(async (request: ProtectedRequest) => {
  try {
    const body = await request.json();
    const { action, dateRange } = body;

    switch (action) {
      case 'update_knowledge_base':
        // Update knowledge base with recent training data
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - (dateRange || 30) * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        
        const trainingData = await TrainingRAG.extractTrainingData(startDate, endDate);
        await TrainingRAG.generateTrainingEmbeddings(trainingData);
        
        return NextResponse.json({ 
          success: true,
          message: `Updated knowledge base with ${trainingData.length} training sessions`,
          period: { startDate, endDate }
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Training insights POST error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process training insights request' 
    }, { status: 500 });
  }
});