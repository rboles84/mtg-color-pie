# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `ready` — **Story 14: publish on GitHub Pages.** Set up
  2026-10-20; not started.
- Last accepted: **Story 12** (cost glyphs centred by their outline),
  `1b2a1d2`, accepted by the Owner 2026-10-11. Ledger:
  `docs/handoff-archive/story-12.md`. Earlier: `story-11.md`, `story-10.md`,
  `story-9.md`, `story-8.md`, `story-7.md`, `story-6.md`, `story-5.md`,
  `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`, `gate-e.md`,
  `gate-d.md`, `gate-c.md`; Gates A and B are in git at `5252333` and
  `b62131b`.
- Next: Story 15 (README, LICENSE, NOTICE), docs only. Can run before or
  after Story 14; it touches none of Story 14's files except as listed there.
- Owner: Vox Mana.
- Allowed files: `.github/workflows/pages.yml` (new); `index.html` and
  `404.html` at the repo root (new); `vox-color/favicon.svg` (new);
  `vox-color/index.html` (frame version token, `<head>` meta and favicon
  link); `vox-color/color-wheel.html` and `vox-color/mechanical-explorer.html`
  (`<head>` meta and favicon link, and dev-server comments only);
  `HANDOFF.md`.
- Allowed surfaces: the deploy; the site entry; the shell's frame `src`
  (version query only); page `<head>`s.
- Prohibited: `data/`, `tools/`, the taxonomy, fixtures, recon (frozen
  source layer; the deploy copies them, never edits them). Any self-test
  assertion or the self-test's run condition (`PRODUCT-DEFINITION.md` §415:
  it keeps running for QA). `vox-color/mechanical-periodic-table.html`.
  Minifying, bundling or any transformation other than the version stamp.
- Base commit: `168d578`.
- Candidate commit:
- robqa class (see `.claude/skills/robqa/SKILL.md`): QA-4 (touches the
  shell's frame `src`, which is cross-frame integration) → separate robqa,
  then Owner checks on the live URL.

## Owner decisions

- **O1 (2026-10-20).** Host on GitHub Pages from a **public** repo; the
  deploy is a GitHub Actions workflow publishing only the runtime files.
- **O2 (2026-10-20).** Code licence **MIT** (Story 15). Wizards content and
  Scryfall images are attributed in a NOTICE, not covered by MIT.
- **O3 (2026-10-20).** **Do not publish** the periodic table (it stays in
  the repo, unchanged, per the 2026-10-08 housekeeping decision).
- **O4 (2026-10-20).** The workflow copies files and stamps one version
  token; it is not a build step. The Color Wheel still runs from `file://`.
- **O5 (2026-10-20).** Publish the fixtures and recon CSV (21 KB) so the
  explorer's self-test passes on the live site. No self-test code changes.
- **O6 (2026-10-20).** No content-security policy, no `robots.txt`, no
  self-hosted fonts in this story (red-team: low value, high breakage).
  Fonts are a follow-up only if Lighthouse flags them.

## Acceptance criteria

1. **Gates in CI.** On push to `master` (and manual run) the workflow runs
   the full gate chain and `node --check` on each instrument's extracted
   script; any failure stops the deploy.
2. **Published by exclusion.** `_site/` holds `vox-color/` minus `build/`,
   `reference/` and `mechanical-periodic-table.html`; `data/` holds
   `mechanical-color-pie.runtime.json`, `mcp2021.abilities.json`,
   `fixtures/` and `recon/marginal-additions.csv`, nothing else; root
   `index.html` and `404.html`. No `tools/`, `docs/`, `.claude/`, Markdown
   or agent files are served.
3. **Path check.** The workflow serves `_site/` locally and requests every
   path the shell and both instruments load; a missing file fails the
   deploy.
4. **Entry keeps the hash.** Root `index.html` forwards to
   `vox-color/index.html` with `location.hash` intact (script, with a
   plain link fallback); `/#mechanical-color-pie/colors=WU` lands on that
   route.
5. **Stale frames fixed** (hosting follow-up, 2026-10-08). The shell loads
   each instrument as `<file>.html?v=<token>`; locally the token is `dev`,
   the workflow stamps the commit sha. Hash routing, bridges, share links
   and Back/Forward behave as before.
6. **Head.** Each served page has a description, Open Graph and Twitter
   card tags, and the favicon. No visible change to any page.
7. **Dev comments.** Comments naming `localhost:8000` or the dev server are
   removed from served files, except developer notes the self-test or
   `bootFail` messages rely on.
8. **Live check (Owner).** On the Pages URL: shell switching, deep links,
   bridges both ways, Back/Forward, phone width, Scryfall images, explorer
   self-check passes (console or `VMX.selftest()`), Fan Content lines
   present, Lighthouse phone and desktop recorded here.
9. Gates pass before and after; self-check unchanged at 1440×900.

## Implementation

## QA

## Decisions needed

- **D1. Repo name** (Owner, before go-live). The address is
  `rboles84.github.io/<repo>/`; renaming after launch breaks shared links.
  Current: `mtg-visual-helpers`. Development can start without it (all
  paths are relative); the live check (AC 8) waits for it.
- **Owner one-time step:** repo Settings → Pages → Source: "GitHub
  Actions". Needed before the first deploy.

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
