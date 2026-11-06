// Wayfinding and persistence with real keys: Esc <-> Brief, digits, C, R, M (remembered), progress and claims saved.
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:5191/';
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (/error|warn/.test(m.type())) errs.push(m.text()); });
  await page.goto(base + 'index.html'); await page.waitForTimeout(700);
  const S = () => page.evaluate(() => `${CD.state}/${CD.li}`), key = async k => { await page.keyboard.press(k); await page.waitForTimeout(120); };
  const log = [];
  await page.mouse.move(10, 10); await page.keyboard.press('Escape'); await page.waitForTimeout(150); log.push('cover Esc -> ' + await S());
  await key('Escape'); log.push('Esc again -> ' + await S());
  await key('Space'); log.push('Space -> ' + await S());
  // clear FIG. 1 by playing it: lens two stops, walk to the door
  await page.keyboard.down('KeyQ'); await page.waitForTimeout(340); await page.keyboard.up('KeyQ'); await page.waitForTimeout(300);
  await page.keyboard.down('KeyD'); await page.waitForFunction(() => CD.state !== 'play', null, { timeout: 8000 }); await page.keyboard.up('KeyD');
  await page.waitForFunction(() => CD.li === 1 && CD.state === 'play', null, { timeout: 4000 });
  log.push('FIG. 1 cleared -> ' + await S() + ' claim: ' + await page.evaluate(() => CD.claim(0)));
  await key('Escape'); log.push('play Esc -> ' + await S());
  await key('ArrowDown'); await key('Enter'); log.push('ArrowDown+Enter -> ' + await S());
  await key('Escape'); await key('Digit4'); log.push('Esc, 4 -> ' + await S());
  await key('Escape'); await key('Escape'); log.push('Esc Esc (return) -> ' + await S());
  await key('Digit0'); log.push('0 -> ' + await S());
  await key('KeyR'); log.push('R -> ' + await S());
  await key('KeyM'); log.push('M -> muted ' + await page.evaluate(() => muted));
  await key('Escape'); await key('KeyC'); log.push('Esc, C -> ' + await S());
  const ls = await page.evaluate(() => ({ best: localStorage.getItem('chromatic-drift.best'), muted: localStorage.getItem('chromatic-drift.muted'), filing: JSON.parse(localStorage.getItem('chromatic-drift.filing'))[0] }));
  log.push('localStorage ' + JSON.stringify(ls));
  await page.reload(); await page.waitForTimeout(500);
  log.push('after reload: muted ' + await page.evaluate(() => muted) + ', cover numeral (best+1) ' + await page.evaluate(() => best + 1));
  const t = await ctx.newPage(); await t.goto(base + 'index.html?test'); await t.waitForFunction(() => window.PLAYTEST, null, { timeout: 180000 });
  log.push('after ?test, best still ' + await t.evaluate(() => localStorage.getItem('chromatic-drift.best')));
  console.log(log.join('\n')); console.log('errors', errs);
  await browser.close();
})();
