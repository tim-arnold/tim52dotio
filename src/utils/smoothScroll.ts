export const smoothScrollToTop = (duration: number = 1500): void => {
  // Temporarily disable CSS smooth scrolling
  const html = document.documentElement;
  const originalScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  const startPosition = window.scrollY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const animate = (): void => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    
    const currentPosition = startPosition * (1 - easedProgress);
    window.scrollTo(0, currentPosition);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Restore original scroll behavior
      html.style.scrollBehavior = originalScrollBehavior;
    }
  };

  // Start immediately
  animate();
};