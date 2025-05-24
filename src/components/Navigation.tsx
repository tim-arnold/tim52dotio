'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/components/Navigation.module.scss';
import { useThrottledScroll } from '../hooks/useThrottledScroll';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    // Handle scroll detection with throttling
    const handleScrollUpdate = useCallback(() => {
        const isScrolled = window.scrollY > 70;
        if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
        }
    }, [scrolled]);

    const throttledScroll = useThrottledScroll(handleScrollUpdate, 16);

    useEffect(() => {
        window.addEventListener('scroll', throttledScroll, { passive: true });
        // Initial check
        throttledScroll();
        
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [throttledScroll]);

    // Handle body scroll locking
    useEffect(() => {
        // Prevent scrolling when menu is open but allow screen readers to still navigate
        if (menuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
            }
        }

        return () => {
            // Clean up scroll locking on unmount
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [menuOpen]);

    // Focus management helpers
    const getMenuItems = () => {
        return Array.from(
            document.querySelectorAll<HTMLElement>(`.${styles.menu} a[role="menuitem"]`)
        );
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

    const toggleMenu = () => {
        const newMenuState = !menuOpen;
        setMenuOpen(newMenuState);

        // Set the announcement
        setAnnouncement(newMenuState ? 'Navigation menu opened' : 'Navigation menu closed');

        // Clear the announcement after 3 seconds
        setTimeout(() => {
            setAnnouncement('');
        }, 3000);

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
                    tabIndex={-1}
                    onKeyDown={handleMenuKeyDown}
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