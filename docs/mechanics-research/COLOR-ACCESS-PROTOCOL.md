# Supplemental color access — protocol 2.0

Owner decision, October 28, 2026: supplemental A/B/C records document observed color access for discovery. They do not infer Primary, Secondary or Tertiary. Frozen 2021 placements remain separate and unchanged. This supersedes protocol 1.0 tier judgments for the current supplemental presentation; retained v1 research and captures are historical evidence, not current placement authority.

## Evidence rules

- A qualifying monocolor native use or explicit grant establishes documented access in that color. One verified design is sufficient; counts, rarity, breadth and recurrence do not create ranks.
- Use the colors of the mechanic-bearing face, not commander color identity, frame appearance or missing mana cost. A color indicator counts. A multicolor example remains a combination and does not establish separate monocolor access. Show combinations even when one or more colors also have independent examples.
- Colorless examples stay separate. A colorless grant does not establish access in every recipient's color. Generic rules actions (Abandon, Activate, Attach) are not assigned colored access from incidental word matches.
- The primary evidence scope is explicit for every entry. Ordinary-paper entries exclude digital, unreleased, playtest and non-card examples from their access symbols. Special entries retain their own labeled scope. Evidence from other scopes stays available in source records and limitations.
- Include native use, explicit grants and exact card-specific flavor labels; exclude recipients, support-only effects, removal of the ability, name-only matches and related variants. No inferred tiers or tier-confidence labels in current player copy.
- Absence means no example found in the reviewed scope; never claim that a color cannot receive the mechanic. Incomplete evidence is distinct from an adequate search with no example.
- Player prose states named card behavior and source-attributed context. Avoid claims of a core home, intended hierarchy, unrestricted access or comparative tier. Correct known factual errors in current explanations; preserve raw captures.
- Scryfall links are discovery aids. Per-color links should find the exact reviewed examples, rather than imply that a broad text search has been screened. Keep qualifying examples already reviewed in the research buckets and discovery links. Access does not require an exhaustive card inventory or a minimum population beyond one verified example. Individual card links and original context remain available.

## Canonical access_review field

Each of the existing five A/B protocol packets gains an `access_review` object. Existing v1 fields are retained for history and not consumed as current placements.

```json
{
  "version": "2.0",
  "review_date": "2026-10-28",
  "scope_label": "Released paper cards",
  "scope": "Plain description of the exact mechanic.",
  "summary": "What the reviewed examples show.",
  "colors": {
    "W": {"status": "documented", "card_ids": [], "note": "Concrete evidence."},
    "U": {"status": "multicolor_only", "card_ids": [], "note": "Combination evidence only."},
    "B": {"status": "not_found", "card_ids": [], "note": "No example found in the reviewed scope."},
    "R": {"status": "not_found", "card_ids": [], "note": "No example found in the reviewed scope."},
    "G": {"status": "not_found", "card_ids": [], "note": "No example found in the reviewed scope."}
  },
  "combinations": [{"colors": ["W", "U"], "card_ids": [], "note": "Named multicolor examples."}],
  "colorless": {"status": "not_found", "card_ids": [], "note": "No colorless example found in the reviewed scope."},
  "limitations": []
}
```

Allowed color statuses: `documented`, `multicolor_only`, `not_found`, `not_applicable`, `insufficient_evidence`. Colorless allows the same except `multicolor_only`. `documented` and `multicolor_only` require qualifying card references. All references resolve to `card_review[].oracle_id`; a documented color references only its independently qualifying cards. Multicolor-only colors reference relevant combination cards. Generic actions use `not_applicable` and no access cards. All WUBRG keys are required. Combinations use WUBRG order, at least two colors and qualifying references. Notes must be authored, not extracted by deleting tier sentences. An optional `excluded_access_card_ids` list records corrections to inherited scope labels, with the named examples and reasons explained in limitations. Those IDs remain in historical evidence but are excluded from current access.

## Projection and review

The existing assessment producer emits a new access-only schema from these canonical fields. Existing card/source links and separately attributed historical related-effect notes are retained without importing their ranks into access symbols. Current supplemental list/search/detail surfaces use the existing mana colors and a colorless diamond where supported, labeled Color Access without tier notation. Reviewed card lists stay with their color evidence; a separate Sources section contains only non-card references, not a repeated aggregate card list or card search. Rules, examples, search navigation, safety validation and fail-soft behavior remain available.

