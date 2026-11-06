// Chromatic Drift automated playtest — open index.html?test
// Plays every level through the game's real keyboard/wheel handlers (synthetic
// events, lens turned by holding Q/E and letting it snap, like a player would),
// stepping the fixed-timestep sim deterministically. Levels with a timing-sensitive
// move are also swept over human-ish sloppiness: jumping early, turning the lens late.
// Results: on-screen, in the console, and in window.PLAYTEST.
(() => {
  const HZ = 120, T = 32;
  const cv = document.getElementById('c');
  const key = (type, code) => window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, cancelable: true }));
  const down = c => key('keydown', c), up = c => key('keyup', c);
  const wait = ms => { for (let n = Math.round(ms * HZ / 1000); n > 0 && CD.state === 'play'; n--) CD.step(1); };
  function until(cond, ms = 8000) {
    for (let n = 0, max = ms * HZ / 1000; n < max && CD.state === 'play'; n++) { if (cond()) return true; CD.step(1); }
    return cond();
  }
  const P = () => CD.p;
  // Red tile column `col` (as authored at k = 0) in world px, horizontal levels.
  const red = col => (col - CD.k) * T;

  let useWheel = false;
  // Turn the lens n whole steps. `gap`: ms between wheel notches; `each`: runs every
  // sim step while the lens turns, for things a player does at the same time.
  function lens(n, { gap = 90, each = () => {} } = {}) {
    if (!n) return;
    const tick = ms => { for (let s = Math.round(ms * HZ / 1000); s > 0 && CD.state === 'play'; s--) { CD.step(1); each(); } };
    if (useWheel) {
      const s = Math.sign(n) * (CD.axis === 'y' ? -1 : 1);
      for (let i = 0; i < Math.abs(n); i++) { cv.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 * s, cancelable: true })); tick(gap); }
    } else {
      const c = n > 0 ? 'KeyQ' : 'KeyE';
      down(c); tick(Math.abs(n) / 6 * 1000); up(c);
    }
    tick(150);                          // let it settle on the detent
  }
  function walkTo(x) {
    const c = P().x < x ? 'KeyD' : 'KeyA';
    down(c); until(() => (c === 'KeyD' ? P().x >= x : P().x <= x)); up(c); wait(120);
  }
  // Run right off a ledge whose edge is at edgeX, jump, turn the lens n mid-air, land.
  function leap(edgeX, n, o) {
    down('KeyD'); until(() => P().x + P().w / 2 >= edgeX - o.early);
    down('Space'); wait(o.delay); lens(n);
    until(() => P().grounded, 3000); up('Space'); up('KeyD'); wait(150);
  }
  // Vertical levels: stand against a wall at wallX, jump, sink the world n under you.
  function climb(wallX, n, o) {
    walkTo(wallX - 22); down('KeyD');
    down('Space'); wait(o.delay); lens(n);
    until(() => P().grounded && P().x > wallX, 3000); up('Space'); up('KeyD'); wait(150);
  }
  function hopInPlaceWithLens(n) { down('Space'); wait(30); lens(n); until(() => P().grounded, 3000); up('Space'); wait(150); }
  function swimOnto(maxY) {             // hold swim, then drift right onto a ledge above maxY
    down('Space'); wait(2500); down('KeyD');
    until(() => P().grounded && P().y < maxY, 4000); up('KeyD'); up('Space'); wait(150);
  }
  function walkRightHopping(hopXs) {
    down('KeyD'); const hops = [...hopXs];
    until(() => {
      if (hops.length && P().x + P().w >= hops[0]) { hops.shift(); down('Space'); wait(350); up('Space'); }
      return false;
    }, 8000);
    up('KeyD');
  }

  // One known solution per level, by name. o.early: px before the edge the player
  // jumps; o.delay: ms between pressing jump and starting to turn the lens.
  // Levels with `sweep` are replayed over a grid of sloppy timings.
  const SOLUTIONS = {
    LENS: { run() { lens(2); walkTo(18 * T + 6); } },
    LEAP: { sweep: true, run(o) {
      leap(red(7), 4, o);                 // gap too wide to jump: slide the far ledge under you
      walkTo(395); hopInPlaceWithLens(-3); // back to k=1 mid-air so you aren't carried into spikes
      walkRightHopping([440]);
    } },
    TIDE: { run() {
      lens(2); walkTo((6 + 2) * T + 20);  // water meets the ledge at k=2
      swimOnto(200); lens(-3); walkTo(15 * T + 6);
    } },
    RELAY: { sweep: true, run(o) {
      leap(red(4), 3, o);                // k 1 -> 4
      lens(-5);                          // out of lens: wind it back while standing
      leap(red(15), 3, o);               // k -1 -> 2
      walkTo(21 * T + 6);
    } },
    FERRY: { run() {
      walkTo(6 * T + 6);                 // into the middle of the water pocket
      down('Space'); wait(800);          // float up to the surface
      down('KeyD');                      // swim along while the pocket moves right
      lens(6, { gap: 180 });
      until(() => P().grounded && P().y < 220, 3000); up('KeyD'); up('Space'); wait(150);
      walkTo(20 * T + 6);
    } },
    LIFT: { sweep: true, run(o) {
      climb(12 * T, -2, o);              // sink the tower under you mid-jump
      walkTo(20 * T + 6); lens(5);       // rise to the door, clear of the teeth
    } },
    CATCH: { sweep: true, run(o) {
      down('KeyD'); until(() => !P().grounded, 3000);  // step off into the drop
      wait(o.delay);
      lens(4, { each: () => { if (P().grounded) up('KeyD'); } }); // floor comes up to meet you
      up('KeyD'); wait(150);
      lens(-1); walkTo(13 * T + 6);
    } },
    FLOOD: { run() {
      walkTo(11 * T); lens(-2);          // ride the pool floor down, water comes up
      swimOnto(260); walkTo(20 * T + 6); lens(4);
    } },
    STAIRS: { sweep: true, run(o) {
      climb(6 * T, -1, o);               // k 3 -> 2
      climb(10 * T, -1, o);              // k 2 -> 1
      lens(-2);                          // sink for headroom under the teeth
      climb(14 * T, -1, o);              // k -1 -> -2, the exit
      walkTo(16 * T + 6);
    } },
    PRISM: { sweep: true, run(o) {
      lens(2); walkTo((4 + 2) * T + 8);
      swimOnto(200);
      leap(red(17), 2, o);
      lens(-2);                          // carried right onto the door
      if (CD.state === 'play') walkTo(20 * T + 6);
    } },
  };

  function attempt(i, o = { early: 0, delay: 0 }, wheel = false) {
    CD.pause(); CD.load(i); useWheel = wheel;
    const d0 = CD.deaths;
    try { SOLUTIONS[CD.names[i]].run(o); } catch (e) { console.error(e); }
    until(() => CD.state !== 'play', 2000);
    for (const c of ['KeyA', 'KeyD', 'KeyQ', 'KeyE', 'Space']) up(c);
    return { ok: CD.state === 'win' || CD.state === 'end', died: CD.deaths > d0, state: CD.state };
  }

  const rows = CD.names.map((name, i) => {
    const s = SOLUTIONS[name];
    if (!s) return { level: `${i + 1} ${name}`, keys: 'FAIL (no solution in playtest.js)', wheel: '-' };
    const keysRun = attempt(i), wheelRun = attempt(i, undefined, true);
    const row = { level: `${i + 1} ${name}`, keys: keysRun.ok ? 'pass' : `FAIL (${keysRun.state})`, wheel: wheelRun.ok ? 'pass' : `FAIL (${wheelRun.state})` };
    if (s.sweep) {
      const fails = [];
      let pass = 0, total = 0;
      for (const early of [0, 12, 24, 36]) for (const delay of [0, 100, 200]) {
        total++;
        if (attempt(i, { early, delay }).ok) pass++; else fails.push(`${early}px/${delay}ms`);
      }
      row.sloppy = `${pass}/${total}`;
      row.failsAt = fails.join(' ') || '-';
    }
    return row;
  });

  window.PLAYTEST = rows;
  console.table(rows);
  CD.pause(false); CD.load(0);
  const allOk = rows.every(r => r.keys === 'pass' && r.wheel === 'pass');
  document.getElementById('hint').innerHTML = `<b>Playtest ${allOk ? 'passed' : 'FAILED'}</b><br>` +
    rows.map(r => `${r.level}: keys ${r.keys}, wheel ${r.wheel}${r.sloppy ? `, sloppy inputs ${r.sloppy}` : ''}`).join('<br>');

  // ---- The continuation (endless.js): sheets FIG. 11-40 for three fixed serial numbers, generated through the
  // game's own path (the hidden ?validate frame), then replayed here with this file's verbs, keys and wheel, and
  // re-measured with the same sloppy sweep. Asserts: every sheet solvable; the measured tolerance never below the
  // floor (0.35); its rolling mean (5 sheets) never rising by more than 0.1, and the last five below the first five.
  // The rows above are unchanged; the result is window.ENDLESS_TEST and one line under them.
  if (!window.CDX) return;
  const hint = document.getElementById('hint'), head = hint.innerHTML;
  const SEEDS = [8812, 1951, 4417], N0 = 11, N1 = 40, FLOOR = 0.35, TOL = 0.1, WIN = 5;
  hint.innerHTML = head + '<br>Endless: generating FIG. 11–40 for three serial numbers…';
  // the continuation's verbs, built from the ones above with the same timings as endless.js's generators
  function hopLens(n, o) { down('Space'); wait(30 + o.delay); lens(n); until(() => P().grounded, 3000); up('Space'); wait(150); }
  function walkToHopping(x, hopXs) {
    down('KeyD'); const hops = [...hopXs];
    for (let n = 0, max = 8000 * HZ / 1000; n < max && CD.state === 'play'; n++) {
      if (hops.length && P().x + P().w >= hops[0]) { hops.shift(); down('Space'); wait(350); up('Space'); }
      if (P().x >= x && P().grounded) break;
      CD.step(1);
    }
    up('KeyD'); wait(120);
  }
  function catchFall(n, o) {
    down('KeyD'); until(() => !P().grounded, 3000);
    wait(o.delay);
    lens(n, { each: () => { if (P().grounded) up('KeyD'); } });
    up('KeyD'); wait(150);
  }
  const pos = a => typeof a === 'number' ? a : a.red !== undefined ? (a.red - CD.k) * T + (a.off || 0) : (a.blue + CD.k) * T + (a.off || 0);
  function runScript(script, o) {
    for (const [v, a, b] of script) {
      if (CD.state !== 'play') break;
      if (v === 'lens') lens(a);
      else if (v === 'walkTo') walkTo(pos(a));
      else if (v === 'leap') leap(pos(a), b, o);
      else if (v === 'climb') climb(a, b, o);
      else if (v === 'hopLens') hopLens(a, o);
      else if (v === 'swimOnto') swimOnto(a);
      else if (v === 'walkToHopping') walkToHopping(pos(a), b);
      else if (v === 'catchFall') catchFall(a, o);
    }
  }
  function attemptDef(i, def, o = { early: 0, delay: 0 }, wheel = false) {
    CD.pause(); CD.loadDef(i, def); useWheel = wheel;
    const d0 = CD.deaths;
    try { runScript(def.cip.script, o); } catch (e) { console.error(e); }
    until(() => CD.state !== 'play', 2000);
    for (const c of ['KeyA', 'KeyD', 'KeyQ', 'KeyE', 'Space']) up(c);
    return CD.state === 'win' && CD.deaths === d0;
  }
  function measure(i, def) {
    const keysOk = attemptDef(i, def), wheelOk = attemptDef(i, def, undefined, true);
    let pass = 0;
    for (const early of CDX.EARLY) for (const delay of CDX.DELAY) if (early || delay ? attemptDef(i, def, { early, delay }) : keysOk) pass++;
    return { keysOk, wheelOk, pass };
  }
  const host = CDX.host();
  let pumping = true;
  const pump = () => { host.tick(40); if (pumping) requestAnimationFrame(pump); };
  requestAnimationFrame(pump);
  (async () => {
    const t0 = performance.now(), seeds = {};
    let solvable = 0, total = 0, same = 0, det = 0, falls = 0, ok = true;
    const why = [];
    for (const seed of SEEDS) {
      const list = seeds[seed] = [];
      for (let n = N0; n <= N1; n++) {
        const res = await host.request(seed, n), def = CDX.makeDef(res.data, rect), m = measure(n - 1, def);
        total++;
        if (m.keysOk && m.wheelOk) solvable++; else { ok = false; why.push(`${seed}/FIG. ${n} not solved`); }
        if (m.pass === res.pass) same++;
        if (res.fallback) falls++;
        // sheet n of serial number S is a function of (S, n): composing the accepted try again gives the same sheet
        if (!res.fallback && JSON.stringify(CDX.compose(seed, n, res.composed - 1)) === JSON.stringify(res.data)) det++;
        list.push({ n, name: res.data.name, axis: res.data.axis, kmax: res.data.kmax, beats: res.data.beats.length, pass: m.pass, ratio: +(m.pass / CDX.RUNS).toFixed(3),
          validatorPass: res.pass, band: res.band, attempts: res.attempts, ms: res.ms, fallback: res.fallback, keys: m.keysOk, wheel: m.wheelOk });
      }
      const r = list.map(x => x.ratio), roll = r.map((_, j) => j < WIN - 1 ? null : r.slice(j - WIN + 1, j + 1).reduce((a, b) => a + b, 0) / WIN).filter(v => v !== null);
      if (Math.min(...r) < FLOOR) { ok = false; why.push(`${seed}: below the floor`); }
      for (let j = 1; j < roll.length; j++) if (roll[j] > roll[j - 1] + TOL) { ok = false; why.push(`${seed}: rolling mean rises at FIG. ${N0 + j + WIN - 1}`); }
      if (!(roll[roll.length - 1] < roll[0])) { ok = false; why.push(`${seed}: no downward trend`); }
    }
    // the known-good fallback at every lens travel
    const fb = [N0, 20, N1].map(n => attemptDef(n - 1, CDX.makeDef(CDX.fallback(n), rect)));
    if (!fb.every(Boolean)) { ok = false; why.push('fallback sheet fails'); }
    if (same !== total) { ok = false; why.push(`validator and replay disagree on ${total - same}`); }
    if (det !== total - falls) { ok = false; why.push('not deterministic'); }
    pumping = false;
    const all = Object.values(seeds).flat(), ms = all.map(x => x.ms).filter(Boolean).sort((a, b) => a - b), att = all.map(x => x.attempts);
    const curve = Object.fromEntries(SEEDS.map(s => [s, seeds[s].map(x => x.pass).join('')]));
    const summary = { solvable: `${solvable}/${total}`, sameAsValidator: `${same}/${total}`, deterministic: `${det}/${total - falls}`, fallbacks: falls, fallbackSheets: fb.every(Boolean),
      firstFive: +(all.filter(x => x.n < N0 + 5).reduce((a, x) => a + x.ratio, 0) / (5 * SEEDS.length)).toFixed(3),
      lastFive: +(all.filter(x => x.n > N1 - 5).reduce((a, x) => a + x.ratio, 0) / (5 * SEEDS.length)).toFixed(3),
      minRatio: Math.min(...all.map(x => x.ratio)), msPerSheet: { median: ms[ms.length >> 1], max: ms[ms.length - 1] },
      attempts: { mean: +(att.reduce((a, b) => a + b, 0) / att.length).toFixed(2), max: Math.max(...att) }, wallSeconds: +((performance.now() - t0) / 1000).toFixed(1), curve };
    window.ENDLESS_TEST = { done: true, ok, why, summary, seeds };
    console.log('ENDLESS_TEST', ok ? 'passed' : 'FAILED', summary, why);
    CD.pause(false); CD.load(0);
    hint.innerHTML = head + `<br><b>Endless ${ok ? 'passed' : 'FAILED'}</b>: FIG. 11–40 × 3 serials, ${solvable}/${total} solvable (keys + wheel), ` +
      `tolerance ${summary.firstFive} → ${summary.lastFive} (floor ${FLOOR}, min ${summary.minRatio.toFixed(2)}), ${summary.attempts.mean} tries/sheet, ${summary.msPerSheet.median} ms/sheet${why.length ? ' · ' + why.join('; ') : ''}`;
  })();
})();
