# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `candidate` — **Story 8: gate entry point, mana-font fallback and
  small cleanups.** Implemented 2026-10-10; awaiting Owner review.
- Last accepted: **Story 7** (classic printings for 24 examples),
  `7f28e12`, accepted by the Owner 2026-10-10. Ledger:
  `docs/handoff-archive/story-7.md`. Earlier: `story-6.md`, `story-5.md`,
  `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`, `gate-e.md`,
  `gate-d.md`, `gate-c.md`; Gates A and B are in git at `5252333` and
  `b62131b`.
- Next: Owner runs the checklist under QA; then close and archive.
- Owner: Vox Mana.
- Allowed files: `tools/gate.py`; `vox-color/color-wheel.html` (mana
  fallback only); `vox-color/mechanical-explorer.html` (mana fallback and
  the five `EXAMPLE_CARD` lines only); `CONTEXT.md`, `AGENTS.md`,
  `MECHANICS-CONTRACT.md` (the named lines only); `CLAUDE.md` (read-order
  line counts only); `docs/card-examples-{map,needed,pilot,shortlist}.xlsx`
  (add as is); `HANDOFF.md`.
- Allowed surfaces: mana glyph rendering when mana-font fails, in the wheel
  and the explorer; `gate.py` run as a script.
- Prohibited: `data/`, the taxonomy, fixtures, recon truth; every other
  `tools/` file; `vox-color/index.html`; `runSelfTest` and its helpers,
  except where removing the five `EXAMPLE_CARD` lines forces a change (then
  stop and ask); the other 7 `EXAMPLE_CARD` entries, `NAMED_CARD`, the
  autocard entries; `vox-color/mechanical-examples.json`.
- Base commit: `ba1c285`.
- Candidate commit: `689bb08`
- robqa class (see `.claude/skills/robqa/SKILL.md`): expected QA-2 (one
  rendering fallback per page, tooling entry point, docs), same agent;
  reclassify after the pre-edit contract if the wheel change is larger.

## Owner decisions

- Bundle: Unassigned items "`tools/gate.py` has no entry point",
  "Mana-font fallback", "Stale docs", the `CLAUDE.md` line counts, the
  `MECHANICS-CONTRACT.md` stale line, the five unused `EXAMPLE_CARD`
  lookups (From Story 7), and the untracked xlsx files. The "What can my
  colours do" panel is out (Owner, 2026-10-10).
- The four `docs/card-examples-*.xlsx` files are committed as they are
  (Owner, 2026-10-10).
- The five `EXAMPLE_CARD` lines (fog, lure, lhurgoyf, reanimation, drain
  life) are removed; this reverses Story 7's "left as is".
- Mana fallback in the wheel matches the explorer's: letters in place of
  glyphs, no boxes. No new dependency, no self-hosted font.

## Acceptance criteria

1. **Gate.** `python tools/gate.py` runs the source gate and the taxonomy
   gate against the default data directory, prints PASS per gate, and
   exits non-zero if either fails (prove with one deliberate failure in a
   scratch copy of `data/`, not the real one). The imported functions keep
   their behaviour for downstream callers. The full gate chain passes.
2. **Mana fallback.** With the mana-font CDN blocked: the wheel's mana
   glyphs render as letters (W U B R G C), no boxes; the colorless glyph
   is not 0 px wide (Gate C F1). The explorer still shows letters; confirm
   its `no-mana` detection actually fires when the font fails (it tests
   the computed font-family, which may name Mana regardless). With the
   CDN up, both pages look unchanged. Self-checks unchanged
   (explorer 84/84 at 1440×900); `node --check` on the wheel's script.
3. **`EXAMPLE_CARD`.** The five lines are gone; those five entries still
   show their stored Story 7 plate with zero api.scryfall.com requests;
   the other seven still resolve as before.
4. **Docs.** `CONTEXT.md`: the C16 caution matches the source ("Designing
   Commander (2016 Edition)" reports the groups as achieved, with a
   per-colour rationale; see `gate-c.md` ~line 1002) and "Absence" is
   dated 13 May 2013. `AGENTS.md`: the N3 line is wrapped.
   `MECHANICS-CONTRACT.md`: "Nothing past step 2.5 has started." is
   corrected to the steps actually done (3–5 and 7). `CLAUDE.md`: the
   read-order line counts match `wc -l` after these edits.
5. **xlsx.** The four files are committed unchanged.
6. On commit, remove the bundled items from Follow-ups.

## Implementation

- `tools/gate.py` (+9): `__main__` block with `--data` (default `data`); runs
  `require_source_gate` then `require_taxonomy_gate`. The two functions are
  unchanged.
- `vox-color/color-wheel.html` (+24): `.no-mana` CSS gives every `.ms` its
  letter (W U B R G C) in mono, in its colour token, no disc; a
  `checkManaFont` IIFE at the end of the script calls
  `document.fonts.load('16px Mana', '\uE600')` and, if no face loads, sets
  `no-mana` and swaps the five SVG `.vertex-glyph` texts for their letters.
  One-way: it never removes the class.
