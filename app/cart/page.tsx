'use client';

import { useCart } from '@/components/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Your Cart is Empty</h1>
        <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Looks like you haven&apos;t added anything yet.</p>
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
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Your <span className="gradient-text">Cart</span></h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          {cart.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1.5rem 0',
              borderBottom: '1px solid var(--glass-border)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ opacity: 0.7 }}>Quantity: {item.quantity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ padding: '2rem 0', textAlign: 'right' }}>
            <h2 style={{ fontSize: '2rem' }}>Total: <span className="gradient-text">Rs. {total.toLocaleString()}</span></h2>
          </div>
        </div>
        
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ opacity: 0.7 }}>Subtotal</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span style={{ opacity: 0.7 }}>Shipping</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Calculated at checkout</span>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800 }}>Estimated Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="glass" style={{
            display: 'block',
            textAlign: 'center',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
            color: 'black',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
