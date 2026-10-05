# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `dev-in-progress`. **The Color Pie — Gate B: integration shell.**
  Step 0 is recorded below; implementation of `vox-color/index.html` follows
  in this session.
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

## Shell contract (derived from §9 and B1–B7; no new route semantics)

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
  shown (`src` set on first activation), the other gets `hidden`; focus moves
  to the shown frame; `document.title` updates; the polite live region
  announces the B1 string. Activating the current view adds no entry.
  Modified clicks (new tab or window) are left to the browser.
- **Back / Forward:** the view follows the shell URL; the wheel route
  follows the frame. A view change by traversal moves focus to the shown
  frame and is announced, so focus is never left in a hidden frame.
- **Same-document arrival** (address bar or a link to a new shell hash; the
  entry has no shell state): routed exactly as a load, without a further
  history entry.
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

## Decisions needed

None open.

## Follow-ups

- **Gate B (new):**
  - A same-document arrival to a wheel route costs one redundant Back step
    (decision 3). Gate E bridges will arrive through shell URLs; revisit
    there if that matters.
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
