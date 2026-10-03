# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. Git history preserves completed handoffs. When Status is `idle`, the
remaining fields are intentionally blank.

## Control

- Status: `ready-for-qa`. Gate A material candidate **`a2d5eb5`**
  (`a2d5eb552dfe123fe51db7e56ea3cbe288581809`): both pages, `CLAUDE.md`,
  `MECHANICS-CONTRACT.md`, `CONTEXT.md` and this ledger.
  - **Transition:** `dev-in-progress -> ready-for-qa` (`robdev`,
    2026-10-02). No candidate-affecting edit after `a2d5eb5`. Next: an
    independent `robqa` session on that exact commit (§18.14). Not
    `qa-passed`, not accepted.
- Earlier status: `dev-in-progress`. Gate A, **implementation** of the approved sheet.
  - **Transition:** `awaiting-decision -> dev-in-progress` (`robdev`,
    2026-10-02, a fresh session). The Owner approved the sheet; the Owner
    decisions are recorded under "Owner decisions (implementation)".
    Preconditions held before any product edit: Status was
    `awaiting-decision`; Parts A and B are recorded; the 69-row sheet is
    present; against HEAD `08fca75` only `HANDOFF.md` was modified; both pages
    hash to the Step 0 baseline (wheel `c9a7752e…05ea`, explorer CR-stripped
    `e5b08803…a403`); no structural blocker is open.
- Earlier status: `awaiting-decision`. Gate A, §18.15 stop point 2: the
  wording and treatment sheet.
  - **Transition:** `dev-in-progress -> awaiting-decision` (coordinating
    agent, 2026-10-02, a fresh session). The sheet is recorded under
    "Wording and treatment sheet (§18.5)". The Owner choices are under
    Decisions needed. No product, rule or document file was edited, and
    nothing was committed.
  - **Next:** the Owner approves (or amends) the sheet and settles Decision 1.
    Then `awaiting-decision -> dev-in-progress` for implementation, in a new
    session.
- Previous status, kept for the record: `dev-in-progress`. Gate A, Step 0
  recon, **Part A**.
  - **Transition:** `complete -> idle -> dev-in-progress` (coordinating
    agent, 2026-10-02). The ledger was reset only after the item 1 baseline
    was taken on the clean tree at `08fca75`.
  - **Previous story:** "The Color Pie: product definition" was accepted at
    `eb4f1a0`. Its ledger is in git at `08fca75`. It is not reopened.
  - **Session split (Owner direction, 2026-10-02):**
    - This session runs Part A only: §18.4 items 1–4 and 7–9.
    - Items 5–6 (U1–U7 and the evidence ledger) run in the next session.
    - No product edit, and the wording sheet (§18.5) is not written here.
  - **Part A is recorded** under "Step 0 recon". The item 2 structural
    blocker did not occur.
  - **Part B is recorded** (2026-10-02, a separate session): §18.4 items 5–6
    (U1–U7, the V7 citations, the evidence ledger) and the 2017
    corroboration Part A deferred. No product edit; the wording sheet is not
    written. **Next:** a fresh session writes the consolidated wording and
    treatment sheet (§18.5) from Parts A+B, then moves to
    `awaiting-decision` (§18.15, stop point 2).
- Owner: the Owner. The coordinating agent acts as `robdev`. `robqa` is not
  assigned. It runs only after `ready-for-qa`, in a separate session (§18.14).
- Task: **The Color Pie — Gate A: source-purity cleanup of both
  instruments.** It is defined by reference, not copied, in
  `PRODUCT-DEFINITION.md` revision 6 (accepted at `eb4f1a0`; sha256
  `95c5224f…44fd978a`, blob `1f299765`):
  - goal: §18.1;
  - allowed files: §18.2 (written out below);
  - prohibited files: §18.3 (written out below);
  - acceptance basis: §18.12 (behavior preservation), §18.13 (test plan) and
    §18.14 (independent `robqa`);
  - stop points: §18.15 (written out below);
  - the cleanup lists (§18.6–§18.7), the V11 contract and projection
    boundary (§18.8–§18.9), the V16 guard (§18.10), the U procedure (§18.11)
    and the transitions (§18.16) also govern, by reference.
- Allowed files (§18.2):
  - `vox-color/color-wheel.html`;
  - `vox-color/mechanical-explorer.html`;
  - `HANDOFF.md`;
  - `CLAUDE.md`: only the invariant "Mechanics mode stays preview-only —
    reachable by route…", which the route guard makes factually wrong;
  - `MECHANICS-CONTRACT.md`: notes only, with no source-layer edit:
    - that the preview route is guarded (the §7, step 7 wording);
    - that player-facing output uses the two-reading projection. The
      standing "catalog wins" rule still governs the frozen tier field, not
      what players see;
  - `CONTEXT.md` and `AGENTS.md`: scoped updates, only if the approved
    behavior makes them factually stale (§18.4, step 7).

  **Timing:** every rule and document change is finished before the
  candidate is frozen at `ready-for-qa`; a file that needs no change is left
  untouched; no story file changes after Owner acceptance. The QA harness and
  its evidence live in the session scratchpad, not the repository.
- Prohibited files (§18.3):
  - all of `data/`: runtime, reconciled, lists, abilities, families, recon
    and fixtures;
  - all of `tools/`: the parser, builders, checks and `selection.py`;
  - `vox-color/mechanical-periodic-table.html`, `vox-color/build/` and
    `vox-color/reference/`;
  - the canon corpus (`../voxmana.io/docs/research/`);
  - any integration shell (`vox-color/index.html` is not created);
  - `docs/`, `PRODUCT-DEFINITION.md`, `PHYREXIA-PLAN.md` and `PROMPT.md`;
  - production hosting and navigation outside the two instruments.
- Stop points (§18.15):
  1. **Step 0 structural blocker,** only if the data cannot reproduce both
     claims. Stop and report.
  2. **The wording and treatment sheet.** Owner approval is required before
     any implementation.
  3. **Acceptance,** after `robqa` passes. The Owner checks in their own
     browser. No story file changes after acceptance.

  Any widening of the envelope is recorded under Decisions needed and waits
  for the Owner.
- Allowed files for the implementation session: the §18.2 list above.
  Scripts and captures stay in the session scratchpad. (Parts A and B and the
  sheet session: `HANDOFF.md` only, no commit.)
- Non-goals: any integration or redesign (§18.1); the periodic table; the
  retirement of the preview Mechanics code.

## Support files

- `PRODUCT-DEFINITION.md` revision 6: §18, and the §5–§8 material it points
  to (§5.3 V11 record, §6 V1–V16, §7 U1–U8, §8 architecture).
- `MECHANICS-CONTRACT.md` §1, §4 and §7; `CONTEXT.md` "Source cautions";
  `AGENTS.md` (roles, transitions, verification by impact).
- Source evidence about Magic: Rosewater and Wizards material only. In
  `../voxmana.io/docs/research/canon/`, only captures of Wizards articles
  count (`CONTEXT.md`, "Source cautions").

## Acceptance criteria

By reference: §18.12 (behavior preservation), §18.13 (test plan) and §18.14
(independent `robqa`).

For this session (Step 0, Part A):
- items 1–4 and 7–9 of §18.4 are recorded under "Step 0 recon", from
  scripts and browser measurement;
- missing evidence is recorded as unavailable, and anything the environment
  cannot exercise is recorded as a human check;
- only `HANDOFF.md` changes, and nothing is committed.

For Step 0, Part B: §18.4 items 5–6 recorded under "Step 0 recon" from
deterministic scripts and literal source captures; unreachable sources
marked `UNAVAILABLE`, never passed; only `HANDOFF.md` changes; no commit.

## Test plan

By reference: §18.13. For Part A: the four gates and `node --check` on both
extracted scripts at the baseline; `git status --porcelain
--untracked-files=all` before and after.

## Step 0 recon

**Part A, 2026-10-02 (coordinating agent as `robdev`).** §18.4 items 1–4 and
7–9. Items 5–6 (U1–U7, the V7 citations and the evidence ledger) are not
started; they run in the next session. No product edit. Every script and
capture is in the session scratchpad, not the repository.

### Item 1 — baseline

- **HEAD** `08fca7530592a0bbbb5ee3914136b3ac57f6ad08`. `git status --porcelain
  --untracked-files=all` was empty before the ledger reset.
- **Pages** (R6-N4: each hash names what it hashes):

  | Page | HEAD blob id | sha256 of the HEAD blob | sha256 of the working copy |
  |---|---|---|---|
  | `color-wheel.html` | `3099723aea98d6b6550a47e49b6ffd94161e49af` | `c9a7752e9aed1337aef8ee9ca4be1d7fb041d423ca5c1fc6238fa09a8db605ea` | the same (LF, identical to the blob; 4096 lines) |
  | `mechanical-explorer.html` | `cd3bf6c536647f21ed24d9b2027ca9f3a9aba824` | `e5b08803acab4cbe1106d3b9a997a5861dc0b0d17df7aea9e251691dcfb9a403` | `54e54816a5087e2a9f8edc14fedbdb4756d3b4fe1fe2240c96736942369cfe64` (CRLF; 2153 lines) |

  The explorer's HEAD blob is LF. Its working copy is CRLF
  (`core.autocrlf=true`). With CR stripped, the working copy hashes to the
  blob value exactly. Compare candidates against the blob or the CR-stripped
  file, never the raw working copy.
- **Gates** (all exit 0): `check_invariants.py` ("All invariants hold"),
  `check_taxonomy.py`, `check_recon.py` ("All 53 recon assertions hold"),
  `gate.py`. **`gate.py` printed nothing:** it defines functions and has no
  entry point, so running it alone checks nothing. Its gates still run,
  called from `check_taxonomy.py` and `check_recon.py`. See Follow-ups.
- **`node --check`** on both extracted scripts (one `<script>` each: wheel
  249,485 chars, explorer 99,184 chars): exit 0, both.
- **Harness:** headless Edge `Edg/154.0.4258.37` over CDP, driven by Node
  v24.14.0's built-in `WebSocket` and `fetch`; a Node `http` static server on
  127.0.0.1 for the explorer; the wheel from `file://`; nothing installed.
  Viewports 360×780 @2x (mobile), 768×1024, 1440×900. All six baseline
  captures: no exception, no console error, no horizontal overflow
  (`scrollWidth` = viewport width). The explorer self-test reads "Self-check:
  84 of 84 passed".

### Item 2 — the conflict data contract

Exactly **five** records carry `basis: "adjudicated"` in the runtime (216
mechanics: 450 both-agree, 7 catalog-only, 5 list-only, 5 adjudicated). Each
is identical in `mcp2021.reconciled.json`, which holds exactly five
`rulings`. Each claim was then checked in `mcp2021.lists.json`,
`mcp2021.abilities.json` and the article itself.

**Official source, captured as literal text:** "Mechanical Color Pie 2021"
and "Mechanical Color Pie 2021 Changes" (Mark Rosewater, Making Magic,
Oct 18, 2021), loaded in headless Edge on 2026-10-03 02:33 UTC. Raw HTML and
page text are saved in the scratchpad (`sources/`). The 2021 article's lists
sit in closed dropdowns, so they were read from the saved raw HTML.

| Key / label | Color | Color-list claim | Ability-catalog claim | Change log | Recorded authority | Class |
|---|---|---|---|---|---|---|
| `flash` / Flash | B | **Secondary and Tertiary** (Black—Secondary *and* Black—Tertiary both list it); runtime records only `tertiary` | Secondary | Resolves it: NEW Secondary | "companion change log, 2021-10-18" | Official |
| `+n/+n (on spells)` / +N/+N (on spells) | W | Secondary | Primary | Resolves it: OLD and NEW Primary | "companion change log, 2021-10-18" | Official |
| `exiling cards from graveyard` | W | Primary | Secondary | Absent | "ability catalog" | Unresolved |
| `deal n damage to a creature with flying` | R | Secondary | Tertiary | Absent | "ability catalog" | Unresolved |
| `creature pumping, your team, ongoing :: +n/+0 to your team` / +N/+0 to your team | B | Secondary ("+N/+0 to your team, ongoing") | Tertiary (under "Creature pumping, your team, ongoing") | Absent | "ability catalog" | Unresolved |

- **Change log, Flash.** Section "CHANGE TEXT AND STATUS: Flash". OLD:
  "Primary: Blue / Secondary: Green / Tertiary: White, black, and red". NEW:
  "Primary: Blue / Secondary: White, black, and green / Tertiary: Red".
- **Change log, +N/+N (on spells).** Section "CHANGE TEXT, STATUS, & REMOVE
  SOME SUBSECTIONS: Creature pumping". OLD: "Primary: White and green /
  Secondary: Black". NEW: "Primary: White and green / Secondary: Black and
  red".
- **The other three** do not occur anywhere in the change-log text (0
  matches each). Its four "REMOVE SUBSECTION: Creature pumping, …" entries
  concern `+0/+N` and `-0/-N` team effects only.
- **Section names, confirmed** in the 2021 article: "Mechanical Color Pie
  Lists" and "All Abilities with Explanations" (both as headings).
- **Flash disclosure:** the frozen metadata names one list claim
  (`tertiary`). The article lists Black Flash under both Secondary and
  Tertiary. Flash is resolved either way; only the disclosure wording is
  affected.
- **Stop rule: not triggered.** For all three unresolved records the
  runtime's `conflict.colour_list_says` / `ability_catalog_says` equal the
  article's list and catalog claims. No structural blocker.
- Not re-verified this session: the 2017 article's split for the three
  unresolved records (§5.3 states it from the corpus). That is item 6 work.

### Item 3 — independent two-reading figures

Script `two_readings.py` (scratchpad). It reads `data/` only: the runtime,
cross-checked against the reconciled file, plus fixture 02. It imports,
executes, calls and copies no page code, and does not use
`tools/selection.py`. Its add/remove semantics come from
`MECHANICS-CONTRACT.md` §4 and the displayed category names. They reproduce
fixture 02 (`add_G`, `remove_B`) exactly under the catalog reading.

- **Readings.** Exactly 3 placements differ (W exile, R flying-damage,
  B team pump); the 2 resolved records are identical in both. The catalog
  reading equals the frozen runtime everywhere, so the page today shows the
  catalog reading as one plain answer.
- **Selections (31).** Best placement or bucket counts differ in **22**: W,
  B, R, WU, WB, WR, WG, UB, UR, BR, BG, WUB, WUR, WUG, WBR, WBG, WRG, UBR, UBG,
  WUBR, WUBG, WURG. Bucket counts differ in exactly those 22. Per record: 8
  each (exile: W, WU, WR, WG, WUR, WUG, WRG, WURG; flying: R, WR, UR, BR, WUR,
  WBR, UBR, WUBR; team: B, WB, UB, BG, WUB, WBG, UBG, WUBG).
