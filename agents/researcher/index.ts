require('dotenv').config({ path: '.env.local' });

// Imports
import { generateChatCompletion } from '../../lib/integrations/ollama';
import { generateGeminiImage } from '../../lib/integrations/gemini';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { Guardrails } from '../../lib/guardrails';

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// New Logic: Brainstorming topics from Internal Knowledge (Llama 3)
const SEARCH_KEYWORDS = [
  'Mount Everest Season 2026',
  'Winter Alpinism Trends',
  'High Altitude Training Science',
  'Sustainable Climbing Gear',
  'Sherpa Culture and History'
];

export async function runResearcher() {
  if (!await Guardrails.checkWait('researcher')) return;

  console.log('🧗 Starting Mountain Researcher Agent (Hybrid Mode: Ollama + Gemini Images)...');

  const keyword = SEARCH_KEYWORDS[Math.floor(Math.random() * SEARCH_KEYWORDS.length)];
  console.log(`🧠 Brainstorming topics related to: "${keyword}" using Local Llama 3...`);

  const prompt = `
    You are an expert mountaineering journalist with deep knowledge of the climbing world.
    Brainstorm 3 cutting-edge, interesting blog post ideas related to: "${keyword}".

    Format the output as a JSON array of objects with the following keys:
    - topic: Title of the topic
    - description: Brief summary (1-2 sentences)
    - relevance_score: A number between 0.1 and 1.0 indicating relevance to serious mountaineers.

    JSON ONLY. No markdown formatting.
  `;

  let topics: any[] = [];

  try {
    const resultText = await generateChatCompletion([
        { role: 'system', content: 'You are a JSON generator. Output only valid JSON.' },
        { role: 'user', content: prompt }
    ]);

    // Clean Markdown code blocks (Ollama loves adding them)
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      topics = JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Failed to parse JSON from Ollama. Raw text:', resultText);
      // Fallback
       topics = [
        { topic: `Deep Dive: ${keyword}`, description: "An expert analysis.", relevance_score: 0.9 }
       ];
    }

    console.log(`💡 Generated ${topics.length} topics.`);

    // Select Best Topic and Draft Blog
    if (topics.length > 0) {
        const bestTopic = topics.sort((a, b) => b.relevance_score - a.relevance_score)[0];
        console.log(`✨ Selected Best Topic: "${bestTopic.topic}"`);
        await draftBlogPost(bestTopic);
    }

  } catch (error: any) {
    console.warn(`⚠️ Research failed: ${error.message}`);
  }

  // Save to DB or File
  saveToFile(topics);
}

async function draftBlogPost(topic: any) {
    console.log('📝 Drafting blog post using Local Llama 3...');

    // Style Reference
    const styleGuide = `
      Style: Personal, authoritative, mountaineering journalist.
      Structure:
      - Title: Bold, H1.
      - Date/Tags/Author: YAML Frontmatter.
      - Intro: Personal reflection or hook using "I".
      - Subheadings: H2/H3 for sections.
      - Tone: Professional but gritty. Uses terms like "Crag", "Send", "Beta".
    `;

    const draftPrompt = `
        Write a full blog post about: "${topic.topic}".
        Use this description: "${topic.description}".

        ${styleGuide}

        REQUIRED FRONTMATTER VALUES:
        title: "${topic.topic}"
        date: "${new Date().toISOString().split('T')[0]}"
        author: "Summit Explorer"
        tags: [generate relevant tags]

        IMPORTANT: Return ONLY the markdown content. Start with Frontmatter.
        Include markers for where images should go (e.g. [IMAGE: description]).
    `;

    try {
        let content = await generateChatCompletion([
             { role: 'system', content: 'You are a professional mountaineering blog writer.' },
             { role: 'user', content: draftPrompt }
        ]);

        // Image Generation with Strict Retry Logic
        const imageMatch = content.match(/\[IMAGE: (.+)\]/);
        let imageDesc = topic.topic;
        if (imageMatch) {
            imageDesc = imageMatch[1];
        }

        console.log(`🎨 Generating image for: "${imageDesc}"...`);
        let imageUrl: string | null = null;
        let retries = 0;
        const MAX_RETRIES = 5;

        while (!imageUrl && retries < MAX_RETRIES) {
            imageUrl = await generateGeminiImage(imageDesc);

            // Check if we got a fallback mock URL (from gemini.ts) or null
            // We need to modify gemini.ts to return NULL on 429 instead of mock if we want strict control here,
            // OR we check if the returned URL is the placeholder.
            // Current gemini.ts returns a placeholder on ANY error.
            // I will update this file first, but I really should update gemini.ts to throw 429s so I can catch them.
            // For now, I'll rely on the logged error in gemini.ts and the fact that it returns the placeholder.
            // Wait, if gemini.ts returns a placeholder, I can't distinguish 429 from other errors easily without parsing.
            // I should PROBABLY update gemini.ts first to be "strict".

            // Actually, for this specific request, the user wants "If we hit rate limits... wait".
            // My previous gemini.ts change swallowed the error.
            // I will assume for this step I am implementing the loop, but I need to detect the failure.

            if (imageUrl && imageUrl.includes('placehold.co')) {
                // This means it failed (fallback logic in gemini.ts).
                console.warn(`⚠️ Rate Limit or Error detected (got placeholder). Waiting 60s to cool down... (Attempt ${retries + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60s
                imageUrl = null; // Reset to force retry
                retries++;
            } else if (!imageUrl) {
                 // Null return
                 console.warn(`⚠️ Image generation failed. Waiting 60s... (Attempt ${retries + 1}/${MAX_RETRIES})`);
                 await new Promise(resolve => setTimeout(resolve, 60000));
                 retries++;
            } else {
                console.log('✨ Real Image Generated!');
                break; // We got a real image
            }
        }

        if (!imageUrl || imageUrl.includes('placehold.co')) {
             throw new Error("Failed to generate a REAL image after multiple retries. Aborting save to preventing incomplete blog.");
        }

        if (imageMatch) {
             content = content.replace(imageMatch[0], imageUrl);
        } else {
             content = content.replace('---', '---\n\n' + imageUrl + '\n');
        }

        saveBlog(content, topic.topic);

    } catch (e: any) {
        console.error('Drafting failed:', e.message);
    }
}

function saveBlog(content: string, title: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${new Date().toISOString().split('T')[0]}-${slug}.md`;
    const outPath = path.join(process.cwd(), 'content', 'blog', filename);

    fs.writeFileSync(outPath, content);
    console.log(`✅ Saved Blog Post: ${filename}`);
}

function saveToFile(topics: any[]) {
    const outputPath = path.join(process.cwd(), 'agents', 'researcher', 'latest_topics.json');
    fs.writeFileSync(outputPath, JSON.stringify(topics, null, 2));
    console.log(`Saved Research to ${outputPath}`);
}

// Allow running directly
if (require.main === module) {
    runResearcher();
}
