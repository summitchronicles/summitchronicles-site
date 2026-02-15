require('dotenv').config({ path: '.env.local' });

import { generateChatCompletion } from '../../../lib/integrations/ollama';
import * as fs from 'fs';
import * as path from 'path';
import { Guardrails } from '../../../lib/guardrails';
import { updateAgentStatus } from '../../../lib/agent-status';

// Directory constants
const LOCAL_API = 'http://localhost:3000/api/training/metrics';
const PROD_API = 'https://www.summitchronicles.com/api/training/metrics';

const INCOMING_DIR = path.join(process.cwd(), 'content', 'incoming-notes');
const PROCESSED_DIR = path.join(INCOMING_DIR, 'processed');
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const MISSION_LOG_FILE = path.join(process.cwd(), 'content', 'mission-logs.json');

// Diverse topic keywords with date-based rotation
const SEARCH_KEYWORDS = [
  'Mount Everest Season 2026',
  'Winter Alpinism Trends',
  'High Altitude Training Science',
  'Sustainable Climbing Gear',
  'Sherpa Culture and History',
  'Ice Climbing Techniques',
  'Alpine Style vs Expedition Style',
  'Altitude Acclimatization Protocols',
  'Mountain Weather Forecasting',
  'Climbing Nutrition and Hydration',
  'Bouldering Movement Patterns',
  'Himalayan Glacier Retreat',
  'Mountaineering Ethics and Leave No Trace',
  'Crevasse Rescue Techniques',
  'Mental Training for High Altitude',
];

function getRotatedKeyword(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return SEARCH_KEYWORDS[dayOfYear % SEARCH_KEYWORDS.length];
}

// --- Incoming Notes Processing (merged from content-updater) ---

