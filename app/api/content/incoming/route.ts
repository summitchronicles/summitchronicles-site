import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const INCOMING_DIR = path.join(process.cwd(), 'content', 'incoming-notes');

export async function GET() {
  try {
    if (!fs.existsSync(INCOMING_DIR)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(INCOMING_DIR)
      .filter(file => {
        const fullPath = path.join(INCOMING_DIR, file);
        return (file.endsWith('.txt') || file.endsWith('.md'))
          && file !== 'README.md'
          && file !== 'template.txt'
          && fs.statSync(fullPath).isFile();
      })
      .map(file => {
        const fullPath = path.join(INCOMING_DIR, file);
        const stats = fs.statSync(fullPath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        return {
          filename: file,
          modified: stats.mtime.toISOString(),
          wordCount: content.split(/\s+/).length,
        };
      });

    return NextResponse.json({ files });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, files: [] }, { status: 500 });
  }
}
