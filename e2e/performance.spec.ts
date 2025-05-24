import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    for (const img of images) {
      // Check that images have proper attributes
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      expect(src).toBeTruthy();
      expect(alt).toBeTruthy();
      
      // Check for WebP format in optimized images
      if (src?.includes('cow') || src?.includes('tim-yelling')) {
        expect(src).toContain('.webp');
      }
    }
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toBe('tim52.io is a cow');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description).toBe('A website that is about Tim. And a cow.');
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('tim52.io is a cow');
    
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBe('A website that is about Tim. And a cow.');
  });

  test('should handle scroll performance well', async ({ page }) => {
    await page.goto('/');
    
    // Measure scroll performance
    const startTime = Date.now();
    
    // Scroll through the page
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(100);
    }
    
    const scrollTime = Date.now() - startTime;
    
    // Scrolling should be smooth and responsive
    expect(scrollTime).toBeLessThan(2000);
  });

  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/');
    
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeInTheDocument();
    
    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBe('/manifest.json');
    
    // Check that manifest is accessible
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.status()).toBe(200);
    
    const manifest = await manifestResponse.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
  });
});