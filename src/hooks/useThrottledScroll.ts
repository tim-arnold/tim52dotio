import { useCallback, useRef, useEffect } from 'react';

export const useThrottledScroll = (
  callback: () => void,
  delay: number = 16,
  enabled: boolean = true
) => {
  const lastCall = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const throttledCallback = useCallback(() => {
    if (!enabled) return;
    
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      animationFrame.current = requestAnimationFrame(callback);
    }
  }, [callback, delay, enabled]);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return throttledCallback;
};

export const useElementMetrics = () => {
  const elementRef = useRef<HTMLElement>(null);
  const metricsRef = useRef({ top: 0, height: 0, width: 0 });

  const updateMetrics = useCallback(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      metricsRef.current = {
        top: rect.top + window.scrollY,
        height: rect.height,
        width: rect.width
      };
    }
  }, []);

  useEffect(() => {
    updateMetrics();
    
    const handleResize = () => {
      updateMetrics();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [updateMetrics]);

  return { elementRef, metrics: metricsRef.current, updateMetrics };
};