# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `complete`. **Gate E (cross-links) accepted by the Owner,
  2026-10-08**: E1 `e6ed5f2` + `def153a`, E2 `360eaea`. The Owner ruled
  E-D1 (A), E-D2 (a) and E-D3 on 2026-10-07. Separate robqa QA-5 on
  `360eaea` passed with no blocker, major or minor findings and 2 notes, and
  the Owner's manual QA passed 7 of 7.
  - Transitions: `idle -> dev-in-progress` (Owner rulings E-O1 to E-O6);
    `dev-in-progress -> awaiting-decision` (Step 0, E-D1);
    `awaiting-decision -> dev-in-progress` (E-D1 A, E-D2 a);
    `dev-in-progress -> ready-for-qa` (the E1 candidate);
    `ready-for-qa -> dev-in-progress` (E1 Owner QA passed, E-D3 applied;
    E2 begins);
    `dev-in-progress -> ready-for-qa` (the E2 candidate `360eaea`);
    `ready-for-qa -> qa-passed` (separate robqa QA-5, 2026-10-07);
    `qa-passed -> complete` (Owner manual QA 7 of 7 and acceptance,
    2026-10-08).
- Last accepted: **Gate D**, `8d0ea25` (2026-10-07). Ledgers:
  `docs/handoff-archive/gate-d.md` and `gate-c.md`; Gates A and B are in git
  at `5252333` and `b62131b`.
- Owner: Vox Mana. Coordinating agent: Claude (robdev). QA: the separate
  `robqa` agent (Sonnet) for E2 and B12; a same-agent phase for E1.
- Allowed files: `vox-color/index.html`, `vox-color/mechanical-explorer.html`,
  `vox-color/color-wheel.html`, `HANDOFF.md`. `AGENTS.md` and `CONTEXT.md`
  may change only for a statement this gate makes false.
- Prohibited: `data/`, `tools/`, the taxonomy, goldens, recon truth, the
  explorer's self-test assertions, `PRODUCT-DEFINITION.md`, the wheel's
  preview Mechanics code.
- Base commit: `64869a8`; E1 re-based on `9c96a5d`, the Owner's explorer
  commit. Candidate commits: E1 `e6ed5f2` and `def153a` (E-D3); E2
  `360eaea`.
- robqa class: E1 is **QA-3** (a same-agent phase). E2, including the
  handoff into a loaded explorer, is **QA-5** (the separate `robqa` agent).

## Owner decisions (2026-10-07)

Contract: `PRODUCT-DEFINITION.md` §15 (payloads are canonical WUBRG keys
only; the destination owns state on arrival; no colorless bridge; never
`#mechanics`). §17 order: the explorer route first, then the bridges.

- **E-O1. Explorer → wheel opens the richest Explore view.**
  - One colour: `color=W`.
  - An adjacent pair: `ally=WU`.
  - A non-adjacent pair: `enemy=WB`.
  - Four colours: `four=X`, where X is the excluded colour.
  - Three or five colours: `combine=<keys>`.
  - Keys use the wheel's own canonical forms; Step 0 confirms the exact
    `ally`, `enemy` and `four` values from `applyRoute`.
- **E-O2. Arrival only.** The explorer reads `colors=<WUBRG>` on arrival, and
  the shell then canonicalises its URL to a bare `#mechanical-color-pie`
  (`replaceState`). The explorer never writes its URL. Reload shows the
  explorer at rest (§11).
  - **Amended by E-D2 (a):** standalone, the URL keeps `#colors=<k>`, and a
    reload re-applies the lens. The explorer still never writes its URL.
- **E-O3. Arriving into an explorer that is already open** replaces the
  colour lens and closes the open entry. Search, order and spot are kept.
  - **Amended by E-D3 (Owner, 2026-10-07):** every spot is computed from the
    lens, so an arrival that changes the lens clears the spot. One with the
    same colours keeps it.
- **E-O4. Bridges always show** (the product will be hosted online). No
  framing check.
  - **Derived constraint (coordinating agent):** when framed by the shell,
    a bridge must change only the shell's hash, a same-document navigation,
    and never load `index.html` by path. If it did, a shell served at
    `/vox-color/` (a directory index, as on a host) would reload both
    frames and lose the explorer's in-memory state.
  - Standalone, the bridge opens the shell at `index.html#…`.
  - On `file://` the shell does not integrate (Gate B). That is accepted.
