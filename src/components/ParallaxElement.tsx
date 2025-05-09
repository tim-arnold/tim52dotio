// src/components/ParallaxElement.tsx
'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import styles from '../styles/components/ParallaxElement.module.scss';

interface ParallaxElementProps {
    children: ReactNode;
    speed: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
    amplify?: number; // Add an amplification factor
}

export default function ParallaxElement({
                                            children,
                                            speed,
                                            direction = 'up',
                                            className = '',
                                            amplify = 1, // Default amplification is 1x
                                        }: ParallaxElementProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [elementTop, setElementTop] = useState(0);

    useEffect(() => {
        if (elementRef.current) {
            setElementTop(elementRef.current.getBoundingClientRect().top + window.scrollY);
        }

        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const calculateTransform = () => {
        // Apply amplification factor to increase movement
        const relativeScroll = (scrollPosition - elementTop) * amplify;
        const translateValue = relativeScroll * speed * 0.15; // Increased from 0.1 to 0.15 for more movement

        switch (direction) {
            case 'up':
                return `translateY(${-translateValue}px)`;
            case 'down':
                return `translateY(${translateValue}px)`;
            case 'left':
                return `translateX(${-translateValue}px)`;
            case 'right':
                return `translateX(${translateValue}px)`;
            default:
                return `translateY(${-translateValue}px)`;
        }
    };

    return (
        <div
            ref={elementRef}
            className={`${styles.parallaxElement} ${className}`}
            style={{
                transform: calculateTransform(),
            }}
        >
            {children}
        </div>
    );
}