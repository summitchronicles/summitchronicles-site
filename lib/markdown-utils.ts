export function parseMarkdownToRedBull(mdContent: string, slug: string) {
  // Normalize newlines
  let text = mdContent.replace(/\r\n/g, '\n');

  // Remove potential markdown code blocks wrapping the frontmatter (common in LLM output)
  if (text.startsWith('```yml') || text.startsWith('```yaml')) {
    text = text.replace(/^```(yml|yaml)\n/, '').replace(/---\n```\n?/, '---\n');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\n/, '').replace(/---\n```\n?/, '---\n');
  }

  // Split into lines to process line-by-line
  const lines = text.split('\n');

  const sections: any[] = [];
  let currentSection = { title: '', content: '', image: null as string | null };
  let intro = '';
  let isIntro = true;
  let firstImage = null;

  let inFrontmatter = false;
  let frontmatterDone = false;

  // Pre-parse frontmatter to get values for comparison
  const metadata: any = {};
  // Use 'text' which might have been cleaned of ``` wrappers
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatterLines = frontmatterMatch[1].split('\n');
    frontmatterLines.forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts
          .slice(1)
          .join(':')
          .trim()
          .replace(/^['"]|['"]$/g, '');
        metadata[key] = value;
      }
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle Frontmatter Block Skipping
    if (line.startsWith('---')) {
      if (!frontmatterDone) {
        if (inFrontmatter) {
          inFrontmatter = false; // Closing fence
          frontmatterDone = true;
        } else {
          inFrontmatter = true; // Opening fence
        }
        continue;
      }
    }

    if (inFrontmatter) continue;
    if (!line) continue;

    // Check for Image: ![alt](url) OR [IMAGE: description]
    const imgMatch =
      line.match(/!\[.*?\]\((.*?)\)/) || line.match(/^\[IMAGE:\s*(.*?)\]/i);
    if (imgMatch) {
      // If it's a standard markdown image, match[1] is the URL.
      // If it's a placeholder [IMAGE: ...], match[1] is the description.
      const isStandard = line.includes('](');
      // Use "placeholder:" prefix so the UI can render a text box instead of a broken image
      const imgUrl = isStandard ? imgMatch[1] : `placeholder:${imgMatch[1]}`;

      if (!firstImage) firstImage = imgUrl;

      if (isIntro) {
        // allow image in intro
      } else {
        currentSection.image = imgUrl;
      }
      continue;
    }

    // Check for Headers: ## Title, ### Title, or **Title**
    const isHeader =
      line.startsWith('## ') ||
      line.startsWith('### ') ||
      (line.startsWith('**') && line.endsWith('**') && line.length < 100);

    if (isHeader) {
      // Check if this header is just the redundant Main Title
      const cleanHeader = line.replace(/^(##|###)\s+/, '').replace(/\*\*/g, '');
      if (
        isIntro &&
        metadata.title &&
        cleanHeader.toLowerCase() === metadata.title.toLowerCase()
      ) {
        continue; // Skip redundant title
      }

      // Save previous section if it has content
      if (!isIntro) {
        if (currentSection.content) sections.push({ ...currentSection });
        currentSection = { title: '', content: '', image: null };
      }

      isIntro = false;
      // Clean title
      currentSection.title = cleanHeader;
    } else {
      // Content
      if (isIntro) {
        // Skip metadata lines/dates/author if they look like metadata or duplicates
        const isDate = line.match(/^\w+ \d+, \d{4}$/); // "January 15, 2026"
        const isRedundantDate = metadata.date && line.includes(metadata.date);
        const isAuthor = metadata.author && line.includes(metadata.author);
        const isBrand = line === 'Summit Chronicles';

        if (!isDate && !isRedundantDate && !isAuthor && !isBrand) {
          intro += line + '\n\n';
        }
      } else {
        currentSection.content += line + '\n\n';
      }
    }
  }

  // Push last section
  if (!isIntro && currentSection.content) {
    sections.push({ ...currentSection });
  }

  return { intro: intro.trim(), sections, introImage: firstImage, metadata };
}

export function convertRedBullToMarkdown(
  postData: any,
  originalMetadata: any = {}
) {
  // 1. Reconstruct Frontmatter
  const metadata = { ...originalMetadata }; // Start with existing
  metadata.title = postData.title;
  metadata.author = postData.author; // Ensure author is saved
  metadata.date = postData.date;
  metadata.heroImage = postData.heroImage;
  metadata.subtitle = postData.subtitle;
  // Handle Tags
  if (Array.isArray(postData.tags)) {
    metadata.tags = postData.tags; // YAML stringify handles array
  }

  // Simple YAML stringify
  let yamlString = '---\n';
  for (const [key, value] of Object.entries(metadata)) {
    if (key === 'content') continue; // Don't save content in frontmatter
    let valStr = value;
    if (Array.isArray(value)) {
      valStr = `[${value.map((v) => `"${v}"`).join(', ')}]`;
    } else if (typeof value === 'string') {
      // Always quote strings to be safe and consistent
      valStr = `"${value.replace(/"/g, '\\"')}"`;
    }
    yamlString += `${key}: ${valStr}\n`;
  }
  yamlString += '---\n\n';

  // 2. Reconstruct Body
  let body = '';

  // Intro
  if (postData.content.intro) {
    body += postData.content.intro + '\n\n';
  }

  // Sections
  postData.content.sections.forEach((section: any) => {
    body += `### ${section.title}\n\n`;

    if (section.image) {
      if (section.image.startsWith('placeholder:')) {
        body += `[IMAGE: ${section.image.replace('placeholder:', '')}]\n\n`;
      } else {
        body += `![Image](${section.image})\n\n`;
      }
    }

    if (section.content) {
      body += section.content + '\n\n';
    }

    if (section.pullQuote) {
      body += `> ${section.pullQuote}\n\n`;
    }
  });

  return yamlString + body;
}
