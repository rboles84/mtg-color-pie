# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed` — Owner Review
- Owner: `robqa`
- Prior story: the Three.js / CSS3D **Mechanical Periodic Table** prototype was
  `qa-passed`. The Owner explicitly authorized `qa-passed -> complete`,
  `complete -> idle`, and opening this story `idle -> dev-in-progress`. That
  round proved the architecture: 216 mechanics can live in one persistent
  CSS3D world whose topology changes when an identity is selected. This round
  does not reprove it.
- Task: **Mechanical Periodic Table — Visual Hierarchy + Spatial
  Readability.** A focused presentation pass on the same prototype. No new
  product capability. The question is no longer "can the world exist" but
  "does the first frame communicate that it is a mechanical atlas rather than
  a dark dashboard holding 216 small cards".
- Requested outcome: from twenty feet the Owner sees 23 family districts; from
  five feet the mechanical landscape of the active identity; on interaction,
  the mechanics. Selecting a colour must leave zero doubt that the physical
  shape of the world changed.
- Allowed files: `vox-color/mechanical-periodic-table.html`, `HANDOFF.md`.
- Allowed surfaces: the prototype only. `vox-color/color-wheel.html` is NOT
  touched — the accepted flat implementation stays byte-identical for
  side-by-side comparison. `data/`, `tools/`, `MECHANICS-CONTRACT.md`,
  `CONTEXT.md` and `AGENTS.md` are NOT touched.
- Authorized dependency: unchanged. Three.js only, pinned jsdelivr ES modules,
  no npm, no build step, no tween library, no second visualization library.
- Non-goals: no change to source layer, taxonomy, runtime, fixture goldens or
  recon truth. No tier-as-magnitude encoding. No new navigation architecture.
  No merging into the flat implementation. No self-acceptance of the visual
  result.

## Support files

None created. Still one self-contained HTML file that `fetch`es the canonical
`data/mechanical-color-pie.runtime.json` over the static server.

## Acceptance criteria

- **AC1 — Macro hierarchy.** At the neutral full-world view the 23 districts
  are the primary structural read; the 216 plates no longer overwhelm the
  composition. A screenshot reads as an atlas before it reads as a dashboard.
- **AC2 — Unmistakable extrusion.** Selecting an identity produces immediately
  perceptible categorical depth with no manual camera work. Blue → Izzet →
  Temur visibly reshapes the same persistent world. The four planes stay
  categorical: equal card size on every floor, never magnitude.
- **AC3 — Spatial continuity.** The floor plan stays useful during extrusion.
  Family focus feels like entering a district with the world still behind it.
  Mechanic selection reads as the final inspection depth.
- **AC4 — Search revelation.** Search materially changes the hierarchy of the
  world. `flying` reveals Flying; `graveyard` reveals a region; a zero-result
  query leaves the world unchanged; search composes with identity extrusion.
- **AC5 — World remains hero.** Rail, topbar, legend and QA chrome support the
  table. Neutral state is quiet. Detail is prominent only when requested.
- **AC6 — Truth preserved.** Runtime, taxonomy, selection semantics and
  fixtures unchanged. All truth-layer gates green. In-page self-test green.
  Colorless still `not_measured`. No tier-as-score anywhere.
- **AC7 — Interaction quality preserved.** Camera, search, family focus,
  selection, keyboard, reduced motion, rapid retargeting and idle rendering
  all still work, with no unexplained console errors.

## Test plan

- Full gate chain before and after: `check_invariants` · `check_taxonomy` ·
  `check_recon` · `gate`. No frozen file may change.
- `node --check` on the extracted module script.
- In-page self-test, extended with structural checks for what this pass
  introduced: one header per family, unique district names and numbers, header
  counts equal canonical family sizes, one empty slot per mechanic sitting
  exactly on that mechanic's home address, one card footprint at rest, no
  plate leaving its own floor at rest or with its district entered, no two
  floors overlapping, exactly one detail surface.
- Visual states inspected repeatedly in the browser: neutral · Blue · Izzet ·
  Temur · four-colour · Five-Color · Colorless · `flying` · `graveyard` ·
  zero-result · search over Temur · family focus on the largest, a medium and
  the one-mechanic family · long-label selection · 1280 / 1920 / 3440 widths.
- Behaviour re-measured, not assumed: identity sequence counts, object
  identity, rapid retargeting, reduced motion, keyboard traversal, console,
  idle rendering.