- **New: the "in <colors>" clause.** The detail lens line ("Best placement
  among …: Primary, in Black") and the best-tier marks (`.bx`) name which
  selected colors hold the best placement. For exile this differs in 12
  selections. In 2 of them (WBRG, WUBRG) the tier does not differ, so they
  are outside the 22. **Every derived output: 24 of 31 selections.**
- **Compass (150 steps).** Displayed counts differ in **24** steps, all
  through graveyard exile: W+B, G+W, WU+B, WB−B, WR+B, WG−W, WG+B, UG+W, RG+W,
  WUB−B, WUR+B, WUG−W, WUG+B, WBR−B, WBG−B, WRG−W, WRG+B, URG+W, WUBR−B,
  WUBG−B, WURG−W, WURG+B, WBRG−B, WUBRG−B. Flying and team pump change no
  step.
- **Unchanged under both readings, confirmed:** placement existence for
  every mechanic and selection; the "N of 216 have a placement" count;
  "newly placed" and "no longer placed" in every step; the key specimen
  (Reach under both); every mechanic other than the three.
- **Revision 3 reproduced:** swapping one entry at a time gives Flash 2/10,
  +N/+N (on spells) 8/28, exile 8/24, flying 8/0, team 8/0
  (selections/steps), the §5.3 figures.
- **Browser cross-check (system under test, frozen):** W shows P60 · S24 ·
  T20 · none 112; WB shows P103 · S34 · T17 · none 62; the exile detail under
  WB reads "Primary, in Black". All equal the oracle's catalog reading (the
  list reading gives P61 · S23, P103 · S35 · T16, and "in White and Black").

### Item 4 — surface inventory (production-reachable only)

**Mechanical Color Pie.** Measured in the browser at rest, under W, under WB,
with each of the five conflict records open, in a search that sets a color,
and in A–Z.

| # | Surface | Content | Class | Depends on the reading |
|---|---|---|---|---|
| E1 | List entry strip (`.strip .sc`, `aria-hidden`), article and A–Z | 216 strips, 1080 slots, 467 placed marks | Official placement | The 3 slots; the 2 resolved slots need authority disclosure only |
| E2 | Best-tier marks (`.bx`) on list entries | 104 under W, 168 under WB | Computed | Yes (tier, and the "via" colors) |
| E3 | List entry accessible name (216) | All five colors' tier words; "Best placement among …: <tier>, computed." | Official + Computed | Yes |
| E4 | Lens line (`#lensline`) | "N of 216 entries have a placement" | Computed | No |
| E5 | Lens bucket buttons, 4, with `aria-label` "best is Primary: N entries. Show them." | Bucket counts | Computed | Yes (22 selections); "no placement" no |
| E6 | Spotlight bar and the list a count opens | "Showing N entries: best is …" | Computed | Yes |
| E7 | Compass identity count (`#ident .id-count`) | Placement count | Computed | No |
| E8 | Compass steps (`#steps-p`), 3 count buttons per step, with `aria-label` | Step categories | Computed | "best placement rises / falls", "another placement / one placement fewer, best unchanged": yes (24 steps); "newly placed", "no longer placed": no |
| E9 | Search result row | Strip (`aria-hidden`); lens tier "W: Secondary" when the query sets colors | Official + Computed | Yes; the `#absent` existence count: no |
| E10 | Detail: placement rows, the notation strip (`aria-hidden`), heading "Placements · Rosewater, 2021" | 5 rows | Official | Yes |
| E11 | Detail: lens line | "Best placement among …: <tier>, in <colors>. computed" | Computed | Yes |
| E12 | Detail: Source note drawer | "This dataset uses <tier>, on the authority of …" plus `ruling.mechanism` | Disclosure | Yes (V11, §18.7 item 4) |
| E13 | Detail footer `.dx-foot` (line 1579) | "Tier describes how often a color uses this in design, not how well." | — | A **second instance of the V10 wording**, besides the key note (line 619). Not named in §6/§18.7; the sheet must cover it under V10 |
| E14 | Key: specimen (Reach) and the definitions' icons | Reach: W Tertiary, R Secondary, G Primary | Official | No |

No `title` and no `.sr-only` text carries a tier word. Entry titles are labels;
result titles carry `relWhy` (V12, not a tier). Compass tiles carry names
only. The `sections()` port renders nowhere: only the self-test calls it.

**Color Wheel.** No production-reachable surface renders a mechanics tier:
0 tier words are visible at rest. The atlas shows "TIER 1" to "TIER 6" (6
headings, `.tier-index`) and "Six tiers, thirty-two identities.": V8
vocabulary (count of colors), not a mechanics tier. The inline `MCP` and the
`mcp*` panels are out of scope except their route entry (item 8).

### Item 7 — rule and document files (edits listed, none made)

- **`CLAUDE.md`: edit needed.** "Mechanics mode stays preview-only —
  reachable by route, not enabled in production navigation." The guard makes
  "reachable by route" false.
- **`MECHANICS-CONTRACT.md`: both permitted notes are needed.**
  - §7 step 7: "Reachable only via `#mechanics=preview` until the visual
    review passes." Already inexact (item 8: 14 hash forms reach it), and
    false after the guard.
  - §1 "The standing rule": add that player-facing output uses the
    two-reading projection; "catalog wins" governs only the frozen tier field.
  - Stale, but outside the two permitted notes: Follow-ups.
- **`CONTEXT.md`: one scoped edit expected.**
  - Lines 57–59: "The Strixhaven colleges are alternate names for identities
    that already exist — Silverquill *is* Orzhov". V2 makes this false (and
    it already contradicts the file's own Source cautions).
  - Recheck after V2/V5: line 57 "5 alternate names in `ALIASES`, 37 tiles".
  - **Correction to the previous ledger:** its example, that `CONTEXT.md`
    says the four-color community readings are "labelled as community
    reading", is not in `CONTEXT.md` at HEAD (no "community" match at all).
  - Line 24 ("Mechanics overlay — *not built*") and the Layer 4 open item
    are stale already; Gate A does not cause it. Follow-ups, as before.
- **`AGENTS.md`: none expected.** Recheck line 25 ("37-tile atlas") and
  lines 139–140 ("37 rendered tiles including aliases") after V2/V5. "The
  unbuilt Mechanics control remains disabled" (line 249) stays true about
  the disabled state; "unbuilt" is the known, pre-existing staleness.

### Item 8 — route inventory and replacement mechanism

From the code (`applyHash` line 3945, `applyRoute` 3953–3989) and by probe,
direct load, on `file://` and over HTTP, with identical results on both:

- **What reaches the `mechanics` branch:** the hash, with its leading `#`
  removed, passed through `decodeURIComponent` once. The text before the
  first `=` (or the whole string, when there is no `=`) must be exactly
  `mechanics` (case-sensitive).
- **Activated the preview** (`body.proto-on`, `#world` shown, `#lay-mech`
  enabled, family wording visible), 14 of 14:
  - `#mechanics`, `#mechanics=`;
  - `=board`, `=atlas`, `=layered`, `=preview`, `=zzz`, `=atlas=extra`;
  - `#%6Dechanics=atlas`, `#mechanics%3Datlas`, `#%6D%65%63%68%61%6E%69%63%73`,
    `#%6D%65%63%68%61%6E%69%63%73%3D`, `#mechanics%3D`,
    `#mechanics=%61tlas`;
  - with a query string: `?q=1#mechanics=atlas`;
  - by in-page `hashchange` as well as on load.
- **Did not activate** (Explore at rest), 8 of 8 near-miss forms:
  `#mechanics%253Datlas` (double-encoded), `#MECHANICS=atlas`, `#Mechanics`,
  `#%20mechanics=atlas`, `#mechanics%20=atlas`, `#mechanics?x=1`,
  `#mechanics&x`, `#mechanics/`. Nor did the valid `#color=W` and
  `#ally=WU`.
- **Today's neutral behavior:**
  - **No hash:** Explore at rest, no `#`.
  - **Reload** (CDP `Page.reload`, ignore cache): no hash, `#color=W` and
    `#mechanics=board` each come back as they were. The preview reactivates.
  - **Clearing a selection** writes `location.hash = ''`. That leaves a
    trailing `#` in the URL and adds a history entry.
  - **Back/Forward** over `#color=W → #mechanics=atlas → #ally=WU` (CDP
    history navigation, stepped twice each way): the preview reactivates
    every time on `#mechanics=atlas`. There is no loop.
  - **A second entry path:** once any Mechanics route has run, `#lay-mech`
    stays enabled ("Mechanics") for the life of the document, even after
    leaving for `#color=W` or `#ally=WU`. Its click re-enters the preview
    with no route. A guard in the branch closes this too, because
    `enableMechanicsPreview()` is reached only from there.
- **Replacement mechanism confirmed:**
  `history.replaceState(history.state, '', location.pathname +
  location.search)`, run in the harness against the unedited page on both
  origins (the page itself was not changed):
  - the hash is gone with no trailing `#`, and `?q=1` is kept;
  - `history.length` is unchanged (3 → 3);
  - no `hashchange` fires, so no second pass through the router;
  - Back to `#color=W`, Forward to the replaced entry, and a reload of it all
    land in Explore at rest with no preview.
- **Alternatives rejected:**
  - `history.replaceState(…, '#')` leaves a dead `#`.
  - `location.replace('#')` also leaves `#`, and fires `hashchange` (a
    second router pass).
- **Pre-existing, not a Mechanics route:** a malformed percent-encoded hash
  (`#%E0%A4%A`) throws `URIError` in `applyHash` on load and on
  `hashchange`, and routing is skipped. See Follow-ups.

### Item 9 — explorer self-test inventory

`runSelfTest` (lines 1884–2147) has **85** assertions. **84 ran here.**
Line 2133 (motion) runs only under reduced motion.

- **Frozen-model or frozen-data parity, unchanged (20):** 1903, 1908, 1952,
  1959, the 14 fixture assertions 2034–2054, 2081 (75 recon transitions)
  and 2134 (runtime unchanged and frozen).
