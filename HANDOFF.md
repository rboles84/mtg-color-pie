# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed`
- Owner: `robqa`
- Task: Implement the Mechanics panel behind the still-disabled toggle.
- Requested outcome: the locked presentation contract, consuming the runtime
  projection without reinterpreting it. Owner visual review before enabling.
- Allowed files: `vox-color/color-wheel.html`, `tools/inline_runtime.py` (new),
  `MECHANICS-CONTRACT.md`, `HANDOFF.md`.
- Allowed surfaces: a generated inline runtime block; mechanics-mode CSS; a
  `mode === 'mechanics'` branch; the mechanics panel renderer; a search field.
- Non-goals: the Mechanics button STAYS DISABLED for ordinary visitors. No
  change to the source layer, taxonomy, runtime generator, fixtures or the
  existing Explore/Combine behaviour. No wheel decoration with mechanics. No
  bars, radar charts, sizes or scores of any kind.

## Acceptance criteria

- Toggle remains `disabled`; the mode is reachable only via an explicit
  preview route so the owner can review it.
- In mechanics mode the ally, enemy and crossing geometry are all suppressed;
  five nodes remain; multiple colours can be selected.
- Header always shows "Mechanical Color Pie 2021 · snapshot dated October 18,
  2021" and the tier sentence, visible rather than in a tooltip.
- Panel order matches the contract; four-colour inserts Mechanical Absence;
  WUBRG replaces it with Full Colored Access.
- `new_owner_no_improvement` is a first-class delta group.
- Tier is shown as a badge. No element's SIZE encodes tier.
- Restrictions surface verbatim; provenance only on expansion.
- Leaving mechanics mode restores Explore's prior layer state.
- 216 mechanics reachable; no console errors; existing panels unchanged.

## Test plan

- `node --check` on the extracted script.
- Enter mechanics mode; assert suppressed layers and multi-select.
- Assert counts for W, WB, WUBR, WUBRG against the golden fixtures.
- Assert no bar/meter/progress element exists in the panel.
- Search returns the selection's access for a known mechanic.
- Leave the mode; confirm prior layer state returns.

## robdev report

- Changed files: `vox-color/color-wheel.html`, `tools/inline_runtime.py` (new),
  `MECHANICS-CONTRACT.md`, `HANDOFF.md`.
- Summary: the runtime is INLINED by a generator, because the app opens from
  `file://` where `fetch()` cannot read a sibling JSON. `byColor`/`byFamily`
  are dropped and re-derived in the page rather than shipping the long keys
  three times. Mechanics is a third value of `mode`, suppressing the ally,
  enemy, crossing and quad geometry; colours become multi-select; the panel
  follows the locked order.
- Decisions: the toggle STAYS disabled; the only way in is `#mechanics=preview`
  so the panel is reviewable without shipping a half-finished control.
  `conditional` is an overlapping flag, not a fifth bucket.
  `new_owner_no_improvement` is a first-class delta group.
- Checks: `node --check` OK. Every selection figure matches the golden
  fixtures exactly -- W 60/24/20; WB sections 2/42/110/62/82; WB add-G
  24/17/42/95/38; WB remove-B 50/14/30/60; UBR add-W 33/20/51/102/10; WUBRG
  remove-G 10/18/55. Geometry suppressed (all four groups `display:none`).
  0 bar/meter/progress/score elements; 111 tier badges at ONE distinct height.
  Flying keeps its Dragons-and-Phoenixes restriction; Flash shows its
  provenance with authority, collapsed by default (105px closed, 515px open).
  Layer state survives an explore -> mechanics -> explore round trip. 37 tiles.
  No console errors.
- Skipped checks: CDN-unavailable and reduced-motion, unchanged in blast
  radius; the new CSS adds no animation and the existing reduced-motion block
  already clears transitions with `!important`.
- Risks or unverified items: the HTML is now 265 KB, up from 153 KB, entirely
  from the inlined dataset. Fine from disk; worth revisiting if it is ever
  served over a slow link.

## robqa report

- Result: `pass`.
- Severity: two `note`-level test defects in the developer's own checks,
  corrected before any conclusion was drawn.
- Scope check: only the declared files changed; the source layer, taxonomy,
  runtime generator and fixtures are untouched.
- Evidence: browser figures quoted above were compared against
  `data/fixtures/*.json` and match exactly, which is the point of the
  golden files -- the panel mirrors `selection.py` rather than reinterpreting
  it. Search now ranks exact then prefix then substring, so "flying" returns
  Flying first instead of burying it under two longer matches.
- Blocked checks: the hash preview route could not be exercised end to end.
  The preview pane serves the page as a `data:` URL and drops the fragment, so
  the regex was verified directly (`#mechanics=preview` true, `#color=W`
  false) and the mode was entered by calling `setMode`. Same standing
  `setRoute` limitation.
- Human check required: open the file from `file://` with
  `#mechanics=preview` and confirm the control appears and the panel reads
  well. That is the visual review this work was staged for.
- Defects: none outstanding. For the record, both of my first-pass
  measurements were wrong, not the code: `clientHeight` on a slotted
  `<details>` child reports a value even while collapsed -- the known-good
  `.panel-src` control behaves identically -- so collapse had to be measured
  on the details' own `offsetHeight`.

## Decisions needed

- RESOLVED. All four source conflicts are adjudicated and recorded in
  `data/mcp2021.reconciled.json` under `rulings`, each with its authority and
  mechanism. Two are confirmed by the companion change log; two are absent
  from it, meaning unchanged since 2017 and the summary list is simply wrong.
  For the record, the conflicts were:
  | mechanic | colour | colour list | ability catalog |
  |---|---|---|---|
  | `+N/+N (on spells)` | W | secondary | primary |
  | `Deal N damage to a creature with flying.` | R | secondary | tertiary |
  | `Exiling cards from graveyard` | W | primary | secondary |
  | `Flash` | B | tertiary | secondary |
- The digest split queue is SUPERSEDED. The article separates those bundles
  itself, so the 41 rulings are no longer needed.
- Re-add `scrollbar-gutter:stable`? It removes the measured 10px text reflow
  between scrolling and non-scrolling panels. With the track now transparent
  it no longer produces a visible gutter, so the original objection to it no
  longer applies. Awaiting the user.

## Follow-ups

- Next per `MECHANICS-CONTRACT.md`: the Vox family taxonomy as its own
  reviewable artefact, then the runtime projection, then ten fixtures, then
  panel design, then wiring. Nothing past adjudication has started.
- `max-height:calc(100vh - 180px)` hard-codes the height of the chrome above
  the stage. If the hero or control rows change height, that constant needs
  revisiting; a container query or a measured custom property would be more
  durable. Not done here -- outside the envelope.
