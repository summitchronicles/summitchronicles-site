import { NextRequest, NextResponse } from 'next/server';
import { ComplianceEngine } from '../../../../lib/compliance-engine';
import { TrainingActivity } from '../../training/upload/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'month'; // week, month, quarter, year
    const includeAlerts = searchParams.get('alerts') === 'true';
    const includeTrends = searchParams.get('trends') === 'true';

    // In a real application, you would fetch this from a database
    // For now, we'll return mock data with the structure
    const mockActivities: TrainingActivity[] = [
      {
        id: '1',
        title: 'Morning Strength Training',
        type: 'strength',
        duration: 60,
        intensity: 'medium',
        exercises: [
          { name: 'Squats', sets: 3, reps: 12, rpe: '7', restTime: 90 },
          { name: 'Deadlifts', sets: 3, reps: 8, rpe: '8', restTime: 120 }
        ],
        completed: true,
        date: '2025-09-20',
        status: 'completed',
        actual: {
          duration: 58,
          heartRate: { avg: 145, max: 165 },
          calories: 420,
          completedAt: '2025-09-20T07:30:00Z'
        },
        compliance: {
          durationMatch: 97,
          intensityMatch: 95,
          distanceMatch: 100,
          overallScore: 97,
          completed: true,
          notes: ['Excellent workout completion']
        }
      },
      {
        id: '2',
        title: 'Cardio Run',
        type: 'cardio',
        duration: 45,
        intensity: 'high',
        completed: true,
        date: '2025-09-21',
        status: 'completed',
        actual: {
          duration: 42,
          heartRate: { avg: 175, max: 190 },
          calories: 380,
          completedAt: '2025-09-21T06:15:00Z'
        },
        compliance: {
          durationMatch: 93,
          intensityMatch: 100,
          distanceMatch: 100,
          overallScore: 97,
          completed: true,
          notes: ['High intensity maintained well']
        }
      },
      {
        id: '3',
        title: 'Technical Climbing',
        type: 'technical',
        duration: 90,
        intensity: 'medium',
        completed: false,
        date: '2025-09-22',
        status: 'skipped',
      },
      {
        id: '4',
        title: 'Recovery Walk',
        type: 'cardio',
        duration: 30,
        intensity: 'low',
        completed: true,
        date: '2025-09-23',
        status: 'completed',
        actual: {
          duration: 35,
          heartRate: { avg: 110, max: 125 },
          calories: 150,
          completedAt: '2025-09-23T08:00:00Z'
        },
        compliance: {
          durationMatch: 83,
          intensityMatch: 100,
          distanceMatch: 100,
          overallScore: 94,
          completed: true,
          notes: ['Slightly longer than planned, good recovery']
        }
      }
    ];

    // Filter activities based on timeframe
    const now = new Date();
    let filteredActivities = mockActivities;

    switch (timeframe) {
      case 'week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredActivities = mockActivities.filter(a => new Date(a.date) >= oneWeekAgo);
        break;
      case 'month':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredActivities = mockActivities.filter(a => new Date(a.date) >= oneMonthAgo);
        break;
      case 'quarter':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredActivities = mockActivities.filter(a => new Date(a.date) >= threeMonthsAgo);
        break;
    }

    // Calculate comprehensive compliance analysis
    const analysis = ComplianceEngine.analyzeCompliance(filteredActivities);

    // Build response based on requested data
    const response: any = {
      success: true,
      timeframe,
      dataPoints: filteredActivities.length,
      analytics: analysis.analytics,
      summary: analysis.summary
    };

    if (includeTrends) {
      response.trends = analysis.trends;
    }

    if (includeAlerts) {
      response.alerts = analysis.alerts;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Compliance analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate compliance analytics',
        code: 'ANALYTICS_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activities, action } = body;

    if (!activities || !Array.isArray(activities)) {
      return NextResponse.json(
        {
          error: 'Invalid activities data',
          code: 'INVALID_DATA',
          help: 'Provide an array of training activities'
        },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'calculate_compliance':
        // Calculate compliance for individual activities
        const complianceResults = activities.map(activity => {
          const compliance = ComplianceEngine.calculateCompliance(activity, activity);
          return {
            ...activity,
            compliance
          };
        });

        return NextResponse.json({
          success: true,
          action: 'calculate_compliance',
          activities: complianceResults,
          message: `Calculated compliance for ${complianceResults.length} activities`
        });

      case 'analyze_performance':
        // Perform comprehensive performance analysis
        const analytics = ComplianceEngine.calculatePerformanceAnalytics(activities);

        return NextResponse.json({
          success: true,
          action: 'analyze_performance',
          analytics,
          message: 'Performance analysis completed'
        });

      case 'analyze_trends':
        // Analyze trends and patterns
        const trends = ComplianceEngine.analyzeTrends(activities);

        return NextResponse.json({
          success: true,
          action: 'analyze_trends',
          trends,
          message: 'Trend analysis completed'
        });

      case 'full_analysis':
        // Complete compliance analysis
        const fullAnalysis = ComplianceEngine.analyzeCompliance(activities);

        return NextResponse.json({
          success: true,
          action: 'full_analysis',
          ...fullAnalysis,
          message: 'Full compliance analysis completed'
        });

      default:
        return NextResponse.json(
          {
            error: 'Invalid action parameter',
            code: 'INVALID_ACTION',
            validActions: ['calculate_compliance', 'analyze_performance', 'analyze_trends', 'full_analysis']
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Compliance analytics POST error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process compliance analysis request',
        code: 'PROCESSING_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}