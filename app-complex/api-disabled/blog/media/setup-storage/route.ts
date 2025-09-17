import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up Supabase Storage for blog media...');

    // Create the blog-media bucket
    const { data: bucketData, error: bucketError } =
      await supabase.storage.createBucket('blog-media', {
        public: true,
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });

    if (bucketError) {
      // Check if bucket already exists
      if (bucketError.message.includes('already exists')) {
        console.log('Storage bucket already exists');
      } else {
        console.error('Bucket creation error:', bucketError);
        return NextResponse.json(
          {
            error: 'Failed to create storage bucket',
            details: bucketError.message,
          },
          { status: 500 }
        );
      }
    }

    // Set up bucket policies for public access
    const { error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'blog-media',
      policy_name: 'Public Access',
      definition: {
        role: 'public',
        allowed_operation: 'SELECT',
      },
    });

    if (policyError) {
      console.log('Policy setup note:', policyError.message);
      // This may fail if policies already exist, which is okay
    }

    return NextResponse.json({
      message: 'Storage setup completed successfully!',
      status: 'success',
      bucket: 'blog-media',
    });
  } catch (error) {
    console.error('Storage setup error:', error);
    return NextResponse.json(
      {
        error: 'Failed to set up storage',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
