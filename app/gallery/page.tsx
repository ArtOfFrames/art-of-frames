import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import GalleryView from './GalleryView';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  noStore();
  const galleryDir = path.join(process.cwd(), 'public', 'gallery_images');
  
  // Ensure directory exists
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
  }

  const categories = fs.readdirSync(galleryDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const galleryData: Record<string, string[]> = {};

  categories.forEach(category => {
    const categoryPath = path.join(galleryDir, category);
    const files = fs.readdirSync(categoryPath)
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map(file => `/api/images/gallery_images/${category}/${file}`);
    
    if (files.length > 0) {
      galleryData[category] = files;
    }
  });

  return <GalleryView categories={categories} galleryData={galleryData} />;
}
