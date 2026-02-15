import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const HISTORY_FILE = path.join(process.cwd(), 'content', 'newsletter-history.json');

export async function GET() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      return NextResponse.json({ history });
    }
  } catch {
    // ignore
  }
  return NextResponse.json({ history: [] });
}
