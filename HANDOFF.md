# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `ready-for-qa` — **implemented and at Owner Review (2026-10-01).**
  The approved prototype is promoted into `color-wheel.html`, verified (see
  "Implementation" below) and deleted. The candidate commit is recorded in
  "Implementation". The evidence is `robdev`'s own; `robqa` has not run an
  independent pass. Not accepted. Transitions: `complete -> idle ->
  dev-in-progress -> awaiting-decision -> dev-in-progress -> ready-for-qa`.
  The prior story, "Mechanical Color Pie explorer — Magic makeover", was
  accepted by the Owner on 2026-09-27 and committed as `2bf3dbf`; its full
  ledger is in git at `e060296`. Per `CLAUDE.md` (one session, one job), the
  work starts in a fresh session.
- Owner decisions, 2026-09-27, in the Owner's words, given after a red team of
  the proposal. The coordinating agent's reading, stated to the Owner before
  "go", follows each.
  1. "Stay visual mtg only" — the illustrated field guide becomes the look of
     the MTG visual pages. This story restyles `color-wheel.html` only.
  2. "yes retire it, i want uniform look" — glass (`backdrop-filter`) and the
     mana-colour ambient mesh are retired together.
  3. "something that fits the current look" — edge emphasis keeps opacity,
     stroke width and glow together (`AGENTS.md`); the glow is retinted to fit
     the field guide.
  4. "Yes, option a copy into each page" — the field-guide tokens are copied
     into the page's own `:root`. No shared stylesheet; the page stays one
     static file.
  5. "Double check for me please, visual and content should not be bogus" —
     every name and factual label on the page is verified against sources,
     and Wizards' Fan Content notice is added to the footer.
  6. "lets leave it for now", and: "dont do anything with mechanics mode yet,
     leave it turned off because I need to see how it fits the new mechanical
     piece I built." — Mechanics mode code is not edited and stays
     preview-only.
  7. "approve the font, it should be uniform across please" — the Google Fonts
     URL becomes the explorer's exact family and weight set, including IBM Plex
     Mono.
