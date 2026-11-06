# QA: Chromatic Drift, direction B (Letters Patent · Title sequence)

## Judge (fixed for the whole build)
- Jurors: a fresh Claude subagent (blind, images only), the Codex juror (gpt-6-astra via codex-juror.mjs), the Gemini motion juror (agy, demo clip slowed 6×). Same prompt file for all: `qa/jury/prompt.md` (+ the frame-check facts of the round).
- Inputs per round: 10 stills (`qa/jury/rN/0*.png`), the frame-stepped demo as contact sheets, three October 2026 Site of the Day sheets (Awards Racing, Overworld Audio, A24) as the craft bar.
- Kept score: the lowest juror per criterion. No calibration run against Awwwards scores (a game is not a site; the anchors are used as a scale only), so no "calibrated estimate" is claimed.
- Hard floors: `index.html?test` identical to the pre-build results; motionqa 60 fps under 4× CPU throttle; zero console/WebGL errors.

## Round 1 (2026-11-06)
**Instruments**: playtest identical (all 10 sheets, keys and wheel; sloppy LEAP 11/12, RELAY 9/12, PRISM 9/12, LIFT/CATCH/STAIRS 12/12). motionqa PASS (min 60 fps at 4× CPU, 1440×900 DPR 2, 0 console errors, audio gesture-gated). slopscan 0 FAIL (2 WARN in throwaway capture scripts, not shipped). craft-check: 1 FAIL `pointer-response` (no reaction to the pointer), WARN gl-coverage 4.2% (flat fields: the GL pass and the 2D canvas differ little at rest), scroll N/A (a game). gl-lint: not applicable as run (it scans shader files; the shaders are inline; the post pass samples the sRGB 2D canvas and writes it straight out, no linear round-trip, so no double encoding). framecheck on the 23 s demo: 40 events, nearly all at designed hard cuts; a 1.13 s hold on the cover; a 167 ms beat between layer drops.

| criterion | Claude | Codex | Gemini | kept |
|---|---|---|---|---|
| Design | 6.9 | 7.6 | – | **6.9** (Claude) |
| Usability | 6.0 | 6.6 | – | **6.0** (Claude) |
| Creativity | 7.6 | 8.1 | – | **7.6** (Claude) |
| Content | 7.3 | 7.8 | – | **7.3** (Claude) |
| Craft in motion | 6.1 | 7.5 | 7.8 | **6.1** (Claude) |
| weighted (D .4, U .3, C .2, Ct .1) | | | | **6.8** |

Jam stars: Graphics 4 / 5 / 5, Innovation 4 / 4 / 5, Theme 4 / 5 / 5, Overall 4 / 4 / 4.8 (Claude / Codex / Gemini); Audio unrated by all (silent captures).
Gaps ≥ 0.5 on every criterion: Claude saw small faint phantoms, a small runner in a bottom-heavy frame, numerals vanishing after FIG. 2, Esc hard-cutting to a blank frame and a rigid pull-off; Codex and Gemini read the same frames as restraint and staging. Both Claude and Codex agree on the usability and type findings.

