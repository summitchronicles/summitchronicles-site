import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Fetch published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(blog_tags(name))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20); // Latest 20 posts for RSS

    if (error) {
      console.error('RSS feed error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://summitchronicles.com';
    const now = new Date().toUTCString();

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Summit Chronicles - Sunith Kumar</title>
    <link>${siteUrl}</link>
    <description>Expedition updates, training insights, and mountaineering adventures from the Seven Summits journey. From TB recovery to 4/7 summits and counting.</description>
    <language>en-US</language>
    <managingEditor>hello@summitchronicles.com (Sunith Kumar)</managingEditor>
    <webMaster>hello@summitchronicles.com (Sunith Kumar)</webMaster>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/images/summit-chronicles-logo.jpg</url>
      <title>Summit Chronicles</title>
      <link>${siteUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    
${posts?.map(post => {
  const tags = post.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean) || [];
  const publishedDate = new Date(post.published_at).toUTCString();
  
  return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blogs/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blogs/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${publishedDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      ${tags.map((tag: string) => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
      <author>hello@summitchronicles.com (Sunith Kumar)</author>
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}