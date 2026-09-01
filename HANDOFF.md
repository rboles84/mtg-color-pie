# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings; replace the field values for each task.
Git history preserves earlier handoffs.

## Control

- Status: `ready-for-qa`
- Owner: `robqa`
- Task: harden the agent workflow from the independent Claude audit
- Requested outcome: close the audit's permission, evidence, lifecycle,
  provenance, dependency, coverage, and new-file gaps with minimal wording edits
- Allowed files: `AGENTS.md`, `HANDOFF.md`
- Allowed surfaces: repository instructions and task-handoff process
- Non-goals: no product-code, historical-generator, reference-prototype,
  context, dependency, or build-workflow changes; no structural rewrite

## Acceptance criteria

- QA can write only `HANDOFF.md`; scope expansion and new files require a user
  decision.
- Evidence is observable and blocked checks cannot be converted into an
  unaccepted limitation.
- Every legal lifecycle state and transition, including the next-task reset, is
  explicit.
- Sibling-repository provenance, pinned CDN dependencies, the three-channel
  emphasis model, face arcs, colourless centre, and untracked files are covered.
- The final `HANDOFF.md` is an idle blank ledger with QA severity and blocked
  fields rather than a completed example.

## Test plan

- Inspect `git status --porcelain` and both complete new files.
- Verify every referenced local path, lifecycle term, and role permission.
- Check for stale or contradictory wording and trailing whitespace.
- Use `git diff --no-index --check` because both files are untracked.

## robdev report

- Changed files: `AGENTS.md`, `HANDOFF.md`.
- Summary: Closed the audit's permission escape hatches, made scope widening a
  user decision, defined evidence and blocked QA, completed the lifecycle,
  located the sibling source corpus, protected the pinned CDN assets and
  emphasis model, expanded the impact matrix, and documented untracked-file
  review.
- Decisions: apply the audit's smallest changes; retain one root guide and one
  root ledger.
- Checks: `git status --porcelain` inspected; every referenced repository path
  and the sibling canon directory exists; the excluded four-colour audit file
  exists; the page contains 10 face arcs, the colourless centre, polite live
  region, Google Fonts, pinned mana-font, and 32/37 assertions; no deprecated
  hedge wording or trailing whitespace found; both untracked files returned
  only the expected LF-to-CRLF warning under `git diff --no-index --check`.
- Skipped checks: none planned; documentation-only task.
- Risks or unverified items: `vox-color/color-wheel.html` acquired an unrelated
  concurrent modification during this task. It was inspected but not edited or
  evaluated as part of this envelope.

## robqa report

- Result: pending.
- Severity: none.
- Scope check: pending.
- Evidence: pending.
- Blocked checks: none.
- Human check required: none.
- Defects: none recorded.

## Decisions needed

- None.

## Follow-ups

- The unrelated HTML diff contains `content:'2 ';` in the new open-summary
  marker. It may be mojibake; confirm the intended glyph in the task that owns
  that product change.
