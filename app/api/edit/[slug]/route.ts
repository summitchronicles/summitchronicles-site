import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

interface Section {
  title: string;
  content: string;
  image?: string;
  pullQuote?: string;
}

function parseMarkdownContent(markdownContent: string) {
  const lines = markdownContent.split('\n');

  let title = '';
  let subtitle = '';
  let heroImage = '';
  let location = 'Training Grounds, California';
  const sections: Section[] = [];

  let currentSection: Partial<Section> = {};
  let currentSectionNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('🔹 Blog Title:')) {
      title = lines[i + 2]?.trim() || '';
    } else if (line.startsWith('🔹 Subtitle:')) {
      subtitle = lines[i + 2]?.trim() || '';
    } else if (line.startsWith('🔹 Location:')) {
      location = lines[i + 2]?.trim() || 'Training Grounds, California';
    } else if (line.startsWith('🔹 Section')) {
      // Save previous section if it exists
      if (currentSection.title && currentSection.content) {
        sections.push(currentSection as Section);
      }

      currentSection = {};
      currentSectionNumber++;
    } else if (line.includes('Section Title:')) {
      currentSection.title = line.replace(/.*Section Title:\s*/, '').trim();
    } else if (line.includes('Content:')) {
      // Get content from subsequent lines
      let content = '';
      let j = i + 2; // Skip the Content: line and next empty line

      while (j < lines.length && !lines[j].startsWith('•') && !lines[j].startsWith('⸻') && !lines[j].startsWith('🔹')) {
        if (lines[j].trim()) {
          content += lines[j].trim() + '\n';
        }
        j++;
      }
      currentSection.content = content.trim();
    } else if (line.includes('Image:')) {
      const imageMatch = line.match(/Image:\s*([^\n\t]+)/);
      if (imageMatch) {
        currentSection.image = imageMatch[1].trim();
      }
    } else if (line.includes('Pull Quote:')) {
      const quoteMatch = line.match(/Pull Quote:\s*"([^"]*?)"/);
      if (quoteMatch) {
        currentSection.pullQuote = quoteMatch[1];
      }
    }
  }

  // Add the last section
  if (currentSection.title && currentSection.content) {
    sections.push(currentSection as Section);
  }

  // Get hero image from first image or set default
  heroImage = sections[0]?.image || 'Blog-1.jpg';

  return { title, subtitle, heroImage, location, sections };
}

function generateMarkdownContent(title: string, subtitle: string, heroImage: string, location: string, sections: Section[]) {
  let markdown = `🔹 Blog Title:\n\n${title}\n\n🔹 Subtitle:\n\n${subtitle}\n\n🔹 Location:\n\n${location}\n\n🔹 Introduction (Top Intro Box):\n\n⸻\n\n`;

  sections.forEach((section, index) => {
    markdown += `🔹 Section ${index + 1}\n`;
    markdown += `\t•\tSection Title: ${section.title}\n`;
    markdown += `\t•\tContent:\n\n${section.content}\n\n`;

    if (section.image) {
      markdown += `\t•\tImage: ${section.image}\n`;
    }

    if (section.pullQuote) {
      markdown += `\t•\tPull Quote: "${section.pullQuote}"\n`;
    }

    markdown += `\n⸻\n\n`;
  });

  markdown += `🏷️ Tags (at the bottom)\n\nAdd tags like:\n\nmountaineering, tuberculosis recovery, seven summits, kilimanjaro, sar pass, himalayas, expedition blog\n\n`;

  return markdown;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const postDir = path.join(CONTENT_DIR, params.slug);
    const markdownPath = path.join(postDir, 'index.md');
    const imagesDir = path.join(postDir, 'images');

    if (!fs.existsSync(markdownPath)) {
      return NextResponse.json({ success: false, error: 'Post not found' });
    }

    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    const parsedContent = parseMarkdownContent(markdownContent);

    // Get available images
    let availableImages: string[] = [];
    if (fs.existsSync(imagesDir)) {
      availableImages = fs.readdirSync(imagesDir)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    }

    return NextResponse.json({
      success: true,
      post: parsedContent,
      availableImages
    });
  } catch (error) {
    console.error('Error loading post:', error);
    return NextResponse.json({ success: false, error: 'Failed to load post' });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { title, subtitle, heroImage, location, sections } = await request.json();

    const postDir = path.join(CONTENT_DIR, params.slug);
    const markdownPath = path.join(postDir, 'index.md');

    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const markdownContent = generateMarkdownContent(title, subtitle, heroImage, location, sections);
    fs.writeFileSync(markdownPath, markdownContent, 'utf8');

    // Regenerate the processed content
    const { exec } = require('child_process');
    exec('npm run build-posts', { cwd: process.cwd() }, (error: any) => {
      if (error) {
        console.error('Error rebuilding posts:', error);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ success: false, error: 'Failed to save post' });
  }
}