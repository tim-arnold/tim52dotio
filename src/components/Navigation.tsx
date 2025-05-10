// src/components/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/components/Navigation.module.scss';

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

    const [announcement, setAnnouncement] = useState('');

    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Escape':
                closeMenu();
                // Return focus to the hamburger button
                document.querySelector<HTMLButtonElement>(`.${styles.hamburger}`)?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                focusNextMenuItem();
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusPreviousMenuItem();
                break;
            case 'Home':
                e.preventDefault();
                focusFirstMenuItem();
                break;
            case 'End':
                e.preventDefault();
                focusLastMenuItem();
                break;
        }
    };

    const focusFirstMenuItem = () => {
        const menuItems = getMenuItems();
        menuItems[0]?.focus();
    };

    const focusLastMenuItem = () => {
        const menuItems = getMenuItems();
        menuItems[menuItems.length - 1]?.focus();
    };

    const focusNextMenuItem = () => {
        const menuItems = getMenuItems();
        const currentIndex = menuItems.findIndex(item => item === document.activeElement);
        const nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex]?.focus();
    };

    const focusPreviousMenuItem = () => {
        const menuItems = getMenuItems();
        const currentIndex = menuItems.findIndex(item => item === document.activeElement);
        const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
        menuItems[prevIndex]?.focus();
    };

    const getMenuItems = () => {
        return Array.from(
            document.querySelectorAll<HTMLElement>(`.${styles.menu} a[role="menuitem"]`)
        );
    };

    const toggleMenu = () => {
        const newMenuState = !menuOpen;
        setMenuOpen(newMenuState);

        // Set timeout to wait for DOM update
        if (newMenuState) {
            setTimeout(() => {
                // Focus the first menu item when opening
                focusFirstMenuItem();
            }, 100);
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);

        // Return focus to the hamburger button when closing
        setTimeout(() => {
            document.querySelector<HTMLButtonElement>(`.${styles.hamburger}`)?.focus();
        }, 100);
    };

    return (
        <nav
            className={`${styles.navigation} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
            aria-label="Main navigation"
            role="navigation"
        >
            <div aria-live="polite" className={styles.srOnly}>
                {announcement}
            </div>

            <div className={styles.logoContainer}>
                <a href="#hero" className={styles.skipLink}>
                    Skip to main content
                </a>
                <a href="#" className={styles.logo} aria-label="tim52.io - Home page">
                    tim52.io
                </a>

                {/* Hamburger Menu Button */}
                <button
                    className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
                    onClick={toggleMenu}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="navigation-menu"
                    type="button"
                >
                    {/* Add a more descriptive label for screen readers */}
                    <span className={styles.srOnly}>Toggle navigation menu</span>

                    {/* Make sure these spans have appropriate styling for the hamburger icon */}
                    <span className={`${styles.burgerLayer} ${styles.burgerLayer1}`} aria-hidden="true"></span>
                    <span className={`${styles.burgerLayer} ${styles.burgerLayer2}`} aria-hidden="true"></span>
                    <span className={`${styles.burgerLayer} ${styles.burgerLayer3}`} aria-hidden="true"></span>
                </button>

                {/* Navigation Menu */}
                <div
                    className={styles.menuContainer}
                    id="navigation-menu"
                    role="menu"
                    aria-hidden={!menuOpen}
                    tabIndex={-1} // Will receive focus when menu opens
                >
                    <ul className={styles.menu} role="menubar">
                        <li role="none">
                            <a
                                href="#"
                                onClick={closeMenu}
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                Home
                            </a>
                        </li>
                        <li role="none">
                            <a
                                href="#hello"
                                onClick={closeMenu}
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                Hello
                            </a>
                        </li>
                        <li role="none">
                            <a
                                href="#cactus"
                                onClick={closeMenu}
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                I am a Cactus
                            </a>
                        </li>
                        <li role="none">
                            <a
                                href="#findme"
                                onClick={closeMenu}
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                Where to Find Me
                            </a>
                        </li>
                    </ul>
                    {/* Add a close button at the end of the menu for keyboard users */}
                    <button
                        className={styles.closeMenuButton}
                        onClick={closeMenu}
                        aria-label="Close menu"
                        tabIndex={menuOpen ? 0 : -1}
                    >
                        Close Menu
                    </button>
                </div>
            </div>
        </nav>
    );
}