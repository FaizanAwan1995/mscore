// const puppeteer = require('puppeteer');
// const pa11y = require('pa11y');
// (async () => {
//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });
//   const results = await pa11y('file://' + __dirname + '/test.html', {
//     browser
//   });
//   await browser.close();
//   const score = Math.max(0, 100 - results.issues.length * 5);
//   console.log(`\nAccessibility Score: ${score}/100\n`);
//   if (results.issues.length) {
//     console.log('Issues:');
//     results.issues.forEach((issue, i) => {
//       console.log(`${i + 1}. ${issue.message} (${issue.code})`);
//     });
//   }
//   if (results.issues.length > 0) {
//     process.exit(1); // Fail if issues found
//   }
// })();

// pa11y-runner.js
const path    = require('path');
const glob    = require('glob');
const pa11y   = require('pa11y');
const puppeteer = require('puppeteer');

// change these globs if your files live elsewhere
const PATTERN = '**/*.{html,js}';
const IGNORE  = ['**/node_modules/**'];

(async () => {
  // 1) find all .html & .js (except node_modules)
  const files = glob.sync(PATTERN, { ignore: IGNORE, nodir: true });

  if (files.length === 0) {
    console.log('ℹ️  No .html or .js files found to test.');
    process.exit(0);
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let totalIssues = 0;
  const reports = [];

  for (const file of files) {
    const filePath = path.resolve(__dirname, file);
    const url      = `file://${filePath}`;
    const results  = await pa11y(url, { browser });

    const issueCount = results.issues.length;
    totalIssues += issueCount;
    const score = Math.max(0, 100 - issueCount * 5);

    reports.push({ file, score, issues: results.issues });

    // print per-file
    console.log(`\n📝  Testing: ${file}`);
    console.log(`   Score: ${score}/100  (issues: ${issueCount})`);
    if (issueCount) {
      console.log('   Issues:');
      results.issues.forEach((issue, i) => {
        console.log(
          `     ${i+1}. [${issue.code}] ${issue.message}  (${issue.selector})`
        );
      });
    }
  }

  await browser.close();

  // summary
  const avgScore = Math.round(
    reports.reduce((sum, r) => sum + r.score, 0) / reports.length
  );
})