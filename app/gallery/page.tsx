import { unstable_noStore as noStore } from 'next/cache';
import GalleryView from './GalleryView';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  noStore();
  
  let categories: string[] = [];
  let galleryData: Record<string, string[]> = {};
  
  try {
    const res = await fetch('/api/gallery/data', { 
      cache: 'no-store',
    });
    
    if (res.ok) {
      const data = await res.json();
      categories = data.categories || [];
      galleryData = data.galleryData || {};
    }
  } catch (e) {
    console.error('Failed to fetch gallery data:', e);
  }

  return <GalleryView categories={categories} galleryData={galleryData} />;
}
