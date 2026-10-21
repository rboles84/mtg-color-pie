# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `qa-passed` — **Story 14: prepare GitHub Pages
  publication (local only).** Re-scoped by the Owner 2026-10-20: prepare
  and verify the exact package locally; Codex publishes afterwards. The
  task ends **locally prepared; publication and live verification
  pending.** Hosting is not complete until the live check passes.
- Last accepted: **Story 12** (cost glyphs centred by their outline),
  `1b2a1d2`, accepted by the Owner 2026-10-11. Ledger:
  `docs/handoff-archive/story-12.md`. Earlier: `story-11.md`, `story-10.md`,
  `story-9.md`, `story-8.md`, `story-7.md`, `story-6.md`, `story-5.md`,
  `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`, `gate-e.md`,
  `gate-d.md`, `gate-c.md`; Gates A and B are in git at `5252333` and
  `b62131b`.
- Next: Codex publishes (see Publication steps); then Story 15 (README,
  LICENSE, NOTICE).
- Owner: Vox Mana.
- Branch: `master`. Base commit: `25e4c5c`.
- Allowed files: `.github/workflows/pages.yml` (new);
  `.github/pages/package.py` (new: allowlist, stamp, verify);
  `index.html` at the repo root (new); `vox-color/index.html` (frame
  loading URLs only); `.gitignore` (`_site/`); `HANDOFF.md`.
- Allowed surfaces: the deploy workflow; the publication package; the site
  entry; the shell's frame loading URLs.
- Prohibited: `data/`, `tools/`, taxonomy, fixtures, recon (frozen;
  copied, never edited); both instruments; the self-test; fonts and
  dependency URLs; visual design; `mechanical-periodic-table.html`.
  Pushing, publishing, GitHub settings, repo rename, DNS, Vox Mana's site.
  Minifying, bundling, crawlers, service workers, versioning of JSON.
- Candidate commit: `c80be0b` (`c80be0b23c67`).
- robqa class (see `.claude/skills/robqa/SKILL.md`): QA-5 (shell
  integration and release) → separate robqa.

## Owner decisions

- **O1 (2026-10-20).** Public repo; GitHub Pages via a GitHub Actions
  workflow publishing only the runtime files.
- **O2 (2026-10-20).** Code licence MIT (Story 15, not this story).
- **O3 (2026-10-20).** Do not publish the periodic table.
- **O4 (2026-10-20, re-scope).** Local preparation only. Codex publishes,
  runs the live check, and adds the Color Pie link below Apocrypha on Vox
  Mana's homepage. No push, settings, rename or DNS in this story.
- **O5 (2026-10-20, re-scope).** Publish by an explicit allowlist, not by
  exclusion. Keep `vox-color/` and sibling `data/`; no flattening.
- **O6 (2026-10-20, re-scope).** Deferred: 404 page, favicon, meta and
  social tags, CSP, fonts, Lighthouse targets, comment removal.

## Technical decisions

- **T1. Package script** `.github/pages/package.py` (stdlib only) holds
  the allowlist, stamps, and verifies. One script serves CI and local
  preview, so both check the same thing.
- **T2. Stamp.** The shell carries `var REV = '';`; the package replaces
  that one string with the revision (CI: first 12 of `GITHUB_SHA`).
  `load(k)` returns `SRC[k]` plus `?v=<rev>` when REV is set. `SRC` stays
  bare, so `frameRoute()`'s pathname comparison is untouched. Unstamped
  source behaves exactly as before. `v` is unused by both instruments (the
  explorer reads only `motion`; the wheel keeps `location.search`).
- **T3. Root entry** uses `location.replace` plus a `<noscript>` refresh
  and a plain link. Pages serves the repo root, so `/` reaches it.
- **T4. Workflow.** `build` (checkout, setup-python 3.12, setup-node 22,
  gate chain, package `--verify`, upload-pages-artifact@v3) → `deploy`
  (deploy-pages@v4) with `needs: build`. No `configure-pages` step: it is
  not needed for upload or deploy and fails before Pages is enabled.
