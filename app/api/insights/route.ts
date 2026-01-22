import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'content',
      'training-insights.json'
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'No insights generated yet',
      });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const insights = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load insights' },
      { status: 500 }
    );
  }
}
