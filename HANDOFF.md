# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `qa-passed`.
- Task: **Story 2**, source-layer reopen under `MECHANICS-CONTRACT.md`
  reason 3 (deterministic parser defect, concrete source example). Approved
  by the Owner 2026-10-08.
- Last accepted: **Story 1**, `eaae957` (`docs/handoff-archive/story-1.md`).
- Owner: Vox Mana.
- Allowed files: `tools/parse_mechanical_pie_2021.py`;
  `data/mcp2021.abilities.json`, `mcp2021.reconciled.json`,
  `mcp2021.reconciled.raw.json`, `mcp2021.audit.md`,
  `mechanical-color-pie.runtime.json` (regenerated only, never hand-edited);
  `vox-color/mechanical-explorer.html`; `MECHANICS-CONTRACT.md` (one dated
  note); `HANDOFF.md`; `data/mcp2021.identity_rulings.json`,
  `mcp2021.identity_review.md` (D2); `tools/recon.py`, `tools/recon_stats.py`
  (ordering only), `data/recon/`, `data/recon.md` (regenerated, S2-O2).
- Allowed surfaces: the explorer's article list, the creature-sacrifice
  detail, the unmatched section and its note, and the self-check.
- Prohibited: `data/fixtures/` and goldens, `data/vox.families*.json`,
  `mcp2021.lists.json`, any recon value other than the two basis counts,
  `vox-color/color-wheel.html`, `index.html`,
  `mechanical-periodic-table.html`, every other self-check assertion.
- Base commit: `2261c9d`.
- Candidate commit: `6901f7b`.
- robqa class: **QA-4** (mechanics data). Full gate chain, then the
  separate `robqa` agent (Sonnet).

## Owner decisions

- **S2-O1.** Only the explorer self-check assertions that encode the two
  defects may change, with the counts they imply. Listed below in Step 0.
  Extended by D1 to the two `order:` assertions.
- **D1–D3 (2026-10-08).** Approved as recommended.
- **S2-O2 (2026-10-08).** Fix recon's non-deterministic ordering in this
  story, not as a follow-up. Ordering only; no recon value may change
  except both-agree 450 → 451 and list-only 6 → 5.
