# Active handoff

## Control

- Status: `qa-passed`.
- Owner: Vox Mana. Branch: `master`. Base: `fe828ae2be4a02277941f710dad19b304f5d47f3`.
- Candidate: `e013149585ada761313e6717840a1ff67b865b1c`.
- Outcome: host The Color Pie shell at the clean site root for `colorpie.voxmana.io`,
  without exposing `/vox-color/index.html` as the canonical entry.
- Allowed files: `index.html`, `vox-color/index.html`, `vox-color/color-wheel.html`,
  `vox-color/mechanical-explorer.html`, `.github/pages/package.py`, `AGENTS.md`,
  `CONTEXT.md`, `PRODUCT-DEFINITION.md`, `HANDOFF.md`.
- Non-goals: DNS/GitHub Pages settings, CNAME, Vox Mana changes, data/tools/fixtures,
  new dependencies/frameworks/APIs, visual redesign, instrument refactors, new shell
  wrappers, and Owner acceptance or independent QA.
- Protected: exact frame isolation, history/focus/inert behavior, revision stamping,
  existing instrument routes and local-file support, `../data/` resolution, legacy
  shared deep links, and the exact package allowlist.
- QA class: QA-5 shell/release; separate independent RobQA on the committed candidate.

## Owner decisions

- 2026-10-20: the user authorized clean-root Color Pie hosting and a separate Vox
  Mana homepage link. DNS, GitHub settings, browser QA and push stay with the coordinator.
- Keep the existing 19-file Pages allowlist and no CNAME file; the custom domain is
  configured outside this repository.

## Technical decisions

- Root `index.html` becomes the one authoritative shell, retaining the two persistent
  same-origin frames. `vox-color/index.html` becomes only a relative `replace()` to
  `../index.html`, preserving query and hash for old links at either deployment base
  path. HTTP `index.html` requests replace to `./`; file URLs retain that filename.
- Frame paths are document-relative (`vox-color/...`); standalone bridges and generated
  share links use `../index.html`. Package stamping moves to root while its file
  allowlist remains unchanged.

## Acceptance criteria

1. Root `/` is the canonical shell, with both frames loading and revision-stamped.
2. `vox-color/index.html` redirects to `../index.html`, preserving query/hash and
   adding no history entry; HTTP root `index.html` canonically replaces to `./`; direct
   instrument documents still work.
3. Wheel/explorer bridges and explorer copied share URLs resolve to canonical root
   routes from standalone documents and keep their in-shell behavior.
4. Package verification stamps root shell, syntax-checks all four shipped scripts,
   and retains exactly its 19-file allowlist and exclusions.
5. Documentation names root as canonical and old shell URL as legacy.

## Proportionate test plan

- Inspect final diff/stat/status and whitespace. Run the package verifier once with a
  bounded `_site` path under this repository. No data/tools gate chain: they are unchanged.
- Independent RobQA and coordinator browser journeys cover routing, history, focus and
  public hosting.

## Implementation

- Root `index.html` now contains the unchanged shell behavior with frame sources
  relocated to `vox-color/`; `vox-color/index.html` is a minimal legacy replace to the
  actual root filename. HTTP direct root filenames replace to the clean directory URL;
  file URLs retain `index.html`. Wheel/explorer standalone bridge and copied-share
  targets now resolve to root. Package revision stamping targets root; its 19-file
  allowlist is unchanged.
- Updated the three location-contract documents and retained the completed Story 14
  ledger below this task's active packet.
- Developer verification: `python .github\\pages\\package.py --rev cleanroot --out
  C:\\dev\\color-wheel-interactive\\_site-cleanroot --verify` → PASS: 19 exact files,
  four inline scripts syntax-clean, 19 HTTP paths with expected bytes, 12 excluded
  paths 404. `node -e` URL-resolution check → canonical frame and bridge URLs resolve
  under both `https://colorpie.voxmana.io/` and the GitHub project subpath.
- No data, mechanics, tools, or workflow changed; the broader gate chain is not
  proportionate. Final Git diff/stat/status review is confined to the nine allowed
  files; `git diff --check` passed (only expected LF/CRLF notices).

## QA

