# S supplemental Color Access review

Review date: 2026-10-30 (America/Denver). Protocol: [Color Access 2.0](COLOR-ACCESS-PROTOCOL.md). Canonical packet: [s-protocol.json](s-protocol.json). This review covers the 40 previously unmapped S entries, including the Special entries. Scry stays in the frozen 2021 catalog and is outside this packet.

## Source and decision route

The fixed name, group, reference, rule number and rule-source metadata come from `data/mechanics-supplement.v1.json`. Their existing verification dates and hashes are inherited metadata, not fresh retrieval receipts. Scryfall complete-Oracle discovery bodies in `s-protocol-evidence/` supply card facts; the selected object for every bucket is copied intact from a successful saved response and tied to that response’s URL, UTC request interval, HTTP status and raw SHA-256. The exact printing URL is the saved card object's `scryfall_uri`. `s-protocol-evidence/retrieval-receipts.json` is the request ledger, with schema version 1.

The route is presence only. Each independent color, exact multicolor combination and colorless bucket below has one chosen witness and a short card-specific note in the packet. A combination never establishes monocolor access. The source performing or granting the mechanic determines color, using the actual mechanic-bearing face, indicator and rules-defined color where applicable. Colored mana in a colorless land’s activation does not color that land. Source cards that create ability-bearing tokens keep their own colors. No recipient or created token contributes its colors. Unselected discovery hits remain available as raw evidence but are not individually described as reviewed or rejected.

Ordinary scope is released, non-acorn paper cards through the review date. Digital-only Seek and Specialize use labeled Digital / Alchemy scope. `Sacrifice`, `Shuffle` and Special `Set in motion` are rules-action references with all access slots `not_applicable`. Exact ability labels `Sell Contraband`, `Scions' Secretary` and `Sigil of Corruption` describe only their named cards. The presence map does not express tiers, strength, frequency or inability of an unrepresented color to receive an ability.

## Selected access map

`C` is a colorless source. All multicolor keys are in WUBRG order. Empty access (`—`) means no qualifying example in this reviewed scope; it is not a prohibition.

| Entry | Selected source-color buckets |
| --- | --- |
| Saddle | W, U, B, R, G, C, WR, WG, BG, WRG |
| Scavenge | B, G, BG |
| Secret council | U, R, UG, UR |
| Shadow | W, U, B, C, WUB, UB |
| Shroud | W, U, B, G, C, WU, UR, WUG, RG, WRG, UG, WG |
| Skulk | W, U, B, C, WU, WB, UB |
| Sneak | W, U, B, R, G, WB |
| Solved | W, U, B, R, G, C |
| Soulbond | W, U, B, R, G |
| Soulshift | W, B, G |
| Spectacle | B, R, BR |
| Spell mastery | W, U, B, R, G, WR |
| Splice | W, U, B, R, G, UR |
| Split Second | W, U, B, R, G, WR, BR |
| Spree | W, U, B, R, G |
| Squad | W, U, B, R, G, C |
| Start Your Engines! | W, U, B, R, G, C, WB, BR, WU, WRG, WBR |
| Station | W, U, B, R, G, C, BRG, WUBRG, WUR |
| Storied | W, R, WR |
| Storm | W, U, B, R, G, BR, UR, URG |
| Strive | W, U, B, R, G, WR |
| Sunburst | C |
| Support | W, U, R, G, WG |
| Surge | U, R |
| Surveil | W, U, B, R, G, C, WU, WB, UB, UR, UG, BR, BG, WG, WUB, WUG, UBG |
| Survival | W, B, G, WG |
| Suspect | W, U, B, R, WR, BR |
| Suspend | W, U, B, R, G, C, WR, WUR, WU, UR, UB |
| Sweep | W, B, R |
| Sell Contraband | B |
| Scions' Secretary | W |
| Sigil of Corruption | R |
| Swampcycling | B, BR, UB |
| Slivercycling | R |
| Swampwalk | W, B, G, BR, UBR, BG, UB |
| Specialize (digital) | W, U, B, R, G |
| Seek (digital) | W, U, B, R, G, C, WR, UR, URG, WRG, WG, RG, UB, UG, BR, WB, WUB, BG, WBG, WU, UBG |
| Sacrifice | —; rules only |
| Shuffle | —; rules only |
| Set in motion (Special) | —; Archenemy scheme action |

