# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `complete` — **Owner accepted, 2026-09-27**, after review round 1
  ("Owner accepted. The plate controls look aligned, and the colorless wording
  now describes the explorer's scope accurately."). Transitions this session:
  `awaiting-decision -> dev-in-progress` (Owner chose A),
  `dev-in-progress -> ready-for-qa -> qa-passed`; the Owner's two review fixes
  were made and re-checked while held at `qa-passed` (see "Owner review round
  1"); then `qa-passed -> complete` on the Owner's acceptance. One session
  performed both roles; disclosed as not independent review. The ledger stays
  at `complete` until the next task resets it to `idle`.
- Owner decisions, 2026-09-27: **Direction A, illustrated field guide**, for
  the whole page; B is not used. Before applying A, fix its measured index
  scanning cost (a compact, readable index typeface, sizing or column
  allocation; the index need not use the explanation's Lora) and bring wrapping
  and list height close to baseline. Add Wizards' standard unofficial
  Fan Content notice to the footer, keeping the 2021 source attribution and the
  cited-card artist and image credits. Remove the prototype when finished. Keep
  the checkpoint of the unaccepted prior version.
- Owner: the Owner (accepted). Closed out by the coordinating agent.
- Prior story, **superseded, not accepted.** "Mechanical Color Pie explorer —
  pure 2021 edition" stood at `qa-passed` (Owner Review). robqa's `qa-passed`
  was a self-QA in the same session, disclosed as not independent. **The Owner
  did not accept that story and did not pass its visual review.** On 2026-09-27
  the Owner superseded it with this design pass. To open this story under the
  legal transitions in `AGENTS.md`, the coordinating agent recorded
  `qa-passed -> complete -> idle -> dev-in-progress`; here `complete` only
  closes the superseded ledger. It is not Owner acceptance.
- Prior story's exact uncommitted state was preserved during this story as
  checkpoint commit `d34a852` (parent `55c391e`) on the local branch
  `checkpoint/pure-2021-polish-unaccepted`, which was never pushed. After
  accepting this story, the Owner deleted that branch on 2026-09-27 as no
  longer wanted, so `d34a852` is on no branch. Baseline figures below that cite
  `d34a852` refer to that prior state.
- Task: **Mechanical Color Pie explorer — Magic makeover.** A presentation and
  navigation pass over the existing explorer so it reads as recognizably
  Magic, across the whole page (typography, materials, spacing, colour,
  controls, selected states), while the 216-entry list stays fast to scan.
  Mark Rosewater's *Mechanical Color Pie 2021* remains the only authority for
  mechanical facts.
- Requested outcome, first deliverable: step 0 recon; then two distinct coded
  prototype directions of the same real page states (compass with WR / Boros
  selected, one mechanic detail, search results) at 360 and 1440 px, with
  before/after captures and a recommendation. After the Owner chooses, the
  chosen direction is implemented across the page and the source, interaction,
  responsive and repository gates are run.
- Allowed files: `vox-color/mechanical-explorer.html`, `HANDOFF.md`, and, until a
  direction was chosen, `vox-color/mechanical-explorer-prototype.html` (the two
  directions). The prototype was deleted on 2026-09-27 once A was implemented.
- Allowed surfaces: the explorer only. Not touched: `vox-color/color-wheel.html`,
  `vox-color/mechanical-periodic-table.html`, `data/` (runtime, fixtures,
  recon, families), `tools/`, `docs/`, `MECHANICS-CONTRACT.md`, `CONTEXT.md`,
  `AGENTS.md`.
- Dependencies: unchanged. Google Fonts (the existing families and weights
  only; the URL is not changed), `mana-font@1.18.0` pinned on jsdelivr, and the
  Scryfall API and image host only for the five cards Rosewater cites. No
  Floating UI, no Keyrune, no other new runtime dependency, no build step.
- Colour tokens: the five mana hues (`--w --u --b --r --g`) and `--bone` are
  registry tokens (`CONTEXT.md`) and are unchanged. The page-local ground, ink
  and gilt values are direction A's, approved by the Owner's choice of A.
- Names: the Owner approved verified Magic colour-combination names as
  navigation labels, always shown with the colour words and code
  (`Boros · White–Red · WR`). Names are not evidence about mechanics. Four- and
  five-colour combinations have no name here.
- Quotation: as before, the Owner asked for Rosewater's entry names and
  explanations to be displayed as written.
- Non-goals: no job taxonomy, direct/limited roles, strategy matrix, deck
  advice, generated explanations, colour ratings, guild mechanics inferred from
  lore, colour-pair ability summaries, representative card art for uncited
  entries, fake cards, or changes to frozen data. No new framework or visual
  library.

## Support files

None in the repository. Prototype captures, the capture harness and the
downloaded name sources are in the session scratchpad and are not part of the
deliverable.

## Acceptance criteria

1. **Source.** Every entry name, explanation and 2021 tier matches frozen data;
   the five exceptional entries keep their qualified labels; computed counts
   stay labelled "computed" and are never strength scores.
2. **Identity.** A player can select `WR` and see **Boros**, **White–Red**,
   mana symbols and `WR` in a selected-identity display, then inspect exactly the
   same computed one-colour steps as before. The 31 tiles stay equal in size and
   treatment; none implies a stronger identity. Every name shown or accepted by
   search is verified against a Wizards source listed below; the accessible name
   always carries colour words and code.
3. **Search.** `board wipe`, `ramp`, `red enchantment removal` and the
   natural-language dogfood query keep their result ordering and labels and
   produce no new mechanical verdict. A combination name resolves to its
   combination as navigation, visibly apart from article results.
4. **Cited cards.** A card preview appears only for the five cards Rosewater
   cites, never supplies the mechanical claim, credits card and artist, follows
   Scryfall's image rules (no cropping of artist or copyright, no tinting), and
   works as a text link without Scryfall or images; it opens by keyboard and
   tap, not hover alone.
5. **Whole-page treatment.** One coherent Magic-inspired system for type,
   materials, spacing, colour, controls and selected states; the list remains
   fast to scan; entries are not turned into fake cards.
6. **Responsive and access.** Usable at 360, 768 and 1440 px with no clipped
   pips, badges, focus outlines or sheet content (including the masthead colour
   letters at 360); keyboard-only flow, reduced motion and blocked
   font/image/network fallbacks remain readable.
7. **Checks.** The in-page self-check and the four repository gates pass;
   narrow checks are added for the name map, source labels, selected-panel
   accessibility and art fallback. Before/after captures and any dependency
   change are recorded here.

## Test plan

- Gates before and after: `check_invariants`, `check_taxonomy`, `check_recon`,
  `gate` (all exit 0).
- In-page self-check at 1440 and 768, and at 360 with reduced motion.
- Headless Edge captures at 360 (DPR 2), 768 and 1440 of the named states, plus
  runs with Google Fonts, jsdelivr, Scryfall API and Scryfall images blocked.
- Keyboard: tab order, compass and list roving, detail open/close and focus
  return, card-preview open by keyboard.
- Search regression: the four dogfood queries compared before/after by result
  keys, order and labels.

## Step 0 recon (2026-09-27, before any edit)

- `git status`: ` M HANDOFF.md`, `?? vox-color/mechanical-explorer.html`; HEAD
  `55c391e` on `master`.
- Gates: all four exit 0 ("All 53 recon assertions hold"). Runtime SHA-256
  `68ab50d7…cd856` unchanged.
- Self-check: 74/74 (1440); 75/75 at 360 with reduced motion; 74/74 with
  Google Fonts, jsdelivr and Scryfall blocked (the page switches to `no-mana`
  letter fallback). Console clean.
- Page weight (served locally): HTML 129 KB; runtime JSON 176 KB; abilities JSON
  117 KB; fixtures and recon CSV 8 KB (self-check only); Google Fonts CSS 2.4 KB
  plus font files; Mana CSS 8.4 KB plus font; 17 resource requests at load.
  DOMContentLoaded about 0.2 s, load about 0.8 s.
- Keyboard: 14 tab stops on the page (skip link, source link, search, five
  colours, two order buttons, two fold buttons, one roving compass tile, one
  roving list entry).
- Cited cards: exactly **five** `[autocard]` tags in the frozen runtime:
  Lobotomy (mvid 23170), Man-o'-War (413601), Time Walk (383131), Demonic Tutor
  (394025), Twiddle (45235).
- **The cited-card hover image exists** (the plan was right). Opening an entry
  asks Scryfall for the cited card, links the card name and shows the full card
  image (`normal`, 244 px) on pointer hover and on keyboard focus. Gaps: no
  card, set or artist credit in the preview; no "Card Rosewater cited" label;
  the image is `aria-hidden` with empty alt; on touch there is no preview path
  (a tap follows the link to Scryfall). Without Scryfall the name stays plain
  text.
- Scryfall image rules (docs/api/images and docs/api): do not cover, crop or
  clip the artist name or copyright on card images; do not distort, blur,
  desaturate or colour-shift them; no watermarks; an `art_crop` needs the artist
  and copyright listed in the same interface; do not imply Scryfall endorsement.
- Fan Content Policy: no unofficial-content notice exists anywhere in the
  repository (see Decisions needed).
- Baseline captures: masthead, compass default, compass with WR, "board wipe"
  results and the Lobotomy detail at 360, 768 and 1440; blocked-network compass
  and detail at 1440 and 360.

## Name verification (Wizards sources, retrieved 2026-09-27)

All 20 names the search already accepted were checked; **0 mismatches**, none
withheld.

- Primary source for all 20: Mark Rosewater, "Faction Packed", Making Magic,
  Oct 15, 2018 (magic.wizards.com/en/news/making-magic/faction-packed-2018-10-15),
  which lists each guild, shard and wedge with its colours.
- Corroboration: "A Flavorful Guide to the Guilds of Ravnica" (Oct 3, 2018) for
  Boros, Dimir, Golgari, Izzet, Selesnya; "Ravnica Allegiance Prerelease
  Primer" and the Ravnica plane page for Azorius, Orzhov, Rakdos, Gruul, Simic;
  Rosewater, "Between a Rock and a Shard Place" (Sep 5, 2008) for Bant, Esper,
  Grixis, Jund, Naya; "Khans of Tarkir Mechanics" for Abzan, Jeskai, Sultai,
  Mardu, Temur.
- Map: Azorius WU · Dimir UB · Rakdos BR · Gruul RG · Selesnya WG · Orzhov WB ·
  Izzet UR · Golgari BG · Boros WR · Simic UG · Bant WUG · Esper WUB · Grixis UBR
  · Jund BRG · Naya WRG · Abzan WBG · Jeskai WUR · Sultai UBG · Mardu WBR ·
  Temur URG.

## Prototype directions

(Historical; the prototype file was removed after A was implemented.)
`vox-color/mechanical-explorer-prototype.html` held both directions over the
same page, data and interactions: `?d=a` illustrated field guide, `?d=b` gilded
game interface (serve the repository, then open that path). It is the
explorer plus the shared structure below plus two CSS layers; a pill at the
bottom left switches direction. It is deleted when the chosen direction is
implemented in the explorer.

Shared structure, in both directions:

- The 20 verified names become labels: each compass tile's accessible name and
  tooltip read, for example, "Boros, White–Red, WR"; tiles still show only
  letters and mana symbols.
- A selected-identity display beside the compass grid (below it on phones): a
  medallion built from CSS and Mana (a pair splits on the diagonal like hybrid
  mana; three to five colors are equal wedges), the name when Wizards has one,
  the color words and code, the colors line's computed count, and the name's
  source, called "a label, not a claim about mechanics". No ability summary.
- A combination name typed in search adds a "Name" piece to the parse line
  with a "Compare WR" button (keyboard reachable; it selects WR in the compass
  and focuses its tile). Result rows are unchanged.
- The cited card becomes a visible figure after the explanation: full card
  image (never cropped or tinted), "Card Rosewater cited", card name, set and
  number, artist, and "Card image via Scryfall · © Wizards of the Coast". It
  opens Scryfall by tap or keyboard. Without Scryfall it is absent and the
  name stays plain text. The hover preview is kept.
- The masthead's W U B R G letters never split across lines at 360.
- In the phone sheet the placement strip gives way to the five placement rows
  (same information in words), so the explanation rises.
- Self-check: the old "no names in the compass" check is revised to "tiles
  never show a name"; five checks are added (name map, tile accessible names,
  identity content and heading, name attribution, identity count equals the
  colors line). 79/79 in both directions.

Direction A, illustrated field guide: warm umber ground; Cormorant SC small
caps for headings; Lora for entry names and prose; centered title page with a
gilt ornament rule; key and compass as framed plates ("Plate I", "Plate II")
with corner ornaments; compass neighbors dashed; an engraved medallion; the
list as an index with dotted leaders; the detail as a specimen plate with a
drop-capped explanation and a tipped-in card plate.

Direction B, gilded game interface: obsidian ground with a faint indigo
ambient light; epic capitals with a gold gradient for the title, identity name
and section heads; glass panels with bevelled gold edges; gem-lit mana on the
colors and tiles; a gold-bezel medallion; pill search and segmented order
control; list rows as slim bars; neighbors marked by a gold ring and dot; a
glass reading panel for the explanation.

Evidence (headless Edge, 2026-09-27):

- Search regression: 11 queries (`board wipe`, `ramp`, `unblockable`,
  `evasion`, `mono green`, `red enchantment removal`, `how does mono red deal
  with enchantments`, `flash`, `boros board wipe`, `temur ramp`, `forced
  sacrifice of a creature`) return identical result keys, order, labels,
  counts and lens in the explorer, A and B.
- List scanning cost at 1440: entries whose name wraps: before 41, A 74, B 41;
  list height 4144, 4650 (+12%), 4345 px (+5%). At 360: 51, 84, 53. No
  horizontal overflow at 360, 768 or 1440 in any version.
- Fallback: fonts, Mana and Scryfall blocked: medallion shows letters, card
  figure absent, card name plain text; both directions readable.
- Captures (scratchpad `makeover/cap/P1…P9`): compass with WR at 360 and 1440,
  identity panel at 360, Lobotomy detail at 360 (top and scrolled to the card)
  and 1440, `board wipe` at 360 and 1440, `boros board wipe` at 1440 — each as
  before | A | B.
- Not yet done (implementation stage): 768 captures of the chosen direction,
  focus-ring captures, reduced-motion capture, the 360 bottom-sheet overflow
  audit for all five exceptional entries and long names.

Recommendation: **B, gilded game interface**, with the reasons and caveats in
the Owner report of 2026-09-27.

## robdev report

Implemented direction A in `vox-color/mechanical-explorer.html` (the only
product file; +303 / −117 lines against checkpoint `d34a852`), then removed the
prototype.

- **Stylesheet.** One stylesheet, rewritten as the field-guide edition: A's
  page-local tokens on `:root` (plus `--plate`, `--corners`, `--orn-rule`,
  `--orn-rule-l` as inline SVG data); centered title page with a gilt ornament
  rule; Cormorant SC small capitals for section, plate, group and label heads;
  the key and the compass as framed plates ("Plate I", "Plate II") with corner
  ornaments; dashed neighbor tiles; the engraved identity medallion; the index
  with dotted leaders; the detail as a specimen plate with a gilt drop cap and
  the tipped-in card plate; a double gilt rule on the bar and footer. No
  direction-B rule and no `data-dir` switch remain.
- **Index scanning cost fixed (measured, see table).** Entry names are set in
  the page's compact UI face (Outfit 13.5 px, half a pixel above baseline), not
  Lora; the dotted leader takes only spare width (`minmax(0,1fr)`), so it never
  forces a wrap; column gap back to the baseline's 18 px; no extra margin before
  the placement strip. Headings, leaders, plates and the detail keep the
  field-guide type.
- **Phone sheet.** For every sheet (not only below 880 px) the redundant
  placement strip gives way and spacing tightens, so Rosewater's explanation
  starts inside the first view.
- **Structure carried from the prototype:** verified names as labels (tile
  accessible names and tooltips; tiles still show only letters and mana);
  selected-identity display; "Name" piece and "Compare WR" button in the search
  parse line; the cited-card plate after the explanation (full card, never
  cropped or tinted; "Card Rosewater cited"; set, number, artist; "Card image
  via Scryfall · © Wizards of the Coast"; its link has an explicit accessible
  name ending "Opens Scryfall."); the hover preview kept; masthead color
  letters kept on one line.
- **Footer.** Wizards' standard notice, worded exactly as the Fan Content
  Policy page asks (checked 2026-09-27), with the policy linked: "Vox Mana’s
  interactive edition of the Mechanical Color Pie 2021 is unofficial Fan
  Content permitted under the Fan Content Policy. Not approved/endorsed by
  Wizards. Portions of the materials used are property of Wizards of the
  Coast. ©Wizards of the Coast LLC." The 2021 source attribution (masthead link
  and footer paragraphs) and the card-plate credits are unchanged.
- **Contrast.** Footer, source-note footer, "No placement" row text and the
  key's empty-slot words moved from `--ink-mute` (about 2.8:1) to `--ink-dim`
  (5.1–5.6:1); unmatched-entry tags, player-term reasons and the plate numbers
  use `--brass` (6.2–6.8:1). `--brass-q` (4.0–4.3:1) remains only on
  decorative separators.
- **Self-check:** 82 checks (83 with reduced motion): the prior 74, the old
  "no names in the compass" check revised to "tiles never show a name", and
  new checks for the name map, tile accessible names, identity content and
  heading, name attribution, identity count, card-plate eligibility (exactly
  five citing explanations; an uncited entry has no anchor, link or plate) and
  the footer notice beside the 2021 attribution.

Index measurements (headless Edge, served locally; "wrapped" = entries whose
name takes more than one line; baseline = checkpoint `d34a852`):

| Width | Baseline wrapped / list height | Prototype A (Lora 15 px) | Implemented A (Outfit 13.5 px) |
|---|---|---|---|
| 1440 | 41 / 4144 px | 74 / 4650 px | **42 / 4185 px** |
| 1440, detail docked | 50 / 5074 px | — | **52 / 5061 px** |
| 768 | 40 / 6644 px | — | **40 / 6464 px** |
| 360 | 51 / 12343 px | 84 / 12484 px | **51 / 11944 px** |

Also measured and not chosen: Lora 13.5 px with the same leader rule, 48 / 4159
at 1440 and 59 / 11664 at 360 — closer to Lora's book look, but 7–8 more
wrapped entries. Minimum row height 44 px (baseline 46 px).

Phone sheet (360 × 800; sheet 494 px tall): distance from the sheet's top to
the start of the explanation, baseline → implemented. Lobotomy 484 → 380;
"−N/+N (on auras)" 395 → 308; "Creature sacrifice, forced, repeatable" 477 →
399; "Forced sacrifice of a creature" 426 → 350; three longest names 484 /
484 / 440 → 426 / 401 / 390. All now start inside the sheet's first view.

## robqa report

Re-derived from the acceptance criteria after switching roles; same session,
not independent.

1. **Source — pass.** Self-check 82/82 at 1440 and 768, 83/83 at 360 with
   reduced motion, 82/82 with fonts, Mana and Scryfall blocked; it compares all
   216 × 5 tiers, article order, the five exceptional entries, fixtures 01–08,
   10, 11 and all 75 recon transitions. Runtime SHA-256 `68ab50d7…cd856`
   unchanged. Gates: all four exit 0 ("All 53 recon assertions hold").
2. **Identity — pass.** WR shows the medallion, **Boros**, *White–Red*, `WR`,
   "155 of 216 … computed" and the name's source; the one-color steps are the
   same computed figures (fixtures and recon in the self-check). Tiles are one
   size and show only letters and mana. Accessible names read "Boros,
   White–Red, WR"; four- and five-color tiles carry color words and code only.
   All 20 names verified (Name verification).
3. **Search — pass.** 13 queries (`board wipe`, `ramp`, `unblockable`,
   `evasion`, `mono green`, `red enchantment removal`, `how does mono red deal
   with enchantments`, `flash`, `boros board wipe`, `temur ramp`, `forced
   sacrifice of a creature`, `creature sacrifice, forced, repeatable`,
   `-n/+n (on auras)`) return identical keys, order, labels, counts and lens in
   the baseline and the implementation. A name adds only the parse-line "Name"
   piece and "Compare WR" (keyboard reachable; selects WR and focuses its tile).
4. **Cited cards — pass.** Exactly five citing explanations; an uncited entry
   has no anchor, link or plate (self-check). The plate shows the whole card,
   name, set, number, artist and image credit, and says it identifies the card
   while the placement and explanation are Rosewater's. Reachable by Tab and by
   tap (always visible, not a hover). With Scryfall blocked: no plate, and the
   card name stays plain text inside the verbatim explanation.
5. **Whole-page treatment — pass, pending the Owner's visual judgment.**
   Field-guide system across masthead, bar, key, compass, identity, index,
   search, detail and footer; entries are index lines, not cards; index density
   at baseline (table above).
6. **Responsive and access — pass.** No horizontal overflow at 360, 768 or
   1440. 360 sheet audit (five exceptional entries and five longest names): no
   element outside the sheet, no sideways scroll, titles fit, sheet 62% of the
   viewport. Masthead color letters on one line at 360. Keyboard: 15 tab stops
   (baseline 14 plus the Fan Content Policy link); Enter opens an entry and
   Escape closes it with focus back on the entry; compass arrows move the roving
   tile; search ArrowDown and Enter open a result; in the detail, the close
   button, card-name link and card-plate link are reachable. Focus rings visible
   on tiles and entries at 360 and 1440. Reduced motion: 83/83. Blocked fonts,
   Mana and Scryfall: readable Georgia fallback, letter medallion and tiles.
7. **Checks — pass.** Self-check and gates as above; `node --check` on the
   extracted script OK; console clean; `git diff --check` clean; frozen paths
   untouched; Google Fonts URL unchanged; no new dependency.

Captures (scratchpad `makeover/cap2`; before = checkpoint `d34a852`): index at
1440 and 360; masthead at 1440 and 360; compass with WR at 1440 and 360; detail
at 1440; detail at 360 (Lobotomy, longest exceptional entry, card plate);
search `board wipe` at 1440 and 360; `boros board wipe` at 1440; 768 (masthead,
compass, sheet, search); focus and blocked-network states.

Not proven here: `file://` routing with hard reload and back/forward (a human
check, as before); real-device touch.

## Owner review round 1 (2026-09-27)

The Owner returned two fixes before acceptance; both were made surgically
(+25 / −5 lines in the explorer, including two new self-checks).

1. **Colorless.** The footer sentence "Colorless is not measured by the
   article." is removed; the footer no longer mentions colorless. Searching
   "colorless" (alone or with other words) still sets it aside as an ignored
   word and adds one labelled parse-line piece, scoped to this explorer only:
   "This explorer charts the 2021 placement tiers for White, Blue, Black, Red
   and Green only, so it has no colorless selection and no colorless tier." It
   makes no statement about what the article discusses. No sixth compass color
   and no colorless placements: the compass keeps its 31 W/U/B/R/G nodes.
2. **Plate controls.** Cause: folded, Plate I switched to a flex row, so its
   "Show key" followed the heading text; and on phones both controls wrapped
   under long headings to the left. Fix: each plate heading is a two-column
   grid (the heading takes the free width and wraps inside it, the control
   keeps the right column), and folded Plate I stays a block with only its
   vertical padding reduced and the legend below the heading. Measured control
   right edges, all four open/folded combinations: 1361.4 px at 1440, 720.2 px
   at 768, 313 px at 360 — identical for both plates in every combination.
   Re-injecting the old folded rule at 360 reproduces the defect (297 vs 313
   px). Focus outlines are visible on both controls, open and folded, at 1440
   and 360 (outline offset 2 px, inside the plates' 28 px / 12 px padding).

Re-run checks: self-check 84/84 at 1440, 768 and 360 (new: the colorless
answer and footer; both plate controls at one right-edge position in all four
open/folded combinations), 85/85 at 360 with reduced motion, 84/84 with fonts,
Mana and Scryfall blocked; search results for `board wipe`, `ramp`,
`red enchantment removal`, `how does mono red deal with enchantments`,
`colorless`, `colorless ramp`, `boros board wipe`, `unblockable` identical to
the pre-fix candidate; `node --check` OK; the four gates exit 0; frozen paths
untouched; checkpoint branch intact. Captures (scratchpad `makeover/cap3`):
plate controls before/after at 1440 and 360 including focus, and the
colorless search before/after.

## Decisions needed

- None open for this story. Owner visual review passed and the story was
  accepted on 2026-09-27.
- Resolved 2026-09-27: direction A chosen; Fan Content notice added.
- Keyrune stays removed. Per the makeover plan it would only return beside a
  cited card's verified set code, if that helps identify the printing.
- Carried forward unchanged: commit or gitignore `docs/DATA-DOSSIER.html`;
  re-add `scrollbar-gutter:stable` to `color-wheel.html`; accept or tighten the
  periodic-table atlas's ragged edge.

## Follow-ups

- **Scryfall query idea — paused by the Owner (2026-09-27) as a separate
  future task.** Not started and not part of this story; it needs its own
  story, scope and Owner decisions before any work.
- **Source layer, candidate reopen (reason 3 in `MECHANICS-CONTRACT.md`),**
  carried from the prior story: the sub-heading grouping of the "Return target
  … from graveyard to hand." entries, and the missed explanation of "Creature
  sacrifice, forced, repeatable". Not fixed: `data/` and `tools/` are frozen.
- Carried forward from `55c391e`: `AGENTS.md` and `CONTEXT.md` still describe
  Mechanics as unbuilt; about 200 orphaned panel lines in `color-wheel.html`;
  the hard-coded `.panel` max-height in `color-wheel.html`; record the Three.js
  dependency in `CONTEXT.md` if the periodic table is accepted.
