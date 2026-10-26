# Active handoff — supplemental mana symbols and example inventory

## Control
- Status: `dev-in-progress`.
- Base: `1050352cc259d87c160d97a430c969dc9e08616f`; existing branch reused.
- Prior polish: Owner says looks good and confirms 2021 preservation. Coordinator closes that reviewed scope `qa-passed -> complete -> idle`; this new requested scope starts `idle -> dev-in-progress`. Publication remains on hold. Prior ledger archived in Git at base.
- Outcome: render sourced brace mana symbols in supplemental evidence, including Firebending {R}; inventory every A–Z destination for missing Example cards and deliver editable Excel for Owner picks, without adding unverified examples.
- Allowed repository files: `vox-color/mechanical-explorer.html`, `tools/check_supplement_browser.mjs`, `HANDOFF.md`.
- Allowed external artifacts: conversation workspace `outputs/example-review/` inventory JSON, analysis/builder scripts, workbook and previews; workspace node_modules junction for bundled artifact tool. Generated local package `_site-supplement/`, temporary screenshots.
- Surfaces: supplemental evidence text renderer and narrowly needed inline-symbol CSS/accessibility/fallback, focused test assertions; example coverage inventory and workbook only.
- Non-goals: any source/payload/query/frozen2021/example-data edits; selecting or researching new card examples; new requests/providers/runtime dependencies; 2021 renderer changes; inferred tiers; routes or visual redesign; publication/push/merge/deployment/hosting.

## Acceptance
1. Firebending {R} and supported sourced mana tokens render accessible inline symbols; source bytes and decoded textual meaning preserved. Unknown tokens stay literal, hostile text stays escaped, no-font fallback readable.
2. Original 2021 explanation/citation/conflict behavior remains; A–Z587, Article216 and supplemental exclusion from math unchanged.
3. All587 distinct destinations inventoried against owning examples, article citations and supplemental accepted evidence. Actual example presentation distinguished from card-specific source references; no names guessed from queries/IDs. Existing card evidence retained to avoid redundant owner work.
4. Workbook has missing-example rows, editable selected-card name/link/notes, current evidence where available, and complete coverage audit. IDs retained for future safe mapping; no workbook choices imported automatically.
5. Focused local HTTP/package checks, frozen gates and transfer integrity pass; exact committed candidate reviewed separately under QA4. Owner appearance remains Owner's judgment.

## Tests and roles
- RobDev worker owns HTML/harness; coordinator owns ledger/workbook; read-only inventory specialist audits ownership. No overlapping product edits. Available Codex models substitute unavailable prescribed Claude routes.
- Baseline and post mechanics gate chain, transfer --check; focused symbol/safety/fallback cases and preserved baseline harness; independently reconcile587 inventory keys/counts and inspect actual DOM coverage without new provider requests; workbook inspect/recalculate/export/render.
- Independent RobQA writes HANDOFF only after committed ready-for-qa.

## Decisions / limits
None pending. New card selections belong to Owner workbook input; existing accepted examples/evidence are reused as inventory evidence, not newly claimed verification.

## Developer report
- HTML +30/-5; harness +69/-4. Supplemental clauses/excerpts now render exactly the 13 token forms present in trusted evidence (55 occurrences), using existing pinned Mana font, literal fallback and descriptive accessible labels. Unknown/hostile input remains escaped. Underlying textContent and all data bytes unchanged; original2021 explanation renderer untouched.
- Source Edge harness all19groups PASS: full390 exact source text and symbol audit, Firebending red, Extort hybrid, Outlast tap, Food generic and Ravenous X; blocked-font/unknown/hostile cases; existing84 selfchecks,780 searches,587/216,focus/lens/math/failures. Syntax/diffcheck PASS. Post required4gates and transfer check PASS.
- Example inventory: 587 unique destinations,200 stored Example printings+7 legacy Example lookups+7 article citations=214 configured-card destinations. 373 need choices (371 supplemental and2 original -N/+N on Auras/spells).13 missing entries carry named source card evidence, retained as context rather than preselected picks.
- Separate inventory browser verification examined all587 destinations,200 actual storedplates,7articlecitationstubs,371supplemental noExamples. All external requests intercepted; no provider requests; no errors. Namedlookup coverage is configured, live resolution not revalidated. Inventory joins compared to owning records and renderer twice; source IDs and input hashes retained externally.
- Workbook: `C:/Users/obake/.codex/visualizations/2026/10/25/01a1751f-1749-77f3-82dc-fe73a2fd134c/outputs/example-review/mechanic-example-review.xlsx`. Need a card373 editable rows; All entries587 audit rows. Existing card evidence/category/source references/limitations retained. Amber input fields for name/link/printing/notes. Tables/filter headers and frozen headers exported; summary/status formulas tested empty -> name only -> name+link then reset blank. Artifact Tool inspect/error scan/recalculate/export and both-sheet rendered review PASS. No choices imported or new examples invented.
- Owner checklist: open local candidate, search Firebending (red symbol) and Extort (hybrid), inspect inline readability; confirm Flash original2021 and Pestermite intact. In workbook fill Your pick and Scryfall card link, optionally printing/notes; do not change entry keys. No publication.
