# Active handoff — complete A–Z and supplemental typography

## Control and prior disposition

- Status: `ready-for-qa` (`dev-in-progress -> ready-for-qa`).
- Owner direction: expand A–Z to all587 distinct entries; Article remains2021-only; supplemental rankings remain unassigned and excluded from every calculation. Correct the reported decorative initials on supplemental rule numbers and the placement notice; verify existing displayed facts against pinned records. Build/test locally, no publishing.
- Prior search-only engineering phase: `qa-passed -> complete -> idle`, closed administratively by coordinator as superseded scope, NOT Owner visual acceptance. Full prior ledger retained at `63fc313f2ff72c7f03a542e90e5e938ebe817861:HANDOFF.md`. This revision starts `idle -> dev-in-progress`; earlier appearance/standalone file checks remain unaccepted. Existing branch is reused.
- Revision base: `63fc313f2ff72c7f03a542e90e5e938ebe817861`; branch: `codex/supplemental-mechanic-search`. Original transfer material candidate `67c603d029eefcc0e7d6fe4d63b03f998a203cd5` remains the unchanged data authority for this UI revision.
- Exact allowed files: `vox-color/mechanical-explorer.html`, `tools/check_supplement_browser.mjs`, `HANDOFF.md`.
- Allowed surfaces: complete A–Z browse keys/buttons/order, view-specific count/scope copy, supplemental row states under search/lenses/spotlights, existing detail selection/focus across view changes and asynchronous load, supplemental-only typography, targeted browser checks and ledger.
- Non-goals: any payload, transfer manifest/snapshot/producer, source/query, 2021 source/runtime/taxonomy/fixtures/recon, mapping or ranking changes; new mechanic prose/research; routes/shell/wheel/package allowlist changes; fonts/color/type-role redesign; new dependency; push/merge/publication/deployment/hosting.
- Generated output only: existing `_site-supplement/` package (untracked) and OS-temp browser evidence. Existing localhost8016 review server remains local-only.
- QA class: QA-4, separate QA agent after committed candidate; available explicit Codex route because prescribed Claude models unavailable.

## Acceptance criteria

1. A–Z lists exactly587 unique destinations:216 original +371 supplemental. The19 source mappings stay combined with existing entries; alphabetical ordering is consistent. Article remains212 article entries+4 list-only=216.
2. Brief A–Z scope line states587 total/216 from2021/371 supplemental; existing placement counts are explicitly2021. Supplemental rows carry Supplemental/Rankings unassigned, no blank color strip, no inferred tiers, no dimming/hiding merely for unknown ranking under active color lenses. Existing2021 calculations remain byte-for-byte in data and behavior-equivalent.
3. Mouse/keyboard browse opens the single detail owner; closing returns to the applicable list item or search, never a detached/hidden element. Switching Article/A–Z and initial asynchronous supplemental load works. Search/exact matches/overflow and mapped evidence remain functional.
4. Training's702.149a/b/c and unassigned-placement notice use normal text with intact rule numbering, no decorative first-letter float. Existing2021 explanation initials remain unchanged. Pinned trusted wording, citations and qualifications remain exact; check Training against transfer/source and do not generate explanations.
5. Missing/malformed supplement still leaves the216-entry2021 application usable with accessible unavailable notice. Existing84 selfchecks, required mechanics gates and package checks pass. Tests cover all A–Z destinations/count/order, lens/maths isolation, focus/view switching, styling and responsive readability at a targeted narrow width and desktop. Owner judges appearance.
6. Identifiable committed local candidate, independent QA evidence and short Owner checklist; no publishing.

## Test plan

Baseline/final mechanics gate chain per repository; transfer --check confirms frozen target/source data. Extend existing focused browser harness (no new dependency) with A–Z587/Article216, unique keys/alphabetical order, all371 supplemental row states, selected detail/focus return and view switches, late loading, CSS first-letter computed-style checks and exact Training source text. Run source and full-revision local packaged candidate over real Edge HTTP, retain original780 search checks and failure cases. Package remains20 files/17 exclusions. No unrelated regression suite/research.

## Decisions needed

None. Owner explicitly superseded the earlier A–Z exclusion and authorized this typography correction. No data or new model is required.

## Implementation / QA

