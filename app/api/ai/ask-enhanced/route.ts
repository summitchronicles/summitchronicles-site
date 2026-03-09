import { NextRequest, NextResponse } from 'next/server';
import { generateRAGResponse } from '@/lib/rag/training-knowledge-base';
import { generateChatCompletion } from '@/lib/integrations/replicate';
import { checkAIAbuse } from '@/lib/ai/abuse-prevention';
import { getAllPostsServer } from '@/lib/posts-server';
import {
  getUnifiedWorkouts,
  getWorkoutStats,
} from '@/modules/training/application/unified-workout-service';

export const dynamic = 'force-dynamic';

interface EnhancedAIRequest {
  question: string;
  useRAG?: boolean;
  includeTrainingData?: boolean;
  includeBlogContext?: boolean;
  context?: string;
}

interface EnhancedAIResponse {
  question: string;
  answer: string;
  sources: Array<{
    title: string;
    category: string;
    similarity?: number;
    relevanceScore?: number;
    type: 'blog' | 'training' | 'rag' | 'general';
  }>;
  contextUsed: string[];
  confidence: number;
  method: string;
  trainingInsights?: string;
  personalContext?: string;
}

async function getRelevantTrainingData(question: string): Promise<{
  data: any[];
  summary: string;
}> {
  // Simple keyword matching for now (would use semantic search in production)
  const trainingKeywords = [
    'training',
    'workout',
    'exercise',
    'progress',
    'performance',
    'improvement',
    'garmin',
    'activity',
  ];
  const questionLower = question.toLowerCase();

  const isTrainingRelated = trainingKeywords.some((keyword) =>
    questionLower.includes(keyword)
  );

  if (!isTrainingRelated) {
    return { data: [], summary: '' };
  }

  try {
    const workouts = await getUnifiedWorkouts({ limit: 30 });
    if (workouts.length === 0) {
      return { data: [], summary: '' };
    }

    const stats = await getWorkoutStats({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    });

    if (stats.total_workouts === 0) {
      return { data: [], summary: '' };
    }

    const dataSourceSummary = [
      stats.by_source.intervals
        ? `${stats.by_source.intervals} from Intervals.icu`
        : null,
      stats.by_source.historical
        ? `${stats.by_source.historical} historical`
        : null,
      stats.by_source.garmin ? `${stats.by_source.garmin} Garmin` : null,
    ]
      .filter(Boolean)
      .join(', ');

    const summary = `Recent training summary (last 30 days):
- Total workouts: ${stats.total_workouts}
- Total time: ${stats.total_duration_hours.toFixed(1)} hours
- Total distance: ${stats.total_distance_km.toFixed(1)} km
- Total elevation: ${stats.total_elevation_m.toFixed(0)} m
- Average HR: ${stats.avg_heart_rate} bpm
- Average intensity: ${stats.avg_intensity}/10
- Data sources: ${dataSourceSummary || 'Unavailable'}
- Top activities: ${Object.entries(stats.by_type)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => `${type} (${count})`)
      .join(', ')}`;

    return { data: workouts, summary };
  } catch (error) {
    console.error('Error fetching unified training data:', error);
    return { data: [], summary: '' };
  }
}

async function getRelevantBlogContent(question: string): Promise<{
  content: any[];
  summary: string;
}> {
  const posts = getAllPostsServer();
  if (posts.length === 0) {
    return { content: [], summary: '' };
  }

  const keywords = question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);

  const relevantBlogs = posts
    .map((post) => {
      const haystack = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
      const score = keywords.reduce(
        (total, keyword) => total + (haystack.includes(keyword) ? 1 : 0),
        0
      );

      return {
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        score,
      };
    })
    .filter((post) => post.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  const summary =
    relevantBlogs.length > 0
      ? `Relevant blog posts: ${relevantBlogs.map((b) => b.title).join(', ')}`
      : '';

  return { content: relevantBlogs, summary };
}

