import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config({ path: '.env.local' });

import { generateChatCompletion } from '../../lib/integrations/cohere';
import { generateHuggingFaceImage } from '../../lib/integrations/huggingface';
import * as fs from 'fs';
import * as path from 'path';
import { Guardrails } from '../../lib/guardrails';
import { updateAgentStatus } from '../../lib/agent-status';

// ... (rest of imports/setup remains compatible)

// ...

// ...
// API Constants
const LOCAL_API = 'http://localhost:3000/api/training/metrics';
const PROD_API = 'https://www.summitchronicles.com/api/training/metrics';

// Load Visual Knowledge

// Load Visual Knowledge
function loadVisualKnowledge(): string {
  try {
    const knowledgePath = path.join(process.cwd(), 'agents', 'researcher', 'visual_knowledge.md');
    if (fs.existsSync(knowledgePath)) {
        return fs.readFileSync(knowledgePath, 'utf8');
    }
  } catch(e) { console.warn("Could not load visual knowledge"); }
  return "";
}

const VISUAL_KNOWLEDGE = loadVisualKnowledge();

function getEnrichedPrompt(baseDescription: string): string {
    // 1. Check for specific keywords in the VISUAL KNOWLEDGE
    const knowledgeLines = VISUAL_KNOWLEDGE.split('\n');
    let additionalDetails = "";

    // Simple scan: If the description contains a keyword like "Mani stone", look for the "Prompt Modifiers" block below it.
    // A smarter regex approach:
    const sections = VISUAL_KNOWLEDGE.split('## ');

    for (const section of sections) {
        if (!section.trim()) continue;
        const lines = section.split('\n');
        const title = lines[0].toLowerCase(); // e.g. "mani stones"

        // Check if our image description mentions this section topic OR any of its keywords
        // We find the "Keywords:" line
        const keywordLine = lines.find(l => l.startsWith('**Keywords:**'));
        const keywords = keywordLine ? keywordLine.replace('**Keywords:**', '').split(',').map(s => s.trim().toLowerCase()) : [title];

        const matches = keywords.some(k => baseDescription.toLowerCase().includes(k));

        if (matches) {
            // Found a match! Extract "Prompt Modifiers"
            const modifierLine = lines.find(l => l.startsWith('**Prompt Modifiers:**'));
            if (modifierLine) {
                additionalDetails += " " + modifierLine.replace('**Prompt Modifiers:**', '').trim();
            }
             // Also add the "Visual Description" for good measure if needed, but Prompt Modifiers is usually cleaner for SDXL
        }
    }

    if (additionalDetails) {
        console.log(`✨ Enriched Prompt for "${baseDescription}": ${additionalDetails}`);
        return `cinematic photo, ${baseDescription}, ${additionalDetails}, 8k, photorealistic, national geographic style`.substring(0, 500); // Limit length
    }

    // Default Fallback
    return `cinematic photo, detailed faces, 8k, photorealistic, ${baseDescription}, national geographic style, dramatic lighting`;
}

// Brainstorming topics from Internal Knowledge (Llama 3)
const SEARCH_KEYWORDS = [
  'Mount Everest Season 2026',
  'Winter Alpinism Trends',
  'High Altitude Training Science',
  'Sustainable Climbing Gear',
  'Sherpa Culture and History'
];

// API Constants moved to top

async function fetchTrainingData() {
    try {
        const apiUrl = process.env.NODE_ENV === 'development' ? LOCAL_API : PROD_API;
        console.log(`📊 Fetching latest training data from ${apiUrl}...`);

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data = await res.json();

        if (data.metrics) {
            if (!data.success) {
                console.log('⚠️ API returned fallback data (using for development context).');
            }
            return data.metrics;
        }
    } catch (e: any) {
        console.warn(`⚠️ Failed to fetch training data: ${e.message}`);
    }
    return null;
}

export async function generateWeeklyInsight() {
    console.log('🧠 Generating Weekly AI Training Insight...');
    updateAgentStatus('researcher', 'Analysing weekly protocol...', 'insight', 20);

    const data = await fetchTrainingData();
    if (!data) {
        console.log('❌ No data available for insight.');
        return;
    }

    const { recentActivities, currentStats, advancedPerformance } = data;

    // Extract recent comments for context
    const activityComments = recentActivities
        ? recentActivities
            .slice(0, 10) // Look at last 10 activities
            .map((a: any) => a.description ? `- [${a.activityName}]: "${a.description}"` : null)
            .filter(Boolean)
            .join('\n')
        : "No recent comments.";

    // Create broad context
    const context = `
        Last 7 Days Activity Count: ${data.recentTrends?.monthlyActivities?.value || 0} (approx)
        VO2 Max: ${data.vo2Max} (${advancedPerformance?.vo2Max?.trend})
        Recovery Rate: ${advancedPerformance?.recoveryRate?.value}%
        Timeline: Day ${currentStats?.trainingYears?.value} of the journey.
        Phase: ${data.trainingPhases?.find((p:any) => p.status === 'current')?.focus || 'Base'}

        RECENT WORKOUT NOTES (User Comments):
        ${activityComments}
    `;

    const prompt = `
        You are an elite high-altitude performance coach.
        Analyze this athlete's status:
        ${context}

        Generate a JSON object with:
        - "weekSummary": A 1-sentence punchy summary of the week's vibe (e.g. "Volume is high, but recovery is lagging.").
        - "focus": Main focus for next week (1-2 words, e.g. "Aerobic Base").
        - "tip": A specific, actionable tip based on the data.

        JSON ONLY.
    `;

    try {
        const result = await generateChatCompletion([
            { role: 'system', content: 'You are a JSON generator coach.' },
            { role: 'user', content: prompt }
        ]);

        const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
        const insight = JSON.parse(cleanJson);

        // Save
        const outPath = path.join(process.cwd(), 'content', 'training-insights.json');

        let existingInsights: any[] = [];
        if (fs.existsSync(outPath)) {
            try {
                const fileContent = fs.readFileSync(outPath, 'utf8');
                const parsed = JSON.parse(fileContent);
                existingInsights = Array.isArray(parsed) ? parsed : [parsed]; // Handle legacy single object
            } catch (e) {
                console.warn('Could not parse existing insights, starting fresh.');
            }
        }

        // Add start of current week date to the insight
        // (Assuming "current" means "this week", so Monday of this week)
        const today = new Date();
        const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1)).toISOString().split('T')[0];

        const newInsight = {
            ...insight,
            weekStart: monday,
            updatedAt: new Date().toISOString()
        };

        // Remove any existing entry for this week (idempotency)
        const filtered = existingInsights.filter(i => i.weekStart !== monday);
        const updatedInsights = [newInsight, ...filtered]; // Prepend new insight

        fs.writeFileSync(outPath, JSON.stringify(updatedInsights, null, 2));
        console.log('✅ Saved Weekly Insight (History Updated).');
        updateAgentStatus('researcher', 'Insight generated!', 'done', 100, false);

    } catch (e: any) {
        console.error('Failed to generate insight:', e.message);
    }
}

