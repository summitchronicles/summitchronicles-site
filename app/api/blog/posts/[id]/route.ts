import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if id is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(blog_tags(name, slug, color))
      `);

    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data: post, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      console.error('Blog post fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get category color separately
    const { data: category } = await supabase
      .from('blog_categories')
      .select('color')
      .eq('name', post.category)
      .single();

    // Format the response
    const formattedPost = {
      ...post,
      tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || [],
      category_color: category?.color || '#D97706'
    };

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Blog post API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      status,
      featured,
      meta_title,
      meta_description,
      tags = [],
      scheduled_for,
      read_time
    } = body;

    // Check if the post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, slug, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If slug is changing, check for conflicts
    if (slug && slug !== existingPost.slug) {
      const { data: conflictPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (conflictPost) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
    }

    // Prepare update data
    const updateData: any = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content && { content }),
      ...(category && { category }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(meta_title !== undefined && { meta_title }),
      ...(meta_description !== undefined && { meta_description }),
      ...(read_time !== undefined && { read_time }),
      ...(scheduled_for !== undefined && { 
        scheduled_for: scheduled_for ? new Date(scheduled_for).toISOString() : null 
      })
    };

    // Handle published_at when status changes to published
    if (status === 'published' && existingPost.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    // Update the post
    const { data: updatedPost, error: updateError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Post update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Handle tags update
    if (tags.length >= 0) { // Allow empty array to clear tags
      // Remove existing tag relationships
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id);

      if (tags.length > 0) {
        // Create new tags if they don't exist
        for (const tagName of tags) {
          const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await supabase
            .from('blog_tags')
            .upsert({ name: tagName, slug: tagSlug });
        }

        // Get tag IDs and create relationships
        const { data: tagData } = await supabase
          .from('blog_tags')
          .select('id, name')
          .in('name', tags);

        if (tagData) {
          const postTagRelations = tagData.map(tag => ({
            post_id: id,
            tag_id: tag.id
          }));

          await supabase
            .from('blog_post_tags')
            .insert(postTagRelations);
        }
      }
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Blog post update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Post deletion error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}