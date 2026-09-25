# Mechanics Visualization — Architecture Reset

**Status:** research only. No prototype implementation started.
**Baseline:** rejected prototype experiment `13b81f7`; trusted data baseline `624b391`.
**Controlling evidence:** `manual_Testing.docx` (Owner manual test — 4 written findings, 5 screenshots).
**Gates at time of writing:** source ✓ · taxonomy ✓ · 11/11 fixtures ✓ · 53 recon assertions ✓ · Fixture 10 pinned to `counterspell` (White tertiary / Blue primary).

The frozen source layer, taxonomy, runtime, fixtures and recon are **not reopened** by this document.
Nothing here proposes changing a single mechanic, tier, family or count.

---

## 1. Owner test evidence

Four findings, transcribed from the attachment. Quoted rather than summarised, because the wording
carries the verdict.

### 1.1 Constellation — screenshots 1, 2, 3

> "Constellation: Families Reachable is very small, you click then it expands and you cant see
> and then you can click again and you get a popup."

> "Search has the same content on the same page: Can click, can interact but its awkward,
> not readable, not clear, not interesting or fun to use."

What the screenshots show, independent of the text:

- **Screenshot 1** — the constellation field occupies roughly `x 995..1487` of a 1645px viewport and
  `y 203..718` of 977px: about **30% of width × 53% of height ≈ 16% of the viewport**. Inside that 16%
  it is drawing "23 families · 12 mechanics · 12 edges". The entire left column — about **59% of the
  viewport width** — contains five colour glyphs of ~24px radius and otherwise nothing. The Mechanical
  Color Pie panel has been pushed to `y≈780`, below the fold.
- **Screenshot 2** — opening a mechanic drops an opaque drawer over the field. The field the user was
  reading is **covered by the thing they opened from it**. The family heading `EVASION` is visible at
  the left edge while the drawer simultaneously prints `Family. evasion`.
- **Screenshot 3** — the Owner drew **two red boxes**, one around the drawer and one around the search
  panel, and both contain the identical block: `PRIMARY` / `Blue` / *"We tried to keyword this ability
  only to discover that there are so many variations on it that we couldn't…"*. The same record is
  rendered twice, simultaneously, in two places on one page.

### 1.2 Radial — screenshot 4

> "Radial: It just keeps the family reachable block and puts the radial out of the center blocking
> all the other colors. Clicking any one of those circles on the end of the radial takes me to the
> alliances starting point, nothing comes up. Its broken and not interesting or fun to use or
> educating me at all."

What the screenshot shows:

- 22 spokes converge on and **obliterate the wheel centre**.
- Family labels collide with colour labels: `card type affinity` overprints **WHITE / PEACE**,
  `evasion` overprints **BLACK / POWER**, `protection` overprints **RED / FREEDOM**.
- The right panel reads `22 families · 0 mechanics · 22 edges drawn` while its body says
  **"Select one or more colors on the wheel"** — the zero state — even though Blue is lit on the wheel.
- The Owner red-boxed the phrase **"FAMILIES REACHABLE"**: the *same* block Constellation used. Radial
  changed the geometry and kept the container.

### 1.3 Split — screenshot 5

> "Split: All split does is open some popup for searching it seems, I can click one some of the
> families reached but none of this feels split to me so not sure what its doing. It's not intuitive,
> interesting or meaningful."

What the screenshot shows:

- The panel is a rounded, floating, shadowed card in the top-right of a dark void, **with a search field
  as its first control**. That is the visual grammar of a popup, so it is read as a popup.
- The left ~63% of the viewport holds five glyphs and no pentagon. There is no visible "split" because
  there is no second thing — there is a panel and an emptiness.
- The numbers the whole story exists to deliver — `154 / 44 / 2 / 42 / 110 / 62` — are present and
  correct, rendered as six small boxes inside the narrow column.

### 1.4 The finding under all four

The Owner used **"not interesting"** or **"not fun"** about all three, and **"not educating me at all"**
about Radial. Every prototype was mechanically correct — the previous story's data verification passed on
every required value — and every prototype failed. **Correctness was never the problem.**

---

## 2. Failure analysis

Separated deliberately, because an architectural failure must not be answered with CSS.

### 2.1 Implementation defects (real bugs, cheap to fix, **not** the reason for rejection)

**D1 — Radial family clicks reset the app. CONFIRMED, root cause located.**

`vox-color/color-wheel.html:2303`:

```js
wheel.addEventListener('click', e => {
  const g = e.target.closest('.vertex,.edge,.cross,.center-mark');
  if (g) activate(g); else clearSelection();
});
```

`renderRadial` appends `#g-mech-radial` **inside the wheel `<svg>`**. A radial family node carries none of
those four classes, so every click on one falls to the `else` branch and calls `clearSelection()`. The
delegated prototype handler at `:3121` also fires and sets `mech.fam`, but the wheel's destructive branch
has already wiped the selection and re-rendered the zero state. Two handlers, one destructive, and the
destructive one owns the visible outcome. This is exactly *"takes me to the alliances starting point,
nothing comes up."*

It also explains the contradiction in screenshot 4: the panel shows the true post-`clearSelection` zero
state while the radial `<g>` still holds geometry drawn before the reset.

**D2 — Detail is rendered twice.** `renderProto` writes `protoDetailHTML(mech.pick, cols)` into the drawer,
then calls `renderMechanics()`, which writes the same record into the panel's search results. Two surfaces,
one owner-less concept. This is screenshot 3.

**D3 — Radial's viewBox widening shrinks the wheel** rather than giving the visualization more room, and
the ring radius puts family labels on top of the colour labels.

### 2.2 Presentation / UX defects

