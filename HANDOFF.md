# Active handoff

Single current-task ledger. Prior Story 14 local-preparation evidence is preserved
in `f54d1ec:HANDOFF.md` (candidate `c80be0b`, separate QA `e8c5ef6`).

## Control

- Status: `qa-passed` - Story 14 publication phase, authorized 2026-10-20.
- Owner: Vox Mana. Branch: `master`. Publication-fix base: `f54d1ec`.
- Last accepted product: Story 12 (`1b2a1d2`); local Story 14 preparation passed QA.
- Outcome: apply the two review corrections and host the current Color Pie on Pages.
- Allowed files: `.github/workflows/pages.yml`, `.github/pages/package.py`, `HANDOFF.md`.
- Allowed operations: update the local origin to the Owner-renamed public repository,
  commit/push `master`, enable Pages with GitHub Actions, and verify public hosting.
- Non-goals: product/layout/routing changes, data/tools/fixtures edits, new runtime
  dependencies, repository/DNS changes, README/LICENSE/NOTICE work, Vox Mana edits.
- Protected: all 19 publication files, the shell and both instruments, frozen data,
  existing deep links, cross-frame bridges, focus/history behavior and self-tests.
- QA class: QA-5 release; separate QA on the committed correction candidate.
- Correction candidate: `3ea5f2445ede0fba9d7315cd37bdd792a2731d57`.

## Owner decisions

- 2026-10-20: Owner renamed the repository to `rboles84/mtg-color-pie` and made it
  public; connector confirmed visibility public and default branch `master`.
- Owner explicitly authorized both review fixes and GitHub Pages publication.
  This supersedes the earlier local-only restriction for this publication phase.
- Continue publishing only the existing 19-file allowlist. Do not publish the
  periodic table. Retain `vox-color/` and sibling `data/`.
- Keep code licensing work (MIT), README and NOTICE in Story 15. Existing deferrals
  stand: 404 page, favicon, metadata/social tags, CSP, fonts and Lighthouse work.
- The Vox Mana homepage link below Apocrypha follows live verification and Owner
  review; it is a separate change in the Vox Mana repository.

## Technical decisions

- Upgrade the five first-party action references to current Node 24-compatible
  releases verified from their official action metadata. The Python 3.12 and
  Node 22 tools used to run the checks remain unchanged.
- Add the root `index.html` to the existing script syntax-check list. No new
  verifier, test framework or product changes.
- Enable Pages source GitHub Actions before pushing. The push triggers publication;
  manually dispatch only if no run starts.

## Acceptance criteria

1. Workflow action references support GitHub's current action runtime; `build`
   still runs the gate chain and package verifier before `deploy` can run.
2. Package verification checks all four shipped inline scripts, including root
   `index.html`, with exactly the unchanged 19-file allowlist and 12 exclusions.
3. Separate QA inspects the exact committed correction candidate and scope.
4. GitHub Pages build and deploy succeed for the pushed candidate on `master`.
5. Public root and wheel/mechanics deep links work below `/mtg-color-pie/`; query
   state survives the root entry and frames use the deployed revision token.
   Check navigation, bridges, reload, Back/Forward, keyboard/focus, and console.
6. Excluded paths return 404; verify the explorer self-check where browser tools
   allow it, loaded example images, and a focused phone-width check.

## Proportionate test plan

- Run the existing package verifier once after the corrections (four scripts,
  inventory and HTTP checks). Inspect diff and whitespace; no viewport matrix.
- The existing gate chain will run in GitHub CI before deployment; data and tools
  are unchanged, so do not duplicate broad regression runs locally.
- Independent QA covers the two corrections; prior product behavior keeps its
  baseline certification. Public browser smoke verifies the hosting boundary.

## Implementation

- `.github/workflows/pages.yml`: five references updated (checkout/setup-python/
  setup-node v7, upload-pages-artifact/deploy-pages v5); five added/five removed
  lines. All declare Node 24 directly or through upload-artifact v7.
- `.github/pages/package.py`: root index added to SCRIPTS; one added/one removed
  line. The 19-file allowlist, verifier logic and runtime bytes are unchanged.
- `HANDOFF.md`: publication envelope, evidence and current Owner decisions;
  earlier detailed evidence remains in `f54d1ec:HANDOFF.md`.
- Local origin now `https://github.com/rboles84/mtg-color-pie.git`.
- `python .github/pages/package.py --rev publishcheck --verify` -> PASS: 19 exact
  files, four scripts syntax-clean, 19 HTTP paths with expected bytes, 12 excluded
  paths return 404. Local Python 3.14; CI uses the existing Python 3.12 selection.
- `git diff --check` -> exit 0; only expected LF/CRLF notices.
- `git ls-remote origin refs/heads/master` -> `12f48625d22e64f391d1bba7492bd74811f18135`;
  this is the existing origin/master baseline. No unrelated remote work observed.
- Gate chain deferred to the already-required GitHub build, since this correction
  does not change the data or tools it protects.
- Separate QA uses an available Codex agent; Claude Sonnet is not available in
  this host. Independence and the repository QA criteria remain required.

## QA

Separate QA-5 agent PASS at `3ea5f2445ede0fba9d7315cd37bdd792a2731d57`, base
`f54d1ec`. Available Codex model used; Claude Sonnet unavailable.

- Candidate diff: only the two publishing files and this ledger, within envelope;
  `git diff --check` passed. Runtime source files unchanged from the prior base.
- Workflow ordering and `needs: build` verified; official upgraded actions support
  Node 24. Existing Python 3.12/Node 22 check tools retained.
- `python .github/pages/package.py --rev 3ea5f2445ede --verify` -> PASS: exactly
  19 expected files, four inline scripts syntax-clean (including root entry),
  19 correct HTTP responses and 12 excluded paths return 404.
- Clean tracked tree; generated `_site/` ignored. No blocker/major/minor findings.
- This verdict covers local corrections only; public hosting is checked below.

## Publication

- Owner confirmed Pages source is now GitHub Actions (2026-10-20).
- Next: push this ledger and the QA-passed correction, observe build/deploy, then
  verify `https://rboles84.github.io/mtg-color-pie/`.

## Owner review

After live checks, confirm the published Color Pie looks as intended. Standalone
`file://` history remains a prior Owner check and is unaffected by these fixes.

## Decisions needed

None. Repository name/public visibility and publication are authorized.

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
