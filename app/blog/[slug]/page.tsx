import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { RedBullBlogPost } from '../../components/blog';

// Force dynamic rendering since we are reading files changed at runtime
// Force dynamic rendering since we are reading files changed at runtime
export const dynamic = 'force-dynamic';

import { parseMarkdownToRedBull } from '@/lib/markdown-utils';

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
  const filepath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filepath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(fileContent);

  const parsed = parseMarkdownToRedBull(content, slug);

  // Calculate read time
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Use image from frontmatter, or intro image, or default
  const heroImage = data.image || parsed.introImage || '/stories/default.jpg';

  const componentData = {
    title: data.title || slug,
    subtitle: data.description || parsed.intro.substring(0, 150) + '...',
    author: data.author || 'Summit Explorer',
    date: data.date || new Date().toISOString(),
    readTime: `${readTime} min read`,
    category: (data.tags?.[0] || 'STORY').toUpperCase(),
    location: 'Himalayas', // Could be added to frontmatter
    mainImage: heroImage,
    views: '1.2K',
    tags: data.tags || ['Mountaineering'],
    content: {
      intro: parsed.intro,
      sections: parsed.sections,
    },
  };

  return (
    <div className="min-h-screen bg-black">
      <RedBullBlogPost post={componentData} slug={slug} />
    </div>
  );
}
