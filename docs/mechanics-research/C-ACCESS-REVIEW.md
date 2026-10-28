# C mechanics — Color Access review

Current review: October 28, 2026. Protocol 2.0. All 35 supplemental C entries are covered. This records observed card access, not Primary/Secondary/Tertiary judgments. The frozen 2021 catalog and existing A/B access records are unchanged.

## Evidence and scope

The three canonical C packets retain per-card facts, Oracle IDs, inclusion/exclusion reasons, mechanic-bearing colors, current access buckets and player-facing explanations. Raw keyword, Oracle-term and release-qualified query pages and receipts are under `c-protocol-evidence/`. Scryfall queries were paginated and Oracle IDs deduplicated. A 429 response requested a 60-second pause; collection stopped and resumed sequentially after that pause. The interrupted Conjure bodies remain preserved alongside a complete later capture; the aborted receipt distinguishes filesystem save times from unavailable request times.

Generic Cast/Counter/Create do not receive broad word-search color maps. Conjure/Covercast use digital cards. Other entries use released paper cards, separating independent colors, multicolor combinations and colorless examples. Format legality is not inferred from access.

Review corrections include excluding name-only Burning Cloak, payoff-only Third Little Pig and Crescendo Conductor, planar Nyx/Ood Sphere/TARDIS Bay, playtest Lutri/Omnipresent Impostor/Snap Judgment and Heroes of the Realm Treizeci/Mountain Mover. Expose the Culprit is retained because its captured second mode performs cloak. Commander ninjutsu remains blue-black combination evidence; Covercast remains blue-red digital combination evidence. Convert retains face color indicators; Craft follows its front face; colored activation costs do not recolor lands or other colorless cards.

## Inventory

“Independent” lists colors supported by a qualifying monocolor card or explicit grant. Combination columns record joint evidence separately. Counts describe screened records, not ranks.

| Mechanic | Independent | Combinations | Colorless | Screened |
|---|---|---|---|---:|
| Cascade | UBRG | WU, WG, UB, UR, UG, BR, RG, WUB, UBR, URG, UBRG, WUBRG | Yes | 57 |
| Cast | — | — | N/A | 0 |
| Casualty | UBR | WB, BR, UBR | No example | 21 |
| Celebration | WR | WR | No example | 12 |
| Champion | WUBRG | — | No example | 27 |
| Changeling | WUBRG | WU, WB, WR, UB, UG, RG | Yes | 85 |
| Channel | WUBRG | UG | Yes | 41 |
| Choose a background | WUBRG | — | Yes | 32 |
| Chroma | WUBRG | — | No example | 9 |
| Cipher | UB | UB | No example | 15 |
| Clash | WUBRG | UB | No example | 36 |
| Cleave | WUBRG | — | No example | 13 |
| Cloak | WURG | UB, UG | Yes | 14 |
| Cohort | WBR | — | No example | 9 |
| Collect Evidence | WUBRG | UG, BG, UR, UB | Yes | 24 |
| Commander ninjutsu | — | UB | No example | 3 |
| Companion | — | UB, RG, WG, UG, WB, UR, BR, BG, WU, WR | No example | 42 |
| Compleated | UBG | WG, RG, WR, UG | No example | 13 |
| Conjure | WUBRG | BG, BR, BRG, RG, UB, UBG, UG, UR, WB, WBG, WG, WR, WU, WUBRG, WUG | Yes | 199 |
| Connive | WUB | UB, UBR, WUB | Yes | 50 |
| Conspire | WUBRG | WU, WG, RG, UB, UG, BR | No example | 14 |
| Constellation | WUBRG | WG, UG, WB | No example | 36 |
| Converge | WUBRG | UG | Yes | 28 |
| Convert | WUBR | BR, RG, UB, WBR, WR, WRG, WU, WUB, WUR | No example | 16 |
| Convoke | WUBRG | WG, WUBRG, WU, BG, UR, WUR, WB, WR | Yes | 117 |
| Corrupted | WUBG | WBG, WB | Yes | 26 |
| Council's dilemma | WUBRG | WUB | No example | 9 |
| Counter | — | — | N/A | 0 |
| Coven | WG | WG | No example | 20 |
| Covercast | — | UR | No example | 1 |
| Craft | WUBRG | WU, WUR | Yes | 25 |
| Create | — | — | N/A | 0 |
| Crew | WUBRG | BG, BR, RG, UB, UG, UR, URG, WB, WR, WU | Yes | 221 |
| Cumulative Upkeep | WUBRG | BR, UG, UR | Yes | 88 |
| Cycling | WUBRG | BG, BR, BRG, RG, UB, UBR, WB, WG, WRG, WU, WUB, WUG | Yes | 422 |

## Implementation and review

The generated optional payload expands to 78 records and 11 source bindings. Existing source-bound loading, mana colors, colorless diamonds, per-bucket Reviewed Card Sources, exact-example discovery links and nonredundant Sources presentation are retained. The catalog remains 587 entries because C mechanics already existed in it.

Coordinator reviewed and authored final player copy after research drafts. Developer checks and exact-candidate independent QA are recorded in HANDOFF.md. Visual acceptance remains with the Owner. No publication, push or merge.
