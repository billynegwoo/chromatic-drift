# Chromatic Drift

A lens-shifting puzzle platformer made for [GitHub Game Off 2026](https://itch.io/jam/game-off-2026) (theme: **SHIFT**).

**▶ [Play in your browser](https://billynegwoo.github.io/chromatic-drift/)**

The world is split into three layers of light. Turn the lens and red slides one way, blue the other, while green stays put.

- **Red** is ground. You are red, so red is the only thing you can stand on.
- **Green** is lethal.
- **Blue** is water. Hold jump to swim.
- **The exit** only exists where all three layers overlap into white.

Standing on red, the lens carries you along with it. In mid-air it doesn't, and that's how you cross gaps you could never jump.

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
| Mute | M |
| Pick a level | 1–9, 0 |
| Title screen | Esc |

Key labels follow your keyboard layout (on AZERTY the lens is A / E).

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

## Automated playtest

Open `index.html?test` to play every level through the game's real keyboard and mouse-wheel handlers. The simulation runs at a fixed timestep, so results don't depend on frame rate. Timing-sensitive levels are also replayed with sloppy inputs: jumping early, turning the lens late. Results show under the game and in `window.PLAYTEST`.

When you change a level's layout, update its solution in [`playtest.js`](playtest.js).

## License

[MIT](LICENSE)
