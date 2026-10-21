# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `dev-in-progress` — **Story 14: prepare GitHub Pages
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
- Candidate commit:
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

## QA

## Publication steps (for Codex)

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