Pending. Prior independent certification applies only to the unchanged baseline; new UI revision needs its own candidate and QA.

## Follow-ups

Prior unaccepted Owner appearance and standalone wheel file:// reload/history checks remain separate. Earlier full task history and deferrals are retained in Git, not silently accepted.

## Developer handoff

- Implemented only the two admitted product/test paths, with coordinator ledger. Explorer diff +40/-19; browser harness +110/-1. A–Z derives display keys from REC, refreshes its cache after supplemental loading and builds idempotent buttons. Article remains original216. Supplemental row rendering never enters MECH/KEYS/projection math, has unassigned labels and no blank strip/absent-placement opacity. Counts clearly identify2021. Focus restores to visible browse row, to search for supplemental search origin, or current view control when Article detaches a supplemental row; mapped2021 search retains original list focus.
- Typography: scoped `.is-supplemental` exclusion from the existing `.dx-ex::first-letter` drop cap. Rule number and placement-notice text stay normal-size/non-floating; original2021 prose unchanged. No fonts/tokens/source prose changed.
- Direct source check: Training rule702.149, clauses702.149a/b/c exactly match pinned source `public/rules-data.json` (2026-09-25), empty rankings. Transfer `--check --source C:/dev/mtg-deck-explorer` PASS unchanged payload4557644a977efdd3a7db122cfb8a2810eb81ea2cddfcd7b69f16174fdd0f96c3; no research.
- Baseline and final full mechanics chain PASS: source217/216, taxonomy, all53 recon assertions and fixtures, gate. No regeneration. `git diff --check`, extracted inline script and browser harness `node --check` PASS.
- Real Edge source HTTP harness `node tools/check_supplement_browser.mjs --root . --playwright C:/Users/obake/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` -> exit0, all15groups PASS. Original84 selfchecks and780 exact-name/lens checks;587 unique sorted expected keys and all587 detail openings;371 supplemental rows full opacity/no strip under W/WB/WUBR/WUBRG and computed spot; five color-set math snapshots unchanged across views and delayed load. Training mouse/Enter/Space/search/close/focus and Article fallback; cached216->587 late-load refresh; both1440/360 computed first-letter no float/normal size, exact clause text, no horizontal overflow;2021 Flying drop cap still left/>3x. Original Flash search-close focus explicitly preserved. Four failure modes, paging, conflicts and shell PASS. No application errors; only existing favicon404 resource note.
- Candidate/package binding and independent QA follow. No publication or product changes after handoff unless a recorded QA defect requires correction.

## Draft Owner review

Open updated local `http://127.0.0.1:8016/#mechanical-color-pie` after reload.
1. A–Z shows587 entries/216 from2021/371 supplemental; Article returns to216. Browse Training without search.
2. Select White: Training remains visible, labeled Supplemental/Rankings unassigned; placement counts say2021.
3. Open Training at desktop/narrow width: intact702.149a/b/c and normal “No sourced…” text; check readability. Source wording unchanged.
4. Open/close with mouse and Enter/Space; switch Article while Training is open, then close. Expect one detail surface and visible, sensible focus. Original Flash detail remains intact.

## Exact candidate and packaged development evidence

Material revision candidate `80fb23baa9a043ca2350a48004dc31bb82f99878`, base `63fc313f2ff72c7f03a542e90e5e938ebe817861`; three allowed paths,188 insertions/130 deletions (ledger reset included). Followup commits change ledger only.

`python .github/pages/package.py --rev 80fb23baa9a043ca2350a48004dc31bb82f99878 --out C:/dev/color-wheel-interactive/_site-supplement --verify` -> PASS20 exact files/four syntax-clean scripts/20 HTTP paths/17 exclusions404. Resolved output path verified before bounded replacement. Packaged Edge harness rerun -> all15groups PASS, same full developer coverage above, shell frame stamp matches material SHA. Local8016 server serves this rebuilt package. Coordinator captured and inspected Training detail at1440x1000 from actual package: rule numbers702.149a/b/c remain intact at normal scale; “No sourced” no longer has a floating capital. Screenshot is OS-temp evidence `C:/Users/obake/AppData/Local/Temp/color-pie-training-80fb23b.png`; Owner appearance judgment remains pending. No product bytes changed after commit.