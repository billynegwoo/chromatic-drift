// Steps index.html in virtual time and saves a screenshot every `every` seconds.
// BASE=url node qa/demo.cjs [query] [outDir] [every s] [total s] [extra shots s,s,...]
const path = require('path');
const { chromium } = require('/Users/kevin/.claude/skills/award-site/scripts/node_modules/playwright');
(async () => {
  const query = process.argv[2] || '__state=frames&demo';
  const out = path.resolve(process.argv[3] || path.join(__dirname, 'shots'));
  const every = +(process.argv[4] || 1), total = +(process.argv[5] || 15);
  const extra = (process.argv[6] || '').split(',').filter(Boolean).map(Number);
  require('fs').mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const logs = [];
  page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  await page.goto(`${process.env.BASE || 'http://127.0.0.1:5191/'}index.html?${query}`);
  await page.waitForFunction(() => window.__frames);
  await page.evaluate(() => window.__frames.ready);
  const info = await page.evaluate(() => {
    const gl = document.getElementById('gl').getContext('webgl2'), ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    return { gl: document.documentElement.dataset.gl || 'off', renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null };
  });
  const shots = new Set();
  for (let t = 0; t <= total + 1e-9; t += every) shots.add(+t.toFixed(3));
  extra.forEach(t => shots.add(t));
  const times = [...shots].sort((a, b) => a - b);
  const stepMs = 1000 / 60;
  let now = 0, saved = [];
  for (const t of times) {
    const n = Math.round((t * 1000 - now) / stepMs);
    if (n > 0) await page.evaluate(([n, ms]) => { for (let i = 0; i < n; i++) window.__frames.step(ms); }, [n, stepMs]);
    now += Math.max(0, n) * stepMs;
    const f = path.join(out, `t${t.toFixed(2).padStart(5, '0')}.png`);
    await page.screenshot({ path: f });
    saved.push(f);
  }
  const perf = await page.evaluate(() => window.__post && window.__post.measure(120));
  const demoLog = await page.evaluate(() => window.CD && window.CD.demoLog);
  console.log(JSON.stringify({ info, perf, saved: saved.length, out }, null, 1));
  console.log('demo log:\n' + (demoLog || []).map(([t, m]) => `  ${t.toFixed(2)}s ${m}`).join('\n'));
  const errs = logs.filter(l => /error|warn/i.test(l.slice(0, 12)));
  console.log('console errors/warnings:', errs.length ? '\n' + errs.join('\n') : 'none');
  await browser.close();
})();
