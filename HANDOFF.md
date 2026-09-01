# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `ready-for-qa`
- Owner: `robdev`
- Task: Replace the digest normaliser with a two-pass parser over the full
  official article, and reconcile its two representations.
- Requested outcome: treat the expanded *Mechanical Color Pie 2021* as the
  authoritative source; parse the colour lists and the ability catalog
  independently; cross-validate; preserve every conflict; invent nothing.
- Allowed files: `tools/parse_mechanical_pie_2021.py` (new), `data/*`
  (generated), `HANDOFF.md`.
- Allowed surfaces: none in the app. `vox-color/color-wheel.html` untouched.
- Non-goals: does NOT wire the Mechanics button; does not resolve the four
  source conflicts; does not design the overlay.

## Acceptance criteria

- Both representations parsed independently from the article HTML.
- Every colour/tier section reported as captured or NOT CAPTURED, never as
  empty.
- Conflicts preserved with both claims and a stated basis for the canonical
  pick.
- Source typos recorded, not silently corrected.
- No mechanic distinction collapsed that the article draws.

## Test plan

- Compare placement count against the 393 the digest yielded.
- Verify parsed tiers for known entries against the article by eye.
- Confirm every reported conflict is real, not a parser artefact.

## robdev report

- Changed files: `tools/parse_mechanical_pie_2021.py` (new), four generated
  files in `data/`, `HANDOFF.md`.
- Summary: fetched the article (444KB, HTTP 200) and parsed it twice. Pass 1
  reads the five colour lists; pass 2 reads the ability catalog with its
  explanations; pass 3 reconciles them and records a basis for every
  assignment. Where the two halves disagree the catalog wins, because that is
  where Rosewater discusses the classification -- but the losing claim is
  retained in the record.
- Decisions: short parentheticals are KEPT in the match key and long ones
  dropped -- "+N/+N (on creatures)" / "(on spells)" / "(on Auras)" are three
  entries with three different assignments, while long glosses vary in wording
  between the two halves. Labels that repeat under different group headers are
  qualified by the group. "Cast spells from your graveyard" and "out of
  graveyard" are NOT merged: the article gives them separate entries.
- Checks: 465 colour-list placements against the digest's 393 -- the digest was
  losing 72, about 15%. 212 catalog entries, 238 reconciled mechanics, all 15
  colour/tier sections captured. All four surviving conflicts verified by hand
  against the article text.
- Skipped checks: none applicable; the app is untouched.
- Risks or unverified items: explanations are attached to the entry they
  follow. Spot-checked and correct, but not exhaustively verified.

## robqa report

- Result: `pass` after THREE parser defects were found and fixed.
- Severity: all three `major` -- each silently produced plausible wrong data.
- Scope check: the app is untouched; only tools and generated data changed.
- Evidence: the first run reported 8 conflicts. Checking them against the
  article showed 5 were parser artefacts, not source disagreements:
  1. Tier lines were matched anywhere in a paragraph, so explanation prose
     ("This ability was primary in both black and green for a while") parsed
     as an assignment and emitted a second, wrong record per ability.
     Anchoring the pattern to the start of a line fixed it. 8 -> 3.
  2. Sub-abilities live in `<ul><li><strong>` between the paragraphs, not in
     the paragraphs. A paragraph-only scan filed all 19 creature-pumping
     variants under the group header "Creature pumping" -- collapsing exactly
     the distinctions this dataset exists to keep.
  3. Stripping every parenthetical made "+N/+N (on creatures)", "(on spells)"
     and "(on Auras)" collide into one key, manufacturing conflicts.
  Each fix was re-run and the conflict list re-verified by hand.
- Blocked checks: none.
- Human check required: the four conflicts are real and need a ruling on
  which side the runtime dataset should follow.
- Defects: none outstanding.

## Decisions needed

- FOUR source conflicts between the article's own two halves. Each is real,
  hand-verified, and needs a ruling. The parser currently prefers the ability
  catalog in all four:
  | mechanic | colour | colour list | ability catalog |
  |---|---|---|---|
  | `+N/+N (on spells)` | W | secondary | primary |
  | `Deal N damage to a creature with flying.` | R | secondary | tertiary |
  | `Exiling cards from graveyard` | W | primary | secondary |
  | `Flash` | B | tertiary | secondary |
- The digest split queue is SUPERSEDED. The article separates those bundles
  itself, so the 41 rulings are no longer needed.
- Re-add `scrollbar-gutter:stable`? It removes the measured 10px text reflow
  between scrolling and non-scrolling panels. With the track now transparent
  it no longer produces a visible gutter, so the original objection to it no
  longer applies. Awaiting the user.

## Follow-ups

- Distinct-label count disagrees with `CONTEXT.md`: 243 vs 205. Reconcile the
  normalisation rule, then correct whichever number is wrong.
- `max-height:calc(100vh - 180px)` hard-codes the height of the chrome above
  the stage. If the hero or control rows change height, that constant needs
  revisiting; a container query or a measured custom property would be more
  durable. Not done here -- outside the envelope.
