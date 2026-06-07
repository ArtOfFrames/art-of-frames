'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect and track theme changes for Footer logo
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
      if (currentTheme) setTheme(currentTheme);
    };

    checkTheme(); // Initial check

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="glass" style={{
      marginTop: 'auto',
      padding: '4rem 0 2rem',
      borderTop: '1px solid var(--glass-border)',
      background: 'rgba(var(--background-rgb), 0.3)',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '4rem',
          marginBottom: '4rem'
        }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <Image
                src={theme === 'dark' ? '/Dark Mode Logo.png' : '/Light Mode Logo.png'}
                alt="Art Of Frames"
                width={140}
                height={140}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p style={{ opacity: 0.5, fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '280px' }}>
              Bespoke laser cutting and engraving services that bring your most intricate artistic visions to life with premium precision.
            </p>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '2px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="/products" style={{ opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>Collections</a></li>
              <li><a href="/gallery" style={{ opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>Gallery</a></li>
              <li><a href="/about" style={{ opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>Process</a></li>
              <li><a href="/contact" style={{ opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '2px' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li>
                <a href="tel:+94750350109" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>
                  <Phone size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
                  <span>+94 750 350 109</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/94750350109" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>
                  <MessageCircle size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
                  <span>+94 750 350 109</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '2px' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
                  label: 'Facebook'
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>,
                  label: 'Twitter'
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
                  label: 'Instagram'
                }
              ].map((item, i) => (
                <a key={i} href="#" aria-label={item.label} className="glass" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                  color: 'var(--foreground)'
                }}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '2.5rem',
          textAlign: 'center',
          opacity: 0.4,
          fontSize: '0.8rem',
          letterSpacing: '1px'
        }}>
          &copy; {new Date().getFullYear()} Art Of Frames. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
