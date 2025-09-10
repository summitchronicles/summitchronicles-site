import { NextRequest, NextResponse } from 'next/server';
import { logError } from '@/lib/error-monitor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      error,
      stack,
      context,
      url,
      userAgent,
      timestamp
    } = body;

    // Create error object with client-side information
    const clientError = new Error(error);
    if (stack) {
      clientError.stack = stack;
    }

    // Log the client-side error with context
    await logError(clientError, {
      ...context,
      clientUrl: url,
      clientUserAgent: userAgent,
      clientTimestamp: timestamp,
      source: 'client-side'
    }, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error report endpoint failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' }, 
      { status: 500 }
    );
  }
}