const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateBlogImages() {
  console.log('Updating blog post images to use Supabase URLs...');
  
  try {
    // Fetch all blog posts
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, content');
    
    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return;
    }
    
    console.log(`Found ${posts.length} blog posts to check`);
    
    const supabaseBaseUrl = 'https://nvoljnojiondyjhxwkqq.supabase.co/storage/v1/object/public/blog-images/';
    
    for (const post of posts) {
      let updatedContent = post.content;
      let hasChanges = false;
      
      // Replace /uploads/ URLs with Supabase URLs
      const uploadsRegex = /\/uploads\/(image-[^"'>\s]+\.(jpg|jpeg|png|gif|webp))/gi;
      
      updatedContent = updatedContent.replace(uploadsRegex, (match, fileName) => {
        hasChanges = true;
        const newUrl = supabaseBaseUrl + fileName;
        console.log(`  ${post.title}: ${match} -> ${newUrl}`);
        return newUrl;
      });
      
      if (hasChanges) {
        // Update the post in the database
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ content: updatedContent })
          .eq('id', post.id);
        
        if (updateError) {
          console.error(`Error updating post ${post.title}:`, updateError);
        } else {
          console.log(`✅ Updated post: ${post.title}`);
        }
      } else {
        console.log(`  No changes needed for: ${post.title}`);
      }
    }
    
    console.log('Blog image URLs updated successfully!');
    
  } catch (error) {
    console.error('Update error:', error);
  }
}

updateBlogImages().catch(console.error);