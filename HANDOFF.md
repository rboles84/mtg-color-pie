# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed`. Gate C material candidate **`f9b90ec`**
  (`f9b90ec04bb63a00ee457f092ddd3489895e0b31`) passed QA, performed by the
  Owner by hand (2026-10-05). Not `complete` and not accepted; Owner
  acceptance is pending.
  - **Transition:** `ready-for-qa -> qa-passed` (Owner manual QA, recorded by
    the coordinating agent). The independent `robqa` session on `f9b90ec`
    was stopped on the Owner's direction before it recorded anything. The
    Owner's manual run stands as the QA for this candidate.
  - **Owner manual QA:** a Chromium desktop browser, served by
    `python -m http.server` from the repository root, at
    `/vox-color/index.html`. **All 11 checks passed:**
    1. **F2, 360 px:** the first wheel selection moves neither the wheel nor
       the panel, and Clear appears on the row's second line.
    2. **F2, 360 px:** Clear clears the selection, hides itself, and nothing
       moves.
    3. **F2, 360 px:** Tab through the layer row at rest goes Alliances,
       Conflicts, Four-Color, with no invisible stop.
    4. **F2, 768 px:** no movement on the first selection.
    5. **F2, 1440 px:** no movement on the first selection.
    6. **C1:** the Colorless panel (`#color-wheel/combine=`) shows the
       colorless mana symbol, not `{C}`.
    7. **C2:** the layer row shows only Alliances, Conflicts and
       Four-Color; no Mechanics control.
    8. **C3:** Fan Content Policy opens in a new tab; the wheel is
       unchanged.
    9. **C3:** Disorderly Conduct (`#color-wheel/enemy=RW`, Sources &
       scope) opens in a new tab; the wheel is unchanged.
    10. **C4:** `/vox-color/index.html#color-wheel/four=W%22` loads the
        wheel at rest, with no console error. (The first attempt 404'd
        only because the URL left out `/vox-color/`.)
    11. **Shell:** switching between the Color Wheel and the Mechanical
        Color Pie, then Back and Forward, shows the right view, with a URL
        that matches it.

    F1 remains deferred and non-blocking (C-O13).
    robdev's automated evidence for `f9b90ec` is under "F2 correction".
- Earlier status: `ready-for-qa`. Gate C material candidate **`f9b90ec`**
  (`f9b90ec04bb63a00ee457f092ddd3489895e0b31`): `vox-color/color-wheel.html` (C1–C4, plus the F2 correction),
  one `AGENTS.md` line from `c4f3a96`, and this ledger.
  - **Transition:** `dev-in-progress -> ready-for-qa` (`robdev`,
    2026-10-05). No candidate-affecting edit after `f9b90ec`; this commit
    changes `HANDOFF.md` only. Next: independent `robqa` on that exact
    commit. Not `qa-passed`, not accepted.
- Earlier status: `dev-in-progress`. **Gate C, narrow F2 correction under
  Owner rulings C-O13 and C-O14.** Not accepted.
  - **Transition:** `qa-passed -> dev-in-progress` (Owner direction,
    2026-10-05: "Do not accept Gate C yet."). This transition is not in the
    `AGENTS.md` list; it is recorded as the Owner's explicit decision, as
    before. `4f24c63` is superseded, not accepted.
- Earlier status: `qa-passed`. Gate C material candidate **`4f24c63`**
  (`4f24c634bdf2dbbde6d887699002429e2fb902b3`) passed independent `robqa`.
  - No blocker or major. There are two non-failing minors (F1, F2) and
    three notes. See "QA (robqa, independent) — candidate 4f24c63".
  - **Transition:** `ready-for-qa -> qa-passed` (`robqa`, 2026-10-05).
  - Next: Owner review. Not `complete` and not accepted; only the Owner or
    the coordinating agent marks `complete`.
- Earlier status: `ready-for-qa`. Gate C material candidate **`4f24c63`**
  (`4f24c634bdf2dbbde6d887699002429e2fb902b3`): `vox-color/color-wheel.html` (C1–C4, with C3 covering both
  links), one `AGENTS.md` line from `c4f3a96`, and this ledger.
  - **Transition:** `dev-in-progress -> ready-for-qa` (`robdev`,
    2026-10-05). No candidate-affecting edit after `4f24c63`; this commit
    changes `HANDOFF.md` only. Next: independent `robqa` on that exact
    commit. Not `qa-passed`, not accepted.
