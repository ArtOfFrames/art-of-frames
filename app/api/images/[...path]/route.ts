import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('Path parameter is missing', { status: 400 });
    }

    // Join path segments to get the relative path
    const relativePath = path.join(...pathSegments);

    // Resolve the absolute path under process.cwd() / public
    const publicDir = path.join(process.cwd(), 'public');
    const absolutePath = path.resolve(publicDir, relativePath);

    // Security check: Ensure the path is strictly inside the public directory
    // and specifically within product_images or gallery_images
    const allowedSubdirs = [
      path.join(publicDir, 'product_images'),
      path.join(publicDir, 'gallery_images'),
    ];

    const isAllowed = allowedSubdirs.some((subdir) => 
      absolutePath.startsWith(subdir)
    );

    if (!isAllowed) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    // Determine content type based on extension
    const ext = path.extname(absolutePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml';
    }

    // Read the file and return as response
    const fileBuffer = fs.readFileSync(absolutePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