- **T5. Local preview** reuses the existing `static` server: the package
  sits at `/_site/`, which also mimics a Pages project subpath.

## Acceptance criteria

1. **One workflow** on the release branch `master` (push and manual run),
   standard Pages actions; validation (gate chain, `node --check` of every
   shipped inline script, package verification over HTTP) must pass before
   the deploy job can run.
2. **Explicit package.** `_site/` holds exactly: root `index.html`;
   `vox-color/{index.html, color-wheel.html, mechanical-explorer.html,
   mechanical-examples.json}`; `data/{mechanical-color-pie.runtime.json,
   mcp2021.abilities.json}`, the eleven `data/fixtures/*.json`,
   `data/recon/marginal-additions.csv`. Inventory checked against the
   runtime references. Every file other than the stamped shell is
   byte-identical to source. `_site/` is not committed.
3. **Root entry** forwards to `vox-color/index.html` relatively, keeping
   query and hash, with `location.replace` (no Back loop) and a plain-link
   fallback.
4. **Versioned frames.** Every instrument load from the shell uses
   `<file>?v=<rev>`; the canonical names used by `frameRoute()` stay bare.
   Unstamped source loads bare names (behaviour unchanged); the package
   stamps the commit sha. Routes, bridges, focus/inert, share links and
   history unchanged.
5. **Local package verified over HTTP:** resources resolve with expected
   content; excluded files 404; root entry keeps deep-link state; both
   instruments work in the shell; wheel and mechanics deep links; bridges,
   reload, Back/Forward, keyboard and focus; frames load the stamped
   revision; explorer self-check passes at 1440×900.

## Implementation

Base `20fdd16` (ledger re-scope; Story 14 opened at `25e4c5c`), candidate
`c80be0b`. `git diff --stat 20fdd16..c80be0b`:

```
 .github/pages/package.py    | 163 +++
 .github/workflows/pages.yml |  49 +++
 .gitignore                  |   3 +
 index.html                  |  16 +++
 vox-color/index.html        |  14 ++--
 5 files changed, 241 insertions(+), 4 deletions(-)
```

All inside the envelope. No change to `data/`, `tools/`, the instruments,
fonts or dependency URLs.

**Publication inventory (19 files).** `index.html`;
`vox-color/{index.html, color-wheel.html, mechanical-explorer.html,
mechanical-examples.json}`; `data/{mechanical-color-pie.runtime.json,
mcp2021.abilities.json}`; `data/fixtures/01…11*.json`;
`data/recon/marginal-additions.csv`. Checked against the runtime references:
the explorer fetches the two `data/` JSON files, `mechanical-examples.json`,
the eleven fixtures and the CSV; the wheel and shell fetch no local files.

**Developer checks (local, not QA):**
- Gate chain before (base) and after (candidate): all four exit 0.
- `py .github/pages/package.py --rev c80be0b23c67 --verify` → `inventory: 19
  files, byte-identical (shell stamped v=c80be0b23c67)`; `node --check: 3
  inline scripts clean`; `http: 19 paths 200 with expected bytes; 12
  excluded paths 404`; `package: PASS`.
- Browser pane, stamped package at `http://localhost:8000/_site/`, 1440×900,
  pane visible (dev ran with stamp `localtest1`, same code):
  - `/_site/?x=1#mechanical-color-pie/colors=WU` → shell
    `…/vox-color/index.html?x=1#mechanical-color-pie`, explorer selection
    `WU`, frame `mechanical-explorer.html?v=localtest1`.
  - Explorer self-check **84/84**. (83/84 while the pane was hidden at 0×0,
    the known plates-geometry environmental case; unpackaged source gave
    the same 83/84 then.)
  - `/_site/#color-wheel/ally=WU` → wheel frame
    `color-wheel.html?v=localtest1#ally=WU`. In-frame `#enemy=WB` → shell
    URL and nav link follow (route sync works with the query).
  - Nav to Pie pushes one entry, focus `frame-pie`, wheel inert; Back →
    wheel `enemy=WB`, focus `frame-wheel`, pie inert; Forward → Pie.
  - Wheel bridge → Pie with `WB`; explorer bridge
    `index.html#color-wheel/enemy=WB` → wheel at `enemy=WB`; share URL
    resolves to `…/vox-color/index.html#mechanical-color-pie/colors=WB`.
  - Reload on `#color-wheel/enemy=WB` keeps the route with a stamped frame.
  - Keyboard: Tab to the Pie nav link, Enter → Pie shown, focus in frame,
    announcement "Showing Mechanical Color Pie". Console: no errors.
