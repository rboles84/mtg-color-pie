---
name: robdev
description: Implementation discipline for this repo. Use before and during any code, data, or doc change driven by HANDOFF.md. Keeps the change inside the envelope and hands robqa a compact packet.
---

# robdev — implement inside the envelope

Adapted from Vox Mana's RobDevPass. `AGENTS.md` "Role: robdev" still governs
status transitions and the developer handoff.

1. **Ground.** Read `HANDOFF.md` Control, allowed files, and acceptance
   criteria. Open other docs only by the `CLAUDE.md` read order, and only the
   section you need.
2. **Pre-edit contract.** Before editing, state in one short list: the
   criteria, the files you will touch, the protected behaviour nearby, and
   the robqa class you expect (see `.claude/skills/robqa/SKILL.md`).
3. **Smallest change.** Fix at the existing point of the defect. No refactors,
   no new helpers, no tidy-ups in passing. Anything else you notice goes under
   `Follow-ups`.
4. **Stop conditions.** Stop and ask the Owner if the fix needs a file outside
   the envelope, changes a `CLAUDE.md` invariant, or contradicts a recorded
   Owner decision.
5. **Developer checks — targeted only.** Gate chain if `data/`, mechanics or
   tools are touched; `node --check` on the extracted script if
   `vox-color/color-wheel.html` changed; one focused check per acceptance
   criterion. Do not build broad harnesses or sweeps; the robqa cost gate
   applies to developers too.
6. **Commit the candidate**, then hand off in `HANDOFF.md`: sha, changed
   files with line counts, each criterion → how it is met, checks run →
   result, expected robqa class, and a draft Owner checklist.
7. **Delegation.** Any `Agent` call sets `model` explicitly: `haiku` for
   mechanical work, `sonnet` (the `robqa` agent) for QA. Never let a
   subagent inherit Opus.
