const { chromium } = require('playwright');
const path = require('path');

async function captureSharkWeekScreenshot() {
  const outputDir = path.join(__dirname, '../public/images/portfolio');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  console.log('Capturing updated screenshot of Ocean Conservancy Shark Week...');
  
  try {
    const page = await context.newPage();
    
    // Go to the Shark Week site
    await page.goto('https://oceanconservancy.org/sharkweek', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait longer for the video and all content to fully load
    await page.waitForTimeout(8000);
    
    // Try to wait for video elements to be present
    try {
      await page.waitForSelector('video, iframe[src*="vimeo"], iframe[src*="youtube"]', { timeout: 10000 });
      console.log('Video element detected, waiting additional time for loading...');
      await page.waitForTimeout(5000);
    } catch (e) {
      console.log('No video selector found, continuing with extended wait...');
      await page.waitForTimeout(3000);
    }
    
    // Scroll down by 1vh (1% of viewport height = ~10.8px for 1080px height)
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 0.01);
    });
    
    // Wait a moment more for any scrolling animations
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: path.join(outputDir, 'ocean-conservancy-shark-week.jpg'),
      quality: 90,
      type: 'jpeg'
    });
    
    console.log('✓ Updated ocean-conservancy-shark-week.jpg with scrolled view');
    await page.close();
    
  } catch (error) {
    console.error('✗ Failed to capture updated Shark Week screenshot:', error.message);
  }

  await browser.close();
  console.log('Shark Week screenshot update complete!');
}

captureSharkWeekScreenshot().catch(console.error);