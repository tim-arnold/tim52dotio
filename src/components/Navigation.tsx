'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from '../styles/components/Navigation.module.scss';
import { useThrottledScroll } from '../hooks/useThrottledScroll';
import { usePageTransition } from './PageTransition';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const { startTransition } = usePageTransition();

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

    const handleNavigation = (href: string, e: React.MouseEvent) => {
        // Check if we're navigating to the same page we're already on
        if (href === '/' && pathname === '/') {
            // Already on home page, just scroll to top
            e.preventDefault();
            closeMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        if (href === '/portfolio' && pathname === '/portfolio') {
            // Already on portfolio page, just scroll to top
            e.preventDefault();
            closeMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // Only handle page transitions for different routes
        if (href.startsWith('/') && !href.startsWith('/#')) {
            e.preventDefault();
            startTransition();
            closeMenu();
            setTimeout(() => {
                router.push(href);
            }, 50); // Small delay to ensure transition starts
        } else {
            closeMenu();
        }
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
                <a href="#main-content" className={styles.skipLink}>
                    Skip to main content
                </a>
                <Link href="/" onClick={(e) => handleNavigation('/', e)} className={styles.logo} aria-label="tim52.io - Home page">
                    tim52.io
                </Link>

                <div className={styles.navControls}>
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
                </div>

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
                            <Link
                                href="/"
                                onClick={(e) => handleNavigation('/', e)}
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                Home
                            </Link>
                        </li>
                        <li role="none">
                            <Link
                                href="/portfolio"
                                onClick={(e) => handleNavigation('/portfolio', e)}
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                Portfolio
                            </Link>
                        </li>
                        <li role="none">
                            <a
                                href="https://www.linkedin.com/in/timarnold/"
                                target="_blank"
                                rel="noopener noreferrer"
                                role="menuitem"
                                tabIndex={menuOpen ? 0 : -1}
                                aria-label="LinkedIn Profile"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
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