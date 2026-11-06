# Direction: Letters Patent, B · Title sequence (chosen)

The concept (CONCEPT.md) is fixed: the game as a patent filing, the lens shown as dash-dot phantoms with primed numerals, door 18 numbered at alignment, deaths circled and stamped. Three directions dress it differently; the user picks one at checkpoint 5.

## Conventions inventory
**Category (puzzle platformers with an art direction: Hue, Gris, Fez, Celeste, Inside, Obra Dinn; named from knowledge, not viewed for this file)**:
1. Painted or flat-shaded worlds with a soft gradient sky. **Depart**: the world is a technical drawing.
2. Colour carries the rules on its own (Hue). **Depart**: hatching direction carries each channel; colour is secondary (colourblind-safe by construction).
3. Minimal or no HUD (Inside). **Follow**: the only HUD is the drawing's own furniture (dial 20, sheet number).
4. Fade-to-black between levels. **Depart**: the subject's own process (exposure slit / hard cut on a stamp / pencil stroke).
5. A tutorial overlay of text and key glyphs. **Depart**: the cover figure and the phantoms teach the lens; text at most ~8 words before play.

**Award house style (recent Sites of the Day, TECHNIQUES.md)**:
1. Near-black + off-white + one hot accent. **Depart in B** (one flat colour field per sheet); A and C follow it because the photostat and the red pencil literally are that, and say so.
2. A fixed RGB split on everything. **Depart**: the split exists only in A, only where the subject has a lens (the copy camera), and its direction and sign come from the game's lens.
3. Uniform film grain. **Depart**: paper fibre (A), paper texture (B), graphite tooth (C), static per sheet, never animated noise.
4. Noise-edged wipes. **Depart**: exposure slit (A), stamp-synced hard cut (B), pencil stroke (C).
5. Kinetic display type. **Follow, retuned**: the typewriter strikes "18" (A, C) or a cut-paper numeral slams in (B).

**Wayfinding vs travel**: wayfinding follows convention (Esc to the Brief Description page, digits to jump to a sheet, R restart); travel departs (each level is a sheet you leave through the door, by the subject's own reproduction process).

**Rule-break (C)**: a colour game with almost no colour.

## Shared across A, B, C (the concept, after the previs findings)
- **Phantoms before commit**: at rest, faint dash-dot outlines of red and blue at the next stop in **both** directions (k−1 and k+1) at ~25% strength; the direction last used (or currently turning) at full strength; the runner's 10' phantom only when grounded on red; airborne gets a dimension line to the red below. Labels sit beside their own outline, offset away from neighbours, never overlapping (a simple label-collision pass).
- **Carried vs not carried as a staged pair**: the cover figure plays it as a 6 s loop with the player's lens: first grounded (10' rides with 12'), then a hop (no 10', dimension line).
- **Numerals only where a part first appears** (FIG. 1: 10, 12, 18; FIG. 2 adds 14; FIG. 3 adds 16), then only on hover of the dial or on death.
- **Door 18**: unlabelled; at alignment the cell turns solid white, a leader line draws in from the nearest margin (~0.4 s on the signature curve), a typewriter strikes 1 then 8 (two transients 70 ms apart).
- **Death**: 6-frame hold, the red-pencil circle drawn as a stroke (~180 ms), ANTICIPATED stamp (felt thump), the failed path kept as a dotted line on that sheet; respawn ≤ 0.6 s, any key skips.
- **Signature curve**: cubic-bezier(0.32, 0.72, 0, 1) for everything that arrives; exits ease in (power2.in). Leader draw and typewriter on this curve.
- **Determinism**: every new visual is presentation only; `index.html?test` and the frame's own `?test` must match.
- **Tiers**: WebGL2 post pass on desktop; Canvas2D-only when WebGL is missing or under ?__state=gl-off (the drawing still complete); reduced motion: phantoms static, transitions instant, no optics animation.
- **Sound** (WebAudio, office foley, no music bed): detent click per lens stop (noise burst + short resonant body, same pitch), a lower longer "pin seats" click on the alignment step, nib scratch for leader lines, typewriter strikes, felt stamp thump, room tone (a soft fan). Fired on the frame of the visual.

