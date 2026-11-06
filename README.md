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

## Tiers

A WebGL2 pass adds the paper (fibre, rough edges, layered shadows). Without WebGL2, or if frames run slow, the game falls back to the same drawing in Canvas2D. Reduced motion (the OS setting) makes cuts instant and stills the phantoms. For checking: `?__state=gl-off`, `post-off`, `reduced`, `frames` (step-driven, `window.__frames`), and `?demo` (a 23 s scripted tour).

## Automated playtest

Open `index.html?test` to play every level through the game's real keyboard and mouse-wheel handlers. The simulation runs at a fixed timestep, so results don't depend on frame rate. Timing-sensitive levels are also replayed with sloppy inputs: jumping early, turning the lens late. Results show over the sheet and in `window.PLAYTEST`.

When you change a level's layout, update its solution in [`playtest.js`](playtest.js).

## License

[MIT](LICENSE)
