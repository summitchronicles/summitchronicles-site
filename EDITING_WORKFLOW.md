# ✏️ Editing Workflow: How to Edit Generated Posts

## 📝 **Simple Editing Process**

Your generated blog posts are created from markdown files, so editing is straightforward:

### **1. Edit the Source Markdown**
```bash
# Edit your original content
code content/posts/mental-game-everest/index.md
```

### **2. Regenerate the Post**
```bash
# Regenerate the specific post
npm run build-posts:single mental-game-everest

# Or regenerate all posts
npm run build-posts
```

### **3. View Changes**
Visit `/blog` to see your updated post with the new semantic layout.

---

## 🔄 **What You Can Edit**

### **Content Changes**
- **Title & Metadata**: Update frontmatter in your markdown file
- **Text Content**: Edit any section content
- **Pull Quotes**: Add/remove `>` blockquotes
- **Structure**: Add/remove sections with `#` headers

### **Image Changes**
- **Add Images**: Place new images in `content/posts/your-slug/images/`
- **Update Image Metadata**: Modify keywords, alt text, type in frontmatter
- **Reorder Images**: Change the order in the frontmatter `images` array

### **Layout Changes**
- **Switch Styles**: Change `style: "redbull"` to `style: "cinematic"` (or vice versa)
- **Category**: Update `category` field to change theming

---

## 🚀 **Quick Edit Commands**

```bash
# Edit a specific post
code content/posts/your-post-slug/index.md

# Quick regenerate & preview
npm run build-posts:single your-post-slug && open http://localhost:3000/blog

# Edit and watch for changes (manual regeneration)
code content/posts/ # Edit files
npm run build-posts # Regenerate when ready
```

---

## 📁 **File Locations**

### **Source Files (Edit These)**
```
content/posts/your-post/
├── index.md              # ✏️ EDIT THIS
└── images/               # ✏️ ADD/REMOVE IMAGES HERE
    ├── hero.jpg
    └── section.jpg
```

### **Generated Files (Don't Edit)**
```
generated/                # 🚫 AUTO-GENERATED
├── index.json           # Don't edit directly
└── your-post.json       # Don't edit directly
```

---

## 💡 **Pro Tips**

### **Quick Content Updates**
- **Small text changes**: Edit markdown → regenerate → refresh browser
- **New sections**: Add `# Section Title` and content → regenerate
- **Image placement**: Modify `keywords` in frontmatter to improve matching

### **Layout Experimentation**
- **Try both styles**: Switch between `"redbull"` and `"cinematic"` styles
- **Image types**: Experiment with `"hero"`, `"section"`, `"climax"`, `"reflection"`
- **Keywords**: Use descriptive keywords that match your content themes

### **Workflow Optimization**
- **Keep terminal open**: Run regeneration commands quickly
- **Use VS Code**: Syntax highlighting for markdown + quick file switching
- **Preview as you go**: Check `/blog` after each regeneration

---

## 🔍 **Common Editing Scenarios**

### **Scenario 1: Fix a Typo**
```bash
# 1. Edit the markdown file
code content/posts/mental-game-everest/index.md
# Fix the typo in the content

# 2. Regenerate
npm run build-posts:single mental-game-everest

# 3. Refresh browser at /blog
```

### **Scenario 2: Add a New Image**
```bash
# 1. Add image file
cp your-new-image.jpg content/posts/mental-game-everest/images/

# 2. Update frontmatter in index.md
images:
  # ... existing images ...
  - file: "your-new-image.jpg"
    type: "section"
    keywords: "training, focus, determination"
    alt: "New training session image"

# 3. Regenerate
npm run build-posts:single mental-game-everest
```

### **Scenario 3: Change the Layout Style**
```bash
# 1. Edit frontmatter in index.md
style: "cinematic"  # Change from "redbull"

# 2. Regenerate
npm run build-posts:single mental-game-everest

# 3. See the dramatic cinematic layout!
```

### **Scenario 4: Improve Image Placement**
```bash
# 1. Update image keywords in frontmatter
images:
  - file: "summit-photo.jpg"
    type: "climax"                    # Was "section"
    keywords: "achievement, victory, summit, triumph"  # More specific
    alt: "Triumphant summit moment"

# 2. Regenerate to see better semantic matching
npm run build-posts:single mental-game-everest
```

---

## ⚡ **Development Workflow**

For fast iteration while writing:

```bash
# Terminal 1: Keep dev server running
npm run dev

# Terminal 2: Edit and regenerate
code content/posts/your-post/index.md
# Make changes...
npm run build-posts:single your-post
# Refresh browser → see changes
```

---

The beauty of this system: **Edit markdown, regenerate, see magazine-quality results instantly!**