- **U1** — field text renders at 9.5–10.5px inside a panel only ~490px wide.
- **U2** — the drawer is opaque and covers its own origin, destroying context on every open.
- **U3** — `FAMILIES REACHABLE` is the identical container in all three, so switching prototype does not
  feel like switching architecture.
- **U4** — Split's card-plus-search-field-first composition reads as a modal.
- **U5** — hero and mode bars consume the top ~330px, pushing content below the fold at 1080p.

### 2.3 Architectural defects (the actual reason for rejection)

**A1 — The canvas allocation is inverted.** Measured from the screenshots: the wheel column holds ~59–63%
of viewport width and contains five discs of radius ~24px — roughly **1% ink over ~880,000 px²**. The
visualization carrying 216 mechanics, 23 families and 467 assignments received ~16% of the viewport.
*"Families Reachable is very small"* is not a font-size bug; it is the arithmetic consequence of the
layout. All three prototypes accepted the wheel's footprint as fixed and built into what was left over.
**§4's hypothesis is confirmed by measurement, not merely plausible.**

**A2 — The representation family is wrong for this payload.** See §3.2: mechanic labels are prose, median
33 characters. No dot-with-a-label layout can carry them. This disqualifies Constellation and Radial
*categorically*, before any styling decision.

**A3 — Node-link was chosen for a dataset with no path-finding task.** Ghoniem & Fekete (§4.1) found
node-link loses to matrix on essentially every task above ~20 nodes, with **path-finding the single
exception**. Not one of the six Owner tasks is a path-finding task — nobody wants to trace a route from
`flying` to `counterspell`. The prototypes paid node-link's full cost and bought the one benefit this
project has no use for.

**A4 — Absence cannot be drawn in a graph.** The four-colour question is *"what changes when Green is
absent?"* — 10 lost, 18 degraded, 55 owner-lost. In a node-link field a lost mechanic has no node, so it is
drawn nowhere and its loss is invisible. Absence needs a representation with a **fixed slot that can go dark**.

**A5 — Nothing holds still.** Constellation re-runs its phyllotaxis on every selection change, so positions
carry no learnable meaning; a family located once is elsewhere after adding a colour. Repeated interaction
never compounds into familiarity.

**A6 — There is no overview.** Shneiderman's mantra is *overview first*. All three prototypes open on a zero
state or an undifferentiated field of 23 identical bubbles. Nothing is learned in the first ten seconds, so
there is no reason to click a second time.

---

## 3. Data shape (visualization-relevant characteristics only)

All figures recomputed from the frozen runtime; none are new claims.

### 3.1 Structure

| property | value |
|---|---|
| mechanics | 216 |
| colour assignments | 467 (primary 251 · secondary 139 · tertiary 77) |
| families | 23 |
| canonical memberships | 216 |
| secondary-family cross-links | 36 |
| family→mechanic relationships | 252 |
| nonempty WUBRG selections | 31 |
| mechanics carrying a restriction | 105 of 216 |

Family sizes: `34, 22, 16, 15, 14, 13, 12, 11, 10, 8, 8, 7, 7, 7, 6, 5, 4, 4, 3, 3, 3, 3, 1`.
Five families have ≤3 members; nine have ≥10. The largest is **34× the smallest** — which rules out any
encoding mapping family size to radius or area without bounding it.

Colours per mechanic: 1→81, 2→75, 3→30, 4→4, 5→26. **81 of 216 are mono-colour**; 26 are in all five.

### 3.2 The decisive constraint — the labels are prose

| | |
|---|---|
| shortest label | 4 chars (`Scry`) |
| **median label** | **33 chars** |
| 90th percentile | 99 chars |
| longest | 199 chars |
| labels over 40 chars | **100 of 216** |
| **single-word labels** | **18 of 216** |
| labels of 6+ words | **101 of 216** |

Representative median entries: *"Stealing permanents, permanently"*, *"Increasing counters and/or tokens"*.
A longest entry: *"Damage redirection (Prevent the next N damage that would be dealt to target creature/player this turn…)"*.

**This is the single most important fact in this document.** The dataset is not a network of keywords with
metadata attached; it is a **corpus of prose statements** with colour, tier and family metadata attached.
Text is the payload. Any architecture whose primary act is placing a name beside a dot has already lost —
at any font size, on any canvas. It disqualifies force-directed graphs, radial dendrograms, chord diagrams,
hierarchical edge bundling and in-circle circle packing **arithmetically**, and it is the true root of
*"you click then it expands and you cant see."*

### 3.3 The task shape

Every one of the six Owner tasks is **set arithmetic over 5 sets plus one ordinal (tier)**: membership
(mono), intersection and difference (pair), union (trio), complement (four-colour absence), and delta
between two selections (transition). There is **no topological task** — no path, no centrality, no shortest
route, no community structure the player cares about.

### 3.4 Already-built data assets

`data/recon/matrices.json` already contains, frozen and gated:

- `family_by_color` — the 23 × 5 matrix, with primary/secondary/tertiary split per cell
- `family_by_selection` — the **23 × 31 matrix**, every family against every legal selection
- `pair_any_access_overlap` and `pair_shared_primary_overlap` — the 5 × 5 pair grids
- `color_breadth_distribution`

plus `four-color-absence.csv`, `marginal-additions.csv`, `pair-overlap.csv`, `family-statistics.csv`.

**A matrix-first architecture requires no new data work whatsoever.** It is a direct render of an artifact
that already exists and is already gated.

### 3.5 What the overview object actually looks like

Rendered from `matrices.json`, families ordered by total reach. Cell = mechanics reachable in that colour;
`.` = the colour cannot reach that family at all.

