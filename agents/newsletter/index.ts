require('dotenv').config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { generateChatCompletion } from '../../lib/integrations/replicate';
import { sendEmail } from '../../lib/integrations/resend';
import { Guardrails } from '../../lib/guardrails';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// Mock Data for "Subscribers"
const SUBSCRIBERS = ['sunith@summitchronicles.com', 'team@summitchronicles.com'];

export async function runNewsletter() {
  if (!await Guardrails.checkWait('newsletter')) return;

  console.log('📧 Starting Newsletter Manager Agent...');

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
    const stats = fs.statSync(filePath); // Using file modified time as proxy for date
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
    You are the editor of "Summit Chronicles". Write a short, engaging weekly newsletter summarizing the following recent blog posts.

    Target Audience: Mountaineers and Climbers.
    Tone: Inspiring, professional, adventurous.

    Structure:
    - Welcome Message (Personal touch)
    - Highlights (Bullet points of key takeaways from the blogs)
    - Featured Quote (Mountaineering related)
    - Sign off

    Output Format: HTML (ready to send in email). Use inline styles for basic formatting.

    Recent Posts:
    ${postsContext}
  `;

  let newsletterHtml = '';
  try {
    newsletterHtml = await generateChatCompletion([
        { role: 'system', content: 'You are an expert newsletter writer.' },
        { role: 'user', content: prompt }
    ]);
  } catch (error) {
    console.warn('Local LLM generation failed. Using fallback template.');
    newsletterHtml = `
      <h1>Weekly Summit Update</h1>
      <p>We had a great week of climbing!</p>
      <p>Check out our website for the latest updates on training and gear.</p>
    `;
  }

  // 3. Send Email
  console.log('Sending emails...');
  for (const email of SUBSCRIBERS) {
    const result = await sendEmail({
      to: email,
      subject: `Summit Chronicles Weekly: ${new Date().toISOString().split('T')[0]}`,
      html: newsletterHtml
    });
    console.log(`Sent to ${email}: ${result.success ? '✅' : '❌'}`);
  }
}

// Allow running directly
if (require.main === module) {
    runNewsletter();
}
