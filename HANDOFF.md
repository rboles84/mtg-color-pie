# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed`
- Owner: `robqa`
- Task: Second Mechanics visualization round — "interactive magical periodic
  table + layered atlas". Replaces the rejected Constellation / Radial / Split
  experiment with three variants of ONE architecture family.
- Requested outcome: Mechanics mode OWNS THE CANVAS. The wheel becomes a docked
  controller and orientation anchor. The mechanical world becomes a three-depth
  space — Overview (L1) → Family (L2) → Mechanic (L3) — where a lower layer
  stays faintly visible as orienting context instead of vanishing.
- Allowed files: `vox-color/color-wheel.html`, `HANDOFF.md`.
- Allowed surfaces: mechanics-mode layout CSS; the world/layer CSS; the
  `.proto-bar` markup (repointed); a new `#world` element inside `.stage`;
  replacement of the whole prototype JS block; `renderMechanics()` retargeting;
  the `PROTOS` route values.
- Non-goals: NO change to the source layer, taxonomy, runtime, fixture goldens
  or recon truth. The Mechanics toggle stays reachable only by preview route and
  is NOT enabled in production navigation. No new runtime dependency, no build
  step, no framework. No repair of the rejected round — it is superseded, and
  `13b81f7` preserves it. No tier-as-magnitude encoding anywhere.

## Acceptance criteria

- Routes `#mechanics=board`, `#mechanics=atlas`, `#mechanics=layered` each set
  mode + variant, survive hard reload and back/forward from `file://`.
- In mechanics mode the wheel docks to a narrow sticky controller and the world
  occupies the clear majority of the stage width. Measured, not asserted.
- Three readable depths exist. L1 is visible and understandable on entry with no
  click. Opening a family makes L2 dominant while L1 remains visible, reduced.
  Opening a mechanic makes L3 the single detail owner while L2 remains visible.
- Exactly ONE owner of mechanic detail. No second copy in a search surface, a
  popup, a drawer, or the family layer.
- Ally/enemy/crossing geometry stays suppressed; multiple colours selectable.
- Required figures render exactly: W 104/60/24/20; WB 154/44/2/42/110/62;
  WUG 173/43; WUBR 206/10; WUBRG 216/215/1/0; WB→WBG 24/17/42/95/38;
  WUBR-vs-WUBRG 10/18/55/133.
- Search `counterspell` ranks exact first, reveals its containing family, shows
  White tertiary / Blue primary, and uses no quality language.
- Cross-links appear on focus only, never as a duplicated mechanic.
- Conditional is a badge, not a separate navigation bucket.
- Colorless shows the informational state, never "0 mechanics".
- No `<progress>`, `<meter>` or size-encoded tier anywhere. Tier is category.
- Click and keyboard parity; visible focus; reduced motion skips the depth
  transitions without hiding information.
- No console errors; repeated interaction stays smooth.

## Test plan

- `node --check` on the extracted script.
- Full gate chain before and after: source, taxonomy, 11 fixtures, recon.
- In-browser assertion of every required figure against the golden fixtures.
- Layer-model checks: L1 present on entry; L2 dominant with L1 still rendered;
  L3 single detail owner; upward return at each step.
- Duplicate-detail check: count rendered detail surfaces for one selected
  mechanic; must be exactly 1.
- Canvas-ownership measurement: world width vs wheel width in mechanics mode.
- Keyboard traversal of tiles and mechanics; focus visibility.
- Route reload and back/forward from `file://`.
- Console error check and a repeated-interaction timing run.

## robdev report

- Changed files: `vox-color/color-wheel.html`, `HANDOFF.md`. Nothing else.
- Summary: mechanics mode now re-lays the stage to `240px | 1fr`. The wheel
  docks sticky at 240px, crops its viewBox to the vertex GLYPH bounding box
  (`105 92 591 566`, measured) and hides `.vertex-label`/`.vertex-goal`, which
  were rendering at 7.3px. The side panel is hidden entirely; a new `#world`
  owns column 2. Inside it a control rail sits above a positioned `.stack`
  holding three planes: `#wl1` the board, `#wl2` family-or-search, `#wl3` the
  mechanic. Descending adds `.is-recede-1/-2` to the layers beneath rather than
  unmounting them.
- The board is 23 family tiles, each carrying a five-column glyph: the tier
  cell above the count of mechanics that colour reaches in that family. That
  glyph is what teaches — removal reads White 12 / Blue 1 with no click.
- Variants share every renderer. `board` is a uniform grid; `atlas` spans tiles
  by membership and sets `--ox/--oy` from the clicked tile so the plane grows
  from it; `layered` insets the planes so all three depths are visible at once.
- Decisions: the rejected round was REMOVED, not repaired — `13b81f7` preserves
  it. Selecting a colour while deep in a layer returns to the board, because a
  new selection changes what every family means and a stale family view would
  be a lie. `renderMechanics()` is now a one-line alias to `renderWorld()`.
