# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed`
- Owner: `robqa`
- Task: Merge the doubled source notes on conflict panels; stop the panel
  resizing the wheel.
- Requested outcome: (1) A conflict panel shows ONE "Sources & scope"
  disclosure, not two. (2) Selecting a vertex, edge, chord, crossing or a
  Combine set must not move the wheel. The panel is bounded and scrolls
  internally, and is somewhat larger at rest.
- Allowed files: `vox-color/color-wheel.html`, `HANDOFF.md`, `CONTEXT.md`
  (open-item tick only).
- Allowed surfaces: `.stage` grid alignment; `.panel` box metrics and
  overflow; the `<details class="panel-src">` emitted by `collegeBlock`;
  `showEnemy`'s source string; panel scroll reset on new selection.
- Non-goals: no wheel geometry change; no crossing coordinates touched; no
  copy or lore rewrites; no new dependency; no change to the emphasis model;
  no change to the atlas; no new animation.

## Acceptance criteria

- A conflict panel with a college renders exactly one `details.panel-src`,
  containing both the colour-pie scope text and the Strixhaven scope text.
- Non-college panels are unchanged: still exactly one source disclosure.
- The wheel's rendered position is identical across a mono, ally, enemy,
  four-colour and cleared selection.
- `.panel` is bounded on desktop and scrolls internally; it is not bounded in
  the single-column layout below 900px.
- Panel scroll position returns to the top when a new selection is made.
- No console errors; 32 identities / 37 tiles still hold.
- Keyboard activation, visible focus and the polite live region still work.

## Test plan

- `node --check` on the extracted inline script.
- Measure `svg.wheel` bounding rect across five selection kinds and compare.
- Count `details.panel-src` per panel kind.
- Desktop, ~768px and ~360px viewports.
- `prefers-reduced-motion: reduce`.
- Enter/Space activation and focus visibility.

## robdev report

- Changed files: `vox-color/color-wheel.html`, `CONTEXT.md` (open-item tick
  only), `HANDOFF.md`.
- Summary: `collegeBlock` no longer emits its own source disclosure;
  `showEnemy`'s single note appends `SRC_SCOPE_COLLEGE` when the pair has a
  college, so a conflict panel has one drawer holding both scopes. `.stage`
  moved from `align-items:center` to `start`. `.panel` gained
  `min-height:420px` (was 330), `max-height:calc(100vh - 180px)`,
  `overflow-y:auto`, `overscroll-behavior:contain`, `scrollbar-gutter:stable`.
  A `max-width:900px` block lifts the bound in the single-column layout.
  `activate()` resets `panel.scrollTop`.
- Decisions: the perspective buttons deliberately do NOT reset scroll -- that
  is a change of framing mid-read, not a new subject. `scrollbar-gutter:stable`
  so the panel does not change width when the scrollbar appears.
- Checks: `node --check` on the extracted script - OK. Wheel bounding rect
  measured across cleared/mono/ally/three conflicts/four-colour/cleared - ONE
  distinct position (was the defect). Source-drawer count 1 on every populated
  panel, 0 on the empty state. Viewports 1440x900 (bounded, scrolls),
  768x900 and 360x780 (unbounded, `overflow-y:visible`, no horizontal
  overflow). Scroll reset 250 -> 0 on new selection, 250 -> 250 on a
  perspective button. 37 tiles, 10 keyboard-reachable edges, panel
  `aria-live="polite"`, Mechanics still disabled.
- Skipped checks: CDN-unavailable rendering, and `prefers-reduced-motion`
  emulation -- this change adds no animation and no font-dependent metric, so
  neither is in its blast radius.
- Risks or unverified items: `max-height:calc(100vh - 180px)` assumes the
  header/controls above the stage stay near their current height. If that
  chrome grows, the panel bottom could crowd the viewport edge.

## robqa report

- Result: `pass`, after one defect found and returned.
- Severity: the defect found was `major`; fixed and re-verified.
- Scope check: `git status` shows only the three declared files.
  `CONTEXT.md` touched solely to tick the open item this task closes.
- Evidence: wheel rect `407,40,530` identical across all eight states, from
  `getBoundingClientRect()` measured per state -- the acceptance criterion.
  `details.panel-src` count is 1 on mono/ally/all three conflicts/four-colour
  and 0 cleared. At 1440x900 `clientH=718 scrollH=1079 scrolls=true`; at 768
  and 360 `overflowY=visible`, `bounded=false`, no horizontal overflow.
- Blocked checks: hash routing. The preview serves the page as a `data:` URL,
  where `location.hash` assignment is refused -- the console shows exactly the
  two "Not allowed to navigate top frame to data URL" errors this produces.
  This is the pre-existing `setRoute` open item in `CONTEXT.md`, not a
  regression: `activate()` triggers it identically before and after.
- Human check required: open `vox-color/color-wheel.html` from `file://` in a
  real browser and confirm `#color=`, `#ally=`, `#enemy=`, `#four=` and
  `#combine=` still write to the address bar and survive back/forward.
- Defects: MAJOR (fixed) -- the `max-width:900px` panel override was written
  into the media block beside `.stage`, roughly 165 lines ABOVE the `.panel`
  rule. Both selectors are a single class, so `.panel` won on source order and
  the bound never lifted: 768px and 360px both reported `overflowY=auto`,
  `bounded=true`, giving phones a scroll box inside a scrolling page. Moved
  directly below `.panel` with a comment saying it must stay there;
  re-measured at both widths.

## Decisions needed

- None.

## Follow-ups

- `max-height:calc(100vh - 180px)` hard-codes the height of the chrome above
  the stage. If the hero or control rows change height, that constant needs
  revisiting; a container query or a measured custom property would be more
  durable. Not done here -- outside the envelope.
