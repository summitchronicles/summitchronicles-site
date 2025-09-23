// Type definitions for the semantic content pipeline
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

// Client-side safe functions - no file system access
// These functions return empty arrays/null when no data is available
// The actual data loading happens server-side in API routes

export function getAllPosts(): PostIndex['posts'] {
  // This will be replaced with API calls in client components
  // For now, return empty array to prevent build errors
  return [];
}

export function getPostBySlug(slug: string): GeneratedPost | null {
  // This will be replaced with API calls in client components
  // For now, return null to prevent build errors
  return null;
}

export function getPostsByCategory(category: string): PostIndex['posts'] {
  // This will be replaced with API calls in client components
  return [];
}

export function getRecentPosts(limit: number = 5): PostIndex['posts'] {
  // This will be replaced with API calls in client components
  return [];
}

export function hasGeneratedPosts(): boolean {
  // This will be replaced with API calls in client components
  return false;
}