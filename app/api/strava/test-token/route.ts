import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // Log what we're about to send
    const requestData = {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET ? 'SET' : 'MISSING',
      redirect_uri: process.env.STRAVA_REDIRECT_URI,
      code: code.substring(0, 10) + '...',
      grant_type: 'authorization_code'
    };
    
    console.log('Token exchange request data:', requestData);

    // Try the token exchange
    const params = new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID!,
      client_secret: process.env.STRAVA_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.STRAVA_REDIRECT_URI!,
    });

    console.log('Form data being sent:', params.toString());

    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params,
    });

    const responseText = await response.text();
    console.log('Strava response:', response.status, responseText);

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Token exchange failed', 
        status: response.status,
        response: responseText,
        sentData: requestData
      }, { status: 500 });
    }

    const tokenData = JSON.parse(responseText);
    return NextResponse.json({ success: true, data: tokenData });

  } catch (error: any) {
    console.error('Test token error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}