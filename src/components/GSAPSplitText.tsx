'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface GSAPSplitTextProps {
  children: string;
  className?: string;
  id?: string;
  tag?: keyof JSX.IntrinsicElements;
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

    // Force all letters to start at 0 and stay there initially
    gsap.set(chars, { y: 0, force3D: true });

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Add each character animation with individual ScrollTrigger and random velocities
      chars.forEach((char, i) => {
        const multiplier = direction === 'up' ? -1 : 1;
        const baseVelocity = speed;
        
        // Random velocity multiplier between 0.5x and 4x base speed
        const velocityMultiplier = 0.5 + Math.random() * 3.5;
        
        // Distance also varies with velocity for more pronounced effect
        const distance = 100 + (velocityMultiplier * 80); // Base 100px + up to 320px more
        
        // Create timeline for different opacity and movement timing
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: text,
            start: 'top center',
            end: 'bottom top',
            scrub: baseVelocity / velocityMultiplier, // Smaller scrub = faster response
            invalidateOnRefresh: true
          }
        });

        tl.fromTo(char, 
          { y: 0, opacity: 1 }, // Start at 0 position with full opacity
          {
            y: multiplier * distance * 0.4, // Move less distance while fading
            opacity: 0, // Fade out completely
            ease: 'none',
            duration: 0.4 // Fade completes in first 40% of scroll
          }
        )
        .to(char, {
          y: multiplier * distance, // Continue moving after fading out
          ease: 'none',
          duration: 0.6 // Remaining 60% of scroll
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