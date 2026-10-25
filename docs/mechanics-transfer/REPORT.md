# Mechanics evidence transfer

Accepted source revision: `6c54dbb49d6161985d104625efd5bd46f36e31d2`. Source checkout is dirty; its exact Git status is retained in the manifest and snapshot. The dirty work is unrelated to the accepted owning mechanic inputs; no source checkout file is written.

| Population | Accepted rows |
|---|---:|
| vocabulary | 296 |
| shortlist | 32 |
| variants | 20 |
| catalog-gaps | 42 |

390 accepted rows: 19 mapped to existing 2021 details, 371 separate supplemental identities, zero excluded. The 374 discovery records are enumerated separately with query hashes; they authorize no execution here.

The initial complete disposition manifest was recorded before UI implementation. Every final row retains its original key, exact accepted name, authored aliases (none supplied by these owners), category, remaining label qualifications, full resolved reference, and relevant numbered CR clauses. Reference quote and summary fields are preserved when present. No explanation is generated. Ranking arrays remain empty; no P/S/T claim is inferred. Detection patterns, query expressions and discovery recipe coverage never become runtime mechanic identity, aliases or evidence limitations. Recipe coverage is retained only in the manifest's separately labelled discovery entries.

The 18 shared identities map only on exact approved identity. Mill additionally maps to milling because the frozen target's explicit operation matches retained CR 701.17a. Both byte sources and the numbered clause are retained in mappingEvidence. Ward remains separate from cost-qualified Ward records; Treasure remains separate from treasure creation. Families and variants remain separate.

Vocabulary is reconstructed from the owning metadata audit with the owning producer's exact export format. Catalog gaps are reconstructed from GAP_SPECS, retained validation, retained sources and all six REFERENCE_UPDATES, then compared byte for byte to the generated view. Shortlist and variants are authored inputs. The original reference resolvers run against the pinned rules, with recorded cardOracleIds for card-specific references. The complete discovery catalog is loaded and validated without query execution. These are transport checks of trusted retained evidence, not renewed source research or certification.

The six narrow source reviews retain their status, source type, dates, exact accepted scope and limitations. Affinitycycling is a designer card example; Hero's Reward is archived official discussion; Actualize and Covercast are official card examples. Kinfall and Landship retain dated playtest-card provenance and not-legal Commander status, not verified general definitions. Unsupported wiki generalizations are not transferred into the runtime.

Manifest proofs bind each transport row, full reference and clause array by SHA-256 and bind 787 unique numbered clauses to retained CR source lines. 127 owning/producer/retained files are snapshotted as deterministic gzip+base64 snapshots of exact original bytes in the single development-only sources.json. Snapshot integrity is checked before reconstruction. Every snapshot raw-byte SHA-256 is also compared with its exact file at the pinned Git revision; all match. Existing retained verification is trusted, never rerun as new source research or membership certification. The manifest records every source snapshot hash and the final payload hash.

## Reproduction

- Initial transfer: `node tools/transfer_mechanics.mjs --source C:/dev/mtg-deck-explorer`
- Offline deterministic check: `node tools/transfer_mechanics.mjs --check`
- Check plus actual source/query preservation: `node tools/transfer_mechanics.mjs --check --source C:/dev/mtg-deck-explorer`

Checks return nonzero on output, snapshot, clause, mapping, source/query or protected target drift. Offline verification reconstructs a temporary copy of retained inputs, never reads the original source checkout, and cleans it afterward. With --source, the pinned revision and 3049 source/query byte hashes are verified too. All 99 target tracked files outside the admitted envelope are byte-protected in either mode.

The source snapshots, transfer manifest, tool and report are development evidence only; only data/mechanics-supplement.v1.json is runtime payload. Agent route: available Codex specialist acting under local RobDev; prescribed Claude route unavailable. No commit, push, publication or deployment is performed by this worker.

## Developer validation

- `node --check tools/transfer_mechanics.mjs` — PASS.
- `node tools/transfer_mechanics.mjs --check` — PASS; all four generated outputs reproduce byte for byte without a source checkout.
- `node tools/transfer_mechanics.mjs --check --source C:/dev/mtg-deck-explorer` — PASS; exact source revision and source/query bytes preserved.
- Focused inline Node validation in an isolated temporary target copy — PASS: clean offline baseline, changed runtime payload rejected, changed frozen target runtime rejected, changed snapshot hash rejected; each drift returns nonzero. The live source and target artifacts were untouched.
- `git diff --no-index --check -- NUL <owned-file>` for each of the five owned files — PASS; expected exit 1 for untracked differences, no whitespace defects.

This worker supplies developer transfer evidence only. The coordinator owns the combined candidate, final required mechanics gate chain, commit, separate QA handoff and Owner review.
