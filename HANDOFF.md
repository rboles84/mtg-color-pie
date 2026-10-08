# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `idle`.
- Last accepted: **Story 1** (retire the preview Mechanics code), `eaae957`,
  accepted by the Owner 2026-10-08. Ledger:
  `docs/handoff-archive/story-1.md`. Earlier ledgers:
  `docs/handoff-archive/gate-e.md`, `gate-d.md` and `gate-c.md`; Gates A
  and B are in git at `5252333` and `b62131b`.
- Next: **Story 2**, the source-layer reopen (see Follow-ups). Not started;
  start it in a fresh session.
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
- **Story 2, queued (Owner approved 2026-10-08): source-layer reopen,
  `MECHANICS-CONTRACT.md` reason 3.** Story 1 is accepted, so it is next,
  in its own session.
  - **The two parser defects.**
    - The seven "Return target … from graveyard to hand." entries all sit
      under "Returning cards from graveyard to hand." in the article. The
      parser left the creature entry ungrouped and filed four others under
      a group named after it. The explorer patches this on screen with
      `HEADING_FIX`.
    - The article's explanation of "Creature sacrifice, forced, repeatable"
      was not captured, because the parser misread its label. The explorer
      shows `UNMATCHED_CASE` text for it.
  - **S2-O1 (Owner ruling).** The explorer self-check assertions that encode
    these two defects may change. That covers the `headings:` and
    `unmatched:` assertions which name the regrouped entries or the
    uncaptured explanation, and the counts they imply (for example, five
    unmatched entries become four). No other assertion changes. Step 0 must
    list every assertion affected before editing.
  - **Expected scope.**
    - Files: `tools/parse_mechanical_pie_2021.py`, the rebuilt `data/`
      outputs, and the explorer, to remove the two patches and show the
      recovered explanation. `MECHANICS-CONTRACT.md` gets a dated note.
    - Fixtures and goldens change only if the rebuild proves they must,
      with each change explained.
  - **Stop and ask the Owner** if the rebuild changes any tier, placement,
    entry count other than the two defects, or golden result. Stop too if
    the article source can't be read without new network access.
  - **QA:** QA-4, a full gate chain and the separate `robqa` agent.
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
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