## robdev report

- Changed files: `vox-color/mechanical-periodic-table.html`, `HANDOFF.md`.
  Nothing else. `git status --porcelain` shows only those two plus the five
  untracked artifacts that predate this story.
- **The one diagnosis that drove everything.** The old grid stepped by
  `CARD + 14` in both axes, and a district's floor hugged its own cards
  exactly. So the gap between two districts was the same 14 units as the gap
  between two cards inside one — there was no channel, and the floor itself
  was drawn at 1.8% bone on a 9% border, fainter than every card sitting on
  it. 216 plates therefore read as masonry and the families read as nothing.
  The fix is a ladder of three grounds — stage darkest, floor above it, plate
  above the floor — plus a real channel between floors.
- Layout. Grid step is now `CARD + 52` by `CARD + 44`; a floor is its cards
  plus 11 units of padding, which leaves a constant 30 x 22 channel of bare
  stage between neighbouring districts, widened optically by a dark ring.
  `GRID_COLS` 14 → 15 and the district aspect target 2.2 → 1.8, which turns
  towers into bands and drops the skyline from 24 rows to 23 with a cleanly
  stepped profile (23, 23, 21, 21, 21, 21, then 20 across the last nine
  columns). World 4500 x 3128. Deterministic; the packer is unchanged in kind,
  only in its constants. No family membership, ordering or size was touched,
  and the silhouette is still irregular because the data is.
- District. The floor is now a real recessed slab: 4.5% fill, 21% border,
  corner registration ticks painted as gradients on the slab itself (no extra
  elements), and a header plate that owns one whole grid row — district
  number, family name in Cormorant SC at 54 units, count. The rule under the
  name is the line between "which family" and "which mechanic".
- District numbers are an atlas index in **alphabetical** family order, not
  packing order and not size order, precisely so a number can never be read as
  a ranking. `stat_modification` is D18, not D01.
- Plate. Quieter by default — 5.2% fill, 8.5% border, label at 70% bone — and
  loud on approach: hover, keyboard focus, search match, selection, or being
  inside the entered district. Never loud because of what tier it holds.
  Footprint is unchanged at every plane and in every state except the one
  selected card.
- **Empty slots.** Each floor now carries one dashed outline per mechanic at
  that mechanic's home address, invisible on the neutral table and faded up
  only in identity mode. This is the single strongest extrusion cue: you see
  the plate and the hole it left. They are plain child nodes of the 23
  district elements — 216 more DOM nodes, zero more `CSS3DObject`s, so the
  transform cost of a state change is unchanged. They are enumerated per
  mechanic, never a repeating pattern, which would draw slots for mechanics
  that do not exist.
- Extrusion. Planes widened 470/158/-158/-470 → 660/220/-220/-660, and the
  depth station retilted to phi −0.30 / theta 0.40 / 1.26 x fit. Two angles
  were built and rejected on screenshots: theta 0.48 (the old one) did not
  separate the floors, and theta 0.60 threw the left third of the world into
  extreme foreshortening and off-frame. Depth also now buys a plate a drop
  shadow, so it reads as an object above the ground rather than a brighter
  patch of it.
- Unavailable recedes as a single categorical step — recessed Z, 30% opacity,
  no border, no shadow — and primary, secondary and tertiary plates stay
  pixel-identical to one another. There is deliberately no four-step opacity
  ramp; that reads as a quality ranking, which is the one thing tier is not.
- Family focus. The radial spread is **gone**. The new structural self-test
  measures whether a plate leaves its own floor, and with floors this far
  apart even a spread of 1.05 failed it — the outer plates of a large family
  escaped and covered the neighbours they were supposed to stay in context
  with. Proximity is what makes a district readable now: focus lifts the
  plates as one slab and the camera dollies onto it. The camera gains a third
  station, FAMILY: the current angle, aimed at the district, at a distance
  derived from that district's own size, so Tokens (1) and Stat Modification
  (34) both arrive framed. Leaving a district returns to the station it came
  from. Only an explicit district choice moves the camera; hover and typing
  never do.
- Search. Nonmatches quieten to 14% and desaturate; matches take gold border,
  gold wash and a shadow; floors with hits keep a gold-tinted header plate and
  floors without recede. The rail's hit list drops from 12 rows to 8 so it
  supports the world instead of competing with it.
