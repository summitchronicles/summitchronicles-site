import { NextResponse } from 'next/server';
import { MarkdownContentRepository } from '@/modules/content/infrastructure/markdown-content-repository';
import { queries, sanityClient, urlFor } from '@/lib/sanity/client';

const repository = new MarkdownContentRepository();

export async function GET() {
  try {
    const { posts: markdownPosts, issues } =
      await repository.listPublishedPosts();
    let sanityPosts: typeof markdownPosts = [];

    try {
      const documents = await sanityClient.fetch(queries.allPosts);
      sanityPosts = documents.map((post: any) => {
        const plainText = portableTextToPlainText(post.content);
        return {
          slug: post.slug?.current || post._id,
          title: post.title || 'Untitled story',
          subtitle: post.excerpt || plainText.slice(0, 150),
          author: post.author?.name || 'Sunith Kumar',
          date: post.publishedAt || post._createdAt,
          category: (post.categories?.[0]?.title || 'Field Note').toUpperCase(),
          image: post.featuredImage
            ? urlFor(post.featuredImage).width(1600).height(1000).url()
            : '/images/sunith-visionary-planning.png',
          readTime: `${Math.max(1, Math.ceil(plainText.split(/\s+/).filter(Boolean).length / 200))} min read`,
          status: 'published',
        };
      });
    } catch (error) {
      console.error('Sanity stories could not be loaded:', error);
    }

    const posts = Array.from(
      new Map(
        [...markdownPosts, ...sanityPosts].map((post) => [post.slug, post])
      ).values()
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

function portableTextToPlainText(content: unknown) {
  if (!Array.isArray(content)) return '';
  return content
    .filter((block) => block && typeof block === 'object')
    .map((block: any) =>
      Array.isArray(block.children)
        ? block.children.map((child: any) => child.text || '').join('')
        : ''
    )
    .filter(Boolean)
    .join('\n\n');
}
