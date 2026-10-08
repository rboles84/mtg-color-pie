# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `idle`.
- Last accepted: **Story 2** (source-layer reopen, reason 3), `6901f7b`,
  accepted by the Owner 2026-10-08. Ledger:
  `docs/handoff-archive/story-2.md`. Earlier: `story-1.md`, `gate-e.md`,
  `gate-d.md`, `gate-c.md`; Gates A and B are in git at `5252333` and
  `b62131b`.
- Next: **Story 3**, the exception-panel copy (see Follow-ups). Approved;
  start it in a fresh session.
- Owner:
- Allowed files:
- Allowed surfaces:
- Prohibited:
- Base commit:
- Candidate commit:
- robqa class (see `.claude/skills/robqa/SKILL.md`):

## Owner decisions

## Acceptance criteria

## Implementation

## QA

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

### Story 3, approved (Owner, 2026-10-08): truthful exception panel

Start it in a fresh session. Copy and links only, in
`vox-color/mechanical-explorer.html`: the bottom section now headed "No
matching explanation in the frozen data". No data, Color Wheel or shell
change; no other Mechanical Color Pie content changes.
- **Facts (verified against the Wizards pages, 2026-10-08).**
  - 2017 edition explains `-N/+N (on spells)` (White), `-N/+N (on Auras)`
    (White) and `-N/-0 (on creatures)` (Blue).
  - The 2021 Changes article, under "CHANGE TEXT, STATUS, & REMOVE SOME
    SUBSECTIONS: Creature pumping", has all three in OLD and none in NEW, and
    gives **no reason** for dropping them. Its "just don't get used any more"
    sentence belongs to four *other* REMOVE SUBSECTION items (`+0/+N to your
    team` x2, `-0/-N to their team` x2). Do not attribute it to these three.
  - All three are still in the 2021 per-color lists, so they are not
    "legacy". "Forced sacrifice of a creature" is in 2021's Black list and is
    explained as "Sacrifice a creature." under "Forced sacrifice".
- **Agreed copy.**
  - Heading: "Not explained under these names in 2021".
  - Intro: These four entries are in the 2021 per-color lists but have no
    2021 explanation under the same name. Three were explained in the 2017
    edition; the 2021 Changes article removed those explanations without
    giving a reason. "Forced sacrifice of a creature" is explained in 2021 as
    "Sacrifice a creature." under "Forced sacrifice."
  - Tag for the three: "Explained in 2017; explanation dropped in 2021".
  - Tag for forced sacrifice: "Explained in 2021 under “Forced sacrifice”".
  - The detail panel's per-entry note and text for these entries must agree.
- **Sources (official Wizards only).**
  - https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2017-2017-06-05
  - https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021
  - https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021-changes
- **S3-O1.** The self-check assertions that encode the current wording may
  change (the three "gives no explanation" / "per-color lists" checks and
  the tag-label checks); list each in Step 0 before editing. No other.
- **QA:** same-agent QA-2/QA-3; Owner checks visuals.

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
