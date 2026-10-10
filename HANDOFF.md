# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `ready` — **Story 8: gate entry point, mana-font fallback and
  small cleanups.** Set up 2026-10-10; not started.
- Last accepted: **Story 7** (classic printings for 24 examples),
  `7f28e12`, accepted by the Owner 2026-10-10. Ledger:
  `docs/handoff-archive/story-7.md`. Earlier: `story-6.md`, `story-5.md`,
  `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`, `gate-e.md`,
  `gate-d.md`, `gate-c.md`; Gates A and B are in git at `5252333` and
  `b62131b`.
- Next: start Story 8 on the Owner's go, in a fresh session.
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
- Candidate commit:
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

## QA

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

### From Story 7

- **Five `EXAMPLE_CARD` lookups now unused.** Fog, Lure, Lhurgoyf,
  Reanimation and Drain Life have stored records that win in
  `hydrateDetail()`; their `EXAMPLE_CARD` lines in the explorer are dead.
  Left as is by Owner decision.

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

- **Mana-font fallback.** Without mana-font, the colorless glyph is 0 px
  wide (Gate C F1) and the wheel's mana glyphs render as boxes; the explorer
  shows letters instead.
- **`CLAUDE.md` read-order line counts** for `AGENTS.md`, `CONTEXT.md` and
  `MECHANICS-CONTRACT.md` drift by a few lines after Story 1 (story-1.md).
- **`MECHANICS-CONTRACT.md` "Nothing past step 2.5 has started."** is stale
  (steps 3–5 and 7 are done); not a preview statement, so not Story 1.
- **Stale docs.**
  - `CONTEXT.md` understates the C16 caution and dates "Absence" 10 May
    (Wizards prints May 13, 2013).
  - N3: an unwrapped line in `AGENTS.md`.
- **`tools/gate.py` has no entry point.** It exits 0 having checked
  nothing; the real gates run inside `check_taxonomy.py` and
  `check_recon.py`.
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
