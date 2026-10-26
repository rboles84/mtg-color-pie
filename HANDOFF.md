# Active handoff — supplemental reference text polish

## Control

- Status: `qa-passed` (`ready-for-qa -> qa-passed`), independent QA on material candidate `4e8c34df51e92392ccdc148bb2a5bba4f1fe3496`.
- Base: `e28eb7986554e542ff12d5686287b4c58b98a213`; branch `codex/supplemental-mechanic-search` reused.
- Prior engineering phase disposition: coordinator `qa-passed -> complete -> idle` administratively closes superseded A–Z presentation scope, NOT Owner appearance acceptance. Full record archived in Git at base:HANDOFF.md. New requested polish starts `idle -> dev-in-progress`.
- Owner requests less crowded Attach/Bargain details, no end-user hashes/internal metadata, less repeated/backend text. Existing no-publication instruction persists.
- Exact allowed files: `vox-color/mechanical-explorer.html`, `tools/check_supplement_browser.mjs`, `HANDOFF.md`.
- Surfaces: supplemental detail/evidence presentation and related CSS; concise player-facing headings, unassigned-ranking note, citations and meaningful qualification/status display; existing footer attribution corrected to distinguish2021/supplemental; focused browser assertions and ledger. Underlying transport remains complete and unchanged; hide internal metadata in presentation rather than remove audit evidence.
- Non-goals: source/payload/manifest/snapshot/query edits, generated mechanic explanations, source research, inferred rankings, changing2021 explanations/placements/conflicts/math, A–Z587/Article216 behavior, new detail surface, routes/dependencies/fonts/tokens redesign, publishing/push/merge/deployment/hosting.
- QA: separate QA-4 due sourced evidence/qualification presentation, exact committed candidate. Available Codex fallback for unavailable Claude routes.
- Only generated artifacts: existing `_site-supplement/` package and OS-temp screenshots.

## Acceptance criteria

1. Attach/Bargain and all supplemental references use readable paragraphs with visible separation, intact numbered verbatim clauses and no decorative first letters. No mechanic summaries or new claims.
2. One name/category presentation, concise ranking status, meaningful Rules/reference headings, one human-readable source link with date/title/attribution rather than raw URL duplication. No repeated accepted population, source/provider category arrays, direct-rule-number heading, SHA/hash/internal IDs, transport provenance/metadata labels in end-user DOM.
3. Preserve player-relevant narrow scope, verified/unverified definition status, exact accepted excerpts, digital/playtest/preview/card-specific qualifications, dates and actual publisher attribution; do not promote narrow evidence to universal definitions. Unknown P/S/T remains explicit, never absence/colorless. Existing mapped2021 evidence stays separately attributed.
4. Keep every source/payload byte unchanged and audit metadata accessible in existing development artifacts. No dynamic raw object dumping into UI; exact source text safely escaped and existing link validation preserved. Correct footer's currently universal Rosewater attribution so it applies only to2021.
5. A–Z587/Article216, original84 selfchecks,780 search checks, one detail/focus/lens/failure behavior remain. Focused visible-content checks for Attach/Bargain and representative narrow-source records; typography/readability at desktop/narrow widths. Package20files/17exclusions; source transfer and required mechanics gate chain pass. Owner judges appearance.
6. Committed local review candidate with independent QA and short checklist. No publication.

## Validation plan

Use existing browser harness; extend to check visible content, exact clauses/excerpts, hidden technical fields, citation links, scopes and paragraph separation. Keep existing tests; update only intentional interface-label expectations. Transfer --check --source and required mechanics gates preserve data. Real Edge over source and packaged HTTP, targeted screenshots of Attach/Bargain plus representative narrow scopes. No unrelated regression/research.

## Decisions needed

None. Owner explicitly authorized this UI metadata/text polish. Meaningful source limitations remain visible; hashes and IDs remain in unchanged data/audit files, not the player detail.

## Implementation / QA

Local product candidate: `4e8c34df51e92392ccdc148bb2a5bba4f1fe3496`, base `e28eb7986554e542ff12d5686287b4c58b98a213`. Product edits stopped. Independent QA-4 result is recorded below; Owner acceptance remains pending.

## Carried follow-ups

Prior Owner appearance and standalone wheel file:// checks remain unaccepted; old deferrals preserved in Git.

## Developer evidence

- HTML: +72/-55; browser harness: +75/-1. Explicit presentation replaces raw metadata traversal; rules use unchanged verbatim clauses with paragraph gaps and subdued complete rule numbers. Titles/categories appear once, citations are dated and deduplicated, meaningful source scope stays visible. Footer confines Rosewater attribution to 2021.
- Source Edge HTTP harness: PASS all 17 groups, including 390-record text/scope/link audit, 780 exact searches, 84 original selfchecks, A–Z 587 / Article 216, focus/lens/math/failure behavior. Attach/Bargain desktop and narrow checks pass; screenshots manually inspected after animation settled.
- Post-change check_invariants.py, check_taxonomy.py, check_recon.py (53 assertions), gate.py: PASS. Transfer --check --source C:/dev/mtg-deck-explorer: PASS; unchanged payload SHA256 4557644a977efdd3a7db122cfb8a2810eb81ea2cddfcd7b69f16174fdd0f96c3. Syntax and diff whitespace pass.
- Audit data, source text, qualifications, frozen 2021 and source/query files unchanged. No research or publication.
- Draft Owner checklist: open local review; inspect Attach and Bargain paragraph spacing at normal/narrow width, concise headings and single dated citation; inspect Kinfall for retained narrow scope; open Flash for original 2021 detail plus separate supplemental evidence. Appearance remains Owner-pending.

