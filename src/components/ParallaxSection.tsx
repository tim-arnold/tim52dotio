// src/components/ParallaxSection.tsx
'use client';

import { useRef, useEffect, ReactNode } from 'react';
import styles from './ParallaxSection.module.css';

interface ParallaxSectionProps {
    id?: string;
    children: ReactNode;
    backgroundImage?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
    backgroundColor?: string;
    speed?: number;
    horizontalSpeed?: number; // Add new prop for horizontal parallax
    height?: string;
    minHeight?: string;
    className?: string;
}

export default function ParallaxSection({
                                            id,
                                            children,
                                            backgroundImage,
                                            backgroundPosition = 'center',
                                            backgroundSize = 'cover',
                                            backgroundColor,
                                            speed = 0.5,
                                            horizontalSpeed = 0, // Default to 0 (no horizontal movement)
                                            height = 'auto',
                                            minHeight = '0',
                                            className = ''
                                        }: ParallaxSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current || !backgroundRef.current) return;

            // Get the section's position relative to the viewport
            const rect = sectionRef.current.getBoundingClientRect();

            // Calculate the section's position relative to the document
            const scrollTop = window.scrollY || window.pageYOffset;
            const sectionTop = rect.top + scrollTop;

            // Calculate how far we've scrolled past the section's top
            const scrollPastSection = Math.max(0, scrollTop - sectionTop);

            // Calculate the vertical translation based on scroll position
            const translateY = scrollPastSection * speed;

            // Calculate the horizontal translation based on scroll position
            const translateX = scrollPastSection * horizontalSpeed;

            // Apply both translations
            backgroundRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Initial calculation
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [speed, horizontalSpeed]);

    return (
        <section
            id={id}
            ref={sectionRef}
            className={`${styles.parallaxSection} ${className}`}
            style={{
                backgroundColor,
                height,
                minHeight
            }}
        >
            {backgroundImage && (
                <div
                    ref={backgroundRef}
                    className={styles.parallaxBackground}
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundPosition,
                        backgroundSize
                    }}
                />
            )}
            <div className={styles.parallaxContent}>{children}</div>
        </section>
    );
}