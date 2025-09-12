import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import { MultiUserDatabase } from '@/lib/multi-user/database';
import { AdvancedPeriodization } from '@/lib/periodization/advanced-analytics';

export const GET = protectionPresets.apiEndpoint(async (request: ProtectedRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.user.id;
    const action = searchParams.get('action');
    const planId = searchParams.get('planId');

    switch (action) {
      case 'list':
        const plans = await MultiUserDatabase.getPeriodizationPlans({ user_id: userId });
        return NextResponse.json({ plans });

      case 'current':
        const activePlans = await MultiUserDatabase.getPeriodizationPlans({ 
          user_id: userId,
          status: 'active'
        });
        const currentPlan = activePlans[0] || null;
        
        if (currentPlan) {
          const analytics = new AdvancedPeriodization();
          const currentPhase = await analytics.getCurrentPhase(currentPlan);
          const loadMetrics = await analytics.calculateCurrentLoadMetrics(userId, currentPlan.id);
          
          return NextResponse.json({
            plan: currentPlan,
            currentPhase,
            loadMetrics
          });
        }
        
        return NextResponse.json({ plan: null });

      case 'analytics':
        if (!planId) {
          return NextResponse.json({ error: 'planId is required' }, { status: 400 });
        }
        
        const analytics = new AdvancedPeriodization();
        const [peakPrediction, loadProgression, riskAssessment] = await Promise.all([
          analytics.predictPeakPerformance(userId, planId),
          analytics.analyzeLoadProgression(userId, planId),
          analytics.assessInjuryRisk(userId)
        ]);
        
        return NextResponse.json({
          peakPrediction,
          loadProgression,
          riskAssessment
        });

      case 'recommendations':
        const recommendationAnalytics = new AdvancedPeriodization();
        const recommendations = await recommendationAnalytics.generateTrainingRecommendations(userId);
        
        return NextResponse.json({ recommendations });

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: list, current, analytics, or recommendations' 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Periodization GET error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch periodization data' 
    }, { status: 500 });
  }
});

export const POST = protectionPresets.apiEndpoint(async (request: ProtectedRequest) => {
  try {
    const body = await request.json();
    const userId = request.user.id;
    const { action } = body;

    const analytics = new AdvancedPeriodization();

    switch (action) {
      case 'create_plan':
        const { target_summit, target_date, base_fitness_level, available_hours_per_week } = body;
        
        const optimizedPlan = await analytics.generateOptimizedPlan({
          user_id: userId,
          target_summit,
          target_date,
          base_fitness_level,
          available_hours_per_week
        });
        
        const createdPlan = await MultiUserDatabase.createPeriodizationPlan(optimizedPlan);
        
        return NextResponse.json({ 
          success: true, 
          plan: createdPlan,
          message: 'Optimized periodization plan created successfully' 
        });

      case 'update_plan':
        const { plan_id, updates } = body;
        
        // Validate that user owns the plan
        const existingPlan = await MultiUserDatabase.getPeriodizationPlans({ 
          id: plan_id,
          user_id: userId 
        });
        
        if (!existingPlan.length) {
          return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }
        
        const updatedPlan = await MultiUserDatabase.updatePeriodizationPlan(plan_id, updates);
        
        return NextResponse.json({ 
          success: true, 
          plan: updatedPlan 
        });

      case 'optimize_current':
        // Re-optimize current plan based on recent performance
        const currentPlans = await MultiUserDatabase.getPeriodizationPlans({
          user_id: userId,
          status: 'active'
        });
        
        if (!currentPlans.length) {
          return NextResponse.json({ error: 'No active plan found' }, { status: 404 });
        }
        
        const currentPlan = currentPlans[0];
        const reOptimizedPlan = await analytics.reOptimizePlan(userId, currentPlan.id);
        
        return NextResponse.json({
          success: true,
          plan: reOptimizedPlan,
          message: 'Plan re-optimized based on current performance data'
        });

      case 'record_performance':
        const { benchmark_data } = body;
        
        const benchmark = await MultiUserDatabase.recordPerformanceBenchmark({
          user_id: userId,
          ...benchmark_data
        });
        
        // Trigger plan optimization if significant performance change
        const shouldReOptimize = await analytics.shouldTriggerReOptimization(userId, benchmark);
        
        return NextResponse.json({
          success: true,
          benchmark,
          shouldReOptimize,
          message: 'Performance benchmark recorded'
        });

      case 'adjust_load':
        const { adjustment_type, adjustment_value, reason } = body;
        
        const loadAdjustment = await analytics.adjustTrainingLoad(
          userId, 
          adjustment_type, 
          adjustment_value, 
          reason
        );
        
        return NextResponse.json({
          success: true,
          adjustment: loadAdjustment,
          message: 'Training load adjusted successfully'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Periodization POST error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process periodization request' 
    }, { status: 500 });
  }
});