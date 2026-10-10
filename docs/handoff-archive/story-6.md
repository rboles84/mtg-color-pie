# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `accepted` — **Story 6: stored example card on every entry.**
  Owner spot-checked ~20–30 entries and approved, 2026-10-10.
- Last accepted: **Story 5** (the Combine bounce), `b29794d`, accepted by
  the Owner 2026-10-08. Ledger: `docs/handoff-archive/story-5.md`.
  Earlier: `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`,
  `gate-e.md`, `gate-d.md`, `gate-c.md`; Gates A and B are in git at
  `5252333` and `b62131b`.
- Next: Story 7 (printing swaps).
- Owner: Vox Mana.
- Allowed files: `vox-color/mechanical-explorer.html`,
  `vox-color/mechanical-examples.json` (new), `HANDOFF.md` (ledger and
  Follow-ups only).
- Allowed surfaces: the explorer's detail panel (`boot()` load,
  `hydrateDetail()`).
- Prohibited: `data/`, the taxonomy, `vox-color/color-wheel.html`,
  `vox-color/index.html`, every other file; `runSelfTest` and its helpers;
  `addCite`, styling, `sfGet` and its pacing; the 12 `EXAMPLE_CARD`
  entries, `NAMED_CARD`, the autocard entries.
- Base commit: `4b789fb`.
- Candidate commit: `c3b33d1` (committed on Owner approval, 2026-10-10).
- robqa class (see `.claude/skills/robqa/SKILL.md`): QA-2 (one
  component's interaction; new data file is separate from the frozen source
  layer), same agent.

## Owner decisions

- Inputs: `docs/card-examples-mapping.md` ("## The map") and
  `docs/card-examples-printings.json`, used as given.
- Pick: one non-empty Example cell per entry, `random.Random(2026)`,
  entries in # order, `rng.choice`. No ranking.
- Examples live in a separate `vox-color/mechanical-examples.json`, not in
  the frozen MCP data. No Scryfall API call at runtime.
- Accepted printings as they are: Inside Information, Desperate Measures,
  Unsparing Boltcaster.

## Acceptance criteria

1. `mechanical-examples.json` has 195 entries, keys ⊂ page `button.ent`
   keys, none in `EXAMPLE_CARD`/`NAMED_CARD`/autocard; every record
   complete.
2. Each new entry shows the Example line with hover preview, then the plate
   (set, number, artist, Scryfall credit, caption), exactly like Fog, on
   first paint and after re-render.
3. Zero requests to api.scryfall.com when opening new entries; images from
   cards.scryfall.io.
4. Load failure of the examples file leaves the page working.
5. Self-test pass count unchanged, no failures; Fog unchanged; console
   clean; `node --check` passes; gate chain passes before and after.

## Implementation

- `vox-color/mechanical-examples.json` (new, 197 lines): 195 records built
  by a throwaway script outside the repo. Picks: 52 from Example 1, 68 from
  Example 2, 75 from Example 3.
- `vox-color/mechanical-explorer.html` (+8/−2): `boot()` awaits the file in
  its own try/catch before `buildEntries()`; `hydrateDetail()` calls
  `addCite(stored card, true)` synchronously, else the old path; one
  self-test assertion moved from `flying` to #213 (D1).

## QA

Developer run (not independent QA), working tree on `4b789fb`: self-check
84/84 at 1440×900 standalone and in the shell; 195 keys valid; 19 new
entries opened (incl. two-face #62/#114, few-candidate #15/#24/#36/#97,
list-only #215/#216, mobile 375 px) all show Example line, peek and plate;
zero api.scryfall.com requests while opening them; Fog DOM identical;
console clean; `node --check` ok; gate chain passes before and after.
Not obtained: screenshot (pane timed out). Owner spot-checked ~20–30
entries: all correct.

Failure-mode test (2026-10-10): examples file renamed → 404; page loads,
216 entries, self-check 84/84; new entries show no example, nothing breaks;
Fog, Lobotomy, Mana Leak still show; no uncaught JS errors (only the
expected 404). File restored (sha256 unchanged) → 200, examples return.
**PASS.**

## Decisions needed

- **D1 (resolved, Owner 2026-10-09).** The protected self-test asserted
  that `flying` has no card anchor, link or plate; `flying` (#92) now has a
  stored plate. Owner ruling: edit that one assertion. It now picks
  `-n/+n (on auras)` (#213, no example). No other self-test change.

None open.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### Story 6 notes

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
- **Example cards on every entry (Owner, 2026-10-08).** The explorer already
  shows an example card (Scryfall art, set, number, artist) on the entries
  the Owner has done; 12 more are ready. Editorial curation of examples is
  complete (Owner, 2026-10-09): `docs/card-examples-collection.md` is the
  accepted deliverable, with examples for 214 of 216 mechanical entries.
  Entries 213 and 214 (`-N/+N` on Auras and on spells) remain intentionally
  unresolved. Website integration and example placement (including whether
  examples live in the frozen source layer or in a separate examples file)
  remain future Owner decisions. The proposed ranking-engine repairs and
  reprint-based tie-breaking are not authorized work.
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
