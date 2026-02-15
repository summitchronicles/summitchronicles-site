import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { files, message } = await request.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files specified' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Commit message required' }, { status: 400 });
    }

    const cwd = process.cwd();

    // Set status: published in frontmatter for each blog file
    for (const file of files) {
      const filepath = path.join(cwd, file);
      if (fs.existsSync(filepath) && filepath.endsWith('.md')) {
        const raw = fs.readFileSync(filepath, 'utf-8');
        const { data, content } = matter(raw);
        data.status = 'published';
        const updated = matter.stringify(content, data);
        fs.writeFileSync(filepath, updated);
      }
    }

    const fileList = files.map((f: string) => `"${f}"`).join(' ');

    // Also stage any untracked uploads referenced in blog content
    await execAsync('git add public/uploads/', { cwd }).catch(() => {});

    // git add + commit + push
    const addResult = await execAsync(`git add ${fileList}`, { cwd });
    const commitResult = await execAsync(`git commit --no-verify -m "${message.replace(/"/g, '\\"')}"`, { cwd });
    const pushResult = await execAsync('git push', { cwd });

    const hashMatch = commitResult.stdout.match(/\[[\w/]+ ([a-f0-9]+)\]/);
    const commitHash = hashMatch ? hashMatch[1] : null;

    return NextResponse.json({
      success: true,
      commitHash,
      logs: [addResult.stdout, commitResult.stdout, pushResult.stdout].filter(Boolean),
    });
  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: error.message || 'Publish failed' },
      { status: 500 }
    );
  }
}
