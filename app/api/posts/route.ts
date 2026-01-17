import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function GET() {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return NextResponse.json({ posts: [], success: true });
    }

    const files = fs
      .readdirSync(BLOG_DIR)
      .filter((file) => file.endsWith('.md'));

    const posts = files.map((filename) => {
      const filepath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filepath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Calculate read time roughly
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200) + ' min read';

      // Extract first image if not in frontmatter
      let heroImage = data.image || '/stories/default.jpg';
      if (!data.image) {
        const imgMatch = content.match(/!\[.*?\]\((.*?)\)/);
        if (imgMatch) heroImage = imgMatch[1];
      }

      return {
        slug: filename.replace('.md', ''),
        title: data.title || filename.replace(/-/g, ' ').replace('.md', ''),
        subtitle:
          data.description ||
          content.substring(0, 150).replace(/[#*`]/g, '') + '...',
        author: data.author || 'Summit Explorer',
        date: data.date || new Date().toISOString(),
        category: (data.tags?.[0] || 'STORIES').toUpperCase(),
        image: heroImage,
        readTime,
        status: data.status || 'draft', // Default to draft
      };
    });

    // FILTER: Only show "published" posts
    const publishedPosts = posts.filter((post) => post.status === 'published');

    // Sort by date desc
    publishedPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ posts: publishedPosts, success: true });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({
      posts: [],
      success: false,
      error: 'Failed to fetch posts',
    });
  }
}
