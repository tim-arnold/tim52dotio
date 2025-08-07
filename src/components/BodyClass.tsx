'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove any existing page classes
    document.body.classList.remove('homepage', 'portfolio', 'not-found');
    
    // Add appropriate class based on pathname
    if (pathname === '/') {
      document.body.classList.add('homepage');
    } else if (pathname === '/portfolio') {
      document.body.classList.add('portfolio');
    } else {
      // Any other path is treated as not-found
      document.body.classList.add('not-found');
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}