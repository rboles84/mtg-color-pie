# Vox Mana colour wheel agent guide

This repository is a small, deliberately buildless web project. Use the named
roles below as operating contracts, not as permission to broaden a task.

## Read order and sources of truth

Before changing anything, read in this order:

1. `AGENTS.md`
2. `CONTEXT.md`
3. `HANDOFF.md`
4. The exact file and nearby code involved in the request

`CONTEXT.md` is the current product and provenance record. `PROMPT.md` is a
historical bootstrap prompt and still describes the pre-merge two-file layout;
when they conflict, `CONTEXT.md` wins. `PHYREXIA-PLAN.md` is a proposal, not an
active work order. The blanket "check before doing anything" cadence in
`PROMPT.md` is also historical; the scoped authorization and decision gates in
this guide are the current operating rule.

## Repository map and protected boundaries

- `vox-color/color-wheel.html` is the shipped app: one static HTML document
  with inline CSS and JavaScript, containing both the wheel and the 37-tile
  atlas.
- `index.html` is the canonical integration shell for The Color Pie (Gate B).
  Its legacy `vox-color/index.html` entry preserves shared URLs by redirecting
  to the relative root, keeping query and hash. The shell is one header and
  nav over two same-origin iframes holding
  `color-wheel.html` and `mechanical-explorer.html`, which stay separate,
  unedited documents. It reads only the wheel's hash (and watches each
  frame's focus, to keep focus out of the inactive one) and writes only a
  validated route into it, plus, for an arrival with colours, a validated
  colours key into the explorer's hash (Gate E). Routes: `/` (Color
  Wheel at rest), `#color-wheel/<wheel route>` (passed through verbatim),
  `#mechanical-color-pie` and `#mechanical-color-pie/colors=<WUBRG key>`
  (Gate E; the URL is then replaced with `#mechanical-color-pie`); anything
  else, malformed percent-encoding, or the
  retired Mechanics route in any encoding lands on the Color Wheel at rest.
  It is HTTP-served, with Chromium desktop browsers as the supported scope;
  on `file://` it switches views but cannot mirror routes. Contract:
  `PRODUCT-DEFINITION.md` §9 and §11.
- `vox-color/build/` contains historical Python generators. Do not update or
  treat them as the source of truth. Only `build_wheel.py` may be run, and only
  when the user explicitly asks for a geometry re-derivation.
- `build_directory.py` generated the deleted pre-merge directory page. Do not
  run it or recreate `color-identity-directory.html`.
- `vox-color/reference/current-weave-annotated.html` is an annotated concept
  reference. Do not wire it into the app or clean up its TODOs unless that is
  the requested task.
- `CONTEXT.md` changes only when durable project truth, an accepted decision,
  provenance, or an open-item status changes. Include it in the initial change
  envelope when the task demonstrably closes an open item; any other addition
  to its scope requires the user's approval.
- There is no framework, package manager, npm workflow, or build step. Do not
  introduce one or add a runtime dependency without explicit approval.
- The page already loads two CDN stylesheets: Google Fonts and pinned
  `mana-font@1.18.0`. The mana-font base set supplies `--b`, so changing either
  URL or the pinned version requires explicit approval. Adding a third runtime
  dependency does too. The Google Fonts URL is the explorer's exact family and
  weight set (Owner approval, 2026-09-27); keep the two pages' URLs identical.
- Do not move the five crossing coordinates. Their positions encode the
  four-colour exclusion proof. Reduce marker size if crowding is the problem.
- Keep the app static at rest. No ambient animation, animation loop, particle
  system, or decorative motion. When reduced motion is requested, skip the
  effect rather than slowing it.
- Preserve the fixed type roles and the illustrated field-guide visual system
  in `CONTEXT.md`, which replaced glass-over-colour on 2026-10-01. Mana colours
  are data, not decoration. The unresolved `--g` and `--c` values are not an
  invitation to retune them.
- Edge emphasis is carried by opacity, stroke width, and glow together so the
  rest, related, and unrelated states remain distinct without extreme alpha.
  Do not collapse this model to opacity alone.
- The primary-source corpus is outside this repository, in the sibling
  `../voxmana.io/docs/research/canon/` directory. If it is unavailable, copy
  verification is blocked, not passed. The file
  `canon-inventory-four-color-reference-audit.md` there is explicitly not a
  source; see `CONTEXT.md` under Source cautions.

## Shared change control

Every implementation or QA pass uses `HANDOFF.md` as the current task ledger.
Keep one active task in it; git history is the archive.

Before editing product code, `robdev` records:

- the requested outcome;
- the allowed files and surfaces;
- explicit non-goals;
- observable acceptance criteria;
- the proportionate test plan.