```
family                       W     U     B     R     G   size
stat modification           17    13    17    12    15    34
graveyard                    9     7     7     6     7    16
combat                       7     4     7    12     6    15
removal                     12     1    10     5     5    22
evasion                      3     4     4    11     8    14
protection                   9     6     4     5     6    12
card flow                    4     8     4     6     7    11
tempo                        7    12     1     4     3    13
card type affinity           8     5     2     5     3    10
mana                         1     4     4     3     6     7
sacrifice                    1     1     6     7     2     8
tutoring                     5     4     3     3     2     7
characteristic change        3     7     2     1     3     7
life                         4     1     6     1     2     6
counters                     2     3     3     2     3     5
disruption                   .     2     6     3     .     8
cheat into play              4     3     1     1     2     4
control                      2     3     1     .     1     4
rules alteration             3     1     1     1     1     3
copying                      .     3     .     2     .     3
tokens                       1     1     1     1     1     1
win condition                2     .     2     .     .     3
theft                        .     1     2     1     .     3
```

The entire system fits in 24 lines of plain text and is legible at rest — in a space smaller than the
empty void currently sitting to the left of the rejected panel. It also **teaches immediately**: removal is
White 12 / Blue 1; tempo is Blue 12 / Black 1; evasion is Red 11 / White 3; disruption excludes White and
Green entirely; copying belongs to Blue and Red alone. None of these facts were discoverable in any of the
three prototypes.

And the absence question answers itself in the same object — `WUBRG → WUBR`, the five rows that darken:

```
stat modification  34 -> 31   (-3)
removal            22 -> 21   (-1)
graveyard          16 -> 14   (-2)
evasion            14 -> 12   (-2)
mana                7 ->  5   (-2)
```

---

## 4. External visualization research

Format: source → pattern → useful finding → relevance here → limitation.

### 4.1 Ghoniem, Fekete & Castagliola — node-link vs matrix (InfoVis 2004 / *Information Visualization* 4(2), 2005)

- **Pattern:** controlled comparison of node-link and matrix representations across seven generic graph tasks.
- **Finding:** *"When graphs are bigger than twenty vertices, the matrix-based visualization outperforms
  node-link diagrams on most tasks."* Density hurts node-link badly even at ~20 nodes. **Path-finding is the
  single task consistently favouring node-link.** Matrices do not suffer edge crossing.
- **Relevance:** 216 mechanics and 23 families are both far past the threshold, and this project has zero
  path-finding tasks. Strongest single argument against the rejected prototypes and for a matrix-primary
  overview.
- **Limitation:** measures analytic task performance, not enjoyment. It tells us what will be *readable*, not
  what will be *fun*. That gap is why the shortlist is not simply "a table."
- https://journals.sagepub.com/doi/10.1057/palgrave.ivs.9500092

### 4.2 Lex, Gehlenborg et al. — UpSet (IEEE VIS 2014)

- **Pattern:** set-intersection visualization via a set × intersection matrix with an aligned bar chart.
- **Finding:** Venn/Euler diagrams break down past 3–4 sets due to combinatorial explosion. UpSet *"converts
  the hard perceptual task of comparing areas… into the easy task of comparing bar lengths"* and **"works
  best for set data with more than three and less than about 30 sets."**
- **Relevance:** direct hit. We have exactly **5 sets and 31 nonempty intersections** — the middle of UpSet's
  stated sweet spot. The WB question (44 shared / 110 complementary / 62 unavailable) is literally a
  set-intersection readout, and it cleanly separates `shared_primary` (2) from `shared_mixed` (42) as two
  rows rather than two nested regions.
- **Limitation:** an analyst's instrument. Presented raw it is austere and will not read as playful; it needs
  the project's typographic language, and it is a *panel*, not a navigator.
- https://jku-vds-lab.at/publications/2014_infovis_upset/ · https://upset.app/

### 4.3 Shneiderman's Visual Information-Seeking Mantra / NN/g progressive disclosure

- **Pattern:** *overview first, zoom and filter, then details-on-demand.* Nielsen's progressive disclosure
  (1995) is one method of fulfilling it.
- **Finding:** progressive disclosure *"is not hiding things — it is sequencing information and controls so
  that the initial view communicates what matters most."*
- **Relevance:** the prototypes implemented the *hiding* and skipped the *overview*. Constellation opens on 23
  undifferentiated bubbles and 0 mechanics; Radial opens on a zero state. Neither initial view communicates
  what matters most, so the disclosure sequence never starts.
- **Limitation:** prescribes an order, not a chart. Constrains the shortlist without choosing within it.
- https://www.nngroup.com/videos/progressive-disclosure/ · https://en.wikipedia.org/wiki/Progressive_disclosure

### 4.4 Furnas fisheye / focus+context / semantic zoom

- **Pattern:** Degree-of-Interest functions plus visual emphasis; *"semantic zooming can dynamically alter the
  layout or the very encoding of the focused parts of a visualization"* — as opposed to geometric scaling.
- **Finding:** focus+context keeps surrounding structure visible while detailing one region, but distortion
  techniques *"introduce new issues of… user disorientation from excessive distortion."*
- **Relevance:** the correct replacement for the opaque drawer. Opening a family should **change what a region
  encodes, in place** — not cover the field. Semantic zoom is also the only honest way to move between "23
  family names" and "216 prose statements": the encoding must change, because the payload changes kind.
- **Limitation:** distortion risks disorientation. Prefer **expand-in-place with stable neighbours** over
  fisheye magnification.
- https://www.cs.tufts.edu/~jacob/papers/afram.hfes.pdf

### 4.5 Data-to-Viz — network diagrams

- **Finding:** *"when too many connections and no obivious pattern is represented, the figure get cluttered
  and unreadable"* (the hairball). Recommends Sankey, chord, arc diagrams and edge bundling as alternatives.