- **Owner decisions, 2026-10-01** (Owner review of the prototype: "OWNER
  APPROVAL: APPROVED"):
  1. The prototype is approved as the production treatment. This unlocks the
     `CONTEXT.md` and `AGENTS.md` updates.
  2. Gilt edge glow, as prototyped. Do not revert to the pair-colour glow.
  3. The receded vertex labels keep their faded treatment, as intentional
     de-emphasis. They are not brightened. **This is an explicit Owner
     decision:** in that de-emphasised state they measure 2.73:1 (name) and
     1.67:1 (goal), below 4.5:1.
  4. Remove the unverified card-derived "Also called" names from the page:
     the Ikoria triome, dragon and Apocalypse names on the five wedges, and the
     Nephilim names on the five four-colour identities. The research stays
     here and in git.
  5. Correct the Strixhaven source note: the colleges' fields of study come
     from "In the Strixhaven, Part 1", not the Planeswalker's Guide.
  6. The Fan Content notice names the page "Vox Mana’s Color Wheel".
  7. Keep the verified "barefoot is not a type of shoe" quotation exactly as
     it is.
  - Two deliberate differences from the explorer: focus outlines on this page
    stay **2px** (Chromium draws 1.5px at 1px). The four-colour "Community
    typically reads it as…" lines stay **unchanged** and labelled as community
    reading: not re-sourced, rewritten or removed in this story.
- These decisions reverse recorded project rules, so the rule text changes
  are in this envelope, **but only after the Owner approves the prototype**:
  `CONTEXT.md` design constraints ("No carved/embossed ornamental borders",
  "Glass needs colour behind it"), its type stack and colour tokens; and
  `AGENTS.md`'s "glass-over-colour visual system" rule and its note on the
  fonts URL. "Single static HTML" is kept.
- Owner: the Owner, for review. `robdev` implemented.
- Task: **Colour wheel — field-guide restyle.** Bring
  `vox-color/color-wheel.html` (page ground, hero, controls, Explore and
  Combine, side panel, atlas, footer) into the illustrated field-guide system
  accepted on the explorer, so the MTG pages share one look, without changing
  what the wheel shows or how it behaves.
- Requested outcome, first deliverable: step 0 recon (below); then a temporary
  prototype of the named states beside today's page at 360 and 1440 px, with
  captures and the proposed edge-emphasis treatment, for Owner review. After
  the Owner approves: implement, run the checks, update `CONTEXT.md` and
  `AGENTS.md`, delete the prototype, and hand to Owner review. Do not mark
  acceptance.
- Allowed files: `vox-color/color-wheel.html`; `HANDOFF.md`;
  `vox-color/color-wheel-prototype.html` (temporary; deleted when implemented);
  and, only after the Owner approves the prototype, `CONTEXT.md` and
  `AGENTS.md` for the rule changes listed above.
- Allowed surfaces: the wheel page's shared chrome and its Explore and Combine
  views — page ground, hero, layer and mode controls, side panel, lenses and
  sources disclosure, atlas, footer. Not touched: Mechanics mode code and route
  (`mcp*` rules and functions, `#world`, the L1–L3 layers, the preview route,
  the disabled production toggle); wheel geometry and the five crossing
  coordinates; hash deep links; `vox-color/mechanical-explorer.html`;
  `vox-color/mechanical-periodic-table.html`; `vox-color/build/`;
  `vox-color/reference/`; `data/`; `tools/`; `docs/`; `MECHANICS-CONTRACT.md`.
- Mechanics mode, shared pieces: its CSS uses the same colour names
  (`--gold`, `--glass`, `--panel`, `--hairline` and others), the side panel,
  the buttons and the page ground. Those old names stay defined so its preview
  route does not break. Step 0 lists everything it shares; any change to its
  appearance caused by shared pieces is shown to the Owner. Nothing in
  Mechanics mode is edited.
- Dependencies: the Google Fonts URL changes, approved by the Owner (decision
  7), to the explorer's exact set: Almendra 400/700, Cormorant SC 500/600/700,
  IBM Plex Mono 400/500, Lora 400/500/400 italic, Outfit 300/400/500. Cormorant
  SC 400 is dropped, so step 0 lists every use of it, including in Mechanics
  CSS. `mana-font@1.18.0` unchanged. No other dependency, no build step, no
  framework.
- Colour tokens: the explorer's field-guide values (ground, plate, ink, gilt)
  copied in. `--bone` and `--w --u --b --r --g` are unchanged (already
  identical on both pages). `--c` stays as it is: unverified, not retuned.
  Mana colours are used only as data.
- Wheel rules kept: static at rest; reduced motion skips effects; edge
  emphasis uses opacity, stroke width and glow together; crossing coordinates
  fixed; the wheel is the instrument.
- Content: every name and factual label is checked against Wizards sources
  and the canon corpus in `../voxmana.io/docs/research/canon/` (read only;
  `canon-inventory-four-color-reference-audit.md` there is not a source). If
  the corpus is unavailable, that check is `blocked`, not passed. Findings are
  reported; nothing is rewritten without an Owner decision. Pause for any
  unverified name, any direct quotation and any new player-facing lore. The
  Fan Content notice uses Wizards' standard wording, as on the explorer.
- Non-goals: any Mechanics mode change; the periodic table; the explorer; the
  ~200 orphaned `mcp*` panel lines and the `.panel` max-height (follow-ups);
  a shared stylesheet; new data; card images; changes to what a colour, pair,
  crossing or identity says beyond reporting a verified-wrong fact.

## Support files

None in the repository. The token and stylesheet source is
`vox-color/mechanical-explorer.html`; the Owner's field-guide style guide
(design-system artifact and zip, made 2026-09-27) documents it. The explorer
story's capture harness lived in that session's scratchpad and must be rebuilt
(headless Edge; 360 at DPR 2, 768, 1440).

## Acceptance criteria

1. **Whole-page look.** Page ground, hero, controls, side panel, atlas and
   footer use the field-guide tokens, type roles and materials. No
   `backdrop-filter`, no mana-colour mesh; mana colours appear only as data.
2. **Instrument unchanged.** Wheel geometry, crossing coordinates, hash deep
   links, and Explore and Combine behaviour are unchanged. The rest, related
   and unrelated edge states stay distinct through opacity, stroke width and
   glow, measured before and after.
3. **Mechanics untouched.** No edit to Mechanics code or its route; still
   preview-only and off in production navigation. Every appearance change it
   inherits from shared pieces is listed here.
4. **Content verified.** Every name and factual label on the page has a
   recorded source or is reported as unverified; the Fan Content notice is
   verbatim; no unverified name or quotation is added.
5. **Access.** Text meets 4.5:1 on its ground (measured); focus is visible
   everywhere; keyboard flow is unchanged; reduced motion skips effects;
   usable at 360, 768 and 1440 px; readable with Google Fonts or mana-font
   blocked.
6. **Fonts.** The Google Fonts URL matches the explorer's exactly.
7. **Checks.** `node --check` on the extracted script passes; the four gates
   pass (they check data, not the page, so they are not evidence for the
   restyle); the restyle's own checks are measured in the browser and
   recorded here, with before/after captures.
8. **Rules updated.** After prototype approval, `CONTEXT.md` and `AGENTS.md`
   describe the new look and no longer contradict the page.

## Test plan

- Gates before and after: `check_invariants`, `check_taxonomy`, `check_recon`,
  `gate` (all exit 0); `node --check` on the extracted script.
- Headless Edge captures at 360 (DPR 2), 768 and 1440 of the named states,
  before and after, plus runs with Google Fonts and jsdelivr blocked.
- Measured in the browser: text contrast on each ground; edge opacity, stroke
  width and glow per state; no `backdrop-filter` outside Mechanics; the fonts
  URL.
- Keyboard: tab order, Explore and Combine selection, Escape, focus return.
- Mechanics preview route opened before and after; differences listed.
- Human check: `file://` hard reload and back/forward on the deep links.

## Step 0 recon

Done by `robdev`, 2026-09-27, before any product edit. Captures, the harness
and fetched sources are in the session scratchpad, not the repository.

1. **Baseline.** HEAD `e060296`; only `HANDOFF.md` modified.
   `color-wheel.html` sha256 `5bc4b5a2…d6084e`. Gates: `check_invariants`,
   `check_taxonomy`, `check_recon`, `gate` all exit 0. `node --check` on the
   extracted script (lines 1738–4347): pass. Harness rebuilt: headless Edge
   over CDP with Node's built-in WebSocket, no dependencies; 360 @2x, 768 and
   1440; named states plus the foot and `#mechanics=board`; also a run with
   Google Fonts and jsdelivr blocked. Edge channels measured on every
   visible edge at 1440: rest .45 / 1.6px / glow 0; related 1 / 3.4px /
   glow .55; unrelated .22 / 1.4px / glow 0; unrelated under the pointer
   .45 / 2px / glow 0; glow = blurred pair gradient (`#lit`, σ 3.4).
   Defects found on today's page: the `.tier` collision below (boxed atlas
   tiers, tile text overflowing its tiles, and horizontal overflow at 768,
   measured `scrollWidth > innerWidth`); and `--bone-faint` text at
   2.3–2.4:1 even on plain obsidian (hero kicker, vertex goals, Clear,
   college designation, Sources, tile code and note, tier count).
