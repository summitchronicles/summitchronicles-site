// Simulation of the bug in VisualEditorLogic.tsx

const filename = '2026-01-15-uncovering.md';
const markdown = `---
title: My Blog
image: /stories/monastery.jpeg
---

# Hello World
`;

// Mock Parser output
const parsedData = {
  intro: '',
  sections: [],
  introImage: null,
  metadata: {
    title: 'My Blog',
    image: '/stories/monastery.jpeg',
  },
};

// 1. VisualEditorLogic Component Data Construction (The Buggy Part)
const componentData = {
  title: 'My Blog',
  heroImage: parsedData.metadata.image || '/stories/default.jpg', // WE SET 'heroImage' HERE
  // mainImage is MISSING
};

// 2. RedBullBlogPost Props Processing (The Consumer)
// It expects 'mainImage'
function getDisplayPost(post: any) {
  return {
    // The bug: post.mainImage is undefined, so it falls back to default
    heroImage: post.mainImage || '/stories/everest-prep.jpeg',
  };
}

const displayPost = getDisplayPost(componentData);
console.log('ACTUAL HERO IMAGE RENDERED:', displayPost.heroImage);

// 3. User clicks "Replace Image"
const activeImageSrc = displayPost.heroImage; // THIS IS THE DEFAULT IMAGE, NOT THE FILE IMAGE
console.log('ACTIVE IMAGE SRC (What regex uses):', activeImageSrc);

// 4. Replacement Logic
const newImageUrl = '/uploads/my-new-hero.jpg';
let newMarkdown = markdown;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

if (true /* we assume click was on hero */) {
  if (parsedData.metadata.image) {
    // Regex construction using the WRONG activeImageSrc
    const regex = new RegExp(`(image:\\s*)(${escapeRegExp(activeImageSrc)})`);

    console.log('REGEX SOURCE:', regex.source);

    if (regex.test(newMarkdown)) {
      console.log('Match FOUND (Unexpected!)');
      newMarkdown = newMarkdown.replace(regex, `$1${newImageUrl}`);
    } else {
      console.log('Match FAILED (Expected failure)');

      // Fallback Logic
      const fallbackRegex = /image: .*/;
      if (fallbackRegex.test(newMarkdown)) {
        console.log('Fallback: Match FOUND. Replacing...');
        newMarkdown = newMarkdown.replace(
          fallbackRegex,
          `image: ${newImageUrl}`
        );
      }
    }
  }
}

console.log('--------------------------------------------------');
console.log('MARKDOWN RESULT:');
console.log(newMarkdown);

console.log('--------------------------------------------------');
if (newMarkdown.includes(newImageUrl)) {
  console.log('SUCCESS: Image updated (via fallback?)');
} else {
  console.log('FAILURE: Image NOT updated');
}
