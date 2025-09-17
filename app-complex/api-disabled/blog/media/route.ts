import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('blog_media')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (postId) {
      if (postId === 'null' || postId === 'unassigned') {
        query = query.is('post_id', null);
      } else {
        query = query.eq('post_id', postId);
      }
    }

    const { data: media, error } = await query;

    if (error) {
      console.error('Media fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add full URL to each media item
    const mediaWithUrls =
      media?.map((item) => ({
        ...item,
        url: item.file_path,
      })) || [];

    return NextResponse.json({ media: mediaWithUrls });
  } catch (error) {
    console.error('Media API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('id');

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      );
    }

    // Get media record first
    const { data: media, error: fetchError } = await supabase
      .from('blog_media')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (fetchError || !media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Extract file path from URL for storage deletion
    const filePath = `blog-media/${media.filename}`;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('blog-media')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('blog_media')
      .delete()
      .eq('id', mediaId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json(
        { error: 'Failed to delete media record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