- Checks: `node --check` OK. All four gates green before and after. Every
  required figure exact — W 104/60/24/20; WB 154/44(2+42)/110/62; WUG 173/43;
  WUBR 206/10; WUBRG 216/215/1/0; WB+G 24/17/42/95/38; absence-of-G
  10/18/55/133. Canvas: world 964px vs wheel 240px = 80% of the stage at
  1600px, against ~16% of the viewport in the rejected round. 23 tiles, all
  `<button>`, all aria-labelled, all with `aria-pressed`. Hit targets 28x28.
  Strips: 23 of 23 have exactly ONE distinct cell size, so tier never encodes
  magnitude. 0 `<progress>`/`<meter>`. Detail surfaces: exactly 1. Cross-links
  36, each appearing once in its canonical family, absent from the family it
  only touches, revealed in L3. 60 mixed re-renders 169-262ms; 40 wheel toggles
  191ms. No console errors.
- Two defects found and fixed during development, both mine: the L3 back button
  was hardcoded `data-up="1"` so "Back to <family>" skipped to the board; and a
  pre-existing global Escape handler registered earlier called
  `clearSelection()`, wiping the layer stack before the layer handler could
  climb one step. The second is now ONE consolidated Escape handler.
- Risks: ~200 lines of orphaned panel code (`mcpOverview`, `mcpWhatChanges`,
  `mcpSearchBlock`, `mcpWire`) remain — defined, never called, no dangling
  references. Left in place because removing them is outside the envelope.

## robqa report

- Result: `pass`.
- Scope check: `git status --porcelain` shows only `HANDOFF.md` and
  `vox-color/color-wheel.html` modified. `data/`, `tools/`,
  `MECHANICS-CONTRACT.md`, `CONTEXT.md` and `AGENTS.md` verified byte-identical
  to `13b81f7`. `docs/` and `tools/research_board.py` are untracked artifacts
  from the prior research story and were preserved untouched. `git diff --check`
  clean apart from the repository's standing LF/CRLF warning.
- Evidence re-derived independently rather than repeating the developer's run:
  figures recomputed in-browser from `MCP.byMechanic` via `bestBuckets`,
  `mcpSections`, `mcpDeltaAdd` and `mcpDeltaRemove` and compared to the mission
  figures; all match. Layer model probed by asserting the lower plane is still
  in the DOM with its children rendered while the upper plane is active — L1
  keeps 23 tiles under an open family, L2 keeps 22 rows under an open mechanic.
  That is a real layer stack, not a painted effect.
- Duplicate-detail challenge: `document.querySelectorAll('.mx-label').length`
  is 1 with a mechanic open, including when reached through search. The family
  list and the search list render a name, a strip and badges only.
- "Slid back into a search panel plus a drawer?" — no. Search renders into
  `#wl2`, the same plane a family opens into, each hit naming its family, and a
  hit opens `#wl3`, the same plane a family's mechanic opens into. There is no
  parallel surface.
- Real-interaction paths exercised through the wheel's own click handler, not
  by poking `mech.sel`: select, add, deselect, select-while-deep, variant switch
  mid-descent, Escape ladder at all three depths, breadcrumb and back buttons.
  All correct.
- Reduced motion: both media blocks confirmed in the CSSOM. `.is-recede-*` drops
  `transform` and `filter` and keeps a slightly stronger opacity cue (.55/.4),
  so depth still reads without movement or blur. The developer's own check
  reported `killsLayerAnim:false`; that was a bad regex — the browser
  serialises `animation:none` to longhand. The rule is present.
- Blocked check: the hash could not be exercised end to end. The preview host
  serves the page as a `data:` URL and drops the fragment. Mitigated by
  verifying `applyHash`'s exact source, then driving `applyRoute` with all nine
  route strings: the three new mechanics routes each set mode, variant, world
  visibility and dock viewBox, bare `mechanics` defaults to board, and
  `color` / `ally` / `enemy` / `four` / `combine` all still work and restore the
  full viewBox. Same standing limitation recorded against the previous round.
- Human check required: open the file from `file://` at each of the three
  routes, hard-reload, and use browser back/forward. That is the one thing this
  environment cannot prove.
- Defects: none outstanding. Notes only — the orphaned panel functions above,
  and `AGENTS.md`/`CONTEXT.md` still describing Mechanics as "not built".

## Decisions needed

- Re-add `scrollbar-gutter:stable`? Carried forward from the previous task,
  still awaiting the user. Not touched here.

## Follow-ups

- `AGENTS.md` still says "the unbuilt Mechanics control remains disabled" and
  `CONTEXT.md` still says the Mechanics overlay is "not built". Both predate the
  mechanics work and now understate it. Left unchanged — outside this envelope.
- `max-height:calc(100vh - 180px)` on `.panel` still hard-codes the chrome
  height above the stage. Carried forward, unchanged.
