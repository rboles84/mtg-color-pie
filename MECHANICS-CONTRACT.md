# Mechanical Projection Contract

What the Mechanics layer is allowed to say, and on what authority.

Written before implementation on purpose. The extraction is finished and
frozen; the open question is no longer *can we trust the data* but *what
questions should the UI ask of it*. This document answers only the second.

Status: **contract agreed, not implemented.** The Mechanics button is still
disabled and nothing in `vox-color/color-wheel.html` reads any of this.

---

## 1. The frozen source layer

`data/mcp2021.reconciled.json` is the authority. It is frozen at:

| | |
|---|---|
| colour/tier sections captured | 15 of 15 |
| raw colour-list placements | 465 |
| ability-catalog entries | 212 |
| reconciled mechanics, upper bound | **236** |
| projected after identity rulings | **222** |
| genuine internal source conflicts | 4, all adjudicated |
| unadjudicated TIER conflicts | 0 |
| unruled IDENTITY pairs | **14 — blocking** |

Frozen means: no further parser pass without a stated defect. Another
extraction run is now more likely to add risk than value.

**The mechanic count is NOT frozen.** Tier reconciliation asked whether the
two halves agree about a mechanic's colours. It never asked the prior
question: are these two labels the same mechanic at all? Until Step 2.5
closes, 236 is an upper bound and 222 is the projection if every proposal is
accepted. No runtime artefact may be built on either number.

**The 393-entry digest is deprecated.** It lost about 15% of the placements
and merged distinctions Rosewater actually drew. `tools/normalize_mechanical_pie.py`
and its outputs are retained as an audit artefact and as the record of how the
loss was found. They are not an alternate authority, and its 41-item split
queue is void — the article separates those bundles itself.

### The four adjudications

All four resolve toward the ability catalog, but the *reason* differs and the
reason is the part that matters.

| mechanic | colour | list | catalog | ruled | basis |
|---|---|---|---|---|---|
| `Flash` | B | tertiary | secondary | **secondary** | change log: black moved tertiary → secondary in 2021, so the list entry is stale 2017 data |
| `+N/+N (on spells)` | W | secondary | primary | **primary** | change log: White was primary in 2017 too, so the list contradicts both editions |
| `Exiling cards from graveyard` | W | primary | secondary | **secondary** | absent from the change log, so unchanged since 2017; list error |
| `Deal N damage to a creature with flying.` | R | secondary | tertiary | **tertiary** | absent from the change log; the catalog explains why green is the stronger anti-flying colour |

The losing claim is never deleted. Each carries `conflict`, `basis:
"adjudicated"` and the ruling's authority.

### The standing rule

> When the ability catalog and a colour summary list disagree, the catalog
> wins, because that is where the classification is discussed rather than
> merely tabulated. The contradicting claim is preserved as provenance.

Any future conflict is `UNADJUDICATED-CONFLICT` in the audit and **blocks**
the runtime build until ruled on. It is never resolved by the default.

---

## 2. Three layers, and the wall between them

    SOURCE          Rosewater's mechanic, tier, explanation, date, provenance
      |             frozen; never inherits anything from below
      v
    VOX PROJECTION  normalised ids, functional families, search terms
      |             every record labelled source_class: vox_mana_derived
      v
    PRESENTATION    counts, comparisons, deltas, expandable detail

The wall is one-directional. `Exiling cards from graveyard — B primary, W
secondary, G secondary` is Rosewater. `family: graveyard_interaction` is ours,
and must be labelled as ours wherever it appears. A reader must never have to
guess which one they are looking at.

---

## 3. What the tiers mean in presentation

Rosewater's own definitions, and they are about **frequency and ownership in
design**, not card quality:

- **Primary** — the colour the ability appears in most: highest volume, lowest
  rarity it is used at, usually the colour that pushes power level.
- **Secondary** — appears regularly but less often, not always at as low a
  rarity, and may carry restrictions.
- **Tertiary** — occasional, not every set, sometimes years apart, often
  narrow or rules-bound.

Three hard rules follow.

**No score.** Tier counts must never be summed into a "mechanical power
score", a rating, or a bar whose length implies strength. Primary is not
stronger, tertiary is not bad. A colour with 60 primary mechanics is not
better than one with 45.

**Tiers are relative to how often an effect is used at all.** Secondary flying
appears far more than primary extra-turns. Never compare tiers across
different mechanics as if they were the same unit.

**Always dated.** Every Mechanics view carries, visibly and not in a drawer:

> Mechanical Color Pie 2021 · snapshot dated October 18, 2021

Never "Current Mechanics". Rosewater states it is a snapshot that will
continue to evolve, that per-set needs bend the default, and that some entries
are experiments that may not stick.

---

## 4. Selection semantics

Mechanics is a **projection**, not another geometric relationship. When it is
on, the alliance / conflict / four-colour chord semantics are suppressed. The
five colour nodes remain; selection illuminates nodes; the panel changes.

### One colour

Rosewater's three tiers for that colour, groupable by Vox family.

