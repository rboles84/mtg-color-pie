# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `qa-passed`. Independent `robqa` on candidate **`ca8873b`**
  (working tree equals it except `HANDOFF.md`, plus the untracked
  `dev.lnk`). F1 and F2 are fixed (B10, B11), and F3's B12 conditions are
  met. G1–G19 pass at 360 / 768 / 1440 over HTTP. There is no blocker or
  major. One minor (F4, the off-boot focus side effect) violates no
  criterion or ruling; there are three new notes. See "QA (robqa,
  independent) — candidate ca8873b". Not `complete`: Owner acceptance
  pending.
  - **Transition:** `ready-for-qa -> qa-passed` (`robqa`, 2026-10-04).
  - **Owner ruling B13 (2026-10-04), recorded by the coordinating agent; no
    status change:** F4 is accepted as a known minor limitation and
    deferred to Gate D. It is not a Gate B blocker. No product change
    follows. The candidate remains `ca8873b`, and `qa-passed` stands.
    `ca8873b` is ready for Owner acceptance
    (stop point 3).
- Earlier status: `ready-for-qa`. Gate B material candidate **`ca8873b`**
  (`ca8873b8d004624a3dee57a57fa73ad6a76117d7`): the rework of `64b8794` under B10–B12, covering
  `vox-color/index.html`, one `AGENTS.md` line and this ledger.
  - **Transition:** `dev-in-progress -> ready-for-qa` (`robdev`,
    2026-10-04). No candidate-affecting edit after `ca8873b`; this commit
    changes `HANDOFF.md` only. Next: independent `robqa` on that exact
    commit. Not `qa-passed`, not accepted.
- Earlier status: `dev-in-progress`. **Gate B rework under Owner rulings B10–B12**
  (fix F1 and F2 in the shell; amend the arrival contract for F3). Not
  accepted.
  - **Transition:** `qa-passed -> dev-in-progress` (Owner direction,
    2026-10-04: "Do not accept Gate B yet."). This transition is not in the
    `AGENTS.md` list; it is recorded as the Owner's explicit decision, as in
    Gate A. `64b8794` is superseded, not accepted. A new exact candidate
    will be frozen for an independent `robqa`.
- Earlier status: `qa-passed`. Independent `robqa` on candidate **`64b8794`**
  (working tree's product and rule files equal to it; only `HANDOFF.md`
  differs, plus the untracked `dev.lnk`). G1–G19 pass at 360 / 768 / 1440
  over HTTP. There is no blocker or major. Three minors (F1–F3) violate no
  acceptance criterion or invariant, and there are four notes. See "QA
  (robqa, independent)". Not `complete`: Owner acceptance pending.
  - **Transition:** `ready-for-qa -> qa-passed` (`robqa`, 2026-10-04).
- Earlier status: `ready-for-qa`. Gate B material candidate **`64b8794`**
  (`64b87948647a53e873e0141967a190e60885453c`): `vox-color/index.html`
  (new), the scoped `CLAUDE.md` / `AGENTS.md` / `CONTEXT.md` notes, and this
  ledger.
  - **Transition:** `dev-in-progress -> ready-for-qa` (`robdev`,
    2026-10-04). No candidate-affecting edit after `64b8794`; this commit
    changes `HANDOFF.md` only. Next: independent `robqa` on that exact
    commit. Not `qa-passed`, not accepted.
- Earlier status: `dev-in-progress`. **The Color Pie — Gate B: integration
  shell.** Step 0 recorded below; implementation followed in the same
  session.
  - **Transition:** `complete -> idle -> dev-in-progress` (coordinating
    agent as `robdev`, 2026-10-04, on the Owner's approval of Gate B in chat,
    recorded as decisions B1–B9 below). The ledger was reset only after the
    Step 0 baseline was taken on the clean tree at `5252333`.
  - **Previous story:** "The Color Pie — Gate A" was accepted at material
    candidate `0103e12`. Its ledger is in git at `5252333`. It is not
    reopened.
- Owner: the Owner. The coordinating agent acts as `robdev`. `robqa` runs
  only after `ready-for-qa`, as a separate agent session with no
  implementation notes beyond this ledger and the diff.
- Task: **The Color Pie — Gate B: integration shell.** Defined by reference
  to `PRODUCT-DEFINITION.md` revision 6 (accepted at `eb4f1a0`; not edited):
  - mechanism: §9 (shell, two persistent lazily loaded same-origin iframes,
    routing, isolation, accessibility);
  - state ownership: §11; hierarchy: §12; what stays separate: §13;
  - risks: §16 items 1, 2, 4, 5, 6 and 10;
  - gate row: §17, row B;
  - fallback: §10, **only** if a scripted Gate B check fails in Chromium
    desktop. An untested engine is not a failure (B2).

  Where this ledger's Owner decisions differ from those sections (wording,
  browser scope, the iOS check, `file://`), the decisions govern.
- Allowed files:
  - `vox-color/index.html` (new): the only product file;
  - `HANDOFF.md`;
  - `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md`: only to add the shell to the
    read-order and repository model, to describe its relation to the two
    instruments, and to record its execution environment and routing
    contract (B3). No unrelated stale-doc fix.

  Scripts, the harness and captures stay in the session scratchpad.
- Prohibited files:
  - `vox-color/color-wheel.html` and `vox-color/mechanical-explorer.html`
    (must hash to the Step 0 baseline at the candidate);
  - all of `data/` and `tools/`;
  - `vox-color/mechanical-periodic-table.html`, `vox-color/build/`,
    `vox-color/reference/`;
  - `PRODUCT-DEFINITION.md`, `MECHANICS-CONTRACT.md`, `PHYREXIA-PLAN.md`,
    `PROMPT.md`, `docs/`;
  - the canon corpus; production hosting.
- Non-goals (B8): Gate C wheel fixes; Gate D explorer fixes; Gate E
  cross-links; the Combine bounce; malformed-hash repair inside the wheel;
  retiring the preview Mechanics code; changing either instrument's content;
  browser support beyond Chromium desktop; visual redesign; copy expansion
  or new explanatory prose; new routes; new dependencies; new
  persistence/state; broad accessibility cleanup unrelated to shell
  switching and focus; refactoring either instrument; performance work
  unless the shell itself regresses something measurably.
- Stop points:
  1. **Step 0:** stop if a discovered issue would require editing either
     accepted instrument. (Not triggered; see Step 0.)
  2. **During implementation:** stop and ask if satisfying a Gate B
     requirement needs an instrument edit or any other envelope widening.
  3. **Acceptance:** after independent `robqa`, the Owner accepts. The
     coordinating agent does not mark Gate B `complete` on the Owner's
     behalf.

## Owner decisions (Gate B, 2026-10-04)

- **B1 — Header wording (exact; no other explanatory copy).**
  - Product title: `The Color Pie`
  - Descriptor: `Explore Magic’s color philosophy and mechanical color pie.`
  - Navigation: `Color Wheel` · `Mechanical Color Pie`
  - Frame titles: `Color Wheel` · `Mechanical Color Pie`
  - Screen-reader view announcements: `Showing Color Wheel` ·
    `Showing Mechanical Color Pie`

  The descriptor describes the two instruments; it implies no combined
  philosophy or ontology.
- **B2 — Browser scope.** Chromium-based desktop browsers. Firefox, iOS
  Safari, iPhone/iPad real-device testing and cross-engine parity are not
  required. The §17 iOS human check is removed as a blocking criterion, and
  its absence does not trigger the §10 fallback. Mobile Safari, if wanted
  later, is a separate compatibility story.
- **B3 — Documentation scope.** `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md` only
  as necessary to add the shell to the read-order model, describe its
  relation to the two instruments, and record its execution environment and
  routing contract. `PRODUCT-DEFINITION.md` is not reopened. No
  opportunistic stale-doc fixes.
- **B4 — Execution environment.** The combined shell is HTTP-served. Full
  integration behaviour under `file://` is not required. The instruments
  keep their standalone `file://` behaviour. Older general statements that
  "the page runs from `file://`" must not impose that on the shell. No hacks
  around same-origin restrictions on local files.
- **B5 — Retired Mechanics route.** The shell rejects or sanitises any
  incoming wheel route containing the retired Mechanics route before handing
  it to the frame, and never publishes or keeps a shell URL containing it. It
  does not rely on the wheel's internal `replaceState` cleanup. The accepted
  Gate A wheel code is not reopened.
- **B6 — Malformed percent-encoding.** It must not crash the shell or the
  frame's routing path. The shell validates route syntax defensively. If the
  encoding is malformed, it falls back to the Color Wheel at rest and invents
  no repaired reading. Otherwise valid wheel routes stay opaque: passed
  through, never parsed or normalised for meaning.
- **B7 — Combine bounce.** A known pre-Gate-B defect; out of scope, not
  repaired. Tests separate inner-frame history caused by the bounce from
  outer-shell history introduced by Gate B. Gate B fails only if the shell
  makes the bounce materially worse or corrupts its own history because of
  it.
- **B8 — Hard scope boundary.** Gate B is complete when the shell works. A
  discovered issue belongs in Gate B only if **all three** hold: (1) the new
  shell causes it; (2) it stops a defined shell requirement working; (3) it
  can be fixed in the shell without changing either instrument's behaviour
  or meaning. Otherwise it is recorded as deferred and Gate B continues. If a
  test exposes an old defect, document it and continue unless the shell
  worsens it.
