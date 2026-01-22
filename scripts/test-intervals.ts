import dotenv from 'dotenv';
import { format } from 'date-fns';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.INTERVALS_ICU_API_KEY;
let ATHLETE_ID = process.env.INTERVALS_ICU_ATHLETE_ID;
const BASE_URL = 'https://intervals.icu/api/v1';

async function testIntervals() {
  console.log('--- Intervals.icu Connection Test (Smart Mode) ---');
  console.log(`Configured ID: ${ATHLETE_ID}`);
  console.log(`API Key: ${API_KEY ? 'Present' : 'MISSING'}`);

  if (!API_KEY) {
    console.error('❌ Credentials missing in .env.local');
    return;
  }

  const authString = Buffer.from(`${API_KEY}:`).toString('base64');
  const headers = {
    Authorization: `Basic ${authString}`,
    'Content-Type': 'application/json',
  };

  // 0. Auto-Discover ID if possible (GET /athlete usually returns the current user's profile)
  try {
    console.log('\n0. Attempting to discover correct Athlete ID...');
    // Try fetching "myself" via the ID-less endpoint if it exists, or just checking permissions
    // Note: Intervals API sometimes uses /athlete/{id}/...
    // Let's try checking permissions by fetching the configured ID first.
  } catch (e) {}

  // 1. Fetch Profile (Basic Auth Check)
  try {
    console.log(`\n1. Testing Auth & Profile for ${ATHLETE_ID}...`);
    const profileRes = await fetch(`${BASE_URL}/athlete/${ATHLETE_ID}`, {
      headers,
    });

    if (profileRes.ok) {
      console.log('✅ Auth success! Connected to athlete.');
      const profile = await profileRes.json();
      console.log(`   Name: ${profile.name}`);
    } else {
      console.error(
        `❌ Auth failed: ${profileRes.status} ${profileRes.statusText}`
      );
      const text = await profileRes.text();
      console.error('   Body:', text);

      if (profileRes.status === 403) {
        console.log('\n⚠️ 403 Forbidden suggests Key/ID mismatch.');
        console.log("   Trying to fetch 'me' (ID: 0) to find real ID...");
        // Try ID 0 or current
        const meRes = await fetch(`${BASE_URL}/athlete/0`, { headers }); // Some APIs use 0 for self
        if (meRes.ok) {
          const me = await meRes.json();
          console.log(`   ✅ FOUND IT! Your real Athlete ID is: ${me.id}`);
        } else {
          // Try extracting from settings URL if possible? No.
          console.log('   ❌ Could not auto-discover ID.');
        }
      }
      return;
    }
  } catch (e) {
    console.error('Network error during profile fetch:', e);
    return;
  }

  // 2. Fetch Activities (Wide Net)
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const past = format(
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    );

    console.log(`\n2. Fetching Activities from ${past} to ${today}...`);
    const url = `${BASE_URL}/athlete/${ATHLETE_ID}/activities?oldest=${past}&newest=${today}`;

    const actRes = await fetch(url, { headers });
    if (!actRes.ok) {
      console.error(`❌ Activity fetch failed: ${actRes.status}`);
      return;
    }

    const activities = await actRes.json();
    console.log(`📊 Activities found: ${activities.length}`);

    if (activities.length > 0) {
      console.log('Latest Activity:');
      console.log(`- Name: ${activities[0].name}`);
      console.log(`- Date: ${activities[0].start_date_local}`);
      console.log(`- Description: ${activities[0].description}`);
    } else {
      console.warn(
        '⚠️ No activities found in the last year. Is the date range correct?'
      );
    }
  } catch (e) {
    console.error('Activity fetch error:', e);
  }
}

testIntervals();