- Earlier status: `dev-in-progress`. **Gate C, applying the Owner's
  post-red-team clarifications (C-O9 to C-O12).** C3 now covers both
  outbound links.
  - **Transition:** `ready-for-qa -> dev-in-progress` (Owner direction,
    2026-10-05). This transition is not in the `AGENTS.md` list; it is
    recorded as the Owner's explicit decision, as in Gates A and B.
    - The `robqa` session started on `c4f3a96` was interrupted before it
      recorded anything; it wrote nothing to this ledger.
    - `c4f3a96` is superseded, not accepted. A new exact candidate will be
      frozen for an independent `robqa`.
- Earlier status: `ready-for-qa`. Gate C material candidate **`c4f3a96`**
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

**Post-red-team clarifications (Owner, 2026-10-05).** Scope is not
broadened.

- **C-O9 — C3 covers exactly two links.** The Gate C outbound links are the
  **Fan Content Policy** and **Disorderly Conduct** links (this resolves the
  earlier Decision). Under a trusted user click, verify for each:
  1. the destination opens outside the wheel iframe;
  2. the wheel stays loaded in its frame;
  3. the shell and wheel state is not replaced;
  4. route and state are kept when the user returns;
  5. no console or runtime error.
  - Use the codebase's existing external-link convention. Add no
    `noreferrer`, no referrer policy and no global link policy.
  - Do not run a general link inventory, and change no other link.
  - The six earlier new-tab failures were a harness issue (script clicks
    are not trusted activation). The harness is corrected; product code is
    not changed for it.
- **C-O10 — C4 stays at the selector boundary.**
  - `CSS.escape()` is acceptable there.
  - No route parser and no sanitization framework.
  - Valid values select exactly the same elements as before.
  - Route strings are not rewritten.
  - Regression coverage: the exact case plus each selector-backed family
    (`color`, `ally`, `enemy`, `four`).
- **C-O11 — `#%E0%A4%A` stays deferred.** It is a separate,
  pre-selector boundary (`decodeURIComponent` in `applyHash`). It is not
  fixed and the router is not wrapped. Report it if C4 changes it
  unexpectedly.
- **C-O12 — C2 is UI retirement, not dead-code cleanup.** The preview
  implementation, unreachable code and dormant data stay. No reorganization,
  and no Gate E.

**Rulings on `robqa`'s findings for `4f24c63` (Owner, 2026-10-05).**

- **C-O13 — F1: accepted as a follow-up, non-blocking.** The C1 markup
  `<i class="ms ms-c" role="img" aria-label="colorless mana"></i>` correctly
  uses the wheel's existing mana-symbol system.
  - The 0 px glyph without mana-font is a graceful-degradation note. Normal
    rendering is correct and the accessible name is kept.
  - A robust fallback belongs to a broader mana-font/fallback story. There
    is no special fallback for this one symbol, and C1 does not change.
- **C-O14 — F2: fix narrowly in Gate C.** It is a Gate C regression: hiding
  the Mechanics control made the first selection wrap the layer row, a
  roughly 40 px jump, inside a band that includes 360.
  - **Invariant:** at 360, 768 and 1440, the first selection must not
    introduce a new row-wrap or layout jump caused by the retirement.
  - **The fix is the smallest `color-wheel.html` correction.** It does not:
    - restore or expose the Mechanics control, or make it focusable or
      accessible;
    - redesign the toolbar;
    - alter wheel behaviour;
    - remove old code;
    - refactor unrelated CSS;
    - attempt every historical wrap threshold.
  - Preserving layout space is acceptable only with no interactive or
    accessibility presence. A layout correction is preferred over keeping
    dead markup for spacing.

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
- **C3** (as amended by C-O9): add `target="_blank"` to the Fan Content
  Policy link and to the Disorderly Conduct link, keeping `rel="noopener"`.
  - This follows the codebase's existing external-link convention: the
    explorer's outbound Scryfall links are `target="_blank"
    rel="noopener"`.
  - `_top` was rejected: it would replace the whole product and lose the
    explorer's state.
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
- **GC4 C3** (as amended by C-O9).
  - Exactly two outbound links, Fan Content Policy and Disorderly Conduct,
    each with `target="_blank"` and `rel="noopener"`.
  - Under a trusted click, from the shell and standalone, each opens one new
    page at its URL and does not navigate the wheel.
  - The wheel's route, state and history are unchanged after the click and
    after returning, with no error.
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

### Changed product lines (`vox-color/color-wheel.html` vs `b62131b`: 14 added, 8 removed; sha256 `d5389f6816334ebf9dc9dbe3cf1690dea62211b3d3867dd5574a71b7c672259c`, 4110 lines)

The C-O9 rework (2026-10-05) added only the line-1656 change below to
`c4f3a96`; everything else is as it was there.

- **C2, lines 1159–1161.** The `#lay-mech` button gains `hidden` and keeps
  `disabled`. Its comment now reads "retired (Gate C). Hidden and disabled;
  the preview code it belonged to stays, unreachable, until its retirement
  story."
