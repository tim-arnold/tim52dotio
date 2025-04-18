// src/components/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 70;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Prevent scrolling when menu is open
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = '';
        };
    }, [scrolled, menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className={`${styles.navigation} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
            <div className={styles.container}>
                <a href="#" className={styles.logo}>
                    tim52.io
                </a>

                {/* Hamburger Menu Button */}
                <button
                    className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Menu */}
                <div className={styles.menuContainer}>
                    <ul className={styles.menu}>
                        <li><a href="#hero" onClick={closeMenu}>Home</a></li>
                        <li><a href="#hello" onClick={closeMenu}>Hello</a></li>
                        <li><a href="#cactus" onClick={closeMenu}>I am a Cactus</a></li>
                        <li><a href="#findme" onClick={closeMenu}>Where to Find Me</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}