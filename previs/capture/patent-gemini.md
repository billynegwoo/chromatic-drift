### 1. Legibility Within 10 Seconds (Without Instructions)

**Partially legible in motion, but not yet legible *prospectively* from the drawing alone.**

* **What reads clearly:**
  * **Opposite layer shift & additive exit (`0.50 s–2.33 s`):** Across the two lens turns in `FIG. 1` (`0.50 s–1.00 s` and `1.50 s–2.33 s`), it is immediately clear that turning the lens slides the red layer (`12`) left and the blue layer right toward the stationary green bar, and that overlapping all three bars creates a solid white door (`1.67 s`) that draws a leader line (`2.00 s`) and types numeral `18` (`2.17 s`).
  * **Carried vs. not-carried outcome in action (`7.33 s–9.00 s`):** In `FIG. 2`, jumping into the gap (`7.33 s`) before turning the lens (`7.50 s–7.83 s`) visibly slides the far red ledge (`12`) underneath the airborne runner (`10`) without displacing the runner horizontally, whereas turning the lens while standing on the red floor (`8.67 s–9.00 s`) carries `10` into the spikes (`14`).
* **What fails without reading the bottom caption (`0.00 s`, `6.33 s`):**
  * **Phantoms do not appear before the player commits (`0.00 s–0.33 s`, `1.17 s–1.33 s`, `6.33 s–7.33 s`, `8.17 s–8.50 s`):** The pitch states that *"the rule can be read off the drawing before the player commits,"* but at rest no phantom outlines (`10'`, `12'`, `16'`) are visible at all. They only pop in *after* a lens input has started (`0.50 s`, `1.50 s`, `7.50 s`, `8.67 s`) and vanish ~`0.67 s` later (`1.17 s`, `2.33 s`, `8.17 s`). At `8.33 s–8.50 s`, when `10` stands beside the spikes `14`, there is no `10'` phantom warning on screen prior to the fatal turn at `8.67 s`.
  * **Phantom direction is inverted on reverse lens turns (`8.67 s–8.83 s`):** When the lens turns counter-clockwise in `FIG. 2` (`8.67 s–8.83 s`), the red floor `12` carries `10` **right** into spikes `14`, yet the phantom outlines `10'` and `12'` draw to the **left** of the runner and ledge—pointing away from the spikes and contradicting the actual movement.
  * **Hazard recognition relies on spike geometry, not colour (`6.33 s–9.00 s`):** Because red, green, and blue are rendered as muted cross-hatched fills on dark photostat stock, "green kills" only reads without text because `14` is shaped like sawtooth spikes (`6.33 s`).

---

### 2. Ownability

**Highly ownable presentation of a familiar mechanic.**

* Shifting RGB colour layers and overlapping channels to form geometry is an established puzzle-platformer trope (*Hue*, *Closure*), and bureaucratic/technical line-art games exist (*Return of the Obra Dinn*, *Braid*).
* However, **using 1950s USPTO patent-drafting notation as the live HUD and state-prediction layer is distinct and ownable**: dash-dot phantom outlines with primed reference numerals (`10'`, `12'`, `16'` at `0.50 s–1.00 s`) to preview mechanical displacement, an unnumbered assembly that only receives its leader line and part number `18` once aligned (`2.00 s–2.17 s`), and examiner adjudication stamps (`ALLOWED / FIG. 1` at `5.17 s`; red-pencilled `ANTICIPATED / cf. attempt 1` at `9.00 s`) cohere into a specific, memorable identity.

---

### 3. Structural Integration vs. Decoration

**Carries the macro structure well; under-delivers on the micro puzzle loop.**

* **Where it carries the structure:**
  * **Levels & Progression:** Every level is a numbered sheet in a single 10-sheet filing (`FIG. 1 LENS / SHEET 1 OF 10` at `0.00 s`; `FIG. 2 LEAP / SHEET 2 OF 10` at `6.33 s`), and clearing a level ratifies the sheet with `ALLOWED / FIG. 1` (`5.17 s–6.17 s`).
  * **Alignment:** The exit does not exist as a numbered part on the drawing until the three colour bars converge into white (`1.67 s`), triggering the leader line (`2.00 s`) and typed numeral `18` (`2.17 s`).
  * **Death & Retry Loop:** Death at `9.00 s` is marked directly on the blueprint with a red examiner's pencil box around the collision, stamped `ANTICIPATED / cf. attempt 1` (`9.00 s–9.33 s`), and logged by incrementing the sheet counter from `attempt 1` to `attempt 2` (`9.00 s–9.83 s`).
