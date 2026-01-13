import * as fs from 'fs';
import * as path from 'path';
import { generateChatCompletion } from '../../lib/integrations/ollama';
import { Guardrails } from '../../lib/guardrails';

const INCOMING_DIR = path.join(process.cwd(), 'content', 'incoming-notes');
const PROCESSED_DIR = path.join(INCOMING_DIR, 'processed');
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const MISSION_LOG_FILE = path.join(process.cwd(), 'content', 'mission-logs.json');

// Ensure directories exist
function ensureDirs() {
  [INCOMING_DIR, PROCESSED_DIR, BLOG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function slugify(text: string): string {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function runContentUpdater() {
  console.log('🚀 Starting Content Updater Agent...');

  // 🛡️ Security Guardrail Check
  const canRun = await Guardrails.checkWait('content-updater');
  if (!canRun) return;

  ensureDirs();

  // 1. Scan for files
  const files = fs.readdirSync(INCOMING_DIR).filter(file => {
    return (file.endsWith('.txt') || file.endsWith('.md')) && file !== 'README.md' && file !== 'template.txt' && fs.statSync(path.join(INCOMING_DIR, file)).isFile();
  });

  if (files.length === 0) {
    console.log('No new notes found.');
    return;
  }

  console.log(`Found ${files.length} notes to process.`);

  for (const file of files) {
    await processNote(file);
  }

  console.log('✅ Content Updater finished.');
}

async function processNote(filename: string) {
  const filePath = path.join(INCOMING_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log(`Processing ${filename}...`);

  // --- Step 1: Generate Mission Log Entry ---
  try {
      console.log('Creating Mission Log Entry...');
      let logs = [];
      if (fs.existsSync(MISSION_LOG_FILE)) {
          logs = JSON.parse(fs.readFileSync(MISSION_LOG_FILE, 'utf-8'));
      }

      const lastDay = logs.length > 0 ? logs[0].day : 0; // Assuming newest first
      const nextDay = lastDay + 1;
      const nextId = `l${logs.length}`;
      const jsonDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const missionPrompt = `
        Analyze the following training note and extract data for a "Mission Log" entry.
        Return ONLY valid JSON. No markdown formatting.

        Note Content:
        "${content}"

        Context:
        - Next Day Number: ${nextDay}
        - Date: ${jsonDate}

        Required JSON Structure:
        {
            "title": "Short summary title (e.g. Strength Session)",
            "category": "Training" | "Rehab" | "Recovery" | "Milestone",
            "description": "2 sentences max summary.",
            "metrics": [
                { "label": "Load", "value": "Easy/Moderate/Hard" },
                { "label": "Duration", "value": "e.g. 45m" }
            ]
        }
      `;

      const jsonResponse = await generateChatCompletion([
          { role: 'system', content: 'You are a data extraction assistant. Output JSON only.' },
          { role: 'user', content: missionPrompt }
      ]);

      // Cleanup JSON (remove markdown code blocks if any)
      const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const missionData = JSON.parse(cleanJson);

      const newLogEntry = {
          id: nextId,
          date: jsonDate,
          day: nextDay,
          ...missionData
      };

      // Prepend to logs (Newest first)
      logs.unshift(newLogEntry);
      fs.writeFileSync(MISSION_LOG_FILE, JSON.stringify(logs, null, 2));
      console.log('✅ Mission Log updated.');

  } catch (e: any) {
      console.error('❌ Failed to update Mission Log:', e.message);
  }

  // --- Step 2: Generate Blog Post ---
  const prompt = `
    You are an expert mountaineering journalist. Transform the following raw notes into a polished, engaging blog post for "Summit Chronicles".

    Hash out the structure:
    - Title: Catchy and relevant.
    - Introduction: Hook the reader.
    - Body: Organized with proper headings.
    - Conclusion: Wrap up with a thought.

    IMPORTANT: Return ONLY the markdown content. Start with the Frontmatter in YAML format:
    ---
    title: "Title Here"
    date: "${new Date().toISOString().split('T')[0]}"
    description: "Short summary"
    tags: ["Mountaineering", "Update"]
    author: "Sunith"
    ---

    Raw Notes:
    ${content}
  `;

  let blogPostContent = '';
  try {
    blogPostContent = await generateChatCompletion([
        { role: 'system', content: 'You are a professional blog writer for a mountaineering website.' },
        { role: 'user', content: prompt }
    ]);
  } catch (error: any) {
    console.warn(`⚠️ processing with Local LLM failed: ${error.message}`);
    // Mock Fallback
    blogPostContent = `---
title: "Update: ${filename.replace('.txt', '')}"
date: "${new Date().toISOString().split('T')[0]}"
description: "Update from the field."
author: "Sunith"
---

## Update
${content}
    `;
  }

  try {
    // Extract Title for filename
    const titleMatch = blogPostContent.match(/title:\s*["'](.+)["']/);
    const title = titleMatch ? titleMatch[1] : 'New Blog Post';
    const date = new Date().toISOString().split('T')[0];
    const slug = slugify(title);
    const outFilename = `${date}-${slug}.md`;
    const outPath = path.join(BLOG_DIR, outFilename);

    // Save Blog Post
    fs.writeFileSync(outPath, blogPostContent);
    console.log(`Saved blog post to ${outFilename}`);

    // Archive Note
    fs.renameSync(filePath, path.join(PROCESSED_DIR, filename));
    console.log(`Archived ${filename}`);

  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Allow running directly
if (require.main === module) {
    runContentUpdater();
}

