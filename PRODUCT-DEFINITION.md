# Product definition: The Color Pie (revised)

This is revision 6, written 2026-10-02 by the coordinating agent. It
records the Owner's final product-definition decisions of 2026-10-02 (see
`HANDOFF.md`) and the final Gate A story (§18). Revision 5 applied the
Owner's final corrections to §18 before QA. Revision 6 corrects the
documentation defects `robqa` recorded on revision 5 (D1–D5) and two of its
notes (N1, N2), under the Owner's direction. Neither revision reopens a
decision.

**The product definition is decision-complete.** No architecture or
source-policy decision remains before Gate A. The one exception is the
structural blocker that Gate A's Step 0 may find (§18.4). No integration has
been implemented. Earlier working revisions are not in Git: what each one
changed, and the decisions behind it, are recorded in `HANDOFF.md`. This file
enters Git history with the accepted planning candidate.

- **Nothing is implemented.** No product file, data, fixture, tool or source
  file was changed.
- **Baseline:** HEAD `7fa0e83`.
- **Pages audited:** `vox-color/color-wheel.html` (accepted at `421a75c`) and
  `vox-color/mechanical-explorer.html` (accepted at `2bf3dbf`).

---

## 1. Product definition

**The Color Pie** (working title) is one public, interactive presentation of
Magic's color pie as Mark Rosewater and Wizards of the Coast have published
it. It has two primary instruments:

- **Color Wheel**: the published color philosophies, their alliances and
  conflicts, and the 32 color identities.
- **Mechanical Color Pie**: Rosewater's *Mechanical Color Pie 2021*, which
  you can search, mark by color, and compare by color combination. The
  comparisons are computed and labelled as such.

The visitor sees one product about one subject, with two ways to examine it.
Internally, the two accepted applications stay separately owned for V1.
Vox Mana may host the product but is not an editorial authority for it.

**Name (working).** This is a small comparison only; nothing is final.

| Name | Assessment |
|---|---|
| **The Color Pie** (working title) | The exact term for the subject. Because it is Wizards' own term, the product must not read as official. The masthead must never read "Vox Mana · The Color Pie". |
| Inside the Color Pie | Editorial, and suggests depth. No Wizards title or product found by that name. |
| How the Colors Work | The plainest option, but it reads like an explainer. |

- **`WUBRG` as an accent.** It is Wizards' R&D shorthand for the color order
  (Rosewater, "Nuts & Bolts #1: Card Codes", 2009), and both instruments
  already use W U B R G codes. That makes it source-safe as a notation accent,
  such as an order mark. It is not approved as a title.
- **Descriptor territory.**
  - "Interactive *edition*" fits the explorer, which presents one article.
  - It overstates the wheel, which paraphrases about 25 articles.
  - "An interactive reference to Magic's published color philosophy and the
    Mechanical Color Pie" is the more accurate territory once Gate A passes.

  The wording is not finalized.

## 2. What it is not

- Not a Vox Mana interpretation, ontology or taxonomy of the color pie.
- Not a merger of the two applications' JavaScript, CSS, routers, keyboard
  handlers or state.
- Not a landing page that sends visitors away to two separate pages.
- Not synchronized. Selecting colors in one instrument never changes the
  other.
- Not the old embedded Mechanics mode in `color-wheel.html`, and not
  `mechanical-periodic-table.html`.
- Not an official Wizards reference, and never "the current color pie". The
  mechanics are a snapshot dated October 18, 2021.
- Not a ranking. Tier is a category, and counts are computed and labelled.
- Not a toolbox. No Scryfall discovery, Mana Base, Art Trail, Deck Art
  Director, Three.js or other utilities.

## 3. Authority and source contract (controlling rule)

1. **Allowed classes.** Every substantive player-facing statement is one of
   **Official**, **Computed** or **Navigation** (§4). Anything else is removed
   before integration. Neutral UI description (§4) is permitted wording about
   the page itself. It is not a source class and states nothing about Magic.
2. **No grandfathering.** Previous acceptance of either standalone page does
   not carry non-source content into this product.
3. **Evidence order.**
   1. The repository's verified canon corpus.
   2. Official Wizards web pages.
   3. Official card information. Scryfall may corroborate card metadata only.

   Community wikis, Reddit, fan sites, deck sites and general consensus are
   not authority.
4. **Gaps.** A gap is never filled from general knowledge. An unsupported
   claim is removed, reworded to describe only the page itself (neutral UI
   description, §4), or sourced.
5. **Attribution.** Nothing may be phrased as, or placed beside, a Rosewater
   or Wizards attribution unless that source says it.
6. **Branding.** The content experience reads as a presentation of published
   source material. Hosting identity belongs only in site chrome or the footer.
7. **Styling.** The field-guide visual treatment is unaffected by this rule.

## 4. Content-class model

| Class | Definition | Presentation rule |
|---|---|---|
| **Official** | Directly supported by Wizards or Rosewater material: philosophies, goals, methods, alliances, conflicts, official names, factions, 2021 entries, explanations and placements | Faithful paraphrase or verbatim, with the right citation. Where the source contradicts itself, both claims are shown |
| **Computed** | Deterministic arithmetic or geometry over official data: counts, best placement, deltas, identity resolution, wheel-structure facts | Visibly labelled `computed` or as derived. Never phrased as a Wizards statement, and never as strength or rank |
| **Navigation** | Aids to finding official material: player search terms, search-match reasons | Visibly marked as a navigation aid. Never evidence, never explanatory prose, never changes the official record |

Internal metadata, such as the 23 Vox families or the player-term `relWhy`
strings (V12), may exist in data. It is never rendered as player-facing truth,
and keeping it internally does not make it an approved source claim.

**Neutral UI description is not a fourth source class.** It only describes
the page or the interface, and it carries no external factual authority.
- **It may describe:** the page's scope; how the interface behaves; what this
  page does or does not display.
- **It may not assert:** Magic lore, color philosophy, identity meaning,
  mechanical ownership, naming conventions, or any other factual claim about
  Magic.
- **Example.** "This page does not assign a name to this combination." is
  neutral UI description. It is not evidence that Magic has no name for the
  combination.
- **On the Gate A sheet (§18.5)** it is the fourth label, after Official,
  Computed and Navigation. Its rows cite no source, because they make no
  source claim.

---

## 5. Source-purity audit by content system

### Method and coverage

- **Sources used:**
  - The canon corpus at `../voxmana.io/docs/research/canon/`: "Pie Fights",
    "Thank You for Being a Friend", "Hate Is Enough", the ten 2005–06 guild
    articles, and the ten shard and wedge interviews.
  - Wizards web pages, for sources the corpus lacks: the 2015 "Revisited"
    series, *Mechanical Color Pie 2021*, "Faction Packed", "Party of Five",
    "Mana with All the Fixin'", "Just the Artifacts, Ma'am", "Third Time's the
    Charm, Part 2", "The Council of Colors, Revisited", the Planeswalker's
    Guide to Strixhaven, and the Streets of New Capenna product page.
- **Exhaustive:** every name, goal, method, value, split, conflict title and
  tier definition.
- **Sampled:** long paraphrase systems. Coverage is stated per row, and the
  remaining strings are verified in Gate A (U7).

**Key finding for the explorer:** it already runs on Rosewater's article
order and sub-headings and exposes no Vox taxonomy. Families exist only as
internal data. Its own self-test asserts there is no family region, no family
attribute and no "family" wording on the page (`mechanical-explorer.html`
lines 1932–1937). `has_restriction` is never displayed (line 864).

### 5.1 Color Wheel (`color-wheel.html`)

