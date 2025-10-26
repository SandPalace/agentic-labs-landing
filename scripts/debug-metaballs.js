const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function debugMetaballs() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'metaball-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });

  const page = await browser.newPage();

  // Navigate to the metaballs page
  await page.goto('http://localhost:3000/metaballs', {
    waitUntil: 'networkidle2'
  });

  // Wait for scene to load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test positions: corners and center
  const testPositions = [
    { name: 'top-left', x: 200, y: 200 },
    { name: 'top-center', x: 700, y: 200 },
    { name: 'top-right', x: 1200, y: 200 },
    { name: 'middle-left', x: 200, y: 450 },
    { name: 'center', x: 700, y: 450 },
    { name: 'middle-right', x: 1200, y: 450 },
    { name: 'bottom-left', x: 200, y: 700 },
    { name: 'bottom-center', x: 700, y: 700 },
    { name: 'bottom-right', x: 1200, y: 700 },
  ];

  console.log('Taking screenshots at different positions...\n');

  for (const pos of testPositions) {
    // Move mouse to position
    await page.mouse.move(pos.x, pos.y);

    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 200));

    // Get the shader position from the debug info
    const debugInfo = await page.evaluate(() => {
      const debugElement = document.querySelector('body');
      return {
        mousePos: debugElement.innerText.match(/Mouse Position:\s*\((\d+),\s*(\d+)\)/),
        shaderPos: debugElement.innerText.match(/Shader Position:\s*\(([-\d.]+),\s*([-\d.]+)\)/)
      };
    });

    // Take screenshot
    const filename = `${pos.name}_x${pos.x}_y${pos.y}.png`;
    await page.screenshot({
      path: path.join(screenshotsDir, filename),
      fullPage: false
    });

    console.log(`✓ ${pos.name}: Mouse(${pos.x}, ${pos.y})`);
    if (debugInfo.shaderPos) {
      console.log(`  Shader: (${debugInfo.shaderPos[1]}, ${debugInfo.shaderPos[2]})`);
    }
  }

  console.log(`\n✓ Screenshots saved to: ${screenshotsDir}`);
  console.log('\nAnalyze the screenshots to see:');
  console.log('1. Where the blue tracker sphere appears');
  console.log('2. Where the metaball shader appears');
  console.log('3. The pattern of offset between them');

  await browser.close();
}

debugMetaballs().catch(console.error);
