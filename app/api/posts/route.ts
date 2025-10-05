import { NextResponse } from 'next/server';
import { getAllPostsServer, getPostBySlugServer } from '@/lib/posts-server';

export async function GET() {
  try {
    const posts = getAllPostsServer();

    // Filter out demo content
    const filteredPosts = posts.filter(post =>
      !post.slug.includes("My First Climb") &&
      !post.slug.includes("The Spark I Didn't See Coming")
    );

    // Enhance posts with missing required fields and better excerpts
    const enhancedPosts = filteredPosts.map(post => {
      // Try to get the actual post data for better title and excerpt
      const postData = getPostBySlugServer(post.slug);

      let title = post.slug?.replace(/-/g, ' ') || 'Untitled';
      let excerpt = post.excerpt || '';

      if (postData) {
        // Extract title from raw content
        const titleMatch = postData.content.raw.match(/🔹 Blog Title:\s*(.*?)(?=\n|$)/);
        if (titleMatch) {
          title = titleMatch[1].trim();
        }

        // Extract subtitle as excerpt
        const subtitleMatch = postData.content.raw.match(/🔹 Subtitle:\s*(.*?)(?=🔹|$)/s);
        if (subtitleMatch) {
          excerpt = subtitleMatch[1].trim();
        }
      }

      return {
        ...post,
        title,
        excerpt,
        date: new Date().toISOString(),
        category: 'STORIES'
      };
    });

    return NextResponse.json({ posts: enhancedPosts, success: true });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ posts: [], success: false, error: 'Failed to fetch posts' });
  }
}