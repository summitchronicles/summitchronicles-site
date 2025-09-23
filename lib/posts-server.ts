import fs from 'fs';
import path from 'path';
import { GeneratedPost, PostIndex } from './posts';

const GENERATED_DIR = path.join(process.cwd(), 'generated');

// Server-side functions for file system access
// These can only be used in API routes or server components

// Get all processed posts (server-side only)
export function getAllPostsServer(): PostIndex['posts'] {
  try {
    const indexPath = path.join(GENERATED_DIR, 'index.json');

    if (!fs.existsSync(indexPath)) {
      console.warn('No generated posts index found. Run `npm run build-posts` first.');
      return [];
    }

    const indexData: PostIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return indexData.posts;
  } catch (error) {
    console.error('Error loading posts index:', error);
    return [];
  }
}

// Get a single post by slug (server-side only)
export function getPostBySlugServer(slug: string): GeneratedPost | null {
  try {
    const postPath = path.join(GENERATED_DIR, `${slug}.json`);

    if (!fs.existsSync(postPath)) {
      console.warn(`Post not found: ${slug}. Run \`npm run build-posts\` first.`);
      return null;
    }

    const postData: GeneratedPost = JSON.parse(fs.readFileSync(postPath, 'utf8'));
    return postData;
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

// Get posts by category (server-side only)
export function getPostsByCategoryServer(category: string): PostIndex['posts'] {
  const allPosts = getAllPostsServer();
  return allPosts.filter(post =>
    post.category.toLowerCase() === category.toLowerCase()
  );
}

// Get recent posts (server-side only)
export function getRecentPostsServer(limit: number = 5): PostIndex['posts'] {
  const allPosts = getAllPostsServer();
  return allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Check if posts are available (server-side only)
export function hasGeneratedPostsServer(): boolean {
  try {
    const indexPath = path.join(GENERATED_DIR, 'index.json');
    return fs.existsSync(indexPath);
  } catch (error) {
    return false;
  }
}