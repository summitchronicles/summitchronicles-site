import fs from 'fs';
import path from 'path';

export interface GeneratedPost {
  slug: string;
  metadata: {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    style: 'redbull' | 'cinematic';
    location: string;
    processedAt: string;
    wordCount: number;
    readTime: number;
  };
  content: {
    raw: string;
    sections: Array<{
      id: string;
      title: string;
      content: string;
      type: string;
      pullQuote: string | null;
      image?: {
        file: string;
        type: string;
        keywords: string;
        alt: string;
        path: string;
      };
      imagePosition?: 'left' | 'right';
      showImage?: boolean;
      emphasis?: boolean;
    }>;
  };
  images: Array<{
    file: string;
    type: string;
    keywords: string;
    alt: string;
    path: string;
  }>;
  layout: {
    type: 'redbull' | 'cinematic';
    hero: {
      image: {
        file: string;
        type: string;
        keywords: string;
        alt: string;
        path: string;
      };
      height?: string;
      fullScreen?: boolean;
      overlay?: string;
    };
    sections: any[];
    climaxMoment?: {
      image: any;
      placement: string;
      size: string;
    } | null;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface PostIndex {
  posts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: number;
    heroImage: string;
    style: 'redbull' | 'cinematic';
  }>;
  generatedAt: string;
  totalPosts: number;
}

const GENERATED_DIR = path.join(process.cwd(), 'generated');

// Get all processed posts
export function getAllPosts(): PostIndex['posts'] {
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

// Get a single post by slug
export function getPostBySlug(slug: string): GeneratedPost | null {
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

// Get posts by category
export function getPostsByCategory(category: string): PostIndex['posts'] {
  const allPosts = getAllPosts();
  return allPosts.filter(post =>
    post.category.toLowerCase() === category.toLowerCase()
  );
}

// Get recent posts
export function getRecentPosts(limit: number = 5): PostIndex['posts'] {
  const allPosts = getAllPosts();
  return allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Check if posts are available
export function hasGeneratedPosts(): boolean {
  const indexPath = path.join(GENERATED_DIR, 'index.json');
  return fs.existsSync(indexPath);
}