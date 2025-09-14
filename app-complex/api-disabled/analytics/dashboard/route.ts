import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection'

export const runtime = 'nodejs'

const DashboardQuerySchema = z.object({
  timeRange: z.enum(['1h', '24h', '7d', '30d', '90d']).optional().default('24h'),
  metric: z.enum(['overview', 'visitors', 'ai', 'content', 'realtime']).optional().default('overview')
})

export const GET = protectionPresets.adminEndpoint(async (req: ProtectedRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const { timeRange, metric } = DashboardQuerySchema.parse({
      timeRange: searchParams.get('timeRange'),
      metric: searchParams.get('metric')
    })
    
    // Mock data for now - replace with real Supabase queries after schema setup
    const mockData = {
      overview: {
        visitors: { total_visitors: 156, total_sessions: 203, avg_session_duration: 245, bounce_rate: 0.65 },
        ai: { total_queries: 89, avg_response_time: 2100, success_rate: 0.94, avg_user_rating: 4.2 },
        content: { total_page_views: 412, unique_pages: 8, avg_time_on_page: 185, top_page: '/training' },
        realtime: { active_users: 3, daily_visitors: 47, daily_ai_queries: 12, avg_ai_response_time: 2100 }
      },
      visitors: {
        sessions: Array.from({length: 25}, (_, i) => ({
          created_at: new Date(Date.now() - i * 3600000).toISOString(),
          total_page_views: Math.floor(Math.random() * 10) + 1,
          session_duration: Math.floor(Math.random() * 600) + 60,
          is_bounce: Math.random() > 0.6
        })),
        geography: [
          { country: 'United States', count: 42 },
          { country: 'United Kingdom', count: 23 },
          { country: 'Canada', count: 18 },
          { country: 'Australia', count: 15 },
          { country: 'Germany', count: 12 }
        ],
        devices: [
          { device_type: 'desktop', browser: 'Chrome', count: 68 },
          { device_type: 'mobile', browser: 'Safari', count: 45 },
          { device_type: 'desktop', browser: 'Firefox', count: 22 },
          { device_type: 'mobile', browser: 'Chrome', count: 18 },
          { device_type: 'tablet', browser: 'Safari', count: 10 }
        ],
        traffic: [
          { referrer: 'google.com', utm_source: 'google', utm_medium: 'organic', count: 78 },
          { referrer: 'direct', utm_source: null, utm_medium: null, count: 45 },
          { referrer: 'reddit.com', utm_source: 'reddit', utm_medium: 'social', count: 23 },
          { referrer: 'twitter.com', utm_source: 'twitter', utm_medium: 'social', count: 15 }
        ]
      },
      ai: {
        interactions: Array.from({length: 20}, (_, i) => ({
          created_at: new Date(Date.now() - i * 1800000).toISOString(),
          response_time: Math.floor(Math.random() * 3000) + 1000,
          user_rating: Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : null,
          was_helpful: Math.random() > 0.2,
          error_occurred: Math.random() < 0.06
        })),
        topics: [
          { topic_name: 'Everest Training', category: 'training', total_questions: 45, avg_satisfaction: 4.3 },
          { topic_name: 'Gear Recommendations', category: 'gear', total_questions: 38, avg_satisfaction: 4.1 },
          { topic_name: 'K2 Route Planning', category: 'expeditions', total_questions: 29, avg_satisfaction: 4.5 },
          { topic_name: 'High Altitude Health', category: 'health', total_questions: 24, avg_satisfaction: 4.2 },
          { topic_name: 'Technical Climbing', category: 'training', total_questions: 18, avg_satisfaction: 4.0 },
          { topic_name: 'Weather Conditions', category: 'expeditions', total_questions: 15, avg_satisfaction: 3.9 }
        ],
        satisfaction: Array.from({length: 50}, () => ({
          user_rating: Math.floor(Math.random() * 5) + 1,
          was_helpful: Math.random() > 0.25,
          question_category: ['training', 'gear', 'expeditions', 'health'][Math.floor(Math.random() * 4)]
        })),
        performance: Array.from({length: 30}, () => ({
          response_time: Math.floor(Math.random() * 4000) + 800,
          sources_count: Math.floor(Math.random() * 6) + 1,
          tokens_used: Math.floor(Math.random() * 500) + 50
        }))
      },
      content: {
        popularPages: [
          { page_url: '/training', page_title: 'Training', total_views: 156, avg_time_on_page: 245, rank: 1 },
          { page_url: '/expeditions', page_title: 'Expeditions', total_views: 134, avg_time_on_page: 198, rank: 2 },
          { page_url: '/ask', page_title: 'Ask AI', total_views: 89, avg_time_on_page: 167, rank: 3 },
          { page_url: '/gear', page_title: 'Gear Reviews', total_views: 76, avg_time_on_page: 203, rank: 4 },
          { page_url: '/', page_title: 'Home', total_views: 67, avg_time_on_page: 89, rank: 5 }
        ],
        engagement: Array.from({length: 20}, (_, i) => ({
          page_url: ['/training', '/expeditions', '/ask', '/gear', '/'][i % 5],
          time_on_page: Math.floor(Math.random() * 300) + 60,
          scroll_depth: Math.floor(Math.random() * 100) + 1,
          interactions: Math.floor(Math.random() * 15)
        })),
        searches: Array.from({length: 15}, (_, i) => ({
          query: ['everest training', 'k2 route', 'climbing boots', 'altitude sickness', 'gear list'][i % 5],
          results_count: Math.floor(Math.random() * 10) + 1,
          clicked_result: Math.random() > 0.3
        }))
      },
      realtime: {
        activeSessions: Array.from({length: 5}, (_, i) => ({
          current_page: ['/', '/training', '/ask', '/expeditions', '/gear'][i],
          device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
          country: ['US', 'UK', 'CA', 'AU', 'DE'][Math.floor(Math.random() * 5)],
          last_activity: new Date(Date.now() - Math.random() * 1800000).toISOString()
        })),
        recentActivity: Array.from({length: 10}, (_, i) => ({
          page_url: ['/', '/training', '/ask', '/expeditions', '/gear'][Math.floor(Math.random() * 5)],
          created_at: new Date(Date.now() - i * 180000).toISOString()
        })),
        liveStats: {
          active_users: 3,
          daily_visitors: 47,
          daily_ai_queries: 12,
          avg_ai_response_time: 2100
        }
      }
    }
    
    return NextResponse.json(mockData[metric] || mockData.overview)
  } catch (error: any) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
});