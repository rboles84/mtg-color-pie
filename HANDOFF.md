# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `candidate` — **Story 10: ring legibility, share link and PNG card.**
  Candidate committed 2026-10-11; awaiting Owner checks (ring pick, card, real clipboard).
- Last accepted: **Story 9** (small UI fixes, dossier ignore), `30f9a08`,
  accepted by the Owner 2026-10-11. Ledger:
  `docs/handoff-archive/story-9.md`. Earlier: `story-8.md`, `story-7.md`,
  `story-6.md`, `story-5.md`, `story-4.md`, `story-3.md`, `story-2.md`,
  `story-1.md`, `gate-e.md`, `gate-d.md`, `gate-c.md`; Gates A and B are in
  git at `5252333` and `b62131b`.
- Next: start Story 10 in a fresh session.
- Owner: Vox Mana.
- Allowed files: `vox-color/mechanical-explorer.html` (selection-ring CSS
  on `.pip` and `.node`; the identity panel `renderIdent` and its CSS, for
  the two new controls; new canvas and clipboard code beside it);
  `HANDOFF.md`.
- Allowed surfaces: the explorer's selected-colour rings; the identity
  panel (`#ident`) gains "Copy link" and "Save image".
- Prohibited: `data/`, the taxonomy, fixtures, recon truth; every `tools/`
  file; `vox-color/index.html` and `vox-color/color-wheel.html`;
  `runSelfTest` and its helpers (if a change would alter a self-test
  expectation, stop and ask); `vox-color/mechanical-examples.json`; the
  arrival and bridge code (`colorsKey`, `arrive`, `wheelRoute`) beyond
  reading them; `PRODUCT-DEFINITION.md`.
