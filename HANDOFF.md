# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `ready-for-qa`. Gate C material candidate **`c4f3a96`**
  (`c4f3a9686a2fcfeee5155e42662185dd58d622df`): `vox-color/color-wheel.html`, one `AGENTS.md` line, and this
  ledger.
  - **Transition:** `dev-in-progress -> ready-for-qa` (`robdev`,
    2026-10-04). No candidate-affecting edit after `c4f3a96`; this commit
    changes `HANDOFF.md` only. Next: independent `robqa` on that exact
    commit. Not `qa-passed`, not accepted.
- Earlier status: `dev-in-progress`. **The Color Pie — Gate C: Color Wheel
  shell-readiness cleanup.** Step 0 recorded below, scope frozen;
  implementation followed in the same session.
  - **Transition:** `complete -> idle -> dev-in-progress` (coordinating
    agent as `robdev`, 2026-10-04, on the Owner's Gate C brief in chat,
    recorded as decisions C-O1 to C-O8 below).
  - **Previous story:** "The Color Pie — Gate B" was accepted at material
    candidate `ca8873b`. Its ledger is in git at `b62131b`, which was pushed
    to `origin/master` as a fast-forward before this story started. It is
    not reopened.
- Owner: the Owner. The coordinating agent acts as `robdev`. `robqa` runs
  only after `ready-for-qa`, as a separate agent session.
- Task: **Gate C.** It is Color Wheel-only cleanup of behaviour that matters
  now that the wheel lives inside the shell. It is defined by
  `PRODUCT-DEFINITION.md` revision 6 (§14 "Gate C", §16 risk 2, §17 row C;
  not edited) and by the Owner's brief (C-O1 to C-O8).
- Allowed files:
  - `vox-color/color-wheel.html`: the only product file;
  - `HANDOFF.md`;
  - narrowly necessary Gate C documentation. The only line foreseen is
    `AGENTS.md`'s QA check that the Mechanics control "remains disabled",
    which C2 makes incomplete.
- Prohibited files:
  - `vox-color/mechanical-explorer.html`;
  - `vox-color/index.html`, the accepted Gate B shell (stop and report if a
    defect proves Gate B wrong);
  - `data/`, `tools/`, `PRODUCT-DEFINITION.md`, `MECHANICS-CONTRACT.md`,
    `docs/`, the periodic table, `build/`, `reference/`, hosting.
- **Out of scope** (C-O7): the Combine bounce; the explorer's `#detail`
  scroll reset; F4; explorer outbound links (Gate D); Gate E cross-links;
  new routes, persistence or navigation architecture; visual redesign; new
  explanatory copy; colour-philosophy, source or provenance changes; broad
  accessibility cleanup; performance; refactoring; unrelated stale docs;
  browsers beyond Chromium desktop.
- **Hard scope rule (C-O8).** A newly found issue is fixed in Gate C only if
  all three hold:
  1. it is in `color-wheel.html`;
  2. it blocks or breaks an authorized C1–C4 requirement;
  3. it can be corrected narrowly, without new product behaviour.

  Otherwise it is deferred. Gate C is complete when C1–C4 work, not when
  every known wheel defect is repaired.
- Stop points:
  - stop and ask if any fix needs the shell or the explorer;
  - after independent `robqa`, stop for Owner review. The coordinating
    agent does not mark Gate C accepted or complete.

## Owner decisions (Gate C brief, 2026-10-04)

- **C-O1 — C1, raw `{C}` → mana symbol.** One site.
  - Render it with the existing mana-symbol system, with accessible text
    "colorless mana".
  - No sixth colour identity, and no new "colorless color" or semantic
    token: use the existing neutral, default or inherited presentation.
  - No global brace replacement, and no new mana-token forms.
- **C-O2 — C2, retire the dead "Mechanics — not wired" control.** Removal or
  hiding of retired UI only (§14: hide it in production; do not refactor or
  delete the preview code). No new feature, no mechanics integration, no
  Gate E.
- **C-O3 — C3, Gate C-listed outbound links escape the iframe.**
  - Use the smallest standards-based link behaviour.
  - No change to link copy, and no footer or source-area redesign.
  - Do not sweep unrelated links unless the Gate C spec explicitly lists
    them. Record exactly which links changed.
