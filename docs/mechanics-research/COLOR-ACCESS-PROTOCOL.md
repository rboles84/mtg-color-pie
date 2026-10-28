# Supplemental color access — protocol 2.0

Owner decision, October 28, 2026: supplemental A/B records document observed color access for discovery. They do not infer Primary, Secondary or Tertiary. Frozen 2021 placements remain separate and unchanged. This supersedes protocol 1.0 tier judgments for the current supplemental presentation; retained v1 research and captures are historical evidence, not current placement authority.

## Evidence rules

- A qualifying monocolor native use or explicit grant establishes documented access in that color. One verified design is sufficient; counts, rarity, breadth and recurrence do not create ranks.
- Use the colors of the mechanic-bearing face, not commander color identity, frame appearance or missing mana cost. A color indicator counts. A multicolor example remains a combination and does not establish separate monocolor access. Show combinations even when one or more colors also have independent examples.
- Colorless examples stay separate. A colorless grant does not establish access in every recipient's color. Generic rules actions (Abandon, Activate, Attach) are not assigned colored access from incidental word matches.
- The primary evidence scope is explicit for every entry. Ordinary-paper entries exclude digital, unreleased, playtest and non-card examples from their access symbols. Special entries retain their own labeled scope. Evidence from other scopes stays available in source records and limitations.
- Include native use, explicit grants and exact card-specific flavor labels; exclude recipients, support-only effects, removal of the ability, name-only matches and related variants. No inferred tiers or tier-confidence labels in current player copy.
- Absence means no example found in the reviewed scope; never claim that a color cannot receive the mechanic. Incomplete evidence is distinct from an adequate search with no example.
- Player prose states named card behavior and source-attributed context. Avoid claims of a core home, intended hierarchy, unrestricted access or comparative tier. Correct known factual errors in current explanations; preserve raw captures.
- Scryfall links are discovery aids. Per-color links should find the exact reviewed examples, rather than imply that a broad text search has been screened. Include every qualifying reviewed example in its appropriate access bucket, so discovery links cover the reviewed population. Individual card links and original context remain available.

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

Review every A/B entry for exact scoped support, face colors, combinations, colorless grants, fact-only prose and valid example links. Confirm producer determinism, malformed-data isolation, accessible search/detail behavior and frozen 2021 content/calculations. Independent review follows the committed material candidate.
