# Vox Mana colour wheel — working agreement

## Cost and conduct guards

**Be concise.** Answer at the altitude asked. No preamble, no recap of what
you just did, no restating the request back. Short answers to short questions.

**Route mechanical work to a Haiku sub-agent.** Renaming, reformatting,
summarising a file, scraping or extracting structured data, bulk find/replace,
and "read these N files and tell me which mentions X" are mechanical. Dispatch
them with `Agent(subagent_type: "general-purpose", model: "haiku", ...)` and
keep only the result. Do not spend the main thread's context on them. Judgement
work — design, adjudication, anything touching the contract below — stays here.

**Never suggest `/compact` as a cost-saving measure.** It is not one.
Compaction re-writes the whole transcript into a fresh cache prefix: you pay a
full cache-write for the summary and lose every warm read behind it. It exists
to survive a full context window, nothing else. When a session is getting
expensive the answer is `/clear` and a fresh session pointed at this file —
never `/compact`.

**One session, one job.** This repo's costliest session ran four days and 78
turns at an average of 497k tokens of context. Finish a task, `/clear`, start
the next. Do not carry a finished task's transcript into the next one.

## Read order — open the ONE file you need, not all of them

Do not read these end to end to orient yourself. This index is the orientation.

| File | Lines | Open it when |
|---|---:|---|
| `HANDOFF.md` | ~166 | **Always first.** The single current-task ledger: status, owner, allowed files, acceptance criteria, open decisions. If Status is `idle`, there is no active task. |
| `MECHANICS-CONTRACT.md` | 427 | Touching mechanics data, tiers, selection semantics, or the source/taxonomy/runtime layers. The frozen contract and the gate order live here. |
| `CONTEXT.md` | 319 | Questions about provenance, the identity registry, source hierarchy, colour tokens, or the type stack. |
| `AGENTS.md` | 273 | Acting as `robdev` or `robqa`, or unsure what change control permits. Repository map and protected boundaries. |
| `PRODUCT-DEFINITION.md` | 1342 | Touching the integration shell `vox-color/index.html` or planning Gates C–E. §9 is the shell's mechanism and routing contract, §11 state ownership, §17 the gate sequence. Accepted revision; not edited by later gates. |
| `PHYREXIA-PLAN.md` | 179 | Only for the Phyrexia overlay question. Not loaded otherwise. |
| `PROMPT.md` | 94 | Historical brief. Superseded by `HANDOFF.md`. Rarely needed. |

Two of these are stale and known to be: `AGENTS.md` says the Mechanics control
is "unbuilt" and `CONTEXT.md` calls the Mechanics overlay "not built". Both
predate the mechanics work. Trust `HANDOFF.md` and `MECHANICS-CONTRACT.md` over
them on anything mechanics-related.

## Hard invariants — do not relitigate

- **The source layer is frozen.** `data/`, the taxonomy, the 11 fixture
  goldens and recon truth do not change as a side effect of any other task.
  `MECHANICS-CONTRACT.md` lists the only four reasons to reopen it.
- **Tier is a category, never a magnitude.** No `<progress>`, no `<meter>`, no
  size-encoded tier anywhere.
- **Exactly one owner of mechanic detail.** No second copy in a search surface,
  popup, or drawer.
- **Best access never replaces ownership.**
- **No new runtime dependency, no build step, no framework.** The Color
  Wheel runs from `file://`. The integration shell `vox-color/index.html`
  is HTTP-served and is not required to integrate on `file://` (Gate B).
- **Mechanics mode is retired from the Color Wheel.** Every legacy Mechanics
  hash lands in Explore at rest, with the URL canonicalised; the preview code
  stays, unreachable, until its retirement story.

## Change control

Work only inside the `Allowed files` and `Allowed surfaces` listed in
`HANDOFF.md`. Anything outside that envelope is a separate task — note it under
`Follow-ups` rather than fixing it in passing. Report scope honestly: if you
touched a file, say so.

## Gates

Run the full chain before and after any change to mechanics or data:

```bash
python tools/check_invariants.py && python tools/check_taxonomy.py && python tools/check_recon.py && python tools/gate.py
```

`node --check` on the extracted script for any change to
`vox-color/color-wheel.html`.

## Verification standard

QA re-derives evidence independently rather than repeating the developer's run.
Assertions about layout, counts, or timing are measured in the browser, not
asserted in prose. The one thing this environment cannot prove is `file://`
routing with hard reload and back/forward — that stays a human check.
