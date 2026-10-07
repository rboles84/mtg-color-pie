---
name: robqa
description: Risk-proportional QA for this repo. Use when verifying a robdev candidate, choosing tests, or preparing Owner review. Classify the change first, then run the cheapest checks that prove the changed behaviour.
---

# robqa — risk-proportional QA

Adapted from Vox Mana's RobQAPass. `AGENTS.md` "Role: robqa" still governs
what QA may write (`HANDOFF.md` only) and the status transitions.

## 1. Bind to the candidate

Record the exact commit, `git diff --stat <base>..<candidate>`, and confirm
every changed path is inside `HANDOFF.md`'s allowed files. Read the
acceptance criteria and the diff — not the developer's summary.

## 2. Classify (take the highest class that applies)

| Class | Change | Required evidence | Who runs QA |
|---|---|---|---|
| QA-0 | Docs, comments, ledger | Read diff; `git diff --check`; referenced paths exist | Same agent |
| QA-1 | Copy, CSS, presentation | `node --check` if the wheel changed; one targeted DOM/geometry check of the changed rule at the widths it targets; Owner checklist | Same agent |
| QA-2 | One component's interaction | Targeted script for the changed behaviour (mouse and keyboard), console clean; Owner checklist | Same agent |
| QA-3 | Routing, hash, history, focus across views | Every hash case the diff touches, plus Back/Forward; shell over HTTP; `file://` hard reload and Back/Forward go on the Owner checklist | Same agent unless it crosses frames |
| QA-4 | Mechanics data, selection semantics, source layer, invariants in `CLAUDE.md` | Full gate chain; targeted checks of the protected behaviour | Separate robqa agent |
| QA-5 | Shell integration, cross-frame behaviour, release | Targeted cross-frame checks of what changed | Separate robqa agent |

**Same agent** means a distinct QA phase after the candidate is committed:
re-read the diff and criteria, then run the selected checks. Never relabel
the developer's run as QA, and never call it independent.

## 3. Cost gate — answer before running anything beyond targeted checks

1. What changed that this suite protects?
2. What defect could it catch that a targeted check cannot?
3. Is that behaviour already certified at an unchanged baseline?
4. Is it proportionate to this change?

No concrete answer → do not run it. In particular, **do not** run pixel or
width sweeps, full viewport matrices, screenshot diffs, or the full
regression harness unless the acceptance criterion is geometry at an unknown
width or the Owner asks. **Rework QA covers only the reworked lines and the
criterion that failed**; untouched behaviour keeps its earlier certification.
If the change unexpectedly touches a higher class, stop and report scope
drift — do not compensate with a bigger suite.

## 4. Owner-visual by default

The agent proves cheap, objective facts: routes, DOM state, focus, console
errors, accessible names, gate scripts. The Owner judges appearance, layout
feel, spacing, motion, and `file://` reload/Back/Forward. Hand the Owner a
numbered checklist of at most 12 items: URL, action, expected result.

## 5. Budget

About 30 tool calls. If the class needs more, stop, record what remains, and
ask. Run QA on Sonnet (`.claude/agents/robqa.md`), never on the session's
Opus model.

## 6. Report in `HANDOFF.md`

Mode (same agent / separate), class, candidate sha, each check as
`command or action → observed result`, findings as
`blocker | major | minor | note` with reproduction, expected, actual, and the
Owner checklist. Verdict: `qa-passed`, `qa-failed`, or `qa-blocked` with the
exact missing check. Never mark `complete`; only the Owner accepts.
