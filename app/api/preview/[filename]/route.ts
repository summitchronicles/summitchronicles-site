import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const filepath = path.join(BLOG_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const content = fs.readFileSync(filepath, 'utf-8');

    // Return HTML preview
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Blog Preview</title>
  <style>
    body {
      background: #000;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    pre {
      background: #1a1a1a;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }
    h1 { color: #60a5fa; }
    h2 { color: #34d399; margin-top: 2rem; }
    img { max-width: 100%; border-radius: 8px; }
    .frontmatter {
      background: #1e293b;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="frontmatter">
    <strong>📄 ${filename}</strong>
  </div>
  <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    return new NextResponse('Error loading preview', { status: 500 });
  }
}