### Two or more colours

**Never manufacture pair mechanics.** There is no such thing as "Orzhov
mechanics" in this dataset. Compute over the selected set instead:

| section | contains |
|---|---|
| Shared strengths | mechanics where every selected colour is primary |
| Complementary strengths | mechanics one selected colour supplies that the others do not |
| Conditional access | reachable only at secondary or tertiary, shown with the catalog's restriction |
| What changes if… | the add/remove delta, below |

### Adding or removing a colour

The delta is the most interesting view and the one that earns the layer:

- mechanics newly reachable
- mechanics whose best access improves (tertiary → primary, say)
- mechanics that remain unreachable

### Four colours

Ask what capability is **lost** because one colour is absent, computed from
the catalog. This is better grounded than deriving a philosophy for the
combination, and it replaces guesswork with arithmetic.

### Five colours

The complete coloured catalog with no colour-based access restriction — but
the per-colour ownership distinctions stay visible. Access to everything is
not the same as equal ownership of everything.

---

## 5. Explicit non-goals

- No power score, rating, or strength ranking.
- No "pair mechanics" or per-edge mechanic lists.
- No 238-row reference table dumped onto the page. Summarise, then expand.
- No Vox family presented as though Rosewater wrote it.
- No claim that this is the current state of the colour pie.
- No mechanic distinction collapsed that the article draws — in particular
  `Cast spells from your graveyard` and `Cast spells out of graveyard` stay
  separate, and the `(on creatures)` / `(on spells)` / `(on Auras)` variants
  stay separate.

---

## 6. Fixtures required before wiring

Each must be reviewed as data before any of it reaches the wheel:

1. `W` — one colour, all three tiers
2. `WB` — two colours, all four panel sections
3. `BG` — a pair whose colours share little, to test Complementary
4. `UBR` (Grixis) — three colours, and the delta language already used there
5. `WUBR` — four colours, framed as what Green's absence costs
6. `WUBRG` — five, to check the "access is not ownership" framing
7. A mechanic with a restriction — `Flying`, for red's Dragons-and-Phoenixes
8. An adjudicated mechanic — `Flash`, to check the conflict is visible
9. A mechanic with no primary colour — `Playing cards off the top of your
   library, paying their mana cost`, which Rosewater made primary in no colour
10. A tertiary-only reading — to confirm it does not read as "bad"

Fixture 9 matters: it disproves the natural assumption that every mechanic has
a primary colour. The introduction says there is always a primary; the catalog
contains an explicit exception. The data models the article, not the
introduction.

---

## 7. Order of work

1. ~~Extraction and reconciliation~~ — done, frozen.
2. ~~Adjudicate the four tier conflicts~~ — done, recorded with basis.
2.5 **Identity reconciliation — OPEN, blocking.** 14 pairs await a ruling in
   `data/mcp2021.identity_rulings.json`; the review table is
   `data/mcp2021.identity_review.md`. Until every entry is ruled, the mechanic
   count stays provisional and nothing downstream may be built.
3. Vox family taxonomy, as its own reviewable artefact. **Not started, and not
   to be started until 2.5 closes** — a taxonomy built over a mechanic list
   that is still merging would have to be redone.
4. Runtime projection build (`byMechanic`, `byColor`, `families`), generated
   only, never hand-edited.
5. The ten fixtures, reviewed as data.
6. Panel design.
7. Wire the Mechanics toggle.

Nothing past step 2.5 has started, and 2.5 is blocked on rulings.

### Step 2.5 relationship vocabulary

| value | meaning |
|---|---|
| `same-mechanic` | one mechanic, two spellings. Both labels kept as aliases. |
| `distinct` | genuinely separate. Never merged on similarity. |
| `group-header` | a heading the catalog breaks into variants. Kept as source; **must not become a peer mechanic in the runtime model.** |
| `variant-split` | the list encodes a qualifier in the label that the catalog puts in the group header. |

Candidates are generated by conservative normalisation ONLY — unicode and
invisible characters, terminal punctuation, grammatical number, trivial
morphology. Semantic similarity is never grounds for a merge, automatic or
proposed. Unicode and punctuation artefacts merge automatically because they
are typesetting, not meaning; anything that changes a word waits for a ruling.

**Hard audit condition:** no obvious same-mechanic pair may remain split
merely because its wording differs. Any `UNRULED` entry blocks the build.

---

## 8. Lesson worth keeping

The article's HTML is semantically richer than its paragraph hierarchy
suggests. Three parser defects, each producing plausible wrong data rather
than an error:

- tier lines matched inside explanation prose, so *"This ability was primary
  in both black and green"* parsed as an assignment;
- sub-abilities live in `<li>` **between** paragraphs, so a paragraph-only
  scan filed all 19 creature-pumping variants under one group header;
- stripping every parenthetical collided `(on creatures)` with `(on spells)`
  and `(on Auras)`.

The first run reported 8 conflicts. Five were mine. **A future extractor must
account for intervening `<li>` labels and must not infer mechanic identity by
stripping qualifiers.**
