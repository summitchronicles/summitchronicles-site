import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(blog_tags(name, slug, color))
      `)
      .eq('status', status)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured) {
      query = query.eq('featured', featured === 'true');
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Blog posts fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get category colors separately
    const { data: categories } = await supabase
      .from('blog_categories')
      .select('name, color');

    const categoryColors = categories?.reduce((acc, cat) => {
      acc[cat.name] = cat.color;
      return acc;
    }, {} as Record<string, string>) || {};

    // Format the response to match our frontend expectations
    const formattedPosts = data?.map(post => ({
      ...post,
      tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || [],
      category_color: categoryColors[post.category] || '#D97706'
    })) || [];

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      status = 'draft',
      featured = false,
      meta_title,
      meta_description,
      tags = [],
      scheduled_for,
      read_time
    } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', finalSlug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create the blog post
    const postData = {
      title,
      slug: finalSlug,
      excerpt,
      content,
      category,
      status,
      featured,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt,
      read_time,
      published_at: status === 'published' ? new Date().toISOString() : null,
      scheduled_for: scheduled_for ? new Date(scheduled_for).toISOString() : null
    };

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (postError) {
      console.error('Post creation error:', postError);
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    // Handle tags if provided
    if (tags.length > 0) {
      // First, ensure all tags exist
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const { error: tagError } = await supabase
          .from('blog_tags')
          .upsert({ name: tagName, slug: tagSlug });
          
        if (tagError) {
          console.error('Tag creation error:', tagError);
        }
      }

      // Get tag IDs
      const { data: tagData } = await supabase
        .from('blog_tags')
        .select('id, name')
        .in('name', tags);

      if (tagData) {
        // Create post-tag relationships
        const postTagRelations = tagData.map(tag => ({
          post_id: post.id,
          tag_id: tag.id
        }));

        const { error: relationError } = await supabase
          .from('blog_post_tags')
          .insert(postTagRelations);

        if (relationError) {
          console.error('Post-tag relation error:', relationError);
        }
      }
    }

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Blog post creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}