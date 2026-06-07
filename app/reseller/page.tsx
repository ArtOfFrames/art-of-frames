'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Percent, Handshake, TrendingUp, Package, ShieldCheck, Gift, Users, Sparkles } from 'lucide-react';

export default function ResellerPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: '',
    wantToDo: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*New Reseller Application*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*City:* ${encodeURIComponent(formData.city)}%0A*District:* ${encodeURIComponent(formData.district)}%0A*I want to:* ${encodeURIComponent(formData.wantToDo)}`;
    window.location.href = `https://wa.me/94750350109?text=${text}`;
    setFormData({ name: '', city: '', district: '', wantToDo: '' });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <main className="reseller-page">
      {/* Hero Section with Inline Form */}
      <section className="reseller-hero" ref={formRef}>
        <div className="container">
          <div className="hero-split">
            <div className="hero-left">
              <span className="section-subtitle">Partner With Us</span>
              <h1 className="reseller-hero-title">
                Join as a <span className="gold-accent">Reseller</span>
              </h1>
              <p className="reseller-hero-desc">
                Partner with Art Of Frames and offer your customers premium laser-cut products 
                while earning competitive margins. No inventory needed — we handle production 
                and fulfillment, you focus on selling.
              </p>
              <div className="reseller-hero-actions">
                <button
                  className="primary-btn"
                  onClick={scrollToForm}
                >
                  Apply Now
                  <span className="btn-arrow">→</span>
                </button>
                <button
                  className="outline-btn"
                  onClick={() => router.push('/contact')}
                >
                  Talk to Us
                </button>
              </div>
              <div className="reseller-badge-row">
                <span className="badge-pill">✓ No Minimum Order</span>
                <span className="badge-pill">✓ Free Branding</span>
                <span className="badge-pill">✓ Direct Shipping</span>
              </div>
            </div>
            <div className="hero-right">
              <div className="inline-form-card glass">
                <h3 className="inline-form-title">Apply as a Reseller</h3>
                <p className="inline-form-subtitle">
                  Fill in your details and we&apos;ll get back to you within 24 hours.
                </p>
                <form onSubmit={handleSubmit} className="reseller-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="district">District</label>
                    <select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select your district</option>
                      <option value="Ampara">Ampara</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                      <option value="Badulla">Badulla</option>
                      <option value="Batticaloa">Batticaloa</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Galle">Galle</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Hambantota">Hambantota</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Kegalle">Kegalle</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Matale">Matale</option>
                      <option value="Matara">Matara</option>
                      <option value="Monaragala">Monaragala</option>
                      <option value="Mullaitivu">Mullaitivu</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                      <option value="Polonnaruwa">Polonnaruwa</option>
                      <option value="Puttalam">Puttalam</option>
                      <option value="Ratnapura">Ratnapura</option>
                      <option value="Trincomalee">Trincomalee</option>
                      <option value="Vavuniya">Vavuniya</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>I want to do</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="wantToDo"
                          value="Drop Shipping"
                          checked={formData.wantToDo === 'Drop Shipping'}
                          onChange={handleChange}
                          required
                        />
                        <span className="radio-custom"></span>
                        Drop Shipping
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="wantToDo"
                          value="Buy and Sell"
                          checked={formData.wantToDo === 'Buy and Sell'}
                          onChange={handleChange}
                        />
                        <span className="radio-custom"></span>
                        Buy and Sell
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="primary-btn inline-submit">
                    Submit Application
                    <span className="btn-arrow">→</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Reseller */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-header">
            <span className="section-subtitle">Why Partner With Us</span>
            <h2 className="section-title">
              Reseller <span className="gold-accent">Benefits</span>
            </h2>
            <p className="benefits-sub-desc">
              Everything you need to grow your business with premium laser-crafted products.
            </p>
          </div>

          <div className="benefits-grid">
            {[
              {
                icon: <Percent size={28} />,
                title: 'Competitive Margins',
                desc: 'Enjoy wholesale pricing with generous markup potential. The more you sell, the better your rates become.'
              },
              {
                icon: <Package size={28} />,
                title: 'Zero Inventory',
                desc: 'No need to stock products. We produce and ship directly to your customers under your brand.'
              },
              {
                icon: <Handshake size={28} />,
                title: 'Dedicated Support',
                desc: 'Get a personal account manager to help with orders, custom requests, and any questions.'
              },
              {
                icon: <TrendingUp size={28} />,
                title: 'Scalable Growth',
                desc: 'Start small and scale up. Our production capacity grows with your order volume.'
              },
              {
                icon: <ShieldCheck size={28} />,
                title: 'Quality Guaranteed',
                desc: 'Every order is inspected before shipping. If it\'s not perfect, we replace it — no questions asked.'
              },
              {
                icon: <Gift size={28} />,
                title: 'Free Sample Kit',
                desc: 'Get a curated sample kit of our best-selling products to showcase to your clients.'
              }
            ].map((benefit, i) => (
              <div key={i} className="benefit-card glass">
                <div className="benefit-icon-wrapper">
                  {benefit.icon}
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="how-header">
            <span className="section-subtitle">Simple Process</span>
            <h2 className="section-title">
              How It <span className="gold-accent">Works</span>
            </h2>
          </div>

          <div className="how-steps">
            {[
              {
                step: '01',
                title: 'Apply & Get Approved',
                desc: 'Fill out a quick application. We\'ll review and get back to you within 24 hours with your custom pricing plan.'
              },
              {
                step: '02',
                title: 'Receive Your Kit',
                desc: 'Get your free sample kit and marketing materials. Start showcasing our products to your customers immediately.'
              },
              {
                step: '03',
                title: 'Start Selling',
                desc: 'Use our product catalog and pricing to sell to your clients. We handle all production, packaging, and shipping.'
              },
              {
                step: '04',
                title: 'Earn & Grow',
                desc: 'Collect your margins on every sale. As your volume grows, unlock better pricing and exclusive products.'
              }
            ].map((step, i) => (
              <div key={i} className="how-step">
                <div className="how-step-number">{step.step}</div>
                <div className="how-step-content glass">
                  <h3 className="how-step-title">{step.title}</h3>
                  <p className="how-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Sell */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <span className="section-subtitle">Product Catalog</span>
            <h2 className="section-title">
              What You Can <span className="gold-accent">Sell</span>
            </h2>
            <p className="products-sub-desc">
              Our entire catalog is available to resellers with custom branding options.
            </p>
          </div>

          <div className="products-categories">
            {[
              { icon: '🖼️', title: 'Photo Frames', desc: 'Multi-layered frames, memory boxes, and display pieces.' },
              { icon: '🔑', title: 'Custom Keytags', desc: 'Personalized keytags, bag tags, and branded accessories.' },
              { icon: '🏷️', title: 'Sign Boards', desc: 'Business signage, logo boards, and directory signs.' },
              { icon: '🎨', title: 'Wall Art', desc: 'Mandala designs, floral patterns, and custom artworks.' },
              { icon: '🎁', title: 'Corporate Gifts', desc: 'Branded gifts, awards, plaques, and promotional items.' },
              { icon: '💍', title: 'Mommy Frames', desc: 'Custom family portrait frames and memory keepsakes.' }
            ].map((cat, i) => (
              <div key={i} className="product-cat-card glass">
                <span className="cat-icon">{cat.icon}</span>
                <h3 className="cat-title">{cat.title}</h3>
                <p className="cat-desc">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="who-section">
        <div className="container">
          <div className="who-grid">
            <div className="who-content">
              <span className="section-subtitle">Who Can Join</span>
              <h2 className="section-title">
                Perfect for <span className="gold-accent">You</span>
              </h2>
              <p className="who-desc">
                Our reseller program is designed for a wide range of businesses and individuals 
                who want to offer premium laser-cut products without the overhead of production.
              </p>
              <ul className="who-list">
                {[
                  'Interior designers & decorators',
                  'Gift shop & boutique owners',
                  'Event planners & wedding coordinators',
                  'Real estate agents (client gifts)',
                  'Online store owners & drop shippers',
                  'Marketing & branding agencies',
                  'Corporate gifting companies',
                  'Art galleries & studios'
                ].map((item, i) => (
                  <li key={i} className="who-list-item">
                    <span className="who-check">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="who-visual">
              <div className="who-card glass">
                <Users size={48} className="who-icon" />
                <h3 className="who-card-title">Start Your Journey</h3>
                <p className="who-card-desc">
                  Join 50+ resellers already partnering with us. No commitments, no fees — 
                  just great products and reliable support.
                </p>
                <button
                  className="primary-btn"
                  onClick={scrollToForm}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Apply Now
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="reseller-cta-section">
        <div className="container">
          <div className="reseller-cta-card glass">
            <div className="reseller-cta-content">
              <span className="cta-subtitle">Ready to Start?</span>
              <h2 className="cta-title">Let&apos;s Grow Together</h2>
              <p className="cta-desc">
                Apply today and a member of our partnership team will reach out within 24 hours 
                with your custom pricing and next steps.
              </p>
              <div className="cta-actions">
                <button
                  className="primary-btn"
                  onClick={scrollToForm}
                >
                  Apply Now
                  <span className="btn-arrow">→</span>
                </button>
                <button
                  className="outline-btn"
                  onClick={() => window.open('https://wa.me/94750350109', '_blank')}
                >
                  <Sparkles size={18} />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ==============================
           RESELLER PAGE STYLES
           ============================== */

        .reseller-page {
          background: var(--background);
          overflow: hidden;
        }

        /* --- Shared --- */
        .section-subtitle {
          color: var(--primary);
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
          display: inline-block;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 1.5rem;
          color: var(--foreground);
        }

        .gold-accent {
          color: var(--primary);
        }

        .primary-btn {
          background: var(--primary);
          color: black;
          border: none;
          padding: 1.2rem 2.5rem;
          border-radius: 100px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.9rem;
        }
        .primary-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
        }
        .primary-btn .btn-arrow {
          transition: transform 0.3s ease;
        }
        .primary-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        .outline-btn {
          background: transparent;
          color: var(--foreground);
          border: 1px solid var(--glass-border);
          padding: 1.2rem 2.5rem;
          border-radius: 100px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.4s ease;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .outline-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-5px);
        }

        /* ==============================
           HERO SECTION — Split Layout
           ============================== */
        .reseller-hero {
          padding: 140px 0 100px;
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .reseller-hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -5%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hero-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          position: relative;
          z-index: 10;
        }

        .hero-left {
          text-align: left;
          position: sticky;
          top: 120px;
        }

        .hero-left .section-subtitle {
          text-align: left;
        }

        .reseller-hero-title {
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -2px;
          line-height: 0.95;
          margin-bottom: 2rem;
          color: var(--foreground);
        }

        .reseller-hero-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          opacity: 0.6;
          margin-bottom: 2.5rem;
        }

        .reseller-hero-actions {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .reseller-badge-row {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .badge-pill {
          padding: 0.5rem 1.2rem;
          border-radius: 100px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary);
        }

        /* ==============================
           INLINE FORM CARD
           ============================== */
        .hero-right {
          display: flex;
          justify-content: center;
        }

        .inline-form-card {
          width: 100%;
          max-width: 460px;
          padding: 2.5rem;
          border-radius: 32px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          animation: borderPulse 4s ease-in-out infinite;
        }

        @keyframes borderPulse {
          0%, 100% {
            border-color: var(--glass-border);
            box-shadow: 0 0 0 0 rgba(212,175,55,0);
          }
          50% {
            border-color: var(--primary);
            box-shadow: 0 0 25px 0 rgba(212,175,55,0.1);
          }
        }

        .inline-form-title {
          font-size: 1.6rem;
          font-family: var(--font-elegant);
          font-weight: 400;
          margin-bottom: 0.4rem;
          color: var(--foreground);
        }

        .inline-form-subtitle {
          font-size: 0.85rem;
          opacity: 0.6;
          margin-bottom: 1.8rem;
          line-height: 1.6;
        }

        .inline-submit {
          width: 100%;
          justify-content: center;
        }

        /* ==============================
           BENEFITS SECTION
           ============================== */
        .benefits-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
        }

        .benefits-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .benefits-sub-desc {
          font-size: 1.05rem;
          opacity: 0.6;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .benefit-card {
          padding: 2.5rem;
          border-radius: 28px;
          border: 1px solid var(--glass-border);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .benefit-card:hover {
          border-color: var(--primary);
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        .benefit-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(212,175,55,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s ease;
        }
        .benefit-card:hover .benefit-icon-wrapper {
          background: var(--primary);
          color: black;
          transform: scale(1.05);
        }

        .benefit-title {
          font-size: 1.3rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }
        .benefit-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          opacity: 0.6;
        }

        /* ==============================
           HOW IT WORKS
           ============================== */
        .how-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
          position: relative;
        }

        .how-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .how-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 700px;
          margin: 0 auto;
        }

        .how-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          position: relative;
        }

        .how-step-number {
          font-size: 3.5rem;
          font-weight: 900;
          font-family: var(--font-heading);
          color: var(--primary);
          opacity: 0.15;
          line-height: 1;
          min-width: 80px;
          text-align: right;
          margin-top: 0.2rem;
        }

        .how-step-content {
          flex: 1;
          padding: 2rem 2.5rem;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
          margin-bottom: 1.5rem;
          transition: all 0.4s ease;
        }
        .how-step-content:hover {
          border-color: var(--primary);
          transform: translateX(10px);
        }

        .how-step-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          font-family: var(--font-heading);
        }
        .how-step-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          opacity: 0.6;
        }

        /* ==============================
           PRODUCTS CATALOG
           ============================== */
        .products-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
        }

        .products-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .products-sub-desc {
          font-size: 1.05rem;
          opacity: 0.6;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .products-categories {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .product-cat-card {
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
          text-align: center;
          transition: all 0.4s ease;
        }
        .product-cat-card:hover {
          border-color: var(--primary);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .cat-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }
        .cat-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.6rem;
          font-family: var(--font-heading);
        }
        .cat-desc {
          font-size: 0.85rem;
          line-height: 1.6;
          opacity: 0.6;
        }

        /* ==============================
           WHO CAN APPLY
           ============================== */
        .who-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
        }

        .who-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .who-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          opacity: 0.65;
          margin-bottom: 2.5rem;
        }

        .who-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .who-list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.95rem;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .who-list-item:hover {
          opacity: 1;
          transform: translateX(5px);
        }
        .who-check {
          color: var(--primary);
          font-size: 1rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .who-visual {
          display: flex;
          justify-content: center;
        }

        .who-card {
          width: 100%;
          max-width: 380px;
          padding: 3rem 2.5rem;
          border-radius: 32px;
          border: 1px solid var(--glass-border);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }

        .who-icon {
          color: var(--primary);
          opacity: 0.3;
        }
        .who-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }
        .who-card-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          opacity: 0.6;
          margin-bottom: 0.5rem;
        }

        /* ==============================
           CTA SECTION
           ============================== */
        .reseller-cta-section {
          padding: 80px 0 100px;
          border-top: 1px solid var(--glass-border);
        }

        .reseller-cta-card {
          border-radius: 40px;
          padding: 5rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0.5) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          position: relative;
          overflow: hidden;
        }

        .reseller-cta-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .reseller-cta-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-subtitle {
          color: var(--primary);
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .cta-title {
          font-family: var(--font-elegant);
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 400;
          margin-bottom: 1.5rem;
          line-height: 1;
          color: var(--foreground);
        }

        .cta-desc {
          font-size: 1.1rem;
          line-height: 1.7;
          opacity: 0.7;
          margin-bottom: 2.5rem;
        }

        .cta-actions {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* ==============================
           FORM SHARED STYLES
           ============================== */
        .reseller-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--foreground);
          opacity: 0.8;
        }

        .form-group select {
          padding: 1rem 1.2rem;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--foreground);
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1.2rem center;
          padding-right: 2.5rem;
        }
        .form-group select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
        }
        .form-group select option {
          background: var(--background);
          color: var(--foreground);
        }

        .radio-group {
          display: flex;
          gap: 1rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          flex: 1;
        }
        .radio-label:hover {
          border-color: rgba(212,175,55,0.3);
        }
        .radio-label input[type="radio"] {
          display: none;
        }
        .radio-custom {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .radio-label input[type="radio"]:checked + .radio-custom {
          border-color: var(--primary);
          background: var(--primary);
          box-shadow: inset 0 0 0 3px var(--background);
        }
        .radio-label input[type="radio"]:checked ~ * {
          color: var(--primary);
        }
        .radio-label:has(input[type="radio"]:checked) {
          border-color: var(--primary);
          background: rgba(212,175,55,0.06);
        }

        .form-group input,
        .form-group textarea {
          padding: 1rem 1.2rem;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--foreground);
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          outline: none;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
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

        /* ==============================
           RESPONSIVE
           ============================== */
        @media (max-width: 1024px) {
          .benefits-grid,
          .products-categories {
            grid-template-columns: repeat(2, 1fr);
          }
          .who-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .who-content {
            text-align: center;
          }
          .who-list {
            max-width: 400px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .reseller-hero {
            padding: 120px 0 60px;
            min-height: auto;
          }
          .hero-split {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .hero-left {
            position: static;
            text-align: center;
          }
          .hero-left .section-subtitle {
            text-align: center;
          }
          .reseller-hero-actions {
            justify-content: center;
          }
          .reseller-badge-row {
            justify-content: center;
          }
          .reseller-hero-title {
            font-size: 2.8rem;
          }
          .inline-form-card {
            max-width: 100%;
          }
          .benefits-grid,
          .products-categories {
            grid-template-columns: 1fr;
          }
          .how-step {
            flex-direction: column;
            gap: 0.5rem;
          }
          .how-step-number {
            text-align: left;
            font-size: 2.5rem;
          }
          .how-step-content:hover {
            transform: none;
          }
          .reseller-cta-card {
            padding: 3rem 1.5rem;
            border-radius: 30px;
          }
          .cta-title {
            font-size: 2.2rem;
          }
          .reseller-hero-actions,
          .cta-actions {
            flex-direction: column;
            align-items: center;
          }
          .primary-btn,
          .outline-btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .reseller-hero-title {
            font-size: 2.2rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .benefit-card {
            padding: 1.8rem;
          }
          .who-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </main>
  );
}
