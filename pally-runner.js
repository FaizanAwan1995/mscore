const pa11y = require('pa11y');
(async () => {
  const results = await pa11y('file://' + __dirname + '/test.html', {
    browserLaunchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });
  const score = Math.max(0, 100 - results.issues.length * 5);
  console.log(`\nAccessibility Score: ${score}/100\n`);
  if (results.issues.length) {
    console.log('Issues:');
    results.issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.message} (${issue.code})`);
    });
  }
  // Exit non-zero if issues found
  if (results.issues.length > 0) {
    process.exit(1);
  }
})();