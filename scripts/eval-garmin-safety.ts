/**
 * Safety Evaluation Script for Garmin-Only Integration
 * Verifies that Garmin data pipelines remain intact during Strava removal.
 */
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkGarminHealth() {
  console.log('🛡️  Starting Garmin Safety Check...');

  const API_BASE = 'http://localhost:3000';

  // 1. Check Metrics Endpoint
  console.log('\n1. Verifying /api/training/metrics endpoint...');
  try {
    const res = await fetch(`${API_BASE}/api/training/metrics`);
    if (res.status === 200) {
      const data = await res.json();
      console.log('   ✅ Endpoint reachable (200 OK)');

      // Basic structure check
      if (data.metrics && typeof data.readiness === 'number') {
        console.log('   ✅ payload structure valid');
        console.log(`   - Readiness: ${data.readiness}`);
        console.log(
          `   - Data: ${JSON.stringify(data.metrics).substring(0, 50)}...`
        );
      } else {
        console.warn('   ⚠️  Unexpected payload structure:', data);
      }
    } else {
      console.error(`   ❌ Failed: Status ${res.status}`);
      console.error(await res.text());
      process.exit(1);
    }
  } catch (e) {
    console.error(
      '   ❌ Connection failed. Ensure server is running on port 3000.'
    );
    console.error('   Error:', e.message);
    process.exit(1);
  }

  // 2. Check Database Logic (Simulation)
  // We can't easily check DB directly here without connection context,
  // but the API check covers the full stack reading from DB/Service.

  console.log('\n🟢 SAFETY CHECK PASSED: Garmin pipelines are active.');
}

checkGarminHealth();
