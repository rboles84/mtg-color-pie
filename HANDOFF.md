# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `complete`. **Owner accepted, 2026-10-02**, at the accepted
  planning candidate, commit `eb4f1a0`
  (`eb4f1a0df7f7f683ec51b5546db6eaf302edf241`).
  - **The Owner's words:** "The revision 6 product definition, including the
    R6-F1 factual correction, is ACCEPTED. The QA evidence is sufficient."
  - **Candidate:** `PRODUCT-DEFINITION.md` revision 6 with the R6-F1 header
    correction (sha256 `95c5224f…44fd978a`), plus this `HANDOFF.md` at
    `qa-passed`. Both were committed in `eb4f1a0`; `PRODUCT-DEFINITION.md`
    entered Git there. Revision 6 corrects D1–D5, N1 and N2 from the failed
    QA on revision 5. See "Correction (revision 6)".
  - **After acceptance:** `PRODUCT-DEFINITION.md` was not changed. The only
    later commit is this `HANDOFF.md` close-out (status and hash), as in the
    previous story.
  - **Not affected:** no product decision is open. The product definition is
    decision-complete.
  - **Next:** "The Color Pie — Gate A: source-purity cleanup of both
    instruments", exactly as `PRODUCT-DEFINITION.md` §18 defines it, starting
    with Step 0 recon (§18.4).
    - It runs in a fresh session and has not started.
    - The ledger stays at `complete` until that task resets it to `idle`.
  - **Transition history:**
    - Revision 1: `complete -> idle -> dev-in-progress -> awaiting-decision`.
    - Revision 2: `-> dev-in-progress` (Owner decisions, 2026-10-01)
      `-> awaiting-decision`.
    - Revision 3: `-> dev-in-progress` (Owner decisions, 2026-10-02)
      `-> awaiting-decision`.
    - Revision 4: `-> dev-in-progress` (final Owner decisions, 2026-10-02)
      `-> ready-for-qa`.
    - Revision 5: the Owner sent final corrections to §18 at `ready-for-qa`,
      before any QA had run.
      - The transition table has no edge for Owner corrections before QA.
      - So the corrections were applied to the candidate in place, and the
        status stays `ready-for-qa`.
      - The candidate `robqa` verifies is revision 5.
    - QA on revision 5: `ready-for-qa -> qa-failed` (`robqa`, 2026-10-02).
    - Revision 6: `qa-failed -> dev-in-progress` (Owner direction on the QA
      findings, 2026-10-02) `-> ready-for-qa`.
    - QA on revision 6: `ready-for-qa -> qa-passed` (`robqa`, fresh session,
      2026-10-02).
    - R6-F1 correction: `qa-passed -> ready-for-qa` (Owner direction,
      2026-10-02).
      - The `AGENTS.md` table has no edge out of `qa-passed` except
        `complete`.
      - The Owner directed this transition explicitly, for the one
        correction only, as with the revision 5 precedent above.
    - QA on the R6-F1 correction: `ready-for-qa -> qa-passed` (`robqa`,
      2026-10-02). Run in the correcting session on the Owner's instruction
      (see "QA re-test (R6-F1)").
    - Acceptance: `qa-passed -> complete` (the Owner, 2026-10-02), at
      `eb4f1a0`.
  - **No integration or product implementation has begun.**
  - The previous story, "Colour wheel — field-guide restyle", was accepted on
    2026-10-01 at `421a75c`; its ledger is in git at `7fa0e83`. It is not
    reopened.
- Owner: the Owner. Coordinating agent, acting as `robdev` for this
  documentation story: product definition, source-purity audit and the
  revision 6 correction (no product code). `robqa`: the revision 5 pass
  (`qa-failed`) and the independent revision 6 re-test (`qa-passed`, fresh
  session) are recorded below. The session that ran the revision 6 re-test
  then made the R6-F1 correction under Owner direction. The ledger had
  planned a different `robqa` session for the check of that correction. The
  Owner instead directed this session to run the narrow re-test, as
  `AGENTS.md` allows for one session in both roles. No session is assigned
  to Gate A yet.
- Task: **The Color Pie: product definition.** Define how the two accepted
  instruments become one public product, and audit both for source purity
  before any integration. Hosting location is out of scope.
