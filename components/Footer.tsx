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
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Image
                src={theme === 'dark' ? '/Dark Mode Logo.png' : '/Light Mode Logo.png'}
                alt="Art Of Frames"
                width={140}
                height={140}
                className="footer-logo-img"
              />
            </div>
            <p className="footer-tagline">
              Bespoke laser cutting and engraving services that bring your most intricate artistic visions to life with premium precision.
            </p>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              <li><a href="/products">Collections</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/reseller">Join as a Reseller</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <ul className="footer-contact-links">
              <li>
                <a href="tel:+94750350109" className="footer-contact-item">
                  <Phone size={18} strokeWidth={1.5} className="footer-contact-icon" />
                  <span>+94 750 350 109</span>
                </a>
              </li>
              <li>
                <a href="https://api.whatsapp.com/send?phone=94750350109" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                  <MessageCircle size={18} strokeWidth={1.5} className="footer-contact-icon" />
                  <span>+94 750 350 109</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <div className="footer-social">
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
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="footer-social-link glass">
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Art Of Frames. All rights reserved.
        </div>
      </div>

      <style jsx>{`
        .footer {
          margin-top: auto;
          padding: 4rem 0 2rem;
          border-top: 1px solid var(--glass-border);
          background: rgba(var(--background-rgb), 0.3);
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .footer-container {
          position: relative;
          z-index: 1;
        }

        /* Grid Layout */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 4rem;
          margin-bottom: 4rem;
        }

        /* Brand */
        .footer-logo {
          margin-bottom: 1.5rem;
        }
        .footer-logo-img {
          object-fit: contain;
        }
        .footer-tagline {
          opacity: 0.5;
          font-size: 0.9rem;
          line-height: 1.8;
          max-width: 280px;
        }

        /* Columns */
        .footer-col-title {
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.8;
          letter-spacing: 2px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-links a {
          opacity: 0.6;
          font-size: 0.9rem;
          transition: opacity 0.3s;
          color: var(--foreground);
          text-decoration: none;
        }
        .footer-links a:hover {
          opacity: 1;
          color: var(--primary);
        }

        /* Contact Links */
        .footer-contact-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0.6;
          font-size: 0.9rem;
          transition: opacity 0.3s;
          color: var(--foreground);
          text-decoration: none;
        }
        .footer-contact-item:hover {
          opacity: 1;
        }
        .footer-contact-icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        /* Social Links */
        .footer-social {
          display: flex;
          gap: 1rem;
        }
        .footer-social-link {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.6;
          transition: all 0.3s ease;
          color: var(--foreground);
        }
        .footer-social-link:hover {
          opacity: 1;
          color: var(--primary);
        }

        /* Bottom Bar */
        .footer-bottom {
          border-top: 1px solid var(--glass-border);
          padding-top: 2.5rem;
          text-align: center;
          opacity: 0.4;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 2.5rem 0 1.5rem;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-tagline {
            max-width: 100%;
          }
          .footer-logo-img {
            max-width: 120px;
          }
          .footer-col-title {
            margin-bottom: 1rem;
          }
        }
        @media (max-width: 480px) {
          .footer {
            padding: 2rem 0 1rem;
          }
          .footer-grid {
            gap: 1.5rem;
          }
          .footer-bottom {
            font-size: 0.7rem;
            padding-top: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
