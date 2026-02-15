require('dotenv').config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { generateChatCompletion } from '../../../lib/integrations/ollama';
import { sendEmail } from '../../../lib/integrations/resend';
import { Guardrails } from '../../../lib/guardrails';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'content', 'newsletter-subscribers.json');
const HISTORY_FILE = path.join(process.cwd(), 'content', 'newsletter-history.json');

function loadSubscribers(): string[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('Could not load subscribers file, using defaults.');
  }
  return ['sunith@summitchronicles.com', 'team@summitchronicles.com'];
}

function saveHistory(entry: any) {
  let history: any[] = [];
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    }
  } catch (e) {
    // start fresh
  }
  history.unshift(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

export async function runNewsletter() {
  if (!await Guardrails.checkWait('newsletter')) return;

  console.log('Starting Newsletter Manager Agent...');

  // 1. Find Recent Blogs
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No content/blog directory found.');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
  const recentPosts: string[] = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const stats = fs.statSync(filePath);
    if (stats.mtime > oneWeekAgo) {
      const content = fs.readFileSync(filePath, 'utf-8');
      recentPosts.push(content);
    }
  }

  if (recentPosts.length === 0) {
    console.log('No new posts in the last week. Skipping newsletter.');
    return;
  }

  console.log(`Found ${recentPosts.length} new posts. Generating newsletter...`);

  // 2. Generate Newsletter Content
  const postsContext = recentPosts.join('\n\n---\n\n');
  const prompt = `
    You are the editor of "Summit Chronicles". Write a weekly newsletter summarizing the following recent blog posts.

    Target Audience: Mountaineers and Climbers.
    Tone: Inspiring, professional, adventurous.

    Output a complete HTML email with responsive inline CSS. Include:

    1. A header banner with "Summit Chronicles" title and tagline, dark background (#1a1a2e), gold accent (#d4a843)
    2. A personal welcome message
    3. Highlights section with bullet points summarizing key takeaways from each post
    4. A featured mountaineering quote in a styled blockquote
    5. A footer with:
       - Link to website: https://www.summitchronicles.com
       - Unsubscribe placeholder: {{UNSUBSCRIBE_URL}}
       - Copyright line

    Use inline CSS for all styling. Make it mobile-friendly (max-width: 600px, centered).
    Use the color palette: dark backgrounds (#1a1a2e, #16213e), gold (#d4a843), white text.

    Recent Posts:
    ${postsContext}
  `;

  let newsletterHtml = '';
  try {
    newsletterHtml = await generateChatCompletion([
      { role: 'system', content: 'You are an expert newsletter designer. Output only valid HTML.' },
      { role: 'user', content: prompt }
    ]);
  } catch (error) {
    console.warn('LLM generation failed. Using fallback template.');
    newsletterHtml = `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#1a1a2e;color:#fff;padding:32px;">
        <h1 style="color:#d4a843;border-bottom:2px solid #d4a843;padding-bottom:12px;">Summit Chronicles</h1>
        <p>We had a great week of climbing!</p>
        <p>Check out our website for the latest updates on training and gear.</p>
        <hr style="border-color:#333;">
        <p style="font-size:12px;color:#888;">
          <a href="https://www.summitchronicles.com" style="color:#d4a843;">Visit Website</a> |
          <a href="{{UNSUBSCRIBE_URL}}" style="color:#888;">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  // 3. Send Email
  const subscribers = loadSubscribers();
  console.log(`Sending to ${subscribers.length} subscriber(s)...`);

  const results: { email: string; success: boolean }[] = [];

  for (const email of subscribers) {
    const result = await sendEmail({
      to: email,
      subject: `Summit Chronicles Weekly: ${new Date().toISOString().split('T')[0]}`,
      html: newsletterHtml
    });
    results.push({ email, success: result.success ?? false });
    console.log(`Sent to ${email}: ${result.success ? 'OK' : 'FAILED'}`);
  }

  // 4. Save to history
  saveHistory({
    date: new Date().toISOString(),
    subject: `Summit Chronicles Weekly: ${new Date().toISOString().split('T')[0]}`,
    recipientCount: subscribers.length,
    results,
  });

  console.log('Newsletter complete.');
}

// Allow running directly
if (require.main === module) {
  runNewsletter();
}