- **Relevance:** confirms the failure class at 719 edges. Notably it offers **no node-count threshold and no
  label-readability strategy** — precisely the gap this project fell into.
- **Limitation:** general guidance; does not address prose-length labels at all.
- https://www.data-to-viz.com/graph/network.html

### 4.6 Data-to-Viz — chord diagrams

- **Finding:** group order around the circle matters and arc crossings must be minimised; *"Mind
  over-cluttering that makes the figure unreadable. It is advised to dismiss weak connections."* And
  critically, chord diagrams *"are not straightforward to understand at all."*
- **Relevance:** this project is thematically tempted by chords because it already owns a wheel. That
  temptation is the trap. Chords would require dismissing weak connections — **deleting true data for
  legibility** — which conflicts with the frozen-source discipline.
- **Limitation:** the 5 × 5 colour-pair overlap grid is small enough that a chord *could* work there
  specifically; the objection is to chords as the primary navigator.
- https://www.data-to-viz.com/graph/chord.html

### 4.7 Sankey / alluvial for state transition

- **Pattern:** stacked state at each step, ribbons whose thickness is the transition count.
- **Finding:** *"it is possible to simultaneously represent the flow rate and a state of transition between
  steps."* Caveat: *"if a low number of members experience the change, then the transition arc will be very
  narrow and more difficult to visualize."* And *"an explanation is often required for users to fully grasp
  the benefits of Sankey diagrams."*
- **Relevance:** matches the transition tasks exactly (WB→WBG: 24 / 17 / 42 / 95 / 38). But the caveat bites:
  WUBR's **10 completely-lost** would render as a hairline against 133 unaffected — the most important number
  would be the least visible. Mitigation: fixed-height labelled bands with counts, not proportional ribbons.
- **Limitation:** needs explaining; not a navigator; poor for small-but-important quantities.
- https://datavizcatalogue.com/blog/sankey-diagrams-parallel-sets-alluvial-diagrams-whats-the-difference/

### 4.8 Vendor tooling surveys (Cambridge Intelligence, Neo4j)

- **Finding:** the recurring recommendation for medium graphs is not a better layout but a different
  workflow — **start from a query or a node, expand the neighbourhood, never render the whole graph.**
- **Relevance:** supports search-first / focus-first navigation over field-first.
- **Limitation:** vendor material; treat as practice, not evidence.
- https://cambridge-intelligence.com/blog/open-source-data-visualization/ · https://neo4j.com/blog/graph-visualization/neo4j-graph-visualization-tools/

---

## 5. Practitioner findings (community experience — evidence, not design authority)

Kept separate from §4 on purpose.

### 5.1 Obsidian graph view — the most transferable community finding

Users report that as a vault grows the global graph *"becomes more challenging to navigate"*, that they
*"got out of the habit of looking at"* it, and — bluntly — that the global graph may be *"just a way to brag
about the amount of information put into the system"*. The consistently reported rescue is the **local
graph**: the depth-1/depth-2 neighbourhood of the current note, which users describe as feeling *"almost
magical"* by comparison.

**Relevance:** this is the Constellation failure, observed at scale in a shipped product. The global field of
23 bubbles is the thing users abandon; the neighbourhood of one focused thing is the thing they use.
*Sources:* https://pjordan.substack.com/p/a-pkm-revelation-obsidian-local-graphs · https://knowledgeaccumulation.substack.com/p/mastering-obsidians-graph-feature

### 5.2 The hairball critique

Practitioner writing converges on a point sharper than the textbook version: *"Even if you see apparent
modular structure in such visualizations, it does not mean they are statistically meaningful"*, and network
visualization *"should be the result of a well defined analytical procedure informed by research questions"*
rather than the starting point. Network graphs are described as *"visually interesting, yet difficult to
ascertain any concrete information."*

**Relevance:** names the exact gap between the previous story's passing data verification and the Owner's
rejection. Constellation's spatial arrangement was phyllotaxis over a sort order — it *looked* structured and
meant nothing. *"Not educating me at all"* is the correct read of a layout carrying no information.
*Sources:* https://skewed.de/lab/posts/hairball/ · https://library.indianapolis.iu.edu/node/504

### 5.3 D3 practitioner consensus for 100–300 nodes

Recurring advice: neighbourhood-status recolouring on select; collapsible leaf nodes so users can *"clear the
way out and focus on the parts of the graph that really matter"*; and rendering only nodes within *x* hops.
Nobody experienced recommends rendering all 200+ at once.

**Relevance:** if any graph survives into the shortlist it must be a **local** graph, never a global one.
*Sources:* https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811 · https://github.com/athensresearch/athens/discussions/605

### 5.4 Owner-supplied interaction references (FreeFrontend)

