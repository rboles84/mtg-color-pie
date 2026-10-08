# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `ready-for-qa`. **Story 1: retire the preview Mechanics code
  from the Color Wheel. Brief approved by the Owner, 2026-10-08.** Candidate
  `eaae957`.
  - Transitions: `idle -> dev-in-progress` (Owner rulings S1-O1 to S1-O3);
    `dev-in-progress -> ready-for-qa` (candidate `eaae957`).
- Last accepted: **Gate E** (cross-links), E1 `e6ed5f2` + `def153a` and E2
  `360eaea`, accepted by the Owner 2026-10-08. Ledger:
  `docs/handoff-archive/gate-e.md`. Earlier ledgers:
  `docs/handoff-archive/gate-d.md` and `gate-c.md`; Gates A and B are in git
  at `5252333` and `b62131b`.
- Queued after Story 1 closes: **Story 2**, the source-layer reopen (see
  Follow-ups). Do not start it while Story 1 is open.
- Owner: Vox Mana. Coordinating agent: Claude (robdev). QA: a same-agent
  QA-3 phase; the Owner checks visuals and `file://`.
- Allowed files:
  - `vox-color/color-wheel.html`;
  - `tools/inline_runtime.py`: delete it (S1-O2);
  - `CLAUDE.md`: only the invariant line "the preview code stays,
    unreachable, until its retirement story", and the "Two of these are
    stale" paragraph (S1-O4);
  - `AGENTS.md`, `CONTEXT.md` and `MECHANICS-CONTRACT.md`: only statements
    about the preview Mechanics mode or the inlined runtime that this story
    makes false (the "Stale docs" follow-up: "Mechanics unbuilt",
    `MECHANICS-CONTRACT.md` header, §7 step 8 and line 373). No
    source-layer edit;
  - `HANDOFF.md`.
- Allowed surfaces: the wheel standalone and inside the shell.
- Prohibited: `data/`, every other file in `tools/`, the taxonomy, goldens,
  recon truth, `vox-color/index.html`, `vox-color/mechanical-explorer.html`,
  `vox-color/mechanical-periodic-table.html`, `qa/` (historical snapshots),
  `PRODUCT-DEFINITION.md`, `docs/handoff-archive/`.
- Base commit: `8efc41b`. Candidate commit: `eaae957`.
- robqa class: **QA-3** (the route guard and wheel routing), a same-agent
  phase, with checks inside the shell.

## Owner decisions (2026-10-08)

- **S1-O1. Retire all of it.** Remove every part of the unreachable preview
  Mechanics mode from `color-wheel.html`: its CSS, markup (the "Mechanical
  World" `#world` section and the dead layer control), script (`mcp*`,
  `mech` state, `renderWorld` and the rest), stale comments (N2), the
  "LAYER 4 … stubbed" head comment, and the 112 KB inlined runtime between
  the `MCP-RUNTIME:BEGIN` / `END` markers. It is far more than the "about
  200 lines" first estimated: Step 0 maps it.
- **S1-O2. Delete `tools/inline_runtime.py`.** Its only output is that
  inlined block (checked 2026-10-08: no other tool, gate or doc runs it;
  `qa/before-gate-a-color-wheel.html` is a historical snapshot).
- **S1-O3. Keep the route guard.** Every legacy `mechanics` hash still lands
  in Explore at rest with the URL canonicalised (`CLAUDE.md` invariant,
  Gate A V16), standalone and inside the shell.
- **S1-O4 (after Step 0).** Delete the `CLAUDE.md` paragraph that calls
  `AGENTS.md` and `CONTEXT.md` stale on Mechanics, since this story fixes
  them. That paragraph only; nothing else in `CLAUDE.md` beyond the
  invariant line.

## Step 0 (before any product edit)

1. Baseline: the hash of `color-wheel.html`, the gate chain, `node --check`,
   and the wheel's line count and size.
2. Map every preview-Mechanics region (CSS, markup, script, the inlined
   block), and every shared helper it uses that live code also uses. Shared
   helpers stay.
3. Confirm `tools/recon.py` reads only the wheel's identity registry
   (`IDENTITIES`), which stays, and that nothing reads the inlined block.
4. List the Gate A V16 `mechanics` forms the route guard must still handle.

## Acceptance criteria