- **C-O4 — C4, the `#four=W%22` crash.**
  - Malformed or unsafe route input must not be interpolated into a
    selector in a way that throws.
  - Use the smallest defensive correction at the route/selector boundary:
    no routing framework, no reinterpretation, no guessing what the user
    meant. An unsafe value fails safely, by the wheel's existing fallback.
  - Add a regression test for the exact case.
- **C-O5 — the older malformed-percent `URIError`.** Include it only if C4's
  exact boundary naturally prevents it. If it needs broader parsing,
  refactoring or new semantics, it stays deferred.
- **C-O6 — Testing.** Local HTTP, Chromium desktop, at 360, 768 and 1440.
  Re-run the Color Wheel regression coverage needed to prove no accepted
  Gate A/B behaviour changed.
- **C-O7 — Out of scope:** listed under Control.
- **C-O8 — Hard scope rule:** under Control.

## Step 0 recon

**2026-10-04, coordinating agent as `robdev`.** No product edit. Scripts and
captures are in the session scratchpad (`step0c.mjs`, `out/step0c.json`).

### S0-1 Baseline

- **Gate B published.** `origin/master` = local `HEAD` =
  `b62131b7a7f71cfc312d20de3e2758020cc0f535`. It was pushed as a
  fast-forward from `5252333`, with no force push. `origin/main` is
  untouched at `fc32861`.
- **Read-only checks before the push:**
  - Gate B was `complete`, bound to `ca8873b`;
  - all 6 commits after `ca8873b` changed `HANDOFF.md` only;
  - `origin/master` was an ancestor of `HEAD`;
  - no tracked changes were pending;
  - `dev.lnk` and `qa/` are untracked, and absent from all history.
- **Starting HEAD:** `b62131b`. Since `ca8873b`, `vox-color/`, `data/` and
  `tools/` are unchanged.

  | File | HEAD blob | sha256 of the blob (= working copy, CR-stripped) |
  |---|---|---|
  | `color-wheel.html` | `5db44902f211d7f5123a4292bdea4976ea7fa065` | `1cdbefd7ebd3babff2a0b0ec49d136e5c33451afc0b0aa540d011228ba093fc4` |
  | `mechanical-explorer.html` | `f3b93da3c9be088ea7d6ce1e699bc2ec39cce61b` | `7a5540d2dd8ea5569117aa281915efe58d7040ec68709f96ee8cc4937f8ed877` |
  | `index.html` | `a4732785a6087661abd404fdf11641e411aa911e` | `fc569f4c80ccde8ae8374c880797436be423121c083b3ca1acea07f8e44fa286` |

- **Gates:** the four gates exit 0, output md5
  `8b4dcf27a859ea32f31eac55632adf92` (the same as Gate B Step 0).
  `node --check` passes on all three extracted scripts.

### S0-2 Reproductions (headless Edge 154, local HTTP, the unedited wheel)

- **C1:** `#combine=` (Colorless panel) renders "…A generic cost takes any
  mana; {C} demands mana that actually has no color." as raw text, from
  `color-wheel.html:3638`. The Gate B rendered-content sweep found no other
  raw mana token.
- **C2:** `#lay-mech` "Mechanics — not wired" is visible (`display:flex`),
  `disabled` and exposed in the accessibility tree, with the title "Needs
  the Mechanical Color Pie 2021 dataset". Code references:
  - its markup at line 1160;
  - `layers.mech` at line 1789;
  - `aria-pressed` set in `setMode` at line 3884;
  - `enableMechanicsPreview` at line 4020, reachable only through the
    retired route, which the Gate A guard closes.
- **C3:** the wheel renders two outbound `http` links, neither with a
  `target`:
  - the footer's **Fan Content Policy** link
    (`https://company.wizards.com/en/legal/fancontentpolicy`, line 1483).
    In the shell, clicking it starts a navigation of the **wheel frame**
    (CDP `Page.frameRequestedNavigation` on that frame; network blocked).
    It is the one §14 lists;
  - **"Disorderly Conduct"**
    (`https://magic.wizards.com/en/news/making-magic/disorderly-conduct-2005-12-05`),
    in the RW conflict's sources (`PAIR_LINK`, line 1652). Gate A added
    it, after the §8 inventory and §14 were written. **It is not Gate
    C-listed (C-O3)**: recorded under Decisions needed, not changed.
