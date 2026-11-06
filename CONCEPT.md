# Concept: Letters Patent

The game's rules stay as they are. This concept decides how the game presents itself: the one idea that becomes its interface (title, level select, transitions, HUD, sound) and the optics of the whole frame.

**Pitch (one sentence):** Chromatic Drift is presented as an examiner's photostat of a 1950s patent filing, one drawing sheet per level, and the lens is drawn the way patent drawings draw moving parts: the next position as dash-dot phantom outlines with primed numerals, so the rule can be read off the drawing before the player commits.
**World:** a patent filing: cover sheet, Brief Description of the Drawings, FIG. 1–10 on numbered sheets, reference numerals (runner 10, brick 12, spike 14, water 16, door 18, lens 20, arrows 22/24), the Patent Office colour-hatching code (red vertical, blue horizontal, green diagonal; the three-way overlap is solid white), the examiner's red pencil and stamps, the claims, the grant.
**Mechanic / unit of interaction / pace owner:** the lens (wheel or Q/E) previewed by phantoms; unit: lens; pace: player.
**How the idea becomes the interface:** title = the cover sheet with a live representative figure that teaches the carry rule; level select = Brief Description of the Drawings; transition = a photostat exposure slit along the next level's lens axis; HUD = lens dial 20 in the margin and the sheet furniture; death = red-pencil circle on the contact point + ANTICIPATED, your failed path kept as dotted prior art; end = the negative inverts to the issued positive, Letters Patent with your claims, saved as PNG.
**Signature moment:** door 18 gets its number: unlabelled until the three hatchings coincide, the cell turns solid white, a leader line draws itself in and a typewriter strikes 18. Ownable because it needs both the colour-hatching code (white = all three line directions) and patent numerals (a part exists in the document once it is named).
**Journey:** opening shot: cover sheet, live figure (0–10 s teaches the carry rule) → accelerate: FIG. 1–3 short, one new rule each → inhale: the Brief Description page between FIG. 5 and 6 → peak: PRISM's door 18 → pauses: claims typed after each level → second peak: the inversion to the issued positive → exit: the Letters Patent PNG.
**Hidden details:** a perfect run's claim reads "wherein no alternative embodiment was required"; FIG. 0 calibration card (Larky bars) behind the cover; the grant's embossed seal.

## Gravity
Three fresh agents given only the brief (2026-11-05) landed on one concept:
- **World**: three slide projectors / beams / a three-gun projector throwing coloured light on a black wall; additive light maths, bloom, dust in the beams, film grain or phosphor glow.
- **Title**: CHROMATIC DRIFT split into R, G, B ghosts that converge into white letters on start.
- **Transitions**: the finished level floods to white, then splits like a prism into three beams/plates that slide in and lock into the next level.
- **Death**: the red character tears into RGB fringes (glitch), or bleaches out like an overexposed slide.
- **Sound**: one voice per layer, red and blue detune against green with the lens (one also pans them in stereo); alignment resolves into a unison/major chord with a focus click.
- **Signature moment**: convergence at the exit: aberration snaps to zero, the screen blooms white, the chord resolves.
Category conventions (reference board): Hue's background-colour swap; Gris's colour returning to the world.
Note: the prototype already does half of this (RGB-split title, detuning pad). A concept inside this list cannot be ownable.

## Candidates
**Fan-out** (2026-11-05): 6 isolated branches, 6 ideas each. Frames: medium swap, material, felt state, reveal (site frames); inversion, remove the load-bearing assumption (cross-domain, the second wild). Full pool: `checkpoints/fanout/pool.md`; scores by the Codex juror (gpt-6-astra, text only): `checkpoints/fanout/scores.json`.

