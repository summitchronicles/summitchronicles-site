#!/usr/bin/env node

/**
 * Script to exchange Strava authorization code for access token
 * Usage: node exchange-strava-code.js YOUR_AUTHORIZATION_CODE
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const authCode = process.argv[2];
if (!authCode) {
  console.error('❌ Please provide authorization code');
  console.log('Usage: node exchange-strava-code.js YOUR_AUTHORIZATION_CODE');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;
const athleteId = process.env.STRAVA_ATHLETE_ID;

const supabase = createClient(supabaseUrl, supabaseKey);

async function exchangeCodeForToken(code) {
  console.log('🔄 Exchanging authorization code for access token...');

  const postData = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code'
  });

  const options = {
    hostname: 'www.strava.com',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`Strava API error: ${response.message || data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function storeTokenInDatabase(tokenData) {
  console.log('💾 Storing token in Supabase...');

  const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
  
  const { error } = await supabase
    .from('strava_tokens')
    .upsert({
      athlete_id: athleteId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt.toISOString(),
      scope: tokenData.scope,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'athlete_id'
    });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  console.log('✅ Token stored successfully!');
  console.log(`🕒 Token expires: ${expiresAt.toLocaleString()}`);
  console.log(`🏃‍♂️ Athlete ID: ${athleteId}`);
  console.log(`🔐 Scope: ${tokenData.scope}`);
}

async function testToken(accessToken) {
  console.log('\n🧪 Testing token with Strava API...');

  const options = {
    hostname: 'www.strava.com',
    port: 443,
    path: '/api/v3/athlete',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const athlete = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`✅ Token works! Connected to: ${athlete.firstname} ${athlete.lastname}`);
            console.log(`🏃‍♂️ Activities: ${athlete.activity_count || 'N/A'}`);
            resolve(athlete);
          } else {
            reject(new Error(`API test failed: ${data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse athlete data: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function main() {
  try {
    console.log('🏃‍♂️ Summit Chronicles - Strava Token Exchange\n');

    // Exchange code for token
    const tokenData = await exchangeCodeForToken(authCode);
    
    // Store in database
    await storeTokenInDatabase(tokenData);
    
    // Test the token
    await testToken(tokenData.access_token);

    console.log('\n🎉 Setup complete! Your training analytics will now show real Strava data.');
    console.log('🔗 Visit: http://localhost:3001/training-analytics');
    console.log('\n💡 The token will be automatically refreshed when it expires.');
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Make sure you used the authorization code from the redirect URL');
    console.log('2. Check that the code hasn\'t expired (use it quickly)');
    console.log('3. Verify your Supabase connection is working');
    process.exit(1);
  }
}

main();