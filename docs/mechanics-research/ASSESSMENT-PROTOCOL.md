> Historical tier-assessment record. On October 28, 2026, the Owner replaced inferred supplemental A/B P/S/T with documented color access. Current display authority is [COLOR-ACCESS-PROTOCOL.md](COLOR-ACCESS-PROTOCOL.md) and each canonical packet's `access_review` field. The tier judgments below are preserved history and do not drive the current preview.

# Supplemental mechanic assessment protocol

Version: **1.0** · Established: **2026-10-27, America/Denver**

This is the working protocol for subsequent supplemental mechanic research and
reassessment. Use the same version throughout a batch. It governs how evidence
becomes a proposed placement; it does not change the frozen 2021 catalog.

The reproducible part is the scope, source record, population, decision route
and checks. Tier judgments can still be contested. A different judgment requires
a recorded disagreement or revision, not an undocumented change of method.

## 1. Fixed boundaries

- Research locally first. Reuse saved evidence when its scope and completeness
  meet the task; record its cutoff rather than presenting it as a fresh query.
- Review one named mechanic, with an explicit definition and scope. A keyword,
  an ability word, a keyword family, a general rules action and a similar effect
  are different subjects until a documented comparison establishes a relationship.
- Default population: released paper card designs across formats, regardless of
  current Commander legality. Record digital, preview, playtest/designer,
  acorn/Un-set, sticker and special-format evidence separately. A mechanic
  exclusive to one of those scopes can be assessed within that scope.
- Do not pool special material into ordinary-paper tier counts. A mixed-scope
  record must show separate populations and which population drives each decision.
- W/U/B/R/G are Magic colors. Colorless is a separate classification, not a sixth
  color and not the colorless mana symbol. A general rules action can be
  **not applicable** to P/S/T; it is not an unknown color ranking.
- Keep the frozen 2021 data, identity mappings, fixtures and calculations
  untouched. A source published in 2021 may inform separate research without
  editing or silently inheriting that catalog's placements.
- Research completion does not authorize app import, publication or integration.
  Apply the user's batch/app authorization and the repository's existing workflow.

## 2. Evidence hierarchy and the scope test

Use this order for placement claims. Scryfall remains the authority used here
for retrieved card facts, not for authoring P/S/T rankings.

| Route | Evidence | Allowed conclusion |
|---|---|---|
| E1 — direct official | Wizards/designer source explicitly assigns a tier to this named mechanic in the relevant scope | Attribute that tier to the source, with its date and scope. Do not describe it as a Scryfall judgment. |
| E2 — explicit design context | Official discussion names the mechanic within a ranked broader effect | A source-informed provisional inference, after the scope test below. Do not claim a standalone official keyword ranking. |
| E3 — card-derived | Screened Scryfall facts and card history, interpreted using the tier rubric | A Scryfall-derived provisional assessment. Card counts and color philosophy alone cannot supply a tier. |
| E4 — locator/analogy only | Wiki, community analysis, an adjacent mechanic, unsupported recollection | A research lead or clearly marked analogy; insufficient by itself for a placement. |
| U — user-selected | An explicit user decision about classification or a proposed placement | Preserve as user-selected, with supporting evidence separate. Never relabel it official or independently established. |

For E2, record all four answers:

1. Does the original source name this mechanic or directly describe its exact
   operation? Give the section and the relevant claim.
2. Which parts of the ranked effect match, and which differ (trigger, cost,
   affected objects, damage versus life loss, grant restrictions or variant)?
3. Does the discussion explain the particular color being assessed? A sentence
   about blue does not independently establish every other color's access.
4. Why is applying the broader tier reasonable here, and what remains inference?

If that connection cannot be defended, use the source only as background and
continue through E3. Merely sharing a word or a color philosophy is not a bridge.
Official commentary that explains access without assigning a relevant tier can
support the E3 rubric; it does not supply a hierarchy to inherit.

Resolve source disagreements by subject and scope first, then explicit
supersession/version history. A newer date alone does not override a more
specific claim. Preserve unresolved competing claims; do not average their tiers.
The affected color remains unassigned with status `conflicted` until resolved.
Unaffected colors may proceed.

