'use client';

import { useState, useRef } from 'react';
import { useCart } from '@/components/CartContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

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
    .brand-text h1 { font-size: 26px; font-weight: 700; color: #e53935; }
    .brand-text p { font-size: 12px; color: #888; margin-top: 2px; }
    .contact-info { text-align: right; font-size: 12.5px; color: #444; line-height: 1.8; }
    .divider { border: none; border-top: 1.5px solid #ddd; margin: 0 0 24px; }
    .invoice-title { text-align: center; font-size: 28px; font-weight: 700; color: #e53935; letter-spacing: 3px; margin-bottom: 28px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
    .info-box { background: #f8f8f8; border-radius: 6px; padding: 16px 20px; }
    .info-box h3 { font-size: 11px; font-weight: 700; color: #555; letter-spacing: 1px; margin-bottom: 12px; }
    .info-row { display: grid; grid-template-columns: 90px 1fr; font-size: 13px; color: #555; margin-bottom: 6px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-row .label { color: #888; }
    .info-row .value { color: #333; font-weight: 600; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .items-table thead tr { background: #e53935; }
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
    .totals-divider { border: none; border-top: 2px solid #e53935; margin: 8px 0; }
    .totals-row.cod { font-weight: 700; font-size: 15px; }
    .totals-row.cod .t-label, .totals-row.cod .t-value { color: #e53935; }
    .footer-divider { border: none; border-top: 1.5px solid #ddd; margin-bottom: 20px; }
    .footer { text-align: center; }
    .footer .thank-you { font-size: 17px; font-weight: 700; color: #e53935; margin-bottom: 6px; }
    .footer .powered { font-size: 11px; color: #aaa; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <div style="width:70px;height:70px;background:#e53935;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;flex-shrink:0;">AF</div>
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
        <div class="info-row"><span class="label">Phone:</span><span class="value">${formData.phone}</span></div>
      </div>
      <div class="info-box">
        <h3>ORDER DETAILS</h3>
        <div class="info-row"><span class="label">Order #:</span><span class="value">${orderNo}</span></div>
        <div class="info-row"><span class="label">Created:</span><span class="value">${formattedDate}</span></div>
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
          <span class="t-value">TBC</span>
        </div>
        <div class="totals-row">
          <span class="t-label">Advance:</span>
          <span class="t-value">TBC</span>
        </div>
        <hr class="totals-divider">
        <div class="totals-row cod">
          <span class="t-label">Total:</span>
          <span class="t-value">Rs. ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
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
      // If image is taller than A4, add multiple pages
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

    const orderNo = Math.floor(Math.random() * 100000);
    let message = `*ART OF FRAMES - NEW ORDER #${orderNo}*\\n\\n`;
    message += `*Customer:* ${formData.name}\\n`;
    message += `*Phone:* ${formData.phone}\\n`;
    message += `*Address:* ${formData.address}\\n\\n`;
    message += `*Items:*\\n`;
    
    cart.forEach(item => {
      message += `- ${item.name} (${item.quantity}x): Rs. ${(item.price * item.quantity).toLocaleString()}\\n`;
    });

    message += `\\n*TOTAL: Rs. ${total.toLocaleString()}*\\n\\n`;
    message += `_Please confirm my order. Thank you!_`;

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
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Your Cart is Empty</h1>
        <Link href="/products" className="glass" style={{
          padding: '1rem 2.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary)',
          color: 'black',
          fontWeight: 700
        }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      {/* Hidden div for rendering the invoice HTML for html2canvas capture */}
      <div ref={invoiceRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '700px', zIndex: -1 }} />

      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Complete Your <span className="gradient-text">Purchase</span></h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
          <form onSubmit={handleWhatsAppCheckout}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontWeight: 600 }}>Full Name *</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}
                  placeholder="John Doe"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontWeight: 600 }}>Phone Number *</label>
                <input 
                  type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                  className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}
                  placeholder="+94 XX XXX XXXX"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              <label style={{ fontWeight: 600 }}>Email Address *</label>
              <input 
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}
                placeholder="john@example.com"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              <label style={{ fontWeight: 600 }}>Delivery Address *</label>
              <textarea 
                name="address" required rows={3} value={formData.address} onChange={handleChange}
                className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', resize: 'none' }}
                placeholder="Street address, City"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '3rem' }}>
              <label style={{ fontWeight: 600 }}>Order Notes (Optional)</label>
              <textarea 
                name="notes" rows={3} value={formData.notes} onChange={handleChange}
                className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', resize: 'none' }}
                placeholder="Specific instructions for your laser engraving..."
              />
            </div>

            <button type="submit" className="glass" style={{
              width: '100%',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: 'black',
              fontWeight: 800,
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)'
            }}>
              🚀 Confirm Order & Send via WhatsApp
            </button>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
              Clicking below will download your order invoice and open WhatsApp to send details.
            </p>
          </form>
        </div>

        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Your Selected Items</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 700 }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Total Amount</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem' }} className="gradient-text">Rs. {total.toLocaleString()}</span>
          </div>

          <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
            <h4 style={{ marginBottom: '0.8rem' }}>📦 Why WhatsApp?</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
              <li>✅ Immediate communication</li>
              <li>✅ Secure order processing</li>
              <li>✅ Custom design previewing</li>
              <li>✅ Easy shipment tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
