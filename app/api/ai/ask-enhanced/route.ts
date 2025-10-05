import { NextRequest, NextResponse } from 'next/server';
import { generateRAGResponse } from '@/lib/rag/training-knowledge-base';
import { askTrainingQuestion, generateChatCompletion } from '@/lib/integrations/ollama';
import { checkAIAbuse, withAbuseProtection } from '@/lib/ai/abuse-prevention';

export const dynamic = 'force-dynamic';

// Mock training data access (will replace with actual database calls)
// This simulates the workoutDatabase from the Excel upload system
let mockTrainingData = [
  {
    date: '2024-09-15',
    exercise_type: 'cardio',
    actual_duration: 60,
    intensity: 7,
    completion_rate: 95,
    notes: 'Morning run, felt strong'
  },
  {
    date: '2024-09-16',
    exercise_type: 'climbing',
    actual_duration: 120,
    intensity: 8,
    completion_rate: 85,
    notes: 'Boulder training, worked on overhangs'
  },
  {
    date: '2024-09-17',
    exercise_type: 'strength',
    actual_duration: 45,
    intensity: 6,
    completion_rate: 100,
    notes: 'Upper body focus'
  }
];

// Mock blog content (will integrate with actual blog system)
const mockBlogContent = [
  {
    title: "My Journey to Everest: Preparation Phase",
    excerpt: "Training for Everest requires systematic approach to high-altitude preparation...",
    content: "The path to Everest is not just about physical fitness, but mental preparation, equipment familiarity, and understanding your body's response to altitude...",
    category: "expedition-preparation"
  },
  {
    title: "High Altitude Training Secrets",
    excerpt: "How I build endurance for climbing at extreme altitude...",
    content: "Altitude training involves progressive exposure, cardiovascular conditioning, and specific breathing techniques that I've learned through years of mountaineering...",
    category: "training-techniques"
  }
];

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
  const trainingKeywords = ['training', 'workout', 'exercise', 'progress', 'performance', 'improvement'];
  const questionLower = question.toLowerCase();

  const isTrainingRelated = trainingKeywords.some(keyword =>
    questionLower.includes(keyword)
  );

  if (!isTrainingRelated) {
    return { data: [], summary: '' };
  }

  // Get recent training data (last 4 weeks simulation)
  const recentData = mockTrainingData.slice(-10);

  const summary = `Recent training summary: ${recentData.length} workouts over the past weeks.
Average intensity: ${(recentData.reduce((sum, w) => sum + (w.intensity || 0), 0) / recentData.length).toFixed(1)}/10.
Average completion rate: ${(recentData.reduce((sum, w) => sum + (w.completion_rate || 0), 0) / recentData.length).toFixed(1)}%.
Exercise types: ${[...new Set(recentData.map(w => w.exercise_type))].join(', ')}.`;

  return { data: recentData, summary };
}

async function getRelevantBlogContent(question: string): Promise<{
  content: any[];
  summary: string;
}> {
  // Simple relevance matching
  const questionLower = question.toLowerCase();

  const relevantBlogs = mockBlogContent.filter(blog =>
    blog.title.toLowerCase().includes(questionLower.substring(0, 20)) ||
    blog.excerpt.toLowerCase().includes(questionLower.substring(0, 20)) ||
    questionLower.includes(blog.category.replace('-', ' '))
  );

  const summary = relevantBlogs.length > 0
    ? `Relevant blog posts: ${relevantBlogs.map(b => b.title).join(', ')}`
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
  let contextParts: string[] = [];
  let sources: any[] = [];

  // Get RAG response if requested
  if (options.useRAG) {
    try {
      ragResponse = await generateRAGResponse(question);
      contextParts.push('Knowledge base documents');
      sources.push(...ragResponse.sources.map((s: any) => ({
        title: s.document.title,
        category: s.document.category,
        similarity: s.similarity,
        relevanceScore: s.relevanceScore,
        type: 'rag' as const
      })));
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
        type: 'training' as const
      });
    }
  }

  // Get blog content if requested
  if (options.includeBlogContext) {
    blogContent = await getRelevantBlogContent(question);
    if (blogContent.content.length > 0) {
      contextParts.push('Blog content');
      sources.push(...blogContent.content.map(blog => ({
        title: blog.title,
        category: blog.category,
        type: 'blog' as const
      })));
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
- Mountaineer preparing for Everest 2025
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
    { role: 'user' as const, content: question }
  ];

  const answer = await generateChatCompletion(messages, undefined, {
    temperature: 0.7,
    max_tokens: 500
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
    'Enhanced AI'
  ].filter(Boolean).join(' + ');

  return {
    question,
    answer,
    sources,
    contextUsed: contextParts,
    confidence: Math.min(1, confidence),
    method,
    trainingInsights: trainingData?.summary,
    personalContext: enhancedContext
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<EnhancedAIResponse | { error: string; retryAfter?: Date }>> {
  try {
    // Get client IP for abuse prevention
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    const body: EnhancedAIRequest = await request.json();
    const {
      question,
      useRAG = true,
      includeTrainingData = true,
      includeBlogContext = true,
      context
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
          retryAfter: abuseCheck.rateLimit?.resetTime
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
      context
    });

    // Log for monitoring
    console.log(`Enhanced AI request: IP=${ip}, Question="${question.substring(0, 50)}...", Method=${response.method}`);

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
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               '127.0.0.1';

    // Check for abuse
    const abuseCheck = await checkAIAbuse(ip, question, 'askAI');

    if (!abuseCheck.allowed) {
      return NextResponse.json(
        {
          error: abuseCheck.reason || 'Request blocked',
          retryAfter: abuseCheck.rateLimit?.resetTime
        },
        { status: 429 }
      );
    }

    // Generate enhanced response
    const response = await generateEnhancedResponse(question, {
      useRAG,
      includeTrainingData,
      includeBlogContext,
      context: context || undefined
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