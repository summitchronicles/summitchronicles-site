import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { RedBullBlogPost } from '../../components/blog';

// Force dynamic rendering since we are reading files changed at runtime
// Force dynamic rendering since we are reading files changed at runtime
export const dynamic = 'force-dynamic';

function parseMarkdownToRedBull(mdContent: string, slug: string) {
  // Normalize newlines
  const text = mdContent.replace(/\r\n/g, '\n');

  // Split into lines to process line-by-line
  const lines = text.split('\n');

  const sections: any[] = [];
  let currentSection = { title: '', content: '', image: null as string | null };
  let intro = '';
  let isIntro = true;
  let firstImage = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for Image: ![alt](url)
    const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) {
      const imgUrl = imgMatch[1];
      if (!firstImage) firstImage = imgUrl; // Capture first image for Hero

      if (isIntro) {
        // allow image in intro for hero extraction but don't add to text
      } else {
        currentSection.image = imgUrl;
      }
      continue; // Skip adding image line to text
    }

    // Check for Headers: ## Title OR **Title**
    // Detect bold headers that are stand-alone lines (likely headers)
    const isHeader =
      line.startsWith('## ') ||
      (line.startsWith('**') && line.endsWith('**') && line.length < 100);

    if (isHeader) {
      // Save previous section if it has content
      if (!isIntro) {
        if (currentSection.content) sections.push({ ...currentSection });
        currentSection = { title: '', content: '', image: null };
      }

      isIntro = false;
      // Clean title
      currentSection.title = line.replace(/^##\s+/, '').replace(/\*\*/g, '');
    } else {
      // Content
      if (isIntro) {
        // Skip metadata lines/dates if they look like metadata
        if (!line.startsWith('---') && !line.match(/^\w+ \d+, \d{4}$/)) {
          intro += line + '\n\n';
        }
      } else {
        currentSection.content += line + '\n\n';
      }
    }
  }

  // Push last section
  if (!isIntro && currentSection.content) {
    sections.push({ ...currentSection });
  }

  // Fallback: If no sections found (everything was intro?), create one section from intro content split?
  // Current logic: Just return intro. The component renders intro.
  // Optimization: If intro is HUGE and no sections, maybe split it?
  // But safest is to leave as is.

  return { intro: intro.trim(), sections, introImage: firstImage };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
  const filepath = path.join(BLOG_DIR, `${params.slug}.md`);

  if (!fs.existsSync(filepath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(fileContent);

  const parsed = parseMarkdownToRedBull(content, params.slug);

  // Calculate read time
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Use image from frontmatter, or intro image, or default
  const heroImage = data.image || parsed.introImage || '/stories/default.jpg';

  const componentData = {
    title: data.title || params.slug,
    subtitle: data.description || parsed.intro.substring(0, 150) + '...',
    author: data.author || 'Summit Explorer',
    date: data.date || new Date().toISOString(),
    readTime: `${readTime} min read`,
    category: (data.tags?.[0] || 'STORY').toUpperCase(),
    location: 'Himalayas', // Could be added to frontmatter
    heroImage: heroImage,
    views: '1.2K',
    tags: data.tags || ['Mountaineering'],
    content: {
      intro: parsed.intro,
      sections: parsed.sections,
    },
  };

  return (
    <div className="min-h-screen bg-black">
      <RedBullBlogPost post={componentData} slug={params.slug} />
    </div>
  );
}