- **Owner decisions, 2026-10-01** (second review, in the Owner's terms):
  1. **One public product** with **two internally isolated instruments**:
     `vox-color/color-wheel.html` and `vox-color/mechanical-explorer.html`.
     Their JavaScript, CSS, routers, keyboard handlers and state models are
     not merged for V1.
  2. Working title **The Color Pie**. Primary view labels **Color Wheel** |
     **Mechanical Color Pie**.
     - `WUBRG` may be only a small notation or accent, if source-safe; it is
       not approved as a title.
     - Atlas, Field Guide, Codex and MTG Tools are not the title.
     - Marketing copy is not finalized.
  3. **The landing-page interpretation in revision 1 is rejected.** The visitor
     sees one product about one subject, not a page sending them to two
     others.
  4. **V1 has no automatic state synchronization.**
     - Selecting colors in either instrument never changes the other.
     - View switches fabricate no shared state.
     - Each instrument keeps its own state across a switch if the mechanism
       allows it cleanly; any cost is documented.
     - Future bridges are explicit user actions and are later work.
  5. **Source purity is a hard acceptance contract.** Every substantive
     player-facing statement is Official, Computed (visibly labelled) or
     Navigation (visibly marked, never evidence or explanatory prose).
  6. **Vox Mana interpretation is prohibited** in the product: ontology,
     derived philosophy, identity interpretations, mechanical interpretation,
     inferred bridges, unsourced names, invented lore, and proprietary taxonomy
     presented as Wizards'. Hosting does not make Vox Mana an editorial
     authority, and the subject is never framed as authored by Vox Mana.
  7. **Existing standalone acceptance does not grandfather** non-source
     content.
  8. **Four-color community interpretation** must be officially sourced or
     removed before integration.
  9. **Unverified alternate names** derived from cards or community convention
     are removed and not carried forward.
  10. **Vox-derived mechanical taxonomy** (the 23 families) may remain internal
      metadata. It may not masquerade as official taxonomy.
  11. **Player terms are navigation only.** **Computed material stays
      labelled**, and is never strength, rank or a Rosewater conclusion.
  12. **The exact V1 integration mechanism is to be recommended in this pass**,
      with one fallback, so implementation does not begin with an architecture
      decision.
  13. The disabled "Mechanics — not wired" control is hidden in integration.
      The preview Mechanics code is not refactored or deleted there; its
      removal is a separate story.
  14. **`mechanical-periodic-table.html` remains outside scope**: prototype
      only, outside production navigation, the product, the source-purity
      work and the dependency graph.
  15. **Sequencing is gated**: A (source purity), B (shell), C (Color Wheel),
      D (Mechanical Color Pie), E (explicit cross-links). The gates are never
      combined into one story.
- **Owner decisions, 2026-10-02** (third review):
  1. **Direction approved.** The product-definition direction is approved, and
     so is the conclusion that **Gate A (source purity) comes before any
     integration**. The exact Gate A story is not yet approved.
  2. **V11 needs deeper treatment.**
     - For each of the five conflicts, determine whether the tier used in
       computation has official authority or is a Vox adjudication, and which
       computed surfaces depend on it.
     - A Vox-selected tier that feeds counts, best placement, comparisons,
       deltas or compass results makes those outputs not purely computed from
       official source, even when the conflict is disclosed.
     - Choose no new tier, and change no data or implementation in this
       story. Bring any unresolved case as one consolidated decision.
  3. **V6 is refined.** Purely geometric crossing correspondence (four
     included colors, one excluded) may be classed as computed from
     official/accepted diagram structure. Claims about what a four-color
     identity means, or implying Wizards defines identities through the
     crossings, need official sourcing or removal.
  4. **V16: route guard in Gate A**, not deferred to release.
     - The old preview Mechanics code stays untouched, and the production
       toggle stays hidden or disabled.
     - `#mechanics=…` must not activate the Vox-family preview in production.
     - The invariant change is documented. The code is kept for a later
       explicit retirement story.
  5. **Intended Gate A treatments**, unless source verification proves
     otherwise:
     - **Remove** the four-color "Community typically reads it as…" prose.
     - **Remove the alias treatment** that makes Strixhaven colleges guild
       names.
     - **Remove or replace** the Vox-authored connective interpretation in the
       five-color and colorless material, with officially sourced statements
       only.
     - **New Capenna** names stay only as an explicitly separate official
       faction lens, never as alternate shard names.
     - **Pair "What it costs" / "How they work together"** lines stay only
       with the official sources that actually support them.
     - **Rename** atlas "Tier 1–6", so "tier" is reserved for Primary /
       Secondary / Tertiary.
     - **Remove** the Vox Mana kickers from the content authority frame on
       both instruments. Hosting attribution may remain outside the subject
       matter.
     - **Remove** interpretive `relWhy` prose, or reduce it to
       non-interpretive navigation metadata.
     - **Remove** reader-facing internal or source-maintenance instructions.
     - **Rewrite** "No combination name is used for four or five colors" as a
       claim about this page.
     - **Tier explanation:** keep the anti-ranking safeguard. Replace the
       inaccurate absolute wording with source-faithful language that keeps
       Primary / Secondary / Tertiary as categories, never turned into a
       numeric strength score.
  6. **The gate sequence stands.** Gate A must contain every required cleanup
     and no integration work. Gate A does not start yet.
- **Final Owner decisions, 2026-10-02** (revision 3 approved; these make the
  definition decision-complete):
  1. **Gate A (source purity) is required before any integration.**
  2. **V11b uses two coherent source readings of the Mechanical Color Pie:**
     the color-list reading and the ability-catalog reading.
     - **The three unresolved published conflicts** vary between them:
       - Exiling cards from graveyard / White: Primary or Secondary;
       - Deal N damage to a creature with flying / Red: Secondary or
         Tertiary;
       - +N/+0 to your team (ongoing) / Black: Secondary or Tertiary.
     - **The two officially resolved conflicts** use their change-log tier in
       both readings: Flash / Black Secondary, and +N/+N (on spells) / White
       Primary.
     - **Not allowed:** per-mechanic choice, permutations, averages,
       midpoints, numeric uncertainty, a silent default, or duplicated or
       double-counted mechanics.
  3. **No Vox-selected conflict result may silently reach the player.** A
     derived result that differs between the readings shows both, labelled
     as dependent on conflicting published 2021 claims. A derived result that
     does not differ shows once, as the ordinary `computed` result. Official
     placements stay Official even where the readings agree (wording
     clarified in revision 6, D2).
  4. **One shared conflict-aware projection** inside
     `mechanical-explorer.html` feeds every player-facing tier-dependent
     surface. Renderers hold no conflict math. The ported selection functions
     stay untouched, for fixture parity only.
  5. **Independent verification is required** for that projection. The
     existing fixtures are regression evidence for the frozen model, not proof
     of the new display.
  6. **Step 0 of Gate A verifies the conflict data contract** from the actual
     records. If both official claims cannot be reproduced, Gate A stops with
     that one structural blocker.
  7. **V6 is resolved:** geometry is derived, philosophy is not.
  8. **V16 is resolved:** the route guard is in Gate A, covering every route
     form, reload and Back/Forward. The code stays intact and the invariant
     change is documented.
  9. **U1–U7 are Gate A recon and evidence**, not Owner loops.
  10. **Gate A starts with one replacement-wording and treatment sheet** for
      Owner review. That sheet includes the V11 conflict and dual-result
      treatments.
  11. **The Color Wheel and Mechanical Color Pie cleanup lists are fixed**,
      and so are the Gate A file envelope and the behavior-preservation
      contract. All of these are in `PRODUCT-DEFINITION.md` §18.
  12. **No architecture decision remains before Gate A**, and no integration
      implementation has started.
- **Owner corrections before QA, 2026-10-02** (revision 5). These reopen no
  architecture, naming, V11, V6 or source-policy decision.
  1. **Documentation timing.**
     - During Gate A implementation, decide whether `CONTEXT.md` or
       `AGENTS.md` become factually stale.
     - Make only the scoped updates needed, before the candidate is frozen at
       `ready-for-qa`, so `robqa` verifies them as part of the candidate.
     - The same applies to `CLAUDE.md` and `MECHANICS-CONTRACT.md`.
     - No story file changes after Owner acceptance.
  2. **Contrast exception.**
     - The receded vertex labels stay the only documented exception: about
       2.73:1 (name) and 1.67:1 (goal), accepted 2026-10-01.
     - Gate A verifies they are no worse than that baseline, and may improve
       them only incidentally without changing the de-emphasis.
     - QA does not brighten them, and there is no new exception.
     - Every other ordinary text state meets 4.5:1.
  3. **The five conflicts.**
     - Step 0 confirms the conflict metadata holds exactly the five recorded
       records, and verifies each against the official source.
     - That is not proof that no other contradiction exists.
     - An additional contradiction found by the full audit is batched as one
       new Owner finding. It is never folded into the five or ignored.
  4. **New Capenna.** No new lens, mode, control, navigation surface, data
     structure or interaction. The existing presentation is relabelled as a
     separate official faction context only. This governs the word "lens" in
     the 2026-10-02 decisions above.
  5. **The projection** is a logical layer inside the existing
     `mechanical-explorer.html` script. No new JS file, no ES modules, no
     build step, no framework, and no change to deployment.
  6. **V16 canonicalization.**
     - A legacy `#mechanics=…` route lands in Explore at rest.
     - Its URL is replaced in place (`history.replaceState`, or the
       repository equivalent confirmed in Step 0). The pathname and query are
       kept, no history entry is added, and no dead hash is left.
     - There is no reactivation on load, reload or Back/Forward, and no loop.
     - Neighboring valid deep links are unaffected.
     - The exact neutral behavior is verified in Step 0.
  7. **Candidate sequence:**
     - `awaiting-decision` covers the sheet;
     - `dev-in-progress` covers implementation plus scoped rule and document
       updates;
     - `ready-for-qa` freezes the exact candidate;
     - `qa-passed` follows `robqa` on that candidate;
     - `complete` follows Owner acceptance, with no mutation after it.
  8. **`robqa` for this planning story** validates the specification itself
     (see "Test plan").
  9. **Closeout.** Update only `PRODUCT-DEFINITION.md` and `HANDOFF.md`,
     touch neither product page, do not begin Gate A, and set the status to
     `ready-for-qa`.
- **Owner direction on the QA findings, 2026-10-02** (revision 6). These are
  specification corrections only. They reopen no architecture, source-purity,
  V6, V11, V16, naming or Gate A boundary decision.
  1. **Self-test (D1).** Frozen-model parity checks stay unchanged.
     Player-facing assertions that an approved change makes factually
     obsolete, starting with `compass: WB − B counts equal the fixture`, are
     narrowly re-expressed against the conflict-aware display. The self-test
     is a smoke and contract check, not the numerical oracle.
  2. **`relWhy` (D1).** It is never rendered to the player. The internal data
     may stay, and keeping it is not a source claim.
  3. **Labels (D2).** Official placements stay Official, and navigation stays
     Navigation. Derived values stay `computed`: shown once when the readings
     agree, and as two reading-dependent outcomes when they differ.
  4. **V16 (D3).** One contract everywhere (§18.10), covering every hash
     syntax the existing router reads as the Mechanics route, as inventoried
     in Step 0. No general URL-normalization layer.
  5. **Mechanics follow-ups (D4).** The question is settled, so the "until the
     Owner sorts Mechanics" language goes.
  6. **Oracle (D5).** It never imports, executes, calls or copies production
     page code to obtain an expected result.
  7. **Neutral UI description (N2).** Wording about the page itself only. It
     is not a fourth source class, and it carries no external factual
     authority.
  8. **Roles (N1).** The stale assignment line is corrected.
  9. **Re-test.** A fresh session runs the passing `robqa` re-test. The
     correcting conversation does not.
- Requested outcome (revision 6): correct D1–D5, N1 and N2 in the two allowed
  files only; return the story to `ready-for-qa`; stop.
- Requested outcome (revision 4): record these decisions; write the final
  Gate A story in `PRODUCT-DEFINITION.md` §18; stop. No further product
  ideation.
- Requested outcome (revision 3):
  - resolve V11 with per-entry authority records and computed-surface
    dependencies;
  - refine V6;
  - record the V16 decision;
  - finalize the Gate A story;
  - then stop for one Owner review.

  Revision 2 delivered the 18-section definition and audit.
- Allowed files: `HANDOFF.md`; `PRODUCT-DEFINITION.md`.
- Not touched:
  - `color-wheel.html`, `mechanical-explorer.html`,
    `mechanical-periodic-table.html`;
  - runtime data, fixtures, `tools/`, the canon corpus;
  - `MECHANICS-CONTRACT.md`, `CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`;
  - production navigation.

  No prototype HTML.
- Non-goals: any implementation or integration; reviving the embedded
  Mechanics mode; the periodic table; utilities (Three.js, Scryfall discovery,
  Mana Base, Art Trail, Deck Art Director).

## Support files

`PRODUCT-DEFINITION.md`, revision 6, which is decision-complete. Its §18 is
the final Gate A story. Its audit sources are listed at its
foot: the canon corpus (including *Mechanical Color Pie 2017*) and Wizards
pages (including "Mechanical Color Pie 2021 Changes"). mtg.wiki refused
automated fetches and is not authority.

## Acceptance criteria

1. The document has the 18 sections the Owner listed.
2. **The audit:**
   - classifies every substantive content system of both pages;
   - records its evidence;
   - states which systems were checked exhaustively and which were sampled.
3. **Findings:** definite violations and unsupported items are listed once,
   each with a required action.
4. **Mechanism:** one recommended V1 integration mechanism and one fallback,
   each with costs and a fallback trigger.
5. **No other file changed:** `git status` shows only `HANDOFF.md` and
   `PRODUCT-DEFINITION.md`.
6. **Revision 3, V11:** each of the five conflicts records:
   - the conflicting official claims;
   - the tier used computationally;
   - the authority for that tier, and whether it is official or Vox-derived;
   - the computed surfaces that depend on it, measured rather than asserted.
7. **Revision 4:** the final Owner decisions are recorded, and §18 holds the
   final Gate A story with the 16 parts the Owner listed. No open decision
   remains.
8. **Revision 5:** the nine Owner corrections are applied, and the
   specification `robqa` pass below finds no blocker.
9. **Revision 6:** D1–D5, N1 and N2 are corrected without reopening a
   decision, and an independent `robqa` re-test in a fresh session finds no
   blocker or major finding.

## Test plan

This is a documentation and product-definition story. The independent
`robqa` pass validates the specification itself, not only the repository
checks.

**Repository checks:**
- `git status` shows only `HANDOFF.md` and `PRODUCT-DEFINITION.md`.
- `git diff --check` is clean.
- Referenced paths, identifiers, line numbers and routes exist in the pages
  at `7fa0e83`.
- Source claims match the corpus or the Wizards pages recorded in the audit.

**Specification checks.** `robqa` independently verifies, in
`PRODUCT-DEFINITION.md` §18 and against this ledger:
1. Every Owner decision from this thread (2026-10-01, the 2026-10-02 rounds
   and the revision 5 corrections) appears in the final Gate A definition.
2. V11 has exactly two coherent source readings, not per-record
   permutations.
3. The two change-log-resolved conflicts are not treated as unresolved.
4. The three unresolved conflicts cannot silently use the Vox adjudication.
5. One player-facing projection, an in-file logical layer, owns all
   conflict-aware computation.
6. The frozen model and fixtures are explicitly distinguished from the
   validation of the new projection.
7. V6 separates geometry from interpretation correctly.
8. V16 is guarded in Gate A, including URL canonicalization without a new
   history entry or a loop.
9. U1–U7 are verification items, not seven new Owner loops.
10. The wording and treatment sheet is a mandatory stop before any product
    edit.
11. The allowed and prohibited file envelopes do not contradict each other.
12. No integration-shell work is inside Gate A.
13. No periodic-table work is inside Gate A.
14. No file mutation after acceptance remains, in Gate A or in this story.
15. No resolved architecture or naming decision has leaked back into
    "Decisions needed".
16. The transition runs deterministically from sheet approval, through QA on
    the exact frozen candidate, to Owner acceptance.
17. The receded vertex-label exception is the only contrast exception, and
    Gate A neither worsens nor reopens it.
18. `PRODUCT-DEFINITION.md` and `HANDOFF.md` do not contradict each other.

**Rules for this pass:**
- `robqa` edits no product file, and writes only to `HANDOFF.md`.
- **Documentation defects:** `robqa` records them. The coordinating agent
  corrects them (`ready-for-qa -> qa-failed -> dev-in-progress ->
  ready-for-qa`) before the planning candidate is accepted, and `robqa`
  re-runs the affected checks.
- **A substantive unresolved product decision** is returned as a blocker. It
  is not decided inside QA.
- **Re-test of revision 6.** A fresh session runs the full specification pass
  (checks 1–18), because the revision 5 pass was not session-independent. It
  also confirms that D1–D5, N1 and N2 are closed (see "Correction (revision
  6)").

## Step 0 recon

Done 2026-10-01 against `7fa0e83`. The architecture facts are in
`PRODUCT-DEFINITION.md` §8 and the audit in §5–§7.

**Headline findings:**
- **Wheel violations:** 9, including the five four-color community lines,
  colleges equated with guilds, the five-color argument prose, scope notes
  misattributed to Rosewater, and the 2005–06 guild series miscited as
  2016/2017.
- **Explorer violations:** 6, including a tier gloss that contradicts the
  Primary definition, adjudicated placements shown as a single Rosewater tier,
  and `relWhy` prose.
- **Preview route:** 1. It is publicly reachable and presents the Vox
  families as Rosewater's.
- **Unsupported items:** 7.
- **The explorer already runs without Vox taxonomy**, and its self-test
  enforces that.
- **V11, revision 3, done 2026-10-02** (`PRODUCT-DEFINITION.md` §5.3).
  - **Evidence:** "Mechanical Color Pie 2021 Changes" (Wizards, fetched) and
    the 2017 article (corpus).
  - **Two tiers are official.** The change log states Flash Black Secondary
    and +N/+N (on spells) White Primary.
  - **Three tiers are Vox adjudications:**
    - Exiling cards from graveyard / White;
    - Deal N damage to a creature with flying / Red;
    - +N/+0 to your team / Black.

    The 2021 lists and catalog disagree, the change log is silent, and the
    2017 article has the same split. Only the standing "catalog wins" rule
    chooses.
  - **What depends on them,** recomputed under the other claim from the
    runtime data: best placement or buckets in 22 of the 31 lens selections,
    and 24 of the 150 compass steps shown. Placement-existence counts are
    unaffected.

## QA (`robqa`, 2026-10-02)

**Verdict: `qa-failed`** on the exact planning candidate:
`PRODUCT-DEFINITION.md` revision 5 plus this `HANDOFF.md`, as found before
this section was added.

**Independence.** This pass ran in the same conversation that wrote the
candidate, so it is **not session-independent**. To offset that:
- every check was re-derived from the files on disk;
- the numbers came from new code written for this pass (scratchpad
  `qa_oracle.py`);
- the change log was fetched again.

The author's notes were not relied on.

**Envelope (passed):**
- **Changes.** HEAD is `7fa0e83`. `git status`: ` M HANDOFF.md`,
  `?? PRODUCT-DEFINITION.md`, and nothing else.
- **Untouched.** There is no diff under `vox-color/`, `data/`, `tools/`,
  `docs/`, `MECHANICS-CONTRACT.md`, `CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`,
  `PHYREXIA-PLAN.md` or `PROMPT.md`. The sibling canon corpus is clean.
- **Wheel hash.** `color-wheel.html` sha256 `c9a7752e…a8db605ea` equals the
  accepted production hash.
- **No shell, no Gate A.** No `vox-color/index.html` exists, and Gate A has
  not started.
- **Whitespace.** `git diff --check` and `git diff --no-index --check` on the
  untracked file print nothing beyond the expected LF→CRLF warning.
- **Gates.** `check_invariants`, `check_taxonomy`, `check_recon` and `gate`
  all exit 0. These check data, not the specification.
- **Candidate.** The revision line reads "This is revision 5".

**Facts re-derived (passed):**
- **The five conflicts.** The runtime has exactly 5 `adjudicated`
  placements. The basis counts are 450 both-agree, 7 catalog-only and 5
  list-only.
- **List and catalog claims.** The claims of the three unresolved records
  match the §18.8 table. The change-log authority sits only on Flash / Black
  and +N/+N (on spells) / White. The runtime's Flash list claim is
  `tertiary`, as §18.4 says.
- **Change log (fetched again).** Flash NEW reads "Secondary: White, black,
  and green". +N/+N (on spells) OLD and NEW both read "Primary: White and
  green". None of the other three appears.
- **The 22 and 24 figures.** An independent oracle, under the two coherent
  readings, finds 22 of 31 selections with a differing best placement (bucket
  totals also differ in 22) and 24 of 150 displayed steps with a differing
  category. These are identical to the per-entry-swap sets in revision 3.
- **Invariance.** Placement existence and "newly / no longer placed" do not
  change under either reading.
- **Citations.** Every identifier and string the spec cites exists in the
  pages, including the hero lede across lines 1137–1138 and `'Tier ' + t.n`
  at line 3499. Self-test family checks are at lines 1932–1937 and
  `has_restriction` is at line 864. The wheel asserts 32 identities and 37
  tiles; V2 keeps the 37 tiles.

**Specification checks.**
- **Passed:**
  - Product boundary: one experience, two isolated instruments, no shell,
    periodic table, Three.js or utilities in Gate A.
  - The source contract: classes, no grandfathering, no gap-filling,
    community content not treated as official.
  - V11: exactly two readings; the resolved and unresolved sets are not
    blurred; every prohibited mechanism is listed.
  - The single in-file projection.
  - Fixtures distinguished from validation of the new display.
  - Recorded-conflict wording, and new contradictions sent to the Owner.
  - V6.
  - The §18.10 route-guard list.
  - New Capenna scope.
  - The U1–U7 procedure.
  - The mandatory sheet stop, with the full V11 list.
  - The file envelopes.
  - Documentation timing, with no change after acceptance.
  - The contrast exception.
  - Behavior preservation.
  - The §18.16 transitions and the QA-failure path.
  - "Decisions needed" holds no settled item.
- **Failed:** D1–D5 below.

**Defects.** Each one is returned for correction, and none is fixed here.

- **D1 (major). The self-test contradicts the V11 display, and nothing says
  how to resolve it.**
  - **What the spec says.** §18.13 requires the explorer self-test to "still
    pass on its 11 goldens and 75 recon transitions". §18.9 keeps the ported
    functions byte-identical.
  - **What the self-test does.** It also has DOM assertions tied to the old
    adjudicated display and to content Gate A removes:
    - `compass: WB − B counts equal the fixture` (`mechanical-explorer.html`
      line 2069) reads the displayed WB − B counts and compares them with
      fixture 02. That fixture encodes the catalog rule. `−B WB` is one of the
      24 steps that differ between the readings (re-derived above). So the
      approved two-reading display cannot satisfy this assertion without
      showing the catalog reading as the single answer.
    - `terms: every group with related entries says why they are related`
      (line 1985) requires `relWhy` data, which V12 may remove.
  - **What is missing.** The spec does not say:
    - whether Gate A may change self-test assertions;
    - which assertions are frozen regression evidence and which are display
      checks to re-express;
    - how such changes are recorded;
    - whether `relWhy` stays as internal, unrendered data or is deleted.

    Revision 3 had a line for this; revisions 4–5 dropped it. Gate A would
    hit this at once (QA item 18: a hidden decision).
  - **Correction.** Say that the function-level parity assertions (fixtures
    called through the ported functions, and the 75 transitions) stay
    unchanged. DOM-level assertions that encode the old adjudicated display or
    removed content are re-expressed against the approved display, for
    example WB − B checked against the two-reading oracle. Each change is
    listed in HANDOFF. Also state the `relWhy` data disposition.
- **D2 (minor; it breaks the source-class contract). "Same result" is
  labelled `computed` too broadly.**
  - **What the spec says.** §18.8 reads "Same result: show one ordinary result
    labelled `computed`". HANDOFF final decision 3 reads "A result that does
    not differ shows once, as `computed`".
  - **Why it's wrong.** §18.9 makes placements (official records) projection
    outputs. Read literally, these lines would label official placement
    notation `computed`. That contradicts §4 (Official versus Computed) and the
    Owner's actual rule: "show the normal single result", and results "may
    continue to be labelled computed".
  - **Correction.** Same-result outputs render exactly as today: official
    placements as official, computed results with their existing `computed`
    label, and no new labels.
- **D3 (minor). V16 wording outside §18.10 is stale.**
  - **§6 V16.** It says a "single constant gate" makes `#mechanics=…` fall
    through to Explore at rest "as any unknown key does today". Today an
    unknown key leaves its hash in the URL. That contradicts §18.10 and Owner
    correction 6: replace the URL in place, and leave no dead hash.
  - **§16 risk 5.** It reduces the QA check to "falls through to Explore".
  - **Correction.** Align both with §18.10.
  - **Precision, not a separate defect.** Name bare `#mechanics` (no `=`) and
    percent-encoded forms in the route forms and tests. `applyHash` decodes
    before routing, so both reach the same branch. The gate's location already
    covers them.
- **D4 (minor). HANDOFF Follow-ups are stale and contradict the decisions.**
  - "Mechanics mode and the explorer — the Owner is working out how Mechanics
    mode fits the explorer. Until then it stays off and unedited." This
    contradicts the 2026-10-01 decision 13 and the final decisions: the old
    mode is not revived, it gets a retirement story, and Gate A edits its
    route entry.
  - Two qualifiers imply the same open question: "deferred until the Owner
    has sorted Mechanics" (periodic-table restyle) and "leave until the Owner
    sorts Mechanics" (the orphaned `mcp*` lines).
  - **Correction.** Reword these to the decided state.
- **D5 (minor). Nothing stops the oracle sharing production code.**
  - **What the spec says.** §18.13 asks for "a separate implementation" that
    "never compares the projection with itself". But §18.9 lets the
    projection reuse the ported functions.
  - **The gap.** Nothing stops a harness from calling the same page code in
    the browser (`access`, `deltaAdd`, the `window.VMX` api). As written, the
    oracle could share production's core logic, which is the Owner's explicit
    fail condition.
  - **Correction.** The oracle must not execute or import page code. It reads
    only the data files, and compares its results with the rendered DOM text
    and accessible names.

**Notes (not failing):**
- **N1.** "No `robdev` or `robqa` assignment yet" (Control) is stale once this
  pass is recorded.
- **N2.** §3.1 names three content classes, but §18.5 adds "Neutral page
  description", which §3.4 permits. Consider naming it in §3 and §4 so it
  can't be read as outside the contract.
- **N3.** §18.8 treats the 12 single-section placements (list-only and
  catalog-only) as non-conflicts. That is consistent with the Owner's
  two-reading definition and the frozen source layer. If Gate A's full audit
  judges an omission substantive, §18.4 step 6 routes it to the Owner.
  Residual risk only.
- **N4.** This pass is not session-independent (see Independence). Gate A's
  own `robqa` must run in a separate session, as §18.14 requires.

## Correction (revision 6, coordinating agent, 2026-10-02)

The coordinating agent corrected the documentation candidate under the
Owner's direction on the QA findings. Only `PRODUCT-DEFINITION.md` and
`HANDOFF.md` changed. The QA section above is left as `robqa` wrote it.

| Item | Where corrected in `PRODUCT-DEFINITION.md` |
|---|---|
| **D1** self-test contract | §18.13 "Explorer self-test": A (frozen-model parity, unchanged) and B (source-aware display checks, narrowly updated), the named `WB − B` treatment, the `relWhy` rule, and the HANDOFF record of each change. §18.4 step 9 (self-test inventory); §18.12 (expected changes); §16 risk 12 |
| **D1** `relWhy` | §4 (internal metadata); §6 V12 and §18.7 item 5: never rendered, internal data may stay, retention is not a source claim |
| **D2** `computed` | §18.8: labels follow the source class. Official placements stay Official when the readings agree; derived values stay `computed`, once or as two reading-dependent outcomes. Also final decision 3 above |
| **D3** V16 | §6 V16, §8 router note and §16 risk 5 now point to the one §18.10 contract. §18.10 covers every form the router reads as the Mechanics route. §18.4 step 8 inventories the parser. §18.13 lists the minimum probes. The preview code stays physically present |
| **D4** Mechanics follow-ups | Follow-ups in this file: the settled state replaces "the Owner is working out…" and both "until the Owner sorts Mechanics" qualifiers |
| **D5** oracle | §18.13 "Method", "Independence", "Comparison" and "Fixtures"; §18.14 points to them |
| **N1** roles | The Owner line in Control |
| **N2** neutral UI description | §3 items 1 and 4; §4 (not a fourth source class, no factual authority); §18.5 sheet label; §18.6 and §18.11 use the one term |

**Static checks run on the corrected candidate:**
- `git status --porcelain` shows only ` M HANDOFF.md` and
  `?? PRODUCT-DEFINITION.md`. There is no diff under `vox-color/`, `data/`,
  `tools/`, `docs/` or the rule files.
- `git diff --check`, and the no-index check on the untracked file, are clean.
- The stale phrases ("falls through", "as any unknown key does today", "the
  Owner is working out", "sorts Mechanics", "has sorted Mechanics", "No
  `robdev` or `robqa` assignment", "Neutral page description",
  "page-descriptive") now appear only as quotations of the old wording: in
  the QA section, the Owner direction above and this record.
- Section cross-references resolve: §18.4 steps 8 and 9, §18.10 and §18.13.
- The self-test lines cited (1922, 1985, 2039, 2069) and the router facts in
  §18.4 step 8 were read from the pages at `7fa0e83`. No page was edited.

**Observed, not corrected (outside the correction scope):** the
`PRODUCT-DEFINITION.md` header says "Earlier revisions are in git", but the
file is untracked, so no revision of it is in git yet.

## QA re-test (revision 6, `robqa`, 2026-10-02)

**Verdict: `qa-passed`.** No blocker, major, or failing minor finding.

**Candidate checked:**
- `PRODUCT-DEFINITION.md` revision 6: untracked, 1340 lines, sha256
  `2c63746a…984f8b66`.
- This `HANDOFF.md` as found before this section and the Control and Owner
  status lines were written: 701 lines, sha256 `1f9d87bd…06358923fa`.

**Independence:**
- This is a fresh session. It wrote no revision and did not rely on the
  authoring notes or the revision 5 QA numbers.
- The numbers come from a new oracle, scratchpad `qa_oracle_r6.py`:
  - It reads only `data/` files.
  - It imports or executes no repository code: no page JS and no
    `tools/selection.py`.
  - Its selection semantics were written from the prose in
    `MECHANICS-CONTRACT.md` §4.
- The change log was fetched again.

**Repository evidence (passed).** These prove the data and the envelope, not
the specification.
- **Envelope:**
  - HEAD is `7fa0e83`.
  - `git status --porcelain --untracked-files=all` shows ` M HANDOFF.md` and
    `?? PRODUCT-DEFINITION.md`, and nothing else. The only ignored path is
    `tools/__pycache__/`.
  - `git diff --stat HEAD` over `data tools vox-color docs`, the four rule
    files, `PHYREXIA-PLAN.md` and `PROMPT.md` is empty.
  - No `vox-color/index.html` exists.
  - The canon corpus has no change under `docs/research`
    (`../voxmana.io` HEAD `3657a224`).
- **No Gate A work:**
  - `git hash-object` equals the HEAD blob for `color-wheel.html`
    (`3099723a`) and `mechanical-explorer.html` (`cd3bf6c5`).
  - The wheel's sha256 is `c9a7752e…a8db605ea`.
  - The explorer's working copy is CRLF (`i/lf w/crlf`). Its LF-normalized
    sha256 equals the HEAD blob's (`e5b08803…`).
- **Whitespace:**
  - `git diff --check` exits 0 and prints only the LF→CRLF warning.
  - `git diff --no-index --check` on `PRODUCT-DEFINITION.md` exits 1 (the
    inputs differ) with no whitespace output.
- **Gates:**
  - `check_invariants`, `check_taxonomy` and `check_recon` (53 assertions)
    exit 0.
  - `gate.py` exits 0 and prints nothing; it is a library module.
- **Static check:** `node --check` on the extracted inline script of each page
  exits 0.

**Critical facts, re-derived independently:**
- **The five records.**
  - The runtime has exactly 5 `basis: "adjudicated"` placements out of 467:
    450 both-agree, 7 catalog-only and 5 list-only.
  - No `conflict` or `ruling` key exists outside those 5.
  - The runtime equals `mcp2021.reconciled.json` on every shared placement.
    Reconciled has one extra, the `structural_only` "Putting cards from
    hand…" / G.
- **The two source claims, read from the raw files** (`mcp2021.lists.json`,
  `mcp2021.abilities.json`), not from the runtime:

  | Record | List claim | Catalog claim |
  |---|---|---|
  | Exiling cards from graveyard / W | Primary | Secondary |
  | Deal N damage to a creature with flying / R | Secondary | Tertiary |
  | +N/+0 to your team (ongoing group) / B | Secondary | Tertiary |
  | +N/+N (on spells) / W | Secondary | Primary |
  | Flash / B | in both B-secondary and B-tertiary | Secondary |

  The runtime keeps only Tertiary as Flash's list claim, as §5.3 and §18.4
  step 2 say.
- **The change log** ("Mechanical Color Pie 2021 Changes", fetched again):
  - It describes itself as "a detailed list of every change".
  - Flash: OLD "…Tertiary: White, black, and red"; NEW "…Secondary: White,
    black, and green / Tertiary: Red".
  - +N/+N (on spells): OLD and NEW both "Primary: White and green". Only the
    Secondary line changes, adding red.
  - The other three records are absent. Its "your team" removals concern
    `+0/+N` only.
  - The 2017 corpus (`misc/mechanical-color-pie-2017.md`, lines 731–733 and
    1081–1085) matches both OLD texts.
  - **So exactly two records are officially resolved and three are not.**
- **The 2017 split.** The corpus shows the same split for all three
  unresolved records:
  - White—Primary list (line 67) against catalog "Secondary: white" (line
    1044 ff.);
  - Red—Secondary list (line 378) against catalog "Tertiary: red" (line
    999 ff.);
  - Black—Secondary "+N/+0 to your team, ongoing" (line 287) against the
    ongoing catalog's "Tertiary: black" (line 892 ff.).
- **An extra scan, supporting evidence only.**
  - Every list entry was compared with the catalog, both by exact label and
    by fuzzy label.
  - It found no tier contradiction beyond the five.
  - Label matching is heuristic. The specification rightly does not treat
    five recorded records as five in existence.
- **The two readings (oracle).**
  - **Selections:** 22 of 31 differ in best placement, and the same 22 differ
    in bucket totals: W, B, R, WU, WB, WR, WG, UB, UR, BR, BG, WUB, WUR, WUG,
    WBR, WBG, WRG, UBR, UBG, WUBR, WUBG, WURG.
  - **Compass steps:** 24 of 150 displayed steps differ, both per mechanic and
    in the displayed counts. All 24 come from graveyard exile:
    - +B on W, WU, WR, WG, WUR, WUG, WRG, WURG;
    - +W on G, UG, RG, URG;
    - −B on WB, WUB, WBR, WBG, WUBR, WUBG, WBRG, WUBRG;
    - −W on WG, WUG, WRG, WURG.
  - **Invariant:** placement existence, "newly placed" and "no longer placed"
    are the same under both readings.
  - **150 steps** is 155 minus the five single-color removals the page does
    not render (`renderCompass` renders removals only when size > 1).
- **Per-entry swaps.** The §5.3 table is reproduced exactly:
  - Flash: 2 selections (B, BR), 10 steps;
  - +N/+N (on spells): 8 selections, 28 steps;
  - graveyard exile: the 8 listed selections, 24 steps;
  - flying damage: the 8 listed selections, 0 steps;
  - team +N/+0: the 8 listed selections, 0 steps.
- **The oracle checked against the page under test** (read-only, explorer
  over a local static server):
  - Each of the 31 compass tiles was clicked, and the 574 rendered counts
    (124 bucket, 450 step) were read from DOM text.
  - Their canonical SHA-256 (`be21b98e…`) equals the oracle's catalog reading
    exactly. The list reading differs (`a8fa78eb…`).
  - WB − B renders 50 / 14 / 30, which equals fixture 02. The list reading
    gives 50 / 13 / 31. That confirms the D1 premise.
- **Router facts (§8, §18.4 step 8).**
  - **Code:** `applyHash` decodes the whole hash, and `applyRoute` splits at
    the first `=` and matches `mechanics` exactly.
    `enableMechanicsPreview()` is called only there. The `#lay-mech` click
    handler is attached only inside it, and no mode button carries
    `data-mode="mechanics"`.
  - **Probes on `7fa0e83`:** `#mechanics`, `#mechanics=`, `#mechanics=atlas`,
    `#mechanics=zzz`, `#%6Dechanics=atlas` and `#mechanics%3Datlas` all set
    `body.proto-on`, enable `#lay-mech` and leave the hash in place.
    `#Mechanics=atlas` does not. The route is open today, exactly as the spec
    says.
- **Citations.** Every quoted page string and cited line was found:
  - the hero lede at lines 1137–1138;
  - `'Tier ' + t.n` at line 3499;
  - the kickers at wheel line 1134 and explorer line 560;
  - self-test lines 1922, 1932–1937, 1985, 2039 and 2069;
  - `has_restriction` at line 864;
  - `meta.caution`'s "Never present this…" instruction.

  The contrast baseline (2.73:1 name, 1.67:1 goal) matches decision 3 of the
  accepted ledger at `7fa0e83`.

**Specification checks 1–18 (all passed):**
1. **Owner decisions.** Every Owner decision (2026-10-01 items 1–15,
   2026-10-02 items 1–6, final items 1–12, revision 5 items 1–9, revision 6
   items 1–9) maps to §1–§4, §6, §9–§11, §14, §17 or §18.
2. **Two readings.** V11 has exactly two coherent readings (§18.8 table).
   Per-mechanic choice, permutations, averages, numeric uncertainty and a
   silent default are prohibited.
3. **Resolved records.** Flash / B and +N/+N (on spells) / W are identical in
   both readings, with change-log authority (§18.7 item 2, §18.8).
4. **Unresolved records.** These three cannot silently take the Vox tier:
   - a differing result shows both readings, labelled;
   - an individual record shows both claims, with neither superseding the
     other;
   - `ruling.mechanism` is removed from the player view.
5. **One projection.** It is one in-file logical layer (§18.9): no new JS
   file, no modules, no build step, and renderers hold no conflict math.
6. **Frozen model versus display.** The two are kept apart in §16 risk 12,
   §18.13 parts A and B, and the oracle rules.
7. **V6.** Geometry is kept and labelled as derived. "Hiding…" and "contains
   the whole tier…" are removed. "Absent voice" stays official.
8. **V16.** It is guarded in Gate A, with in-place URL replacement, no new
   history entry, and no reactivation or loop (§18.10, §18.13).
9. **U1–U7.** These are verification items with no per-item Owner loop
   (§18.11).
10. **The sheet.** It is a mandatory stop before any product edit (§18.5,
    §18.15 item 2, §18.16).
11. **Envelopes.** The §18.2 and §18.3 file lists do not overlap. Rule and
    document edits are scoped and finished before `ready-for-qa`.
12. **No shell.** `index.html` is not created in Gate A, and the work there is
    standalone.
13. **No periodic table.** It is prohibited in §18.3 and out of scope in §2
    and §13.
14. **Nothing changes after acceptance.** This holds in §18.2, §18.15 and
    §18.16, and in Control.
15. **"Decisions needed"** holds no settled item.
16. **Transitions.** The §18.16 path, and its failure path, use only edges
    that `AGENTS.md` allows.
17. **Contrast.** The receded vertex labels are the only exception. They are
    measured as no worse than baseline, are not reopened, and no new
    exception is created.
18. **Consistency.** No contradiction was found between the two files. The
    counts, the 16 §18 parts, the 18 sections, the candidate, the V16 wording
    and the D2 labels all agree.

The prompt's further checks also pass:
- **Product boundary:** §1, §2 and §18.1.
- **Source-purity contract:** §3 and §4.
- **Five recorded versus five existing:** §18.4 steps 2 and 6, and §18.5.
- **New Capenna:** relabel only, with no new UI or data (§6 V5, §18.6 item
  6).
- **Behavior preservation:** §18.12.
- **No hidden architecture decision:**
  - the sheet covers the slot, compass and label treatments;
  - Step 0 fixes the replacement mechanism and the parser inventory;
  - search ordering uses placement existence only (explorer line 1065),
    which is invariant.

**D1–D5, N1 and N2: all closed.**
- **D1.**
  - §18.13 separates part A (fixtures through the ported functions, and the
    75 transitions through `deltaAdd`, verified at line 2072 ff.: unchanged)
    from part B (display checks, re-expressed narrowly).
  - The WB − B DOM check no longer compares with fixture 02. Its model parity
    stays at line 2039.
  - `relWhy` is internal only. Line 1985 checks data, not rendering. It is
    never rendered (§4, V12, §18.7 item 5).
- **D2.** §18.8 labels by source class: placements stay Official, navigation
    stays Navigation, and only derived values are `computed`. Final decision
    3 above matches.
- **D3.** The V16 descriptions agree: §6 V16, §8, §16 risk 5, §18.4 step 8,
  §18.10, §18.13, and the revision 5 and revision 6 Owner lines. §5.1 C34
  describes today's surface and defers to V16.
- **D4.** No live text says the Owner is still deciding Mechanics. The old
  phrases survive only as quotations in the QA and correction records.
  Follow-ups say "Mechanics: settled".
- **D5.** §18.13 "Method", "Independence" and "Comparison" bar importing,
  executing, calling or copying page code. The comparison is with DOM text
  and accessible names only.
- **N1.** The Owner line was current before this pass, and is updated by it.
- **N2.** §4 says outright: "Neutral UI description is not a fourth source
  class". It carries no factual authority, and the term is used
  consistently.

**Findings (none fail QA):**
- **R6-F1 (minor, follow-up).** The `PRODUCT-DEFINITION.md` header says
  "Earlier revisions are in git".
  - `git log --all -- PRODUCT-DEFINITION.md` is empty, so revisions 1–5 are
    not recoverable from git.
  - It violates no acceptance criterion or invariant, so it does not fail.
  - **Owner's choice.** A rewording is possible only before acceptance (by
    the same `qa-failed` path) or in a later docs story. Accepting as-is
    leaves the sentence false.