export async function runResearcher() {
  if (!await Guardrails.checkWait('researcher')) return;

  console.log('🧗 Starting Mountain Researcher Agent (Hybrid Mode: Ollama + Real Data)...');
  updateAgentStatus('researcher', 'Analysing training data...', 'brainstorm', 10);

  // 1. Fetch Real Data
  const trainingData = await fetchTrainingData();
  let dataContext = "";

  if (trainingData) {
      console.log('✅ Found live training data!');
      const trends = trainingData.recentTrends || {};
      dataContext = `
        CURRENT TRAINING CONTEXT (Use this to ground the blog in reality):
        - Weekly Volume: ${trends.weeklyVolume?.value || 'N/A'}
        - Weekly Elevation: ${trends.elevationThisWeek?.value || 'N/A'}
        - Current Phase: ${trainingData.trainingPhases?.find((p:any) => p.status === 'current')?.focus || 'Unknown'}
        - Body Status: VO2 Max ${trainingData.advancedPerformance?.vo2Max?.value || 'N/A'}, Recovery ${trainingData.advancedPerformance?.recoveryRate?.value || 'N/A'}%
      `;
  }

  const keyword = SEARCH_KEYWORDS[Math.floor(Math.random() * SEARCH_KEYWORDS.length)];
  console.log(`🧠 Brainstorming topics related to: "${keyword}" (with real context)...`);

  const prompt = `
    You are an expert mountaineering journalist ghostwriting for Sunith.

    ${dataContext}

    Brainstorm 3 cutting-edge, interesting blog post ideas related to: "${keyword}".
    If "CURRENT TRAINING CONTEXT" is provided, ensure at least one topic connects the global trend to Sunith's personal training progress.

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
    updateAgentStatus('researcher', `Drafting blog about "${topic.topic.substring(0, 30)}..."`, 'draft', 30);

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

        // Multi-Image Generation Loop
        // Find all [IMAGE: description] tags
        const imageRegex = /\[IMAGE: (.*?)\]/g;
        let match;
        const matches = [];

        // Collect all matches first so we don't mess up indices while replacing
        while ((match = imageRegex.exec(content)) !== null) {
            matches.push({ full: match[0], desc: match[1] });
        }

        console.log(`🎨 Found ${matches.length} image requests.`);

        let firstImageUrl = null;

        for (const m of matches) {
             const enhancedPrompt = getEnrichedPrompt(m.desc);
             console.log(`🎨 Generating: "${m.desc}"...`);
             updateAgentStatus('researcher', `Generating image: ${m.desc.substring(0,20)}...`, 'image', 50);

             let imageUrl = await generateHuggingFaceImage(enhancedPrompt);

             if (!imageUrl) {
                 console.warn(`⚠️ Generation failed for: ${m.desc}`);
                 imageUrl = `![Placeholder](/images/placeholder.jpg)`; // Or a valid fallback
             } else {
                 // Extract URL from markdown string ![alt](url)
                 const urlMatch = imageUrl.match(/\((.*?)\)/);
                 if (urlMatch) {
                     const url = urlMatch[1];
                     if (!firstImageUrl) firstImageUrl = url;
                 }
             }

             content = content.replace(m.full, imageUrl);
        }

        // Ensure Main Image in Frontmatter
        if (firstImageUrl) {
            // Check if frontmatter has image:
            if (!content.includes('image: ')) {
                content = content.replace('---', `---\nimage: "${firstImageUrl}"`);
            } else {
                content = content.replace(/image: .*/, `image: "${firstImageUrl}"`);
            }
        }


        saveBlog(content, topic.topic);
        updateAgentStatus('researcher', 'Completed!', 'done', 100, false);

    } catch (e: any) {
        console.error('Drafting failed:', e.message);
        updateAgentStatus('researcher', `Failed: ${e.message}`, 'error', 0, false);
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
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    if (args.includes('--insight')) {
        generateWeeklyInsight();
    } else {
        runResearcher();
    }
}
