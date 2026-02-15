import {
  parseMarkdownToRedBull,
  convertRedBullToMarkdown,
} from '../lib/markdown-utils';

const sampleMarkdown = `\`\`\`yml
---
title: "Original Title"
subtitle: "Original Subtitle"
author: "Test Author"
date: "2026-02-01"
heroImage: "/images/hero.jpg"
tags: ["tag1", "tag2"]
---
\`\`\`

### Section 1
Content 1

[IMAGE: Placeholder Description]

### Section 2
Content 2
`;

function runEval() {
  console.log('--- Starting Editor Logic Eval ---');

  // 1. Test Parsing
  console.log('\n1. Testing Parser...');
  const parsed = parseMarkdownToRedBull(sampleMarkdown, 'test-slug');

  if (parsed.metadata.title !== 'Original Title') {
    console.error(
      '❌ FAILED: Title parsing incorrect. Got:',
      parsed.metadata.title
    );
  } else {
    console.log('✅ Title parsed correctly');
  }

  if (parsed.metadata.subtitle !== 'Original Subtitle') {
    console.error(
      '❌ FAILED: Subtitle parsing incorrect. Got:',
      parsed.metadata.subtitle
    );
  } else {
    console.log('✅ Subtitle parsed correctly');
  }

  const sectionImage = parsed.sections[0]?.image;
  if (!sectionImage || !sectionImage.startsWith('placeholder:')) {
    console.error(
      '❌ FAILED: Placeholder image not detected. Got:',
      sectionImage
    );
  } else {
    console.log('✅ Placeholder image detected:', sectionImage);
  }

  // 2. Test Serialization (Round Trip)
  console.log('\n2. Testing Serialization (Round Trip)...');
  // Simulate state
  const postData = {
    title: 'New Edited Title', // Changed
    subtitle: parsed.metadata.subtitle,
    author: parsed.metadata.author,
    date: parsed.metadata.date,
    heroImage: parsed.metadata.heroImage,
    tags: parsed.metadata.tags,
    content: {
      intro: parsed.intro,
      sections: parsed.sections,
    },
  };

  const newMarkdown = convertRedBullToMarkdown(postData, parsed.metadata);

  if (!newMarkdown.includes('title: "New Edited Title"')) {
    console.error('❌ FAILED: Serialized markdown missing new title.');
    console.log('OUTPUT:\n', newMarkdown);
  } else {
    console.log('✅ Serialization includes new title');
  }

  if (newMarkdown.includes('```yml')) {
    console.error('❌ FAILED: Serialized markdown includes ```yml artifact.');
  } else {
    console.log('✅ Serialized markdown is clean of artifacts');
  }

  console.log('\n--- Eval Complete ---');
}

runEval();
