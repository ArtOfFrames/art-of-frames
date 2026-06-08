'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryGridProps {
  initialCategories: string[];
  galleryData: Record<string, string[]>;
}

export default function GalleryGrid({ initialCategories, galleryData }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const categories = useMemo(() => ['All', ...initialCategories], [initialCategories]);

  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') {
      return Object.values(galleryData).flat();
    }
    return galleryData[activeCategory] || [];
  }, [activeCategory, galleryData]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredImages.length / ITEMS_PER_PAGE));
  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredImages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredImages, currentPage]);

  // Fillers to keep last row balanced (max 4 columns)
  const fillerCount = useMemo(() => {
    const remaining = paginatedImages.length % 4;
    return remaining === 0 ? 0 : 4 - remaining;
  }, [paginatedImages.length]);

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
    <div className="gallery-layout-wrapper">
      {/* Sidebar Filters */}
      <aside className="gallery-sidebar">
        <h3 className="sidebar-title">Categories</h3>
        <nav className="sidebar-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`sidebar-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="sidebar-btn-name">{cat}</span>
              <span className="sidebar-btn-count">{
                cat === 'All'
                  ? Object.values(galleryData).flat().length
                  : (galleryData[cat] || []).length
              }</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="gallery-main">
        {/* Gallery Grid */}
        <div className="gallery-grid">
          {paginatedImages.map((src, index) => {
            const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
            return (
              <div key={src + index} className="gallery-item" onClick={() => openLightbox(globalIndex)}>
                <div className="img-reveal-wrapper">
                  {!failedImages.has(src) ? (
                    <Image
                      src={src}
                      alt={`Gallery image ${globalIndex}`}
                      fill
                      className="gallery-img"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                      onError={() => setFailedImages(prev => new Set(prev).add(src))}
                    />
                  ) : (
                    <div className="gallery-img-fallback">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {/* Invisible filler items to keep last row balanced */}
          {Array.from({ length: fillerCount }).map((_, i) => (
            <div key={`filler-${i}`} className="gallery-item gallery-item-filler" aria-hidden="true" />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-num ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
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
                sizes="90vw"
                priority
                onError={() => setFailedImages(prev => new Set(prev).add(filteredImages[selectedIndex]))}
              />
              <div className="lightbox-image-shadow"></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ==============================
           SIDEBAR LAYOUT
           ============================== */
        .gallery-layout-wrapper {
          display: grid;
          grid-template-columns: var(--sidebar-width) 1fr;
          gap: var(--layout-gap);
          align-items: start;
        }

        /* ==============================
           SIDEBAR
           ============================== */
        .gallery-sidebar {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          position: sticky;
          top: 100px;
        }
        .sidebar-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.5;
          font-weight: 800;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 0.9rem;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: var(--foreground);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .sidebar-btn:hover {
          background: rgba(212,175,55,0.05);
          color: var(--primary);
        }
        .sidebar-btn.active {
          background: rgba(212,175,55,0.1);
          color: var(--primary);
          font-weight: 700;
        }
        .sidebar-btn-name {
          text-transform: capitalize;
        }
        .sidebar-btn-count {
          font-size: 0.7rem;
          opacity: 0.4;
          font-weight: 600;
          background: var(--glass-bg);
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
        }
        .sidebar-btn.active .sidebar-btn-count {
          opacity: 0.8;
          background: rgba(212,175,55,0.15);
        }

        /* ==============================
           MAIN CONTENT
           ============================== */
        .gallery-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Grid Styling */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--grid-gap);
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }
        }
        .gallery-item-filler {
          visibility: hidden;
          pointer-events: none;
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
        .lightbox-image {
          object-fit: contain;
        }
        .gallery-item:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .gallery-item:hover .gallery-img {
          transform: scale(1.1);
        }
        .gallery-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          opacity: 0.2;
        }

        /* ==============================
           PAGINATION
           ============================== */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding-top: 1rem;
        }
        .page-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          color: var(--foreground);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .page-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .page-numbers {
          display: flex;
          gap: 0.3rem;
        }
        .page-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid transparent;
          background: transparent;
          color: var(--foreground);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .page-num:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .page-num.active {
          background: var(--primary);
          color: black;
          border-color: var(--primary);
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