- **C3, line 1484.** The footer's Fan Content Policy link gains
  `target="_blank"`; `rel="noopener"` is kept.
- **C3, line 1656 (C-O9).** In `pairSrc`, the generated "Disorderly
  Conduct" link gains `target="_blank"`; `rel="noopener"` is kept. It
  renders in the RW conflict panel's sources and in the Combine RW panel.
  No other link changed.
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

### F2 correction (C-O14, 2026-10-05)

- **Measured cause** (`rowprobe.mjs`, 1 px steps):
  - Below 398 px the three lenses fit on one line, but the lenses plus Clear
    do not. They need 372 px of row, and the row is 366 px wide at 398.
  - At baseline, the visible Mechanics button forced a second line at rest
    from 336 to 397 px, and Clear later joined that line.
  - With it hidden, the row is one line at rest in that band, and Clear's
    first appearance wrapped it: wheel and panel +40 px.
  - Below 336 the Four-Color button already wraps at rest, so there is no
    jump; from 398 all four fit, so there is no jump either.
- **Change:** 6 lines after `.layers [hidden] { display:none; }`, a
  5-line comment plus:
  `@media (max-width:397px) { .layers .clear-btn[hidden] { display:inline-flex; visibility:hidden; } }`.
  - Below 398 px, the hidden Clear keeps its slot, so the second line exists
    at rest and the first selection only reveals Clear.
  - `visibility:hidden` keeps it invisible, unfocusable, unclickable and out
    of the accessibility tree. It stays `hidden`; no script changed.
  - No dead control is kept for spacing: the reserved slot belongs to Clear,
    the live control that appears there.
  - The Mechanics control is untouched (still `hidden`, `disabled`,
    `display:none`).
- **Limits, recorded:**
  - The 397 px edge is measured with the page's own fonts (Cormorant SC). If
    Google Fonts fails, the button widths change and the edge moves. That is
    the same font dependence the row had before Gate C.
  - Widths 320–335 gain the reserved slot too. They already had a two-line
    row at rest, so their height is unchanged.
- **Targeted evidence (`f2test.mjs`): 20 checks, 20 passed.**
  - At 360, 768 and 1440:
    - the Mechanics control is not displayed, still disabled, not tabbable
      and not in the accessibility tree;
    - the first selection shifts neither the wheel nor the panel (0 px). On
      `4f24c63` the shift was +40 at 360, 0 at 768 and 0 at 1440;
    - the Clear slot at rest is invisible, not tabbable and not in the
      accessibility tree, and a real click on it does nothing;
    - after a selection, Clear is visible and exposed. Clicking it clears
      the selection, hides Clear again, focuses the panel and shifts
      nothing;
    - no overflow and no error.
  - At 360, the layer row is 74 px at rest and after selection, equal to
    the baseline's height there.
  - At 768 and 1440, the layout at rest and after selection is identical to
    `4f24c63`: every button box, the row, the wheel, the panel and the
    document height.
  - Sweep from 320 to 420 px in 1 px steps: no first-selection shift at any
    width. At 398–420 the layout is identical to `4f24c63`, because the rule
    is inactive there.
- **Harness note:** `gatec.mjs`'s visible-layer-button probe now also
  excludes `visibility:hidden`, so it doesn't count the invisible reserved
  Clear at 360. This is a harness correction, not a product change.
