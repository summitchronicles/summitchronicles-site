import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(request: Request) {
  try {
    const { agent } = await request.json();

    const agents: Record<string, string> = {
      researcher: 'scripts/legacy/researcher/index.ts',
      newsletter: 'scripts/legacy/newsletter/index.ts',
    };

    const script = agents[agent];
    if (!script) {
      return NextResponse.json({ error: `Unknown agent: ${agent}` }, { status: 400 });
    }

    // Run in background
    const cmd = `npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' --transpile-only ${script}`;
    exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Agent ${agent} error:`, error.message);
      }
      if (stdout) console.log(`Agent ${agent} stdout:`, stdout);
      if (stderr) console.error(`Agent ${agent} stderr:`, stderr);
    });

    return NextResponse.json({ success: true, message: `${agent} started in background` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
