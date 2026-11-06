// Post-pass cost and real-time frame rate at 1440x900 DPR 2, with and without a 4x CPU throttle.
// node qa/perf.cjs [base url]
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:5191/';
  const browser = await chromium.launch({ headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-gpu-vsync=false'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await page.goto(base + 'index.html');
  await page.waitForTimeout(800);
  await page.mouse.click(700, 450);                 // focus + start (FIG. best)
  await page.keyboard.press('Digit3');              // TIDE: water, phantoms, labels
  await page.waitForTimeout(1500);
  const fps = async label => {
    // hold the lens back and forth while sampling rAF intervals for 4 s
    const p = page.evaluate(() => new Promise(res => {
      const ts = []; const t0 = performance.now();
      const f = t => { ts.push(t); if (t - t0 < 4000) requestAnimationFrame(f); else res(ts); };
      requestAnimationFrame(f);
    }));
    for (let i = 0; i < 6; i++) { await page.keyboard.down(i % 2 ? 'KeyE' : 'KeyQ'); await page.waitForTimeout(250); await page.keyboard.up(i % 2 ? 'KeyE' : 'KeyQ'); await page.waitForTimeout(350); }
    const ts = await p, d = ts.slice(1).map((t, i) => t - ts[i]).sort((a, b) => a - b);
    const r = { label, frames: ts.length, fps: +(1000 * (ts.length - 1) / (ts[ts.length - 1] - ts[0])).toFixed(1), medianMs: +d[d.length >> 1].toFixed(2), p95Ms: +d[Math.floor(d.length * 0.95)].toFixed(2), over20ms: d.filter(x => x > 20).length };
    console.log(JSON.stringify(r));
  };
  const post = await page.evaluate(() => window.__post.measure(120));
  console.log('post pass (upload + draw)', JSON.stringify(post));
  console.log('post pass (draw only)', JSON.stringify(await page.evaluate(() => window.__post.measure(120, { upload: false }))));
  // in the real loop: main-thread time of each frame's post pass (no readback), over 3 s
  const inLoop = await page.evaluate(() => new Promise(res => {
    const orig = window.renderGL, ms = [];
    window.renderGL = function () { const t = performance.now(); orig(); ms.push(performance.now() - t); };
    setTimeout(() => { window.renderGL = orig; ms.sort((a, b) => a - b); res({ n: ms.length, median: +ms[ms.length >> 1].toFixed(2), p90: +ms[Math.floor(ms.length * 0.9)].toFixed(2), mean: +(ms.reduce((a, b) => a + b, 0) / ms.length).toFixed(2) }); }, 3000);
  }));
  console.log('post pass in the frame loop (main thread)', JSON.stringify(inLoop));
  await fps('no throttle');
  console.log('tier', await page.evaluate(() => window.__tier));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await fps('4x CPU throttle');
  console.log('tier after throttle', await page.evaluate(() => window.__tier));
  console.log('post pass (throttled CPU)', JSON.stringify(await page.evaluate(() => window.__post.on ? window.__post.measure(60) : null)));
  console.log('errors', errs);
  await browser.close();
})();