A card-only inference must not silently overrule a relevant E1/E2 source.
Departure needs a documented scope mismatch, explicit supersession, or a
specific changed design pattern that the reviewer accepts as stronger evidence.
More reprints, a one-card count difference, or continued use alone is insufficient.

## 3. Reproducible collection and screening

Run these steps in order and keep the receipts, including empty results.

1. **Identify.** Record accepted ID, name, aliases, definition, classification,
   population boundaries and cutoff. Separate retrieval time in UTC from the
   human research/review date in America/Denver.
2. **Locate original design sources.** Inspect local rules/reference sources;
   use wiki citations as pointers to original Wizards/designer publications.
   Record inaccessible originals honestly. A wiki assertion is not promoted
   to original-source evidence because its citation cannot be opened.
3. **Query Scryfall.** Baseline keyword query: `kw:"<name>" include:extras`,
   with `unique=cards`. Also use an escaped exact-word Oracle query such as
   `o:/\bAfflict\b/ include:extras` to find grants and keyword indexing gaps.
   This union is a candidate population, not the final included set.
4. **Handle syntax and exceptions.** Inspect keyword/ability-word coverage,
   punctuation, aliases and variants. Log any replacement query and why.
   Rules actions may need a type-filtered query, e.g.
   `t:scheme o:abandon include:extras`. Default search can exclude relevant
   objects or find unrelated word matches; zero hits is not proof of absence.
5. **Complete retrieval.** Save every page, total/retrieved counts, pagination
   completion, exact URL/query/parameters and errors. A failed or partial fetch
   blocks any absence claim. Use `unique=prints` separately for chronology and
   rarity history, not to inflate the design population.
6. **Screen every candidate.** Record include/exclude and a specific reason.
   Exclude name-only matches, reminder-text references to another mechanic,
   unrelated modes, copied text without independent access and incidental mentions.
   Record multiple roles when a card both has and grants the mechanic.
7. **Attribute color.** Use the colors of the card or relevant face that actually
   supplies the ability; retain color identity separately. Multicolor/hybrid,
   split-face and granted abilities require an explicit attribution note.
   A multicolor design is joint evidence, not automatic proof of standalone
   access for each constituent color. A colorless grant does not assign a tier
   to every color of creature that can receive it.
8. **Deduplicate and date.** Count distinct Oracle designs, with face attribution
   where relevant. Reprints/alternate art are not new designs. Group related
   digital rebalances, mirrored versions and deliberate cycles so they do not
   masquerade as independent recurrence. Use first known release and its
   context; distinguish subsequent new designs from subsequent printings.
9. **Summarize.** Per color and population scope, record native designs, explicit
   grants, joint-only support, distinct release/design contexts, original rarity
   coverage, roles and exceptions. Retain colorless and excluded results.
   Rarity is supporting context, never a tier conversion rule.

Required card roles: `native`, `explicit_grant`, `joint_only`,
`recipient_only`, `incidental_mention`, `false_positive`.
Multiple roles are allowed; inclusion and attribution must explain their effect.

### Source preservation

For narrative original sources, save a readable PDF and the original HTML/text
when obtainable. Record URL, publisher/author, title, publication date,
retrieval time, relevant section, file paths and SHA-256 receipts. Check that
the saved PDF contains the cited section; a login/error/blank PDF is not evidence.
If capture is unavailable, retain the accessible text/URL and mark the missing
capture; do not claim a PDF exists.

For Scryfall, preserve raw JSON pages, printing history and the screened ledger.
A readable PDF report can accompany them, but does not replace the machine-readable
card evidence. Separate byte hashes of original captures from canonical JSON
hashes used for reproducible projections; document the serialization used.

## 4. Ordered decision rules

Apply these separately to each color, recording the route and source/card IDs.
No weighted score, majority vote, fixed percentage or automatic count-to-tier map
is permitted.

