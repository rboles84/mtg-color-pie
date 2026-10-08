# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `ready-for-owner` — **Story 5**, the Combine bounce.
- Last accepted: **Story 4** (`URIError` guard + Story 2 regression
  checks), `d0b52a9`, accepted by the Owner 2026-10-08. Ledger:
  `docs/handoff-archive/story-4.md`. Earlier: `story-3.md`, `story-2.md`,
  `story-1.md`, `gate-e.md`, `gate-d.md`, `gate-c.md`; Gates A and B are in
  git at `5252333` and `b62131b`.
- Owner: Vox Mana.
- Allowed files: `vox-color/color-wheel.html` (mode-button click handler),
  `HANDOFF.md`.
- Allowed surfaces: the wheel's mode switch and the hash it writes.
- Prohibited: `data/`, tools, the explorer, the shell, `applyRoute`,
  `setMode`, `clearSelection`.
- Base commit: `487594e`.
- Candidate commit: `b29794d`.
- robqa class: QA-3 (routing/hash/history), same agent; the shell was
  checked but is unchanged.

## Owner decisions

- Fix the bounce in this session (Owner, 2026-10-08), from the recon below.

## Acceptance criteria

1. From `#color=`, `#four=`, `#enemy=`, `#ally=`, `#combine=WU`, a
   malformed hash and no hash, pressing Combine stays in Combine and the
   hash is `#combine=`; pressing Explore returns to Explore with no hash.
2. Each mode press adds at most one history entry; Back returns to the
   prior route and mode, Forward re-enters Combine.
3. Picking colours in Combine still writes `#combine=<set>`; Back steps
   through the set.
4. `#mechanics` still lands in Explore with the hash removed; Story 4's
   malformed-hash guard still holds. Same behaviour inside the shell.

## Implementation

`b29794d`, `vox-color/color-wheel.html` +9/−1, the mode-button click
handler only. It runs `setMode` with `applying = true` (so
`clearSelection`'s `setRoute(null)` writes nothing) and then writes the
mode's own route once: `combine=` or no hash. Route restores
(`applyRoute`) are unchanged; they already ran with `applying` set.
Simpler than the recon's proposal (no change inside `setMode`).

## QA

Same-agent QA-3, browser at `http://localhost:8000`, measured:
- Criterion 1: all seven starting hashes → Combine, `#combine=`; Explore →
  no hash. Console clean.
- Criterion 2: +1 history entry per press. From `#color=W`, Combine → Back
  → `#color=W`, Explore, W selected; Forward → `#combine=`, Combine.
- Criterion 3: picking W then U → `#combine=WU`; Back → `#combine=W`, set W.
- Criterion 4: `#mechanics` → Explore, URL without hash; `#%E0%A4%A` →
  Explore. Shell `index.html#color-wheel/color=W`: Combine →
  shell `#color-wheel/combine=`, stays Combine; Back → `color=W`, Explore.
- `node --check` on the extracted inline script: ok.

**Owner checklist:**
1. `file://` open `vox-color/color-wheel.html#color=W`, press Combine: it
   stays in Combine. Hard reload: still Combine. Back: Explore with W
   selected; Forward: Combine.
2. Same at http://localhost:8000/vox-color/index.html#color-wheel/color=W
   (the shell): Combine stays, Back/Forward behave.

### Recon (separate session, `487594e`)

With `#color=W` in the URL, pressing Combine flips
  back to Explore a frame later. It also happens on production.
  **Recon findings (2026-10-08, no code changed):**
  - *Repro.* Measured at `…/color-wheel.html#color=W` (t in ms): click →
    `setMode('combine')` 0.3 → `clearSelection()` → `setRoute(null)` 0.5 →
    `location.hash=''` (sync, hash is `''` by 1.2) → `applyRoute('')` 3.6 →
    `setMode('explore')` 3.6 → `hashchange` event logged 4.6. Mode is Explore
    within ~4 ms, one task later; no timer involved.
  - *Scope.* Standalone and inside the shell (`index.html#color-wheel/…`)
    both bounce. Bounces on `#color=`, `#four=`, `#enemy=`, `#ally=` and even
    `#combine=WU` (clicking Combine while already in it). Does **not** bounce
    with no hash (`setRoute(null)` sees `'' === ''`, writes nothing). The shell
    is not involved; its hash ends empty, as the wheel's does.
  - *Cause* ([color-wheel.html:2320-2327](vox-color/color-wheel.html:2320),
    [:1262](vox-color/color-wheel.html:1262),
    [:2376-2379](vox-color/color-wheel.html:2376),
    [:2396-2422](vox-color/color-wheel.html:2396)). `setMode` calls
    `clearSelection()`, which ends in `setRoute(null)`. The click path is not
    inside `applying`, so it writes `location.hash=''`; `hashchange` →
    `applyHash` → `applyRoute('')` matches no key and falls through to
    `setMode('explore')`. Combine's own route is only written by `renderCombo`
    (:2307), never on entry, so nothing re-asserts `#combine=`.
  - *Smallest fix (wheel only).* Mute route writes inside `setMode`'s clear,
    then write the mode's own route from the click handler only:
    `const was=applying; applying=true; try{clearSelection()}finally{applying=was}`
    in `setMode`; handler: `setMode(m); setRoute(m==='combine' ? 'combine=' : null)`.
    (`#combine=` is already the documented colourless form.)
  - *Risks.* Entering Combine now pushes one `#combine=` entry (Back returns
    to the prior selection, arguably right). `applyRoute` already runs under
    `applying`, so Back/Forward, the `#mechanics` guard (`replaceState` then
    `setMode('explore')`) and Story 4's `applyHash` raw fallback are unchanged
    in path; re-test each. Explore click from Combine still ends at `''`.
    Don't touch the Clear button's `setRoute(null)`.
  - *QA class:* QA-3 (hash/history, wheel-only), same agent: every hash above
    plus Back/Forward and `#mechanics`; `node --check`; `file://` hard reload
    and Back/Forward on the Owner checklist. QA-5 only if the shell changes.

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
