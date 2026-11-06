// Ship checks: file:// (fonts, no requests outside the folder), no WebGL2 (2D tier), an itch.io-like iframe
// (focus on click, Space/arrows don't scroll the host page), and the Save-the-patent download.
// node qa/embed.cjs <base http url> <host page dir (writable)>
const path = require('path'), fs = require('fs');
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:5191/', hostDir = process.argv[3];
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  // 1. file://
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const errs = [], reqs = [];
    page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (/error|warn/.test(m.type())) errs.push(m.text()); });
    page.on('request', r => reqs.push(r.url()));
    await page.goto('file://' + path.join(root, 'index.html'));
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({ font: document.fonts.check('900 40px "Big Shoulders Display"'), tier: window.__tier, gl: document.documentElement.dataset.gl }));
    const ext = reqs.filter(u => !u.startsWith('file://') && !u.startsWith('data:'));
    console.log('file://', JSON.stringify(r), 'requests:', reqs.map(u => u.replace('file://' + root + '/', '')).join(' '), 'external:', ext.length, 'errors:', errs);
    await page.close();
  }
  // 2. no WebGL2: the 2D tier
  {
    const b2 = await chromium.launch({ args: ['--disable-webgl', '--disable-webgl2'] });
    const page = await b2.newPage({ viewport: { width: 1280, height: 720 } });
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (/error|warn/.test(m.type())) errs.push(m.text()); });
    await page.goto(base + 'index.html'); await page.waitForTimeout(800);
    await page.mouse.click(600, 400); await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(__dirname, 'shots', 'no-webgl2-fig1.png') });
    console.log('no webgl2:', await page.evaluate(() => window.__tier), 'state', await page.evaluate(() => CD.state), 'errors:', errs);
    await b2.close();
  }
  // 3. iframe on a tall host page
  if (hostDir) {
    fs.writeFileSync(path.join(hostDir, 'host.html'), `<!doctype html><body style="margin:0;height:3000px;background:#222">
      <p style="color:#fff">host page</p><iframe id="g" src="${base}index.html" width="960" height="540" style="border:0"></iframe></body>`);
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, acceptDownloads: true });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.join(hostDir, 'host.html'));
    await page.waitForTimeout(1200);
    const box = await page.locator('#g').boundingBox();
    await page.mouse.click(box.x + 480, box.y + 270);          // focus + start
    await page.waitForTimeout(600);
    for (const k of ['Space', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'PageDown', 'Space']) { await page.keyboard.press(k); await page.waitForTimeout(80); }
    await page.keyboard.down('KeyD'); await page.waitForTimeout(300); await page.keyboard.up('KeyD');
    const fr = page.frame({ url: /index\.html/ });
    const st = await fr.evaluate(() => ({ state: CD.state, li: CD.li, x: Math.round(CD.p.x), focus: document.activeElement && document.activeElement.id }));
    const scrollY = await page.evaluate(() => scrollY);
    await page.mouse.move(box.x + 480, box.y + 270); await page.mouse.wheel(0, 300); await page.waitForTimeout(200);
    const scrollY2 = await page.evaluate(() => scrollY);
    console.log('iframe:', JSON.stringify(st), 'host scrollY after keys:', scrollY, 'after wheel:', scrollY2, 'errors:', errs);
    // the grant's Save button downloads a PNG
    await fr.evaluate(() => { CD.setFiling(Array.from({ length: 10 }, () => ({ t: 10, d: 0, steps: 2, air: 1, airUp: 1, carry: 1, carryUp: 1, swim: 0 }))); CD.end(); });
    await page.waitForTimeout(2600);
    const dl = page.waitForEvent('download', { timeout: 5000 });
    // SAVE_BTN in drawing px -> iframe px (960x540 iframe: 1 drawing px = 1 css px)
    await page.mouse.click(box.x + 520 + 118, box.y + 488 + 20);
    const d = await dl, f = path.join(hostDir, await d.suggestedFilename()); await d.saveAs(f);
    console.log('download:', path.basename(f), fs.statSync(f).size, 'bytes');
    fs.copyFileSync(f, path.join(__dirname, 'shots', 'saved-patent.png'));
    await page.close();
  }
  await browser.close();
})();