- **B9 — After implementation.** Freeze an exact material candidate, run
  independent `robqa` on it, report the candidate and evidence, and stop for
  Owner acceptance. Do not begin Gates C, D or E.

**Rulings on `robqa`'s findings for `64b8794` (2026-10-04).** These
authorize shell work in `vox-color/index.html` only, plus the minimum
ledger and documentation updates to record it. Everything in B8 stays out
of scope; `#four=W%22` stays deferred to Gate C.

- **B10 — F1, fix in Gate B.** Switching away while the Mechanical Color Pie
  is still loading must not cause its off-frame self-test to produce false
  failures, or a shell-caused console warning. The fix is the smallest
  shell-only correction:
  - the explorer file is not changed;
  - loading is not redesigned;
  - no persistence, preload or lifecycle infrastructure is added.
- **B11 — F2, fix in Gate B.** A syntactically valid shell route entered
  while the Color Wheel frame is still loading must not be dropped.
  - **Invariant:** for any valid shell route, the last valid route
    requested by the outer URL wins once the target frame is ready.
  - Wheel routes are not interpreted, and the Color Wheel is not edited.
  - No generalized router or queue: only the minimum shell state.
  - No unnecessary duplicate shell history entries.
- **B12 — F3, accepted as a contract amendment.** The extra Back step after
  a typed URL is accepted as Chromium joint-history behaviour, provided all
  of these hold:
  - no application state is lost;
  - the shell URL and the visible frame stay consistent;
  - Back and Forward eventually traverse the correct states;
  - no corrupt or unreachable states are created;
  - it is no worse than the browser history model requires.

  The shell does not force exactly one Back press if that would need a
  reload, replacing away a legitimate prior entry, editing either
  instrument, custom history virtualization, new persistence, or
  significant routing complexity.
- **B13 — F4, accepted and deferred to Gate D (2026-10-04).**
  - **Severity:** minor; accepted known limitation.
  - **Status:** deferred to Gate D.
  - **Gate B blocker:** no.
  - **Basis:** it occurs only when the Mechanical Color Pie is left during
    its first load and a key lands in the roughly 8–12 ms focus-transition
    window. It does not corrupt shell routing, browser history, URL/frame
    consistency, tab order or accessibility-tree isolation, and the next
    Tab resumes from the expected place. Removing the window would need
    instrument-specific focus coupling or explorer changes, beyond the
    Gate B shell scope. Gate D owns explorer-specific behaviour.
  - **No further Gate B product change:** no instrument edit, no additional
    shell focus machinery, no broadening of Gate B.

## Shell contract (derived from §9, B1–B7 and B10–B12; no new route semantics)

| Shell URL (hash) | Shows | Canonical form published |
|---|---|---|
| none, `#`, `#color-wheel/` | Color Wheel at rest | `index.html` (path and query, no hash) |
| `#color-wheel/<route>`, route valid | Color Wheel; frame `src` = `color-wheel.html#<route>` verbatim | `#color-wheel/<route>` as the wheel then reports it |
| `#mechanical-color-pie` (exact) | Mechanical Color Pie | the same |
| `#color-wheel/<route>`, route rejected (B5, B6) | Color Wheel at rest | `index.html`, replaced in place |
| anything else | Color Wheel at rest | `index.html`, replaced in place |

- **Route validity (syntax only).** A route is rejected when
  `decodeURIComponent` throws on it (the exact call the wheel makes, so a
  passed route cannot throw there), or when the route, or any successive
  percent-decoding of it, contains `mechanics` in any letter case. Nothing
  else is inspected; valid routes are opaque strings.
- **Wheel → shell.** The wheel frame's own hash is the source of truth for
  the wheel route. On its `load` and every `hashchange` (including
  traversal), and after every shell traversal, the shell re-derives its URL
  with `history.replaceState`. It never adds a history entry for a wheel
  change. A frame hash that fails validation publishes `index.html`; the
  frame itself is not repaired.
- **View switch** (nav activation): one `pushState`; the target frame is
  shown (`src` set on first activation), the other is switched off; focus moves
  to the shown frame; `document.title` updates; the polite live region
  announces the B1 string. Activating the current view adds no entry.
  Modified clicks (new tab or window) are left to the browser.
- **Back / Forward:** the view follows the shell URL; the wheel route
  follows the frame. A view change by traversal moves focus to the shown
  frame and is announced, so focus is never left in a hidden frame.
- **Switched off** (amended under B10): the inactive frame keeps its full
  size and layout but is not painted (`visibility:hidden`) and is `inert`,
  so it is out of sight, out of the tab order and out of the accessibility
  tree. Focus that its own script takes is handed back to the shown frame.
- **Same-document arrival** (address bar or a link to a new shell hash; the
  entry has no shell state), **as amended under B12:** the requested view
  and route take effect, with the same validation as a load. The shell
  promises correct state traversal and URL/frame consistency, not one
  Back press per arrival:
  - no application state is lost;
  - at every entry the shell URL matches the visible view and the frame's
    route;
  - Back and Forward eventually traverse every state the session created,
    in order;
  - no corrupt or unreachable state is created.

  Because Chromium shares the frame's history item with the previous entry,
  an arrival into a loaded wheel adds the browser's entry and the wheel's
  own, so Back passes once through the arrival's entry, which shows the
  prior wheel route. The shell does not reload, replace away a prior entry
  or virtualize history to avoid that.
- **Arrival while the wheel is loading** (B11): if the wheel frame's first
  navigation has not committed, the shell re-points it at the newly
  requested route. That replaces the pending navigation with no extra entry,
  and the last valid route requested wins.
- **Titles:** `Color Wheel — The Color Pie`; `Mechanical Color Pie — The
  Color Pie` (composed from B1 strings only).
- **Lazy loading:** the routed view loads first; the other frame gets `src`
  on first activation.
- **Never:** `#mechanics` in any published shell URL; the explorer's own
  hash (e.g. its `#list` skip link) mirrored into the shell.
- **`file://`:** not supported for integration (B4). The shell catches the
  cross-frame `SecurityError` and keeps switching views without URL
  mirroring; it does nothing to bypass the restriction.

## Acceptance criteria

All in Chromium desktop (headless Edge), over local HTTP, at 360, 768 and
1440 px unless stated.

- **G1 Envelope.** Only `vox-color/index.html` (new), `HANDOFF.md`, and
  scoped `CLAUDE.md` / `AGENTS.md` / `CONTEXT.md` changes. Both instruments
  hash to the Step 0 baseline. No new dependency. The four gates are
  byte-identical before and after. `node --check` passes on the shell
  script.
- **G2 Default route.** `index.html` shows the Color Wheel at rest; the
  explorer frame has no `src`.
- **G3 Direct wheel route.** `#color-wheel/<route>` for each wheel family
  (`color=W`, `ally=WU`, `enemy=WB`, `four=W`, `combine=WUR`, `combine=`)
  lands the framed wheel in the same state as the standalone wheel at
  `#<route>`; the shell URL keeps the route.
- **G4 Direct explorer route.** `#mechanical-color-pie` shows the explorer;
  the wheel frame has no `src` until first activation; the explorer
  self-test passes inside the frame.
- **G5 View switching.** Nav switches views, pushes exactly one entry per
  real switch and none for the current view, keeps each instrument's state
  (wheel selection; explorer query), and sets `aria-current` on one link.
- **G6 Back / Forward.** Over a mixed sequence of wheel changes and view
  switches, every Back and Forward step shows the right view, the frame's
  route, and a shell URL that matches both; history length stays constant
  during traversal.
- **G7 Mirroring.** Every in-frame wheel route change (user activation and
  Clear) updates the shell URL in place, adding no shell entry beyond the
  wheel's own.
- **G8 Malformed outer route.** e.g. `#color-wheel/%E0%A4%A` lands the
  wheel at rest, canonical `index.html`, no uncaught exception in any frame.
- **G9 Retired route.** Every Gate A Step 0 Mechanics form (14) and the
  near-miss forms, prefixed `#color-wheel/`, land the wheel at rest; the
  frame never receives them; no published shell URL or history entry
  contains `mechanics`, across load, reload and Back/Forward.
- **G10 Lazy loading.** Network shows only the routed instrument until the
  other is activated.
- **G11 Focus.** After a switch (and a traversal that changes view), focus
  is in the shown frame; Tab continues inside it.
- **G12 Hidden frame: tab order.** Repeated Tab and Shift+Tab never focus
  anything in the hidden frame.
- **G13 Hidden frame: accessibility tree.** The hidden frame and its content
  are absent from the accessibility tree; the shown frame is exposed with
  its B1 title.
- **G14 Document title** matches the view on load, switch and traversal.
- **G15 Announcement.** The polite live region holds the B1 string after a
  switch, and is empty at load.
- **G16 Isolation.** The shell defines none of the instruments' globals and
  vice versa; instrument computed styles in the frame equal standalone at
  the same width; Escape in one document does not change the other's state.
- **G17 Errors.** No uncaught exception or console error from the shell in
  any scenario; instrument errors match their standalone behaviour.
- **G18 Layout.** No horizontal overflow in the shell; the shell document
  does not scroll; the frame fills the viewport below the header.