- Base commit: `473c0b0`.
- Candidate commit: `c9c104e`
- robqa class (see `.claude/skills/robqa/SKILL.md`): expected QA-3 (a
  generated URL that must land through the shell's existing route), same
  agent; ring and card visuals are Owner checks.

## Owner decisions

- Bundle: Unassigned "Ring legibility" and "Share link and PNG card for a
  colour selection" (Owner, 2026-10-11).
- Correction to the old follow-up: the dashed "no placement" ring
  (`.sc.t-n`, `mechanical-explorer.html:404`) **is committed**; it is not
  lost and is not reworked here. Black stays `#aca29a`.
- From the 2026-10-08 notes: the URL is the existing hash route plus
  `colors=`; the image is a canvas card with colour name, count and source
  line; counts only, no scores.

### Decided (Owner, 2026-10-11: the recommendations, D1(a), D2(a), D3(a))

- **D1. Link target.** (a) *Recommended:* the shell,
  `index.html#mechanical-color-pie/colors=<k>`, resolved against the
  explorer's own URL, as the wheel bridge already does. It needs HTTP, like
  the product. (b) The standalone page, `mechanical-explorer.html#colors=<k>`.
- **D2. Selection ring near W and R.** The selected pip's gilt ring
  (`--brass-l` `#dcbb73`) sits close to White `#f5efc7` and Red `#d97858`.
  (a) *Recommended:* robdev tries one change (e.g. a bone ring, or a wider
  dark gap) and posts before/after zooms of W, R and B selected; the Owner
  picks. (b) Leave as is and close the item.
- **D3. Card footer.** (a) *Recommended:* the source line ("Mark Rosewater,
  Mechanical Color Pie 2021, October 18, 2021 · counts computed by Vox
  Mana") plus the short Fan Content line ("Unofficial Fan Content permitted
  under the Fan Content Policy. Not approved/endorsed by Wizards."). (b)
  Source line only.

## Acceptance criteria

1. **Selection ring (D2).** Before/after zooms at 1:1 of W, U, B, R, G pips
   selected, and the same combination node selected in the compass. Owner
   approves the ring, or D2(b) closes it with no code change.
2. **Copy link.** With a lens set, "Copy link" in the identity panel puts
   the D1 URL for that key on the clipboard (canonical WUBRG key) and
   announces "Link copied" through the existing live region. It works by
   mouse and keyboard. If the Clipboard API is refused, the URL is shown
   selected in a read-only field instead. The explorer still never writes
   its own URL (Gate E rule).
3. **Link lands.** Over HTTP, the copied link opened in a new tab lands in
   the Mechanical Color Pie with that lens, for one key of each size
   (1–5 colours). Back from it leaves the shell as today.
4. **Save image.** "Save image" downloads `vox-mana-<key>.png`, 1200×630,
   drawn on a canvas after `document.fonts.ready`: the medal colours, the
   combination name (or colour words), the key, "N of 216 entries have a
   placement in …" with "computed", and the D3 footer. If the mana font is
   unavailable the medal shows letters, not blank boxes.
5. **Invariants.** Counts only: no tier bar, meter, or size-encoded tier;
   no mechanic detail on the card (one owner of detail). No new runtime
   dependency or library.
6. Self-checks unchanged (explorer 84/84 at 1440×900); console clean.
7. On commit, remove "Ring legibility" and "Share link and PNG card" from
   Follow-ups.

## Implementation

robdev, 2026-10-11. One file: `vox-color/mechanical-explorer.html`
(+83 / −1).

1. **Ring (D2).** Selected pip: dark gap 2px → 3.5px, gilt ring 1px → 1.5px,
   outer halo moved out to match. Node ring unchanged (its tile edge is
   not adjacent to a glyph). Before/after zooms of W U B R G selected,
   800×450 at 1:1, are with the Owner; **Owner picks**, or revert this one
   line for D2(b).
2. **Copy link.** `copyLink()` writes `shareURL(k)` =
   `index.html#mechanical-color-pie/colors=<k>` resolved against
   `location.href`; announces "Link copied". Refused → `#id-url` read-only
   field shown, focused and selected. Checked: refusal path (pane refuses
   clipboard) shows `http://localhost:8000/vox-color/index.html#mechanical-color-pie/colors=WR`;
   success path (stubbed clipboard, Enter key) copies the same URL and
   announces "Link copied". Explorer hash unchanged.
3. **Link lands.** Fresh loads of the shell link for G, UB, WUR, UBRG, WUBRG:
   the frame's pressed pips equal the key each time; the shell canonicalises
   its hash to `#mechanical-color-pie` as before.
4. **Save image.** `saveCard()` waits for the five page fonts plus Mana and
   `document.fonts.ready`, draws 1200×630, downloads `vox-mana-<key>.png`
   (checked: name, 1200×630, image/png). WR (Boros, glyphs) and WUBRG
   (letters with `no-mana` forced; then glyphs) inspected. Words wrap after
   en dashes.
5. Counts only; no meter, no mechanic text; no new dependency.
6. Self-check 84/84 at 1440×900 after the change; no console errors seen.
7. Follow-ups "Ring legibility" and "Share link and PNG card" removed.

Owner review round 1 (2026-10-11): ring kept; copy link and image work.
Fixes: lens pips U, R, G drop the sideways nudge (`.pip`-scoped override;
pixel-scanned ink is centred except Red, +.028em, now corrected); the card
medal gains the panel's radial hatching. Self-check 84/84 at 1440×900.

## QA

## Decisions needed

None open. D1–D3 decided: shell link, robdev proposes a ring with
before/after zooms for the Owner to pick, source line plus Fan Content line.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### From Story 6

- **`sfGet` pacing.** It waits 110 ms between calls, while Scryfall's
  `/cards/named` allows 2 per second. Not fixed (out of scope).
- **Browser pane at 0×0.** In a hidden pane the self-check reports 83 of 84
  (the plates fold-control geometry check); at 1440×900 it is 84 of 84,
  before and after Story 6. Environmental, not a regression.

### From Story 10

- **Glyph nudges elsewhere.** The shared `.ms-cost.ms-u/r/g::before` x
  nudges (`mechanical-explorer.html` ~424–427) still shift U, R, G right in
  the compass tiles and counts line; only the lens pips were corrected.

### Accepted minors

- **F4 (B13, D-O2).** Leaving the Mechanical Color Pie during its first load
  lets its self-test take focus in the off frame for about 8–12 ms. A fix
  would touch the protected self-test.
- **B12 (E-D1 A).** A bridge from the explorer into an already-loaded wheel
  costs two history entries; Back passes once through the prior wheel route.
  Step 0 of Gate E measured that it cannot be fixed within `src` and hash.

### When ready to host (Owner, 2026-10-08)

Parked until the Owner is ready to deploy; pick up as one story then.
- **Stale frames after an update.** A browser can keep serving
  a cached instrument inside the shell's frame after the file changes; the
  shell's own hard reload does not refresh it (seen in the Owner's E2 QA).
  Before hosting, version the frame URLs or set cache headers.

### Unassigned (each needs its own story)

- **Recon names vs today's wheel (Story 2, D4).** Includes the deferred
  `ALIASES` / `aka` rename (the recon tools parse those names).
  Regenerating recon against the current `color-wheel.html` drops the Nephilim and community
  names from 10 rows, puts the C16 lens "Chaos" on URG and "Orzhov" on
  Non-Red. Recon is pinned to `96ae609`'s wheel until this is resolved.
- **Article input not archived.** Only its sha256 is recorded (copyright);
  a future fetch may differ.
- **Housekeeping.**
  - **Periodic table: keep as-is (Owner, 2026-10-08).**
    `vox-color/mechanical-periodic-table.html` stays in place and unchanged,
    preserved for possible future work on its look and feel. The earlier
    idea to move it to a prototypes folder and restyle it is dropped.
    Record Three.js in `CONTEXT.md` only if it is ever taken into the
    product.
- **Example cards: done in Story 6** (`c3b33d1`); 214 of 216 entries show
  one. Entries 213 and 214 stay without one. A three-card chooser is an
  unscheduled idea.
- **Sourced flavour lines per colour (Owner, 2026-10-08).** Official sources
  only (Rosewater articles, magic.wizards.com); anything unsourced is left
  out. Backlog; needs recon and its own story.
- **"What can my colours do" panel (Owner, 2026-10-08).** Players set their
  colours in the existing Colors bar (no deck import for now). Design note
  still to write: what the panel recommends, how, and why. Category counts
  only, no scores.
- **Paused by the Owner:** the Scryfall query idea.
