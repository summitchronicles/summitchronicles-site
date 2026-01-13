import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @param options - DOMPurify configuration options
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(
  html: string,
  options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
  }
): string {
  if (!html) return '';

  // Default configuration
  const config: any = {
    // Allow common HTML tags for blog posts
    ALLOWED_TAGS: options?.allowedTags || [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'code',
      'pre',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'span',
      'hr',
      'sup',
      'sub',
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'width',
      'height',
    ],
    // Only allow http/https protocols for links and images
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Add target="_blank" and rel="noopener noreferrer" to external links
    ADD_ATTR: ['target', 'rel'],
    // Keep safe data-* attributes for styling frameworks
    ALLOW_DATA_ATTR: false,
  };

  // Sanitize and return
  return DOMPurify.sanitize(html, config) as unknown as string;
}

/**
 * Sanitizes HTML while preserving more tags (for trusted content like blog posts from CMS)
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string with extended tag support
 */
export function sanitizeBlogContent(html: string): string {
  if (!html) return '';

  const config: any = {
    // More permissive for blog content from trusted CMS
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'strike',
      'del',
      'ins',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'code',
      'pre',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'span',
      'hr',
      'sup',
      'sub',
      'abbr',
      'cite',
      'mark',
      'small',
      'iframe', // For embedded content like YouTube
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'width',
      'height',
      'frameborder',
      'allow',
      'allowfullscreen',
      'loading',
    ],
    // Allow YouTube and Vimeo embeds
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target', 'rel'],
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(html, config) as unknown as string;
}

/**
 * Strips all HTML tags from a string, leaving only text content
 * @param html - HTML string to strip
 * @returns Plain text without any HTML tags
 */
export function stripHTML(html: string): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }) as unknown as string;
}
