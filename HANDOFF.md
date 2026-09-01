# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed`
- Owner: `robqa`
- Task: Quiet the panel scrollbar and add a "more below" affordance.
- Requested outcome: the panel keeps native scrolling, but the opaque OS
  scrollbar stops reading as browser chrome bolted onto the instrument.
  Transparent track, thin muted-gold thumb, brighter on hover/focus. A subtle
  bottom fade appears only while content remains. Scroll chaining contained.
- Allowed files: `vox-color/color-wheel.html`, `HANDOFF.md`.
- Allowed surfaces: `.panel` scrollbar properties and overflow; a `.panel`
  scrollbar pseudo-element fallback; a sticky `.panel::after` fade; one small
  script block toggling a `has-more` class.
- Non-goals: no scroll-jacking; no custom scrolling engine; no new dependency
  (Radix is not an option -- this is not React and `AGENTS.md` forbids adding a
  runtime dependency); no change to wheel, atlas, copy, or the emphasis model;
  no scroll snapping.

## Acceptance criteria

- Scrollbar track is transparent; no opaque gutter stripe at the card edge.
- Thumb is visible enough to grab and brightens on hover/focus-within.
- Wheel/trackpad/keyboard scrolling all still work; the panel remains
  keyboard scrollable.
- Bottom fade shows only when content remains below, and is absent both at the
  end of the panel and on a panel that fits.
- No motion under `prefers-reduced-motion: reduce`.
- Reaching the panel's bottom does not scroll the page behind it.
- Wheel position still invariant across selections; 37 tiles; no new console
  errors.

## Test plan

- `node --check` on the extracted script.
- Computed `scrollbar-color` / `scrollbar-width`; confirm no reserved gutter.
- Toggle `has-more` across top / middle / end of a long panel and on a short one.
- Re-measure wheel rect across selection kinds.
- 1440x900, 768, 360.

## robdev report

- Changed files: `vox-color/color-wheel.html`, `HANDOFF.md`.
- Summary: `.panel` gains `scrollbar-width:thin` and
  `scrollbar-color:rgba(212,175,55,.30) transparent`, brightening to `.55` on
  `:hover`/`:focus-within`; a `::-webkit-scrollbar-*` fallback insets the thumb
  with a transparent border plus `background-clip:content-box`.
  `scrollbar-gutter:stable` removed per the ruling. `overscroll-behavior`
  narrowed to `-y`. A sticky `.panel::after` gradient gives the "more below"
  hint, toggled by a `has-more` class from a `moreBelow()` helper wired to a
  passive scroll listener, a MutationObserver on the panel, and resize. The
  fade is `display:none` below 900px where nothing is clipped.
- Decisions: native scrolling kept throughout -- no custom scroll engine.
  Radix ScrollArea was considered and rejected: this is not React, and
  `AGENTS.md` forbids adding a runtime dependency. MutationObserver rather
  than calling `moreBelow()` at each render site, because the panel is written
  by `innerHTML` from a dozen places. The scrollbar is quieted, not hidden --
  not every visitor has a wheel, trackpad or touch.
- Checks: `node --check` OK. Computed `scrollbar-width:thin`,
  `scrollbar-color:rgba(212,175,55,.3) rgba(0,0,0,0)`, `scrollbar-gutter:auto`,
  `overscroll-behavior-y:contain`, `overflow-y:auto`. `has-more` true at top
  (remaining 336) and at a genuine mid-scroll (remaining 216), false at the
  true end, false on a panel that fits, false when cleared; `::after` opacity
  tracks it 1 -> 0. Wheel rect one distinct position across five selection
  kinds. 37 tiles. At 375px the fade is `display:none`, panel unbounded, no
  horizontal overflow.
- Skipped checks: CDN-unavailable rendering. Reduced motion not re-emulated:
  the existing block already kills `transition` on `*, *::before, *::after`
  with `!important`, which covers the new fade by inspection.
- Risks or unverified items: see the reflow finding in the QA report.

## robqa report

- Result: `pass`, with one accepted trade-off the user should rule on.
- Severity: `note` (the reflow), plus two invalid readings in the developer's
  own first test run, corrected before conclusions were drawn.
- Scope check: only the two declared files changed.
- Evidence: computed styles quoted above. `has-more` transitions verified with
  real waits, not synchronously -- the developer's first pass read the class
  immediately after `showEnemy()` and reported `false` everywhere, which was a
  test defect: MutationObserver runs as a microtask. A second reading called
  "middle" was also invalid, having set `scrollTop` past the maximum so the
  browser clamped it to the end. Both were re-run correctly and pass.
- Blocked checks: hash routing, unchanged -- the preview serves the page as a
  `data:` URL where `location.hash` assignment is refused. Same standing
  `setRoute` open item.
- Human check required: confirm by eye that the thumb is findable but no
  longer reads as OS chrome, and that the bottom fade is subtle rather than a
  visible band.
- Defects: none blocking. NOTE, needs a decision: removing
  `scrollbar-gutter:stable` costs a measured 10px of content width when a
  panel scrolls (short panel 443px, long panel 433px), so body text rewraps
  between selections. The ruling against `stable` was conditional on content
  not visibly shifting; it does. Worth noting that the original objection --
  the opaque stripe -- was the track colour, which is now transparent, so
  `stable` would no longer read as a gutter. Left off pending the user's call.

## Decisions needed

- Re-add `scrollbar-gutter:stable`? It removes the measured 10px text reflow
  between scrolling and non-scrolling panels. With the track now transparent
  it no longer produces a visible gutter, so the original objection to it no
  longer applies. Awaiting the user.

## Follow-ups

- `max-height:calc(100vh - 180px)` hard-codes the height of the chrome above
  the stage. If the hero or control rows change height, that constant needs
  revisiting; a container query or a measured custom property would be more
  durable. Not done here -- outside the envelope.
