// A continuation played in real time with real (trusted) key presses: ?seed= cover, Space files the continuation,
// then each sheet's own solution is played by a driver that watches the sim and holds keys the way a player does.
// Frame times are recorded the whole time (the validator generates ahead on the same thread). Ends on the Brief.
// node qa/endless-play.cjs [base url] [seed] [sheets] [cpu throttle]
const path = require('path'), fs = require('fs');
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
const base = process.argv[2] || 'http://localhost:5178/', seed = +(process.argv[3] || 8812), sheets = +(process.argv[4] || 3), throttle = +(process.argv[5] || 1);
const out = path.join(__dirname, 'shots', 'endless');
fs.mkdirSync(out, { recursive: true });
const T = 32, sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];
  page.on('console', m => { if (/error|warn/.test(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  await page.goto(`${base}index.html?seed=${seed}`);
  if (throttle > 1) { const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle }); }
  await page.evaluate(() => { window.__ft = []; window.__long = []; let l = performance.now(); const f = t => { const d = t - l; window.__ft.push(d); if (d > 20) window.__long.push([Math.round(d), CD.state, CD.li, (CD.cip.host && CD.cip.host.state) || '-', Math.round(t)]); l = t; requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const S = () => page.evaluate(() => ({ x: CD.p ? CD.p.x : 0, y: CD.p ? CD.p.y : 0, w: 20, g: CD.p ? CD.p.grounded : true, k: CD.k, st: CD.state, li: CD.li, d: CD.deaths }));
  const kb = page.keyboard;
  const playing = async () => (await S()).st === 'play';
  async function until(cond, ms = 8000) { const t = Date.now(); while (Date.now() - t < ms) { const s = await S(); if (s.st !== 'play') return false; if (cond(s)) return true; await sleep(4); } return false; }
  async function lens(n) { if (!n) return; const c = n > 0 ? 'q' : 'e'; await kb.down(c); await sleep(Math.abs(n) / 6 * 1000); await kb.up(c); await sleep(150); }
  async function walkTo(x) { const s = await S(); const c = s.x < x ? 'd' : 'a'; await kb.down(c); await until(q => c === 'd' ? q.x >= x : q.x <= x); await kb.up(c); await sleep(120); }
  async function leap(x, n) { await kb.down('d'); await until(q => q.x + 10 >= x); await kb.down('Space'); await lens(n); await until(q => q.g, 3000); await kb.up('Space'); await kb.up('d'); await sleep(150); }
  async function climb(x, n) { await walkTo(x - 22); await kb.down('d'); await kb.down('Space'); await lens(n); await until(q => q.g && q.x > x, 3000); await kb.up('Space'); await kb.up('d'); await sleep(150); }
  async function hopLens(n) { await kb.down('Space'); await sleep(30); await lens(n); await until(q => q.g, 3000); await kb.up('Space'); await sleep(150); }
  async function swimOnto(maxY) { await kb.down('Space'); await sleep(2500); await kb.down('d'); await until(q => q.g && q.y < maxY, 4000); await kb.up('d'); await kb.up('Space'); await sleep(150); }
  async function walkToHopping(x, hops) { hops = [...hops]; await kb.down('d'); await until(q => { if (hops.length && q.x + 20 >= hops[0]) { hops.shift(); kb.down('Space').then(() => sleep(350)).then(() => kb.up('Space')); } return q.x >= x && q.g; }); await kb.up('d'); await sleep(120); }
  async function catchFall(n) {
    await kb.down('d'); await until(q => !q.g, 3000);
    const c = n > 0 ? 'q' : 'e'; await kb.down(c); const t = Date.now(); let held = true;
    while (Date.now() - t < Math.abs(n) / 6 * 1000) { if (held && (await S()).g) { await kb.up('d'); held = false; } await sleep(4); }
    await kb.up(c); await sleep(150); await kb.up('d'); await sleep(150);
  }
  async function run(script) {
    for (const [v, a, b] of script) {
      if (!(await playing())) break;
      const k = (await S()).k, pos = q => typeof q === 'number' ? q : q.red !== undefined ? (q.red - k) * T + (q.off || 0) : (q.blue + k) * T + (q.off || 0);
      if (v === 'lens') await lens(a); else if (v === 'walkTo') await walkTo(pos(a)); else if (v === 'leap') await leap(pos(a), b);
      else if (v === 'climb') await climb(a, b); else if (v === 'hopLens') await hopLens(a); else if (v === 'swimOnto') await swimOnto(a);
      else if (v === 'walkToHopping') await walkToHopping(pos(a), b); else if (v === 'catchFall') await catchFall(a);
    }
  }
  await sleep(1500);
  await page.screenshot({ path: path.join(out, 'play-cover.png') });
  await kb.press('Space');
  const report = [];
  for (let i = 0; i < sheets; i++) {
    const want = 10 + i;
    const t0 = Date.now();
    while (Date.now() - t0 < 20000) { const s = await S(); if (s.li === want && s.st === 'play') break; await sleep(20); }
    const waited = Date.now() - t0;
    await sleep(900);
    const info = await page.evaluate(n => { const r = CD.cip.results[`${CD.cip.run.seed}:${n}`]; return { name: r.data.name, pass: r.pass, script: r.data.script }; }, want + 1);
    const d0 = (await S()).d, t1 = Date.now();
    let tries = 0, won = false;
    while (tries < 3 && !won) {
      tries++;
      await run(info.script);
      const t = Date.now(); while (Date.now() - t < 2500) { const s = await S(); if (s.st === 'win' || s.li !== want) { won = true; break; } if (s.st === 'dead') break; await sleep(10); }
      if (!won) { for (const c of ['a', 'd', 'q', 'e', 'Space']) await kb.up(c); await sleep(1000); if ((await S()).st === 'play') { await kb.press('r'); await sleep(300); } }
    }
    if (i === 0) await page.screenshot({ path: path.join(out, 'play-fig11-won.png') });
    report.push({ fig: want + 1, name: info.name, tolerance: `${info.pass}/9`, won, tries, deaths: (await S()).d - d0, seconds: (Date.now() - t1) / 1000, waitedForSheetMs: waited });
  }
  await sleep(2200);
  await page.screenshot({ path: path.join(out, 'play-next-sheet.png') });
  await kb.press('Escape'); await sleep(1200);
  await page.screenshot({ path: path.join(out, 'brief-continuation.png') });
  const run2 = await page.evaluate(() => ({ cleared: CD.cip.run.cleared, at: CD.cip.run.at, claims: Object.keys(CD.cip.run.recs).map(n => CD.cipClaim(+n)), stored: localStorage.getItem('chromatic-drift.cip'), frames: CD.CONT.size }));
  const ft = await page.evaluate(() => window.__ft.slice(5));
  const sorted = [...ft].sort((a, b) => a - b), p = q => sorted[Math.floor(sorted.length * q)];
  console.log(JSON.stringify({ report, run: run2, frames: { n: ft.length, median: +p(0.5).toFixed(2), p99: +p(0.99).toFixed(2), max: +sorted[sorted.length - 1].toFixed(1), over20ms: ft.filter(v => v > 20).length, over33ms: ft.filter(v => v > 33.4).length }, console: logs, long: await page.evaluate(() => window.__long) }, null, 1));
  await browser.close();
})();