Review every covered entry for exact scoped support, face colors, combinations, colorless grants, fact-only prose and valid example links. Confirm producer determinism, malformed-data isolation, accessible search/detail behavior and frozen 2021 content/calculations. Independent review follows the committed material candidate.

## C batch, October 28, 2026

The same access contract now covers 35 supplemental C entries, bringing current coverage to 78 A/B/C records. New C packets contain access reviews without inventing historical tier fields. Generic Cast, Counter and Create remain rules references. Conjure and Covercast explicitly declare digital evidence scope; ordinary C mechanics use released paper cards.

An optional `access_review.evidence_scope` array declares allowed card-review scope strings for special material. Ordinary records default to released paper. This is evidence qualification, not a new placement system. The producer requires complete exact single-color, combination and colorless buckets; combination membership is compared in WUBRG order even if raw source arrays use another order.

Ordinary paper evidence excludes standalone token objects, planes, schemes, playtest cards, Heroes of the Realm commemorative cards, and acorn or silver-bordered cards. Ordinary non-acorn Unfinity cards can qualify. A colored card that explicitly creates a token with the named ability establishes access from that source card; the created token's colors are not substituted for its source. Digital source cards are handled in their expressly labeled scope.

Card text and mechanic-bearing face colors govern screening. Keyword indexes are discovery aids: self-name matches, payoff-only cards and related variants need explicit exclusion. Review raw evidence before rejecting an unexpected operation. For example, the captured Expose the Culprit text actually cloaks creatures, while Burning Cloak is name-only. Raw response bodies remain immutable; any normalization of text encoding is confined to derived records.

## Representative examples — Owner clarification, October 28, 2026

Color Access is a presence check, not a judgment of strength or frequency. One qualifying card establishes access, including when the mechanic is found in only one color. More cards do not strengthen or rank that access. Research need not enumerate every printing or every design to establish a positive result; absence remains limited to what was reviewed.

The C preview shows one intentionally selected example per independent color, colorless bucket or multicolor combination. The first card ID in each bucket is the selected example and its note describes that card from saved facts. Existing additional evidence remains in the canonical record and can be browsed through an exact reviewed-card Scryfall link; it is not repeated as a long on-page source list. A multicolor-only color points to its combination through the access status, without repeating the combination's paragraph or sources. Separate Sources remains for non-card references only.

Explain the mechanic once, then give a short card-specific fact where useful. Do not repeat its rules definition in every color, infer a hierarchy, or justify access through volume. Preserve any important restriction or card-specific exception. A/B presentation remains as previously reviewed in this C-only correction.

## D batch, October 28, 2026

The same presence-based approach covers 27 supplemental D entries, for 105 A/B/C/D records. D uses the compact C presentation: one linked example per independent color, colorless bucket or combination. A single qualifying card is enough. The D packet intentionally selects witnesses; full discovery responses are saved locally, and unselected hits are not described as excluded or individually reviewed.

D adds no rankings, counts-as-strength claims, confidence labels or inferred monocolor access. Double, Destroy and Discard remain generic rules references. Descend retains the existing entry’s descend 4 / descend 8 / fathomless descent scope. Devour includes its rules-defined devour artifact variant. Double agenda is labeled Conspiracy; Double team and Draft from a spellbook are labeled Arena. Devoid uses actual colorlessness, and DFCs use the mechanic-bearing face. Frozen 2021 and existing A/B/C records remain unchanged.

## E batch, October 28, 2026

The same compact, presence-based contract now covers 28 supplemental E entries, for 133 A/B/C/D/E records. E shows one linked witness per independent color, colorless bucket or combination. Exchange and Exile remain generic rules references; Enchant and Equip are named abilities with card examples. Existing A–D records and frozen 2021 remain unchanged.

Use the source card’s colors for Embalm, Eternalize, Endure and Empower Jace rather than the created token’s colors. Emerge includes its rules-defined emerge from artifact variant. Keep native costs distinct from costs granted to other cards: Sliver Gravemother’s own encore is {5}. Payoff-only references such as Foul Emissary and Shadowed Caravel do not establish Emerge or Explore access. Search inflected action text as well as the base name (explores, endures), then verify the selected card itself. Full local discovery captures support selection without requiring the page to enumerate every hit.

## F batch, October 28, 2026

