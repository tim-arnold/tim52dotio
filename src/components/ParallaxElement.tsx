// src/components/ParallaxElement.tsx
'use client';

import { ReactNode, useRef, useEffect, useState, useCallback } from 'react';
import styles from '../styles/components/ParallaxElement.module.scss';
import { useThrottledScroll } from '../hooks/useThrottledScroll';

interface ParallaxElementProps {
    children: ReactNode;
    speed: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
    amplify?: number;
    rotate?: boolean;
    rotationRange?: number;
    rotationOffset?: number;
    reverseRotation?: boolean; // New prop to control rotation direction
}

export default function ParallaxElement({
                                            children,
                                            speed,
                                            direction = 'up',
                                            className = '',
                                            amplify = 1,
                                            rotate = false,
                                            rotationRange = 10,
                                            rotationOffset = 0,
                                            reverseRotation = false, // Default to false (original direction)
                                        }: ParallaxElementProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    
    // Cache element metrics to avoid repeated getBoundingClientRect calls
    const elementMetrics = useRef({ top: 0, height: 0, windowHeight: 0, updated: false });

    const updateElementMetrics = useCallback(() => {
        if (elementRef.current && !elementMetrics.current.updated) {
            const rect = elementRef.current.getBoundingClientRect();
            elementMetrics.current = {
                top: rect.top + window.scrollY,
                height: rect.height,
                windowHeight: window.innerHeight,
                updated: true
            };
        }
    }, []);

    const handleScrollUpdate = useCallback(() => {
        if (!isVisible) return;
        
        updateElementMetrics();
        setScrollPosition(window.scrollY);
    }, [isVisible, updateElementMetrics]);

    const throttledScroll = useThrottledScroll(handleScrollUpdate, 16, isVisible);

    // Intersection Observer to only animate visible elements
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    // Reset cached metrics when becoming visible
                    elementMetrics.current.updated = false;
                }
            },
            { rootMargin: '200px 0px' } // Larger margin for smoother transitions
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
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

    // Reset cached metrics on resize
    useEffect(() => {
        const handleResize = () => {
            elementMetrics.current.updated = false;
            elementMetrics.current.windowHeight = window.innerHeight;
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateTransform = useCallback(() => {
        if (!isVisible || !elementMetrics.current.updated) return '';
        
        // Use cached metrics to avoid getBoundingClientRect
        const relativeScroll = scrollPosition - elementMetrics.current.top;
        const translateValue = relativeScroll * speed * 0.15 * amplify;

        let translateStyle = '';
        switch (direction) {
            case 'up':
                translateStyle = `translateY(${-translateValue}px)`;
                break;
            case 'down':
                translateStyle = `translateY(${translateValue}px)`;
                break;
            case 'left':
                translateStyle = `translateX(${-translateValue}px)`;
                break;
            case 'right':
                translateStyle = `translateX(${translateValue}px)`;
                break;
            default:
                translateStyle = `translateY(${-translateValue}px)`;
        }

        // Calculate rotation if enabled - use cached viewport position
        if (rotate && elementRef.current && elementMetrics.current.windowHeight > 0) {
            // Use cached position instead of getBoundingClientRect
            const viewportTop = scrollPosition - elementMetrics.current.top;
            const elementPositionInViewport = viewportTop / elementMetrics.current.windowHeight;

            let rotationAngle;

            if (reverseRotation) {
                rotationAngle = -rotationRange + (elementPositionInViewport + 0.5) * rotationRange * 2;
            } else {
                rotationAngle = rotationRange - (elementPositionInViewport + 0.5) * rotationRange * 2;
            }

            rotationAngle += rotationOffset;
            return `${translateStyle} rotate(${rotationAngle}deg)`;
        }

        return translateStyle;
    }, [isVisible, scrollPosition, speed, amplify, direction, rotate, rotationRange, rotationOffset, reverseRotation]);

    return (
        <div
            ref={elementRef}
            className={`${styles.parallaxElement} ${className}`}
            style={{
                transform: calculateTransform(),
                // Remove conflicting transition for better performance
                willChange: isVisible ? 'transform' : 'auto'
            }}
        >
            {children}
        </div>
    );
}