- Rail. Three declared levels. The neutral readout has lost its border and
  fill entirely — a bordered box of three numbers was a dashboard widget
  arguing with the table — and only gains a panel once an identity is live.
  Detail keeps a gold top rule that matches the gold the selected plate wears
  on the table: one state, two places, and its head repeats the atlas index
  and the district number. Topbar metadata shrank; the self-test is a 9.5px
  footnote. The rail is now `clamp(296px, 19vw, 352px)` rather than a fixed
  336, because 336 is a quarter of a 1280 desktop and a twelfth of a 4K one.
- Kept experiments out of the final state, per the brief: no second district
  treatment, no alternate depth camera, no commented-out abandoned CSS. The
  `--panel` token, left unused after the rail rework, was removed.
- Measured worst case, reported rather than hidden: selecting the longest
  label in the catalog (199 characters, `damage redirection`) expands that one
  card to 336 units tall and occludes two neighbours, which sit behind it
  because the selected card carries a lift. That is the accepted round-one
  behaviour — the selected plate is the one place on the table that opens its
  complete canonical name — with the label size trimmed 23 → 21 to reduce the
  cost. The complete name also stays in `aria-label`, in `title` and in the
  detail record for all 216.
- One file was created outside the envelope during development and removed
  before handoff: `.claude/launch.json`, a local preview-server config. It is
  gone; `git status` is clean of it.

## robqa report

- Result: `pass`, with the standing caveat, restated because it matters: this
  session performed both development and QA. **This is not independent
  review.** The Owner's own eyes are still the acceptance test for AC1–AC5.
- Scope. `git status --porcelain` shows exactly `M HANDOFF.md` and
  `?? vox-color/mechanical-periodic-table.html`. `git diff --stat HEAD` over
  `data/`, `tools/`, `vox-color/color-wheel.html`, `MECHANICS-CONTRACT.md`,
  `CONTEXT.md`, `AGENTS.md`, `PHYREXIA-PLAN.md` and `PROMPT.md` is empty. The
  five untracked artifacts from earlier stories were preserved untouched.
- Gates before and after: `check_invariants` PASS, `check_taxonomy` PASS,
  `check_recon` PASS (53 assertions plus agreement with the goldens),
  `tools/gate.py` exits 0 as the library module it is. `node --check` PASS on
  the extracted module.
- In-page self-test: **69 of 69** on a cold load, up from 56, against the
  eleven fixture files fetched at runtime. The 13 new checks are structural,
  not cosmetic: they assert that a district cannot lose its header, that names
  and numbers stay unique and complete, that a plate cannot change size to say
  something about a tier, that a slot sits exactly on its mechanic's home,
  that no plate leaves its floor, and that no two floors overlap. No truth
  check was weakened and no expected value is typed into the page.
- The floor-escape check earned its place immediately: it failed the first
  build of family focus and is the reason the spread was removed.
- Slot alignment verified independently by projecting each slot's local CSS
  offset back into world coordinates and differencing against the mechanic's
  home: 0 misaligned across a sampled district, and the self-test asserts it
  across all 23.
- Transformation, measured from real object positions after settling:
  TABLE `{none: 216}` · Blue `57/20/17/122` · Izzet `99/27/13/77` · Temur
  `135/23/5/53` · back to Izzet byte-identical · Non-Green `187/14/5/10` ·
  Five-Color `215/1/0/0` · cleared `{none: 216}`. Every figure matches the
  fixtures and matches the previous round exactly — presentation changed,
  arithmetic did not.
- Continuity: object references identical before and after the whole sequence;
  216 cards, 23 districts and 216 slots throughout; nothing recreated.
- Retargeting: nine selections issued without settling leave the world exactly
  at the last one. Eleven identity changes took 21ms, eighteen search
  keystrokes 35ms, family focus 3ms, selection 16ms. All targets finite.
- Search: `flying` ignites 5 and gilds the two districts that hold them;
  `graveyard` gilds the Graveyard district as a solid block plus scattered
  hits elsewhere; `zzzqqx` leaves all 216 Z values bit-identical and ignites
  nothing. Searching over Temur composes: Flying sits at 850 (primary 660 +
  hit 190) while a miss sits at −810 (unavailable −660 + miss −150) and the
  extrusion is intact underneath.
- Composition of all four contexts verified numerically under reduced motion:
  Temur 660 → search 850 → family focus 1320 → selection 1470. Nothing
  replaces anything; everything displaces.