async function generateEnhancedResponse(
  question: string,
  options: {
    useRAG: boolean;
    includeTrainingData: boolean;
    includeBlogContext: boolean;
    context?: string;
  }
): Promise<EnhancedAIResponse> {
  let ragResponse;
  let trainingData;
  let blogContent;
  const contextParts: string[] = [];
  const sources: any[] = [];

  // Get RAG response if requested
  if (options.useRAG) {
    try {
      ragResponse = await generateRAGResponse(question);
      contextParts.push('Knowledge base documents');
      sources.push(
        ...ragResponse.sources.map((s: any) => ({
          title: s.document.title,
          category: s.document.category,
          similarity: s.similarity,
          relevanceScore: s.relevanceScore,
          type: 'rag' as const,
        }))
      );
    } catch (error) {
      console.warn('RAG failed, continuing without:', error);
    }
  }

  // Get training data if requested
  if (options.includeTrainingData) {
    trainingData = await getRelevantTrainingData(question);
    if (trainingData.data.length > 0) {
      contextParts.push('Personal training data');
      sources.push({
        title: 'Personal Training History',
        category: 'training-data',
        type: 'training' as const,
      });
    }
  }

  // Get blog content if requested
  if (options.includeBlogContext) {
    blogContent = await getRelevantBlogContent(question);
    if (blogContent.content.length > 0) {
      contextParts.push('Blog content');
      sources.push(
        ...blogContent.content.map((blog) => ({
          title: blog.title,
          category: blog.category,
          type: 'blog' as const,
        }))
      );
    }
  }

  // Build enhanced context
  let enhancedContext = '';

  if (options.context) {
    enhancedContext += `Additional context: ${options.context}\n\n`;
  }

  if (trainingData?.summary) {
    enhancedContext += `PERSONAL TRAINING DATA:\n${trainingData.summary}\n\n`;
  }

  if (blogContent?.summary) {
    enhancedContext += `BLOG CONTENT CONTEXT:\n${blogContent.summary}\n\n`;
  }

  if (ragResponse?.context_used) {
    enhancedContext += `KNOWLEDGE BASE:\n${ragResponse.context_used.join('\n')}\n\n`;
  }

  // Generate enhanced AI response
  const systemPrompt = `You are Sunith Kumar's personal AI assistant. You help people understand Sunith's mountaineering journey, training methods, and expedition experiences.

ABOUT SUNITH:
- Mountaineer preparing for Everest
- Systematic approach to high-altitude training
- Focus on progression, safety, and mental preparation
- Experience with multiple peaks and expedition planning

CONTEXT AVAILABLE:
${enhancedContext}

Provide personalized, detailed responses that:
1. Reference Sunith's actual training data when relevant
2. Cite specific blog posts or expedition experiences
3. Give actionable advice based on proven methods
4. Maintain an encouraging but realistic tone
5. Always emphasize safety and proper progression

If training data is available, analyze trends and provide specific insights.
If the question is general, still relate it to Sunith's mountaineering context.`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: question },
  ];

  const answer = await generateChatCompletion(messages, {
    temperature: 0.7,
    max_tokens: 500,
  });

  // Calculate confidence based on available context
  let confidence = 0.6; // Base confidence
  if (ragResponse) confidence += 0.2;
  if (trainingData?.data.length) confidence += 0.1;
  if (blogContent?.content.length) confidence += 0.1;

  const method = [
    ragResponse ? 'RAG' : null,
    trainingData?.data.length ? 'Training Data' : null,
    blogContent?.content.length ? 'Blog Context' : null,
    'Enhanced AI',
  ]
    .filter(Boolean)
    .join(' + ');

  return {
    question,
    answer,
    sources,
    contextUsed: contextParts,
    confidence: Math.min(1, confidence),
    method,
    trainingInsights: trainingData?.summary,
    personalContext: enhancedContext,
  };
}

export async function POST(
  request: NextRequest
): Promise<
  NextResponse<EnhancedAIResponse | { error: string; retryAfter?: Date }>
> {
  try {
    // Get client IP for abuse prevention
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const body: EnhancedAIRequest = await request.json();
    const {
      question,
      useRAG = true,
      includeTrainingData = true,
      includeBlogContext = true,
      context,
    } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // Check for abuse
    const abuseCheck = await checkAIAbuse(ip, question, 'askAI');

    if (!abuseCheck.allowed) {
      return NextResponse.json(
        {
          error: abuseCheck.reason || 'Request blocked',
          retryAfter: abuseCheck.rateLimit?.resetTime,
        },
        { status: 429 }
      );
    }

    // Warn about irrelevant content
    if (abuseCheck.contentFilter?.isIrrelevant) {
      // Still process but add a note
      console.log(`Processing potentially irrelevant question: ${question}`);
    }

    // Generate enhanced response
    const response = await generateEnhancedResponse(question, {
      useRAG,
      includeTrainingData,
      includeBlogContext,
      context,
    });

    // Log for monitoring
    console.log(
      `Enhanced AI request: IP=${ip}, Question="${question.substring(0, 50)}...", Method=${response.method}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced Ask AI error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing your question' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const question = searchParams.get('q');
    const useRAG = searchParams.get('rag') !== 'false';
    const includeTrainingData = searchParams.get('training') !== 'false';
    const includeBlogContext = searchParams.get('blog') !== 'false';
    const context = searchParams.get('context');

    if (!question) {
      return NextResponse.json(
        { error: 'Question parameter "q" is required' },
        { status: 400 }
      );
    }

    // Get client IP for abuse prevention
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Check for abuse
    const abuseCheck = await checkAIAbuse(ip, question, 'askAI');

    if (!abuseCheck.allowed) {
      return NextResponse.json(
        {
          error: abuseCheck.reason || 'Request blocked',
          retryAfter: abuseCheck.rateLimit?.resetTime,
        },
        { status: 429 }
      );
    }

    // Generate enhanced response
    const response = await generateEnhancedResponse(question, {
      useRAG,
      includeTrainingData,
      includeBlogContext,
      context: context || undefined,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced Ask AI GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing your question' },
      { status: 500 }
    );
  }
}
