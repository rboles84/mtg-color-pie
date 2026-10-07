# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `complete`. **The Owner accepted Gate D candidate `8d0ea25`**
  (`8d0ea25fc50267aa57ea6de924556bc593f96524`), 2026-10-07, and authorized
  the push. Transition: `qa-passed -> complete` (Owner acceptance, recorded by
  the coordinating agent). Acceptance is bound to `8d0ea25`; later commits
  change `HANDOFF.md` only. F4 stays an accepted minor (D-O2).
- Earlier status: `qa-passed`. The Owner's manual checklist passed 7 of 7
  (2026-10-07), and the agent's QA-2 checks passed 11 of 11.
- Last accepted: **Gate C**, `f9b90ec` (2026-10-05), published at `02b899f`.
  Ledger: `docs/handoff-archive/gate-c.md`; Gates A and B in git at
  `5252333` and `b62131b`.
- Owner: Vox Mana. Coordinating agent: Claude (robdev, then a same-agent QA
  phase).
- Allowed files: `vox-color/mechanical-explorer.html`, `HANDOFF.md`.
- Prohibited: `data/`, `tools/`, `vox-color/index.html`,
  `vox-color/color-wheel.html`, the explorer's self-test, any other file.
- Base commit: `dfa20bf`. Candidate commit: `8d0ea25` (explorer sha256
  `b120fa83…`, +5/−3 lines).
- robqa class: **QA-2** (one component's interaction), so a same-agent QA
  phase with no subagent.

## Owner decisions (2026-10-06)

- D-O1: scope is D1 (detail scroll) and D2 (the two links) only.
- D-O2: F4 is out of scope. It stays an accepted minor, because the fix
  would touch the protected self-test.
- D-O3: `target="_blank"` also applies to the standalone explorer, as in
  Gate C.

## Acceptance criteria

- GD1: when the picked entry changes, `#detail` opens at `scrollTop = 0`,
  docked and as the sheet, by mouse and by keyboard.
- GD2: colour filtering, search, resize and same-entry re-renders cause no
  new scroll; behaviour matches the base.
- GD3: `#snap` and the FCP link carry `target="_blank" rel="noopener"`.
- GD4: self-test 84/84, no console errors, gate chain green, `node --check`
  clean.

## Implementation

- `renderDetail`: the existing "entry changed" test (where `srcOpen` resets)
  is held in `newEntry`. After the new content is drawn,
  `if (newEntry) detailEl.scrollTop = 0`. A resize sets `_sig = null`, so it
  never resets.
- Lines 595 and 685: `target="_blank"` added.

## QA (same-agent phase, QA-2, candidate `8d0ea25`)

- The gate chain: exit 0. `node --check` on the extracted script (1,639
  lines): clean.
- Headless Edge, local HTTP, `scratchpad/gated.mjs`: **11 of 11 passed.**
  - Self-test 84/84 at both sizes.
  - Docked 1440×640, mouse: Haste scrolled to 141, then Tutor → 0.
  - Docked, keyboard: Tutor scrolled to 246, then Enter on Haste → 0.
  - Sheet 360×780: the same, 69 → 0 and 356 → 0.
  - The W filter with Haste open: 141 → 141 docked and 69 → 69 sheet, the
    same as the base.
  - Links: `_blank`/`noopener` on both.
  - No console errors.
- Base `dfa20bf`, same script: the Tutor case stays at 141 and 69 (the bug
  reproduces); the filter results are identical.
- Not run (cost gate): width sweeps, viewport matrices, a trusted-click
  popup harness. Opening a new tab is on the Owner checklist.

### Owner checklist (`python -m http.server` from the repo root, open `/vox-color/index.html`, then the Mechanical Color Pie)

1. Open Haste, scroll its detail to the bottom, then click "Tutor" for any
   card: the detail shows Tutor's title at the top.
2. The same with the keyboard: Tab to an entry, press Enter. The new detail
   starts at the top.
3. With an entry open and scrolled, toggle a colour: same entry, no jump to
   the top.
4. Type in search with an entry open: no jump.
5. Click the snapshot link (top): a new tab opens, and the explorer stays.
6. Click "Fan Content Policy" (footer): a new tab opens, and the explorer
   stays.
7. Phone width (about 360 px): repeat 1 in the bottom sheet.

## Decisions needed

None open.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### Gate D

- In scope above (D1, D2). **F4 (B13)** stays an accepted minor (D-O2):
  leaving the Mechanical Color Pie during its first load lets its self-test
  take focus in the off frame for about 8–12 ms.

### Gate E

- Cross-links per `PRODUCT-DEFINITION.md` §15. The explorer needs its own
  routes first. Revisit B12, the extra Back step on a same-document arrival,
  only if bridges make it matter.

### Unassigned (each needs its own story)

- **Mana-font fallback.** Without mana-font, the colorless glyph is 0 px
  wide (Gate C F1) and the wheel's mana glyphs render as boxes; the explorer
  shows letters instead.
- **`URIError`.** The wheel's `applyHash` throws on a malformed
  percent-encoded hash such as `#%E0%A4%A`.
- **Combine bounce.** With `#color=W` in the URL, pressing Combine flips
  back to Explore a frame later. It also happens on production.
- **Preview Mechanics retirement.** Remove the unreachable preview code:
  about 200 orphaned `mcp*` lines, the stale comments (N2) and the
  "LAYER 4 … stubbed" head comment.
- **Stale docs.**
  - `AGENTS.md` and `CONTEXT.md` still call Mechanics unbuilt.
  - `MECHANICS-CONTRACT.md` header, §7 step 8 and line 373.
  - `CONTEXT.md` understates the C16 caution and dates "Absence" 10 May
    (Wizards prints May 13, 2013).
  - N3: an unwrapped line in `AGENTS.md`.
- **`tools/gate.py` has no entry point.** It exits 0 having checked
  nothing; the real gates run inside `check_taxonomy.py` and
  `check_recon.py`.
- **Source-layer reopen candidate (reason 3).**
  - The grouping of the "Return target … from graveyard to hand." entries.
  - The missing explanation of "Creature sacrifice, forced, repeatable".
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
  - Periodic table: move it to a prototypes folder (this changes its paths),
    restyle it to the field guide, and handle its atlas's ragged edge.
  - Record Three.js in `CONTEXT.md` if the periodic table is accepted.
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
