'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryGridProps {
  initialCategories: string[];
  galleryData: Record<string, string[]>;
}

export default function GalleryGrid({ initialCategories, galleryData }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const categories = useMemo(() => ['All', ...initialCategories], [initialCategories]);

  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') {
      return Object.values(galleryData).flat();
    }
    return galleryData[activeCategory] || [];
  }, [activeCategory, galleryData]);

  const goNext = useCallback(() => {
    if (selectedIndex === null || isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setSelectedIndex((selectedIndex + 1) % filteredImages.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [selectedIndex, filteredImages.length, isAnimating]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null || isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setSelectedIndex((selectedIndex - 1 + filteredImages.length) % filteredImages.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [selectedIndex, filteredImages.length, isAnimating]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setDirection(null);
    setIsAnimating(false);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setDirection(null);
    setSelectedIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, goNext, goPrev, closeLightbox]);

  if (Object.keys(galleryData).length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📸</div>
        <h3>No images found</h3>
        <p>Add images to your <code>public/gallery_images/[Category]</code> folders to see them here.</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 100px 0;
            opacity: 0.6;
          }
          .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
          code { background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Category Filter */}
      <nav className="category-nav">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            {activeCategory === cat && <span className="dot"></span>}
          </button>
        ))}
      </nav>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredImages.map((src, index) => (
          <div key={src + index} className="gallery-item" onClick={() => openLightbox(index)}>
            <div className="img-reveal-wrapper">
              <Image
                src={src}
                alt={`Gallery image ${index}`}
                fill
                className="gallery-img"
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          {/* Backdrop */}
          <div className="lightbox-backdrop"></div>

          {/* Close button */}
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); closeLightbox(); }} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Counter */}
          <div className="lightbox-counter">
            {selectedIndex + 1} / {filteredImages.length}
          </div>

          {/* Previous Arrow */}
          <button
            className={`lightbox-nav lightbox-prev ${filteredImages.length <= 1 ? 'hidden' : ''}`}
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            className={`lightbox-nav lightbox-next ${filteredImages.length <= 1 ? 'hidden' : ''}`}
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* Image */}
          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className={`lightbox-image-inner ${direction === 'right' ? 'slide-in-right' : direction === 'left' ? 'slide-in-left' : ''}`}>
              <Image
                src={filteredImages[selectedIndex]}
                alt={`Gallery image ${selectedIndex + 1}`}
                fill
                className="lightbox-image"
                style={{ objectFit: 'contain' }}
                sizes="90vw"
                priority
              />
              <div className="lightbox-image-shadow"></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        /* Nav Styling */
        .category-nav {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
          position: sticky;
          top: 100px;
          z-index: 50;
          background: var(--background);
          padding: 10px 0;
        }
        .cat-btn {
          background: transparent;
          border: 1px solid var(--glass-border);
          padding: 0.8rem 1.5rem;
          border-radius: 100px;
          color: var(--foreground);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: capitalize;
        }
        .cat-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: black;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }
        .cat-btn:hover:not(.active) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .dot {
          width: 6px;
          height: 6px;
          background: black;
          border-radius: 50%;
        }

        /* Grid Styling */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          padding-bottom: 5rem;
        }
        .gallery-item {
          aspect-ratio: 1/1;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
        }
        .img-reveal-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .gallery-img {
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .gallery-item:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .gallery-item:hover .gallery-img {
          transform: scale(1.1);
        }

        /* ==============================
           LIGHTBOX
           ============================== */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightbox-fade-in 0.3s ease-out;
        }
        .lightbox-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(20px);
          animation: backdrop-fade-in 0.3s ease-out;
        }

        @keyframes lightbox-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdrop-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Close Button */
        .lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 10010;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          animation: lightbox-fade-in 0.4s 0.15s both;
        }
        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.1);
        }

        /* Counter */
        .lightbox-counter {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10010;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 2px;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 1.2rem;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: lightbox-fade-in 0.4s 0.2s both;
        }

        /* Navigation Arrows */
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10010;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: lightbox-fade-in 0.4s 0.1s both;
          opacity: 0.7;
        }
        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
        }
        .lightbox-nav:active {
          transform: translateY(-50%) scale(0.95);
        }
        .lightbox-nav.hidden {
          display: none;
        }
        .lightbox-prev {
          left: 1.5rem;
        }
        .lightbox-next {
          right: 1.5rem;
        }

        /* Image Container */
        .lightbox-image-wrapper {
          position: relative;
          z-index: 10005;
          width: 85vw;
          height: 85vh;
          max-width: 1200px;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightbox-scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .lightbox-image-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .lightbox-image-inner.slide-in-right {
          animation: slide-from-right 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .lightbox-image-inner.slide-in-left {
          animation: slide-from-left 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .lightbox-image {
          object-fit: contain;
          border-radius: 8px;
        }
        .lightbox-image-shadow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 8px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        @keyframes lightbox-scale-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-from-right {
          from {
            opacity: 0.4;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-from-left {
          from {
            opacity: 0.4;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .category-nav {
            justify-content: center;
            top: 80px;
          }

          .lightbox-image-wrapper {
            width: 92vw;
            height: 70vh;
          }
          .lightbox-nav {
            width: 44px;
            height: 44px;
          }
          .lightbox-prev {
            left: 0.75rem;
          }
          .lightbox-next {
            right: 0.75rem;
          }
          .lightbox-close {
            top: 0.75rem;
            right: 0.75rem;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
