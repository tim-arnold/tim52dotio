// src/components/StickyButton.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './StickyButton.module.css';

interface Section {
    id: string;
    buttonText: string;
    nextSection: string;
    isLast?: boolean;
}

export default function StickyButton() {
    const [activeSection, setActiveSection] = useState('hero');

    // Memoize the sections array to prevent unnecessary re-renders
    const sections = useMemo<Section[]>(() => [
        { id: 'hero', buttonText: 'Doink', nextSection: 'hello' },
        { id: 'hello', buttonText: 'Doink', nextSection: 'cactus' },
        { id: 'cactus', buttonText: 'Dink', nextSection: 'findme' },
        { id: 'findme', buttonText: 'Woosh', nextSection: 'hero', isLast: true }
    ], []);

    useEffect(() => {
        // Function to determine which section is currently in view
        const determineActiveSection = () => {
            const sectionElements = sections.map(section =>
                document.getElementById(section.id)
            );

            // Filter out any null elements (in case an ID doesn't exist in the DOM)
            const validSectionElements = sectionElements.filter(el => el !== null) as HTMLElement[];

            if (validSectionElements.length === 0) return;

            // Get the section that's most visible in the viewport
            const viewportHeight = window.innerHeight;
            let maxVisibleSection = validSectionElements[0];
            let maxVisiblePercentage = 0;

            validSectionElements.forEach(section => {
                const rect = section.getBoundingClientRect();

                // Calculate how much of the section is visible in the viewport
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const visiblePercentage = visibleHeight / viewportHeight;

                if (visiblePercentage > maxVisiblePercentage) {
                    maxVisiblePercentage = visiblePercentage;
                    maxVisibleSection = section;
                }
            });

            // Set the active section
            setActiveSection(maxVisibleSection.id);
        };

        // Add scroll event listener
        window.addEventListener('scroll', determineActiveSection);

        // Initial check
        determineActiveSection();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', determineActiveSection);
        };
    }, [sections]); // sections is now memoized and won't change on re-renders

    // Find the current active section in our array
    const currentSection = sections.find(section => section.id === activeSection);

    if (!currentSection) return null;

    // Determine if we should use the "button-up" class
    const buttonClass = currentSection.isLast ? "button button-up" : "button";

    return (
        <div className={styles.stickyButton}>
            <Link href={`#${currentSection.nextSection}`} className={buttonClass}>
                {currentSection.buttonText}
            </Link>
        </div>
    );
}