- **C4:**
  - `#four=W%22`, `#color=W%22`, `#ally=W%22` and `#enemy=W%22` each throw
    `SyntaxError` in `querySelector`, standalone and framed. In
    `applyRoute`, the decoded value `W"` is interpolated into
    `.cross[data-key="…"]`, and through `vtx` and `edgeEl` into the
    `.vertex` and `.edge` selectors.
  - Each throwing route ends, apart from the exception, in exactly the
    state of the same route with an unknown value (`#four=Q`, `#color=Q`,
    `#ally=QQ`): same body classes, every `aria-pressed`, panel text and
    marks. That is the wheel's existing safe fallback.
  - Valid `#four=W` and `#color=W` route normally.
- **URIError (C-O5):** `#%E0%A4%A` throws `URIError: URI malformed` in
  `applyHash`'s `decodeURIComponent`, **before** `applyRoute` and any
  selector runs. C4's boundary is the selector lookup inside `applyRoute`,
  so it does not reach this. Preventing it would mean a new decision in
  `applyHash` about what a malformed hash means. **It stays deferred
  (C-O5).**

### S0-3 Frozen scope and approach

- **C1:** in `comboBody`'s colorless panel, replace the literal `{C}` with
  `<i class="ms ms-c" role="img" aria-label="colorless mana"></i>`.
  - This is the mana-font colorless glyph already loaded by the page, in
    the inherited text colour: no `ms-cost` disc, and no new token or CSS
    rule.
  - The sentence is otherwise unchanged.
- **C2:** add `hidden` to `#lay-mech`, keeping `disabled`.
  - The existing rule `.layers [hidden] { display:none; }` removes it from
    layout, the tab order and the accessibility tree.
  - The preview code and `layers.mech` stay. Its comment is updated to say
    it is retired.
- **C3:** add `target="_blank"` to the Fan Content Policy link only, keeping
  `rel="noopener"`. It is the standard way to open outside the frame, and
  it matches the explorer's existing outbound Scryfall links. `_top` was
  rejected: it would replace the whole product and lose the explorer's
  state.
- **C4:** in `applyRoute`, pass `CSS.escape(v)`, not `v`, to the three
  selector lookups (`vtx`, `edgeEl`, `.cross`).
  - Valid keys (`W`, `WU`, …) escape to themselves.
  - Unsafe values become a valid selector that matches nothing, so they
    take the existing unknown-value fallback.
  - `vtx` and `edgeEl` themselves are unchanged, because internal callers
    pass only known keys.
- **Regression test for C4:** the Gate C harness loads `#four=W%22`
  standalone and as `#color-wheel/four=W%22`. It requires no exception, and
  a state equal to `#four=Q`'s, at 360, 768 and 1440. The repository has no
  in-repo browser test suite; adding one would be new infrastructure. So
  the test is recorded here as a standing regression check, with its exact
  procedure, as Gates A and B recorded theirs.
- **No Step 0 finding requires the shell or the explorer.** Scope is frozen.

## Acceptance criteria

All in Chromium desktop (headless Edge), over local HTTP, at 360, 768 and
1440.

- **GC1 Envelope.**
  - Only `color-wheel.html`, `HANDOFF.md` and the one foreseen `AGENTS.md`
    line change.
  - The explorer and the shell hash to S0-1.
  - The four gates are byte-identical, and `node --check` passes on the
    wheel's script.
- **GC2 C1.**
  - The Colorless panel shows the mana-font colorless glyph in place of
    `{C}`, with the accessible name "colorless mana" in the accessibility
    tree.
  - No raw `{…}` mana token in rendered text or attributes anywhere (fresh
    sweep).
  - The panel's other text is unchanged.