- Exact-candidate package: PASS, 20 byte-identical files, 4 clean inline scripts, 20 HTTP200 /17 excluded404; full candidate revision stamped. Packaged real Edge harness PASS all17groups, including 390 evidence checks,780 searches,84 selfchecks; no application console errors. Local URL http://127.0.0.1:8016/?review=4e8c34d#mechanical-color-pie.

## Independent RobQA — supplemental text polish, 2026-10-25

- Mode: separate agent, QA-4 source-evidence presentation. Prescribed Claude Sonnet unavailable; Codex Sol medium fallback. Exact product candidate `4e8c34df51e92392ccdc148bb2a5bba4f1fe3496` over `e28eb7986554e542ff12d5686287b4c58b98a213`; HEAD `d8fd67ec86cfaecba23423ee39648f09ea02c0c7` was ledger-only follow-up before QA. Verdict: **`qa-passed`**. No blocker, major, or acceptance-violating minor finding. QA wrote only `HANDOFF.md`; no product/tool/data/source edit, commit, provider query, new research, remote operation, hosting or publication.
- Candidate diff/scope: `git diff --stat`, `--name-only` and `--check base..candidate` -> exactly three allowed paths (`HANDOFF.md`, `vox-color/mechanical-explorer.html`, `tools/check_supplement_browser.mjs`), 175 insertions/113 deletions, no whitespace errors. Explorer +72/-55 and harness +75/-1; the rest is ledger. I inspected the changed explicit evidence selection, citation/date deduplication, CSS spacing, ranking/scope headings, footer attribution and focused browser assertions. The pre-QA worktree had only untracked generated `_site-supplement/`.
- Total branch accounting, distinct from this candidate: `git diff --stat 2ca9ad6f61ca047470518126ee69da718acf76fa..HEAD` -> nine paths, 40,458 insertions/428 deletions before this QA ledger edit. These include the unchanged transferred payload, transfer tool and evidence from earlier admitted phases; this polish candidate changes only its three named paths.
- `node tools/transfer_mechanics.mjs --check --source C:/dev/mtg-deck-explorer` -> exit 0: 296+32+20+42=390 records, 19 mapped/371 supplemental, zero excluded, 374 separate discovery records, 787 clauses, unchanged payload SHA-256 `4557644a977efdd3a7db122cfb8a2810eb81ea2cddfcd7b69f16174fdd0f96c3`. Pinned source and protected target bytes passed; existing audit metadata remains in development artifacts. No source research or live query was rerun.
- Frozen mechanics chain: `python tools/check_invariants.py` -> exit 0, 217 source identities/216 projections; `python tools/check_taxonomy.py` -> exit 0, pilot30/216 and zero miscellaneous; `python tools/check_recon.py` -> exit 0, all53 assertions with fixtures; `python tools/gate.py` -> exit 0, source and taxonomy PASS. Original 2021 placements, math and conflict data stayed frozen.
- Resolved the absolute package target to exactly `C:\dev\color-wheel-interactive\_site-supplement` before bounded replacement. `python .github/pages/package.py --rev 4e8c34df51e92392ccdc148bb2a5bba4f1fe3496 --out C:/dev/color-wheel-interactive/_site-supplement --verify` -> exit 0: 20 byte-identical files, four syntax-clean inline scripts, 20 expected HTTP paths 200, 17 development exclusions 404, shell stamped with full material candidate SHA.
- `node tools/check_supplement_browser.mjs --root _site-supplement --playwright C:/Users/obake/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` -> exit 0 in real Edge over local HTTP, all17 groups PASS. Original84/84 selfchecks and780/780 accepted-name/lens searches; A–Z587 unique destinations, Article216, 371 supplemental rows outside 2021 ranking math, all previously exercised focus/view/lens/late-load and four unavailable modes. Across all390 records, exact numbered clauses and accepted excerpts appeared in the visible evidence DOM, each retained review scope/limit and source title/section appeared, citations had no canonical duplicates, and no hash/ID/raw URL/backend metadata labels leaked. Attach/Bargain clauses had distinct paragraph gaps, normal first letters and one dated Rules link at desktop and360px; there was no horizontal overflow. Representative designer/archive/playtest/digital/card-specific records retained publisher/date and explicit narrow limitations. Mapped Flash preserved its five 2021 rows plus separately attributed supplemental evidence; original conflict presentation remained. Footer limits Rosewater attribution to 2021. Application page/console errors `[]`; only the existing `/favicon.ico` 404 resource note. Packaged shell frame used `?v=4e8c34df51e92392ccdc148bb2a5bba4f1fe3496`.
- Extra focused Edge probe beyond the harness: intercepted Kinfall scope text containing an HTML event-handler string rendered as literal text, created no image, executed no handler and retained one scope section. This directly checked escaping in the rewritten renderer.
- Owner checklist at `http://127.0.0.1:8016/?review=4e8c34d#mechanical-color-pie`: (1) inspect Attach and Bargain at preferred desktop and narrow phone widths for paragraph rhythm and readable rule numbers; (2) check concise headings, unassigned rankings and single dated citations; (3) inspect Kinfall/Landship, Affinitycycling, Hero's Reward, Actualize/Covercast and Jump for clear scope and limitations; (4) open Flash to confirm original 2021 detail and separate supplemental evidence; (5) judge overall appearance and the earlier outstanding standalone wheel `file://` reload/history separately. Objective QA does not imply Owner visual acceptance.
