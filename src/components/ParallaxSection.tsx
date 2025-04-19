// src/components/ParallaxSection.tsx
'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import styles from './ParallaxSection.module.css';

interface ParallaxSectionProps {
    backgroundImage?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
    speed?: number;
    className?: string;
    children: ReactNode;
    backgroundColor?: string;
    height?: string;
    minHeight?: string;
    id?: string;
}

export default function ParallaxSection({
                                            backgroundImage,
                                            backgroundPosition = 'center',
                                            backgroundSize = 'cover',
                                            speed = 0.5,
                                            className = '',
                                            children,
                                            backgroundColor = 'transparent',
                                            height = '100vh',
                                            minHeight = '100vh',
                                            id,
                                        }: ParallaxSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;
            setScrollPosition(currentScrollPosition);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate background position based on scroll and speed
    const backgroundTransform = `translateY(${scrollPosition * speed * 0.15}px)`;

    return (
        <section
            ref={sectionRef}
            className={`${styles.parallaxSection} ${className}`}
            style={{
                height,
                backgroundColor,
                minHeight
            }}
            id={id}
        >
            {backgroundImage && (
                <div
                    className={styles.parallaxBackground}
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundPosition,
                        backgroundSize,
                        transform: backgroundTransform
                    }}
                />
            )}
            <div className={styles.content}>{children}</div>
        </section>
    );
}