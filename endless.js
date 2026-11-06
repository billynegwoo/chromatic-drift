// Chromatic Drift, continuation-in-part: FIG. 11, 12, ... generated forever, each one solvable and, on average,
// harder than the last.
//   1. Beats: parametric templates generalising what the ten sheets teach (LEAP, RELAY, SNARE, TIDE on a horizontal
//      lens; LIFT, STAIRS, CATCH, FLOOD on a vertical one). Each declares its parameters, its footprint, the lens it
//      needs, how it hands over to the next beat (where the runner stands, on what, at which lens stop) and its own
//      solution in the playtest's verbs. A sheet is 1-3 beats on one axis plus door 18 at a stop the route reaches,
//      written in the game's own LEVELS format (axis, k0, kd, kmax, door, spawn, build).
//   2. Seeded: sheet n of serial number S is a pure function of (S, n): mulberry32 over a 32-bit mix of (S, n, try).
//   3. Validated with the real simulation, headless, in a hidden iframe (index.html?validate), never in the visible
//      game: the candidate must be safe to stand in, not walkable without the lens, and solved by its bot with keys
//      and with the wheel. Otherwise the next try; after CAP tries, a known-good easier sheet.
//   4. Measured: a reduced sloppy sweep (jump 0/12/24 px early x lens 0/100/200 ms late) gives a pass count out of 9.
//      A candidate is accepted only inside its depth's band, which narrows from ~0.9 at FIG. 11 to a floor of 4/9
//      (never below 0.35) by FIG. 40; the lens's travel narrows from +-4 to +-3 to +-2.
// The work is time-sliced: the validator only runs when the host grants it a few ms of a frame.
(function (root) {
'use strict';
const T = 32, HZ = 120, VERSION = 1;
const EARLY = [0, 12, 24], DELAY = [0, 100, 200], RUNS = EARLY.length * DELAY.length;
const CAP = 24, COMPOSE_CAP = 400;                 // validated tries (and compositions) per sheet before the known-good fallback

// ---- 1. PRNG ----------------------------------------------------------------------------------------------------
function mulberry32(a) {
  return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function mix(...xs) {
  let h = 0x9E3779B9 ^ VERSION;
  for (const x of xs) { h = Math.imul(h ^ (x >>> 0), 0x85EBCA6B); h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35); h ^= h >>> 16; }
  return h >>> 0;
}
function rng(...xs) {
  const f = mulberry32(mix(...xs));
  const r = {
    f, int: (lo, hi) => lo + Math.floor(f() * (hi - lo + 1)),
    chance: p => f() < p,
    pick: a => a[Math.floor(f() * a.length)],
    // weighted pick: [[item, weight], ...]
    wpick: ws => { const t = ws.reduce((s, w) => s + w[1], 0); let u = f() * t; for (const [v, w] of ws) { if ((u -= w) < 0) return v; } return ws[ws.length - 1][0]; },
    // an integer in [lo, hi], centred on the heat h (0 easy .. 1 hard)
    heat: (lo, hi, h) => { if (hi <= lo) return lo; const u = Math.min(1, Math.max(0, h + (f() - 0.5) * 0.9)); return lo + Math.round(u * (hi - lo)); },
  };
  return r;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const randomSerial = () => { let v = 0; try { const a = new Uint32Array(1); crypto.getRandomValues(a); v = a[0]; } catch (e) { v = Math.floor(Math.random() * 4294967296); } return 1000 + v % 9000; };

// ---- difficulty schedule ----------------------------------------------------------------------------------------
// target pass ratio: 0.9 at FIG. 11, falling linearly to 0.35 at FIG. 40 and held there. The band is +-0.13 in
// whole runs out of 9, never below 4/9 (the first count >= 0.35) and at least two counts wide.
function schedule(d) {
  const target = Math.max(0.35, 0.9 - (d - 11) * (0.55 / 29));
  const lo = Math.max(4, Math.ceil(RUNS * (target - 0.13) - 1e-9));
  const hi = Math.min(RUNS, Math.max(lo + 1, Math.floor(RUNS * (target + 0.13) + 1e-9)));
  const kmax = d < 16 ? 4 : d < 26 ? 3 : 2;
  return { d, target, lo, hi, kmax, heat: clamp((d - 11) / 29, 0, 1) };
}
function beatCount(r, d) {
  if (d <= 12) return 1;
  if (d <= 16) return r.chance((d - 12) / 5) ? 2 : 1;
  if (d <= 19) return r.chance((d - 16) / 4) ? 3 : 2;
  return 3;
}

// ---- 2. beats ---------------------------------------------------------------------------------------------------
// Coordinates. Tiles are authored at k = 0 (the game's rect()). On a horizontal sheet red shows at screen column
// c - k, blue at c + k, green never moves; on a vertical one the same holds for rows. The composer keeps the route
// in "tape" coordinates (red's own, authored) and converts when it places things on screen at a given stop.
// A platform is red: { x0, x1 (null until the next beat closes it), x1min, y | a, kind: 'pillar' | 'slab' }.
//   x sheets: y is the floor row (it never moves); x0..x1 are tape columns.
//   y sheets: a is the authored top row (screen row a - k); x0..x1 are screen columns.
// The runner's state between beats: k, the platform it stands on, its p.x estimate (px), its floor row on screen (y).
//
// Tolerance masks. Every beat variant carries the set of sloppy runs it fails, measured once on an isolated copy of the
// beat with the real sim (9 bits: early 0/12/24 px x lens delay 0/100/200 ms). A sheet fails a run if any of its beats
// does, so its predicted mask is the union; the composer aims that union at the depth's band, and the validator then
// measures the real thing (the prediction only saves tries).
const SPIKE_UP = 1, SPIKE_DOWN = 2, BLOCK = 3;
const bit = (e, d) => 1 << (EARLY.indexOf(e) * 3 + DELAY.indexOf(d));
const M = (...pairs) => pairs.reduce((m, [e, d]) => m | bit(e, d), 0);
const D200 = M([0, 200], [12, 200], [24, 200]), D100 = D200 | M([0, 100], [12, 100], [24, 100]);
const E24 = M([24, 0], [24, 100], [24, 200]), E12 = E24 | M([12, 0], [12, 100], [12, 200]);
const pop = m => { let c = 0; for (; m; m &= m - 1) c++; return c; };
// LEAP [s, n, dy, mask]: s = the gap left on screen once the lens has turned n (tape gap s + n >= 5); dy: landing higher.
const LEAP_V = [
  [2, 3, -2, 0], [2, 3, -1, 0], [2, 3, 0, 0], [2, 3, 1, 0], [2, 3, 2, M([24, 200])],
  [2, 4, -1, 0], [2, 4, 0, 0], [2, 4, 1, M([24, 200])], [2, 4, 2, M([0, 200], [12, 100], [12, 200], [24, 100], [24, 200])],
  [3, 2, -1, 0], [3, 2, 0, 0], [3, 2, 1, M([24, 0])], [3, 2, 2, M([12, 0], [24, 0], [24, 100], [24, 200])],
  [3, 3, -1, 0], [3, 3, 0, 0], [3, 3, 1, M([24, 0], [24, 200])],
  [3, 4, -1, M([24, 200])], [3, 4, 0, M([12, 200], [24, 100], [24, 200])], [3, 4, 1, M([0, 200], [12, 100], [12, 200]) | E24],
  [4, 1, -2, E24], [4, 2, -2, E24], [4, 3, -2, E24], [4, 1, -1, E12], [4, 2, -1, E12], [4, 4, -2, E24 | M([12, 200])],
];
// LIFT [h, n, gap, mask]: a wall h rows high, n stops sunk mid-jump, a gap of 0-3 tiles in front of it.
const LIFT_V = [
  [4, 2, 0, 0], [4, 2, 1, 0], [4, 2, 2, 0], [4, 2, 3, E24], [4, 3, 0, 0], [4, 3, 1, 0], [4, 3, 2, 0], [4, 3, 3, M([24, 200])],
  [4, 4, 1, 0], [4, 4, 3, M([24, 200])],
  [5, 2, 0, D200], [5, 2, 1, D200], [5, 2, 2, D200], [5, 3, 0, D200], [5, 3, 1, D200], [5, 3, 2, D200],
  [5, 3, 3, M([0, 200], [12, 100], [12, 200]) | E24], [5, 4, 1, D200], [5, 4, 3, M([0, 200], [12, 100], [12, 200]) | E24],
];
// CATCH [n, yl, yLo, yHi, mask]: raise n stops to catch 10 at row yl, from a ledge at rows yLo..yHi.
const CATCH_V = [
  [3, 12, 4, 8, 0], [3, 13, 4, 6, 0], [3, 13, 7, 8, D200],
  [4, 11, 4, 8, 0], [4, 12, 4, 6, 0], [4, 12, 7, 8, D200], [4, 13, 4, 4, D200], [4, 13, 5, 7, D100],
];
const NAMES = { LEAP: 'LEAP', RELAY: 'RELAY', SNARE: 'SNARE', TIDE: 'TIDE', LIFT: 'LIFT', STAIRS: 'STAIRS', CATCH: 'CATCH', FLOOD: 'FLOOD' };
const HINTS = {
  LEAP: 'Too far to jump: turn the lens in mid-air and slide the far ledge under you.',
  RELAY: 'The lens only turns so far: wind it back while you stand, then leap.',
  SNARE: 'Standing, the lens would carry you into the spikes: turn it in the air.',
  TIDE: 'Line the water up with the ledge, then swim.',
  LIFT: 'Too high to jump: jump, then sink the world under you.',
  STAIRS: 'The teeth are close: sink while you stand to make headroom, then climb.',
  CATCH: 'Step off into the dark, then bring the floor up to catch you.',
  FLOOD: 'Sink the red while you stand in the pool: the water comes up.',
};

function newSheet(axis, sch) { return { axis, kmax: sch.kmax, k: 0, k0: 0, px: 0, y: 0, plat: null, plats: [], G: [], B: [], script: [], beats: [], mask: 0 }; }
function plat(st, p) { st.plats.push(p); st.plat = p; return p; }

// ----- horizontal beats
// LEAP: a gap of s + n tape tiles, s on screen once the lens has moved n: too wide to jump, it needs n stops in the air.
function leapGeom(st, r, [s, n, dy], m = 0) {
  const km = st.kmax, cur = st.plat;
  const k = st.k - m, px = st.px + m * T;          // after RELAY's wind-back: carried right m
  if (k + n > km || k < -km) return null;
  const minEdge = Math.ceil((px + 20) / T) + 1;
  const edgeS = Math.max(minEdge, cur.x1min - k + 1) + (r.chance(0.5) ? 1 : 0);
  if (edgeS + s + 3 > 22 || edgeS < 3) return null;
  const E = edgeS + k, y2 = cur.y - dy, x0 = E + s + n;
  if (x0 + 3 > 27 || y2 < 4 || y2 > 12) return null;
  return { s, n, dy, m, E, edgeS, x0, y2, k2: k + n, pit: r.chance(0.5) };
}
function commitLeap(st, g, type, mask) {
  st.plat.x1 = g.E - 1;
  if (g.pit) st.G.push([g.edgeS + 1, 13, g.edgeS + g.s + g.n - 1, 13, SPIKE_UP]);    // spikes 14 along the pit's floor
  plat(st, { x0: g.x0, x1: null, x1min: g.x0 + 3, y: g.y2, kind: 'pillar' });
  if (g.m) st.script.push(['lens', -g.m]);
  st.script.push(['leap', { red: g.E }, g.n]);
  st.k = g.k2; st.y = g.y2; st.px = g.edgeS * T + 96; st.mask |= mask;
  st.beats.push({ t: type, s: g.s, n: g.n, dy: g.dy, m: g.m });
}
const BEATS_X = {
  LEAP: {
    variants: st => LEAP_V.filter(v => st.k + v[1] <= st.kmax).map(v => ({ p: v, mask: v[3] })),
    fit(st, r, v) { const g = leapGeom(st, r, v); if (!g) return false; commitLeap(st, g, 'LEAP', v[3]); return true; },
  },
  // RELAY: the leap needs more lens than is left: wind it back m while standing (carried right), then leap.
  RELAY: {
    variants: st => LEAP_V.filter(v => st.k + v[1] > st.kmax && v[1] <= 2 * st.kmax).map(v => ({ p: v, mask: v[3] })),
    fit(st, r, v) {
      const km = st.kmax, n = v[1];
      const m = Math.min(st.k + km, st.k + n - km + (r.chance(0.35) ? 1 : 0));
      if (m < 1 || st.k - m + n > km || st.px + m * T + 20 > 20 * T) return false;
      const g = leapGeom(st, r, v, m); if (!g) return false;
      commitLeap(st, g, 'RELAY', v[3]); return true;
    },
  },
  // SNARE: the lens must come back m stops, but standing it would carry 10 into spikes 14: hop, turn it in the air,
  // then hop the spikes. (Four stops don't fit in one hop's air time unless the turn starts at once.)
  SNARE: {
    variants: st => [2, 3, 4].filter(m => st.k - m >= -st.kmax).map(m => ({ p: m, mask: m === 4 ? D100 : 0 })),
    fit(st, r, m) {
      const cur = st.plat, k = st.k, k2 = k - m;
      const left = (cur.x0 - k + m) * T;                        // the platform's left edge on screen after the turn
      const X = Math.max(st.px, left + 6) + r.int(0, 8);
      const c0 = Math.floor((X + 20) / T) + 1 + (m < 4 && r.chance(0.4) ? 1 : 0), sw = r.int(1, 2);
      if (c0 + sw + 3 > 22) return false;
      st.script.push(['walkTo', X], ['hopLens', -m], ['walkToHopping', (c0 + sw + 1) * T + 4, [c0 * T - 6]]);
      st.G.push([c0, cur.y - 1, c0 + sw - 1, cur.y - 1, SPIKE_UP]);
      cur.x1min = Math.max(cur.x1min, c0 + sw + 3 + k2);
      st.k = k2; st.px = (c0 + sw + 1) * T + 40; st.mask |= m === 4 ? D100 : 0;
      st.beats.push({ t: 'SNARE', m, sw });
      return true;
    },
  },
  // TIDE: water 16 lined up with a ledge too high to jump (red and blue drift opposite ways); swim up onto it.
  TIDE: {
    variants: st => { const o = []; for (let kw = -st.kmax; kw <= st.kmax; kw++) if (kw !== st.k && Math.abs(kw - st.k) <= 3) o.push({ p: kw, mask: 0 }); return o; },
    fit(st, r, kw) {
      const cur = st.plat, k = st.k;
      if (cur.kind === 'slab') return false;
      const px = st.px - (kw - k) * T;
      if (px < 8 || px > 18 * T) return false;
      const ww = r.int(2, 3), w0 = Math.ceil((px + 20) / T) + 1 + r.int(0, 1), lx = w0 + ww;
      const hL = r.int(4, 5), ly = cur.y - hL, j = r.int(0, 1);
      if (lx + 3 > 22 || ly < 3) return false;
      const bx0 = w0 - kw, bx1 = w0 + ww - 1 - kw, lx0 = lx + kw;
      if (bx0 < -4 || bx1 > 27 || lx0 + 3 > 27) return false;
      if (kw !== k) st.script.push(['lens', kw - k]);
      st.script.push(['walkTo', { blue: bx0 + ww / 2, off: -10 }], ['swimOnto', ly * T - 10]);
      st.B.push([bx0, ly - j, bx1, cur.y - 1]);
      cur.x1min = Math.max(cur.x1min, w0 + ww - 1 + kw);
      cur.x1 = Math.max(cur.x1min, lx0 - 1);
      plat(st, { x0: lx0, x1: null, x1min: lx0 + 3, y: ly, kind: 'slab' });
      st.k = kw; st.y = ly; st.px = lx * T + 8;
      st.beats.push({ t: 'TIDE', kw, hL, ww });
      return true;
    },
  },
};
// door 18 on the last platform (horizontal): lined up at kd = k + delta, reached standing (carried) or as it is.
function doorX(st, r) {
  const km = st.kmax, k = st.k, cur = st.plat, opts = [];
  for (let kd = Math.max(-km, k - 2); kd <= Math.min(km, k + 2); kd++) opts.push(kd);
  for (let t = 0; t < 6; t++) {
    const kd = r.chance(0.35) ? k : r.pick(opts), px = st.px - (kd - k) * T;
    if (px < 4 || px > 24 * T - 30) continue;
    const lo = Math.ceil((px + 20) / T) + 1;
    if (lo > 21) continue;
    const dx = r.int(lo, Math.min(21, lo + 3)), dy = cur.y - 2;
    if (dy < 1) continue;
    if (kd !== k) st.script.push(['lens', kd - k]);
    st.script.push(['walkTo', dx * T + 6]);
    cur.x1min = Math.max(cur.x1min, dx + kd);
    cur.x1 = Math.max(cur.x1min, Math.min(27, dx + kd + r.int(1, 4)));
    st.kd = kd; st.door = { x: dx, y: dy };
    return true;
  }
  return false;
}

// ----- vertical beats (rows: screen = a - k for red, a + k for blue)
function climbGeom(st, r, [hh, n, gap], k, y, px) {
  if (k - n < -st.kmax) return null;
  const wx = Math.max(Math.ceil((px + 20) / T) + 2 + gap, (st.plat.x1min ?? -9) + 1 + gap) + r.int(0, 1);
  const top = y - hh, y2 = top + n;
  if (top < 1 || y2 < 3 || wx > 19) return null;
  return { hh, n, wx, gap, top, y2, a: top + k, k2: k - n };
}
function commitClimb(st, g, type, mask, extra = {}) {
  st.plat.x1 = g.wx - 1 - g.gap;
  plat(st, { x0: g.wx, x1: null, x1min: g.wx + 2, a: g.a, kind: 'pillar' });
  // against the wall: the playtest's climb; across a gap: a leap at the wall
  st.script.push(g.gap ? ['leap', (g.wx - g.gap) * T, -g.n] : ['climb', g.wx * T, -g.n]);
  st.k = g.k2; st.y = g.y2; st.px = g.wx * T + 6; st.mask |= mask;
  st.beats.push({ t: type, h: g.hh, n: g.n, gap: g.gap, ...extra });
}
const BEATS_Y = {
  // LIFT: a wall 4-5 rows high (a jump is 3.34): jump at it and sink the world n stops under you.
  LIFT: {
    variants: st => LIFT_V.filter(v => st.k - v[1] >= -st.kmax).map(v => ({ p: v, mask: v[3] })),
    fit(st, r, v) { if (st.plat.kind === 'slab') return false; const g = climbGeom(st, r, v, st.k, st.y, st.px); if (!g) return false; commitClimb(st, g, 'LIFT', v[3]); return true; },
  },
  // STAIRS: teeth 14 hang so low that the climb's jump would meet them: sink 2 while standing for headroom first.
  STAIRS: {
    variants: st => LIFT_V.filter(v => st.k - 2 - v[1] >= -st.kmax).map(v => ({ p: v, mask: v[3] })),
    fit(st, r, v) {
      const m = 2, y = st.y, tr = y - 4;
      if (st.plat.kind === 'slab' || tr < 1 || y + m > 13) return false;
      const g = climbGeom(st, r, v, st.k - m, y + m, st.px);
      if (!g || g.y2 < tr + 2) return false;                  // standing on the step must be clear of the teeth
      st.script.push(['lens', -m]);
      const c0 = g.wx - 2 - g.gap, c1 = g.wx + 1;
      st.G.push([c0, 0, c1, tr - 1, BLOCK], [c0, tr, c1, tr, SPIKE_DOWN]);
      commitClimb(st, g, 'STAIRS', v[3], { m });
      return true;
    },
  },
  // CATCH: step off the ledge into the dark, then raise the floor n stops to meet you; raising it while standing
  // would lift 10 into the teeth one stop above its head.
  CATCH: {
    variants: st => CATCH_V.filter(v => st.k + v[0] <= st.kmax && st.y >= v[2] && st.y <= v[3]).map(v => ({ p: v, mask: v[4] })),
    fit(st, r, [n, yl, , , mask]) {
      const k = st.k, y = st.y, cur = st.plat;
      if (yl < y + 4 || yl + n < 15) return false;
      const ex = Math.max(Math.ceil((st.px + 20) / T) + 1, cur.x1min ?? 0);
      if (ex > 15) return false;
      const lx0 = ex + 1 + r.int(1, 2), tr = y - 3;
      cur.x1 = ex;
      st.G.push([Math.max(0, ex - 3), 0, ex, tr - 1, BLOCK], [Math.max(0, ex - 3), tr, ex, tr, SPIKE_DOWN]);
      plat(st, { x0: lx0, x1: null, x1min: lx0 + 4, a: yl + n + k, kind: 'pillar' });
      st.script.push(['catchFall', n]);
      st.k = k + n; st.y = yl; st.px = (lx0 + 1) * T; st.mask |= mask;
      st.beats.push({ t: 'CATCH', n, drop: yl - y });
      return true;
    },
  },
  // FLOOD: stand in the pool and sink the red n stops: 10 rides the floor down while the water comes up.
  FLOOD: {
    variants: st => [[2, 4, 0], [2, 4, 1], [2, 5, 1], [3, 4, 0], [3, 5, 0], [3, 5, 1]].filter(v => st.k - v[0] >= -st.kmax).map(v => ({ p: v, mask: 0 })),
    fit(st, r, [n, hc, j]) {
      const k = st.k, y = st.y, cur = st.plat;
      if (y + 1 + n > 13 || cur.kind === 'slab') return false;
      const fx0 = Math.max(Math.ceil((st.px + 20) / T) + 1, (cur.x1min ?? 0) + 1), fx1 = fx0 + r.int(2, 3);
      const yc = y - hc;
      if (yc < 1 || fx1 + 4 > 22) return false;
      cur.x1 = fx0 - 1;
      plat(st, { x0: fx0, x1: fx1, x1min: fx1, a: y + 1 + k, kind: 'pillar' });
      st.B.push([fx0, y - j - k, fx1, 17]);
      plat(st, { x0: fx1 + 1, x1: null, x1min: fx1 + 4, a: yc + k, kind: 'pillar' });
      st.script.push(['walkTo', ((fx0 + fx1 + 1) / 2) * T - 10], ['lens', -n], ['swimOnto', (yc + n) * T - 10]);
      st.k = k - n; st.y = yc + n; st.px = (fx1 + 1) * T + 16;
      st.beats.push({ t: 'FLOOD', n, hc });
      return true;
    },
  },
};
// door 18 on the last platform (vertical): rise (or sink) to it standing, under teeth if it rises far enough.
function doorY(st, r) {
  const km = st.kmax, k = st.k, cur = st.plat, y = st.y;
  for (let t = 0; t < 8; t++) {
    const kd = r.int(Math.max(-km, k - 1), km), yk = y - (kd - k), dy = yk - 2;
    if (dy < 1 || dy > 11) continue;
    const lo = Math.max(Math.ceil((st.px + 20) / T) + 1, cur.x0 + 1);
    if (lo > 21) continue;
    const dx = r.int(lo, Math.min(21, lo + 3));
    st.script.push(['walkTo', dx * T + 6]);
    if (kd !== k) st.script.push(['lens', kd - k]);
    cur.x1min = Math.max(cur.x1min ?? dx, dx);
    cur.x1 = Math.max(cur.x1min, Math.min(27, dx + r.int(1, 4)));
    // LIFT's teeth: rising before 10 stands under the door would put its head in them
    const c0 = Math.max(cur.x0 + 1, Math.floor(st.px / T) + 1), c1 = dx - 2, tr = yk - 1;
    if (kd - k >= 2 && tr >= 1 && c1 >= c0 && r.chance(0.7)) st.G.push([c0, 0, c1, tr - 1, BLOCK], [c0, tr, c1, tr, SPIKE_DOWN]);
    st.kd = kd; st.door = { x: dx, y: dy };
    return true;
  }
  return false;
}

function emit(st, n, sch) {
  const rects = [];
  for (const p of st.plats) {
    const x1 = p.x1 === null || p.x1 === undefined ? Math.max(p.x1min, p.x0 + 3) : p.x1;
    if (st.axis === 'x') rects.push(['R', p.x0, p.y, x1, p.kind === 'slab' ? p.y + 1 : 17, 1]);
    else rects.push(['R', p.x0, p.a, x1, p.kind === 'slab' ? p.a + 1 : 17, 1]);
  }
  for (const g of st.G) rects.push(['G', ...g]);
  for (const b of st.B) rects.push(['B', ...b, 1]);
  const types = st.beats.map(b => b.t);
  const par = st.script.reduce((s, c) => s + (c[0] === 'lens' || c[0] === 'hopLens' || c[0] === 'catchFall' ? Math.abs(c[1]) : c[0] === 'leap' || c[0] === 'climb' ? Math.abs(c[2]) : 0), 0);
  return {
    v: VERSION, n, name: types.map(t => NAMES[t]).join('–'), axis: st.axis, k0: st.k0, kd: st.kd, kmax: sch.kmax,
    door: st.door, spawn: st.spawn, rects, script: st.script, beats: st.beats, par, hint: types.map(t => HINTS[t]).join(' Then: '),
    predicted: RUNS - pop(st.mask),
  };
}

// One composition try: the axis, the beats and their variants, aimed at the band [lo, hi] (passes out of 9).
function compose(seed, n, a) {
  const sch = schedule(n), r = rng(seed, n, a), nb = beatCount(r, n);
  const Fmin = RUNS - sch.hi, Fmax = RUNS - sch.lo;
  const axis = r.chance(0.5) ? 'x' : 'y';
  const st = newSheet(axis, sch), km = sch.kmax;
  const pool = axis === 'x' ? BEATS_X : BEATS_Y;
  let first;
  if (axis === 'x') {
    first = r.wpick([['LEAP', 3], ['RELAY', 1.5], ['TIDE', 1.2]]);
    st.k = first === 'RELAY' ? km - r.int(0, 1) : first === 'LEAP' ? -km + r.int(0, Math.max(0, km - 2)) : r.int(-km, km);
    const sx = r.int(1, 2), y0 = r.chance(0.7) ? 12 : 11;
    plat(st, { x0: -4, x1: null, x1min: sx + st.k + 1, y: y0, kind: 'pillar' });
    st.y = y0; st.px = sx * T + 6; st.spawn = { x: sx, y: y0 - 1 };
  } else {
    first = r.wpick([['LIFT', 3], ['STAIRS', 1.5], ['CATCH', 2], ['FLOOD', 1.2]]);
    st.k = first === 'CATCH' ? -km + r.int(0, 1) : km - r.int(0, 1);
    const sx = r.int(1, 2), y0 = first === 'CATCH' ? r.int(4, 8) : first === 'STAIRS' ? r.int(9, 11) : r.int(10, 12);
    plat(st, { x0: -4, x1: null, x1min: sx + 1, a: y0 + st.k, kind: first === 'CATCH' ? 'slab' : 'pillar' });
    st.y = y0; st.px = sx * T + 6; st.spawn = { x: sx, y: y0 - 1 };
  }
  st.k0 = st.k;
  const names = Object.keys(pool);
  for (let i = 0; i < nb; i++) {
    const last = i === nb - 1, order = i === 0 ? [first] : [];
    while (order.length < 5) {
      const ws = names.map(t => [t, (t === 'LEAP' || t === 'LIFT' ? 2 : 1) * (st.beats.length && st.beats[st.beats.length - 1].t === t ? 0.5 : 1)]);
      order.push(r.wpick(ws));
    }
    let ok = false;
    for (const t of order) {
      // variants that keep the union inside the band (the last beat must land in it), shuffled
      const vs = pool[t].variants(st).filter(v => { const c = pop(st.mask | v.mask); return c <= Fmax && (!last || c >= Fmin); });
      for (let j = vs.length - 1; j > 0; j--) { const q = r.int(0, j); [vs[j], vs[q]] = [vs[q], vs[j]]; }
      for (const v of vs.slice(0, 6)) if (pool[t].fit(st, r, v.p)) { ok = true; break; }
      if (ok) break;
    }
    if (!ok) return null;
  }
  if (!(axis === 'x' ? doorX : doorY)(st, r)) return null;
  return emit(st, n, sch);
}

// The known-good fallback (the test checks it at every lens travel): one LEAP of 5 tiles needing 3 stops.
function fallback(n) {
  const sch = schedule(n), km = sch.kmax, k0 = -Math.min(km, 2), kd = k0 + 3;
  // spawn ledge tape -4..(5 + k0); landing from tape 11 + k0 (screen 8 at kd); door at screen 14 on it
  return {
    v: VERSION, n, name: 'LEAP', axis: 'x', k0, kd, kmax: km, door: { x: 14, y: 10 }, spawn: { x: 2, y: 11 }, fallback: true,
    rects: [['R', -4, 12, 5 + k0, 17, 1], ['R', 11 + k0, 12, 27, 17, 1], ['G', 7, 13, 9, 13, SPIKE_UP]],
    script: [['leap', { red: 6 + k0 }, 3], ['walkTo', 14 * T + 6]], beats: [{ t: 'LEAP', s: 2, n: 3, dy: 0, m: 0 }], par: 3, hint: HINTS.LEAP,
  };
}

// A LEVELS entry from the data (build() writes through the game's own rect()).
function makeDef(data, rect) {
  return {
    name: data.name, axis: data.axis, k0: data.k0, kd: data.kd, kmax: data.kmax, door: data.door, spawn: data.spawn,
    hint: () => data.hint, cip: data,
    build(R, G, B) { const g = { R, G, B }; for (const [l, x0, y0, x1, y1, v] of data.rects) rect(g[l], x0, y0, x1, y1, v || 1); },
  };
}

// ---- 3. the bot: the playtest's verbs, as resumable generators (one yield per sim step) ------------------------
// Each mirrors playtest.js exactly (same timings, same conditions); the endless section of playtest.js replays every
// accepted sheet with playtest.js's own verbs and must measure the same.
function makeBot(io) {
  let wheel = false;
  const P = () => io.p, playing = () => io.state === 'play';
  const down = c => io.key('keydown', c), up = c => io.key('keyup', c);
  function* wait(ms) { for (let n = Math.round(ms * HZ / 1000); n > 0 && playing(); n--) { io.step(); yield; } }
  function* until(cond, ms = 8000) {
    for (let n = 0, max = ms * HZ / 1000; n < max && playing(); n++) { if (cond()) return true; io.step(); yield; }
    return cond();
  }
  function* lens(n, { gap = 90, each = null } = {}) {
    if (!n) return;
    function* tick(ms) { for (let s = Math.round(ms * HZ / 1000); s > 0 && playing(); s--) { io.step(); if (each) each(); yield; } }
    if (wheel) {
      const s = Math.sign(n) * (io.axis === 'y' ? -1 : 1);
      for (let i = 0; i < Math.abs(n); i++) { io.wheel(100 * s); yield* tick(gap); }
    } else {
      const c = n > 0 ? 'KeyQ' : 'KeyE';
      down(c); yield* tick(Math.abs(n) / 6 * 1000); up(c);
    }
    yield* tick(150);
  }
  function* walkTo(x) { const c = P().x < x ? 'KeyD' : 'KeyA'; down(c); yield* until(() => (c === 'KeyD' ? P().x >= x : P().x <= x)); up(c); yield* wait(120); }
  function* leap(edgeX, n, o) {
    down('KeyD'); yield* until(() => P().x + P().w / 2 >= edgeX - o.early);
    down('Space'); yield* wait(o.delay); yield* lens(n);
    yield* until(() => P().grounded, 3000); up('Space'); up('KeyD'); yield* wait(150);
  }
  function* climb(wallX, n, o) {
    yield* walkTo(wallX - 22); down('KeyD');
    down('Space'); yield* wait(o.delay); yield* lens(n);
    yield* until(() => P().grounded && P().x > wallX, 3000); up('Space'); up('KeyD'); yield* wait(150);
  }
  // hopInPlaceWithLens, with the sloppy lens delay
  function* hopLens(n, o) { down('Space'); yield* wait(30 + o.delay); yield* lens(n); yield* until(() => P().grounded, 3000); up('Space'); yield* wait(150); }
  function* swimOnto(maxY) {
    down('Space'); yield* wait(2500); down('KeyD');
    yield* until(() => P().grounded && P().y < maxY, 4000); up('KeyD'); up('Space'); yield* wait(150);
  }
  // walkRightHopping, stopping once past x and standing
  function* walkToHopping(x, hopXs) {
    down('KeyD'); const hops = [...hopXs];
    for (let n = 0, max = 8000 * HZ / 1000; n < max && playing(); n++) {
      if (hops.length && P().x + P().w >= hops[0]) { hops.shift(); down('Space'); yield* wait(350); up('Space'); }
      if (P().x >= x && P().grounded) break;
      io.step(); yield;
    }
    up('KeyD'); yield* wait(120);
  }
  // CATCH's solution: step off, then raise the floor (releasing D once caught)
  function* catchFall(n, o) {
    down('KeyD'); yield* until(() => !P().grounded, 3000);
    yield* wait(o.delay);
    yield* lens(n, { each: () => { if (P().grounded) up('KeyD'); } });
    up('KeyD'); yield* wait(150);
  }
  const pos = a => typeof a === 'number' ? a : a.red !== undefined ? (a.red - io.k) * T + (a.off || 0) : (a.blue + io.k) * T + (a.off || 0);
  function* run(script, o) {
    for (const [v, a, b] of script) {
      if (!playing()) break;
      if (v === 'lens') yield* lens(a);
      else if (v === 'walkTo') yield* walkTo(pos(a));
      else if (v === 'leap') yield* leap(pos(a), b, o);
      else if (v === 'climb') yield* climb(a, b, o);
      else if (v === 'hopLens') yield* hopLens(a, o);
      else if (v === 'swimOnto') yield* swimOnto(a);
      else if (v === 'walkToHopping') yield* walkToHopping(pos(a), b);
      else if (v === 'catchFall') yield* catchFall(a, o);
      else throw new Error('unknown verb ' + v);
    }
  }
  const releaseAll = () => { for (const c of ['KeyA', 'KeyD', 'KeyQ', 'KeyE', 'Space']) up(c); };
  function* attempt(idx, def, o, useWheel) {
    io.pause(); io.load(idx, def); wheel = useWheel;
    const d0 = io.deaths;
    yield* run(def.cip.script, o);
    yield* until(() => io.state !== 'play', 2000);
    releaseAll();
    return { win: io.state === 'win', died: io.deaths > d0 };
  }
  // a player who ignores the lens (or only lines up the door first): holds right and hops every 0.6 s
  function* naive(idx, def, lensFirst) {
    io.pause(); io.load(idx, def); wheel = false;
    if (lensFirst && def.kd !== def.k0) yield* lens(def.kd - def.k0);
    down('KeyD');
    for (let n = 0; n < 8 * HZ && playing(); n++) { if (n % 72 === 0) down('Space'); if (n % 72 === 40) up('Space'); io.step(); yield; }
    yield* until(() => io.state !== 'play', 500);
    releaseAll();
    return io.state === 'win';
  }
  function* idle(idx, def) {
    io.pause(); io.load(idx, def);
    const d0 = io.deaths;
    yield* wait(3000);
    return io.state === 'play' && io.deaths === d0;
  }
  return { attempt, naive, idle };
}

// ---- validation and generation --------------------------------------------------------------------------------
function staticCheck(d) {
  const km = d.kmax;
  if (Math.abs(d.k0) > km || Math.abs(d.kd) > km) return 'lens out of range';
  if (d.k0 === d.kd && d.axis === 'x' && d.script.length < 2) return 'door aligned at spawn';
  if (d.door.x < 1 || d.door.x > 22 || d.door.y < 0 || d.door.y > 12) return 'door off the sheet';
  if (d.spawn.x < 0 || d.spawn.x > 23) return 'spawn off the sheet';
  // the spawn tile must not be green (in screen terms green never moves)
  for (const [l, x0, y0, x1, y1] of d.rects) if (l === 'G' && d.spawn.x >= x0 && d.spawn.x <= x1 && d.spawn.y >= y0 && d.spawn.y <= y1) return 'spawn on green';
  return null;
}
// -> { ok, why, pass, runs, fails: ['24px/200ms', ...] }
function* validate(io, idx, data, sch) {
  const why = staticCheck(data);
  if (why) return { ok: false, why };
  const def = makeDef(data, io.rect), bot = makeBot(io);
  if (!(yield* bot.idle(idx, def))) return { ok: false, why: 'unsafe spawn' };
  if (yield* bot.naive(idx, def, false)) return { ok: false, why: 'walkable without the lens' };
  if (yield* bot.naive(idx, def, true)) return { ok: false, why: 'walkable once the door is lined up' };
  const keys = yield* bot.attempt(idx, def, { early: 0, delay: 0 }, false);
  if (!keys.win || keys.died) return { ok: false, why: keys.win ? 'solution dies' : 'bot misses the door (keys)' };
  const wh = yield* bot.attempt(idx, def, { early: 0, delay: 0 }, true);
  if (!wh.win || wh.died) return { ok: false, why: 'bot misses the door (wheel)' };
  let pass = 1, left = RUNS - 1;
  const fails = [];
  for (const early of EARLY) for (const delay of DELAY) {
    if (!early && !delay) continue;
    const a = yield* bot.attempt(idx, def, { early, delay }, false);
    left--;
    if (a.win && !a.died) pass++; else fails.push(`${early}px/${delay}ms`);
    if (sch && (pass > sch.hi || pass + left < sch.lo)) return { ok: true, pass, runs: RUNS, partial: true, early: pass > sch.hi ? 'easy' : 'hard', fails };
  }
  return { ok: true, pass, runs: RUNS, fails };
}
// -> { data, pass, ratio, attempts, tries: [why...], fallback }
function* generate(io, seed, n) {
  const sch = schedule(n), idx = n - 1, tries = [];
  let a = 0, vals = 0;
  for (; a < COMPOSE_CAP && vals < CAP; a++) {
    const data = compose(seed, n, a);
    if (!data) continue;
    vals++;
    const v = yield* validate(io, idx, data, sch);
    if (!v.ok) { tries.push(v.why); continue; }
    if (v.pass < sch.lo) { tries.push(`hard ${v.pass}`); continue; }
    if (v.pass > sch.hi) { tries.push(`easy ${v.pass}`); continue; }
    tries.push(`ok ${v.pass}`);
    return { data, pass: v.pass, ratio: v.pass / RUNS, attempts: vals, composed: a + 1, tries, fails: v.fails, band: [sch.lo, sch.hi], fallback: false };
  }
  const data = fallback(n), v = yield* validate(io, idx, data, null);
  return { data, pass: v.pass || 0, ratio: (v.pass || 0) / RUNS, attempts: vals, composed: a, tries, fails: v.fails, band: [sch.lo, sch.hi], fallback: true, fallbackOk: v.ok };
}

// ---- 4. the validator's side (inside index.html?validate) and the host's side ---------------------------------
// io: { key(type, code), wheel(deltaY), step(), p, k, state, deaths, axis, load(idx, def), pause(), rect }
function serve(io) {
  const jobs = [];
  let cur = null;
  const post = m => { try { root.parent.postMessage({ cdx: VERSION, ...m }, '*'); } catch (e) { /* host gone */ } };
  function work(budget) {
    const end = now() + budget;
    while (now() < end) {
      if (!cur) {
        const j = jobs.shift(); if (!j) return;
        cur = { j, it: generate(io, j.seed, j.n), t0: now(), ms: 0, steps: 0 };
      }
      const t = now();
      let r;
      for (let i = 0; i < 64; i++) { r = cur.it.next(); cur.steps++; if (r.done) break; }
      cur.ms += now() - t;
      if (r.done) { post({ type: 'done', key: cur.j.key, result: { ...r.value, ms: +cur.ms.toFixed(1), steps: cur.steps } }); cur = null; }
    }
  }
  root.addEventListener('message', e => {
    const m = e.data;
    if (!m || m.cdx !== VERSION || e.source !== root.parent) return;
    if (m.type === 'job') { if (!jobs.some(j => j.key === m.key) && !(cur && cur.j.key === m.key)) jobs.push(m); }
    else if (m.type === 'tick') work(Math.min(200, Math.max(0.5, +m.ms || 2)));
  });
  post({ type: 'ready' });
}
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

// The host: owns the hidden validator iframe, asks for sheets ahead of need, grants it time on the frame clock.
function host(opts = {}) {
  const cache = new Map(), waiting = new Map(), queued = [];
  let frame = null, ready = false, failed = false, born = 0;
  const key = (s, n) => `${s}:${n}`;
  function ensure() {
    if (frame || failed) return;
    born = now();
    frame = document.createElement('iframe');
    const u = new URL(location.href); u.search = '?validate'; u.hash = '';
    frame.src = u.href;
    frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1; frame.title = 'validator';
    frame.style.cssText = 'position:fixed;left:-64px;top:-64px;width:16px;height:16px;border:0;opacity:0;pointer-events:none;visibility:hidden';
    document.body.appendChild(frame);
  }
  root.addEventListener('message', e => {
    const m = e.data;
    if (!frame || e.source !== frame.contentWindow || !m || m.cdx !== VERSION) return;
    if (m.type === 'ready') { ready = true; while (queued.length) send(queued.shift()); }
    else if (m.type === 'done') {
      cache.set(m.key, m.result);
      const w = waiting.get(m.key); waiting.delete(m.key);
      if (w) w.forEach(f => f(m.result));
      if (opts.onDone) opts.onDone(m.key, m.result);
    }
  });
  function send(m) { if (ready) frame.contentWindow.postMessage({ cdx: VERSION, ...m }, '*'); else queued.push(m); }
  function fail() {
    // the validator never came up (a host that blocks frames): known-good fallback sheets, so the run still goes on
    failed = true;
    for (const [k, fs] of waiting) { const n = +k.split(':')[1], r = { data: fallback(n), pass: 0, ratio: 0, attempts: 0, tries: ['no validator'], fallback: true }; cache.set(k, r); fs.forEach(f => f(r)); }
    waiting.clear();
  }
  return {
    request(seed, n) {
      const k = key(seed, n);
      if (cache.has(k)) return Promise.resolve(cache.get(k));
      return new Promise(res => {
        if (failed) { const r = { data: fallback(n), pass: 0, ratio: 0, attempts: 0, tries: ['no validator'], fallback: true }; cache.set(k, r); res(r); return; }
        if (!waiting.has(k)) { waiting.set(k, []); ensure(); send({ type: 'job', key: k, seed, n }); }
        waiting.get(k).push(res);
      });
    },
    get: (seed, n) => cache.get(key(seed, n)) || null,
    pending: () => waiting.size,
    tick(ms) {
      if (!frame || failed || !waiting.size) return;
      if (!ready) { if (now() - born > 8000) fail(); return; }
      send({ type: 'tick', ms });
    },
    get state() { return failed ? 'failed' : ready ? 'ready' : frame ? 'loading' : 'idle'; },
  };
}

root.CDX = { VERSION, EARLY, DELAY, RUNS, CAP, mulberry32, mix, rng, schedule, compose, fallback, makeDef, makeBot, validate, generate, serve, host, randomSerial };
})(typeof window !== 'undefined' ? window : globalThis);