1. **Not applicable:** a general rules action has no mechanic-specific P/S/T
   question. Record `not_applicable`, including the reason.
2. **Explicit user choice:** preserve route U within its stated scope, without
   treating that choice as evidence of official design policy.
3. **Exact official tier:** use applicable E1, subject to conflict resolution.
   An official source may establish a tier even if the card snapshot is incomplete;
   disclose that incompleteness and make no unsupported absence claim.
4. **Official contextual inference:** use E2 only after the four-part scope test.
   Start from that context's relevant hierarchy, test it against direct card
   evidence and explain any justified departure.
5. **Card-derived inference:** use E3 and the rubric below only when collection
   is complete for the claimed scope and direct evidence exists for that color.
6. **Limited sample:** consider the narrowly defined proposed-home route below.
7. **Unassigned:** if no route yields a defensible tier, leave it null. Presence
   without a justified tier is `observed_tier_unresolved`; an adequate search
   with no qualifying support is `no_support_in_sample`; incomplete evidence is
   `incomplete_evidence`. None of these statuses means the color can never
   receive the mechanic.

### E3 tier rubric

| Tier | Positive case that must be demonstrated | Insufficient shortcut |
|---|---|---|
| Primary | A core home: direct native/grant designs plus recurring independent use, or a deliberate broad original implementation across roles/rarities/cycles. Explain why this color functions as a principal home. Multiple Primary colors are allowed. | Largest count, sole color on one card, generic philosophical fit, or calling every observed color Primary. |
| Secondary | Established access with a demonstrably narrower or more conditional design role than the principal home(s). Explain the restriction or role and why the evidence supports established access rather than an exception. | Second-largest count or fewer cards than another color. |
| Tertiary | A supported exception: a specifically evidenced set/theme accommodation, narrow experiment or exceptional access. Identify the constraint and why it is not established Secondary access. | Smallest count, high rarity, one old card, or using Tertiary as a fallback for uncertainty. |

For card-only claims of a pattern, cite at least two distinct qualifying designs;
two designs are a minimum to discuss a pattern, not a numeric tier threshold.
One release can support a core implementation, but is not cross-release recurrence.
A balanced cycle can support multiple colors without becoming multiple independent
release contexts. A lower count alone cannot distinguish Secondary from Tertiary.

For every assigned tier, answer: **Why this tier rather than the nearest plausible
alternative?** If the answer depends only on a count or on restating the tier,
the decision is not ready. Leave it unresolved or gather the missing evidence.
There is no requirement to fill every tier or select exactly one Primary color.

### Limited-sample proposed home

This route preserves useful, explicitly weak judgments such as Absorb without
pretending a singleton establishes a recurring pattern. It is allowed only when:

- the complete scoped sample's qualifying colored evidence is confined to one color;
- a native design or explicit colored grant is verified;
- independent original design context supports that color for the mechanic or a
  demonstrably related precursor (record the relationship and limitation);
- there is no stronger contrary placement evidence.

The output may be **Primary, proposed home only**, with **Low** confidence and
route `E3_limited_sample`. It does not establish general access frequency.
If those conditions are not met, record observed access with the tier unresolved.
A user-selected exception instead uses route U and must remain visibly separate.

### Colorless and special scopes

Apply the same evidence discipline to an outside-five-colors classification,
recording its basis separately. Never fill five colored slots merely because a
colorless card can be played in many decks. A playtest singleton such as
Affinitycycling establishes observed Colorless access in that playtest scope;
a proposed Primary home still requires the limited-sample conditions above
(applied to Colorless instead of a color), or an explicit route U decision.
The singleton alone does not establish a tier. User-selected
Annihilator classification remains route U. Do not erase genuinely independent
colored evidence merely because most examples are colorless.

## 5. Confidence and attribution

Assign confidence to each color's tier or unresolved status, separately from
confidence that a card fact was retrieved correctly.

- **High:** applicable E1, unambiguous scope, no unresolved contrary evidence.
- **Moderate:** E2 with a defensible scope bridge, or a coherent E3 pattern with
  a supported comparison against the nearest alternative; meaningful limits remain.