- **R6-N1.** §5.2 M12 says "6 strings". The page has 7 `relWhy` strings
  (lines 724, 729, 734, 737, 755, 763, 770). V12 covers all of them, so Gate A
  is unaffected.
- **R6-N2.** In Follow-ups, "decided in principle (decision 1)" points to the
  previous story's decision list (in git at `7fa0e83`), not to the decisions
  in this ledger.
- **R6-N3.** Final decision 4 says the ported functions are kept "for fixture
  parity only". §18.9 is more precise: they must not feed results where a
  conflict can change the answer. §18.9 governs.
  - The existing `access(…).best !== null` call in search ranking (line 1061)
    computes placement existence, which no conflict changes.
- **R6-N4 (Gate A input).** The explorer's working copy is CRLF. The Step 0
  baseline sha256 should name what it hashes: the file, normalized, or the
  HEAD blob.
- **R6-N5 (Gate A input).** Self-test assertions that §18.4 step 9 will also
  need to classify: line 1944 (detail rows against the runtime tier) and line
  1924 (one footprint per mark, against the two-in-one-slot treatment).
- **R6-N6 (Gate A input).** §18.13 names page functions only. Its "calculates
  … itself" also excludes delegating to `tools/selection.py`, and Gate A
  `robqa` should read it that way.