| # | Surface: system | Class | Authority / evidence | Safe? | Action |
|---|---|---|---|---|---|
| C1 | Vertex labels and panel titles: the five goals | Official | "Pie Fights" (2016); all 5 checked | Yes | — |
| C2 | Color method line (`key`) | Official, paraphrase | "Thank You for Being a Friend" (2017) "key to…" closers; all 5 checked. Black's "self-interest without apology" softens "flexibility and selfishness" | After fix | U5 |
| C3 | Color summary (`blurb`) | Official, paraphrase | "Pie Fights" philosophy recap; all 5 checked | Yes | — |
| C4 | Color "What it costs" | Official, paraphrase | 2015 "Revisited" series; all 5 checked, including White's "treat everything equally" | Yes | — |
| C5 | Color panel lists of allies and conflicts; the two-faces arcs | Official | "Thank You…": "the intersection of its two alliances" | Yes | — |
| C6 | Alliance: shared value, blurb, "derived from the shared enemy", split | Official, paraphrase | "Thank You…"; all 5 values and splits checked | Yes | — |
| C7 | Pair "What it costs" (10) and conflict "How they work together" (5) | Official, paraphrase, **miscited** | They come from Rosewater's **2005–06 guild series** (sampled: Dimir, Golgari, Selesnya, Orzhov match). The panels cite only the 2016/2017 articles | After fix | V7, U7 |
| C8 | Conflict title, Neutral line, two perspective views | Official, paraphrase | "Pie Fights": the 5 titles, "At its core" lines and 10 view labels match. The view sentences were sampled. The sources-note gloss "a third framing, not the true one" is Vox commentary | Yes, after fix | U7, V4 |
| C9 | Strixhaven lens: names, designations, fields, conflicts, disputes, magic, Ravnica/Strixhaven contrast | Official | Planeswalker's Guide (designations re-checked here); "In the Strixhaven" 1–2; the *Secrets of Strixhaven* product page | Yes | Design note: U6 |
| C10 | Strixhaven pole names | Official (card text) | The dean cards | Yes | — |
| C11 | Strixhaven pole glosses | 4 Official, **Lorehold unsupported** | The Planeswalker's Guide matches Silverquill, Prismari, Witherbloom and Quandrix. Lorehold's "patterns, institutions…" and "contingent events…" are not in it | After fix | U1 |
| C12 | Guild, shard and wedge names | Official | "Faction Packed" (Oct 15, 2018) lists all 20; per-faction articles | Yes | — |
| C13 | Shard panel: center color, absent enemies, "What that produces" | Official, paraphrase + computed structure | 2008 interviews: Bant, Esper, Grixis and Naya phrases matched; Jund not yet matched | Yes | U7 |
| C14 | Wedge panel: attribute, "has no ally here", "How Tarkir expresses it" | Official, paraphrase + computed | 2014–15 interviews; 5 of 5 sampled phrases matched | Yes | U4 |
| C15 | Shards "Also called Brokers / Obscura / Maestros / Riveteers / Cabaretti" | The faction is official; **naming them as the combination is unsupported** | The New Capenna product page gives the families' colors. No Wizards source found uses them as names for those combinations | No | V5 |
| C16 | Colleges as aliases of guilds ("Enemy · also called Orzhov") | **Non-source** | Contradicts Rosewater's Strixhaven design parameter: colleges are what a pair disagrees about, guilds what it shares | No | V2 |
| C17 | Four-color labels ("Non-White"…), C16 deck lens, commander, deck | Labels are descriptive; the rest is Official | Fleischer, "Designing Commander (2016 Edition)"; C16 decklists | Yes | — |
| C18 | "Community typically reads it as…" (5 lines × 2 panels) and "The community line is community reading, not canon." | **Non-source** | No official source | No | V1 |
| C19 | Four-color "absent voice": the missing color's goal and method | Official strings, composed | `D.colors`; Rosewater, "Absence" (2013), on the missing color | Yes | — |
| C20 | "Four colours have no philosophy article of their own." | **Unsupported** (a negative claim) | A Vox research finding | After fix | U3 |
| C21 | Crossing geometry: each interior star crossing joins two enemy chords with four distinct endpoints, so it corresponds to four included colors and one excluded color; five crossings ↔ five four-color sets. Surfaces: the Four-Color layer's markers and their labels ("Four-color identity excluding White"), the crossing panel's intersection paragraph, the layer note | **Computed from official diagram structure** | The inputs are official: the WUBRG circle, allies adjacent, enemies across. "Pie Fights": "Colors are allied with the two colors on either side of them, and are enemies with the colors across from them". The derivation is purely geometric ("Geometry solved at build time") | Yes, once labelled as derived | V6 |
| C21b | Crossing interpretation: hero lede "the five identities hiding where the conflicts cross"; panel "the pentagram contains the whole tier and never labels it" | **Non-source interpretation** | No Wizards source defines four-color identities through the crossings, or says how the diagram labels them | No | V6 |
| C22 | Five-color: goals list, "How it plays", "What it costs" | Official | "Party of Five" (2009): "Why is this a five-color card?". "Mana with All the Fixin'" (2009): "limits the importance of the color pie" | Yes | Cite precisely |
| C23 | Five-color argument: "All five, still disagreeing…", "There is no spare name…", "most distinctive when…", "Where the tension lives…", tile "every conflict now internal" | **Non-source** | None | No | V3 |
| C24 | Five-color scope note | **Non-source attributed to Rosewater** | Neither cited article contains it | No | V4 |
| C25 | Colorless "barefoot" quotation | Official, verbatim | "Third Time's the Charm, Part 2" (2024) | Yes | — |
| C26 | Colorless "How it plays", "What it costs", "Not the same thing as" | Official, paraphrase + rules | "Just the Artifacts, Ma'am" (2005) confirms generic access, home ground, machines and the weakest-color rule; the rules facts are standard | Yes | — |
| C27 | Colorless glosses: "the mage … is avoiding committing"; "what it means comes from the card, not from the absence" | First unverified; second **non-source** | — | No | U2, V4 |
| C28 | Colorless scope note | Partly supported, **attributed composite** | "Not a faction or a school of thought" and "colorless commanders" are not found in the three cited articles | No | V4 |
| C29 | Atlas tile sub-lines and notes | Official strings + computed | The registry, derived from `D` | Yes, except C16 / C23 | — |
| C30 | Atlas "Tier 1–6", "Six tiers, thirty-two identities" | Vox grouping vocabulary | Groups by number of colors, labelled with the mechanics term | No | V8 |
| C31 | Combine: 32-identity resolution, neighbor chips, shape counts, "What it is made of" | Computed + official strings | The registry | Yes | — |
| C32 | Hero kicker "Vox Mana · Codex" | Vox branding and ontology in the content header | — | No | V9 |
| C33 | Fan Content notice | Wizards policy wording | Fan Content Policy | Yes (footer) | — |
| C34 | **Preview Mechanics mode**, reachable only by route (`#mechanics=board\|atlas\|layered`) | **Non-source** | Shows the 23 Vox families as "every family in Rosewater's 2021 mechanical color pie". "Tiers describe … not power" contradicts Rosewater's Primary definition | **No: reachable by URL** | V16 (route guard in Gate A) |

### 5.2 Mechanical Color Pie (`mechanical-explorer.html`)