Verdict: `qa-passed` for the exact local engineering candidate
`e013149585ada761313e6717840a1ff67b865b1c` over base
`fe828ae2be4a02277941f710dad19b304f5d47f3`. Separate QA-5 RobQA used the
available Codex Sol medium route; the repository-preferred Claude Sonnet route is not
available on this host. Public HTTPS publication and Owner acceptance remain separate.

Independent source and package evidence:

- `git diff --stat fe828ae2be4a02277941f710dad19b304f5d47f3..e013149585ada761313e6717840a1ff67b865b1c`
  → nine allowed paths, 498 insertions and 404 deletions; no path escaped the declared
  envelope. `git diff --check` on the same range → exit 0.
- `git diff --quiet e013149585ada761313e6717840a1ff67b865b1c..HEAD --` across the
  eight material/document paths → exact match; only the later handoff-evidence commit
  differs from the frozen candidate.
- `python .github\pages\package.py --rev e013149585ada761313e6717840a1ff67b865b1c
  --out C:\dev\color-wheel-interactive\_site-qa-cleanroot-e013149 --verify` → PASS:
  exactly 19 allowlisted files, root shell stamped with the full candidate, four inline
  scripts syntax-clean, 19 HTTP paths returned expected bytes, and 12 exclusions 404.
  The absolute output was confirmed inside the repository and absent before the run;
  it was removed afterward and final `git status --short --branch --untracked-files=all`
  showed only `master...origin/master [ahead 2]`.
- Static `System.Uri` resolution from `https://colorpie.voxmana.io/` and
  `https://rboles84.github.io/mtg-color-pie/` → frames stayed below each deployment
  base; legacy, wheel/explorer bridge and copied-share targets resolved through that
  base's root `index.html`; `frameRoute()`'s `vox-color/color-wheel.html` suffix matched
  in both forms. Source inspection confirmed the same relative targets.
- The broader data/tools gate chain was not rerun: no data, mechanics, fixtures,
  selection semantics or producer changed, and the package verifier exercises the
  changed release boundary. This satisfies the RobQA cost gate.

Coordinator-attributed Chromium evidence on an independently rebuilt, verifier-PASS
package stamped with the full candidate:

- Nested base `http://127.0.0.1:51121/_site/`: an arrival at
  `?q=1#mechanical-color-pie/colors=WU` consumed the colour arrival into the bare pie
  route, retained `?q=1`, showed Azorius / White–Blue / WU, reported self-check 84/84,
  and loaded the stamped explorer frame. The inactive wheel was inert, hidden and
  still lazy-unloaded.
- Pie→Wheel and Wheel→Pie controls produced root shell routes, preserved the query,
  showed the expected White & Blue state, kept candidate-stamped frame URLs, and
  focused the active frame. Enter on the shell nav, Back, Forward and reload retained
  the expected view, route, active/off state and revision.
- `/_site/index.html?keep=1#color-wheel/ally=WU` replaced to the clean directory URL.
  The legacy `/_site/vox-color/index.html?legacy=1#mechanical-color-pie/colors=WU`
  preserved query and state, then Back returned directly to the earlier clean-root
  wheel entry without a legacy or `index.html` bounce.
- Standalone HTTP wheel and explorer documents loaded their existing states and data.
  Their actual bridge controls returned to nested-root shell routes. The explorer's
  Copy link produced
  `http://127.0.0.1:51121/_site/index.html#mechanical-color-pie/colors=WU`, which the
  shell canonicalizes on arrival.
- True-root `http://127.0.0.1:51122/` repeated direct `index.html` and legacy replace
  behavior with query/hash preservation and no Back bounce. The actual wheel Clear
  control synchronized the shell from `#color-wheel/ally=WU` to `/?keep=1`, proving
  prefixed frame-path recognition. Enter on Mechanical Color Pie focused `frame-pie`;
  DOM state was wheel `inert=true` / off and pie `inert=false` / active.
- The known source-less `MutationObserver.observe` TypeError appeared again on shell
  loads. It has no source or stack, the changed code adds no observer, standalone and
  functional checks passed, and there is no changed causal evidence; attribution
  remains unavailable. An attempted unrelated SVG activation locator timed out, so no
  geometry claim is made from it; route sync was instead proved with the actual Clear
  control.