**Residual risks:**
- This passes the specification only. The projection, the sheet, the guard
  and the self-test changes are unbuilt and unproven.
- Five recorded conflicts are not proof that only five exist. Gate A's full
  audit (§18.4 step 6) still has to run. Revision 5 note N3 (single-section
  placements) carries forward.
- **The change log is not in the corpus.** The OLD and NEW lines above come
  from a summarizing fetch tool, run twice and consistent, corroborated by
  the 2017 corpus and the 2021 catalog. Gate A Step 0 must quote them from
  the page itself.
- `file://` behavior of the replacement mechanism is not yet known (Step 0).
  `file://` hard reload and Back/Forward stay a human check.

## Correction (R6-F1, post-QA, 2026-10-02)

**A non-substantive, post-QA factual correction under Owner direction.** The
Owner accepted the revision 6 QA pass and directed one fix, R6-F1. The QA
section above is left as `robqa` wrote it.

**The change.** In `PRODUCT-DEFINITION.md`, the last sentence of the
decision-complete paragraph (line 14) changed.
- **Old:** "Earlier revisions are in git."
- **New:** "Earlier working revisions are not in Git: what each one changed,
  and the decisions behind it, are recorded in `HANDOFF.md`. This file enters
  Git history with the accepted planning candidate." (lines 14–16)

