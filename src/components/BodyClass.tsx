'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize theme on first load
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        document.documentElement.classList.add(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        // Default to browser preference
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = prefersDark ? 'dark' : 'light';
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {
      // Fallback to light theme if anything fails
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Remove any existing page classes
    document.body.classList.remove('homepage', 'portfolio', 'services', 'not-found');
    
    // Add appropriate class based on pathname
    if (pathname === '/') {
      document.body.classList.add('homepage');
    } else if (pathname === '/portfolio') {
      document.body.classList.add('portfolio');
    } else if (pathname === '/services') {
      document.body.classList.add('services');
    } else {
      // Any other path is treated as not-found
      document.body.classList.add('not-found');
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}