import { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseServer';
import { getArticleSchema, getBreadcrumbSchema } from '@/lib/seo';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = getSupabaseAdmin();

  try {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (!post) {
      return {
        title: 'Post Not Found | Summit Chronicles',
        description: 'The requested blog post could not be found.',
      };
    }

    const title = `${post.title} | Summit Chronicles`;
    const description =
      post.excerpt ||
      post.description ||
      'Expert mountaineering insights from Summit Chronicles';
    const url = `/blogs/${post.slug}`;
    const publishDate = new Date(post.published_at).toISOString();
    const modifiedDate = new Date(
      post.updated_at || post.published_at
    ).toISOString();

    // Generate structured data
    const articleSchema = getArticleSchema({
      title: post.title,
      description: description,
      datePublished: publishDate,
      dateModified: modifiedDate,
      author: post.author || 'Sunith Kumar',
      image: post.featured_image,
      url: url,
    });

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blogs' },
      { name: post.title, url: url },
    ]);

    return {
      title,
      description,
      keywords:
        post.tags?.join(', ') ||
        'mountaineering, seven summits, climbing, expedition planning',
      authors: [{ name: post.author || 'Sunith Kumar' }],
      openGraph: {
        title: post.title,
        description: description,
        type: 'article',
        url: `https://summitchronicles.com${url}`,
        images: post.featured_image
          ? [
              {
                url: `https://summitchronicles.com${post.featured_image}`,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [
              {
                url: 'https://summitchronicles.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Summit Chronicles',
              },
            ],
        publishedTime: publishDate,
        modifiedTime: modifiedDate,
        authors: [post.author || 'Sunith Kumar'],
        section: post.category,
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: post.featured_image
          ? [`https://summitchronicles.com${post.featured_image}`]
          : ['https://summitchronicles.com/og-image.jpg'],
        creator: '@summitchronicles',
      },
      other: {
        // Add structured data as JSON-LD
        'structured-data': JSON.stringify([articleSchema, breadcrumbSchema]),
      },
    };
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return {
      title: 'Blog Post | Summit Chronicles',
      description:
        'Expert mountaineering insights and Seven Summits expedition guidance.',
    };
  }
}

export default function BlogPostLayout({ children, params }: Props) {
  return (
    <>
      {/* Structured Data will be injected by Next.js metadata */}
      {children}
    </>
  );
}