## Qualification and limits

- Saddle: Archmage's Newt both benefits from being saddled and has native saddle 3, establishing blue access. Guidelight Matrix directly saddles a Mount, and Jandor grants saddle only to the five stated creature types. The source of a Pilot token is used only where the source itself qualifies; Pilot recipients do not establish their own colors.
- Sneak also appears on spells such as Jennika's Technique, so the scope uses spell casting; only creature spells cast for sneak enter tapped and attacking. Sunburst puts +1/+1 counters on creatures and charge counters on noncreatures. Specialize follows its [inherited official Arena reference](https://magic.wizards.com/en/news/mtg-arena/mtg-arena-announcements-june-22-2022): the discarded card may supply a color or basic land type, and the resulting version depends on that choice.
- Scavenge: Malanthrope’s `Scavenge the Dead` is a card-specific name for graveyard exile, not the scavenge keyword. Shadow’s Aetherflame Wall and Aether Web only bypass blocking restrictions; Cazur, Shadowfax and Shadow the Hedgehog are name/partner matches, not Shadow sources. Minas Morgul and Lyna actually give shadow counters.
- Shroud: Arcane Lighthouse and Shay Cormac remove or bypass shroud and are excluded. Deadly Grub’s black source creates the shrouded green Insect; it does not establish green through that token. Aerie Mystics is a white source despite the {1}{G}{U} activation cost.
- Split Second: Molten Disaster gains it only if kicked for {R}; Shadow the Hedgehog grants it only to spells cast using artifact mana. Both conditions are retained in the selected notes.
- Station: future-dated Star Trek printings are outside the review cutoff. Released Edge of Eternities cards support the recorded buckets; the future-only WB hit is absent. Storied Grub is name-only, and Storm’s Bitter Ordeal is **gravestorm**, a separate ability. Immard and Storm, Queen of Wakanda are name-only Storm hits.
- Surveil: Denzilore Fatehold rewards surveilling but does not perform or grant it. `Fuss // Bother` surveils only on the WU Bother half, not the card’s aggregate WUR colors. Tam's Resistance creates a Jace token with a surveil ability; the UG source is the card creating that token.
- Survival: Moira Brown’s Equipment name includes `Survival` without the ability word. Suspect: Airtight Alibi and Eliminate the Impossible clear or prevent suspicion; Investigator's Journal uses suspect counters unrelated to suspecting creatures; Deadly Complication only removes suspicion. The selected blue and BR sources actually suspect creatures.
- Swampwalk: Magical Hack changes a land-type word without itself granting swampwalk, and Ur-Drago lets creatures be blocked as though they lacked it. Wrexial has native swampwalk on its UB source. Seek excludes paper `Seek out` ability labels and digital payoff-only triggers; its access is digital-only.

## Retrieval history

The ledger has 78 actual GET request receipts: 77 HTTP 200 and one retained HTTP 429. Twenty-seven original discovery bodies lacked trustworthy event-time request receipts: 25 successful lists and two saved API `rate_limited` error bodies (`saddle-default-oracle.json` and `split-second-default-oracle.json`). Their HTTP statuses and request times are unknown. All remain preserved and explicitly labeled historical/unreceipted in the packet. Each query was separately reacquired under a unique filename with its real request start/end UTC, status and hash; the newly encountered 429 response is retained separately, followed by more than 60 seconds without another request and a successful new retry. An earlier generic-user-agent error response was overwritten before preservation; its original bytes, status and time remain unknown. No file mtime was promoted to a retrieval timestamp. Raw responses are kept as returned, including complete paginated discovery pages.

The 221 selected bucket witnesses describe one example per supported source-color bucket. That number is a packet completeness count, not a prevalence or placement signal. All source notes are paraphrases of the saved card facts and retain stated costs, conditions and timing where those facts matter. The packet alone is authoritative for this S review; generated assessment payloads and the preview must be built from it through `tools/build_mechanics_assessments.py`.

## Player-copy boundary

Packet `discovery_screen.review_notes` retains the original per-entry exclusion, access-adjudication and provenance-repair notes. Those fields remain local research material and are not projected into player-facing limitations. Current player limitations retain only the three exact card-specific flavor-label scopes and the digital Seek / paper “Seek out” distinction. Card-specific costs and conditions remain with selected examples; source metadata, historical unknowns and retrieval receipts stay unchanged.