- **Made factually obsolete by an approved change (2, plus 1
  conditional):**
  - **1922** `tiers: all 216 × 5 rendered placements equal the runtime`.
    Obsoleted by V11b: the three unresolved slots show both claims (§18.5).
    The two resolved slots still equal the runtime.
  - **2069** `compass: WB − B counts equal the fixture`. Obsoleted by V11b:
    WB−B differs between the readings ("best placement falls" 13 / 14, "one
    placement fewer" 31 / 30, list / catalog). Model parity stays in 2039.
  - **1924** `tiers: one footprint for every placement mark` (R6-N5).
    Obsolete only if the two-in-one-slot markup adds elements that
    `.strip .sc` matches. The equal-footprint, no-magnitude rule itself
    stays. Settle it against the approved slot treatment.
- **Display or behavior checks no approved change affects, unchanged
  (62):** 1894, 1895, 1902, 1906, 1912, 1913, 1923, 1925, 1926, 1936, 1938,
  1940, 1944, 1947, 1948, 1950, 1955, 1961, 1964, 1968, 1971, 1974, 1978,
  1983, 1985, 1986, 1989, 1991, 1994, 1997, 1999, 2000, 2002, 2005, 2007,
  2008, 2011, 2012, 2015, 2019, 2021, 2055, 2061, 2063, 2065, 2066, 2068,
  2084, 2085, 2091, 2093, 2097, 2110, 2111, 2113, 2118, 2120, 2121, 2126,
  2127, 2131, 2133. Notes:
  - **1944** (R6-N5) checks Flying only, which has no conflict, so it stays
    true. It does not cover the conflict records; the §18.13 oracle does.
  - **2063, 2066 and 2121** use counts the readings never change ("newly
    placed", placement existence, the no-placement count).
  - **1985** reads `PLAYER_TERMS[].relWhy` data only. **No assertion
    requires `relWhy` to be player-visible:** within `runSelfTest`, line 1985
    is the only `relWhy`, `title` or `#parse` reference.
  - **Copy regexes to recheck against the final sheet:** 1961, 1964, 1968,
    1971, 2011, 2093, 2097, 2120. None matches wording on the §18.6/§18.7
    lists as written. For example, 1968 does not depend on "recorded for
    source review".
- **Not an assertion:** V13 hides the visible footer line `#selftest`. The
  self-test still runs.

### Human checks and unavailable evidence (Part A)

- **Human check (§18.13):** `file://` in a headed browser, with a user hard
  reload (Ctrl+Shift+R / Ctrl+F5) and the toolbar Back/Forward, on the
  wheel's deep links including `#mechanics=board`. The headless CDP reload
  and history navigation above are not that check.
- **Human check:** the replacement mechanism from `file://` in any browser
  other than Chromium Edge. Only Edge 154 was available.
- **Human check:** after load, the explorer scrolls in headless Edge (`scrollY`
  0 → 873 at 1440, 1484 at 768, 2773 at 360 @2x, within about 1 s, focus
  on `#list`). Whether a headed browser does the same is not established.
  Outside Gate A; see Follow-ups.
- **Unavailable this session:** the 2017 split for the three unresolved
  records (item 6). Nothing else in Part A was unavailable.

---

**Part B, 2026-10-02 (coordinating agent as `robdev`, fresh session).**
§18.4 items 5–6 and the 2017 corroboration Part A deferred. No product edit;
no wording sheet. Preconditions held: Status `dev-in-progress`, Part A
recorded, only `HANDOFF.md` modified against `08fca75`, no structural
blocker in Part A. Part A results were taken as established; **no Part B
evidence contradicts a Part A result.**

### Part B method

- **Inventory.** `extract_strings.py` (scratchpad) tokenises every JS string
  literal and HTML text node / `aria-label` / `title` / `placeholder` in both
  pages with page line numbers: 994 strings of ≥ 4 words (wheel 722,
  explorer 272). The wheel's preview Mechanics block (inline `MCP`, lines
  ~2308–3250) is out of scope except its route (V16, Part A item 8).
  Substantive claims were then read in `D`, `COLLEGES`, `IDENTITIES`,
  `ALIASES`, the `SRC_*` notes and the panel renderers (wheel), and the
  masthead, key, detail, notes and `PLAYER_TERMS` (explorer).
- **Ledger.** `ledger.py` holds one row per claim; it looks each page line up
  by a unique probe string (CR stripped), so every line below is
  script-derived. Output `ledger.tsv` (268 rows) and `ledger_counts.txt`.
- **Explorer source text.** `check_explorer_text.py` compares every runtime
  entry name, alias and explanation with the 2021 article's literal text
  (Part A capture): **216/216 names, 21/21 aliases, 211/211 explanations
  verbatim.** Placements (467) were not re-derived; they rest on the frozen
  source layer and the Part A gates.
- **Sources, in hierarchy order.**
  1. Corpus captures of Wizards articles (`../voxmana.io/docs/research/canon/`):
     "Pie Fights" (MM 2016-11-14), "Thank You for Being a Friend" (MM
     2017-03-20), the ten guild articles (2005–06), the five shard (2008) and
     five wedge (2014–15) interviews, *Mechanical Color Pie 2017*
     (`misc/mechanical-color-pie-2017.md`, dated in its text June 5, 2017).
     Corpus PDFs drop "fi"/"fl" ligatures ("con icts"); excerpts below restore
     them.
  2. Official Wizards pages, captured as literal page text in headless Edge on
     2026-10-03 03:13–03:31 UTC (`fetch_sources.mjs`, raw HTML + innerText in
     `sources/`): the five 2015 "Revisited" articles; "Faction Packed";
     "Party of Five"; "Mana with All the Fixin's"; "Just the Artifacts,
     Ma'am"; "Third Time's the Charm, Part 2"; "The Council of Colors,
     Revisited"; the Planeswalker's Guide to Strixhaven; "In the Strixhaven"
     1–2; the Strixhaven and Secrets of Strixhaven vision design handoffs
     (1–2 each); the Secrets of Strixhaven and Streets of New Capenna product
     pages; "Hitting the Streets of New Capenna" 1–2; "Designing Commander
     (2016 Edition)"; the C16 decklists; "Absence"; "Khan Do Attitude, Part
     2"; "Exploring Wedges"; the Khans of Tarkir design handoff, Part 1; the
     live "Disorderly Conduct". Plus Part A's 2021 article and change-log
     captures. 25 pages, none unreachable.
  3. Card data: Scryfall API, exact names and face colours only (the five STX
     dean MDFCs; the five C16 commanders). Rules facts: the Comprehensive
     Rules text effective 2026-09-25 (an earlier session's capture, copied to
     `sources/cr-2026-09-25.txt`).
  Not used as authority: dossiers, audits, Vox syntheses, mtg.wiki,
  community sites, model knowledge. Web search was used only to find
  official URLs; nothing was taken from search summaries.
- **Verdict rule.** `SUPPORTED` = the source states the same proposition
  (paraphrase allowed). `UNSUPPORTED` = the wording adds a claim, or drops a
  hedge, beyond the source, even when a related source exists; the clause is
  named. `CITATION WRONG` = the wording is supported but not by what the page
  cites. `UNAVAILABLE` = source unreachable (none occurred). Computed,
  navigation and neutral rows carry `n/a`: they make no external claim.

### Counts

- **268 claim rows in 71 substantive content systems** (wheel 44, explorer
  27).
- **By verdict:** `SUPPORTED` 167 · `UNSUPPORTED` 56 · `CITATION WRONG` 16 ·
  `UNAVAILABLE` 0 · `n/a` 29.
  - Wheel: 149 · 44 · 16 · 0 · 19. Explorer: 18 · 12 · 0 · 0 · 10.
- **By classification:** Official source 201 · Remove/unsupported 42 ·
  Computed from official source 14 · Neutral UI description 9 · Navigation
  metadata 2.
- **Rows needing a later wording/treatment change: 83.**

### U1–U7

- **U1 — Lorehold pole glosses: `UNSUPPORTED`, both.** Page lines 1730–1731.
  Planeswalker's Guide to Strixhaven (Feature, 2021-04-01) gives red
  "reckless discovery and the spirit of adventure" (`pwg_stx` 228) and white
  "love to uncover and record the past" (232). Neither "history as patterns,
  institutions and structures" nor "people, passions and contingent events"
  is in it. Partial echoes only: "In the Strixhaven, Part 1" (MM 2021-03-29)
  line 71 names "structures that pull them together" and "familiar bonds" in
  the *college* conflict but assigns neither to a colour; the guide's red
  section has "the essence and emotion of history" and "chance happenstance".
  **New beyond U1:** the Prismari red gloss (line 1709) adds "spontaneity",
  which is not in the guide's red section (156); "raw and spontaneous"
  (`stx1` 69) is the art dispute, not assigned to red. The other 7 glosses
  are `SUPPORTED`.
- **U2 — colorless artifact-mage sentence: found; wording `UNSUPPORTED` as
  phrased.** Lines 3609–3610. "Just the Artifacts, Ma'am" (MM 2005-02-28), `artifacts`
  44: "They represent the lack of a philosophy … Rather he's avoiding
  sticking to much of anything." The page drops the hedge ("avoiding
  committing to anything"). This contradicts revision 6's "not found".
- **U3 — "Four colours have no philosophy article of their own":
  `UNSUPPORTED`.** Line 1649. A negative universal; no official source states
  it, and absence is not inferred. Related official material exists:
  Fleischer, "Designing Commander (2016 Edition)" (Card Preview, 2016-10-24),
  gives each four-colour group a per-colour philosophy rationale under a
  "'Ravnica guild'–style identity" (`c16` 86–118); Rosewater, "Absence" (MM
  2013-05-13), discusses four-colour cards.
- **U4 — wedge centre colours: claim `SUPPORTED`; citation wrong.** Line
  1650. "Khan Do Attitude, Part 2" (MM 2014-09-08), `ktk_khando2` 46: "each
  clan was centered in a color and had one ally color and one enemy color";
  50–78: WBG white, URW blue, BGU black, RWB red, GUR green. Khans of Tarkir
  Design Handoff, Part 1 (MM 2025-03-03) line 115: "the base color is not
  the shared enemy color. Rather, it is one of the ally colors." Each is one
  of the wedge's two allied colours (computed). The wedge interviews
  self-state it for four ("I'm the center of the Abzan wedge", Abzan 20;
  Jeskai 17; Mardu 16; Temur 18); **the Sultai interview does not**. The
  corpus Khans Planeswalker's Guide does not state it (0 matches), so the
  revision 6 pointer to it is wrong.
- **U5 — Black method: gloss, `UNSUPPORTED`.** Line 1506 "Flexibility, and
  self-interest without apology". "Thank You for Being a Friend" 250–251:
  "The key to power is flexibility and selfishness." "Without apology" is not
  there. "In the Black Revisited" 73 ("Caring what others think of you is a
  weakness") is related, not the cited closer.
- **U6 — Strixhaven design note: source found; `CITATION WRONG`.** Line 1700.
  Actual source: "Strixhaven Vision Design Handoff Document, Part 1" (Mark
  Rosewater, MM 2021-04-19), handoff text line 101: "Spoken word is the
  fastest form of spellcasting and thus is the magic of ritualized combat";
  box comment line 103: "…let white-black be the most combat-oriented
  faction"; intro: "Things always change during set design." Also "In the
  Strixhaven, Part 2" (MM 2021-04-05) line 60. Nothing on the page cites the
  handoff. The handoff uses the prototype name "Shadix"; the page does not.
- **U7 — full substantive audit:** the ledger below. U7's named items:
  - 10 pair "cost" + 5 conflict "together" lines: see V7.
  - 10 "Pie Fights" view sentences: 8 `SUPPORTED`; 2 `UNSUPPORTED` (Red's
    "Errors come from overriding what you already felt", line 1580; Green's
    "whether or not you flatter yourself", line 1590: second sentences not
    stated, PF 148, 165).
  - Jund paraphrase: `SUPPORTED` (Jund 144–149, "Freedom does come at a
    cost.").
  - 5 C16 lens sentences: `SUPPORTED` (`c16` 90–118); commanders and decks
    `SUPPORTED` (C16 decklists, 2016-10-28, raw HTML; Scryfall `c16`).

### V7 pair-panel sources

All 15 lines come from Rosewater's 2005–06 guild series (corpus). Every panel
cites only "Thank You…" / "Pie Fights", so all 15 are miscited. Dates are
the capture banners.

| Line | Page | Guild article (corpus) | Locator | Excerpt | Wording |
|---|---:|---|---|---|---|
| WU cost | 1531 | "Slow and Steady", MM 2006-05-01 | 91–94 | "inability to respond quickly" | `UNSUPPORTED`: "Once prepared it can act decisively" not in it |
| UB cost | 1538 | "Pretty Sneaky Sis", MM 2005-11-07 | 86–92 | "complete lack of trust. Even amongst itself" | `CITATION WRONG` |
| BR cost | 1545 | "Hedonism With Attitude", MM 2006-08-14 | 93–98 | "No self-control." | `CITATION WRONG` |
| RG cost | 1552 | "Aaaargh!!!", MM 2006-01-30 | 91–99 | "didn't bother to come up with a Plan B" | `CITATION WRONG` ("Thank You…" 205 covers clause 1 only) |
| GW cost | 1559 | "Group Think", MM 2005-10-03 | 97–99 | "no diversity of thought or experience" | `CITATION WRONG` |
| WB together | 1564 | "Playing By Their Own Rules", MM 2006-03-27 | 47–50, 110–111 | "Compromises, my dear reader, compromises." | `CITATION WRONG` |
| WB cost | 1565 | same | 113–115 | "based upon a shaky trust" | `CITATION WRONG` |
| UR together | 1574 | "Creative Differences", MM 2006-02-27 | 41–43 | "By taking aspects of each." | `CITATION WRONG` |
| UR cost | 1575 | same | 96–99 | "greatest weakness is its lack of focus" | `CITATION WRONG` |
| BG together | 1584 | "Life and Death", MM 2005-10-24 | 27, 35–37 | "they both turn to the same primal forces" | `CITATION WRONG` |
| BG cost | 1585 | same | 91–95 | "lack of pinpoint control" | `CITATION WRONG` |
| RW together | 1594 | "Disorderly Conduct" (banner Jan 1, 2012; see new finding) | 35–38 | "One half picks the goal" | `CITATION WRONG` |
| RW cost | 1595 | same | 87–91 | "complete lack of subtlety" | `CITATION WRONG` |
| GU together | 1604 | "Improving Upon Nature", MM 2006-05-29 | 53–56, 83–85 | "strived to improve upon nature" | `CITATION WRONG`, composite: clause 1 is "Pie Fights" 184 |
| GU cost | 1605 | same | 105–111 | "inability to stop what its doing" | `CITATION WRONG` |

### 2017 conflict corroboration (item 6)

From the corpus capture of *Mechanical Color Pie 2017* only. Corroboration;
the 2021 records and the two-reading contract are unchanged.

| 2021 record | 2017 colour list | 2017 ability catalog | Same contradiction in 2017? |
|---|---|---|---|
| Exiling cards from graveyard / White | "White—Primary" (line 67) | "Primary: black / Secondary: white" (1044–1047) | **Yes** |
| Deal N damage to a creature with flying / Red | "Red—Secondary" (378) | "Primary: green / Tertiary: red" (999–1001) | **Yes** |
| +N/+0 to your team (ongoing) / Black | "Black—Secondary": "+N/+0 to your team, ongoing" (287) | under "Creature pumping, your team, ongoing": "Primary: red / Tertiary: black" (883, 892–894) | **Yes** |

Revision 6 §5.3's "2017 has the same split" is confirmed for all three.
Incidental, for the V11a disclosure wording (not a new contradiction, not
folded into the five): in 2017, **+N/+N (on spells) / White** was already
split (list "White—Secondary", line 97; catalog "Primary: white and green",
731–732), and the 2021 change log's OLD entry equals the 2017 *catalog*.
**Flash / Black** was Tertiary in both 2017 sections (315, 1085).

### Evidence ledger (both production-reachable instruments)

Columns: system · page line(s) · claim type · classification · source and
locator · verdict · later treatment needed (Y/N). Source keys: PF "Pie
Fights" (corpus); TY "Thank You for Being a Friend" (corpus); REV the 2015
"Revisited" article for that colour (web); PWG Planeswalker's Guide to
Strixhaven (web); STX1 "In the Strixhaven, Part 1" (web); M21 *Mechanical
Color Pie 2021* (web); CHG its change log (web); FP "Faction Packed" (web).
Full rows with excerpts: `ledger.tsv`.

**Color Wheel**

| # | System | Lines | Class | Source · locator | Verdict | Treat |
|---|---|---|---|---|---|---|
| W01 | Colour goals | 1491–1519 | Official | TY 241–259 "The key to peace is…" | 5 S | N |
| W02 | Colour method (`key`) | 1492–1520 | Official | TY 241–259 | 4 S, 1 U (Black, U5) | Y |
| W03 | Colour summary (`blurb`) | 1493–1521 | Official | PF 15–107 (recap; Red 83, Green 95) | 4 S, 1 U (Red: "not by outcome" not stated) | Y |
| W04 | Colour "What it costs" | 1494–1522 | Official | REV W 121, U 122–124, B 130, R 132, G 125 | 4 S, 1 U (Black: "as often against itself as against anyone else" adds a frequency claim; source "greatest enemy is … itself") | Y |
| W05 | Allied / In conflict lists, two faces | 2049–2081 | Official | TY 237 "intersection of its two alliances"; PF 111 | S | N |
| W06 | Alliance value, blurb, split, "Derived from their shared enemy" | 1527–1558, 2093 | Official | TY 116–235, 117 "we always start by looking at their shared enemy" | 16 S | N |
| W07 | Pair cost / conflict together (V7) | 1531–1605 | Official | guild series (table above) | 14 CW, 1 U | Y |
| W08 | Conflict titles and "At bottom" cores | 1566–1607 | Official | PF headings 114, 133, 150, 167, 183; cores 132, 149, 166 (BG paraphrases the 158 question), 182, 200 | 9 S, 1 U (RW core "what a society owes the people inside it"; PF 182 "what is best for how we govern ourselves") | Y |
| W09 | Conflict views (10) | 1569–1610 | Official | PF 122–198 (views W 128, B 131, U 146, R 148, B 162, G 165, R 179, W 181, G 196, U 198) | 8 S, 2 U | Y |
| W10 | Sources-note gloss "a third framing, not the true one" (V4) | 2170 | Remove | none (PF 288 is only "I simplified them a bit") | U | Y |
| W11 | College names, designations | 1691–1736 | Official | PWG 104, 144, 182, 220, 258; Secrets of Strixhaven product page 56 "College of Life and Death" | 6 S | N |
| W12 | College field, conflict, dispute, magic | 1692–1744 | Official | STX1 67–79 (+PWG 260 Quandrix field, PWG 184 Witherbloom essence) | 20 S | N |
| W13 | College pole names | 1696–1742 | Official (card) | Scryfall STX 152, 155, 158, 160, 161: names and face colours | 10 S | N |
| W14 | College pole glosses (U1) | 1696–1742 | Official | PWG 114–270 | 7 S, 3 U (Lorehold ×2, Prismari red) | Y |
| W15 | Ravnica/Strixhaven contrast line | 2133–2136 | Official | STX1 65 "What if this time we did the opposite?" | S | N |
| W16 | Design note (U6) | 1700 | Official | Strixhaven VDH Part 1 101, 103 | CW | Y |
| W17 | College scope note `SRC_SCOPE_COLLEGE` | 1748 | Official, attributed | STX1 65 supports sentence 1; "set-specific lenses … do not replace…" and "two of the five differ … outright" are under the Rosewater attribution but in neither article | U (V4 class; not on the V4 list) | Y |
| W18 | Guild, shard, wedge names + colours (20) | 3290–3330 | Official | FP 185–194, 258–262, 309–313 | 20 S | N |
| W19 | Shard "What that produces" + per-article citation | 3303–3316 | Official | Bant 122–130; Esper 132–152; Grixis 153–159; Jund 144–149; Naya 172–175; titles and dates correct | 5 S | N |
| W20 | Shard scope note; shard structure line | 1651; 3661 | Official; Computed | Bant 122 "As the central color"; adjacency | S; n/a | N |
| W21 | Wedge attribute; "How Tarkir expresses it" + citation | 3318–3332 | Official | Khan Do Attitude 2 50–78; Abzan 132–140, Jeskai 49–52, Sultai 75–80/96–97, Mardu 44–46/72–73/228, Temur 31/51–58/106 | 10 S | N |
| W22 | Wedge scope note: centre (U4); isolated colour; lens framing | 1650 | Official; Computed; Official | Khan Do Attitude 2 46; Abzan 21; Sultai 8 | CW; n/a; S | Y |
| W23 | New Capenna "Also called" (V5) | 3302–3314 | Remove (as naming) | Families and colours: "Hitting the Streets of New Capenna, Part 2" (MM 2022-04-11) 51–95, e.g. "THE BROKERS (GREEN-WHITE-BLUE)". No source names them as the shard combinations | 5 U | Y |
| W24 | College as guild alias, "Enemy · also called …" (V2) | 3365–3369, 3413 | Remove | contradicted: STX1 65 | 5 U | Y |
| W25 | Four-colour labels; C16 lens + deck description; commander + deck | 3337–3356 | Neutral; Official; Official | page-coined labels; Fleischer, `c16` 90–118; C16 decklists 31–63 + Scryfall | 5 n/a; 10 S | N |
| W26 | "Community typically reads it as…" + scope sentence (V1) | 3340–3356, 1649 | Remove | none | 6 U | Y |
| W27 | Four-colour absent voice | 2208, 3693 | Computed from official strings | W01/W02 | n/a (inherits the U5 gloss for Black) | N |
| W28 | Four-colour scope note `SRC_SCOPE_FOUR` | 1649 | Official, attributed | `c16` 84–118 | U (U3 sentence), S (deck-identity sentence; "described in gameplay terms" true but incomplete) | Y |
| W29 | Crossing geometry: 5 marker labels, panel paragraph, layer note | 1312–1360, 2202, 1785 | Computed from official diagram | PF 111 "enemies with the colors across from them" | n/a | Y (label as derived, V6) |
| W30 | Crossing interpretation (V6) | 1137, 2205 | Remove | none | 2 U | Y |
| W31 | Five-colour goals list; "How it plays"; "What it costs" | 3732, 3743, 3747 | Computed; Official; Official | "Party of Five" (Feature 2009-02-02) 135 "Why is this a five-color card?"; "Mana with All the Fixin's" (MM 2009-03-23) 76 "limits the importance of the color pie" | n/a; S; S | Y (precise citation) |
| W32 | Five-colour argument + tile (V3) | 3736–3752, 3461 | Remove | none | 5 U | Y |
| W33 | Five-colour scope note (V4) | 1647 | Remove | neither cited article contains it | U | Y |
| W34 | Colourless quotation | 1643 | Official, verbatim | "Third Time's the Charm, Part 2" (MM 2024-05-27) 72 | S | N |
| W35 | Colourless "How it plays", "What it costs", "Not the same thing as" | 3614–3624 | Official | "Just the Artifacts, Ma'am" 77–79, 97, 101–119; CR 105.2, 202.2b, 107.4b, 107.4c | U ("which is the whole point of them" vs "one of the elements that most defined them"); U ("turns so heavily on rate" not stated; source speaks of artifacts); S (rules) | Y |
| W36 | Colourless glosses (U2; V4) | 3609–3611 | Official; Remove | `artifacts` 44 | U (hedge dropped); U | Y |
| W37 | Colourless scope note (V4) | 1648 | Remove | 0 matches for "faction", "school of thought", "game characteristic", "colorless commanders" in the three cited articles | U | Y |
| W38 | Tile "No colors — not a sixth color." | 3462 | Official | `third2` 72 "Colorless isn't a color" | S | N |
| W39 | Atlas "Tier 1–6", "Six tiers…" (V8) | 3499, 1472 | Remove | Vox vocabulary | 2 U | Y |
| W40 | Pair scope note `SRC_SCOPE` | 1652 | Official | "Disorderly Conduct" 15–16 "not about the Boros Legion in particular" | S | N |
| W41 | Hero kicker (V9) | 1134 | Branding | — | n/a | Y |
| W42 | Fan Content notice | 1480 | Neutral (policy) | Fan Content Policy | n/a | N |
| W43 | Combine/atlas structure: counts, shapes, chips, composition | 3593–3801 | Computed | registry, adjacency | n/a | N |
| W44 | Empty states, layer note | 1837–1842, 1785 | Neutral | — | n/a | N |

**Mechanical Color Pie**

| # | System | Lines | Class | Source · locator | Verdict | Treat |
|---|---|---|---|---|---|---|
| E01 | Entry names, sub-headings | list | Official | M21, script: 216/216 verbatim; one documented `HEADING_FIX` | S | N |
| E02 | Explanations | detail | Official | M21, script: 211/211 verbatim | S | N |
| E03 | "Also written in the article as" | 1020, 1572 | Official | M21, script: 21/21 verbatim | S | N |
| E04 | Placements (467) | strips, detail | Official | frozen source layer, Part A gates; not re-derived | S (by gates) | Y (3 slots, V11b) |
| E05 | Resolved conflict disclosures: Flash/B, +N/+N (on spells)/W | 1542–1543 | Official | CHG (Part A item 2) | 2 S; Flash list claim incomplete (Black is in both lists) | Y (V11a) |
| E06 | Unresolved conflict disclosures: exile/W, flying/R, team pump/B | 1542–1543 | Official | M21 lists + catalog (Part A); 2017 same split (above) | 3 S (claims); "This dataset uses <tier>" is the Vox rule | Y (V11b) |
| E07 | `ruling.mechanism` prose (5) | 1543 | Remove | CHG, M21, 2017 | 5 U: each mixes a supported fact with an inference ("stale 2017 data"; "contradicts both editions", though the 2017 list also says White Secondary; "summary-list error"; "green is the stronger anti-flying colour" vs M21 917 "Green does it significantly more"; "long-standing list error") | Y |
| E08 | Key definitions | 615–618 | Official; Computed | M21 129–131 | Primary U (V10: drops "usually" and the power-level sentence); **Secondary U (drops "somewhat": "on a somewhat regular basis"; new)**; Tertiary S; No placement n/a | Y |
| E09 | V10 note, two instances | 619; 1579 | Remove | M21 129 "tends to be the color that most often pushes the power level" | 2 U (contradicts source) | Y |
| E10 | Snapshot line, author | 564 | Official | M21 122, 126 "I got the Council of Colors to help me" | S | N |
| E11 | `#limits` (`meta.caution`) | 1814 | Official + instruction | M21 122–125 | U: sentences 1–2 supported; "Never present this as the current state…" is an instruction (V13) and at odds with M21 122 "represents where the color pie currently is today" | Y |
| E12 | Absent-placement caveats (lens line, `#absent`, footer) | 1390, 1531, 652 | Official paraphrase | M21 124 "the default center" | S | N |
| E13 | Search parse, match reasons | 1350–1404 | Navigation | — | n/a | N |
| E14 | Player terms, exact/related tags | 718–771 | Navigation | — | n/a | N |
| E15 | `relWhy` prose, 7 strings (V12) | 724, 729, 734, 737, 755, 763, 770 | Remove | none (Vox explanations) | U | Y |
| E16 | Combination names (20) + `NAME_SOURCE` | 681–692 | Official | FP 185–313; title and date correct | S | N |
| E17 | "No combination name is used for four or five colors." (V14) | 1316 | Remove (as phrased) | none | U | Y |
| E18 | Colorless search note | 680 | Neutral | — | n/a | N |
| E19 | Compass, lens counts, buckets | 623–633, 1224–1315 | Computed | Part A item 3 (two-reading figures) | n/a | Y (V11b) |
| E20 | Cited cards (5) | 1448–1469 | Official + Scryfall metadata | Rosewater's `[autocard]` tags in E02 | S | N |
| E21 | Masthead kicker (V15) | 560 | Branding | — | n/a | Y |
| E22 | Lede, footer provenance, Fan Content notice | 562, 651–653 | Neutral | consistent with E01–E04 | n/a | N |
| E23 | Visible self-test line (V13) | 2145 | Diagnostics | — | n/a | Y |
| E24 | Unmatched-case notes and list note | 789–798, 1115 | Official | M21: the 3 absent are in the lists (154, 155, 258) and in no catalog entry (619–1477); "Forced sacrifice of a creature" (366) is explained under "Forced sacrifice" / "Sacrifice a creature." (986–987); "Creature sacrifice, forced, repeatable" has a catalog entry (863–865, "Sometimes black likes killing things slowly.") | 3 S; "recorded for source review" is V13 | Y |
| E25 | Boot-failure text (V13) | 1797–1799 | Diagnostics | — | n/a | Y |
| E26 | Basis disclosures (list-only, catalog-only) | 1545–1546 | Computed | frozen basis | n/a | N |
| E27 | Key specimen (Reach) | 1835 | Official | M21 132 "white is tertiary in reach" | S | N |

**Systems the brief named, located in the ledger:** the two resolved and three
unresolved conflict disclosures (E05–E07); player-facing `relWhy` (E15); the
four/five-colour naming statement (E17); New Capenna presentation (W23);
Strixhaven aliasing (W24); V6 crossing geometry and interpretation (W29–W30);
community four-colour readings (W26); five-colour and colourless prose
(W31–W37); both V10 instances (E09).

### Every unsupported substantive claim (56 rows)

- **Already on the §6/§18.6–§18.7 lists (treatment settled in kind):** V1 ×6
  (W26); V2 ×5 (W24); V3 ×5 (W32); V4 ×4 (W10, W33, W36 second gloss, W37);
  V5 ×5 (W23); V6 ×2 (W30); V8 ×2 (W39); V10 ×3 (E08 Primary, E09 ×2);
  V11 ruling prose ×5 (E07); V12 (E15); V13 (E11); V14 (E17); U1 ×2, U2, U3,
  U5.
- **Found by Part B, not on those lists (for the sheet):**
  1. Red blurb, "not by outcome" (1514, W03).
  2. Black downside, "as often against itself as against anyone else"
     (1508, W04).
  3. RW conflict core, "what a society owes the people inside it" (1597,
     W08).
  4. Red view, "Errors come from overriding what you already felt" (1580,
     W09).
  5. Green view, "whether or not you flatter yourself" (1590, W09).
  6. WU cost, "Once prepared it can act decisively" (1531, W07).
  7. Prismari red gloss, "spontaneity" (1709, W14).
  8. `SRC_SCOPE_COLLEGE` Vox commentary under a Rosewater attribution (1748,
     W17).
  9. Colourless "which is the whole point of them" (3615, W35).
  10. Colourless "That is why colorless design turns so heavily on rate"
      (3621, W35).
  11. Explorer Secondary definition drops "somewhat" (616, E08).
- **Citation wrong (16):** V7 ×14 (table above); U4 (W22); U6 (W16).
- **Unavailable:** none.

### New official-source finding (pending, for the wording sheet)

Not folded into the five MCP conflicts; no resolution invented. (Now
Decision 1, raised with the wording sheet.)

- **"Disorderly Conduct" has two dates on Wizards' own page.** The live page
  (captured 2026-10-03) and the corpus capture both print "Making Magic Jan 1,
  2012"; the live URL slug is `disorderly-conduct-2005-12-05`, and the text
  places it in Ravnica block, before Guildpact ("This is the last of the
  Ravnica guild theme weeks"). V7 requires citing the RW lines (1594–1595) by
  title and date, so the Owner must choose which date the page shows. No
  other source in hand settles it.

No contradiction between official sources about a Magic claim was found
beyond those already recorded (the five MCP conflicts; Flash in two Black
lists; Witherbloom's two designations; "Pie Fights" acceptance/growth).

### Part B evidence that refines revision 6 (recorded, not edited)

`PRODUCT-DEFINITION.md` is prohibited; these are inputs for the sheet.
- C3 "all 5 checked": Red blurb has an unsupported clause.
- C4 "all 5 checked": Black downside has an unsupported clause.
- C8 "the 5 … 'At its core' lines … match": the RW core does not; 2 of 10
  view sentences exceed the source.
- C11 "matches Silverquill, Prismari, Witherbloom and Quandrix": Prismari
  red's "spontaneity" is not in the guide.
- C15 "The New Capenna product page gives the families' colors": the captured
  product page has no colour text; "Hitting the Streets of New Capenna,
  Part 2" does.
- C26 "Yes": two clauses exceed "Just the Artifacts, Ma'am".
- U2 "not found … as fetched": found (line 44), hedge dropped.
- U4 "check it against the Khans Planeswalker's Guide": the guide does not
  state it; "Khan Do Attitude, Part 2" does.
- V10 names only Primary's dropped hedge; Secondary drops one too.
- V4's list omits the `SRC_SCOPE_COLLEGE` commentary.

### Rule and document files (evidence only; carried from Part A plus Part B)

Part A's item 7 findings stand unchanged. Part B adds, for the scoped
`CONTEXT.md` recheck (no edit made):
- `CONTEXT.md` "Source cautions" says Fleischer "describes them as **decks in
  gameplay terms**" and that the Ravnica-guild framing came "as a challenge
  to the team, **not as an achieved result**". "Designing Commander (2016
  Edition)" lines 86–88 present the challenge and then "Here's what we came
  up with:", with a per-colour philosophy paragraph for each group (90–118).
  The caution understates the source. Gate A's §18.2 rule allows a
  `CONTEXT.md` edit only where approved behaviour makes it stale; whether
  this belongs in Gate A is for the sheet.
- `CONTEXT.md` dates "Absence" "10 May 2013"; Wizards' page prints May 13,
  2013 (both URL slugs exist). Not on either page.

### Human checks and unavailable evidence (Part B)

- **Unavailable:** none. Every cited source was reached and captured.
- **Not re-derived:** the 467 placements (frozen source layer, Part A
  gates).
- **Human check (optional):** the "Disorderly Conduct" date question above,
  if the Owner wants an archive source outside the evidence hierarchy.

## Wording and treatment sheet (§18.5)

Written 2026-10-02 (coordinating agent as `robdev`, fresh session) from the
Part A and Part B evidence only. No new source research: the few excerpts
quoted below that Part B's tables name by locator only were read from Part
B's own captures (scratchpad `sources/`, corpus) to write exact wording. No
product, rule or document file was edited. **Nothing here is implemented until
the Owner approves it** (§18.15, stop point 2).

**Classes:** OFFICIAL = official source · COMPUTED = computed from official
source · NAV = navigation metadata · NEUTRAL = neutral UI description (no
external authority, cites nothing) · REMOVAL. Source keys as in the Part B
ledger; "MM" = Making Magic. Line numbers are HEAD (`08fca75`).

**Sheet rows: 69** (Color Wheel CW01–CW46, Mechanical Color Pie MC01–MC23).

### Color Wheel (`vox-color/color-wheel.html`)

**Frame and atlas**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW01 | Hero kicker, 1134 | "Vox Mana · Codex" | "Interactive diagram" | NEUTRAL | — | V9. Vox Mana is not the content authority. The kicker is kept so the hero layout is unchanged. The Fan Content footer (1480) keeps authorship |
| CW02 | Hero lede, 1137–1138 | "Five goals, five alliances, five conflicts, and the five identities hiding where the conflicts cross. One layer at a time." | "Five goals, five alliances, five conflicts, and the five points where the conflicts cross. One layer at a time." | NEUTRAL | — | V6: "identities hiding" interprets the geometry |
| CW03 | Atlas lede, 1471–1472 | "… Six tiers, thirty-two identities." | "Every combination of the five colors, from none of them to all of them. Thirty-two identities, grouped by how many colors they hold." | NEUTRAL | — | V8 |
| CW04 | Atlas group index `.tier-index` ×6, 3499 | "Tier 1" … "Tier 6" | "0 colors", "1 color", "2 colors", "3 colors", "4 colors", "5 colors" | NEUTRAL | — | V8: "tier" is reserved for Primary / Secondary / Tertiary. The internal names (`tier-N-h`, `.atlas-tier`, `TIERS`, `o.tier`) are not visible and stay |

**Colors (`D.colors`)**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW05 | Black method (panel sub-line; feeds the four-color "absent voice"), 1506 | "Flexibility, and self-interest without apology" | "Flexibility and selfishness" | OFFICIAL | TY, MM Mar 20, 2017, corpus 250–251: "The key to power is flexibility and selfishness." | U5. Not glossed. The computed absent voice then reads "pursued through flexibility and selfishness" |
| CW06 | Black "What it costs", 1508 | "Its own worst enemy. A willingness to do anything includes the things that cost Black, and the risks it runs are as often against itself as against anyone else." | "Its own worst enemy. A willingness to do anything includes the things that cost Black, and the calculated risks it takes at times end up hurting Black." | OFFICIAL | REV "In the Black Revisited", MM Jul 27, 2015, 130: "Black will make calculated risks that will at times end up hurting black." | The frequency claim is unsupported |
| CW07 | Red summary, 1514 | "… just talk over it. Measures a life by regret, not by outcome." | "Holds that the answer already arrives as feeling, and the other four colors just talk over it. Wants to look back on a fulfilled life with no regrets." | OFFICIAL | PF, MM Nov 14, 2016, corpus 83: "look back on a fulfilled life with no regrets" | "not by outcome" is unsupported |

**Pair panels (V7).** Pair panels cite only "Thank You…" (allied) or "Pie
Fights" (conflict), so all 15 lines are miscited. Each panel's existing
"Sources & scope" drawer gains one source line after the existing source:
allied (2098) `SRC_FRIEND · <cost source> · SRC_SCOPE`; conflict (2169)
`SRC_PIE · <together/cost source> · SRC_SCOPE …`. The format matches
`SRC_PIE`. Wording is unchanged except CW08.

| ID | Pair · lines | Current wording | Proposed wording / source line | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW08 | WU Azorius cost, 1531 | "Preparation becomes rigidity. Because it analyses and systematises in advance, white–blue is slow to respond when a problem falls outside what it anticipated. Once prepared it can act decisively; what it struggles with is improvising." | "Preparation becomes rigidity. Because it analyses and systematises in advance, white–blue is slow to respond when a problem falls outside what it anticipated. That slowness can leave it very vulnerable to the right kind of attack." Source line: `What it costs: Rosewater, "Slow and Steady," Making Magic, May 1, 2006 — paraphrased` | OFFICIAL | "Slow and Steady", MM May 1, 2006, corpus 91–94: "This slowness to respond can make them very vulnerable to the right kind of attack." | "Once prepared it can act decisively" is unsupported; miscited |
| CW09 | UB Dimir cost, 1538 | unchanged | `What it costs: Rosewater, "Pretty Sneaky Sis," Making Magic, November 7, 2005 — paraphrased` | OFFICIAL | MM Nov 7, 2005, 86–92: "complete lack of trust. Even amongst itself" | Citation wrong |
| CW10 | BR Rakdos cost, 1545 | unchanged | `What it costs: Rosewater, "Hedonism With Attitude," Making Magic, August 14, 2006 — paraphrased` | OFFICIAL | MM Aug 14, 2006, 93–98: "No self-control." | Citation wrong |
| CW11 | RG Gruul cost, 1552 | unchanged | `What it costs: Rosewater, "Aaaargh!!!," Making Magic, January 30, 2006 — paraphrased` | OFFICIAL | MM Jan 30, 2006, 91–99: "didn't bother to come up with a Plan B" | Citation wrong ("Thank You…" 205 covers clause 1 only) |
| CW12 | GW Selesnya cost, 1559 | unchanged | `What it costs: Rosewater, "Group Think," Making Magic, October 3, 2005 — paraphrased` | OFFICIAL | MM Oct 3, 2005, 97–99: "no diversity of thought or experience" | Citation wrong |
| CW13 | WB Orzhov together + cost, 1564–1565 | unchanged | `How they work together and What it costs: Rosewater, "Playing By Their Own Rules," Making Magic, March 27, 2006 — paraphrased` | OFFICIAL | MM Mar 27, 2006, 47–50, 110–111: "Compromises, my dear reader, compromises."; 113–115: "based upon a shaky trust" | Citation wrong |
| CW14 | UR Izzet together + cost, 1574–1575 | unchanged | `How they work together and What it costs: Rosewater, "Creative Differences," Making Magic, February 27, 2006 — paraphrased` | OFFICIAL | MM Feb 27, 2006, 41–43: "By taking aspects of each."; 96–99: "greatest weakness is its lack of focus" | Citation wrong |
| CW15 | BG Golgari together + cost, 1584–1585 | unchanged | `How they work together and What it costs: Rosewater, "Life and Death," Making Magic, October 24, 2005 — paraphrased` | OFFICIAL | MM Oct 24, 2005, 27, 35–37: "they both turn to the same primal forces"; 91–95: "lack of pinpoint control" | Citation wrong |
| CW16 | RW Boros together + cost, 1594–1595 | unchanged | Per **Decision 1**: (A) `How they work together and What it costs: Rosewater, "Disorderly Conduct," Making Magic, January 1, 2012 — paraphrased`, or (B) `How they work together and What it costs: Rosewater, "Disorderly Conduct," Making Magic — paraphrased` | OFFICIAL | "Disorderly Conduct", corpus and live page, 35–38: "One half picks the goal"; 87–91: "complete lack of subtlety" | Citation wrong; the date is contested on Wizards' own page |
| CW17 | GU Simic together + cost, 1604–1605 | unchanged | `How they work together: Rosewater, "Pie Fights," November 14, 2016, and "Improving Upon Nature," Making Magic, May 29, 2006 — paraphrased · What it costs: Rosewater, "Improving Upon Nature," Making Magic, May 29, 2006 — paraphrased` | OFFICIAL | Clause 1: PF 184, "Green believes that each person is born with all the attributes that will define it". Clauses 2–3: Simic 53–56, "What if the Simic strived to improve upon nature?"; 83–85, "this knowledge will allow it to shape the world". Cost: 105–111, "inability to stop what its doing" | Citation wrong. "Together" is a composite of two articles, cited as such |

**Conflict panels (`D.enemies`)**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW18 | RW neutral core, 1597 | "At bottom: what a society owes the people inside it." | "At bottom: what is best for how we govern ourselves." | OFFICIAL | PF 182: "At its core, this conflict is about what is best for how we govern ourselves." | Unsupported core |
| CW19 | UR, Red's view, 1580 | "Passion against indifference. Errors come from overriding what you already felt." | "Passion against indifference." | OFFICIAL | PF 148: "Red sees this conflict as passion versus indifference." | Sentence 2 is unsupported |
| CW20 | BG, Green's view, 1590 | "Truth against skepticism. The pattern is real whether or not you flatter yourself." | "Truth against skepticism." | OFFICIAL | PF 165: "Green sees this conflict as truth versus skepticism." | Sentence 2 is unsupported |
| CW21 | Conflict Sources note, 2169–2170 | "Each conflict reads differently depending on which side states it — the neutral summary is a third framing, not the true one." | Removed. The drawer reads `SRC_PIE · <CW13–CW17 line> · SRC_SCOPE[ SRC_SCOPE_COLLEGE]` | REMOVAL | PF 288 says only "I simplified them a bit" | V4 gloss |

**Strixhaven**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW22 | `SRC_SCOPE_COLLEGE` (conflict-panel drawer), 1748 | "Strixhaven deliberately reinterprets … academic disputes. These college conflicts are set-specific lenses, chosen to build five distinct schools of study — they do not replace the broader color-pie conflicts used elsewhere on the wheel, and two of the five differ from them outright. — Mark Rosewater, "In the Strixhaven," Parts 1 and 2 … Anything drawn from a vision-design handoff is labelled a design note, because those precede set design and changed after it." | "Strixhaven deliberately reinterprets the five enemy pairs as academic disputes — Mark Rosewater, "In the Strixhaven, Part 1," March 29, 2021. College names and the two sides of each: "Planeswalker's Guide to Strixhaven," April 1, 2021, and the Secrets of Strixhaven product page. Fields of study: "In the Strixhaven, Part 1," March 29, 2021. Pole names are the deans' titles as printed on the cards. Design note: Mark Rosewater, "Strixhaven Vision Design Handoff Document, Part 1," Making Magic, April 19, 2021." | OFFICIAL | STX1, MM Mar 29, 2021, 65: "What if we focused on the conflict between the two colors?" | Sentence 2 is Vox commentary under Rosewater's name (W17). The handoff was not cited anywhere (U6) |
| CW23 | Silverquill design note, 1700 | "In vision design — which precedes set design, and which things changed after — spoken magic was characterised as the fastest form of casting, and that is what made Silverquill the combat-oriented college." | Unchanged; now cited by CW22 | OFFICIAL | Strixhaven Vision Design Handoff Document, Part 1, MM Apr 19, 2021: 101 "Spoken word is the fastest form of spellcasting and thus is the magic of ritualized combat"; 103 "…let white-black be the most combat-oriented faction"; intro "Things always change during set design." | U6, citation only. The handoff's prototype name ("Shadix") is not shown |
| CW24 | Prismari red pole gloss, 1709 | "spontaneity, emotion and direct self-expression through elemental art" | "expressing emotional truth through fire, earth and other elements" | OFFICIAL | PWG, Apr 1, 2021, 156: "express their emotional truth through fire, earth, and other elements" | "spontaneity" is not in the guide's red section |
| CW25 | Lorehold white pole gloss, 1730 | "history as patterns, institutions and structures that shape a society" | "uncovering and recording the past, and chronicling historical truths for posterity" | OFFICIAL | PWG 232: "love to uncover and record the past; … chronicle historical truths for posterity" | U1 |
| CW26 | Lorehold red pole gloss, 1731 | "history as people, passions and contingent events that resist orderly prediction" | "reckless discovery and the spirit of adventure in researching the past: the essence and emotion of history over precision or procedure" | OFFICIAL | PWG 228: "reckless discovery and the spirit of adventure in their research of the past: the essence and emotion of history over precision or procedure" | U1 |
| CW27 | Atlas college tiles, subline ×5, 3413 (data 3364–3369) | "Enemy · also called Orzhov" (Izzet, Golgari, Boros, Simic) | "Enemy · Strixhaven college" | NAV | Contradicted as alias by STX1 65: "What if the faction was based not on agreement but disagreement?" | V2. Unchanged: the five tiles, their names, the "Strixhaven Colleges" subgroup, each tile's note (the college's own conflict), "10 identities · 15 factions", 37 tiles. Not visible: `ALIASES` becomes `COLLEGE_TILES`, the `of` field is deleted, and the comments at 3258–3259 and 3361–3363 say "Strixhaven factions, not alternate names". The conflict panel's college block already presents the college as a lens and is unchanged. No new lens, mode, control or interaction |

**New Capenna, wedges, four colors**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW28 | Shard panel faction line `.panel-aka`, 3801 (same template at 2200; the data at 3302–3314) | "Also called Brokers" (Obscura, Maestros, Riveteers, Cabaretti) | "Streets of New Capenna family in these colors: the Brokers" (likewise each). The shard drawer adds `New Capenna families: Mark Rosewater, "Hitting the Streets of New Capenna, Part 2," Making Magic, April 11, 2022.` Data field `aka` renamed `capennaFamily` | OFFICIAL | MM Apr 11, 2022, 51–95: "THE BROKERS (GREEN-WHITE-BLUE)" … "THE CABARETTI (RED-GREEN-WHITE)" | V5. Separate faction context, not alternate shard names. Same element and position; nothing new built |
| CW29 | `SRC_SCOPE_WEDGE`, sentence 3, 1650 | "… but each Tarkir clan is centred on one of the two allied colours." (no source) | "… but each Tarkir clan is centred on one of the two allied colours (Mark Rosewater, "Khan Do Attitude, Part 2," Making Magic, September 8, 2014)." | OFFICIAL | MM Sep 8, 2014, 46: "each clan was centered in a color and had one ally color and one enemy color"; 50–78, the five clans | U4, citation only. Other wedge material is unchanged |
| CW30 | `SRC_SCOPE_FOUR`, 1649 | "Four colours have no philosophy article of their own. These five names are deck identities the Commander 2016 design team built for those decks and described in gameplay terms — Ethan Fleischer, … October 24, 2016. They are one product's lenses, not definitions of the colour combinations. The community line is community reading, not canon." | "The lens names (Chaos, Aggression, Altruism, Growth, Artifice) are the identities the Commander 2016 design team gave each four-color group — Ethan Fleischer, "Designing Commander (2016 Edition)," October 24, 2016. Commanders and decks: "Commander (2016 Edition) Decklists," October 28, 2016. They are one product's lenses, not definitions of the colour combinations. The group names (Non-White and the rest) are this page's labels." | OFFICIAL + NEUTRAL (last sentence) | `c16`, Card Preview Oct 24, 2016, 86: "apply a 'Ravnica guild'–style identity to each four-color group"; 90–118. Decklists, Announcements Oct 28, 2016 | U3: an unsupported negative, contradicted by `c16`. V1: the scope sentence goes. "described in gameplay terms" understates `c16`, so it is dropped |
| CW31 | Explore four-color panel, 2216–2217 | "**Community typically reads it as** <community>." | Removed | REMOVAL | none | V1 |
| CW32 | Combine four-color panel, 3712–3716; data 3340, 3344, 3348, 3352, 3356 | Same line, ×5 identities | Removed; the `community` fields are deleted | REMOVAL | none | V1. The panel keeps the absent voice, the C16 lens, the commander, and the composition, so no state is left empty |
| CW33 | Crossing panel paragraph, 2202–2206 | "… Five crossings, five excluded colors, five four-color identities — the pentagram contains the whole tier and never labels it." | "This point is where two conflict chords cross. A chord pair intersects only when their endpoints alternate around the wheel, so every crossing touches four colors and leaves exactly one out. Five crossings, one for each four-color combination. Derived from the wheel's layout, in which each color sits across from its two enemies." | COMPUTED | PF 111: "enemies with the colors across from them" | V6. The geometry is kept and labelled as derived. Unchanged: the markers ("Four-color identity excluding White"), the layer note (1785), and the "Here the one left out is …" line (the excluded colour's own goal and method; nothing inferred about the four) |

**Five colors and colorless**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| CW34 | Five-color, 3736–3737 | "**All five, still disagreeing.** <goals>. Holding every colour does not reconcile them — it means owning the whole argument rather than settling it." | "**All five goals.** White peace, Blue perfection, Black power, Red freedom, Green acceptance." (the existing computed list) | COMPUTED | TY 241–259 (goals) | V3 |
| CW35 | Five-color, 3738–3742 | "**There is no spare name for it.** … nothing is left outside to disagree with." | Removed | REMOVAL | none | V3 |
| CW36 | Five-color "What it costs", 3747–3750 | "… for what they lack. Five colours are at their most distinctive when something else narrows the choices they opened." | "Access weakens the pie that gives colours meaning. Rosewater has said that making five-colour access too easy limits the importance of the colour pie, because decks can simply reach past their own colours for what they lack." | OFFICIAL | "Mana with All the Fixin's", MM Mar 23, 2009, 76: "it limits the importance of the color pie as decks can too easily access other colors" | Last sentence V3 |
| CW37 | Five-color, 3751–3752 | "**Where the tension lives.** Inside. Nothing sits outside this identity to argue with, so all five conflicts are internal to it: <fights>." | "**Both sides of every conflict.** <fights>." (the existing computed list of the five titles) | COMPUTED | PF 114–183 (titles) | V3 |
| CW38 | Five-color atlas tile note, 3461 | "All five — every conflict now internal." | "Every color." | COMPUTED | — | V3. The note stays non-null, so the "PLACEHOLDER" fallback cannot show |
| CW39 | `SRC_SCOPE_FIVE`, 1647 | "Five-color identity means access to all five colors. It does not by itself describe a worldview … — Mark Rosewater, "Party of Five," …; "Mana with All the Fixin's," …" | "How it plays: Mark Rosewater, "Party of Five," February 2, 2009. What it costs: Mark Rosewater, "Mana with All the Fixin's," Making Magic, March 23, 2009." (the drawer then continues `SRC_FRIEND · SRC_PIE · resolved from the identity registry`, unchanged) | OFFICIAL | "Party of Five", Feature Feb 2, 2009, 135: "Why is this a five-color card?"; `fixins` 76 | V4: neither article contains the scope prose. Precise citation (W31). "How it plays" (3743) is unchanged |
| CW40 | Colorless, 3608–3610 | "… Rosewater's account of artifacts is that they represent the lack of one — the mage who specialises in them is avoiding committing to anything." | "**Not a sixth color, and not a sixth philosophy.** Rosewater's account of artifacts is that they represent the lack of a philosophy, and that the mage who specialises in them is avoiding sticking to much of anything." | OFFICIAL | "Just the Artifacts, Ma'am", MM Feb 28, 2005, 44: "They represent the lack of a philosophy. … Rather he's avoiding sticking to much of anything." | U2: the hedge is restored |
| CW41 | Colorless, 3611 | "Colorless marks a card that has no color; what it means comes from the card, not from the absence." | Removed | REMOVAL | none | V4 |
| CW42 | Colorless "How it plays", 3614–3615 | "Generic costs mean any mage can play any artifact, which is the whole point of them. Their home ground is …" | "Generic costs mean any mage can play any artifact, which Rosewater counts among the elements that most defined them. Their home ground is …" (rest unchanged) | OFFICIAL | `artifacts` 77–79: "this universal quality to artifacts was one of the elements that most defined them" | "the whole point of them" overstates the source |
| CW43 | Colorless "What it costs", 3618–3621 | "Access becomes restraint. Because a colorless effect is available to every deck, granting one hands it to the color that is worst at it — Rosewater's own example is … black and red. That is why colorless design turns so heavily on rate." | "Access becomes restraint. Because any deck can play an artifact, any ability given to artifacts is effectively given to the color weakest at it — Rosewater's own example is that enchantment destruction on an artifact is effectively given to black and red, which is why artifacts tend not to have it." | OFFICIAL | `artifacts` 97: "any ability you give to artifacts you are giving to the weakest color in that ability … This is why artifacts tend not to have any enchantment removal abilities." | "turns so heavily on rate" is unsupported; the source is about artifacts |
| CW44 | `SRC_SCOPE_NONE`, 1648 | "Colorless is a game characteristic and a design space, not a faction or a school of thought. … — Mark Rosewater, "Just the Artifacts, Ma'am," …; "Third Time's the Charm, Part 2," …; "The Council of Colors, Revisited," …" | "Mark Rosewater, "Just the Artifacts, Ma'am," Making Magic, February 28, 2005. Generic and colorless mana, and colorless cards: Comprehensive Rules 105.2, 107.4b, 107.4c and 202.2b." | OFFICIAL | Part B: 0 matches for the scope terms in the three articles; CR rules as above | V4. The quotation keeps its own citation ("Third Time's the Charm, Part 2"). Nothing visible rests on the Council article any more |
| CW45 | C16 lens statements ×5, commanders and decks, 3337–3356, 2210–2215, 3702 | Unchanged | Unchanged | OFFICIAL | `c16` 90–118; Decklists Oct 28, 2016; Scryfall `c16` | Item 13: preserved. The `CONTEXT.md` caution is not used as authority |

**Route (V16): behavior, not copy**

| ID | Surface | Current | Proposed | Class | Source | Reason |
|---|---|---|---|---|---|---|
| CW46 | Every hash the router reads as the legacy Mechanics route: `#mechanics`, `#mechanics=`, any value (`board`, `atlas`, `layered`, `preview`, …), and the percent-encoded forms in Part A item 8 (14 of 14) | Activates the preview Mechanics world; reload and Back/Forward reactivate it; `#lay-mech` stays enabled afterwards | **Legacy Mechanics links open the normal Color Wheel in Explore, at rest, and never show the preview.** The URL is replaced in place with the same path and query and no hash (`history.replaceState(history.state, '', location.pathname + location.search)`). No history entry is added. Reload, Back and Forward land in Explore at rest, with no loop. `#lay-mech` stays disabled. Neighboring deep links (`#color=W`, `#ally=WU`, …) and the 8 near-miss forms behave as today | NEUTRAL (behavior) | Part A item 8 | §18.10. One gate in the `mechanics` branch of `applyRoute`. The preview code stays byte-identical. `file://` hard reload and toolbar Back/Forward remain a human check |

### Mechanical Color Pie (`vox-color/mechanical-explorer.html`)

**Frame, key and footer**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| MC01 | Masthead kicker, 560 | "Vox Mana · An interactive edition" | "An interactive edition" | NEUTRAL | — | V15. The kicker is kept for layout. Fan Content footer unchanged |
| MC02 | Key, Primary, 615 | "The color that uses the ability most: highest volume, lowest rarity." | "The color the ability is seen in most: highest volume, usually at the lowest rarity. It also tends to be the color that most often pushes the power level on effects that get pushed." | OFFICIAL | M21, MM Oct 18, 2021, 129: "usually at the lowest rarity … It also tends to be the color that most often pushes the power level, if it's an effect we push the power level on." | V10 |
| MC03 | Key, Secondary, 616 | "Appears regularly, but less often, and may carry restrictions." | "Appears on a somewhat regular basis, but less often than Primary and not always at as low a rarity, and may carry restrictions." | OFFICIAL | M21 130: "on a somewhat regular basis, but not as often as the primary and not always in as low of rarity" | Hedge "somewhat" dropped (Part B) |
| MC04 | Key note `.defs-note`, 619 | "Rosewater's categories describe how often a color uses an ability in design, not how well. Five slots, always W U B R G." | "These are categories, not scores: this page never adds them up or turns them into a number. Five slots, always W U B R G." | NEUTRAL | — | V10. It contradicted M21 129. The interface rule stays |
| MC05 | Detail footer `.dx-foot`, 1579 | "<snapshot label>. Tier describes how often a color uses this in design, not how well." | "<snapshot label>. Placements are categories; this page never adds them up or scores them." | NEUTRAL | — | V10, second instance (Part A E13) |

**Resolved conflicts (V11a).** These are rendered in the detail "Source note"
drawer (1540–1543). The `ruling.mechanism` prose is removed from every
player view; the data is unchanged. Slot, row and every count show the single
resolved tier, as today.

| ID | Record | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| MC06 | Flash / Black → Secondary | "The article's color list says tertiary; its ability catalog says secondary. This dataset uses secondary, on the authority of the companion change log, 2021-10-18, and keeps the conflicting claim. Flash moved black from tertiary to secondary in 2021; the Black-Tertiary list entry is stale 2017 data." | "Secondary, from the companion article "Mechanical Color Pie 2021 Changes" (October 18, 2021), which moves Flash from "Tertiary: White, black, and red" to "Secondary: White, black, and green". The explanations also say Secondary. The article's color lists name Black under both Secondary and Tertiary." | OFFICIAL | CHG, Oct 18, 2021, "CHANGE TEXT AND STATUS: Flash" (OLD/NEW). M21 lists: Black—Secondary and Black—Tertiary (Part A item 2) | V11a. The frozen metadata names only the Tertiary list claim; the article has both |
| MC07 | +N/+N (on spells) / White → Primary | "The article's color list says secondary; its ability catalog says primary. This dataset uses primary, on the authority of the companion change log, … The change log records White as primary in 2017 as well, so the White-Secondary list entry contradicts both editions." | "Primary, from the companion article "Mechanical Color Pie 2021 Changes" (October 18, 2021): its "Creature pumping" entry lists "Primary: White and green" before and after the update. The explanations also say Primary. The article's color list says Secondary." | OFFICIAL | CHG, "CHANGE TEXT, STATUS, & REMOVE SOME SUBSECTIONS: Creature pumping": OLD and NEW "Primary: White and green" | V11a. "contradicts both editions" misleads, because the 2017 list also says White Secondary |

**Unresolved conflicts (V11b, §18.8).** These use one template, the same for
all three. Neither claim is first by weight. List first, explanations second,
everywhere.

| ID | Record | Detail row `.own-t` (replaces the single tier) | Source note (replaces the adjudication sentence and the `ruling.mechanism` text) | Class | Source |
|---|---|---|---|---|---|
| MC08 | Exiling cards from graveyard / White | "Primary in the color lists · Secondary in the explanations" | "White: the 2021 article places this two ways. Color lists: Primary. Explanations: Secondary. The companion change log does not mention it. This page shows both and does not choose between them." | OFFICIAL (claims) + NEUTRAL (last sentence) | M21 "Mechanical Color Pie Lists" (White—Primary) and "All Abilities with Explanations" (Secondary); CHG: 0 matches (Part A item 2) |
| MC09 | Deal N damage to a creature with flying / Red | "Secondary in the color lists · Tertiary in the explanations" | "Red: the 2021 article places this two ways. Color lists: Secondary. Explanations: Tertiary. The companion change log does not mention it. This page shows both and does not choose between them." | as MC08 | as MC08 |
| MC10 | +N/+0 to your team (ongoing) / Black | "Secondary in the color lists · Tertiary in the explanations" | "Black: the 2021 article places this two ways. Color lists: Secondary (as "+N/+0 to your team, ongoing"). Explanations: Tertiary (under "Creature pumping, your team, ongoing"). The companion change log does not mention it. This page shows both and does not choose between them." | as MC08 | as MC08 |

Removed in MC08–MC10: "This dataset uses <tier>, on the authority of the
ability catalog, and keeps the conflicting claim", and the three mechanism
sentences ("summary-list error"; "green is the stronger anti-flying colour…";
"long-standing list error"). **Provenance, for the sheet only and not shown
in the UI:** *Mechanical Color Pie 2017* already contains the same three
splits (2017 lines 67/1044–1047, 378/999–1001, 287/883–894). This
corroborates the conflicts; it resolves nothing.

**MC11 — two placements in one color slot (recommended treatment; one, no
alternatives).**
- **Markup.** The slot stays one element in the same W U B R G position:
  `<i class="sc dual" data-c="W" style="--cc:var(--w)"><i class="sc-h l t-p"><i class="ms ms-w"></i></i><i class="sc-h r t-s"><i class="ms ms-w"></i></i></i>`.
  The halves use the class `sc-h`, never `sc`, so `.strip .sc` still matches
  exactly one element per slot.
- **CSS.**
  - `.sc.dual` keeps the slot's `--sz` box, with no fill and no ring of its
    own.
  - `.sc-h` is `position:absolute; inset:0; border-radius:50%; display:grid;
    place-items:center`. `.sc-h.l` is `clip-path:inset(0 50% 0 0)`; `.sc-h.r`
    is `clip-path:inset(0 0 0 50%)`.
  - Each half draws the **full-size** existing tier glyph: the existing
    `.sc.t-p / .t-s / .t-t` rules extended to `.sc-h.t-p / .t-s / .t-t`.
  - A 1px vertical divider: `.sc.dual::after` at `left:50%`, 10%–90% height,
    `var(--ink-dim)`. The tertiary dot uses `::after` only on `.sc-h`, and
    `.bx` keeps `::before`.
- **The result.** One mechanic, one row, one slot. Left half: the color-list
  claim. Right half: the explanations claim. The halves are equal in area and
  drawn at the same scale. The footprint is unchanged, so nothing encodes
  magnitude. There is no blended or intermediate glyph, so nothing is
  averaged.
- **Used** in the list strips (article and A–Z), search-result strips, the
  detail notation strip and the detail row icon (18px).
- **Key.** One added definition, with the exile/White slot as its icon:
  - dt "Two placements";
  - dd "Left half: the article's color lists ("Mechanical Color Pie Lists").
    Right half: its explanations ("All Abilities with Explanations"). This
    page shows both and does not choose."
- **Accessible text.** Strips stay `aria-hidden`. The entry's `aria-label`
  carries both claims (MC13). The detail row text is the MC08–MC10 string.
- **QA measures** the halves' legibility at 12px (search strips) and at
  360×780 @2x.

**MC12 — best-tier marks `.bx` (E2).** The `.bx` underline uses the same
left/right grammar:
- **full width** when a selected color holds the best placement under both
  readings;
- **left half only** when it holds it only by the color lists;
- **right half only** when it holds it only by the explanations.

Example: under WB, the exile entry is underlined full on Black and left-half
on White. Visual only; the text is in MC13 and MC15.

**MC13 — entry accessible name (E3), exile under W.**
- **Today:** "Exiling cards from graveyard. White secondary, Blue none, Black
  primary, Red none, Green secondary. Best placement among White: secondary,
  computed."
- **Proposed:** "Exiling cards from graveyard. White primary in the color lists
  and secondary in the explanations, Blue none, Black primary, Red none, Green
  secondary. Best placement among White: primary by the color lists,
  secondary by the explanations; computed from conflicting 2021 claims."
- **Where the readings agree,** today's text is unchanged.

**MC14 — a count where the readings agree, and one where they differ (E5,
E6). Real example: White (Part A item 3).**

- Lens line, unchanged (it never differs): "**104** of 216 entries have a
  placement in White [computed]".
- **Readings agree, unchanged:** "best is Tertiary **20**" and "no placement
  **112**". One button each, as today. The lens line's own `computed` tag is
  unchanged.
- **Readings differ:** the bucket keeps one label and gets two count buttons:
  - "best is Primary: [color lists **61**] [explanations **60**]";
  - "best is Secondary: [color lists **23**] [explanations **24**]".
  - Each button opens exactly the entries it counts. `aria-label`: "best is
    Primary by the color lists: 61 entries. Show them." (likewise).
- **Tag.** After the bucket buttons, one tag: "computed · depends on
  conflicting 2021 claims". It shows only when at least one count differs.
- **Note,** shown under the same condition: "Where two counts appear, the
  article's color lists and its explanations place an entry differently. Both
  are shown."
- **Spotlight bar and announcement:** "Showing 61 entries: best is Primary in
  White, by the color lists. Depends on conflicting 2021 claims."
- **No conflict messaging** on the outputs Part A proved never change: the "N
  of 216 have a placement" line, the compass identity count (E7), "newly
  placed" and "no longer placed".

**MC15 — reading-dependent "in <colors>" (E11). Real example: exile under
White, Black, Red and Green** (the best tier is Primary in both readings; the
owning colors differ).
- **Today:** "Best placement among White, Black, Red and Green: **Primary**,
  in Black. [computed]"
- **Proposed:** "Best placement among White, Black, Red and Green:
  **Primary**, in White and Black by the color lists; in Black by the
  explanations. [computed · depends on conflicting 2021 claims]"
- **Where the tier also differs** (exile under White and Green), each reading
  gives its own tier and colors: "Best placement among White and Green:
  **Primary**, in White by the color lists; **Secondary**, in White and Green
  by the explanations. [computed · depends on conflicting 2021 claims]"

**MC16 — search-result lens tier (E9), exile with a query setting W.**
- **Today:** "W: Secondary".
- **Proposed:** "W: Primary by the color lists · Secondary by the
  explanations". Where the readings agree, unchanged.

**MC17 — reading-dependent compass step (E8). Real step: WB − B (WB → W).**
- **Color-list reading:** no longer placed 50 · best placement falls 13 · one
  placement fewer, best unchanged 31.
- **Explanations reading:** 50 · 14 · 30 (= fixture 02 `remove_B`).
- **The one entry that moves:** exiling cards from graveyard. By the color
  lists it is "one placement fewer, best unchanged" (W Primary remains). By
  the explanations it is "best placement falls" (Primary in Black → Secondary
  in White).
- **Proposed step:**
  - "−B WB → W";
  - "no longer placed **50**" (single; it never differs);
  - "best placement falls: [color lists **13**] [explanations **14**]";
  - "one placement fewer, best unchanged: [color lists **31**] [explanations
    **30**]";
  - then one line: "Exiling cards from graveyard counts as "one placement
    fewer, best unchanged" by the color lists and "best placement falls" by
    the explanations. [computed · depends on conflicting 2021 claims]"
- The mechanic stays one entry, in one list per reading. Spotlight: "Showing
  14 entries: removing Black from WB → W: best placement falls, by the
  explanations. Depends on conflicting 2021 claims."
- Steps where the readings agree are unchanged.

**Search, notes, diagnostics**

| ID | Surface | Current | Proposed | Class | Source · locator · excerpt | Reason |
|---|---|---|---|---|---|---|
| MC18 | `relWhy`: the result-row `title` (1398) and the parse line (1369) | Row `title="stax is a strategy, not one ability; these are entries players associate with it"` (7 strings). Parse: "… · 4 related, not what the term names (<relWhy>)" | Row: no `title`. Its existing visible labels stay: "Related to player term" + "related · not what the term names". Parse: "… · 4 related, not what the term names" | NAV | — | V12. The existing labels already say why a result appeared, without a mechanical claim, so no new wording is needed. `PLAYER_TERMS[].relWhy` stays as internal data, unrendered |
| MC19 | `#limits`, 1814 | (`meta.caution`) "A snapshot that will continue to evolve. Per-set needs bend the default and some entries are experiments. Never present this as the current state of the colour pie. An absent placement is not evidence that no card of that color exists." | "A snapshot that will continue to evolve. Per-set needs bend the default and some entries are experiments. An absent placement is not evidence that no card of that color exists." It becomes a page string; `meta.caution` is no longer rendered, and the data is unchanged | OFFICIAL (1–2) + NEUTRAL (3) | M21 122: "It's a snapshot in time."; 124: "the default center, but the needs of each set will shift"; 125: "We are constantly experimenting" | V13. The instruction contradicts M21 122, "represents where the color pie currently is today" |
| MC20 | Boot failure `#boot`, 1797–1799 | "Could not read the frozen 2021 data." + "This page reads the frozen 2021 data over HTTP, so it needs the project's static server…" + `cd`/`py -m http.server`/localhost URL | h2 "The 2021 data could not be loaded." p "Reload the page to try again." Developer guidance moves to a code comment and `console.error` | NEUTRAL | — | V13 |
| MC21 | `#selftest`, 654 / 2141–2145 | "Self-check: 84 of 84 passed, against the runtime, …" | The element gets `hidden` (not removed). `runSelfTest` still runs, still fills it, still `console.warn`s on failure, and `selftest()` still returns `T` | NEUTRAL | — | V13. Execution is unchanged |
| MC22 | Unmatched note, "Creature sacrifice, forced, repeatable", 796 | "… because this page shows only the frozen data. The issue is recorded for source review." | "… because this page shows only the frozen data." (last sentence removed) | REMOVAL | M21 catalog 863–865 (the rest stays supported) | V13. Assertion 1968's regex is unaffected |
| MC23 | Compass identity line `.id-src`, 1316 | "No combination name is used for four or five colors." | "This page gives no combination name for four or five colors." | NEUTRAL | — | V14 |

### Self-test impact (narrow; no redesign)

- **1922** "all 216 × 5 rendered placements equal the runtime" →
  "the 1077 single slots equal the runtime; the 3 unresolved slots show both
  official claims". For each `.sc.dual`: the left `.sc-h` class equals
  `conflict.colour_list_says`, the right equals `ability_catalog_says`, and the
  slot carries no single `t-*` class. The 2 resolved slots still equal the
  runtime.
- **2069** "WB − B counts equal the fixture" → "no longer placed" equals the
  fixture. The explanations-reading counts equal `f2.remove_B`. The
  color-list counts are 13 and 31, from the projection. The step carries the
  conflict tag. Model parity stays in 2039.
- **1924** "one footprint for every placement mark": the selector and the
  expected value (1) are unchanged. It is still true, because MC11's halves
  are `.sc-h` and not `.sc`. It gains two guards, so that internal marks
  can never count as footprints:
  - `listEl.querySelectorAll('.strip .sc').length === 1080`;
  - exactly 3 `.strip .sc.dual` per layout, each with exactly two `.sc-h`
    children.
- **1944** (Flying detail rows): stays valid.
- **1985** (`relWhy` data present): stays, since the internal data stays.
- **1968** and the other copy regexes (1961, 1964, 1971, 2011, 2093, 2097,
  2120): none matches a changed string.
- **Visible output** is hidden (MC21); execution continues.

### Rule and document edits (listed, not applied; after approval, before `ready-for-qa`)

- **`CLAUDE.md`**, the invariant "Mechanics mode stays preview-only —
  reachable by route, not enabled in production navigation." →
  "**Mechanics mode is retired from the Color Wheel.** Every legacy Mechanics
  hash lands in Explore at rest, with the URL canonicalised; the preview code
  stays, unreachable, until its retirement story."
- **`MECHANICS-CONTRACT.md`,** the two permitted notes only:
  - §7 step 7, after "Reachable only via `#mechanics=preview` until the
    visual review passes": "*Note (Gate A, V16): superseded. Every hash the
    router reads as the Mechanics route now lands in Explore at rest and is
    canonicalised; the preview is unreachable.*"
  - §1 "The standing rule": "*Note (Gate A, V11): 'catalog wins' governs
    only the frozen `tier` field. Player-facing output uses the two-reading
    projection (PRODUCT-DEFINITION §18.8–§18.9): the three unresolved
    placements are shown as both official claims.*"
- **`CONTEXT.md`,** scoped:
  - lines 57–59: "32 identities in `IDENTITIES`, 5 Strixhaven college tiles
    in `COLLEGE_TILES`, 37 tiles. The colleges are Strixhaven factions shown
    beside the guilds, not alternate names for them, so they never inflate
    the identity count." Line 29 ("all 37 tiles") stays true.
  - No other Gate-A-caused staleness. The Part B C16 caution and the
    "Absence" date are pre-existing and move to Follow-ups.
- **`AGENTS.md`: needed, scoped, only because of CW27's rename.**
  - Line 134: `ALIASES` → `COLLEGE_TILES`.
  - Lines 139–140: "37 rendered tiles including aliases" → "37 rendered tiles
    including the five Strixhaven college tiles".
  - Line 25 ("37-tile atlas") and line 249 ("the unbuilt Mechanics control
    remains disabled") stay true. "unbuilt" is the known, pre-existing
    staleness.

## Owner decisions (implementation)

Recorded 2026-10-02 by `robdev` from the Owner's direction for this session.

1. **Sheet: APPROVED.** The complete 69-row sheet (CW01–CW46, MC01–MC23),
   implemented exactly. No improvised adjacent copy; no new explanatory prose
   to fill space freed by a removal.
2. **"Disorderly Conduct" (CW16): the official article title as a
   player-facing link, with no displayed date.** Not `2005` from the URL, not
   the `Jan 1, 2012` page metadata, and no code comment that pretends to
   establish a date. Link target: the live Wizards article
   `https://magic.wizards.com/en/news/making-magic/disorderly-conduct-2005-12-05`
   (Part B capture). This supersedes both options A and B below.
3. **V11 split slot (MC11): approved, subject to a scratch proof** (Phase 0)
   at every distinct rendered mark size. One mechanic, one W/U/B/R/G
   footprint, one slot per color; both official claims at equal weight; no
   averaging, ranking or silent default. If the split is genuinely illegible
   at a required size: record the blocker, return to `awaiting-decision`,
   stop. Otherwise proceed without another Owner checkpoint.
4. **Internal `ALIASES`: not renamed.** Gate A corrects player-facing meaning
   only. CW27's "`ALIASES` becomes `COLLEGE_TILES`, the `of` field is
   deleted" and the matching `AGENTS.md` edit are withdrawn; the renderer
   stops presenting colleges as alternate names while the internal structure
   stays. Internal naming cleanup is later work (Follow-ups).
5. **Hard boundary:** no `index.html`, shell, merge, state sync, cross-links,
   periodic-table change, removal of the embedded preview Mechanics code,
   Combine-bounce fix, general malformed-hash fix, explorer auto-scroll work,
   data/fixture/tools change, unrelated refactor, or new framework, module or
   build tooling. Anything outside the sheet goes to Follow-ups.

## Implementation (Gate A, `robdev`)

### Phase 0 — scratch proof of the MC11 split slot: PASSED

Scratch only (`make_proof.py` → `proof/vox-color/mechanical-explorer.html`,
`mark_inventory.mjs`, `proof_capture.mjs`, captures in `out/proof/`); never in
the repository. The proof copy is the HEAD explorer plus the MC11 CSS and
markup only.

- **Mark sizes actually rendered** (inventory on the HEAD page, every
  `.sc` at rest, lens W, detail open, search open, A–Z, at all three
  viewports): **12px** search-result strips; **14px** list strips (article
  and A–Z, with and without the best-tier tick); **18px** detail-row icons;
  **20px** key icons (the new "Two placements" definition); **24px** detail
  notation strip (1440 only; `.detail.sheet .dx-notation{display:none}` at
  768 and 360) and the Reach key specimen (no conflict there).
- **Measured, 360 @2x / 768 / 1440:** every one of the three dual slots in
  list (article and A–Z), search, detail row, detail notation and key has the
  same box as its sibling slots (12, 14, 18, 20, 24 px). Each has exactly two
  `.sc-h` children of the full slot size, clipped `inset(0 50% 0 0)` /
  `inset(0 0 0 50%)`, and **no inner `.sc`**. The divider is 1px,
  `--ink-dim`, 10%–90% height. Best tick: full 12px, left half 6px, right
  half 6px. `scrollWidth` = viewport width in every state; no exception, no
  console error. All slots sit under `aria-hidden="true"` (the accessible
  text is carried by the entry name and the detail row text; verified on the
  candidate below).
- **Visual** (zoomed crops, `out/proof/zoom.png`, `strips_small.png`): at
  12px the White exile slot reads filled-left / ring-right, and the Red and
  Black slots read arc-left / half-dot-right; both halves are distinct at
  every size, equal in area and drawn at one scale, and nothing is enlarged.
  Stop rule not triggered.

### Phase 1 — what changed

- **Files:** `vox-color/color-wheel.html`, `vox-color/mechanical-explorer.html`,
  `CLAUDE.md`, `MECHANICS-CONTRACT.md`, `CONTEXT.md`, `HANDOFF.md`. Nothing
  else. `AGENTS.md` untouched (below). No `data/`, `tools/`, fixtures,
  periodic table, `build/`, `reference/`, `docs/`, `PRODUCT-DEFINITION.md`;
  no `index.html`. Edits were applied by asserting scripts (`patch_wheel.py`,
  `patch_explorer.py`, `patch_selftest.py`, scratchpad): every replacement
  matched its exact old text the expected number of times.
- **Wheel, V16 guard:** the `mechanics` branch of `applyRoute` now runs
  `history.replaceState(history.state, '', location.pathname +
  location.search)` and `setMode('explore')`, and returns. It no longer calls
  `enableMechanicsPreview()` or `setMode('mechanics')`. All preview CSS, JS
  and the inline `MCP` stay in the file, unreachable (all 41 wheel diff hunks
  lie outside the preview block). No change to parsing, case, decoding,
  malformed hashes or Combine.
- **Explorer, the projection:** one in-file block after the ported
  functions. It builds two frozen reading views of `MECH` at boot from the
  recorded conflict metadata (`unresolved` = `basis: adjudicated` with a
  `conflict` and an authority that is not the change log: exactly the three;
  the two change-log records keep their frozen, resolved tier in both
  readings). It runs the **unchanged** ported `buckets`/`deltaAdd`/
  `deltaRemove`/`access` over each reading by binding `MECH` for the call,
  and exposes `proj.slot`, `proj.best`, `proj.buckets`, `proj.delta`,
  `proj.categoryOf`. Renderers contain no conflict maths. A code comment
  states the boundary. `access`, `sections`, `buckets`, `deltaAdd`,
  `deltaRemove`, `wubrgSummary`: byte-identical to HEAD (checked).
- **Mechanical additions needed only to render approved rows** (no new
  copy): the split-slot and split-tick CSS (MC11, MC12); `.fig-pair`,
  `.fig-l`, `.lens-dep`, `.step-dep` CSS and the `figPair` renderer for the
  two-count groups (MC14, MC17), which wrap within their row at 360; a
  `.panel-src a` style mirroring the footer link, for the one linked source
  (CW16); a `console.error` and a code comment carrying the developer
  boot guidance removed from the page (MC20).
- **Copy realisation notes (no wording change):** MC06–MC11 use the page's
  curly quotes. The leading "White:" / "Red:" / "Black:" of MC08–MC10 is
  carried by the existing colour mark in the Source note (visible letter
  badge, screen-reader text "White: "), so screen readers hear the approved
  sentence once and nothing is said twice.

### Sheet ledger (69 rows)

**IMPLEMENTED: 69. NOT APPLICABLE: 0. BLOCKED: 0.** Every row was checked
in the rendered page (wheel: 71 states; explorer: 216 entries and the states
below), not only in source.

| IDs | Status | Evidence / note |
|---|---|---|
| CW01–CW04 | IMPLEMENTED | Hero kicker "Interactive diagram"; lede; atlas lede; index "0 colors" … "5 colors" (internal `tier` names unchanged) |
| CW05–CW07 | IMPLEMENTED | Black method (also flows into the computed absent voice and the Black atlas tile); Black cost; Red summary |
| CW08–CW17 | IMPLEMENTED | WU wording + 10 source lines (`PAIR_SRC`) in the Explore allied and conflict drawers. **Also at Combine's 2-color drawer**, which renders the same 15 lines: same approved strings, second render site, no new copy |
| CW16 | IMPLEMENTED (Owner decision 2) | `Rosewater, "Disorderly Conduct," Making Magic — paraphrased`, title linked to the live Wizards URL, no date, no date comment |
| CW18–CW21 | IMPLEMENTED | Boros core; Red and Green second sentences removed; "third framing" gloss removed |
| CW22–CW23 | IMPLEMENTED | Strixhaven scope note; the design note text unchanged, cited by CW22 |
| CW24–CW26 | IMPLEMENTED | Prismari red, Lorehold white and red glosses |
| CW27 | IMPLEMENTED (Owner decision 4) | Tile subline "Enemy · Strixhaven college". The `ALIASES` rename and `of` deletion are withdrawn; structure retained, comments untouched |
| CW28 | IMPLEMENTED (Owner decision 4) | "Streets of New Capenna family in these colors: the Brokers" (×5, both templates) + shard drawer source line. The `aka` field rename is withdrawn |
| CW29–CW30 | IMPLEMENTED | Wedge centre citation; four-color scope note |
| CW31–CW32 | IMPLEMENTED | Community line removed from Explore and Combine; the five `community` fields deleted |
| CW33 | IMPLEMENTED | Crossing paragraph; markers, layer note, absent-voice line unchanged |
| CW34–CW39 | IMPLEMENTED | Five-color body; tile "Every color." (no PLACEHOLDER in any atlas state); five-color drawer citation |
| CW40–CW44 | IMPLEMENTED | Colorless rows and drawer citation |
| CW45 | IMPLEMENTED (preserved) | The five C16 lens statements, commanders and decks unchanged in every four-color state |
| CW46 | IMPLEMENTED | V16 results below |
| MC01–MC05 | IMPLEMENTED | Kicker; Primary and Secondary definitions; key note; detail footer |
| MC06–MC07 | IMPLEMENTED | Resolved disclosures, exact text; mechanism prose not rendered |
| MC08–MC10 | IMPLEMENTED | Dual rows + Source note template; mechanism prose and "This dataset uses …" not rendered |
| MC11 | IMPLEMENTED | Split slot in list (article, A–Z), search, detail row and notation; key definition "Two placements" |
| MC12–MC17 | IMPLEMENTED | Split best tick; entry accessible name; two-count buckets + spotlight; detail line; search lens tier; compass step + dependent-entry line |
| MC18–MC23 | IMPLEMENTED | `relWhy` not rendered (data kept); `#limits` page string; boot text; `#selftest` hidden (still runs, still filled); "recorded for source review" removed; four/five-color naming line |

### Self-test changes (3 assertions; total still 85, 84 run, 85 under reduced motion)

| Line at HEAD | Old name and check | New name and check | Made obsolete by |
|---|---|---|---|
| 1922 | "tiers: all 216 × 5 rendered placements equal the runtime" (every slot's `t-*` equals the frozen tier) | "tiers: the 1077 single slots equal the runtime; the 3 unresolved slots show both official claims": single slots as before; each `.sc.dual` has no `t-*`, left `.sc-h` = `colour_list_says`, right = `ability_catalog_says`; exactly 3 | V11b / MC11 |
| 1924 | "tiers: one footprint for every placement mark" (one computed size over `.strip .sc`) | Same name; same footprint check, plus `.strip .sc` count = 1080, exactly 3 `.sc.dual`, each with two `:scope > .sc-h` and no inner `.sc` | MC11 markup (approved guards) |
| 2069 | "compass: WB − B counts equal the fixture" | "compass: WB − B shows both readings, marked as reading-dependent, one entry once": "no longer placed" = fixture; both readings' buttons present for the two differing categories and no single button; explanations counts = `f2.remove_B`; color-list counts = the projection's; the step's dependent-entry line names graveyard exile; exile is one list entry | V11b / MC17 |

Unchanged and passing: 1944, 1985 (`relWhy` data), 2039 (fixture 02 model
parity), all fixture/recon/frozen-data checks, and the copy regexes (1961,
1964, 1968, 1971, 2011, 2093, 2097, 2120).

### Verification (candidate working tree; scratchpad harness, headless Edge 154)

- **Static:** the four gates exit 0 before and after, with byte-identical
  output ("All invariants hold", "All 53 recon assertions hold");
  `node --check` on both extracted scripts: OK; `git diff --check`: clean;
  envelope: only the six files above; prohibited paths and `AGENTS.md`
  unchanged.
- **Explorer self-test:** 84/84 at load (visible line hidden, text still
  written); 85/85 under reduced motion; 84/84 with Google Fonts blocked and
  with mana-font blocked (`no-mana` set; split halves still fill / ring).
- **Source-text preservation** (`explorer_dump.mjs`, every entry opened, HEAD
  copy vs candidate): rendered labels 216/216, sub-headings and article
  order, explanations 211/211, article aliases 21/21, cited-card links:
  **identical**. Per-entry differences are only MC08–MC10 rows (3), Source
  notes (5), accessible names (3), the footer (216), one unmatched note.
  Part B's data-vs-article check re-run: 211/211 verbatim.
- **V11 oracle** (`oracle.py`, new; reads `data/` and the Part A change-log
  capture; own §4 maths; no page code, no `tools/selection.py`): 31
  selections, 150 steps; reading-dependent: **24/31 selections** (22 by
  bucket counts, 2 by owning colours only: WBRG, WUBRG) and **24/150 steps**
  (the Part A list exactly); W buckets list 61/23/20/112, explanations
  60/24/20/112; WB−B list 50/13/31, explanations 50/14/30. Every entry that
  moves lands in a labelled category. **Rendered page vs oracle
  (`v11_compare.mjs`): 0 failures** over 6,696 entry checks (accessible best
  clause and best-tick halves, all 216 entries × 31 selections), 124 bucket
  counts, 150 steps (single vs paired counts, dependent-entry line), 188
  spotlight lists (each opens exactly its reading's entries, with the
  reading named), 155 detail best-placement lines (5 records × 31), 93
  search lens tiers. Reading-dependent output appears in exactly the oracle's
  24 selections and 24 steps. Invariant outputs carry no conflict messaging
  ("N of 216", identity count, "newly placed", "no longer placed", key
  specimen Reach, every other entry).
- **Split slot, final** (`final_capture.mjs`, `out/final/`): at 360 @2x, 768
  and 1440, every dual slot in key (20), list article and A–Z (14), search
  (12), detail row (18) and notation (24, 1440) matches its siblings' box,
  has two full-size halves, no inner `.sc`, sits under `aria-hidden`; divider
  1px; ticks: full (B under B), left half (W under WB), right half (G under
  WG). Entry widths/heights, strip widths (82px) and detail row widths equal
  HEAD at all three widths. Accessibility tree: the exile entry's name states
  both claims once; 0 dual or half elements exposed.
- **Accessibility:** new or changed readable text ≥ 5.6:1 (`.fig-l`,
  `.lens-dep`, `.step-dep`, conflict tags, key definitions, footer, limits);
  detail line and rows 12.66:1; the wheel's source link 12.66:1 with a 2px
  focus ring; the receded vertex labels' computed styles are identical to
  HEAD (no worse, no new exception). New count buttons take focus with the
  existing 1px gilt ring; Enter opens, Space toggles, as on HEAD.
- **Wheel behaviour** (`wheel_dump.mjs`, 71 states: rest, 5 colors, 5
  alliances, 5 conflicts × 3 views, 5 crossings, 32 Combine sets, atlas,
  hero, footer; HEAD copy vs candidate): mode, hash and preview state
  identical in all 71; all 75 unique text differences map to CW rows above.
- **V16** (`v16_probe.mjs`, `file://` and HTTP, HEAD copy vs candidate): the
  14 Mechanics forms are guarded on both (HEAD: 14/14 activated). Each lands
  in the same state HEAD shows for any other routed non-route hash (Part A's
  Explore at rest), URL = path + query with no `#`
  (`?q=1#mechanics=atlas` → `?q=1`), history length as a plain load, reload
  stays guarded. In-page `hashchange` to three encoded forms: no extra entry
  beyond the assignment, `#lay-mech` stays disabled and inert. `#color=W` →
  `#mechanics=atlas` → `#ally=WU`, 10 Back/Forward steps: no preview, no
  loop, history length constant. The 8 near-miss forms, `''`, `#color=W`,
  `#ally=WU`, `#enemy=WB`, `#four=W`, `#combine=WUR` and the malformed
  `#%E0%A4%A` (still `URIError`, unchanged) behave exactly as on HEAD.
- **Layout:** no horizontal overflow in any captured state at 360 @2x, 768,
  1440. One defect found and fixed during the session: the two-count group
  was `nowrap` and widened the 360 layout viewport to 440; it now wraps, and
  the conflict tag wraps instead of clipping.

### Rule and document edits

- **`CLAUDE.md`:** the Mechanics invariant only.
- **`MECHANICS-CONTRACT.md`:** the two permitted notes (§7 step 7; §1 "The
  standing rule"). Nothing else.
- **`CONTEXT.md`:** the identity-registry paragraph (lines 57–59): colleges
  are Strixhaven factions, not alternate names; the internal `ALIASES` name is
  noted as older and kept. No other line is made false by Gate A.
- **`AGENTS.md`: untouched.** With `ALIASES` kept (Owner decision 4), "37
  rendered tiles including aliases" and the `ALIASES` data-flow line stay
  true; the Mechanics control is still disabled.

### Human checks (not claimed from headless runs)

- `file://` in a headed browser: user hard reload (Ctrl+Shift+R / Ctrl+F5)
  and toolbar Back/Forward on the wheel's deep links, including
  `#mechanics=board`.
- The replacement mechanism from `file://` in a browser other than Chromium
  Edge.
- Legibility of the split slot at 12px on a real 1x display.

## Decisions needed

None open. (Decisions 1 and 2 below were settled by the Owner; see "Owner
decisions (implementation)". Kept for the record.)

1. **"Disorderly Conduct" citation date (CW16).** Wizards' page and banner
   print "Making Magic Jan 1, 2012". The live URL slug is
   `disorderly-conduct-2005-12-05`, and the text is the Ravnica-era guild
   article ("This is the last of the Ravnica guild theme weeks"). No source in
   hand settles it. 2005 is not inferred from the URL.
   - **A.** Cite the visible Wizards date: `Rosewater, "Disorderly Conduct,"
     Making Magic, January 1, 2012 — paraphrased`. It is the page's explicit
     publication metadata.
   - **B.** Cite with no date: `Rosewater, "Disorderly Conduct," Making Magic
     — paraphrased`. The URL and title are kept in a code comment beside the
     citation.
   - **Recommendation: B.** It shows no date that the article's own content
     contradicts, and it invents none.

   This blocks only the CW16 date string; the rest of the sheet does not
   depend on it.

2. **Approve the sheet** (§18.15, stop point 2): rows CW01–CW46 and
   MC01–MC23, the MC11 slot treatment, the self-test adaptations, and the
   listed rule/doc edits. No other choice is open. Source evidence dictates
   everything else.

## Follow-ups

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