- **D4 (2026-10-08).** Regenerating recon against today's wheel changed
  naming values (Nephilim names dropped from 10 rows, "Chaos" on URG,
  "Orzhov" on Non-Red). Owner: keep the 2026-09-01 names; regenerate against
  the wheel as of `96ae609` (recon's original input); git keeps the prior
  files as the paper trail.

## Acceptance criteria

1. All seven "Return target … from graveyard to hand." entries carry
   `group: "Returning cards from graveyard to hand."` in
   `mcp2021.abilities.json`; no other `group` changes.
2. "Creature sacrifice, forced, repeatable" is captured as its own catalog
   entry with the article's explanation; the phantom second "-N/-N to their
   team" record is gone.
3. No tier, placement, identity count (217/216/1), merge (19), conflict
   (5), taxonomy assignment or golden result changes. Every data diff is
   one of those listed under Step 0, Measured rebuild.
4. The explorer has no `HEADING_FIX` and no `UNMATCHED_CASE` entry for
   creature sacrifice; the entry renders in article order with its
   explanation; the unmatched section holds four entries in two cases.
5. Only the assertions listed in Step 0 change; the self-check passes.
6. Full gate chain passes; `node --check` on the explorer's script.
7. `MECHANICS-CONTRACT.md` carries a dated reason-3 note.

## Implementation

### Step 0 (2026-10-08)

**How the parser reads the article.** It reads a saved copy of the
article HTML given on the command line; nothing is committed. Fetched today
with one public GET (no new access needed): 444,312 bytes, sha256
`51017283…c47bc29898`. The untouched parser on it reproduces all four
JSON outputs and the audit **byte for byte**.

**Defect 1, source.** In the article: `<hr />`, `<p><strong>Returning
cards from graveyard to hand.</strong></p>`, then `<li>` entries for card
and artifact; then **`<hr />` and `<p><strong>Return target creature from
graveyard to hand.</strong></p>`**, a top-level-entry shape; then `<li>`
entries for enchantment, instant, land, sorcery. The parser treats every
strong-only paragraph as a group header, so creature reset the group to
itself (stored as `null`) and the four after it took its name. Note: the
article's own markup gives the creature entry a top-level shape, so no
general markup rule can file it correctly. The fix is a named one-entry
exception in the parser (like the existing "Seconary"/"distruction"
handling), reported in the audit. Corroborated by the 2017 edition
(`…/mechanical-color-pie-2017-2017-06-05`): same `<hr>` + bold paragraph,
but its text starts with a literal "•", so a bullet item that lost its
list markup.

**Defect 2, source.** `<p><b>Creature sacrifice, forced,
repeatable</b><strong> (All players/opponents must sacrifice a creature each
turn.)</strong></p>`, then `Primary: Black`, then "Sometimes black likes
killing things slowly." `LEAD_STRONG` accepts only `<strong>` at the head,
so the label was not read; the tier line and explanation were filed as a
second "-N/-N to their team" under "Creature pumping, their team,
ongoing" (the explorer's one "repeat the parser recorded"). It is the only
`<b>` lead and the only multi-run lead in the catalog. Fix: accept a run of
`<strong>`/`<b>` at the head. The 2017 edition has the same entry as
"Abyss" with the same gloss, tier and sentence.

**Measured rebuild** (scratch copy, both fixes):
- `abilities.json`: 1 record relabelled (phantom → creature sacrifice,
  group `null`); 5 `group` values → "Returning cards from graveyard to
  hand." (creature from `null`, four from the creature name). 212 records.
- `reconciled.json` and `.raw.json`: creature sacrifice B `basis`
  `colour-list-only` → `both-agree`, `in_catalog` false → true. Tier still
  primary. Nothing else.
- `audit.md`: both-agree 209 → 210, list-only 6 → 5; the "-N/-N" notes say
  2 times, not 3, and one duplicate note goes. (+1 note for the defect-1
  exception once added.)
- `runtime.json`: creature sacrifice basis as above, explanation "" → the
  article's sentence. Nothing else.
- Unchanged: `lists.json`, `vox.families.json`, all 11 goldens (fixtures
  pass), 217/216/1, 19 merges, 5 conflicts. Gate chain passes.
- Recon semantics: both-agree 450 → 451, list-only 6 → 5. See D2.

**Assertions affected (explorer self-check).**
- `headings:` both (lines 2155–2157): drop the `HEADING_FIX` mapping; the
  seven-entry check reads the frozen group directly.
- `unmatched:` 2213 (comment "five" → four), 2221–2224 (creature sacrifice:
  replaced by "shows the article's explanation, verbatim"), 2225–2226
  ("five" → four; case tags 3 → 2), 2228 ("five" → four).
- `order:` 2145 (211 → 212) and 2146 (`[212, 211, 1]` → `[212, 212, 0]`):
  see D1.

### Candidate

Rebuild: `parse_mechanical_pie_2021.py <article> --out data/`,
`reconcile_identity.py`, `build_taxonomy.py` (no change), `build_runtime.py`,
`recon_stats.py` and `recon.py` with `--html` = `git show
96ae609:vox-color/color-wheel.html`. Every data diff matches Step 0, plus
the audit's `source-markup` note (D3).

- Criteria 1–2: `abilities.json` diff (5 groups, 1 relabel); runtime
  explanation recovered verbatim.
- Criterion 3: fixtures 11/11; invariants 217/216/1, 19, 5; recon
  compared order-insensitively with HEAD: only the 450/451 and 6/5 counts
  differ. Recon output identical under PYTHONHASHSEED 1, 2, 3.
- Criteria 4–5: explorer self-check **84 of 84** at 1280×800 (served
  over HTTP, cache reloaded). In a 0×0 hidden pane, HEAD and candidate both
  fail only "plates: both fold controls…" (layout; environment).
- Criterion 6: gate chain exit 0; `node --check` OK.
- Criterion 7: dated note in `MECHANICS-CONTRACT.md` §1.

Draft Owner checklist (server: `py -m http.server 8000` in the repo):
1. http://localhost:8000/vox-color/mechanical-explorer.html — footer reads
   "Self-check: 84 of 84 passed". Hard-reload first (stale cache).
2. Same page, article order: the sub-heading "Returning cards from
   graveyard to hand." holds seven entries, card through sorcery.
3. Click "Creature sacrifice, forced, repeatable": the detail shows
   "Sometimes black likes killing things slowly." It sits after "-N/-N to
   their team", not in the bottom section.
4. Bottom section: "4 entries", two cases.

## QA

Mode: separate robqa agent (Sonnet). Class: QA-4. Candidate `6901f7b` on
base `2261c9d`. Changed paths (16, incl. HANDOFF) all inside Allowed files.

- Gate chain (invariants, taxonomy, recon, gate) -> exit 0, 53 recon
  assertions hold; `fixtures.py --data data/` -> 11/11 match.
- Fresh public GET into an empty scratch dir -> 444,305 bytes, sha256
  `86d6ae35...8da1a4`. **Differs** from the recorded `51017283...` (444,312
  bytes). Compared content instead (below): the parser produces the
  candidate's data from it byte for byte, so the difference is outside what
  the parser reads (page chrome); the recorded hash is not reproducible by a
  later fetch (already a listed follow-up).
- Raw HTML, both defects confirmed: `<hr />` + `<p><strong>Return target
  creature from graveyard to hand.</strong></p>` sits between the card/artifact
  items and enchantment..sorcery items; `<p><b>Creature sacrifice, forced,
  repeatable</b><strong> (All players/opponents ...)</strong></p>`, then
  `Primary: Black`, then "Sometimes black likes killing things slowly."
  (verbatim, present).
- Reproducibility (git archive copies, `python` from copy root): base parser
  -> abilities, lists, reconciled.raw identical to `2261c9d` (LF-normalised;
  working tree is CRLF). Candidate parser + `reconcile_identity.py` +
  `build_runtime.py` -> abilities, audit, lists, reconciled, raw and runtime
  identical to `6901f7b`. (Parser alone writes pre-identity reconciled/audit;
  those match only after reconcile, as expected.)
- Criterion 1-2: abilities.json diff = 1 relabel (phantom -> creature
  sacrifice, group null) + 5 group values -> "Returning cards from graveyard
  to hand."; nothing else.
- Criterion 3: reconciled/raw/runtime diffs = the one basis
  (list-only -> both-agree, in_catalog true) and explanation. identity
  rulings loses the one creature-sacrifice "distinct" ruling; review.md counts
  move (both 192, list-only 24, merges 23 -> 19, after-rulings 212 -> 216),
  all D2-allowed. Recon JSON compared order-insensitively with base: only
  both-agree 450->451 and list-only 6->5; matrices.json identical; csv/md
  differ by row order plus those counts. `recon_stats.py --html
  <96ae609 wheel>` under PYTHONHASHSEED 1,2,3 -> identical output, and equal
  to the committed `data/recon/`. No fixture/golden/taxonomy file changed.
- Criterion 4-5: explorer diff touches only HEADING_FIX removal, the creature
  sacrifice UNMATCHED_CASE entry, the unmatched note text, and the
  `order:` (2), `headings:` (2), `unmatched:` assertions listed in Step 0; no
  other assertion. `HEADING_FIX` has no remaining references.
  `node --check` on the extracted script -> OK.
- Criterion 7: dated reason-3 note present in MECHANICS-CONTRACT.md.
- Browser self-check: **not run** (no browser tool). Server on :8000 answers
  200. Left to the Owner (item 1).

Findings:
- note: recorded article hash does not match a fresh fetch (see above);
  content-level reproduction holds.
- note: Step 0 text says D1 `order:` is "2145/2146"; matches diff. No issue.
- minor: unmatched note reads "...and "Forced sacrifice of a creature" is the
  per-color lists' name..." after "; and"-style join; wording slightly clunky
  (copy only, Owner to judge visually).

Verdict: **qa-passed** (browser self-check pending Owner).

Owner checklist: the four draft items in the Candidate section
(http://localhost:8000/vox-color/mechanical-explorer.html, hard-reload; start
`py -m http.server 8000` in the repo root first): 84 of 84 passed; seven
entries under "Returning cards from graveyard to hand."; creature sacrifice
shows "Sometimes black likes killing things slowly." after "-N/-N to their
team"; bottom section "4 entries", two cases. Also read the unmatched note
wording.

### Owner checks (2026-10-08)

Checks 1–4 passed after the browser's cached JSON was refreshed (first run
showed 79 of 84: new page, cached old `mcp2021.abilities.json`; the
existing "Stale frames" follow-up). Self-check 84 of 84; group shows 7;
creature sacrifice shows its sentence; bottom section 4 entries, 2 cases.

