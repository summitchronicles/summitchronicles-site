import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: tags, error } = await supabase
      .from('blog_tags')
      .select(
        `
        *,
        blog_post_tags(count)
      `
      )
      .order('name', { ascending: true });

    if (error) {
      console.error('Tags fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format tags with usage count
    const formattedTags =
      tags?.map((tag) => ({
        ...tag,
        usage_count: tag.blog_post_tags?.length || 0,
      })) || [];

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error('Tags API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { data: tag, error } = await supabase
      .from('blog_tags')
      .insert({
        name,
        slug,
        color: color || '#6B7280',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        return NextResponse.json(
          { error: 'Tag name already exists' },
          { status: 409 }
        );
      }
      console.error('Tag creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (error) {
    console.error('Tag creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