- **Low:** limited sample, weak chronology/scope coverage or a disclosed
  classification choice. Low confidence is not permission to invent a tier.
- **Not applicable:** no tier question. A U decision records that its authority
  is the user's choice; evidence confidence may be recorded without scoring
  the user's intent as a design fact.

Do not label a tier “Scryfall Verified.” Use:

- **Official placement — [source, date]** for E1;
- **Source-informed assessment — provisional** for E2;
- **Scryfall-derived assessment — provisional** for E3;
- **User-selected classification** for U;
- **Rules action — not ranked** where P/S/T does not apply.

These are the protocol's labels for new research records. Existing app labels
are a separate presentation implementation; this document does not silently
change them. Any record containing mixed routes must attribute each decision.
“Verified” may describe checked card facts, never the inferred tier.

## 6. Required rationale format

Write player-facing prose after the evidence table and decisions are complete.
Use this sequence for each assigned color, normally in two to four sentences:

1. **Decision and role:** what the mechanic does in this color.
2. **Concrete support:** named cards, original design commentary or both;
   distinguish native use, grants, original releases and reprints.
3. **Tier judgment:** why that support fits this tier over the closest alternative.
4. **Limit:** scope, conflicting evidence or small sample, when material.

For unassigned colors, state whether support was not found or whether access is
observed but the tier cannot be resolved. For rules actions, explain why P/S/T
does not apply. Counts belong in the evidence summary and can support the prose;
“five cards therefore Primary” is not a rationale.

Do not invent philosophical explanations to rationalize a chosen tier. Avoid
generic color slogans, internal workflow jargon and repeating the full evidence
table. A reader should understand the decision without opening every card link.

## 7. Research record and template

Use [ASSESSMENT-TEMPLATE.json](ASSESSMENT-TEMPLATE.json) for each new review.
It is a research record template, **not the app payload schema**, and no automatic
importer or protocol validator is claimed by this document. Existing research
formats may be retained if they contain an explicit mapping to these fields.

Required top-level fields and contents:

- `protocol_version`, `record_status`: version and draft/reviewed state.
- `mechanic`: accepted ID/name, definition, aliases, classification.
- `scope`: population, included/excluded special scopes, evidence cutoff,
  timezone, definition/variant boundaries.
- `provenance`: researcher/reviewer, research and judgment dates, source revision,
  previous assessment reference and protected 2021 baseline reference.
- `sources`: source ID, type, original/locator role, URL/title/author/date,
  claim scope, exact section, retrieval time, capture paths/hashes and capture status.
- `queries`: query ID, exact query/URL/parameters, retrieval time, pages/receipts,
  expected/retrieved counts, completion and exceptional-query explanation.
- `card_review`: Oracle ID/name, face, colors and color identity, scope, roles,
  inclusion/reason, attributed colors and justification, first release/context,
  original rarity, printing history and source references.
- `population_summary`: scoped totals, excluded totals, per-color native/grant/
  joint evidence, release contexts, rarity/role coverage and colorless evidence.
- `context_scope_test`: source IDs and the four E2 answers; not-applicable reason
  if no E2 source is used.
- `decisions`: exactly W/U/B/R/G. Each contains tier or null, status, route,
  confidence, support/contrary source and card IDs, rubric conditions,
  closest alternative, why chosen and rationale.
- `outside_five_colors`: classification and any proposed tier, scope, route,
  confidence, evidence, rationale and limitations; separate from WUBRG.
- `summary`, `limitations`: concise overall conclusion and material caveats.
- `review`: evidence completeness, source-scope and attribution checks, tier/
  alternative checks, isolation checks, unresolved findings, reviewer verdict.
- `revision`: prior decision, changed fields, new evidence/reason, protocol
  version change, review date and application/import authorization.

Blank/null template values are placeholders, not a completed assessment.
A completed record requires source/card references to resolve, no unsupported
assigned tiers and an explicit disposition for every color.

Use these fixed values in completed records:

- `record_status`: `draft` or `reviewed`; only a passing review permits `reviewed`.
- `tier`: `Primary`, `Secondary`, `Tertiary` or null.
- `status`: `assigned`, `proposed_home`, `observed_tier_unresolved`,
  `no_support_in_sample`, `incomplete_evidence`, `conflicted` or `not_applicable`.
  Only `assigned` and `proposed_home` carry a non-null tier.
- `route`: `E1`, `E2`, `E3`, `E3_limited_sample`, `U` or null when no
  placement route was established. E4 is a source role, never a decision route.
- `confidence`: `High`, `Moderate`, `Low` or `Not applicable`.
- `reviewer_verdict`: `pass`, `revise` or `blocked` (null while draft).

Record each capture's hash against its own file path. Population-summary card
references must resolve to the scoped card ledger; totals must be separated by
scope. Apply the same status, alternatives and contrary-evidence fields to any
outside-five-colors tier decision, using its separate record.

## 8. Batch procedure and review gate

For each alphabet batch, use the same table:

| Mechanic | Scope/classification | W | U | B | R | G | Colorless | Decision route/confidence | Changed since prior | Open issue |
|---|---|---|---|---|---|---|---|---|---|---|
| One row per accepted mechanic | Explicit | P/S/T or status | P/S/T or status | P/S/T or status | P/S/T or status | P/S/T or status | Separate | Per-color if mixed | Reason/reference | None or named gap |

Execute: **scope → collect → screen → evidence table → source-scope test →
per-color decisions → rationale → independent review → authorized materialization**.

The independent reviewer checks:

- exact coverage and completed retrieval for sample/absence claims;
- deduplication, original rarity/date and per-face/colored-grant attribution;
- E1/E2 scope and conflicts; no wiki or source-family claim presented as exact;
- every inferred tier against its closest alternative; no count-only inference;
- explicit confidence, special scope, null status and Colorless separation;
- references and captures resolve; unavailable capture is disclosed;
- semantic isolation from other approved records and frozen 2021 files;
- deterministic generation and proportionate app checks when import is authorized.

Return disputed decisions to research with a named missing fact or competing
interpretation. Do not silently rewrite another researcher's tier. Keep settled
records fixed unless new evidence, a discovered error, an explicit user decision
or a versioned method revision warrants reopening them.

When the protocol changes, record the version, reason and affected prior records.
Do not use a different rubric for each letter. Existing A assessments are
**not retroactively protocol-certified**; they need a bounded conformance review
before claiming v1.0 compliance. That review is follow-up work, not performed by
creating this document.

## 9. Worked boundaries from the current A review

| Case | Route and outcome | What makes the decision defensible |
|---|---|---|
| Afflict | E2: R Primary, B Secondary, U Tertiary; W/G unassigned; Moderate | The official broader blocked-damage entry explicitly discusses Afflict and blue's set context. The bridge is disclosed. Original rarity/roles and later black grants support access; five black versus four red designs does not establish a promotion. |
| Absorb | E3_limited_sample: W proposed Primary home; Low under this protocol | One observed white design, with original precursor context supporting white. This is a weak proposed home, not established frequency. Its existing app confidence wording is not automatically rewritten here. |
| Annihilator | U: Primary Colorless / outside five colors | Preserve the user's selected classification and distinguish supporting Scryfall evidence from decision authority. |
| Affinitycycling | Observed Colorless access in designer/playtest scope; tier unresolved unless the limited-sample test or route U applies | One designer/playtest design verifies access, not a tier by itself. Its earlier proposed tier requires conformance review; this document does not change the app. |
| Abandon / Activate / generic Attach | Rules action; P/S/T not applicable | Generic action vocabulary does not establish a colored mechanic ranking. Attach's separately sourced moving-enchantments/counters effect retains its own narrower scope. |

Worked cases describe decision routes, not permission to copy a tier to a
related mechanic. Afflict's source is [Mechanical Color Pie 2021, “Deal damage
when blocked”](https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021).
The saved review records remain in this directory; original card evidence is
preserved there and in the retained external research captures.