2. **Mechanics sharing map.** Tokens its CSS (834–1386) reads: `--gold` 30,
   `--bone-faint` 30, `--bone-dim` 23, `--hairline` 19, `--glass` 2,
   `--obsidian` 1, `--bone`, `--ease`. Its JS (2564–3503) writes one gold and
   four bone literals inline. Shared elements: the page ground (`body`,
   `.mesh`); `.hero`; `.modes`/`.mode-btn`; `.layers`/`.layer-btn`, including
   `#lay-mech` (the disabled production toggle, enabled only on the route);
   `.stage`, `.wheel-wrap`, `svg.wheel` (docked: vertices, halos, glyphs, the
   `#lit` vertex glow, viewBox swapped); `.dock-cap`; `#panel` (hidden in
   Mechanics); `.sr-only`; `.swatch`/`.ms-cost` through `dot()`; the atlas
   below the world; helpers `esc`, `dot`, `nm`, `D`, `setMode`,
   `clearSelection`, `highlight`. **Collision:** Mechanics' `.tier` badge rule
   (line 900: 9px, uppercase, `nowrap`, bordered) also matches the atlas's
   `<section class="tier">`, and tile sub-lines and notes inherit it.
   `.plate`, `.board`, `.rail`, `.band`, `.hit`, `.stack`, `.world` are
   Mechanics class names and must not be reused. **Cormorant SC 400** is used
   only by Mechanics: `.rail-sel`, `.tf-n`, `.wl-title` and `.mx-label` set no
   weight. With 400 dropped they render at 500. No other use.
