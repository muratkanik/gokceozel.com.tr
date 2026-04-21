"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { HeroSlide } from '@/components/admin/HeroSlideManager';

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  if (!slides || slides.length === 0) {
    return null; // Don't render if no slides
  }

  return (
    <section className="hero-container" style={{ position: 'relative', width: '100%', height: 'min(70vh, 800px)', minHeight: '500px', overflow: 'hidden' }}>
      
      {/* Embla Carousel Viewport */}
      <div className="embla" ref={emblaRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, overflow: 'hidden' }}>
        <div className="embla__container" style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          {slides.map((slide, index) => (
            <div className="embla__slide" key={slide.id || index} style={{ flex: '0 0 100%', minWidth: 0, position: 'relative', height: '100%' }}>
              {slide.image && (
                <Image 
                  src={slide.image} 
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  sizes="100vw"
                  quality={90}
                />
              )}
              {/* Overlay Gradient to make text readable */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(10, 10, 12, 0.45)'
              }}></div>
              
              {/* Slide Content Overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', zIndex: 10 }}>
                <div style={{ maxWidth: '800px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
                    fontFamily: 'var(--font-serif)', 
                    lineHeight: 1.2,
                    marginBottom: '20px',
                    color: 'var(--color-gold)',
                    textShadow: '0 4px 10px rgba(0,0,0,0.6)'
                  }} className="gold-gradient-text">
                    {slide.title}
                  </h1>
                  <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: '#ffffff',
                    marginBottom: '35px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    textShadow: '0 2px 5px rgba(0,0,0,0.6)',
                    fontWeight: 500
                  }}>
                    {slide.subtitle}
                  </p>
                  {slide.buttonText && slide.buttonLink && (
                    <a href={slide.buttonLink} className="btn-primary" style={{ padding: '16px 35px', fontSize: '1rem', letterSpacing: '1px', display: 'inline-block' }}>
                      {slide.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
