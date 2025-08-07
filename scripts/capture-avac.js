const { chromium } = require('playwright');
const path = require('path');

async function captureAvacScreenshot() {
  const outputDir = path.join(__dirname, '../public/images/portfolio');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  console.log('Capturing updated screenshot of AVAC...');
  
  try {
    const page = await context.newPage();
    
    // Go to the AVAC site
    await page.goto('https://avac.org/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for the page to load
    await page.waitForTimeout(4000);
    
    // Try to dismiss common popup elements
    const popupSelectors = [
      '[class*="popup"]',
      '[class*="modal"]',
      '[class*="overlay"]',
      '[class*="newsletter"]',
      '[class*="subscribe"]',
      '[class*="close"]',
      'button[aria-label*="close"]',
      'button[aria-label*="Close"]',
      '.close',
      '.modal-close',
      '.popup-close',
      '[data-dismiss="modal"]',
      '.fancybox-close',
      '.mfp-close'
    ];
    
    for (const selector of popupSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            console.log(`Found and clicking popup/modal element: ${selector}`);
            await element.click();
            await page.waitForTimeout(1000);
            break; // Exit loop after first successful close
          }
        }
      } catch (e) {
        // Continue to next selector if this one fails
      }
    }
    
    // Try pressing Escape key to dismiss any remaining popups
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    
    // Wait a bit more for any animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: path.join(outputDir, 'avac.jpg'),
      quality: 90,
      type: 'jpeg'
    });
    
    console.log('✓ Updated avac.jpg without popup');
    await page.close();
    
  } catch (error) {
    console.error('✗ Failed to capture updated AVAC screenshot:', error.message);
  }

  await browser.close();
  console.log('AVAC screenshot update complete!');
}

captureAvacScreenshot().catch(console.error);