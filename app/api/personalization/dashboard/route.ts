import { NextRequest, NextResponse } from 'next/server';
import {
  generatePersonalizedDashboard,
  getSamplePersonalizedDashboard,
} from '@/modules/personalization/application/personalized-dashboard-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, activities = [], timeframe = 'current' } = body;

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'User profile is required' },
        { status: 400 }
      );
    }

    const personalizedContent = await generatePersonalizedDashboard({
      profile,
      activities,
      timeframe,
    });

    return NextResponse.json({
      success: true,
      content: personalizedContent,
      meta: {
        generatedAt: new Date().toISOString(),
        profileLevel: profile.level,
        activitiesAnalyzed: activities.length,
      },
    });
  } catch (error) {
    console.error('Personalization dashboard error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate personalized dashboard',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(getSamplePersonalizedDashboard());
}
