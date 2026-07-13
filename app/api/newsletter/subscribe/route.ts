import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  getClientIp,
  createRateLimitResponse,
} from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Apply rate limiting (generous for newsletter signups)
  const clientIp = getClientIp(request);
  const isAllowed = await checkRateLimit(clientIp);

  if (!isAllowed) {
    return createRateLimitResponse();
  }

  try {
    const { email, referrer } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (
      !process.env.BUTTONDOWN_API_KEY ||
      process.env.BUTTONDOWN_API_KEY === 'bd-your-api-key-here'
    ) {
      return NextResponse.json(
        { error: 'Newsletter subscriptions are temporarily unavailable.' },
        { status: 503 }
      );
    }

    const response = await fetch(
      'https://api.buttondown.email/v1/subscribers',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          metadata: {
            referrer: referrer || 'summit-chronicles',
            subscribed_at: new Date().toISOString(),
            source: 'website',
          },
          tags: ['everest-training', 'website-signup'],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 'Newsletter provider rejected the subscription'
      );
    }

    const subscriber = await response.json();
    console.log('Newsletter subscription successful:', {
      subscriber_id: subscriber.id,
      referrer,
    });

    return NextResponse.json({
      message: 'Successfully subscribed to the Summit Chronicles newsletter!',
      email,
      subscriber_id: subscriber.id,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle specific errors
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
