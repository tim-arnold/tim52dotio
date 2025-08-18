'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
          // Create simple collision effect where letters fall to bottom of body
          let oChar: HTMLSpanElement | null = null;
          let iChar: HTMLSpanElement | null = null;
          
          if (lastOIndex >= 0) {
            oChar = chars[lastOIndex];
            const rect = oChar.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();
            const bodyBottom = bodyRect.bottom + window.scrollY;
            const fallDistance = bodyBottom - (rect.top + window.scrollY) - 20; // 20px inside body bottom (10px higher)
            gsap.to(oChar, {
              y: fallDistance,
              rotation: 360,
              duration: 3,
              ease: "power2.in"
            });
          }
          
          if (lastIIndex >= 0) {
            iChar = chars[lastIIndex];
            // "i" gets bumped and falls too
            setTimeout(() => {
              const rect = iChar!.getBoundingClientRect();
              const bodyRect = document.body.getBoundingClientRect();
              const bodyBottom = bodyRect.bottom + window.scrollY;
              const fallDistance = bodyBottom - (rect.top + window.scrollY) + 10; // 10px past body for rotation
              gsap.to(iChar!, {
                y: fallDistance,
                rotation: -270,
                duration: 2.8,
                ease: "power2.in"
              });
            }, 100); // Slight delay for collision reaction
          }
          
          // Add scroll listener for bottom-of-page "o" teetering animation
          if (oChar) {
            const handleScroll = () => {
              const scrollHeight = document.documentElement.scrollHeight;
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const clientHeight = window.innerHeight;
              
              // Check if user has scrolled to bottom (within 50px tolerance)
              if (scrollHeight - scrollTop - clientHeight < 50) {
                // Remove scroll listener to prevent multiple triggers
                window.removeEventListener('scroll', handleScroll);
                
                // Create teetering and rolling animation
                const teeteringTimeline = gsap.timeline();
                
                // First, teeter wobble without falling
                teeteringTimeline
                  .to(oChar, {
                    rotation: "+=10", // slight tilt
                    duration: 0.3,
                    ease: "power2.out"
                  })
                  .to(oChar, {
                    rotation: "-=20", // tilt the other way
                    duration: 0.2,
                    ease: "power2.inOut"
                  })
                  .to(oChar, {
                    rotation: "+=15", // settle back
                    duration: 0.15,
                    ease: "power2.inOut"
                  })
                  // Then fall 15px down and 15px right with rotation
                  .to(oChar, {
                    y: "+=15", // 15 pixels further down
                    x: "+=15", // 15 pixels to the right
                    rotation: "+=180", // Half rotation during the fall
                    duration: 0.4,
                    ease: "power2.in"
                  }, "+=0.2") // Small pause after wobble
                  // Then roll off to the right edge of viewport
                  .to(oChar, {
                    x: window.innerWidth + 50, // Roll completely off screen
                    rotation: "+=6840", // Continue rotating (total 3600 with the 180 above)
                    duration: 8,
                    ease: "none"
                  }); // Seamless transition - no pause
              }
            };
            
            // Add scroll listener after letters have settled
            setTimeout(() => {
              window.addEventListener('scroll', handleScroll, { passive: true });
            }, 1000);
          }
        }, 200); // Wait for "o" to settle
      }).delay(1.4); // When "o" finishes dropping (0.8s + 0.6s)

      // Temporarily disable scroll-based parallax to fix scrolling issues
      // TODO: Re-enable parallax once ScrollTrigger conflict is resolved
      dropTl.call(() => {
        // Parallax disabled - letters will stay in position after drop
        console.log('Drop animation complete - parallax temporarily disabled');
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