The same presence-based contract covers 25 supplemental F entries: 24 access entries and the generic Face a dilemma preview reference. The four mapped F records remain in frozen 2021. Completed A–E evidence and projected records stay unchanged.

One linked card is shown per independent color, colorless bucket or multicolor combination. Fuse uses the combined colors of the fused split spell under rule 702.102b; it does not create separate monocolor access from either half. DFC evidence uses the actual mechanic-bearing face. Explicit grants and token creators use their source colors; standalone tokens, digital and special material do not enter ordinary-paper access. Face a dilemma is a generic choice of modes and remains a preview reference, rather than assigning colors from payoff cards.

F prose, rules and references use an explicit F extension of the escaped mana-symbol renderer, including numeric, colored, X and hybrid costs. E and earlier formatting remains unchanged. Selected witnesses are checked against saved text, scope, face colors and exact links; full discovery captures do not imply that every hit was individually reviewed.

## H batch, October 29, 2026

The same presence-based Color Access contract covers fourteen supplemental H records, bringing coverage to 177 A–H records. Haste and Hexproof remain mapped frozen-2021 entries. Each represented independent color, colorless bucket or observed multicolor combination has one selected linked witness. Existing A–G records and rendering paths remain unchanged.

H direct-action screening is card-text-specific. Heal is rule 701.69's action removing marked damage; explicit regeneration reminder text can support its healing replacement effect, while ordinary end-turn cleanup does not assign access. Full-Oracle discovery is required when the default Oracle search omits relevant reminder text. Harness is rule 701.64's permanent designation, used by the selected Stones; names alone do not qualify. Neither case changes the established generic-action exclusions for Abandon, Activate, Attach, Cast, Counter, Create, Double, Destroy, Discard, Exchange, Exile or Face a dilemma.

Use actual source colors, including characteristic-defining abilities and grant/token-creator attribution. Sphinx of the Guildpact remains five colors; the Stones remain white/black; lands remain colorless. Preserve every observed valid combination separately even when constituent colors have independent examples. Paper printing evidence excludes playtest, digital and special objects. Hidden Agenda is Conspiracy material, Heist is Digital / Alchemy material, and Hero's Reward has a narrow colorless Hydra Head witness with its inherited Hydra-specific archived discussion and general-definition limit preserved.

H uses its own extension of the existing escaped mana-token renderer across assessment, rules and references: numeric, WUBRG, colorless, X, hybrid and encountered tokens, with accessible labels and readable blocked-font fallback. Raw original and fresh retrieval receipts remain distinct, and any historical provenance gap is stated without inventing metadata.

## I batch, October 29, 2026

The same presence-based Color Access contract covers fifteen supplemental I records, for 192 A–I records. Indestructible remains mapped to frozen 2021. I uses one selected linked witness per independently supported color, colorless bucket or observed multicolor combination. Earlier A–H packets, projected rows and bindings remain unchanged.

Increment is a released-paper keyword defined by rule 702.191. Infusion uses its released-paper ability-word scope; Intensity and Incorporate explicitly use digital / Alchemy material. Ingest uses actual Devoid colorlessness. Incubate and Investigate use the source performing the action, rather than their colorless tokens. Grants use their source colors: Archway of Innovation is colorless despite its blue activation cost, and Korozda Guildmage is black-green. Shore Snapper is black despite its blue islandwalk activation cost. Actual mechanic-bearing faces govern split/DFC screening; a combined split-card color array does not assign the other half's colors to a mechanic.

I extends the established escaped mana-token path through assessment, rules and references, retaining numeric, WUBRG, colorless, X, hybrid, tap, accessible labels and blocked-font text fallback. Fresh raw discovery, official articles and rules have actual URL, request-start/retrieval UTC, status and SHA-256 receipts. Each selected full-card object binds to its actual fresh capture, distinct from inherited reference metadata. Unselected discovery hits are not claimed individually reviewed; negative results stay bounded to the reviewed scope.
# J supplemental packet (2026-10-29)

`j-protocol.json` adds Job Select, Join forces, Jump, and Jump-Start under
protocol 2.0. It uses fresh Scryfall discovery captures and a fresh official
FINAL FANTASY release-notes capture for Cid's Jump label. J preserves the
frozen 2021 placement system and every A–I packet; it is generated into the
assessment projection only by `tools/build_mechanics_assessments.py`.

