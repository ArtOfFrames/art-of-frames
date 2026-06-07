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
              <li><a href="/reseller" style={{ opacity: 0.6, fontSize: '0.9rem', transition: '0.3s' }}>Join as a Reseller</a></li>
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
                  label: 'Facebook',
                  url: 'https://web.facebook.com/artofframes1'
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
                  label: 'TikTok',
                  url: 'https://www.tiktok.com/@artofframes'
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
                  label: 'Instagram',
                  url: 'https://www.instagram.com/art.of.frames/'
                }
              ].map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="glass" style={{
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
