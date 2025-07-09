// src/components/ParallaxSection.tsx
'use client';

import { useRef, useEffect, ReactNode, useState, useCallback } from 'react';
import styles from '../styles/components/ParallaxSection.module.scss';
import { useThrottledScroll } from '../hooks/useThrottledScroll';

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
    role?: string;
    'aria-labelledby'?: string;
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
                                            className = '',
                                            role,
                                            'aria-labelledby': ariaLabelledBy
                                        }: ParallaxSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Cache section position to avoid repeated getBoundingClientRect calls
    const sectionMetrics = useRef({ top: 0, updated: false });

    const updateSectionPosition = useCallback((): void => {
        if (sectionRef.current && !sectionMetrics.current.updated) {
            const rect = sectionRef.current.getBoundingClientRect();
            sectionMetrics.current = {
                top: rect.top + window.scrollY,
                updated: true
            };
        }
    }, []);

    const handleScrollUpdate = useCallback((): void => {
        if (!isVisible || !backgroundRef.current || prefersReducedMotion) return;

        updateSectionPosition();
        const currentScrollY = window.scrollY;

        // Calculate translations using cached position
        const scrollPastSection = Math.max(0, currentScrollY - sectionMetrics.current.top);
        
        // Special handling for negative speeds (sticky effect)
        if (speed < 0) {
            // Only start moving the background when we're close to the top of the viewport
            const sectionHeight = sectionRef.current?.offsetHeight || 0;
            const stickyThreshold = sectionHeight * 0.8; // Start moving when 80% scrolled
            
            if (scrollPastSection > stickyThreshold) {
                const adjustedScroll = scrollPastSection - stickyThreshold;
                const translateY = adjustedScroll * Math.abs(speed);
                const translateX = adjustedScroll * horizontalSpeed;
                backgroundRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            } else {
                // Keep background fixed
                backgroundRef.current.style.transform = `translate3d(0px, 0px, 0)`;
            }
        } else {
            // Normal parallax behavior
            const translateY = scrollPastSection * speed;
            const translateX = scrollPastSection * horizontalSpeed;
            backgroundRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        }
    }, [isVisible, speed, horizontalSpeed, updateSectionPosition, prefersReducedMotion]);

    const throttledScroll = useThrottledScroll(handleScrollUpdate, 16, isVisible);

    // Check for user's motion preferences
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Intersection Observer to only animate visible sections
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    // Reset cached position when becoming visible
                    sectionMetrics.current.updated = false;
                }
            },
            { rootMargin: '100px 0px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        // Initial calculation
        throttledScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [throttledScroll, isVisible]);

    // Reset cached position on resize
    useEffect(() => {
        const handleResize = () => {
            sectionMetrics.current.updated = false;
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section
            id={id}
            ref={sectionRef}
            className={`${styles.parallaxSection} ${className}`}
            role={role}
            aria-labelledby={ariaLabelledBy}
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