## K batch, October 29, 2026

Kicker, Kinship, and Kinfall are covered by the same presence-based contract.
Kicker and Kinship use selected released-paper mechanic-bearing faces; Kicker
keeps its observed WU, UB, and BG combinations distinct from independent
colors. Kicker discovery follows every returned Scryfall page, without
claiming unselected hits were individually reviewed.

Kinfall is a special scope: the selected green Plane-Merge Elf is a Mystery
Booster playtest card with a card-specific Kinfall label. Its accepted official
review verifies card existence only, so the presentation describes that card's
effect and explicitly does not claim a verified general Kinfall definition.
The K extension keeps the escaped symbol, safe-link, font-fallback, and
one-selected-link contracts through assessment, rules, and reference paths.

## L batch, October 29, 2026

The same presence-based contract covers eleven supplemental L records, for 210 A–L assessments. Lifelink remains mapped to frozen 2021. Each independent color, colorless bucket and observed combination has one selected linked witness; all 83 selected full objects bind to fresh accurately receipted captures. Earlier A–K rows and bindings remain unchanged.

Actual mechanic-bearing faces govern Living Metal, including their color indicators. Landwalk grants and token creators use source colors; Landcycling covers basic landcycling and the individual land-type variants. Living Weapon uses the Equipment's colors rather than the Germ token's color. Name-only Lieutenant matches, digital-only Landfall cards and future releases are excluded. Landship remains a narrow Plane-Merge Elf playtest example with no verified general definition. Legacy retains explicit playtest scope and the official 2019 release notes' permanent physical-card changes.

L uses the existing escaped mana renderer through assessment, rules and references, and the existing mixed-access presentation for independent slots plus combinations. Newly encountered three/four-color symbols reuse pinned native Mana paths and colors. Raw inherited captures with missing trustworthy retrieval metadata stay explicitly unreceipted, distinct from fresh selected-card authority. Unselected discovery hits are not claimed individually reviewed.

## M batch, October 29, 2026

The same presence-based contract covers 25 supplemental M entries, for 235 A–M assessments and 21 source bindings. Menace and Mill remain frozen mapped entries. M shows one linked example per independent color, colorless bucket or observed exact combination; all 183 selected bucket witnesses bind to 182 distinct fresh full objects with preserved POST requests and accurate response receipts. Earlier A–L content and the 2021 calculations remain unchanged.

Full-Oracle grants supplement keyword discovery: Miracle, Mayhem, Myriad and Mountainwalk retain their exact source-color combinations. Mechanic-bearing DFC faces, color indicators, Devoid and colorless lands govern colors. Manifest and Manifest Dread, and Morph and Megamorph, retain their separate entry scopes. Stickers do not enter ordinary Mentor evidence. Exact flavor labels remain card-specific. Generic copy effects, support-only references and evasion-removal effects do not establish access.

M extends the existing escaped symbol renderer through assessment, rules and references with its encountered snow and white/blue hybrid tokens, plus the established accessible labels and blocked-font text fallback. Mixed independent/combination strips and one-selected-link presentation follow L. Inherited derived discovery aggregates and incomplete request metadata remain explicitly distinct from current raw request/response authority. Unselected discoveries are not claimed individually reviewed; absences remain bounded.

## N batch, October 30, 2026

The presence-based contract covers Ninjutsu, Nightbound and Nonbasic landwalk, for 238 A–N assessments and 22 bindings. Each independent color, colorless bucket and exact observed combination has one selected linked card. Eleven full objects bind to the original fresh collection request and response, with a separate fresh request/response for red Yuffie, Materia Hunter. There are twelve selected witnesses. Earlier 235 A–M rows, 21 bindings, frozen 2021 and the M-only cost-run repair remain unchanged.

Nightbound uses actual back-face colors, never the front face's colors. Nonbasic landwalk uses the Equipment source's colorlessness for Trailblazer's Boots. Ninjutsu includes commander ninjutsu; full-Oracle discovery explicitly includes reminder text and grants, with Satoru Umezawa and Yuriko confirming the already represented blue-black combination. Digital hits do not enter released-paper access. The original default-Oracle capture remains separately labeled, rather than misrepresented as full Oracle. Unselected hits are not claimed individually reviewed; absence stays bounded to the recorded scope.

