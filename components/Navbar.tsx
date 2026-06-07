'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useCart } from './CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Detect and track theme changes
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container container">
        {/* Logo */}
        <Link href="/" className="logo-wrapper">
          <div className="logo-glow"></div>
          <Image
            src={theme === 'dark' ? '/Dark Mode Logo.png' : '/Light Mode Logo.png'}
            alt="Art Of Frames"
            width={200}
            height={45}
            className="logo-img"
            style={{ height: '45px', width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions (Toggle, Cart, Menu) */}
        <div className="actions-group">
          <ThemeToggle />

          <Link href="/cart" className="action-btn">
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </div>
          </Link>

          <button
            className="action-btn menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        {navLinks.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`mobile-nav-link ${pathname === item.path ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(var(--background-rgb), 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
          height: 80px;
          display: flex;
          align-items: center;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 1rem;
        }

        /* Logo Styling */
        .logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          height: 50px;
          cursor: pointer;
        }
        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 35px;
          background: var(--primary);
          opacity: 0.15;
          filter: blur(20px);
          z-index: -1;
          border-radius: 50%;
        }
        .logo-img {
          max-width: 180px;
          object-fit: contain;
        }

        /* Desktop Nav - Centered */
        .desktop-nav {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        .nav-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--foreground);
          opacity: 0.6;
          transition: all 0.3s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-link:hover, .nav-link.active {
          opacity: 1;
          color: var(--primary);
        }

        /* Actions Area */
        .actions-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 160px;
          justify-content: flex-end;
        }
        .action-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--foreground);
          transition: background 0.3s;
          position: relative;
        }
        .action-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        .cart-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
        }
        
        /* Cart Badge - Fixed Position */
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -10px;
          background: var(--primary);
          color: black;
          font-size: 10px;
          font-weight: 900;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          pointer-events: none;
          z-index: 5;
        }

        .menu-btn {
          display: none;
          z-index: 1001;
        }

        /* Mobile Menu */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: var(--background);
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .mobile-overlay.active {
          transform: translateX(0);
        }
        .mobile-nav-link {
          font-size: 2.5rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--foreground);
          opacity: 0.4;
          transition: 0.3s;
        }
        .mobile-nav-link.active {
          opacity: 1;
          color: var(--primary);
        }

        @media (max-width: 968px) {
          .desktop-nav {
            display: none;
          }
          .menu-btn {
            display: flex;
          }
          .navbar {
            height: 70px;
          }
          .logo-wrapper {
            min-width: 120px;
            height: 40px;
          }
          .actions-group {
            min-width: auto;
          }
        }
      `}</style>
    </nav>
  );
}