- **GC3 C2.** `#lay-mech` is not displayed, not focusable by Tab, absent
  from the accessibility tree, and still disabled. The other layer controls
  and the layers row behave as before. Every retired Mechanics route still
  lands in Explore at rest, with `#lay-mech` hidden.
- **GC4 C3.**
  - The Fan Content Policy link has `target="_blank"` and
    `rel="noopener"`.
  - In the shell, activating it opens a new browsing context and does not
    navigate the wheel frame; standalone, it also opens a new context.
  - No other link changed.
- **GC5 C4.** `#four=W%22`, `#color=W%22`, `#ally=W%22` and `#enemy=W%22`
  throw nothing, standalone and framed, and end in the state of the
  matching unknown-value route. Valid routes are unchanged.
- **GC6 No regression.**
  - Every wheel state is identical to the baseline (HEAD copy) apart from
    the C1 panel text and the C2 control: rest; 5 colors; 5 alliances; 5
    conflicts; 5 crossings; all 32 Combine sets; Combine from rest; the
    bounce; Clear; Escape; and the guarded Mechanics routes.
  - No console error.
  - The Gate B shell harness passes unchanged.
  - No horizontal overflow at any width.

## Test plan

- Gates before and after; `node --check`; `git diff --check`; hashes of the
  explorer and the shell.
- `gatec.mjs` (scratchpad): GC2–GC6 at three widths, with the baseline wheel
  served from a HEAD copy for the comparison.
- `bracescan.mjs`, re-run for GC2.
- `gateb.mjs`, the accepted Gate B harness, re-run unchanged for GC6.

## Implementation (Gate C, `robdev`)

**2026-10-04, the same session as Step 0, after the scope freeze.**

### Changed product lines (`vox-color/color-wheel.html`, 13 added, 7 removed; sha256 `0ba17bcd3c2775574e7aa756bec7b8e4e33e1cf1587002fc0fd666bfe5343fe6`, 4110 lines)

- **C2, lines 1159–1161.** The `#lay-mech` button gains `hidden` and keeps
  `disabled`. Its comment now reads "retired (Gate C). Hidden and disabled;
  the preview code it belonged to stays, unreachable, until its retirement
  story."
- **C3, line 1484.** The footer's Fan Content Policy link gains
  `target="_blank"`; `rel="noopener"` is kept. No other link changed. The
  "Disorderly Conduct" link is untouched (Decisions needed).
- **C1, line 3639.** In `comboBody`'s colorless panel, the literal `{C}`
  becomes `<i class="ms ms-c" role="img" aria-label="colorless mana"></i>`:
  - the mana-font colorless glyph, in the inherited text colour;
  - no `ms-cost` disc, and no new CSS or token;
  - the surrounding sentence is unchanged.
- **C4, lines 3990–3997.** `applyRoute` computes `const sv = CSS.escape(v)`
  and passes `sv` to `vtx`, `edgeEl` and the `.cross` lookup, with a
  four-line comment. `vtx` and `edgeEl` are unchanged.
- **`AGENTS.md`, one line (the JavaScript QA checklist):** "the unbuilt
  Mechanics control remains disabled" becomes "…remains hidden and
  disabled".
- **Not touched:**
  - the explorer (`7a5540d2…`) and the shell (`fc569f4c…`): unchanged;
  - `CLAUDE.md` and `CONTEXT.md`. `CONTEXT.md`'s "Button exists and is
    disabled" is still true;
  - `data/` and `tools/`.

### Older URIError (C-O5)

**Left deferred.** C4's boundary is the selector lookup in `applyRoute`.
The URIError is thrown earlier, in `applyHash`'s `decodeURIComponent`, so
the same correction does not reach it; GC5 confirms it still occurs. Fixing
it would need a new decision about what a malformed hash means.

### Verification (candidate working tree; scratchpad)

Headless Edge `Edg/154.0.4258.53`, local HTTP; 360×780 @2x (mobile), 768,
1440.

