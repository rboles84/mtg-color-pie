# Mechanical Color Pie 2021 - statistical reconnaissance

Read-only measurement of the accepted source layer, taxonomy and runtime
projection. Nothing upstream was modified. Snapshot dated 2021-10-18.

Tiers describe design ownership and frequency. They are never translated into
quality or power, and no metric in this report is a score.

## 1. Executive facts

| | |
|---|---|
| peer mechanics | 216 |
| reconciled source identities | 217 |
| structural-only identities | 1 |
| final peer color assignments | 467 |
| primary / secondary / tertiary assignments | 251 / 139 / 77 |
| canonical nonempty WUBRG selections | 31 |
| registry records | 37 |
| unique WUBRG color sets in the registry | 31 |
| Vox families | 23 |
| mechanics with zero primary owner | 1 |
| max primary owners on one mechanic | 3 |

## 2. Measurement definitions

**exclusive access** - the mechanic has any tier assignment in exactly one color
globally.

**unique primary owner** - exactly one color is primary; other colors may hold
secondary or tertiary access. A different population from exclusive access; the
two are never merged.

**best access** - for a selection, the strongest tier any selected color holds.
Partitions all 216 into primary_available / secondary_only / tertiary_only /
unavailable.

**shared_any_access** - every selected color holds some tier. INCLUSIVE of
shared_primary.

**complementary** - reachable by at least one selected color but not all of them.

**conditional** - an overlapping annotation carried by the runtime. Never added
into a mutually exclusive bucket.