## Decisions needed

None open.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### Accepted minors

- **F4 (B13, D-O2).** Leaving the Mechanical Color Pie during its first load
  lets its self-test take focus in the off frame for about 8–12 ms. A fix
  would touch the protected self-test.
- **B12 (E-D1 A).** A bridge from the explorer into an already-loaded wheel
  costs two history entries; Back passes once through the prior wheel route.
  Step 0 of Gate E measured that it cannot be fixed within `src` and hash.

### From Gate E

- **Stale frames after an update (for hosting).** A browser can keep serving
  a cached instrument inside the shell's frame after the file changes; the
  shell's own hard reload does not refresh it (seen in the Owner's E2 QA).
  Before hosting, version the frame URLs or set cache headers.

### Unassigned (each needs its own story)

- **Mana-font fallback.** Without mana-font, the colorless glyph is 0 px
  wide (Gate C F1) and the wheel's mana glyphs render as boxes; the explorer
  shows letters instead.
- **`URIError`.** The wheel's `applyHash` throws on a malformed
  percent-encoded hash such as `#%E0%A4%A`.
- **Combine bounce.** With `#color=W` in the URL, pressing Combine flips
  back to Explore a frame later. It also happens on production.
- **`CLAUDE.md` read-order line counts** for `AGENTS.md`, `CONTEXT.md` and
  `MECHANICS-CONTRACT.md` drift by a few lines after Story 1 (story-1.md).
