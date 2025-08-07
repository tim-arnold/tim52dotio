'use client';

import { useRouter } from 'next/navigation';
import { usePageTransition } from '../components/PageTransition';

export const useTransitionNavigation = () => {
  const router = useRouter();
  const { startTransition } = usePageTransition();

  const navigate = (href: string) => {
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