**Clusters by behaviour** (best weighted score, novelty 0.35 / viability 0.40 / fit 0.25):
1. Your run becomes a historic colour photograph: re4 7.10, me1 6.70, ma1 6.35, in1 6.35, ma5 6.05, xa6 5.65, me5 5.65, ma3 5.55
2. The game is a print shop: me2 7.35, in5 7.10 (the only idea without a trap), xa3 6.80, me6 5.40
3. A second way of seeing the level: in6 6.50, in3 6.15, re1 5.40
4. A document narrates how you played: me3 6.30, re5 3.15
5. Dive into the screen's own pixel: in2 5.95, re3 5.45
6. An instrument you feel: fe5 5.95, fe4 5.75, ma6 5.60, me4 5.35, ma4 5.30, ma2 4.70, fe6 4.55, fe1 3.80
7. The eye exam: in4 5.65, re2 4.40, fe2 3.55, xa5 3.55
8. No cuts between levels: re6 5.15, xa2 5.00, xa1 4.35, xa4 3.70

**Override**: the juror flagged 35 of 36 as traps. Following concept.md §4 step 5, the deepening set is the clean idea (in5) plus the best-weighted idea of other clusters, one per cluster: re4, in6, me3. Each card must answer its trap. me2 (7.35) shares cluster 2 with in5 and stays a revival option.

**After the idea wall**: in5 (sparked, already in) and xa2 (sparked, trap: adds new places to die between the real puzzles; its card must answer it). Deepening set: in5, re4, in6, me3, xa2.

**Concept cards** (full text: `checkpoints/cards.json`). Spread table:

| card | from | unit | sequence | pace | entry | payoff |
|---|---|---|---|---|---|---|
| k1 Reversed Out | in5 + me2 | lens (register screw, heard as a flam) | docket → feed sheet → impressions → peel the door → pull the sheet | player | scroll the docket's register targets | guillotined spoil strip, OK TO PRINT proof |
| k2 Three Exposures | re4 | time (hidden exposures) / lens | plate box → darkslide → play → print card | player | the maker's plate in the holder | your run as a three-colour chronophotograph; the death print |
| k3 The Red Specification | in6 | look (hold SHIFT) | cover plotted → FIG. 1 bars → print colour → walk into WHITE | player | plotted cover with labelled bars | granted patent, claims from your run |
| k4 Letters Patent | me3 | lens (phantom previews) | cover with live figure → FIG. n → claim → exposure slit | player | phantom 12' teaches the carry before play | door 18 gets its number; negative → positive grant |
| k5 Head Leader | xa2 | move (playable leader) | PICTURE START → leader 8..2 → pop → shot | player | the leader as tutorial | land on the 2 as it pops; the scratch left on the lamp |
k3 and k4 share the patent world but differ in what the player does; kept as two cards.

**Thresholds** (Codex juror, 1–5; pass: ownable ≥ 4, organizes ≥ 4, serves ≥ 4, buildable ≥ 3; `checkpoints/thresholds.json`):

| card | ownable | organizes | serves | buildable | pitch | embed | shareable | signature | verdict |
|---|---|---|---|---|---|---|---|---|---|
| k0 obvious (projectors) | 1 | 4 | 3 | 5 | 5 | 5 | 2 | 2 | fail (incumbent) |
| k1 Reversed Out | 4 | 5 | 3 | 4 | 4 | 4 | 4 | 4 | fail: serves |
| k2 Three Exposures | 4 | 4 | 3 | 4 | 5 | 4 | 5 | 4 | fail: serves |
| k3 The Red Specification | 4 | 5 | 2 | 3 | 3 | 3 | 3 | 3 | fail: serves |
| k4 Letters Patent | 4 | 5 | 4 | 3 | 4 | 3 | 4 | 3 | PASS |
| k5 Head Leader | 3 | 5 | 4 | 3 | 4 | 4 | 3 | 4 | fail: ownable |

## Previs
Greyboxed 2026-11-05 as copies of the game with only rendering changed (`previs/patent.html`, `previs/leader.html`), each with `?__state=frames` (window.__frames) and a scripted `?demo`. Both give playtest results identical to the game on all 10 levels. Captures: `previs/capture/<name>/motion/` (contact sheet, every-frame MP4), frame checks in `previs/capture/<name>/framecheck/`, verdicts in `previs/capture/<name>-codex.md` and `-gemini.md`.

