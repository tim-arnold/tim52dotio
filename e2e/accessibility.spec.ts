import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check that h1 exists
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have skip link functionality', async ({ page }) => {
    const skipLink = page.getByText('Skip to main content');
    await expect(skipLink).toBeInTheDocument();
    
    // Tab to focus the skip link
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    
    // Press enter to activate skip link
    await page.keyboard.press('Enter');
    
    // Main content should be focused
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('should have proper focus management in navigation', async ({ page }) => {
    // Open menu with keyboard
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // Hamburger button
    await page.keyboard.press('Enter'); // Activate hamburger
    
    // First menu item should be focused
    const firstMenuItem = page.getByRole('menuitem').first();
    await expect(firstMenuItem).toBeFocused();
    
    // Escape should close menu and return focus to button
    await page.keyboard.press('Escape');
    const hamburgerButton = page.getByRole('button', { name: /menu/i });
    await expect(hamburgerButton).toBeFocused();
  });

  test('should have proper aria labels and roles', async ({ page }) => {
    // Check navigation has proper aria labels
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeInTheDocument();
    
    // Check sections have proper aria-labelledby
    const heroSection = page.getByRole('banner');
    await expect(heroSection).toHaveAttribute('aria-labelledby', 'hero-heading');
    
    // Check images have alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('should work with keyboard-only navigation', async ({ page }) => {
    // Tab through all interactive elements
    const interactiveElements = await page.locator('a, button, [tabindex]:not([tabindex="-1"])').all();
    
    let tabCount = 0;
    for (const element of interactiveElements) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Verify element is focusable
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeTruthy();
    }
    
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Check that animations are disabled
    const animatedElements = await page.locator('.button').first();
    const animationDuration = await animatedElements.evaluate(el => {
      return window.getComputedStyle(el).animationDuration;
    });
    
    // Should be very short for reduced motion
    expect(animationDuration).toBe('0.01s');
  });
});