const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateImages() {
  console.log('Starting image migration to Supabase Storage...');
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found');
    return;
  }
  
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );
  
  console.log(`Found ${imageFiles.length} images to migrate`);
  
  for (const fileName of imageFiles) {
    console.log(`Migrating ${fileName}...`);
    
    try {
      const filePath = path.join(uploadsDir, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, fileBuffer, {
          contentType: getContentType(fileName),
          cacheControl: '3600',
          upsert: true // Allow overwrite if exists
        });
      
      if (error) {
        console.error(`Error uploading ${fileName}:`, error);
      } else {
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);
        
        console.log(`✅ ${fileName} -> ${publicUrlData.publicUrl}`);
      }
    } catch (err) {
      console.error(`Error processing ${fileName}:`, err);
    }
  }
  
  console.log('Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Update blog post content to use new Supabase URLs');
  console.log('2. Replace /uploads/ URLs with https://nvoljnojiondyjhxwkqq.supabase.co/storage/v1/object/public/blog-images/');
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return types[ext] || 'image/jpeg';
}

migrateImages().catch(console.error);