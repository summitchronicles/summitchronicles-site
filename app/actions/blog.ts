'use server';

import { sanityWriteClient } from '@/lib/sanity/client';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

interface EditorSection {
  id: string;
  type: 'text' | 'image' | 'quote';
  content: string;
  image?: string; // This will now be the Sanity Asset ID or URL
  imageId?: string; // Explicit Sanity Asset ID
  caption?: string;
}

interface PublishPostData {
  title: string;
  subtitle: string;
  contentType: 'expedition-update' | 'training-log' | 'field-note' | 'essay';
  category: string;
  author: string;
  heroImage: string; // This might be a placeholder path OR a Sanity Asset ID/URL
  heroImageId?: string; // Explicit Sanity Asset ID for hero
  sections: EditorSection[];
}

export async function publishPost(data: PublishPostData) {
  try {
    // 1. Generate Slug
    const slug = slugify(data.title);

    // 2. Fetch or Create Author (Simple lookup by name for now)
    // In a real app, this would be authenticated user
    const authorId = await sanityWriteClient.fetch<string | null>(
      `*[_type == "author" && name == $author][0]._id`,
      { author: data.author }
    );

    if (!authorId) {
      throw new Error(`No Sanity author exists for "${data.author}".`);
    }

    const categoryId = await sanityWriteClient.fetch<string | null>(
      `*[_type == "category" && title == $category][0]._id`,
      { category: data.category }
    );

    // 4. Convert Sections to Portable Text
    const contentBlocks = data.sections.map((section) => {
      if (section.type === 'quote') {
        return {
          _type: 'block',
          style: 'blockquote',
          children: [
            {
              _type: 'span',
              text: section.content,
            },
          ],
        };
      } else if (section.type === 'image') {
        if (section.imageId) {
          // Real Sanity Image
          return {
            _type: 'image',
            _key: section.id,
            asset: {
              _type: 'reference',
              _ref: section.imageId,
            },
            alt: section.caption || `Story image for ${data.title}`,
            caption: section.caption,
          };
        } else {
          // Placeholder / External Image (fallback to text representation)
          return {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: `[Image Placeholder: ${section.caption || 'No caption'} - ${section.image}]`,
              },
            ],
          };
        }
      } else {
        // Default Text
        // We need to handle line breaks properly for Portable Text if we want multiple paragraphs,
        // but for a simple editor, one block per section is fine.
        return {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: section.content,
            },
          ],
        };
      }
    });

    // 5. Construct document payload for Sanity
    const existingId = await sanityWriteClient.fetch<string | null>(
      `*[_type == "blogPost" && slug.current == $slug][0]._id`,
      { slug }
    );
    const documentId = (existingId || `blogPost.${slug}`).replace(
      /^drafts\./,
      ''
    );
    const doc: any = {
      _id: documentId,
      _type: 'blogPost',
      title: data.title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      excerpt: data.subtitle,
      contentType: data.contentType,
      workflowStatus: 'published',
      author: {
        _type: 'reference',
        _ref: authorId,
      },
      categories: categoryId
        ? [
            {
              _type: 'reference',
              _ref: categoryId,
              _key: categoryId,
            },
          ]
        : [],
      content: contentBlocks,
      publishedAt: new Date().toISOString(),
      isPublished: true,
      isFeatured: false,
      tags: [data.category, 'Summit Chronicles'].filter(Boolean),
    };

    // Attach Featured Image if available as a Sanity Asset
    if (data.heroImageId) {
      doc.featuredImage = {
        _type: 'image',
        alt: `Cover image for ${data.title}`,
        asset: {
          _type: 'reference',
          _ref: data.heroImageId,
        },
      };
    }

    const result = await sanityWriteClient.createOrReplace(doc);

    revalidatePath('/blog');
    revalidatePath('/blog/cms');

    return { success: true, slug: result.slug.current };
  } catch (error) {
    console.error('Error publishing post:', error);
    return { success: false, error: 'Failed to publish post' };
  }
}
