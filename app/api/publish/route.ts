import { NextResponse } from 'next/server';
import { MarkdownContentRepository } from '@/modules/content/infrastructure/markdown-content-repository';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

const repository = new MarkdownContentRepository();

export async function POST(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { files } = await request.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files specified' }, { status: 400 });
    }

    for (const file of files) {
      if (typeof file !== 'string') {
        return NextResponse.json({ error: 'Invalid file list' }, { status: 400 });
      }

      await repository.publishDraft(file);
    }

    return NextResponse.json({
      success: true,
      publishedFiles: files,
      message:
        'Selected files were marked as published. Source control and deployment are intentionally manual for production safety.',
    });
  } catch (error: any) {
    console.error('Publish error:', error);

    const status =
      error instanceof Error && error.message === 'Invalid draft filename'
        ? 400
        : 500;

    return NextResponse.json(
      { error: status === 400 ? error.message : 'Publish failed' },
      { status }
    );
  }
}