- **Full regression after F2:**
  - `gatec.mjs`: 129 checks, 129 passed;
  - `gateb.mjs`: 305 checks, 305 passed;
  - `bracescan.mjs`: 0 raw tokens;
  - the four gates exit 0, with output md5 `8b4dcf27…` (unchanged);
  - `node --check` passes and `git diff --check` is clean;
  - the explorer (`7a5540d2…`) and the shell (`fc569f4c…`) are unchanged.
- `color-wheel.html` against `b62131b` is now 20 lines added and 8 removed,
  4,116 lines in all, with sha256
  `6a16bf03aa5728d6408f8e1bb0763bf641def62cdee11127b45ee4439df7726c`.

### Older URIError (C-O5)

**Left deferred.** C4's boundary is the selector lookup in `applyRoute`.
The URIError is thrown earlier, in `applyHash`'s `decodeURIComponent`, so
the same correction does not reach it; GC5 confirms it still occurs. Fixing
it would need a new decision about what a malformed hash means.

### Verification (candidate working tree; scratchpad)

Headless Edge `Edg/154.0.4258.53`, local HTTP; 360×780 @2x (mobile), 768,
1440.

- **`gatec.mjs` (re-run on the C-O9 tree): 129 checks, 129 passed.**
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
  - **GC4 (60), under trusted clicks.** The clicks are CDP
    `Input.dispatchMouseEvent` events at the centre of the link's first line
    box, with `elementFromPoint` asserting a hit on the link.
    - The wheel has exactly two outbound links, both `target="_blank"
      rel="noopener"`; no other link has a `target`.
    - Six cases, each from the shell and standalone:
      - Fan Content Policy;
      - Disorderly Conduct in the RW conflict panel;
      - Disorderly Conduct in the Combine RW panel.

      In every case:
      - exactly one new page opens at the link's URL (network to
        `wizards.com` blocked);
      - there is no in-place navigation of the wheel frame or page;
      - the top URL, the wheel URL, the panel text, body classes and
        history length are identical before the click, after it, and after
        closing the new page and returning;
      - no console or runtime error.
    - **Harness corrections (not product):**
      - script `element.click()` is not a trusted activation, so popups were
        blocked; this caused the earlier 6 failures;
      - at 768 the Disorderly Conduct link wraps over two lines, and a
        bounding-box click landed between them. The harness now clicks the
        first line box.
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
  - `node --check` passes on the wheel's script (250,164 chars);
  - `git diff --check` is clean;
  - the explorer and shell hashes match S0-1.

### Notes (not changed; B8/C-O8)

- The colorless glyph depends on mana-font, like every wheel glyph. With
  jsdelivr blocked it shows as a box, which is the existing wheel limitation
  (carried follow-up, "no no-mana fallback"). Its accessible name is
  unaffected.
- The Fan Content Policy link now opens a new tab without saying so in its
  text. Adding that would be new copy (C-O3), so it is noted, not added.

## QA (robqa, independent) — candidate 4f24c63

**2026-10-05, `robqa`, separate session.** Verdict: **`qa-passed`**. No
blocker, no major. Two minors, neither violating a criterion, ruling or
invariant; recorded below and under Follow-ups for the Owner.

### Method

- Started from C-O1 to C-O12 and GC1–GC6, then the diff
  (`git diff b62131b 4f24c63`). robdev's scripts were not run or copied.
- Reused only `cdp.mjs` and `srv.mjs`, and, for the Gate B shell regression,
  `qa1/qa2/qa3.mjs` from QA's own `robqa-ca8873b` (copied unchanged as
  `gb-qa*.mjs`). Everything else is new.
- The baseline wheel is my own `git show b62131b:vox-color/color-wheel.html`.
  It is served by `srv.mjs` at the same URL path as the candidate, so both
  run on the same origin, path and shell.
- Environment: headless Edge `Edg/154`, over local HTTP and `file://`.
  Widths 360×780 @2x (mobile), 768×1024 and 1440×900, with normal and
  reduced motion.
- Every route check covers direct load, in-page `hashchange` and the shell
  (`#color-wheel/…`). Clicks are trusted CDP `Input.dispatchMouseEvent`
  events at a point inside one of the target's client rects, confirmed with
  `elementFromPoint`. Key presses are CDP key events.
