# Chromatic Drift

A lens-shifting puzzle platformer made for [GitHub Game Off 2026](https://itch.io/jam/game-off-2026) (theme: **SHIFT**).

**▶ [Play in your browser](https://billynegwoo.github.io/chromatic-drift/)**

The world is split into three layers of light. Turn the lens and red slides one way, blue the other, while green stays put.

- **Red** is ground. You are red, so red is the only thing you can stand on.
- **Green** is lethal.
- **Blue** is water. Hold jump to swim.
- **The exit** only exists where all three layers overlap into white.

Standing on red, the lens carries you along with it. In mid-air it doesn't, and that's how you cross gaps you could never jump.

The game is filed as a 1950s patent, cut from paper like a film title sequence: each level is a drawing sheet (FIG. 1–10), dashed phantoms show where the next turn of the lens will move things before you commit, the door gets its number (18) when it lines up, and a death is circled and stamped ANTICIPATED. Finish all ten sheets and the patent is granted, with claims written from how you actually played. You can save it as an image.

## Play

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

| Action | Keys |
|---|---|
| Move | A / D or ← / → |
| Jump / swim | W, ↑ or Space |
| Turn the lens | Q / E or mouse wheel |
| Restart level | R |
| Mute (remembered) | M |
| Pick a level | 1–9, 0 |
| Level list (Brief Description of the Drawings) | Esc, then Esc to return, C for the cover |
| Save the patent (at the end) | S |
| File a continuation (at the end) | C |

Key labels follow your keyboard layout (on AZERTY the lens is A / E). Progress, claims and mute are kept in `localStorage`; nothing else is stored and nothing is loaded from the network. It needs a keyboard: on a phone the cover says so.

## Levels

1. LENS — line up the exit
2. LEAP — move the far ledge under you in mid-air
3. TIDE — red and blue drift in opposite directions
4. RELAY — the lens only turns so far
5. FERRY — carry the water with you
6. LIFT — the lens turns up and down
7. CATCH — red pushes, too
8. FLOOD — sinking the red raises the water
9. STAIRS — make headroom
10. PRISM — everything at once

## Continuation (endless mode)

After FIG. 10's grant, **FILE A CONTINUATION** (C, or click) carries the filing on as a continuation-in-part: FIG. 11, 12, … generated forever, each one solvable and, on average, harder than the last. Every sheet is built from 1–3 *beats* that generalise the ten levels (LEAP, RELAY, SNARE, TIDE on a horizontal lens; LIFT, STAIRS, CATCH, FLOOD on a vertical one) in the same level format, so it plays and reads like the others: numerals, phantoms, door 18, ANTICIPATED, claims.

- **Serial number.** Sheet *n* of serial number *S* is a pure function of (*S*, *n*). The serial is printed on each sheet (SER. NO. 8812); `index.html?seed=8812` opens a continuation under that serial (Space starts at FIG. 11). Without it each filing gets a random serial.
- **Validated with the real game.** Each candidate is played by its own scripted solution through the actual simulation in a hidden `index.html?validate` frame, time-sliced to a few ms per frame (works from `file://` and inside an iframe). It is rejected if the bot can't reach the door with keys or the wheel, if standing at the spawn is unsafe, or if it can be walked without the lens. The next sheets are generated while you play the current one.
- **Measured difficulty.** A reduced sloppy sweep (jumping 0/12/24 px early × turning the lens 0/100/200 ms late) gives each sheet a tolerance out of 9. The accepted band falls from about 0.9 at FIG. 11 to a floor of 4/9 (never below 0.35) by FIG. 40, while the lens's travel narrows from ±4 to ±3 to ±2 and sheets grow from one beat to three.
- **Score.** Claims allowed = sheets cleared; the best FIG. per serial number is kept in `localStorage`. Dying never ends a run. The Brief Description lists the run under the ten sheets; Esc and 1–9, 0 work as before.

The generator lives in [`endless.js`](endless.js).

## Tiers

A WebGL2 pass adds the paper (fibre, rough edges, layered shadows). Without WebGL2, or if frames run slow, the game falls back to the same drawing in Canvas2D. Reduced motion (the OS setting) makes cuts instant and stills the phantoms. For checking: `?__state=gl-off`, `post-off`, `reduced`, `frames` (step-driven, `window.__frames`), and `?demo` (a 23 s scripted tour).

## Automated playtest

Open `index.html?test` to play every level through the game's real keyboard and mouse-wheel handlers. The simulation runs at a fixed timestep, so results don't depend on frame rate. Timing-sensitive levels are also replayed with sloppy inputs: jumping early, turning the lens late. Results show over the sheet and in `window.PLAYTEST`.

When you change a level's layout, update its solution in [`playtest.js`](playtest.js).

The same page then tests the continuation: FIG. 11–40 for three fixed serial numbers, each generated through the hidden validator, replayed with the playtest's own verbs (keys and wheel) and re-measured. It checks that every sheet is solvable, that the tolerance never drops below 0.35 and trends down, and that each sheet is reproducible from its serial number. Results are in `window.ENDLESS_TEST` and on a line under the table.

## License

[MIT](LICENSE)
