'use client';

import { useRouter, usePathname } from 'next/navigation';
import { usePageTransition } from '../components/PageTransition';

export const useTransitionNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition } = usePageTransition();

  const navigate = (href: string) => {
    // Check if we're navigating to the same page we're already on
    if (href === pathname) {
      // Same page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Only handle page transitions for different routes
    if (href.startsWith('/') && !href.startsWith('/#')) {
      startTransition();
      setTimeout(() => {
        router.push(href);
      }, 50); // Small delay to ensure transition starts
    } else {
      // For hash links or external links, navigate normally
      if (href.startsWith('#')) {
        const element = document.getElementById(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  };

  return { navigate };
};