- Scripts and outputs are in the session scratchpad, `robqa-4f24c63\`:
  - `reg.mjs`, `c3.mjs`, `c4.mjs`, `c12.mjs`, `brace.mjs`;
  - `cdn.mjs`, `rowshift.mjs`, `inject.mjs`, `overflow.mjs`;
  - `gb-qa1/2/3.mjs`;
  - `*-results.json`, `*.log`, `shots\`.

### Results

| Criterion | Result | Checks |
|---|---|---|
| GC1 envelope | pass | static (below) |
| GC2 / C1 | pass | 155 / 155 (+ 1 detector control) |
| GC3 / C2 | pass | 266 / 266 |
| GC4 / C3 | pass | 162 / 162 |
| GC5 / C4 | pass | 1,513 / 1,513 |
| C-O11 deferral | holds | 9 / 9 |
| GC6 no regression | pass | 1,290 / 1,290 own; Gate B lineage 833 / 835 (the 2 are the known harness expectation error, below) |

**GC1 — pass.**

- **Changed paths `b62131b..4f24c63`:** `vox-color/color-wheel.html`
  (5 hunks, +14/−8), `AGENTS.md` (1 line) and `HANDOFF.md`.
  - `git diff 4f24c63 -- . ':!HANDOFF.md'` is empty;
  - `git status --porcelain` shows only `?? dev.lnk`, untouched;
  - the working-tree wheel is byte-equal to the `4f24c63` blob.
- **Hashes:**
  - explorer blob `f3b93da…`, sha256 `7a5540d2…`;
  - shell blob `a473278…`, sha256 `fc569f4c…`.

  Both equal S0-1 and the `b62131b` blobs: the Mechanical Color Pie and
  the shell are byte-identical. The wheel's sha256 is `d5389f68…`, 4,110
  lines.
- **No new dependency:** the sorted `<script src>`/`<link href>` lists of
  baseline and candidate are identical (md5 `2173c635…`). The `<style>`
  blocks are identical, so no CSS or colour token was added.
- **Four gates:** exit 0, and the output md5 is
  `8b4dcf27a859ea32f31eac55632adf92` (`gates.txt`).
- **Static checks:**
  - `node --check` passes on the extracted inline script (1 script,
    250,164 chars), and on the baseline's (249,795);
  - `git diff --check b62131b 4f24c63` is clean.
- **Every changed product line, read:** C2 markup and comment (1159–1161);
  C3 `target="_blank"` on the footer link (1484) and in `pairSrc` (1656);
  C1 glyph (3639); C4 `CSS.escape` and its comment in `applyRoute`
  (3990–3997). Nothing else changed.
- **C-O12:** the dormant preview code is untouched.
  - The `MCP-RUNTIME` block md5 is identical;
  - `enableMechanicsPreview`, `renderWorld` (15), `mcp` (98) and
    `layers.mech` (2) occurrence counts are equal to the baseline;
  - no hunk touches the preview code.
- **`AGENTS.md`:** the one line ("…remains hidden and disabled…") is the
  envelope's single foreseen line, and it is narrowly necessary. The old
  checklist ("remains disabled") was already true at the baseline, so it
  could not catch a C2 regression.

**GC2 / C1 — pass.**

- **Glyph** (`c12.mjs`), standalone and in the shell at 3 widths, 36/36:
  - exactly one `i.ms.ms-c`, `role="img"`, `aria-label="colorless mana"`,
    inside the "Not the same thing as" paragraph, and the baseline has none;
  - it renders through mana-font: font-family `Mana`, `::before` U+E904,
    a 15×15 box at 360, `document.fonts.check` true;
  - its colour equals the paragraph's (`rgb(220, 207, 182)`), at the same
    font size, with a transparent background and no `ms-cost` disc;
  - the paragraph `textContent` equals the baseline's minus `{C}`, exactly.
- **Accessibility tree** (CDP `Accessibility.getFullAXTree`, the frame's
  tree in the shell): one `image` named "colorless mana" and no `{C}` text.
  The baseline has `{C}` text and no such image.
- **Screenshots** in `shots\c1_{standalone,shell}_{360@2x,768,1440}_{base,cand}.png`,
  inspected: the diamond glyph appears in the text colour where `{C}` was.
  At 1440 it ends a line ("mana; ◇" / "demands …").
- **Fresh sweep** (`brace.mjs`, regex `\{[^{}\s"']{1,10}\}` over every
  text node outside script and style, and every attribute), 64/64:
  - wheel: all 53 states (rest, 5 colors, 5 crossings, 5 alliances, 5
    conflicts, 32 Combine sets), plus every conflict view, with closed
    drawers included. That is 34,667 text nodes and 112,347 attributes,
    with **0 hits**;
  - explorer: rest, **216 of 216** entries opened through `VMX.open`, the
    lenses W, U, B, R, G, WU and WUBRG, and A–Z, with **0 hits** and a
    self-test with 0 failures;
  - detector control: the same sweep finds `{C}` in the baseline's
    `#combine=`.
- **No other mana rendering changed:** the `.ms` element list (class, role,
  label, `aria-hidden`) equals the baseline in 52 of 53 states. In
  `#combine=` it is the baseline plus the one C1 glyph (95 → 96), 53/53.
- **CDN blocked** (`cdn.mjs`): see F1.

**GC3 / C2 — pass** (`c12.mjs`).

- **`#lay-mech`** (3 widths, standalone and shell, plus `file://` at 1440):
  - `hidden`, `display:none`, a 0×0 box, still `disabled`,
    `aria-pressed="false"`;
  - absent from the accessibility tree, where the baseline exposes it;
  - hidden and disabled in all 53 states by a `hashchange` walk.
- **Tab order:** 6 Tabs and 3 Shift+Tabs from Alliances go Conflicts →
  Four-Color → WU → UB → BR → RG and back, never `#lay-mech`. This is
  identical to the baseline, where `disabled` already kept it out of the
  Tab order.
- **Other layer controls** (id, pressed, hidden, display, text, width):
  identical to the baseline at every width.
- **Retired routes** (154 checks): Gate A's 14 forms plus
  `?q=1#mechanics=atlas`, at 360 and 1440, on load and by `hashchange`,
  and on `file://`. Each lands in Explore at rest:
  - the hash is removed in place, with no added history entry;
  - there is no `proto-on`, and `#world` stays hidden;
  - `#lay-mech` stays hidden and disabled;
  - the end state equals the baseline apart from C2, with no exception.
- **Back/Forward** over `#color=W → #mechanics=atlas → #ally=WU` equals
  the baseline, with no preview and no loop.
- **Shell:** `#color-wheel/mechanics=atlas` has the same outcome as the
  baseline shell.
- **Near-misses** (72 checks): Gate A's 8, plus `#mechanic`,
  `#mechanicss=atlas`, `#lay-mech` and `#mech=atlas`. All are Explore with
  no preview, equal to the baseline.
- **No replacement feature:** the full signature (every button, every mark
  and the panel HTML) equals the baseline in every state apart from the
  three authorised changes (GC6).
- Screenshots: `shots\c2_rest_*`.

**GC4 / C3 (C-O9) — pass** (`c3.mjs`, 162/162).

- **Network:** `*.wizards.com` is blocked browser-wide
  (`--host-resolver-rules`, which covers popups) and per page.
- **Cases:** Fan Content Policy (from `#four=G`); Disorderly Conduct in the
  RW conflict panel's Sources & scope (`#enemy=RW`, drawer opened by a
  trusted click); and Disorderly Conduct in the Combine RW panel
  (`#combine=WR`). Each ran standalone and in the shell at 3 widths: 18
  runs.
