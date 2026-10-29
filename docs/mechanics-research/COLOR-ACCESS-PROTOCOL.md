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
