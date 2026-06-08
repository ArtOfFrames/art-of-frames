'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../../components/CartContext';
import { ShoppingBag, ChevronLeft, ChevronRight, X, Search, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

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

export default function ProductView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const ITEMS_PER_PAGE = 25;
  const addTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  // Fetch data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products/data', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setCategories(['All', ...(data.categories?.filter((c: string) => c !== 'All') || [])]);
        }
      } catch (e) {
        console.error('Failed to fetch products:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Build hierarchical category groups from flat categories list
  const categoryGroups = useMemo(() => {
    type Group = { parent: string; children: string[] };
    const groups: Group[] = [];
    const childParents = new Map<string, string>();

    // Identify which categories are children of a parent
    for (const cat of categories) {
      if (cat === 'All') continue;
      const idx = cat.indexOf(' / ');
      if (idx !== -1) {
        childParents.set(cat, cat.slice(0, idx));
      }
    }

    const parentSet = new Set(childParents.values());
    const processed = new Set<string>();

    // Build groups for parents with children
    for (const parent of parentSet) {
      const children = categories.filter(c => childParents.get(c) === parent);
      groups.push({ parent, children });
      processed.add(parent);
      children.forEach(c => processed.add(c));
    }

    // Add remaining standalone categories
    for (const cat of categories) {
      if (cat === 'All' || processed.has(cat)) continue;
      groups.push({ parent: cat, children: [] });
    }

    return groups;
  }, [categories]);

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1, image: product.mainImage });
    if (addTimerRef.current) clearTimeout(addTimerRef.current);
    setAddedProductId(product.id);
    addTimerRef.current = setTimeout(() => setAddedProductId(null), 1500);
  };

  // Auto-open product modal from URL ?focus= param
  useEffect(() => {
    const focusId = searchParams?.get('focus');
    if (focusId) {
      const product = products.find(p => p.id === focusId);
      if (product) {
        setSelectedProduct(product);
        setCurrentImageIndex(0);
      }
    }
  }, [searchParams, products]);

  useEffect(() => {
    return () => {
      if (addTimerRef.current) clearTimeout(addTimerRef.current);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    // 1. Filter by category
    let result = products;
    if (activeCategory !== 'All') {
      // Hierarchical filter: parent shows its own products AND its subcategory products
      result = result.filter(p => 
        p.category === activeCategory || p.category.startsWith(activeCategory + ' / ')
      );
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
  }, [activeCategory, searchQuery, sortBy, products]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, ITEMS_PER_PAGE]);

  // Fillers to keep last row balanced (max 4 columns)
  const fillerCount = useMemo(() => {
    const remaining = paginatedProducts.length % 4;
    return remaining === 0 ? 0 : 4 - remaining;
  }, [paginatedProducts.length]);

  const allImages = selectedProduct ? [selectedProduct.mainImage, ...selectedProduct.secondaryImages] : [];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (loading) {
    return (
      <main className="products-page">
        <div className="container empty-state" style={{ textAlign: 'center', paddingTop: '120px' }}>
          <p>Loading products...</p>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="products-page">
        <div className="container empty-state">
          <h1 className="title">Our Products <span className="gold-accent">/</span></h1>
          <div className="empty-box">
            <p>No products found in <code>public/product_images/</code>.</p>
            <p>Add a category folder and an <code>info.json</code> file to get started.</p>
          </div>
        </div>
        <style jsx>{`
          .products-page { padding-top: 120px; min-height: 100vh; background: var(--background); }
          .empty-state { padding: 4rem 2rem; text-align: center; }
          .title { font-size: 3.5rem; font-family: var(--font-elegant); margin-bottom: 2rem; }
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
          <span className="section-subtitle">Browse Collection</span>
          <h1 className="title">Our Products <span className="gold-accent">/</span></h1>
          <p className="page-desc">Explore our curated collection of precision laser-cut products.</p>
        </header>
        
        <div className="products-layout-wrapper">
          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            {/* Search */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Search</h3>
              <div className="sidebar-search-wrapper">
                <Search size={16} className="sidebar-search-icon" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sidebar-search-input"
                />
                {searchQuery && (
                  <button 
                    className="sidebar-search-clear" 
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sidebar-select"
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Categories</h3>
              <nav className="sidebar-nav">
                <button
                  className={`sidebar-btn ${activeCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('All')}
                >
                  <span className="sidebar-btn-name">All</span>
                  <span className="sidebar-btn-count">{products.length}</span>
                </button>
                {categoryGroups.map(group => {
                  const count = group.children.length > 0
                    ? products.filter(p => 
                        p.category === group.parent || group.children.includes(p.category)
                      ).length
                    : products.filter(p => p.category === group.parent).length;
                  const isActive = activeCategory === group.parent || group.children.includes(activeCategory);
                  const isExpanded = expandedParents[group.parent] ?? false;
                  const hasChildren = group.children.length > 0;
                  return (
                    <div key={group.parent}>
                      <button
                        className={`sidebar-btn ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          if (hasChildren) {
                            setExpandedParents(prev => ({
                              ...prev,
                              [group.parent]: !(prev[group.parent] ?? false)
                            }));
                          }
                          setActiveCategory(group.parent);
                        }}
                      >
                        <span className="sidebar-btn-name">{group.parent}</span>
                        <span className="sidebar-btn-right">
                          <span className="sidebar-btn-count">{count}</span>
                          {hasChildren && (
                            <ChevronDown 
                              size={14} 
                              className={`parent-chevron ${isExpanded ? 'expanded' : ''}`}
                            />
                          )}
                        </span>
                      </button>
                      {hasChildren && (
                        <div className={`sidebar-subnav ${isExpanded ? '' : 'collapsed'}`}>
                          {group.children.map(child => (
                            <button
                              key={child}
                              className={`sidebar-sub-btn ${activeCategory === child ? 'active' : ''}`}
                              onClick={() => setActiveCategory(child)}
                            >
                              <span>{child.includes(' / ') ? child.split(' / ').pop() : child}</span>
                              <span className="sidebar-btn-count">{
                                products.filter(p => p.category === child).length
                              }</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="products-main">
            {/* Results count */}
            <div className="results-bar">
              <span className="results-count">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</span>
              {filteredProducts.length > 0 && (
                <span className="results-page-info">Page {currentPage} of {totalPages}</span>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {paginatedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="product-card"
                    onClick={() => { setSelectedProduct(product); setCurrentImageIndex(0); }}
                  >
                    <div className="product-image-container">
                      {!failedImages.has(product.mainImage) ? (
                        <Image
                          src={product.mainImage}
                          alt={product.name}
                          fill
                          className="product-image"
                          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                          onError={() => setFailedImages(prev => new Set(prev).add(product.mainImage))}
                        />
                      ) : (
                        <div className="product-image-fallback">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                      <div className="product-overlay">
                        <button className="overlay-btn">View Details</button>
                      </div>
                      <span className="card-category">{product.category}</span>
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <span className="sale-badge">SALE -{product.discountPercentage}%</span>
                      )}
                      {product.status && product.status !== 'In Stock' && (
                        <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                          {product.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-meta">
                        <div className="price-group">
                          {product.originalPrice && (
                            <span className="product-price-original">Rs. {product.originalPrice.toLocaleString()}</span>
                          )}
                          <span className="product-price-main">Rs. {product.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="product-card-actions">
                        <button 
                          className={`add-to-cart-btn ${addedProductId === product.id ? 'added' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          {addedProductId === product.id ? (
                            <>✓ Added</>
                          ) : (
                            <><ShoppingBag size={16} /> ADD TO CART</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Invisible filler items to keep last row balanced */}
                {Array.from({ length: fillerCount }).map((_, i) => (
                  <div key={`filler-${i}`} className="product-card product-card-filler" aria-hidden="true" />
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
        </div>
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
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    ADD TO CART
                  </button>
                  <a 
                    href={`https://api.whatsapp.com/send?phone=94750350109&text=Hi, I am interested in ${selectedProduct.name}`}
                    target="_blank"
                    className="whatsapp-btn-large"
                  >
                    INQUIRE ON WHATSAPP
                  </a>
                  
                  <div className="bulk-order-notice">
                    Need more than 10? <a href={`https://api.whatsapp.com/send?phone=94750350109&text=Hi, I would like to inquire about bulk pricing for ${selectedProduct.name}`} target="_blank">Contact us for bulk pricing.</a>
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
          position: relative;
          overflow: hidden;
        }
        .products-page::before {
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
        .page-header {
          position: relative;
          z-index: 10;
        }
        .page-header { margin-bottom: 2.5rem; }
        .page-desc {
          font-size: 1rem;
          opacity: 0.55;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .title { 
          font-size: clamp(2.5rem, 5vw, 4rem); 
          font-family: var(--font-elegant); 
          font-weight: 400; 
          margin-bottom: 2rem;
          letter-spacing: -2px;
        }

        /* ==============================
           LAYOUT WRAPPER (Sidebar + Main)
           ============================== */
        .products-layout-wrapper {
          display: grid;
          grid-template-columns: var(--sidebar-width) 1fr;
          gap: var(--layout-gap);
          align-items: start;
          position: relative;
          z-index: 10;
        }

        /* ==============================
           SIDEBAR
           ============================== */
        .products-sidebar {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .sidebar-section {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .sidebar-section:not(:last-child) {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .sidebar-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.5;
          font-weight: 800;
        }

        /* Sidebar Search */
        .sidebar-search-wrapper {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.4rem 0.6rem;
          transition: all 0.3s;
        }
        .sidebar-search-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.12);
        }
        .sidebar-search-icon {
          color: var(--foreground);
          opacity: 0.4;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        .sidebar-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--foreground);
          font-family: var(--font-main);
          font-size: 0.85rem;
          width: 100%;
        }
        .sidebar-search-input::placeholder {
          color: var(--foreground);
          opacity: 0.3;
        }
        .sidebar-search-clear {
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--foreground);
          opacity: 0.5;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .sidebar-search-clear:hover {
          opacity: 1;
        }

        /* Sidebar Select */
        .sidebar-select {
          padding: 0.6rem 0.75rem;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--foreground);
          font-size: 0.85rem;
          font-weight: 500;
          font-family: var(--font-main);
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
        }
        .sidebar-select:focus {
          border-color: var(--primary);
        }
        .sidebar-select option {
          background: var(--background);
          color: var(--foreground);
        }

        /* Sidebar Nav */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.75rem;
          border: none;
          border-radius: 8px;
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
        .sidebar-btn-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .parent-chevron {
          flex-shrink: 0;
          transition: transform 0.25s ease;
          opacity: 0.5;
        }
        .parent-chevron.expanded {
          transform: rotate(0deg);
        }
        .parent-chevron:not(.expanded) {
          transform: rotate(-90deg);
        }
        .sidebar-subnav {
          margin-left: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          border-left: 1px solid var(--glass-border);
          padding-left: 0.5rem;
          overflow: hidden;
          max-height: 500px;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
          opacity: 1;
        }
        .sidebar-subnav.collapsed {
          max-height: 0;
          opacity: 0;
          margin: 0;
          padding: 0;
          border: none;
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
          font-size: 0.65rem;
          opacity: 0.4;
          font-weight: 600;
          background: var(--glass-bg);
          padding: 0.1rem 0.4rem;
          border-radius: 100px;
        }
        .sidebar-btn.active .sidebar-btn-count {
          opacity: 0.8;
          background: rgba(212,175,55,0.15);
        }
        .sidebar-sub-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.6rem;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--foreground);
          font-size: 0.8rem;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          font-family: inherit;
          opacity: 0.7;
        }
        .sidebar-sub-btn:hover {
          opacity: 1;
          color: var(--primary);
        }
        .sidebar-sub-btn.active {
          opacity: 1;
          color: var(--primary);
          font-weight: 600;
        }

        /* ==============================
           MAIN CONTENT
           ============================== */
        .products-main {
          display: flex;
          flex-direction: column;
          gap: var(--grid-gap);
        }

        .results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.25rem;
        }
        .results-count {
          font-size: 0.85rem;
          opacity: 0.5;
          font-weight: 500;
        }
        .results-page-info {
          font-size: 0.8rem;
          opacity: 0.4;
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
          grid-template-columns: repeat(4, 1fr);
          gap: var(--grid-gap);
          padding-bottom: 5rem;
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr; }
        }
        .product-card-filler {
          visibility: hidden;
          pointer-events: none;
        }
        .product-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .product-image-container {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #0a0a0a;
        }
        .product-image { 
          object-fit: cover; 
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .product-card:hover .product-image { transform: scale(1.08); }
        .product-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          opacity: 0.3;
        }

        /* Overlay */
        .product-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .product-card:hover .product-overlay { opacity: 1; }
        .overlay-btn {
          padding: 0.6rem 1.4rem;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(4px);
          color: white;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .overlay-btn:hover {
          background: var(--primary);
          color: black;
          border-color: var(--primary);
        }
        /* Badge */
        .status-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 6;
          pointer-events: none;
        }
        .status-badge.sold-out { background: rgba(220,38,38,0.85); color: white; }
        .status-badge.inactive { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
        
        .sale-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          left: auto;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          z-index: 10;
          pointer-events: none;
        }

        /* Content */
        .product-info { 
          padding: 1rem 1.125rem 1.125rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }
        .card-category {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          color: white;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          font-size: 0.55rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 5;
          border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .price-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .product-price-original {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
          text-decoration: line-through;
        }
        .product-price-main {
          font-size: 1rem;
          color: var(--primary);
          font-weight: 700;
        }
        .product-name { 
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        
        .product-card-actions {
          margin-top: 0.75rem;
          display: flex;
          gap: 0.5rem;
        }
        .add-to-cart-btn {
          flex: 1;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: var(--primary);
          padding: 0.55rem 0.75rem;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.7px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .add-to-cart-btn:hover {
          background: var(--primary);
          color: black;
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .add-to-cart-btn:active {
          transform: translateY(0);
        }
        .add-to-cart-btn.added {
          background: #16a34a;
          border-color: #16a34a;
          color: white;
          pointer-events: none;
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

        /* ==============================
           PAGINATION
           ============================== */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem 0 5rem;
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
           RESPONSIVE
           ============================== */
        @media (max-width: 968px) {
          .products-layout-wrapper {
            grid-template-columns: 1fr;
          }
          .products-sidebar {
            position: static;
          }
          .modal-body { grid-template-columns: 1fr; }
          .modal-details { padding: 2.5rem; }
          .modal-title { font-size: 2rem; }
          .modal-content { max-width: 500px; max-height: 90vh; overflow-y: auto; }
        }
        @media (max-width: 768px) {
          .products-page {
            padding-top: 80px;
          }
          .title {
            font-size: 2.2rem;
            margin-bottom: 1rem;
          }
          .page-header {
            margin-bottom: 1.5rem;
          }
          .products-sidebar {
            padding: 1rem;
          }
          .sidebar-section:not(:last-child) {
            padding-bottom: 0.75rem;
          }
          .product-grid {
            gap: 0.75rem;
          }
          .product-info {
            padding: 0.75rem 0.75rem 0.85rem;
          }
          .product-name {
            font-size: 0.85rem;
          }
          .product-price-main {
            font-size: 0.85rem;
          }
          .add-to-cart-btn {
            font-size: 0.55rem;
            padding: 0.4rem 0.5rem;
          }
          .modal-details {
            padding: 1.5rem;
          }
          .modal-title {
            font-size: 1.5rem;
          }
          .modal-price {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 480px) {
          .title {
            font-size: 1.8rem;
          }
          .product-name {
            font-size: 0.8rem;
          }
          .product-card {
            border-radius: 12px;
          }
          .sidebar-btn {
            padding: 0.5rem 0.6rem;
            font-size: 0.8rem;
          }
          .sidebar-sub-btn {
            padding: 0.35rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </main>
  );
}