- Not run: workflow YAML lint (no linter installed); the workflow itself
  (runs only on GitHub).

**Expected robqa class:** QA-5, separate.

**Local preview, to reproduce:**
1. `py .github/pages/package.py --rev localtest --verify`
2. `py -m http.server 8000` from the repo root (or the `static` launch
   config).
3. Open `http://localhost:8000/_site/` and deep links such as
   `http://localhost:8000/_site/#mechanical-color-pie/colors=WU`.

## QA

Separate robqa, class QA-5, candidate `c80be0b23c67`, base `20fdd16`. All
evidence is **local** (headless Edge DOM dumps and scripts on
`http://localhost:8000`); nothing here shows public hosting works.

- Binding: `git diff --stat 20fdd16..c80be0b` → 5 files (package.py,
  pages.yml, .gitignore, index.html, vox-color/index.html), all in Allowed
  files; no `data/`, `tools/` or instrument change. `git status --porcelain`
  clean.
- Criterion 4 diff: `load(k)` adds `?v=REV` only when REV is set; used by
  `loadWheel`, `sendColors` (pre-load), `show()` first show and `arrive()`
  plain pie. No other `.src =` in the shell. `frameRoute()` still compares
  bare `SRC.wheel` (line 229). Source has `REV = ''`.
- Gate chain (repo root) → exit 0 (recon 53 assertions hold; source and
  taxonomy PASS).
- `package.py --rev c80be0b23c67 --verify` → 19 files byte-identical,
  `node --check` 3 scripts clean, 19 paths 200, 12 excluded 404, PASS.
  `find _site -type f` lists exactly the 19 files of criterion 2; periodic
  table, reference/, build/, docs, tools, agent files absent.
  `git check-ignore _site/index.html` → ignored.
- Headless Edge DOM dump (local):
  - `/_site/` → wheel src `color-wheel.html?v=c80be0b23c67`, pie `is-off`
    and `inert`, `aria-current` on wheel link, nav hrefs under
    `/_site/vox-color/` (root entry forwarded).
  - `/_site/#color-wheel/ally=WU` → wheel `...?v=c80be0b23c67#ally=WU`,
    pie off and inert.
  - `/_site/#mechanical-color-pie/colors=WU` → pie
    `mechanical-explorer.html?v=c80be0b23c67#colors=WU`, wheel off and
    inert, `aria-current` on pie link, title Mechanical Color Pie.
  - `/_site/?q=1#mechanical-color-pie` → pie shown, stamped src. The query
    itself is not observable in the dump (shell URL not dumped); left to the
    Owner.
  - Unstamped `/vox-color/index.html#color-wheel/ally=WU` → wheel src
    `color-wheel.html#ally=WU`, no `?v`.
- Workflow read: `build` runs checkout, python 3.12, node 22, gate chain,
  package `--verify`, then upload-pages-artifact@v3; `deploy` has
  `needs: build`, environment github-pages, deploy-pages@v4. Triggers push to
  master and workflow_dispatch. Permissions contents read, pages write,
  id-token write. Concurrency group no-cancel.

Findings:
- note: action majors (checkout@v4, setup-python@v5, setup-node@v4,
  upload-pages-artifact@v3, deploy-pages@v4) cannot be verified offline.
- note: workflow YAML never linted or run; first run happens on GitHub.
- note: `?q=1` pass-through not observable in headless DOM dump.
- No blocker, major or minor.