* **Where it is still decorative:**
  * Because the phantom outlines (`10'`, `12'`, `16'`) only appear reactively *after* turning the lens and only compute offsets for one direction (`22` left / `24` right), the patent notation is currently acting as an after-the-fact visual flourish rather than the pre-commit sight-reading tool the concept promises.

---

### 4. Motion & Visual Faults

1. **Wrong phantom direction on counter-clockwise turn (`8.67 s–8.83 s`) — *severely hurts legibility*:** On the fatal turn in `FIG. 2`, dial `20` rotates counter-clockwise (solid hand moving from `+1` to `0`, dashed hand at `-1`) and the red floor carries `10` **right** into spikes `14`. Yet `10'` and `12'` are drawn to the **left** of `10` and `12` (and `16'` to the right), previewing a clockwise step instead of the counter-clockwise step being taken.
2. **Phantom label collision and inaccurate step preview in `FIG. 1` (`0.50 s–1.00 s`, `1.50 s–2.17 s`) — *hurts legibility*:**
   * At `0.50 s`, while the bars slide into their first turn, the primed numerals `16'` and `12'` collide directly on top of each other (`16'12'`) over the center green bar.
   * At `0.67 s–1.00 s` (after turn 1, when one more turn will align the bars in the center), `12'` and `16'` do not preview the center alignment position; instead, `12'` sits on the left bar and `16'` on the right bar—the exact same screen positions they show *after* the second turn at `1.67 s–2.17 s`.
3. **Reactive phantom pop-in/out timer (`0.00 s–0.33 s`, `1.17 s–1.33 s`, `2.33 s`, `8.17 s–8.50 s`) — *hurts legibility*:** Even allowing for greybox pop-ins, hiding the phantoms at rest and timing them out ~`0.67 s` after a turn defeats pre-commit reading.
4. **One-frame `10'` flash on landing (`7.83 s–8.00 s`) — *minor distraction*:** While `10` is airborne during the lens turn (`7.50 s–7.83 s`), `10'` is omitted and a vertical dashed drop-line appears beneath `10` at `7.83 s`. When `10` touches down at `8.00 s`, the phantom timer from `7.50 s` is still active for one step, causing `10'` to pop in at `8.00 s` and immediately vanish at `8.17 s`.
5. **Runner numeral `10` clipping inside door `18` (`5.00 s–6.17 s`) — *minor visual fault*:** When `10` enters the white door at `5.00 s` and holds through the `ALLOWED` stamp (`5.17 s–6.17 s`), the numeral `10` and its short leader line render in grey inside the upper edge of the white door block.
6. **Hard cut between levels (`6.17 s–6.33 s`) — *does not hurt legibility*:** Expected in greybox, though the `1.00 s` static hold after the `ALLOWED` stamp (`5.17 s–6.17 s`) feels slightly long.

---

### 5. Verdict: **RESHAPE**

**What to reshape before production:**
1. **Make phantom outlines prospective at rest, not reactive after input:** Show the next-step phantoms (`10'`, `12'`, `16'`) continuously (or on Q/E hover / last-used direction toggle) *before* the player commits, and only draw `10'` when `10` is grounded on red (`12`) so the carried/not-carried rule is genuinely readable before pressing the key.
2. **Fix bidirectional phantom math and legend arrows (`22`, `24`):** Because the lens turns both ways (Q and E / wheel up and down), phantoms (`10'`, `12'`, `16'`) and the legend arrows `22`/`24` must reflect the actual direction of the turn (fixing the inverted left-pointing `10'`/`12'` during the rightward spike death at `8.67 s–8.83 s` and the misplaced `12'`/`16'` preview at `0.67 s–1.00 s`).
3. **Stagger leader-line heights on converging parts:** Offset the leader-line angles or heights for `12'` and `16'` so their numerals never overlap (`0.50 s`), and suppress `10`'s leader label once inside door `18` (`5.00 s–6.17 s`).

**Single biggest production risk:**
As puzzles scale beyond two simple platforms in a 5–15 minute desktop jam game (adding multiple red ledges, blue water volumes, and green hazards), **visual clutter from simultaneous dash-dot phantom projections, hatched colour fills, and primed leader-line numerals threatens to make complex sheets unreadable**. In a patent drawing, every moving element having a current hatched shape, a dash-dot phantom shape, and two leader-line callouts doubles the linework density; if players can turn the lens in *either* direction (`+1` or `-1`) at any moment, showing both possibilities at once will overwhelm the blueprint with overlapping dashed boxes, while showing only one direction risks misleading the player whenever they reverse the lens. Solving how the drawing cleanly previews bidirectional Q/E lens steps without turning mid-game sheets into illegible line soup is the make-or-break design problem for production.