N reuses the escaped mana renderer across assessment, rules and references with accessible labels and blocked-font fallback. Selected links appear once in the whole detail; combination examples are not repeated under constituent colors, and Sources contains non-card references only.

## O batch, October 30, 2026

The same contract covers Offering, Offspring, Open an Attraction, Opus, Outlast and Overload, for 244 A–O assessments and 23 source bindings. Each selected witness is bound to a fresh receipted full-card collection; source colors and exact combinations are never inferred from names, recipients, or color identity. Open an Attraction retains ordinary non-acorn Unfinity cards and excludes acorn-only inflation. Opus is scope-labeled as its released-paper ability-word context. Existing A–N, frozen 2021 calculations, safe escaped mana formatting, accessible fallback and one-link detail presentation remain protected.

## P batch, October 30, 2026

The same contract covers 22 unmapped P entries, for 266 A–P assessments / 24 bindings, with 157 selected bucket witnesses. Protection and Prowess remain frozen 2021; Play remains a generic rules reference. Actual mechanic-bearing faces, color indicators and rules-defined characteristics determine colors. Prepared uses its creature face, Populate its action-bearing face, and Prototype includes the five colored prototyped forms plus a normally cast colorless example under rules 718.3b and 718.4. Prowl retains the red Hunting Velociraptor grant; Phasing includes keyword and direct-action sources.

Ordinary non-acorn Unfinity Parade! qualifies. Payoffs, removal, generic copying, stickers, silver/acorn material, playtest metadata and future printings do not inflate ordinary access. Partner and Partner with remain distinct. Planeswalk retains its existing Special grouping, using ordinary direct source cards for colored/colorless access and preserving planes/phenomena as separate special evidence. Exact combinations remain separate even alongside independent colors.

The 22 fresh complete-Oracle captures have actual matching URL/time/status/hash receipts; original provisional attempts remain separately labeled, including one earlier receipt/body mismatch and the abandoned broad Planeswalk response. No timestamp is reassigned to a later replacement body. P reuses compact escaped mana rendering and one selected link per bucket across the whole detail; A–O and frozen 2021 data remain unchanged.

## R batch, October 30, 2026

The same presence-based contract covers 23 unmapped R entries, for 289 A–P/R assessments and 25 bindings, with 129 selected bucket witnesses. Reach stays mapped to frozen 2021; Reveal stays a generic rules reference. All selected full objects bind to actual saved successful responses and their exact printing links. Inherited supplement reference/rules metadata stays distinct from fresh retrieval receipts. Three original failed queries are retained honestly without missing-body hashes; their fresh error reissues and successful alternate queries have separate actual timestamps and raw bodies.

Source colors govern explicit grants and token creators: Rustic Clachan and Threefold Signal stay colorless, Skeletonize stays red, Wrenn and Six stays red-green, and no recipient or created token supplies access. Michelangelo’s Raid (the Fridge) label remains card-specific. Preserve the full restrictions for Rapid Fire, Taigam, Exterminate!, Ian Chesterton, Renew, and the regeneration costs and sacrifices. Role token keeps its existing broad subtype scope. Ordinary non-acorn Unfinity qualifies for Roll to Visit Your Attractions while its existing Special grouping remains unchanged; payoff-only roll triggers do not count. Digital, unreleased, playtest metadata, tokens, Vanguard, acorn, silver, removal and name-only matches do not inflate ordinary access. Earlier A–P packets, frozen calculations and existing symbol-formatting branches remain protected.

## S batch, October 30, 2026

The same presence-only contract now covers all 40 unmapped S entries, including existing Special material, for 329 assessments and 26 source bindings. Scry remains mapped to frozen 2021. The 221 selected bucket witnesses retain actual mechanic-bearing face/source colors, every observed exact combination, and colorless grants or direct actions. Seek and Specialize use explicit digital scopes; Sell Contraband, Scions' Secretary and Sigil of Corruption remain card-specific labels. Sacrifice, Shuffle and Archenemy Set in motion remain rules references without incidental access maps. Main/Special grouping is unchanged.

Selected full objects and exact printing links bind to successful saved discovery responses. The ledger records 78 actual GET intervals/statuses/hashes (77 HTTP 200 and one retained HTTP 429). Twenty-seven earlier bodies (25 lists and two API error bodies) remain explicitly unreceipted with unknown original event times/statuses; fresh uniquely named captures supply the selected evidence instead. An additional overwritten early error remains honestly unknown. Raw captures and brace notation are preserved.