- **E-O5. Link labels: the coordinating agent chooses** plain labels, with
  no marketing copy; the Owner may change them at review.
  - Proposed: "View these colors in the Mechanical Color Pie →" and "Open
    these colors on the Color Wheel →".
  - No bridge for colorless, at rest, or an empty Combine set.
- **E-O6. Fix B12 in this gate**: a same-document arrival into a loaded
  wheel costs one redundant Back step.
  - Required: one bridge click makes exactly one history entry, and Back
    returns to the exact previous view and route, in both directions.
  - Gate B's attempts with `location.replace` and reload corrupted the
    previous entry (shared frame entries). Step 0 must measure before
    choosing.
  - If the only clean fix needs the shell to hand state to a loaded frame
    by a means beyond `src` and hash (§9 says the shell reads nothing but
    the wheel's hash), stop and bring the option to the Owner.
  - **Amended by E-D1 (A):** B12 stays for a bridge into a loaded wheel
    (P3). That path costs +2 entries, and Back passes once through the
    prior wheel route, as Gate B accepted. Every other path must be +1 and
    exact. Step 0 measured that P3 cannot be fixed within `src` and hash.
    Options B (reload) and C (the shell owns the wheel's route) were
    declined.
- **E-D1 (A) and E-D2 (a)** were ruled on 2026-10-07 and are folded into
  E-O6 and E-O2 above.

## Step 0 (before any product edit)

1. Baseline: the hashes of the three HTML files, the self-test at 84/84,
   and the gate chain.
2. Reproduce B12 at `64869a8`. Count the history entries for each arrival
   path: typed shell URL; arrival into an unloaded and a loaded wheel;
   arrival into an unloaded and a loaded explorer.
3. Choose the handoff mechanism for each path, and record the measured
   reason.
4. Confirm the wheel's canonical `ally`, `enemy` and `four` keys and the
   pair-adjacency rule.

## Acceptance criteria

- **GE1.** `index.html#mechanical-color-pie/colors=<k>` with canonical WUBRG
  `k` (1–5 colours) opens the explorer with that lens. The URL then reads
  `#mechanical-color-pie`.
  - Non-canonical, empty, `C`, malformed or `mechanics`-bearing values land
    at rest without errors.
  - The standalone `mechanical-explorer.html#colors=<k>` opens with the same
    lens. Its URL keeps the hash (E-D2 a).
- **GE2.** The wheel shows the explorer bridge for every coloured Explore
  target and for Combine with 1–5 colours, and none otherwise. Its payload
  is the shown colours.
- **GE3.** The explorer shows the wheel bridge whenever its lens is
  non-empty. Its target follows E-O1.
- **GE4.** When framed, a bridge click makes exactly one history entry, and
  Back and Forward restore the exact previous view and route.
  - Exception (E-D1 A): a bridge into a loaded wheel keeps B12, at +2.
    Back passes once through the prior wheel route, and no state is lost.
  - Nothing reloads, and the wheel's state survives.
  - Focus moves into the destination, and the view is announced.
- **GE5.** No shared state: payloads carry keys only (no entry, query or
  names), there is no shared storage, and `#detail` stays the sole owner of
  mechanic detail.
- **GE6.** The self-test passes 84/84, the console is clean, the gate chain
  is green and `node --check` is clean. Gate B's and Gate C's routing
  behaviour is unchanged, including B12.

## Implementation

### Step 0 results (robdev, 2026-10-07)

Measured in the in-app browser (Chromium) on local HTTP, against a clean
`git archive HEAD` export. The working tree's uncommitted change to
`mechanical-explorer.html` was excluded (see Follow-ups).

**1. Baseline (HEAD `9ae502a`; `vox-color/` unchanged since `64869a8`).**
- sha256 of the git blobs (LF):
  - `index.html`: `fc569f4c80ccde8a…`
  - `color-wheel.html`: `6a16bf03aa5728d6…`
  - `mechanical-explorer.html`: `764017cbe4fa8e53…`
- Self-test 84/84 at a 1280×800 viewport. At 0×0 (a hidden pane) the fold
  plates assertion fails, 83/84: run it at a real size.
- Gate chain: exit 0.

**2. History entries per arrival path at HEAD.** Same-document arrivals
were started from inside a frame (`parent.location.hash = …`), as a bridge
would start them.

| Path | Entries | Back / Forward |
|---|---:|---|
| P1. Typed or linked shell URL (a new document) | +1 | exact |
| P2. Arrival into an unloaded wheel (pie → `#color-wheel/ally=WU`) | +1 | exact |
| P3. Arrival into a loaded wheel (wheel `color=W` → nav to pie → `#color-wheel/ally=WU`) | **+2** | Back 1 lands on wheel `color=W` (the extra entry), Back 2 on the pie, Back 3 on wheel `color=W`. **This is B12.** |
| P4. Arrival into an unloaded explorer | +1 | exact |
| P5. Arrival into a loaded explorer (no payload yet) | +1 | exact |

**3. Joint-history probes** (a throwaway parent page and child frame; top
entry N, then a hash push to N+1, then a frame change):
- **Frame `location.replace` after the top push** gives +1, but the
  replace rewrites the frame's history item in the earlier entries too, so
  the pre-arrival route is lost. This explains Gate B's G6 failure.
  - **Corrected during E2.** The first probe called `replace('#…')` from the
    parent with a relative URL. `replace()` resolves a relative URL against
    the calling document, so run 1 loaded the parent page into the child
    frame, a cross-document navigation. That was the "clean first run".
  - Re-measured with absolute URLs (a directory-listing parent and a
    `PROMPT.md` child): a same-document frame replace corrupts the earlier
    entries 3 runs of 3. E-D1 stands.
- **Frame push, then a top `replaceState` or `location.replace`** gives +1,
  but N's top URL is rewritten, so the previous view is lost (T2, T3).
- **A top push, then a frame push** gives +2 (the status quo).
- **A frame replace with the payload, then a deferred replace back to
  bare** (`#`): +1. The payload reaches `hashchange` (`e.newURL`) and the
  frame ends bare. Six Back and six Forward fire no `hashchange` in the
  frame, so nothing replays (three runs). If both replaces run in the same
  task, no `hashchange` fires at all.

**Mechanism per path (proposed):**
- P1, P2, P4: unchanged. An unloaded frame gets its payload through `src`;
  its first navigation adds no entry.
- P5, a bridge into a loaded explorer: the shell replaces the pie frame's
  hash with `colors=<k>` and, after the explorer's `hashchange`, replaces
  it with bare `#`. This is safe because the lens is in memory and not tied
  to history (E-O2). The rewrite happens in place, but every pie item is
  already bare, so no entry changes visibly. Cost: +1, exact.
- **P3, a bridge into a loaded wheel: there is no clean mechanism within
  `src` and hash.** One entry cannot carry both a view change (the top
  item) and a route change (the wheel's item). Each extra change is either
  a second push (B12) or an in-place rewrite of a history item that earlier
  entries share (a lost route or view). Reloading is excluded by GE4, and
  Gate B measured that it rewrites the prior entry. This hits the E-O6 stop
  condition, so it goes to the Owner as E-D1.

**4. Wheel keys (confirmed in `applyRoute` and the markup).**
- `D.order` is `W U B R G`.
- Targets are matched by exact `data-key`:
  - colours: `W U B R G`;
  - allies: `WU UB BR RG GW`;
  - enemies: `WB UR BG RW GU`;
  - four colours: `four=X`, where X is the excluded colour.
- `combine=` accepts any order, and the wheel writes it in `D.order`.
- **Adjacency rule.** Take a pair at WUBRG indices i < j:
  - j − i ∈ {1, 4}: allies. The key is in pentagon order: `WU`, `UB`,
    `BR`, `RG`, and `WG` → **`GW`**.
  - j − i ∈ {2, 3}: enemies. The key starts at the colour two steps
    clockwise before the other: `WB`, `UR`, `BG`, and `WR` → **`RW`**,
    `UG` → **`GU`**.
- A WUBRG-sorted key that the wheel does not use (for example `ally=WG`)
  matches nothing. It lands in Explore with no selection, so the explorer's
  bridge must emit the wheel's form.

### E1 candidate `e6ed5f2` (robdev, 2026-10-07)

**Scope.** E1 is the explorer's own route: the standalone part of GE1, plus
E-O3 and E-D2 (a). The shell route `#mechanical-color-pie/colors=<k>`, the
handoff into a loaded explorer, and both bridges are E2.

**Re-baseline at `9c96a5d`.**
- The explorer blob's sha256 is `323674380f0a2913…`; the other two files
  are unchanged.
- Self-test 84/84 at 1280×800, console clean, gate chain exit 0.

**Change.** `vox-color/mechanical-explorer.html` +23 −1 (blob sha256
`de60bdadf18c8470…`):
- one ARRIVAL block after `clearColors`: `colorsKey`, `arrive` and a
  `hashchange` listener;
- `boot` applies a held arrival before the self-check, and keeps the
  self-check's promise.

How it works:
- **The key is read raw.** `#colors=` must be followed by 1 to 5 of
  `WUBRG`, equal to its own `setKey` (canonical order, no duplicates).
  There is no decoding, so malformed percent-encoding cannot throw.
- **`arrive`** sets the lens with `selFromQuery` false, closes the open
  entry (`S.pick = null`), re-runs an active search, and renders. It does not
  call `setSel`, because `setSel` clears the spot.
- **Timing.** An arrival before boot is held and applied before the
  self-check, which saves and restores it. One during the self-check is
  chained after the check's promise.

**Checks** (in-app Chromium, local HTTP, 1280×800):
- `node --check` on the extracted script: OK.
- GE1, standalone:
  - `#colors=WU` on load gives lens WU, 84/84, and the hash is kept.
  - A reload re-applies it (E-D2 a).
  - `#colors=WUBRG` and `#colors=G` apply.
  - 15 invalid forms land at rest, each with 84/84 and no errors: empty,
    `#`, `#colors=`, `C`, `UW`, `WW`, `wu`, `W%55`, `WUBRGW`, `#%E0%A4%A`,
    `#mechanics`, `#colors=WU&mechanics`, `#colors=WU/x`, `#colors%3DWU`,
    `#COLORS=WU`.
- E-O3. Before: query `ramp`, A–Z order, spot `bucket:primary:list`, and
  `flying` open. After `#colors=G`: the lens is G, the entry is closed and
  the detail hidden, and the query, order and spot are unchanged.
- **Ignored values.** A bare `#` and the non-canonical `#colors=RB` leave
  the lens alone. So does Back through them.
- **Timing.**
  - An arrival before boot: kept.
  - Two arrivals during the self-check: the last one wins.
  - One during the check and one after: the last one wins.
  - Each case passes 84/84.
- The rendered lens is visible: after `#colors=R`, the Red pip and the Red
  compass node are pressed.
- The console is clean on a fresh load.

**E-D3 follow-up, `def153a`** (+3 −1). Every spot kind (`bucket`, `add`,
`rem`) is computed from the lens. `arrive` now clears the spot when the new
key differs from the current lens.
- Checked: an arrival with the same colours keeps the spot, while
  `#colors=G` after BR clears it and hides `#spotbar`. Search and order are
  kept in both cases.
- `node --check` OK; 84/84; the console is clean in a fresh tab.

**Expected robqa class:** QA-3 (a single component, no shell change).

**Draft Owner checklist (E1):**
1. Open `mechanical-explorer.html#colors=WU` over HTTP. The White and Blue
   pips are on, and the self-check reads 84 of 84.
2. Open an entry, then change the hash to `#colors=R` by hand. The lens is
   Red, the entry is closed, and the search box is unchanged.
3. Try `#colors=UW` and `#colors=C`. Nothing changes, and there are no
   console errors.
4. Reload on `#colors=R`. Red comes back.

### E2 candidate `360eaea` (robdev, 2026-10-07)

**Changed files** (numstat, + −):
- `vox-color/index.html` +53 −5 (blob sha256 `43c51c4137c637f6…`)
- `vox-color/color-wheel.html` +34 −0 (`7c6d4662fd672b08…`)
- `vox-color/mechanical-explorer.html` +26 −1 (`07d2aef8fbf93af9…`)
- `AGENTS.md` +6 −3 and `CONTEXT.md` +2 −1: both name the new route, and
  `AGENTS.md` names the shell's new write.

**How each criterion is met:**
- **GE1 (shell).** `parse` accepts `#mechanical-color-pie/colors=<k>` only
  when `k` matches `^W?U?B?R?G?$` and is non-empty. Anything else under that
  prefix is rejected like any unknown route: wheel at rest, URL replaced
  (Gate B's rule, unchanged).
  - `arrive` hands `k` to the explorer (`sendColors`), shows it, and
    replaces the URL with `#mechanical-color-pie`.
  - An explorer frame that has not loaded is (re)pointed at
    `mechanical-explorer.html#colors=<k>`.
  - A loaded frame's hash is replaced with an absolute URL, then replaced
    with a bare `#` a task later.
  - The pie frame's `load` handler clears any hash, so reload and traversal
    never replay a payload.
- **GE2 (wheel).** `#bridge` sits under the wheel, outside the panel.
  `updateBridge` runs after `applyHash` on every `hashchange` and once on
  load. It reads the wheel's state (`mode`, `sel`, `combo`), not the hash,
  so a route that selects nothing shows no bridge.
  - The payload is the shown colours in WUBRG order. For `four=X` it is the
    other four colours.
- **GE3 (explorer).** The link is the last item of `#lensline`, which shows
  whenever the lens is set. `wheelRoute` follows E-O1 with the Step 0 keys.
- **GE4.** Inside the shell, a click on either bridge sets only
  `top.location.hash`. On its own (or if the parent can't be reached), the
  `target="_top"` link opens `index.html#…`. Modified clicks are left to the
  browser.
- **GE5.** Only keys are passed. Nothing is stored and nothing is posted
  between frames, and `#detail` is untouched.
- **GE6.** The checks below.

**Checks** (in-app Chromium, local HTTP, 1280×800 unless noted):
- `node --check` passes on all three scripts. The gate chain exits 0, and
  `git diff --check` is clean.
- **GE2, standalone wheel.**
  - Shown, with this payload:
    - `color=W` → W;
    - `ally=GW` → WG and `ally=WU` → WU;
    - `enemy=RW` → WR and `enemy=GU` → UG;
    - `four=W` → UBRG and `four=G` → WUBR;
    - `combine=WUR` → WUR, `combine=RGW` → WRG and `combine=WUBRG` → WUBRG.
  - Hidden: at rest, for `combine=`, for `ally=WG`, for `color=C` and for
    `#mechanics`.
  - Clicks: a vertex in Explore shows it. In Combine from rest, adding
    +G, +U and +B gives G, UG and UBG; removing all three, or choosing the
    centre, hides it.
- **GE3, standalone explorer:** all 21 non-empty lenses map correctly. A lens
  set from a search (`red ramp`) gives `color=R`. At rest or cleared there is
  no link. 84/84.
- **GE1, shell.**
  - A fresh load of `index.html#mechanical-color-pie/colors=WU` gives lens
    WU, URL `#mechanical-color-pie`, pie frame `…html#`, and 84/84 in the
    frame. A reload brings it back at rest.
  - Typed into an open shell: +1, lens BR, URL canonical.
  - These all land on the wheel at rest, with the URL replaced and no
    errors: `/colors=UW`, `/colors=`, `/colors=C`, `/colors=WW`,
    `/colors=wu`, `/colors=WU%26mechanics`, `/colors=WUmechanics`,
    `/colors=W/x`, `/colors=%57`, `/colors=WUBRGW`.
- **GE4, one session.**
  - Explorer → unloaded wheel (WG): +1, `ally=GW`.
  - A wheel click R: +1.
  - Wheel → loaded explorer: +1. The lens is R, the open entry closes, and
    the query `ramp` is kept.
  - Explorer → loaded wheel (UG): +2 (B12, E-D1), `enemy=GU`.
  - Five Back steps: wheel R (the B12 extra entry), then pie, wheel R,
    wheel GW and pie. Five Forward steps mirror them. Every step is exact,
    and the lens never replays.
  - Focus moves into the destination frame. The announcements read "Showing
    Color Wheel" and "Showing Mechanical Color Pie".
- **GE4, directory URL.** Shell at `/vox-color/#color-wheel/color=W`.
  - Wheel → unloaded explorer: +1, lens W, and 84/84 in the frame.
  - Markers set in the shell and the wheel survive, so nothing reloaded.
  - Back and Forward are exact.
  - Five cycles (explorer → wheel, a vertex click, wheel → loaded
    explorer): each hand-off is +1 and delivers its colour (U, B, R, G, W).
- **Standalone bridges.**
  - The wheel at `ally=GW` opens `index.html#mechanical-color-pie`, with
    lens WG and a bare pie frame.
  - The explorer at `#colors=WR` opens `index.html#color-wheel/enemy=RW`.
- **Layout** (measured, not screenshotted; the window does not paint).
  - At 1280: the wheel's link sits centred under the SVG, in brass Lora
    15 px. The explorer's link sits at the right end of the lens line, and
    with WUBRG it wraps under the counts.
  - At 375: each link is one line inside the viewport.
  - No horizontal scroll at either width.
- The console is clean throughout.

**A bug found and fixed before the commit.** The first version called
`replace('#')` from the shell. `replace()` resolves that against the shell's
URL, so it loaded `index.html` into the explorer frame. The fix is
`pieHash()`, which uses the frame's own `href`. It also showed that a Step 0
probe was invalid (see item 3).

**Expected robqa class:** QA-5. It touches the shell and cross-frame
history.

**For robqa (independent re-derivation):**
- Re-derive the history model yourself:
  - the entry count for each path P1–P5 with payloads;
  - a long mixed Back/Forward walk;
  - Back/Forward after a reload in each view.
- Confirm that no shell URL, frame URL or history entry ever keeps
  `colors=`, except the standalone explorer (E-D2 a).
- Confirm Gate B's routing is unchanged, including B12, the retired
  Mechanics route forms, and malformed encodings.
- Check focus and announcements on each bridge.
- Measure the deferred clear's ordering: the payload must be delivered
  before the clear, across repeated hand-offs.

**Draft Owner checklist (E2)**, over `http://localhost:8000`:
1. Open `http://localhost:8000/vox-color/index.html#color-wheel/ally=GW`.
   Under the wheel, "View these colors in the Mechanical Color Pie →"
   shows. Click it: the explorer opens with Green and White on, and the
   address bar ends `#mechanical-color-pie`.
2. In the explorer, click "Open these colors on the Color Wheel →" (right
   end of the lens line). The wheel shows Selesnya (the green–white edge).
3. Press Back once. You should be back in the explorer.
4. Choose Red only in the explorer, then click the wheel link. Click a
   different colour on the wheel, then click the explorer link. The
   explorer shows that new colour, and its open entry, if any, is closed.
5. Look at both links on a phone-width window. Owner's call on placement
   and wording (E-O5).

## QA

- **E1, Owner manual QA, 2026-10-07: 4 of 4 passed** on `e6ed5f2` over
  local HTTP. In the console, the self-check read 84 of 84.
- **E-D3 (`def153a`), Owner manual QA, 2026-10-07: 2 of 2 passed.** A spot
  set under BR clears on `#colors=G`.

### E2 `360eaea`: separate robqa, class QA-5 (2026-10-07)

**Bind.** HEAD is `360eaea` (parent `def153a`). The working tree differs
only in `HANDOFF.md` and the untracked `dev.lnk`. `git diff --stat`: five
files, +121 −10: `vox-color/index.html`, `color-wheel.html`,
`mechanical-explorer.html`, plus `AGENTS.md` and `CONTEXT.md`. The last two
are inside the allowance ("a statement this gate makes false"). The server
at `http://localhost:8000` (pre-existing, repo root) serves an
`index.html` whose sha256 equals the committed blob (`43c51c41…`).

**Method.** Headless Edge 154 over CDP from Node scripts in the scratch area
(not in the repo), 1280×800, fresh tab per run, real mouse clicks on the
bridges (after `scrollIntoView`), `history.back()`/`forward()` for
traversal, `Page.getNavigationHistory` for entry counts. I did not run the
gate chain or `node --check`: the diff touches no data and the developer's
run is not repeated. The extracted-script syntax is proved by the page
running with an empty console.

**Cost gate.** Protects: shell routing, cross-frame history, the deferred
clear. A targeted check catches what a diff read cannot: history item
sharing and ordering. No sweep, screenshot or width check was run.

**Checks** (`action → observed`):
1. Entry counts, one session from `#color-wheel/color=W`:
   - wheel bridge → unloaded explorer: **+1**, lens W, URL `#mechanical-color-pie`, 84/84.
   - explorer (lens UB, `flying` open) bridge → loaded wheel: **+2**
     (B12, E-D1 A), wheel `ally=UB`.
   - wheel own push `combine=WUR` +1; wheel bridge → loaded explorer: **+1**, lens WUR, entry closed.
   - explorer (query `ramp`, lens R) bridge → loaded wheel: **+2** (B12), `color=R`.
   - nav pie +1, nav wheel +1, wheel `four=W` +1, wheel bridge → loaded explorer **+1** (lens UBRG, query `ramp` kept).
2. Walk across those 13 entries (index 12 → 1): full Back, full Forward,
   and a mixed Back/Forward walk of about 40 steps. Every step landed on the
   recorded view, shell URL and wheel route. The only extra stops are the
   two accepted B12 entries, which show the prior wheel route (`combine=WUR`,
   `color=W`) both ways. The explorer lens stayed `UBRG` and the query
   `ramp` throughout: nothing replayed. Top URL, both frame URLs and every
   entry URL were checked on every step: **no `colors=` anywhere**.
3. Reload in each view: reload in the wheel view (after a +2 bridge) → wheel
   `ally=GW` kept, explorer frame empty; Back ×2 → wheel `color=W` (the B12
   entry), then the explorer at rest (lens empty, 84/84, not WG); Forward ×2
   exact. A wheel bridge after the reload → +1, lens WG. Reload in the
   explorer view → `#mechanical-color-pie`, explorer at rest (lens empty,
   84/84); Back → wheel `ally=GW`; Forward → explorer. No `colors=` in any URL.
4. Deferred clear, 15 hand-offs into a loaded explorer (wheel route set,
   then bridge, with 0/5/30/300 ms before the check; keys `W UB WUR G WUBRG
   WUBRG RG UBRG W BR WBG U WG R GU`, including the same key twice): each
   delivered its key (`GU` arrives as the canonical `UG`), the explorer
   frame ended on a bare URL, the shell URL was `#mechanical-color-pie`,
   84/84. A second series of 8 on a fresh tab (`W UB UB WUR G WUBRG RG U`):
   each bridge +1, the repeated `UB` +1 with the wheel route push 0. Two
   hash writes in one task (`colors=RG` then `colors=WU`) → the lens is WU.
5. Gate B routing. Fresh load of each: `colors=UW`, `colors=`,
   `colors=WU%26mechanics`, `#mechanics`, `#color-wheel/%E0%A4%A`,
   `#color-wheel/%256Dechanics` → wheel at rest, URL `index.html`, no
   explorer lens, console clean. `colors=WU` and `colors=G` → explorer with
   that lens, URL `#mechanical-color-pie`, frame bare. As same-document
   arrivals in an open shell: `#`, `''`, `#mechanics=flying`,
   `#color-wheel/mechanics`, `%6Dechanics`, `%256Dechanics`, `%E0%A4%A`,
   `#nonsense`, `…pie/mechanics`, `colors=UW`, `=WU%26mechanics`,
   `=%E0%A4%A`, `=`, `=C`, `=WUBRGW`, `=wu`, `=WU/x`, `=W&x` → wheel at
   rest, URL replaced, lens untouched. `colors=WUBRG` → lens WUBRG. A typed
   `colors=BR` into an open shell with the wheel at `color=B` → explorer lens BR.
6. Focus and announcement: after every bridge and every traversal, focus
   was on the destination frame (`frame-pie` or `frame-wheel`) and
   `#announce` read "Showing Mechanical Color Pie" or "Showing Color Wheel".
7. Payload mapping: all 31 explorer lenses → link `color=`/`ally=`/`enemy=`/
   `four=`/`combine=` per E-O1, zero mismatches (incl. `WG→GW`, `WR→RW`,
   `UG→GU`, `UBRG→four=W`). Wheel routes → payload, zero mismatches:
   `color=W`, `color=G`, `ally=WU`, `ally=GW`→WG, `ally=BR`, `enemy=WB`,
   `enemy=RW`→WR, `enemy=GU`→UG, `enemy=UR`, `four=W/B/G`, `combine=WUR`,
   `RGW`→WRG, `WUBRG`, `U`; hidden for `combine=`, `color=C`, `ally=WG`, at rest.
8. Standalone: `color-wheel.html#ally=GW` bridge → `index.html#mechanical-color-pie`
   with lens WG; `mechanical-explorer.html#colors=WR` keeps its URL, link
   `index.html#color-wheel/enemy=RW`, click → wheel `enemy=RW`, bridge WR.
9. Console: no exception and no error log on any run (only the harness's
   own favicon 404, filtered).

**Findings.**
- **note N1.** At 1280×800 the wheel's bridge sits at about y=960 in the
  frame (the wheel document is about 4065 px tall), so it is below the
  fold and needs a scroll to reach. This is placement, which the Owner
  judges (E-O5); no defect.
- **note N2.** Hand-offs into a loaded explorer rewrite its URL in place
  twice (payload, then bare). Not observable in any entry in these runs,
  as the developer's model predicts. One unexplained lens `WB` showed once
  on the explorer in an earlier harness run whose clicks missed their
  targets (the harness bug, not reproduced in the later runs that
  exercised the same paths); recorded for completeness.
- No blocker, major or minor findings.

**Not covered here** (stays with the Owner): appearance, the 375 px
layout, link wording, `file://` hard reload and Back/Forward. Chromium's
50-entry history cap truncated one long run; counts above come from
fresh tabs below the cap.

**Owner checklist (E2)**, over `http://localhost:8000` (the developer's
draft stands; added items 6–8):
1. `/vox-color/index.html#color-wheel/ally=GW`: scroll under the wheel; the
   link "View these colors in the Mechanical Color Pie →" shows. Click:
   the explorer opens with Green and White, the address ends
   `#mechanical-color-pie`.
2. In the explorer, "Open these colors on the Color Wheel →" (right end of
   the lens line): the wheel shows Selesnya (green–white).
3. Back once: the explorer, as it was. (Back from the wheel arrival passes
   once through the previous wheel route: B12, accepted.)
4. Explorer: Red only, open an entry, click the wheel link; on the wheel
   choose another colour, click the explorer link: the lens is the new
   colour and the entry is closed; search text is unchanged.
5. Reload in the explorer view and in the wheel view: no lens comes back
   from the bridge; the URL has no `colors=`.
6. Paste `index.html#mechanical-color-pie/colors=WU` into the address bar:
   the lens is WU and the URL reads `#mechanical-color-pie`.
7. Both links at 375 px width and 1280 px: placement, wrapping, wording
   (E-O5), and the link's focus ring with the keyboard.
8. `file://` (not integrated by design): open the wheel, then its link; and
   the shell's hard reload and Back/Forward.

**Verdict: `qa-passed`.** I do not mark `complete`; only the Owner accepts.

### E2 `360eaea`: Owner manual QA and acceptance (2026-10-08)

- Items 1 to 7 of the robqa checklist passed over `http://localhost:8000`;
  item 8 (`file://`) was optional and not run.
  - Item 1 first failed in the Owner's browser: a cached pre-E2
    `color-wheel.html` in the wheel frame. A hard reload of
    `color-wheel.html` itself cleared it. Not a product defect; see the
    hosting follow-up.
  - Item 7: the Owner accepted the links' placement and wording (E-O5), and
    with it robqa's N1 (the wheel link sits below the fold at 1280×800).
- **Gate E accepted by the Owner, 2026-10-08:** E1 `e6ed5f2` + `def153a`,
  E2 `360eaea`.

## Decisions needed

None open. E-D1 (A), E-D2 (a) and E-D3 were ruled on 2026-10-07; see E-O6, E-O2 and E-O3.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### Accepted minors

- **F4 (B13, D-O2).** Leaving the Mechanical Color Pie during its first load
  lets its self-test take focus in the off frame for about 8–12 ms. A fix
  would touch the protected self-test.

### Gate E

- Now the active task (above). B12 stays for a bridge into a loaded wheel (E-D1 A).
- The Owner's explorer change was committed as `9c96a5d` (outside Gate E),
  and E1 is based on it.

### Unassigned (each needs its own story)

- **Mana-font fallback.** Without mana-font, the colorless glyph is 0 px
  wide (Gate C F1) and the wheel's mana glyphs render as boxes; the explorer
  shows letters instead.
- **`URIError`.** The wheel's `applyHash` throws on a malformed
  percent-encoded hash such as `#%E0%A4%A`.
- **Combine bounce.** With `#color=W` in the URL, pressing Combine flips
  back to Explore a frame later. It also happens on production.
- **Preview Mechanics retirement.** Remove the unreachable preview code:
  about 200 orphaned `mcp*` lines, the stale comments (N2) and the
  "LAYER 4 … stubbed" head comment.
- **Stale docs.**
  - `AGENTS.md` and `CONTEXT.md` still call Mechanics unbuilt.
  - `MECHANICS-CONTRACT.md` header, §7 step 8 and line 373.
  - `CONTEXT.md` understates the C16 caution and dates "Absence" 10 May
    (Wizards prints May 13, 2013).
  - N3: an unwrapped line in `AGENTS.md`.
- **`tools/gate.py` has no entry point.** It exits 0 having checked
  nothing; the real gates run inside `check_taxonomy.py` and
  `check_recon.py`.
- **Source-layer reopen candidate (reason 3).**
  - The grouping of the "Return target … from graveyard to hand." entries.
  - The missing explanation of "Creature sacrifice, forced, repeatable".
- **Small UI items.**
  - A doubled period in an entry's accessible name ("…with flying..").
  - The explorer's 1.5 px focus outline renders at 1 px at 1x.
  - The hard-coded `.panel` max-height.
  - Re-add `scrollbar-gutter:stable` to the wheel.
  - A headless-only scroll after the explorer loads; check it in a headed
    browser.
- **Housekeeping.**
  - Rename `ALIASES` and the shard `aka` field.
  - Commit or gitignore `docs/DATA-DOSSIER.html`.
  - Periodic table: move it to a prototypes folder (this changes its paths),
    restyle it to the field guide, and handle its atlas's ragged edge.
  - Record Three.js in `CONTEXT.md` if the periodic table is accepted.
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
