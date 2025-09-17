import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import TrainingDatabase from '@/lib/training/database';

export const GET = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const date =
        searchParams.get('date') || new Date().toISOString().split('T')[0];

      const workout = await TrainingDatabase.getTodaysWorkout(date);

      return NextResponse.json({ workout });
    } catch (error: any) {
      console.error('Workout fetch error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to fetch workout',
        },
        { status: 500 }
      );
    }
  }
);

export const POST = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const body = await request.json();
      const { action, exerciseId, setData, notes } = body;

      if (action === 'logSet') {
        if (!exerciseId || !setData) {
          return NextResponse.json(
            { error: 'Missing exerciseId or setData' },
            { status: 400 }
          );
        }

        const result = await TrainingDatabase.logActualSet(exerciseId, setData);
        return NextResponse.json({ success: true, set: result });
      } else if (action === 'completeExercise') {
        if (!exerciseId) {
          return NextResponse.json(
            { error: 'Missing exerciseId' },
            { status: 400 }
          );
        }

        const result = await TrainingDatabase.markExerciseCompleted(
          exerciseId,
          notes
        );
        return NextResponse.json({ success: true, exercise: result });
      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    } catch (error: any) {
      console.error('Workout update error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to update workout',
        },
        { status: 500 }
      );
    }
  }
);
