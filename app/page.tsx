"use client";

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Review {
  name: string;
  role: string;
  stars: number;
  photo: string;
  review: string;
}

export default function Home() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const toggleFlip = (index: number) => {
    setActiveCard(activeCard === index ? null : index);
  };

  const carouselItems = [
    {
      src: '/hero-images/slide-card.png',
      name: 'Custom Keytags',
      bgText: 'Custom \n Keytags',
      desc: 'Discover our premium range of custom laser-cut keytags, designed for durability and personal expression. Each piece is a miniature masterpiece of precision engineering.',
      tagline: 'Carry something that means something. Crafted with purpose, designed to last a lifetime.'
    },
    {
      src: '/hero-images/slide-card.png',
      name: 'Lovely Gifts',
      bgText: 'Lovely \n gifts',
      desc: 'Heartfelt memories deserve more than just a gesture. Our personalized gifts transform your special moments into permanent art, etched with love and technical perfection.',
      tagline: 'Because the best gifts are the ones they will never want to put down — or give back.'
    },
    {
      src: '/bike-3.png',
      name: 'Mommy frames',
      bgText: 'Mommy \n Frames',
      desc: 'Celebrate the bond that matters most. Our Mommy Frames are designed to showcase the purest love, with graceful outlines and premium wood finishes that last a lifetime.',
      tagline: 'Some bonds are too beautiful to fade. We make sure they never do.'
    },
    {
      src: '/bike-4.png',
      name: 'Sign Boards',
      bgText: 'Logo  \n Sign Boards',
      desc: 'Your brand deserves to stand out in high definition. Our bespoke logo sign boards combine dimensional layering with professional-grade laser cutting for ultimate impact.',
      tagline: 'First impressions are everything. Make yours impossible to ignore.'
    },
    {
      src: '/bike-5.png',
      name: 'Wall Arts',
      bgText: 'Wall \n arts',
      desc: 'Transform your living space with intricate wall art. From complex geometric mandalas to minimal silhouettes, our laser-cut pieces add depth and texture to any interior.',
      tagline: 'Art that commands the room. Silence that speaks volumes.'
    }
  ];

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/reviews.json')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
      })
      .catch(err => {
        console.error('Failed to load reviews:', err);
      });
  }, []);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
 
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setTilt({ x: rotateX, y: rotateY });
  };
 
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
  }, [carouselItems.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    resetTimer();
  }, [carouselItems.length, resetTimer]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    resetTimer();
  }, [carouselItems.length, resetTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    resetTimer();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, handlePrev, resetTimer]);

  return (
    <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Dynamic Hero Section - Reference Inspired */}
      <section className="hero" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        background: 'var(--background)',
        overflow: 'hidden'
      }}>

        {/* DYNAMIC BACKGROUND TYPOGRAPHY */}
        <div style={{
          position: 'absolute',
          zIndex: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {carouselItems.map((item, i) => (
            <h1 key={i} style={{
              position: 'absolute',
              fontSize: '15vw',
              fontWeight: 900,
              lineHeight: 0.8,
              textTransform: 'uppercase',
              opacity: i === currentIndex ? 0.05 : 0,
              transform: `scale(${i === currentIndex ? 1 : 1.1})`,
              transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-5px',
              whiteSpace: 'pre-line'
            }}>
              {item.bgText}
            </h1>
          ))}
        </div>

        {/* CENTER CONTENT CONTAINER */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Main Subject: Hovering Products */}
          <div className="hero-product-display">
            {/* GLOW AURA - Behind Product */}
            <div className="hero-glow-aura"></div>
 
            {/* PRODUCT LIST */}
            <div 
              className="hero-image-slider" 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: '1000px' }}
            >
              {carouselItems.map((item, i) => (
                <div 
                  key={i} 
                  className={`hero-image-item ${i === currentIndex ? 'active' : ''}`}
                  style={{
                    transform: i === currentIndex 
                      ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1)` 
                      : 'scale(0.9)',
                    transition: i === currentIndex ? 'transform 0.1s ease-out, opacity 1s' : 'all 1s'
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={1400}
                    height={1000}
                    className="animate-float"
                    style={{
                      objectFit: 'contain',
                      width: 'auto',
                      height: '100%',
                      filter: i === currentIndex ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))' : 'none',
                      pointerEvents: 'none'
                    }}
                    priority
                  />
                </div>
              ))}
            </div>

            {/* TWO DYNAMIC PARAGRAPHS - Corrected Stack */}
            <div className="hero-info-stack">
              <div className="hero-content-left">
                {carouselItems.map((item, i) => (
                  <div key={i} className={`hero-text-block ${i === currentIndex ? 'active' : ''}`}>
                    <h2 className="hero-product-title">{item.name}</h2>
                    <p className="hero-product-desc">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="hero-content-right">
                {carouselItems.map((item, i) => (
                  <p key={i} className={`hero-product-tagline ${i === currentIndex ? 'active' : ''}`}>
                    {item.tagline}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Adjusted for precision */}
          <button onClick={handlePrev} className="nav-btn prev-btn">←</button>
          <button onClick={handleNext} className="nav-btn next-btn">→</button>

          {/* EXPLORE PRODUCTS CALL TO ACTION */}
          <div className="hero-cta-wrapper">
            <button
              className="glass animate-float explore-btn"
              onClick={() => router.push('/products')}
            >
              EXPLORE PRODUCTS
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <style jsx>{`
          .hero-product-display {
            position: relative;
            width: 100%;
            height: 75vh;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
          }
          .hero-glow-aura {
            position: absolute;
            width: 40vw;
            height: 40vw;
            background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);
            border-radius: 50%;
            z-index: -1;
            filter: blur(80px);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .hero-image-slider {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .hero-image-item {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transform: scale(0.9);
            transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
            pointer-events: none;
          }
          .hero-image-item.active {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
          }
          .hero-content-left {
            position: absolute;
            left: 8%;
            top: 30%;
            transform: translateY(-50%);
            width: 320px;
            text-align: left;
            z-index: 20;
            pointer-events: none;
          }
          .hero-content-right {
            position: absolute;
            right: 8%;
            top: 70%;
            transform: translateY(-50%);
            width: 280px;
            text-align: right;
            z-index: 20;
            pointer-events: none;
          }
          .hero-text-block, .hero-product-tagline {
            position: absolute;
            top: 0;
            opacity: 0;
            transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
          }
          .hero-text-block { left: 0; transform: translateX(-20px); }
          .hero-product-tagline { right: 0; transform: translateX(20px); }
          
          .hero-text-block.active, .hero-product-tagline.active {
            opacity: 1;
            transform: translateX(0);
            position: relative;
          }
          .hero-product-tagline.active {
            opacity: 0.65;
          }

          .hero-product-title {
            font-size: clamp(1.8rem, 4vw, 2.8rem);
            font-weight: 900;
            text-transform: uppercase;
            color: var(--primary);
            margin-bottom: 0.8rem;
            font-family: var(--font-heading);
            line-height: 1;
          }
          .hero-product-desc {
            font-size: 0.95rem;
            line-height: 1.6;
            opacity: 0.7;
            font-family: 'Inter', sans-serif;
          }
          .hero-product-tagline {
            font-size: 0.9rem;
            line-height: 1.7;
            font-family: 'Inter', sans-serif;
            font-style: italic;
          }

          .nav-btn {
            position: absolute;
            top: 50%;
            width: 50px;
            height: 50px;
            border: 1px solid var(--glass-border);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 30;
            background: transparent;
            color: var(--foreground);
            transition: 0.3s;
            opacity: 0.3;
          }
          .prev-btn { left: 3%; }
          .next-btn { right: 3%; }
          .nav-btn:hover {
            background: var(--foreground);
            color: var(--background);
            opacity: 1;
            transform: scale(1.1);
          }

          .hero-cta-wrapper {
            position: absolute;
            bottom: 8%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 40;
          }
          .explore-btn {
            padding: 1.2rem 3rem;
            border-radius: 50px;
            border: 1px solid var(--glass-border);
            background: rgba(255,255,255,0.03);
            color: var(--foreground);
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .explore-btn:hover {
            background: var(--primary);
            color: black;
            border-color: var(--primary);
            transform: translateY(-5px) translateX(-50%);
          }
          .explore-btn:hover .btn-arrow {
            transform: translateX(5px);
          }

          .animate-float {
            animation: floating 6s ease-in-out infinite;
          }
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 768px) {
            .hero-product-display {
              display: flex;
              flex-direction: column;
              height: auto;
              padding-bottom: 120px;
            }
            .hero-image-slider {
              position: relative;
              height: 45vh;
              width: 100%;
              order: 1;
            }
            .hero-info-stack {
              order: 2;
              width: 100%;
              padding: 0 1.5rem;
              margin-top: 1rem;
            }
            .hero-content-left, .hero-content-right {
              position: relative;
              left: 0;
              right: 0;
              top: 0;
              width: 100%;
              transform: none;
              text-align: center;
              pointer-events: none;
            }
            .hero-content-right {
              display: none; 
            }
            .hero-product-title {
              font-size: 2.2rem;
              margin-top: 0.5rem;
            }
            .hero-product-desc {
              max-width: 400px;
              margin: 0 auto;
              font-size: 0.85rem;
            }
            .hero-cta-wrapper {
              bottom: 30px;
            }
            .nav-btn {
              top: auto;
              bottom: 12vh;
              width: 40px;
              height: 40px;
            }
            .prev-btn { left: 10%; }
            .next-btn { right: 10%; }
            .explore-btn {
              padding: 0.8rem 2rem;
              font-size: 0.75rem;
            }
          }
          @media (max-height: 750px) and (max-width: 768px) {
             .hero-product-desc { display: none; }
             .hero-image-slider { height: 40vh; }
          }
        `}</style>
      </section>

      {/* Expertise Section - Premium Card Design */}
      <section id="expertise" className="section-padding" style={{
        position: 'relative',
        zIndex: 100,
        background: 'var(--background)',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-elegant)', fontWeight: 400, letterSpacing: '-2px' }}>
              Expertise <span style={{ color: 'var(--primary)' }}>/</span>
            </h2>
          </div>

          <div className="expertise-grid">
            {[
              {
                title: 'Laser Cutting',
                desc: 'Precision cutting for wood, acrylic, and textiles with intricate detail.',
                moreInfo: 'Our high-power CO2 laser systems deliver surgical precision for architectural models, bespoke signage, and intricate woodcraft. We handle MDF, Plywood, and Acrylic up to 10mm.',
                img: '/expertise-1.png'
              },
              {
                title: 'Laser Engraving',
                desc: 'Fine art engraving on leather, glass, and metal surfaces.',
                moreInfo: 'Permanent, high-contrast marking for luxury leather goods, crystal awards, and industrial metal tagging. Perfect for logos, personal dedications, and intricate patterns.',
                img: '/expertise-2.png'
              },
              {
                title: 'Custom Products',
                desc: 'Tailor-made gifts and corporate branding solutions.',
                moreInfo: 'From conceptual design to finished product. We create one-of-a-kind keytags, coasters, and layered wall art tailored to your personal or corporate identity.',
                img: '/expertise-3.png'
              },
              {
                title: 'Photo Frames',
                desc: 'Premium layered frames that celebrate your most cherished moments.',
                moreInfo: 'Bespoke multi-layered photo frames and memory boxes. Using premium hardwoods and precision-etched glass to transform your photos into 3D heirloom pieces.',
                img: '/expertise-4.png'
              }
            ].map((item, i) => (
              <div key={i} className="card-container" style={{ perspective: '1000px', height: '540px' }}>
                <div className={`card-inner ${activeCard === i ? 'is-flipped' : ''}`} style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transformStyle: 'preserve-3d'
                }}>
                  {/* FRONT FACE */}
                  <div
                    className="card-face card-front"
                    onClick={() => toggleFlip(i)}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      borderRadius: '40px',
                      overflow: 'hidden',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      willChange: 'transform, box-shadow'
                    }}>
                    <div style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden' }}>
                      <Image src={item.img} alt={item.title} fill style={{ objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: '60%',
                        background: 'linear-gradient(to top, var(--background), transparent)'
                      }}></div>
                    </div>
                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--foreground)' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.6, marginBottom: '1.5rem', flex: 1 }}>{item.desc}</p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                        Explore <span className="arrow">→</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div
                    className="card-face card-back"
                    onClick={() => setActiveCard(null)}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: '40px',
                      overflow: 'hidden',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '2.5rem 2rem',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>Specifications</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.7, marginBottom: '2.5rem' }}>{item.moreInfo}</p>

                    <a
                      href="https://api.whatsapp.com/send?phone=94750350109"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        padding: '1.2rem',
                        background: '#25D366',
                        color: 'white',
                        borderRadius: '15px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.8rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 20px rgba(37, 211, 102, 0.2)'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-2.32 0-4.525 1.232-5.741 3.223-1.216 1.991-1.216 4.455 0 6.446 1.216 1.991 3.421 3.223 5.741 3.223 2.32 0 4.525-1.232 5.741-3.223 1.216-1.991 1.216-4.455 0-6.446-1.216-1.991-3.421-3.223-5.741-3.223zm0 2.035c1.616 0 3.125.856 3.931 2.23.805 1.374.805 3.086 0 4.46-.805 1.374-2.314 2.23-3.931 2.23-1.616 0-3.125-.856-3.931-2.23-.805-1.374-.805-3.086 0-4.46.805-1.374 2.314-2.23 3.931-2.23zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.824-1.435C8.338 21.476 10.109 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                      CONTACT ON WHATSAPP
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .expertise-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
          @media (max-width: 1200px) {
            .expertise-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 600px) {
            .expertise-grid {
              grid-template-columns: 1fr;
            }
          }
          .is-flipped {
            transform: rotateY(180deg);
          }
          .card-front {
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }
          .card-front:hover {
            transform: translateY(-8px);
            border-color: var(--primary) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          }
          .arrow {
            display: inline-block;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .card-front:hover .arrow {
            transform: translateX(8px);
          }
          .whatsapp-btn:hover {
            transform: scale(1.02);
            background: #128C7E;
            box-shadow: 0 15px 30px rgba(37, 211, 102, 0.3);
          }
        `}</style>
      </section>
      {/* Our Works Section - Optimized Bento Gallery */}
      <section id="works" className="section-padding" style={{
        position: 'relative',
        zIndex: 100,
        background: 'var(--background)',
        paddingTop: '6rem',
        paddingBottom: '6rem'
      }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '4px', marginBottom: '1rem', textTransform: 'uppercase' }}>Portfolio Showcase</div>
              <h2 style={{ fontSize: '4.5rem', fontFamily: 'var(--font-elegant)', fontWeight: 400, letterSpacing: '-3px', lineHeight: 1 }}>
                Our Works <span style={{ color: 'var(--primary)' }}>/</span>
              </h2>
            </div>
            <p style={{ opacity: 0.4, maxWidth: '350px', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'right' }}>
              Precision meets artistry. Explore our latest laser-crafted masterpieces.
            </p>
          </div>

          <div className="works-bento-grid">
            {[
              { title: 'Oak Signature Frame', category: 'Premium Frames', desc: 'Layered hardwood & precision glass cuts for a timeless heirloom display.', img: '/expertise-4.png', span: 'col-span-8 row-span-2' },
              { title: 'Walnut Identity', category: 'Engraving', desc: 'Deep-etched brand marks on natural walnut — lasting impressions.', img: '/expertise-2.png', span: 'col-span-4 row-span-1' },
              { title: 'Acrylic Geometrics', category: 'Precision Cutting', desc: 'Crystal-clear acrylic shaped into intricate geometric forms.', img: '/expertise-1.png', span: 'col-span-4 row-span-1' },
              { title: 'Bespoke Keytags', category: 'Custom Gifts', desc: 'Miniature masterpieces — engraved with names, dates, or logos.', img: '/expertise-3.png', span: 'col-span-4 row-span-1' },
              { title: 'Floral Wall Art', category: 'Interior Decor', desc: 'Multi-layer laser-cut florals that bring texture to any wall.', img: '/expertise-1.png', span: 'col-span-4 row-span-1' },
              { title: 'Corporate Plaques', category: 'Awards', desc: 'Surgical engravings on glass and metal — recognition, perfected.', img: '/expertise-2.png', span: 'col-span-4 row-span-1' }
            ].map((work, i) => (
              <div key={i} className={`work-card ${work.span}`} style={{
                position: 'relative',
                borderRadius: '40px',
                overflow: 'hidden',
                background: 'var(--card-bg)',
                cursor: 'pointer',
                border: '1px solid var(--glass-border)',
                transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
              }}>
                <Image
                  src={work.img}
                  alt={work.title}
                  fill
                  style={{ objectFit: 'cover', transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}
                  className="work-image"
                />

                {/* Floating Category Tag */}
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  padding: '0.5rem 1.2rem',
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '100px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.1)',
                  zIndex: 10,
                  opacity: 0,
                  transform: 'translateY(-10px)',
                  transition: '0.4s 0.1s ease-out'
                }} className="category-tag">
                  {work.category}
                </div>

                <div className="work-content-overlay">
                  <div className="work-details">
                    <h4 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>{work.title}</h4>
                    <div style={{ height: '2px', width: '0%', background: 'var(--primary)', transition: 'width 0.4s ease' }} className="accent-line"></div>
                    <p className="work-desc" style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.7)',
                      marginTop: '0.8rem',
                      lineHeight: 1.5,
                      opacity: 0,
                      transform: 'translateY(8px)',
                      transition: 'opacity 0.4s 0.1s ease, transform 0.4s 0.1s ease'
                    }}>{work.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6rem' }}>
            <button className="premium-btn" onClick={() => router.push('/gallery')} style={{
              padding: '1.4rem 4.5rem',
              borderRadius: '100px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--foreground)',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: '0.4s'
            }}>
              <span style={{ position: 'relative', zIndex: 1 }}>Explore Full Archive</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>

        <style jsx>{`
          .works-bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: 280px;
            gap: 1.5rem;
          }
          .col-span-8 { grid-column: span 8; }
          .col-span-4 { grid-column: span 4; }
          .row-span-2 { grid-row: span 2; }
          .row-span-1 { grid-row: span 1; }

          .work-card:hover {
            transform: scale(0.98);
            border-color: var(--primary) !important;
            box-shadow: 0 40px 80px rgba(0,0,0,0.5);
          }
          .work-card:hover .work-image {
            transform: scale(1.1);
            filter: brightness(0.7) saturate(1.2);
          }
          .work-card:hover .category-tag {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .work-card:hover .work-content-overlay {
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
          }
          .work-card:hover .accent-line {
            width: 60px !important;
          }
          .work-card:hover .work-desc {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          .work-content-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding: 3rem;
            background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%);
            transition: all 0.5s;
          }

          .premium-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
          }
          .btn-glow {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, var(--primary) 0%, transparent 70%);
            opacity: 0;
            transition: 0.4s;
            filter: blur(20px);
          }
          .premium-btn:hover .btn-glow {
            opacity: 0.1;
          }

          @media (max-width: 1200px) {
            .works-bento-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 350px; }
            .col-span-8, .col-span-4 { grid-column: span 1; }
            .row-span-2, .row-span-1 { grid-row: span 1; }
          }
          @media (max-width: 768px) {
            .works-bento-grid { grid-template-columns: 1fr; }
            .section-padding { padding-top: 4rem; padding-bottom: 4rem; }
            h2 { fontSize: 3rem !important; }
            .work-content-overlay { padding: 1.5rem; }
          }
        `}</style>
      </section>

      {/* Bulk Orders CTA Section */}
      <section className="bulk-cta-section" style={{
        position: 'relative',
        zIndex: 100,
        background: 'var(--background)',
        padding: '6rem 0',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div className="bulk-cta-card glass">
            <div className="bulk-content">
              <span className="subtitle">Corporate & Events</span>
              <h2 className="title">Looking for Bulk Orders?</h2>
              <p className="description">
                From corporate gifting to event souvenirs, we offer special rates and custom branding 
                for volume orders. Let&apos;s create something unique for your brand.
              </p>
              <a 
                href="https://api.whatsapp.com/send?phone=94750350109&text=Hi, I would like to inquire about corporate/bulk orders."
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn"
                style={{ textDecoration: 'none' }}
              >
                REQUEST A QUOTE
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          .bulk-cta-card {
            border-radius: 40px;
            padding: 5rem;
            text-align: center;
            background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0.5) 100%);
            border: 1px solid rgba(212,175,55,0.2);
            position: relative;
            overflow: hidden;
          }
          .bulk-cta-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 60%);
            pointer-events: none;
          }
          .bulk-content {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 600px;
            margin: 0 auto;
          }
          .subtitle {
            color: var(--primary);
            font-weight: 800;
            letter-spacing: 4px;
            text-transform: uppercase;
            font-size: 0.8rem;
            margin-bottom: 1rem;
          }
          .title {
            font-family: var(--font-elegant);
            font-size: 3.5rem;
            font-weight: 400;
            margin-bottom: 1.5rem;
            line-height: 1;
            color: var(--foreground);
          }
          .description {
            font-size: 1.1rem;
            line-height: 1.7;
            opacity: 0.7;
            margin-bottom: 2.5rem;
            color: var(--foreground);
          }
          .primary-btn {
            background: var(--primary);
            color: black;
            border: none;
            padding: 1.2rem 3rem;
            border-radius: 100px;
            font-weight: 800;
            letter-spacing: 2px;
            cursor: pointer;
            transition: 0.4s;
          }
          .primary-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
          }
          @media (max-width: 768px) {
            .bulk-cta-card { padding: 3rem 1.5rem; border-radius: 30px; }
            .title { font-size: 2.5rem; }
          }
        `}</style>
      </section>

      {/* Reviews Section - Auto-floating marquee */}
      <section id="reviews" style={{
        position: 'relative',
        zIndex: 100,
        background: 'var(--background)',
        padding: '6rem 0',
        overflow: 'hidden',
        borderTop: '1px solid var(--glass-border)'
      }}>
        {/* Section Header */}
        <div className="container" style={{ maxWidth: '1400px', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '4px', marginBottom: '1rem', textTransform: 'uppercase' }}>
              What People Say
            </div>
            <h2 style={{ fontSize: '4rem', fontFamily: 'var(--font-elegant)', fontWeight: 400, letterSpacing: '-2px', lineHeight: 1 }}>
              Client Reviews <span style={{ color: 'var(--primary)' }}>/</span>
            </h2>
          </div>
        </div>

        {/* Marquee Track */}
        <div className="reviews-track-wrapper">
          <div className="reviews-track">
            {reviews.length > 0 ? [...reviews, ...reviews].map((r, i) => (
              <div key={i} className="review-card">
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.2rem' }}>
                  {Array.from({ length: r.stars }).map((_, s) => (
                    <span key={s} style={{ color: 'var(--primary)', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                {/* Quote */}
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  opacity: 0.75,
                  marginBottom: '1.8rem',
                  flex: 1,
                  fontStyle: 'italic'
                }}>
                  &ldquo;{r.review}&rdquo;
                </p>
                {/* Reviewer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: r.photo ? 'transparent' : 'linear-gradient(135deg, var(--primary), rgba(212,175,55,0.3))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    flexShrink: 0,
                    border: '1px solid var(--glass-border)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {r.photo ? (
                      <Image src={r.photo} alt={r.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <span>{r.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '2px', letterSpacing: '0.5px' }}>{r.role}</div>
                  </div>
                </div>
              </div>
            )) : null}
          </div>
        </div>

        <style jsx>{`
          .reviews-track-wrapper {
            width: 100%;
            overflow: hidden;
            mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          }
          .reviews-track {
            display: flex;
            gap: 1.5rem;
            width: max-content;
            animation: scroll-reviews 40s linear infinite;
            padding: 1rem 0;
          }
          .reviews-track:hover {
            animation-play-state: paused;
          }
          @keyframes scroll-reviews {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .review-card {
            width: 360px;
            flex-shrink: 0;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 28px;
            padding: 2.2rem;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
          }
          .review-card:hover {
            border-color: var(--primary);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.08);
            transform: translateY(-5px);
          }

          @media (max-width: 768px) {
            .review-card {
              width: 280px;
              padding: 1.5rem;
            }
            .reviews-track {
              animation-duration: 30s;
            }
            h2 {
              font-size: 2.8rem !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
