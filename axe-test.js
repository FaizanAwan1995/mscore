const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const { spawn } = require('child_process');

(async () => {
  // Start your server in the background
  const server = spawn('node', ['index.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000' }
  });

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust if needed

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  await page.evaluate(axeSource);

  const results = await page.evaluate(async () => await axe.run());

  if (results.violations.length > 0) {
    console.error('❌ Accessibility Violations:', results.violations);
    process.exit(1);
  } else {
    console.log('✅ No accessibility violations found');
  }

  await browser.close();
  server.kill(); // Stop the server
})();