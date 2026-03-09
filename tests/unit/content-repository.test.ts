/**
 * @jest-environment node
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from '@jest/globals';
import { MarkdownContentRepository } from '@/modules/content/infrastructure/markdown-content-repository';

const tempDirs: string[] = [];

describe('MarkdownContentRepository', () => {
  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir && fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it('skips malformed markdown files and returns valid published posts', async () => {
    const blogDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'summit-chronicles-content-')
    );
    tempDirs.push(blogDir);

    fs.writeFileSync(
      path.join(blogDir, 'valid-post.md'),
      [
        '---',
        'title: "Valid post"',
        'date: "2026-03-08"',
        'author: "Summit Explorer"',
        'status: "published"',
        'tags: ["Stories"]',
        '---',
        '',
        'A valid post body.',
      ].join('\n')
    );

    fs.writeFileSync(
      path.join(blogDir, 'broken-post.md'),
      [
        '---',
        'title: "Broken post"',
        'tags: ["["Everest"", ""Weather""]"]',
        '---',
        '',
        'Broken frontmatter.',
      ].join('\n')
    );

    const repository = new MarkdownContentRepository({ blogDir });
    const result = await repository.listPublishedPosts();

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].slug).toBe('valid-post');
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].filename).toBe('broken-post.md');
  });

  it('rejects unsafe draft filenames', async () => {
    const blogDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'summit-chronicles-content-')
    );
    tempDirs.push(blogDir);

    const repository = new MarkdownContentRepository({ blogDir });

    await expect(
      repository.readDraft('../secrets.txt')
    ).rejects.toThrow('Invalid draft filename');
  });
});
