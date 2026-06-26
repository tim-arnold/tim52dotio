'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SELECTOR = 'main section, main header, main article, #footer';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTOR)
    );

    for (const el of targets) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(48px)';
      el.style.transition = '';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.transition = 'opacity 1.4s ease-out, transform 1.2s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );

    const raf = requestAnimationFrame(() => {
      for (const el of targets) {
        observer.observe(el);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      for (const el of targets) {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
      }
    };
  }, [pathname]);

  return null;
}
