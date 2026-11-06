// The ten jury stills at 1440x900 (phone: 844x390 DPR 2), frame-stepped, with the same names as qa/jury/r1/0*.png,
// plus in-between checks of the round-2 motion (captions, Esc, pull-off curl, lamp) when an extra dir is given.
// node qa/shoot-jury.cjs <base url> <outDir> [checksDir] [query extra, e.g. ",gl-off"]
const path = require('path'), fs = require('fs');
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:5191/';
const out = path.resolve(process.argv[3] || path.join(__dirname, 'shots', 'r2'));
const checks = process.argv[4] ? path.resolve(process.argv[4]) : null;
const extra = process.argv[5] || '';
fs.mkdirSync(out, { recursive: true }); if (checks) fs.mkdirSync(checks, { recursive: true });
const FILING = [
  { t: 6.2, d: 0, steps: 2, air: 0, airUp: 0, carry: 2, carryUp: 2, swim: 0 },
  { t: 21.4, d: 2, steps: 9, air: 4, airUp: 4, carry: 3, carryUp: 0, swim: 0 },
  { t: 18.0, d: 0, steps: 5, air: 0, airUp: 0, carry: 2, carryUp: 1, swim: 3.4 },
  { t: 40.3, d: 3, steps: 15, air: 6, airUp: 6, carry: 5, carryUp: 0, swim: 0 },
  { t: 25.1, d: 1, steps: 6, air: 0, airUp: 0, carry: 0, carryUp: 0, swim: 4.8 },
  { t: 14.9, d: 0, steps: 7, air: 2, airUp: 0, carry: 5, carryUp: 5, swim: 0 },
  { t: 19.7, d: 4, steps: 5, air: 4, airUp: 4, carry: 1, carryUp: 0, swim: 0 },
  { t: 22.2, d: 0, steps: 8, air: 0, airUp: 0, carry: 6, carryUp: 4, swim: 2.1 },
  { t: 31.0, d: 1, steps: 5, air: 3, airUp: 0, carry: 2, carryUp: 0, swim: 0 },
  { t: 48.8, d: 0, steps: 6, air: 2, airUp: 2, carry: 4, carryUp: 2, swim: 2.6 },
];
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const logs = [];
  async function open(opts = {}) {
    const page = await browser.newPage({ viewport: opts.vp || { width: 1440, height: 900 }, deviceScaleFactor: opts.dpr || 1,
      reducedMotion: opts.rm ? 'reduce' : 'no-preference', hasTouch: !!opts.touch, isMobile: !!opts.touch });
    page.on('console', m => { if (/error|warn/.test(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
    page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
    await page.goto(`${base}index.html?__state=frames${extra}`);
    await page.waitForFunction(() => window.__frames);
    await page.evaluate(() => window.__frames.ready);
    return page;
  }
  const step = (page, s) => page.evaluate(n => { for (let i = 0; i < n; i++) window.__frames.step(1000 / 60); }, Math.round(s * 60));
  const shot = (page, name, dir = out) => page.screenshot({ path: path.join(dir, name + '.png') });
  const ev = (page, fn, arg) => page.evaluate(fn, arg);
  const midlens = async (page, name) => {
    const key = await ev(page, () => window.CD.k < 4 ? 'KeyQ' : 'KeyE');
    await ev(page, k => window.CD.press(k), key); await step(page, 0.07);
    await shot(page, name);
    await ev(page, k => window.CD.release(k), key); await step(page, 0.4);
  };
  const untilState = async (page, s, max = 900) => { for (let n = 0; n < max && await ev(page, () => window.CD.state) === s; n++) await step(page, 1 / 60); };

  let page = await open();
  // 01 the cover, as the carried half of the staged pair finishes (caption up)
  await step(page, 1.42); await shot(page, '01-cover');
  if (checks) {
    await step(page, 0.4); await shot(page, 'cover-in-the-air', checks);          // 1.82 s: mid-hop, not carried
    await step(page, 1.6); await shot(page, 'cover-home', checks);
    await page.mouse.move(1300, 120); await step(page, 0.5); await shot(page, 'cover-lamp-top-right', checks);
    await page.mouse.move(140, 860); await step(page, 0.5); await shot(page, 'cover-lamp-bottom-left', checks);
    await page.mouse.move(1300, 120); await step(page, 1 / 60); await shot(page, 'cover-lamp-1frame', checks);
  }
  await page.close();

  page = await open();
  // 02 / 03 FIG. 1 at rest and mid-lens
  await ev(page, () => window.CD.load(0)); await step(page, 1.6); await shot(page, '02-fig1-at-rest');
  await midlens(page, '03-fig1-lens-turning-phantoms');
  // 04 FIG. 1 aligned, 18
  await ev(page, () => window.CD.load(0)); await step(page, 1.4);
  await ev(page, () => window.CD.lens(2)); await step(page, 1.0); await shot(page, '04-fig1-door-aligned-numbered-18');
  if (checks) {
    await step(page, 2.2); await shot(page, 'fig1-aligned-numerals-dimmed', checks);
    await ev(page, () => window.CD.press('KeyD')); await untilState(page, 'play'); await ev(page, () => window.CD.release('KeyD'));
    await step(page, 0.66); await shot(page, 'pull-curl', checks);
    await step(page, 0.14); await shot(page, 'pull-off', checks);
    await step(page, 0.2); await shot(page, 'pull-next-cut', checks);
    await step(page, 0.5); await shot(page, 'fig2-entered', checks);
  }
  // 05 FIG. 2 death, ANTICIPATED
  await ev(page, () => window.CD.load(1)); await step(page, 1.2);
  await ev(page, () => window.CD.press('KeyD')); await untilState(page, 'play'); await ev(page, () => window.CD.release('KeyD'));
  await step(page, 0.35); await shot(page, '05-fig2-death-anticipated');
  // 06 FIG. 6 mid-lens (vertical)
  await step(page, 1.0);
  await ev(page, () => window.CD.load(5)); await step(page, 1.6); await midlens(page, '06-fig6-vertical-lens');
  if (checks) { await step(page, 3); await shot(page, 'fig6-rest-dimmed', checks); }
  // 07 FIG. 9 at rest
  await ev(page, () => window.CD.load(8)); await step(page, 1.6); await shot(page, '07-fig9-at-rest');
  if (checks) {
    // Esc from FIG. 9: the sheet drops, the Brief lands
    await page.keyboard.press('Escape'); await step(page, 0.12); await shot(page, 'esc-in-0.12', checks);
    await step(page, 0.1); await shot(page, 'esc-in-0.22', checks);
    await step(page, 0.12); await shot(page, 'esc-in-0.34', checks);
    await step(page, 0.8); await shot(page, 'brief-from-fig9', checks);
    await page.keyboard.press('Escape'); await step(page, 0.15); await shot(page, 'esc-out-0.15', checks);
    await step(page, 0.4);
  }
  // 08 the Brief, all cleared; 09 the grant
  await ev(page, f => { window.CD.setFiling(f); window.CD.end(); }, FILING);
  await step(page, 2.3); await shot(page, '09-end-letters-patent');
  await ev(page, () => window.CD.brief()); await step(page, 1.0); await shot(page, '08-level-list-brief-description');
  await page.close();

  // 10 the phone cover
  page = await open({ vp: { width: 844, height: 390 }, dpr: 2, touch: true });
  await step(page, 3.5); await shot(page, '10-phone-needs-keyboard');
  await page.close();
  console.log('console errors/warnings:', logs.length ? '\n' + logs.join('\n') : 'none');
  await browser.close();
})();
