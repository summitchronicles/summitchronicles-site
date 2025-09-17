import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';
import { z } from 'zod';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Validation schemas
const SessionSchema = z.object({
  sessionId: z.string(),
  fingerprint: z.string().optional(),
  userAgent: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

const PageViewSchema = z.object({
  sessionId: z.string(),
  pageUrl: z.string(),
  pageTitle: z.string().optional(),
  referrerUrl: z.string().optional(),
  timeOnPage: z.number().optional(),
  scrollDepth: z.number().optional(),
  interactions: z.number().optional(),
});

const AIInteractionSchema = z.object({
  sessionId: z.string(),
  question: z.string(),
  questionCategory: z.string().optional(),
  responseTime: z.number(),
  responseLength: z.number().optional(),
  sourcesCount: z.number().optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
  wasHelpful: z.boolean().optional(),
  retrievalScore: z.number().optional(),
  tokensUsed: z.number().optional(),
  errorOccurred: z.boolean().optional(),
  errorType: z.string().optional(),
});

const TrackingRequestSchema = z.object({
  type: z.enum(['session', 'pageview', 'ai_interaction']),
  data: z.union([SessionSchema, PageViewSchema, AIInteractionSchema]),
});

// Helper functions
function parseUserAgent(userAgent: string) {
  const deviceRegex = /Mobile|Android|iPhone|iPad/i;
  const browserRegex = /Chrome|Firefox|Safari|Edge/i;
  const osRegex = /Windows|Mac|Linux|Android|iOS/i;

  return {
    deviceType: deviceRegex.test(userAgent) ? 'mobile' : 'desktop',
    browser: userAgent.match(browserRegex)?.[0] || 'unknown',
    os: userAgent.match(osRegex)?.[0] || 'unknown',
  };
}

function generateFingerprint(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';

  const seed = `${ip}::${userAgent}::${acceptLanguage}`;
  return crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = TrackingRequestSchema.parse(body);

    const supabase = getSupabaseAdmin();

    switch (type) {
      case 'session': {
        const sessionData = data as z.infer<typeof SessionSchema>;
        const userAgentInfo = parseUserAgent(sessionData.userAgent || '');
        const fingerprint = sessionData.fingerprint || generateFingerprint(req);

        const { error } = await supabase.from('analytics_sessions').upsert(
          {
            session_id: sessionData.sessionId,
            fingerprint,
            country: sessionData.country,
            region: sessionData.region,
            city: sessionData.city,
            user_agent: sessionData.userAgent,
            device_type: userAgentInfo.deviceType,
            browser: userAgentInfo.browser,
            os: userAgentInfo.os,
            referrer: sessionData.referrer,
            utm_source: sessionData.utmSource,
            utm_medium: sessionData.utmMedium,
            utm_campaign: sessionData.utmCampaign,
          },
          {
            onConflict: 'session_id',
          }
        );

        if (error) throw error;
        break;
      }

      case 'pageview': {
        const pageViewData = data as z.infer<typeof PageViewSchema>;

        const { error } = await supabase.from('analytics_page_views').insert({
          session_id: pageViewData.sessionId,
          page_url: pageViewData.pageUrl,
          page_title: pageViewData.pageTitle,
          referrer_url: pageViewData.referrerUrl,
          time_on_page: pageViewData.timeOnPage,
          scroll_depth: pageViewData.scrollDepth,
          interactions: pageViewData.interactions,
        });

        if (error) throw error;

        // Update content performance
        await supabase.from('analytics_content_performance').upsert(
          {
            page_url: pageViewData.pageUrl,
            page_title: pageViewData.pageTitle,
            total_views: 1,
            unique_visitors: 1,
            avg_time_on_page: pageViewData.timeOnPage || 0,
          },
          {
            onConflict: 'page_url',
          }
        );

        break;
      }

      case 'ai_interaction': {
        const aiData = data as z.infer<typeof AIInteractionSchema>;

        const { error } = await supabase
          .from('analytics_ai_interactions')
          .insert({
            session_id: aiData.sessionId,
            question: aiData.question,
            question_length: aiData.question.length,
            question_category: aiData.questionCategory,
            response_time: aiData.responseTime,
            response_length: aiData.responseLength,
            sources_count: aiData.sourcesCount,
            has_sources: (aiData.sourcesCount || 0) > 0,
            user_rating: aiData.userRating,
            user_feedback: aiData.userFeedback,
            was_helpful: aiData.wasHelpful,
            retrieval_score: aiData.retrievalScore,
            tokens_used: aiData.tokensUsed,
            error_occurred: aiData.errorOccurred,
            error_type: aiData.errorType,
          });

        if (error) throw error;
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 400 }
    );
  }
}

// GET endpoint for basic analytics verification
export async function GET() {
  return NextResponse.json({
    status: 'Analytics tracking endpoint active',
    timestamp: new Date().toISOString(),
  });
}