## A: Photostat (grows from the subject)
**Source**: the examiner's photostat: a copy camera photographs the drawing onto negative paper.
- **Palette**: ground #0c111d (blue-black, never #000), line #e8ecf2 (cool white), hatch tints red #d26a62 / green #7fb38a / blue #7c9cd6 at ~35% inside the hatching, examiner pencil #e0453a (the only saturated accent), door white #ffffff (the only true white). Source: photostat negatives are white-on-dark-blue/black.
- **Type**: a typewriter face for numerals, stamps and sheet furniture: Courier Prime (Google Fonts, OFL), regular and bold; chosen because 1950s filings were typed; lettering on the drawing in a single-stroke drafting style drawn as strokes in canvas.
- **Craft layer (WebGL post)**: copy-camera optics: barrel 0.02 at rest; halation (lines bleed ~1 px of light into the dark: a small blur added back at 0.25); paper fibre: a static texture per sheet, seeded by level, ~4% luminance; grade: lift blacks to #0c111d, no saturation boost. **Split**: only here, because the copy camera has a lens: radial-quadratic, axis and sign from the game's lens (red with the lens, blue against), 0.0015 of width at rest, 0.007 at full lens speed, rise 12/s, decay 3/s, clamp 0.009. Vignette: corners ≥ 80%.
- **Transition**: the exposure slit: a thin bright bar sweeps across the frame along the **next** level's lens axis (550 ms out, the bar leaves the developed next sheet behind it, 900 ms in), the only light event in the game.
- **Signature extra**: the end inverts negative to positive (black on cream) once.

## B: Title sequence (a school not native to the web: 1950s cut-paper film titles)
**Source**: the film title sequences of the 1950s (cut paper, one colour field per scene, rhythm cut to sound); the patent's figures re-cut as paper.
- **Palette**: one flat field per sheet, cycling through four inks: ochre #e08a1e (FIG. 1), slate #3f5a6b, oxblood #7a2a26, olive #6b6a2a; shapes in black #141210 and off-white #efe6d2 paper; the three layers keep their identity as cut-paper colours red #c9372c, green #2f8f4e, blue #2c5aa8 with **stripes cut into them** in the hatching directions; white door #fbf6ea.
- **Type**: the reference numerals and FIG. labels as huge cut-paper shapes (type as image): a heavy condensed grotesque, Big Shoulders Display (Google Fonts, OFL) at 800–900 for numerals and FIG. numbers; nothing else typed.
- **Craft layer (WebGL post)**: paper: a static paper texture per shape (fibre, slight edge roughness from a noise mask), a soft drop shadow 2 px down-right as if the shapes were layered on a light box; **no split, no lens** (print has none); grade: flat, saturation 1.0; a 1-frame "gate jump" of ±1 px on each hard cut, like a title sequence on film.
- **Transition**: hard cuts synced to sound: the stamp thump cuts to the next sheet's colour field, the numeral slams in from off-frame (120 ms, overshoot 4%), the layers drop in one by one on three typewriter beats (80 ms apart).
- **Signature extra**: the huge FIG. numeral of each sheet sits behind the level like a title card.

