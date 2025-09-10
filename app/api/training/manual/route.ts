import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import TrainingDatabase from '@/lib/training/database';

export const GET = protectionPresets.adminEndpoint(async (request: ProtectedRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const entries = await TrainingDatabase.getManualTrainingData(date);
    
    return NextResponse.json({ entries });

  } catch (error: any) {
    console.error('Manual training data fetch error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch manual training data' 
    }, { status: 500 });
  }
});

export const POST = protectionPresets.adminEndpoint(async (request: ProtectedRequest) => {
  try {
    const body = await request.json();
    const {
      date,
      activity_type,
      duration_minutes,
      distance_km,
      elevation_gain_m,
      backpack_weight_kg,
      perceived_effort,
      notes,
      location
    } = body;

    if (!date || !activity_type) {
      return NextResponse.json({ 
        error: 'Date and activity_type are required' 
      }, { status: 400 });
    }

    const entry = await TrainingDatabase.saveManualTrainingData({
      date,
      activity_type,
      duration_minutes,
      distance_km,
      elevation_gain_m,
      backpack_weight_kg,
      perceived_effort,
      notes: notes?.trim() || null,
      location: location?.trim() || null
    });

    return NextResponse.json({ success: true, entry });

  } catch (error: any) {
    console.error('Manual training data save error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to save manual training data' 
    }, { status: 500 });
  }
});