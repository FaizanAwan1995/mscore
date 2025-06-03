const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Serve a local file or start your dev server before running this
  const htmlPath = 'file://' + path.resolve('./public/index.html'); // Or your built app
  await page.goto(htmlPath);
  // Inject axe-core script into the page
  const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  await page.evaluate(axeSource);
  // Run accessibility checks
  const results = await page.evaluate(async () => {
    return await axe.run(document);
  });
  if (results.violations.length > 0) {
    console.error('Accessibility Violations:\n', results.violations);
    process.exit(1); // Exit with error to fail the workflow
  } else {
    console.log(':white_check_mark: No accessibility violations found');
  }
  await browser.close();
})();