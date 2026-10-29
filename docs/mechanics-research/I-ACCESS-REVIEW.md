# I supplemental Color Access review

Review date: 2026-10-29. Protocol 2.0. The canonical packet is `i-protocol.json`. Fifteen supplemental records are covered; Indestructible remains mapped to frozen 2021. There are 96 selected witnesses, one per represented independent color, colorless bucket or observed combination. This is presence-based discovery evidence, not a ranking or exhaustive census.

## Reviewed access

| Mechanic | Independent colors | Combinations | Colorless |
| --- | --- | --- | --- |
| Impending | W, U, B, R, G | None found | None found |
| Imprint | W, U, R | UR | Chrome Mox |
| Improvise | W, U, B, R | UR | Archway of Innovation |
| Increment | U, G | UG | None found |
| Incubate | W, U, B, R, G | WB, BG | None found |
| Infect | W, U, B, R, G | None found | Blightsteel Colossus |
| Infusion | B, G | BG | None found |
| Ingest | None found | None found | Benthic Infiltrator |
| Inspired | W, U, B, R, G | UB | None found |
| Intimidate | W, B, R, G | UB, RG, BG | Executioner's Hood |
| Investigate | W, U, B, R, G | WU, UB, BR, UR, UG, RG, WUB, WR, WUG, WB, UBR | Magnifying Glass |
| Islandwalk | U, B, R, G | UB, UG, WU | Adrestia |
| Islandcycling | U | UB, WU | None found |
| Intensity | W, U, B, R, G | WB, BR, RG, WG, UR, WR | Drix Interlacer |
| Incorporate | W, U, B, R, G | UR | None found |

Colors use WUBRG membership order. A combination never establishes its separate constituent colors. Actual source colors control; mana costs, activation costs, commander identity, recipients and created tokens do not replace them. The packet retains complete source objects and exact selected-printing links.

## Mechanic and source boundaries

Increment is an ordinary released-paper keyword with rule 702.191, also described in the captured Secrets of Strixhaven release notes. Its condition compares mana actually spent with power or toughness; it does not compare the spell's mana value. Infusion is an ability word for caring about life gained this turn, with timing and conditions on each card. Its paper witnesses are separate from digital-only Corpseweaver Prodigy. Inspired triggers when its source becomes untapped. Imprint is an ability word with card-specific exile and linked effects, not a single universal imprint action.

Impending is an alternative casting cost; if paid, the permanent enters with time counters and is not a creature while it has one, and the beginning-of-your-end-step trigger removes a counter. Impending Flux is a name-only discovery hit, so it is not selected. Infect changes damage to creatures and players into the corresponding counters, while damage to other permanent types is unaffected. Burn the Impure is payoff-only and is not selected as a red infect source; Fallen Ferromancer actually has infect.

Incubate and Investigate use the card performing the action. Their colorless Incubator and Clue tokens do not establish colorless source access. The Incubate discovery's Phyrexian Incubator is funny/special material and is not an ordinary-paper witness. Investigate's selected colorless Magnifying Glass actually performs the action. The discovered Flotsam // Jetsam has combined UBG colors, but the mechanic-bearing Flotsam half costs {1}{G/U}; that combined array cannot establish UBG Investigate access. UG has its own selected Duggan witness. Sol, Advocate Eternal is Heroes of the Realm material and does not establish ordinary-paper WUBG access. Unreleased discovery printings were not selected, including the returned Tireless Tracker printing; the selected green witness is the released Briarbridge Patrol.

Ingest's Benthic Infiltrator has Devoid and is colorless despite blue mana symbols. Oddric, Lunar Marquis is a Mystery Booster 2 playtest object and is outside ordinary-paper evidence. Islandwalk's black Shore Snapper explicitly gains islandwalk for {U}; its source remains black. Adrestia supplies a real colorless paper witness. Gosta Dirk allows blocking through islandwalk and does not grant it; Island Sanctuary and Celestine Reef only refer to it. Korozda Guildmage's grant supplies black-green Intimidate access; Executioner's Hood stays colorless despite its recipient. Islandcycling means searching for an Island card, with the card discarded as part of the cost; its combined examples remain WU and UB rather than independent white or black access.

Intensity and Incorporate are expressly digital / Alchemy material. The official Intensity article describes a card designation whose value changes perpetually; each selected card's actual text defines what intensifies and when. Quickbeast Amulet intensifies by the entering creature's power; other examples specify their own amounts or intensify instruction. Incorporate adds mana to the selected card's mana cost and may accompany a separate perpetual grant. Its source colors establish access, including blue-red Inspiring Easel, without assigning the recipient's colors to that source.

These are targeted selection decisions. No claim is made that every unselected search hit was individually reviewed or excluded. Negative buckets mean no example found in this bounded review. Generic rules actions remain governed by the prior protocol; I introduces no new generic-action classification.

## Evidence and integrity

`i-protocol-evidence/retrieval-receipts.json` records all fifteen fresh Scryfall discovery GETs, five fresh Wizards article GETs and the September 25, 2026 Comprehensive Rules GET. Every receipt contains the actual request URL, final URL, request-start UTC, retrieval UTC, HTTP status and raw response SHA-256. Every request returned HTTP 200. Scryfall requests used explicit User-Agent and Accept headers. Raw responses are retained unchanged.

Each selected card's `evidence_binding` names its actual discovery capture path and raw SHA-256, printing ID and Oracle ID. Its full `card_facts` object equals the corresponding object in that captured response. No synthetic or placeholder receipt is used. The fresh CR capture matches the inherited rules hash; inherited clauses and article/reference metadata remain separately identified in `inherited_reference_evidence`. Sources in the presentation contain non-card references; selected card links appear once with their bucket's note.

## Developer verification and review boundary

The producer owns `data/mechanics-assessments.v1.json`; the canonical packet is the authored input. I extends the escaped token formatter through assessment, rules and references, including numeric, colored, colorless, X, hybrid and tap tokens. Accessible names, safe HTTPS links, unknown-token escaping and blocked-font text remain intact. H/F combination vectors are unchanged.

The developer handoff in `HANDOFF.md` records exact commands and observations. Independent RobQA follows the committed candidate; appearance and reading flow remain Owner review. No integration or publication is implied.