**Letters Patent**: both jurors RESHAPE. Ownable (the notation and the examiner's marks are a coherent identity) and it carries the structure (door 18 earned at alignment, ALLOWED, ANTICIPATED, the sheet per level). Faults: phantoms appear only after the turn, so the move can't be read before committing; the 10' label sits on the wrong side of its outline (Gemini read it as a wrong-direction phantom; the frame at 8.7 s shows the geometry is correct and the label misplaced: a real labelling bug); 12'/16' labels collide; carried vs not carried needs a staged pair. Framecheck: 6 events (phantom pop-in/out, hard level cuts, the death freeze), all expected in a greybox. Production risk named by both: clutter (hatching + phantoms + numerals) once levels get busier.

**Head Leader**: both jurors RESHAPE. The playable leader and the frame advance are the ownable part; the film border alone would read as a retro filter. Faults: the camera follows the runner, so the mid-air lens move is visually cancelled by the scroll; the trimmed leader (4, 3, 2) is a 1.3 s hold-right with no lens; incoming shots appear empty and pop in after the advance; a 1 s hold after the door stalls the rhythm; death was not in the demo. Can't-fail check: no death in 42 policy runs, a recovery path back to the 2. Production risk: spectacle obscuring causality.

**Recommendation to the client**: Letters Patent (its signature is the lens lesson itself); Head Leader as the alternate, revived if the levels were restaged around a fixed camera.

## Decision
**Winner: Letters Patent** (client pick at the previs review, 2026-11-05, matching the recommendation; it was the only card to pass every threshold).
**It must answer the previs findings before style frames**: phantoms shown before the player commits (the next stop in both directions, faint at rest, strong in the last direction used), each label beside its own outline and never colliding, carried vs not carried staged as a pair on the cover figure and in FIG. 1–2, and a clutter budget (hatch density, numerals only where a part first appears).
**What it costs**: the warmth of Three Exposures' personal photograph and Reversed Out's tactile press; a dark, technical register that must still feel juicy (sound and stamps carry that).
**Losers and what would revive them**: Head Leader, if the levels were restaged around a fixed camera and the leader carried a real lens lesson; Reversed Out, if the ink tints held their contrast in a small embed; Three Exposures, if the opening taught the lens in the first 10 s.

## Ledger
Last three builds (`ledger.mjs recent 3`): Encaisser (speedrunner frame; fuse board; pale plaster, ink, breaker red; handwriting + plain serif), Cintres « Affiche » (theatre fly system; newsprint, black ink, vermilion; display), Volée (one-sentence constraint; a copperplate plate engraved live, outline then hatching; blue-grey laid paper, iron-gall ink, bronze; 19th-c. Modern serif).

| axis | Letters Patent | Head Leader |
|---|---|---|
| frame | medium swap (a patent filing) | remove the load-bearing assumption (no cuts) |
| mechanic | phantom previews of the next lens stop | a playable countdown leader between levels |
| hero composition | a live patent figure on the cover sheet | the PICTURE START frame becoming leader 8 |
| palette band | dark (photostat negative, blue-black) | dark warm (tungsten-lit film) |
| display class | drafting/typewriter lettering | leader stencil numerals |

**Collision**: Letters Patent shares Volée's engraved-hatching language (a plate drawn in hatching). It departs on palette (negative, dark), type (drafting, not Modern serif) and function (the hatching is a colour code that carries game rules). The build must not reuse Volée's "outline then hatching" engraving reveal as its transition; the exposure slit stays. Head Leader collides on no axis.

## What we are NOT doing

## Risks and fallbacks
- **Legibility of the carry rule before committing** (both previs jurors): phantoms at rest, labels beside their outlines, a staged pair; verified by a captured pair in the style frames and the final jury.
- **Clutter** (both jurors): hatch density budget, numerals only where a part first appears, hatch pitch locked to device pixels, phantoms faint at rest.
- **Colour vision deficiency**: the hatching direction carries each channel without colour; keep it.
- **No WebGL / slow GPU**: the Canvas2D drawing is the fallback tier; the post pass only grades and adds optics.
- **Reduced motion**: phantoms static, transitions instant, no halation flicker.

## User checkpoints

### World board (board, 2026-11-05T17:22:10.372Z)

**love** (9)
- Maxwell's tartan ribbon, 1861
- Newton's Opticks, plate of optical diagrams
- Larky's colour test pattern patent, 1956
- Red/cyan 3D glasses
- Gris (Nomada, 2018): colour returns to a watercolour world as you progress
- Fez (Polytron, 2012): rotate the world to change what's reachable
- Celeste (2018): tight jumps, generous forgiveness, juicy feedback
- Inside (Playdead, 2016): one grade, film grain, no UI at all
- Return of the Obra Dinn (Lucas Pope, 2018): a whole game rendered through one historic display process

**keep** (13)
- Broadcast colour test cards and colour bars
- Newton splitting sunlight through a prism in a darkened room, 1666
- GitHub Game Off 2026, theme: SHIFT
- A prism splitting white light into a band of colours
- Red/cyan 3D glasses
- The screen's own red, green and blue subpixels: the game is made of the medium it runs on
- The red runner (you), red bricks, green spikes, blue water, the white door
- The relief of a blurry chart snapping into focus
- A chord going out of tune and resolving
- The exit is white: every colour at once
- Shift, slide, drift apart
- Focus: the picture snaps sharp
- Converge into white

**What it changed**: the 13 kept items lead the inventory the fan-out gets, marked "client: this is us"; nothing was struck; no field answers. The loved references join REFERENCES.md as "client loves" (traits: Maxwell's soft historic colour, Newton's engraved diagrams, the patent's labelled bars, the anaglyph's two pulled-apart channels; Gris's colour returning, Fez's world rotation, Celeste's forgiveness and feedback, Inside's single grade and grain with no UI, Obra Dinn's whole game through one historic display process). The Avoid list is unchanged (no anti-reference was marked).

### Idea wall (wall, 2026-11-05T17:51:41.485Z)

**spark** (2)
- All sound is a printing press: each lens click-stop is an impression thunk; every restart cranks a fresh sheet; spoiled sheets pile up as a ream counting your deaths.
- No cuts between levels: a film countdown leader is a playable corridor (numbers as red platforms, sprocket holes as water, scratches as green).

### Concept cards (cards, 2026-11-05T18:09:22.883Z)

**pick** (2)
- Letters Patent: the game as an examiner's photostat of a 1950s patent filing; the lens shown as dash-dot phantom lines with primed numerals.
- Head Leader: one unbroken reel of film; between shots you run across a playable countdown leader and land on the 2 as it pops.

**What it changed**: both go to the previs gate. Head Leader failed the ownable threshold (3/5: the projector world is close to Gravity); it is the client's pick, so it is greyboxed, and its cost is recorded here: to stay ownable it must lean on the film *machine* (gate, claw, scratch in the gate, rack roll, the 2-pop, the tail run-out) and never on projector beams, bloom or white floods.

### Idea wall: what it changed
in5 was already in the set (no change). xa2 joins the deepening set as a fifth card, exempt from the trap rule; its card must answer the trap (new places to die between puzzles). No kills, no riffs, no notes.

### Previs review (review, 2026-11-05T20:25:49.318Z)

**pick** (1)
- Letters Patent (recommended): the game as an examiner's photostat of a 1950s patent filing; phantom outlines preview the lens; door 18 numbered at alignment; deaths circled and stamped ANTICIPATED.

**What it changed**: Letters Patent is the winner. The gate questions were left unanswered, so the jurors' concerns stand as written and carry into Risks: legibility of the carried/not-carried rule before committing, and clutter. Both are checked in the style frames (a captured carried/not-carried pair) and the jury.

## Assumptions
- Players are jam participants on desktop, 5–15 minutes per entry (BRIEF.md).
