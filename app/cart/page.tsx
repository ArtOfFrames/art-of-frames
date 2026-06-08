'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<'cod' | 'bank'>('bank');
  
  const deliveryFee = selectedDelivery === 'cod' ? 400 : selectedDelivery === 'bank' ? 250 : 0;
  const grandTotal = total + deliveryFee;

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="cart-page">
      {/* Background Ambient Glow */}
      <div className="page-glow" />

      <div className="container section-padding">
        {/* Page Header */}
        <div className="page-header">
          <span className="section-subtitle">Review & Checkout</span>
          <h1 className="page-title">
            Your <span className="gold-accent">Cart</span>
          </h1>
          <p className="page-desc">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart — review before proceeding.
          </p>
        </div>

        <div className="cart-layout">
          {/* ====================== CART ITEMS SECTION ====================== */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2 className="items-section-title">Cart Items</h2>
              <span className="items-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="cart-items-list">
              {cart.map((item, index) => (
                <div key={item.id} className="cart-item-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  {/* Image */}
                  <div 
                    className="cart-item-image"
                    onClick={() => router.push(`/products?focus=${item.id}`)}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="cart-item-image-placeholder">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="cart-item-info">
                    <span 
                      className="cart-item-category"
                      onClick={() => router.push(`/products?focus=${item.id}`)}
                    >
                      {item.category}
                    </span>
                    <h3 
                      className="cart-item-name"
                      onClick={() => router.push(`/products?focus=${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    <div className="cart-item-meta">
                      <span className="cart-item-unit-price">Rs. {item.price.toLocaleString()} each</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-quantity">
                    <span className="qty-label">Qty</span>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="cart-item-total">
                    <span className="item-total-label">Total</span>
                    <span className="item-total-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    <button 
                      className="item-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total-bar">
              <span className="total-bar-label">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
              <span className="total-bar-amount">Rs. {total.toLocaleString()}</span>
            </div>

            <Link href="/products" className="continue-shopping-link">
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* ====================== ORDER SUMMARY SECTION ====================== */}
          <div className="order-summary-section">
            <div className="summary-sticky">
              <h2 className="summary-title">Order Summary</h2>

              {/* Delivery & Payment Options */}
              <div className="delivery-section">
                <h3 className="delivery-section-title">
                  Delivery & Payment
                </h3>

                <div className="delivery-options">
                  <button
                    className={`delivery-option ${selectedDelivery === 'bank' ? 'selected' : ''}`}
                    onClick={() => setSelectedDelivery('bank')}
                  >
                    <div className="option-left">
                      <span className={`radio-dot ${selectedDelivery === 'bank' ? 'checked' : ''}`} />
                      <div className="option-text">
                        <strong>Bank Deposit</strong>
                        <span className="option-desc">Pay in full via bank transfer</span>
                      </div>
                    </div>
                    <span className="option-fee">Rs. 250</span>
                  </button>

                  <button
                    className={`delivery-option ${selectedDelivery === 'cod' ? 'selected' : ''}`}
                    onClick={() => setSelectedDelivery('cod')}
                  >
                    <div className="option-left">
                      <span className={`radio-dot ${selectedDelivery === 'cod' ? 'checked' : ''}`} />
                      <div className="option-text">
                        <strong>Cash on Delivery</strong>
                        <span className="option-desc">Pay 40% advance, rest on delivery</span>
                      </div>
                    </div>
                    <span className="option-fee">Rs. 400</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span className="price-label">Delivery Fee ({selectedDelivery === 'cod' ? 'COD' : 'Bank Deposit'})</span>
                  <span className="price-value delivery-fee">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                {selectedDelivery === 'cod' && (
                  <div className="price-row advance-row">
                    <span className="price-label">Advance (40%)</span>
                    <span className="price-value advance-value">Rs. {Math.round(grandTotal * 0.4).toLocaleString()}</span>
                  </div>
                )}
                <div className="price-divider" />
                <div className="price-row grand-total">
                  <span className="price-label">Grand Total</span>
                  <span className="price-value grand-total-value">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={() => router.push(`/checkout?delivery=${selectedDelivery}`)}
              >
                Proceed to Checkout
                <span className="btn-arrow">→</span>
              </button>

              <div className="secure-badge">
                <ShieldCheck size={14} />
                <span>Secure checkout via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ==============================
           CART PAGE STYLES
           ============================== */

        .cart-page {
          background: var(--background);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .page-glow {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* --- Page Header --- */
        .page-header {
          position: relative;
          z-index: 10;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: clamp(2.8rem, 5vw, 4rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -2px;
          line-height: 0.95;
          margin-bottom: 1rem;
          color: var(--foreground);
        }

        .page-desc {
          font-size: 1rem;
          opacity: 0.55;
          line-height: 1.6;
        }

        /* ==============================
           LAYOUT
           ============================== */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--grid-gap);
          align-items: start;
          position: relative;
          z-index: 10;
        }

        /* ==============================
           CART ITEMS SECTION
           ============================== */
        .cart-items-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-items-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.25rem;
        }

        .items-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .items-count {
          font-size: 0.8rem;
          padding: 0.35rem 1rem;
          border-radius: 100px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.15);
          color: var(--primary);
          font-weight: 700;
        }

        /* Cart Items List */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cart-item-card {
          display: grid;
          grid-template-columns: 80px 1fr auto auto;
          gap: 1rem;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          animation: itemFadeIn 0.4s ease both;
        }
        .cart-item-card:hover {
          border-color: rgba(212,175,55,0.25);
          background: rgba(212,175,55,0.02);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }

        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Item Image */
        .cart-item-image {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--glass-bg);
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .cart-item-image:hover {
          transform: scale(1.05);
        }
        .cart-item-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
        }

        /* Item Info */
        .cart-item-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          min-width: 0;
        }
        .cart-item-category {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          opacity: 0.4;
          cursor: pointer;
          transition: color 0.2s;
        }
        .cart-item-category:hover {
          color: var(--primary);
          opacity: 1;
        }
        .cart-item-name {
          font-size: 1.05rem;
          font-weight: 700;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cart-item-name:hover {
          color: var(--primary);
        }
        .cart-item-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cart-item-unit-price {
          font-size: 0.8rem;
          opacity: 0.5;
        }

        /* Quantity */
        .cart-item-quantity {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }
        .qty-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.35;
          font-weight: 700;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.25rem;
        }
        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--foreground);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          opacity: 0.5;
        }
        .qty-btn:hover {
          opacity: 1;
          background: rgba(212,175,55,0.1);
          color: var(--primary);
        }
        .qty-value {
          min-width: 24px;
          text-align: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        /* Item Total */
        .cart-item-total {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
        }
        .item-total-label {
          display: none;
        }
        .item-total-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary);
          white-space: nowrap;
        }
        .item-remove-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--foreground);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
          opacity: 0.3;
          margin-top: 0.2rem;
        }
        .item-remove-btn:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
          transform: scale(1.1);
        }

        /* Total Bar */
        .cart-total-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02));
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 20px;
        }
        .total-bar-label {
          font-size: 0.95rem;
          font-weight: 600;
          opacity: 0.7;
        }
        .total-bar-amount {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--primary);
        }

        .continue-shopping-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.5;
          font-weight: 600;
          transition: all 0.3s;
          width: fit-content;
          margin-top: 0.25rem;
        }
        .continue-shopping-link:hover {
          opacity: 1;
          color: var(--primary);
          gap: 0.75rem;
        }

        /* ==============================
           ORDER SUMMARY SECTION
           ============================== */
        .order-summary-section {
          position: relative;
        }

        .summary-sticky {
          position: sticky;
          top: 100px;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .summary-sticky:hover {
          border-color: rgba(212,175,55,0.2);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .summary-title {
          font-size: 1.3rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        /* Delivery Section */
        .delivery-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .delivery-section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.5;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .delivery-options {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .delivery-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.2rem;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          font-family: inherit;
          color: inherit;
        }
        .delivery-option:hover {
          border-color: rgba(212,175,55,0.3);
        }
        .delivery-option.selected {
          border-color: var(--primary);
          background: rgba(212,175,55,0.05);
          box-shadow: 0 0 20px rgba(212,175,55,0.08);
        }

        .option-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .radio-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s;
        }
        .radio-dot.checked {
          border-color: var(--primary);
          background: var(--primary);
          box-shadow: 0 0 8px rgba(212,175,55,0.3);
        }
        .radio-dot.checked::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: black;
        }
        .option-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .option-text strong {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .option-text .option-desc {
          font-size: 0.72rem;
          opacity: 0.5;
        }
        .option-fee {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
          background: rgba(212,175,55,0.1);
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          white-space: nowrap;
        }

        /* Price Breakdown */
        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .price-label {
          font-size: 0.9rem;
          opacity: 0.6;
        }
        .price-value {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .price-value.delivery-fee {
          color: var(--primary);
        }
        .advance-row {
          font-size: 0.85rem;
        }
        .advance-value {
          color: var(--primary);
        }
        .price-divider {
          height: 1px;
          background: linear-gradient(to right, var(--glass-border), transparent);
          margin: 0.3rem 0;
        }
        .grand-total .price-label {
          font-size: 1rem;
          font-weight: 800;
          opacity: 1;
        }
        .grand-total-value {
          font-size: 1.5rem !important;
          font-weight: 900;
          color: var(--primary);
        }

        /* Checkout Button */
        .checkout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.1rem;
          border-radius: 16px;
          background: var(--primary);
          color: black;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 1px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .checkout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
        }
        .checkout-btn .btn-arrow {
          transition: transform 0.3s ease;
        }
        .checkout-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          opacity: 0.4;
          font-weight: 600;
        }

        /* ==============================
           RESPONSIVE
           ============================== */
        @media (max-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .summary-sticky {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .cart-page {
            padding-top: 0;
          }
          .cart-layout {
            gap: 1.5rem;
          }
          .cart-item-card {
            grid-template-columns: 48px 1fr;
            gap: 0.5rem;
            padding: 0.75rem;
            border-radius: 14px;
          }
          .cart-item-image {
            width: 48px;
            height: 48px;
            border-radius: 10px;
          }
          .cart-item-name {
            font-size: 0.85rem;
          }
          .cart-item-category {
            font-size: 0.55rem;
          }
          .cart-item-unit-price {
            font-size: 0.7rem;
          }
          .cart-item-quantity {
            grid-column: 2;
            flex-direction: row;
            align-items: center;
            gap: 0.4rem;
            margin-top: 0.1rem;
          }
          .qty-label {
            display: none;
          }
          .cart-item-total {
            grid-column: 2;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            gap: 0.4rem;
            margin-top: 0.1rem;
          }
          .item-total-price {
            font-size: 0.9rem;
          }
          .item-remove-btn {
            width: 26px;
            height: 26px;
            margin-top: 0;
          }
          .cart-total-bar {
            padding: 0.85rem 1rem;
          }
          .total-bar-amount {
            font-size: 1.1rem;
          }
          .delivery-option {
            padding: 0.75rem 0.85rem;
          }
          .option-text strong {
            font-size: 0.8rem;
          }
          .option-text .option-desc {
            font-size: 0.65rem;
          }
          .summary-sticky {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2.2rem;
          }
          .summary-sticky {
            padding: 1.5rem;
          }
          .grand-total-value {
            font-size: 1.2rem !important;
          }
          .cart-item-name {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </main>
  );
}

/* ==============================
   EMPTY CART COMPONENT
   ============================== */
function EmptyCart() {
  return (
    <main className="empty-cart-page">
      <div className="empty-glow" />
      <div className="container">
        <div className="empty-content">
          <div className="empty-icon-wrapper">
            <ShoppingBag size={32} />
          </div>
          <h1 className="empty-title">
            Your Cart is <span className="gold-accent">Empty</span>
          </h1>
          <p className="empty-desc">
            Looks like you haven&apos;t added anything yet.<br />
            Explore our collection of premium laser-crafted products.
          </p>
          <Link href="/products" className="browse-btn">
            Browse Products
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .empty-cart-page {
          background: var(--background);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .empty-content {
          position: relative;
          z-index: 10;
          text-align: center;
          animation: fadeInUp 0.6s ease both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .empty-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: var(--primary);
          opacity: 0.4;
        }
        .empty-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -1px;
          margin-bottom: 1rem;
          color: var(--foreground);
        }
        .empty-desc {
          font-size: 1rem;
          opacity: 0.55;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.2rem 2.5rem;
          border-radius: 100px;
          background: var(--primary);
          color: black;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 2px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .browse-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
        }
        .browse-btn .btn-arrow {
          transition: transform 0.3s ease;
        }
        .browse-btn:hover .btn-arrow {
          transform: translateX(5px);
        }
      `}</style>
    </main>
  );
}
