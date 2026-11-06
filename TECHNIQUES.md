# Techniques: the craft bar for Chromatic Drift

Three Awwwards Sites of the Day from October 2026, each taken apart with `teardown.mjs --nav` on 2026-11-05 (desktop, 1440×900). The recordings are in `teardown/<name>/` (`video.webm`, `sheet.png`, `frames/`, `shaders/`, `report.md`). Timestamps below are seconds into each `video.webm`. All numbers come from the recorded shaders, the timings the script captured, or the sites' public bundles read for constants. No code or assets were taken. This file describes techniques; it does not reuse any.

| Slot | Site | Awwwards page | SOTD | Design / Usability / Creativity / Content | Overall | Dev Award: Animations (dev overall) |
|---|---|---|---|---|---|---|
| a. Playful, game-like | [Awards Racing](https://awards.racing) | [/sites/awards-racing](https://www.awwwards.com/sites/awards-racing) | 27 Oct 2026 | 7.67 / 7.07 / 7.91 / 7.68 | 7.54 | 8.40 (7.47) |
| b. Post-processing optics | [Overworld Audio](https://overworldaudio.com/) | [/sites/overworld-audio](https://www.awwwards.com/sites/overworld-audio) | 15 Oct 2026 | 7.44 / 7.00 / 7.83 / 7.44 | 7.38 | 8.60 (7.36) |
| c. Craft benchmark | [A24 by Ravi Klaassens](https://a24.raviklaassens.com/) | [/sites/a24](https://www.awwwards.com/sites/a24) | 26 Oct 2026 | 7.65 / 7.31 / 8.01 / 7.95 | 7.65 | 8.00 (7.41) |

Candidates that were dropped, with their folders kept in `teardown/` for reference:
- **Cartier, Le Chœur des Pierres** (20 Oct 2026, Animations 8.60) was the first pick for slot c. It serves "Access Denied" to the headless browser, so A24 took its place.
- **Ascension, Pegassi** (21 Oct, Animations 8.20) has a click-to-enter gate, so only its loader was recorded.
- **Grail** (4 Nov) and **Dont Look Up** (1 Nov): no shaders were captured.

Limitations to keep in mind:
- Overworld also sits behind an "enter with sound" gate. Its whole post chain compiles before the gate, so the shaders and constants below are complete, but the video only shows the gate screen and the pointer wake.
- Awards Racing's race itself starts after a sound prompt. Its in-race post settings come from the shaders and the bundle's defaults, not from footage.

---

## Awards Racing (https://awards.racing, viewed 2026-11-05)

**What makes it feel crafted**
1. **2.0–3.0 s: the title grows out of a pixel-stepped mask.** The key art is revealed through a mask with a quantised, staircase edge that grows outward over about 1 s. Once it stops, the edge keeps flickering. It reads as game hardware, not as a web fade.
2. **8.5–9.8 s: the pointer pushes the smoke.** The pointer sweep makes the smoke under the title billow outward in the pointer's direction. Then the screen exits through a horizontal glitch-slice dissolve in about 0.5 s, holds black for about 0.5 s, and the next card fades in in about 0.3 s.
3. **About 14–17 s: a welcome title and an iris reveal.** The letters of the welcome title pop one at a time, 500 ms each, with start delays scattered randomly between about 0.25 s and 1.3 s. The title then flies out left and right in 500 ms, and a circular iris opens onto the character in 2.1 s (linear).

**GPU**
- One full-screen WebGL2 canvas behind the UI (the canvas reports 1440×900 with a 1800×1125 buffer, a 1.25 render scale), plus many tiny 2D canvases that bake text and stickers into textures.
- The renderer is a custom deferred one on three r180. It has a velocity buffer with per-object previous matrices (for motion blur), sub-pixel jitter (temporal anti-aliasing), GTAO, a bloom down/up chain, and a filmic tone-mapping final pass.
- The look is particles, ribbons, flowmap hex tiles for stage transitions, an armour fresnel, and a refractive "explosion" shell.
- 54 custom shader stages.

**Post and optics**
- The final pass applies **radial chromatic aberration all the time**. Red and blue are pushed apart along the line from the screen centre, and the push grows with the square of that distance: none at the centre, about 0.004 of screen width in the corners (about 6 px at 1440, about 3 px at the game's 768 px).
- Explosions add a **refraction bump**. The refracted screen offset (glass IOR 1.5) gets its own red/blue split equal to 1.5% of the offset strength. It ramps in over the first 5% of the effect's life and fades out between 40% and 80% of it.
- A **gameplay vignette** sits off-centre (centre 0.5, 0.52) and is boxy (boxiness 0.55, softness 0.12). It tightens from 78%×66% of the screen to 70%×56% as an "action" amount rises. There is also a red-alert tint channel.

**Drivers**
- The car's speed drives the motion-blur length (per-pixel velocity × multiplier 1, scaled by the frame's dt).
- Events (explosion, hit, red alert) drive the refraction, the aberration bump and the vignette squeeze.
- Targeting slows time to 0.3×.
- The stage colour shift is driven by progress uniforms. The grid pulse has its own progress, time and speed uniforms.

**Timings**
- UI fades: 350 ms and 250 ms on an ease-out cubic (0.33, 1, 0.68, 1). Letter pops: 500 ms each. Iris: 2.1 s.
- Camera regime changes take 2.0 s. The restart orbit takes 1.0 s on a power-3 ease.
- The camera's field of view is 42° in the menu and 55° in play, with a look-ahead of 0.08–0.12 of speed.

**Cost**
- 5 long tasks in 35 s; it stayed responsive through every stage.
- The renderer exists in both WebGL2 and WebGPU builds (the bundle ships both shader languages).

**The one parameter**
- The aberration is **quadratic in distance from the centre and always on, then spiked by events**. The middle of the screen, where the car is, stays sharp, while the edges feel like a real lens.

---

## Overworld Audio (https://overworldaudio.com/, viewed 2026-11-05)

**What makes it feel crafted**
1. **About 3.5–4.5 s:** a thin line logo mark appears out of a near-black field. The site rests at near-black (#06070b), never at flat black.
2. **5.0–6.8 s: the pointer wake reveals a hidden lit layer.** The trail does not just paint. Its value is multiplied by 4 and used as a mask, so a lit blue version of the logo appears under the pointer. The wake builds in about 0.1 s and fades by about 8.3 s, roughly 1.5 s after the pointer stops.
3. **Throughout:** live film grain over a graded, LUT-driven image with a heavy vignette and a 2.2 px RGB split. Even the gate screen looks photographed rather than rendered.

**GPU**
- One full-screen WebGL2 canvas behind the DOM (z −1). Antialiasing is off; the pipeline renders its own targets.
- Stack: three r184, Theatre.js for authoring the parameters.
- 46 custom shader stages: a terrain/world pass, an fbm sky, a fluid trail sim, bloom mips, a DOM-tracked "banner" plane and an overlay panel.
- One composite pass runs, in this order:
  1. trail displacement;
  2. RGB split;
  3. optional displacement-texture warp;
  4. bloom (itself colour-split);
  5. trail glow;
  6. banner composite;
  7. vignette;
  8. contrast, hue, saturation and exposure;
  9. a 32³ 3D LUT;
  10. reveal-to-colour;
  11. a tiled noise texture multiplied in twice (paper/print texture);
  12. per-pixel hashed grain.

**Post constants (live settings)**
- **RGB split:** 0.0015 of screen width (about 2.2 px at 1440), at a fixed angle, on the scene. The bloom gets an extra 0.01 split.
- **Grain:** amplitude 0.06, which is ±3% luminance. It is hashed per pixel and reseeded every frame.
- **Vignette:** full brightness out to 0.11 from the centre, falling to black at 0.91, with a 1.2 fade. That leaves corners at about 16% brightness and mid-edges at about 50%. This is heavy and suits a dark, atmospheric site.
- **Saturation:** 2.0 before a full-strength LUT. **Bloom:** strength 1.25, luminance threshold 0.05, smoothing 0.6, 4 mips.

**Drivers**
- **Pointer, through a trail sim.** It runs in a quarter-resolution buffer, updated at 30 Hz.
  - Each 100 ms the trail keeps 0.8 of its value, a half-life of about 0.3 s.
  - The stamp radius is 0.05 of the screen plus 0.3 × pointer speed.
  - A noise field advects and erodes the trail so its edges stay ragged.
  - The stamp is speed-gated. Speed is normalised against 0.3 screen/s. The gate opens at a rate of 12/s (about 80 ms to full) and closes at 3/s (about 330 ms), so the trail only paints while the pointer moves and never pops off.
- **Reveal and transition progress.** Tracked panels show over **1.2 s and hide over 0.7 s, both expo.out**. They use a noise dissolve with softness 0.18 and noise scale 4.
- Only `uTime` drives the ambient sky.

**Timings**
- UI fades: 300–800 ms linear. The button text grows over 600 ms on (0.14, 1, 0.34, 1), a very sharp ease-out.
- Music and audio fades are handled separately, in GSAP.

**Cost**
- 5 long tasks in 105 s.
- Three quality tiers cap the world's pixel ratio at 1.5, 1.25 and 1.0, with world render scales of 1.0, 0.85 and 0.7.
- A cheap composite path drops the split and bloom taps, from 6 texture fetches to 1.
- The simulations tick at 30 Hz while presentation runs at display rate (60 on mobile).

**The one parameter**
- The **asymmetric speed gate on the wake**: about 80 ms to arrive, about 330 ms to leave, with the trail used as a 4× reveal mask rather than as paint. That is what makes the pointer feel like it is uncovering something.

---

## A24 by Ravi Klaassens (https://a24.raviklaassens.com/, viewed 2026-11-05)

**What makes it feel crafted**
1. **0.5–2.5 s:** a rolling-digit counter goes from 0 to 100 while the first disc grows and turns in from edge-on. The loader is the hero object arriving, not a bar.
2. **About 3.5–4.5 s:** on hover, a hand-drawn scribble circles the active disc. It is drawn at a stepped frame rate, which keeps it looking hand-made. The disc tilts toward the pointer.
3. **About 43.5–45 s: the category change never hard-cuts.** The old discs leave in about 0.5 s. The new active disc flips in edge-on with a quarter-turn, and its neighbours stagger in behind it. Everything has settled about 1.05 s later.

**GPU**
- One full-screen WebGL2 canvas above the DOM (z 2, pointer-events none).
- Every disc uses three.js's built-in physical and basic materials (r180-era) with ACES tone mapping at exposure 0.86. The craft is in the materials and the motion, not in custom shaders.
  - The disc backs are **thin-film iridescent** (film IOR 1.86, thickness 900 nm, fully metallic). That is the CD rainbow: physical colour separation.
  - The clear hub is transmissive (IOR 2.0, frosted edge).
  - A blue rim light (#499FF5 at 0.75) sits against a warm key (#FFF9E8).
- Grain is a CSS overlay looping every 600 ms, not a shader.

**Drivers**
- **Pointer:**
  - Hover tilt is 0.21 rad, eased at a rate of 10/s (about 100 ms).
  - Drag sensitivity is 0.95, with velocity smoothing 0.32 and a velocity cap of 0.5.
  - Release friction is 0.89 per frame.
  - Snapping to a disc takes 0.46 s, through a spring at frequency 9.5 with damping 12.
  - The follow rate falls with distance, from 15/s close in to 6.5/s at its minimum.
- **Scroll and wheel:** Lenis smooth scrolling with lerp 0.165 and a 1.25× wheel multiplier. Wheel bursts are shaped by an envelope with a 550 ms time constant.
- **Navigation:** out 0.5–0.55 s, in 1.05 s, exit 0.8 s with a quarter-turn spin and a 1.45× boost. Press feedback squashes the disc to 0.94 for 120 ms, then springs it to 1.015 over 160 ms.

**Timings**
- **One signature ease everywhere**, CSS and GSAP alike: (0.32, 0.72, 0, 1), named "discGlide".
- UI: 140 ms colour, 200 ms dots, 300–400 ms clip/translate.
- Scale pops use an overshoot curve (0.34, 2.27, 0.64, 1) over 300 ms.

**Cost**
- 6 long tasks in 48 s.
- On coarse pointers the smooth scrolling is turned off, and a separate touch layout keeps the discs in fewer, larger positions.

**The one parameter**
- **One ease token, and an in-time about twice the out-time** (0.5 s out, 1.05 s in). Every move in the site shares a single curve, so the whole thing reads as one physical object.

---

## The bar for this build

Chromatic Drift is a 768×448 Canvas2D game, 24×32 by 14×32 tiles, simulated at a fixed 120 Hz. The craft layer is presentation only: one WebGL canvas that takes the finished game frame as a texture. It must never feed back into the simulation, so `?test` stays deterministic.

The concept gives this build something none of the three references have. **Colour separation is the game rule, not an effect.** Red slides one way, blue the other, green stays, and white is the goal. So every optical effect below is the mechanic made visible, and none of it is decoration.

### Must match

**Post pass (one full-viewport WebGL canvas behind a thin DOM HUD)**
- **Fill the viewport.** The baseline craft check fails at 8.1% GL coverage. Upscale the game texture so pixel edges stay crisp: an integer scale where it fits, otherwise a sharp-bilinear filter (at 1440×900 the scale is 1.875×, so a tile is 60 px). Let the post pass own the letterbox margins: grain, vignette and a faint ambient field from the active layers. No dead black frame.
- **Split strength follows the lens.** The split is radial and quadratic, as Awards Racing does it: zero at the centre, so the player sprite and the white exit stay sharp.
  - **At rest:** about 0.002 of width in the corners (about 3 px at 1440).
  - **At full lens speed:** about 0.008 in the corners (about 11 px at 1440). Lens speed is `LENS_MAX_RATE` = 10 steps/s. Hold the split along the level's lens axis, red offset with the lens's direction, blue against it, and green fixed. That is the game's rule, drawn by the optics.
  - **Smoothing:** use Overworld's asymmetric gate. Rise at a rate of 12/s (about 80 ms) and decay at 3/s (about 330 ms), so a lens tap reads as a flick and a long turn as a sustained smear.
  - **Clamp:** at 0.01 of width, so tiles never smear into a neighbouring tile's colour (0.01 × 1440 ≈ 14 px, under half of one upscaled 32 px tile at 1.875×).
- **Grain:** ±2–3% luminance (amplitude 0.04–0.06), hashed per screen pixel and reseeded every frame. Grain the margins and the black at full strength, and ease it to about half over the bright layers so the tiles' colour stays pure.
- **Vignette:** much lighter than Overworld's, because the play area reaches the edges. Corners of the play area stay at **at least 75%** brightness; the margins outside can fall to about 30%. Start the falloff at 0.35 from the centre. Use an off-centre, slightly boxy shape like Racing's (centre 0.5, 0.52; boxiness about 0.5) so the vignette sits on the rectangular level, not a circle.
- **Grade:** saturation at most 1.2. No hue shift, no LUT. Red, green, blue, their pairwise mixes and white are gameplay information. Spot-check that pure #f00/#0f0/#00f/#fff come out of the pass unchanged within ±3%, and on a colour-blind simulation.
- **Lens bulge:** barrel distortion of about 0.03 at the corners at rest, rising to 0.05 while the lens turns. Apply it before the split so both share one optical centre.
- **Pointer wake:** a quarter-resolution trail target updated at 30 Hz.
  - It keeps 0.8 of its value every 100 ms (half-life about 0.3 s), the stamp radius is 0.05 of the screen height plus 0.3 × speed, and it only paints while the pointer moves.
  - On the title and menus, use it as a **reveal mask with about 4× gain**: the wake uncovers the white overlap layer under the pointer, the way Overworld's uncovers the lit logo.
  - In play, keep it to a displacement of at most 0.004 UV and fade it out during platforming input, so it never competes with the level.
  - The **first visible reaction must come within 2 frames (≤ 33 ms)**. The baseline is 84 ms over 5 frames.
- **Event optics, as in Racing's explosion bump:**
  - **Death on green:** a split spike to 0.012 that ramps in over the first 5% of a 600 ms envelope and is gone by 80% of it, plus 100 ms of hit-stop.
  - **Reaching white:** a short bloom-like lift on the overlap only.
- **Cost:**
  - The whole post pass takes at most 2 ms per frame at 1440×900 on an integrated GPU.
  - Three tiers cap the pixel ratio at 1.5, 1.25 and 1.0. Low tier drops the split taps to one.
  - Under `prefers-reduced-motion`, keep the grade, grain and vignette; turn off the speed-driven split, the bulge animation and the wake.
  - If WebGL is unavailable, the Canvas2D game runs exactly as now.

**Transitions between levels and menus**
- **Never a hard cut.** Every level change, title↔level and level-select change goes through the WebGL pass.
- **The transition is the mechanic.** On the way out, red and blue separate along the level's lens axis while white collapses. On the way in, the next level's layers converge from offscreen and lock into white at the exit.
- **Durations** (in about twice out, after A24):
  - **Level complete → next:** about 450 ms out, about 900 ms in, no black hold (Racing's 500 ms black reads as loading).
  - **Title → level 1:** about 550 ms out, about 1.05 s in.
  - **Esc to title:** about 400 ms.
  - **Restart (R) and death respawn:** about 250 ms out and about 300 ms in. Restarts have to stay faster than the player's patience; this is the one place the game must beat the sites.
- **Easing: one token for the whole game.** Use a sharp ease-out in the family of (0.32, 0.72, 0, 1) for everything that arrives. Exits ease in (power-2 in). Reveals with a noise dissolve use expo-out with softness about 0.18. No linear moves except the iris-style hero reveal.
- **Input stays live:** the next level's simulation starts at the in-transition's midpoint, and input is accepted from 70% of the in-time.

**Hero moment (title screen)**
- **The title is a three-layer object, not a DOM headline.** "CHROMATIC DRIFT" is drawn as separate red, green and blue layers that rest slightly misaligned and only read as white where they overlap.
  - The pointer, through the wake mask and a small lens offset that follows the pointer, pulls red and blue across the type.
  - The mouse wheel turns the same lens as in play. The player learns the mechanic before pressing start.
- **The intro is staged within about 2.1 s:**
  - the near-black field (not #000) and grain from 0 s;
  - the three layers slide in from their lens directions over about 1.05 s on the signature ease;
  - the letters lock with a scattered stagger, 500 ms each, spread over about 1 s;
  - the white overlap blooms at about 2.1 s.
- **Press start:** the overlap squashes to 0.94 for 120 ms, springs to 1.015 over 160 ms, then hands into the title→level transition. Audio unlocks on that first input.
- **No click-to-enter gate.** Overworld and Pegassi both lost their recordings to theirs, and a jam judge loses interest the same way.

### Must exceed
- **Split by direction, not by angle.** All three references use a fixed or radial split angle. Here the split's direction and sign come from the lens, so the effect explains the rule.
- **Transitions are level design.** The out/in is the lens turning the old level away and the new one into alignment. No reference has a transition that means something.
- **The wake as a puzzle hint on the title only:** where the pointer passes, the layers briefly align to white.

### Won't do, and why
- **3D, PBR, iridescent materials and refraction shells.** The game is flat tiles. The optics belong in screen space, where the colour rule lives.
- **Heavy grade.** No saturation-2 grade, no LUT, no 16% corners, no hue shift: colour is gameplay information and the play area runs to the edges.
- **Motion blur, beyond the lens smear.** Platforming needs sharp edges for timing. Only the sliding layers smear, as the Canvas2D build already does.
- **Smooth scrolling or a Lenis-style lerp on game input.** Input stays 1:1; only presentation eases.
- **A sound or click gate before the title.** It costs the first impression.
