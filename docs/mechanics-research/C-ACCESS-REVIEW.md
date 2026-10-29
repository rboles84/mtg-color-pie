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
| Convoke | WUBRG | WG, WUBRG, WU, BG, WUR, WB, WR | Yes | 117 |
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

## Independent-review corrections

The first candidate was rejected by independent QA. Coven's print-query summary incorrectly pointed to a retained HTTP 429 body with a stale success hash. A new, separately named capture contains all 59 printings and covers every included Coven Oracle ID. The original error body and per-page receipt remain preserved; the summary and canonical source references now point to the recovered evidence.

Celebration excludes the acorn printing of Overcooked from ordinary-paper access. Convoke excludes Joyful Stormsculptor because its text rewards casting spells with convoke rather than granting convoke. The latter removes the unsupported blue-red combination; other independently supported blue and red examples remain. Raw source facts are retained for both exclusions.

## October 28 representative-example correction

The Owner clarified that one qualifying card is sufficient to establish Color Access. The C preview now shows one selected card per supported independent color, colorless bucket or multicolor combination. Additional reviewed cards remain in the research records and exact Scryfall discovery links. No full-population enumeration is required for a positive access claim. Multicolor-only colors no longer repeat the combination’s narrative and citations.

Corrected 31 false-negative exclusions from saved Oracle facts: nine Changeling token creators, two cards that collect evidence, three explicit Convoke grants, and seventeen direct Connive actions. The Changeling sources include Black Market Connections and Maskwood Nexus; Collect Evidence restores Incinerator of the Guilty and Urgent Necropsy; Convoke restores Dazzling Theater, Eirdu’s white front face and Caetus’s blue back face. Glorious Purpose and Iron Monger remain Connive payoff exclusions. No new color or combination bucket is introduced. Raw response bodies and captured card facts remain unchanged.

The coordinator finished the source correction after a worker’s overly broad rebinding attempt failed validation; those intermediate bucket changes were discarded before the final producer run. Original scope exclusions and representative ordering were preserved, except explicit selection of the named Conjure examples. The Crew red-white example now accurately describes its selected source, Astor, Bearer of Blades.

C definitions are explained once. Keyword examples use short card-specific facts or costs; grants state the actual affected spells and conditions. Connive distinguishes self-conniving, convokers and a target Villain. Eutropia distinguishes the lasting counter from temporary flying; Fateful Tempest explains present votes. Shared research-method boilerplate is removed from the C player panels. All thirty-five current access reviews remain separate from frozen 2021 placements; A/B data and presentation are unchanged.

Implementation ownership: coordinator, using RobDev. Paths reviewed: the three C packets, retained card facts, COLOR-ACCESS-PROTOCOL.md, assessment producer, presenter and focused harness. Source corrections and copy live in the three packets; the runtime payload is regenerated. Independent review and exact candidate results are recorded in HANDOFF.md. Remaining Owner judgment is readability and whether one visible example is the preferred density. No new live fetch, publication, push or merge.