| # | Surface: system | Class | Authority / evidence | Safe? | Action |
|---|---|---|---|---|---|
| M1 | 216 entry names in article order under its sub-headings; "Also written in the article as" | Official | Frozen source layer; `mcp2021.abilities.json` order and headings. One documented heading correction toward the article (`HEADING_FIX`) | Yes | — |
| M2 | Explanations | Official, verbatim | 2021 catalog. One entry's explanation is in the article but not captured; the page discloses this | Yes | Source-layer follow-up (exists) |
| M3 | Placements: 450 both-agree, 7 catalog-only, 5 list-only | Official | Frozen source; the basis is disclosed in the Source note | Yes | — |
| M4 | **5 source conflicts**, one tier used per entry (§5.3) | **2 Official**: Flash / Black and +N/+N (on spells) / White. The 2021 change log states the tier. **3 Vox adjudications**: Exiling cards from graveyard / White; Deal N damage to a creature with flying / Red; +N/+0 to your team / Black. No official source settles them | All 5 show one tier under "Placements · Rosewater, 2021", with the conflict only in a closed drawer. The ruling prose asserts Vox inferences ("summary-list error", "stronger anti-flying colour") | No | V11a, V11b |
| M5 | 4 semantic identity merges (power 3/4 → 3; planeswalker wording) | Official, with the normalization disclosed | Change-log evidence; the alternate wording is shown | Yes | — |
| M6 | Key: Primary / Secondary / Tertiary definitions | Official, paraphrase | Article intro. Primary drops "usually" ("usually at the lowest rarity") | After fix | V10 |
| M7 | Key note: "describe how often…, not how well" | **Non-source, contradicts the source** | The article says Primary "tends to be the color that most often pushes the power level" | No | V10 |
| M8 | Snapshot line; author "with the Council of Colors" | Official | Article ("I got the Council of Colors to help me") | Yes | — |
| M9 | `#limits` line | Official paraphrase + a **leaked internal instruction** | The runtime `meta.caution` includes "Never present this as the current state of the colour pie." | No | V13 |
| M10 | Search stages and match reasons; dropped words shown | Navigation | — | Yes | — |
| M11 | Player terms (exact / related), tagged "navigation aid" | Navigation | Player corpus counts, never shown as evidence | Yes | — |
| M12 | `relWhy` prose (6 strings: "stax is a strategy…", "a clone stays a copy"…) | **Navigation turned into explanatory prose** | Vox mechanical explanations | No | V12 |
| M13 | 20 combination names, "a label, not a claim about mechanics" | Official | "Faction Packed" (2018) | Yes | — |
| M14 | "No combination name is used for four or five colors." | Unsupported as phrased: it reads as a claim about Magic | — | No | V14 |
| M15 | Colorless search note | Describes the page only | — | Yes | — |
| M16 | Compass: counts, best placement, add/remove deltas, buckets | Computed, labelled "computed"; "a count is not a measure of strength" | Port of `tools/selection.py`, golden fixtures | Yes, **except** outputs that depend on the 3 Vox-adjudicated tiers (§5.3) | V11b |
| M17 | Lens lines: "No placement in … not evidence…", "Best placement among …" | Computed + Official framing (Rosewater's "default center") | — | Yes, except best placement where §5.3 applies | V11b |
| M18 | Cited cards (5 explanations) | Official (Rosewater's own `[autocard]` tags) + Scryfall metadata | — | Yes | — |
| M19 | 23 Vox families, family names, primary/secondary assignment, `has_restriction` | Internal metadata only, not rendered | The self-test enforces it | Yes (internal) | Keep the self-test |
| M20 | Masthead kicker "Vox Mana · An interactive edition" | Vox branding in the content header | — | No | V15 |
| M21 | Footer provenance paragraphs, Fan Content notice | Describe the page, plus policy wording | — | Yes | — |
| M22 | Footer self-test line | Developer diagnostics shown to readers | — | No | V13 |

### 5.3 The five source conflicts (V11 record)

The 2021 article places these five abilities differently in its per-color
lists and in its catalog ("All Abilities with Explanations"). The runtime
keeps one tier per entry, chosen by the source layer's standing rule ("the
catalog wins"). It keeps the losing claim as provenance. The question is
whether an official source, and not the rule, supports each chosen tier.

**Evidence:**
- The 2021 change log, "Mechanical Color Pie 2021 Changes", published the same
  day. It calls itself "a detailed list of every change I made between my
  Mechanical Color Pie 2017 article and today's 2021 version", with an OLD
  and a NEW entry for each change.
- The 2017 article (corpus capture), for the three entries the change log
  does not mention.

| Entry / color | Official claims | Tier used | Authority for that tier | Class |
|---|---|---|---|---|
| Flash / Black | 2021 lists: Black under both Secondary and Tertiary. Catalog: Secondary. Change log NEW: "Secondary: White, black, and green" (OLD: Tertiary) | Secondary | The 2021 change log states it outright | **Official** |
| +N/+N (on spells) / White | Lists: Secondary. Catalog: Primary. Change log OLD and NEW: "Primary: White and green" | Primary | The 2021 change log states it outright | **Official** |
| Exiling cards from graveyard / White | Lists: Primary. Catalog: Secondary. Not in the change log. 2017 has the same split (list Primary, catalog Secondary) | Secondary | The standing rule only | **Vox adjudication** |
| Deal N damage to a creature with flying / Red | Lists: Secondary. Catalog: Tertiary. Not in the change log. 2017 has the same split | Tertiary | The standing rule only | **Vox adjudication** |
| +N/+0 to your team (ongoing) / Black | Lists: Secondary. Catalog: Tertiary. Not in the change log. 2017 has the same split | Tertiary | The standing rule only | **Vox adjudication** |

**Why the change log doesn't settle the last three.** The frozen data's
ruling text says "absent from the change log, so unchanged since 2017". That
is true, but 2017 carries the same contradiction, so it settles nothing. The
catalog's prose doesn't fix the tier either: for example, the graveyard-exile
explanation says white does it "occasionally". Choosing the catalog is the
page's rule, not a Wizards statement.

**Computed outputs that depend on each tier.** These were measured by
recomputing every output under the other official claim, from the runtime
data.

| Entry / color | Lens selections whose best placement or bucket changes (of 31) | Compass steps whose category changes (of 150 shown) |
|---|---|---|
| Flash / B | 2: B, BR | 10 |
| +N/+N (on spells) / W | 8 | 28 |
| Exiling cards from graveyard / W | 8: W, WU, WR, WG, WUR, WUG, WRG, WURG | 24 |
| Deal N damage to a creature with flying / R | 8: R, WR, UR, BR, WUR, WBR, UBR, WUBR | 0 |
| +N/+0 to your team / B | 8: B, WB, UB, BG, WUB, WBG, UBG, WUBG | 0 |

**Surfaces that depend on the tier:**
- in `#detail`: the placement row and "Best placement among…";
- the lens tier on each search result;
- the best-tier mark on each list entry;
- the bucket counts "best is Primary / Secondary / Tertiary", and the lists
  they open;
- the compass step counts "best placement rises", "best placement falls",
  "another placement, best unchanged" and "one placement fewer, best
  unchanged".

**Surfaces that do not depend on it:**
- "N of 216 entries have a placement";
- the compass identity count;
- "newly placed" and "no longer placed";
- the "no placement" marks;
- the key specimen.

Both claims are placements, so these come out the same either way.

**Verdict.**
- **Two entries are official.** Flash / Black and +N/+N (on spells) / White
  are computed from official source. Their cleanup is presentation only
  (V11a).
- **Three entries are Vox adjudications, and they feed computed output.**
  - 22 of the 31 lens selections show at least one best placement or bucket
    that rests on one of them.
  - So do 24 of the 150 compass steps, all of them through graveyard exile.

  That is a **source-purity computation problem** (V11b). Disclosing the
  conflict does not clear it. **Decided 2026-10-02:** two coherent source
  readings, through one shared projection (§18.8–§18.9).
- **Internal records.** The frozen golden fixtures and recon files encode the
  same rulings. They are internal parity tests, not player-facing, and they
  stay frozen.

## 6. Definite violations (must be cleaned before integration)

**Color Wheel**

- **V1.** Remove the five "Community typically reads it as…" lines (Explore
  crossing panel and Combine panel), and the scope sentence "The community line
  is community reading, not canon."
- **V2.** Strixhaven colleges are presented as alternate names of guilds.
  Remove the alias treatment: drop "also called Orzhov" (and the rest) and the
  `of` framing. Each tile stays a Strixhaven college in its colors, the
  set-specific lens the conflict panel already labels it as.
- **V3.** Remove the five-color argument prose (C23), including the tile note.
  Keep the official goals list and the two Rosewater claims, with precise
  citations.

  Trap: the five-color tile needs a structural note in its place, for example
  "All five colors." Otherwise the tile renderer falls back to its
  "PLACEHOLDER — Codex dossier line goes here." text.
- **V4.** Vox-authored commentary in scope and source notes, some of it
  attributed to Rosewater:
  - the five-color scope note (wholly unsupported);
  - the colorless scope note (partly unsupported);
  - the colorless gloss "what it means comes from the card, not from the
    absence";
  - the conflict sources note, which calls Rosewater's own "At its core" line
    "a third framing, not the true one".

  Remove it, or replace it only with sentences an official source supports,
  cited correctly.
- **V5.** New Capenna families appear as "Also called" names for the shards.
  - Keep them only where they already appear, relabelled as a separate
    official faction context ("Streets of New Capenna family in these
    colors", sourced to Wizards' set material).
  - Never present them as alternate shard names.
  - No new UI and no new data structure (§18.6).
- **V6.** The crossings: keep the geometry, remove the interpretation.
  **Approved 2026-10-02.**
  - **Computed geometry (C21): keep.**
    - Each star crossing joins two enemy chords whose four endpoints are
      distinct. So each crossing corresponds to four included colors and one
      excluded color.
    - The inputs are official (the WUBRG circle, allies adjacent, enemies
      across), and the derivation is purely geometric. That makes it eligible
      as computed from official diagram structure.
    - Label it as derived from the wheel's layout, for example beside
      "Geometry solved at build time", so it never reads as a Wizards
      grouping.
    - The markers, their labels and the intersection paragraph stay.
  - **Interpretation (C21b): remove.** This means "the five identities hiding
    where the conflicts cross" (hero lede) and "the pentagram contains the
    whole tier and never labels it" (crossing panel). No Wizards source
    defines four-color identities through the crossings.
  - **Unchanged, because it is not interpretation.** The four-color panel's
    "absent voice" (C19) names the excluded color's own goal and method. That
    is official strings plus the computed exclusion, and it says nothing about
    what the four-color identity means.
- **V7.** Miscitation: the pair "What it costs" and conflict "How they work
  together" lines come from the 2005–06 guild series. Keep each line only
  with the guild article that supports it, cited by title and date. A line
  that article does not support is removed (see U7).
- **V8.** "Tier" is used as Vox grouping vocabulary ("Tier 1–6", "Six
  tiers"). Rename the atlas grouping by number of colors, so that "tier" means
  only the Mechanical Color Pie's Primary / Secondary / Tertiary.
- **V9.** Remove "Vox Mana · Codex" (the hero kicker) from the content
  authority frame. Hosting attribution may remain in the footer, outside the
  subject matter. No replacement copy.

**Mechanical Color Pie**

- **V10.** The tier key.
  - **Definitions.** Restore Rosewater's wording: Primary is "usually" at the
    lowest rarity, and "tends to be the color that most often pushes the power
    level".
  - **The anti-ranking note.** Replace the inaccurate absolute wording ("not
    how well") with source-faithful language. It must keep the safeguard:
    these are categories, compared only within one ability, and the page never
    turns them into a numeric score or a ranking of colors.

  Draft wording for the Gate A sheet, not final: "Rosewater's three
  categories describe how often, and at what rarity, a color gets an ability;
  the primary color is also the one that most often pushes its power level.
  They are categories, compared only within one ability: this page never adds
  them up, scores them, or ranks colors by them." The basis is the article's
  own definitions and its flying / extra-turns example.
- **V11.** The five source conflicts (§5.3). **Decided 2026-10-02.**
  - **V11a, resolved by the 2021 change log.** Flash / Black is Secondary and
    +N/+N (on spells) / White is Primary, in both readings.
    - Show the change log as the authority at the placement.
    - Disclose the list's contradicting claim.
  - **V11b, unresolved published conflicts:**
    - Exiling cards from graveyard / White;
    - Deal N damage to a creature with flying / Red;
    - +N/+0 to your team (ongoing) / Black.

    These use two coherent source readings, color lists and ability catalog,
    computed through one shared projection. The contract is in §18.8 and
    §18.9.
  - **For all five:**
    - Remove the Vox inference prose (`ruling.mechanism`) from the player
      view.
    - No Vox-selected conflict result reaches the player.
- **V12.** Stop rendering the interpretive `relWhy` prose on every
  player-facing surface: the result tooltip, the parse line, the detail, and
  any accessible name. A related result may carry only the fixed,
  non-interpretive navigation tag "related · not what the term names". No
  mechanical explanation reaches the player through navigation.
  - The internal `PLAYER_TERMS[].relWhy` data need not be deleted. It may
    stay if existing search, navigation or self-test structure uses it.
  - Keeping it internally does not make it an approved source claim (§4).
- **V13.** Remove every reader-facing internal or source-maintenance
  instruction:
  - **The `#limits` line.** It says "Never present this as the current state
    of the colour pie." Render a page-written paraphrase of Rosewater's
    snapshot caveat instead of `meta.caution`.
  - **The boot-failure text.** It shows `py -m http.server` instructions.
    Replace it with a plain public error.
  - **The footer self-test line.** Hide it from readers; it still runs for QA.
  - **The uncaptured-explanation note.** Remove "The issue is recorded for
    source review"; the factual disclosure stays.

  All of this is presentation only.
- **V14.** Rewrite "No combination name is used for four or five colors." as
  a claim about this page, not about Magic generally.
- **V15.** Remove "Vox Mana · An interactive edition" (the masthead kicker)
  from the content authority frame. Hosting attribution may remain in the
  footer, outside the subject matter.

**Preview code**

- **V16.** The `#mechanics=` route in `color-wheel.html` exposes the Vox
  taxonomy as Rosewater's and contradicts the Primary definition. **Owner
  decision, 2026-10-02: a route guard in Gate A.**
  - `applyRoute`'s `mechanics` branch stops activating the preview in
    production. One gate in that branch does it. Every hash the router reads
    as the Mechanics route lands in Explore at rest, and its URL is replaced
    in place, with no new history entry and no Mechanics hash left visible.
    The full contract and the route inventory are in §18.10.
  - That branch is the only way in: `enableMechanicsPreview()` and
    `setMode('mechanics')` are reached from it alone.
  - The preview code stays byte-identical, and so does the inline `MCP`.
  - `#lay-mech` stays disabled, and with the guard it can no longer be
    enabled. Gate C hides it.
  - The invariant change is documented in `CLAUDE.md` and
    `MECHANICS-CONTRACT.md`.
  - Retiring the code is a later, explicit story.


## 7. Unsupported or unverified findings

- **U1.** The Lorehold pole glosses are not in the Planeswalker's Guide.
  Replace them with its wording: red, "reckless discovery and the spirit of
  adventure"; white, "uncover and record the past".
- **U2.** Colorless: "the mage who specialises in them is avoiding committing
  to anything" is not found in "Just the Artifacts, Ma'am" as fetched. Find the
  sentence or cut it.
- **U3.** "Four colours have no philosophy article of their own" is a
  negative claim. Reword it so it describes only this page.
- **U4.** The wedge scope claim "each Tarkir clan is centred on one of the two
  allied colours" was not re-verified in this pass. Check it against the Khans
  Planeswalker's Guide in the corpus.
- **U5.** Black's method should use the source's "flexibility and selfishness"
  in place of "self-interest without apology".
- **U6.** The Strixhaven "Design note": confirm that its vision-design handoff
  is published by Wizards, and cite it by title and date.
- **U7.** Sampled, not exhaustive. Gate A must verify every string in:
  - the 10 pair "cost" and 5 conflict "together" lines, against the guild
    series;
  - the 10 "Pie Fights" view sentences;
  - the Jund paraphrase;
  - the 5 C16 lens sentences.
- **U8 (recorded, not a product defect).** The explanation for "Creature
  sacrifice, forced, repeatable" exists in the article but not in the frozen
  data. The page already discloses this. It is a source-layer reopen
  candidate (reason 3), already in Follow-ups.

---

## 8. Architecture constraints discovered in recon

- **Collisions in a single document:**
  - 6 CSS classes: `.stage .foot .fcp .is-rel .is-out .sr-only`.
  - 4 globals: `MCP`, `ORDER`, `esc`, and `toggleColor`. The last two have
    different meanings on each page.
- **Escape handlers.** Both pages listen for Escape at the document level.
  The wheel's clears its selection unconditionally.
- **The wheel's router** claims every hash key: unknown keys reset it to
  Explore. At `7fa0e83`, `#mechanics` (with or without a value) turns on the
  preview mode; Gate A's guard ends that (§18.10). It runs from
  `file://` with its data inline.
- **The explorer** fetches `../data/…`, so it needs HTTP. It has no URL
  state; its sticky bar is measured by a ResizeObserver, and its detail panel
  is a fixed bottom sheet.
- **Links that would navigate inside a frame:** three outbound links have no
  `target`: the wheel's Fan Content Policy link, and the explorer's snapshot
  link and Fan Content Policy link.
- **Storage.** The explorer uses `localStorage` keys `vmx.*` only; the wheel
  uses none.

## 9. Recommended V1 integration mechanism

**A shell document with two persistent, lazily loaded same-origin iframes.**

**Files.** Root `index.html` is the canonical shell. It is static, with inline CSS and
JS and field-guide tokens copied by value, and adds no new dependency. The
instruments stay where they are and are framed by relative URL, so the
explorer's `../data/` path is unchanged.

**Layout.**
- A compact shell header holds the title, a descriptor slot (copy to be
  decided) and the nav: **Color Wheel | Mechanical Color Pie**.
- Below it, two `<iframe>`s fill `calc(100dvh - header)`, with a `100vh`
  fallback. One is visible; the other has `hidden`.
- Each instrument scrolls inside its own frame. The explorer's sticky bar and
  bottom sheet behave exactly as they do standalone.

**Loading.** The active view loads first. The other frame gets its `src` on
first activation, unless the URL deep-links to it.

**Routing.** The shell URL is canonical, and each route is the canonical
link for its view.

| URL | Shows |
|---|---|
| `index.html` | Color Wheel at rest |
| `index.html#color-wheel/<wheel route>` (e.g. `#color-wheel/combine=WUR`) | Color Wheel at that route |
| `index.html#mechanical-color-pie` | Mechanical Color Pie |

- **Load.** The shell sets the wheel frame's `src` to
  `color-wheel.html#<route>`.
- **Wheel → shell.** On the frame's `hashchange` (a same-origin listener),
  including history traversal, the shell `replaceState`s its own URL. It
  treats the wheel route as an opaque string and never interprets it.
- **View switch.** The shell pushes one history entry, shows the frame, moves
  focus into it, updates `document.title`, and announces the view in a polite
  live region.
- **Back / Forward.** These step through wheel selections and view switches in
  the order they happened, because frame hash changes join session history.
  The shell re-syncs the view and URL on every traversal.
- **Never** `#mechanics`, anywhere in the shell grammar.

**Isolation.** These are separate documents, so CSS, globals, keyboard and
Escape handlers, and routers are isolated by construction. The shell reads
nothing from either instrument except the wheel's hash string.

**Accessibility.**
- The shell has one `<h1>` (the title) and `<nav aria-label="Instruments">`
  with two links carrying `aria-current`.
- The frames are titled "Color Wheel" and "Mechanical Color Pie 2021".
- The hidden frame is removed from the accessibility tree and the tab order.
- Each instrument keeps its own h1, landmarks and skip link inside its frame.

**Instrument edits the mechanism needs:** none. The edits that Gates C and D
make are listed in §14.

**Why this one.** It is the only option that meets all of these together:
- one canonical entry point;
- state kept per instrument across view switches, with no coupling;
- zero refactoring of the instruments;
- isolation by construction;
- the wheel's deep links preserved;
- future bridges that are ordinary shell URLs (§15);
- static hosting.

**Costs, stated now:**
- The integrated product needs HTTP. On `file://`, Chromium blocks
  cross-frame access, so URL mirroring is off there. The standalone wheel
  still opens from disk.
- iOS Safari's scrolling and virtual keyboard inside frames need a human
  check.
- Two documents load fonts separately; the cache absorbs this after the first
  load.
- The instruments' direct URLs stay reachable and indexable but are not
  canonical.
- Focus must be managed on every switch.

## 10. Fallback integration mechanism

**Separately navigated instrument documents under one identical shared
header.** Under this fallback:
- The header (title + nav) is copied by value into both instruments.
- `vox-color/index.html` forwards to the root shell, keeping query and hash.
- Cross-document View Transitions may soften page loads.

**What it costs:**
- The explorer's search, lens and open entry are lost on every switch
  (bfcache may restore them on Back only).
- Following the nav link back to the wheel loses its selection.
- Both instruments need edits.
- The canonical address visitors see is `color-wheel.html`.

**What it gains:** the simplest accessibility and history model, and no
iframe risk on iOS.

**Fall back if Gate B fails any of these:**
- the iOS Safari scrolling and keyboard human check;
- the scripted Back/Forward and URL-mirroring checks;
- the screen-reader focus check at 360, 768 or 1440.

**Rejected:**
- A single iframe whose `src` swaps: it loses state, with no gain over the
  fallback.
- Shadow DOM, custom elements or fetched HTML in one document: globals,
  document-level handlers and `location.hash` still collide without
  refactoring.
- `<object>` / `<embed>`: worse accessibility than an iframe.

## 11. V1 state ownership contract

| Owner | State | Where it lives | On a view switch | On reload |
|---|---|---|---|---|
| Color Wheel | mode, layers, Explore target, Combine set | Its own hash, mirrored verbatim into the shell URL | Kept (the frame persists) | Restored from the shell URL |
| Mechanical Color Pie | lens, query, order, open entry, spot | Memory only; `vmx.*` fold state | Kept (the frame persists) | At rest, as standalone today; no V1 deep link |
| Shell | the active view | Its own hash | — | Restored |

- No instrument reads, writes or infers the other's state.
- Switching views never selects colors anywhere, and no shared storage
  carries colors.
- Each instrument's own controls stay visible after a switch, so the
  separation is visible.

## 12. Top-level information hierarchy

```
index.html: The Color Pie
  Header: [The Color Pie]  [descriptor, TBD]   nav: Color Wheel | Mechanical Color Pie
  Frame 1 (default): Color Wheel, as accepted after Gate A
      H1 The Color Wheel → Explore | Combine → layers → wheel + panel
      → The Thirty-Two Identities → footer (Fan Content notice)
  Frame 2 (lazy): Mechanical Color Pie, as accepted after Gate A
      H1 Mechanical Color Pie 2021 → bar (Search · Colors · Order) → key
      → Compare (computed) → entries → #detail → footer
```

Color Wheel is first and is the default view. Hosting identity appears only
in the instruments' footers or shell chrome, never in the title area.

## 13. What remains internally separate

- Each instrument's HTML document, CSS, script, router, keyboard handlers and
  state.
- **Data:**
  - Wheel: `D`, `IDENTITIES` and `COLLEGES`, plus the inline `MCP` its
    preview uses.
  - Explorer: the fetched runtime and abilities, `PLAYER_TERMS` and
    `COMBO_WORDS`.
- The two name regimes, the two citation regimes (paraphrase with a sources
  drawer, versus verbatim with computed badges), and search (explorer only).
- `#detail` as the sole owner of mechanic detail.
- The preview Mechanics mode, which is never framed, linked or routed by the
  shell.
- The periodic table, which is outside the product and its dependency graph.

## 14. Required pre-integration cleanup

**Gate A (source purity, both instruments, standalone):**
- V1–V16 and U1–U7, with evidence for every string;
- V11 under the two-reading contract and the shared projection
  (§18.8–§18.9).

**Gate C (wheel integration):**
- Hide the disabled "Mechanics — not wired" control in production. Do not
  refactor or delete the preview code.
- Make the Fan Content Policy link open outside the frame.

**Gate D (explorer integration):** make the snapshot and Fan Content Policy
links open outside the frame.

## 15. Later explicit cross-links (Gate E, not designed now)

**The URL contract they will need:**
- **Shell grammar:** `#color-wheel/<wheel route>` and
  `#mechanical-color-pie/<explorer route>`.
- **Wheel routes:** existing, unchanged.
- **Explorer routes:** new, explorer-owned and read-only on arrival, such as
  `colors=<canonical WUBRG>`. The explorer has no URL contract today.
- **Payload:** canonical WUBRG keys only, never names.
- **Colorless:** no bridge, because the explorer charts no colorless tier.
- **Never** `#mechanics`.

**How bridges behave:**
- A bridge is a user-initiated link to a shell URL, for example "View these
  colors in Mechanical Color Pie →" or "Open this combination on the Color
  Wheel →".
- The destination owns the state once you arrive. Nothing syncs back.

## 16. Risks and traps

1. **Joint session history.** Mirroring must run on every wheel `hashchange`,
   including traversals, or the shell URL drifts. Gate B tests this by script.
2. **Links inside frames.** A link with no `target` navigates the frame to
   Wizards. That site may refuse to be framed, and either way it strands the
   visitor inside the frame.
3. **iOS Safari.** Frame scrolling, `100dvh` and the virtual keyboard over
   the explorer's search need a human check on a real device.
4. **`file://`.** The integrated product needs HTTP, which the explorer
   already required. Headless checks cannot prove `file://` reload or
   Back/Forward for the standalone wheel, so those stay a human check.
5. **The preview route.** The Gate A guard closes it. The preview code and
   its inline `MCP` copy stay in the file until the retirement story, so a
   later edit could reopen the route. QA runs the full V16 probe set
   (§18.13): every route form lands in Explore at rest, with the URL replaced
   in place, no new history entry, and no reactivation or loop.
6. **Direct instrument URLs.** They stay reachable without the shell.
   Canonical links would need instrument edits later.
7. **Verbatim reproduction.** The explorer reproduces Rosewater's entries and
   explanations at scale; the wheel paraphrases. Both fit the source contract,
   but they are two different quotation regimes. Recorded, not a defect.
8. **"Tier" vocabulary.** It must mean only the mechanics category (V8).
9. **Copy creep.** Gate A removes and relabels. Every replacement sentence is
   batched for Owner approval before editing, and no marketing copy is
   written.
10. **Known bug.** The Combine bounce still exists inside the frame. It is out
    of scope.
11. **QA independence.** The source evidence is re-derived by a separate
    `robqa` session, not by the session that made the change.
12. **The new display versus the frozen records.** After Gate A, the
    explorer's displayed results for the three unresolved conflicts will
    differ from the frozen goldens and recon files, which encode the catalog
    rule. That is intended.
    - The goldens prove the frozen model only.
    - The new display is proved by Gate A's independent verification
      (§18.13).
    - `MECHANICS-CONTRACT.md` must say so, so nobody "fixes" the divergence.
    - The explorer self-test keeps the two roles apart (§18.13): frozen-model
      parity stays unchanged, and only display assertions made obsolete by an
      approved change are updated.

## 17. Proposed implementation sequence

| Gate | Story | Changes | Gate passes when |
|---|---|---|---|
| **A** | Source-purity cleanup | Both instruments: copy, citations, the two-reading projection (V11), the route guard (V16), reader-facing internal text. Docs for the invariant change | §18 acceptance met; independent robqa; Owner acceptance |
| **B** | Integration shell | Root `index.html` only | Routing, Back/Forward, focus and isolation scripted; 360 / 768 / 1440; iOS human check (else fall back, §10) |
| **C** | Color Wheel in the shell | `color-wheel.html`: hide the dead control; the outbound link | Every wheel route and Combine behaves as standalone, inside the frame and through shell URLs |
| **D** | Mechanical Color Pie in the shell | `mechanical-explorer.html`: outbound links only | Self-test passes in the frame; search, lens, compass and detail scripted; sticky bar and sheet at 3 widths |
| **E** | Explicit cross-links | Explorer route, then bridges | Later; separate Owner scope |

**Side stories, not gates:**
- Retiring the obsolete preview Mechanics mode. After Gate A its code stays in
  the file, unreachable.
- Relocating the periodic table.
- The source-layer reopen candidates.

**No Owner decision remains before Gate A.** Decided on 2026-10-02:
- **V11b:** two coherent source readings, through one shared projection,
  with independent verification (§18.8, §18.9, §18.13);
- **V16:** the route guard in Gate A;
- **V6:** the split between geometry and interpretation.

A new Owner decision arises only in two cases:
- Gate A's Step 0 finds the structural blocker in §18.4;
- official evidence creates a genuinely new ambiguity, which is batched into
  the wording sheet.

Everything else in this document is decided under the Owner's rules. The
Owner may still overrule any of it at review.

## 18. Gate A story (final)

**"The Color Pie — Gate A: source-purity cleanup of both instruments."** It
runs in a fresh session. It opens no architecture or source-policy question.

### 18.1 Story goal

Bring both instruments, as standalone pages, into line with §3:
`vox-color/color-wheel.html` and `vox-color/mechanical-explorer.html`.

- **Source classes.** Every substantive player-facing statement is Official,
  Computed or Navigation.
- **Conflicts.** No Vox-selected result for a source conflict reaches the
  player.
- **Preview route.** The old preview Mechanics route can no longer be
  activated.
- **Scope.** No redesign and no integration.

### 18.2 Allowed files

- `vox-color/color-wheel.html`.
- `vox-color/mechanical-explorer.html`.
- `HANDOFF.md`.
- `CLAUDE.md`: only the invariant "Mechanics mode stays preview-only —
  reachable by route…", which the route guard makes factually wrong.
- `MECHANICS-CONTRACT.md`: notes only, with no source-layer edit:
  - that the preview route is guarded (the §7, step 7 wording);
  - that player-facing output uses the two-reading projection. The standing
    "catalog wins" rule still governs the frozen tier field, not what players
    see.
- `CONTEXT.md` and `AGENTS.md`: scoped updates, and only if the approved
  behavior makes them factually stale (§18.4, step 7).

**Timing.** Every rule and document change is finished before the material
candidate is frozen at `ready-for-qa`. That covers `CLAUDE.md`,
`MECHANICS-CONTRACT.md`, `CONTEXT.md` and `AGENTS.md`.
- `robqa` verifies these changes as part of the exact candidate.
- A file that needs no change is left untouched.
- No story file changes after Owner acceptance.

The QA harness and its evidence live in the session scratchpad, not the
repository.

### 18.3 Prohibited files

- All of `data/`: runtime, reconciled, lists, abilities, families, recon and
  fixtures.
- All of `tools/`: the parser, builders, checks and `selection.py`.
- `vox-color/mechanical-periodic-table.html`, `vox-color/build/` and
  `vox-color/reference/`.
- The canon corpus (`../voxmana.io/docs/research/`).
- Any integration shell. `vox-color/index.html` is not created.
- `docs/`, `PRODUCT-DEFINITION.md`, `PHYREXIA-PLAN.md` and `PROMPT.md`.
- Production hosting and navigation outside the two instruments.

### 18.4 Step 0 recon (before any product edit)

1. **Baseline.**
   - Record HEAD, a clean tree, and the sha256 of both pages.
   - Run the four gates and `node --check` on both extracted scripts.
   - Build the capture harness: headless Edge over CDP, the wheel from
     `file://`, the explorer over the static server, at 360 @2x, 768 and
     1440.
2. **The conflict data contract.** Verify it from the records themselves,
   not from code comments.
   - **Where to look:** `data/mechanical-color-pie.runtime.json`,
     cross-checked against `data/mcp2021.reconciled.json`,
     `data/mcp2021.lists.json` and `data/mcp2021.abilities.json`.
   - **Required for each of the five conflicts:**
     - the mechanic key and label;
     - the color;
     - the color-list claim;
     - the ability-catalog claim;
     - whether the 2021 change log resolves it;
     - the recorded authority.
   - **The five recorded conflicts.** Confirm the existing conflict metadata
     holds exactly the five currently recorded conflict records (`basis:
     "adjudicated"`), and verify each against the official source. This is not
     proof that no other contradiction exists in the source material. The full
     audit (step 6) still runs.
   - **Change log.** Verify both resolutions against the OLD and NEW text of
     "Mechanical Color Pie 2021 Changes" itself.
   - **Flash.** The runtime records one list claim (Tertiary), but the
     frozen lists also name Flash in Black's other list. Record what the
     lists actually say. Flash is resolved either way, so this affects only
     the disclosure wording.
   - **Section names.** Confirm the article's official section names for
     use in copy. Expected: "Mechanical Color Pie Lists" and "All Abilities
     with Explanations".
   - **Stop rule.** If the existing metadata cannot reliably reproduce both
     official claims for the three unresolved conflicts, stop and report that
     single structural blocker. Do not infer, hard-code, reconstruct claims
     from the old ruling, or edit data. This is the only stop before the
     wording sheet.
3. **Recheck which outputs change**, with an independent script under the two
   readings in §18.8.
   - List exactly which outputs differ.
   - Confirm these stay the same:
     - whether a mechanic has any placement;
     - the identity count;
     - "newly placed" and "no longer placed";
     - the key specimen;
     - unrelated mechanics.
   - Record the two-reading figures. Revision 3 measured 22 selections and 24
     compass steps by swapping one entry at a time.
4. **Surface inventory.** In both pages, list every player-facing surface
   that renders a tier or a value derived from tiers. Include accessible names
   (`aria-label`, screen-reader text) and tooltips.
5. **U1–U7** (§18.11) and the V7 citations.
6. **The evidence ledger.** Record source, date and quote for every string in
   the official-class systems that revision 2 only sampled. This audit may
   find an additional substantive contradiction in official source material
   that affects player-facing truth. If so:
   - do not fold it into the five, and do not ignore it;
   - batch it into the wording sheet as one genuinely new Owner finding.

   The handling of the five known records stays settled.
7. **Rule and document files.**
   - Confirm whether the `CLAUDE.md` and `MECHANICS-CONTRACT.md` edits are
     needed.
   - List what in `CONTEXT.md` and `AGENTS.md` the approved behavior will make
     factually stale.
   - Recheck during implementation, and finish any needed scoped edit before
     `ready-for-qa`.
8. **Neutral route behavior (for §18.10).**
   - Record how the wheel behaves today on an empty hash, on reload and on
     Back/Forward.
   - Confirm which replacement mechanism works both from `file://` and over
     HTTP: `history.replaceState`, or the repository-equivalent
     same-document replacement.
   - **Inventory the parser.** Record every hash syntax that reaches the
     `mechanics` branch of `applyRoute`, from the code and by probing. At
     `7fa0e83`, `applyHash` applies `decodeURIComponent` to the whole hash,
     and `applyRoute` matches the key exactly and case-sensitively, with or
     without `=`. So bare `#mechanics`, `#mechanics=`, any value, and any
     percent-encoded form that decodes to one of these (for example
     `#%6Dechanics=atlas` or `#mechanics%3Datlas`) reach it. The guard covers
     exactly what this inventory finds. No general URL-normalization layer is
     added.

   This fixes the exact neutral URL before implementation, so it is not
   invented during it.
9. **Self-test inventory (for §18.13).** Classify every assertion in the
   explorer self-test:
   - frozen-model parity (fixtures, recon transitions, frozen runtime and
     data), which stays unchanged;
   - a display check no approved change affects, which stays unchanged;
   - a display check that an approved change makes factually obsolete. List
     each one with the change that obsoletes it.

   Known at `7fa0e83`: `compass: WB − B counts equal the fixture` (line 2069).
   Likely: `tiers: all 216 × 5 rendered placements equal the runtime` (line
   1922), which compares every rendered slot with the frozen tier, including
   the three unresolved placements; and any copy assertion that matches
   wording the sheet changes. Also confirm whether any assertion requires
   `relWhy` to be player-visible.

### 18.5 Replacement-wording and treatment sheet (first deliverable)

Deliver one consolidated sheet for Owner review before any product edit.

**Each row gives:**
- the surface;
- the old wording;
- the proposed wording, or "removed";
- the class: Official, Computed, Navigation, or Neutral UI description. The
  last is not a source class (§4): it carries no factual authority and cites
  no source;
- the supporting source (title, date, and where the quote is).

**The sheet covers:**
- every item in §18.6 and §18.7;
- the U1–U7 outcomes;
- **for V11:**
  - the wording for an individual conflict;
  - the placement-slot treatment: two placements inside one fixed color slot,
    at equal visual weight, with no magnitude;
  - the wording for two different results;
  - the label for a result that depends on the reading;
  - one representative compass conflict state;
  - the authority wording for the two resolved records;
- the V16 behavior statement;
- any genuinely new source ambiguity, batched as one new Owner finding. This
  includes any additional contradiction the full audit finds.

Nothing on the sheet is implemented until the Owner approves it.

### 18.6 Approved Color Wheel cleanup

1. **V1.** Remove all "Community typically reads it as…" content and its
   supporting scope language.
2. **V2.** Remove the Strixhaven college-as-guild alias treatment.
3. **V3.** Remove the unsupported five-color connective and interpretive
   prose. The five-color tile then needs neutral UI description (§4), or the
   "PLACEHOLDER" fallback shows.
4. **V4.** Remove the unsupported colorless connective and interpretive
   prose, and the Vox commentary in the scope and source notes.
5. **Empty states.** Where a removal empties a required UI state, fill it only
   with official content or neutral UI description (§4).
6. **V5.** Keep the New Capenna faction names only where they already appear.
   - Relabel the existing presentation so it reads as a separate official
     faction context, never as alternate shard names.
   - Gate A builds no New Capenna lens, mode, control, navigation surface or
     data structure, and no new interaction.
   - Source cleanup only.
7. **V7.** Correct the citations on the pair "What it costs" and "How they
   work together" lines to the guild articles that support them. Remove any
   line those articles don't support.
8. **V8.** Rename the atlas "Tier 1–6" terminology, so "tier" means only the
   Mechanical Color Pie's Primary / Secondary / Tertiary.
9. **V9.** Remove the "Vox Mana · Codex" kicker.
10. **V6.**
    - Keep the crossing geometry, labelled as derived from the official
      relationship layout.
    - Remove "hiding where the conflicts cross" and "contains the whole tier
      and never labels it".
    - Infer no identity philosophy from the excluded color.
11. **V16.** Add the route guard (§18.10).
12. **The U-items that touch the wheel:**
    - U1, the Lorehold glosses;
    - U2, the colorless sentence;
    - U3, the four-color absence claim;
    - U4, the wedge center claim;
    - U5, Black's method term;
    - U6, the source of the design note.

### 18.7 Approved Mechanical Color Pie cleanup

1. **V10.** Correct the tier explanation to Rosewater's definitions. Keep the
   rule that the page never sums Primary / Secondary / Tertiary or turns them
   into a numeric score.
2. **V11a.** Flash / Black and +N/+N (on spells) / White use the change-log
   resolution. Show its authority, and disclose the contradicting list claim.
3. **V11b.** The three unresolved conflicts follow §18.8, through §18.9.
4. **Ruling prose.** Remove the interpretive `ruling.mechanism` text from the
   player view.
5. **V12.** Stop rendering the interpretive `relWhy` prose on any
   player-facing surface, including accessible names and tooltips. Keep
   source-neutral player search terms, clearly labelled. The internal
   `relWhy` data may stay, unrendered (§6, V12).
6. **V13.** Remove the reader-facing internal and source-maintenance text:
   - the instruction in the `#limits` line;
   - the developer instructions in the boot-failure text;
   - the visible self-test line;
   - "recorded for source review".
7. **V14.** Rewrite the four- and five-color name statement as a statement
   about what this page names.
8. **V15.** Remove the "Vox Mana · An interactive edition" kicker.

### 18.8 V11 two-reading computational contract

**There are exactly two readings.**

| Unresolved placement | Color-list reading | Ability-catalog reading |
|---|---|---|
| Exiling cards from graveyard / White | Primary | Secondary |
| Deal N damage to a creature with flying / Red | Secondary | Tertiary |
| +N/+0 to your team (ongoing) / Black | Secondary | Tertiary |

**Every other placement is identical in both readings:**
- placements both sections agree on;
- placements stated in only one section (list-only and catalog-only), which
  are not conflicts;
- the two resolved records: Flash / Black Secondary, and +N/+N (on spells) /
  White Primary.

**Each mechanic is one record** with one W/U/B/R/G footprint. It is never
duplicated and never counted twice.

**Prohibited:**
- choosing per mechanic;
- permutations;
- averaging, or a midpoint;
- numeric uncertainty;
- the old adjudicated tier as a silent default.

**How every tier-dependent output is shown.** Compute it under both
readings. Labels follow the source class (§4), not the comparison:
- **Official placements** stay Official, presented as official placements,
  even where both readings agree. Agreement never relabels a placement
  `computed`.
- **Navigation metadata** stays Navigation.
- **Derived values** (counts, deltas, best placement, comparisons) stay
  labelled `computed`.
- **Same derived result:** show the ordinary single computed result.
- **Different derived results:**
  - Show both, each labelled with its reading.
  - Mark the value as a computation that depends on conflicting published
    2021 claims.
  - Never show it as a single plain `computed` value.
  - Never call it a Vox interpretation.
- **Compass:** an entry whose category differs stays one entry, marked as
  depending on the conflict.
- **Outputs that never change** (confirmed in Step 0) carry no conflict
  messaging.
- **An individual record** shows both claims for the conflicted color, with
  neither superseding the other: "White — Primary in [list section] ·
  Secondary in [catalog section]".

### 18.9 Conflict-aware projection boundary

**One logical projection layer inside the existing `mechanical-explorer.html`
script.**
- No new production JS file.
- No ES-module architecture.
- No build step and no framework.
- No change to the static-page deployment model, unless an unavoidable
  technical blocker is found and reported.
- **Input:** the frozen record, the official conflict metadata, and the
  reading.
- **Output:** player-facing placements, and every tier-dependent computation:
  best placement, buckets, deltas, step categories, and the accessible text
  for each.

**Every consumer goes through it:**
- the placement notation on search results;
- the placement notation and best-tier marks in the article and A–Z lists;
- the placement rows in the entry detail;
- the selected-color best-placement lines;
- the selected-color tier counts, and the lists they open;
- the compass identity panel and the add/remove steps;
- `aria-label`s, screen-reader text and tooltips that state tiers;
- any other tier-derived count found in Step 0.

**The rules:**
- Renderers contain no conflict math.
- The ported functions (`access`, `sections`, `buckets`, `deltaAdd`,
  `deltaRemove`) stay byte-identical, for fixture parity and provenance. They
  must not feed player-facing results where a conflict can change the answer.
- The projection may apply the same algorithm to each reading's placements.
  It must not re-implement the algorithm per renderer.
- A code comment states this boundary.

### 18.10 V16 route-guard behavior

This applies to every hash the existing router reads as the legacy
Mechanics route, as inventoried in Step 0 (§18.4, step 8): bare `#mechanics`,
`#mechanics=`, `board`, `atlas`, `layered`, `preview`, any other value, and
every percent-encoded form the parser decodes to one of these. No general
URL-normalization layer is added.

- **No preview.** The preview Mechanics world never activates:
  - `#world` hidden;
  - no `body.proto-on`;
  - `#lay-mech` disabled and unchanged;
  - no family wording rendered.
- **Neutral landing.** The page lands in the normal Explore-at-rest state.
- **Canonical URL.** The URL is replaced in place, using
  `history.replaceState` or the repository-equivalent mechanism Step 0
  confirms (§18.4, step 8):
  - the pathname and query string are preserved;
  - only the invalid Mechanics hash is replaced;
  - no new history entry is created;
  - no dead Mechanics hash, in any form, is left visible.
- **No reactivation.** Direct load, hard reload, Back and Forward never
  reactivate the preview.
- **No loop.** Repeated Back/Forward never bounces between the invalid route
  and neutral Explore.
- **Neighbors unaffected.** Valid Color Wheel deep links before and after the
  invalid history entry behave as they do today.
- **Implementation:**
  - one gate in the `mechanics` branch of `applyRoute`, around entry into the
    preview;
  - the preview CSS, JS and inline `MCP` otherwise stay byte-identical and
    physically present until the later retirement story;
  - Gate C hides `#lay-mech`.
- **Docs.** The `CLAUDE.md` invariant line and the `MECHANICS-CONTRACT.md` §7
  note, both finished before `ready-for-qa`.

### 18.11 U1–U7 verification procedure

- **Verify** each item against official evidence, in hierarchy order: the
  corpus, then Wizards web pages, then official card text.
- **Act on the result:**
  - **Supported:** keep or correct it, with the actual source.
  - **Only the citation is wrong:** correct the citation.
  - **Unsupported:** remove it, or replace it with neutral UI description
    (§4).
- **Never** replace a missing claim with Vox interpretation.
- **Record** source, date and quote in HANDOFF.
- **Batch** only genuinely new ambiguities into the wording sheet. There are
  no per-item Owner loops.

### 18.12 Behavior-preservation contract

Everything is preserved except the approved changes.

**Color Wheel:**
- geometry and the crossing coordinates;
- Explore and Combine;
- keyboard, focus and reduced motion;
- every valid deep link;
- the field-guide visuals, including the receded vertex-label de-emphasis
  (§18.13).

**Mechanical Color Pie:**
- the article and A–Z views;
- search and color-lens interaction;
- detail ownership;
- the compass structure;
- keyboard interaction;
- the responsive detail panel;
- source-card behavior;
- the field-guide visuals.

**Expected changes, not regressions:**
- the approved copy;
- the route guard;
- the V11 outputs that now differ from the old adjudicated results, exactly
  as Step 0 lists them;
- the narrow explorer self-test assertion updates that §18.13 permits, each
  listed in HANDOFF.

### 18.13 Test plan

**Before and after:**
- the four gates;
- `node --check` on both extracted scripts;
- `git diff --check`;
- the envelope check.

**Behavior comparison, old against new, scripted:**
- Wheel: hash routes, Explore, Combine, edge states, keyboard and focus,
  reduced motion.
- Explorer: search, lens, compass, detail, A–Z, and the bottom sheet.

**Explorer self-test.** The in-page self-test keeps two separate
responsibilities. Gate A updates an existing assertion where, and only
where, an approved source-purity change makes it factually obsolete. It does
not otherwise rewrite the self-test.

- **A. Frozen-model regression checks: unchanged.**
  - The 11 golden fixtures, called through the untouched ported functions,
    and the 75 recon transitions stay as they are and must pass.
  - So does every other check on the frozen runtime and data.
  - No fixture or data file changes because the player-facing projection
    handles a conflict differently.
  - These prove the frozen model has not drifted. They do not prove the new
    display.
- **B. Source-aware player-facing checks: updated narrowly.** An assertion
  that reads player-facing DOM or output that V11, or approved copy, changes
  on purpose is re-expressed against the approved presentation contract. It
  no longer demands the old single adjudicated answer.
  - **`compass: WB − B counts equal the fixture`** (line 2069 at
    `7fa0e83`). Its model-level parity already exists as `fixture 02: WB − B`
    (line 2039, through `deltaRemove`), and that stays unchanged. The DOM
    assertion no longer compares the displayed counts with fixture 02. It
    checks that:
    - one mechanic stays one entry, never duplicated;
    - a step whose result differs between the readings is marked as
      reading-dependent;
    - both source readings are represented;
    - the display does not collapse to the old Vox-selected answer.
  - **Other candidates** come from the Step 0 inventory (§18.4, step 9). Each
    gets the same narrow treatment.
  - These are smoke and contract checks of rendering. They are not the
    numerical oracle for the two readings; that is the independent
    verification below.
- **`relWhy`.** `terms: every group with related entries says why they are
  related` (line 1985) checks the internal data only, so it stays. An
  assertion that Step 0 shows requires `relWhy` to be player-visible is
  narrowed to the non-rendering contract (V12).
- **Record.** Each changed assertion is listed in HANDOFF: its old name and
  check, the new check, and the approved change that made it obsolete.

**New independent verification**, in the scratchpad harness:
- **Method.** The oracle derives every expected result on its own path:
  - it reads the existing source and conflict data files itself;
  - it builds the two coherent source readings itself;
  - it calculates the expected selections, counts, deltas and categories
    itself.
- **Independence.** The oracle:
  - does not import or execute production page JavaScript;
  - does not call production selection or projection functions (for example
    `access`, `deltaAdd`, `deltaRemove`, `buckets` or `window.VMX`) to
    obtain an expected result;
  - does not copy or paste the production projection into itself.
- **Comparison.** It may open the page in the browser as the system under
  test and read the rendered output: DOM text and accessible names. The
  comparison is the independently derived expected reading against the
  actual player-facing output, never the projection against itself.
- **Fixtures.** The frozen fixtures may still be used independently, for
  their original regression purpose.
- **Coverage:**
  - all 31 selections under both readings;
  - all 150 displayed compass steps under both readings;
  - the 3 unresolved and 2 resolved records;
  - every surface from the Step 0 inventory;
  - the selections and steps that Step 0 identifies (22 and 24 in revision
    3).

**V16:**
- every route form from the Step 0 inventory, on direct load and on reload.
  The minimum probes are `#mechanics`, `#mechanics=`, `#mechanics=board`,
  `#mechanics=atlas`, `#mechanics=layered`, `#mechanics=preview`, an unknown
  value, and the percent-encoded forms the parser decodes to the Mechanics
  route;
- the canonical URL: pathname and query kept, hash replaced, and
  `history.length` unchanged by the replacement;
- the sequence `#color=W` → `#mechanics=atlas` → `#ally=WU`, stepped Back and
  Forward repeatedly, with no reactivation and no loop.

**Layout and access:**
- 360 @2x, 768 and 1440;
- every ordinary readable text state at 4.5:1 or better;
- **the one documented Owner exception:** the Color Wheel's receded vertex
  labels, accepted on 2026-10-01 as intentional de-emphasis at about 2.73:1
  (name) and 1.67:1 (goal):
  - Gate A verifies they are no worse than that baseline;
  - they may improve only incidentally, if source cleanup does so without
    changing the intended de-emphasis;
  - QA does not reopen or brighten them;
  - Gate A creates no new contrast exception;
- visible focus;
- fonts and mana-font blocked;
- no overflow.

**Human check.** `file://` hard reload and Back/Forward on the wheel's deep
links, including `#mechanics=board`.

### 18.14 Independent robqa

- `robqa` runs in a separate session from `robdev`, on the exact frozen
  candidate, including its rule and document edits.
- It re-derives the source evidence and the V11 expected results
  independently, under the §18.13 oracle rules.
- It confirms the envelope and records its evidence in HANDOFF.
- A blocker or a major finding fails QA.

### 18.15 Owner-review stop points

1. **Step 0 structural blocker,** only if the data cannot reproduce both
   claims. Stop and report.
2. **The wording and treatment sheet.** Owner approval is required before any
   implementation.
3. **Acceptance,** after `robqa` passes. The Owner checks in their own
   browser. No story file changes after acceptance.

Any widening of the envelope is recorded under Decisions needed and waits for
the Owner.

### 18.16 Completion and acceptance transition

```
complete -> idle -> dev-in-progress   Step 0 and the wording/treatment sheet
         -> awaiting-decision          Owner approves the sheet
         -> dev-in-progress            implementation, plus any required
                                       scoped rule and document updates
         -> ready-for-qa               exact material candidate frozen; no
                                       further candidate-affecting edits
         -> qa-passed                  independent robqa verifies that exact
                                       candidate
         -> complete                   Owner acceptance; no post-acceptance
                                       mutation
```

If `robqa` fails the candidate, the path is `ready-for-qa -> qa-failed ->
dev-in-progress`. Only the recorded defect is fixed, and a new candidate is
frozen. Gate B is a separate story.

---

### Sources consulted in this revision

- **Canon corpus (`../voxmana.io/docs/research/canon/`):** "Pie Fights"
  (2016-11-14); "Thank You for Being a Friend" (2017); the guild series
  (2005–06); the shard (2008) and wedge (2014–15) interviews; *Mechanical
  Color Pie 2017* (`misc/mechanical-color-pie-2017.md`).
- **Wizards web pages:**
  - Color philosophy: [The Great White Way Revisited](https://magic.wizards.com/en/news/making-magic/great-white-way-revisited-2015-07-13) ·
    [True Blue Revisited](https://magic.wizards.com/en/news/making-magic/true-blue-revisited-2015-07-20) ·
    [In the Black Revisited](https://magic.wizards.com/en/articles/archive/making-magic/black-revisited-2015-07-27) ·
    [Seeing Red Revisited](https://magic.wizards.com/en/news/making-magic/seeing-red-revisited-2015-08-03) ·
    [It's Not Easy Being Green Revisited](https://magic.wizards.com/en/news/making-magic/its-not-easy-being-green-revisited-2015-08-10)
  - Mechanics and factions: [Mechanical Color Pie 2021](https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021) ·
    [Mechanical Color Pie 2021 Changes](https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021-changes) ·
    [Faction Packed](https://magic.wizards.com/en/news/making-magic/faction-packed-2018-10-15)
  - Five-color and colorless: [Party of Five](https://magic.wizards.com/en/news/feature/party-five-2009-02-02) ·
    [Mana with All the Fixin's](https://magic.wizards.com/en/news/making-magic/mana-all-fixins-2009-03-23) ·
    [Just the Artifacts, Ma'am](https://magic.wizards.com/en/news/making-magic/just-artifacts-maam-2005-02-28) ·
    [Third Time's the Charm, Part 2](https://magic.wizards.com/en/news/making-magic/third-times-the-charm-part-2) ·
    [The Council of Colors, Revisited](https://magic.wizards.com/en/news/making-magic/the-council-of-colors-revisited)
  - Strixhaven and New Capenna: [Planeswalker's Guide to Strixhaven](https://magic.wizards.com/en/news/feature/planeswalkers-guide-strixhaven-2021-04-01) ·
    [Streets of New Capenna](https://magic.wizards.com/en/products/streets-of-new-capenna)
  - Notation: [Nuts & Bolts #1: Card Codes](https://magic.wizards.com/en/news/making-magic/nuts-bolts-card-codes-2009-01-12)
- **Not used as authority:** mtg.wiki (it refused automated fetches); the
  community format pages cited in revision 1.
