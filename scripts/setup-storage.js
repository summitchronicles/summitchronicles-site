const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStorage() {
  console.log('Setting up Supabase storage...');
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'blog-images');
    
    if (!bucketExists) {
      console.log('Creating blog-images bucket...');
      
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('blog-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('✅ blog-images bucket created successfully');
      }
    } else {
      console.log('✅ blog-images bucket already exists');
    }
    
    // Set up RLS policy for public read access
    console.log('Setting up storage policies...');
    
    // Note: This should be done via Supabase dashboard or SQL for security
    console.log('⚠️  Please ensure the blog-images bucket has public read access in your Supabase dashboard');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupStorage();