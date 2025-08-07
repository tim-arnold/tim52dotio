const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const sites = [
  {
    url: 'https://oceanconservancy.org/sharkweek',
    filename: 'ocean-conservancy-shark-week.jpg'
  },
  {
    url: 'https://smokinggun.org/',
    filename: 'smoking-gun.jpg'
  },
  {
    url: 'https://www.lwv.org/',
    filename: 'lwv.jpg'
  },
  {
    url: 'https://www.thetruth.com/',
    filename: 'truth-campaign.jpg'
  },
  {
    url: 'https://avac.org/',
    filename: 'avac.jpg'
  },
  {
    url: 'https://mildredfoxarnold.com',
    filename: 'mildred-fox-arnold.jpg'
  },
  {
    url: 'https://tim52.io',
    filename: 'tim52-io.jpg'
  }
];

async function captureScreenshots() {
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../public/images/portfolio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  for (const site of sites) {
    console.log(`Capturing screenshot of ${site.url}...`);
    
    try {
      const page = await context.newPage();
      
      // Set longer timeout for slow sites
      await page.goto(site.url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait a bit more for any animations/lazy loading
      await page.waitForTimeout(2000);
      
      // Take screenshot of the viewport
      await page.screenshot({
        path: path.join(outputDir, site.filename),
        quality: 90,
        type: 'jpeg'
      });
      
      console.log(`✓ Saved ${site.filename}`);
      await page.close();
      
    } catch (error) {
      console.error(`✗ Failed to capture ${site.url}:`, error.message);
    }
  }

  await browser.close();
  console.log('Screenshot capture complete!');
}

captureScreenshots().catch(console.error);