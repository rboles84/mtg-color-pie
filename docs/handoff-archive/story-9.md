# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `accepted` — **Story 9: small UI fixes and housekeeping.**
  `30f9a08`, accepted by the Owner 2026-10-11.
- Last accepted: **Story 8** (gate entry point, mana-font fallback,
  cleanups), `689bb08`, accepted by the Owner 2026-10-10. Ledger:
  `docs/handoff-archive/story-8.md`. Earlier: `story-7.md`, `story-6.md`,
  `story-5.md`, `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`,
  `gate-e.md`, `gate-d.md`, `gate-c.md`; Gates A and B are in git at
  `5252333` and `b62131b`.
- Next: (archived)
- Owner: Vox Mana.
- Allowed files: `vox-color/mechanical-explorer.html` (focus-outline CSS,
  the code that builds the doubled-period accessible name, and the
  post-load scroll if it reproduces); `vox-color/color-wheel.html`
  (`.panel` max-height and `scrollbar-gutter` CSS only); `.gitignore`;
  `HANDOFF.md`.
- Allowed surfaces: explorer focus rings and entry accessible names;
  wheel panel height and scrollbar gutter; explorer scroll position after
  load.
- Prohibited: `data/`, the taxonomy, fixtures, recon truth; every `tools/`
  file; `vox-color/index.html`; `runSelfTest` and its helpers (if a fix
  would change a self-test expectation, stop and ask);
  `vox-color/mechanical-examples.json`; the `ALIASES` and `aka` names
  (deferred, see Owner decisions); `PRODUCT-DEFINITION.md`.
- Base commit: `edebe40`.
- Candidate commit: `30f9a08`.
- robqa class (see `.claude/skills/robqa/SKILL.md`): expected QA-2 (CSS
  and one string fix across two pages, one ignore rule), same agent.

## Owner decisions

- Bundle: Unassigned "Small UI items" (all five), "Commit or gitignore
  `docs/DATA-DOSSIER.html`", and the "Gate A process notes" (Owner,
  2026-10-10).
- `docs/DATA-DOSSIER.html` is gitignored, not committed. The file stays on
  disk.
- The `ALIASES` / `aka` rename is **deferred** to the "Recon names vs
  today's wheel" story: `tools/recon.py` and `tools/recon_stats.py` parse
  those names from the wheel source, and that story reopens recon anyway.
- The Gate A process notes (R6-N4 to N6) are **retired**: Gate A is closed
  and their target, `PRODUCT-DEFINITION.md`, is not edited by later gates.
  Detail stays in `docs/handoff-archive/gate-c.md` ~line 969.

## Acceptance criteria

1. **Accessible name.** No explorer entry's accessible name contains a
   doubled period ("..", other than a real ellipsis); measured across all
   216 entries in the browser. The visible text is unchanged.
2. **Focus outline.** The explorer's 1.5 px focus outlines render as a
   visible, even ring at 1x (e.g. 2 px, or a value that does not round
   down to 1 px); measured computed width. Colour and offset unchanged.
3. **`.panel` max-height.** The wheel's panel no longer relies on the
   hard-coded `calc(100vh - 180px)` alone: at 1440×900 and 1280×720 the
   panel's content is reachable (scrolls inside or fits), and the mobile
   rule at line ~388 still applies. Measure panel height and overflow at
   both sizes.
