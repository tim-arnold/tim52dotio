'use client';

import { useEffect, useRef } from 'react';

interface StickyBackgroundProps {
  src: string;
  alt: string;
  objectPosition?: string;
  stickyUntilElement?: string; // Element selector to stay sticky until this element comes into view
  className?: string;
}

export default function StickyBackground({ 
  src, 
  alt, 
  objectPosition = 'center right',
  stickyUntilElement = '#findme',
  className 
}: StickyBackgroundProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current || !containerRef.current) return;

      const targetElement = document.querySelector(stickyUntilElement);
      if (!targetElement) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Get the target element's position
      const targetRect = targetElement.getBoundingClientRect();
      const targetTop = targetRect.top + scrollY;
      
      // Start scrolling when target element comes into view (reaches bottom of viewport)
      const threshold = targetTop - viewportHeight;

      if (scrollY > threshold) {
        // Start scrolling naturally - move the image up by the amount scrolled past threshold
        const scrollPastThreshold = scrollY - threshold;
        containerRef.current.style.position = 'fixed';
        containerRef.current.style.top = `${-scrollPastThreshold}px`;
      } else {
        // Stay fixed at top
        containerRef.current.style.position = 'fixed';
        containerRef.current.style.top = '0px';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [stickyUntilElement]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden'
      }}
    >
      <img 
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition
        }}
      />
    </div>
  );
}