- **G19 Combine bounce (B7).** From a wheel route, Combine produces the same
  inner-frame history delta framed as standalone, and the shell adds no
  entry and keeps its URL consistent with the frame.

## Test plan

- Gate chain before and after; `node --check` on both instruments' scripts
  and on the shell's; `git diff --check`; `git diff --no-index --check` for
  the new file; instrument hashes against Step 0.
- A scripted headless-Edge (CDP) harness in the scratchpad, served by a Node
  static server on 127.0.0.1, covering G2–G19 at the three widths, with
  screenshots.
- One `file://` smoke load of the shell: views switch, no uncaught shell
  exception (recorded; not an acceptance criterion, B4).
- Human checks: none required for acceptance beyond the Owner's own
  acceptance look in a Chromium desktop browser over HTTP.

## Step 0 recon

**2026-10-04, coordinating agent as `robdev`.** No product edit. Every
script and capture is in the session scratchpad.

### S0-1 Baseline

- **HEAD** `5252333817dbb27f129ff58ed684fcbc446e833b`, equal to
  `origin/master` after `git fetch` (Gate A frozen and complete). `git
  status --porcelain --untracked-files=all`: only the untracked `dev.lnk`
  (not ours; left alone).
- `git diff --stat 0103e12 HEAD -- vox-color data tools`: empty. The
  instruments are exactly as accepted.

  | Page | HEAD blob id | sha256 of the HEAD blob | sha256 of the working copy |
  |---|---|---|---|
  | `color-wheel.html` | `5db44902f211d7f5123a4292bdea4976ea7fa065` | `1cdbefd7ebd3babff2a0b0ec49d136e5c33451afc0b0aa540d011228ba093fc4` | the same (LF; 4104 lines) |
  | `mechanical-explorer.html` | `f3b93da3c9be088ea7d6ce1e699bc2ec39cce61b` | `7a5540d2dd8ea5569117aa281915efe58d7040ec68709f96ee8cc4937f8ed877` | `21d38988ebe01335058de90caa55870bbc5f10189867e3db1efd8e096a31dd3a` (CRLF; CR-stripped equals the blob) |

### S0-2 Gates

- `check_invariants.py && check_taxonomy.py && check_recon.py && gate.py`:
  exit 0 ("All 53 recon assertions hold, including agreement with the
  golden fixtures."). Output captured; md5 `8b4dcf27a859ea32f31eac55632adf92`.
  `gate.py` alone still checks nothing (Follow-ups, unchanged).
- `node --check` on each instrument's extracted inline script (one each:
  wheel 249,795 chars, explorer 110,210 chars): OK.

### S0-3 Wheel routing, standalone, in the browser (HTTP)

Headless Edge 154.0.4258.53 over CDP, Node v24.14.0 built-ins only.

- Load: Explore at rest, history length 2 (with the harness's
  `about:blank`).
- Activating the W vertex writes `#color=W` (+1 entry); Clear writes `#`
  (trailing `#`, +1 entry). Writes are plain `location.hash` assignments, so
  they fire `hashchange`.
- **Combine bounce reproduced:** from `#color=W`, Combine lands back in
  Explore with hash `#`, **+1 entry**. From rest, Combine works.
- **Malformed** `#%E0%A4%A`: `URIError: URI malformed`, routing skipped
  (mode unchanged).
- The Gate A guard cleans `mechanics` routes with `history.replaceState`
  (`color-wheel.html:3981`): no `hashchange`, so a parent cannot observe it.
  Hence B5 lives in the shell.

### S0-4 The §9 mechanism in Chromium (scratch probe page, not the product)

A throwaway page in the scratchpad framing the unedited wheel at the same
path:

- **Joint session history works.** Frame hash writes add tab history
  entries. Mirroring each frame `hashchange` into the parent with
  `replaceState` kept the parent URL correct through 3 Back and 3 Forward
  steps across two wheel changes and one pushed view entry; length constant
  (5).
- **Chromium shares the parent's history item across consecutive entries
  created by the frame.** CDP's history list shows all three wheel entries
  with the *last* mirrored parent URL. So the parent's stored URL is not
  reliable for the wheel route after traversal. **Consequence for the
  design:** the frame's hash is the truth for the wheel route, and the shell
  re-derives its URL after every traversal (shell contract above).
- **Lazy `src`** set on an iframe after load adds no entry (2 → 2).
- **Reload** restores the frame at its route with the length unchanged.
- **Same-document arrival** (navigating the tab to a new shell hash):
  parent `popstate` then `hashchange` with `history.state === null`, and the
  frame is not touched. The shell must route that arrival itself (shell
  contract, "same-document arrival").

### S0-5 Instrument facts that bear on the shell (read, not changed)

- The explorer writes no hash and no history, but its skip link
  (`href="#list"`) changes its own frame hash, so the shell must not mirror
  explorer hashes.
- The explorer calls `scrollIntoView` (lines 1558, 1803, 1809, 1862), which
  also scrolls ancestor documents. The shell document must not be
  scrollable.