4. **Scrollbar gutter.** `scrollbar-gutter:stable` is back on the wheel;
   switching between a short and a long view causes no horizontal layout
   shift (measure a fixed element's x before and after).
5. **Post-load scroll.** In a headed browser at 1440×900, load the
   explorer fresh: record `scrollY` and the focused element after ~2 s. If
   it stays at 0, record "not reproduced" and change nothing. If it
   scrolls, fix it at its source without touching the self-test, or stop
   and ask if the cause is in the self-test.
6. **Dossier.** `docs/DATA-DOSSIER.html` is in `.gitignore`;
   `git status` no longer lists it; the file is still on disk.
7. Self-checks unchanged (explorer 84/84 at 1440×900); `node --check` on
   the wheel's extracted script.
8. On commit, remove "Small UI items" and the dossier line from
   Follow-ups.

## Implementation

Changed files (`30f9a08`, +22/−17):
- `vox-color/mechanical-explorer.html` (16/16): 15 `outline:1.5px` focus
  rules → `2px`; the entry aria-label head (label, qual, tag) drops one
  trailing period (lookbehind keeps a real "...") before `. `.
- `vox-color/color-wheel.html` (+3/−1): `.panel` keeps the `vh` cap as a
  fallback, then `max-height:max(420px, calc(100dvh - 180px))`;
  `scrollbar-gutter:stable` added back on `.panel` (where `3a4d951` had it).
- `.gitignore` (+3): `docs/DATA-DOSSIER.html`. The file was already tracked
  (since `55c391e`), so it was also untracked with `git rm --cached`; it is
  still on disk and `tools/build_dossier.py` regenerates it.

Criteria → evidence (in-app browser, measured):
1. 36 of 216 names had ".." before; 0 of 216 after (hard reload). Example:
   "…graveyard/exile. White none, …". Visible text unchanged.
2. Keyboard-focused `.ent` (`:focus-visible` true): computed outline
   `2px solid rgb(220,187,115)`, offset `1px` (unchanged colour/offset).
   All 16 focus-visible outline rules read 2px.
3. 1440×900: panel 420 (rest) → 720 capped, content 1189, scrolls inside.
   1280×720: 540 capped, content 1189, scrollTop reaches the end.
   375 wide: `max-height:none`, `min-height:0`, `overflow-y:visible` (the
   mobile rule still wins).
4. Gutter `stable`; panel kicker right edge 1275 (1440) / 1187 (1280) in
   both the short rest view and the long `#enemy=WB` view: no shift.
5. Fresh load at 1440×900 (new URL, no restore): after 2 s `scrollY` 0,
   focus on `#list`. **Not reproduced**; no change made.
6. Ignore rule in place; `git status` clean; file on disk.
7. Explorer self-check 84 of 84 at 1440×900; `node --check` on the wheel's
   extracted script: OK. Gate chain not run (no data/mechanics/tools touched).

Judgement call for the Owner: criterion 3's "not the hard-coded calc alone"
is met by `dvh` plus an explicit floor; the 180 px offset itself is kept
(no sticky header to measure against; the panel sits ~419 px down the
page). A sticky panel would be a separate change.

Draft Owner checklist (server: `py -m http.server 8000` in the repo root):
- http://localhost:8000/vox-color/color-wheel.html — click White, then an
  enemy pair: the panel's text does not jump sideways when its scrollbar
  appears; the gutter is reserved even on the short view (looks OK?).
- http://localhost:8000/vox-color/mechanical-explorer.html — Tab into the
  entry list: the focus ring is an even 2 px gilt ring.
- `file://` hard reload and back/forward on both pages (human-only check).

## QA

Same agent, QA-2. Visual check in the in-app browser (2026-10-10): wheel
panel at rest and on `#enemy=WB` at 1440×900, no sideways shift, gilt thumb
in the reserved gutter; explorer entry focus ring even and solid at 1:1
(800×820). Owner checked `index.html` over HTTP: Blue → "View these colors
in the Mechanical Color Pie" lands correctly. Opening the shell from
`file://` shows the explorer's data-load error; expected (it needs HTTP,
`PRODUCT-DEFINITION.md` §17). The Owner does not open it from disk, so no
follow-up.

## Decisions needed

None open.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### From Story 6

- **`sfGet` pacing.** It waits 110 ms between calls, while Scryfall's
  `/cards/named` allows 2 per second. Not fixed (out of scope).
- **Browser pane at 0×0.** In a hidden pane the self-check reports 83 of 84
  (the plates fold-control geometry check); at 1440×900 it is 84 of 84,
  before and after Story 6. Environmental, not a regression.

### Accepted minors

- **F4 (B13, D-O2).** Leaving the Mechanical Color Pie during its first load
  lets its self-test take focus in the off frame for about 8–12 ms. A fix
  would touch the protected self-test.
- **B12 (E-D1 A).** A bridge from the explorer into an already-loaded wheel
  costs two history entries; Back passes once through the prior wheel route.
  Step 0 of Gate E measured that it cannot be fixed within `src` and hash.

### When ready to host (Owner, 2026-10-08)

Parked until the Owner is ready to deploy; pick up as one story then.
- **Stale frames after an update.** A browser can keep serving
  a cached instrument inside the shell's frame after the file changes; the
  shell's own hard reload does not refresh it (seen in the Owner's E2 QA).
  Before hosting, version the frame URLs or set cache headers.

### Unassigned (each needs its own story)

- **Recon names vs today's wheel (Story 2, D4).** Includes the deferred
  `ALIASES` / `aka` rename (the recon tools parse those names).
  Regenerating recon against the current `color-wheel.html` drops the Nephilim and community
  names from 10 rows, puts the C16 lens "Chaos" on URG and "Orzhov" on
  Non-Red. Recon is pinned to `96ae609`'s wheel until this is resolved.
- **Article input not archived.** Only its sha256 is recorded (copyright);
  a future fetch may differ.
- **Housekeeping.**
  - **Periodic table: keep as-is (Owner, 2026-10-08).**
    `vox-color/mechanical-periodic-table.html` stays in place and unchanged,
    preserved for possible future work on its look and feel. The earlier
    idea to move it to a prototypes folder and restyle it is dropped.
    Record Three.js in `CONTEXT.md` only if it is ever taken into the
    product.
- **Example cards: done in Story 6** (`c3b33d1`); 214 of 216 entries show
  one. Entries 213 and 214 stay without one. A three-card chooser is an
  unscheduled idea.
- **Sourced flavour lines per colour (Owner, 2026-10-08).** Official sources
  only (Rosewater articles, magic.wizards.com); anything unsourced is left
  out. Backlog; needs recon and its own story.
- **"What can my colours do" panel (Owner, 2026-10-08).** Players set their
  colours in the existing Colors bar (no deck import for now). Design note
  still to write: what the panel recommends, how, and why. Category counts
  only, no scores.
- **Share link and PNG card for a colour selection (Owner, 2026-10-08).**
  URL is the existing hash route plus `colors=`; image is a canvas card with
  colour name, count and source line.
- **Ring legibility (Owner, 2026-10-08).** "No placement" rings are now
  dashed in the explorer (`.sc.t-n`, uncommitted). Black stays `#aca29a`
  (mana-font's own black); revisit only if it still blends in. Open: gilt
  selection rings sit near W and R.
- **Paused by the Owner:** the Scryfall query idea.
