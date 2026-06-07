'use client';

import GalleryGrid from './GalleryGrid';

interface GalleryViewProps {
  categories: string[];
  galleryData: Record<string, string[]>;
}

export default function GalleryView({ categories, galleryData }: GalleryViewProps) {
  return (
    <main className="gallery-page">
      <div className="gallery-layout container">
        <header className="gallery-header">
          <span className="subtitle">Visual Storytelling</span>
          <h1 className="title">Our Gallery <span className="gold-slash">/</span></h1>
          <p className="description">
            Explore our curated collection of precision-crafted masterpieces, 
            categorized by craft and material.
          </p>
        </header>

        <GalleryGrid initialCategories={categories} galleryData={galleryData} />
      </div>

      <style jsx>{`
        .gallery-page {
          padding-top: 120px;
          min-height: 100vh;
          background: var(--background);
        }
        .gallery-layout {
          max-width: 1400px;
          margin: 0 auto;
        }
        .gallery-header {
          margin-bottom: 4rem;
          text-align: left;
        }
        .subtitle {
          color: var(--primary);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 1rem;
        }
        .title {
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -3px;
          line-height: 1;
          margin-bottom: 1.5rem;
        }
        .gold-slash {
          color: var(--primary);
        }
        .description {
          max-width: 500px;
          opacity: 0.5;
          font-size: 1rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .gallery-header {
            text-align: center;
          }
          .description {
            margin: 0 auto;
          }
          .gallery-page {
            padding-top: 80px;
          }
        }
      `}</style>
    </main>
  );
}