**Unchanged:**
- the revision number (still 6);
- every product decision, Gate A scope, the architecture, the source-purity
  rules, V11, V16, and every test requirement;
- the QA notes R6-N1 to R6-N6, which are not addressed, by Owner direction.

**Verification (the correcting session, not QA):**
- **The only change is the header.**
  - Before editing, `PRODUCT-DEFINITION.md` still had the QA'd sha256
    `2c63746a…984f8b66`, and was copied to the scratchpad.
  - `git diff --no-index` of that copy against the corrected file shows one
    hunk (+3 −1 lines), which is that sentence only.
  - The corrected file is 1342 lines, sha256 `95c5224f…44fd978a`.
- **The stale phrase is gone:** "revisions are in git" no longer appears in
  `PRODUCT-DEFINITION.md`.
- **Envelope:**
  - `git status --porcelain --untracked-files=all` shows ` M HANDOFF.md` and
    `?? PRODUCT-DEFINITION.md` only.
  - `git diff --stat HEAD` over `data tools vox-color docs`, the four rule
    files, `PHYREXIA-PLAN.md` and `PROMPT.md` is empty.
  - All three pages hash to their HEAD blobs, and no `vox-color/index.html`
    exists.
- **Whitespace:**
  - `git diff --check` exits 0 and prints only the LF→CRLF warning.
  - `git diff --no-index --check` on `PRODUCT-DEFINITION.md` exits 1 (the
    inputs differ) with no whitespace output.