All four links were reviewed. WebFetch was refused (HTTP 403); the gallery was read in-browser instead and
the demos confirmed by name: **Interactive Touch Hover Grid on GSAP**, **3D Tilt Card with Dynamic Glow**,
**Direction Aware 3D Cube Gallery**, and (page 3, per the Owner's URL) **3D CSS Grid Inverse UV Projection**.
Adjacent items of interest: *GSAP Magic Hover Areas*, *Interactive Glowing Grid Cards*, *Tilt Grid Content
Reveal*, *Expanding Split-Screen Grid Navigation*.

The page's own FAQ raises the three cautions that matter here, worth recording because they come from the
Owner's own reference: how to *"prevent hover effects from triggering ghost clicks or broken taps on mobile
touchscreens"*, how to *"ensure accessible keyboard navigation mirrors hover state rewards"*, and why
*"multiple complex hover cards in a grid cause scroll lag."*

**Relevance:** these are a **polish layer over a chosen architecture** — and every one of them is a *grid*
effect. That is quietly significant: the interaction vocabulary the Owner is drawn to is grid-native, which
composes naturally with a matrix-primary architecture and poorly with a scattered node field.
*Source:* https://freefrontend.com/javascript-hover-effects/

---

## 6. Interaction pattern library

| pattern | problem it solves | where it fits Mechanics | risk it introduces |
|---|---|---|---|
| **Stable layout** | positions become learnable; repeat visits compound | family rows/cells never move when the selection changes — only their *state* changes | forfeits optimal packing; some cells always empty |
| **Overview first** | earns the first 10 seconds (§4.3) | the whole 23 × 5 board visible before any click | demands an overview object genuinely readable at rest |
| **Semantic zoom** | family name → 34 prose statements is a change of *kind*, not scale (§4.4) | opening a family re-encodes that region in place | two encodings to design and keep coherent |
| **Expand in place** | replaces the drawer that covered its own origin (U2) | family band grows, neighbours push down, context retained | reflow; scroll position must be anchored |
| **Neighbourhood isolation** | §5.1, §5.3 — local beats global | show one family plus its cross-linked families, never all 23 at once | can hide the system if it is the *only* view |
| **Dim, don't remove** | absence needs a slot that can go dark (A4) | unavailable cells stay in place, unlit | requires fixed slots — i.e. a matrix or a fixed map |
| **Details on demand, single owner** | fixes D2 duplication | exactly **one** reading surface; search, click and keyboard all target it | it must always be visible, or always in the same place |
| **Search → focus** | 216 prose items are searchable but not browsable | typing filters *and* moves focus within the overview | search results must not become a parallel UI — this is what broke Split |
| **Before/after comparison** | the transition tasks (§4.7) | an explicit two-state mode, not an inline number | a fourth mode to learn |
| **Breadcrumb / easy return** | drill-down without disorientation | colour → family → mechanic path always visible and clickable | costs vertical space |
| **Pinning** | compare two families without losing one | pin a band open while opening another | state complexity |
| **Proximity / hover field** | §5.4 — makes a dense grid feel alive | neighbouring cells wake as the pointer approaches | ghost clicks on touch; keyboard parity; scroll lag — all three flagged by the Owner's own source |
| **Reduced-motion skip** | project standard | all of the above degrade to instant state changes | none |

---

## 7. Visualization candidate matrix

Scoring: ●●● strong · ●● adequate · ● weak · ✗ disqualified.

| candidate | fit for data | discovery | comparison | add/remove | 4-colour absence | readability @216 | impl. difficulty | primary failure risk | prototype-worthy |
|---|---|---|---|---|---|---|---|---|---|
| **Force / knowledge graph** | ● | ●● | ● | ● | ✗ | ✗ | high | hairball + prose labels unplaceable; absence undrawable | **no** |
| **Hierarchical edge bundling** | ● | ● | ● | ● | ✗ | ✗ | high | 216 radial prose labels is arithmetically impossible | **no** |
| **Radial hierarchy / dendrogram** | ●● | ●● | ● | ● | ● | ✗ | med | same label wall; 34-member family breaks its arc | **no** |
| **Circle packing** | ●● | ●● | ● | ●● | ● | ● | med | *is* the family-bubble field the Owner rejected (§10 of brief); 1:34 size ratio | low |
| **Voronoi / territory map** | ●● | ●●● | ●● | ●● | ●●● | ●● | high | geography implies semantic distance the data lacks | **yes** |
| **Matrix / heat grid** | ●●● | ●● | ●●● | ●●● | ●●● | ●●● | **low** | reads as a spreadsheet; must be dressed to feel like a game object | **yes** |
| **UpSet / set-intersection** | ●●● | ● | ●●● | ●●● | ●●● | ●●● | low | austere; a panel, not a navigator | **yes (as a mode)** |
| **Sankey / alluvial** | ●● | ● | ●●● | ●●● | ●● | ●● | med | the 10-lost band becomes a hairline (§4.7) | **yes (as a mode)** |
| **Chord** | ●● | ●● | ●● | ● | ● | ● | med | thematically seductive; "not straightforward to understand at all" | no |
| **Small multiples** | ●●● | ●● | ●●● | ●● | ●● | ●●● | low | 31 panels is a lot; works as a *strip*, not a wall | **yes (component)** |
| **Typographic catalogue + semantic zoom** | ●●● | ●● | ●● | ●● | ●● | ●●● | low | risks becoming the "long scrolling text box" already rejected | **yes** |
| **Hybrid (layered)** | ●●● | ●●● | ●●● | ●●● | ●●● | ●●● | med-high | scope; four registers to keep coherent | **yes** |

Two rows deserve reasoning rather than scores:

- **Hierarchical edge bundling** is genuinely well matched to our *structure* — colour → family → mechanic is
  a real 3-level hierarchy and 36 cross-links is a modest bundle. It fails only on labels, and it fails
  absolutely: an outer ring of 216 leaves at a 33-character median needs roughly **7,000 characters of radial
  text around one circle**. Rejected on arithmetic, not taste.
- **Circle packing** is the strongest of the rejected forms and could return later as a *within-family* detail
  encoding — but proposing it now as the primary view would be re-serving the family-bubble field under a new
  name, which the brief forbids.

---

## 8. Technology matrix

| stack | fit @216 | labels | pan/zoom | a11y | perf | complexity | fits current codebase |
|---|---|---|---|---|---|---|---|
| **HTML/CSS Grid + vanilla JS** | excellent for matrix, UpSet, small multiples, catalogue | **native text layout, wrapping, selection, find-in-page** | native scroll | best of all options | excellent | **lowest** | **yes** |
| **SVG + vanilla JS** (current) | good for grid/map/marks; poor for physics | full control; needs HTML overlay for prose | manual viewBox | native `role`/`tabindex`, already proven | proven — 40 re-renders in 77ms | low | **yes — zero new dependencies** |
| SVG + D3 | strong; layouts and transitions for free | still manual | `d3-zoom` | must be hand-added | good | medium | violates no-build/no-npm unless vendored as one file |
| Canvas | needed only beyond ~2k nodes | hand-drawn; no selectable text | manual | **poor — no DOM, needs a parallel a11y tree** | best raw | high | poor fit |
| Cytoscape.js | graph-specialised | poor for prose | built in | weak | good | high | rejects itself along with the graph forms |
| Sigma.js | WebGL, 10k+ nodes | poor | built in | weak | excellent | high | over-engineered for 216 |
| GSAP | animation only | n/a | n/a | n/a | excellent | low | viable as a CDN polish layer |
| CSS transforms | the Owner's four references are all CSS/JS transform effects | n/a | n/a | fine | excellent | low | **yes** |

**Conclusion:** every shortlisted architecture is implementable in **HTML/CSS Grid + SVG + vanilla JS** — no
build step, no framework, no npm, which is the settled architecture. D3 buys layouts we no longer want. The
one honest exception is the Territory Map, whose region generation would benefit from a Voronoi routine —
about 60 lines of vendored code, or avoidable entirely by authoring the regions once by hand and freezing
them, which would also make the layout stable by construction.

---

## 9. Recommended shortlist

Four architectures, ordered by my confidence. Full specs in §10.

1. **The Ownership Board** — matrix-primary. Highest confidence, lowest risk, lowest cost; strongest on
   absence and comparison. Weakest on delight; needs dressing.
2. **The Mana Atlas** — territory-primary. Highest ceiling on discovery and enjoyment. Highest risk (implied
   distance) and highest cost.
3. **The Codex** — typographic catalogue with semantic zoom. The only architecture that treats prose as the
   payload rather than the problem. Risk: the already-rejected "long scrolling text box."
4. **Layered Atlas (hybrid)** — Board as overview, Atlas as explorer, Codex as reader, plus an explicit
   Compare mode. Highest ceiling overall; largest scope.

**Compare mode ("Two Hands")** is deliberately *not* a fifth peer architecture. It is a **mode** any of the
four should host, specified in §10.5.

---

## 10. Architecture proposals

### 10.1 The Ownership Board

**First frame — Mechanics + White.** The wheel contracts to a 5-glyph control cluster docked top-left
(~140px tall), White lit. The canvas becomes a **23-row × 5-column board**, families down the left, WUBRG
across the top, filling roughly 80% of the viewport. Every cell is present for every selection. White's
column is illuminated; the other four remain legible but unlit. Each cell carries a count and a categorical
tier mark. Three rows — `disruption`, `copying`, `theft` — are visibly dark in White's column.

**What is learned in 10 seconds:** the whole system, at once. That White reaches 20 of 23 families and is
locked out of exactly three. That `removal` is White **12** and Blue **1**. That `tempo` is Blue **12** and
Black **1**. That `evasion` is Red **11** and White **3**. Every row is a small revelation, visible without a
single click.

**Why click a second thing:** because a cell contradicts an expectation. Blue holding 1 of 22 removals is
exactly the kind of fact that makes a player click to see *which one*.

**Interaction path:** `White` → cell (`White × removal`) → its 12 mechanics open in the reading rail → one
mechanic → full record. A row header opens a family across all colours; a column header opens a whole colour.

**WB behaviour:** selecting Black lights a second column and inserts a derived **BOTH** column between them.
That column is the set-intersection readout: `44` shared, decomposed as `2` shared-primary and `42`
mixed-tier, with `110` complementary and `62` unavailable in a board-level footer band — the UpSet reading of
§4.2, rendered as bar lengths rather than areas. Crucially, the *rows* show where the sharing lives: a player
sees `stat modification` at 28 of 34 under WB, while `disruption` contributes 6 from Black and 0 from White.

**WUBR behaviour:** Green's column **dims but does not disappear**, and 10 cells across five known rows go
fully dark — `stat modification` −3, `graveyard` −2, `evasion` −2, `mana` −2, `removal` −1. Because the board
never moves, the player watches absence appear *in a place they already learned*. The 18 degraded and 55
owner-lost render as changed tier marks in cells that stay lit. **This is the single behaviour no node-link
architecture can produce.**

**Add-colour (WB → WBG):** the Green column illuminates; 24 cells light for the first time, 17 change tier
mark, 42 gain an owner without changing tier, 95 do not change. Four categories, four distinct cell
transitions, all in stable positions.

**Search `counterspell`:** the reading rail filters, **and the board highlights the one cell containing it**
(`control × Blue`, with `White × control` marked tertiary). Search moves focus inside the existing view rather
than opening a parallel surface — the precise fix for the Split failure.

**Cross-links (36):** a cell belonging to a secondary family takes a small corner mark; focusing a family row
draws thin connectors to its cross-linked rows *within the board*. No duplication — the mechanic is counted
once, in its canonical row, and the mark is an annotation.

**Why it is more interesting than the rejected prototypes:** it replaces "here are 23 identical bubbles, click
one" with "here is the whole colour pie as one readable object, already telling you things." The loop is
*notice an asymmetry → open it → find the mechanic that explains it → change the selection and watch the board
respond.*

**Biggest risk:** it reads as a spreadsheet. Mitigation is entirely typographic and material — the project
already owns a strong type stack and the ownership-strip primitive. The board must be built as a **plate**,
not a table.

**Likely implementation:** CSS Grid + SVG cell marks + vanilla JS, rendering `data/recon/matrices.json`
directly. No new data, no new dependency.

---

### 10.2 The Mana Atlas

**First frame — Mechanics + White.** The wheel docks as a compact controller. The canvas is a **stable map of
23 territories**, laid out once and frozen, sized by family membership, bordered hairline. With White selected
the map **floods**: reachable territory takes light, the three unreachable territories go near-black. Labels
sit inside large regions and on leader lines for small ones.

**10 seconds:** "White's reach covers most of the known world, and there are three dark countries." Scale is
felt rather than read — `stat modification` is visibly the largest territory on the map.

**Why click a second thing:** dark territory is an invitation. So is a large territory only half-lit.

**Interaction path:** `White` → territory → semantic zoom into it, where its mechanics appear as readable prose
cards inside the region's bounds → one card → the reading rail.

**WB:** two-colour flood. Shared territory takes a blended treatment; White-only and Black-only take single
treatments; the `44 / 110 / 62` split is read as **area of the map**, with exact counts in a fixed legend. This
is the one architecture where "what we share" has a genuine visual shape.

**WUBR:** Green leaves and the map **loses light in five specific places**, permanently visible as darkened
sub-regions. Absence becomes territorial — the most intuitive framing of the four-colour question.

**WB → WBG:** the map floods further; newly-lit area is the 24 newly reachable, with the 17 tier improvements
marked distinctly from the 42 new-owner-only changes.

**Search `counterspell`:** the map pans and zooms to the `control` territory; the matching card lifts.

**Cross-links:** territories sharing a secondary link are drawn **adjacent**, so the 36 cross-links become
borders rather than lines. This converts the map's greatest weakness into a strength — adjacency stops being
arbitrary and starts encoding something true.

**Why it is more interesting:** the only proposal offering *exploration* rather than *reading*. It suits the
subject — the colour pie as territory that colours contest — and it is the natural home for the Owner's
proximity and glow references.

**Biggest risk:** implied semantic distance. Two territories placed near each other will be read as related
whether or not they are. Cross-link-driven adjacency mitigates but cannot fully remove this, and some
adjacencies will remain arbitrary. The design must be honest about that, or it repeats Constellation's sin of
meaningless position with better graphics.

**Likely implementation:** hand-authored frozen region geometry (or a small vendored Voronoi over fixed seeds),
SVG paths + CSS transforms, vanilla JS. Highest build cost of the four.

---

### 10.3 The Codex

**First frame.** The wheel docks. The canvas becomes **23 horizontal bands**, one per family, ordered by size.
Each band shows the family name at display size, its count under the current selection (`20 of 22`), and a
five-cell ownership signature. Bands the selection cannot reach are struck through and moved to the bottom
under a **"Beyond White"** heading. Nothing is hidden; nothing has been clicked.

**10 seconds:** an ordered, legible inventory — what White does, how much of each, and what is out of reach.

**Why click a second thing:** to read the actual mechanics, which are prose and genuinely worth reading. This
is the only architecture that treats the 199-character entries as content rather than as labels that will not
fit.

**Interaction path:** `White` → band expands in place (neighbours move down, nothing is covered) → mechanics as
readable lines with ownership strips → one line expands to the full record inline. **No drawer, no popup, no
second surface** — the D2 and U2 fixes become structural rather than remembered.

**WB:** each band splits into a three-part ribbon — White-only, both, Black-only — with the `44 / 2 / 42`
decomposition in a fixed header band.

**WUBR:** lost mechanics remain in their band, struck through and dimmed, with a marginal note naming the
colour that carried them. Absence reads as text gone quiet.

**Search `counterspell`:** bands filter to matches, the matching line expands, and the band it belongs to is
named. Search is the same surface, filtered.

**Cross-links:** a mechanic in a secondary family shows a small "also:" reference that scrolls to the other
family. Listed once, referenced anywhere.

**Why it is more interesting:** the Mechanical Color Pie is, in its source, an *essay*. Rosewater's
explanations are the most interesting content in the dataset, and all three prototypes reduced them to tooltip
filler.

**Biggest risk:** the Owner has already rejected *"a long scrolling text box."* This must be a designed plate
with strong banding, restraint and typographic hierarchy, or it becomes exactly that. Lowest-risk to build;
highest-risk to be found boring.

**Likely implementation:** HTML/CSS Grid + vanilla JS. Trivially accessible; native text selection and
find-in-page work for free.

---

### 10.4 Layered Atlas (hybrid)

**Composition:** one canvas, four registers, one detail owner.

- **Board** (10.1) — the always-available overview and default first frame.
- **Atlas** (10.2) — the exploration register, entered by zooming a row or region.
- **Codex** (10.3) — the reading register, entered from any cell, territory or search hit.
- **Compare** (10.5) — the transition register.
- **Reading rail** — a persistent right-hand rail that is the **single owner of detail, by decree**. It never
  appears as a popup because it never *appears* at all: it is always there.

**Why:** each of the six Owner tasks gets a natural home, and none is forced through a primitive that cannot
carry it. The brief's §7 explicitly permits this, and it is the honest answer to a dataset that is
simultaneously a matrix, a hierarchy, a set system and a corpus.

**Risk:** scope, and coherence — four registers can feel like four apps. Mitigated by the Board always being
the ground state, so there is one place the user always knows how to return to.

---

### 10.5 Compare mode ("Two Hands") — a mode, not an architecture

Current selection left, hypothetical right, and a band between them carrying the five outcomes in **fixed-height
labelled rows, not proportional ribbons** — because §4.7's caveat means the 10-lost would otherwise be a
hairline against 133-unaffected. Answers WB→WBG and WUBR-absence natively, and is the one place a Sankey-like
reading is genuinely appropriate. Should be hosted by whichever architecture wins.

---

## 11. Critical product test (brief §16)

| architecture | learned in first 10 seconds | why they click a second thing |
|---|---|---|
| **Ownership Board** | the whole system: White reaches 20 of 23 families, is locked out of 3, and owns removal 12–1 over Blue | a cell that contradicts expectation — "Blue has *one* removal?" |
| **Mana Atlas** | White's reach covers most of the map; three territories are dark; `stat modification` is the largest country | dark territory is an invitation; half-lit territory is a question |
| **Codex** | an ordered inventory of what White does and what is beyond it | the prose is worth reading — it is Rosewater explaining his own design |
| **Layered Atlas** | as Board | as Board, plus a second register to escalate into |
| *Constellation (rejected)* | **nothing** — 23 identical bubbles, 0 mechanics | **no reason** — every bubble looks the same |
| *Radial (rejected)* | nothing; the panel shows a zero state | clicking resets the app |
| *Split (rejected)* | six numbers without context | unclear that anything *is* clickable |

The bottom three rows are the diagnosis restated: none of the rejected prototypes passes either test.

---

## 12. Rejected / low-priority

| pattern | why |
|---|---|
| **Force-directed graph** | prose labels unplaceable (§3.2); node-link loses to matrix above 20 nodes on every task but path-finding, and we have no path-finding task (§4.1); absence has no node (A4); layout implies meaning it lacks (§5.2) |
| **Hierarchical edge bundling** | ~7,000 characters of radial leaf text around one circle. Arithmetic, not preference |
| **Radial dendrogram** | same label wall; a 34-member family breaks any arc that also fits a 1-member family |
| **Chord diagram** | *"not straightforward to understand at all"*; requires dismissing weak connections — deleting true data to gain legibility, which conflicts with the frozen-source discipline. Thematic fit with the wheel is a temptation, not an argument |
| **Circle packing as primary** | it is the rejected family-bubble field, renamed. Possible later as a *within-family* detail encoding |
| **Global neighbourhood graph** | §5.1 — the view that shipped products' users abandon |
| **3D card treatment everywhere** | gimmick without information purpose. Reserve for the single focused record |
| **Repairing Constellation / Radial / Split** | A1–A6 are architectural. None is reachable by CSS |

---

## 13. Questions for the Owner

Only the ones genuinely needing product judgement — everything else is settled by the evidence above.

1. **Does the pentagon have to stay drawn?** Every proposal docks the wheel to a compact controller during
   Mechanics. Is the wheel allowed to become five controls plus orientation, or must the pentagon remain
   visibly a pentagon at all times?
2. **Readable-and-teaching, or explorable-and-atmospheric?** The Board wins on comprehension and costs little;
   the Atlas wins on discovery and costs a lot; the hybrid gets both and costs the most.
3. **Is the prose the point?** The Codex bets that Rosewater's explanations are the most interesting thing in
   the dataset. If they are decoration rather than content, drop the Codex.
4. **Is a hand-authored frozen map layout acceptable?** It is the honest fix for implied distance and makes the
   Atlas stable by construction — but the geography becomes an authored artifact needing its own review, not a
   computed one.
5. **How many registers is too many?** The hybrid has four. Two (Board + reading rail) is defensible and much
   smaller.

---

## 14. Sources

**Authoritative**
- Ghoniem, Fekete & Castagliola — https://journals.sagepub.com/doi/10.1057/palgrave.ivs.9500092
- Lex & Gehlenborg, UpSet — https://jku-vds-lab.at/publications/2014_infovis_upset/ · https://upset.app/
- NN/g progressive disclosure — https://www.nngroup.com/videos/progressive-disclosure/
- Progressive disclosure / Shneiderman's mantra — https://en.wikipedia.org/wiki/Progressive_disclosure
- Semantic fisheye / focus+context — https://www.cs.tufts.edu/~jacob/papers/afram.hfes.pdf
- Data-to-Viz, network — https://www.data-to-viz.com/graph/network.html
- Data-to-Viz, chord — https://www.data-to-viz.com/graph/chord.html
- Sankey / alluvial / parallel sets — https://datavizcatalogue.com/blog/sankey-diagrams-parallel-sets-alluvial-diagrams-whats-the-difference/
- Scalability in visualization (survey) — https://arxiv.org/pdf/2210.06562
- NodeTrix, hybrid matrix/node-link — https://arxiv.org/pdf/0705.0599

**Practitioner**
- Obsidian local graphs — https://pjordan.substack.com/p/a-pkm-revelation-obsidian-local-graphs
- Obsidian graph settings / usability — https://knowledgeaccumulation.substack.com/p/mastering-obsidians-graph-feature
- Untangling the hairball — https://skewed.de/lab/posts/hairball/
- Loving the hairball — https://library.indianapolis.iu.edu/node/504
- D3 interactive force graphs — https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
- Athens graph visualization discussion — https://github.com/athensresearch/athens/discussions/605
- Open-source dataviz tool comparison — https://cambridge-intelligence.com/blog/open-source-data-visualization/
- Neo4j visualization tools — https://neo4j.com/blog/graph-visualization/neo4j-graph-visualization-tools/

**Owner-supplied interaction references**
- https://freefrontend.com/javascript-hover-effects/ (403 to WebFetch; read in-browser)
- https://freefrontend.com/javascript-hover-effects/page/3/#2025-09-26-3d-css-grid-inverse-uv-projection-l
- https://freefrontend.com/javascript-hover-effects/#2026-07-14-interactive-touch-hover-grid-on-gsap-l
- https://freefrontend.com/javascript-hover-effects/#2026-01-01-3d-tilt-card-with-dynamic-glow-l
- https://freefrontend.com/javascript-hover-effects/#2026-05-08-direction-aware-3d-cube-gallery-l

**Owner evidence**
- `manual_Testing.docx` — 4 written findings, 5 screenshots. Controlling document for §1 and §2.
