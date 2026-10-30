# L supplemental Color Access review

Protocol 2.0 covers all eleven unmapped L records. Lifelink remains mapped to the frozen 2021 catalog. The canonical packet is `l-protocol.json`; the assessment JSON is generated only by `tools/build_mechanics_assessments.py`.

One selected witness establishes each independent color, colorless bucket or exact combination. The packet contains 83 selected examples. It does not rank access or claim an exhaustive card or printing census. Multicolor examples never establish their component colors independently. The mechanic is explained once, followed by short factual card notes and one card link per bucket.

| Entry | Independent access | Exact combinations | Colorless |
|---|---|---|---|
| Landfall | W U B R G | WUBR, WURG, WUG, WBG, WRG, WG, UBG, URG, UG, BG, RG | Adventuring Gear |
| Landwalk | W U B R G | WU, WRG, WG, UB, UBR, UG, BR, BRG, BG, RG | Adrestia |
| Learn | W U B R G | WB, BG | No example found |
| Level Up | W U B R G | None found | No example found |
| Lieutenant | W U B R G | None found | No example found |
| Living Metal | W U B R | WU, WUR, WBR, WR, WRG, UB, BR | No example found |
| Living Weapon | W B G | BR | Batterbone |
| Landcycling | W U B R G | WU, WG, UB, UG, BR, RG | Ash Barrens |
| Legendary landwalk | G | RG | No example found |
| Landship | G | None found | No example found |
| Legacy | G | None found | Gold Mine |

## Source and scope decisions

Ordinary records use released paper cards through October 29, 2026, including the actual mechanic-bearing face. Living Metal uses the converted Vehicle faces and their color indicators, preserving the full two-face Scryfall objects. Source colors govern grants and token creators: Lord Windgrace establishes BRG Landwalk through its Cat Warrior tokens; Living Weapon follows the Equipment rather than its black Germ. Ash Barrens and Gold Mine remain colorless despite colored mana access. Livonya Silone is bound to its paper Legends printing.

The incomplete initial packet incorrectly included digital-only Advanced Floral Invocations and Hamza for Landfall, unreleased Amanda Grayson and Chief Kyle, and name-only Lieutenant Commander Data and Lieutenant Hikaru Sulu. The corrected witnesses use Nissa of Shadowed Boughs, The Necrobloom, Architect of the Untamed, Loyal Drake and Loyal Guardian; the unsupported WU Landfall bucket is removed. Gosta Dirk removes an evasion restriction rather than granting Landwalk and is not a witness. Unexpected discovery hits are screened against text rather than accepted from names or keyword indexes.

Homer, the Hermit is an ordinary new paper MBC card, not a playtest card. The fresh official Mystery Booster Commander Edition release notes distinguish the new cards numbered 1–60 from playtest/acorn material and explicitly reproduce Homer's Landfall ability. This resolves its anomalous Scryfall legality fields without making a general legality claim from them.

Landship remains narrow, card-specific Mystery Booster playtest evidence from Plane-Merge Elf. Its accepted official existence review does not establish a general definition; the 2019 release notes do not mention Landship or that card. Legacy uses Gold Mine and Inspirational Antelope in playtest scope. The fresh official 2019 release notes verify permanent node marks and the written word between games. These special examples do not enter ordinary paper buckets or establish Commander legality.

## Retrieval integrity

Fresh raw responses and `retrieval-receipts.json` record actual request URLs, start/end UTC times, HTTP status and SHA-256. Every selected full card object binds to the exact fresh body containing it. Broad search pagination follows returned `next_page` URLs. Unselected hits are not claimed individually reviewed.

Inherited raw bodies remain immutable for audit. Their original exact URLs, timestamps and statuses were not trustworthy; the initial generic endpoint URLs and midnight timestamps are withdrawn, and the receipt ledger explicitly marks that metadata unknown. None of those bodies supplies a current selected-card binding. A fresh collector-number request mistakenly returned Noxious Bayou; its accurate receipt is retained with an exclusion disposition, and a separate corrected exact-card capture supplies Gold Mine. No provenance is backdated or inferred.

## Developer validation

The focused `--l-only` browser mode renders all eleven entries rather than exiting after copy checks. It checks the 83 selected links once across each whole detail, exact independent/combination maps in list/search/detail, actual mana tokens and injected numeric/colored/colorless/X/hybrid/tap fixtures across assessment/rules/reference, escaping, accessible glyphs and no-font fallback, malformed-data isolation, keyboard use and narrow containment. Native CI-3/CI-4 paths, palettes and sizes use the existing pinned Mana symbol contract. Existing A–K rows/bindings and frozen 2021 calculations stay unchanged. Independent QA is a separate candidate-bound phase; developer checks do not assert that verdict.
