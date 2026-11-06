// Runs the automated playtest on the shipped index.html?test (served) and on a reference build, compares window.PLAYTEST.
// node qa/playtest-compare.cjs <base url of this folder> [reference index.html url]
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:5191/', ref = process.argv[3];
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const run = async url => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = [], reqs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    page.on('request', r => reqs.push(r.url()));
    const t0 = Date.now();
    await page.goto(url);
    await page.waitForFunction(() => window.PLAYTEST, null, { timeout: 180000 });
    const r = await page.evaluate(() => window.PLAYTEST);
    await page.close();
    return { r, errs, reqs, ms: Date.now() - t0 };
  };
  const a = await run(base + 'index.html?test');
  console.table(a.r);
  console.log('errors:', a.errs.length, a.errs.slice(0, 5), 'ms:', a.ms);
  console.log('requests:', a.reqs.map(u => u.replace(base, '')).join(' '));
  if (ref) {
    const b = await run(ref + '?test');
    console.log('reference:'); console.table(b.r);
    console.log('PLAYTEST identical to reference:', JSON.stringify(a.r) === JSON.stringify(b.r));
  }
  await browser.close();
})();
