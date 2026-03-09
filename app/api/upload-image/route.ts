import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireInternalApiAccess } from '@/shared/security/internal-api';
import {
  assertImageFile,
  assertMaxFileSize,
  assertSafeSlug,
} from '@/shared/security/upload';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' });
    }

    if (!slug) {
      return NextResponse.json({ success: false, error: 'No slug provided' });
    }

    assertSafeSlug(slug);
    assertImageFile(file);
    assertMaxFileSize(file, MAX_IMAGE_BYTES);

    const imagesDir = path.join(
      process.cwd(),
      'content',
      'posts',
      slug,
      'images'
    );
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const timestamp = Date.now();
    const ext = path.extname(file.name) || '.jpg';
    const filename = `uploaded-${timestamp}${ext}`;
    const filePath = path.join(imagesDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const publicDir = path.join(
      process.cwd(),
      'public',
      'content',
      'posts',
      slug,
      'images'
    );
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, filename), buffer);

    return NextResponse.json({
      success: true,
      filename,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
