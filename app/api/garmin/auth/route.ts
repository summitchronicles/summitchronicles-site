import { NextRequest, NextResponse } from 'next/server';
import GarminAPIClient from '../../../../lib/garmin-api';

// Environment variables for Garmin OAuth
const GARMIN_CLIENT_ID = process.env.GARMIN_CLIENT_ID;
const GARMIN_CLIENT_SECRET = process.env.GARMIN_CLIENT_SECRET;
const GARMIN_REDIRECT_URI = process.env.GARMIN_REDIRECT_URI || 'http://localhost:3000/api/garmin/callback';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'login') {
      // Generate authorization URL for Garmin Connect
      if (!GARMIN_CLIENT_ID) {
        return NextResponse.json(
          {
            error: 'Garmin OAuth not configured',
            code: 'MISSING_CONFIG',
            help: 'Please configure GARMIN_CLIENT_ID in environment variables'
          },
          { status: 500 }
        );
      }

      const garminClient = new GarminAPIClient();
      const state = Math.random().toString(36).substring(7);

      const authUrl = garminClient.getAuthorizationUrl(
        GARMIN_CLIENT_ID,
        GARMIN_REDIRECT_URI,
        state
      );

      // Store state in session/cookie for verification
      const response = NextResponse.json({
        success: true,
        authUrl,
        state,
      });

      // Set secure httpOnly cookie with state for CSRF protection
      response.cookies.set('garmin_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
      });

      return response;
    }

    if (action === 'status') {
      // Check current authentication status
      // In a real app, you'd check stored tokens from database/session
      return NextResponse.json({
        isAuthenticated: false,
        message: 'Authentication status check - implement token storage'
      });
    }

    return NextResponse.json(
      {
        error: 'Invalid action parameter',
        validActions: ['login', 'status']
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Garmin auth error:', error);
    return NextResponse.json(
      {
        error: 'Authentication service error',
        code: 'AUTH_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'logout') {
      // Clear authentication tokens and cookies
      const response = NextResponse.json({
        success: true,
        message: 'Successfully logged out from Garmin Connect'
      });

      // Clear oauth state cookie
      response.cookies.delete('garmin_oauth_state');

      // In a real app, you'd also clear stored tokens from database
      // await clearUserTokens(userId);

      return response;
    }

    if (action === 'refresh') {
      // Refresh tokens
      // In a real app, you'd retrieve stored tokens and refresh them
      return NextResponse.json({
        error: 'Token refresh not implemented',
        code: 'NOT_IMPLEMENTED',
        message: 'Implement token storage and refresh logic'
      }, { status: 501 });
    }

    return NextResponse.json(
      {
        error: 'Invalid action parameter',
        validActions: ['logout', 'refresh']
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Garmin auth POST error:', error);
    return NextResponse.json(
      {
        error: 'Authentication service error',
        code: 'AUTH_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}