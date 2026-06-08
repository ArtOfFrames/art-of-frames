'use client';

import { useState, useEffect } from 'react';
import GalleryGrid from './GalleryGrid';

export default function GalleryView() {
  const [categories, setCategories] = useState<string[]>([]);
  const [galleryData, setGalleryData] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/gallery/data', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          setGalleryData(data.galleryData || {});
        }
      } catch (e) {
        console.error('Failed to fetch gallery data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="gallery-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '120px' }}>
          <p>Loading gallery...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="gallery-page">
      <div className="gallery-layout container">
        <header className="gallery-header">
          <span className="section-subtitle">Visual Storytelling</span>
          <h1 className="title">Our Gallery <span className="gold-accent">/</span></h1>
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
          position: relative;
          overflow: hidden;
        }
        .gallery-page::before {
          content: '';
          position: fixed;
          top: -50%;
          right: -30%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .gallery-layout {
          position: relative;
          z-index: 10;
        }

        .gallery-header {
          margin-bottom: 4rem;
          text-align: left;
        }
        .title {
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -3px;
          line-height: 1;
          margin-bottom: 1.5rem;
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
            max-width: 100%;
          }
          .gallery-page {
            padding-top: 80px;
          }
          .title {
            font-size: 2.2rem;
          }
        }
        @media (max-width: 480px) {
          .title {
            font-size: 1.8rem;
            letter-spacing: -1px;
          }
          .description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </main>
  );
}
