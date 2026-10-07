# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `dev-in-progress`. **Gate E (cross-links): brief approved by the
  Owner, 2026-10-07.** Step 0 is next; no product file has been edited.
  - Transition: `idle -> dev-in-progress` (Owner rulings E-O1 to E-O6).
- Last accepted: **Gate D**, `8d0ea25` (2026-10-07). Ledgers:
  `docs/handoff-archive/gate-d.md` and `gate-c.md`; Gates A and B are in git
  at `5252333` and `b62131b`.
- Owner: Vox Mana. Coordinating agent: Claude (robdev). QA: the separate
  `robqa` agent (Sonnet) for E2 and B12; a same-agent phase for E1.
- Allowed files: `vox-color/index.html`, `vox-color/mechanical-explorer.html`,
  `vox-color/color-wheel.html`, `HANDOFF.md`. `AGENTS.md` and `CONTEXT.md`
  may change only for a statement this gate makes false.
- Prohibited: `data/`, `tools/`, the taxonomy, goldens, recon truth, the
  explorer's self-test assertions, `PRODUCT-DEFINITION.md`, the wheel's
  preview Mechanics code.
- Base commit: `64869a8`. Candidate commit: (none yet).
- robqa class: E1 is **QA-3** (a same-agent phase); E2 and the B12 fix are
  **QA-5** (the separate `robqa` agent).

## Owner decisions (2026-10-07)

Contract: `PRODUCT-DEFINITION.md` §15 (payloads are canonical WUBRG keys
only; the destination owns state on arrival; no colorless bridge; never
`#mechanics`). §17 order: the explorer route first, then the bridges.

- **E-O1. Explorer → wheel opens the richest Explore view.**
  - One colour: `color=W`.
  - An adjacent pair: `ally=WU`.
  - A non-adjacent pair: `enemy=WB`.
  - Four colours: `four=X`, where X is the excluded colour.
  - Three or five colours: `combine=<keys>`.
  - Keys use the wheel's own canonical forms; Step 0 confirms the exact
    `ally`, `enemy` and `four` values from `applyRoute`.
- **E-O2. Arrival only.** The explorer reads `colors=<WUBRG>` on arrival, and
  the shell then canonicalises its URL to a bare `#mechanical-color-pie`
  (`replaceState`). The explorer never writes its URL. Reload shows the
  explorer at rest (§11).
- **E-O3. Arriving into an explorer that is already open** replaces the
  colour lens and closes the open entry. Search, order and spot are kept.
- **E-O4. Bridges always show** (the product will be hosted online). No
  framing check.
  - **Derived constraint (coordinating agent):** when framed by the shell,
    a bridge must change only the shell's hash, a same-document navigation,
    and never load `index.html` by path. If it did, a shell served at
    `/vox-color/` (a directory index, as on a host) would reload both
    frames and lose the explorer's in-memory state.
  - Standalone, the bridge opens the shell at `index.html#…`.
  - On `file://` the shell does not integrate (Gate B). That is accepted.
- **E-O5. Link labels: the coordinating agent chooses** plain labels, with
  no marketing copy; the Owner may change them at review.
  - Proposed: "View these colors in the Mechanical Color Pie →" and "Open
    these colors on the Color Wheel →".
  - No bridge for colorless, at rest, or an empty Combine set.
- **E-O6. Fix B12 in this gate**: a same-document arrival into a loaded
  wheel costs one redundant Back step.
  - Required: one bridge click makes exactly one history entry, and Back
    returns to the exact previous view and route, in both directions.
  - Gate B's attempts with `location.replace` and reload corrupted the
    previous entry (shared frame entries). Step 0 must measure before
    choosing.
  - If the only clean fix needs the shell to hand state to a loaded frame
    by a means beyond `src` and hash (§9 says the shell reads nothing but
    the wheel's hash), stop and bring the option to the Owner.

## Step 0 (before any product edit)

1. Baseline: the hashes of the three HTML files, the self-test at 84/84,
   and the gate chain.
2. Reproduce B12 at `64869a8`. Count the history entries for each arrival
   path: typed shell URL; arrival into an unloaded and a loaded wheel;
   arrival into an unloaded and a loaded explorer.
3. Choose the handoff mechanism for each path, and record the measured
   reason.
4. Confirm the wheel's canonical `ally`, `enemy` and `four` keys and the
   pair-adjacency rule.

## Acceptance criteria

- **GE1.** `index.html#mechanical-color-pie/colors=<k>` with canonical WUBRG
  `k` (1–5 colours) opens the explorer with that lens. The URL then reads
  `#mechanical-color-pie`.
  - Non-canonical, empty, `C`, malformed or `mechanics`-bearing values land
    at rest without errors.
  - The standalone `mechanical-explorer.html#colors=<k>` behaves the same.
- **GE2.** The wheel shows the explorer bridge for every coloured Explore
  target and for Combine with 1–5 colours, and none otherwise. Its payload
  is the shown colours.
- **GE3.** The explorer shows the wheel bridge whenever its lens is
  non-empty. Its target follows E-O1.
- **GE4.** When framed, a bridge click makes exactly one history entry, and
  Back and Forward restore the exact previous view and route (B12 fixed).
  - Nothing reloads, and the wheel's state survives.
  - Focus moves into the destination, and the view is announced.
- **GE5.** No shared state: payloads carry keys only (no entry, query or
  names), there is no shared storage, and `#detail` stays the sole owner of
  mechanic detail.
- **GE6.** The self-test passes 84/84, the console is clean, the gate chain
  is green and `node --check` is clean. Gate B's and Gate C's routing
  behaviour is unchanged apart from B12.

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

### Gate E

- Now the active task (above). B12 is in scope (E-O6).

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
