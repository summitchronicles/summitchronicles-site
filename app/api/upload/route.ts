import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { requireInternalApiAccess } from '@/shared/security/internal-api';
import { assertMaxFileSize, sanitizeFilename } from '@/shared/security/upload';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const unauthorized = requireInternalApiAccess(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    assertMaxFileSize(file, MAX_UPLOAD_BYTES);

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = sanitizeFilename(file.name);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
