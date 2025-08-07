'use client';

import { useEffect, useState, useRef, createContext, useContext, Children, isValidElement } from 'react';
import { usePathname } from 'next/navigation';
import styles from '../styles/components/PageTransition.module.scss';

interface PageTransitionContextType {
  startTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransition');
  }
  return context;
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPathname = useRef(pathname);
  const isInitialRender = useRef(true);

  const startTransition = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      setDisplayChildren(children);
      return;
    }

    // Route has changed, complete the transition
    if (pathname !== previousPathname.current) {
      // If we weren't already transitioning, start now
      if (!isTransitioning) {
        setIsVisible(false);
        setIsTransitioning(true);
      }
      
      const updateTimer = setTimeout(() => {
        setDisplayChildren(children);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 150);
      
      const fadeInTimer = setTimeout(() => {
        setIsVisible(true);
        setIsTransitioning(false);
      }, 200);
      
      previousPathname.current = pathname;
      
      return () => {
        clearTimeout(updateTimer);
        clearTimeout(fadeInTimer);
      };
    } else {
      // Same pathname, just update content
      setDisplayChildren(children);
      if (isTransitioning) {
        setTimeout(() => {
          setIsVisible(true);
          setIsTransitioning(false);
        }, 200);
      }
    }
  }, [pathname, children, isTransitioning]);

  // Separate navigation from other children
  const childrenArray = Children.toArray(displayChildren);
  const navigationChild = childrenArray.find(child => 
    isValidElement(child) && child.type && (child.type as React.ComponentType).name === 'Navigation'
  );
  const contentChildren = childrenArray.filter(child => 
    !isValidElement(child) || !child.type || (child.type as React.ComponentType).name !== 'Navigation'
  );

  return (
    <PageTransitionContext.Provider value={{ startTransition }}>
      <div>
        {/* Navigation stays visible */}
        <div className={styles.navigationStatic}>
          {navigationChild}
        </div>
        
        {/* Content that transitions */}
        <div 
          className={`${styles.pageTransition} ${isVisible ? styles.visible : styles.hidden}`}
        >
          {contentChildren}
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}