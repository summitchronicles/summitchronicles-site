import { NextResponse } from 'next/server';
import { MarkdownContentRepository } from '@/modules/content/infrastructure/markdown-content-repository';

const repository = new MarkdownContentRepository();

export async function GET() {
  try {
    const { posts, issues } = await repository.listPublishedPosts();

    return NextResponse.json({
      success: true,
      posts,
      issuesCount: issues.length,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        posts: [],
        error: 'Failed to fetch posts',
      },
      { status: 500 }
    );
  }
}
