import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const manifestPath = path.join(process.cwd(), 'public', 'gallery-data.json');

  if (!fs.existsSync(manifestPath)) {
    return NextResponse.json({ categories: [], galleryData: {} });
  }

  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const galleryData = JSON.parse(manifestContent);

    const categories = Object.keys(galleryData);

    return NextResponse.json({ categories, galleryData });
  } catch (e) {
    console.error('Error reading gallery data:', e);
    return NextResponse.json({ categories: [], galleryData: {} });
  }
}
