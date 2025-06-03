const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // 👈 Required for GitHub Actions
  });

  const page = await browser.newPage();
  const htmlPath = 'file://' + path.resolve('./public/index.html'); // adjust if needed
  await page.goto(htmlPath);

  const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  await page.evaluate(axeSource);

  const results = await page.evaluate(async () => {
    return await axe.run(document);
  });

  if (results.violations.length > 0) {
    console.error('Accessibility Violations:\n', results.violations);
    process.exit(1);
  } else {
    console.log('✅ No accessibility violations found');
  }

  await browser.close();
})();