import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @param options - sanitize-html configuration options
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(
  html: string,
  options?: sanitizeHtml.IOptions
): string {
  if (!html) return '';

  // Default configuration
  const config: sanitizeHtml.IOptions = {
    // Allow common HTML tags for blog posts
    allowedTags: options?.allowedTags || [
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
    allowedAttributes: {
      '*': ['class', 'id', 'width', 'height', 'style'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      iframe: [
        'src',
        'width',
        'height',
        'allow',
        'allowfullscreen',
        'frameborder',
      ],
    },
    // Only allow http/https and relative paths for links and images
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['data', 'http', 'https'],
    },
    // Add target="_blank" and rel="noopener noreferrer" to external links
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  };

  // Sanitize and return
  return sanitizeHtml(html, config);
}

/**
 * Sanitizes HTML while preserving more tags (for trusted content like blog posts from CMS)
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string with extended tag support
 */
export function sanitizeBlogContent(html: string): string {
  if (!html) return '';

  const config: sanitizeHtml.IOptions = {
    // More permissive for blog content from trusted CMS
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1',
      'h2',
      'img',
      'figure',
      'figcaption',
      'iframe',
      'span',
      'div',
      'u',
      'ins',
      'del',
    ]),
    allowedAttributes: {
      '*': ['class', 'id', 'width', 'height', 'style'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: [
        'src',
        'width',
        'height',
        'allow',
        'allowfullscreen',
        'frameborder',
        'loading',
      ],
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  };

  return sanitizeHtml(html, config);
}

/**
 * Strips all HTML tags from a string, leaving only text content
 * @param html - HTML string to strip
 * @returns Plain text without any HTML tags
 */
export function stripHTML(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
