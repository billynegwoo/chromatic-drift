// The continuation, frame-stepped: stills of a ?seed= cover, FIG. 11 / 15 / 25 / 40 at rest and mid-lens, the grant with
// FILE A CONTINUATION, the Brief with the continuation's block; and the label audit (window.__labelAudit) over every
// generated sheet FIG. 11-40 at every lens stop, at rest and mid-lens.
// node qa/endless-shots.cjs [base url] [seed] [outDir]
const path = require('path'), fs = require('fs');
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
const base = process.argv[2] || 'http://localhost:5178/', seed = +(process.argv[3] || 8812);
const out = path.resolve(process.argv[4] || path.join(__dirname, 'shots', 'endless'));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];
  page.on('console', m => { if (/error|warn/.test(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  await page.goto(`${base}index.html?__state=frames&seed=${seed}`);
  await page.waitForFunction(() => window.__frames);
  await page.evaluate(() => window.__frames.ready);
  const step = s => page.evaluate(n => { for (let i = 0; i < n; i++) window.__frames.step(1000 / 60); }, Math.round(s * 60));
  const shot = name => page.screenshot({ path: path.join(out, name + '.png') });
  // generate FIG. 11-40 (frames mode: the validator only works when granted time)
  const gen = await page.evaluate(async seed => {
    const c = CD.cip, t0 = performance.now();
    for (let n = 11; n <= 40; n++) c.host || CD.cip; // host exists once the cover prefetched
    const ps = []; for (let n = 11; n <= 40; n++) ps.push(new Promise(r => { const go = () => c.host ? c.host.request(seed, n).then(r) : setTimeout(go, 20); go(); }));
    const iv = setInterval(() => c.host && c.host.tick(50), 0);
    const res = await Promise.all(ps); clearInterval(iv);
    return { ms: performance.now() - t0, sheets: res.map(r => [r.data.n, r.data.name, r.data.axis, r.data.kmax, r.pass, r.attempts]) };
  }, seed);
  console.log('generated', gen.sheets.length, 'sheets in', gen.ms.toFixed(0), 'ms');
  await step(0.6); await shot('cover-seed');
  // file the continuation from the cover (Space): FIG. 11 comes in
  await page.keyboard.press('Space'); await step(0.25); await shot('fig11-cut'); await step(1.6);
  const register = n => page.evaluate(({ seed, n }) => { const r = CD.cip.host.get(seed, n); CD.loadDef(n - 1, CDX.makeDef(r.data, rect)); }, { seed, n });
  for (const n of [11, 15, 25, 40]) {
    await register(n); await step(1.7); await shot(`fig${n}-rest`);
    const key = await page.evaluate(() => CD.k < 2 ? 'KeyQ' : 'KeyE');
    await page.evaluate(k => CD.press(k), key); await step(0.07); await shot(`fig${n}-midlens`);
    await page.evaluate(k => CD.release(k), key); await step(0.4);
  }
  // label audit: every sheet, every lens stop, at rest and mid-lens (the lens set directly; deaths stamp and are audited too)
  const audit = await page.evaluate(async ({ seed, step60 }) => {
    const bad = [], seen = { checks: 0, labels: 0 };
    const stepN = n => { for (let i = 0; i < n; i++) window.__frames.step(1000 / 60); };
    for (let n = 11; n <= 40; n++) {
      const d = CD.cip.host.get(seed, n).data;
      for (let v = -d.kmax; v <= d.kmax; v++) {
        CD.loadDef(n - 1, CDX.makeDef(d, rect)); stepN(100);
        CD.lens(v); stepN(50);
        for (const phase of ['rest', 'mid']) {
          if (phase === 'mid') { const kk = CD.k < d.kmax ? 'KeyQ' : 'KeyE'; CD.press(kk); stepN(4); }
          const a = window.__labelAudit() || [];
          seen.checks++; seen.labels += a.length;
          for (const q of a) if (q.v.length) bad.push(`FIG. ${n} k=${v} ${phase} ${CD.state}: ${q.txt} ${q.v.join(',')}`);
          if (phase === 'mid') { CD.release('KeyQ'); CD.release('KeyE'); }
        }
      }
    }
    return { bad, seen };
  }, { seed });
  console.log('label audit:', audit.seen.checks, 'frames,', audit.seen.labels, 'labels,', audit.bad.length, 'violations');
  audit.bad.slice(0, 40).forEach(b => console.log('  ', b));
  // the grant: FILE A CONTINUATION; then file it, clear three sheets by bot, open the Brief
  await page.evaluate(() => { CD.load(9); CD.end(); }); await step(2.4); await shot('grant-continuation');
  // a full filing (ten long claims), to check the buttons against the claims' columns
  await page.evaluate(() => { CD.setFiling(Array.from({ length: 10 }, (_, i) => ({ t: 20 + i * 3.3, d: i % 3, steps: 4 + i, air: 1 + (i % 3), airUp: 1, carry: 2, carryUp: 1, swim: i === 2 ? 3.1 : 0 }))); CD.toTitle(); CD.load(9); CD.end(); });
  await step(2.4); await shot('grant-continuation-full');
  await page.evaluate(() => { const b = CD.cip; });
  console.log('console:', logs.length ? logs : 'clean');
  fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify({ gen, audit }, null, 1));
  await browser.close();
})();
