# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `ready-for-qa`
- Owner: `robdev`
- Task: A script to normalise the Mechanical Color Pie 2021 digest into a
  dataset, as the first step toward the unwired Mechanics layer.
- Requested outcome: a repeatable normaliser, plus an honest account of what
  cannot be normalised automatically.
- Allowed files: `tools/normalize_mechanical_pie.py` (new), `data/*` (new,
  generated), `HANDOFF.md`.
- Allowed surfaces: none in the app. `vox-color/color-wheel.html` untouched.
- Non-goals: the script does NOT wire the Mechanics button, does not change
  the app, and does not decide any split. The layer's visual design is a
  separate, unanswered question.

## Acceptance criteria

- Parses all five colours at three tiers with no entry lost.
- Never splits power/toughness notation.
- Emits proposals for genuine bundles rather than applying them.
- Reports any label appearing at two tiers of one colour.
- Fails loudly, as `blocked`, when the sibling corpus is absent.

## Test plan

- Run against the real digest; compare the entry count with the 393 recorded
  independently in `CONTEXT.md`.
- Inspect an entry mixing P/T notation with a real bundle.
- Confirm valid JSON.

## robdev report

- Changed files: `tools/normalize_mechanical_pie.py` (new),
  `data/mechanical_pie_2021.json`, `data/mechanical_pie_review.md` (generated),
  `HANDOFF.md`.
- Summary: parses the digest into colour -> tier -> entries, VERBATIM. Every
  entry is classified `atomic` / `pt-only` / `paren-only` / `bundle`; only
  `bundle` gets a proposed expansion, written to a review file for a ruling.
  Nothing is split in the dataset.
- Decisions: P/T notation and parenthetical content are masked with
  NAMESPACED placeholders before bundle detection, so a slash inside `+N/+N`
  or inside `(...)` can never be mistaken for a bundle. Paren-internal slashes
  are surfaced as a separate judgement class rather than guessed at.
- Checks: run against the real digest -> 393 entries, matching the count in
  `CONTEXT.md` derived independently. 304 atomic, 34 pt-only, 14 paren-only,
  41 bundle. JSON re-parsed and keys verified. Spot-checked
  `+N/+N & -N/+N & +0/+N on Auras/spells`: splits `Auras/spells` only and
  leaves the P/T notation whole -- the exact case a naive splitter destroys.
- Skipped checks: none applicable; the app is untouched, so no browser,
  viewport, motion or routing checks are in this task's blast radius.
- Risks or unverified items: distinct-label count is 243 here against the 205
  recorded in `CONTEXT.md`. Both cannot be right; mine normalises only case,
  whitespace and a trailing stop, so the 205 came from a stricter rule that is
  not written down. Recorded as a follow-up rather than silently adopting
  either number.

## Decisions needed

- The 41-entry split queue in `data/mechanical_pie_review.md` needs rulings
  before any dataset can be considered normalised. 14 paren-only entries
  need a judgement too.
- Black lists bare `flash` at BOTH Secondary and Tertiary. Only the article
  can settle which is correct; the digest cannot.
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