- Detail: exactly one `#detail`. Its head carries the atlas index and district
  number of the plate selected on the table, and the selected plate keeps gold.
- Colorless: explicit not-measured state, table left visible and flat, never
  "0 mechanics". Verified that a prior search is fully cleared behind it — an
  apparently stale gold frame in one screenshot was a mid-transition paint,
  not state: `hits 0`, `is-hit 0`, `has-search false`.
- Reduced motion (`?motion=reduced`): 69/69 pass, no tween, positions final
  immediately and correct, CSS transition duration `0s`, and search, family
  focus, selection and detail all still behave. Depth is preserved; only
  movement disappears.
- Keyboard: one tabbable card and one tabbable district header, arrows move,
  Enter selects and sets `aria-pressed`, Escape steps back. All 216 cards
  carry the complete canonical label in both `aria-label` and `title`; the
  quieter default plate did not cost a single accessible name.
- Rendering sleeps: with `renderer.render` instrumented, 5 renders across a
  transition and **0** across forced repaints once settled. No new permanent
  rAF loop. 2622 DOM nodes inside the world.
- Camera: bounded orbit and dolly unchanged; Reset view and Clear all both
  return the target to the origin and the camera to the table station.
- Widths: 1280 x 800, 1920 x 1080 and 3440 x 1440 all render the full world
  with no clipping, no collision and 69/69 green. The rail is 296 / 344 / 351
  units respectively.
- Console: clean on a fresh tab across the whole session.
- Visual red-team, answered honestly:
  - *Recognizable at a heavy downscale?* Yes. At 800px wide — a 2.4x reduction
    of the 1920 view — district names and district geography are the first
    read and the plates are texture.
  - *Do 216 plates still overwhelm the first read?* No.
  - *Can I find Graveyard or Combat without scanning tiles?* Yes.
  - *Is depth obvious immediately on selecting Blue?* Yes, and the required
    legend-hidden test passes: with the legend forcibly hidden the four
    populations are still separable by parallax against the empty slots.
  - *Does Izzet visibly evolve from Blue?* Yes — the same plates advance;
    nothing is rebuilt or dissolved.
  - *Does search reveal rather than decorate?* Yes.
  - *Does family focus preserve context?* Yes; the world stays behind it.
  - *Does the table feel like the primary object?* Yes in neutral and identity
    states. When a mechanic is open the rail is deliberately strong, which is
    the brief.
  - *Restraint?* No bloom, no fog, no particles, no scanlines, no animated
    atmosphere. Static at rest.
- Not proven here, unchanged from the previous round: `file://` routing with
  hard reload and back/forward — the preview pane rewrites that navigation, so
  the boot-failure message was not exercised in a browser; and the pane
  throttles `requestAnimationFrame` when it is not painting, so transition
  *smoothness* is judged from screenshots and from the render counter, not
  from measured frame timing. Both stay human checks.
- Also not proven here: appearance under non-default browser zoom. The layout
  was tuned and inspected at 100% only.

## Side task — data dossier (complete, Owner-requested)

Recorded separately because it ran alongside the periodic-table story above and
shares none of its envelope. That story's Control block is untouched.

- Status: `complete` — redteamed, corrected, gates green. Awaiting commit.
- Requested by: the Owner, directly in session, outside any prior envelope.
- Task: a single self-contained page inventorying everything in `data/` — file
  manifest, the L0→L5 derivation chain, the statistics, the family and
  selection tables, a browsable inventory of all 216 mechanics, and a
  non-obvious-findings section.
- Files added: `tools/build_dossier.py`, `tools/dossier_template.html`,
  `docs/DATA-DOSSIER.html`. Nothing else. `data/` verified clean by
  `git status --porcelain -- data/`, which unlike `git diff` also catches
  untracked files.
- Regenerate with `python tools/build_dossier.py`. The HTML is generated
  output; the template and the builder are the sources. No dependency, no
  build step, opens from `file://`.
- Non-goals honoured: no change to source layer, taxonomy, runtime, fixture
  goldens or recon truth. No `<progress>`/`<meter>`, no size-encoded tier —
  the one bar element in the page encodes counts, never tier. Tier renders as
  a category label throughout.

### Redteam pass and what it caught

The Owner asked for an adversarial recheck before commit. Six statements in the
dossier's own prose were false. All were hand-written assertions; every
computed table was correct and every golden figure already matched.

