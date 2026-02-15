import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'content', 'newsletter-subscribers.json');

function loadSubscribers(): string[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveSubscribers(subscribers: string[]) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function GET() {
  return NextResponse.json({ subscribers: loadSubscribers() });
}

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const subscribers = loadSubscribers();
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    saveSubscribers(subscribers);
  }

  return NextResponse.json({ subscribers });
}

export async function DELETE(request: Request) {
  const { email } = await request.json();
  const subscribers = loadSubscribers().filter(s => s !== email);
  saveSubscribers(subscribers);
  return NextResponse.json({ subscribers });
}
