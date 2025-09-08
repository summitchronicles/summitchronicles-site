import { NextRequest, NextResponse } from 'next/server';
import { getStravaAccessToken } from '@/lib/strava';

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron job or internal call
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'default-secret';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Starting automated token refresh...');
    
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
    
    // Log to your error tracking service here if you have one
    
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