The envelope is the smallest file set and surface set that satisfies the user's
request. `robdev` drafts it; the user or coordinating main agent owns it.
`robdev` cannot authorize its own expansion. A clear user request authorizes
work inside the smallest reasonable envelope, so do not ask for redundant
approval.

Widening the envelope after work begins is recorded under `Decisions needed`
and waits for the user's answer. Adding any file not named in the original
envelope is always a pause. Also pause for a new dependency; a change to an
existing dependency URL or pinned version; a new architecture or file format;
a new product or content decision; an unverified colour or name; unsupported
player-facing lore; a change to any colour token or type role; a direct
quotation; or a `CONTEXT.md` change beyond ticking an open item the task
demonstrably closed.

Do not perform opportunistic cleanup. If a useful adjacent issue is discovered,
record it under `Follow-ups` in `HANDOFF.md` and leave it unchanged. Preserve
unrelated user edits and inspect `git status` plus the relevant diff before and
after work.

Legal statuses and transitions are:

- `complete -> idle` when the ledger is reset for the next task.
- `idle -> dev-in-progress -> ready-for-qa -> qa-passed -> complete` for a
  successful task.
- `dev-in-progress -> awaiting-decision -> dev-in-progress` when the user
  answers a scope or product question. If the user cancels, the coordinating
  agent records that decision and may reset `awaiting-decision -> idle`.
- `ready-for-qa -> qa-failed -> dev-in-progress` when QA finds a defect.
- `ready-for-qa -> qa-blocked -> ready-for-qa` when missing evidence becomes
  available.
- `qa-blocked -> complete` only when the user explicitly accepts the named
  missing evidence in the current conversation.

No other transition is allowed. On rework, `robdev` addresses only the recorded
defect; a scope change still follows the decision gate above. Only the user or
the coordinating main agent marks `complete` or resets the ledger to `idle`.

For implementation work, the coordinating agent assigns `robdev` first and
`robqa` only after the handoff reaches `ready-for-qa`. They never edit the
product concurrently. If one session must perform both roles, it finishes the
developer report, deliberately switches to the QA contract, and re-reads the
diff from the acceptance criteria rather than relying on its implementation
notes.

## Role: robdev

`robdev` owns implementation. It may edit only the files declared in the
handoff's change envelope.

### Development rules

- Read the entire local component or function path before editing it. In this
  single-file app, check the related markup, CSS, data, event handling, route
  handling, and responsive/reduced-motion rules rather than patching an
  isolated selector blindly.
- Edit `vox-color/color-wheel.html` directly. Do not regenerate it.
- Prefer the existing data flow: content lives in `D`, `IDENTITIES`, `ALIASES`,
  or the relevant source constant, and renderers derive panels and tiles. Do
  not hand-copy a second version of the same identity text into markup.
- Preserve `display` as the authoritative conventional colour order; canonical
  WUBRG membership keys remain derived from it.
- Preserve the invariants already asserted in the page: 32 unique identities
  and 37 rendered tiles including aliases.
- Treat Explore and Combine as distinct modes. Combine temporarily owns wheel
  geometry; returning to Explore must restore its previous layer state.
- Keep hash routes working from a directly opened file. Existing routes include
  `#combine=WUR`, `#color=W`, `#ally=WU`, `#enemy=WB`, and `#four=W`.
- Interactive SVG targets must remain mouse, keyboard, and visible-focus
  operable. New decoration is `aria-hidden`; new controls need an accessible
  name and correct state semantics.
- Escape data that reaches generated HTML using the existing `esc` path. Do not
  add raw player-facing strings to `innerHTML` without checking that boundary.
- For copy or lore, follow the source hierarchy and cautions in `CONTEXT.md`.
  Paraphrase by default; adding any direct quotation requires explicit user
  approval as well as all quotation rules in `CONTEXT.md`. Do not turn a
  faction, character, mechanic, or community reading into a universal
  colour-pie claim.

### Developer handoff

Before setting `ready-for-qa`, `robdev`:

1. Reviews the final diff for scope creep and accidental generated/reference
   edits.
2. Runs the checks required by the impact matrix below and records exact
   results, including skipped checks and why.
3. Writes a compact implementation report in `HANDOFF.md`: changed files,
   behavior, decisions, risks, and manual verification still needed.
4. Leaves product code untouched after handoff unless QA returns a defect or the
   task scope changes.

## Role: robqa

`robqa` owns independent verification. It writes to `HANDOFF.md` and to no
other file. It does not edit product code, `CONTEXT.md`, instructions,
generators, references, or any other repository file, including to fix a defect
it has just found.

### QA rules

- Start from the user's acceptance criteria, then inspect the diff and the
  surrounding behavior. Do not merely repeat the developer's test report.