> **Divergence recorded, not resolved: `shared_access`.**
> tools/selection.py and data/fixtures/* defines it as mutually exclusive with shared_primary: every selected colour has access AND not all of them are primary.
> This recon uses the inclusive reading because the recon spec asserts shared_any_access + complementary + unavailable == 216, which only holds for the inclusive reading.
> Relationship: `upstream shared_access + upstream shared_primary == recon shared_any_access`, verified on all 26 multicolour selections, zero exceptions.
> Classification: definitional, NOT a data disagreement. Action taken: none - reported for Owner review. Changing either the fixture or runtime semantics is out of scope for this mission.

## 3. Source vs projection accounting

| measurement | value |
|---|---|
| raw color-list placements | 465 |
| final reconciled peer assignments | 467 |
| assignments on all source identities | 468 |
| structural-only assignments excluded | 1 |
| both-agree assignments | 450 |
| catalog-only assignments | 7 |
| list-only assignments | 6 |
| adjudicated assignments | 5 |

**Reconciliation.** raw_color_list_placements(465) is a count of LIST entries before identity merging; final_reconciled_peer_assignments(467) counts distinct (mechanic, colour) pairs after 19 identity merges, after catalog-only assignments are added, and after 1 structural-only assignment(s) are excluded. The two are different measurements of different populations and are not expected to be equal.

## 4. Registry / identity audit

- registry records: **37**
- records mapping to a WUBRG subset: **36**
- unique color sets represented: **31** of 31 canonical selections
- records not reducible to a WUBRG subset: **1**

A registry record is a DISPLAY NAME. Several names share one colour set, so registry record count is not a count of independent mechanical identities and no statistic is duplicated per alias.

Color sets carrying more than one registry name:

| color set | registry names |
|---|---|
| BG | Golgari, Witherbloom |
| UG | Simic, Quandrix |
| UR | Izzet, Prismari |
| WB | Orzhov, Silverquill |
| WR | Boros, Lorehold |

### Not measured

**Colorless** - `mechanical_projection_status: not_measured`

- reason: MCP2021 provides W/U/B/R/G tier ownership only; it does not provide a comparable Colorless ownership column.
- `empty_wubrg_selection_reachable: 0` - Algorithmic empty-set result of the WUBRG projection. NOT a count of Colorless mechanics.
- excluded from mono-color aggregates: True

**Yore** - registry lookup result:

```json
[
  {
    "name": "Non-Green",
    "display": "WUBR",
    "aka": [
      "Yore-Tiller"
    ],
    "canonical_key": "WUBR",
    "mechanical_projection_status": "measured"
  }
]
```

## 5. Overall distribution

### Mechanics by primary-owner count

| primary owners | mechanics |
|---|---|
| 0 | 1 |
| 1 | 180 |
| 2 | 34 |
| 3 | 1 |
| 4 | 0 |
| 5 | 0 |

### Color breadth

| colors with any access | mechanics | pct of 216 |
|---|---|---|
| 1 | 81 | 37.5% |
| 2 | 75 | 34.7% |
| 3 | 30 | 13.9% |
| 4 | 4 | 1.9% |
| 5 | 26 | 12.0% |

### Exact access signatures

28 of the 31 possible signatures occur. Highest twelve by count:

| signature | colors | mechanics |
|---|---|---|
| W | 1 | 26 |
| WUBRG | 5 | 26 |
| B | 1 | 20 |
| U | 1 | 14 |
| UR | 2 | 13 |
| BR | 2 | 12 |
| R | 1 | 11 |
| G | 1 | 10 |
| WU | 2 | 10 |
| WUG | 3 | 8 |
| UG | 2 | 7 |
| WB | 2 | 7 |

Full list in `color-signatures.csv`.

## 6. Per color

| color | primary | secondary | tertiary | reachable | pct of 216 | exclusive access | unique primary owner | conditional |
|---|---|---|---|---|---|---|---|---|
| White | 60 | 24 | 20 | **104** | 48.1% | 26 | 43 | 57 |
| Blue | 57 | 20 | 17 | **94** | 43.5% | 14 | 43 | 53 |
| Black | 45 | 35 | 14 | **94** | 43.5% | 20 | 35 | 54 |
| Red | 45 | 32 | 15 | **92** | 42.6% | 11 | 31 | 52 |
| Green | 44 | 28 | 11 | **83** | 38.4% | 10 | 28 | 50 |

Exclusive access and unique primary owner are separate populations. Both key lists
are in `mechanics-statistics.json` under `per_color`.

## 7. All 31 color selections

Full rows in `identity-statistics.csv`, one row per canonical selection with no
duplication for aliases. Reachable-count distribution by selection size:

| size | selections | min | max | mean | median |
|---|---|---|---|---|---|
| 1 | 5 | 83 | 104 | 93.4 | 94 |
| 2 | 10 | 132 | 155 | 141.9 | 137.5 |
| 3 | 10 | 163 | 189 | 176.1 | 175.5 |
| 4 | 5 | 190 | 206 | 199.8 | 202 |
| 5 | 1 | 216 | 216 | 216.0 | 216 |

## 8. Pair overlap

| pair | any-access overlap | shared-primary overlap | union | Jaccard |
|---|---|---|---|---|
| BR | 52 | 6 | 134 | 0.388 |
| WG | 51 | 9 | 136 | 0.375 |
| WU | 47 | 5 | 151 | 0.311 |
| UR | 47 | 3 | 139 | 0.338 |
| UG | 45 | 5 | 132 | 0.341 |
| WB | 44 | 2 | 154 | 0.286 |
| RG | 42 | 3 | 133 | 0.316 |
| WR | 41 | 2 | 155 | 0.265 |
| BG | 41 | 0 | 136 | 0.301 |
| UB | 39 | 2 | 149 | 0.262 |

Jaccard is derived mathematics over mechanical overlap in this dataset only. It is
not a measure of philosophical closeness or deck synergy.

## 9. Addition / delta analysis

75 one-color-addition transitions, all in `marginal-additions.csv`.

| added color | transitions | newly reachable min..max (mean) | best tier improved min..max (mean) | new owner without improvement min..max (mean) |
|---|---|---|---|---|
| White | 15 | 26..63 (43.5) | 14..21 (17.0) | 27..61 (43.5) |
| Blue | 15 | 14..55 (34.1) | 13..29 (21.0) | 25..51 (38.9) |
| Black | 15 | 20..55 (36.5) | 11..16 (13.6) | 27..59 (43.9) |
| Red | 15 | 11..51 (30.9) | 9..25 (16.8) | 25..61 (44.3) |
| Green | 15 | 10..42 (25.0) | 15..25 (19.5) | 20..55 (38.5) |

## 10. Four-color absence

| omitted | selection | lost completely | best access degraded | owner lost, access retained | unaffected | cross-check |
|---|---|---|---|---|---|---|
| White | UBRG | **26** | 17 | 61 | 112 | PASS (global exclusive = 26) |
| Blue | WBRG | **14** | 29 | 51 | 122 | PASS (global exclusive = 14) |
| Black | WURG | **20** | 15 | 59 | 122 | PASS (global exclusive = 20) |
| Red | WUBG | **11** | 20 | 61 | 124 | PASS (global exclusive = 11) |
| Green | WUBR | **10** | 18 | 55 | 133 | PASS (global exclusive = 10) |

The mandatory cross-check passes for all five: `lost_completely` when a color is
omitted equals that color's global exclusive-access count.

## 11. Families

Primary-family membership is a partition and sums to 216. Secondary membership
overlaps and must not be added into the same total.

Size skew: min 1, max 34, mean 9.39, median 7, stdev 7.31, quartiles [4.0, 7.0, 13.0], coefficient of variation 0.778.

| family | primary | secondary | all | pct of 216 | W | U | B | R | G | conditional |
|---|---|---|---|---|---|---|---|---|---|---|
| stat_modification | 34 | 0 | 34 | 15.7% | 17 | 13 | 17 | 12 | 15 | 21 |
| removal | 22 | 3 | 25 | 10.2% | 12 | 1 | 10 | 5 | 5 | 12 |
| graveyard | 16 | 1 | 17 | 7.4% | 9 | 7 | 7 | 6 | 7 | 6 |
| combat | 15 | 16 | 31 | 6.9% | 7 | 4 | 7 | 12 | 6 | 6 |
| evasion | 14 | 0 | 14 | 6.5% | 3 | 4 | 4 | 11 | 8 | 8 |
| tempo | 13 | 1 | 14 | 6.0% | 7 | 12 | 1 | 4 | 3 | 8 |
| protection | 12 | 1 | 13 | 5.6% | 9 | 6 | 4 | 5 | 6 | 5 |
| card_flow | 11 | 11 | 22 | 5.1% | 4 | 8 | 4 | 6 | 7 | 6 |
| card_type_affinity | 10 | 0 | 10 | 4.6% | 8 | 5 | 2 | 5 | 3 | 1 |
| sacrifice | 8 | 0 | 8 | 3.7% | 1 | 1 | 6 | 7 | 2 | 2 |
| disruption | 8 | 2 | 10 | 3.7% | 0 | 2 | 6 | 3 | 0 | 4 |
| characteristic_change | 7 | 0 | 7 | 3.2% | 3 | 7 | 2 | 1 | 3 | 3 |
| tutoring | 7 | 0 | 7 | 3.2% | 5 | 4 | 3 | 3 | 2 | 3 |
| mana | 7 | 0 | 7 | 3.2% | 1 | 4 | 4 | 3 | 6 | 3 |
| life | 6 | 0 | 6 | 2.8% | 4 | 1 | 6 | 1 | 2 | 4 |
| counters | 5 | 0 | 5 | 2.3% | 2 | 3 | 3 | 2 | 3 | 1 |
| cheat_into_play | 4 | 0 | 4 | 1.9% | 4 | 3 | 1 | 1 | 2 | 2 |
| control | 4 | 0 | 4 | 1.9% | 2 | 3 | 1 | 0 | 1 | 2 |
| copying | 3 | 0 | 3 | 1.4% | 0 | 3 | 0 | 2 | 0 | 2 |
| rules_alteration | 3 | 0 | 3 | 1.4% | 3 | 1 | 1 | 1 | 1 | 2 |
| win_condition | 3 | 0 | 3 | 1.4% | 2 | 0 | 2 | 0 | 0 | 1 |
| theft | 3 | 0 | 3 | 1.4% | 0 | 1 | 2 | 1 | 0 | 2 |
| tokens | 1 | 1 | 2 | 0.5% | 1 | 1 | 1 | 1 | 1 | 1 |

## 12. Conditionality

- conditional mechanics: **105** of 216
- overlapping annotation; never added into a mutually exclusive bucket
- by color: White 57, Blue 53, Black 54, Red 52, Green 50
- by color breadth: 1 colors 24, 2 colors 39, 3 colors 21, 4 colors 4, 5 colors 17
- by tier assignment: primary 122, secondary 90, tertiary 54

## 13. Graph / rendering-load statistics

Three-layer model - 5 color nodes, family nodes, mechanic nodes:

| | |
|---|---|
| color nodes | 5 |
| family nodes | 23 |
| mechanic nodes | 216 |
| total nodes | 244 |
| color to mechanic edges | 467 |
| primary family to mechanic edges | 216 |
| secondary family to mechanic edges | 36 |
| total edges | 719 |

`shares primary family` mechanic pairs: **1520**. Reported as a count only. No mechanic-to-mechanic edge exists in the source; materialising this would invent relationships.

Per-selection render load across all 31 selections:

| metric | min | max | mean | median |
|---|---|---|---|---|
| mechanic nodes | 83 | 216 | 156.8 | 163 |
| color mechanic edges | 83 | 467 | 241.0 | 269 |
| family mechanic edges | 99 | 252 | 185.0 | 192 |

## 14. Provenance / data quality

Audit context, not gameplay statistics.

| | |
|---|---|
| source aliases retained | 18 |
| adjudicated source conflicts | 5 |
| unresolved conflicts | 0 |
| structural only records | 1 |
| mechanics carrying adjudication provenance | 5 |
| mechanics carrying source aliases | 18 |
| raw unmerged identities | 236 |
| catalog only assignments | 7 |
| list only assignments | 6 |
| both agree assignments | 450 |

## 15. Notable extrema

Every extreme names its metric and reports ties rather than discarding them.

| metric | value | records | tied |
|---|---|---|---|
| highest reachable_count among mono-color selections | 104 | W | no |
| lowest reachable_count among mono-color selections | 83 | G | no |
| highest reachable_count among pair selections | 155 | WR | no |
| lowest reachable_count among pair selections | 132 | UG | no |
| highest reachable_count among trio selections | 189 | WUB | no |
| lowest reachable_count among trio selections | 163 | URG | no |
| highest reachable_count among four-color selections | 206 | WUBR | no |
| lowest reachable_count among four-color selections | 190 | UBRG | no |
| highest shared_primary_overlap among color pairs | 9 | WG | no |
| lowest shared_primary_overlap among color pairs | 0 | BG | no |
| largest family by primary_member_count | 34 | stat_modification | no |
| smallest family by primary_member_count | 1 | tokens | no |
| highest lost_completely when the color is omitted | 26 | W | no |
| lowest lost_completely when the color is omitted | 10 | G | no |
| highest best_access_degraded when the color is omitted | 29 | U | no |
| lowest best_access_degraded when the color is omitted | 15 | B | no |

## 16. Visualization implications - facts only

Measurements relevant to rendering. Not design decisions.

- A three-layer graph carries **244 nodes** and **719 edges** before any mechanic-to-mechanic relationship is added.
- Materialising `shares primary family` as edges would add **1520** further edges, about 2 times the entire three-layer edge count. No such relationship exists in the source.
- Per-selection mechanic nodes range 83..216, median 163.
- Per-selection color-to-mechanic edges range 83..467, median 269.
- 28 of 31 exact access signatures occur; 3 do not.
- Family primary-member sizes span 1..34 with a coefficient of variation of 0.778.

## 17. Questions for Owner

1. **Fixture 10 is `VACUOUS_FIXTURE`.** Fixture 10 asserts the set of mechanics that are tertiary in EVERY colour that has them. That set is empty, so the fixture asserts an empty set and cannot demonstrate tertiary rendering. Candidate replacement selections with a non-empty tertiary-only set are listed under `tertiary_fixture_audit` in the JSON. No change was made.

2. **`shared_access` names two different populations** across two accepted
   artifacts. Both are internally consistent and they reconcile exactly, but one
   name for two definitions is a hazard. Which should be canonical?

3. **3 of 31 access signatures never occur.** Whether that absence is worth surfacing is a design question, not a measurement one.

4. **Family primary-member sizes are highly uneven** (1..34, CV 0.778). No merging was performed; the mission forbids it. If a visualization needs balanced groups, that is a presentation decision taken separately from the taxonomy.

