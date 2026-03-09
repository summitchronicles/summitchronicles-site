import { NextResponse } from 'next/server';
import { MarkdownContentRepository } from '@/modules/content/infrastructure/markdown-content-repository';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

const repository = new MarkdownContentRepository();

export async function GET(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { drafts, issues } = await repository.listDrafts();

    return NextResponse.json({
      drafts,
      issuesCount: issues.length,
    });
  } catch (error: any) {
    console.error('Error reading drafts:', error);
    return NextResponse.json(
      { error: 'Failed to read drafts', drafts: [] },
      { status: 500 }
    );
  }
}
