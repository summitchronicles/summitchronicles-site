import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ContentIssue {
  filename: string;
  reason: string;
}

export interface PublishedPostRecord {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  status: string;
}

export interface DraftRecord {
  filename: string;
  title: string;
  date: string;
  author: string;
  status: string;
  hasImage: boolean;
  wordCount: number;
  slug: string;
}

interface MarkdownContentRepositoryOptions {
  blogDir?: string;
}

export class MarkdownContentRepository {
  private readonly blogDir: string;

  constructor(options: MarkdownContentRepositoryOptions = {}) {
    this.blogDir =
      options.blogDir ?? path.join(process.cwd(), 'content', 'blog');
  }

  async listPublishedPosts(): Promise<{
    posts: PublishedPostRecord[];
    issues: ContentIssue[];
  }> {
    if (!fs.existsSync(this.blogDir)) {
      return { posts: [], issues: [] };
    }

    const issues: ContentIssue[] = [];
    const posts: PublishedPostRecord[] = [];

    for (const filename of this.listMarkdownFiles()) {
      try {
        const fileContent = fs.readFileSync(
          path.join(this.blogDir, filename),
          'utf-8'
        );
        const { data, content } = matter(fileContent);

        if ((data.status ?? 'draft') !== 'published') {
          continue;
        }

        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
        let heroImage = data.image || data.heroImage || '/stories/default.jpg';

        if (!data.image && !data.heroImage) {
          const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
          if (imageMatch) {
            heroImage = imageMatch[1];
          }
        }

        posts.push({
          slug: filename.replace(/\.md$/, ''),
          title: data.title || filename.replace(/-/g, ' ').replace('.md', ''),
          subtitle:
            data.description ||
            data.subtitle ||
            content.substring(0, 150).replace(/[#*`]/g, '').trim() + '...',
          author: data.author || 'Summit Explorer',
          date: data.date || new Date().toISOString(),
          category: (data.tags?.[0] || 'STORIES').toUpperCase(),
          image: heroImage,
          readTime,
          status: data.status || 'draft',
        });
      } catch (error) {
        issues.push({
          filename,
          reason: error instanceof Error ? error.message : 'Invalid markdown',
        });
      }
    }

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { posts, issues };
  }

  async listDrafts(): Promise<{ drafts: DraftRecord[]; issues: ContentIssue[] }> {
    if (!fs.existsSync(this.blogDir)) {
      return { drafts: [], issues: [] };
    }

    const drafts: DraftRecord[] = [];
    const issues: ContentIssue[] = [];

    for (const filename of this.listMarkdownFiles()) {
      try {
        const fileContent = fs.readFileSync(
          path.join(this.blogDir, filename),
          'utf-8'
        );
        const { data, content } = matter(fileContent);

        drafts.push({
          filename,
          title: data.title || 'Untitled',
          date: data.date || 'No date',
          author: data.author || 'Unknown',
          status: data.status || 'draft',
          hasImage: content.includes('![') || content.includes('<img'),
          wordCount: content.split(/\s+/).filter(Boolean).length,
          slug: filename.replace(/\.md$/, ''),
        });
      } catch (error) {
        issues.push({
          filename,
          reason: error instanceof Error ? error.message : 'Invalid markdown',
        });
      }
    }

    drafts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { drafts, issues };
  }

  async readDraft(filename: string): Promise<string> {
    const filepath = this.resolveDraftPath(filename);
    return fs.readFileSync(filepath, 'utf-8');
  }

  async saveDraft(filename: string, content: string) {
    const filepath = this.resolveDraftPath(filename);
    fs.writeFileSync(filepath, content, 'utf8');
  }

  async deleteDraft(filename: string) {
    const filepath = this.resolveDraftPath(filename);
    fs.unlinkSync(filepath);
  }

  async publishDraft(filename: string) {
    const filepath = this.resolveDraftPath(filename);
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const { data, content } = matter(fileContent);

    data.status = 'published';

    fs.writeFileSync(filepath, matter.stringify(content, data), 'utf8');
  }

  private listMarkdownFiles() {
    return fs
      .readdirSync(this.blogDir)
      .filter((file) => file.endsWith('.md'))
      .sort();
  }

  private resolveDraftPath(filename: string) {
    if (!/^[A-Za-z0-9._-]+\.md$/.test(filename)) {
      throw new Error('Invalid draft filename');
    }

    const resolvedPath = path.resolve(this.blogDir, filename);
    if (!resolvedPath.startsWith(path.resolve(this.blogDir) + path.sep)) {
      throw new Error('Invalid draft filename');
    }

    return resolvedPath;
  }
}
