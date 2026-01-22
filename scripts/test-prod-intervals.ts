import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testProductionFlow() {
  console.log('🔍 Testing Production Data Flow...');
  console.log('Environment:', {
    API_KEY_SET: !!process.env.INTERVALS_ICU_API_KEY,
    ATHLETE_ID: process.env.INTERVALS_ICU_ATHLETE_ID,
  });

  // Dynamic import to ensure env is loaded
  const { getUnifiedWorkouts } = await import(
    '../lib/training/unified-workouts'
  );
  const { IntervalsService } = await import('../lib/services/intervals');

  // 1. Test Service Direct
  console.log('\n1. Testing IntervalsService.getActivities()...');
  try {
    const activities = await IntervalsService.getActivities(5);
    console.log(`✅ Fetched ${activities.length} activities directly.`);
    if (activities.length > 0) {
      console.log('Sample:', JSON.stringify(activities[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Service Error:', error);
  }

  // 2. Test Unified Fetcher
  console.log('\n2. Testing getUnifiedWorkouts()...');
  try {
    const unified = await getUnifiedWorkouts({ limit: 5 });
    console.log(`✅ Fetched ${unified.length} unified workouts.`);
    if (unified.length > 0) {
      console.log('Sample:', JSON.stringify(unified[0], null, 2));
    } else {
      console.warn(
        '⚠️ No workouts returned. Check date range or API response.'
      );
    }
  } catch (error) {
    console.error('❌ Unified Error:', error);
  }
}

testProductionFlow();