Full-Oracle screening rejects payoff, removal, name-only and related-ability matches: Scavenge the Dead is not scavenge; Shadow blocking exceptions do not grant shadow; shroud removal, gravestorm, Surveil payoffs, Suspect removal/counters and Swampwalk text-changing/bypass effects do not establish access. Station excludes future printings, source colors govern token creators and grants, and split-card colors follow the action-bearing face. S reuses compact one-link-per-bucket rendering, combination labels, native pinned mana artwork, escaping and accessible font fallback without changing earlier cohorts or frozen calculations.


## T batch, October 30, 2026

The same presence-only contract covers all 17 unmapped T entries with 115 selected bucket witnesses; mapped Trample and all earlier cohorts remain protected. Tap and Triple are generic rules references with real rules definitions. Exact Two-Headed Coin and The Betrayer labels remain scoped to Edgar and Khârn. Main/Special grouping and entry variants remain unchanged.

Fresh full-Oracle and keyword/remainder screening preserves actual source/face colors, toxic-token creators (including WB/RG), all 24 Treasure signatures and all rules-defined Typecycling variants/grants. Native Treasure subtype cards stay in scope. Transform excludes payoff/ancestry/removal references and attributes direct actions, transformed-entry instructions and transforming-token abilities to their source face. Ordinary non-acorn Unfinity is eligible; playtest, acorn/silver, digital, future and special objects do not inflate ordinary access. Exact combinations remain separate from independent colors.

All 115 selected full objects and exact printing URLs bind to 24 fresh accurately timed/statused/hashed HTTP 200 captures, including official Warhammer release notes. Twenty-one original receipt claims and saved provisional files remain unchanged but explicitly unbound because their raw claimed hashes differ from saved bytes; current-file hashes are independently inventoried without inventing old event metadata. The retained original Khârn query is HTTP 429, never negative evidence. Fresh paper/date-filtered discovery follows every returned page and closes reminderless keyword and printed-subtype gaps. Player definitions and named-card facts remain distinct from local audit notes.

## U batch, October 31, 2026

The presence-only contract covers all eight unmapped U entries, with 31 selected bucket witnesses, for 354 assessments and 28 bindings. Untap remains a rules reference. Underdog remains Ruff's card-specific Mystery Booster playtest label in the existing Special group. Actual source colors retain Umbra Armor's WG and WUG creator combinations, Undergrowth BG, native Undying BR, Unearth WB/UB/BR/UBR plus colorless, and Unleash BR alongside independent colors.

Full-Oracle searches include historical Totem Armor, grants and reminder text. Estrid's Mask creation uses Estrid's WUG colors; standalone tokens and stickers are excluded from ordinary access. Colored unearth costs on colorless artifacts do not establish those colors; Salvation Colossus's white source has an eight-energy unearth cost. Name-only, recipient-only, digital, silver/acorn and other special objects do not inflate ordinary scope.

Selected full objects and exact printing links bind to saved raw captures and actual receipts, including the preserved selected-card POST body. Two anomalous wrong-query responses remain unbound; original missing official retrieval times remain explicitly unknown, with separate fresh context replacing them. U reuses escaped native symbols, accessible fallback, exact combinations and one selected link per bucket throughout detail. All earlier cohorts, source bindings, grouping and frozen 2021 behavior remain protected.

## V batch, October 31, 2026

All six unmapped V entries use `v-protocol.json`: Valiant, Vanishing, Venture into the Dungeon, Vivid, Void and Vote. Forty selected witnesses cover independent colors, colorless sources and exact combinations; mapped Vigilance and every frozen/prior record stay unchanged. Vanishing preserves numbered and unnumbered rules; Venture retains its literal Undercity variant without importing Initiative sources. Vote uses direct voting instructions, excluding modifiers and payoffs alone.

The independently screened discovery union includes keyword/full-Oracle and complete-scope responses. Kimahri is name-only Valiant, Omenpath to Naya is playtest despite its masters set type, and digital/unreleased/token/plane/minigame material remains separately excluded. Three fresh official mechanics articles establish the ability-word meanings. Raw receipts, POST request, full-object/printing bindings and source-screen decisions live in `v-protocol-evidence/` and `V-ACCESS-REVIEW.md`; research is separate from independent engineering QA and Owner acceptance.