- **Not run:**
  - the four data gates, because no data or tool path changed (the empty diff
    above);
  - the QA re-test, which belongs to another `robqa` session.

**Status:** `qa-passed -> ready-for-qa` by Owner direction (see Control).

## QA re-test (R6-F1, `robqa`, 2026-10-02)

**Verdict: `qa-passed`.** This is a narrow re-test of the R6-F1 correction
only. The full 18-check pass was not repeated, because the diff touches
nothing beyond the one sentence.

**Candidate checked:**
- `PRODUCT-DEFINITION.md` revision 6 with R6-F1: 1342 lines, sha256
  `95c5224f…44fd978a`.
- This `HANDOFF.md`, including "Correction (R6-F1, post-QA)".

**Independence (a limitation, recorded):**
- This session ran the revision 6 QA and then made the R6-F1 correction.
- The Control and Owner lines had planned a different session for this
  check. The Owner instead instructed this session to run it.
- `AGENTS.md` allows one session to take both roles if it deliberately
  switches and re-reads the evidence, rather than relying on its
  implementation notes. Every result below was re-derived from disk without
  the correction session's notes or snapshot.
- If the Owner wants a check from a different session, it can be run before
  acceptance.

**Evidence:**
1. **The base is the QA'd file.** Reversing only the R6-F1 sentence in the
   current file (an exact byte replacement, matched once) reproduces sha256
   `2c63746aaa60…984f8b66` and 1340 lines. That is the hash the revision 6 QA
   section recorded before the correction.
