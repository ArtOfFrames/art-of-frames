'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '../../components/CartContext';
import { ShoppingBag, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  description: string;
  specifications?: Record<string, string>;
  mainImage: string;
  secondaryImages: string[];
  status: 'In Stock' | 'Sold Out' | 'Inactive';
  createdAt?: string;
}

interface ProductViewProps {
  initialProducts: Product[];
  categories: string[];
}

export default function ProductView({ initialProducts, categories }: ProductViewProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    // 1. Filter by category
    let result = initialProducts;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // 2. Filter by search query (case-insensitive name search)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // 3. Sort products
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return a.id.localeCompare(b.id);
      }
      if (sortBy === 'oldest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 9999999999999;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 9999999999999;
        if (dateA !== dateB) return dateA - dateB;
        return a.id.localeCompare(b.id);
      }
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy, initialProducts]);

  const allImages = selectedProduct ? [selectedProduct.mainImage, ...selectedProduct.secondaryImages] : [];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (initialProducts.length === 0) {
    return (
      <main className="products-page">
        <div className="container empty-state">
          <h1 className="title">Our Products <span className="gold-slash">/</span></h1>
          <div className="empty-box">
            <p>No products found in <code>public/product_images/</code>.</p>
            <p>Add a category folder and an <code>info.json</code> file to get started.</p>
          </div>
        </div>
        <style jsx>{`
          .products-page { padding-top: 120px; min-height: 100vh; background: var(--background); }
          .empty-state { padding: 4rem 2rem; text-align: center; }
          .title { font-size: 3.5rem; font-family: var(--font-elegant); margin-bottom: 2rem; }
          .gold-slash { color: var(--primary); }
          .empty-box { 
            padding: 4rem; 
            background: var(--glass-bg); 
            border: 1px solid var(--glass-border); 
            border-radius: 30px;
            opacity: 0.6;
          }
          code { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }
        `}</style>
      </main>
    );
  }

  return (
    <main className="products-page">
      <div className="container">
        <header className="page-header">
          <h1 className="title">Our Products <span className="gold-slash">/</span></h1>
          
          <div className="controls-bar">
            {/* Category Filters */}
            <nav className="filter-nav">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                  }}
                >
                  {cat}
                </button>
              ))}
            </nav>

            <div className="search-sort-group">
              {/* Search Bar */}
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    className="clear-search-btn" 
                    onClick={() => setSearchQuery('')} 
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="sort-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => { setSelectedProduct(product); setCurrentImageIndex(0); }}
              >
                <div className="product-image-container">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="product-image"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    {...(index < 3 ? { priority: true, loading: 'eager' as const } : {})}
                  />
                  <div className="product-overlay">
                    <button className="view-btn">View Details</button>
                  </div>
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <span className="sale-badge">SALE -{product.discountPercentage}%</span>
                  )}
                  {product.status !== 'In Stock' && (
                    <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                      {product.status}
                    </span>
                  )}
                </div>
                
                <div className="product-info">
                  <div className="product-meta">
                    <span className="category-label">{product.category}</span>
                    <div className="price-group">
                      {product.originalPrice && (
                        <span className="product-price-original">Rs. {product.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="product-price-main">Rs. {product.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-card-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...product, quantity: 1, image: product.mainImage });
                      }}
                    >
                      <ShoppingBag size={16} />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="search-empty-state">
            <Search size={48} className="empty-icon" />
            <h3>No products found</h3>
            <p>We couldn&apos;t find any products matching your search query or filters.</p>
            <button 
              className="reset-btn"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setSortBy('newest');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}><X /></button>
            
            <div className="modal-body">
              <div className="modal-gallery">
                <div className="main-display">
                  <Image 
                    src={allImages[currentImageIndex]} 
                    alt={selectedProduct.name} 
                    fill 
                    className="full-image" 
                    style={{ objectFit: 'contain' }}
                  />
                  {allImages.length > 1 && (
                    <div className="gallery-nav">
                      <button onClick={handlePrevImage}><ChevronLeft /></button>
                      <button onClick={handleNextImage}><ChevronRight /></button>
                    </div>
                  )}
                </div>
                
                <div className="thumbnail-strip">
                  {allImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumb ${currentImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <Image src={img} alt="thumb" fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-details">
                <span className="modal-category">{selectedProduct.category}</span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="modal-price-group">
                  {selectedProduct.originalPrice && (
                    <span className="modal-price-original">Rs. {selectedProduct.originalPrice.toLocaleString()}</span>
                  )}
                  <div className="modal-price">Rs. {selectedProduct.price.toLocaleString()}</div>
                  {selectedProduct.discountPercentage && selectedProduct.discountPercentage > 0 && (
                    <span className="modal-sale-badge">-{selectedProduct.discountPercentage}% OFF</span>
                  )}
                </div>
                
                <div className="modal-scroll-area">
                  <h4 className="section-label">Description</h4>
                  <p className="modal-desc">{selectedProduct.description}</p>
                  
                  {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                    <>
                      <h4 className="section-label">Specifications</h4>
                      <div className="specs-list">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-key">{key}</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="primary-btn full-width"
                    onClick={() => {
                      addToCart({ ...selectedProduct, quantity: 1, image: selectedProduct.mainImage });
                      setSelectedProduct(null);
                    }}
                  >
                    ADD TO CART
                  </button>
                  <a 
                    href={`https://wa.me/94750350109?text=Hi, I am interested in ${selectedProduct.name}`}
                    target="_blank"
                    className="whatsapp-btn-large"
                  >
                    INQUIRE ON WHATSAPP
                  </a>
                  
                  <div className="bulk-order-notice">
                    Need more than 10? <a href={`https://wa.me/94750350109?text=Hi, I would like to inquire about bulk pricing for ${selectedProduct.name}`} target="_blank">Contact us for bulk pricing.</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .products-page {
          padding-top: 120px;
          min-height: 100vh;
          background: var(--background);
        }
        .page-header { margin-bottom: 4rem; }
        .title { 
          font-size: clamp(2.5rem, 5vw, 4rem); 
          font-family: var(--font-elegant); 
          font-weight: 400; 
          margin-bottom: 2rem;
          letter-spacing: -2px;
        }
        .gold-slash { color: var(--primary); }

        /* Filters */
        .filter-nav { display: flex; gap: 1rem; flex-wrap: wrap; }
        .filter-btn {
          padding: 0.8rem 1.8rem;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--foreground);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: capitalize;
        }
        .filter-btn.active {
          background: var(--primary);
          color: black;
          border-color: var(--primary);
          box-shadow: 0 10px 20px rgba(212,175,55,0.2);
        }

        /* Controls Bar */
        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .search-sort-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          flex-grow: 1;
          justify-content: flex-end;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 100px;
          padding: 0.2rem 0.5rem 0.2rem 1.2rem;
          transition: all 0.3s;
          flex-grow: 1;
          max-width: 320px;
        }
        .search-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
        }
        .search-icon {
          color: var(--foreground);
          opacity: 0.5;
          margin-right: 0.6rem;
          flex-shrink: 0;
        }
        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--foreground);
          font-family: var(--font-main);
          font-size: 0.85rem;
          height: 2.5rem;
          width: 100%;
        }
        .search-input::placeholder {
          color: var(--foreground);
          opacity: 0.4;
        }
        .clear-search-btn {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--foreground);
          opacity: 0.6;
          transition: opacity 0.2s;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .clear-search-btn:hover {
          opacity: 1;
        }
        .sort-wrapper {
          position: relative;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 100px;
          padding: 0 2.5rem 0 1.5rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          height: calc(2.5rem + 0.4rem);
          max-width: 220px;
          width: 100%;
        }
        .sort-wrapper:focus-within {
          border-color: var(--primary);
        }
        .sort-select {
          background: transparent;
          border: none;
          outline: none;
          color: var(--foreground);
          font-family: var(--font-main);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 100%;
          height: 100%;
        }
        .sort-wrapper::after {
          content: '';
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid var(--foreground);
          pointer-events: none;
          opacity: 0.6;
        }
        .sort-select option {
          background: var(--background);
          color: var(--foreground);
        }

        .search-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          text-align: center;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          margin-bottom: 5rem;
          width: 100%;
        }
        .empty-icon {
          color: var(--primary);
          opacity: 0.5;
          margin-bottom: 1.5rem;
        }
        .search-empty-state h3 {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        .search-empty-state p {
          opacity: 0.6;
          margin-bottom: 2rem;
          max-width: 400px;
        }
        .reset-btn {
          background: var(--primary);
          color: black;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.8rem 2rem;
          border-radius: 100px;
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(212,175,55,0.2);
          cursor: pointer;
        }
        .reset-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(212,175,55,0.3);
        }

        /* Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          padding-bottom: 5rem;
        }
        .product-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 30px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .product-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .product-image-container {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
        }
        .product-image { object-fit: cover; transition: transform 0.6s; }
        .product-card:hover .product-image { transform: scale(1.1); }

        /* Overlay */
        .product-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .product-card:hover .product-overlay { opacity: 1; }
        .view-btn {
          padding: 0.8rem 1.5rem;
          background: white;
          color: black;
          border: none;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        /* Badge */
        .status-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          z-index: 5;
        }
        .status-badge.sold-out { background: rgba(255,0,0,0.1); color: #ff4444; border-color: rgba(255,0,0,0.3); }
        .status-badge.inactive { background: rgba(255,255,255,0.1); color: white; border-color: rgba(255,255,255,0.2); }
        
        .sale-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 0, 0, 0.85);
          backdrop-filter: blur(5px);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 2px;
          z-index: 10;
          border: 1px solid rgba(255,0,0,0.3);
          box-shadow: 0 10px 20px rgba(255,0,0,0.2);
        }

        /* Content */
        .product-info { 
          padding: 1.5rem; 
          background: rgba(255,255,255,0.02);
        }
        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;
        }
        .category-label { 
          font-size: 0.7rem; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          color: rgba(255,255,255,0.5);
        }
        .price-group {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .product-price-original {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          text-decoration: line-through;
          margin-bottom: 0.2rem;
        }
        .product-price-main {
          font-size: 1.1rem;
          color: var(--primary);
          font-weight: 600;
        }
        .product-name { 
          font-family: var(--font-heading);
          font-size: 1.4rem; 
          margin-bottom: 1.5rem; 
          line-height: 1.2;
        }
        
        .product-card-actions {
          display: flex;
          gap: 0.8rem;
        }
        .add-to-cart-btn {
          flex: 1;
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .add-to-cart-btn:hover {
          background: var(--primary);
          color: black;
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.25);
          transform: translateY(-2px);
        }
        .add-to-cart-btn:active {
          transform: translateY(0);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .modal-content {
          width: 100%;
          max-width: 1100px;
          background: var(--background);
          border-radius: 40px;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--glass-border);
        }
        .close-modal {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 10;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body { display: grid; grid-template-columns: 1.2fr 1fr; }
        .modal-gallery { background: #0a0a0a; display: flex; flex-direction: column; }
        .main-display { position: relative; aspect-ratio: 1/1; }
        .full-image { object-fit: contain; }
        
        .gallery-nav {
          position: absolute;
          top: 50%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
          transform: translateY(-50%);
        }
        .gallery-nav button {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
        }

        .thumbnail-strip { padding: 1rem; display: flex; gap: 0.8rem; overflow-x: auto; background: #000; }
        .thumb { 
          width: 70px; height: 70px; border-radius: 12px; overflow: hidden; 
          position: relative; cursor: pointer; border: 2px solid transparent; 
          opacity: 0.5; flex-shrink: 0;
        }
        .thumb.active { border-color: var(--primary); opacity: 1; }

        .modal-details { padding: 4rem; display: flex; flex-direction: column; height: 100%; }
        .modal-category { color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 3px; }
        .modal-title { font-size: 3rem; margin: 0.5rem 0 1.5rem; }
        
        .modal-price-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .modal-price {
          font-size: 2.2rem;
          font-family: var(--font-elegant);
          color: var(--primary);
        }
        .modal-price-original {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.4);
          text-decoration: line-through;
        }
        .modal-sale-badge {
          background: rgba(255, 0, 0, 0.15);
          color: #ff4444;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 2px;
          border: 1px solid rgba(255, 0, 0, 0.3);
        }
        
        .modal-scroll-area {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 2.5rem;
          padding-right: 1.5rem;
        }
        .modal-scroll-area::-webkit-scrollbar { width: 4px; }
        .modal-scroll-area::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

        .section-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary);
          margin-bottom: 1rem;
          font-weight: 800;
          opacity: 0.8;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding-bottom: 0.5rem;
        }

        .modal-desc { opacity: 0.7; line-height: 1.8; margin-bottom: 2.5rem; font-size: 0.95rem; }
        
        .specs-list {
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 2rem;
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .spec-key { opacity: 0.5; font-size: 0.85rem; font-weight: 500; }
        .spec-value { font-weight: 700; font-size: 0.85rem; color: var(--foreground); }
        
        .modal-actions { display: flex; flex-direction: column; gap: 1rem; margin-top: auto; }
        .primary-btn { 
          background: var(--primary); color: black; border: none; padding: 1.2rem; 
          border-radius: 100px; font-weight: 800; cursor: pointer; transition: 0.3s;
        }
        .whatsapp-btn-large {
          text-align: center; border: 1px solid var(--glass-border); padding: 1.2rem;
          border-radius: 100px; font-weight: 700; transition: 0.3s;
        }
        .whatsapp-btn-large:hover { border-color: var(--primary); color: var(--primary); }
        
        .bulk-order-notice {
          text-align: center;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          color: var(--foreground);
          opacity: 0.7;
        }
        .bulk-order-notice a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: opacity 0.3s;
        }
        .bulk-order-notice a:hover {
          opacity: 1;
        }

        @media (max-width: 968px) {
          .modal-body { grid-template-columns: 1fr; }
          .modal-details { padding: 2.5rem; }
          .modal-title { font-size: 2rem; }
          .modal-content { max-width: 500px; max-height: 90vh; overflow-y: auto; }
        }

        @media (max-width: 768px) {
          .controls-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .search-sort-group {
            flex-direction: row;
            justify-content: space-between;
          }
          .search-wrapper, .sort-wrapper {
            max-width: none;
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}
