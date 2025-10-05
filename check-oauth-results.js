(async () => {
  console.log('🔍 CHECKING OAUTH RESULTS...\n');

  try {
    // Test the training metrics API
    console.log('1. Testing training metrics API...');
    const response = await fetch('https://www.summitchronicles.com/api/training/metrics');

    if (response.ok) {
      const data = await response.json();
      console.log(`📊 DATA SOURCE: ${data.source}`);
      console.log(`📈 TOTAL ACTIVITIES: ${data.totalActivities}`);
      console.log(`💓 RESTING HR: ${data.metrics?.currentStats?.currentRestingHR?.value}`);
      console.log(`⛰️  ELEVATION THIS YEAR: ${data.metrics?.currentStats?.totalElevationThisYear?.value}`);

      if (data.debug) {
        console.log(`\n🔬 DEBUG INFO:`);
        console.log(`   First activity ID: ${data.debug.firstActivityId}`);
        console.log(`   Is real Strava: ${data.debug.isRealStrava}`);
      }

      console.log(`\n📋 LAST UPDATED: ${data.lastUpdated}`);

    } else {
      console.log(`❌ Metrics API failed: ${response.status}`);
    }

    // Test the Strava activities API
    console.log('\n2. Testing Strava activities API...');
    const activitiesResponse = await fetch('https://www.summitchronicles.com/api/strava/activities');

    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`📊 ACTIVITIES SOURCE: ${activitiesData.source || 'unknown'}`);
      console.log(`📈 ACTIVITIES COUNT: ${activitiesData.activities?.length || 0}`);

      if (activitiesData.activities && activitiesData.activities.length > 0) {
        const firstActivity = activitiesData.activities[0];
        console.log(`\n🏃 FIRST ACTIVITY:`);
        console.log(`   ID: ${firstActivity.id}`);
        console.log(`   Name: ${firstActivity.name}`);
        console.log(`   Type: ${firstActivity.type}`);
        console.log(`   Date: ${firstActivity.start_date || firstActivity.date}`);
        console.log(`   Distance: ${firstActivity.distance}m`);
        console.log(`   Elevation: ${firstActivity.total_elevation_gain}m`);
      }
    } else {
      console.log(`❌ Activities API failed: ${activitiesResponse.status}`);
    }

    // Final determination
    console.log('\n' + '='.repeat(50));
    console.log('📋 FINAL OAUTH STATUS');
    console.log('='.repeat(50));

    const metricsResponse = await fetch('https://www.summitchronicles.com/api/training/metrics');
    if (metricsResponse.ok) {
      const data = await metricsResponse.json();

      if (data.source === 'strava' && data.debug?.isRealStrava) {
        console.log('🎉 SUCCESS! OAUTH WORKED - REAL STRAVA DATA IS BEING USED');
        console.log('✅ The training page should now show your actual fitness data');
      } else if (data.source === 'mock') {
        console.log('💀 FAILED! STILL USING MOCK DATA');
        console.log('❌ OAuth callback did not successfully store tokens');
        console.log('\nPossible issues:');
        console.log('- Supabase connection failed during token storage');
        console.log('- Token exchange with Strava failed');
        console.log('- Environment variables not properly configured');
      } else {
        console.log('❓ UNKNOWN STATE - Check the data source value above');
      }
    }

  } catch (error) {
    console.error('❌ Error checking OAuth results:', error);
  }
})();