import { NextResponse } from 'next/server';
import { runContentUpdater } from '@/agents/content-updater';

export async function POST(request: Request) {
  try {
    // Optional: Add authentication
    const authHeader = request.headers.get('authorization');
    const secret = process.env.AGENT_TRIGGER_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run content updater in background
    runContentUpdater()
      .then(() => console.log('✅ Content Updater completed'))
      .catch((e) => console.error('❌ Content Updater failed:', e));

    return NextResponse.json({
      success: true,
      message: 'Content Updater started in background',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
