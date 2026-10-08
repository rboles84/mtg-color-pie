# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `ready-for-qa` — **Story 4**, two small fixes (Owner, 2026-10-08).
- Last accepted: **Story 3** (truthful exception panel), `24393f1`,
  accepted by the Owner 2026-10-08. Ledger:
  `docs/handoff-archive/story-3.md`. Earlier: `story-2.md`, `story-1.md`,
  `gate-e.md`, `gate-d.md`, `gate-c.md`; Gates A and B are in git at
  `5252333` and `b62131b`.
- Owner: Vox Mana.
- Allowed files: `vox-color/color-wheel.html` (`applyHash` only),
  `tools/check_invariants.py` (additive checks only), `HANDOFF.md`.
- Allowed surfaces: the wheel's hash decode; the invariants report.
- Prohibited: `data/`, taxonomy, goldens, recon, the explorer, the shell,
  existing invariant counts.
- Base commit: `4bd7f6a`.
- Candidate commit: `d0b52a9`.
- robqa class: 4a QA-3 (hash), same agent; 4b QA-4 (invariants tool),
  separate robqa agent.

## Owner decisions

- Do the `URIError` fix (4a) and the Story 2 regression test (4b) together.
- Combine bounce: recon only, in a separate session; stays Unassigned.
- Stale frames: parked under "When ready to host".

## Acceptance criteria

4a. A malformed percent-encoded hash (`#%E0%A4%A`) no longer throws; the
    wheel lands in Explore. Valid hashes, including the `#mechanics` guard
    and `#combine=…`, route as before.
4b. `check_invariants.py` fails if the seven "Return target … from graveyard
    to hand." entries are not all in the group "Returning cards from
    graveyard to hand.", or if "Creature sacrifice, forced, repeatable" loses
    its explanation. It passes on today's data and fails on the
    pre-Story-2 data. No existing check or count changes.

## Implementation

`d0b52a9`, +33/−1.
- `vox-color/color-wheel.html` (+7/−1): `applyHash` wraps
  `decodeURIComponent` in try/catch and routes the raw text on failure. No
  route matches raw `%` text, so it falls to Explore.
- `tools/check_invariants.py` (+26): two checks after the authority check,
  reading `mcp2021.abilities.json` (group membership, exact 7) and
  `mechanical-color-pie.runtime.json` `byMechanic` (exact explanation).

## QA

Developer checks:
- Gate chain: all four pass; new lines "graveyard-to-hand group 7 entries",
  "creature sacrifice explanation present".
- Negative test: the five inputs from `6901f7b^` → exactly the two new
  FAILs ("got 2 of 7"; explanation `''`), exit 1.
- `node --check` on the wheel's extracted inline script: ok.
- Browser (port 8000): load with `#%E0%A4%A` → Explore, no console errors;
  hashchange to it → Explore; `#mechanics` → canonicalised to no hash;
  `#combine=WU` after the bad hash → Combine.

**Owner checklist (draft):**
1. `file://` open `vox-color/color-wheel.html#%E0%A4%A`, hard reload: Explore,
   no error; Back/Forward behave.

## Decisions needed

None open.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

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
- **Combine bounce** (recon in a separate session, Owner 2026-10-08). With `#color=W` in the URL, pressing Combine flips
  back to Explore a frame later. It also happens on production.
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
  - **GitHub default branch (after Story 2, Owner 2026-10-08).** Set it to
    `master` in the repo settings; `origin/main` holds only an unrelated
    README commit. Then `git remote set-head origin -a`.
  - Rename `ALIASES` and the shard `aka` field.
  - Commit or gitignore `docs/DATA-DOSSIER.html`.
  - **Periodic table: keep as-is (Owner, 2026-10-08).**
    `vox-color/mechanical-periodic-table.html` stays in place and unchanged,
    preserved for possible future work on its look and feel. The earlier
    idea to move it to a prototypes folder and restyle it is dropped.
    Record Three.js in `CONTEXT.md` only if it is ever taken into the
    product.
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