- **S1-1.** No preview-Mechanics code or data remains in `color-wheel.html`,
  apart from the route guard (S1-O3). `tools/inline_runtime.py` is deleted.
- **S1-2.** Every Gate A V16 `mechanics` form lands in Explore at rest with
  the URL canonicalised, standalone and as `index.html#color-wheel/…`, with
  no history entry added and no console error.
- **S1-3.** Explore, Combine, the layers, every deep link (`color`, `ally`,
  `enemy`, `four`, `combine`), Back/Forward, the panel, the atlas and the
  Gate E bridge behave as before. Removing dead code changes nothing visible.
- **S1-4.** The gate chain is green, `tools/recon.py` still runs, and
  `node --check` is clean.
- **S1-5.** The docs no longer describe the preview mode as present or
  unbuilt, and the `CLAUDE.md` invariant reads true.

## Implementation

**Step 0 (base `8efc41b`).** Wheel sha256 `7c6d4662…ca8ca37b2b90`, 4,150
lines, 345,973 bytes; gate chain green; `node --check` clean.
- Regions: head "LAYER 4" comment; TOKENS "LEGACY NAMES" note and the
  legacy tokens (`--obsidian` … `--radius`, read only by mechanics CSS);
  CSS 584–1136; `#lay-mech` + comment, `.proto-bar`, `.dock-cap`, `#world`;
  JS `layers.mech`, mechanics branches in `clearSelection`, `activate`,
  Escape and `setMode`, the `MCP-RUNTIME` block through `setProto`
  (2343–3283), `enableMechanicsPreview` (no caller). Stale comments at
  202–204, 263–264, 499–500 reworded or removed.
- Deleted CSS checked against live markup and JS: no removed selector can
  match a live element; no class-less selector was removed.
- `tools/recon.py` reads only the `IDENTITIES`/`ALIASES` registry by regex.
  Nothing else references `inline_runtime` or `MCP-RUNTIME` outside
  `qa/` and the archive.
- V16 forms (§18.10): bare `mechanics`, `mechanics=`, `=board|atlas|layered|
  preview`, any other value, and percent-encoded forms of each. Inside the
  shell, `index.html` `validRoute` already rejects them (unchanged).
  `#lay-mech` is now absent rather than "disabled and unchanged" (S1-O1).

**Candidate `eaae957`.**
- `vox-color/color-wheel.html`: +7 −1,611; 2,546 lines, 149,688 bytes,
  sha256 `e20eafc2…6fce39af`.
- `tools/inline_runtime.py`: deleted (−45).
- `AGENTS.md` +2 −3, `CONTEXT.md` +2 −1, `MECHANICS-CONTRACT.md` +8 −3
  (header status, §7 steps 7–8), `CLAUDE.md` +2 −7 (invariant, S1-O4).

Criteria:
- **S1-1.** Only the route guard remains; scan for `mech`, `MCP`,
  `renderWorld`, `world`, `proto`, `lay-mech`, legacy tokens finds nothing
  else. Tool deleted.
- **S1-2.** Standalone, 11 forms via `location.replace`: hash empty, path
  kept, Explore at rest, `histDelta` 0, no `#world`, no body class, no
  console error; direct load of `#mechanics=board` the same. Shell, 9 forms
  (incl. `%253D`): top hash and frame hash empty, Explore at rest,
  `histDelta` 0, no error.
- **S1-3.** `color`, `ally`, `enemy`, `four`, `combine=WUR`, `combine=`,
  Escape, Clear, vertex click, Back/Forward, Combine round trip restoring
  Explore's lenses, bridge href per route, 37 atlas tiles, viewBox
  unchanged; `#color-wheel/ally=RG` in the shell. Visuals: Owner.
- **S1-4.** Gate chain 0/0/0/0, `tools/recon.py` 0, `node --check` clean.
- **S1-5.** Docs above; the `CLAUDE.md` invariant now reads true.

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
- **Preview Mechanics retirement:** now Story 1 (above).
- **`CLAUDE.md` read-order line counts** for `AGENTS.md`, `CONTEXT.md` and
  `MECHANICS-CONTRACT.md` drift by a few lines after Story 1.
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
  `MECHANICS-CONTRACT.md` reason 3.** It starts after Story 1 is accepted,
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
