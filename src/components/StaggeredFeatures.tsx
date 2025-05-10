'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import styles from '../styles/components/StaggeredAnimation.module.scss';

interface StaggeredFeaturesProps {
    children: ReactNode;
    className?: string;
    threshold?: number;
}

export default function StaggeredFeatures({
                                              children,
                                              className = '',
                                              threshold = 0.1
                                          }: StaggeredFeaturesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        // Fallback for browsers that don't support IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting) {
                    setIsInView(true);
                    // Once it's in view, disconnect the observer
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold, // Uses the prop value, defaulting to 0.1
            }
        );

        const currentElement = containerRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            observer.disconnect();
        };
    }, [threshold]); // Only re-run if threshold changes

    return (
        <div
            ref={containerRef}
            className={`${styles.staggerContainer} ${className} ${isInView ? styles.inView : styles.outOfView}`}
        >
            {React.Children.map(children, (child, index) => (
                <div
                    className={`${styles.staggerItem} ${isInView ? styles.inView : styles.outOfView}`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}