Verdict: **qa-passed.** Every criterion checkable here passes. Remaining gaps
are the interactive browser checks (Back/Forward, bridges, keyboard/focus,
explorer self-check 84/84), which the developer evidenced in a real browser
pane and this environment cannot drive; they are Owner checks, not marked
passed by QA. Public hosting is not claimed.

Owner checklist (first run `py .github/pages/package.py --rev localtest
--verify`, then `py -m http.server 8000` from the repo root):
1. `http://localhost:8000/_site/` → Color Wheel shows; shell URL ends
   `/_site/vox-color/index.html`.
2. `http://localhost:8000/_site/?q=1#mechanical-color-pie` → Pie shows; shell
   URL keeps `?q=1`.
3. Same page, press Back once → leaves the site, no bounce through `/_site/`.
4. `http://localhost:8000/_site/#mechanical-color-pie/colors=WU` → W and U
   selected.
5. `http://localhost:8000/_site/#color-wheel/ally=WU` → wheel on WU ally.
6. Nav Wheel to Pie, Back, Forward → one entry each, focus follows frame.
7. Wheel bridge to Pie, explorer bridge to wheel → colours carry over.
8. Reload on a wheel route → route kept.
9. Keyboard: Tab to Pie link, Enter → Pie shown, focus in frame.
10. DevTools Network → frames request `...html?v=localtest`.
11. Explorer console at 1440x900: `VMX.selftest().filter(t => !t.ok)` → `[]`.
12. `http://localhost:8000/_site/vox-color/mechanical-periodic-table.html` →
   404.

## Publication steps (for Codex)

Not done in this story. In order:
1. Owner settles D1 (repo name). If renaming: GitHub → Settings → General,
   then `git remote set-url origin <new url>`.
2. Push `master` (includes `.github/workflows/pages.yml`).
3. GitHub → Settings → Pages → Build and deployment → Source: **GitHub
   Actions**.
4. Actions → **Pages** → Run workflow on `master` (or the push triggers
   it). `build` must pass before `deploy` runs. If an action major is
   reported deprecated, bump that major only.
5. Public smoke check on `https://rboles84.github.io/<repo>/`:
   - `/` lands on `/vox-color/index.html`, showing the Color Wheel.
   - `/#mechanical-color-pie/colors=WU` → Mechanical Color Pie with W and
     U selected; Back leaves the site (no bounce through `/`).
   - `/#color-wheel/ally=WU` → wheel on the WU ally route.
   - Frame URLs carry `?v=<first 12 of the deployed sha>` (DevTools →
     Network).
   - In the console of the explorer frame, `VMX.selftest().filter(t =>
     !t.ok)` is `[]` at a desktop window size.
   - Wheel bridge → Pie, explorer bridge → wheel, Back/Forward between.
   - `/vox-color/mechanical-periodic-table.html`, `/HANDOFF.md`,
     `/tools/gate.py` return 404.
   - Scryfall card images load; the Fan Content lines are present.
   - A phone-width check of both views.
6. Record the results here; the Owner then accepts. Then add the Color Pie
   link below Apocrypha on Vox Mana's homepage (outside this repo).

## Decisions needed

- **D1. Repo name** (Owner, before publication). The address is
  `rboles84.github.io/<repo>/`; renaming after launch breaks shared links.
  Current: `mtg-visual-helpers`. Nothing in the package depends on it.

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

### Unassigned (each needs its own story)

- **Story 15: README, LICENSE, NOTICE (queued 2026-10-20).** Files:
  `README.md`, `LICENSE` (MIT), `NOTICE.md` (new). README: what it is, live
  link, screenshots, the two instruments, running locally
  (`py -m http.server 8000`), sources and derivation, no AI/ML. NOTICE:
  Wizards Fan Content Policy, Scryfall image terms, mana-font and Google
  Fonts licences. QA-1, same agent.

- **Story 13: "Common needs" panel (parked by the Owner, 2026-10-16).**
  Set up 2026-10-11, never started; D1–D4 still open. Full ledger:
  `docs/handoff-archive/story-13-parked.md`.
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
- **Paused by the Owner:** the Scryfall query idea.
