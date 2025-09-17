import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import TrainingDatabase from '@/lib/training/database';

export const GET = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const startDate = searchParams.get('start');
      const endDate = searchParams.get('end');

      if (!startDate || !endDate) {
        return NextResponse.json(
          {
            error: 'Start and end dates are required',
          },
          { status: 400 }
        );
      }

      const progressData = await TrainingDatabase.getTrainingProgress(
        startDate,
        endDate
      );

      return NextResponse.json(progressData);
    } catch (error: any) {
      console.error('Training progress fetch error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to fetch training progress data',
        },
        { status: 500 }
      );
    }
  }
);
