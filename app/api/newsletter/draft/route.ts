import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logError, logInfo, logPerformance } from '@/lib/error-monitor';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '14'); // Default: last 14 days
    const format = searchParams.get('format') || 'markdown'; // 'markdown' or 'html'
    
    await logInfo('Newsletter draft generation started', { days, format });

    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    // Fetch recent published posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(blog_tags(name))
      `)
      .eq('status', 'published')
      .gte('published_at', dateThreshold.toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Newsletter draft error:', error);
      await logError(error, { 
        endpoint: '/api/newsletter/draft',
        action: 'fetch_posts',
        days,
        format 
      }, request);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://summitchronicles.com';
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        draft: format === 'markdown' 
          ? generateEmptyMarkdownNewsletter()
          : generateEmptyHtmlNewsletter(),
        posts_count: 0,
        period_days: days,
        message: `No new posts published in the last ${days} days. Here's a template to share expedition updates.`
      });
    }

    const draft = format === 'markdown' 
      ? generateMarkdownNewsletter(posts, siteUrl, days)
      : generateHtmlNewsletter(posts, siteUrl, days);

    const duration = Date.now() - startTime;
    await logPerformance('/api/newsletter/draft', duration, true);
    await logInfo('Newsletter draft generated successfully', { 
      posts_count: posts.length,
      period_days: days,
      format,
      duration
    });

    return NextResponse.json({
      draft,
      posts_count: posts.length,
      period_days: days,
      posts: posts.map(post => ({
        title: post.title,
        slug: post.slug,
        published_at: post.published_at,
        category: post.category
      }))
    });
  } catch (error) {
    console.error('Newsletter draft generation error:', error);
    const duration = Date.now() - startTime;
    
    await logError(error instanceof Error ? error : String(error), {
      endpoint: '/api/newsletter/draft',
      action: 'generate_draft',
      duration
    }, request);
    await logPerformance('/api/newsletter/draft', duration, false);
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMarkdownNewsletter(posts: any[], siteUrl: string, days: number): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `# Summit Chronicles Update - ${today}

G'day fellow adventurers! 👋

Hope you're crushing your training goals this week. I've got some updates from the Seven Summits journey to share with you.

## 🏔️ Latest Expedition Insights

${posts.map(post => {
  const tags = post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || [];
  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `### [${post.title}](${siteUrl}/blogs/${post.slug})
*${publishedDate} • ${post.category}${tags.length ? ' • ' + tags.join(', ') : ''}*

${post.excerpt || 'Check out the full post for all the details.'}

**[Read the full story →](${siteUrl}/blogs/${post.slug})**`;
}).join('\n\n')}

## 🎯 What's Next

*[Add your personal expedition updates here - training progress, gear updates, upcoming climbs, etc.]*

- Current training focus: 
- Gear I'm testing: 
- Next expedition: 

## 💪 Question for You

What's your biggest mountaineering challenge right now? Hit reply - I read every message and often turn them into content that helps everyone.

---

**Keep climbing,**  
Sunith Kumar

*P.S. Know someone who'd love these updates? Forward this email or send them to [summitchronicles.com](${siteUrl}) to join the adventure.*

---
*You're receiving this because you signed up for Summit Chronicles updates. [Unsubscribe here]({{unsubscribe_url}})*`;
}

function generateHtmlNewsletter(posts: any[], siteUrl: string, days: number): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `<h1>Summit Chronicles Update - ${today}</h1>

<p>G'day fellow adventurers! 👋</p>

<p>Hope you're crushing your training goals this week. I've got some updates from the Seven Summits journey to share with you.</p>

<h2>🏔️ Latest Expedition Insights</h2>

${posts.map(post => {
  const tags = post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || [];
  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `<h3><a href="${siteUrl}/blogs/${post.slug}">${post.title}</a></h3>
<p><em>${publishedDate} • ${post.category}${tags.length ? ' • ' + tags.join(', ') : ''}</em></p>

<p>${post.excerpt || 'Check out the full post for all the details.'}</p>

<p><strong><a href="${siteUrl}/blogs/${post.slug}">Read the full story →</a></strong></p>`;
}).join('\n')}

<h2>🎯 What's Next</h2>

<p><em>[Add your personal expedition updates here - training progress, gear updates, upcoming climbs, etc.]</em></p>

<ul>
<li>Current training focus: </li>
<li>Gear I'm testing: </li>
<li>Next expedition: </li>
</ul>

<h2>💪 Question for You</h2>

<p>What's your biggest mountaineering challenge right now? Hit reply - I read every message and often turn them into content that helps everyone.</p>

<hr>

<p><strong>Keep climbing,</strong><br>
Sunith Kumar</p>

<p><em>P.S. Know someone who'd love these updates? Forward this email or send them to <a href="${siteUrl}">summitchronicles.com</a> to join the adventure.</em></p>

<hr>
<p><small>You're receiving this because you signed up for Summit Chronicles updates. <a href="{{unsubscribe_url}}">Unsubscribe here</a></small></p>`;
}

function generateEmptyMarkdownNewsletter(): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `# Summit Chronicles Update - ${today}

G'day fellow adventurers! 👋

Hope you're crushing your training goals this week. Here's what's been happening in my Seven Summits journey.

## 🏔️ Expedition Updates

*[Share your latest training progress, expedition planning, or mountaineering insights]*

## 🎯 What's Next

- Current training focus: 
- Gear I'm testing: 
- Next expedition: 

## 💪 Question for You

What's your biggest mountaineering challenge right now? Hit reply - I read every message and often turn them into content that helps everyone.

---

**Keep climbing,**  
Sunith Kumar

*P.S. Know someone who'd love these updates? Forward this email or send them to [summitchronicles.com](https://summitchronicles.com) to join the adventure.*

---
*You're receiving this because you signed up for Summit Chronicles updates. [Unsubscribe here]({{unsubscribe_url}})*`;
}

function generateEmptyHtmlNewsletter(): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `<h1>Summit Chronicles Update - ${today}</h1>

<p>G'day fellow adventurers! 👋</p>

<p>Hope you're crushing your training goals this week. Here's what's been happening in my Seven Summits journey.</p>

<h2>🏔️ Expedition Updates</h2>

<p><em>[Share your latest training progress, expedition planning, or mountaineering insights]</em></p>

<h2>🎯 What's Next</h2>

<ul>
<li>Current training focus: </li>
<li>Gear I'm testing: </li>
<li>Next expedition: </li>
</ul>

<h2>💪 Question for You</h2>

<p>What's your biggest mountaineering challenge right now? Hit reply - I read every message and often turn them into content that helps everyone.</p>

<hr>

<p><strong>Keep climbing,</strong><br>
Sunith Kumar</p>

<p><em>P.S. Know someone who'd love these updates? Forward this email or send them to <a href="https://summitchronicles.com">summitchronicles.com</a> to join the adventure.</em></p>

<hr>
<p><small>You're receiving this because you signed up for Summit Chronicles updates. <a href="{{unsubscribe_url}}">Unsubscribe here</a></small></p>`;
}