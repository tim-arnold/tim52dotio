const { chromium } = require('playwright');
const path = require('path');

async function captureCovidBankingScreenshot() {
  const outputDir = path.join(__dirname, '../public/images/portfolio');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  console.log('Capturing screenshot of COVID Banking Relief site...');
  
  try {
    const page = await context.newPage();
    
    // Go to the COVID banking site
    await page.goto('https://covidbanking.joinbankon.org/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for the static HTML content to fully load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: path.join(outputDir, 'covid-banking.jpg'),
      quality: 90,
      type: 'jpeg'
    });
    
    console.log('✓ Saved covid-banking.jpg');
    await page.close();
    
  } catch (error) {
    console.error('✗ Failed to capture COVID banking screenshot:', error.message);
  }

  await browser.close();
  console.log('COVID Banking screenshot capture complete!');
}

captureCovidBankingScreenshot().catch(console.error);