- **`MECHANICS-CONTRACT.md` "Nothing past step 2.5 has started."** is stale
  (steps 3–5 and 7 are done); not a preview statement, so not Story 1.
- **Stale docs.**
  - `CONTEXT.md` understates the C16 caution and dates "Absence" 10 May
    (Wizards prints May 13, 2013).
  - N3: an unwrapped line in `AGENTS.md`.
- **`tools/gate.py` has no entry point.** It exits 0 having checked
  nothing; the real gates run inside `check_taxonomy.py` and
  `check_recon.py`.
- **Recon names vs today's wheel (Story 2, D4).** Regenerating recon
  against the current `color-wheel.html` drops the Nephilim and community
  names from 10 rows, puts the C16 lens "Chaos" on URG and "Orzhov" on
  Non-Red. Recon is pinned to `96ae609`'s wheel until this is resolved.
- **No regression test for the Story 2 defects.** `check_invariants.py`
  could assert the seven-entry group and the creature-sacrifice explanation.
- **Article input not archived.** Only its sha256 is recorded (copyright);
  a future fetch may differ.
- **Small UI items.**
  - A doubled period in an entry's accessible name ("…with flying..").
  - The explorer's 1.5 px focus outline renders at 1 px at 1x.
  - The hard-coded `.panel` max-height.
  - Re-add `scrollbar-gutter:stable` to the wheel.
  - A headless-only scroll after the explorer loads; check it in a headed
    browser.
- **Housekeeping.**
  - **GitHub default branch (after Story 2, Owner 2026-10-08).** Set it to
    `master` in the repo settings; `origin/main` holds only an unrelated
    README commit. Then `git remote set-head origin -a`.
  - Rename `ALIASES` and the shard `aka` field.
  - Commit or gitignore `docs/DATA-DOSSIER.html`.
  - **Periodic table: keep as-is (Owner, 2026-10-08).**
    `vox-color/mechanical-periodic-table.html` stays in place and unchanged,
    preserved for possible future work on its look and feel. The earlier
    idea to move it to a prototypes folder and restyle it is dropped.
    Record Three.js in `CONTEXT.md` only if it is ever taken into the
    product.
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
