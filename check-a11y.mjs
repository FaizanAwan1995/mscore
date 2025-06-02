import { chromium } from 'playwright';
import { injectAxe, checkA11y } from '@axe-core/playwright';
const URL = 'http://localhost:3000'; // adjust as needed
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  await injectAxe(page);
  const results = await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
  const violations = results.violations.length;
  const totalChecks = results.passes.length + results.violations.length;
  const score = ((results.passes.length / totalChecks) * 100).toFixed(2);
  console.log(`Accessibility Score: ${score}%`);
  if (score < 99) {
    console.error(`:x: Accessibility score ${score}% is below threshold.`);
    process.exit(1);
  } else {
    console.log(':white_check_mark: Accessibility score passes threshold.');
    process.exit(0);
  }
  await browser.close();
})();