import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' });
    }

    // Create images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'content', 'posts', slug, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name) || '.jpg';
    const filename = `uploaded-${timestamp}${ext}`;
    const filePath = path.join(imagesDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    // Also copy to public directory for immediate access
    const publicDir = path.join(process.cwd(), 'public', 'content', 'posts', slug, 'images');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, filename);
    fs.writeFileSync(publicPath, buffer);

    return NextResponse.json({
      success: true,
      filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image'
    });
  }
}