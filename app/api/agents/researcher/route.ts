import { NextResponse } from 'next/server';
import { runResearcher } from '@/agents/researcher';

export async function POST(request: Request) {
  try {
    // Optional: Add authentication here
    const authHeader = request.headers.get('authorization');
    const secret = process.env.AGENT_TRIGGER_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run researcher in background
    runResearcher()
      .then(() => console.log('✅ Researcher completed'))
      .catch((e) => console.error('❌ Researcher failed:', e));

    return NextResponse.json({
      success: true,
      message: 'Researcher started in background',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
