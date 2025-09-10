import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import TrainingDatabase from '@/lib/training/database';

export const GET = protectionPresets.adminEndpoint(async (request: ProtectedRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    if (planId) {
      // Get specific plan details
      const planDetails = await TrainingDatabase.getTrainingPlanDetails(planId);
      return NextResponse.json(planDetails);
    } else {
      // Get all plans
      const plans = await TrainingDatabase.getTrainingPlans();
      return NextResponse.json({ plans });
    }

  } catch (error: any) {
    console.error('Training plans fetch error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch training plans' 
    }, { status: 500 });
  }
});