- **Trusted click:** the click hit the link by `elementFromPoint` in every
  run, and in the shell the top-level hit is `frame-wheel`. At 768 the
  conflict link wraps over 2 lines, and the click used one line box.
- **In every run:**
  - exactly one new page opens, with this page as opener and the link's
    URL;
  - there are **no** `frameRequestedNavigation`, `frameNavigated`,
    `frameStartedLoading` or `navigatedWithinDocument` events on the page
    or the wheel frame;
  - the wheel stays loaded (5 vertices, `readyState` complete);
  - the top URL and history length, the wheel URL and history length, body
    classes, every `aria-pressed`, the panel text, the drawer state and the
    shell view and `aria-current` are identical before the click, after it,
    and after closing the new page and returning to the original page;
  - the route is kept;
  - there are no exceptions and no console or log errors. The test server's
    `/favicon.ico` 404 was excluded by URL, after `fav.mjs` confirmed its
    source.
- **Attributes:** both links are `target="_blank" rel="noopener"`, with no
  `noreferrer`.
- **No other link changed:** every `<a>` (href, target, rel, text) equals
  the baseline in every GC6 state once those two `target`s are normalised
  away.

**GC5 / C4 (C-O10) — pass** (`c4.mjs`).

- **Exact case `#four=W%22`** at 3 widths:
  - throws nothing on load, by `hashchange`, on `file://`, or as
    `#color-wheel/four=W%22` (shell load, and arrival into an open shell);
  - its end state equals `#four=Q`'s;
  - the URL is kept verbatim, equal to what the baseline shows.

  The baseline throws `SyntaxError … '.cross[data-key="W""]' is not a
  valid selector`.