- **`gatec.mjs`: 81 checks, 81 passed.**
  - **GC2 (15):**
    - the glyph renders: Mana font family, a non-empty `::before`, width
      greater than 0, the colour equal to its paragraph's, no disc;
    - `role="img"` with the label "colorless mana", exposed in the
      accessibility tree as an image named "colorless mana";
    - the paragraph text is otherwise identical;
    - in the shell, `#color-wheel/combine=` shows the glyph.

    Crops are at `out/gatec/c1b_*.png`.
  - **GC3 (12):**
    - `#lay-mech` has `hidden`, `display:none`, a zero box, and is still
      `disabled`;
    - it is absent from the accessibility tree;
    - Tab from Alliances goes to Conflicts, then Four-Color, skipping it;
    - all 14 retired Mechanics forms land in Explore at rest, with no
      preview and `#lay-mech` hidden and disabled.
  - **GC4 (12):**
    - the Fan Content Policy link has `target="_blank"` and
      `rel="noopener"`;
    - a real mouse click opens exactly one new page at the policy URL
      (network to `wizards.com` blocked);
    - in the shell, the wheel frame does not navigate and stays on
      `color-wheel.html#enemy=RW`;
    - standalone, the wheel page stays;
    - the "Disorderly Conduct" link is unchanged.
  - **GC5 (24): the C4 regression test.** Six unsafe routes each throw
    nothing standalone, and end in exactly the state of the matching
    unknown-value route:
    - `#four=W%22`, `#color=W%22`, `#ally=W%22`, `#enemy=W%22`;
    - `#four=%5D`, `#color=%5C`.

    `#color-wheel/four=W%22` in the shell: no exception, URL kept verbatim.
    A `hashchange` to `#four=W%22` in an open page: no exception.
  - **C-O5 (3):** `#%E0%A4%A` still throws `URIError` (deferred,
    unchanged).
  - **GC6 (15):**
    - 63 wheel states are identical to the baseline HEAD copy apart from
      C1 and C2: rest; 5 colors; 5 crossings; 5 alliances; 5 conflicts; all
      32 Combine sets; Combine from rest; the Conflicts and Four-Color
      toggles; Clear; Escape; the bounce. Compared on body classes, every
      `aria-pressed`, the full panel text, marks, the combo polygon, shown
      layer buttons and the world/preview state;
    - the Combine bounce has the same history change (+1) and end hash;
    - direct loads of 6 valid routes are identical to the baseline;
    - no horizontal overflow and no console error.
- **`bracescan.mjs`, a fresh sweep:** 0 raw `{…}` tokens in the rendered
  text or attributes of either instrument (all wheel states including 32
  Combine sets; the explorer at rest, 216 entries opened, 5 lenses).
- **`gateb.mjs`, the accepted Gate B harness, unchanged: 305 checks, 305
  passed.**
- **Static:**
  - the four gates exit 0, with output byte-identical to Step 0;
  - `node --check` passes on the wheel's script (250,148 chars);
  - `git diff --check` is clean;
  - the explorer and shell hashes match S0-1.

### Notes (not changed; B8/C-O8)

- The colorless glyph depends on mana-font, like every wheel glyph. With
  jsdelivr blocked it shows as a box, which is the existing wheel limitation
  (carried follow-up, "no no-mana fallback"). Its accessible name is
  unaffected.
- The Fan Content Policy link now opens a new tab without saying so in its
  text. Adding that would be new copy (C-O3), so it is noted, not added.

## Decisions needed

- **C3 scope: the "Disorderly Conduct" link** (RW conflict sources,
  `PAIR_LINK`, line 1652).
  - It is a Wizards article link that, like the Fan Content Policy link,
    navigates the wheel frame when activated inside the shell.
  - It is not Gate C-listed (§14 predates it), so C-O3 leaves it unchanged.
  - Applying the same one-attribute treatment needs the Owner's word. Not
    blocking Gate C.

## Follow-ups

