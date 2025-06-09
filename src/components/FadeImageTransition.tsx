'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useThrottledScroll } from '../hooks/useThrottledScroll';

interface FadeImageTransitionProps {
    image1: {
        src: string;
        alt: string;
        blurDataURL?: string;
    };
    image2: {
        src: string;
        alt: string;
        blurDataURL?: string;
    };
    width: number;
    height: number;
    className?: string;
}

export default function FadeImageTransition({
    image1,
    image2,
    width,
    height,
    className = ''
}: FadeImageTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [fadeProgress, setFadeProgress] = useState(0);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    const elementMetrics = useRef({ top: 0, height: 0, windowHeight: 0, updated: false });

    const updateElementMetrics = useCallback((): void => {
        if (containerRef.current && !elementMetrics.current.updated) {
            const rect = containerRef.current.getBoundingClientRect();
            elementMetrics.current = {
                top: rect.top + window.scrollY,
                height: rect.height,
                windowHeight: window.innerHeight,
                updated: true
            };
        }
    }, []);

    const handleScrollUpdate = useCallback((): void => {
        if (!isVisible) return;
        
        updateElementMetrics();
        
        if (elementMetrics.current.updated && containerRef.current) {
            const scrollPosition = window.scrollY;
            const elementTop = elementMetrics.current.top;
            const elementHeight = elementMetrics.current.height;
            const windowHeight = elementMetrics.current.windowHeight;
            
            // Calculate element center position relative to viewport
            const elementCenter = elementTop + (elementHeight / 2);
            const viewportCenter = scrollPosition + (windowHeight / 2);
            
            // Calculate if we've scrolled past the element center (one-way transition)
            const fadeDelay = 200; // Additional pixels to delay the start of fading
            const maxDistance = windowHeight / 2; // Fade over half viewport height
            
            let progress = 0;
            
            // Check if viewport center has passed the element center (scrolling down)
            if (viewportCenter >= elementCenter) {
                // We've reached or passed the center, show second image fully
                progress = 1;
            } else {
                // We haven't reached center yet, check if we're in fade zone
                const distanceFromCenter = elementCenter - viewportCenter;
                
                if (distanceFromCenter <= maxDistance - fadeDelay) {
                    // We're within the fade zone
                    const fadeDistance = maxDistance - fadeDelay;
                    progress = 1 - Math.min(distanceFromCenter / fadeDistance, 1);
                }
            }
            
            progress = Math.max(0, Math.min(1, progress));
            
            setFadeProgress(progress);
        }
    }, [isVisible, updateElementMetrics]);

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

    // Intersection Observer to only animate visible elements
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    elementMetrics.current.updated = false;
                }
            },
            { rootMargin: '200px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        window.addEventListener('scroll', throttledScroll, { passive: true });
        throttledScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [throttledScroll, isVisible]);

    // Reset cached metrics on resize
    useEffect(() => {
        const handleResize = () => {
            elementMetrics.current.updated = false;
            elementMetrics.current.windowHeight = window.innerHeight;
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const opacity1 = prefersReducedMotion ? 1 : 1 - fadeProgress;
    const opacity2 = prefersReducedMotion ? 0 : fadeProgress;

    return (
        <div 
            ref={containerRef} 
            className={className} 
            style={{ 
                position: 'relative', 
                width, 
                height,
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}
        >
            <Image
                src={image1.src}
                alt={image1.alt}
                width={width}
                height={height}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: opacity1,
                    transition: prefersReducedMotion ? 'none' : 'opacity 0.1s ease-out',
                    objectFit: 'cover'
                }}
                placeholder={image1.blurDataURL ? "blur" : "empty"}
                blurDataURL={image1.blurDataURL}
            />
            <Image
                src={image2.src}
                alt={image2.alt}
                width={width}
                height={height}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: opacity2,
                    transition: prefersReducedMotion ? 'none' : 'opacity 0.1s ease-out',
                    objectFit: 'cover'
                }}
                placeholder={image2.blurDataURL ? "blur" : "empty"}
                blurDataURL={image2.blurDataURL}
            />
        </div>
    );
}