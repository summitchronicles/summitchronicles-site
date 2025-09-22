# 📝 Content Pipeline: Markdown to Magazine

Automated semantic content pipeline that transforms markdown files + images into magazine-style blog posts.

## 🚀 Quick Start

### 1. Create a Post
```bash
mkdir -p content/posts/your-post-slug/images
```

### 2. Write Your Content
Create `content/posts/your-post-slug/index.md`:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description for previews"
author: "Your Name"
date: "2024-12-15"
category: "Category Name"
style: "redbull"  # or "cinematic"
location: "Location"
images:
  - file: "hero-image.jpg"
    type: "hero"
    keywords: "mountain, dramatic, wide"
    alt: "Description for accessibility"
  - file: "section-image.jpg"
    type: "section"
    keywords: "training, focus"
    alt: "Training session image"
---

# Introduction
Your opening content here...

# Main Section
Your main content with insights...

> "Pull quotes will be automatically detected"

# Conclusion
Your closing thoughts...
```

### 3. Add Images
Place images in `content/posts/your-post-slug/images/`:
- `hero-image.jpg` (wide/dramatic for header)
- `section-image.jpg` (supporting content)
- etc.

### 4. Process & Generate
```bash
npm run build-posts
```

### 5. View Results
Visit `/blog/generated` to see your semantically processed posts!

---

## 🧠 How the Semantic Engine Works

### Content Analysis
The engine analyzes your markdown content for:
- **Themes**: Introduction, struggle, breakthrough, climax, reflection
- **Keywords**: Mountaineering-specific vocabulary and concepts
- **Pull Quotes**: Automatically extracts blockquotes for emphasis
- **Emotional Arc**: Maps content intensity for optimal image placement

### Image Matching
Smart image placement based on:
- **Type Matching**: Hero images for headers, climax images for peak moments
- **Keyword Matching**: Image keywords matched to content themes
- **Semantic Analysis**: Content meaning matched to image context

### Layout Generation
Creates magazine-style layouts:
- **Red Bull Style**: Bold sections, side images, clear hierarchy
- **Cinematic Style**: Full-screen hero, immersive visual flow

---

## 📁 File Structure

```
content/posts/
├── your-post-slug/
│   ├── index.md              # Your markdown content
│   └── images/
│       ├── hero-image.jpg
│       ├── section-1.jpg
│       └── conclusion.jpg
└── another-post/
    ├── index.md
    └── images/...

generated/                    # Auto-generated (don't edit)
├── index.json               # Posts index
├── your-post-slug.json     # Processed post data
└── another-post.json

scripts/
├── semantic-engine.js       # Core matching logic
└── process-posts.js        # Main processing script
```

---

## 🎨 Image Guidelines

### Image Types
- **hero**: Wide, dramatic images for headers (16:9 or wider)
- **section**: Supporting images for content sections (4:3 or 16:9)
- **climax**: Powerful images for peak moments (any ratio)
- **reflection**: Calm, contemplative images (any ratio)

### Keywords
Use descriptive keywords that match your content:
- `mountain, dramatic, wide, summit`
- `training, preparation, focus, athlete`
- `achievement, victory, triumph, success`
- `contemplation, reflection, wisdom, peace`

---

## ⚙️ Scripts

```bash
# Process all posts
npm run build-posts

# Process single post
npm run build-posts:single your-post-slug

# View generated blog
# Visit: http://localhost:3000/blog/generated
```

---

## 🔧 Advanced Configuration

### Custom Keywords
Edit `scripts/semantic-engine.js` to add domain-specific keywords:

```javascript
this.keywordMap = {
  "hero": ["introduction", "challenge", "goal", "journey"],
  "struggle": ["difficult", "obstacle", "setback", "crisis"],
  // Add your custom mappings...
}
```

### Layout Customization
Modify layout generation in `generateLayout()` method for:
- Image placement rules
- Section emphasis patterns
- Visual rhythm optimization

---

## 🚨 Troubleshooting

### "No generated posts found"
1. Check that `content/posts/your-slug/index.md` exists
2. Run `npm run build-posts`
3. Verify `generated/` directory was created

### Images not appearing
1. Ensure images exist in `content/posts/your-slug/images/`
2. Check image file extensions (.jpg, .jpeg, .png, .webp)
3. Verify image paths in frontmatter match actual filenames

### Content not processing correctly
1. Check markdown frontmatter syntax (YAML between `---`)
2. Ensure required fields: title, author, date
3. Review console output for processing errors

---

## 💡 Tips

- **Keywords**: Be descriptive but concise in image keywords
- **Content Flow**: Structure content with clear sections for better analysis
- **Image Quality**: Use high-resolution images (1200px+ width recommended)
- **Pull Quotes**: Use `>` blockquote syntax for automatic extraction
- **Testing**: Use `npm run build-posts:single your-slug` for faster iteration

---

Built with ❤️ using zero-cost semantic analysis and pure JavaScript processing!