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
    const authorQuery = `*[_type == "author" && name match "${data.author}"][0]._id`;
    let authorId = await sanityWriteClient.fetch(authorQuery);

    if (!authorId) {
      // Fallback: Fetch ANY author or create a placeholder
      const anyAuthor = await sanityWriteClient.fetch(
        `*[_type == "author"][0]._id`
      );
      authorId = anyAuthor;

      if (!authorId) {
        throw new Error(
          'No author found. Please create an author in Sanity Studio first.'
        );
      }
    }

    // 3. Fetch Category ID
    // We'll search for a category matching the input string, or default to "Stories"
    const categoryQuery = `*[_type == "category" && title match "${data.category}"][0]._id`;
    let categoryId = await sanityWriteClient.fetch(categoryQuery);

    if (!categoryId) {
        // Fallback to first category
       const anyCategory = await sanityWriteClient.fetch(
        `*[_type == "category"][0]._id`
      );
      categoryId = anyCategory;
    }

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
            asset: {
              _type: 'reference',
              _ref: section.imageId,
            },
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
                     text: `[Image Placeholder: ${section.caption || 'No caption'} - ${section.image}]`
                 }
             ]
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

    // 5. Construct Document
    // eslint-disable-next-line
    const doc: any = {
      _type: 'blogPost',
      title: data.title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      excerpt: data.subtitle,
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
    };

    // Attach Featured Image if available as a Sanity Asset
    if (data.heroImageId) {
      doc.featuredImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.heroImageId,
        },
      };
    }

    const result = await sanityWriteClient.create(doc);

    revalidatePath('/blog');
    revalidatePath('/blog/cms');

    return { success: true, slug: result.slug.current };
  } catch (error) {
    console.error('Error publishing post:', error);
    return { success: false, error: 'Failed to publish post' };
  }
}
