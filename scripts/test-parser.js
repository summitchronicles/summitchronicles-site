
const fs = require('fs');

function parseMarkdownToRedBull(mdContent) {
  // Normalize newlines
  const text = mdContent.replace(/\r\n/g, '\n');

  // Split into lines to process line-by-line
  const lines = text.split('\n');

  const sections = [];
  let currentSection = { title: '', content: '', image: null };
  let intro = '';
  let isIntro = true;
  let firstImage = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
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
      // Save previous section if it has content
      if (!isIntro) {
        if (currentSection.content) sections.push({ ...currentSection });
        currentSection = { title: '', content: '', image: null };
      }

      isIntro = false;
      // Clean title
      currentSection.title = line.replace(/^##\s+/, '').replace(/\*\*/g, '');
    } else {
      // Content
      if (isIntro) {
        // Skip metadata lines/dates if they look like metadata
        if (!line.startsWith('---') && !line.match(/^\w+ \d+, \d{4}$/)) {
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

  return { intro: intro.trim(), sections, introImage: firstImage };
}

const content = fs.readFileSync('/Users/sunith/Documents/summit-chronicles-starter/content/blog/2026-01-15-uncovering-the-mystique-of-sherpa-buddhism.md', 'utf8');
const result = parseMarkdownToRedBull(content);
console.log('Intro Image:', result.introImage);
console.log('Sections:', JSON.stringify(result.sections, null, 2));
