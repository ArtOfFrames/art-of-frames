'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { jsPDF } from 'jspdf';
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const orderNo = Math.floor(Math.random() * 100000);

    // Styling
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Primary color
    doc.text('ART OF FRAMES', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Premium Laser Cutting & Engraving', 105, 28, { align: 'center' });
    
    doc.line(20, 35, 190, 35);

    // Order Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Order: #${orderNo}`, 20, 45);
    doc.text(`Date: ${date}`, 150, 45);

    // Customer Info
    doc.setFontSize(12);
    doc.text('Customer Details:', 20, 60);
    doc.text(`Name: ${formData.name}`, 20, 68);
    doc.text(`Email: ${formData.email}`, 20, 76);
    doc.text(`Phone: ${formData.phone}`, 20, 84);
    doc.text(`Address: ${formData.address}`, 20, 92);

    // Items Header
    doc.line(20, 100, 190, 100);
    doc.setFontSize(12);
    doc.text('Item', 20, 108);
    doc.text('Qty', 140, 108);
    doc.text('Price', 170, 108);
    doc.line(20, 112, 190, 112);

    // Items
    let y = 120;
    cart.forEach(item => {
      doc.text(item.name, 20, y);
      doc.text(item.quantity.toString(), 140, y);
      doc.text(`Rs. ${(item.price * item.quantity).toLocaleString()}`, 170, y);
      y += 10;
    });

    // Total
    doc.line(20, y, 190, y);
    doc.setFontSize(14);
    doc.text(`Total: Rs. ${total.toLocaleString()}`, 170, y + 10, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for choosing Art Of Frames!', 105, 280, { align: 'center' });

    doc.save(`ArtOfFrames_Order_${orderNo}.pdf`);
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
    const whatsappUrl = `https://wa.me/94750350109?text=${encodedMessage}`;

    // Download PDF first
    generatePDF();

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    
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
              Clicking below will download your order PDF and open WhatsApp to send details.
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
