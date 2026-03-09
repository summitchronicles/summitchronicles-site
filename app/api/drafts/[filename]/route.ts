import { NextResponse } from 'next/server';
import { MarkdownContentRepository } from '@/modules/content/infrastructure/markdown-content-repository';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

const repository = new MarkdownContentRepository();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { filename } = await params;
    await repository.deleteDraft(decodeURIComponent(filename));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status =
      error instanceof Error && error.message === 'Invalid draft filename'
        ? 400
        : 500;

    return NextResponse.json(
      { error: status === 400 ? error.message : 'Failed to delete draft' },
      { status }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { filename } = await params;
    const content = await repository.readDraft(decodeURIComponent(filename));
    return NextResponse.json({ content });
  } catch (error: any) {
    const status =
      error instanceof Error && error.message === 'Invalid draft filename'
        ? 400
        : 500;

    return NextResponse.json(
      { error: status === 400 ? error.message : 'Failed to read draft' },
      { status }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { filename } = await params;
    const body = await request.json();

    if (!body.content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    await repository.saveDraft(decodeURIComponent(filename), body.content);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status =
      error instanceof Error && error.message === 'Invalid draft filename'
        ? 400
        : 500;

    return NextResponse.json(
      { error: status === 400 ? error.message : 'Failed to update draft' },
      { status }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { filename } = await params;
    await repository.publishDraft(decodeURIComponent(filename));

    return NextResponse.json({
      success: true,
      message: 'Draft marked as published. Commit and deployment are now manual operations.',
    });
  } catch (error: any) {
    const status =
      error instanceof Error && error.message === 'Invalid draft filename'
        ? 400
        : 500;

    return NextResponse.json(
      { error: status === 400 ? error.message : 'Failed to publish draft' },
      { status }
    );
  }
}
