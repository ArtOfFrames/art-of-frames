'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Award, Gem, HeartHandshake, Sparkles, Target, Users } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container about-hero-container">
          <div className="about-hero-content">
            <span className="section-subtitle">Who We Are</span>
            <h1 className="about-hero-title">
              Crafting Precision,<br />
              <span className="gold-accent">Inspiring Moments</span>
            </h1>
            <p className="about-hero-desc">
              At Art Of Frames, we blend cutting-edge laser technology with timeless craftsmanship 
              to create pieces that transcend the ordinary. Every cut tells a story — yours.
            </p>
            <div className="about-hero-actions">
              <button
                className="primary-btn"
                onClick={() => router.push('/products')}
              >
                Explore Our Work
                <span className="btn-arrow">→</span>
              </button>
              <button
                className="outline-btn"
                onClick={() => router.push('/contact')}
              >
                Get in Touch
              </button>
            </div>
          </div>

          <div className="about-hero-visual">
            <div className="hero-stats-panel">
              <div className="stats-panel-glow"></div>
              <div className="stats-panel-header">
                <span className="stats-panel-accent"></span>
                <span className="stats-panel-tag">By the Numbers</span>
              </div>
              <div className="stats-panel-body">
                <div className="stat-block">
                  <div className="stat-block-top">
                    <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span className="stat-number">500+</span>
                  </div>
                  <span className="stat-label">Happy Clients</span>
                </div>
                <div className="stat-block-divider"></div>
                <div className="stat-block">
                  <div className="stat-block-top">
                    <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span className="stat-number">3K+</span>
                  </div>
                  <span className="stat-label">Projects Delivered</span>
                </div>
                <div className="stat-block-divider"></div>
                <div className="stat-block">
                  <div className="stat-block-top">
                    <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="stat-number">8+</span>
                  </div>
                  <span className="stat-label">Years Experience</span>
                </div>
              </div>
              <div className="stats-panel-footer">
                <span className="stats-footer-dot"></span>
                <span className="stats-footer-dot"></span>
                <span className="stats-footer-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-visual">
              <div className="story-image-frame glass">
                <Image
                  src="/expertise-1.webp"
                  alt="Custom laser-cut products showcase"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="story-image"
                />
              </div>
            </div>
            <div className="story-content">
              <span className="section-subtitle">Our Journey</span>
              <h2 className="section-title">
                The Story Behind <span className="gold-accent">Art Of Frames</span>
              </h2>
              <div className="story-text">
                <p>
                  What started as a passion for precision and design has grown into one of the most 
                  trusted names in laser cutting and engraving. Founded with a simple belief — that 
                  every object can be transformed into art — Art Of Frames has been pushing the 
                  boundaries of what&apos;s possible with laser technology since 2017.
                </p>
                <p>
                  From humble beginnings with a single laser cutter in a small workshop, we&apos;ve 
                  expanded into a state-of-the-art facility equipped with industrial-grade CO2 and 
                  fiber laser systems. Our team of skilled artisans and engineers work side by side, 
                  ensuring each piece that leaves our studio meets the highest standards of quality 
                  and craftsmanship.
                </p>
                <p>
                  Whether it&apos;s a custom keytag for a local customer or a bulk corporate order for 
                  an international brand, every project receives the same meticulous attention to 
                  detail and passion for perfection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="values-header">
            <span className="section-subtitle">What We Stand For</span>
            <h2 className="section-title">
              Our Core <span className="gold-accent">Values</span>
            </h2>
          </div>
          <div className="values-grid">
            {[
              {
                icon: <Target size={32} />,
                title: 'Precision First',
                desc: 'We measure in microns, not millimeters. Every cut, engraving, and finish is executed with surgical accuracy to ensure flawless results.'
              },
              {
                icon: <HeartHandshake size={32} />,
                title: 'Customer-Centric',
                desc: 'Your vision is our blueprint. We collaborate closely with every client to understand their needs and deliver beyond expectations.'
              },
              {
                icon: <Gem size={32} />,
                title: 'Uncompromising Quality',
                desc: 'From material selection to final finishing, we refuse to cut corners. Only the best materials and techniques make it into your order.'
              },
              {
                icon: <Users size={32} />,
                title: 'Community Driven',
                desc: 'We believe in supporting local artisans and businesses. Our network of suppliers and partners are carefully chosen for their craftsmanship.'
              },
              {
                icon: <Award size={32} />,
                title: 'Continuous Innovation',
                desc: 'Technology evolves, and so do we. We constantly invest in the latest laser systems and techniques to stay at the forefront of our industry.'
              },
              {
                icon: <Sparkles size={32} />,
                title: 'Sustainable Practice',
                desc: 'We minimize waste through precise nesting algorithms and recycle material offcuts. Beautiful art shouldn\'t cost the earth.'
              }
            ].map((value, i) => (
              <div key={i} className="value-card glass">
                <div className="value-icon-wrapper">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="process-header">
            <span className="section-subtitle">How We Work</span>
            <h2 className="section-title">
              Our <span className="gold-accent">Process</span>
            </h2>
            <p className="process-sub-desc">
              From concept to creation — a seamless journey that brings your ideas to life.
            </p>
          </div>

          <div className="process-steps">
            {[
              {
                step: '01',
                title: 'Consultation',
                desc: 'We discuss your vision, requirements, and preferences. Share reference images or sketches, and we\'ll advise on materials and techniques.'
              },
              {
                step: '02',
                title: 'Design & Proofing',
                desc: 'Our designers transform your ideas into digital blueprints. You receive a detailed proof for approval before any cutting begins.'
              },
              {
                step: '03',
                title: 'Precision Crafting',
                desc: 'Using state-of-the-art laser systems, we cut and engrave with micron-level accuracy. Every piece is monitored throughout the process.'
              },
              {
                step: '04',
                title: 'Finishing & Quality Check',
                desc: 'Each item undergoes rigorous quality inspection. We sand, polish, and finish by hand to ensure a flawless final product.'
              },
              {
                step: '05',
                title: 'Packaging & Delivery',
                desc: 'Your order is carefully packaged with premium materials to ensure safe delivery. We coordinate with trusted couriers for prompt shipping.'
              }
            ].map((step, i) => (
              <div key={i} className="process-step">
                <div className="step-number">{step.step}</div>
                <div className="step-content glass">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="craft-section">
        <div className="container">
          <div className="craft-grid">
            <div className="craft-content">
              <span className="section-subtitle">Why Choose Us</span>
              <h2 className="section-title">
                Where Art Meets <span className="gold-accent">Engineering</span>
              </h2>
              <p className="craft-desc">
                We don&apos;t just operate machines — we master them. Our team combines years of 
                hands-on laser experience with an artist&apos;s eye for detail. Every project is an 
                opportunity to create something extraordinary.
              </p>
              <ul className="craft-list">
                {[
                  'Advanced diode laser systems for precision cutting & engraving',
                  'Materials: Wood, cardboard, paper, leather & more',
                  'Custom design & personalization services',
                  'Bulk & corporate order capabilities',
                  'Fast turnaround without compromising quality',
                  'Free consultation & design assistance'
                ].map((item, i) => (
                  <li key={i} className="craft-list-item">
                    <span className="craft-check">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="craft-visual">
              <div className="craft-image-frame glass">
                <Image
                  src="/expertise-2.webp"
                  alt="Laser engraving craftsmanship"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="craft-image"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card glass">
            <div className="about-cta-content">
              <span className="cta-subtitle">Let&apos;s Create Together</span>
              <h2 className="cta-title">Ready to Bring Your<br/>Idea to Life?</h2>
              <p className="cta-desc">
                Whether you have a clear vision or need inspiration, our team is ready to help 
                you create something extraordinary. Start your journey today.
              </p>
              <div className="cta-actions">
                <button
                  className="primary-btn"
                  onClick={() => router.push('/contact')}
                >
                  Start a Project
                  <span className="btn-arrow">→</span>
                </button>
                <a
                  href="https://api.whatsapp.com/send?phone=94750350109"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-2.32 0-4.525 1.232-5.741 3.223-1.216 1.991-1.216 4.455 0 6.446 1.216 1.991 3.421 3.223 5.741 3.223 2.32 0 4.525-1.232 5.741-3.223 1.216-1.991 1.216-4.455 0-6.446-1.216-1.991-3.421-3.223-5.741-3.223zm0 2.035c1.616 0 3.125.856 3.931 2.23.805 1.374.805 3.086 0 4.46-.805 1.374-2.314 2.23-3.931 2.23-1.616 0-3.125-.856-3.931-2.23-.805-1.374-.805-3.086 0-4.46.805-1.374 2.314-2.23 3.931-2.23zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.824-1.435C8.338 21.476 10.109 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ==============================
           ABOUT PAGE STYLES
           ============================== */

        .about-page {
          background: var(--background);
          overflow: hidden;
        }

        /* --- Section Subtitle (shared) --- */
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

        /* ==============================
           HERO SECTION
           ============================== */
        .about-hero {
          padding: 160px 0 100px;
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .about-hero::after {
          content: '';
          position: absolute;
          bottom: -10%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .about-hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .about-hero-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -2px;
          line-height: 0.95;
          margin-bottom: 2rem;
          color: var(--foreground);
        }

        .about-hero-desc {
          font-size: 1.1rem;
          line-height: 1.8;
          opacity: 0.6;
          margin-bottom: 3rem;
          max-width: 500px;
        }

        .about-hero-actions {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
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

        /* Hero Visual - Redesigned Stats Panel */
        .about-hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-stats-panel {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(212,175,55,0.02) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 36px;
          padding: 3rem 2.5rem;
          overflow: hidden;
          backdrop-filter: blur(20px);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hero-stats-panel:hover {
          border-color: rgba(212,175,55,0.4);
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          transform: translateY(-4px);
        }

        .stats-panel-glow {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .stats-panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
        }
        .stats-panel-accent {
          width: 3px;
          height: 20px;
          background: var(--primary);
          border-radius: 10px;
        }
        .stats-panel-tag {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--primary);
          opacity: 0.8;
        }

        .stats-panel-body {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
        }

        .stat-block {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
        }
        .stat-block:hover {
          padding-left: 0.5rem;
        }
        .stat-block-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .stat-icon {
          color: var(--primary);
          opacity: 0.6;
          flex-shrink: 0;
        }
        .stat-number {
          font-size: 3rem;
          font-weight: 900;
          font-family: var(--font-heading);
          color: var(--foreground);
          letter-spacing: -2px;
          line-height: 1;
        }
        .stat-block:hover .stat-number {
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.8rem;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 600;
          margin-left: 2.25rem;
        }
        .stat-block-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, rgba(212,175,55,0.3), transparent);
        }

        .stats-panel-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          position: relative;
          z-index: 2;
        }
        .stats-footer-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--primary);
          opacity: 0.25;
        }
        .stats-footer-dot:nth-child(2) {
          opacity: 0.5;
          width: 25px;
          border-radius: 10px;
        }

        /* ==============================
           STORY SECTION
           ============================== */
        .story-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
          position: relative;
        }

        .story-section::before {
          content: '';
          position: absolute;
          left: -10%;
          top: 20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 5rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .story-visual {
          position: relative;
        }

        .story-image-frame {
          aspect-ratio: 3/4;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .story-image {
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .story-image-frame:hover .story-image {
          transform: scale(1.08);
        }

        .story-floating-card {
          position: absolute;
          bottom: -1.5rem;
          right: -1.5rem;
          padding: 1.2rem 1.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 220px;
          z-index: 5;
        }
        .floating-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .story-floating-card strong {
          font-size: 0.85rem;
          display: block;
          margin-bottom: 0.2rem;
        }
        .story-floating-card p {
          font-size: 0.75rem;
          opacity: 0.6;
        }

        .story-content {
          display: flex;
          flex-direction: column;
        }

        .story-text p {
          font-size: 1rem;
          line-height: 1.8;
          opacity: 0.65;
          margin-bottom: 1.5rem;
        }
        .story-text p:last-child {
          margin-bottom: 0;
        }

        /* ==============================
           VALUES SECTION
           ============================== */
        .values-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
        }

        .values-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .values-header .section-title {
          text-align: center;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .value-card {
          padding: 2.5rem;
          border-radius: 28px;
          border: 1px solid var(--glass-border);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .value-card:hover {
          border-color: var(--primary);
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        .value-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: rgba(212,175,55,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s ease;
        }
        .value-card:hover .value-icon-wrapper {
          background: var(--primary);
          color: black;
          transform: scale(1.05);
        }

        .value-title {
          font-size: 1.3rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }
        .value-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          opacity: 0.6;
        }

        /* ==============================
           PROCESS SECTION
           ============================== */
        .process-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .process-section::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--glass-border), transparent);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .process-section::before { display: none; }
        }

        .process-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .process-sub-desc {
          font-size: 1.05rem;
          opacity: 0.6;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .process-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
        }

        .process-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          position: relative;
        }

        .step-number {
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

        .step-content {
          flex: 1;
          padding: 2rem 2.5rem;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
          margin-bottom: 1.5rem;
          transition: all 0.4s ease;
        }
        .step-content:hover {
          border-color: var(--primary);
          transform: translateX(10px);
        }

        .step-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          font-family: var(--font-heading);
        }
        .step-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          opacity: 0.6;
        }

        .step-connector {
          display: none;
        }

        /* ==============================
           CRAFTSMANSHIP SECTION
           ============================== */
        .craft-section {
          padding: 100px 0;
          border-top: 1px solid var(--glass-border);
        }

        .craft-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .craft-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          opacity: 0.65;
          margin-bottom: 2.5rem;
        }

        .craft-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .craft-list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.95rem;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .craft-list-item:hover {
          opacity: 1;
          transform: translateX(5px);
        }
        .craft-check {
          color: var(--primary);
          font-size: 1rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .craft-visual {
          display: flex;
          justify-content: center;
        }

        .craft-image-frame {
          width: 100%;
          max-width: 400px;
          aspect-ratio: 3/4;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .craft-image {
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .craft-image-frame:hover .craft-image {
          transform: scale(1.08);
        }


        /* ==============================
           CTA SECTION
           ============================== */
        .about-cta-section {
          padding: 80px 0 100px;
          border-top: 1px solid var(--glass-border);
        }

        .about-cta-card {
          border-radius: 40px;
          padding: 5rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0.5) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          position: relative;
          overflow: hidden;
        }

        .about-cta-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .about-cta-content {
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
           ANIMATIONS
           ============================== */
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* ==============================
           RESPONSIVE
           ============================== */
        @media (max-width: 1024px) {
          .about-hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .about-hero {
            padding-top: 120px;
            min-height: auto;
          }
          .about-hero-content {
            text-align: center;
          }
          .about-hero-desc {
            margin: 0 auto 3rem;
          }
          .about-hero-actions {
            justify-content: center;
          }
          .story-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .craft-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .craft-list {
            max-width: 500px;
          }
        }

        @media (max-width: 768px) {
          .about-page {
            padding-top: 0;
          }
          .about-hero {
            padding: 110px 0 60px;
          }
          .about-hero-title {
            font-size: 2.8rem;
          }
          .values-grid {
            grid-template-columns: 1fr;
          }
          .process-step {
            flex-direction: column;
            gap: 0.5rem;
          }
          .step-number {
            text-align: left;
            font-size: 2.5rem;
          }
          .step-content:hover {
            transform: none;
          }
          .story-floating-card {
            right: 0;
            bottom: -1rem;
            max-width: 180px;
            padding: 1rem;
          }
          .about-cta-card {
            padding: 3rem 1.5rem;
            border-radius: 30px;
          }
          .cta-title {
            font-size: 2.2rem;
          }
          .stat-number {
            font-size: 2.5rem;
          }
          .hero-stats-panel {
            max-width: 350px;
            padding: 2rem 1.5rem;
          }
          .stat-label {
            margin-left: 1.75rem;
            font-size: 0.7rem;
          }
          .stat-block {
            padding: 1rem 0;
          }
          .craft-image-frame {
            max-width: 300px;
          }
          .about-hero-actions,
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
          .about-hero-title {
            font-size: 2.2rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .value-card {
            padding: 1.8rem;
          }
        }
      `}</style>
    </main>
  );
}