- `vox-color/mechanical-explorer.html` (+7 −3): the five `EXAMPLE_CARD`
  entries removed. `checkManaFont` also asks `document.fonts.load`; the
  computed-font-family test alone did **not** fire when the stylesheet
  loaded but the font file failed (measured, see below).
- Docs: `CONTEXT.md` C16 caution (achieved, per-colour rationale) and
  "Absence" 13 May 2013; `AGENTS.md` long line wrapped; `MECHANICS-CONTRACT.md`
  line 402 now "Steps 3–5 and 7 are done; step 8 is withdrawn." (step 6 is
  not struck in the list, so no claim is made about it); `CLAUDE.md` counts
  456 / 363 / 295 (`HANDOFF.md` `~120` left as is).
- The four xlsx files added unchanged.

Criteria → evidence (built-in browser, scratch copies of each page served
from `vox-color/`, deleted afterwards; "blocked" = mana CSS pointed at a dead
port; "font fails" = a local `@font-face Mana` with a 404 src):

1. `python tools/gate.py` → both PASS, exit 0. Scratch copy of `data/`
   with a duplicated taxonomy assignment → "taxonomy gate FAILED", exit 1.
   Real `data/` untouched. Full chain passes (53 recon assertions).
2. Wheel, blocked: `no-mana` set; vertex glyphs read WUBRG in IBM Plex Mono;
   `.ms` content "W"… ; Combine-at-rest `.ms-c` content "C", 9.0 px wide.
   Wheel, font fails: `no-mana` set, glyphs WUBRG. Wheel, CDN up: no class,
   glyphs U+E600–E604, `.ms` font Mana. Explorer, blocked: fires (before
   and after). Explorer, font fails: did **not** fire before the change,
   fires after. Explorer CDN up: no class; self-test 84/84 at 1440×900.
   `node --check` on the wheel's extracted script: OK.
3. Fog, Lure, Lhurgoyf, Reanimation, Drain Life: stored plate, 0
   api.scryfall.com requests each. The other seven: 1 request each, plate
   shown. Note: if `mechanical-examples.json` fails to load, those five now
   show no plate (previously they fell back to Scryfall).
4. As above. 5. `git diff --cached` on the xlsx: added, unmodified.

Same-agent QA (QA-2). Visual look of the letter fallback not checked by
screenshot (the pane would not render one); Owner check below.

## QA

Owner checklist (start `py -m http.server 8000` in the repo root first):
1. http://localhost:8000/vox-color/color-wheel.html — looks as before.
2. DevTools → Network → block request domain `cdn.jsdelivr.net`, reload:
   the five wheel vertices show W U B R G letters, no boxes; Combine with no
   colour selected shows a "C" in the colorless sentence; tile pips show letters.
3. Same block on http://localhost:8000/vox-color/mechanical-explorer.html —
   letters, as before. Unblock; open Fog and Lure — stored Alpha plates.
4. Hard reload of `vox-color/color-wheel.html` via `file://` with the block
   on (human-only check).

## Decisions needed

None open.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### From Story 6

- **`sfGet` pacing.** It waits 110 ms between calls, while Scryfall's
  `/cards/named` allows 2 per second. Not fixed (out of scope).
- **Browser pane at 0×0.** In a hidden pane the self-check reports 83 of 84
  (the plates fold-control geometry check); at 1440×900 it is 84 of 84,
  before and after Story 6. Environmental, not a regression.

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

- **Recon names vs today's wheel (Story 2, D4).** Regenerating recon
  against the current `color-wheel.html` drops the Nephilim and community
  names from 10 rows, puts the C16 lens "Chaos" on URG and "Orzhov" on
  Non-Red. Recon is pinned to `96ae609`'s wheel until this is resolved.
- **Article input not archived.** Only its sha256 is recorded (copyright);
  a future fetch may differ.
- **Small UI items.**
  - A doubled period in an entry's accessible name ("…with flying..").
  - The explorer's 1.5 px focus outline renders at 1 px at 1x.
  - The hard-coded `.panel` max-height.
  - Re-add `scrollbar-gutter:stable` to the wheel.
  - A headless-only scroll after the explorer loads; check it in a headed
    browser.
- **Housekeeping.**
  - Rename `ALIASES` and the shard `aka` field.
  - Commit or gitignore `docs/DATA-DOSSIER.html`.
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
- **Share link and PNG card for a colour selection (Owner, 2026-10-08).**
  URL is the existing hash route plus `colors=`; image is a canvas card with
  colour name, count and source line.
- **Ring legibility (Owner, 2026-10-08).** "No placement" rings are now
  dashed in the explorer (`.sc.t-n`, uncommitted). Black stays `#aca29a`
  (mana-font's own black); revisit only if it still blends in. Open: gilt
  selection rings sit near W and R.
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
