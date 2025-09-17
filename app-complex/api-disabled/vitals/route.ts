import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';
import { z } from 'zod';

export const runtime = 'nodejs';

const WebVitalSchema = z.object({
  name: z.enum(['CLS', 'FCP', 'LCP', 'TTFB', 'INP']),
  value: z.number(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  delta: z.number().optional(),
  id: z.string(),
  navigationType: z.string().optional(),
});

const VitalsReportSchema = z.object({
  url: z.string().url(),
  userAgent: z.string(),
  vitals: z.array(WebVitalSchema),
  timestamp: z.string().datetime(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = VitalsReportSchema.parse(body);

    const supabase = getSupabaseAdmin();

    // Store each vital separately for easier querying
    const vitalsData = report.vitals.map((vital) => ({
      url: report.url,
      user_agent: report.userAgent,
      metric_name: vital.name,
      metric_value: vital.value,
      rating: vital.rating,
      delta: vital.delta || 0,
      metric_id: vital.id,
      navigation_type: vital.navigationType,
      session_id: report.sessionId,
      user_id: report.userId,
      timestamp: report.timestamp,
    }));

    const { error } = await supabase
      .from('performance_vitals')
      .insert(vitalsData);

    if (error) {
      console.error('Error storing vitals:', error);
      return NextResponse.json(
        { error: 'Failed to store vitals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, stored: vitalsData.length });
  } catch (error: any) {
    console.error('Vitals API error:', error);
    return NextResponse.json({ error: 'Invalid vitals data' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const metric = searchParams.get('metric'); // specific metric to filter

    const hoursBack =
      timeRange === '1h'
        ? 1
        : timeRange === '7d'
          ? 168
          : timeRange === '30d'
            ? 720
            : 24;
    const cutoffTime = new Date(
      Date.now() - hoursBack * 60 * 60 * 1000
    ).toISOString();

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('performance_vitals')
      .select('*')
      .gte('timestamp', cutoffTime)
      .order('timestamp', { ascending: false });

    if (metric) {
      query = query.eq('metric_name', metric.toUpperCase());
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('Error fetching vitals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vitals' },
        { status: 500 }
      );
    }

    // Aggregate data for response
    const vitalsMap = new Map<string, any[]>();

    data?.forEach((vital) => {
      if (!vitalsMap.has(vital.metric_name)) {
        vitalsMap.set(vital.metric_name, []);
      }
      vitalsMap.get(vital.metric_name)!.push(vital);
    });

    const aggregated = Object.fromEntries(
      Array.from(vitalsMap.entries()).map(([metricName, values]) => {
        const nums = values
          .map((v) => v.metric_value)
          .filter((v) => typeof v === 'number');
        const avg =
          nums.length > 0 ? nums.reduce((a, b) => a + b) / nums.length : 0;
        const p75 =
          nums.length > 0
            ? nums.sort((a, b) => a - b)[Math.floor(nums.length * 0.75)] || 0
            : 0;
        const p95 =
          nums.length > 0
            ? nums.sort((a, b) => a - b)[Math.floor(nums.length * 0.95)] || 0
            : 0;

        const ratings = { good: 0, 'needs-improvement': 0, poor: 0 };
        values.forEach((v) => {
          if (v.rating in ratings) ratings[v.rating as keyof typeof ratings]++;
        });

        return [
          metricName,
          {
            count: values.length,
            average: Math.round(avg * 100) / 100,
            p75: Math.round(p75 * 100) / 100,
            p95: Math.round(p95 * 100) / 100,
            ratings,
            recent: values.slice(0, 10), // Most recent 10 entries
          },
        ];
      })
    );

    return NextResponse.json({
      timeRange,
      totalSamples: data?.length || 0,
      metrics: aggregated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Vitals GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vitals data' },
      { status: 500 }
    );
  }
}
