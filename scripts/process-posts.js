const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const SimpleSemanticMatcher = require('./semantic-engine');

class PostProcessor {
  constructor() {
    this.semanticMatcher = new SimpleSemanticMatcher();
    this.postsDir = path.join(process.cwd(), 'content', 'posts');
    this.outputDir = path.join(process.cwd(), 'generated');
  }

  // Ensure output directory exists
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // Process images in post directory
  processImages(postPath, images) {
    const imagesDir = path.join(postPath, 'images');
    const processedImages = [];

    if (!fs.existsSync(imagesDir)) {
      console.warn(`No images directory found in ${postPath}`);
      return processedImages;
    }

    // Process each image from frontmatter
    (images || []).forEach(imageConfig => {
      const imagePath = path.join(imagesDir, imageConfig.file);

      if (fs.existsSync(imagePath)) {
        const processedImage = {
          ...imageConfig,
          path: `/content/posts/${path.basename(postPath)}/images/${imageConfig.file}`,
          type: imageConfig.type || this.semanticMatcher.inferImageType(
            imageConfig.file,
            imageConfig.keywords || ''
          )
        };
        processedImages.push(processedImage);
      } else {
        console.warn(`Image not found: ${imagePath}`);
      }
    });

    // Auto-discover images if none specified
    if (processedImages.length === 0) {
      const imageFiles = fs.readdirSync(imagesDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

      imageFiles.forEach((file, index) => {
        processedImages.push({
          file: file,
          path: `/content/posts/${path.basename(postPath)}/images/${file}`,
          type: this.semanticMatcher.inferImageType(file),
          keywords: '',
          alt: `Image ${index + 1} for ${path.basename(postPath)}`
        });
      });
    }

    return processedImages;
  }

  // Process a single post
  processPost(postSlug) {
    const postPath = path.join(this.postsDir, postSlug);
    const markdownFile = path.join(postPath, 'index.md');

    if (!fs.existsSync(markdownFile)) {
      console.warn(`No index.md found in ${postPath}`);
      return null;
    }

    try {
      console.log(`Processing post: ${postSlug}`);

      // Parse markdown with frontmatter
      const fileContent = fs.readFileSync(markdownFile, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);

      // Process images
      const images = this.processImages(postPath, frontmatter.images);

      // Extract and analyze content sections
      const sections = this.semanticMatcher.extractSections(content);
      const matchedSections = this.semanticMatcher.matchImages(sections, images);

      // Generate layout
      const layout = this.semanticMatcher.generateLayout(
        frontmatter.style || 'redbull',
        matchedSections,
        images,
        frontmatter
      );

      // Prepare final output
      const processedPost = {
        slug: postSlug,
        metadata: {
          ...frontmatter,
          processedAt: new Date().toISOString(),
          wordCount: content.split(/\s+/).length,
          readTime: Math.ceil(content.split(/\s+/).length / 200) // ~200 WPM
        },
        content: {
          raw: content,
          sections: matchedSections
        },
        images: images,
        layout: layout,
        seo: {
          title: frontmatter.title,
          description: frontmatter.excerpt || sections[0]?.content.substring(0, 160) + '...',
          ogImage: images.find(img => img.type === 'hero')?.path || images[0]?.path
        }
      };

      // Write processed data
      const outputFile = path.join(this.outputDir, `${postSlug}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(processedPost, null, 2));

      console.log(`✅ Processed: ${postSlug} -> ${outputFile}`);
      return processedPost;

    } catch (error) {
      console.error(`❌ Error processing ${postSlug}:`, error.message);
      return null;
    }
  }

  // Process all posts
  processAllPosts() {
    this.ensureOutputDir();

    if (!fs.existsSync(this.postsDir)) {
      console.error(`Posts directory not found: ${this.postsDir}`);
      process.exit(1);
    }

    const postDirs = fs.readdirSync(this.postsDir)
      .filter(item => {
        const itemPath = path.join(this.postsDir, item);
        return fs.statSync(itemPath).isDirectory();
      });

    if (postDirs.length === 0) {
      console.log('No post directories found.');
      return;
    }

    console.log(`Found ${postDirs.length} post(s) to process...`);

    const processed = [];
    postDirs.forEach(postSlug => {
      const result = this.processPost(postSlug);
      if (result) processed.push(result);
    });

    // Generate index file
    const indexData = {
      posts: processed.map(post => ({
        slug: post.slug,
        title: post.metadata.title,
        excerpt: post.metadata.excerpt || post.content.sections[0]?.content.substring(0, 160) + '...',
        date: post.metadata.date,
        category: post.metadata.category,
        readTime: post.metadata.readTime,
        heroImage: post.images.find(img => img.type === 'hero')?.path || post.images[0]?.path,
        style: post.metadata.style || 'redbull'
      })),
      generatedAt: new Date().toISOString(),
      totalPosts: processed.length
    };

    fs.writeFileSync(
      path.join(this.outputDir, 'index.json'),
      JSON.stringify(indexData, null, 2)
    );

    console.log(`\n🎉 Successfully processed ${processed.length} post(s)`);
    console.log(`📝 Index file created: ${path.join(this.outputDir, 'index.json')}`);
  }
}

// CLI usage
if (require.main === module) {
  const processor = new PostProcessor();

  const command = process.argv[2];
  if (command === 'single' && process.argv[3]) {
    processor.processPost(process.argv[3]);
  } else {
    processor.processAllPosts();
  }
}

module.exports = PostProcessor;