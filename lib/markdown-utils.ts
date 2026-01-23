export function parseMarkdownToRedBull(mdContent: string, slug: string) {
  // Normalize newlines
  const text = mdContent.replace(/\r\n/g, '\n');

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
  const frontmatterMatch = mdContent.match(/^---\n([\s\S]*?)\n---/);
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

    // Check for Image: ![alt](url)
    const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) {
      const imgUrl = imgMatch[1];
      if (!firstImage) firstImage = imgUrl; // Capture first image for Hero

      if (isIntro) {
        // allow image in intro for hero extraction but don't add to text
      } else {
        currentSection.image = imgUrl;
      }
      continue; // Skip adding image line to text
    }

    // Check for Headers: ## Title OR **Title**
    // Detect bold headers that are stand-alone lines (likely headers)
    const isHeader =
      line.startsWith('## ') ||
      (line.startsWith('**') && line.endsWith('**') && line.length < 100);

    if (isHeader) {
      // Check if this header is just the redundant Main Title
      const cleanHeader = line.replace(/^##\s+/, '').replace(/\*\*/g, '');
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