- **Each family** (`four`, `color`, `ally`, `enemy`) at 1440, with 35
  unsafe values: quotes, `"` runs, `[`, `]`, `\`, `\"`, `*`, `,`, `:`,
  `:hover`, two selector-injection strings, `'`, a backtick, `{}`, `#`,
  `.`, a leading space, `%00`, `%0A`, ✓, 日本, 🔥, a zero-width space, 5,000
  × `W`, 1,500 × `"` and 800 × `"]`.

  All 1,420 checks pass: no exception on any path; the unknown-value
  fallback state (`Q`/`QQ`), standalone, `hashchange`, shell and
  `file://`; and the route string equal to the baseline's. The baseline
  threw `SyntaxError` on 32 of these at 1440.
- **Valid values** (all 20) and 13 safe invalid ones (`Q`, `w`, `WU`, `UW`,
  `WW`, empty, `1`, `-`, `--`, `W%20`, ✓, `W.U`, `WUBRG`): equal to the
  baseline on load, by `hashchange` and in the shell, covering the selected
  marks, panel, hash and history. Valid hashes are not rewritten. 93/93.

**C-O11 — the deferral holds; C4 does not change it.**

- `#%E0%A4%A`, `#four=%E0%A4%A` and `#color=W%E0%A4%A` still throw
  `URIError: URI malformed` on load and by `hashchange`, at 3 widths. The
  message and the end state are identical to the baseline.
- In the shell, both versions show no wheel error, because the accepted
  Gate B shell does not pass that hash through.
- It is not fixed, and it is not an unexpected change. 9/9.

**GC6 — pass** (`reg.mjs`, 972/972).

- **Comparison method:** candidate vs baseline, at 3 widths × normal and
  reduced motion. The full signature covers:
  - every button: pressed, disabled, hidden, display, text, title and
    label;
  - every wheel mark's class and pressed state;
  - the panel HTML and text, the combo polygon, `#world`, the layer note,
    the viewBox and atlas selection;
  - every link, the hash, the history length, horizontal overflow and the
    active element.
- **Allowed differences:** only C1 (glyph ↔ `{C}`), C2 (the `#lay-mech`
  row) and C3 (the two `target`s) are normalised away.
- **Direct loads:** all 53 states. **By `hashchange`:** all 53 states.
- **Trusted-mouse sequence** (33 steps):
  - vertex, ally, face, Conflicts on, enemy RW and its views, Four-Color,
    crossing, Clear, Escape, layer toggles;
  - Combine from rest, the centre mark, add and remove through 1–5
    colours, a neighbour chip, Combine RW, Explore (prior layers
    restored);
  - 5 Back/Forward steps.
- **Keyboard sequence** (16 steps): Enter and Space on a vertex, an ally,
  a crossing, an enemy and the centre mark; layer buttons; Tab; Combine
  and Explore by Enter; Escape.
- **Combine bounce** (`#color=W` and `#ally=RG`, then Combine, then Back):
  identical to the baseline, so the pre-existing bug is unchanged and not
  worsened.
- **Errors:** 0 exceptions and 0 console errors in all 12 page runs.
- **Overflow** (`overflow.mjs`): 0 px of horizontal overflow in all 53
  states, with every drawer open, standalone and framed, at 3 widths:
  318/318.
- **Gate B shell regression** (QA lineage, unchanged):
  - qa1 108/108 (routing, mirroring, Back/Forward, view switching, focus);
  - qa2 666/666 (framed = standalone; malformed routes 132/132; retired
    routes 426/426);
  - qa3 57/59.

  The 2 qa3 failures are "rapid 12 alternate nav clicks" at 1440 and 360.
  Their detail is identical to the `robqa-ca8873b` run: this is the
  expectation string recorded at `b62131b` as "written wrongly", and the
  measured pattern is correct. qa3's earlier sub-pixel G16 difference did
  not recur (24/24).