3. **Colour literals (re-derived; chrome CSS / Mechanics CSS / Mechanics
   JS).** Gold `rgba(212,175,55,…)` 12 / 22 / 1 = 35. Bone
   `rgba(237,230,211,…)` 18 / 23 / 4 = 45. Obsidian `rgba` 2 / 1 / 0 = 3.
   Panel `rgba` 3 / 0 / 0 = 3. Black 3 / 1 / 0. The mesh: five mana lobes
   and one gold lobe. `backdrop-filter`: 14 declarations in 7 rules (4 chrome:
   `.layer-btn`, `.mode-seg`, `.panel`, `.tile`; 3 Mechanics: `.rail`,
   `.tile-f`, `.wl-over`), plus 2 `@supports` fallbacks. The red team's "11"
   counted lines. `border-radius:999px` 13 (5 / 8), plus one `99px` in
   Mechanics. `var(--gold)` 44 (14 / 30). Gold focus outlines 19 (6 / 13).
   `#lit` feeds 4 rules. The tier badges use 9 literals (Mechanics). The
   `.hero-rule` five-colour hairline is CSS with no element.
4. **Names and labels.** Checked against the canon corpus's verbatim
   captures (available) and, where the corpus lacks the article, the Wizards
   page itself, fetched 2026-09-27. Scryfall supplied printed card names and
   colour identities.
   - Verified: colour goals (Pie Fights, 2016-11-14; its own "green wants
     growth" contradiction is reported correctly); the ten guild names; the
     five allied values, five allied splits, five conflict titles and ten
     perspective labels (Pie Fights; Thank You for Being a Friend,
     2017-03-20). Also the shards: names, centre colour, titles and dates
     (2008). The wedges: attributes, titles and dates (2014–15). The New
     Capenna families (Brokers, Obscura, Maestros, Riveteers, Cabaretti). The
     C16 commanders, deck names, lenses and deck descriptions (Fleischer,
     "Designing Commander (2016 Edition)", 2016-10-24; C16 decklists).
     Strixhaven: college names and designations (Planeswalker's Guide,
     2021-04-01; "College of Life and Death" on the Secrets of Strixhaven
     product page), plus conflicts, fields, disputes, magic forms and the
     design note ("In the Strixhaven" Parts 1 and 2, 2021-03-29 and 04-05).
     The pole names (dean MDFCs). The colorless claims ("Just the Artifacts,
     Ma'am", 2005-02-28; "The Council of Colors, Revisited", 2024-08-26), and
     the five-colour claims ("Party of Five", 2009-02-02; "Mana with All the
     Fixin's", 2009-03-23).
   - Method lines: faithful paraphrases of the "key to …" sentences. Black's
     "without apology" is the page's gloss on "selfishness". Sultai's centre
     colour is inferred from the article's speaking order.
   - **Direct quotation (existing):** "Colorless isn't a color (as I like to
     say on my blog, "barefoot is not a type of shoe")" — character-exact
     against "Third Time's the Charm, Part 2" (2024-05-27). It is the leading
     clause of a longer sentence, quoted without an ellipsis.
   - **Unverified as names:** the "Also called" entries Indatha / Raugrin /
     Zagoth / Savai / Ketria (Ikoria triomes), Teneb / Numot / Vorosh / Oros /
     Intet (dragons) and Necra / Raka / Ana / Dega / Ceta (Apocalypse), and
     the four-colour Glint-Eye / Dune-Brood / Ink-Treader / Witch-Maw /
     Yore-Tiller (Guildpact Nephilim). Every card name exists and matches its
     colours, but no Wizards source found calls the colour combination by
     it. The Apocalypse Sanctuaries are mono-coloured cards.
   - **Unsourced by design:** the five four-colour "Community typically reads
     it as …" lines (labelled as community reading).
   - **Wrong citation:** the Strixhaven source note credits the colleges'
     fields to the Planeswalker's Guide. They come from "In the Strixhaven,
     Part 1".
5. **Named states.** As proposed: Explore at rest; `#color=W`; `#enemy=WB`;
   `#combine=WUR`; `#atlas`; the phone panel as `#enemy=BG` at 360 with Sources
   open (covers lens and disclosure). Added: the foot of the page, and
   `#mechanics=board` for inherited changes.

## Prototype (history)

`vox-color/color-wheel-prototype.html` was built 2026-09-27 from the page,
with the field-guide chrome CSS, Mechanics CSS and script unchanged except
the atlas rename, plus a review bar and a `?compare` board of embedded
captures. It was approved on 2026-10-01 and **deleted** after the promoted
page passed verification. It was never committed, and the previous
`color-wheel.html` is not archived; git history is the archive.

## Implementation (2026-10-01, `robdev`)

**Candidate commit:** recorded in the commit that follows it on `master`
("HANDOFF: record candidate commit"). Not pushed.

**Files changed:** `vox-color/color-wheel.html`, `CONTEXT.md`, `AGENTS.md`,
`HANDOFF.md`. Deleted: `vox-color/color-wheel-prototype.html` (untracked).
Not touched: `mechanical-explorer.html`, `mechanical-periodic-table.html`,
`data/`, `tools/`, `docs/`, `vox-color/build/`, `vox-color/reference/`.

**How it was promoted.** The approved prototype file (sha256 `ec7893e0…`) was
the source. Its prototype-only pieces were stripped: the header comment,
title suffix, head script, review bar, review CSS, compare board and
embedded data. Then decisions 4 and 5 were applied. A four-line LOOK note
went into the page's head comment. Result: `color-wheel.html` sha256
`c9a7752e…a8db605ea`, 4,097 lines, 342 KB.
- **Page CSS:** the prototype's CSS minus its review-only block (exact
  string match). Tokens copied by value from the explorer into `:root`.
  Legacy names (`--obsidian`, `--gold`, `--glass`, `--hairline`,
  `--bone-dim`, `--bone-faint`…) keep today's values for Mechanics. The mesh
  and every chrome `backdrop-filter` are gone. Focus is 2px gilt. The Google
  Fonts URL matches the explorer's (string compare).
- **Mechanics CSS (old lines 834–1386):** byte-identical. **Script:** 12
  lines differ from HEAD: 1 atlas rename (`<section class="tier">` →
  `"atlas-tier"`), 10 `aka` removals (5 wedges, 5 four-colour identities;
  the shard New Capenna names stay) and 1 citation fix in
  `SRC_SCOPE_COLLEGE` ("…Fields of study: "In the Strixhaven, Part 1,"
  March 29, 2021.").
- **Markup:** the mesh element is gone; the kicker's middle dot is wrapped
  for the gilt colour; a `#lit-gilt` filter is added in `<defs>`
  (geometry untouched); a footer carries the notice "Vox Mana’s Color Wheel
  is unofficial Fan Content permitted under the Fan Content Policy. Not
  approved/endorsed by Wizards. Portions of the materials used are property
  of Wizards of the Coast. ©Wizards of the Coast LLC."
- **Atlas `.tier` collision fixed:** the atlas sections are now
  `.atlas-tier`. Mechanics' `.tier` badge rule is unchanged.

**Verification evidence.** Headless Edge over CDP, `file://`, 360 @2x / 768 /
1440. HEAD is a copy of the committed page; "prototype" is the approved file
with `?clean`.
- Gates after: `check_invariants`, `check_taxonomy`, `check_recon`, `gate` all
  exit 0 (baseline 2026-09-27 also 0). `node --check` on the extracted
  script: pass.
- **Matches the approved prototype:** 29 captures (rest, `#color=W`,
  `#enemy=WB`, `#four=W`, `#combine=WUR`, atlas, foot, `#mechanics=board` ×
  3 widths, the phone panel × 2, 3 wheel close-ups). 20 are pixel-identical.
  `#four=W` and `#combine=WUR` differ only by the removed "Also called" line;
  the phone panel only by the longer Strixhaven note. `#enemy=WB` @1440
  differs in a 28 px strip at the panel's foot, which also differs between
  two runs of the same file (the 0.18 s "more below" fade): capture timing,
  not drift.
- **No horizontal overflow** in any of the 29 production captures. HEAD
  overflowed at 768 in all 9 states.
- **Atlas collision gone:** HEAD had 6 `section.tier` with a 1px solid
  border, 9px, uppercase and `nowrap`, and 23 / 24 / 43 tile text lines
  escaping their tiles at 1440 / 768 / 360. Production has 0 `section.tier`
  (6 `.atlas-tier`), no border, `normal`, `none`, and 0 escaping lines in 37
  tiles at all three widths.
- **`backdrop-filter`:** only `#wl2` and `#wl3` (hidden Mechanics overlays)
  carry it.
- **Edge emphasis** (1440, computed, every visible edge), identical to HEAD:
  rest .45 / 1.6px / glow 0; related 1 / 3.4px / glow .55; unrelated .22 /
  1.4px / glow 0; unrelated under the pointer .45 / 2px / glow 0. The glow
  filter is now `#lit-gilt` (was `#lit` on the pair gradient).
- **Contrast** (34 text roles, lightest ground, 1440 and 360): minimum
  5.09:1, except the receded vertex labels at 2.73 and 1.67 (decision 3).
- **Keyboard and focus:** the tab order equals HEAD's (mode tabs, layer
  toggles, Clear, 10 edges, 5 vertices, panel controls), plus the new footer
  link. Every stop shows a visible indicator (2px gilt outline, or the SVG
  target's gilt stroke) at rest, at `#four=W` (crossings, Sources) and at
  `#combine=WUR` (centre, neighbour chips).
- **Behaviour, scripted by keyboard, HEAD vs production:** 20 of 20 checks
  give the same state except the approved name removals. The checks:
  - Deep links: none, `color=W`, `ally=WU`, `enemy=WB`, `four=W`,
    `combine=WUR`, `combine=`, `combine=WUBRG`, `atlas`.
  - Hard reload (`ignoreCache`) from each restores the same state.
  - Enter selects a target; Escape clears and focus stays on it.
  - Clear returns focus to `#panel`.
  - `history.back()` and `forward()` move between `#color=W` and
    `#ally=WU`.
  - Four-Color on, then crossing W.
  - Combine W, U, R resolves to Jeskai at `#combine=WUR`.
- **Reduced motion:** 0 running animations after a selection and all
  transitions 0s, as HEAD. Without it: 78 running animations, as HEAD.
- **Blocked fonts:** with Google Fonts blocked, rest, `#color=W`, `#four=W`,
  atlas and foot at 360 and 1440 are readable in fallback faces with no
  overflow. With mana-font blocked they are readable too: glyph discs are
  empty and names and codes remain.
- **No prototype UI or captures:** production contains none of
  `proto-review`, `proto-data`, `proto-compare`, `proto-clean`, `id="cmp"`,
  `data:image/webp`, `base64`, `color-wheel-prototype` or `PROTOTYPE`.
- **Mechanics** (`#mechanics=board`, captured before and after at 3 widths):
  production is pixel-identical to the approved prototype. Still route-only;
  `#lay-mech` markup is unchanged (`disabled`, "Mechanics — not wired").
- **Human check still due:** `file://` hard reload and back/forward in a real
  browser. Both pass headless above, but `CLAUDE.md` keeps them a human
  check.

**Inherited by Mechanics mode** (shared chrome only; nothing in it edited):
- The ground: field-guide ground and grain instead of obsidian and the mana
  mesh.
- Masthead, mode tabs and layer toggles, including the Mechanics toggle its
  route enables.
- Docked wheel: gilt roundels behind the colours; glyphs in the new ground
  colour.
- Cormorant SC 400 is no longer loaded, so `.rail-sel`, `.tf-n`, `.wl-title`
  and `.mx-label` render at 500.
- `.ms-cost` mana symbols use the page's five tokens.
- The board, rail and overlays keep their glass and legacy tokens, now
  blurring a warm ground.

## Decisions needed

- None open. At Owner Review; only the Owner marks acceptance.

## Follow-ups

- **Periodic table restyle to the field guide** — decided in principle
  (decision 1), deferred until the Owner has sorted Mechanics.
- **Mechanics mode and the explorer** — the Owner is working out how Mechanics
  mode fits the explorer. Until then it stays off and unedited.
- **Scryfall query idea — paused by the Owner (2026-09-27) as a separate
  future task.** Needs its own story, scope and Owner decisions.
- **Source layer, candidate reopen (reason 3 in `MECHANICS-CONTRACT.md`):** the
  sub-heading grouping of the "Return target … from graveyard to hand."
  entries, and the missed explanation of "Creature sacrifice, forced,
  repeatable". `data/` and `tools/` are frozen.
- Carried forward from `55c391e`: `AGENTS.md` and `CONTEXT.md` still describe
  Mechanics as unbuilt; about 200 orphaned `mcp*` panel lines in
  `color-wheel.html` (Mechanics code: leave until the Owner sorts Mechanics);
  the hard-coded `.panel` max-height in `color-wheel.html`; record the Three.js
  dependency in `CONTEXT.md` if the periodic table is accepted.
- **Combine bounce (bug in today's page, preserved):** with an Explore
  selection in the URL (e.g. `#color=W`), pressing Combine switches to
  Combine and then back to Explore about a frame later. `setMode('combine')`
  clears the selection, the hash empties, and `hashchange` sends the empty
  route to `setMode('explore')`. The same happens on HEAD and production.
  From rest it works. Script behaviour, outside this story.
- Stale wording left alone (Mechanics, out of scope): the page's head comment
  still says "LAYER 4 … stubbed, not built", like `CONTEXT.md` and
  `AGENTS.md`.
- Found in this story's recon, outside its envelope: the explorer's 1.5px
  focus outline renders at 1px in Chromium at 1x density. The wheel has no
  no-mana fallback (the explorer shows letters), so its glyphs are boxes
  when jsdelivr is blocked; colour names still appear beside each one.
- Carried forward: commit or gitignore `docs/DATA-DOSSIER.html`; re-add
  `scrollbar-gutter:stable` to `color-wheel.html`; accept or tighten the
  periodic-table atlas's ragged edge.
