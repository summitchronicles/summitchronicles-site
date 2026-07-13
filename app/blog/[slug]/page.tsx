import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { RedBullBlogPost } from '../../components/blog';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { queries, sanityClient, urlFor } from '@/lib/sanity/client';

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
    const sanityPost = await sanityClient
      .fetch(queries.postBySlug, { slug })
      .catch((error) => {
        console.error('Unable to load story from Sanity:', error);
        return null;
      });
    if (!sanityPost) return notFound();

    const portableContent = portableTextToArticle(sanityPost.content);
    const componentData = {
      title: sanityPost.title || slug,
      subtitle: sanityPost.excerpt || '',
      author: sanityPost.author?.name || 'Sunith Kumar',
      date: sanityPost.publishedAt,
      readTime: `${Math.max(1, Math.ceil(portableContent.wordCount / 200))} min read`,
      category: sanityPost.categories?.[0]?.title || 'Story',
      location: 'Field Notes',
      mainImage: sanityPost.featuredImage
        ? urlFor(sanityPost.featuredImage).width(1800).height(1200).url()
        : '/images/sunith-visionary-planning.png',
      tags: sanityPost.tags || [],
      content: portableContent.content,
    };

    return (
      <PublicLayout mainClassName="pt-16">
        <RedBullBlogPost post={componentData} slug={slug} />
      </PublicLayout>
    );
  }

  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(fileContent);

  const parsed = parseMarkdownToRedBull(content, slug);

  // Calculate read time
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Use image from frontmatter, or intro image, or default
  const heroImage =
    data.image || parsed.introImage || '/images/sunith-visionary-planning.png';

  const componentData = {
    title: data.title || slug,
    subtitle: data.description || parsed.intro.substring(0, 150) + '...',
    author: data.author || 'Summit Explorer',
    date: data.date || new Date().toISOString(),
    readTime: `${readTime} min read`,
    category: (data.tags?.[0] || 'STORY').toUpperCase(),
    location: data.location,
    mainImage: heroImage,
    views: '1.2K',
    tags: data.tags || ['Mountaineering'],
    content: {
      intro: parsed.intro,
      sections: parsed.sections,
    },
  };

  return (
    <PublicLayout mainClassName="pt-16">
      <RedBullBlogPost post={componentData} slug={slug} />
    </PublicLayout>
  );
}

function portableTextToArticle(blocks: unknown) {
  if (!Array.isArray(blocks)) {
    return { content: { intro: '', sections: [] }, wordCount: 0 };
  }

  const normalizedBlocks = blocks
    .filter((block) => block && typeof block === 'object')
    .map((block: any) =>
      block._type === 'image'
        ? {
            type: 'image' as const,
            image: urlFor(block).width(1600).height(1000).url(),
            caption: block.caption || block.alt || 'Field image',
          }
        : {
            type: 'text' as const,
            style: block.style || 'normal',
            text: Array.isArray(block.children)
              ? block.children.map((child: any) => child.text || '').join('')
              : '',
          }
    )
    .filter((block) => block.type === 'image' || block.text.trim());
  const firstTextIndex = normalizedBlocks.findIndex(
    (block) => block.type === 'text'
  );
  const intro =
    firstTextIndex >= 0 && normalizedBlocks[firstTextIndex].type === 'text'
      ? normalizedBlocks[firstTextIndex].text
      : '';
  const body = normalizedBlocks.filter((_, index) => index !== firstTextIndex);
  const sections: Array<{
    title: string;
    content: string;
    image?: string;
  }> = [];
  let currentSection = { title: 'Field Notes', content: '' };

  const flushCurrentSection = () => {
    if (currentSection.content.trim()) sections.push(currentSection);
    currentSection = { title: 'Field Notes', content: '' };
  };

  for (const block of body) {
    if (block.type === 'image') {
      flushCurrentSection();
      sections.push({
        title: block.caption,
        content: block.caption,
        image: block.image,
      });
      continue;
    }

    if (['h2', 'h3', 'h4'].includes(block.style)) {
      flushCurrentSection();
      currentSection.title = block.text;
      continue;
    }

    const paragraph =
      block.style === 'blockquote' ? `> ${block.text}` : block.text;
    currentSection.content = [currentSection.content, paragraph]
      .filter(Boolean)
      .join('\n\n');
  }
  flushCurrentSection();

  return {
    content: {
      intro,
      sections,
    },
    wordCount: normalizedBlocks
      .map((block) => (block.type === 'text' ? block.text : block.caption))
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length,
  };
}