function ensureDirs() {
  [INCOMING_DIR, PROCESSED_DIR, BLOG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function processNote(filename: string) {
  const filePath = path.join(INCOMING_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log(`Processing note: ${filename}...`);

  // Step 1: Generate Mission Log Entry
  try {
    console.log('  Creating Mission Log Entry...');
    let logs: any[] = [];
    if (fs.existsSync(MISSION_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(MISSION_LOG_FILE, 'utf-8'));
    }

    const lastDay = logs.length > 0 ? logs[0].day : 0;
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

    const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const missionData = JSON.parse(cleanJson);

    const newLogEntry = {
      id: nextId,
      date: jsonDate,
      day: nextDay,
      ...missionData
    };

    logs.unshift(newLogEntry);
    fs.writeFileSync(MISSION_LOG_FILE, JSON.stringify(logs, null, 2));
    console.log('  Mission Log updated.');
  } catch (e: any) {
    console.error('  Failed to update Mission Log:', e.message);
  }

  // Step 2: Generate Blog Post from note
  const prompt = `
    You are an expert mountaineering journalist. Transform the following raw notes into a polished, engaging blog post for "Summit Chronicles".

    Structure:
    - Title: Catchy and relevant.
    - Introduction: Hook the reader.
    - Body: Organized with proper headings.
    - Conclusion: Wrap up with a thought.

    Include 2-3 [IMAGE: description] markers where images would enhance the post.
    Each marker should have descriptive alt text (e.g. [IMAGE: climber ascending snowy ridge at dawn]).

    IMPORTANT: Return ONLY the markdown content. Start with Frontmatter:
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
    console.warn(`  LLM failed for note blog: ${error.message}`);
    blogPostContent = `---
title: "Update: ${filename.replace(/\.(txt|md)$/, '')}"
date: "${new Date().toISOString().split('T')[0]}"
description: "Update from the field."
author: "Sunith"
---

## Update
${content}
    `;
  }

  try {
    const titleMatch = blogPostContent.match(/title:\s*["'](.+)["']/);
    const title = titleMatch ? titleMatch[1] : 'New Blog Post';
    const date = new Date().toISOString().split('T')[0];
    const slug = slugify(title);
    const outFilename = `${date}-${slug}.md`;
    const outPath = path.join(BLOG_DIR, outFilename);

    fs.writeFileSync(outPath, blogPostContent);
    console.log(`  Saved blog post: ${outFilename}`);

    // Archive note
    fs.renameSync(filePath, path.join(PROCESSED_DIR, filename));
    console.log(`  Archived: ${filename}`);
  } catch (error: any) {
    console.error(`  Error saving blog from note ${filename}:`, error.message);
  }
}

async function processIncomingNotes() {
  ensureDirs();

  const files = fs.readdirSync(INCOMING_DIR).filter(file => {
    return (file.endsWith('.txt') || file.endsWith('.md'))
      && file !== 'README.md'
      && file !== 'template.txt'
      && fs.statSync(path.join(INCOMING_DIR, file)).isFile();
  });

  if (files.length === 0) {
    console.log('No incoming notes to process.');
    return;
  }

  console.log(`Found ${files.length} incoming note(s) to process.`);
  updateAgentStatus('researcher', `Processing ${files.length} incoming note(s)...`, 'notes', 5);

  for (const file of files) {
    await processNote(file);
  }

  console.log('Incoming notes processing complete.');
}

// --- Original Researcher Functions ---

async function fetchTrainingData() {
  try {
    const apiUrl = process.env.NODE_ENV === 'development' ? LOCAL_API : PROD_API;
    console.log(`Fetching latest training data from ${apiUrl}...`);

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = await res.json();

    if (data.metrics) {
      if (!data.success) {
        console.log('API returned fallback data (using for development context).');
      }
      return data.metrics;
    }
  } catch (e: any) {
    console.warn(`Failed to fetch training data: ${e.message}`);
  }
  return null;
}

export async function generateWeeklyInsight() {
  console.log('Generating Weekly AI Training Insight...');
  updateAgentStatus('researcher', 'Analysing weekly protocol...', 'insight', 20);

  const data = await fetchTrainingData();
  if (!data) {
    console.log('No data available for insight.');
    return;
  }

  const { recentActivities, currentStats, advancedPerformance } = data;

  const activityComments = recentActivities
    ? recentActivities
        .slice(0, 10)
        .map((a: any) => a.description ? `- [${a.activityName}]: "${a.description}"` : null)
        .filter(Boolean)
        .join('\n')
    : "No recent comments.";

  const context = `
    Last 7 Days Activity Count: ${data.recentTrends?.monthlyActivities?.value || 0} (approx)
    VO2 Max: ${data.vo2Max} (${advancedPerformance?.vo2Max?.trend})
    Recovery Rate: ${advancedPerformance?.recoveryRate?.value}%
    Timeline: Day ${currentStats?.trainingYears?.value} of the journey.
    Phase: ${data.trainingPhases?.find((p: any) => p.status === 'current')?.focus || 'Base'}

    RECENT WORKOUT NOTES (User Comments):
    ${activityComments}
  `;

  const prompt = `
    You are an elite high-altitude performance coach.
    Analyze this athlete's status:
    ${context}

    Generate a JSON object with:
    - "weekSummary": A 1-sentence punchy summary of the week's vibe.
    - "focus": Main focus for next week (1-2 words).
    - "tip": A specific, actionable tip based on the data.

    JSON ONLY.
  `;

  try {
    const result = await generateChatCompletion([
      { role: 'system', content: 'You are a JSON generator coach.' },
      { role: 'user', content: prompt }
    ], { model: 'blog' });

    const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
    const insight = JSON.parse(cleanJson);

    const outPath = path.join(process.cwd(), 'content', 'training-insights.json');

    let existingInsights: any[] = [];
    if (fs.existsSync(outPath)) {
      try {
        const fileContent = fs.readFileSync(outPath, 'utf8');
        const parsed = JSON.parse(fileContent);
        existingInsights = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.warn('Could not parse existing insights, starting fresh.');
      }
    }

    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1)).toISOString().split('T')[0];

    const newInsight = {
      ...insight,
      weekStart: monday,
      updatedAt: new Date().toISOString()
    };

    const filtered = existingInsights.filter(i => i.weekStart !== monday);
    const updatedInsights = [newInsight, ...filtered];

    fs.writeFileSync(outPath, JSON.stringify(updatedInsights, null, 2));
    console.log('Saved Weekly Insight (History Updated).');
    updateAgentStatus('researcher', 'Insight generated!', 'done', 100, false, 'Weekly insight generated');
  } catch (e: any) {
    console.error('Failed to generate insight:', e.message);
  }
}

export async function runResearcher() {
  if (!await Guardrails.checkWait('researcher')) return;

  console.log('Starting Mountain Researcher Agent...');
  updateAgentStatus('researcher', 'Starting...', 'init', 0);

  // 1. Process incoming notes first (merged from content-updater)
  await processIncomingNotes();

  // 2. Brainstorm + draft topics
  updateAgentStatus('researcher', 'Analysing training data...', 'brainstorm', 10);

  const trainingData = await fetchTrainingData();
  let dataContext = "";

  if (trainingData) {
    console.log('Found live training data!');
    const trends = trainingData.recentTrends || {};
    dataContext = `
      CURRENT TRAINING CONTEXT (Use this to ground the blog in reality):
      - Weekly Volume: ${trends.weeklyVolume?.value || 'N/A'}
      - Weekly Elevation: ${trends.elevationThisWeek?.value || 'N/A'}
      - Current Phase: ${trainingData.trainingPhases?.find((p: any) => p.status === 'current')?.focus || 'Unknown'}
      - Body Status: VO2 Max ${trainingData.advancedPerformance?.vo2Max?.value || 'N/A'}, Recovery ${trainingData.advancedPerformance?.recoveryRate?.value || 'N/A'}%
    `;
  }

  const keyword = getRotatedKeyword();
  console.log(`Brainstorming topics related to: "${keyword}"...`);

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
    ], { model: 'blog' });

    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      topics = JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Failed to parse JSON from Ollama. Raw text:', resultText);
      topics = [
        { topic: `Deep Dive: ${keyword}`, description: "An expert analysis.", relevance_score: 0.9 }
      ];
    }

    console.log(`Generated ${topics.length} topics.`);

    if (topics.length > 0) {
      const bestTopic = topics.sort((a, b) => b.relevance_score - a.relevance_score)[0];
      console.log(`Selected Best Topic: "${bestTopic.topic}"`);
      await draftBlogPost(bestTopic);
    }
  } catch (error: any) {
    console.warn(`Research failed: ${error.message}`);
  }

  saveToFile(topics);
}

async function draftBlogPost(topic: any) {
  console.log('Drafting blog post...');
  updateAgentStatus('researcher', `Drafting: "${topic.topic.substring(0, 30)}..."`, 'draft', 30);

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
    Include 2-3 [IMAGE: description] markers at natural points in the post where a photo
    would enhance the content. Each marker should have descriptive alt text that captures
    the scene (e.g. [IMAGE: alpine climber traversing a knife-edge ridge at golden hour]).
  `;

  try {
    const content = await generateChatCompletion([
      { role: 'system', content: 'You are a professional mountaineering blog writer.' },
      { role: 'user', content: draftPrompt }
    ], { model: 'blog' });

    saveBlog(content, topic.topic);
    updateAgentStatus('researcher', 'Completed!', 'done', 100, false, `Draft created: ${topic.topic}`);
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
  console.log(`Saved Blog Post: ${filename}`);
}

function saveToFile(topics: any[]) {
  const outputPath = path.join(process.cwd(), 'scripts', 'legacy', 'researcher', 'latest_topics.json');
  fs.writeFileSync(outputPath, JSON.stringify(topics, null, 2));
  console.log(`Saved Research to ${outputPath}`);
}

// Allow running directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--insight')) {
    generateWeeklyInsight();
  } else {
    runResearcher();
  }
}