- Three outbound links have no `target` (the wheel's Fan Content Policy
  link; the explorer's snapshot and Fan Content Policy links). Inside a
  frame they navigate the frame. That is Gate C/D, deferred, and the shell
  does not touch it.
- The disabled "Mechanics — not wired" control stays visible in the framed
  wheel (Gate C).

### S0-6 Scope freeze

No Step 0 finding requires editing either accepted instrument. B5 and B6
are satisfied in the shell; the Combine bounce, the wheel's own `URIError`,
the outbound links and the dead control are pre-existing and stay deferred
(B7, B8). **Gate B scope is frozen as written above.**

## Implementation (Gate B, `robdev`)

**2026-10-04, the same session as Step 0, after the scope freeze.**

### What changed

- **`vox-color/index.html` (new, 291 lines, LF; sha256
  `0142eb59156650febaaf2c128868e74354b3b9c21022fc5e56130d4b875d97c2`).**
  A static page with inline CSS and JS (one script, 5,985 chars). It has a
  header with the B1 title, descriptor and `<nav aria-label="Instruments">`,
  then two iframes (`title` "Color Wheel" / "Mechanical Color Pie") filling
  the viewport below the header, and a visually hidden polite live region.
  The shell document never scrolls. Its tokens are copied by value from the
  instruments. Its only external resource is the instruments' identical
  Google Fonts URL, so nothing is added; mana-font is not loaded.
- **`CLAUDE.md`:** one read-order row for `PRODUCT-DEFINITION.md`, pointing
  to §9, §11 and §17 for the shell. The `file://` invariant now applies to
  the Color Wheel, with the shell HTTP-served (B4).
- **`AGENTS.md`:** one repository-map entry for the shell, covering its
  relation to the instruments, its routes, environment and contract. The QA
  `file://` lines (the QA rules and the routing row) now name the Color
  Wheel, with the shell verified over HTTP.
- **`CONTEXT.md`:** one paragraph in "The file" on the shell, its routes and
  its environment.
- **`HANDOFF.md`:** this ledger.
- **Not touched:** both instruments (hashes below), `data/`, `tools/`,
  `PRODUCT-DEFINITION.md`, `MECHANICS-CONTRACT.md`, everything else.
  `dev.lnk` is untracked, pre-existing and not ours.

### Decisions taken inside the contract

1. **Unknown shell hashes** fall back to the Color Wheel at rest with the
   URL replaced in place. This is B6's safe fallback; there is no new route.
2. **Mechanics rejection is broader than the wheel's own guard.** It rejects
   `mechanics` in any letter case, at any decoding depth (up to ten rounds;
   still decoding after ten rounds counts as rejected). So near-miss forms
   the wheel would ignore are also kept out of shell URLs. No valid wheel
   route contains the word, so no valid route is lost.
3. **Same-document arrival** (the address bar or a link changing an open
   shell's hash): a loaded wheel frame is moved with an ordinary hash
   assignment, which pushes the wheel's own entry. That is +2 entries: the
   browser's and the wheel's. Back from it passes once through the
   arrival's own entry, which shows the prior wheel route. No state is
   lost. Two alternatives were tried and **rejected on evidence**:
   - replacing the frame's hash in place (`location.replace`): Back then
     lost the pre-arrival route, because Chromium shares the frame's history
     item with the previous entry (G6 failed at all three widths);
   - treating the arrival as a reload: it rewrote the previous entry the
     same way (the probe lost `#ally=WU`).
4. **Announcement timing.** The live region is cleared, then set 60 ms
   later, so a repeated string is re-announced. On the first activation of
   the explorer the text lands after the explorer's initial script work: it
   was absent at 250 ms and present within 2 s. Later switches announce
   within 250 ms.
5. **Activating the current view** adds no entry and does nothing else.
   Ctrl, Shift, Alt and Meta clicks, and non-primary buttons, are left to
   the browser.
6. **Titles** are composed only from B1 strings: "Color Wheel — The Color
   Pie" and "Mechanical Color Pie — The Color Pie".

### Verification (candidate working tree; scratchpad harness)

Headless Edge `Edg/154.0.4258.53` over CDP, driven by Node v24.14.0
built-ins, against a Node static server on 127.0.0.1. Viewports: 360×780 @2x
(mobile emulation), 768×1024, 1440×900. Scripts: `gateb.mjs` (all
criteria), `arrival.mjs`, `probe1.mjs` (Step 0), `cdp.mjs`, `srv.mjs`.
Captures are in `out/gateb/`.

- **Static:** the four gates exit 0, with output byte-identical before and
  after (md5 `8b4dcf27…`). `node --check` passes on all three extracted
  scripts. `git diff --check` is clean. `git diff --no-index --check` on
  the new file shows only the LF→CRLF warning. Instrument hashes:
  `color-wheel.html` `1cdbefd7…` (= blob); `mechanical-explorer.html`
  CR-stripped `7a5540d2…` (= blob). Both are unchanged.
- **Harness: 305 checks, 305 passed, 0 failed**, by criterion across the
  three widths:

  | Criterion | Checks | Criterion | Checks |
  |---|---:|---|---:|
  | G2 default | 6 | G11 focus | 12 |
  | G3 direct wheel routes (8 routes vs standalone) + arrival | 27 | G12 hidden frame tab order | 6 |
  | G4 direct explorer, self-test in the frame | 9 | G13 accessibility tree | 12 |
  | G5 switching | 18 | G14 title | 12 |
  | G6 Back/Forward (mixed sequence, arrivals, reloads) | 27 | G15 announcement | 18 |
  | G7 mirroring | 12 | G16 isolation | 24 |
  | G8 malformed (5 forms on load, 1 arrival) | 36 | G17 errors | 42 |
  | G9 Mechanics (14 + 10 near-miss forms, load and reload; unprefixed; arrival; traversal) | 12 | G18 layout | 15 |
  | G10 lazy loading | 6 | G19 Combine bounce | 9 |
  | reduced motion | 1 | `file://` smoke | 1 |

  Notes on what was measured:
  - **G3:** the framed wheel's state (hash, body classes, every
    `aria-pressed`, panel text, related, out and combo marks) equals the
    standalone wheel's at the same route, frame width and frame height.
  - **G6:** the mixed sequence was load, W, explorer, wheel, `ally=WU`,
    Clear, `enemy=WB`, explorer. Back visited all 7 earlier states in
    reverse and Forward returned through all 7. At every step the URL equals
    canonical(view, frame route), history length is constant, and the title
    and `aria-current` are right. Reload on a wheel route and on the
    explorer restore them. After a reload on the explorer, 3 Back and 3
    Forward steps through wheel entries stayed consistent.
  - **G9:** the frame `src` was `color-wheel.html` every time, and no URL,
    frame hash or history entry carried `mechanics` (checked at every
    decoding depth).
  - **G12:** 200 Tab and 60 Shift+Tab presses with the other frame loaded
    and hidden; it was never focused, and its document never had focus.
  - **G13:** the main frame's tree exposes one iframe, carrying the shown
    view's title. The hidden frame's own tree exposes 0 nodes.
  - **G16:** the shell defines none of `MCP ORDER esc toggleColor D
    IDENTITIES COLLEGES ALIASES PLAYER_TERMS COMBO_WORDS`. Each framed
    instrument's global-name set equals its standalone set. Computed styles
    of up to 40 key elements are equal framed and standalone at the frame's
    size. Escape in the shell and in the explorer leaves the wheel's route.
  - **G17:** no uncaught exception and no console error in any shell
    scenario, including the malformed routes (the shell never forwards
    them, so the wheel's `URIError` never fires).
  - **G18:** header 116.9 / 66.0 / 71.5 px at 360 / 768 / 1440. The frame
    starts at the header's bottom and ends at the viewport's bottom, at full
    width. Neither the shell nor the framed wheel overflows horizontally,
    and the explorer's search did not scroll the shell.
  - **G19:** Combine from `#color-wheel/color=W` gives the same result
    framed and standalone: +1 entry, hash `#`, back in Explore. The shell
    added no entry, kept its state marker, and Back returned to
    `#color-wheel/color=W`.
  - **`file://` smoke (B4, not a criterion):** the views switch and there is
    no uncaught exception or console error. The URL stays `index.html`
    (no mirroring), as designed.

### Human checks (not claimed from headless runs)

- The Owner's acceptance look in a Chromium desktop browser over HTTP, for
  example `python -m http.server` from the repository root, then open
  `http://localhost:8000/vox-color/index.html`.
- No screen reader was run. G13 and G15 verify the accessibility tree and
  the live-region text, not speech output.

### Deferred (B8; not Gate B)

- Pre-existing, unchanged, not worsened by the shell:
  - the three outbound links without `target` navigate their frame
    (Gates C and D);
  - the dead "Mechanics — not wired" control is visible in the framed wheel
    (Gate C);
  - the Combine bounce (G19 shows the framed delta equals standalone);
  - the wheel's own `URIError` on a malformed hash when it is opened
    standalone;
  - the explorer's `#list` skip link adds an in-frame history entry, which
    the shell does not mirror.

## QA (robqa, independent) — candidate 64b8794

**2026-10-04, `robqa`, separate session.** Started from G1–G19 and `git diff
5252333 64b8794`. robdev's scripts (`gateb.mjs`, `arrival.mjs`, `probe1.mjs`)
were not run or read. Only the generic `launch()`/`Page` from the session's
`cdp.mjs` were reused. Everything else is new: own static server (with
per-path delay), own probes and own wheel-state signature.

### Method

- **Where.** Headless Edge 154.0.4258.53 over CDP, Node v24.14.0 built-ins,
  served over HTTP on 127.0.0.1 from the repository root. Viewports 360×780
  @2x (mobile emulation), 768×1024 and 1440×900. Input was real CDP mouse
  and key events: clicks, Enter, Tab, Shift+Tab and Escape; Ctrl, Shift and
  middle clicks. Back/Forward used `Page.navigateToHistoryEntry`. Arrivals
  used `Page.navigate` to a new hash of the open shell (address-bar
  equivalent). Each wheel comparison against standalone used a standalone
  page at the frame's own size.
- **Scripts and captures:** `…\scratchpad\robqa-64b8794\` (`lib.mjs`,
  `qa1`–`qa6.mjs`, `*-results.json`, `*-errors.json`, `g6-*.json`, `shots/`).
  The final runs give 108 checks (qa1), 666 (qa2), 60 (qa3), 9 (qa4), 3
  (qa5) and 9 (qa6).
- **Harness faults found and fixed before the final runs.** None of these was
  a product fault:
  - Chromium caps `history.length` at 50, so each scenario now starts with
    `Page.resetNavigationHistory`.
  - A background tab throttled the shell's 60 ms announcement timer, so the
    harness now runs `Page.bringToFront` and focus emulation.
  - The `about:blank` global baseline lacked secure-context APIs, so it was
    replaced with a same-origin blank page.
  - One rapid-switch expectation string was written wrongly; the measured
    pattern is reported below.

### Results

| Criterion | Checks (pass/total) | Measured evidence |
|---|---:|---|
| G1 envelope | static, pass | **Files.** `git diff --name-status 5252333 64b8794`: `M AGENTS.md`, `M CLAUDE.md`, `M CONTEXT.md`, `M HANDOFF.md`, `A vox-color/index.html`. `git diff 64b8794 -- . ':!HANDOFF.md'` is empty; `git status`: only `?? dev.lnk`.<br>**Instrument hashes.** `color-wheel.html` blob `5db44902…`, sha256 `1cdbefd7…` (blob = working copy). `mechanical-explorer.html` blob `f3b93da3…`: blob sha256 and CR-stripped working copy are both `7a5540d2…` (working copy CRLF `21d38988…`). Both equal Step 0. No diff in `data/`, `tools/`, either instrument, `PRODUCT-DEFINITION.md` or `MECHANICS-CONTRACT.md`. `index.html` sha256 `0142eb59…`.<br>**Gates and syntax.** The four gates exit 0; output md5 `8b4dcf27a859ea32f31eac55632adf92` (= Step 0). `node --check` passes on the shell's single inline script (5,985 chars) and on both instruments'. `git diff --check 5252333 64b8794` is clean.<br>**Dependencies.** The shell's only external URLs are the instruments' identical Google Fonts `css2?…` URL and the two preconnects; nothing new.<br>**Copy.** The B1 strings appear byte-exact, with the descriptor apostrophe U+2019 (`E2 80 99`). Visible text is exactly title, descriptor and the two nav labels. Frame titles are B1. `aria-label="Instruments"` is §9's. No other prose. Docs: see N4. |
| G2 default | 6/6 | `index.html`: wheel shown, frame `src` `color-wheel.html`, explorer `src` null, wheel at rest (no hash, Clear hidden, Explore pressed), URL `index.html`. |
| G3 direct wheel route | 63/63 | Nine routes (`color=W`, `ally=WU`, `enemy=WB`, `four=W`, `combine=WUR`, `combine=`, `color=G`, `four=B`, `combine=WUBRG`) × 3 widths. Framed state equals standalone: hash, body classes, every `aria-pressed`, Clear, panel text, and class+key of every SVG `[data-key]` node. The URL keeps `#color-wheel/<route>`. Twelve odd-but-valid routes pass through verbatim, with framed = standalone including errors: `color=%57`, `color=W&x=1`, `zzz`, a 6,012-char route, `%E2%9C%93`, `combine=wur`, `four=W#extra`, `color=W?x`, `%25`, `color=W%20`, `/color=W`, `four=W%22`. |
| G4 direct explorer | 18/18 | `#mechanical-color-pie`: explorer shown; wheel `src` null and `color-wheel.html` not requested; title and `aria-current` correct; live region empty. Self-test **84 of 84** in the frame on the direct route and on normal first activation. The first wheel activation sets `src` then (+1 entry, URL `index.html`). Back returns to the explorer, with focus and announcement. |
| G5 switching | 24/24 | Mouse and Enter: +1 entry per real switch. Clicking or pressing Enter on the current view adds 0 entries. `aria-current` is on exactly one link. The wheel keeps `color=U` across switches. The explorer keeps its query `flying` across 3 switches. Typing in the explorer adds no entry. |
| G6 Back/Forward | 6/6 (195 step checks) | My own 65-step sequence per width, 49 of them traversals:<br>• load `four=W`, click R, switch (mouse), explorer query, switch (Enter), click G, Clear, switch twice, Enter on edge WU;<br>• full Back and Forward;<br>• a mid-history branch (B);<br>• an arrival from the explorer, then traversal;<br>• a reload in each view, then traversal.<br>At every step I checked view, frame route, URL = canonical(view, frame route), modeled `history.length`, title and `aria-current`, plus focus and announcement on every view change. 0 failures. The final history matches the model, and no entry carries `mechanics`. |
| G7 mirroring | 3/3 (+ in G6, G16, G19) | Mouse on U gives `#color-wheel/color=U` (+1, the wheel's own entry). Enter on edge WU, Clear, wheel Escape and Combine are each mirrored in place, with the shell adding nothing (see G6, G16, G19). |
| G8 malformed / unknown | 132/132 | Eight malformed routes (`%E0%A4%A`, `%`, `%zz`, `color=%E0`, `%C0%AF`, `%ED%A0%80`, `color=W%`, `%E0%A4%A#more`), with and without `?q=1`. All land the wheel at rest with URL `index.html[?q=1]` and frame `src` `color-wheel.html`. 0 exceptions in any frame. The same holds for arrivals from `color=W` and from the explorer (focus and announcement checked). Thirteen unknown or empty hashes (`#`, `#color-wheel/`, `#color-wheel`, `#foo`, `#Mechanical-Color-Pie`, `#mechanical-color-pie/`, `…?x=1`, `#color=W`, `#%63olor-wheel/…`, `#Color-Wheel/…`, `#color-wheel%2F…`) go to `index.html` at rest, adding only +1 entry. |
| G9 retired route | 426/426 | **Forms.** Gate A's 14 forms, its 8 near-misses (from `5252333:HANDOFF.md`), 15 of my own (mixed case, double/triple and `%25%36%44` encodings, `color=W&mechanics=1`, `x/mechanics`, `%E2%80%8Bmechanics`, `color=W#mechanics=atlas`, `%23mechanics`, `mechanics%E0%A4%A`, …) and one 12-level encoding.<br>**Load and reload.** Each form loaded with `#color-wheel/` and with `?q=1#color-wheel/`, and unprefixed, then reloaded. Every case landed the wheel at rest, URL `index.html[?q=1]`, `#lay-mech` disabled, no `proto-on`.<br>**Arrival and traversal.** 28 forms arrived from a wheel route and from the explorer, then 5 Back, 5 Forward and a reload.<br>**Never carried it.** No shell URL, `Page.getNavigationHistory` entry, nav `href`, or **frame navigation** (`Page.frameNavigated` / `navigatedWithinDocument`) ever contained `mechanics` at any decoding depth. |
| G10 lazy | 9/9 | Server log: load requests only `color-wheel.html`, with no `mechanical-explorer.html` and no `data/`. The explorer is requested on first activation. The direct explorer route requests no `color-wheel.html`. |
| G11 focus | 12/12 | After mouse or Enter switches, `document.activeElement` is the shown frame and its document has focus. The next Tab lands inside that frame (explorer `.ent`; wheel vertex). Traversal view changes moved focus (checked at every G6 step). |
| G12 hidden tab order | 6/6 | 150 Tab + 60 Shift+Tab per view per width. The hidden frame, and its document, was never focused (shell targets seen: the two nav links, the shown frame, body). |
| G13 AX tree | 12/12 | The main-frame tree has exactly one unignored iframe, named "Color Wheel" or "Mechanical Color Pie" by view. The hidden frame's own tree has 0 unignored nodes below its detached RootWebArea. The nav links are exactly the two B1 labels. |
| G14 title | 9/9 (+ every G6 step) | `Color Wheel — The Color Pie` / `Mechanical Color Pie — The Color Pie` on load, switch and traversal. |
| G15 announcement | 12/12 (+ G6 view changes) | Empty at about 50 ms and at 1.5 s after load. After a switch it holds the B1 string: first explorer activation at 399–509 ms; later switches at about 160 ms. |
| G16 isolation | 24/24 | **Globals.** Beyond a same-origin blank page, the shell adds only `0` and `1` (frame indices). None of the wheel's 66 or the explorer's 1 (`VMX`) globals. Framed global sets equal standalone exactly.<br>**Computed styles.** 23 properties are equal framed vs standalone at the frame's size: 649 wheel elements and 400 explorer elements, at all widths.<br>**Escape.** Escape on the shell nav changes nothing. Escape in the explorer clears only its query, and the hidden wheel keeps `color=W`. Escape in the wheel clears it (its own +1, URL → `index.html`) and the explorer query stays. |
| G17 errors | 27/27 + logs | 0 uncaught exceptions in every shell scenario across all scripts (`Runtime.exceptionThrown`, all frames). Logs show only:<br>• the "Tracking Prevention" warning for jsdelivr mana-font, as standalone;<br>• a `/favicon.ico` 404 that each instrument also produces standalone (no page declares an icon; test-server artefact).<br>The wheel's own `SyntaxError` on `four=W%22` occurs identically standalone (N3). Exception: F1's `console.warn`. |
| G18 layout | 9/9 (+3 CDN-blocked) | Header bottom 116.9 / 66.0 / 71.5 px. The frame's top equals the header bottom and its bottom equals `innerHeight`, at full width. `scrollWidth`/`scrollHeight` equal client sizes, `overflow` is hidden, and `scrollY` stays 0 after explorer search and after my in-frame `scrollIntoView` calls. With Google Fonts and jsdelivr blocked, the layout still holds and switching works. Reduced motion removes the nav transition. The keyboard focus outline on the nav is 2px solid. |
| G19 Combine bounce | 9/9 | From `color=W`, Combine gives the same result standalone and framed: +1 entry, landing hash `''`, back in Explore. Framed, the shell adds no entry, its state marker is kept, and the URL `index.html` matches the frame. Back gives `#color-wheel/color=W` with the frame at `#color=W`, and Forward gives `index.html`. From rest, Combine then R gives the same result both ways (`#combine=R`, +1), mirrored. |

**Adversarial probes (`ADV`, 1440 and 360):**

- **Passed:**
  - Rapid switching: 12 unwaited alternating clicks gave 12 entries alternating `#color-wheel/color=G` / `#mechanical-color-pie`, with the final view, focus, title and announcement right. All 12 Back steps were consistent.
  - A wheel that boots hidden (switch away before it loads): equals standalone at rest in state and geometry, with no focus theft.
  - Ctrl, Shift and middle clicks: the shell is untouched and the browser opens `index.html#mechanical-color-pie`.
  - Explorer skip link: the explorer's own +1 frame entry; the shell URL stays `#mechanical-color-pie`. Back goes through it, then to the wheel.
  - Back out of the shell to `about:blank`, then Forward ×3: consistent.
  - `file://` smoke (B4, not a criterion): views switch, the title and announcement are right, and there is no exception. URL mirroring is off there, as designed.
- **Explorer post-load scroll and focus** to `#list` (Gate A follow-up) happens framed exactly as standalone: y 1860 / 1190 at 768 / 1440, and 3376 vs 3357 at 360 from the fractional frame height. The shell does not scroll.
- **Findings from the probes:** F1 and F2.

**Robdev decision 3** (an arrival costs one redundant Back step), judged
against B7/B8: **acceptable; it does not corrupt history.** Measured in G6:

- arriving at `enemy=UR` from the explorer adds 2 entries;
- Back shows the wheel at the prior route (`color=B`), with URL and frame
  consistent, then the explorer, then `color=B`;
- the length stays constant and no state is lost.

Every entry shows a state whose URL matches it. It is an extra step, not a
wrong one. It does deviate from this ledger's own shell-contract wording, so
see F3.

### Findings

- **F1 — minor (shell-caused; not judged a G-criterion failure). An explorer
  that boots inside the hidden frame reports false self-check failures.**
  - *Reproduction (no artificial delay):*
    1. Load `index.html`.
    2. Click Mechanical Color Pie.
    3. Click Color Wheel 0, 100 or 250 ms later, before the explorer has
       booted.
    4. Read the explorer's `VMX.selftest()`.

    It also happens when Back is pressed during the explorer's first boot
    (P1/P12 runs).
  - *Expected:* the instrument behaves as standalone (84 of 84; no warning).
  - *Actual:*
    - at 0 ms: 6 of 84 fail at every width ("removed: no family region…",
      "gap: …full five-color strip", "lens: …all 216 entries stay visible",
      "compass: that count opens exactly its entries", "compass: Show all
      restores all 216", "plates: both fold controls keep one right-edge
      position…");
    - at 100 and 250 ms: 1 of 84 fails;
    - the explorer emits `console.warn("[mechanical-explorer] self-check
      failures", …)`, which it never does standalone.

    The self-test's layout and visibility assertions run in a
    `display:none` document.
  - *Impact:*
    - No user-visible harm: `#selftest` stays `hidden`. Once shown, the
      explorer's state, visible entries (216) and list geometry equal a
      standalone explorer at the same size.
    - It makes the frame's self-test unreliable as evidence, which matters
      for Gate D ("Self-test passes in the frame"), and adds a warning not
      seen standalone.
  - *B8 test:*
    - (1) the shell causes it: yes;
    - (3) shell-fixable: yes, by not booting the explorer in a
      `display:none` frame;
    - (2) it stops a defined requirement: arguable. G4's self-test clause
      passes on the direct route and on a normal first activation, and G17
      speaks of errors, while this is warning-level.

    I record it as minor and non-failing. The Owner may rule it in Gate B.
- **F2 — minor (shell-caused; edge race; not a G criterion). A
  same-document arrival while the wheel frame is still loading is dropped.**
  - *Reproduction:*
    1. Delay `color-wheel.html` by 1.5 s.
    2. Load `#color-wheel/color=W`.
    3. About 300 ms later, navigate the tab to `#color-wheel/ally=WU`.
  - *Expected (contract):* routed exactly as a load, so `ally=WU`.
  - *Actual:* the frame finishes at `color=W`. `sync` rewrites the arrival
    entry, so the history reads `about:blank > color=W > color=W` and the
    URL is `#color-wheel/color=W`.
  - *Impact:*
    - The typed route is lost, and one duplicate entry is added.
    - URL and frame stay consistent.
    - A malformed or Mechanics arrival in the same window also lands on
      `color=W` with no leak: `mechanics` never reaches any URL, entry or
      frame.
- **F3 — minor (contract wording vs implementation; not a G criterion).**
  The shell contract says a same-document arrival is "routed exactly as a
  load, without a further history entry". The implementation adds the
  wheel's own entry when the route differs (decision 3). The behaviour is
  consistent and acceptable (above), but the contract text is not met. The
  Owner should either accept decision 3 as an amendment or ask for rework.
- **N1 — note (pre-existing).** The Combine bounce is unchanged inside the
  frame (G19).
- **N2 — note (pre-existing).** The explorer's post-load scroll and focus to
  `#list` behave the same framed and standalone.
- **N3 — note (pre-existing wheel defect, Gate C).**
  `#color-wheel/four=W%22` passes through verbatim, as B6 requires. The
  wheel then throws `SyntaxError` in `querySelector('.cross[data-key="W""]')`,
  exactly as standalone `#four=W%22` does. The shell neither causes nor
  worsens it.
- **N4 — note (docs, B3).** All doc edits are inside B3's four purposes. Two
  small edges:
  - `CLAUDE.md`'s new row adds "or planning Gates C–E" and "Accepted
    revision; not edited by later gates", slightly beyond describing the
    shell.
  - `AGENTS.md` and `CONTEXT.md` name `PRODUCT-DEFINITION.md` §9 (and §11)
    as the shell's contract. §9 still says the frame title is "Mechanical
    Color Pie 2021" and still requires the iOS check, both overridden by B1
    and B2, which live only in this ledger and git history.

### Not verified (not required, or out of scope)

- Real screen-reader speech: G13 and G15 cover the tree and the live text.
- iOS and Firefox (B2).
- `file://` hard reload with toolbar Back/Forward (a human check, B4).
- An outbound link navigating a frame to Wizards (B8, deferred, not
  exercised).

None of these blocks a G criterion.

## Rework (Owner rulings B10–B12, `robdev`)

**2026-10-04.** This rework is shell-only. The only product file changed is
`vox-color/index.html`. `AGENTS.md` changes by one line, so that its account
of what the shell reads stays true. Neither instrument changed.

### F1 correction (B10)

- **Cause:** the explorer runs its self-test once, at the end of its
  asynchronous boot. Several assertions read layout (`offsetParent`, widths,
  the fold controls' right edge). A frame switched off with `hidden`
  (`display:none`) has no layout, so an explorer booting there failed those
  assertions and emitted its `console.warn`.
- **Change:**
  - The inactive frame is now switched off with class `is-off`
    (`visibility:hidden`) plus the `inert` attribute, instead of `hidden`.
  - Both frames are absolutely positioned at full size in `.frames`, so the
    off frame keeps a real layout. Its own computed visibility stays
    `visible` (CSS does not inherit across documents), so the explorer's
    `visible()` helper reads as it does on screen.
- **Focus guard (needed by the change, found in rework, shell-caused):**
  - Chromium's `inert` on an iframe does not stop script inside the frame
    from focusing its own elements.
  - Once laid out, the explorer booting while off moved focus to its `#list`.
    Measured: off-frame `hasFocus()` true, the shown wheel lost focus.
  - The shell now listens for each frame window's `focus` event (and checks
    `hasFocus()` at the frame's load). If that frame is off, it hands focus
    back to the shown frame on the next task. The deferral is needed because
    the window's `focus` event fires before the element focus that caused it
    completes; measured, an immediate hand-back was overridden.
- **Not changed:** the explorer file; loading order or lazy loading; no
  readiness signal is read from either instrument.

### F2 correction (B11)

- **Cause:** a same-document arrival while the wheel frame's first
  navigation had not committed (`contentWindow.location` still
  `about:blank`) took neither branch of `arrive`, so the route was dropped.
- **Change:** a new `wheelPending()` is true when the frame has a `src` but
  its document is still the initial `about:blank`. In that state `arrive`
  re-sets `src` to the new route.
  - Navigating away from the initial `about:blank` is a replacement, so no
    history entry is added.
  - The newest request supersedes the pending one, so the last valid route
    requested wins.
  - Rejected and malformed arrivals resolve to the empty route as before
    (B5, B6), so a rejected route requested last lands at rest.
- Once the wheel has committed, the existing hash-assignment path applies,
  unchanged.

### F3 amendment (B12)

The "Same-document arrival" line of the shell contract now reads as amended
there. No code change was needed: the behaviour robqa verified (decision 3)
is what B12 accepts.

### Verification of the rework (working tree; same harness, plus `fixtest.mjs`, `offprobe.mjs`)

Headless Edge `Edg/154.0.4258.53`, local HTTP, 360 @2x, 768 and 1440.

- **Targeted (`fixtest.mjs`): 144 checks, 144 passed.**
  - **F1, 54 checks:**
    - left after 0, 100, 250 and 600 ms, and Back during boot: the
      self-test reads "N of N passed" while off, with no self-check warning;
    - the off explorer's boot does not leave focus in the off frame;
    - shown afterwards: 216 visible entries and no overflow;
    - focus moved into the off frame by its own script is handed back.
  - **F2, 75 checks.** The wheel response was delayed 1.5 s. Cases:
    - one valid arrival;
    - two arrivals, where the last wins;
    - a malformed arrival, which lands at rest;
    - an encoded Mechanics arrival, which lands at rest;
    - a valid arrival followed by a Mechanics one, which lands at rest.

    Each lands frame and URL at the last request. Entries equal the
    browser's navigations only, with no extra. `mechanics` never reaches an
    entry or the frame `src`. Back and Forward stay consistent, with no
    exception.
  - **F3, 15 checks:**
    - an arrival into a loaded wheel is still +2;
    - a typed-URL session (wheel change, typed wheel route, wheel change,
      typed `#mechanical-color-pie`, typed wheel route):
      - Back traverses every created state in reverse, with duplicates
        allowed and nothing lost;
      - Forward returns to the last state;
      - every step's URL equals view + frame, at constant length.
- **Off-frame probe (`offprobe.mjs`)**, explorer left at 0 and 100 ms and
  booted while off:
  - 40 Tab presses: 0 into the off frame;
  - the main accessibility tree exposes only "Color Wheel";
  - the off explorer's own tree exposes 0 non-ignored nodes out of 1,294;
  - after boot, focus is in the wheel, not the explorer.
- **Full regression (`gateb.mjs`, updated only to read the off state as
  `is-off` plus `inert`, both required to agree): 305 checks, 305 passed,
  at all three widths.** Every G criterion passes as before.
- **Static:**
  - the four gates exit 0, with output byte-identical to Step 0;
  - `node --check` passes on the shell's script (7,489 chars);
  - `git diff --check` is clean;
  - the instruments are unchanged (wheel `1cdbefd7…`, explorer CR-stripped
    `7a5540d2…`);
  - shell `vox-color/index.html`: 332 lines, sha256 `fc569f4c80ccde8ae8374c880797436be423121c083b3ca1acea07f8e44fa286`.

## QA (robqa, independent) — candidate ca8873b

**2026-10-04, `robqa`, separate session.** Started from B10–B12, the
amended shell contract, G1–G19, `git diff 64b8794 ca8873b` and `git diff
5252333 ca8873b`. robdev's scripts (`gateb.mjs`, `fixtest.mjs`,
`offprobe.mjs`, `arrival.mjs`, `probe1.mjs`, `dbgfocus.mjs`) were not run,
read or copied.

### Method

- **Where.** Headless Edge 154.0.4258.53 over CDP, Node v24.14.0 built-ins,
  local HTTP on 127.0.0.1 from the repository root. Viewports 360×780 @2x
  (mobile emulation), 768×1024 and 1440×900. Real CDP mouse and key input;
  Back/Forward by `Page.navigateToHistoryEntry`; typed URLs by
  `Page.navigate` (`transitionType: typed`).
- **Scripts and captures:**
  `…\scratchpad\robqa-ca8873b\`. `lib.mjs` and `qa1`–`qa6.mjs` are adapted
  from the previous robqa (`robqa-64b8794`): the view is now read as
  `is-off` + `inert` + computed `visibility:hidden` on exactly one frame;
  G18 also checks that the off frame has the shown frame's box; qa3's
  arrival-while-loading probe now expects B11; qa6 adds 50 and 600 ms. New:
  `qa7.mjs` (F1, off-frame focus, AX, paint, hit test), `qa7b.mjs` (focus
  window timing, Tab after hand-back), `qa7c.mjs` / `qa8c.mjs` / `qa3b.mjs`
  / `qa9b.mjs` (same probe against a scratch copy of the `64b8794` shell
  for attribution), `qa8.mjs` (F2, own delaying and streaming server),
  `qa9.mjs` (F3 typed session, adversarial). Results are in
  `*-results.json`, `*-errors.json`, `g6-*.json`, `f3-*.json`, `shots/`.
- **Harness faults, not product faults** (each re-checked):
  - qa7 "direct route, 0 ms": the coordinate click on Color Wheel was
    computed before the web font loaded and landed on Mechanical Color Pie
    after the header reflowed (360, 768). Re-run in qa7b with
    `element.click()`: passes.
  - qa8 first run counted the typed URL itself (a main-frame navigation)
    as a "frame navigation carrying mechanics". Filtered to child-frame
    navigations, as qa2 does: 168/168.
  - qa3 rapid-switch check: the previous robqa's wrong expectation string
    (`color=G` vs the full URL). The measured pattern alternates exactly,
    and all 12 Back steps pass.
  - qa3 G16 at 1440, one run: 20-odd `<p>` widths 28.5469 vs 28.5781 px.
    qa3b repeated framed-vs-standalone 3× at 1440 and 768 on both shells:
    11 of 12 runs equal; the one unequal run (21 elements) was the
    *previous* shell at 768. A settle-timing flake, not shell-caused.
  - qa5 (post-load explorer scroll, N2): standalone itself varies run to
    run (360: 3357 or 3376). Pre-existing, not shell-caused.

### Results

| Criterion | Checks (pass/total) | Measured evidence |
|---|---:|---|
| G1 envelope | static, pass | `git diff ca8873b -- . ':!HANDOFF.md'` empty; `git status`: only `?? dev.lnk`. `git diff --name-status 64b8794 ca8873b`: `M AGENTS.md`, `M HANDOFF.md`, `M vox-color/index.html` (inside B10–B12). `AGENTS.md` change: one line, the parenthetical "(and watches each frame's focus, to keep focus out of the inactive one)"; minimal. No change since `5252333` in `data/`, `tools/`, either instrument, `PRODUCT-DEFINITION.md`, `MECHANICS-CONTRACT.md`, `PHYREXIA-PLAN.md`, `PROMPT.md`, `docs/`, `vox-color/build`, `vox-color/reference`, the periodic table. Hashes: `color-wheel.html` blob `5db44902…`, sha256 `1cdbefd7…` (blob = working copy); `mechanical-explorer.html` blob `f3b93da3…`, blob and CR-stripped working copy `7a5540d2…`; both = Step 0. `index.html` blob `a4732785…`, sha256 `fc569f4c…` (= robdev's). Four gates exit 0, output md5 `8b4dcf27a859ea32f31eac55632adf92` (= Step 0). `node --check` on the shell's one inline script (7,489 chars): OK. `git diff --check 64b8794 ca8873b` and `5252333 ca8873b`: clean. External URLs: only the Google Fonts preconnects and `css2?…` URL, unchanged. B1: the only markup change is the pie iframe's `hidden` → `class="is-off" inert`; title, descriptor (U+2019), nav labels and frame titles byte-identical. |
| G2 default | 6/6 | Wheel shown at rest, explorer `src` null, URL `index.html`. |
| G3 direct wheel route | 63/63 | 9 routes + 12 odd-but-valid routes × 3 widths: framed = standalone (hash, body classes, every `aria-pressed`, panel, every SVG `[data-key]`); URL keeps the route; `four=W%22` throws the same `SyntaxError` framed and standalone (N3). |
| G4 direct explorer | 18/18 | Wheel `src` null, not requested; self-test 84/84 in the frame; first wheel activation +1, URL `index.html`. |
| G5 switching | 24/24 | +1 per real switch (mouse, Enter), 0 for the current view; `aria-current` on one link; wheel `color=U` and explorer query `flying` kept. |
| G6 Back/Forward | 6/6 (195 step checks) | 65 steps per width (49 traversals, a branch, an arrival, a reload in each view): view, frame route, URL = canonical, modeled length, title, `aria-current`, focus and announcement on view change. 0 bad steps. |
| G7 mirroring | 3/3 (+ G6, G16, G19) | Mouse on U → `#color-wheel/color=U`, +1 (the wheel's own). |
| G8 malformed / unknown | 132/132 | 8 malformed routes, with and without `?q=1`, on load and as arrivals from a wheel route and from the explorer; 13 unknown hashes. All at rest, `index.html[?q=1]`, no exception. |
| G9 retired route | 426/426 (+ F2) | 14 + 8 + 15 forms and a 12-level encoding; load, reload, arrival, 5 Back + 5 Forward. No URL, entry, nav href or child-frame navigation ever carried `mechanics`. |
| G10 lazy | 9/9 | Load requests only `color-wheel.html`; explorer requested on activation; the direct explorer route never requests the wheel. |
| G11 focus | 15/15 core; qa7 timeline 22/42 (F4) | After every switch and view-changing traversal the shown frame is `activeElement` and its document has focus; the next Tab lands inside it (qa1, and qa7b after a hand-back). The qa7 50-sample timeline during an off boot caught the off explorer holding focus in 18 cases (measured in qa7b: 7.5–11.9 ms, once per off boot; F4); 2 failures are the harness click above. |
| G12 off frame: tab order | 6/6 + qa7 15/30 (F4) | 150 Tab + 60 Shift+Tab per view per width (qa1) and 120 Tab + 50 Shift+Tab with the explorer shown (qa7): the off frame was never focused. Programmatic `focus()` on `#q`, `#list`, an entry, and `window.focus()` inside the off explorer, and on a vertex and `window.focus()` inside the off wheel: always handed back to the shown frame. Typing 40 ms after a grab did not reach the off explorer. A grab every 30 ms for 1 s: 0/65 samples in the off frame, ends in the shown wheel. Hit test and real click at the off explorer's search box: `frame-wheel`, explorer untouched. **But** the shown frame's focused control is not kept (15 checks: F4). |
| G13 off frame: AX tree | 12/12 + qa7 19/21 | Main tree: exactly one iframe, the shown view's B1 title; the off frame's tree has no unignored node below its root, including an explorer that booted off (1 of 2,600+ nodes). **Paint:** a visible full-screen red overlay injected into the off explorer leaves the shell screenshot byte-identical; the same overlay in the shown wheel changes it (3/3). 2 failures are the harness click. |
| G14 title | 9/9 (+ every G6/F3 step) | B1-composed titles on load, switch, traversal. |
| G15 announcement | 12/12 | Empty at load; B1 string after each switch (first explorer activation 509–612 ms, later about 160 ms). |
| G16 isolation | 23/24 (+ qa3b 11/12, flake) | Shell adds no instrument global; framed global sets = standalone; computed styles equal (649 wheel, 400 explorer elements × 23 properties); Escape in each document leaves the other alone. |
| G17 errors | 66/66 + logs | 0 uncaught exceptions in any shell scenario (all scripts). Logs: only the mana-font "Tracking Prevention" warning and the `/favicon.ico` 404, both standalone too. No `self-check failures` warning anywhere. |
| G18 layout | 9/9 + CSS 9/9 + resize 6/6 | Frame top = header bottom, bottom = viewport, full width; the off frame has the identical box; no overflow; shell never scrolls; CDN-blocked and reduced-motion checks pass. |
| G19 Combine bounce | 9/9 | Framed delta = standalone (+1, hash `''`); shell adds no entry; Back → `#color-wheel/color=W`. |

**Adversarial probes:** rapid 12 clicks (pattern exact, 12 Back steps
consistent); 5 nav switches with both instruments delayed 1.5 s before
either loaded (both frames still `about:blank` at the last switch): final
explorer shown and focused, wheel loaded off at `color=G`, 7 entries,
self-test 0 failures, then Back ×5 / Forward ×5 consistent (3/3 widths);
reload on a typed-arrival entry then Back ×2 / Forward ×2 consistent;
resize while a frame is off (1440→768, 768→400, 400→1440), then show it:
explorer and wheel geometry and state equal standalone at the new size,
no overflow (6/6); modified clicks, skip link, leaving and re-entering the
shell, `file://` smoke: pass. Ten rapid keyboard Enters on the nav, no
waits: 768 and 1440 +10 entries; at 360 two Enters were swallowed (see F4;
qa9b shows the previous shell also loses Enters this way, while its
explorer is shown).

### Verdicts on F1–F3

- **F1 (B10): fixed.** 14 off-boot scenarios × 3 widths (qa7): nav away at
  0/20/50/100/250/400/600 ms; Back at 0/100/400 ms; nav away and Back
  mid-boot (explorer document loaded, data fetch held 1.5 s); direct
  `#mechanical-color-pie` then wheel at 0 ms and mid-boot. Each reads
  "Self-check: 84 of 84 passed" from `VMX.selftest()` and `#selftest`
  while off, with no `self-check failures` warning and no shell error.
  Once shown, the explorer equals a standalone one at the frame size
  (state, 216 visible entries, geometry of the first 40 entries, columns,
  no overflow). qa6 (15/15) agrees. Attribution (qa7c): the same probe on
  the `64b8794` shell gives 6 failures and the warning. **B10 scope:** the
  focus guard is the smallest shell-only correction consistent with B10,
  not lifecycle infrastructure. Keeping the off frame laid out is what
  fixes F1, and once it is laid out Chromium lets the frame's own script
  focus it despite `inert` (measured: the off document's `hasFocus()` is
  true synchronously after `focus()`), so some guard is unavoidable. The
  guard is one `focus` listener per frame window plus one load-time
  `hasFocus()` check and a deferred hand-back. It keeps no state, reads
  no readiness signal, and changes no loading order, persistence or
  preload. Its side effects are F4.
- **F2 (B11): fixed.** Wheel delayed 1.5 s (qa8, 168/168 + 3/3), 15 cases
  × 3 widths: one arrival; three in a row; malformed; `mechanics=atlas`;
  `%256Dechanics%3Datlas`; valid then `MECHANICS`; `mechanics=board` then
  valid; malformed then valid; `#foo`; a repeat of the pending route; from
  rest; `#mechanical-color-pie` (the wheel finishes off at its route);
  explorer then wheel route; the explorer route first, then Color Wheel
  activated and a route typed while it loads; an arrival after the wheel
  document committed but before load (streamed). In every case the frame
  was confirmed `about:blank` (or committed-loading) at the arrival, and
  the last valid request wins. Rejected-last lands at rest with URL
  `index.html`. Entries = browser navigations only (no shell duplicate).
  `mechanics` is never in any entry, child-frame navigation, frame `src`
  or nav href. Back to the first shell entry and Forward again is
  consistent at every step. Back pressed while the re-pointed wheel is
  still loading is also consistent. Attribution (qa8c): the `64b8794`
  shell reproduces F2 exactly (frame `color=W`, entries `color=W >
  color=W`); `ca8873b` lands `ally=WU`. See N6.
- **F3 (B12): conditions met.** My own typed session (qa9, 15/15, 3
  widths): load; click W; typed `ally=UB`; click R; nav explorer; query
  `flying`; typed `enemy=WB` from the explorer; typed
  `#mechanical-color-pie`; the same URL typed again; nav wheel; typed
  `four=G`; Clear; typed malformed; click U; typed `mechanics=atlas`;
  typed `combine=WUR`; nav explorer. That is 16 steps and 22 entries,
  exactly the browser-model count (+1 per action, +1 more per typed wheel
  route into a loaded wheel with a different route).
  - No state lost: the explorer query survives every arrival and the
    whole traversal.
  - At every step and every Back/Forward position, URL = view + frame
    route, with the right title, constant length and no `mechanics`.
  - Back passes through all 14 distinct created states in reverse order
    (21 positions). Forward passes through them in order and ends at the
    last.
  - The only extra positions are the typed-wheel-route arrival entries,
    each showing the prior wheel route. A same-URL typed
    `#mechanical-color-pie` adds a browser entry (N7).
  - No corrupt or unreachable created state.

### Findings

- **[Owner ruling B13: accepted known minor; deferred to Gate D; not a Gate B blocker.]**
- **F4 — minor (shell-caused by the B10 mechanism; no G criterion or
  ruling violated; non-failing). An explorer booting in the off frame
  still takes real focus, briefly and with side effects.**
  - *Reproduction:*
    1. Load `index.html#color-wheel/color=W`.
    2. Activate Mechanical Color Pie, and within about 0.1–2 s return to
       Color Wheel.
    3. Press Tab twice, so that focus is on a wheel control (for example
       `.mode-btn`).
    4. Wait for the explorer's boot self-test.
  - *Expected:* the off frame never holds focus, and the user's focus is
    left where it was (as in `64b8794`, where the display:none frame could
    not take focus).
  - *Actual (qa7b, qa7c, qa9b, all widths):*
    - The explorer's self-test calls `listEl.focus()` once. The off
      document holds focus for 7.5–11.9 ms until the deferred hand-back. A
      key pressed in that window goes to the off explorer (qa9b traced one
      Enter landing there).
    - The hand-back returns focus to the shown frame, but the wheel's
      focused control is cleared to `BODY`. It is Chromium that clears it,
      at the moment of the grab (read synchronously before the hand-back).
      The ring disappears; the next Tab continues from the old position
      (`layer-btn`).
    - If focus was on the shell nav, it moves into the shown frame, so a
      following Enter acts there instead of on the nav. That is why 2 of 10
      rapid Enters were lost at 360. `64b8794` loses Enters the same way
      while its explorer is *shown* (the pre-existing boot grab, N2).
    - The `64b8794` shell keeps `.mode-btn` focused in step 3 but has F1.
  - *Impact:* keyboard users only, only during the explorer's first boot,
    and only if they leave it before boot completes. Focus never stays in
    the invisible frame, and Tab never reaches it. G11 holds: focus is in
    the shown frame and Tab continues inside it. The contract's "handed
    back to the shown frame" is met. Recorded as a follow-up for the
    Owner. Avoiding it would require remembering and restoring
    instrument-internal focus, or changing the explorer (Gate D).
- **N5 — note (docs precision).** `AGENTS.md` and the shell's header
  comment say the shell reads only the wheel's hash, plus focus. It also
  reads the wheel frame's `location.href` (`wheelPending`) and each
  frame's `document.hasFocus()`. This is harmless and inside B10/B11's
  spirit; wording only.
- **N6 — note (browser model, B11).** In a re-pointed load, the original
  load entry never showed its route (the wheel had not committed), so
  traversal re-derives it to the landed route. Back from `ally=WU` shows
  `ally=WU` once more, and the never-loaded `color=W` is not reachable.
  The same happens when the arrival comes after commit but before load:
  Chromium replaces the frame's entry there. The shell adds no entry.
- **N7 — note (browser model, B12).** Typing the *same* shell URL again
  (`#mechanical-color-pie` while it is shown) adds one browser entry with
  the same state.
- **Unchanged pre-existing (B8):**
  - N1, the Combine bounce (G19 framed = standalone);
  - N2, the explorer's post-load scroll and focus (framed = standalone
    within run-to-run variance);
  - N3, the wheel's `SyntaxError` on `four=W%22` (framed = standalone);
  - outbound links and the dead Mechanics control (not exercised; not
    touched by the rework).

### Blocked / not verified

- Not blocked. Not verified, and not required:
  - real screen-reader speech (G13 and G15 cover the tree and the live
    text);
  - iOS and Firefox (B2);
  - `file://` hard reload with toolbar Back/Forward (a human check, B4).

## Decisions needed

None open. `robqa`'s F1–F3 on `64b8794` were ruled by the Owner (B10–B12),
and F4 on `ca8873b` by B13.


## Follow-ups

- **Gate B (new):**
  - **Owner-reported, 2026-10-04 (videos `color wheel1/2.mp4` and
    `mechanicalPie1.mp4`); both are instrument defects, outside Gate B, and
    neither is caused by the shell:**
    - **Gate C — literal `{C}` in the Color Wheel.** Assigned to Gate C by
      Owner ruling, 2026-10-04. Not a Gate B blocker.
      - **Location:** `color-wheel.html:3638`, in the Combine colorless
        panel's "Not the same thing as." paragraph, rendered as raw text.
      - **Evidence that this is a one-site correction:** it is the only
        literal `{…}` mana code in either instrument's rendered text,
        attributes included. The scan (`bracescan.mjs`, headless Edge 154,
        local HTTP) covered the wheel at rest, all 5 colors, 5 crossings,
        5 alliances, 5 conflicts and all 32 Combine sets, and the explorer
        at rest, with all 216 entries opened and each single-color lens. It
        reproduces standalone.
      - **Rule:** player-visible Magic mana notation renders as mana
        symbols, not raw brace notation. Braces in source code are not
        replaced globally.
      - **Required fix (Owner ruling):**
        - replace the raw `{C}` with the page's existing mana-symbol
          rendering;
        - give it an accessible text label such as "colorless mana";
        - use the existing neutral or default symbol presentation
          (inherited text treatment, or the established neutral/gilt
          treatment);
        - no new "colorless color" value and no new semantic color token:
          `{C}` is mana notation, not a sixth color identity;
        - the meaning of the Colorless panel does not change.
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
  - A same-document arrival into a loaded wheel costs one redundant Back
    step. It was accepted under B12. Gate E bridges will arrive through
    shell URLs; revisit there only if that matters.
  - `CLAUDE.md` gives `HANDOFF.md` as "~166" lines; ledgers run longer.
    Unrelated to the shell, so left alone.
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