1. "Five-colour is the second most common breadth bucket" — it ranks 4th of 5
   (81, 75, 30, 26, 4).
2. "Most of what a colour adds is redundancy" — same-tier-new-owner is 3,135 of
   7,005 transitions (44.8%), and all other transitions total 3,870.
3. "`removal` is the sharpest colour signature anywhere" — `tempo` ties it
   exactly (Blue 12 / Black 1 against removal's White 12 / Blue 1).
4. "Six families hold under five members" — seven do.
5. "Two adjudications traced to stale 2017 data" — one is; two more are
   long-standing errors the change log shows were never corrected.
6. "Pair overlaps run 41–52" — the range is 39–52. Read off a truncated top-8
   table instead of computed.

Root cause in every case: asserting a ranking, a count or a range from
impression rather than from the array already in hand. The fix was not to
rewrite the sentences but to **derive them** — every one of those figures is now
computed from the payload at render time, with the tie in item 3 detected rather
than assumed. A future data change moves the prose instead of falsifying it.

Also corrected: the basis table showed the 467-assignment runtime population
next to a note quoting the 468 equation, with nothing saying they were different
populations. Both figures now appear side by side with the one-record difference
named. And `table()`'s `k:` path now escapes; the provenance rows were
de-pre-escaped in the same change so the source link still renders.

Quality items closed: legend for the `⚑` basis flag; `aria-label` on all seven
filter controls; `scope` on 123 header cells; `scroll-behavior:smooth` guarded
by `prefers-reduced-motion`; sticky table headers restricted to wrappers that
actually scroll; an explicit "what this dossier does not cover" section naming
the four prose files and two JSON layers whose contents are inventoried but not
reproduced, and naming `recon/mechanics-statistics-recon.md` as the authority
if the two ever disagree.

### Verification

- All four gates green after the change: invariants, taxonomy, recon, gate — 0.
- Goldens re-asserted in-browser from the generated page: W 104/60/24/20;
  WB 154/44/2/42/110/62; WUG 173/43; WUBR 206/10; WUBRG 216/215/1/0;
  WB→WBG 24/17/42/95/38. All exact.
- 16 sections render, 216 mechanic cards, 75 marginal rows, 11 fixtures.
  Filters round-trip: `counterspell` 3, White-any 104, White-primary 60.
- No duplicate IDs, no unlabelled controls, no sticky header outside a scroll
  container, no escaped-tag leakage from the escaping change.
- Not proven here: the preview pane serves the file as a `data:` URL and
  captures only the first paint, so **layout below the fold has not been seen**.
  Opening `docs/DATA-DOSSIER.html` from `file://` and scrolling it is a human
  check, as is its appearance in dark mode and at non-default zoom.

## Decisions needed

- Commit `docs/DATA-DOSSIER.html` itself, or gitignore it? It is 344 KB of
  generated output, fully reproducible from the two committed sources, and it
  rewrites a whole blob on every regeneration. The Owner asked for it to be
  committable, so it is left tracked — say the word to ignore it instead.
- Re-add `scrollbar-gutter:stable` to `color-wheel.html`? Carried forward from
  three tasks ago, still awaiting the Owner. Not touched here.
- Is the remaining ragged bottom-right of the atlas acceptable? 14% of the
  grid is empty, concentrated as a stepped edge under the shorter columns. It
  is the honest output of a deterministic packer over genuinely uneven
  families (34 down to 1), and the brief says not to square the table off, so
  it was left. If the Owner wants it tighter, the lever is `GRID_COLS` and the
  district aspect target, not the taxonomy.

## Follow-ups

- `AGENTS.md` still says "the unbuilt Mechanics control remains disabled" and
  `CONTEXT.md` still says the Mechanics overlay is "not built". Both predate
  the mechanics work. Left unchanged — outside this envelope.
- ~200 lines of orphaned panel code in `color-wheel.html` (`mcpOverview`,
  `mcpWhatChanges`, `mcpSearchBlock`, `mcpWire`). Left in place.
- `max-height:calc(100vh - 180px)` on `.panel` in `color-wheel.html` still
  hard-codes the chrome height above the stage.
- If this prototype is accepted, the Three.js dependency should be recorded in
  `CONTEXT.md` alongside the buildless/`file://` constraint, since this page is
  the first thing in the repository that needs a static server and a network
  fetch of a pinned CDN module.
