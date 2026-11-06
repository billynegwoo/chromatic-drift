# Brief: Chromatic Drift, award-level craft pass

## Outcome chain
- **Task**: bring the award-site craft bar to the game: one lens over everything, motion that answers input, transitions instead of cuts, one hero moment, and an idea that becomes the interface (title, level select, transitions, HUD).
- **Outcome**: jam players who open it rate it high on Graphics, Audio, Innovation and Theme Interpretation, and finish more levels than they would have.
- **Underlying outcome**: a top placement in GitHub Game Off 2026 and a game people share ("you have to see this").

## How the outcome is seen, acted on and verified
- **See**: itch.io ratings per category once voting closes (Jan 1 2027, 13:37 PST); itch.io view/play/download counts; GitHub stars on the repo. The game itself runs no analytics and sets no cookies (only a localStorage progress key).
- **Act**: GitHub Pages deploys `main` on every push (about a minute); itch.io takes a manual zip upload, and builds freeze when voting starts.
- **Verify**: the itch.io rating page per category, and for the craft itself the fixed judge below before Dec 1.

## Expert framing
- **The gap**: what a top studio would do that the prototype doesn't: one graded image with film-like grain and a real lens (not a CSS overlay), every transition designed (level → level, death → respawn, title → play), the signature mechanic (the lens) felt in the optics of the whole frame, sound designed with the visuals, and a title screen that teaches the mechanic by letting you play it.
- **Raw material**: the game's own rules (three additive channels, the lens value k, the white exit) and the real history of colour separation: Maxwell's 1861 three-filter photograph, Prokudin-Gorsky's three-exposure glass plates (1905–1915), the Technicolor three-strip beam-splitter camera, broadcast colour test patterns, the optometrist's phoropter.
- **Instruments**: the deterministic playtest (`index.html?test`), `craft-check.mjs`, frame-stepped captures, `motionqa.mjs` (frame rate under a 4× CPU throttle), `framecheck.mjs`, `gl-lint.mjs`, the Codex juror and the Gemini motion juror.
- **The judge**: the playtest stays green on all 10 levels (keys and wheel); 0 FAIL from craft-check; 60 fps at DPR 2 under 4× throttle; the two blind jurors with the calibration strip, lower score kept.

## Facts (from the project)
- Single static `index.html` (Canvas2D + WebAudio, no dependencies, no build step) plus `playtest.js`; MIT; public repo billynegwoo/chromatic-drift; live on GitHub Pages from `main`.
- 10 levels: LENS, LEAP, TIDE, RELAY, FERRY, LIFT, CATCH, FLOOD, STAIRS, PRISM.
- Simulation: fixed 120 Hz step, deterministic; everything presentational lives in `fx` and never feeds back. The playtest depends on that.
- Controls: keyboard (layout-aware labels) and mouse wheel. No touch controls.
- Existing presentation: additive layer compositing with pre-baked blur glows, particles, squash/stretch, trail, CSS-free canvas title, scanlines (pattern overlay), vignette, an A-major pad whose red/blue voices detune with misalignment.
- Jam: submissions close Dec 1 2026, 13:37 PST; judged on Overall, Gameplay, Graphics, Audio, Innovation, Theme Interpretation; theme SHIFT.

## Assumptions (not told by the user)
- Players are jam participants on desktop browsers, 5–15 minutes per entry, often without sound at first.
- The game stays a single static page with no build step (GitHub Pages + itch.io zip). Adding one vendored library file is acceptable if it earns its weight; three.js is not assumed.
- Mobile: itch players are mostly desktop and the game needs a keyboard; a touch scheme is out of scope unless the user says otherwise, but the page must not break on a phone (it should say it needs a keyboard).

## Primary action
Press start and understand the lens within the first level (under 30 s), then keep going.

## Top objections
1. "I don't get what the lens does": the first 10 seconds must show it.
2. "I can't tell the colours apart" (colour vision deficiency, ~8% of men): every channel already has its own texture; the craft layer must not erase that.
3. "It looks like a prototype": the reason for this pass.

## Required outcomes (Phase 5 reconciles every line)
1. All 10 levels stay solvable: `index.html?test` passes with keys and wheel, sloppy-input results no worse than today (LEAP 11/12, LIFT 12/12, RELAY 9/12, CATCH 12/12, STAIRS 12/12, PRISM 9/12).
2. The simulation stays deterministic; new visuals stay presentation-only.
3. One graded image: post pass with grade, film grain, vignette, lens, chromatic split driven by the lens's motion, pointer wake if the concept calls for it.
4. Designed transitions: title → level, level → level (on the exit), death → respawn, level → end screen, Esc → title.
5. A hero moment on the title screen that teaches the mechanic.
6. Sound designed with the visuals (the existing pad and sfx are a start).
7. Reduced motion respected: fades only, no split, no shake, instant transitions; the game still playable.
8. Readability for colour vision deficiency kept (textures per channel), contrast of HUD and hint text held over the canvas.
9. 60 fps at DPR 2 under a 4× CPU throttle on desktop; a low tier when WebGL is missing or slow (falls back to today's Canvas2D look).
10. Works from `file://`, GitHub Pages and an itch.io iframe (focus, no external requests).
11. Keyboard layout-aware labels and the wheel keep working.
12. The itch.io submission (zip of the static files) before Dec 1 2026, 13:37 PST: the user's step, prepared for them.

## Capabilities (checked 2026-11-05)
- Subagents: yes. Browsing: Claude in Chrome and the built-in browser.
- Codex juror: logged in (ChatGPT). Gemini motion juror: agy 1.5.0. ffmpeg 9.0.2.
- Blender 5.2.3 (headless only), Substance 3D Designer installed.
- Playwright with Chromium in the skill's scripts folder.
- Open collections (Wikimedia Commons, Openverse) for public-domain references.

## Mode
Interactive: five checkpoints (world board, idea wall, concept cards, previs review, style frames).
