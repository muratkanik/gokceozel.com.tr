"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

interface HeroSliderProps {
  heroContent: {
    title: string;
    subtitle: string;
    button: string;
  };
}

const slideImages = [
  {
    src: '/images/gokcebanner.jpg',
    alt: 'Gökçe Özel Estetik 1'
  },
  {
    src: '/images/drgo_21.jpg',
    alt: 'Gökçe Özel Estetik 2'
  }
];

export default function HeroSlider({ heroContent }: HeroSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  return (
    <section className="hero-container" style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
      
      {/* Embla Carousel Viewport */}
      <div className="embla" ref={emblaRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <div className="embla__container" style={{ display: 'flex', height: '100%' }}>
          {slideImages.map((img, index) => (
            <div className="embla__slide" key={index} style={{ flex: '0 0 100%', position: 'relative', height: '100%' }}>
              <Image 
                src={img.src} 
                alt={img.alt}
                fill
                priority={index === 0} // First image loads immediately, others are lazy
                style={{ objectFit: 'cover', objectPosition: '75% center' }}
                sizes="100vw"
                quality={90}
              />
              {/* Overlay Gradient to make text readable */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, rgba(10,10,12,0.9) 0%, rgba(10,10,12,0.4) 50%, rgba(10,10,12,0.1) 100%)'
              }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Content Overlay */}
      <div style={{ maxWidth: '1200px', width: '100%', padding: '0 40px', position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center', margin: '0 auto' }}>
        <div style={{ maxWidth: '650px', transform: 'translateY(-20px)' }}>
          <h1 style={{ 
            fontSize: '4.5rem', 
            fontFamily: 'var(--font-serif)', 
            lineHeight: 1.1,
            marginBottom: '25px',
            color: 'var(--color-gold)',
            textShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }} className="gold-gradient-text">
            {heroContent.title}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-primary)',
            marginBottom: '45px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            {heroContent.subtitle}
          </p>
          <a href="#treatments" className="btn-primary" style={{ padding: '18px 40px', fontSize: '1rem', letterSpacing: '1px' }}>
            {heroContent.button}
          </a>
        </div>
      </div>

    </section>
  );
}
