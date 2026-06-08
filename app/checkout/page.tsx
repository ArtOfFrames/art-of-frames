'use client';

import { useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container section-padding" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <p>Loading checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { cart, total, clearCart } = useCart();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const deliveryMethod = searchParams.get('delivery') || 'cod';
  
  const deliveryFee = deliveryMethod === 'cod' ? 400 : 250;
  const grandTotal = total + deliveryFee;
  const advanceAmount = deliveryMethod === 'cod' ? Math.round(grandTotal * 0.4) : grandTotal;
  const remainingAmount = deliveryMethod === 'cod' ? grandTotal - advanceAmount : 0;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    const date = new Date();
    const orderNo = Math.floor(Math.random() * 100000);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    const itemsRows = cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>Rs. ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>`).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${orderNo} – Art of Frames</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #333;
      display: flex;
      justify-content: center;
      padding: 40px 16px;
    }
    .page {
      background: #fff;
      width: 700px;
      padding: 40px 48px 48px;
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand-text h1 { font-size: 26px; font-weight: 700; color: #d4af37; }
    .brand-text p { font-size: 12px; color: #888; margin-top: 2px; }
    .contact-info { text-align: right; font-size: 12.5px; color: #444; line-height: 1.8; }
    .divider { border: none; border-top: 1.5px solid #ddd; margin: 0 0 24px; }
    .invoice-title { text-align: center; font-size: 28px; font-weight: 700; color: #d4af37; letter-spacing: 3px; margin-bottom: 28px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
    .info-box { background: #f8f8f8; border-radius: 6px; padding: 16px 20px; }
    .info-box h3 { font-size: 11px; font-weight: 700; color: #555; letter-spacing: 1px; margin-bottom: 12px; }
    .info-row { display: grid; grid-template-columns: 90px 1fr; font-size: 13px; color: #555; margin-bottom: 6px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-row .label { color: #888; }
    .info-row .value { color: #333; font-weight: 600; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .items-table thead tr { background: #d4af37; }
    .items-table thead th { color: #fff; font-size: 12px; font-weight: 700; padding: 11px 16px; text-align: left; }
    .items-table thead th:nth-child(2), .items-table thead th:nth-child(3), .items-table thead th:nth-child(4) { text-align: right; }
    .items-table tbody tr { border-bottom: 1px solid #eee; }
    .items-table tbody td { padding: 14px 16px; font-size: 13.5px; color: #444; }
    .items-table tbody td:nth-child(2), .items-table tbody td:nth-child(3), .items-table tbody td:nth-child(4) { text-align: right; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 36px; }
    .totals-box { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 13.5px; color: #555; padding: 6px 0; }
    .totals-row .t-label { color: #666; }
    .totals-row .t-value { color: #333; }
    .totals-divider { border: none; border-top: 2px solid #d4af37; margin: 8px 0; }
    .totals-row.cod { font-weight: 700; font-size: 15px; }
    .totals-row.cod .t-label, .totals-row.cod .t-value { color: #d4af37; }
    .footer-divider { border: none; border-top: 1.5px solid #ddd; margin-bottom: 20px; }
    .footer { text-align: center; }
    .footer .thank-you { font-size: 17px; font-weight: 700; color: #d4af37; margin-bottom: 6px; }
    .footer .powered { font-size: 11px; color: #aaa; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <div style="width:70px;height:70px;background:#d4af37;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;flex-shrink:0;">AF</div>
        <div class="brand-text">
          <h1>Art of Frames</h1>
          <p>Moments made timeless</p>
        </div>
      </div>
      <div class="contact-info">
        <div>Near the temple, Seelagama, Belihuloya</div>
        <div>0750 350 109</div>
      </div>
    </div>

    <hr class="divider">
    <div class="invoice-title">INVOICE</div>

    <div class="info-grid">
      <div class="info-box">
        <h3>CUSTOMER INFORMATION</h3>
        <div class="info-row"><span class="label">Name:</span><span class="value">${formData.name}</span></div>
        <div class="info-row"><span class="label">Address:</span><span class="value">${formData.address}</span></div>
      </div>
      <div class="info-box">
        <h3>ORDER DETAILS</h3>
        <div class="info-row"><span class="label">Order #:</span><span class="value">${orderNo}</span></div>
        <div class="info-row"><span class="label">Created:</span><span class="value">${formattedDate}</span></div>
        <div class="info-row"><span class="label">Delivery:</span><span class="value">${deliveryMethod === 'cod' ? 'COD' : 'Bank Deposit'}</span></div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <span class="t-label">Subtotal:</span>
          <span class="t-value">Rs. ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="totals-row">
          <span class="t-label">Delivery:</span>
          <span class="t-value">Rs. ${deliveryFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <hr class="totals-divider">
        <div class="totals-row">
          <span class="t-label">Grand Total:</span>
          <span class="t-value">Rs. ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="totals-row" style="color:${deliveryMethod === 'cod' ? '#d4af37' : '#333'};font-weight:700">
          <span class="t-label">Advance (${deliveryMethod === 'cod' ? '40%' : 'Full'}):</span>
          <span class="t-value">Rs. ${advanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ${deliveryMethod === 'cod' ? `
        <div class="totals-row">
          <span class="t-label">Remaining:</span>
          <span class="t-value">Rs. ${remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ` : ''}
      </div>
    </div>

    <hr class="footer-divider">
    <div class="footer">
      <div class="thank-you">Thank you for your business</div>
      <div class="powered">Art of Frames — Premium Laser Cutting & Engraving</div>
    </div>
  </div>
</body>
</html>`;

    // Render HTML into the hidden div
    if (invoiceRef.current) {
      invoiceRef.current.innerHTML = html;
    }

    // Wait for rendering, then capture and save as PDF
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 700
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageHeight = 297;
      let heightLeft = imgHeight;
      let position = 0;
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(`ArtOfFrames_Invoice_${orderNo}.pdf`);
    } catch (err) {
      console.error('Failed to generate invoice PDF:', err);
    }
  };

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNo = Math.floor(Math.random() * 100000);
    const methodLabel = deliveryMethod === 'cod' ? 'Cash on Delivery' : 'Bank Deposit';
    let message = `*ART OF FRAMES - NEW ORDER #${orderNo}*\n\n` +
      `*Customer:* ${formData.name}\n` +
      `*Address:* ${formData.address}\n\n` +
      `*Delivery:* ${methodLabel} (Rs. ${deliveryFee.toLocaleString()})\n` +
      `*Advance:* Rs. ${advanceAmount.toLocaleString()}${deliveryMethod === 'cod' ? ' (40%)' : ' (Full)'}\n` +
      `*Remaining:* Rs. ${remainingAmount.toLocaleString()} ${deliveryMethod === 'cod' ? '(pay on delivery)' : '(N/A)'}\n\n` +
      `*Items:*\n`;

    cart.forEach(item => {
      message += `- ${item.name} (${item.quantity}x): Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });

    if (formData.notes) {
      message += `\n*Notes:* ${formData.notes}\n`;
    }

    message += `\n*SUB TOTAL: Rs. ${total.toLocaleString()}*\n` +
      `*Delivery Fee: Rs. ${deliveryFee.toLocaleString()}*\n` +
      `*GRAND TOTAL: Rs. ${grandTotal.toLocaleString()}*\n\n` +
      `_Please confirm my order. Thank you!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=94750350109&text=${encodedMessage}`;

    // Generate and download PDF invoice
    await generatePDF();

    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
    
    // Clear cart
    clearCart();
  };

  if (cart.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <main className="checkout-page">
      {/* Background Ambient Glow */}
      <div className="page-glow" />

      <div className="container section-padding">
        {/* Page Header */}
        <div className="page-header">
          <span className="section-subtitle">Final Step</span>
          <h1 className="page-title">
            Complete Your <span className="gold-accent">Purchase</span>
          </h1>
          <p className="page-desc">
            Fill in your details and we&apos;ll confirm your order via WhatsApp.
          </p>
        </div>

        <div className="checkout-layout">
          {/* ====================== CHECKOUT FORM ====================== */}
          <div className="checkout-form-section">
            <div className="form-glass-card">
              <h2 className="form-title">Delivery Details</h2>

              <form onSubmit={handleWhatsAppCheckout} className="checkout-form">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>

                {/* Address */}
                <div className="form-group">
                  <label htmlFor="address">Delivery Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, City"
                  />
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label htmlFor="notes">Order Notes <span className="optional-tag">Optional</span></label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Specific instructions for your laser engraving..."
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Order'}
                  <span className="btn-arrow">→</span>
                </button>

                <p className="form-footnote">
                  <ShieldCheck size={12} />
                  Your order will be sent via WhatsApp. We&apos;ll confirm within 24 hours.
                </p>
              </form>
            </div>

            <Link href="/cart" className="back-link">
              <ArrowLeft size={16} />
              Back to Cart
            </Link>
          </div>

          {/* ====================== ORDER SUMMARY ====================== */}
          <div className="order-summary-section">
            <div className="summary-sticky">
              <h2 className="summary-title">Order Summary</h2>

              {/* Items */}
              <div className="summary-items">
                <h3 className="summary-items-title">
                  Items ({cart.length})
                </h3>
                <div className="summary-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-info">
                        {item.image && (
                          <div className="summary-item-image">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div>
                          <p className="summary-item-name">{item.name}</p>
                          <p className="summary-item-qty">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="summary-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span className="price-label">Delivery ({deliveryMethod === 'cod' ? 'COD' : 'Bank Deposit'})</span>
                  <span className="price-value delivery-fee">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                {deliveryMethod === 'cod' && (
                  <div className="price-row advance-row">
                    <span className="price-label">Advance (40%)</span>
                    <span className="price-value advance-value">Rs. {advanceAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="price-divider" />
                <div className="price-row grand-total">
                  <span className="price-label">Grand Total</span>
                  <span className="price-value grand-total-value">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-badge">
                <ShieldCheck size={14} />
                <span>Secure checkout via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden div for PDF rendering */}
      <div ref={invoiceRef} className="invoice-hidden" />

      <style jsx>{`
        /* ==============================
           CHECKOUT PAGE STYLES
           ============================== */

        .checkout-page {
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
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--grid-gap);
          align-items: start;
          position: relative;
          z-index: 10;
        }

        /* ==============================
           CHECKOUT FORM
           ============================== */
        .checkout-form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-glass-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2.5rem;
          backdrop-filter: blur(20px);
          transition: border-color 0.3s ease;
        }
        .form-glass-card:hover {
          border-color: rgba(212,175,55,0.15);
        }

        .form-title {
          font-size: 1.3rem;
          font-weight: 700;
          font-family: var(--font-heading);
          margin-bottom: 2rem;
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .form-group label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 800;
          opacity: 0.5;
        }

        .optional-tag {
          font-weight: 400;
          opacity: 0.5;
          text-transform: lowercase;
          letter-spacing: 0;
        }

        .form-group input,
        .form-group textarea {
          padding: 1rem 1.2rem;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--foreground);
          font-size: 0.95rem;
          font-family: var(--font-main);
          transition: all 0.3s ease;
          outline: none;
          width: 100%;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
          background: rgba(255,255,255,0.05);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--foreground);
          opacity: 0.25;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .submit-btn {
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
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-top: 0.5rem;
          width: 100%;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .submit-btn .btn-arrow {
          transition: transform 0.3s ease;
        }
        .submit-btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(5px);
        }

        .form-footnote {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          opacity: 0.4;
          font-weight: 500;
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.5;
          font-weight: 600;
          transition: all 0.3s;
          width: fit-content;
        }
        .back-link:hover {
          opacity: 1;
          color: var(--primary);
          gap: 0.75rem;
        }

        /* ==============================
           ORDER SUMMARY
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

        /* Items */
        .summary-items-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.5;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .summary-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .summary-item-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .summary-item-image {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--glass-bg);
          flex-shrink: 0;
        }

        .summary-item-name {
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .summary-item-qty {
          font-size: 0.75rem;
          opacity: 0.5;
          margin-top: 0.15rem;
        }

        .summary-item-price {
          font-size: 0.9rem;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Price Breakdown */
        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          border-top: 1px solid var(--glass-border);
          padding-top: 1.25rem;
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

        .summary-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          opacity: 0.4;
          font-weight: 600;
        }

        /* Hidden invoice div */
        .invoice-hidden {
          position: absolute;
          left: -9999px;
          top: 0;
          width: 700px;
          z-index: -1;
        }

        /* ==============================
           RESPONSIVE
           ============================== */
        @media (max-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .summary-sticky {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .form-glass-card {
            padding: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2.2rem;
          }
          .form-glass-card {
            padding: 1.5rem;
          }
          .grand-total-value {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ==============================
   EMPTY CHECKOUT
   ============================== */
function EmptyCheckout() {
  return (
    <main className="empty-checkout-page">
      <div className="empty-glow" />
      <div className="container">
        <div className="empty-content">
          <div className="empty-icon-wrapper">
            <ShoppingBag size={32} />
          </div>
          <h1 className="empty-title">
            Nothing to <span className="gold-accent">Checkout</span>
          </h1>
          <p className="empty-desc">
            Your cart is empty. Add some products before checking out.
          </p>
          <Link href="/products" className="browse-btn">
            Browse Products
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .empty-checkout-page {
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