2. **R6-F1 is the only change.**
   - The byte-level result of item 1 shows nothing else differs.
   - The cross-check is `git diff --no-index --word-diff` against the
     scratchpad copy (whose sha256 is also `2c63746a…`). It shows one hunk,
     `@@ -14 +14,3 @@`: "Earlier {+working+} revisions are {+not+} in
     [-git.-]{+Git: what each one…+}", and the rest of the new sentence
     through "…accepted planning candidate.".
   - The file is LF only (0 CRLF).
3. **The new wording is factually accurate:**
   - **Never in Git:** `git log --all --full-history --
     PRODUCT-DEFINITION.md` and `git rev-list --all --objects` find no
     commit or tree containing the file. There are no stashes.
   - **Recorded in `HANDOFF.md`:** it holds a summary record for revisions
     1–6:
     - transitions;
     - the revision 1 landing-page interpretation, rejected;
     - "Revision 2 delivered the 18-section definition and audit";
     - the revision 3 and revision 4 requested outcomes;
     - the revision 5 corrections;
     - the revision 6 correction table;
     - the decisions behind each.

     It does not preserve earlier file contents. No committed `HANDOFF.md`
     mentions `PRODUCT-DEFINITION.md` (`git log --all -S`).
   - **The forward claim** ("enters Git history with the accepted planning
     candidate") is an intent that the closeout commit must honor.
4. **Revision:** line 3 still reads "This is revision 6".
5. **No product decision changed:** see items 1–2.
6. **No Gate A scope changed:** see items 1–2.
7. **No V11, V6, V16, source-purity, architecture, testing, file-envelope or
   workflow requirement changed.** Items 1–2 prove this at byte level. The
   spec's other revision references (lines 5–9, 859, 866 and 1342) describe
   earlier revisions without claiming they are retrievable, so they agree
   with the new sentence.
8. **The ledger is accurate.** "Correction (R6-F1, post-QA)" matches the
   evidence: the old and new wording, lines 14–16, +3 −1, 1342 lines and the
   full hash. The transitions are recorded:
   - `qa-passed -> ready-for-qa`: off-table, Owner-directed, and recorded as
     such;
   - `ready-for-qa -> qa-passed`: legal.

   The QA section's R6-F1 text still says a rewording would take "the same
   `qa-failed` path". That is historical; Control records the path actually
   taken.
9. **Envelope:**
   - `git status --porcelain --untracked-files=all` shows ` M HANDOFF.md` and
     `?? PRODUCT-DEFINITION.md` only.
   - `git diff --stat HEAD` over `data tools vox-color docs`, the four rule
     files, `PHYREXIA-PLAN.md` and `PROMPT.md` is empty.
   - All three pages equal their HEAD blobs, and no `vox-color/index.html`
     exists.
   - The canon corpus has no change under `docs/research`.
10. **Whitespace:**
    - `git diff --check` exits 0 and prints only the LF→CRLF warning.
    - `git diff --no-index --check` on `PRODUCT-DEFINITION.md` exits 1 (the
      inputs differ) with no whitespace output.

**Residual risks:**
- **Closeout commit.** `PRODUCT-DEFINITION.md` is untracked. If the closeout
  commit omits it (for example `git commit -a`), the new sentence becomes
  false. It must be added explicitly.
- **Independence** is limited, as stated above.

## Decisions needed

None open. Everything is decided as of 2026-10-02:
- **V11b:** two coherent source readings;
- **V16:** the route guard in Gate A;
- **V6:** the split between geometry and interpretation.

A new decision arises only in two cases:
- Gate A's Step 0 finds the structural blocker (`PRODUCT-DEFINITION.md`
  §18.4);
