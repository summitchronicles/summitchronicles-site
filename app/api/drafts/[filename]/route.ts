import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function DELETE(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const filepath = path.join(BLOG_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    fs.unlinkSync(filepath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
// GET: Read raw content for editing
export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const filepath = path.join(BLOG_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error reading draft:', error);
    return NextResponse.json(
      { error: 'Failed to read draft' },
      { status: 500 }
    );
  }
}

// PUT: Update content
export async function PUT(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const filepath = path.join(BLOG_DIR, filename);
    const body = await request.json();

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (!body.content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    fs.writeFileSync(filepath, body.content);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating draft:', error);
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}
// POST: Publish the draft (status: published)
// POST: Publish the draft (status: published)
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const filepath = path.join(BLOG_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const matter = require('gray-matter');
    const { data, content } = matter(fileContent);

    // update status
    data.status = 'published';

    // reconstruct file
    const newContent = matter.stringify(content, data);
    fs.writeFileSync(filepath, newContent);

    // Git Automation
    const gitLogs: string[] = [];
    try {
      const projectRoot = process.cwd();
      const relativePath = path.relative(projectRoot, filepath);

      // Add ALL changes (system updates + content) as requested by user
      const addAllMsg = `[Git] Adding all changes (system updates & content)...`;
      console.log(addAllMsg);
      gitLogs.push(addAllMsg);
      await execAsync(`git add .`, { cwd: projectRoot });

      const commitMsg = `[Git] Committing...`;
      console.log(commitMsg);
      gitLogs.push(commitMsg);
      // Update commit message to indicate potential system updates
      await execAsync(
        `git commit -m "Publish: ${filename} + System Updates" --no-verify`,
        {
          cwd: projectRoot,
        }
      );

      const pushMsg = `[Git] Pushing...`;
      console.log(pushMsg);
      gitLogs.push(pushMsg);
      await execAsync(`git push origin main`, { cwd: projectRoot });

      const successMsg = '[Git] Push successful';
      console.log(successMsg);
      gitLogs.push(successMsg);
    } catch (gitError: any) {
      console.error('Git automation failed:', gitError.message);
      gitLogs.push(`[Error] ${gitError.message}`);
      // We don't fail the request, just log it, as the file IS updated locally.
    }

    return NextResponse.json({
      success: true,
      message: 'Published successfully',
      gitLogs,
    });
  } catch (error: any) {
    console.error('Error publishing draft:', error);
    return NextResponse.json(
      { error: 'Failed to publish draft' },
      { status: 500 }
    );
  }
}