## C: Red only (the rule-break)
**Source**: the examiner's red pencil, used on everything; "you are red".
- **Palette**: ground #120c0c (near-black, warm), everything else one red #e0453a at three densities (line 100%, hatch 70%, phantoms 45%); **the door #ffffff is the only non-red pixel in the game**, and it only exists at alignment.
- **Type**: Courier Prime (as A) for the few words; numerals hand-lettered as strokes.
- **Craft layer (WebGL post)**: graphite: line edges with a fine tooth (a static noise threshold on the line mask), a faint red "pencil pressure" variation along long strokes; grade: monochrome map of the drawing to the single red (luminance → red density), then the white door added after the grade so it is the only white; **no split** (a pencil has no lens); vignette corners ≥ 70%; a slow 0.2 Hz pressure breathing on the line density (±3%) at rest.
- **Transition**: a pencil stroke: a single red diagonal stroke crosses the sheet out (450 ms, power2.in), the next sheet is drawn in by a fast "pencil pass" that reveals the hatching along each layer's hatch angle (900 ms on the signature curve). Not Volée's outline-then-hatching engraving: here the reveal follows the channel's hatch direction, all three at once.
- **Signature extra**: at alignment the white door is the first non-red thing the player has ever seen in the game.

## Ledger and familiarity notes
A and C are dark with one hot accent (named above as followed on purpose). B departs on every axis from the last three builds (no light paper, no Modern serif, no engraving).

## Asset plan
No raster art beyond static procedural textures (paper fibre, paper grain, graphite tooth) generated in code at load, seeded. Fonts: Courier Prime (A, C), Big Shoulders Display (B), self-hosted from github.com/google/fonts (OFL), subset to the characters used. Hero comps generated for reference only (assets-src/moodboards/, not shipped): A and C from Codex only (Antigravity produced no image for them), B from both.

## Style frames
Built 2026-11-05 as playable frames (`frames/a.html`, `b.html`, `c.html`), each with the shared fixes, its own WebGL2 post pass, transition and sound; `?test` matches `index.html?test` on all 10 levels in all three. Captures: `frames/capture/motion/<a|b|c>/` (14 s frame-stepped demo, sheets, stills), framecheck A 5 events (after a direct recapture: the audit's motion probe stalled A's demo on the cover, a tool interaction to investigate), B 18, C 16 (at cuts and transitions, as designed).

**Codex juror ranking** (stills + motion sheets vs. Awards Racing, Overworld, A24 sheets; `frames/capture/rank-codex.md`):
1. **B Title sequence**: strongest identity, stops the scroll as a thumbnail and in motion, most legible at small size (colour + stripe direction + silhouette reinforce each other), closest to the references' single coherent image. Missing: more expressive paper handling at alignment, completion and death (much of the motion is rigid translation); the death still lacked a readable ANTICIPATED. **Its one change: retract the monumental FIG. numeral into the margin when play begins (it reads as extra terrain), keeping full scale for covers and transitions.**
2. **A Photostat**: least familiar, strongest transition idea (the exposure slit); weak hierarchy (annotations, borders and playable objects get equal emphasis), the persistent fringe softens precise information, an empty dark rectangle at thumbnail size.
3. **C Red only**: the clearest single reveal (the white door), but the most familiar (terminal / surveillance / horror red wireframe), and layers, runner and phantoms are hard to read at a glance.

**Chosen: B** (client pick at checkpoint 5, matching the juror). Folded into the direction:
- the FIG. numeral at full scale on the cover and during transitions; during play it retracts into the left margin (or behind a 60% field tint) so it never reads as terrain;
- paper handled expressively at the three consequential moments: alignment (the door's paper lifts with a shadow), completion (the sheet is pulled off like a title card), death (the ANTICIPATED stamp lands readable, red paper, with the felt thump);
- everything else as specified in section B.
**What the losers offer** (revival options, not grafts): A's exposure slit (a transition that means something photographic) and its negative→positive end inversion; C's white-door reveal as the only colour (the cleanest "door gets its number" beat).

### User checkpoints
### Style frames (frames, 2026-11-05T21:47:54.567Z)

**pick** (1)
- B · Title sequence (juror's 1st): a 1950s cut-paper film title sequence: one flat colour field per sheet (ochre, slate, oxblood, olive), huge cut-paper FIG. numerals, the layers as cut paper with stripes cut in the hatching directions, hard cuts on the stamp and typewriter beats.

**What it changed**: B is the direction. The questions and the "take from the others" field were left blank, so nothing is grafted from A or C; the juror's numeral change is adopted.
