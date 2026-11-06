// Frame-stepped stills of the shipped game: cover, every FIG. at rest and mid-lens, the cut, alignment,
// death, swimming, the pull-off, the Brief Description page, the grant, plus the gl-off / post-off / reduced tiers.
// node qa/shoot.cjs [base url] [outDir] [only tags, comma-separated]
const path = require('path'), fs = require('fs');
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:5191/';
const out = path.resolve(process.argv[3] || path.join(__dirname, 'shots'));
const only = (process.argv[4] || '').split(',').filter(Boolean);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const logs = [];
  async function open(q, opts = {}) {
    const page = await browser.newPage({ viewport: opts.vp || { width: 1440, height: 900 }, deviceScaleFactor: opts.dpr || 1,
      reducedMotion: opts.rm ? 'reduce' : 'no-preference', hasTouch: !!opts.touch, isMobile: !!opts.touch });
    page.on('console', m => { if (/error|warn/.test(m.type())) logs.push(`${q}: [${m.type()}] ${m.text()}`); });
    page.on('pageerror', e => logs.push(`${q}: [pageerror] ${e.message}`));
    await page.goto(`${base}index.html?${q}`);
    await page.waitForFunction(() => window.__frames);
    await page.evaluate(() => window.__frames.ready);
    return page;
  }
  const step = (page, s) => page.evaluate(n => { for (let i = 0; i < n; i++) window.__frames.step(1000 / 60); }, Math.round(s * 60));
  const shot = (page, name) => page.screenshot({ path: path.join(out, name + '.png') });
  const ev = (page, fn, arg) => page.evaluate(fn, arg);
  const want = t => !only.length || only.includes(t);

  for (const [tag, q, rm] of [['full', '__state=frames', false], ['gl-off', '__state=frames,gl-off', false], ['post-off', '__state=frames,post-off', false], ['reduced', '__state=frames,reduced', true]]) {
    if (!want(tag)) continue;
    const page = await open(q, { rm });
    const gl = await ev(page, () => document.documentElement.dataset.gl || 'off');
    await step(page, 0.5); await shot(page, `${tag}-cover`);
    const levels = tag === 'full' ? [...Array(10).keys()] : [0, 1, 2, 5];
    for (const i of levels) {
      await ev(page, i => window.CD.load(i), i);
      if (tag === 'full') { await step(page, 0.3); await shot(page, `${tag}-fig${i + 1}-cut`); await step(page, 1.3); }
      else await step(page, 1.6);
      await shot(page, `${tag}-fig${i + 1}-rest`);
      // mid-lens: hold the lens key for 70 ms, between two stops
      const key = await ev(page, () => window.CD.k < 4 ? 'KeyQ' : 'KeyE');
      await ev(page, k => window.CD.press(k), key); await step(page, 0.07);
      await shot(page, `${tag}-fig${i + 1}-midlens`);
      await ev(page, k => window.CD.release(k), key); await step(page, 0.4);
    }
    console.log(tag, 'gl =', gl);
    await page.close();
  }

  if (want('moments')) {
    const page = await open('__state=frames');
    // cover staged pair: carried, then the hop with the dimension line
    await step(page, 0.4); await ev(page, () => { window.CD.cover; }); 
    await page.keyboard.press('KeyE'); await step(page, 0.35); await shot(page, 'cover-carried');
    await step(page, 0.6);
    // alignment on FIG. 1: lens to 2, the door lifts as 18 strikes
    await ev(page, () => window.CD.load(0)); await step(page, 1.4);
    await ev(page, () => window.CD.press('KeyQ')); await step(page, 0.34); await ev(page, () => window.CD.release('KeyQ'));
    await step(page, 0.45); await shot(page, 'align-fig1-strike');
    await step(page, 0.5); await shot(page, 'align-fig1-lifted');
    // walk into the door: ALLOWED, then the pull-off
    await ev(page, () => window.CD.press('KeyD'));
    for (let n = 0; n < 400 && await ev(page, () => window.CD.state) === 'play'; n++) await step(page, 1 / 60);
    await ev(page, () => window.CD.release('KeyD'));
    await step(page, 0.3); await shot(page, 'win-allowed');
    await step(page, 0.4); await shot(page, 'win-pull-lift');
    await step(page, 0.25); await shot(page, 'win-pull-off');
    await step(page, 0.2); await shot(page, 'cut-fig2-slam');
    // death on FIG. 2: walk into the spikes
    await step(page, 1.2);
    await ev(page, () => { window.CD.press('KeyD'); });
    for (let n = 0; n < 600 && await ev(page, () => window.CD.state) === 'play'; n++) await step(page, 1 / 60);
    await ev(page, () => window.CD.release('KeyD'));
    await step(page, 0.2); await shot(page, 'death-circle');
    await step(page, 0.15); await shot(page, 'death-anticipated');
    await step(page, 0.5); await shot(page, 'death-after-respawn');
    // swimming on FIG. 3 (TIDE): lens 2, walk into the water column
    await ev(page, () => window.CD.load(2)); await step(page, 1.4);
    await ev(page, () => window.CD.press('KeyQ')); await step(page, 0.34); await ev(page, () => window.CD.release('KeyQ')); await step(page, 0.3);
    await ev(page, () => window.CD.press('KeyD'));
    for (let n = 0; n < 300 && !(await ev(page, () => window.CD.p.wet)); n++) await step(page, 1 / 60);
    await ev(page, () => { window.CD.release('KeyD'); window.CD.press('Space'); });
    await step(page, 0.5); await shot(page, 'swim-fig3');
    await ev(page, () => window.CD.release('Space'));
    // Brief Description page from FIG. 3, with a cleared FIG. 1 (claim) and FIG. 2
    await ev(page, () => window.CD.brief()); await step(page, 0.12); await shot(page, 'brief-cut');
    await step(page, 0.8); await shot(page, 'brief');
    await page.keyboard.press('Escape'); await step(page, 0.3); await shot(page, 'brief-return');
    // the grant, with a filing written from varied play
    await ev(page, () => {
      window.CD.setFiling([
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
      ]);
      window.CD.end();
    });
    await step(page, 0.1); await shot(page, 'grant-cut');
    await step(page, 2.2); await shot(page, 'grant');
    await ev(page, () => window.CD.brief()); await step(page, 1.0); await shot(page, 'brief-all-cleared');
    await page.close();
  }
  if (want('aligned')) {
    // every sheet with its door aligned (lens set directly, QA only): the door lifted, the leader, 18
    const page = await open('__state=frames');
    for (let i = 0; i < 10; i++) {
      await ev(page, i => window.CD.load(i), i); await step(page, 1.4);
      await ev(page, () => window.CD.lens(LEVELS[CD.li].kd)); await step(page, 1.0);
      await shot(page, `aligned-fig${i + 1}`);
    }
    await page.close();
  }
  if (want('coarse')) {
    const page = await open('__state=frames', { vp: { width: 844, height: 390 }, dpr: 2, touch: true });
    await step(page, 3.5); await shot(page, 'coarse-cover-phone');
    await page.close();
  }
  console.log('console errors/warnings:', logs.length ? '\n' + logs.join('\n') : 'none');
  await browser.close();
})();