### Findings

- **F1 — minor (non-failing; follow-up).** With the CDN unavailable, the C1
  glyph renders as nothing.
  - **Repro:** `cdn.mjs`, `#combine=` with `*jsdelivr*`, `*googleapis*`
    and `*gstatic*` blocked.
  - **Expected:** the HANDOFF note says it "shows as a box", like other
    wheel glyphs.
  - **Actual:** the `<i>` is 0 px wide. The sentence reads "A generic cost
    takes any mana; demands mana that actually has no color." The
    baseline showed `{C}` there. Its accessible name is intact (1 image,
    "colorless mana"), and there is no error or overflow.
  - **Impact:** only when jsdelivr fails. It follows from C-O1 (the
    mana-font system) and the carried "no no-mana fallback" limitation. It
    violates no criterion. robdev's "box" description is inaccurate.
- **F2 — minor (non-failing; follow-up).** The width band where the layers
  row reflows has moved.
  - **Repro:** `rowshift.mjs`, from 320 to 1000 px in 10 px steps, at rest
    vs `#color=W` (Clear shown).
  - **Actual:**
    - in the candidate, at 340–390 px, which includes 360, the resting
      row is one line (34 px) and becomes two (74 px) when Clear appears.
      The wheel and panel shift down 40 px on the first selection and
      back on clearing;
    - the baseline had the same 40–42 px shift at 330, 540–560 and
      640–700 px, which the candidate no longer has (11 → 6 of 69 widths
      sampled).
  - **Expected / impact:** each state, taken on its own, is identical to
    the baseline apart from the hidden control. The behaviour class is
    pre-existing, with fewer affected widths overall. It is a direct
    consequence of C2 and needs no change in Gate C. The Owner may want it
    noted for 360.
- **N1 — note.** C4 changes the outcome of selector-injection URLs, as
  intended (C-O4, "no guessing").
  - In the baseline, `#ally=W%22%5D,.vertex%5Bdata-key%3D%22U` opened
    Blue's panel, `#color=W%22%5D,…` opened White's, and
    `#four=%22%5D,%5Bdata-key%3D%22W` opened "Non-White" (`inject.mjs`).
  - In the candidate, all take the unknown-value fallback.
- **N2 — note.** Developer comments in `color-wheel.html` are now stale:
  - line 1146 says "LAYER 4 button is present but disabled";
  - lines 1787–1789 say it "stays DISABLED in the markup until the panel
    has had a visual review".

  Neither is reader-facing. Leave them for the retirement story (C-O12).
- **N3 — note.** The amended `AGENTS.md` line is 87 characters, the only
  line over 80 in the file. It keeps the word "unbuilt", which is known to
  be stale.

### Blocked

None in scope. As in Gates A and B, a human must check `file://` hard
reload and Back/Forward on the standalone wheel. iOS, Firefox and real
screen-reader speech are out of scope (C-O6/C-O8).

## Decisions needed

None open. The C3 scope question (the Disorderly Conduct link) was settled
by the Owner in C-O9: it is one of the two Gate C links.

## Follow-ups

- **From Gate C `robqa` (`4f24c63`), not fixed:**
  - **F1 (C-O13: accepted, deferred, non-blocking):** with mana-font
    unavailable, the C1 colorless glyph is 0 px wide, and the sentence loses
    its subject visually. Its accessible name is kept. It belongs with the
    carried "no no-mana fallback" item, for a broader mana-font/fallback
    story.
  - **F2: fixed in Gate C (C-O14); see "F2 correction".**
    - The baseline's other first-selection jumps (+40 at 540–560 and +42 at
      640–700 px, measured on `b62131b`) came from the visible Mechanics
      button.
    - They are absent on this tree: 0 at every width from 530 to 710 px in
      10 px steps. The F2 rule is not active there; C2's removal of the
      button did it.
    - Nothing was done to target them.
  - **N2:** stale developer comments at `color-wheel.html` lines 1146 and
    1787–1789. Leave them for the preview-retirement story.
  - **N3:** the amended `AGENTS.md` line is unwrapped (87 characters).

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
