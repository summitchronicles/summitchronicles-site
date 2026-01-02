import Image from 'next/image';
import { getPostBySlugServer, hasGeneratedPostsServer } from '@/lib/posts-server';
import { notFound } from 'next/navigation';
import { RedBullBlogPost, CinematicBlogPost } from '../../components/blog';

// Convert generated post to component format
function convertToComponentFormat(post: any) {
  // Extract title from the content
  const titleMatch = post.content.raw.match(/🔹 Blog Title:\s*(.*?)(?=\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : post.slug.replace(/-/g, ' ');

  // Extract subtitle
  const subtitleMatch = post.content.raw.match(/🔹 Subtitle:\s*(.*?)(?=🔹|$)/s);
  const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

  // Extract location
  const locationMatch = post.content.raw.match(/🔹 Location:\s*(.*?)(?=🔹|$)/s);
  const location = locationMatch ? locationMatch[1].trim() : 'Training Grounds, California';

  // Extract intro
  const introMatch = post.content.raw.match(/🔹 Introduction[^:]*:\s*(.*?)(?=⸻|🔹|$)/s);
  const intro = introMatch ? introMatch[1].trim() : '';

  // Parse sections from the raw content and extract hero image
  const sections: Array<{
    title: string;
    content: string;
    pullQuote: string | null;
    image: string | null;
  }> = [];
  let heroImage = '/stories/default.jpg';
  const sectionMatches = post.content.raw.match(/🔹 Section \d+[\s\S]*?(?=🔹 Section \d+|🏷️|$)/g);

  if (sectionMatches) {
    sectionMatches.forEach((sectionText: string, index: number) => {
      // Extract section title
      const titleMatch = sectionText.match(/Section Title:\s*(.*?)(?=\n|$)/);
      const sectionTitle = titleMatch ? titleMatch[1].trim() : `Section ${index + 1}`;

      // Extract content - everything between "Content:" and next bullet point or section break
      const contentMatch = sectionText.match(/Content:\s*([\s\S]*?)(?=\t•\t(?:Image|Pull Quote)|⸻|$)/);
      const sectionContent = contentMatch ? contentMatch[1].trim() : '';

      // Extract pull quote if exists
      const pullQuoteMatch = sectionText.match(/Pull Quote:\s*"([^"]*?)"/);
      const pullQuote = pullQuoteMatch ? pullQuoteMatch[1] : null;

      // Extract image if exists
      const imageMatch = sectionText.match(/Image:\s*([^\n\t]+)/);
      const image = imageMatch ? `/content/posts/${post.slug}/images/${imageMatch[1].trim()}` : null;

      // Use first section image as hero image if not set
      if (image && heroImage === '/stories/default.jpg') {
        heroImage = image;
      }

      if (sectionTitle && sectionContent) {
        sections.push({
          title: sectionTitle,
          content: sectionContent,
          pullQuote: pullQuote,
          image: image
        });
      }
    });
  }

  return {
    title: title,
    excerpt: subtitle,
    location: location,
    author: { name: 'Sunith Kumar' },
    publishedAt: new Date().toISOString(),
    readTime: post.metadata?.readTime || 5,
    categories: [{ title: 'STORIES' }],
    mainImage: heroImage,
    content: {
      intro: intro,
      sections: sections
    }
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Try to get generated post first
  if (hasGeneratedPostsServer()) {
    const post = getPostBySlugServer(params.slug);

    if (post) {
      const componentData = convertToComponentFormat(post);
      const style = post.metadata?.style || 'redbull';

      return (
        <div className="min-h-screen bg-black">
          {style === 'cinematic' ? (
            <CinematicBlogPost
              post={componentData}
              slug={params.slug}
            />
          ) : (
            <RedBullBlogPost
              post={componentData}
              slug={params.slug}
            />
          )}
        </div>
      );
    }
  }

  // Post not found - return 404
  notFound();
}
