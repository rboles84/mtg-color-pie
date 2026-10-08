# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `idle`.
- Last accepted: **Gate E** (cross-links), E1 `e6ed5f2` + `def153a` and E2
  `360eaea`, accepted by the Owner 2026-10-08. Ledger:
  `docs/handoff-archive/gate-e.md`. Earlier ledgers:
  `docs/handoff-archive/gate-d.md` and `gate-c.md`; Gates A and B are in git
  at `5252333` and `b62131b`.
- Next (not started; needs the Owner's brief).
- Owner:
- Allowed files:
- Allowed surfaces:
- Prohibited:
- Base commit:
- Candidate commit:
- robqa class (see `.claude/skills/robqa/SKILL.md`):

## Owner decisions

## Acceptance criteria

## Implementation

## QA

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

### From Gate E

- **Stale frames after an update (for hosting).** A browser can keep serving
  a cached instrument inside the shell's frame after the file changes; the
  shell's own hard reload does not refresh it (seen in the Owner's E2 QA).
  Before hosting, version the frame URLs or set cache headers.

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
