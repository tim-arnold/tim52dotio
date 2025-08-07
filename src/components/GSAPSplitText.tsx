'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger for better mobile performance
if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
    ignoreMobileResize: true
  });
}

interface GSAPSplitTextProps {
  children: string;
  className?: string;
  id?: string;
  tag?: React.ElementType;
  speed?: number;
  stagger?: number;
  direction?: 'up' | 'down';
}

export default function GSAPSplitText({
  children,
  className,
  id,
  tag: Tag = 'span',
  speed = 1,
  stagger = 0.1,
  direction = 'up'
}: GSAPSplitTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current;
    const chars = children.split('').map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(0px)';
      span.style.transition = 'none';
      
      // Add class to "tim52.io" characters for better mobile control
      const text = children;
      const tim52Start = text.indexOf('tim52.io');
      if (tim52Start !== -1 && index >= tim52Start && index < tim52Start + 8) {
        span.classList.add('domain-char');
        if (index === tim52Start) {
          span.classList.add('domain-start');
        }
      }
      
      return span;
    });

    // Clear existing content and add character spans
    text.innerHTML = '';
    
    // Group domain characters in a container to keep them together
    let domainContainer: HTMLSpanElement | null = null;
    chars.forEach((char) => {
      if (char.classList.contains('domain-start')) {
        // Create container for domain characters
        domainContainer = document.createElement('span');
        domainContainer.style.display = 'inline-block';
        domainContainer.style.whiteSpace = 'nowrap';
        domainContainer.classList.add('domain-container');
        text.appendChild(domainContainer);
        domainContainer.appendChild(char);
      } else if (char.classList.contains('domain-char') && domainContainer) {
        // Add to domain container
        domainContainer.appendChild(char);
      } else {
        // Add normally
        text.appendChild(char);
        if (!char.classList.contains('domain-char')) {
          domainContainer = null; // Reset container when we're past domain
        }
      }
    });

    // Start letters offscreen above the viewport
    const dropDistance = -window.innerHeight; // Start full viewport height above
    gsap.set(chars, { y: dropDistance, force3D: true });

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Create initial drop animation timeline
      const dropTl = gsap.timeline({ delay: 0.1 }); // Reduced delay before starting
      
      // Find the last "o" and "i" characters
      const lastOIndex = children.lastIndexOf('o');
      const lastIIndex = children.lastIndexOf('i');
      
      // Drop each letter down with random timing
      chars.forEach((char, index) => {
        let randomDelay, randomDuration;
        
        if (index === lastOIndex) {
          // Make the last "o" drop last
          randomDelay = 0.8; // Reduced from 2.0s to 0.8s
          randomDuration = 0.6;
        } else {
          // All other letters drop randomly within first 0.7 seconds
          randomDelay = Math.random() * 0.7; // Reduced from 1.5s
          randomDuration = 0.4 + (Math.random() * 0.4); // Faster drops
        }
        
        dropTl.to(char, {
          y: 0, // Drop to normal position
          duration: randomDuration,
          ease: "bounce.out",
          delay: randomDelay
        }, 0);
      });
      
      // Add collision effect after "o" lands
      dropTl.call(() => {
        // Small delay to let the "o" settle
        setTimeout(() => {
          // Create collision effect - both letters bounce out of view
          if (lastOIndex >= 0) {
            gsap.to(chars[lastOIndex], {
              y: window.innerHeight + 100, // Bounce down out of view
              rotation: 360 * 3, // Spin while falling
              duration: 1.2,
              ease: "power2.in"
            });
          }
          
          if (lastIIndex >= 0) {
            gsap.to(chars[lastIIndex], {
              y: window.innerHeight + 100, // Bounce down out of view
              rotation: -360 * 2, // Spin opposite direction
              duration: 1.0,
              ease: "power2.in",
              delay: 0.1 // Slight delay to show it's reacting to the collision
            });
          }
        }, 200); // Reduced wait time for "o" to settle
      }).delay(1.4); // Reduced time when "o" finishes dropping (0.8s + 0.6s)

      // After drop animation completes, add scroll-based parallax (disabled on mobile)
      dropTl.call(() => {
        // Skip parallax on mobile devices to prevent scroll issues
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
          return;
        }
        
        // Add delay to ensure DOM is settled before creating ScrollTrigger
        setTimeout(() => {
          chars.forEach((char, index) => {
            // Skip the "o" and "i" that have fallen away
            if (index === lastOIndex || index === lastIIndex) {
              return;
            }
            
            const multiplier = direction === 'up' ? -1 : 1;
            const baseVelocity = speed;
            
            // Random velocity multiplier between 0.5x and 4x base speed
            const velocityMultiplier = 0.5 + Math.random() * 3.5;
            
            // Distance also varies with velocity for more pronounced effect
            const distance = 100 + (velocityMultiplier * 80); // Base 100px + up to 320px more
            
            // Create timeline for scroll-based movement starting from current position (y: 0)
            gsap.timeline({
              scrollTrigger: {
                trigger: text,
                start: 'top center',
                end: 'bottom top',
                scrub: baseVelocity / velocityMultiplier, // Smaller scrub = faster response
                invalidateOnRefresh: true,
                refreshPriority: -1 // Lower priority to avoid conflicts
              }
            }).fromTo(char, {
              y: 0 // Start from the position they landed at
            }, {
              y: multiplier * distance, // Move full distance without fading
              ease: 'none',
              duration: 1 // Use full duration for movement only
            });
          });
          
          // Refresh ScrollTrigger after all animations are set up
          ScrollTrigger.refresh();
        }, 100);
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === text) {
          trigger.kill();
        }
      });
    };
  }, [children, speed, stagger, direction]);

  return <Tag ref={textRef} className={className} id={id} />;
}