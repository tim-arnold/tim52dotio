// src/components/StaggeredFeatures.tsx
'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import styles from '../styles/components/StaggeredAnimation.module.scss';

interface StaggeredFeaturesProps {
    children: ReactNode;
    className?: string;
}

export default function StaggeredFeatures({ children, className = '' }: StaggeredFeaturesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the container enters the viewport, set isInView to true
                if (entry.isIntersecting) {
                    setIsInView(true);
                } else {
                    // Optional: Reset animation when out of view
                    // Uncomment the next line if you want the animation to replay each time
                    // setIsInView(false);
                }
            },
            {
                // Root options
                root: null, // Use the viewport
                rootMargin: '0px',
                threshold: 0.3, // Trigger when 30% of the element is visible
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${styles.staggerContainer} ${className} ${isInView ? styles.inView : styles.outOfView}`}
        >
            {/* Map over the children and wrap each one in a staggerItem div */}
            {React.Children.map(children, (child) => (
                <div className={`${styles.staggerItem} ${isInView ? styles.inView : styles.outOfView}`}>
                    {child}
                </div>
            ))}
        </div>
    );
}