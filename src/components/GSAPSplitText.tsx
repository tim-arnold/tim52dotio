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
    const chars = children.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(0px)';
      span.style.transition = 'none';
      return span;
    });

    // Clear existing content and add character spans
    text.innerHTML = '';
    chars.forEach(char => text.appendChild(char));

    // Start letters offscreen above the viewport
    const dropDistance = -window.innerHeight; // Start full viewport height above
    gsap.set(chars, { y: dropDistance, force3D: true });

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Create initial drop animation timeline
      const dropTl = gsap.timeline({ delay: 0.2 }); // Small delay before starting
      
      // Find the last "o" and "i" characters
      const lastOIndex = children.lastIndexOf('o');
      const lastIIndex = children.lastIndexOf('i');
      
      // Drop each letter down with random timing
      chars.forEach((char, index) => {
        let randomDelay, randomDuration;
        
        if (index === lastOIndex) {
          // Make the last "o" drop last
          randomDelay = 2.0; // Drop after all other letters
          randomDuration = 0.8;
        } else {
          // All other letters drop randomly within first 1.5 seconds
          randomDelay = Math.random() * 1.5;
          randomDuration = 0.6 + (Math.random() * 0.8);
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
        }, 300); // Wait for "o" to settle
      }).delay(2.8); // Time when "o" finishes dropping

      // After drop animation completes, add scroll-based parallax
      dropTl.call(() => {
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
              invalidateOnRefresh: true
            }
          }).fromTo(char, {
            y: 0 // Start from the position they landed at
          }, {
            y: multiplier * distance, // Move full distance without fading
            ease: 'none',
            duration: 1 // Use full duration for movement only
          });
        });
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