'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
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

  const generateInvoiceHTML = () => {
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
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f0f0f0;
      font-family: 'Open Sans', sans-serif;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 40px 16px;
    }
    .page {
      background: #fff;
      width: 700px;
      padding: 40px 48px 48px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-svg {
      width: 90px;
      height: 90px;
      flex-shrink: 0;
    }
    .brand-text h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #e53935;
      letter-spacing: 0.5px;
    }
    .brand-text p {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }
    .contact-info {
      text-align: right;
      font-size: 12.5px;
      color: #444;
      line-height: 1.8;
    }
    .contact-info .contact-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }
    .contact-info .icon {
      font-size: 13px;
      color: #e53935;
    }
    .divider {
      border: none;
      border-top: 1.5px solid #ddd;
      margin: 0 0 24px;
    }
    .invoice-title {
      text-align: center;
      font-family: 'Montserrat', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #e53935;
      letter-spacing: 3px;
      margin-bottom: 28px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 28px;
    }
    .info-box {
      background: #f8f8f8;
      border-radius: 6px;
      padding: 16px 20px;
    }
    .info-box h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #555;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .info-row {
      display: grid;
      grid-template-columns: 90px 1fr;
      font-size: 13px;
      color: #555;
      margin-bottom: 6px;
    }
    .info-row:last-child { margin-bottom: 0; }
    .info-row .label { color: #888; }
    .info-row .value { color: #333; font-weight: 600; }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table thead tr { background: #e53935; }
    .items-table thead th {
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 11px 16px;
      text-align: left;
    }
    .items-table thead th:nth-child(2),
    .items-table thead th:nth-child(3),
    .items-table thead th:nth-child(4) { text-align: right; }
    .items-table tbody tr { border-bottom: 1px solid #eee; }
    .items-table tbody td {
      padding: 14px 16px;
      font-size: 13.5px;
      color: #444;
    }
    .items-table tbody td:nth-child(2),
    .items-table tbody td:nth-child(3),
    .items-table tbody td:nth-child(4) { text-align: right; }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 36px;
    }
    .totals-box { width: 280px; }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 13.5px;
      color: #555;
      padding: 6px 0;
    }
    .totals-row .t-label { color: #666; }
    .totals-row .t-value { color: #333; }
    .totals-divider {
      border: none;
      border-top: 2px solid #e53935;
      margin: 8px 0;
    }
    .totals-row.cod {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 15px;
    }
    .totals-row.cod .t-label,
    .totals-row.cod .t-value { color: #e53935; }
    .footer-divider {
      border: none;
      border-top: 1.5px solid #ddd;
      margin-bottom: 20px;
    }
    .footer { text-align: center; }
    .footer .thank-you {
      font-family: 'Montserrat', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #e53935;
      margin-bottom: 6px;
    }
    .footer .powered {
      font-size: 11px;
      color: #aaa;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .page { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <svg class="logo-svg" viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>.st0{fill:#FF2E36;}</style>
            <linearGradient id="lg1" gradientUnits="userSpaceOnUse" x1="121.4" y1="350.13" x2="169.7" y2="350.13"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg2" gradientUnits="userSpaceOnUse" x1="186.09" y1="350.13" x2="248.483" y2="350.13"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg3" gradientUnits="userSpaceOnUse" x1="253.9113" y1="350.13" x2="347.188" y2="350.13"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg4" gradientUnits="userSpaceOnUse" x1="352.656" y1="350.13" x2="466.0708" y2="350.13"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg5" gradientUnits="userSpaceOnUse" x1="479.49" y1="350.135" x2="532.52" y2="350.135"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg6" gradientUnits="userSpaceOnUse" x1="540.0451" y1="350.14" x2="601.14" y2="350.14"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg7" gradientUnits="userSpaceOnUse" x1="213.6708" y1="248.19" x2="274.9548" y2="248.19"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg8" gradientUnits="userSpaceOnUse" x1="283.63" y1="248.185" x2="324.7897" y2="248.185"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg9" gradientUnits="userSpaceOnUse" x1="330.01" y1="248.19" x2="364.97" y2="248.19"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg10" gradientUnits="userSpaceOnUse" x1="394.06" y1="248.19" x2="460.37" y2="248.19"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
            <linearGradient id="lg11" gradientUnits="userSpaceOnUse" x1="471.79" y1="248.19" x2="503.84" y2="248.19"><stop offset="0" style="stop-color:#FF2E36"/><stop offset="1" style="stop-color:#c0000a"/></linearGradient>
          </defs>
          <g>
            <g>
              <path class="st0" d="M437.2,161l22.3,22.3h66.2v66.2l22.3,22.3V161H437.2z M525.8,450.8V517h-66.2l-22.3,22.3H548V428.5L525.8,450.8z M192.1,517v-66.2l-22.3-22.3v110.8h110.8L258.3,517H192.1z M169.8,161v110.8l22.3-22.3v-66.2h66.2l22.3-22.3H169.8z"/>
            </g>
            <g>
              <g>
                <path fill="none" stroke="url(#lg1)" stroke-miterlimit="10" d="M121.9,302.5h47.3v17.7h-29.3v17.3h29.3v17.4h-29.3v42.9h-18V302.5z"/>
                <path fill="none" stroke="url(#lg2)" stroke-miterlimit="10" d="M186.6,302.5h19.2c10.5,0,18,0.9,22.5,2.8s8.1,5,10.8,9.4s4.1,9.5,4.1,15.5c0,6.3-1.5,11.5-4.5,15.7s-7.5,7.4-13.6,9.6l22.6,42.4h-19.8l-21.4-40.4h-1.7v40.4h-18.1L186.6,302.5L186.6,302.5z M204.7,339.7h5.7c5.8,0,9.7-0.8,11.9-2.3c2.2-1.5,3.3-4,3.3-7.5c0-2.1-0.5-3.9-1.6-5.4c-1.1-1.5-2.5-2.6-4.3-3.3c-1.8-0.7-5.1-1-9.9-1h-5V339.7z"/>
                <path fill="none" stroke="url(#lg3)" stroke-miterlimit="10" d="M291.4,302.5h18.4l36.7,95.3h-18.9l-7.5-19.6h-38.9l-7.8,19.6h-18.9L291.4,302.5z M300.7,327.7l-12.8,32.7h25.5L300.7,327.7z"/>
                <path fill="none" stroke="url(#lg4)" stroke-miterlimit="10" d="M369.7,302.5h17.7l22.1,66.5l22.3-66.5h17.7l16,95.3h-17.5l-10.2-60.2l-20.2,60.2h-16l-20.1-60.2l-10.5,60.2h-17.7L369.7,302.5z"/>
                <path fill="none" stroke="url(#lg5)" stroke-miterlimit="10" d="M480,302.5h52v17.8h-34v17.2h34v17.4h-34V380h34v17.8h-52L480,302.5L480,302.5z"/>
                <path fill="none" stroke="url(#lg6)" stroke-miterlimit="10" d="M599,315.4l-13.4,11.9c-4.7-6.6-9.5-9.9-14.4-9.9c-2.4,0-4.3,0.6-5.8,1.9c-1.5,1.3-2.3,2.7-2.3,4.3s0.5,3.1,1.6,4.5c1.5,1.9,5.9,6,13.3,12.2c6.9,5.8,11.1,9.4,12.6,11c3.7,3.7,6.3,7.3,7.8,10.7s2.3,7.1,2.3,11.1c0,7.8-2.7,14.3-8.1,19.4c-5.4,5.1-12.5,7.6-21.2,7.6c-6.8,0-12.7-1.7-17.7-5s-9.3-8.5-12.9-15.7l15.2-9.2c4.6,8.4,9.9,12.6,15.8,12.6c3.1,0,5.7-0.9,7.8-2.7s3.2-3.9,3.2-6.3c0-2.2-0.8-4.3-2.4-6.5c-1.6-2.2-5.1-5.5-10.6-9.9c-10.4-8.5-17.1-15-20.1-19.6c-3-4.6-4.5-9.2-4.5-13.8c0-6.6,2.5-12.3,7.6-17s11.3-7.1,18.7-7.1c4.8,0,9.3,1.1,13.6,3.3C589.3,305.6,593.9,309.6,599,315.4z"/>
              </g>
            </g>
            <path class="st0" d="M405.6,422.6c22.1,0,43.6,16,43.6,51.9c0,58.8-90.4,107.6-90.4,107.6s-90.4-48.8-90.4-107.6c0-35.9,21.5-51.9,43.6-51.9c20.5,0,41.5,13.6,46.7,37.9C364.1,436.2,385.2,422.6,405.6,422.6"/>
          </g>
        </svg>
        <div class="brand-text">
          <h1>Art of Frames</h1>
          <p>Moments made timeless</p>
        </div>
      </div>
      <div class="contact-info">
        <div class="contact-row">
          <span>Near the temple, Seelagama, Belihuloya</span>
          <span class="icon">&#128205;</span>
        </div>
        <div class="contact-row">
          <span>0750 350 109</span>
          <span class="icon">&#128222;</span>
        </div>
        <div class="contact-row">
          <span>0750 350 109</span>
          <span class="icon">&#128247;</span>
        </div>
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
        <div class="info-row"><span class="label">WhatsApp:</span><span class="value">${formData.phone}</span></div>
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

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArtOfFrames_Invoice_${orderNo}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    const orderNo = Math.floor(Math.random() * 100000);
    let message = `*ART OF FRAMES - NEW ORDER #${orderNo}*\n\n`;
    message += `*Customer:* ${formData.name}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    message += `*Address:* ${formData.address}\n\n`;
    message += `*Items:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.name} (${item.quantity}x): Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n*TOTAL: Rs. ${total.toLocaleString()}*\n\n`;
    message += `_Please confirm my order. Thank you!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=94750350109&text=${encodedMessage}`;

    // Download invoice first
    generateInvoiceHTML();

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