- **Gate D (carried from the Gate B ledger, `b62131b`; Owner-assigned):**
  - **Gate D — the explorer's detail keeps the previous entry's scroll
    position.** Assigned to Gate D by Owner ruling, 2026-10-04. Not a
    Gate B blocker, and not fixed in the shell.
    - **Cause:** `renderDetail` replaces `#detail`'s contents without
      resetting `scrollTop`.
    - **Standalone reproduction (no shell):** docked at 1440×640, and as
      the bottom sheet at 360. Open Haste and scroll the detail to the
      bottom, then open "Tutor" for any card: `scrollTop` stays at 141
      (docked) and 69 (sheet), and the new title is out of view. The shell
      makes it more frequent in docked mode, because the frame is shorter
      than the window by the header's height.
    - **Required behaviour (Owner ruling):**
      - when the active entry changes, `#detail` begins at the top of the
        newly selected entry (`scrollTop = 0`);
      - this holds for mouse selection, keyboard selection and every
        existing navigation path that changes the active entry;
      - filtering or searching without changing the active entry
        introduces no unrelated scrolling;
      - the fix is the smallest correction at the existing
        entry-selection or render point;
      - no smooth scrolling and no general scroll-management system.
  - **F4 → Gate D (B13).** It is an accepted known minor. If the Mechanical
    Color Pie is left during its first load, its self-test briefly takes
    focus in the off frame, for about 8–12 ms. A key pressed in that window
    lands there, and the shown wheel loses its focus ring; the next Tab
    resumes as expected. Reconsider it in Gate D, the explorer's own story,
    if needed. Gate B adds no more shell focus machinery for it.
- **Carried from the Gate B ledger:**
  - A same-document arrival into a loaded wheel costs one redundant Back
    step. It was accepted under B12. Gate E bridges will arrive through
    shell URLs; revisit there only if that matters.
  - `CLAUDE.md` gives `HANDOFF.md` as "~166" lines; ledgers run longer.
    Unrelated to the shell, so left alone.
  - The Gate C items formerly listed here (`{C}`, `#four=W%22`) are now
    in this story's scope (C1, C4).
- **Carried forward unchanged from the Gate A ledger (`5252333`):**

- **Gate A inputs from the product-definition QA re-test:**
  - **R6-N4.** The explorer's working copy is CRLF. The Step 0 baseline
    sha256 should name what it hashes: the file, normalized, or the HEAD blob.
  - **R6-N5.** Self-test assertions that §18.4 step 9 also needs to classify:
    line 1944 (detail rows against the runtime tier) and line 1924 (one
    footprint per mark, against the two-in-one-slot treatment).
  - **R6-N6.** §18.13 names page functions only. Its "calculates … itself"
    also excludes delegating to `tools/selection.py`, and Gate A `robqa`
    should read it that way.
  - R6-N1 to R6-N3 are wording notes on `PRODUCT-DEFINITION.md`, not
    addressed, by Owner direction. That file is outside Gate A's envelope.
    R6-N1 is a useful count: the explorer has 7 `relWhy` strings, not 6
    (lines 724, 729, 734, 737, 755, 763, 770 at `7fa0e83`).
- **Found in Gate A Step 0 Part A, outside the envelope:**
  - `tools/gate.py` has no entry point. Run alone, it exits 0 having checked
    nothing, yet the `CLAUDE.md` gate chain lists it as the fourth gate. The
    real gates still run inside `check_taxonomy.py` and `check_recon.py`.
    `tools/` is prohibited, and the `CLAUDE.md` edit is limited to the
    Mechanics invariant.
  - `MECHANICS-CONTRACT.md` is stale beyond the two notes §18.2 permits: the
    header "Status: contract agreed, not implemented … nothing in
    `vox-color/color-wheel.html` reads any of this" (lines 69–70); §7 step 8
    "Enable the toggle. **Not done** — awaiting owner visual review"
    (contradicted by the settled Mechanics decision and the guard); "Nothing
    past step 2.5 has started." (line 373). §3's "not card quality" framing
    sits beside V10's restored "pushes the power level" wording. It needs
    the Owner's scope, not a Gate A edit.
  - The wheel's `applyHash` throws `URIError` on a malformed percent-encoded
    hash (e.g. `#%E0%A4%A`), on load and on `hashchange`, and skips routing.
    This is not a Mechanics route; the V16 guard neither covers nor needs it.
  - In headless Edge the explorer scrolls after load (to y=873 at 1440,
    within about 1 s, focus on `#list`). Not yet seen in a headed browser.
    Check it there before treating it as a defect.