**Fixes adopted for round 2** (from the jurors' exact values; details in `qa/jury/r1/claude-juror.md`, `codex.md`):
1. Phantoms legible: 3–4 px stroke, dash-dot 12/5/2/5, ≥ 0.8 opacity, layer colour darkened on light fields / lightened on dark ones; fade to 0 over 200 ms once the door aligns. Runner gets a 2 px cream keyline on dark fields.
2. Rules legible in 10 s: the cover states them in two short lines ("Red carries you. Green kills. Blue is water." / "Overlap all three to open the door.") and shows move/jump keycaps beside the lens; the dial reads LENS with the signed step; the cover's staged pair captions "on red: carried" / "in the air: not carried" for 900 ms each.
3. The patent apparatus on every sheet: numerals at 100% for 2.5 s on entry, then 45%.
4. Long text (Brief sentences, claims) in a regular-width face at 18–22 px / 1.4; no auto-shrink; Brief column stops ≥ 28 px before the ALLOWED tab; claims in two columns.
5. Esc and the pull-off move as paper: the sheet drops and tilts out, the Brief sheet lands with a growing shadow, rows stamp in at a 40 ms stagger; the pull-off lifts its leading corner first with a curl and a growing shadow; the next field arrives with its numeral already cut in; the cover hold ≤ 400 ms.
6. Pointer response (craft-check FAIL): the pointer is the rostrum lamp over the cut paper: shadows fall away from it (direction and length from the pointer), and on the cover the paper pieces shift 2–6 px by depth.
7. Phone gate: banner above all art, no collision with the cover's spikes.

**Declined, with reason**: "scale the level 1.35× and centre it" (Claude #1). The world has hard walls at both sides and the whole width can be in play, so it must stay fully visible; it already fills the available width at 1440×900, so a larger scale would crop the play field. The empty space above is the levels' jump headroom.

## Round 2 (2026-11-06)
**Instruments**: playtest identical; craft-check 0 FAIL (pointer-response PASS 8.6%, first reaction 1 frame; gl-coverage WARN 4.1%); motionqa PASS (60 fps at 4× CPU); framecheck 52 events on the 23 s demo, at designed cuts and stamps; holds 433 ms (ALLOWED) and 533 ms (death).

| criterion | Claude | Codex | Gemini | kept | Δ |
|---|---|---|---|---|---|
| Design | 6.9 | 7.6 | 8.1 | **6.9** (Claude) | 0 |
| Usability | 6.5 | 7.0 | 7.5 | **6.5** (Claude) | +0.5 |
| Creativity | 7.6 | 8.0 | 8.4 | **7.6** (Claude) | 0 |
| Content | 7.3 | 7.8 | 8.2 | **7.3** (Claude) | 0 |
| Craft in motion | 6.5 | 7.5 | 7.8 | **6.5** (Claude) | +0.4 |
| weighted | | | | **7.0** | +0.15 |

Jam stars: Graphics 4 / 5 / 5, Innovation 4 / 4 / 5, Theme 4 / 5 / 5, Overall 4 / 4 / 4.8. Audio unrated by all (silent captures).
**Confirmed by all three jurors**: label collisions (FIG. 6 "10" on the floor lip, FIG. 9 "10" on the runner phantom, the cover's 12' entering its caption, a 4-numeral pile-up on FIG. 2) and red on the maroon field (FIG. 3, FIG. 7) failing figure-ground. Gemini adds a black callout on dark green (FIG. 7, 22.0 s).

**Two rounds within ±0.15 → freeze and name the failing dimension**: Design, 6.9 in both rounds, from the same juror's words: "a beautiful cover, then a sparse strip at the bottom of an orange rectangle" (uncomposed negative space; the subject well under ⅓ of the frame). Fixed with its method (art-direction.md §6, shots not sections) inside the hard constraint (the world must stay fully visible wall to wall):
- narrow the rail and margins so the world scales up (target ≥ 1.65× at 1440×900, from ~1.5×);
- per sheet, find the rows nothing can occupy (no tile in any layer at any lens value, above the runner's highest reachable point plus 1 row) and centre the content band in the frame instead of anchoring the full 14 rows;
- compose the freed band as a title card: the sheet title block ("SHEET n OF 10 · NAME", 13 px condensed caps, ink 70%) and the level name as large cut paper in a field-tinted value (≤ 12% luminance difference from the field, never a playable colour), only where it can't overlap anything reachable.

**Consensus fixes adopted for round 3**:
1. Label collision solver: ≥ 10 px from the runner, terrain edges and other labels (12 px from silhouettes, Codex), leaders ≥ 24 px; n and n′ within 64 px share one forked callout "10 / 10′"; door 18's leader never crosses red; no label inside a caption box (≥ 12 px).
2. Figure-ground: retire the maroon field (FIG. 3, 7, list swatches) for deep navy #1E2B3A; a 2 px ink keyline (#141414 at 60%) on red pieces on every field; exit fragments get a 3 px field-coloured clearance and a 2 px cream edge (#F1E9D2) on dark fields; callouts never black on dark green.
3. Courier body copy with no shadow (list and claims); list swatches aligned on one column; ALLOWED stamps seeded −3°…+3° and 0–4 px jitter.
4. In play, the carry state in the rail, in patent voice (Codex #1 within Claude's keep "no plain-language HUD"): "10 CARRIED BY 12" / "10 FREE OF 12" under the dial, 13 px caps; and a compact control caption at the rail's foot (Courier, 12 px): "Q/E lens · A/D move · W jump · Esc sheets".
5. Claims: no "wherein" clause more than twice in ten; variants from run data.
6. Lens step as material: the moving layer overshoots 2 px and settles over 90 ms (presentation only, ease-out-back), phantoms fade in over 80 ms.
7. Sheet handoff: after the first, ≤ 650 ms (Codex); the pull leaves along the sheet's lens axis (Claude), keeping the lift and growing shadow; holds unchanged (433 ms ALLOWED, 533 ms death).

## Round 3 (2026-11-06)
**Instruments**: playtest identical; craft-check 0 FAIL (pointer-response PASS 8.6%); motionqa PASS (60 fps at 4× CPU); label sweep 0 collisions (10 sheets × every lens stop, 4 viewports); framecheck 41 events (designed cuts, stamps, the lens-step settle); world scale 1.656× at 1440×900 (was 1.5×).

| criterion | Claude | Codex | Gemini | kept | Δ |
|---|---|---|---|---|---|
| Design | 7.0 | 7.6 | 8.2 | **7.0** (Claude) | +0.1 |
| Usability | 6.6 | 7.0 | 8.1 | **6.6** (Claude) | +0.1 |
| Creativity | 7.7 | 8.0 | 8.5 | **7.7** (Claude) | +0.1 |
| Content | 7.7 | 7.8 | 8.3 | **7.7** (Claude) | +0.4 |
| Craft in motion | 6.4 | 7.6 | 7.9 | **6.4** (Claude) | −0.1 |
| weighted | | | | **7.1** | +0.13 |

Jam stars: Graphics 4 / 4 / 5, Innovation 4 / 4 / 5, Theme 4 / 5 / 5, Overall 4 / 4 / 5. Audio unrated by all.
**Confirmed by all three**: secondary text too small (the carry-state line, the rail's control caption); phantoms and exit pieces weak on dark fields and inside FIG. 9's red mass. Claude only (Craft): the sheet push is a flat slab (no lift or shadow change), an empty cream frame before the list (13.25 s), a leader crossing under the death stamp.

**Third round within ±0.15**: per quality.md, the last targeted round; then the final checks and hand-off.

**Final round fixes**:
1. Carry state in the rail at 18–20 px condensed in a cream chip (#F3EBDD, 6 px padding), inverted red #C22A20 / cream when FREE, worded as the cover's captions ("ON RED / CARRIED", "IN AIR / NOT CARRIED"); 22/24 glossed "RED" / "BLUE" at 16 px beside the arrows; the rail control caption at 16 px / 20 px including the wheel.
2. Phantoms: a 1.5 px #F3EBDD keyline under the coloured dash-dot on every field; on slate and navy 2.5 px at full saturation (blue #9DBDE3); exit fragments get a 4 px field knockout under a 2 px #F4EBD4 perimeter (FIG. 9 separation).
3. Sheet change as paper: lift 120 ms (shadow 2/4 → 12/28 px blur, −6 px, −0.6°), then slide along the lens axis 420 ms cubic-bezier(.7,0,.2,1) with the next field already underneath; the same move for digit jumps (no hard cuts).
4. The list never shows an empty frame: header and rows together, rows staggered 25 ms from 0 ms.
5. Death stamp: ≥ 24 px between every leader and the stamp box; the stamp ≥ 40 px above the trajectory apex; leaders routed outside the dotted arc.
6. Cover: the loose green spikes anchored on a ground strip in the demo; list chip numerals on orange in #1A1A1A.
Not adopted: ghost word removal (Codex and Gemini read it as composition; it stays where rows are free); "EXIT" / "TRY AGAIN" translations (Codex: they break the patent voice that all three jurors put on the keep list).

## Round 4, final (2026-11-06)
**Instruments (final build)**: playtest identical to every earlier round (all 10 sheets with keys and wheel; sloppy LEAP 11/12, RELAY 9/12, PRISM 9/12, LIFT/CATCH/STAIRS 12/12); label sweep 0 violations (10 sheets × lens −4..+4, rest and mid-lens, 40 forced deaths; 1440×900, 1920×1080, 1280×720, 1280×1024); text contrast ≥ 4.68:1 everywhere (lowest: the control caption on olive; the FREE chip 4.79:1); craft-check 0 FAIL (pointer-response PASS 9.0%; WARN gl-coverage 4.3%, scroll n/a); motionqa PASS (min 60 fps at 4× CPU, 1440×900 DPR 2, 0 errors); framecheck 50 events on the 23 s demo (designed cuts, stamps, paper lifts, lens-step settle); zero console/WebGL errors in every mode; offline from file://, no external requests, iframe-safe.

| criterion | Claude | Codex | Gemini | kept |
|---|---|---|---|---|
| Design | 6.6 | 7.7 | 8.1 | **6.6** (Claude) |
| Usability | 6.8 | 7.1 | 8.3 | **6.8** (Claude) |
| Creativity | 7.5 | 8.2 | 8.5 | **7.5** (Claude) |
| Content | 7.6 | 7.9 | 8.2 | **7.6** (Claude) |
| Craft in motion | 6.4 | 7.6 | 7.9 | **6.4** (Claude) |
| weighted | 6.9 | 7.6 | 8.2 | **6.9** |

Jam stars: Graphics 4 / 5 / 5, Innovation 4 / 5 / 5, Theme 4 / 5 / 5, Overall 4 / 4 / 4.9.

**Result, stated honestly**: kept scores by round 6.8 → 7.0 → 7.1 → 6.9 (the last move is within one juror's round-to-round noise, ±0.2). Best measured: **7.1 kept (round 3)**, with the other two jurors at about 7.5 (Codex) and 8.2 (Gemini) on the same build. Not calibrated against real Awwwards jury scores, so these are positions on the jurors' scale, not a Site of the Day estimate. On the jam's own categories all three jurors give 4–5 stars; Audio could not be judged by any juror (silent captures).
**What blocks the strictest juror**: the in-play frame (the world must stay fully visible wall to wall, so the runner stays ~35 px at 1440 wide and FIG. 1's sky stays large); red phantoms on the orange field; the ghost title word on some sheets only; the lens step translating without a paper response; the familiar cut-paper skin around the original patent grammar. **Next leads**: phantoms in ink on orange/olive and cream on dark fields with a 30% destination fill, single/double primes for the Q/E directions with keycaps at rest; the ghost word on all sheets or none; a 90 ms shadow lift and ≤1.5° skew on each lens step; landing squash on the runner.

## Completion ledger (BRIEF.md required outcomes)
| # | outcome | where | evidence (final build) |
|---|---|---|---|
| 1 | all 10 levels solvable | index.html, playtest.js | `?test` identical, all pass, sloppy unchanged |
| 2 | simulation deterministic, visuals presentation-only | index.html | `update()`, `applyK`, `move`, `LEVELS` unchanged; playtest identical every round |
| 3 | one graded image | index.html WebGL2 post pass | paper fibre, rough edges, layered shadows, lamp-driven shadow direction; **revised from the brief**: direction B has no lens or split (print has no lens; DIRECTION.md §B), so the brief's split/lens item is replaced by the paper treatment |
| 4 | designed transitions | index.html | cover→sheet stamp cut, sheet→sheet paper lift and slide along the lens axis, death freeze + stamp held over reset, Esc paper drop to the Brief, the grant; framecheck shows no undesigned stalls |
| 5 | hero moment teaching the mechanic | cover | live figure with ON RED: CARRIED / IN THE AIR: NOT CARRIED; all jurors list it on their keep lists |
| 6 | sound designed with the visuals | index.html WebAudio | detent clicks, pin seat, nib, typewriter, stamp thump, paper swish, room tone, gesture-gated (motionqa); **not verified by ear**: handoff |
| 7 | reduced motion | index.html | `prefers-reduced-motion` / `?__state=reduced`: instant cuts, static phantoms, no overshoot, no lamp; craft-check reduced-motion PASS |
| 8 | colour-vision readability and contrast | index.html | hatch direction per channel; text ≥ 4.68:1 measured |
| 9 | 60 fps and a low tier | index.html | motionqa 60 fps at 4× CPU, DPR 2; 2D fallback without WebGL2 or on slow frames (tested) |
| 10 | file://, Pages, itch iframe | index.html, fonts/ | no external requests, focus on click, host never scrolls (embed checks) |
| 11 | layout-aware labels, wheel | index.html | K() labels on cover, rail caption and phone card; wheel one step per notch |
| 12 | itch.io submission before Dec 1 13:37 PST | dist/ | `dist/chromatic-drift-itch.zip` (index.html, playtest.js, fonts/, LICENSE, README.md; 260 KB) and `dist/itch-cover-630x500.png` prepared; **the upload is the user's step** |
| 13 | continuation (endless mode) | endless.js, index.html, playtest.js | `?test`: FIG. 11–40 × 3 serials, 90/90 solvable (keys + wheel), validator and replay agree 90/90, reproducible 90/90, tolerance 0.90 → 0.48 (min 0.44); label audit 0 violations over FIG. 11–40 at every lens stop (380 frames); motionqa PASS; `qa/endless-shots.cjs`, `qa/endless-play.cjs` |

**Handoffs (need a human)**: listen to the sound on real speakers and headphones; play all ten sheets by hand on a real keyboard (the feel, the lens step); submit on itch.io; decide whether the design documents and sketches go in the public repo (heavy captures are excluded, below).