Findings: no blocker, major or minor defect. The source-less console message is a note,
not evidence of a candidate regression.

Owner checklist:

1. Open the published `https://colorpie.voxmana.io/` and confirm certificate, clean-root
   address, both views, candidate revision and no hosting-only failures.
2. Judge the shell and both instruments at the Owner's preferred desktop and phone
   sizes; appearance, spacing and motion remain Owner decisions.
3. From standalone `file://` wheel and explorer pages, use the changed bridge/share
   paths and confirm root `index.html` opens; perform the policy-assigned hard reload
   and Back/Forward check.
4. After accepting this candidate, review the separate Vox Mana homepage-link change;
   it is outside this repository and this QA verdict.

## Clean-root publication

- Coordinator: /root. The Owner explicitly requested setup and hosting at
  `colorpie.voxmana.io` plus the separate Vox Mana homepage entry on 2026-10-20.
- Owner confirmed the GitHub Pages custom-domain setting and Porkbun CNAME setup.
  Public DNS resolves `colorpie.voxmana.io` to `rboles84.github.io`.
- Independent engineering QA passed material candidate `e013149585ada761313e6717840a1ff67b865b1c`.
  Coordinator is publishing that unchanged material candidate with its ledger evidence.
  Public deployment, HTTPS provisioning and live smoke remain pending.

## Archived Story 14 publication ledger

The completed ledger follows verbatim for repository-local preservation. Git history
remains its archive: `fe828ae2be4a02277941f710dad19b304f5d47f3:HANDOFF.md`.

# Story 14 publication ledger

## Control

- Status: `qa-passed` - Story 14 published and live-verified; Owner visual review pending.
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

- Public site: https://rboles84.github.io/mtg-color-pie/
- Owner enabled Pages source GitHub Actions, then Codex pushed `master`.
- Deployed commit: `92d91c1036223911057f8f752685e7331c221aaa` (only ledger changed
  after correction candidate `3ea5f24`). Frame revision: `92d91c103622`.
- Workflow: https://github.com/rboles84/mtg-color-pie/actions/runs/39537989625
  Build job `119018991151` and deploy job `119019051839`: completed/success.
- CI source, taxonomy and fixture gates PASS; all 53 recon assertions hold.
  Package: 19 exact files, four syntax-clean scripts, 19 HTTP paths correct,
  12 excluded paths 404; all upgraded actions executed successfully.
- Public HTTP verification: all 19 files match `git show 92d91c1:<path>` byte for
  byte, except the expected shell revision stamp. Periodic table, HANDOFF.md
  and tools/gate.py return 404 from the Pages site.
- Live Chromium browser at 1440x900: root forwards to `/vox-color/index.html`;
  `/?q=1#mechanical-color-pie/colors=WU` keeps `?q=1` and selects White/Blue.
  The arrival color hash is consumed as designed; Back skips the root redirect.
- Public `/#color-wheel/ally=WU`, including reload: White & Blue panel and stamped
  wheel frame. Mechanics-to-wheel and wheel-to-mechanics bridges carry WU.
  Nav, Enter activation, Back and Forward select the correct view, focus the
  active frame and leave the inactive frame inert. Both frames carry the revision.
- Explorer self-check: 84/84 at desktop; also 84/84 in the 360x800 smoke check.
  Both phone views render with no document horizontal overflow (shell 360px,
  frame content 345px). Visual judgement remains the Owner's.
- Flying entry loads its Wind Drake example from Scryfall (complete, naturalWidth
  488px); both Fan Content notices present.
- Console note: the Codex in-app shell captured a source-less MutationObserver
  `observe` TypeError. A fresh standalone wheel tab had no warnings/errors.
  Separate QA inspected the sole application observer: a null panel would fail
  earlier at addEventListener, while downstream routing/bridges demonstrably run.
  Attribution is unavailable; all functional smoke checks passed. Do not claim a
  fully clean shell console or change product code based on this untraced message.
- This final evidence-only commit uses `[skip ci]`; it does not change the
  deployed runtime or trigger a second deployment just to publish this ledger.

## Owner review

Confirm the published Color Pie looks as intended before the separate Vox Mana link change. Standalone
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
