import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function GET() {
  try {
    const files = fs.readdirSync(BLOG_DIR);

    const drafts = files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        try {
          const filepath = path.join(BLOG_DIR, file);
          const content = fs.readFileSync(filepath, 'utf-8');
          const { data, content: body } = matter(content);

          return {
            filename: file,
            title: data.title || 'Untitled',
            date: data.date || 'No date',
            author: data.author || 'Unknown',
            status: data.status || 'draft',
            hasImage: body.includes('![') || body.includes('<img'),
            wordCount: body.split(/\s+/).length,
            slug: file.replace(/\.md$/, ''),
          };
        } catch (e) {
          console.warn(`Skipping ${file}: invalid frontmatter`);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return NextResponse.json({ drafts });
  } catch (error: any) {
    console.error('Error reading drafts:', error);
    return NextResponse.json(
      { error: 'Failed to read drafts', drafts: [] },
      { status: 500 }
    );
  }
}