- **Found in Gate A Step 0 Part B, outside the envelope (not Gate-A-caused):**
  - `CONTEXT.md` "Source cautions" says Fleischer describes the C16 groups
    "as decks in gameplay terms" and that the guild-style framing was "not
    an achieved result". "Designing Commander (2016 Edition)" 86–118
    reports it as achieved ("Here's what we came up with:"), with a
    per-color rationale. The caution understates the source.
  - `CONTEXT.md` dates "Absence" "10 May 2013"; Wizards' page prints May 13,
    2013.
- **Found during Gate A implementation, outside the envelope:**
  - Internal naming: `ALIASES` (colleges) and the shard `aka` field still
    carry "alias" names; player meaning is corrected (Owner decision 4).
    Rename later.
  - `CONTEXT.md`'s "The wheel draws on" source list was already
    non-exhaustive (no guild articles, artifacts, five-color, New Capenna,
    Khans, handoff sources). Not made false by Gate A.
  - The C16 caution and "Absence" date in `CONTEXT.md` (Part B), unchanged.
  - Pre-existing: an entry label ending in "." gives a doubled period in its
    accessible name ("…with flying.."), same at HEAD.
- **After Gate A:** Gates B–D, each its own story, then Gate E (cross-links)
  under separate Owner scope.
- **Obsolete preview Mechanics mode retirement:** a separate, explicit
  cleanup story. After Gate A the code stays in `color-wheel.html`,
  unreachable behind the route guard (V16).
- **Docs outside Gate A's envelope:** adding `PRODUCT-DEFINITION.md` to the
  `CLAUDE.md` read order, and recording the shell and the product name in
  `AGENTS.md` and `CONTEXT.md`. These belong to a separate small docs story,
  or to Gate B when the shell exists. (Gate A's own stale-document rule,
  §18.2, covers what its approved behavior makes wrong.)
- **Periodic table housekeeping:** `mechanical-periodic-table.html` stays a
  preview-only prototype, outside this acceptance. Moving it into a
  prototypes folder is its own small story, because the move changes its
  relative `../data/…` and fixture paths.
- **Periodic table restyle to the field guide:** decided in principle (the
  restyle story's decision 1, in git at `7fa0e83`). Its own future story.
- **Scryfall query idea:** paused by the Owner (2026-09-27) as a separate
  future task. Needs its own story, scope and Owner decisions.
- **Source layer, candidate reopen (reason 3 in `MECHANICS-CONTRACT.md`):**
  the sub-heading grouping of the "Return target … from graveyard to hand."
  entries, and the missed explanation of "Creature sacrifice, forced,
  repeatable". `data/` and `tools/` are frozen.
- Carried forward from `55c391e`: `AGENTS.md` and `CONTEXT.md` still describe
  Mechanics as unbuilt; about 200 orphaned `mcp*` panel lines in
  `color-wheel.html` (preview Mechanics code: left for the retirement story);
  the hard-coded `.panel` max-height in `color-wheel.html`; record the
  Three.js dependency in `CONTEXT.md` if the periodic table is accepted.
- **Combine bounce (bug in today's page, preserved):** with an Explore
  selection in the URL (e.g. `#color=W`), pressing Combine switches to
  Combine and then back to Explore about a frame later. `setMode('combine')`
  clears the selection, the hash empties, and `hashchange` sends the empty
  route to `setMode('explore')`. The same happens on HEAD and production.
  From rest it works. Script behaviour, outside Gate A's cleanup lists.
- Stale wording left alone (Mechanics): the wheel's head comment still says
  "LAYER 4 … stubbed, not built", like `CONTEXT.md` and `AGENTS.md`.
- The explorer's 1.5px focus outline renders at 1px in Chromium at 1x
  density. The wheel has no no-mana fallback (the explorer shows letters), so
  its glyphs are boxes when jsdelivr is blocked; colour names still appear
  beside each one.
- Carried forward: commit or gitignore `docs/DATA-DOSSIER.html`; re-add
  `scrollbar-gutter:stable` to `color-wheel.html`; accept or tighten the
  periodic-table atlas's ragged edge.