- Confirm every changed file is inside the declared envelope and every claimed
  check has evidence. Evidence states what was run, where it was run, and the
  observed result, quoted or captured concretely; an assertion that a check
  passed is not evidence.
- Test objective behavior (routes, DOM state, focus, console) in a real
  browser when the task affects rendering, interaction, routing, focus, or
  motion; appearance and feel are the Owner's call (see the robqa skill).
  Direct `file://` behavior matters for the standalone Color Wheel,
  especially hash assignment. The integration
  shell is verified over local HTTP.
- Separate defects from preferences. A defect needs a concise reproduction,
  expected result, actual result, impact, and the smallest relevant evidence.
- Use severity `blocker`, `major`, `minor`, or `note`. `blocker` and `major`
  fail QA. A `minor` fails QA when it violates an acceptance criterion or a
  repository invariant; otherwise record it as a follow-up. Notes never fail a
  pass.
- If an environment prevents a required check, report `blocked`, not `passed`.
  Set `qa-blocked`, name the missing evidence, and give the exact check a human
  must perform.
- On failure, update `HANDOFF.md` and return the task to `robdev`. Do not expand
  the repair beyond the failed criterion.

## Verification by impact

`git status --porcelain` is the authority on which paths changed. For tracked
files, run `git diff --check` and inspect `git diff --stat` plus the full
relevant diff. Git diff does not include untracked files: inspect each one in
full and use `git diff --no-index --check -- NUL <file>` on Windows (or
`/dev/null` elsewhere). Exit code 1 is expected when the two inputs differ. The
repository's LF-to-CRLF warning is expected and is not itself a whitespace
defect; do not disregard other whitespace output.

Then classify the change with `.claude/skills/robqa/SKILL.md` (QA-0 to QA-5)
and apply its cost gate. The rows below are a menu, not a checklist: run only
the items that exercise behaviour the diff changed, at the depth its class
requires. Visual judgement goes on the Owner's checklist.

### Copy, source, or identity data

- Confirm the statement is supported by the hierarchy in `CONTEXT.md` and that
  scope language distinguishes colour philosophy from faction, character,
  mechanic, and community interpretation.
- Verify against the sibling source corpus, not model memory or a search
  summary. If the required source is unavailable, set `qa-blocked`.
- Confirm conventional order comes from `display`, canonical keys remain
  unique, the browser console has no failed 32/37 assertions, and the same
  registry-driven content agrees between panel and atlas.
- Check punctuation, attribution, and the exceptional direct-quotation rules.

### CSS, layout, or visual treatment

- Check a narrow phone viewport near 360 px, an intermediate viewport near
  768 px, and a desktop viewport.
- Check long panel copy, the wheel/atlas boundary, focus indicators, hover and
  selected states, and that information is not available only on hover.
- Check both normal and `prefers-reduced-motion: reduce`. The reduced setting
  must remove optional movement.
- Confirm the page remains readable and operable when the CDN stylesheets are
  unavailable, or record that check as blocked rather than silently skipping
  it.

### JavaScript, interaction, or routing

- Load `vox-color/color-wheel.html` directly in a real browser and confirm no
  console errors or failed assertions.
- In Explore, exercise a vertex and its two face arcs, an ally edge, an enemy
  chord and its college lens, a crossing, layer toggles, Clear, and Escape.
- Repeat representative SVG activation with keyboard Enter and Space; verify
  visible focus and sensible focus return.
- In Combine, activate the colourless centre mark and add and remove colours
  through representative 0/1/2/3/4/5-colour states, use neighbour chips where
  affected, then return to Explore and confirm its prior layer state is
  restored.
- Confirm panel updates remain announced through its polite live region and
  atlas tiles remain outside the tab order.
- Exercise every affected hash family, plus browser back/forward. For route
  work on the Color Wheel, explicitly verify a directly opened `file://` page;
  for the integration shell, verify over local HTTP.

### Geometry or wheel emphasis

- Verify all five vertices, ten face arcs, five ally edges, five enemy chords,
  five crossings, and the Combine-only colourless centre mark remain present
  and correctly associated with their state where enabled.
- Confirm each crossing still identifies one distinct excluded colour and that
  exactly the two passing chords highlight for it.
- Check rest, related, and unrelated emphasis without changing topology.

### Documentation-only changes

- Verify referenced paths and commands exist, current guidance does not repeat
  stale pre-merge assumptions, and the instructions do not claim checks that
  the repository cannot run.

## Completion standard

A task is ready to complete only when the diff stays inside the declared
envelope, acceptance criteria are met, required checks have recorded evidence,
QA has passed, or QA is blocked only by a limitation the user explicitly
accepted in the current conversation. Record that acceptance under `Decisions
needed`. `HANDOFF.md` must contain no unresolved blocker or major defect.
