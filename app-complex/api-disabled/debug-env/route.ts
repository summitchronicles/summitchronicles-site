import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    strava_client_id: process.env.STRAVA_CLIENT_ID ? 'SET' : 'MISSING',
    strava_client_secret: process.env.STRAVA_CLIENT_SECRET ? 'SET' : 'MISSING', 
    strava_redirect_uri: process.env.STRAVA_REDIRECT_URI ? 'SET' : 'MISSING',
    client_id_value: process.env.STRAVA_CLIENT_ID,
    redirect_uri_value: process.env.STRAVA_REDIRECT_URI,
    // Don't log the secret value
  });
}