- official evidence creates a genuinely new ambiguity, which is batched into
  the Gate A wording sheet.

## Follow-ups

- **From the revision 6 QA re-test:** R6-F1 is corrected (see "Correction
  (R6-F1, post-QA)"). Gate A Step 0 should take R6-N4 to R6-N6 as inputs.
  R6-N1 to R6-N3 are wording notes, not addressed, by Owner direction.
- **Next: Gate A**, exactly as defined in `PRODUCT-DEFINITION.md` §18. It
  runs in a fresh session, after this story closes. Then Gates B–D follow,
  each its own story, then Gate E (cross-links) under separate Owner scope.
- **Obsolete preview Mechanics mode retirement:** a separate, explicit
  cleanup story. After Gate A the code stays in `color-wheel.html`,
  unreachable behind the route guard (V16).
- **Docs.** Nothing here is a change after acceptance of this story or of
  Gate A.
  - Gate A's stale-document rule (§18.2) covers `CONTEXT.md` and `AGENTS.md`
    where its approved behavior makes them wrong. One example: `CONTEXT.md`
    still says the four-color community readings are "labelled as community
    reading".
  - Adding `PRODUCT-DEFINITION.md` to the `CLAUDE.md` read order is outside
    Gate A's envelope. So is recording the shell and the product name in
    `AGENTS.md` and `CONTEXT.md`. These belong to a separate small docs story,
    or to Gate B when the shell exists.
- **Periodic table housekeeping:** `mechanical-periodic-table.html` stays a
  preview-only prototype, outside this acceptance. Moving it into a
  prototypes folder is its own small story, because the move changes its
  relative `../data/…` and fixture paths.
- **Periodic table restyle to the field guide** — decided in principle
  (decision 1). It is its own future story; the periodic table stays a
  separate prototype, outside The Color Pie and Gate A.
- **Mechanics: settled.** The standalone `mechanical-explorer.html` is the
  accepted Mechanical Color Pie instrument. The old embedded Color Wheel
  Mechanics preview is not part of the public product. Gate A guards its
  route (V16), and its code stays physically present until the separate
  retirement story above, which is not Gate A scope.
  `mechanical-periodic-table.html` stays a separate prototype.
- **Scryfall query idea — paused by the Owner (2026-09-27) as a separate
  future task.** Needs its own story, scope and Owner decisions.
- **Source layer, candidate reopen (reason 3 in `MECHANICS-CONTRACT.md`):** the
  sub-heading grouping of the "Return target … from graveyard to hand."
  entries, and the missed explanation of "Creature sacrifice, forced,
  repeatable". `data/` and `tools/` are frozen.
- Carried forward from `55c391e`: `AGENTS.md` and `CONTEXT.md` still describe
  Mechanics as unbuilt; about 200 orphaned `mcp*` panel lines in
  `color-wheel.html` (preview Mechanics code: left for the retirement story);
  the hard-coded `.panel` max-height in `color-wheel.html`; record the Three.js
  dependency in `CONTEXT.md` if the periodic table is accepted.
- **Combine bounce (bug in today's page, preserved):** with an Explore
  selection in the URL (e.g. `#color=W`), pressing Combine switches to
  Combine and then back to Explore about a frame later. `setMode('combine')`
  clears the selection, the hash empties, and `hashchange` sends the empty
  route to `setMode('explore')`. The same happens on HEAD and production.
  From rest it works. Script behaviour, outside this story.
- Stale wording left alone (Mechanics, out of scope): the page's head comment
  still says "LAYER 4 … stubbed, not built", like `CONTEXT.md` and
  `AGENTS.md`.
- Found in this story's recon, outside its envelope: the explorer's 1.5px
  focus outline renders at 1px in Chromium at 1x density. The wheel has no
  no-mana fallback (the explorer shows letters), so its glyphs are boxes
  when jsdelivr is blocked; colour names still appear beside each one.
- Carried forward: commit or gitignore `docs/DATA-DOSSIER.html`; re-add
  `scrollbar-gutter:stable` to `color-wheel.html`; accept or tighten the
  periodic-table atlas's ragged edge.
