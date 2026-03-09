import { NextResponse } from 'next/server';
import { getTrainingDashboardResponse } from '@/modules/training/application/get-training-dashboard';

export async function GET() {
  try {
    const summary = await getTrainingDashboardResponse();
    const insights = summary.summary.missionLogs;

    if (insights.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No insights generated yet',
      });
    }

    return NextResponse.json({
      success: true,
      insights,
      missionLogs: insights,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load insights' },
      { status: 500 }
    );
  }
}
