import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Test database connection and token retrieval
    const { data: tokenData, error } = await supabase
      .from('strava_tokens')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Strava tokens found',
        },
        { status: 404 }
      );
    }

    // Test Strava API connection
    const stravaResponse = await fetch(
      'https://www.strava.com/api/v3/athlete',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!stravaResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Strava API connection failed',
          status: stravaResponse.status,
        },
        { status: 500 }
      );
    }

    const athlete = await stravaResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Strava integration working perfectly!',
      database_connection: 'OK',
      strava_api_connection: 'OK',
      athlete: {
        id: athlete.id,
        name: `${athlete.firstname} ${athlete.lastname}`,
        profile: athlete.profile,
        city: athlete.city,
        state: athlete.state,
        country: athlete.country,
      },
      token_info: {
        expires_at: tokenData.expires_at,
        expires_date: new Date(tokenData.expires_at * 1000).toISOString(),
        created_at: tokenData.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
