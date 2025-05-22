// src/components/ParallaxElement.tsx
'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import styles from '../styles/components/ParallaxElement.module.scss';

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
    const [scrollPosition, setScrollPosition] = useState(0);
    const [elementTop, setElementTop] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        if (elementRef.current) {
            setElementTop(elementRef.current.getBoundingClientRect().top + window.scrollY);
        }
        setWindowHeight(window.innerHeight);

        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        const handleResize = () => {
            if (elementRef.current) {
                setElementTop(elementRef.current.getBoundingClientRect().top + window.scrollY);
            }
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const calculateTransform = () => {
        // Basic calculation for relative scroll position
        const relativeScroll = scrollPosition - elementTop;
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

        // Calculate rotation if enabled - simplified approach
        if (rotate) {
            // Use viewport-relative position for rotation calculation
            const elementPositionInViewport = elementRef.current ?
                elementRef.current.getBoundingClientRect().top / windowHeight : 0;

            let rotationAngle;

            if (reverseRotation) {
                // Reversed: -rotationRange to +rotationRange (counterclockwise to clockwise)
                rotationAngle = -rotationRange + (elementPositionInViewport + 0.5) * rotationRange * 2;
            } else {
                // Original: +rotationRange to -rotationRange (clockwise to counterclockwise)
                rotationAngle = rotationRange - (elementPositionInViewport + 0.5) * rotationRange * 2;
            }

            // Apply offset to rotation angle
            rotationAngle += rotationOffset;

            // Combine translation and rotation
            return `${translateStyle} rotate(${rotationAngle}deg)`;
        }

        return translateStyle;
    };

    return (
        <div
            ref={elementRef}
            className={`${styles.parallaxElement} ${className}`}
            style={{
                transform: calculateTransform(),
                transition: 'transform 0.05s linear', // Add a small transition for smoothness
            }}
        >
            {children}
        </div>
    );
}