import { NextRequest, NextResponse } from 'next/server';
import { getStravaAccessToken } from '@/lib/strava';
import { logError, logInfo, logPerformance, logCritical } from '@/lib/error-monitor';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Verify this is a legitimate cron job or internal call
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'default-secret';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    await logError('Unauthorized access to token refresh endpoint', { 
      endpoint: '/api/strava/refresh-tokens',
      authHeader: authHeader ? 'present' : 'missing'
    }, request);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Starting automated token refresh...');
    await logInfo('Automated Strava token refresh started', { source: 'cron_job' });
    
    // This will automatically refresh tokens if they're expired
    const token = await getStravaAccessToken();
    
    // Test the token with a simple API call
    const testResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (testResponse.ok) {
      const athlete = await testResponse.json();
      const duration = Date.now() - startTime;
      
      // Log successful token refresh
      await logPerformance('/api/strava/refresh-tokens', duration, true);
      await logInfo('Strava token refresh completed successfully', { 
        athlete_id: athlete.id,
        athlete_name: `${athlete.firstname} ${athlete.lastname}`,
        duration
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Token refreshed and validated successfully',
        athlete_id: athlete.id,
        athlete_name: `${athlete.firstname} ${athlete.lastname}`,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Token validation failed: ${testResponse.status}`);
    }
    
  } catch (error: any) {
    console.error('❌ Automated token refresh failed:', error);
    const duration = Date.now() - startTime;
    
    // This is critical for 24/7 operation - use critical logging
    await logCritical('Strava token refresh failed', { 
      error: error.message,
      duration,
      endpoint: '/api/strava/refresh-tokens'
    });
    await logPerformance('/api/strava/refresh-tokens', duration, false);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also allow POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}